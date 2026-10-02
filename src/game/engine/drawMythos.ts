import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";
import { finishEmptyMythosPhase } from "./finishEmptyMythosPhase";

export function drawMythos(
  game: GameState,
  map: MapDefinition = eldritchBaseMap,
): GameState {
  /*
   * ============================================================
   * VALIDATION
   * ============================================================
   */

  if (game.phase !== "mythos") {
    throw new Error(
      "A Mythos card can only be drawn during the Mythos phase.",
    );
  }

  /*
   * ============================================================
   * DECK
   * ============================================================
   */

  if (game.board.mythosDeck.length === 0) {
    return finishEmptyMythosPhase(game, map);
  }

  /*
   * ============================================================
   * DRAW
   * ============================================================
   *
   * The first card in the deck is the top card.
   *
   * The card is removed from the deck and stored
   * as the currently revealed Mythos card.
   *
   * It is NOT placed in the discard pile yet.
   *
   * The Mythos resolver will decide whether the card
   * becomes an ongoing/rumer card in play or goes
   * to the discard pile after resolution.
   */

  const [mythosCard, ...remainingDeck] =
    game.board.mythosDeck;

  return {
    ...game,

    currentMythosId:
      mythosCard.id,

    board: {
      ...game.board,

      mythosDeck:
        remainingDeck,
    },
  };
}
