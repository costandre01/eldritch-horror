import type { GameState } from "../models/GameState";

import { endInvestigatorActions } from "./endInvestigatorActions";

export function endActionPhaseIfDelayed(
  game: GameState,
): GameState {
  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    return game;
  }

  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    return game;
  }

  if (!investigator.isDelayed) {
    return game;
  }

  if (game.phase !== "action") {
    return game;
  }

  /*
   * The investigator became Delayed during
   * the current Action Phase.
   *
   * They immediately lose the rest of
   * their actions.
   */
  return endInvestigatorActions(game);
}