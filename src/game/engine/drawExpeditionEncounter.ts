import type { GameState } from "../models/GameState";
import type { EncounterDefinition } from "../models/Encounter";

export interface DrawExpeditionEncounterResult {
  game: GameState;
  encounter: EncounterDefinition;
}

export function drawExpeditionEncounter(
  game: GameState,
  expeditionName: string,
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
   * FIND ENCOUNTERS FOR THIS EXPEDITION
   * ============================================================
   *
   * The Expedition deck contains all Expedition Encounters.
   *
   * Only Encounters belonging to the current Expedition
   * may be drawn.
   */

  const matchingIds =
    deck.filter(
      (encounterId: string) =>
        game.encounters[
          encounterId
        ]?.name === expeditionName,
    );

  if (matchingIds.length === 0) {
    throw new Error(
      `No Expedition Encounters exist for "${expeditionName}".`,
    );
  }

  /*
   * ============================================================
   * DRAW RANDOM ENCOUNTER
   * ============================================================
   */

  const randomIndex =
    Math.floor(
      Math.random() *
        matchingIds.length,
    );

  const encounterId =
    matchingIds[randomIndex];

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
   * REMOVE FROM DECK
   * ============================================================
   */

  const deckIndex =
    deck.indexOf(encounterId);

  if (deckIndex === -1) {
    throw new Error(
      `Expedition Encounter "${encounterId}" was not found in the deck.`,
    );
  }

  const newDeck = [
    ...deck.slice(
      0,
      deckIndex,
    ),

    ...deck.slice(
      deckIndex + 1,
    ),
  ];

  /*
   * ============================================================
   * UPDATE GAME
   * ============================================================
   *
   * The card is now considered drawn from the physical
   * Expedition Encounter deck.
   *
   * The source deck is stored in GameState so that the
   * card can later be returned to the correct discard pile.
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
      encounter.region === "research",

    currentEncounterDeckType:
      "expedition",
  };

  return {
    game: currentGame,

    encounter,
  };
}