import type { GameState } from "../models/GameState";

/** A player cannot gain a second copy of a Spell with the same name. */
export function getGainableSpellIds(
  game: GameState,
  investigatorId: string,
): string[] {
  const investigator = game.investigators[investigatorId];
  if (!investigator) return [];

  const ownedDefinitions = new Set(
    investigator.spellIds
      .map((id) => game.spells[id]?.definitionId)
      .filter((id): id is string => id !== undefined),
  );
  const offeredDefinitions = new Set<string>();

  return game.board.spellDeck
    .filter((spell) => {
      if (
        ownedDefinitions.has(spell.definitionId) ||
        offeredDefinitions.has(spell.definitionId)
      ) {
        return false;
      }
      offeredDefinitions.add(spell.definitionId);
      return true;
    })
    .map((spell) => spell.id);
}
