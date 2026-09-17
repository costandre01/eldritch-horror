import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import type { MythosDefinition } from "../models/Mythos";
import { advanceDoom } from "./doomEngine";
import { resolveAncientOneAwakening } from "./resolveAncientOneAwakening";

import { resolveEncounterEffects } from "./resolveEncounterEffects";
import { solveMythosRumor } from "./solveMythosRumor";
import { spawnEpicMonsterAtSpace } from "./spawnEpicMonsterAtSpace";
import { startOtherWorldEncounter } from "./startOtherWorldEncounter";

export function resolveMythosSpecial(
  game: GameState,
  mythos: MythosDefinition,
  specialId: string,
  map: MapDefinition,
): GameState {
  switch (specialId) {
    case "growing-madness": {
      if (mythos.id !== "growing-madness") {
        throw new Error(
          `Mythos special "${specialId}" does not match Mythos "${mythos.id}".`,
        );
      }

      /*
       * Growing Madness is only resolved when
       * there are no Eldritch Tokens on the Mythos.
       */

      const mythosInPlay =
        game.board.mythosInPlay.find(
          (entry) =>
            entry.definitionId ===
            mythos.id,
        );

      if (!mythosInPlay) {
        return game;
      }

      if (
        mythosInPlay.eldritchTokens > 0
      ) {
        return game;
      }

      /*
       * Every investigator loses 3 Sanity.
       */

      let currentGame = game;

      for (
        const investigatorId of
          Object.keys(
            currentGame.investigators,
          )
      ) {
        currentGame =
          resolveEncounterEffects(
            currentGame,
            investigatorId,
            [
              {
                type: "lose-sanity",
                amount: 3,
              },
            ],
            map,
          );
      }

      /*
      * ==========================================================
      * SOLVE GROWING MADNESS
      * ==========================================================
      *
      * Growing Madness is represented as an Ongoing Mythos in
      * the current model, but its card text instructs the player
      * to solve this Mythos when there are no Eldritch Tokens.
      */

      const remainingMythosInPlay =
        currentGame.board.mythosInPlay.filter(
          (entry) =>
            entry.definitionId !==
            mythos.id,
        );

      const rumorIcon =
        mythos.icons.find(
          (icon) =>
            icon.type ===
            "spawn-rumor",
        );

      const spaces = {
        ...currentGame.board.spaces,
      };

      if (
        rumorIcon &&
        rumorIcon.type ===
          "spawn-rumor"
      ) {
        const space =
          spaces[rumorIcon.spaceId];

        if (space) {
          spaces[rumorIcon.spaceId] = {
            ...space,
            rumor: false,
          };
        }
      }

      return {
        ...currentGame,

        board: {
          ...currentGame.board,

          spaces,

          mythosInPlay:
            remainingMythosInPlay,

          mythosDiscard: [
            ...currentGame.board.mythosDiscard,
            mythos,
          ],
        },
      };
    }

    case "fractured-reality": {
      if (
        mythos.id !== "fractured-reality"
      ) {
        throw new Error(
          `Mythos special "${specialId}" does not match Mythos "${mythos.id}".`,
        );
      }

      const mythosInPlay =
        game.board.mythosInPlay.find(
          (entry) =>
            entry.definitionId ===
            mythos.id,
        );

      if (!mythosInPlay) {
        return game;
      }

      /*
      * Fractured Reality is only resolved when
      * there are no Eldritch Tokens on the Rumor.
      */

      if (
        mythosInPlay.eldritchTokens > 0
      ) {
        return game;
      }

      /*
      * Count all Gates currently on the board.
      */

      const gateCount =
        Object.values(
          game.board.spaces,
        ).reduce(
          (total, space) =>
            total + space.gates.length,
          0,
        );

      /*
      * Remember whether the Ancient One
      * was already awakened before Doom advances.
      */

      const wasAwakened =
        game.ancientOne.awakened;

      /*
      * Advance Doom by 1 for each Gate.
      *
      * advanceDoom() also marks the Ancient One
      * as awakened if Doom reaches 0.
      */

      const currentGame =
        advanceDoom(
          game,
          gateCount,
        );

      const solvedGame =
        solveMythosRumor(
          currentGame,
          mythos,
        );

      if (
        !wasAwakened &&
        currentGame.ancientOne.awakened
      ) {
        const reckoningDecision =
          currentGame.pendingDecision;

        if (
          !reckoningDecision ||
          reckoningDecision.type !==
            "mythos-card-reckoning"
        ) {
          throw new Error(
            "Fractured Reality awakened the Ancient One, but the Mythos Reckoning decision could not be resumed.",
          );
        }

        return resolveAncientOneAwakening(
          solvedGame,
          map,
          reckoningDecision.nextIconIndex,
          {
            type: "mythos",

            nextIconIndex:
              reckoningDecision.nextIconIndex,

            mythosIds:
              reckoningDecision.mythosIds,

            resolvedMythosIds:
              reckoningDecision.resolvedMythosIds,
          },
        );
      }


      return solvedGame;
    }

    case "fractured-reality-encounter": {
        if (
            mythos.id !== "fractured-reality"
        ) {
            throw new Error(
            `Mythos special "${specialId}" does not match Mythos "${mythos.id}".`,
            );
        }

        const investigatorId =
            game.activeInvestigatorId;

        if (!investigatorId) {
            throw new Error(
            "There is no active investigator.",
            );
        }

        const investigator =
            game.investigators[investigatorId];

        if (!investigator) {
            throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
            );
        }

        if (
            investigator.spaceId !==
            "space-2"
        ) {
            return game;
        }

        return startOtherWorldEncounter(
            game,
            map,
            true,
        );
    }

    case "lost-knowledge": {
      if (mythos.id !== "lost-knowledge") {
        throw new Error(
          `Invalid Mythos for Lost Knowledge: "${mythos.id}".`,
        );
      }

      return spawnEpicMonsterAtSpace(
        game,
        map,
        "space-21",
        "tick-tock-men",
      );
    }
    
    case "growing-madness-encounter": {
      if (mythos.id !== "growing-madness") {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Growing Madness.`,
        );
      }

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

      if (
        investigator.spaceId !==
        "space-8"
      ) {
        return game;
      }

      const investigatorCount =
        game.investigatorOrder.length;

      const clueCost =
        Math.ceil(
          investigatorCount / 2,
        );

      return {
        ...game,

        pendingDecision: {
          type: "test",

          title:
            mythos.name,

          message:
            "Attempt to find the uncharted isle.",

          image:
            mythos.image,

          skill:
            "observation",

          modifier: 0,

          investigatorId,

          onSuccess: [
            {
              type: "choice",

              choices: [
                {
                  text:
                    `Spend ${clueCost} Clue${
                      clueCost === 1
                        ? ""
                        : "s"
                    } to solve this Rumor.`,

                  requirement: {
                    type: "clues",
                    amount:
                      clueCost,
                  },

                  effects: [
                    {
                      type: "lose-clues",
                      amount:
                        clueCost,
                    },
                    {
                      type:
                        "solve-mythos-rumor",
                      mythosId:
                        "growing-madness",
                    },
                  ],
                },
              ],
            },
          ],

          onFail: [],

          minSuccesses: 1,

          onComplete: [],

          source:
            "mythos:growing-madness-encounter",
        },
      };
    }

    default:
      throw new Error(
        `Unsupported Mythos special effect "${specialId}".`,
      );
  }
}