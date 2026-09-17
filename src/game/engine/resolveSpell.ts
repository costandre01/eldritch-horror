import type { GameState } from "../models/GameState";

import { coreSpells } from "../../content/core/coreSpell";

import { resolveSpellBackEffects } from "./resolveSpellBackEffects";

export function resolveSpell(
  game: GameState,
  investigatorId: string,
  spellId: string,
): GameState {
  /*
   * ============================================================
   * INVESTIGATOR
   * ============================================================
   */

  const investigator =
    game.investigators[
      investigatorId
    ];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * SPELL
   * ============================================================
   */

  const spell =
    game.spells[spellId];

  if (!spell) {
    throw new Error(
      `Spell "${spellId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * OWNERSHIP
   * ============================================================
   */

  if (
    !investigator.spellIds.includes(
      spellId,
    )
  ) {
    throw new Error(
      `Spell "${spellId}" is not associated with investigator "${investigatorId}".`,
    );
  }

  /*
   * ============================================================
   * SPELL MUST BE FLIPPED
   * ============================================================
   */

  if (!spell.flipped) {
    throw new Error(
      "Spell must be flipped before it can be resolved.",
    );
  }

  /*
   * ============================================================
   * DEFINITION
   * ============================================================
   */

  const definition =
    coreSpells.find(
      (item) =>
        item.id ===
        spell.definitionId,
    );

  if (!definition) {
    throw new Error(
      `Spell definition "${spell.definitionId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * SPECIFIC BACK
   * ============================================================
   */

  const back =
    definition.backs.find(
      (item) =>
        item.id ===
        spell.backId,
    );

  if (!back) {
    throw new Error(
      `Spell back "${spell.backId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * RESOLVE
   * ============================================================
   */

  return resolveSpellBackEffects({
    game,
    investigatorId,
    spellId,
    effects: back.effects,
  });
}