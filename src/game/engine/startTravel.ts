import type { GameState } from "../models/GameState";

import { canPerformAction } from "./canPerformAction";

export function startTravel(
  game: GameState,
): GameState {
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

  if (investigator.travelActive) {
    throw new Error(
      "Travel is already active.",
    );
  }

  if (
    !canPerformAction(
      investigator,
      "travel",
    )
  ) {
    throw new Error(
      "Investigator cannot perform Travel.",
    );
  }

  return {
    ...game,

    investigators: {
      ...game.investigators,

      [investigatorId]: {
        ...investigator,

        actionsPerformed: [
          ...investigator.actionsPerformed,
          "travel",
        ],

        travelMoves: 0,

        travelActive: true,

        travelHistory: [],

        travelStartSpaceId:
          investigator.spaceId,
      },
    },
  };
}