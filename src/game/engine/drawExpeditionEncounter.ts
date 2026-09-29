import type { GameState } from "../models/GameState";
import type { EncounterDefinition } from "../models/Encounter";

export interface DrawExpeditionEncounterResult {
  game: GameState;
  encounter: EncounterDefinition;
}

export function drawExpeditionEncounter(
  game: GameState,
): DrawExpeditionEncounterResult {
  const deck =
    game.board.encounterDecks.expedition;

  /*
   * ============================================================
   * EMPTY DECK
   * ============================================================
   */

  if (deck.length === 0) {
    throw new Error(
      "Expedition Encounter deck is empty.",
    );
  }

  /*
   * ============================================================
   * DRAW TOP CARD
   * ============================================================
   *
   * The Active Expedition is determined by the top card of the
   * Expedition Encounter deck.
   *
   * Therefore an Expedition Encounter always draws the top card.
   * We must never search the deck for another card matching the
   * investigator's current space.
   */

  const encounterId = deck[0];

  if (!encounterId) {
    throw new Error(
      "Failed to draw Expedition Encounter.",
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
   * ============================================================
   * REMOVE TOP CARD
   * ============================================================
   */

  const newDeck =
    deck.slice(1);

  /*
   * ============================================================
   * UPDATE GAME
   * ============================================================
   *
   * The card remains the current Encounter until it has been
   * completely resolved.
   *
   * At that point it will be discarded and the Active Expedition
   * will be synchronized with the new top card.
   */

  const currentGame: GameState = {
    ...game,

    board: {
      ...game.board,

      encounterDecks: {
        ...game.board.encounterDecks,

        expedition:
          newDeck,
      },
    },

    currentEncounterId:
      encounter.id,

    currentEncounterBackId:
      null,

    currentEncounterRevealed:
      false,

    currentEncounterIsResearch:
      false,

    currentEncounterDeckType:
      "expedition",
  };

  return {
    game: currentGame,
    encounter,
  };
}