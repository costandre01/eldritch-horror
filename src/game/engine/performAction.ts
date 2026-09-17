import type { GameState } from "../models/GameState";
import type { InvestigatorAction } from "../types/InvestigatorAction";

import { canPerformAction } from "./canPerformAction";

export function performAction(
  game: GameState,
  action: InvestigatorAction,
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

  if (!canPerformAction(investigator, action)) {
    throw new Error(
      `Investigator cannot perform action "${action}".`,
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
          action,
        ],
      },
    },
  };
}