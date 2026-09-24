import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { canPerformAction } from "./canPerformAction";
import { endInvestigatorActions } from "./endInvestigatorActions";
import { resolveConditionTrigger } from "./resolveConditionTrigger";

export function restInvestigator(
  game: GameState,
  map: MapDefinition,
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

  if (
    !canPerformAction(
      investigator,
      "rest",
    )
  ) {
    throw new Error(
      "Investigator cannot perform Rest.",
    );
  }

  /*
   * ============================================================
   * REST
   * ============================================================
   *
   * Recover 1 Health and 1 Sanity.
   */

  let currentGame: GameState = {
    ...game,

    investigators: {
      ...game.investigators,

      [investigatorId]: {
        ...investigator,

        health: Math.min(
          investigator.maxHealth,
          investigator.health + 1,
        ),

        sanity: Math.min(
          investigator.maxSanity,
          investigator.sanity + 1,
        ),

        actionsPerformed: [
          ...investigator.actionsPerformed,
          "rest",
        ],
      },
    },
  };

  /*
   * ============================================================
   * CONDITION TRIGGERS
   * ============================================================
   *
   * Resolve automatic Conditions triggered by Rest.
   *
   * Optional Rest effects are returned by the trigger system
   * and are NOT automatically resolved.
   */

  const triggerResult =
    resolveConditionTrigger(
      currentGame,
      investigatorId,
      "on-rest",
      map,
    );

  currentGame =
    triggerResult.game;

  if (
    currentGame.phase === "action" &&
    currentGame.investigators[
      investigatorId
    ]?.isDelayed
  ) {
    return endInvestigatorActions(
      currentGame,
    );
  }

  /*
   * ============================================================
   * RETURN
   * ============================================================
   */

  return currentGame;
}