import type { GameState } from "../models/GameState";

export function discardAsset(
  game: GameState,
  assetId: string,
): GameState {
  /*
   * The Asset must currently be in
   * the Asset Reserve.
   *
   * This function is used from the
   * Acquire Assets modal, before the
   * Asset is acquired by an investigator.
   */

  const assetIndex =
    game.board.assetReserve.findIndex(
      (asset) =>
        asset.id === assetId,
    );

  if (assetIndex === -1) {
    throw new Error(
      `Asset "${assetId}" is not in the Asset Reserve.`,
    );
  }

  const asset =
    game.board.assetReserve[
      assetIndex
    ];

  /*
   * Remove the Asset from the Reserve.
   */

  const assetReserve =
    game.board.assetReserve.filter(
      (asset) =>
        asset.id !== assetId,
    );

  /*
   * Put the Asset in the discard pile.
   */

  const assetDiscard = [
    ...game.board.assetDiscard,
    asset,
  ];

  return {
    ...game,

    board: {
      ...game.board,

      assetReserve,

      assetDiscard,
    },

    lastTest: null,
  };
}