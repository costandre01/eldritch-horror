import type { GameState } from "../models/GameState";

/** Discard an Asset from the market reserve before it is acquired. */
export function discardAssetFromReserve(
  game: GameState,
  assetId: string,
): GameState {
  const assetIndex = game.board.assetReserve.findIndex((asset) => asset.id === assetId);
  if (assetIndex < 0) {
    throw new Error(`Asset "${assetId}" is not in the Asset Reserve.`);
  }

  const asset = game.board.assetReserve[assetIndex];
  if (!asset) {
    throw new Error(`Asset "${assetId}" does not exist in the Asset Reserve.`);
  }

  return {
    ...game,
    board: {
      ...game.board,
      assetReserve: game.board.assetReserve.filter((candidate) => candidate.id !== assetId),
      assetDiscard: [...game.board.assetDiscard, asset],
    },
    lastTest: null,
  };
}
