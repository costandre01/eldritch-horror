import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { drawEncounter } from "./drawEncounter";
import { drawExpeditionEncounter } from "./drawExpeditionEncounter";
import { drawMythos } from "./drawMythos";
import { resolveEncounterChoice } from "./resolveEncounterChoice";
import { resolveEncounterEffects } from "./resolveEncounterEffects";
import { resolveCurrentEncounter } from "./resolveCurrentEncounter";

import { easyMythos } from "../../content/core/mythos/easyMythos";
import { normalMythos } from "../../content/core/mythos/normalMythos";
import { hardMythos } from "../../content/core/mythos/hardMythos";

import { resolveByakheeDefeat } from "./resolveByakheeDefeat";
import { endInvestigatorEncounter } from "./endInvestigatorEncounter";

import { gainCondition } from "./gainCondition";
import { solveMythosRumor } from "./solveMythosRumor";
import { getLeadInvestigatorId } from "./getLeadInvestigatorId";
import { resolveMythosSpecial } from "./resolveMythosSpecial";

export function resolveGameFlowChoice(
  game: GameState,
  choiceId: string,
  map: MapDefinition,
): GameState {
  const decision =
    game.pendingDecision;

  if (
    !decision ||
    decision.type !== "choice"
  ) {
    return game;
  }

  /*
  * ============================================================
  * A PROPOSITION
  * ============================================================
  */

  if (
    decision.source ===
    "mythos:a-proposition-dark-pact"
  ) {
    const leadInvestigatorId =
      getLeadInvestigatorId(game);

    if (!leadInvestigatorId) {
      return game;
    }

    /*
    * DECLINE
    */

    if (
      choiceId ===
      "decline-dark-pact"
    ) {
      const currentMythosId =
        game.currentMythosId;

      if (!currentMythosId) {
        return {
          ...game,
          pendingDecision: null,
        };
      }

      const mythos =
        [
          ...easyMythos,
          ...normalMythos,
          ...hardMythos,
        ].find(
          (definition) =>
            definition.id ===
            currentMythosId,
        );

      if (!mythos) {
        return game;
      }

      return {
        ...game,

        board: {
          ...game.board,

          mythosDiscard: [
            ...game.board.mythosDiscard,
            mythos,
          ],
        },

        currentMythosId: null,

        pendingDecision: null,
      };
    }

    /*
    * GAIN DARK PACT
    */

    if (
      choiceId ===
      "gain-dark-pact"
    ) {
      const leadInvestigatorId =
        getLeadInvestigatorId(game);

      if (!leadInvestigatorId) {
        return game;
      }

      /*
       * Give Dark Pact to the Lead Investigator.
       */

      const gameWithDarkPact =
        gainCondition(
          game,
          leadInvestigatorId,
          "condition-dark-pact",
        );

      const investigatorAfterDarkPact =
        gameWithDarkPact.investigators[
          leadInvestigatorId
        ];

      if (
        !investigatorAfterDarkPact
      ) {
        return game;
      }

      const gainedDarkPact =
        investigatorAfterDarkPact.conditionIds
          .some((conditionId) => {
            return (
              game.conditions[
                conditionId
              ]?.definitionId ===
              "condition-dark-pact"
            );
          });

      if (!gainedDarkPact) {
        return {
          ...gameWithDarkPact,

          pendingDecision:
            null,
        };
      }

      /*
       * Find Rumors currently in play.
       */

      const rumorIds =
        gameWithDarkPact.board.mythosInPlay
          .filter((entry) => {
            const mythos =
              [
                ...easyMythos,
                ...normalMythos,
                ...hardMythos,
              ].find(
                (definition) =>
                  definition.id ===
                  entry.definitionId,
              );

            return (
              mythos?.type ===
              "rumor"
            );
          })
          .map(
            (entry) =>
              entry.definitionId,
          );

      /*
       * Dark Pact was gained, but if there
       * is no Rumor there is nothing else
       * to choose.
       */

      if (rumorIds.length === 0) {
        return {
          ...gameWithDarkPact,

          pendingDecision:
            null,
        };
      }

      /*
       * Choose 1 Rumor to solve.
       */

      return {
        ...gameWithDarkPact,

        pendingDecision: {
          type: "choice",

          title:
            "Choose a Rumor",

          message:
            "Choose 1 Rumor Mythos to solve.",

          options:
            rumorIds.map(
              (rumorId) => {
                const rumor =
                  [
                    ...easyMythos,
                    ...normalMythos,
                    ...hardMythos,
                  ].find(
                    (definition) =>
                      definition.id ===
                      rumorId,
                  );

                return {
                  id: rumorId,

                  title:
                    rumor?.name ??
                    rumorId,

                  description:
                    rumor?.text,

                  image:
                    rumor?.image,
                };
              },
            ),

          source:
            "mythos:a-proposition-select-rumor",
        },
      };
    }

    return game;
  }

  /*
  * ============================================================
  * A PROPOSITION — SELECT RUMOR
  * ============================================================
  */

  if (
    decision.source ===
    "mythos:a-proposition-select-rumor"
  ) {
    const selectedRumorId =
      choiceId;

    const rumor =
      [
        ...easyMythos,
        ...normalMythos,
        ...hardMythos,
      ].find(
        (definition) =>
          definition.id ===
          selectedRumorId &&
          definition.type === "rumor",
      );

    if (!rumor) {
      return game;
    }

    /*
    * Solve the selected Rumor.
    */

    const solvedGame =
      solveMythosRumor(
        game,
        rumor,
      );

    /*
    * A Proposition is an Event Mythos,
    * so discard it after resolving its effect.
    */

    const currentMythosId =
      solvedGame.currentMythosId;

    if (!currentMythosId) {
      return {
        ...solvedGame,
        pendingDecision: null,
      };
    }

    const currentMythos =
      [
        ...easyMythos,
        ...normalMythos,
        ...hardMythos,
      ].find(
        (definition) =>
          definition.id ===
          currentMythosId,
      );

    if (!currentMythos) {
      return {
        ...solvedGame,
        pendingDecision: null,
      };
    }

    return {
      ...solvedGame,

      board: {
        ...solvedGame.board,

        mythosDiscard: [
          ...solvedGame.board.mythosDiscard,
          currentMythos,
        ],
      },

      currentMythosId:
        null,

      pendingDecision:
        null,
    };
  }

  /*
  * ============================================================
  * EVERYONE HAS A PRICE
  * ============================================================
  */

  if (
    decision.source?.startsWith(
      "mythos:everyone-has-a-price:",
    ) &&
    !decision.source?.startsWith(
      "mythos:everyone-has-a-price-discard:",
    )
  ) {
    const sourceParts =
      decision.source.split(":");

    const investigatorId =
      sourceParts[2];

    const investigator =
      investigatorId
        ? game.investigators[investigatorId]
        : undefined;

    if (
      !investigator ||
      !investigatorId
    ) {
      return game;
    }

    const currentIndex =
      Number(sourceParts[3] ?? "0");

    /*
    * ==========================================================
    * DECLINE DEBT
    * ==========================================================
    */

    if (
      choiceId ===
      `decline-debt:${investigatorId}`
    ) {
      const nextIndex =
        currentIndex + 1;

      const nextInvestigatorId =
        game.investigatorOrder[
          nextIndex
        ];

      if (!nextInvestigatorId) {
        return {
          ...game,
          pendingDecision: null,
        };
      }

      return {
        ...game,

        pendingDecision: {
          type: "choice",

          title:
            "Everyone Has a Price",

          message:
            "May this Investigator gain a Debt Condition to discard 1 Condition?",

          options: [
            {
              id:
                `gain-debt:${nextInvestigatorId}`,

              title:
                "Gain Debt",

              description:
                "Gain a Debt Condition and discard 1 Condition.",
            },

            {
              id:
                `decline-debt:${nextInvestigatorId}`,

              title:
                "Do Not Gain Debt",

              description:
                "Do not gain a Debt Condition.",
            },
          ],

          source:
            `mythos:everyone-has-a-price:${nextInvestigatorId}:${nextIndex}`,
        },
      };
    }

    /*
    * ==========================================================
    * GAIN DEBT
    * ==========================================================
    */

    if (
      choiceId ===
      `gain-debt:${investigatorId}`
    ) {
      /*
      * This investigator must have a Condition
      * to discard.
      */

      if (
        investigator.conditionIds.length === 0
      ) {
        const nextIndex =
          currentIndex + 1;

        const nextInvestigatorId =
          game.investigatorOrder[
            nextIndex
          ];

        if (!nextInvestigatorId) {
          return {
            ...game,
            pendingDecision: null,
          };
        }

        return {
          ...game,

          pendingDecision: {
            type: "choice",

            title:
              "Everyone Has a Price",

            message:
              "May this Investigator gain a Debt Condition to discard 1 Condition?",

            options: [
              {
                id:
                  `gain-debt:${nextInvestigatorId}`,

                title:
                  "Gain Debt",

                description:
                  "Gain a Debt Condition and discard 1 Condition.",
              },

              {
                id:
                  `decline-debt:${nextInvestigatorId}`,

                title:
                  "Do Not Gain Debt",

                description:
                  "Do not gain a Debt Condition.",
              },
            ],

            source:
              `mythos:everyone-has-a-price:${nextInvestigatorId}:${nextIndex}`,
          },
        };
      }

      /*
      * ==========================================================
      * GAIN DEBT CONDITION
      * ==========================================================
      */

      const gameWithDebt =
        gainCondition(
          game,
          investigatorId,
          "condition-debt",
        );

      const investigatorWithDebt =
        gameWithDebt.investigators[
          investigatorId
        ];

      if (
        !investigatorWithDebt
      ) {
        return game;
      }

      /*
      * Check that the Debt Condition was
      * actually drawn and assigned.
      */

      const gainedDebt =
        investigatorWithDebt.conditionIds
          .some(
            (conditionId) =>
              gameWithDebt.conditions[
                conditionId
              ]?.definitionId ===
              "condition-debt",
          );

      if (!gainedDebt) {
        return {
          ...gameWithDebt,

          pendingDecision: null,
        };
      }

      /*
      * ==========================================================
      * CHOOSE CONDITION TO DISCARD
      * ==========================================================
      */

      return {
        ...gameWithDebt,

        pendingDecision: {
          type: "choice",

          title:
            "Choose a Condition",

          message:
            "Choose 1 Condition to discard.",

          options:
            investigatorWithDebt.conditionIds
              .filter(
                (conditionId) =>
                  conditionId !==
                  investigatorWithDebt
                    .conditionIds[
                    investigatorWithDebt
                      .conditionIds
                      .length - 1
                  ],
              )
              .map(
                (conditionId) => {
                  const condition =
                    gameWithDebt.conditions[
                      conditionId
                    ];

                  return {
                    id:
                      `discard-condition:${investigatorId}:${conditionId}`,

                    title:
                      condition?.definitionId ??
                      conditionId,

                    description:
                      "Discard this Condition.",
                  };
                },
              ),

          source:
            `mythos:everyone-has-a-price-discard:${investigatorId}:${currentIndex}`,
        },
      };
    }

    /*
    * ==========================================================
    * DISCARD CONDITION
    * ==========================================================
    */

    if (
      decision.source?.startsWith(
        "mythos:everyone-has-a-price-discard:",
      )
    ) {
      const selectedConditionId =
        choiceId.split(":")[2];

      if (
        !selectedConditionId ||
        !investigator.conditionIds.includes(
          selectedConditionId,
        )
      ) {
        return game;
      }

      const updatedInvestigator = {
        ...investigator,

        conditionIds:
          investigator.conditionIds.filter(
            (id) =>
              id !== selectedConditionId,
          ),
      };

      const updatedGame: GameState = {
        ...game,

        investigators: {
          ...game.investigators,

          [investigatorId]:
            updatedInvestigator,
        },

        board: {
          ...game.board,

          conditionDiscard: [
            ...game.board.conditionDiscard,
            selectedConditionId,
          ],
        },

        pendingDecision: null,
      };

      /*
      * Continue with the next investigator.
      */

      const nextIndex =
        currentIndex + 1;

      const nextInvestigatorId =
        game.investigatorOrder[
          nextIndex
        ];

      if (!nextInvestigatorId) {
        return updatedGame;
      }

      return {
        ...updatedGame,

        pendingDecision: {
          type: "choice",

          title:
            "Everyone Has a Price",

          message:
            "May this Investigator gain a Debt Condition to discard 1 Condition?",

          options: [
            {
              id:
                `gain-debt:${nextInvestigatorId}`,

              title:
                "Gain Debt",

              description:
                "Gain a Debt Condition and discard 1 Condition.",
            },

            {
              id:
                `decline-debt:${nextInvestigatorId}`,

              title:
                "Do Not Gain Debt",

              description:
                "Do not gain a Debt Condition.",
            },
          ],

          source:
            `mythos:everyone-has-a-price:${nextInvestigatorId}:${nextIndex}`,
        },
      };
    }
  }

  /*
  * ============================================================
  * BYAKHEE DEFEAT
  * ============================================================
  *
  * After defeating a Byakhee, the investigator may either:
  *
  * - resolve the normal additional encounter
  * - lose 1 Sanity and move up to 3 spaces
  */

  if (
    decision.source?.startsWith(
      "byakhee-defeat:",
    )
  ) {
    return resolveByakheeDefeat(
      game,
      map,
      choiceId,
    );
  }

  /*
  * ============================================================
  * BYAKHEE MOVE CHOICE
  * ============================================================
  *
  * After each Byakhee movement, the investigator may:
  *
  * - move again
  * - stop the movement
  *
  * Maximum: 3 spaces total.
  */

  if (
    decision.source?.startsWith(
      "byakhee-move-choice:",
    )
  ) {
    const moveNumber =
      Number(
        decision.source.split(":")[1] ??
          "1",
      );

    if (
      !Number.isInteger(moveNumber) ||
      moveNumber < 1 ||
      moveNumber >= 3
    ) {
      return game;
    }

    const investigatorId =
      game.activeInvestigatorId;

    if (!investigatorId) {
      return game;
    }

    const investigator =
      game.investigators[
        investigatorId
      ];

    if (!investigator) {
      return game;
    }

    /*
    * STOP
    *
    * The Byakhee effect ends and the investigator's
    * Encounter turn is finished.
    */

    if (choiceId === "stop") {
      return endInvestigatorEncounter({
        ...game,
        pendingDecision: null,
      });
    }

    /*
    * MOVE AGAIN
    */

    if (choiceId !== "move") {
      return game;
    }

    if (!investigator.spaceId) {
      return game;
    }

    const currentSpace =
      map.spaces.find(
        (space) =>
          space.id ===
          investigator.spaceId,
      );

    if (!currentSpace) {
      throw new Error(
        `Current space "${investigator.spaceId}" does not exist.`,
      );
    }

    return {
      ...game,

      pendingDecision: {
        type: "select-space",

        title:
          "BYAKHEE — MOVE",

        message:
          `Choose a space to move to (${3 - moveNumber} movement${3 - moveNumber === 1 ? "" : "s"} remaining).`,

        spaceIds:
          currentSpace.paths.map(
            (path) =>
              path.toSpaceId,
          ),

        onSpaceSelected: [],

        source:
          `byakhee-move:${moveNumber + 1}`,
      },
    };
  }

  /*
   * ============================================================
   * ENCOUNTER DECK SELECTION
   * ============================================================
   *
   * The player chooses which physical Encounter deck
   * to use.
   */

  if (
    decision.source?.startsWith(
      "encounter-selection:",
    )
  ) {
    /*
    * ==========================================================
    * FRACTURED REALITY — ANCIENT PORTAL
    * ==========================================================
    */

    if (
      choiceId ===
      "fractured-reality-encounter"
    ) {
      const fracturedReality =
        [
          ...easyMythos,
          ...normalMythos,
          ...hardMythos,
        ].find(
          (definition) =>
            definition.id ===
              "fractured-reality" &&
            definition.type === "rumor",
        );

      if (!fracturedReality) {
        return game;
      }

      const isFracturedRealityInPlay =
        game.board.mythosInPlay.some(
          (entry) =>
            entry.definitionId ===
            "fractured-reality",
        );

      if (!isFracturedRealityInPlay) {
        return game;
      }

      return resolveMythosSpecial(
        game,
        fracturedReality,
        "fractured-reality-encounter",
        map,
      );
    }

    /*
    * ==========================================================
    * GROWING MADNESS — UNCHARTED ISLE
    * ==========================================================
    */

    if (
      choiceId ===
      "growing-madness-encounter"
    ) {
      const growingMadness =
        [
          ...easyMythos,
          ...normalMythos,
          ...hardMythos,
        ].find(
          (definition) =>
            definition.id ===
              "growing-madness" &&
            definition.type === "rumor",
        );

      if (!growingMadness) {
        return game;
      }

      const isGrowingMadnessInPlay =
        game.board.mythosInPlay.some(
          (entry) =>
            entry.definitionId ===
            "growing-madness",
        );

      if (!isGrowingMadnessInPlay) {
        return game;
      }

      return resolveMythosSpecial(
        game,
        growingMadness,
        "growing-madness-encounter",
        map,
      );
    }
    
    const deckType =
      choiceId as Parameters<
        typeof drawEncounter
      >[1];

    const investigatorId =
      game.activeInvestigatorId;

    if (!investigatorId) {
      throw new Error(
        "There is no active investigator.",
      );
    }

    const investigator =
      game.investigators[
        investigatorId
      ];

    if (!investigator) {
      throw new Error(
        `Investigator "${investigatorId}" does not exist.`,
      );
    }

    if (!investigator.spaceId) {
      throw new Error(
        "Investigator has no current space.",
      );
    }

    /*
     * ==========================================================
     * FIND CURRENT SPACE
     * ==========================================================
     */

    const currentSpace =
      map.spaces.find(
        (space) =>
          space.id ===
          investigator.spaceId,
      );

    if (!currentSpace) {
      throw new Error(
        "Current investigator space could not be found.",
      );
    }

    /*
     * ==========================================================
     * DRAW ENCOUNTER
     * ==========================================================
     */

    const drawnEncounter =
      deckType === "expedition"
        ? drawExpeditionEncounter(
            game,
            currentSpace.name,
          )
        : drawEncounter(
            game,
            deckType,
          );

    /*
     * ==========================================================
     * ADVANCED ENCOUNTERS
     * ==========================================================
     *
     * Special, Other World and Expedition encounters
     * use the effects-based format.
     */

    const isAdvancedEncounter =
      deckType === "special" ||
      deckType === "other-world" ||
      deckType === "expedition";

    if (isAdvancedEncounter) {
      const revealedGame: GameState = {
        ...drawnEncounter.game,

        currentEncounterRevealed:
          true,

        pendingDecision:
          null,
      };

      return resolveCurrentEncounter(
        revealedGame,
        map,
      );
    }

    /*
     * ==========================================================
     * NORMAL ENCOUNTER
     * ==========================================================
     *
     * Normal Encounter cards also immediately continue
     * to their resolution.
     */

    const revealedGame: GameState = {
      ...drawnEncounter.game,

      currentEncounterRevealed:
        true,

      pendingDecision:
        null,
    };

    return resolveCurrentEncounter(
      revealedGame,
      map,
    );
  }

  /*
   * ============================================================
   * MYTHOS DECK SELECTION
   * ============================================================
   */

  if (
    decision.source ===
      "mythos-selection" &&
    choiceId === "draw-mythos"
  ) {
    const drawnGame =
      drawMythos(game);

    const mythosId =
      drawnGame.currentMythosId;

    if (!mythosId) {
      throw new Error(
        "Mythos card was drawn but no current Mythos was set.",
      );
    }

    /*
     * ==========================================================
     * FIND MYTHOS DEFINITION
     * ==========================================================
     */

    const mythos =
      [
        ...easyMythos,
        ...normalMythos,
        ...hardMythos,
      ].find(
        (definition) =>
          definition.id ===
          mythosId,
      );

    if (!mythos) {
      throw new Error(
        `Mythos "${mythosId}" does not exist.`,
      );
    }

    /*
     * ==========================================================
     * SHOW MYTHOS CARD
     * ==========================================================
     */

    return {
      ...drawnGame,

      pendingDecision: {
        type: "continue",

        title:
          mythos.name,

        message:
          mythos.text,

        image:
          mythos.image,

        source:
          "mythos-card:0",
      },
    };
  }

  /*
   * ============================================================
   * IMPROVE SKILL
   * ============================================================
   */

  if (
    decision.source?.startsWith(
      "improve-skill:",
    )
  ) {
    const validSkills = [
      "strength",
      "influence",
      "will",
      "lore",
      "observation",
    ] as const;

    if (
      !validSkills.includes(
        choiceId as (typeof validSkills)[number],
      )
    ) {
      return game;
    }

    const investigatorId =
      game.activeInvestigatorId;

    if (!investigatorId) {
      return game;
    }

    const investigator =
      game.investigators[
        investigatorId
      ];

    if (!investigator) {
      return game;
    }

    /*
     * Source format:
     *
     * improve-skill:investigatorId:amount
     */

    const sourceParts =
      decision.source.split(":");

    const amount =
      Number(
        sourceParts[2] ?? "1",
      );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return game;
    }

    /*
     * ==========================================================
     * IMPROVE SKILL
     * ==========================================================
     */

    let currentGame: GameState = {
      ...game,

      investigators: {
        ...game.investigators,

        [investigatorId]: {
          ...investigator,

          skills: {
            ...investigator.skills,

            [choiceId]:
              investigator.skills[
                choiceId as keyof typeof investigator.skills
              ] + amount,
          },
        },
      },

      pendingDecision:
        null,
    };

    /*
     * ==========================================================
     * CONTINUE ENCOUNTER EFFECTS
     * ==========================================================
     */

    if (
      decision.onComplete &&
      decision.onComplete.length > 0
    ) {
      currentGame =
        resolveEncounterEffects(
          currentGame,
          investigatorId,
          decision.onComplete,
          map,
        );
    }

    return currentGame;
  }

  /*
   * ============================================================
   * NORMAL ENCOUNTER CHOICE
   * ============================================================
   *
   * Choices inside a normal Encounter card are represented
   * by numeric choice IDs.
   */

  const choiceIndex =
    Number(choiceId);

  if (
    !Number.isInteger(
      choiceIndex,
    ) ||
    choiceIndex < 0
  ) {
    return game;
  }

  return resolveEncounterChoice(
    game,
    choiceIndex,
    map,
  );
}