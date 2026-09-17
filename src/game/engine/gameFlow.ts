import type { GameState } from "../models/GameState";

export function clearPendingDecision(
  game: GameState,
): GameState {
  return {
    ...game,

    pendingDecision: null,
  };
}

export function setPendingDecision(
  game: GameState,
  decision: NonNullable<
    GameState["pendingDecision"]
  >,
): GameState {
  return {
    ...game,

    pendingDecision: decision,
  };
}