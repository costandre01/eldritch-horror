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

import {
  gainCondition,
  gainConditionByCategory,
} from "./gainCondition";
import { solveMythosRumor } from "./solveMythosRumor";
import { getLeadInvestigatorId } from "./getLeadInvestigatorId";
import { resolveMythosSpecial, resumeSilverTwilightAid } from "./resolveMythosSpecial";
import { resolveCombatEncounterEnd } from "./resolveCombatEncounterEnd";
import { resolveMonsterToughness } from "./resolveMonsterToughness";
import { CORE_EPIC_MONSTERS } from "../../content/core/coreEpicMonsters";
import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { returnRandomSolvedMysteryToDeck } from "./mysteryEngine";
import { advanceDoom } from "./doomEngine";
import { resolveAncientOneAwakening } from "./resolveAncientOneAwakening";
import { startMythosCardReckoning } from "./startMythosCardReckoning";
import { drawClueToken } from "./clueEngine";
import { replaceDefeatedInvestigator } from "./replaceDefeatedInvestigator";

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
  * COMBAT — REPLACE DEFEATED INVESTIGATOR
  * ============================================================
  *
  * The Investigator was defeated during normal Combat.
  *
  * choiceId = Investigator definition ID.
  * ============================================================
  */

  if (
    decision.source?.startsWith(
      "combat-defeat-replacement:",
    )
  ) {
    const defeatedInvestigatorId =
      decision.source.split(":")[1];

    if (!defeatedInvestigatorId) {
      return game;
    }

    /*
    * The selected option ID is the
    * Investigator definition ID.
    */

    const replacementDefinitionId =
      choiceId;

    /*
    * Create the replacement Investigator.
    */

    const replacedGame =
      replaceDefeatedInvestigator(
        game,
        defeatedInvestigatorId,
        replacementDefinitionId,
      );

    /*
    * The defeated Investigator's turn is over.
    *
    * Keep the defeated Investigator as the temporary
    * active Investigator so endInvestigatorEncounter()
    * advances the Investigator Turn Index normally.
    *
    * The replacement already occupies the defeated
    * Investigator's position in investigatorOrder.
    */

    return endInvestigatorEncounter({
      ...replacedGame,

      activeInvestigatorId:
        defeatedInvestigatorId,

      pendingDecision:
        null,

      pendingEncounterChoice:
        null,

      combatOrder:
        null,

      currentEncounterId:
        null,

      currentEncounterBackId:
        null,

      currentEncounterRevealed:
        false,

      currentEncounterDeckType:
        null,
    });
  }

  /*
  * ============================================================
  * OCCULT RESEARCH
  * ============================================================
  */

  if (
    decision.source ===
    "mystery:occult-research"
  ) {
    const investigatorId =
      game.activeInvestigatorId;

    if (!investigatorId) {
      throw new Error(
        "Occult Research requires an active investigator.",
      );
    }

    const investigator =
      game.investigators[investigatorId];

    if (!investigator) {
      throw new Error(
        `Investigator "${investigatorId}" does not exist.`,
      );
    }

    /*
    * ----------------------------------------------------------
    * DECLINE
    * ----------------------------------------------------------
    */

    if (
      choiceId ===
      "occult-research:decline"
    ) {
      return endInvestigatorEncounter({
        ...game,

        pendingDecision: null,

        currentEncounterIsResearch:
          false,

        encounterCluesGained: 0,
      });
    }

    /*
    * ----------------------------------------------------------
    * SPEND 1 CLUE
    * ----------------------------------------------------------
    */

    if (
      choiceId !==
      "occult-research:spend"
    ) {
      return game;
    }

    if (
      (game.encounterCluesGained ?? 0) <= 0 ||
      investigator.clues <= 0
    ) {
      return game;
    }

    const activeMysteryId =
      game.mysteries.activeMysteryId;

    if (!activeMysteryId) {
      return endInvestigatorEncounter({
        ...game,

        pendingDecision: null,

        currentEncounterIsResearch:
          false,

        encounterCluesGained: 0,
      });
    }

    const mysteryProgress =
      game.mysteries.progress[
        activeMysteryId
      ];

    if (!mysteryProgress) {
      throw new Error(
        `No progress exists for Mystery "${activeMysteryId}".`,
      );
    }

    /*
    * Draw a physical Clue token from the pool.
    */
    const {
      game: gameAfterDraw,
      clue,
    } = drawClueToken(game);

    if (!clue) {
      throw new Error(
        "Cannot place a Clue on the Mystery because there are no physical Clue tokens available.",
      );
    }

    /*
    * Spend the Clue gained during this Encounter.
    */
    const updatedGame: GameState = {
      ...gameAfterDraw,

      investigators: {
        ...gameAfterDraw.investigators,

        [investigatorId]: {
          ...investigator,

          clues:
            investigator.clues - 1,
        },
      },

      encounterCluesGained:
        (gameAfterDraw.encounterCluesGained ?? 0) - 1,

      mysteries: {
        ...gameAfterDraw.mysteries,

        progress: {
          ...gameAfterDraw.mysteries.progress,

          [activeMysteryId]: {
            ...mysteryProgress,

            clueTokenIds: [
              ...mysteryProgress.clueTokenIds,
              clue.id,
            ],
          },
        },
      },

      pendingDecision: null,

      currentEncounterIsResearch:
        false,

      currentEncounterId: null,

      currentEncounterBackId: null,

      currentEncounterRevealed: false,

      currentEncounterDeckType: null,
    };

    /*
    * The Mystery is checked at the end of the Mythos Phase,
    * according to the current Mystery implementation.
    */
    return endInvestigatorEncounter(
      updatedGame,
    );
  }

  const investigatorHasMonster = (
    state: GameState,
    investigatorId: string,
  ): boolean => {
    const investigator =
      state.investigators[investigatorId];

    if (!investigator?.spaceId) {
      return false;
    }

    const space =
      state.board.spaces[
        investigator.spaceId
      ];

    if (!space) {
      return false;
    }

    return space.monsterIds.some(
      (monsterId) =>
        state.monsters[monsterId] !== undefined,
    );
  };

  /*
  * ============================================================
  * RETURN OF THE ANCIENT ONES — MONSTER DEFEATED
  * ============================================================
  */

  if (
    decision.source?.startsWith(
      "mythos:return-of-the-ancient-ones:monster-defeated:",
    )
  ) {
    const monsterId =
      decision.source.split(":")[3];

    if (!monsterId) {
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
     * ----------------------------------------------------------
     * DECLINE
     * ----------------------------------------------------------
     */

    if (
      choiceId ===
      "return-of-the-ancient-ones:decline"
    ) {
      return resolveCombatEncounterEnd(
        {
          ...game,

          pendingDecision:
            null,
        },
        map,
        monsterId,
      );
    }

    /*
     * ----------------------------------------------------------
     * SPEND 1 CLUE
     * ----------------------------------------------------------
     */

    if (
      choiceId !==
      "return-of-the-ancient-ones:place"
    ) {
      return game;
    }

    if (
      investigator.clues <= 0
    ) {
      return resolveCombatEncounterEnd(
        {
          ...game,

          pendingDecision:
            null,
        },
        map,
        monsterId,
      );
    }

    const mythosInPlayIndex =
      game.board.mythosInPlay.findIndex(
        (entry) =>
          entry.definitionId ===
          "return-of-the-ancient-ones",
      );

    if (
      mythosInPlayIndex === -1
    ) {
      return resolveCombatEncounterEnd(
        {
          ...game,

          pendingDecision:
            null,
        },
        map,
        monsterId,
      );
    }

    const monster =
      game.monsters[monsterId];

    if (!monster) {
      return game;
    }

    const monsterDefinition =
      CORE_MONSTERS.find(
        (definition) =>
          definition.id ===
          monster.definitionId,
      ) ??
      CORE_EPIC_MONSTERS.find(
        (definition) =>
          definition.id ===
          monster.definitionId,
      );

    if (!monsterDefinition) {
      throw new Error(
        `Monster definition "${monster.definitionId}" does not exist.`,
      );
    }

    const mythosInPlay =
      game.board.mythosInPlay[
        mythosInPlayIndex
      ];

    if (!mythosInPlay) {
      return game;
    }

    const monsterIds =
      [
        ...(mythosInPlay.monsterIds ?? []),
        monsterId,
      ];

    const updatedMythosInPlay =
      [...game.board.mythosInPlay];

    updatedMythosInPlay[
      mythosInPlayIndex
    ] = {
      ...mythosInPlay,

      monsterIds,
    };

    const gameWithMonster =
      {
        ...game,

        investigators: {
          ...game.investigators,

          [investigatorId]: {
            ...investigator,

            clues:
              investigator.clues - 1,
          },
        },

        board: {
          ...game.board,

          mythosInPlay:
            updatedMythosInPlay,
        },

        pendingDecision:
          null,
      };

    /*
     * ----------------------------------------------------------
     * CHECK RUMOR SOLUTION
     * ----------------------------------------------------------
     */

    const totalToughness =
      monsterIds.reduce(
        (total, id) => {
          const storedMonster =
            gameWithMonster.monsters[id];

          if (!storedMonster) {
            return total;
          }

          const definition =
            CORE_MONSTERS.find(
              (item) =>
                item.id ===
                storedMonster.definitionId,
            ) ??
            CORE_EPIC_MONSTERS.find(
              (item) =>
                item.id ===
                storedMonster.definitionId,
            );

          if (!definition) {
            return total;
          }

          return (
            total +
            resolveMonsterToughness(
              gameWithMonster,
              definition,
            )
          );
        },
        0,
      );

    const investigatorCount =
      gameWithMonster.investigatorOrder.length;

    const rumor =
      [
        ...easyMythos,
        ...normalMythos,
        ...hardMythos,
      ].find(
        (definition) =>
          definition.id ===
          "return-of-the-ancient-ones",
      );

    if (!rumor) {
      throw new Error(
        "Return of the Ancient Ones Mythos definition does not exist.",
      );
    }

    /*
     * The Rumor is solved when total Toughness
     * is equal to or greater than the number of Investigators.
     */

    const solvedGame =
      totalToughness >=
      investigatorCount
        ? solveMythosRumor(
            gameWithMonster,
            rumor,
          )
        : gameWithMonster;

    return resolveCombatEncounterEnd(
      {
        ...solvedGame,

        pendingDecision:
          null,
      },
      map,
      monsterId,
    );
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
  * ALL FOR NOTHING
  * ============================================================
  */

  if (
      decision.source ===
      "mythos:all-for-nothing"
  ) {
      const clueCost =
          Math.ceil(
              game.investigatorOrder.length /
                  2,
          );

      /*
      * ==========================================================
      * SPEND CLUES
      * ==========================================================
      */

      if (
          choiceId ===
          "all-for-nothing:spend-clues"
      ) {
          const totalClues =
              game.investigatorOrder.reduce(
                  (
                      total,
                      investigatorId,
                  ) =>
                      total +
                      (
                          game.investigators[
                              investigatorId
                          ]?.clues ?? 0
                      ),
                  0,
              );

          /*
          * Not enough Clues as a group.
          */

          if (
              totalClues <
              clueCost
          ) {
              return game;
          }

          let remainingClues =
              clueCost;

          const updatedInvestigators = {
              ...game.investigators,
          };

          /*
          * Spend the required Clues from the group.
          */

          for (
              const investigatorId of
                  game.investigatorOrder
          ) {
              if (
                  remainingClues <=
                  0
              ) {
                  break;
              }

              const investigator =
                  updatedInvestigators[
                      investigatorId
                  ];

              if (!investigator) {
                  continue;
              }

              const spent =
                  Math.min(
                      investigator.clues,
                      remainingClues,
                  );

              if (
                  spent <= 0
              ) {
                  continue;
              }

              updatedInvestigators[
                  investigatorId
              ] = {
                  ...investigator,

                  clues:
                      investigator.clues -
                      spent,
              };

              remainingClues -=
                  spent;
          }

          /*
          * The Mythos card itself is finished.
          */

          return {
              ...game,

              investigators:
                  updatedInvestigators,

              currentMythosId:
                  null,

              pendingDecision:
                  null,

              activeInvestigatorId:
                  null,
          };
      }

      /*
      * ==========================================================
      * DO NOT SPEND
      * ==========================================================
      */

      if (
          choiceId ===
          "all-for-nothing:do-not-spend"
      ) {
          const updatedMysteries =
              returnRandomSolvedMysteryToDeck(
                  game.mysteries,
              );

          return {
              ...game,

              mysteries:
                  updatedMysteries,

              currentMythosId:
                  null,

              pendingDecision:
                  null,

              activeInvestigatorId:
                  null,
          };
      }

      return game;
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
  * SILVER TWILIGHT AID
  * ============================================================
  */

  if (
    decision.source?.startsWith(
      "mythos:silver-twilight-aid:",
    )
  ) {
    const sourceParts =
      decision.source.split(":");

    const investigatorIndex =
      Number(
        sourceParts[2] ?? "0",
      );

    if (
      !Number.isInteger(
        investigatorIndex,
      ) ||
      investigatorIndex < 0
    ) {
      return game;
    }

    const investigatorId =
      game.investigatorOrder[
        investigatorIndex
      ];

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
    * ==========================================================
    * GAIN CLUE
    * ==========================================================
    */

    if (
      choiceId ===
      `silver-twilight-aid:clue:${investigatorIndex}`
    ) {
      const updatedGame: GameState = {
        ...game,

        investigators: {
          ...game.investigators,

          [investigatorId]: {
            ...investigator,

            clues:
              investigator.clues + 1,
          },
        },

        pendingDecision: null,
      };

      return resumeSilverTwilightAid(
        updatedGame,
        map,
        investigatorIndex + 1,
      );
    }

    /*
    * ==========================================================
    * GAIN ASSET
    * ==========================================================
    */

    if (
      choiceId ===
      `silver-twilight-aid:asset:${investigatorIndex}`
    ) {
      if (
        game.board.assetDeck.length === 0
      ) {
        return resumeSilverTwilightAid(
          {
            ...game,

            pendingDecision: null,
          },
          map,
          investigatorIndex + 1,
        );
      }

      const assetDeck = [
        ...game.board.assetDeck,
      ];

      const randomIndex =
        Math.floor(
          Math.random() *
            assetDeck.length,
        );

      const selectedAsset =
        assetDeck.splice(
          randomIndex,
          1,
        )[0];

      if (!selectedAsset) {
        return resumeSilverTwilightAid(
          {
            ...game,

            pendingDecision: null,
          },
          map,
          investigatorIndex + 1,
        );
      }

      const updatedGame: GameState = {
        ...game,

        investigators: {
          ...game.investigators,

          [investigatorId]: {
            ...investigator,

            assetIds: [
              ...investigator.assetIds,
              selectedAsset.id,
            ],
          },
        },

        board: {
          ...game.board,

          assetDeck,
        },

        pendingDecision: null,
      };

      return resumeSilverTwilightAid(
        updatedGame,
        map,
        investigatorIndex + 1,
      );
    }

    /*
    * ==========================================================
    * GAIN SPELL
    * ==========================================================
    */

    if (
      choiceId ===
      `silver-twilight-aid:spell:${investigatorIndex}`
    ) {
      if (
        game.board.spellDeck.length === 0
      ) {
        return resumeSilverTwilightAid(
          {
            ...game,

            pendingDecision: null,
          },
          map,
          investigatorIndex + 1,
        );
      }

      const spellIds =
        game.board.spellDeck.map(
          (spell) =>
            spell.id,
        );

      return {
        ...game,

        pendingDecision: {
          type: "select-card",

          title:
            "Silver Twilight Aid — Choose a Spell",

          message:
            "Choose 1 Spell.",

          cardIds:
            spellIds,

          selectableCardIds:
            spellIds,

          minSelections: 1,

          maxSelections: 1,

          selectedCardIds: [],

          source:
            `mythos:silver-twilight-aid:spell:${investigatorIndex}`,

          investigatorId,
        },
      };
    }

    /*
    * ==========================================================
    * DO NOTHING
    * ==========================================================
    */

    if (
      choiceId ===
      `silver-twilight-aid:pass:${investigatorIndex}`
    ) {
      return resumeSilverTwilightAid(
        {
          ...game,
          pendingDecision: null,
        },
        map,
        investigatorIndex + 1,
      );
    }

    return game;
  }

  /*
  * ============================================================
  * HAUNTING NIGHTMARES
  * ============================================================
  */

  if (
    decision.source?.startsWith(
      "mythos:haunting-nightmares:",
    )
  ) {
    const sourceParts =
      decision.source.split(":");

    const investigatorIndex =
      Number(
        sourceParts[2] ?? "0",
      );

    if (
      !Number.isInteger(
        investigatorIndex,
      ) ||
      investigatorIndex < 0
    ) {
      return game;
    }

    const investigatorId =
      game.investigatorOrder[
        investigatorIndex
      ];

    if (!investigatorId) {
      return {
        ...game,

        pendingDecision:
          null,

        activeInvestigatorId:
          null,

        currentMythosId:
          null,
      };
    }

    const investigator =
      game.investigators[
        investigatorId
      ];

    if (!investigator) {
      return game;
    }

    /*
    * ==========================================================
    * SPEND 1 CLUE
    * ==========================================================
    *
    * The Investigator avoids both effects.
    */

    if (
      choiceId ===
      `haunting-nightmares:spend-clue:${investigatorIndex}`
    ) {
      if (
        investigator.clues <= 0
      ) {
        return game;
      }

      const updatedGame: GameState = {
        ...game,

        investigators: {
          ...game.investigators,

          [investigatorId]: {
            ...investigator,

            clues:
              investigator.clues - 1,
          },
        },

        pendingDecision:
          null,
      };

      const nextIndex =
        investigatorIndex + 1;

      const nextInvestigatorId =
        updatedGame.investigatorOrder[
          nextIndex
        ];

      /*
      * All Investigators have resolved
      * Haunting Nightmares.
      */

      if (!nextInvestigatorId) {
        return {
          ...updatedGame,

          currentMythosId:
            null,

          activeInvestigatorId:
            null,

          pendingDecision:
            null,
        };
      }

      const nextInvestigator =
        updatedGame.investigators[
          nextInvestigatorId
        ];

      if (!nextInvestigator) {
        return updatedGame;
      }

      const nextOptions = [];

      if (
        nextInvestigator.clues > 0
      ) {
        nextOptions.push({
          id:
            `haunting-nightmares:spend-clue:${nextIndex}`,

          title:
            "Spend 1 Clue",

          description:
            "Spend 1 Clue to avoid losing Sanity and gaining a Madness Condition.",
        });
      }

      nextOptions.push({
        id:
          `haunting-nightmares:do-not-spend:${nextIndex}`,

        title:
          "Do Not Spend Clue",

        description:
          "Lose 2 Sanity and gain 1 Madness Condition.",
      });

      return {
        ...updatedGame,

        activeInvestigatorId:
          nextInvestigatorId,

        pendingDecision: {
          type: "choice",

          title:
            "Haunting Nightmares",

          message:
            "This Investigator may spend 1 Clue to avoid losing 2 Sanity and gaining a Madness Condition.",

          options:
            nextOptions,

          source:
            `mythos:haunting-nightmares:${nextIndex}`,
        },
      };
    }

    /*
    * ==========================================================
    * DO NOT SPEND CLUE
    * ==========================================================
    *
    * Lose 2 Sanity and gain 1 Madness Condition.
    */

    if (
      choiceId ===
      `haunting-nightmares:do-not-spend:${investigatorIndex}`
    ) {
      let currentGame =
        gainConditionByCategory(
          game,
          investigatorId,
          "madness",
        );

      currentGame =
        resolveEncounterEffects(
          currentGame,
          investigatorId,
          [
            {
              type:
                "lose-sanity",

              amount: 2,
            },
          ],
          map,
        );

      currentGame = {
        ...currentGame,

        pendingDecision:
          null,
      };

      const nextIndex =
        investigatorIndex + 1;

      const nextInvestigatorId =
        currentGame.investigatorOrder[
          nextIndex
        ];

      /*
      * All Investigators have resolved
      * Haunting Nightmares.
      */

      if (!nextInvestigatorId) {
        return {
          ...currentGame,

          currentMythosId:
            null,

          activeInvestigatorId:
            null,

          pendingDecision:
            null,
        };
      }

      const nextInvestigator =
        currentGame.investigators[
          nextInvestigatorId
        ];

      if (!nextInvestigator) {
        return currentGame;
      }

      const nextOptions = [];

      if (
        nextInvestigator.clues > 0
      ) {
        nextOptions.push({
          id:
            `haunting-nightmares:spend-clue:${nextIndex}`,

          title:
            "Spend 1 Clue",

          description:
            "Spend 1 Clue to avoid losing Sanity and gaining a Madness Condition.",
        });
      }

      nextOptions.push({
        id:
          `haunting-nightmares:do-not-spend:${nextIndex}`,

        title:
          "Do Not Spend Clue",

        description:
          "Lose 2 Sanity and gain 1 Madness Condition.",
      });

      return {
        ...currentGame,

        activeInvestigatorId:
          nextInvestigatorId,

        pendingDecision: {
          type: "choice",

          title:
            "Haunting Nightmares",

          message:
            "This Investigator may spend 1 Clue to avoid losing 2 Sanity and gaining a Madness Condition.",

          options:
            nextOptions,

          source:
            `mythos:haunting-nightmares:${nextIndex}`,
        },
      };
    }

    return game;
  }

  /*
  * ============================================================
  * HEAT WAVE SINGES THE GLOBE
  * ============================================================
  */

  if (
    decision.source?.startsWith(
      "mythos:heat-wave-singes-the-globe:",
    )
  ) {
    const sourceParts =
      decision.source.split(":");

    const investigatorIndex =
      Number(
        sourceParts[2] ?? "0",
      );

    if (
      !Number.isInteger(
        investigatorIndex,
      ) ||
      investigatorIndex < 0
    ) {
      return game;
    }

    const investigatorId =
      game.investigatorOrder[
        investigatorIndex
      ];

    if (!investigatorId) {
      return {
        ...game,

        pendingDecision:
          null,

        activeInvestigatorId:
          null,

        currentMythosId:
          null,
      };
    }

    const investigator =
      game.investigators[
        investigatorId
      ];

    if (!investigator) {
      return game;
    }

    /*
    * ==========================================================
    * BECOME DELAYED
    * ==========================================================
    */

    if (
      choiceId ===
      `heat-wave-singes-the-globe:delayed:${investigatorIndex}`
    ) {
      const updatedGame: GameState = {
        ...game,

        investigators: {
          ...game.investigators,

          [investigatorId]: {
            ...investigator,

            isDelayed:
              true,
          },
        },

        pendingDecision:
          null,
      };

      const nextIndex =
        investigatorIndex + 1;

      const nextInvestigatorId =
        updatedGame.investigatorOrder[
          nextIndex
        ];

      if (!nextInvestigatorId) {
        return {
          ...updatedGame,

          currentMythosId:
            null,

          pendingDecision:
            null,

          activeInvestigatorId:
            null,
        };
      }

      return {
        ...updatedGame,

        activeInvestigatorId:
          nextInvestigatorId,

        pendingDecision: {
          type: "choice",

          title:
            "Heat Wave Singes the Globe",

          message:
            "This Investigator may become Delayed to avoid losing 3 Health.",

          options: [
            ...(
              !updatedGame.investigators[
                nextInvestigatorId
              ]?.isDelayed
                ? [
                    {
                      id:
                        `heat-wave-singes-the-globe:delayed:${nextIndex}`,

                      title:
                        "Become Delayed",

                      description:
                        "Become Delayed and do not lose Health.",
                    },
                  ]
                : []
            ),

            {
              id:
                `heat-wave-singes-the-globe:health:${nextIndex}`,

              title:
                "Do Not Become Delayed",

              description:
                "Lose 3 Health.",
            },
          ],

          source:
            `mythos:heat-wave-singes-the-globe:${nextIndex}`,
        },
      };
    }

    /*
    * ==========================================================
    * DO NOT BECOME DELAYED
    * ==========================================================
    *
    * Lose 3 Health.
    */

    if (
      choiceId ===
      `heat-wave-singes-the-globe:health:${investigatorIndex}`
    ) {
      let currentGame =
        resolveEncounterEffects(
          game,
          investigatorId,
          [
            {
              type:
                "lose-health",

              amount: 3,
            },
          ],
          map,
        );

      currentGame = {
        ...currentGame,

        pendingDecision:
          null,
      };

      const nextIndex =
        investigatorIndex + 1;

      const nextInvestigatorId =
        currentGame.investigatorOrder[
          nextIndex
        ];

      if (!nextInvestigatorId) {
        return {
          ...currentGame,

          currentMythosId:
            null,

          pendingDecision:
            null,

          activeInvestigatorId:
            null,
        };
      }

      return {
        ...currentGame,

        activeInvestigatorId:
          nextInvestigatorId,

        pendingDecision: {
          type: "choice",

          title:
            "Heat Wave Singes the Globe",

          message:
            "This Investigator may become Delayed to avoid losing 3 Health.",

          options: [
            ...(
              !currentGame.investigators[
                nextInvestigatorId
              ]?.isDelayed
                ? [
                    {
                      id:
                        `heat-wave-singes-the-globe:delayed:${nextIndex}`,

                      title:
                        "Become Delayed",

                      description:
                        "Become Delayed and do not lose Health.",
                    },
                  ]
                : []
            ),

            {
              id:
                `heat-wave-singes-the-globe:health:${nextIndex}`,

              title:
                "Do Not Become Delayed",

              description:
                "Lose 3 Health.",
            },
          ],

          source:
            `mythos:heat-wave-singes-the-globe:${nextIndex}`,
        },
      };
    }

    return game;
  }

  /*
  * ============================================================
  * THE WORLD FIGHTS BACK
  * ============================================================
  */

  if (
    decision.source?.startsWith(
      "mythos:world-fights-back:",
    )
  ) {
    const sourceParts =
      decision.source.split(":");

    const investigatorIndex =
      Number(
        sourceParts[2] ?? "0",
      );

    if (
      !Number.isInteger(
        investigatorIndex,
      ) ||
      investigatorIndex < 0
    ) {
      return game;
    }

    const investigatorId =
      game.investigatorOrder[
        investigatorIndex
      ];

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
    * ==========================================================
    * RECOVER 2 HEALTH
    * ==========================================================
    */

    if (
      choiceId ===
      `world-fights-back:health:${investigatorIndex}`
    ) {
      const updatedGame: GameState = {
        ...game,

        investigators: {
          ...game.investigators,

          [investigatorId]: {
            ...investigator,

            health: Math.min(
              investigator.maxHealth,
              investigator.health + 2,
            ),
          },
        },

        pendingDecision: null,
      };

      const nextIndex =
        investigatorIndex + 1;

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
            "The World Fights Back",

          message:
            "This Investigator may recover 2 Health, recover 2 Sanity, or discard 1 Monster from his space.",

          options:
            [
              {
                id:
                  `world-fights-back:health:${nextIndex}`,

                title:
                  "Recover 2 Health",

                description:
                  "Recover 2 Health.",
              },

              {
                id:
                  `world-fights-back:sanity:${nextIndex}`,

                title:
                  "Recover 2 Sanity",

                description:
                  "Recover 2 Sanity.",
              },

              ...(
                investigatorHasMonster(
                  updatedGame,
                  nextInvestigatorId,
                )
                  ? [
                      {
                        id:
                          `world-fights-back:monster:${nextIndex}`,

                        title:
                          "Discard 1 Monster",

                        description:
                          "Choose 1 Monster on this Investigator's space to discard.",
                      },
                    ]
                  : []
              ),

              {
                id:
                  `world-fights-back:pass:${nextIndex}`,

                title:
                  "Do Nothing",

                description:
                  "Do not use the effect.",
              },
            ],

          source:
            `mythos:world-fights-back:${nextIndex}`,
        },
      };
    }

    /*
    * ==========================================================
    * RECOVER 2 SANITY
    * ==========================================================
    */

    if (
      choiceId ===
      `world-fights-back:sanity:${investigatorIndex}`
    ) {
      const updatedGame: GameState = {
        ...game,

        investigators: {
          ...game.investigators,

          [investigatorId]: {
            ...investigator,

            sanity: Math.min(
              investigator.maxSanity,
              investigator.sanity + 2,
            ),
          },
        },

        pendingDecision: null,
      };

      const nextIndex =
        investigatorIndex + 1;

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
            "The World Fights Back",

          message:
            "This Investigator may recover 2 Health, recover 2 Sanity, or discard 1 Monster from his space.",

          options:
            [
              {
                id:
                  `world-fights-back:health:${nextIndex}`,

                title:
                  "Recover 2 Health",

                description:
                  "Recover 2 Health.",
              },

              {
                id:
                  `world-fights-back:sanity:${nextIndex}`,

                title:
                  "Recover 2 Sanity",

                description:
                  "Recover 2 Sanity.",
              },

              ...(
                investigatorHasMonster(
                  updatedGame,
                  nextInvestigatorId,
                )
                  ? [
                      {
                        id:
                          `world-fights-back:monster:${nextIndex}`,

                        title:
                          "Discard 1 Monster",

                        description:
                          "Choose 1 Monster on this Investigator's space to discard.",
                      },
                    ]
                  : []
              ),

              {
                id:
                  `world-fights-back:pass:${nextIndex}`,

                title:
                  "Do Nothing",

                description:
                  "Do not use the effect.",
              },
            ],

          source:
            `mythos:world-fights-back:${nextIndex}`,
        },
      };
    }

    /*
    * ==========================================================
    * DISCARD MONSTER
    * ==========================================================
    */

    if (
      choiceId ===
      `world-fights-back:monster:${investigatorIndex}`
    ) {
      const spaceId =
        investigator.spaceId;

      if (!spaceId) {
        return game;
      }

      const space =
        game.board.spaces[
          spaceId
        ];

      if (!space) {
        return game;
      }

      const monsterIds =
        space.monsterIds.filter(
          (id) =>
            game.monsters[id] !==
            undefined,
        );

      if (
        monsterIds.length === 0
      ) {
        return game;
      }

      return {
        ...game,

        pendingDecision: {
          type: "select-monster",

          title:
            "The World Fights Back — Choose Monster",

          message:
            "Choose 1 Monster on this Investigator's space to discard.",

          monsterIds,

          onMonsterSelected: [
            {
              type:
                "discard-selected-monster",
            },
          ],

          onComplete: [],

          source:
            `mythos:world-fights-back-monster:${investigatorIndex}`,

          investigatorId,
        },
      };
    }

    /*
    * ==========================================================
    * DO NOTHING
    * ==========================================================
    */

    if (
      choiceId ===
      `world-fights-back:pass:${investigatorIndex}`
    ) {
      const nextIndex =
        investigatorIndex + 1;

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

      const nextInvestigator =
        game.investigators[
          nextInvestigatorId
        ];

      if (!nextInvestigator) {
        return game;
      }

      return {
        ...game,

        pendingDecision: {
          type: "choice",

          title:
            "The World Fights Back",

          message:
            "This Investigator may recover 2 Health, recover 2 Sanity, or discard 1 Monster from his space.",

          options: [
            {
              id:
                `world-fights-back:health:${nextIndex}`,

              title:
                "Recover 2 Health",

              description:
                "Recover 2 Health.",
            },

            {
              id:
                `world-fights-back:sanity:${nextIndex}`,

              title:
                "Recover 2 Sanity",

              description:
                "Recover 2 Sanity.",
            },

            ...(
              investigatorHasMonster(
                game,
                nextInvestigatorId,
              )
                ? [
                    {
                      id:
                        `world-fights-back:monster:${nextIndex}`,

                      title:
                        "Discard 1 Monster",

                      description:
                        "Choose 1 Monster on this Investigator's space to discard.",
                    },
                  ]
                : []
            ),

            {
              id:
                `world-fights-back:pass:${nextIndex}`,

              title:
                "Do Nothing",

              description:
                "Do not use the effect.",
            },
          ],

          source:
            `mythos:world-fights-back:${nextIndex}`,
        },
      };
    }

    return game;
  }

  /*
  * ============================================================
  * TIDE OF DESPAIR
  * ============================================================
  */

  if (
    decision.source?.startsWith(
      "mythos:tide-of-despair:",
    )
  ) {
    const sourceParts =
      decision.source.split(":");

    const investigatorIndex =
      Number(
        sourceParts[2] ?? "0",
      );

    if (
      !Number.isInteger(
        investigatorIndex,
      ) ||
      investigatorIndex < 0
    ) {
      return game;
    }

    const investigatorId =
      game.investigatorOrder[
        investigatorIndex
      ];

    if (!investigatorId) {
      return {
        ...game,

        currentMythosId:
          null,

        pendingDecision:
          null,

        activeInvestigatorId:
          null,
      };
    }

    const investigator =
      game.investigators[
        investigatorId
      ];

    if (!investigator) {
      return game;
    }

    /*
    * ==========================================================
    * DISCARD BLESSED
    * ==========================================================
    */

    if (
      choiceId ===
      `tide-of-despair:discard-blessed:${investigatorIndex}`
    ) {
      const blessedConditionId =
        investigator.conditionIds.find(
          (conditionId) =>
            game.conditions[
              conditionId
            ]?.definitionId ===
            "condition-blessed",
        );

      if (!blessedConditionId) {
        return game;
      }

      const updatedGame: GameState = {
        ...game,

        investigators: {
          ...game.investigators,

          [investigatorId]: {
            ...investigator,

            conditionIds:
              investigator.conditionIds.filter(
                (conditionId) =>
                  conditionId !==
                  blessedConditionId,
              ),
          },
        },

        pendingDecision:
          null,
      };

      const nextIndex =
        investigatorIndex + 1;

      const nextInvestigatorId =
        updatedGame.investigatorOrder[
          nextIndex
        ];

      /*
      * Todos os Investigators foram tratados.
      */

      if (!nextInvestigatorId) {
        return {
          ...updatedGame,

          currentMythosId:
            null,

          pendingDecision:
            null,

          activeInvestigatorId:
            null,
        };
      }

      return resolveMythosSpecial(
        updatedGame,
        [
          ...easyMythos,
          ...normalMythos,
          ...hardMythos,
        ].find(
          (definition) =>
            definition.id ===
            "tide-of-despair",
        )!,
        `tide-of-despair:${nextIndex}`,
        map,
      );
    }

    /*
    * ==========================================================
    * KEEP BLESSED
    * ==========================================================
    */

    if (
      choiceId ===
      `tide-of-despair:keep-blessed:${investigatorIndex}`
    ) {
      const newHealth =
        Math.max(
          0,
          investigator.health - 2,
        );

      const newSanity =
        Math.max(
          0,
          investigator.sanity - 2,
        );

      const updatedGame: GameState = {
        ...game,

        investigators: {
          ...game.investigators,

          [investigatorId]: {
            ...investigator,

            health:
              newHealth,

            sanity:
              newSanity,

            isDefeated:
              newHealth <= 0 ||
              newSanity <= 0,
          },
        },

        pendingDecision:
          null,
      };

      const nextIndex =
        investigatorIndex + 1;

      const nextInvestigatorId =
        updatedGame.investigatorOrder[
          nextIndex
        ];

      if (!nextInvestigatorId) {
        return {
          ...updatedGame,

          currentMythosId:
            null,

          pendingDecision:
            null,

          activeInvestigatorId:
            null,
        };
      }

      return resolveMythosSpecial(
        updatedGame,
        [
          ...easyMythos,
          ...normalMythos,
          ...hardMythos,
        ].find(
          (definition) =>
            definition.id ===
            "tide-of-despair",
        )!,
        `tide-of-despair:${nextIndex}`,
        map,
      );
    }

    return game;
  }

  /*
  * ============================================================
  * DESPERATE TIMES
  * ============================================================
  */

  if (
      decision.source ===
      "mythos:desperate-times"
  ) {
      const leadInvestigatorId =
          getLeadInvestigatorId(game);

      if (!leadInvestigatorId) {
          return game;
      }

      /*
      * ==========================================================
      * GAIN DARK PACT
      * ==========================================================
      */

      if (
          choiceId ===
          "desperate-times:dark-pact"
      ) {
          const updatedGame =
              gainCondition(
                  game,
                  leadInvestigatorId,
                  "condition-dark-pact",
              );

          return {
              ...updatedGame,

              currentMythosId:
                  null,

              pendingDecision:
                  null,

              activeInvestigatorId:
                  null,
          };
      }

      /*
      * ==========================================================
      * DOOM +2
      * ==========================================================
      */

      if (
          choiceId ===
          "desperate-times:doom"
      ) {
          const wasAwakened =
              game.ancientOne.awakened;

          const updatedGame =
              advanceDoom(
                  game,
                  2,
              );

          /*
          * If advancing Doom awakens the Ancient One,
          * let the normal Awakening flow handle it.
          */

          if (
              !wasAwakened &&
              updatedGame.ancientOne.awakened
          ) {
              return resolveAncientOneAwakening(
                  {
                      ...updatedGame,

                      currentMythosId:
                          game.currentMythosId,
                  },
                  map,
                  0,
              );
          }

          return {
              ...updatedGame,

              currentMythosId:
                  null,

              pendingDecision:
                  null,

              activeInvestigatorId:
                  null,
          };
      }

      return game;
  }

  /*
  * ============================================================
  * FROM BEYOND
  * ============================================================
  */

  if (
    decision.source ===
    "mythos:from-beyond"
  ) {
    const clueCost =
      Math.ceil(
        game.investigatorOrder.length /
          2,
      );

    /*
    * ==========================================================
    * SPEND CLUES
    * ==========================================================
    */

    if (
      choiceId ===
      "from-beyond:spend-clues"
    ) {
      const totalClues =
        game.investigatorOrder.reduce(
          (
            total,
            investigatorId,
          ) =>
            total +
            (
              game.investigators[
                investigatorId
              ]?.clues ?? 0
            ),
          0,
        );

      if (
        totalClues <
        clueCost
      ) {
        return game;
      }

      let remainingClues =
        clueCost;

      const updatedInvestigators = {
        ...game.investigators,
      };

      for (
        const investigatorId of
          game.investigatorOrder
      ) {
        if (
          remainingClues <=
          0
        ) {
          break;
        }

        const investigator =
          updatedInvestigators[
            investigatorId
          ];

        if (!investigator) {
          continue;
        }

        const spent =
          Math.min(
            investigator.clues,
            remainingClues,
          );

        updatedInvestigators[
          investigatorId
        ] = {
          ...investigator,

          clues:
            investigator.clues -
            spent,
        };

        remainingClues -=
          spent;
      }

      const fromBeyond =
        [
          ...easyMythos,
          ...normalMythos,
          ...hardMythos,
        ].find(
          (definition) =>
            definition.id ===
            "from-beyond",
        );

      if (!fromBeyond) {
        return game;
      }

      return {
        ...game,

        investigators:
          updatedInvestigators,

        board: {
          ...game.board,

          mythosDiscard: [
            ...game.board.mythosDiscard,
            fromBeyond,
          ],
        },

        currentMythosId:
          null,

        pendingDecision:
          null,

        activeInvestigatorId:
          null,
      };
    }

    /*
    * ==========================================================
    * DO NOT SPEND CLUES
    * ==========================================================
    */

    if (
      choiceId ===
      "from-beyond:resolve-reckonings"
    ) {
      return startMythosCardReckoning(
        {
          ...game,

          pendingDecision:
            null,
        },
        map,
        0,
        2,
      );
    }

    return game;
  }

  /*
  * ============================================================
  * WEB BETWEEN WORLDS — RECKONING
  * ============================================================
  */

  if (
    decision.source?.startsWith(
      "mythos:web-between-worlds:",
    )
  ) {
    const encodedDecision =
      decision.source.substring(
        "mythos:web-between-worlds:"
          .length,
      );

    let reckoningDecision:
      Extract<
        GameState["pendingDecision"],
        {
          type:
            "mythos-card-reckoning";
        }
      >;

    try {
      reckoningDecision =
        JSON.parse(
          decodeURIComponent(
            encodedDecision,
          ),
        );
    } catch {
      return game;
    }

    if (
      !reckoningDecision ||
      reckoningDecision.type !==
        "mythos-card-reckoning"
    ) {
      return game;
    }

    const mythosId =
      reckoningDecision.mythosIds.find(
        (id) =>
          !reckoningDecision.resolvedMythosIds.includes(
            id,
          ),
      );

    if (!mythosId) {
      return game;
    }

    const mythosInPlayIndex =
      game.board.mythosInPlay.findIndex(
        (entry) =>
          entry.definitionId ===
          mythosId,
      );

    if (
      mythosInPlayIndex === -1
    ) {
      return game;
    }

    const mythosInPlay =
      game.board.mythosInPlay[
        mythosInPlayIndex
      ];

    if (!mythosInPlay) {
      return game;
    }

    /*
    * ==========================================================
    * SPEND CLUES
    * ==========================================================
    */

    if (
      choiceId ===
      "web-between-worlds:spend-clues"
    ) {
      const clueCost =
        Math.ceil(
          game.investigatorOrder.length /
            2,
        );

      const totalClues =
        game.investigatorOrder.reduce(
          (
            total,
            investigatorId,
          ) =>
            total +
            (
              game.investigators[
                investigatorId
              ]?.clues ?? 0
            ),
          0,
        );

      if (
        totalClues <
        clueCost
      ) {
        return game;
      }

      let remainingClues =
        clueCost;

      const updatedInvestigators = {
        ...game.investigators,
      };

      /*
      * Spend the Clues as a group.
      */

      for (
        const investigatorId of
          game.investigatorOrder
      ) {
        if (
          remainingClues <=
          0
        ) {
          break;
        }

        const investigator =
          updatedInvestigators[
            investigatorId
          ];

        if (!investigator) {
          continue;
        }

        const spent =
          Math.min(
            investigator.clues,
            remainingClues,
          );

        if (
          spent <= 0
        ) {
          continue;
        }

        updatedInvestigators[
          investigatorId
        ] = {
          ...investigator,

          clues:
            investigator.clues -
            spent,
        };

        remainingClues -=
          spent;
      }

      /*
      * The Mythos Reckoning itself is resolved,
      * but the Eldritch token remains.
      */

      return {
        ...game,

        investigators:
          updatedInvestigators,

        pendingDecision: {
          ...reckoningDecision,

          resolvedMythosIds: [
            ...reckoningDecision.resolvedMythosIds,
            mythosId,
          ],
        },
      };
    }

    /*
    * ==========================================================
    * DISCARD ELDRITCH TOKEN
    * ==========================================================
    */

    if (
      choiceId ===
      "web-between-worlds:discard-token"
    ) {
      const remainingEldritchTokens =
        Math.max(
          0,
          mythosInPlay.eldritchTokens -
            1,
        );

      const updatedMythosInPlay =
        [
          ...game.board.mythosInPlay,
        ];

      updatedMythosInPlay[
        mythosInPlayIndex
      ] = {
        ...mythosInPlay,

        eldritchTokens:
          remainingEldritchTokens,
      };

      const updatedGame: GameState = {
        ...game,

        board: {
          ...game.board,

          mythosInPlay:
            updatedMythosInPlay,
        },
      };

      /*
      * ========================================================
      * LAST ELDRITCH TOKEN
      * ========================================================
      *
      * If the last token is removed, the investigators
      * immediately lose the game.
      */

      if (
        remainingEldritchTokens === 0
      ) {
        return {
          ...updatedGame,

          status:
            "defeat",

          pendingDecision:
            null,

          activeInvestigatorId:
            null,
        };
      }

      /*
      * ========================================================
      * CONTINUE MYTHOS RECKONING
      * ========================================================
      */

      return {
        ...updatedGame,

        pendingDecision: {
          ...reckoningDecision,

          resolvedMythosIds: [
            ...reckoningDecision.resolvedMythosIds,
            mythosId,
          ],
        },
      };
    }

    return game;
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

    /*
    * ==========================================================
    * STARS ALIGNED — ASTRONOMICAL RESEARCH
    * ==========================================================
    */

    if (
      choiceId ===
      "stars-aligned-encounter"
    ) {
      const starsAligned =
        [
          ...easyMythos,
          ...normalMythos,
          ...hardMythos,
        ].find(
          (definition) =>
            definition.id ===
              "stars-aligned" &&
            definition.type === "rumor",
        );

      if (!starsAligned) {
        return game;
      }

      const isStarsAlignedInPlay =
        game.board.mythosInPlay.some(
          (entry) =>
            entry.definitionId ===
            "stars-aligned",
        );

      if (!isStarsAlignedInPlay) {
        return game;
      }

      return resolveMythosSpecial(
        game,
        starsAligned,
        "stars-aligned-encounter",
        map,
      );
    }

    /*
    * ==========================================================
    * DIMENSIONS COLLIDE — HIDDEN TCHO-TCHO SECT
    * ==========================================================
    */

    if (
        choiceId ===
        "dimensions-collide-encounter"
    ) {
        const dimensionsCollide =
            [
                ...easyMythos,
                ...normalMythos,
                ...hardMythos,
            ].find(
                (definition) =>
                    definition.id ===
                        "dimensions-collide" &&
                    definition.type ===
                        "rumor",
            );

        if (!dimensionsCollide) {
            return game;
        }

        const isDimensionsCollideInPlay =
            game.board.mythosInPlay.some(
                (entry) =>
                    entry.definitionId ===
                    "dimensions-collide",
            );

        if (
            !isDimensionsCollideInPlay
        ) {
            return game;
        }

        return resolveMythosSpecial(
            game,
            dimensionsCollide,
            "dimensions-collide-encounter",
            map,
        );
    }

    /*
    * ============================================================
    * MYSTERIOUS LIGHTS — MI-GO OUTPOST
    * ============================================================
    */

    if (
        choiceId ===
        "mysterious-lights-encounter"
    ) {
        const mysteriousLights =
            [
                ...easyMythos,
                ...normalMythos,
                ...hardMythos,
            ].find(
                (definition) =>
                    definition.id ===
                        "mysterious-lights" &&
                    definition.type ===
                        "rumor",
            );

        if (!mysteriousLights) {
            return game;
        }

        const isMysteriousLightsInPlay =
            game.board.mythosInPlay.some(
                (entry) =>
                    entry.definitionId ===
                    "mysterious-lights",
            );

        if (
            !isMysteriousLightsInPlay
        ) {
            return game;
        }

        return resolveMythosSpecial(
            game,
            mysteriousLights,
            "mysterious-lights-encounter",
            map,
        );
    }

    /*
    * ============================================================
    * SPREADING SICKNESS — BOMBAY DOCTORS
    * ============================================================
    */

    if (
        choiceId ===
        "spreading-sickness-encounter"
    ) {
        const spreadingSickness =
            [
                ...easyMythos,
                ...normalMythos,
                ...hardMythos,
            ].find(
                (definition) =>
                    definition.id ===
                        "spreading-sickness" &&
                    definition.type ===
                        "rumor",
            );

        if (!spreadingSickness) {
            return game;
        }

        const isSpreadingSicknessInPlay =
            game.board.mythosInPlay.some(
                (entry) =>
                    entry.definitionId ===
                    "spreading-sickness",
            );

        if (
            !isSpreadingSicknessInPlay
        ) {
            return game;
        }

        return resolveMythosSpecial(
            game,
            spreadingSickness,
            "spreading-sickness-encounter",
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
  * OMEN OF GOOD FORTUNE
  * ============================================================
  *
  * The Lead Investigator may move the Omen to any
  * position on the Omen track without advancing Doom.
  */

  if (
    decision.source ===
    "mythos:omen-of-good-fortune"
  ) {
    const leadInvestigatorId =
      getLeadInvestigatorId(game);

    if (!leadInvestigatorId) {
      return game;
    }

    /*
     * ==========================================================
     * DO NOT MOVE THE OMEN
     * ==========================================================
     */

    if (
      choiceId ===
      "omen-position:pass"
    ) {
      return {
        ...game,

        currentMythosId: null,

        pendingDecision: null,
      };
    }

    /*
     * ==========================================================
     * SELECT OMEN POSITION
     * ==========================================================
     */

    const omenPositionMap: Record<
      string,
      number
    > = {
      "omen-position:0": 0,
      "omen-position:1": 1,
      "omen-position:2": 2,
      "omen-position:3": 3,
    };

    const targetPosition =
      omenPositionMap[
        choiceId
      ];

    if (
      targetPosition === undefined
    ) {
      return game;
    }

    /*
     * ==========================================================
     * MOVE OMEN
     * ==========================================================
     *
     * IMPORTANT:
     * This does NOT advance Doom.
     */

    return {
      ...game,

      ancientOne: {
        ...game.ancientOne,

        omenPosition:
          targetPosition,
      },

      currentMythosId: null,

      pendingDecision: null,
    };
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