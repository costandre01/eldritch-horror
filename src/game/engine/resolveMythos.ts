import type { GameState } from "../models/GameState";
import type { MythosDefinition } from "../models/Mythos";
import type { MapDefinition } from "../models/MapDefinition";

import { easyMythos } from "../../content/core/mythos/easyMythos";
import { normalMythos } from "../../content/core/mythos/normalMythos";
import { hardMythos } from "../../content/core/mythos/hardMythos";
import { startMonsterReckoning } from "./startMonsterReckoning";
import { showMythosContinue } from "./showMythosContinue";

import {
  addMythosEldritchTokens,
  spawnMythosRumor,
  spawnMythosClues,
  prepareAdvanceOmen,
} from "./mythosEngine";
import { spawnMythosGates } from "./spawnMythosGates";
import { resolveMythosMonsterSurge } from "./resolveMythosMonsterSurge";
import { getLeadInvestigatorId } from "./getLeadInvestigatorId";
import { resolveAncientOneAwakening } from "./resolveAncientOneAwakening";
import { resolveMythosSpecial } from "./resolveMythosSpecial";
import { gainArtifact } from "./gainArtifact";
import { resolveEncounterEffects } from "./resolveEncounterEffects";
import { gainCondition } from "./gainCondition";
import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../content/core/coreEpicMonsters";
import type { DarkPowerResume } from "../models/PendingDecision";
import { startMonsterCombat } from "./startMonsterCombat";
import { resolveMonsterToughness } from "./resolveMonsterToughness";
import { spawnMonsterAtSpace } from "./spawnMonster";
import { startNextRoundAfterMythos } from "./startNextRoundAfterMythos";

/*
 * ============================================================
 * ALL MYTHOS
 * ============================================================
 */

const ALL_MYTHOS: MythosDefinition[] = [
  ...easyMythos,
  ...normalMythos,
  ...hardMythos,
];

/*
 * ============================================================
 * FIND MYTHOS
 * ============================================================
 */

export function getMythosById(
  mythosId: string,
): MythosDefinition {
  const mythos =
    ALL_MYTHOS.find(
      (definition) =>
        definition.id === mythosId,
    );

  if (!mythos) {
    throw new Error(
      `Mythos "${mythosId}" does not exist.`,
    );
  }

  return mythos;
}

/*
 * ============================================================
 * RESOLVE MYTHOS
 * ============================================================
 */

