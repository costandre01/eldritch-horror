import type { GameState } from "../models/GameState";

export function canSelectAsset(
  game: GameState,
  selectedAssetIds: string[],
  assetId: string,
  useBankLoan: boolean,
): boolean {
  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    return false;
  }

  const investigator =
    game.investigators[
      investigatorId
    ];

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
   * ============================================================
   * CURRENT SELECTION
   * ============================================================
   */

  const selectedAssets =
    game.board.assetReserve.filter(
      (item) =>
        selectedAssetIds.includes(
          item.id,
        ),
    );

  const selectedValue =
    selectedAssets.reduce(
      (total, item) =>
        total + item.value,
      0,
    );

  /*
   * ============================================================
   * BANK LOAN
   * ============================================================
   */

  const effectiveSuccesses =
    (game.lastTest?.successes ?? 0) +
    (useBankLoan ? 2 : 0);

  /*
   * ============================================================
   * NEW SELECTION
   * ============================================================
   */

  const newSelectedValue =
    selectedValue +
    asset.value;

  const resourcesNeeded =
    Math.max(
      0,
      newSelectedValue -
        effectiveSuccesses,
    );

  /*
   * ============================================================
   * AFFORDABILITY
   * ============================================================
   */

  return (
    resourcesNeeded <=
    investigator.resources
  );
}