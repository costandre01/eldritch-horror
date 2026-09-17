import type { GameState } from "../models/GameState";

export function flipSpell(
  game: GameState,
  spellId: string,
): GameState {
  const spell =
    game.spells[spellId];

  if (!spell) {
    throw new Error(
      `Spell "${spellId}" does not exist.`,
    );
  }

  return {
    ...game,

    spells: {
      ...game.spells,

      [spellId]: {
        ...spell,

        flipped:
          !spell.flipped,
      },
    },
  };
}