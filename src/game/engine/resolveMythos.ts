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

function findMythos(
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
    findMythos(
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
      /*
       * --------------------------------------------------------
       * GAIN CONDITION
       * --------------------------------------------------------
       *
       * The actual Condition selection will be implemented
       * through the Mythos decision flow.
       */

      case "gain-condition": {
        break;
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
   * MOVE EVENT TO DISCARD
   * ============================================================
   *
   * Only Event Mythos cards are discarded immediately.
   *
   * Ongoing and Rumor cards remain in play.
   */

  if (mythos.type === "event") {
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
  }

  return currentGame;
}