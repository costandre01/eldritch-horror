import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { advanceDoom } from "./doomEngine";
import { discardCondition } from "./discardCondition";
import { findNearestCity } from "./findNearestCity";

export function defeatInvestigator(
  game: GameState,
  map: MapDefinition,
  investigatorId: string,
): GameState {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * Already defeated.
   *
   * Do not apply Doom / movement / Conditions
   * more than once.
   */
  if (investigator.isDefeated) {
    return game;
  }

  let currentGame = game;

  /*
   * ==========================================================
   * DOOM
   * ==========================================================
   */

  currentGame = advanceDoom(
    currentGame,
    1,
  );

  /*
   * ==========================================================
   * MOVE TO NEAREST CITY
   * ==========================================================
   */

  if (investigator.spaceId) {
    const nearestCityId =
      findNearestCity(
        map,
        investigator.spaceId,
      );

    if (nearestCityId) {
      currentGame = {
        ...currentGame,

        investigators: {
          ...currentGame.investigators,

          [investigatorId]: {
            ...currentGame.investigators[
              investigatorId
            ],

            spaceId:
              nearestCityId,
          },
        },
      };
    }
  }

  /*
   * ==========================================================
   * DISCARD CONDITIONS
   * ==========================================================
   */

  const conditionIds = [
    ...investigator.conditionIds,
  ];

  for (const conditionId of conditionIds) {
    currentGame =
      discardCondition(
        currentGame,
        investigatorId,
        conditionId,
      );
  }

  /*
   * ==========================================================
   * MARK DEFEATED
   * ==========================================================
   */

  currentGame = {
    ...currentGame,

    investigators: {
      ...currentGame.investigators,

      [investigatorId]: {
        ...currentGame.investigators[
          investigatorId
        ],

        isDefeated: true,
      },
    },

    pendingInvestigatorReplacements:
      currentGame.pendingInvestigatorReplacements.includes(
        investigatorId,
      )
        ? currentGame.pendingInvestigatorReplacements
        : [
            ...currentGame.pendingInvestigatorReplacements,
            investigatorId,
          ],
  };

  /*
   * ==========================================================
   * LEAD INVESTIGATOR DEFEATED
   * ==========================================================
   *
   * If the Lead is defeated, a new Lead must be
   * selected immediately.
   */

  if (
    currentGame.leadInvestigatorId ===
    investigatorId
  ) {
    const selectableInvestigatorIds =
      currentGame.investigatorOrder.filter(
        (candidateId) => {
          const candidate =
            currentGame.investigators[
              candidateId
            ];

          return (
            candidate &&
            !candidate.isDefeated &&
            candidateId !== investigatorId
          );
        },
      );

    /*
     * No investigator remains.
     * The game is lost.
     */
    if (
      selectableInvestigatorIds.length === 0
    ) {
      currentGame = {
        ...currentGame,

        status: "defeat",

        activeInvestigatorId:
          null,

        pendingDecision:
          null,
      };

      return currentGame;
    }

    /*
     * Ask the players to choose the new Lead.
     *
     * The exact flow will be resumed by App.tsx
     * after the selection.
     */
    currentGame = {
      ...currentGame,

      activeInvestigatorId:
        null,

      pendingDecision: {
        type: "select-investigator",

        title:
          "Choose Lead Investigator",

        message:
          "The Lead Investigator was defeated. Choose a new Lead Investigator.",

        investigatorIds:
          selectableInvestigatorIds,

        source:
          "defeat:lead",

        resume: {
          type:
            "defeat-lead",

          phase:
            currentGame.phase ===
            "mythos"
              ? "mythos"
              : "action",
        },
      },
    };
  }

  return currentGame;
}