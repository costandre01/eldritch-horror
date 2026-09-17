import type { GameState } from "../models/GameState";
import type { EncounterEffect } from "../models/Encounter";

export function getCurrentEncounterEffects(
  game: GameState,
): EncounterEffect[] {
  const encounterId =
    game.currentEncounterId;

  if (!encounterId) {
    throw new Error(
      "There is no active Encounter.",
    );
  }

  const encounter =
    game.encounters[encounterId];

  if (!encounter) {
    throw new Error(
      `Encounter "${encounterId}" does not exist.`,
    );
  }

  /*
   * ==========================================================
   * CARD ENCOUNTER
   * ==========================================================
   */

  if (
    encounter.backs &&
    encounter.backs.length > 0
  ) {
    const backId =
      game.currentEncounterBackId;

    if (!backId) {
      throw new Error(
        `Encounter "${encounter.id}" has no selected card back.`,
      );
    }

    const back =
      encounter.backs.find(
        (item) =>
          item.id === backId,
      );

    if (!back) {
      throw new Error(
        `Encounter back "${backId}" does not exist.`,
      );
    }

    return back.effects;
  }

  /*
   * ==========================================================
   * OLD ENCOUNTER FORMAT
   * ==========================================================
   */

  return encounter.effects ?? [];
}