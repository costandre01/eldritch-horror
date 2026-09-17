import type { GameState } from "../models/GameState";
import type { EncounterDefinition } from "../models/Encounter";
import type { EncounterDeckType } from "../models/BoardState";

export interface DrawEncounterResult {
  game: GameState;
  encounter: EncounterDefinition;
}

/*
 * ============================================================
 * SHUFFLE
 * ============================================================
 */

function shuffle<T>(
  items: T[],
): T[] {
  const shuffled = [...items];

  for (
    let i = shuffled.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() * (i + 1),
      );

    const current =
      shuffled[i];

    shuffled[i] =
      shuffled[j];

    shuffled[j] =
      current;
  }

  return shuffled;
}

/*
 * ============================================================
 * DRAW ENCOUNTER
 * ============================================================
 */

export function drawEncounter(
  game: GameState,
  deckType: EncounterDeckType,
): DrawEncounterResult {
  const deck =
    game.board.encounterDecks[
      deckType
    ];

  const discard =
    game.board.encounterDiscards[
      deckType
    ];

  /*
   * ==========================================================
   * VALIDATION
   * ==========================================================
   */

  if (!deck) {
    throw new Error(
      `Encounter deck "${deckType}" does not exist.`,
    );
  }

  if (!discard) {
    throw new Error(
      `Encounter discard "${deckType}" does not exist.`,
    );
  }

  /*
   * ==========================================================
   * PREPARE DECK
   * ==========================================================
   *
   * Normally we simply use the existing deck.
   *
   * If the deck is empty, the discard pile is shuffled
   * and becomes the new deck.
   *
   * This happens entirely inside the game engine.
   * The player does not see the reshuffle.
   */

  let workingDeck =
    deck;

  let workingDiscard =
    discard;

  if (
    workingDeck.length === 0
  ) {
    /*
     * If both are empty there is genuinely
     * nothing left to draw.
     */

    if (
      workingDiscard.length === 0
    ) {
      throw new Error(
        `Encounter deck "${deckType}" is empty and has no discarded cards to reshuffle.`,
      );
    }

    /*
     * Shuffle the entire discard pile.
     */

    workingDeck =
      shuffle(
        workingDiscard,
      );

    /*
     * All discarded cards are now back
     * inside the physical deck.
     */

    workingDiscard = [];
  }

  /*
   * ==========================================================
   * DRAW TOP CARD
   * ==========================================================
   *
   * The first element represents the top
   * of the physical deck.
   */

  const encounterId =
    workingDeck[0];

  if (!encounterId) {
    throw new Error(
      `Failed to draw an Encounter from the "${deckType}" deck.`,
    );
  }

  /*
   * ==========================================================
   * FIND ENCOUNTER
   * ==========================================================
   */

  const encounter =
    game.encounters[
      encounterId
    ];

  if (!encounter) {
    throw new Error(
      `Encounter "${encounterId}" does not exist.`,
    );
  }

  /*
   * ==========================================================
   * REMOVE TOP CARD
   * ==========================================================
   */

  const newDeck =
    workingDeck.slice(1);

  /*
   * ==========================================================
   * UPDATE GAME
   * ==========================================================
   */

  const currentGame: GameState = {
    ...game,

    board: {
      ...game.board,

      /*
       * Updated physical deck.
       */

      encounterDecks: {
        ...game.board
          .encounterDecks,

        [deckType]:
          newDeck,
      },

      /*
       * Updated discard pile.
       *
       * If a reshuffle happened, this will
       * correctly be [].
       */

      encounterDiscards: {
        ...game.board
          .encounterDiscards,

        [deckType]:
          workingDiscard,
      },
    },

    /*
     * ========================================================
     * CURRENT ENCOUNTER
     * ========================================================
     */

    currentEncounterId:
      encounter.id,

    currentEncounterBackId:
      null,

    currentEncounterRevealed:
      false,

    currentEncounterDeckType:
      deckType,
  };

  return {
    game:
      currentGame,

    encounter,
  };
}