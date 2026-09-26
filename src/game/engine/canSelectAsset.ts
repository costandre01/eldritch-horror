import type { GameState } from "../models/GameState";

export function canSelectAsset(
  game: GameState,
  _selectedAssetIds: string[],
  assetId: string,
  _useBankLoan: boolean,
): boolean {
  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    return false;
  }

  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    return false;
  }

  const asset =
    game.board.assetReserve.find(
      (item) =>
        item.id === assetId,
    );

  if (!asset) {
    return false;
  }

  /*
   * Selecting an Asset is independent
   * from being able to acquire it.
   *
   * The same selection is used for:
   *
   * - Acquire
   * - Discard 1
   *
   * Therefore affordability must NOT
   * block selection here.
   *
   * The Acquire button performs the
   * affordability validation separately.
   */

  return true;
}