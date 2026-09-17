import type { GameState } from "../models/GameState";

export function discardArtifact(
  game: GameState,
  investigatorId: string,
  artifactId: string,
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
   * CHECK OWNERSHIP
   * ==========================================================
   */

  if (
    !investigator.artifactIds.includes(
      artifactId,
    )
  ) {
    throw new Error(
      `Artifact "${artifactId}" is not associated with investigator "${investigatorId}".`,
    );
  }

  /*
   * ==========================================================
   * CHECK ARTIFACT EXISTS
   * ==========================================================
   */

  const artifact =
    game.artifacts[artifactId];

  if (!artifact) {
    throw new Error(
      `Artifact "${artifactId}" does not exist.`,
    );
  }

  /*
   * ==========================================================
   * REMOVE ARTIFACT FROM INVESTIGATOR
   * ==========================================================
   */

  const artifactIds =
    investigator.artifactIds.filter(
      (id) => id !== artifactId,
    );

  /*
   * ==========================================================
   * ADD ARTIFACT TO DISCARD
   * ==========================================================
   */

  const artifactDiscard = [
    ...game.board.artifactDiscard,
    artifact,
  ];

  /*
   * ==========================================================
   * RETURN UPDATED GAME
   * ==========================================================
   */

  return {
    ...game,

    board: {
      ...game.board,

      artifactDiscard,
    },

    investigators: {
      ...game.investigators,

      [investigatorId]: {
        ...investigator,

        artifactIds,
      },
    },
  };
}