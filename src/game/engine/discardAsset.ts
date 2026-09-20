import type { GameState } from "../models/GameState";

export function discardAsset(
  game: GameState,
  assetId: string,
): GameState {
  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    throw new Error(
      "There is no active investigator.",
    );
  }

  if (!game.lastTest) {
    throw new Error(
      "There is no active test.",
    );
  }

  if (
    game.lastTest.skill !==
    "influence"
  ) {
    throw new Error(
      "The current test is not an Influence test.",
    );
  }

  const investigator =
    game.investigators[
      investigatorId
    ];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * The Asset must be owned by the Investigator.
   */

  if (
    !investigator.assetIds.includes(
      assetId,
    )
  ) {
    throw new Error(
      `Asset "${assetId}" is not owned by Investigator "${investigatorId}".`,
    );
  }

  const asset =
    game.assets[assetId];

  if (!asset) {
    throw new Error(
      `Asset "${assetId}" does not exist.`,
    );
  }

  /*
   * Remove the Asset from the Investigator.
   */

  const assetIds =
    investigator.assetIds.filter(
      (id) =>
        id !== assetId,
    );

  /*
   * Add the Asset to the discard pile.
   *
   * The Asset Reserve is NOT changed.
   * This Asset was already owned by the Investigator.
   */

  const assetDiscard = [
    ...game.board.assetDiscard,
    asset,
  ];

  return {
    ...game,

    investigators: {
      ...game.investigators,

      [investigatorId]: {
        ...investigator,

        assetIds,
      },
    },

    board: {
      ...game.board,

      assetDiscard,
    },

    lastTest: null,
  };
}