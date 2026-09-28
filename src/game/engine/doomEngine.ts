import type { GameState } from "../models/GameState";
import type { FinalMysteryId } from "../models/FinalMystery";

function getFinalMysteryId(ancientOneId: string): FinalMysteryId | null {
  switch (ancientOneId) {
    case "azathoth": return "azathoth-world-is-devoured";
    case "cthulhu": return "cthulhu-risen-from-the-sea";
    case "shub-niggurath": return "shub-niggurath-battle-in-the-woods";
    case "yog-sothoth": return "yog-sothoth-the-key-and-the-gate";
    default: return null;
  }
}

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

    finalMystery: ancientOneAwakens && getFinalMysteryId(game.ancientOne.id)
      ? { id: getFinalMysteryId(game.ancientOne.id)!, eldritchTokenCount: 0 }
      : game.finalMystery,

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