export function resolveMythos(
  game: GameState,
  map: MapDefinition,
  startIconIndex: number = 0,
): GameState {
  /*
   * ============================================================
   * VALIDATION
   * ============================================================
   */

  if (game.phase !== "mythos") {
    throw new Error(
      "Mythos can only be resolved during the Mythos phase.",
    );
  }

  if (!game.currentMythosId) {
    throw new Error(
      "There is no current Mythos to resolve.",
    );
  }

  const mythos =
    getMythosById(
      game.currentMythosId,
    );

  /*
   * ============================================================
   * INITIAL GAME
   * ============================================================
   */

  let currentGame = game;

  /*
   * ============================================================
   * ADD PERSISTENT MYTHOS TO PLAY
   * ============================================================
   *
   * Ongoing and Rumor Mythos remain in play.
   *
   * Event Mythos cards are resolved and then discarded.
   */

  const isPersistentMythos =
    mythos.type === "ongoing" ||
    mythos.type === "rumor";

    if (
      isPersistentMythos &&
      startIconIndex === 0
    ) {
      currentGame = {
        ...currentGame,

        board: {
          ...currentGame.board,

          mythosInPlay: [
            ...currentGame.board.mythosInPlay,

            {
              definitionId:
                mythos.id,

              eldritchTokens: 0,
            },
          ],
        },
      };
    }

  /*
   * ============================================================
   * RESOLVE ICONS
   * ============================================================
   *
   * Icons are resolved before the card-specific effects.
   */

    for (
      let iconIndex = startIconIndex;
      iconIndex < mythos.icons.length;
      iconIndex++
    ) {
      const icon =
        mythos.icons[iconIndex];

      if (!icon) {
        continue;
      }

      switch (icon.type) {
        /*
        * --------------------------------------------------------
        * ADVANCE OMEN
        * --------------------------------------------------------
        */

        case "advance-omen": {
          return prepareAdvanceOmen(
            currentGame,
            iconIndex + 1,
          );
        }

        /*
        * --------------------------------------------------------
        * MYTHOS RECKONING
        * --------------------------------------------------------
        */

        case "mythos-reckoning": {
          return startMonsterReckoning(
            currentGame,
            map,
            iconIndex + 1,
          );
        }

        /*
        * --------------------------------------------------------
        * SPAWN GATES
        * --------------------------------------------------------
        */

        case "spawn-gates": {
          const wasAwakened =
            currentGame.ancientOne.awakened;

          currentGame =
            spawnMythosGates(
              currentGame,
              iconIndex + 1,
            );

          /*
          * If resolving Spawn Gates caused Doom
          * to reach 0, resolve the Ancient One
          * Awakening before continuing the Mythos.
          */

          if (
            !wasAwakened &&
            currentGame.ancientOne.awakened
          ) {
            return resolveAncientOneAwakening(
              currentGame,
              map,
              iconIndex + 1,
            );
          }

          return currentGame;
        }

        /*
        * --------------------------------------------------------
        * MONSTER SURGE
        * --------------------------------------------------------
        */

        case "monster-surge":
          return resolveMythosMonsterSurge(
            currentGame,
            map,
            iconIndex + 1,
          );

        /*
        * --------------------------------------------------------
        * SPAWN CLUES
        * --------------------------------------------------------
        */

        case "spawn-clues": {
          currentGame =
            spawnMythosClues(
              currentGame,
            );

          return showMythosContinue(
            currentGame,
            iconIndex + 1,
          );
        }

        /*
        * --------------------------------------------------------
        * SPAWN RUMOR
        * --------------------------------------------------------
        */

        case "spawn-rumor": {
          currentGame =
            spawnMythosRumor(
              currentGame,
              icon.spaceId,
            );

          return showMythosContinue(
            currentGame,
            iconIndex + 1,
          );
        }

        /*
        * --------------------------------------------------------
        * PLACE ELDRITCH TOKENS
        * --------------------------------------------------------
        */

        case "place-eldritch-tokens": {
          currentGame =
            addMythosEldritchTokens(
              currentGame,
              mythos.id,
              icon.amount,
            );

          return showMythosContinue(
            currentGame,
            iconIndex + 1,
          );
        }

        default:
          throw new Error(
            `Unsupported Mythos icon.`,
          );
      }
    }

  /*
   * ============================================================
   * RESOLVE CARD-SPECIFIC EFFECTS
   * ============================================================
   *
   * These effects will be implemented one by one.
   */

  for (
    const effect of mythos.effects
  ) {
    switch (effect.type) {

      /*
       * --------------------------------------------------------
       * GAIN ARTIFACT
       * --------------------------------------------------------
       */

      case "gain-artifact": {
        const investigatorId =
          effect.investigator === "lead"
            ? getLeadInvestigatorId(
                currentGame,
              )
            : currentGame.activeInvestigatorId;

        if (!investigatorId) {
          throw new Error(
            "No investigator available for Mythos Artifact effect.",
          );
        }

        currentGame =
          gainArtifact(
            currentGame,
            investigatorId,
          );

        break;
      }

      case "world-fights-back": {
        const investigatorId =
          currentGame.investigatorOrder[0];

        if (!investigatorId) {
          break;
        }

        const investigator =
          currentGame.investigators[investigatorId];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const monsterIds =
          investigator.spaceId
            ? (
                currentGame.board.spaces[
                  investigator.spaceId
                ]?.monsterIds ?? []
              ).filter(
                (monsterId) =>
                  currentGame.monsters[monsterId] !==
                  undefined,
              )
            : [];

        const options = [
          {
            id: `world-fights-back:health:0`,
            title: "Recover 2 Health",
            description:
              "Recover 2 Health.",
          },
          {
            id: `world-fights-back:sanity:0`,
            title: "Recover 2 Sanity",
            description:
              "Recover 2 Sanity.",
          },
        ];

        if (monsterIds.length > 0) {
          options.push({
            id: `world-fights-back:monster:0`,
            title: "Discard 1 Monster",
            description:
              "Choose 1 Monster on this Investigator's space to discard.",
          });
        }

        options.push({
          id: `world-fights-back:pass:0`,
          title: "Do Nothing",
          description:
            "Do not use the effect.",
        });

        return {
          ...currentGame,

          pendingDecision: {
            type: "choice",

            title:
              "The World Fights Back",

            message:
              "This Investigator may recover 2 Health, recover 2 Sanity, or discard 1 Monster from his space.",

            options,

            source:
              `mythos:world-fights-back:0`,
          },
        };
      }

      /*
       * --------------------------------------------------------
       * ROLL SINGLE DIE
       * --------------------------------------------------------
       */

      case "roll-single-die": {
        const investigatorId =
          effect.investigator === "lead"
            ? getLeadInvestigatorId(
                currentGame,
              )
            : currentGame.activeInvestigatorId;

        if (!investigatorId) {
          throw new Error(
            "No investigator available for Mythos single-die roll.",
          );
        }

        return {
          ...currentGame,

          pendingDecision: {
            type: "single-die-roll",

            title:
              mythos.name,

            message:
              "Roll 1 die. On a 1 or 2, lose 2 Health and 2 Sanity.",

            image:
              mythos.image,

            investigatorId,

            onOneOrTwo:
              effect.onOneOrTwo,

            onThreeToSix:
              [],

            onComplete:
              [],

            source:
              `mythos:single-die-roll:${mythos.id}`,
          },
        };
      }

      /*
       * --------------------------------------------------------
       * MOVE OMEN — OMEN OF GOOD FORTUNE
       * --------------------------------------------------------
       */

      case "move-omen-choice": {
        const investigatorId =
          effect.investigator === "lead"
            ? getLeadInvestigatorId(
                currentGame,
              )
            : currentGame.activeInvestigatorId;

        if (!investigatorId) {
          throw new Error(
            "No investigator available for Mythos Omen effect.",
          );
        }

        return {
          ...currentGame,

          pendingDecision: {
            type: "choice",

            title:
              mythos.name,

            message:
              "The Lead Investigator may move the Omen to any space on the Omen track without advancing Doom.",

            options: [
              {
                id: "omen-position:0",

                title: "Green",

                description:
                  "Move the Omen to the green space.",
              },
              {
                id: "omen-position:1",

                title: "Blue",

                description:
                  "Move the Omen to the blue space.",
              },
              {
                id: "omen-position:2",

                title: "Red",

                description:
                  "Move the Omen to the red space.",
              },
              {
                id: "omen-position:3",

                title: "Blue",

                description:
                  "Move the Omen to the blue space.",
              },
              {
                id: "omen-position:pass",

                title: "Do Not Move",

                description:
                  "Leave the Omen where it is.",
              },
            ],

            source:
              "mythos:omen-of-good-fortune",
          },
        };
      }

      /*
       * --------------------------------------------------------
       * GAIN ALLY
       * --------------------------------------------------------
       */

      case "gain-ally": {
        const investigatorId =
          effect.investigator === "lead"
            ? getLeadInvestigatorId(
                currentGame,
              )
            : currentGame.activeInvestigatorId;

        if (!investigatorId) {
          throw new Error(
            "No investigator available for Mythos Ally effect.",
          );
        }

        currentGame =
          resolveEncounterEffects(
            currentGame,
            investigatorId,
            [
              {
                type: "gain-ally",
              },
            ],
            map,
          );

        break;
      }

      case "mythos-special": {
        currentGame =
          resolveMythosSpecial(
            currentGame,
            mythos,
            effect.id,
            map,
          );

        break;
      }

      case "select-gate": {
        const gateSpaceIds =
          Object.entries(
            currentGame.board.spaces,
          )
            .filter(
              ([, space]) =>
                space.gates.length > 0,
            )
            .map(([spaceId]) => spaceId);

        if (gateSpaceIds.length === 0) {
          break;
        }

        return {
          ...currentGame,

          pendingDecision: {
            type: "select-space",

            title:
              "That Which Consumes",

            message:
              "As a group, choose 1 Gate on the game board to discard.",

            spaceIds:
              gateSpaceIds,

            onSpaceSelected: [],

            source:
              "mythos:that-which-consumes",
          },
        };
      }
      /*
       * --------------------------------------------------------
       * GAIN CONDITION
       * --------------------------------------------------------
       *
       * The actual Condition selection will be implemented
       * through the Mythos decision flow.
       */

      case "gain-condition": {
        const investigatorId =
          effect.investigator === "lead"
            ? getLeadInvestigatorId(
                currentGame,
              )
            : currentGame.activeInvestigatorId;

        if (!investigatorId) {
          throw new Error(
            "No investigator available for Mythos Condition effect.",
          );
        }

        if (!effect.conditionDefinitionId) {
          throw new Error(
            "Mythos Condition effect requires a conditionDefinitionId.",
          );
        }

        currentGame =
          gainCondition(
            currentGame,
            investigatorId,
            effect.conditionDefinitionId,
          );

        break;
      }

      /*
       * --------------------------------------------------------
       * SPAWN MONSTERS
       * --------------------------------------------------------
       *
       * Spawn the specified number of Monsters at the
       * requested Mythos location.
       */

      case "spawn-monsters": {
        if (
          effect.location ===
          "active-expedition"
        ) {
          const activeExpeditionSpaceId =
            currentGame.board.activeExpeditionSpaceId;

          if (!activeExpeditionSpaceId) {
            throw new Error(
              "There is no Active Expedition space.",
            );
          }

          for (
            let i = 0;
            i < effect.amount;
            i++
          ) {
            currentGame =
              spawnMonsterAtSpace(
                currentGame,
                activeExpeditionSpaceId,
              );
          }
        }

        break;
      }

      /*
       * --------------------------------------------------------
       * A DARK POWER
       * --------------------------------------------------------
       *
       * Each Monster recovers all Health.
       *
       * Then each Investigator immediately encounters
       * each Monster on his space, in the order of his choice.
       */

      case "mythos-dark-power": {
        /*
         * ------------------------------------------------------
         * RECOVER ALL MONSTER HEALTH
         * ------------------------------------------------------
         */

        const healedMonsters = {
          ...currentGame.monsters,
        };

        for (
          const monsterId of Object.keys(
            healedMonsters,
          )
        ) {
          const monster =
            healedMonsters[monsterId];

          if (!monster) {
            continue;
          }

          const definition =
            CORE_MONSTERS.find(
              (monsterDefinition) =>
                monsterDefinition.id ===
                monster.definitionId,
            ) ??
            CORE_EPIC_MONSTERS.find(
              (monsterDefinition) =>
                monsterDefinition.id ===
                monster.definitionId,
            );

          if (!definition) {
            throw new Error(
              `Monster definition "${monster.definitionId}" does not exist.`,
            );
          }

          const toughness =
            resolveMonsterToughness(
              currentGame,
              definition,
            );

          healedMonsters[monsterId] = {
            ...monster,

            health:
              toughness,
          };
        }

        currentGame = {
          ...currentGame,

          monsters:
            healedMonsters,
        };

        /*
         * ------------------------------------------------------
         * FIND FIRST INVESTIGATOR WITH MONSTERS
         * ------------------------------------------------------
         */

        const investigatorIds =
          currentGame.investigatorOrder;

        const firstInvestigatorIndex =
          investigatorIds.findIndex(
            (investigatorId) => {
              const investigator =
                currentGame.investigators[
                  investigatorId
                ];

              if (!investigator?.spaceId) {
                return false;
              }

              const space =
                currentGame.board.spaces[
                  investigator.spaceId
                ];

              if (!space) {
                return false;
              }

              return space.monsterIds.some(
                (monsterId) =>
                  currentGame.monsters[
                    monsterId
                  ] !== undefined,
              );
            },
          );

        /*
         * ------------------------------------------------------
         * NO INVESTIGATORS WITH MONSTERS
         * ------------------------------------------------------
         */

        if (
          firstInvestigatorIndex === -1
        ) {
          return {
            ...currentGame,

            board: {
              ...currentGame.board,

              mythosDiscard: [
                ...currentGame.board.mythosDiscard,
                mythos,
              ],
            },

            currentMythosId: null,

            activeInvestigatorId: null,

            pendingDecision: null,

            combatOrder: null,
          };
        }

        const investigatorId =
          investigatorIds[
            firstInvestigatorIndex
          ];

        if (!investigatorId) {
          throw new Error(
            "A Dark Power could not determine the first Investigator.",
          );
        }

        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator?.spaceId) {
          throw new Error(
            `Investigator "${investigatorId}" has no current space.`,
          );
        }

        const monsterIds =
          currentGame.board.spaces[
            investigator.spaceId
          ]?.monsterIds.filter(
            (monsterId) =>
              currentGame.monsters[
                monsterId
              ] !== undefined,
          ) ?? [];

        /*
         * ------------------------------------------------------
         * START A DARK POWER COMBAT SEQUENCE
         * ------------------------------------------------------
         */

        const resume: DarkPowerResume = {
          type:
            "mythos-dark-power",

          investigatorIds,

          currentInvestigatorIndex:
            firstInvestigatorIndex,

          monsterIds,

          resolvedMonsterIds: [],
        };

        const gameWithInvestigator =
          {
            ...currentGame,

            activeInvestigatorId:
              investigatorId,

            combatOrder: null,
          };

        /*
         * If there is only one Monster,
         * there is no order choice to make.
         */

        if (monsterIds.length === 1) {
          const firstMonsterId =
            monsterIds[0];

          if (!firstMonsterId) {
            throw new Error(
              "A Dark Power could not determine the Monster.",
            );
          }

          return startMonsterCombat(
            gameWithInvestigator,
            firstMonsterId,
            resume,
          );
        }

        /*
         * Multiple Monsters:
         *
         * The Investigator chooses their order.
         */

        return {
          ...gameWithInvestigator,

          pendingDecision: {
            type: "combat-order",

            title:
              "A Dark Power — Combat Order",

            message:
              "Choose the order in which you will encounter the Monsters on your space.",

            monsterIds,

            orderedMonsterIds: [],

            source:
              "combat-order",

            resume,
          },
        };
      }

      /*
       * --------------------------------------------------------
       * SOLVE RUMOR
       * --------------------------------------------------------
       */

      case "solve-rumor": {
        break;
      }

      /*
       * --------------------------------------------------------
       * TEST AND GAIN CLUES
       * --------------------------------------------------------
       */

      case "test-and-gain-clues": {
        const investigatorId =
          effect.investigator === "lead"
            ? getLeadInvestigatorId(
                currentGame,
              )
            : currentGame.activeInvestigatorId;

        if (!investigatorId) {
          throw new Error(
            "No investigator available for Mythos test.",
          );
        }

        return {
          ...currentGame,

          pendingDecision: {
            type: "test",

            title:
              mythos.name,

            message:
              "The Lead Investigator tests Influence.",

            skill:
              effect.skill,

            modifier:
              0,

            investigatorId,

            source:
              `mythos:test-and-gain-clues:${investigatorId}`,
          },
        };
      }

      /*
       * --------------------------------------------------------
       * GAIN DARK PACT TO SOLVE RUMOR
       * --------------------------------------------------------
       */

      case "gain-dark-pact-to-solve-rumor": {

        const rumorIds =
          currentGame.board.mythosInPlay
            .filter((entry) => {
              const rumor =
                ALL_MYTHOS.find(
                  (definition) =>
                    definition.id ===
                    entry.definitionId,
                );

              return rumor?.type === "rumor";
            })
            .map(
              (entry) =>
                entry.definitionId,
            );

        /*
        * If there are no Rumors in play,
        * there is nothing to solve.
        */

        if (rumorIds.length === 0) {
          break;
        }

        return {
          ...currentGame,

          pendingDecision: {
            type: "choice",

            title:
              "A Proposition",

            message:
              "The Lead Investigator may gain a Dark Pact Condition to immediately solve 1 Rumor Mythos in play.",

            options: [
              {
                id: "gain-dark-pact",
                title:
                  "Gain Dark Pact",
                description:
                  "Gain a Dark Pact Condition, then choose 1 Rumor Mythos in play to solve.",
              },
              {
                id: "decline-dark-pact",
                title:
                  "Do Not Gain Dark Pact",
                description:
                  "Do not gain the Dark Pact Condition.",
              },
            ],

            source:
              "mythos:a-proposition-dark-pact",
          },
        };
      }

      /*
       * --------------------------------------------------------
       * GAIN DEBT TO DISCARD CONDITION
       * --------------------------------------------------------
       */

      case "gain-debt-to-discard-condition": {
        const investigatorIds =
          currentGame.investigatorOrder;

        if (
          investigatorIds.length === 0
        ) {
          break;
        }

        const firstInvestigatorId =
          investigatorIds[0];

        if (!firstInvestigatorId) {
          break;
        }

        return {
          ...currentGame,

          pendingDecision: {
            type: "choice",

            title:
              "Everyone Has a Price",

            message:
              "May this Investigator gain a Debt Condition to discard 1 Condition?",

            options: [
              {
                id:
                  `gain-debt:${firstInvestigatorId}`,

                title:
                  "Gain Debt",

                description:
                  "Gain a Debt Condition and discard 1 Condition.",
              },

              {
                id:
                  `decline-debt:${firstInvestigatorId}`,

                title:
                  "Do Not Gain Debt",

                description:
                  "Do not gain a Debt Condition.",
              },
            ],

            source:
              `mythos:everyone-has-a-price:${firstInvestigatorId}:0`,
          },
        };
      }


      default:
        throw new Error(
          `Unsupported Mythos effect.`,
        );
    }
  }

  /*
  * ============================================================
  * MYTHOS PHASE COMPLETE
  * ============================================================
  *
  * The Mythos card has now been fully resolved.
  *
  * Event cards go to the discard pile.
  * Ongoing and Rumor cards remain in play.
  *
  * The currently resolving Mythos is no longer active.
  */

  if (
    mythos.type === "event"
  ) {
    currentGame = {
      ...currentGame,

      board: {
        ...currentGame.board,

        mythosDiscard: [
          ...currentGame.board.mythosDiscard,
          mythos,
        ],
      },

      currentMythosId:
        null,
    };
  } else {
    currentGame = {
      ...currentGame,

      currentMythosId:
        null,
    };
  }

  /*
  * ============================================================
  * CHOOSE NEW LEAD INVESTIGATOR
  * ============================================================
  *
  * At the end of the Mythos Phase, the Lead Investigator
  * may pass the Lead token to another investigator.
  *
  * The current Lead is therefore excluded from the choice.
  */

  const selectableInvestigatorIds =
    currentGame.investigatorOrder.filter(
      (investigatorId) =>
        investigatorId !==
        currentGame.leadInvestigatorId,
    );

  /*
  * Solo game:
  *
  * There is nobody else to receive the Lead token,
  * so the current Lead remains Lead and the next
  * round starts immediately.
  */

  if (
    selectableInvestigatorIds.length === 0
  ) {
    const currentLead =
      currentGame.leadInvestigatorId;

    if (!currentLead) {
      throw new Error(
        "There is no Lead Investigator at the end of the Mythos Phase.",
      );
    }

    return startNextRoundAfterMythos(
      currentGame,
      currentLead,
    );
  }

  /*
  * Multiplayer:
  *
  * Show the same Lead Investigator selection
  * already used during game setup.
  */

  return {
    ...currentGame,

    activeInvestigatorId:
      null,

    investigatorTurnIndex:
      0,

    pendingDecision: {
      type: "select-investigator",

      title:
        "Choose Lead Investigator",

      message:
        "Choose which investigator receives the Lead Investigator token for the next round.",

      investigatorIds:
        selectableInvestigatorIds,

      source:
        "mythos:end-lead",
    },
  };
}