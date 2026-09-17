import type { GameState } from "../models/GameState";
import type { Artifact } from "../models/Artifact";

/*
 * ============================================================
 * DRAW ARTIFACT RESULT
 * ============================================================
 */

export interface DrawArtifactResult {
  game: GameState;
  artifact: Artifact | null;
}

/*
 * ============================================================
 * DRAW ARTIFACT
 * ============================================================
 *
 * Draws one Artifact from the Artifact deck.
 *
 * Unlike Conditions, Artifacts do not currently need to be
 * searched by definitionId.
 *
 * The Artifact itself is the physical card.
 */

export function drawArtifact(
  game: GameState,
): DrawArtifactResult {
  /*
   * ==========================================================
   * EMPTY DECK
   * ==========================================================
   */

  if (
    game.board.artifactDeck.length === 0
  ) {
    return {
      game,
      artifact: null,
    };
  }

  /*
   * ==========================================================
   * DRAW RANDOM CARD
   * ==========================================================
   */

  const index =
    Math.floor(
      Math.random() *
        game.board.artifactDeck.length,
    );

  const artifact =
    game.board.artifactDeck[index];

  if (!artifact) {
    return {
      game,
      artifact: null,
    };
  }

  /*
   * ==========================================================
   * REMOVE FROM DECK
   * ==========================================================
   */

  const artifactDeck =
    game.board.artifactDeck.filter(
      (_, artifactIndex) =>
        artifactIndex !== index,
    );

  /*
   * ==========================================================
   * RETURN UPDATED GAME
   * ==========================================================
   */

  return {
    game: {
      ...game,

      board: {
        ...game.board,

        artifactDeck,
      },
    },

    artifact,
  };
}