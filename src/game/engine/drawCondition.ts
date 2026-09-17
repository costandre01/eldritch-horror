import type { GameState } from "../models/GameState";

export interface DrawConditionResult {
  game: GameState;
  conditionId: string | null;
}

export function drawCondition(
  game: GameState,
  conditionDefinitionId?: string,
): DrawConditionResult {
  /*
   * ============================================================
   * CONDITION DECK
   * ============================================================
   *
   * The Condition deck contains the physical Condition cards.
   *
   * Each entry is a physical card instance and therefore keeps
   * its own front/back image variant.
   *
   * We never draw from the discard pile here.
   */

  const deck =
    game.board.conditionDeck;

  /*
   * ============================================================
   * FIND CONDITION
   * ============================================================
   *
   * When a specific Condition definition is requested,
   * find one physical copy of that Condition in the deck.
   *
   * The physical card itself is removed, preserving the exact
   * front/back variant belonging to that card.
   *
   * When no specific definition is requested, draw the first
   * card from the shuffled deck.
   */

  let index = 0;

  if (conditionDefinitionId) {
    index = deck.findIndex(
      (id) => {
        const condition =
          game.conditions[id];

        return (
          condition !== undefined &&
          condition.definitionId ===
            conditionDefinitionId
        );
      },
    );

    /*
     * ==========================================================
     * CONDITION NOT AVAILABLE
     * ==========================================================
     */

    if (index === -1) {
      return {
        game,
        conditionId: null,
      };
    }
  }

  /*
   * ============================================================
   * EMPTY DECK
   * ============================================================
   */

  if (deck.length === 0) {
    return {
      game,
      conditionId: null,
    };
  }

  /*
   * ============================================================
   * DRAW PHYSICAL CARD
   * ============================================================
   */

  const conditionId =
    deck[index];

  if (!conditionId) {
    return {
      game,
      conditionId: null,
    };
  }

  const condition =
    game.conditions[conditionId];

  if (!condition) {
    throw new Error(
      `Condition "${conditionId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * REMOVE FROM DECK
   * ============================================================
   */

  const conditionDeck = [
    ...deck.slice(0, index),
    ...deck.slice(index + 1),
  ];

  /*
   * ============================================================
   * RESET CONDITION
   * ============================================================
   *
   * A physical Condition that returns to the deck must start
   * face-up again.
   */

  const conditions = {
    ...game.conditions,

    [conditionId]: {
      ...condition,

      flipped: false,
    },
  };

  /*
   * ============================================================
   * RETURN UPDATED GAME
   * ============================================================
   */

  return {
    game: {
      ...game,

      board: {
        ...game.board,

        conditionDeck,

        /*
         * Conditions are returned directly to the deck when
         * discarded. The discard pile is therefore not used
         * by drawCondition().
         */
        conditionDiscard:
          game.board.conditionDiscard,
      },

      conditions,
    },

    conditionId,
  };
}