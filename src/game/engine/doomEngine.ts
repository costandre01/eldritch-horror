import type { GameState } from "../models/GameState";

export function advanceDoom(
  game: GameState,
  amount: number,
): GameState {
  const doomAdvance = Math.max(0, amount);

  if (doomAdvance === 0) {
    return game;
  }

  /*
   * Doom advances toward 0.
   *
   * Example:
   *
   * Doom 5 + Advance Doom 2
   *        ↓
   * Doom 3
   */

  const newDoom = Math.max(
    0,
    game.ancientOne.doom - doomAdvance,
  );

  const ancientOneAwakens =
    !game.ancientOne.awakened &&
    newDoom === 0;

  return {
    ...game,

    ancientOne: {
      ...game.ancientOne,

      doom: newDoom,

      awakened:
        ancientOneAwakens
          ? true
          : game.ancientOne.awakened,
    },
  };
}