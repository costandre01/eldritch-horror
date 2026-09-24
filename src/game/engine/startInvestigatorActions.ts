import type { GameState } from "../models/GameState";
import { coreInvestigators } from "../../content/core/investigators";
import { endInvestigatorActions } from "./endInvestigatorActions";

export function startInvestigatorActions(
  game: GameState,
): GameState {
  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    throw new Error(
      "There is no active investigator.",
    );
  }

  if (game.phase !== "action") {
    throw new Error(
      "Investigator actions can only start during the Action phase.",
    );
  }

  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  const definition =
    coreInvestigators.find(
      (candidate) =>
        candidate.id ===
        investigator.definitionId,
    );

  if (!definition) {
    throw new Error(
      `Investigator definition "${investigator.definitionId}" does not exist.`,
    );
  }

  if (investigator.travelActive) {
    throw new Error(
      "Cannot start investigator actions while Travel is active.",
    );
  }

  /*
  * ============================================================
  * DELAYED
  * ============================================================
  *
  * A Delayed investigator loses the entire Action Phase.
  * The Delayed status is removed at the beginning of the
  * investigator's Action turn, and the turn is immediately
  * passed to the next investigator.
  */

  if (investigator.isDelayed) {
    const gameWithoutDelayed = {
      ...game,

      investigators: {
        ...game.investigators,

        [investigatorId]: {
          ...investigator,

          isDelayed: false,

          actionsPerformed: [],
        },
      },

      pendingDecision: null,
    };

    return endInvestigatorActions(
      gameWithoutDelayed,
    );
  }

  /*
   * ============================================================
   * START ACTIONS
   * ============================================================
   *
   * The investigator starts a fresh Action turn.
   */

  const updatedGame: GameState = {
    ...game,

    investigators: {
      ...game.investigators,

      [investigatorId]: {
        ...investigator,

        actionsPerformed: [],
      },
    },

    pendingDecision: null,
  };

  if (
    updatedGame.investigators[
      investigatorId
    ]?.isDelayed
  ) {
    return endInvestigatorActions(
      {
        ...updatedGame,

        investigators: {
          ...updatedGame.investigators,

          [investigatorId]: {
            ...updatedGame.investigators[
              investigatorId
            ],

            isDelayed: false,
          },
        },
      },
    );
  }

  return updatedGame;
}