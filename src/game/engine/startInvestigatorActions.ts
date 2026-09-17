import type { GameState } from "../models/GameState";
import { coreInvestigators } from "../../content/core/investigators";

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
   * START ACTIONS
   * ============================================================
   *
   * The investigator starts a fresh Action turn.
   */

  return {
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
}