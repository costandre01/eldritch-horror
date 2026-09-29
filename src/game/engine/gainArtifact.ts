import type { GameState } from "../models/GameState";
import { gainInvestigatorClues } from "./clueEngine";
import { drawArtifact } from "./drawArtifact";

export function gainArtifact(
  game: GameState,
  investigatorId: string,
  artifactId?: string,
): GameState {
  /*
   * ==========================================================
   * FIND INVESTIGATOR
   * ==========================================================
   */

  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * ==========================================================
   * DRAW ARTIFACT
   * ==========================================================
   */

  let result;

  if (artifactId) {
    let artifactIndex =
      game.board.artifactDeck.findIndex(
        (artifact) =>
          artifact.id === artifactId,
      );

    if (artifactIndex === -1) {
      artifactIndex = (game.board.artifactDiscard ?? []).findIndex(
        (artifact) => artifact.id === artifactId,
      );
      if (artifactIndex === -1) return game;

      const artifact = game.board.artifactDiscard?.[artifactIndex];
      if (!artifact) return game;
      result = {
        game: {
          ...game,
          board: {
            ...game.board,
            artifactDiscard: (game.board.artifactDiscard ?? []).filter(
              (_, index) => index !== artifactIndex,
            ),
          },
        },
        artifact,
      };
    } else {
      const artifact = game.board.artifactDeck[artifactIndex];

      if (!artifact) return game;

      const artifactDeck = [...game.board.artifactDeck];
      artifactDeck.splice(artifactIndex, 1);

      result = {
        game: {
          ...game,
          board: { ...game.board, artifactDeck },
        },
        artifact,
      };
    }
  } else {
    result = drawArtifact(game);
  }

  /*
   * ==========================================================
   * NO ARTIFACT AVAILABLE
   * ==========================================================
   */

  if (!result.artifact) {
    return result.game;
  }

  /*
   * ==========================================================
   * GIVE ARTIFACT TO INVESTIGATOR
   * ==========================================================
   */

  const artifactIds = [
    ...investigator.artifactIds,
    result.artifact.id,
  ];

  /*
   * ==========================================================
   * RETURN UPDATED GAME
   * ==========================================================
   */

  const gameAfterClues = result.artifact.name === "Grotesque Statue"
    ? gainInvestigatorClues(result.game, investigatorId, 5)
    : result.game;
  const updatedInvestigator = {
    ...gameAfterClues.investigators[investigatorId],
    artifactIds,
    // Grotesque Statue grants its clues only when it is drawn from the
    // Artifact deck. `gainArtifact` is the deck-draw path; trading an
    // existing Artifact does not pass through here.
  };

  return {
    ...gameAfterClues,

    ...(!artifactId ? {
      cardRevealQueue: [
        ...(gameAfterClues.cardRevealQueue ?? []),
        {
          id: result.artifact.id,
          kind: "Artifact" as const,
          name: result.artifact.name,
          image: result.artifact.image,
          description: result.artifact.description,
        },
      ],
    } : {}),

    investigators: {
      ...gameAfterClues.investigators,

      [investigatorId]: {
        ...updatedInvestigator,
      },
    },
  };
}
