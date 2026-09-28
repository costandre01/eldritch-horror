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
  let currentGame = game;

  /*
   * ==========================================================
   * EMPTY DECK
   * ==========================================================
   */

  if (currentGame.board.artifactDeck.length === 0) {
    const artifactDeck = [...(currentGame.board.artifactDiscard ?? [])];
    if (artifactDeck.length > 0) {
      for (let index = artifactDeck.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [artifactDeck[index], artifactDeck[randomIndex]] =
          [artifactDeck[randomIndex], artifactDeck[index]];
      }
      currentGame = {
        ...currentGame,
        board: {
          ...currentGame.board,
          artifactDeck,
          artifactDiscard: [],
        },
      };
    }
  }

  if (currentGame.board.artifactDeck.length === 0) {
    return { game: currentGame, artifact: null };
  }

  /*
   * ==========================================================
   * DRAW RANDOM CARD
   * ==========================================================
   */

  const index =
    Math.floor(
      Math.random() *
        currentGame.board.artifactDeck.length,
    );

  const artifact =
    currentGame.board.artifactDeck[index];

  if (!artifact) {
    return {
      game: currentGame,
      artifact: null,
    };
  }

  /*
   * ==========================================================
   * REMOVE FROM DECK
   * ==========================================================
   */

  const artifactDeck =
    currentGame.board.artifactDeck.filter(
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
      ...currentGame,

      board: {
        ...currentGame.board,

        artifactDeck,
      },
    },

    artifact,
  };
}
