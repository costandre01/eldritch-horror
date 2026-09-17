import type { GameState } from "../models/GameState";

export function flipCondition(
  game: GameState,
  conditionId: string,
): GameState {
  const condition =
    game.conditions[conditionId];

  if (!condition) {
    throw new Error(
      `Condition "${conditionId}" does not exist.`,
    );
  }

  return {
    ...game,

    conditions: {
      ...game.conditions,

      [conditionId]: {
        ...condition,

        flipped: !condition.flipped,
      },
    },
  };
}