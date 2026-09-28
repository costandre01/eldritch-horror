import type { GameState } from "../models/GameState";

export function discardSpell(
  game: GameState,
  investigatorId: string,
  spellId: string,
): GameState {
  const investigator = game.investigators[investigatorId];
  const spell = game.spells[spellId];
  if (!investigator || !spell || !investigator.spellIds.includes(spellId)) {
    return game;
  }

  const returnedSpell = {
    ...spell,
    flipped: false,
    exhausted: false,
    pendingTestResult: null,
    pendingChosenInvestigatorId: null,
    pendingChosenMonsterId: null,
    pendingChosenClueId: null,
  };
  const spellDeck = [...game.board.spellDeck, returnedSpell];
  for (let index = spellDeck.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [spellDeck[index], spellDeck[randomIndex]] = [spellDeck[randomIndex], spellDeck[index]];
  }

  return {
    ...game,
    spells: { ...game.spells, [spellId]: returnedSpell },
    investigators: {
      ...game.investigators,
      [investigatorId]: {
        ...investigator,
        spellIds: investigator.spellIds.filter((id) => id !== spellId),
      },
    },
    board: {
      ...game.board,
      spellDeck,
      spellDiscard: game.board.spellDiscard.filter((item) => item.id !== spellId),
    },
  };
}
