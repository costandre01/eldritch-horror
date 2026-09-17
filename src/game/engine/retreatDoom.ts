import type { GameState } from "../models/GameState";

export function retreatDoom(
  game: GameState,
  amount: number,
): GameState {
  const doomRetreat =
    Math.max(0, amount);

  if (doomRetreat === 0) {
    return game;
  }

  /*
   * Doom cannot retreat after the Ancient One
   * has awakened.
   */

  if (game.ancientOne.awakened) {
    return game;
  }

  return {
    ...game,

    ancientOne: {
      ...game.ancientOne,

      doom:
        game.ancientOne.doom +
        doomRetreat,
    },
  };
}