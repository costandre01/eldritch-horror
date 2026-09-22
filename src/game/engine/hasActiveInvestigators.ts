import type { GameState } from "../models/GameState";

export function hasActiveInvestigators(
  game: GameState,
): boolean {
  return Object.values(
    game.investigators,
  ).some(
    (investigator) =>
      !investigator.isDefeated,
  );
}