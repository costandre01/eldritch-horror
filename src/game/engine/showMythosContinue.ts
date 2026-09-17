import type { GameState } from "../models/GameState";

export function showMythosContinue(
  game: GameState,
  nextIconIndex: number,
): GameState {
  return {
    ...game,

    pendingDecision: {
      type: "continue",

      title: "MYTHOS",

      message:
        "Continue resolving the Mythos card.",

      source:
        `mythos-card:${nextIconIndex}`,
    },
  };
}