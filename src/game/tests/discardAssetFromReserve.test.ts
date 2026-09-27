import { describe, expect, it } from "vitest";

import { discardAssetFromReserve } from "../engine/discardAssetFromReserve";
import { createTestGame } from "./helpers/createTestGame";

describe("discardAssetFromReserve", () => {
  it("moves a selected reserve Asset to the discard pile without changing investigator possessions", () => {
    const game = createTestGame();
    const reserveAsset = {
      id: "reserve-asset",
      name: "Reserve Asset",
      type: "item" as const,
      traits: [],
      value: 2,
      description: "A market card.",
    };
    const ownedAsset = {
      id: "owned-asset",
      name: "Owned Asset",
      type: "item" as const,
      traits: [],
      value: 1,
      description: "An investigator card.",
    };
    game.board.assetReserve = [reserveAsset];
    game.board.assetDiscard = [];
    game.investigators["investigator-1"]!.assetIds = [ownedAsset.id];
    game.assets[ownedAsset.id] = ownedAsset;

    const result = discardAssetFromReserve(game, reserveAsset.id);

    expect(result.board.assetReserve).toEqual([]);
    expect(result.board.assetDiscard).toEqual([reserveAsset]);
    expect(result.investigators["investigator-1"]?.assetIds).toEqual([ownedAsset.id]);
  });

  it("rejects an Asset that is not in the reserve without mutating state", () => {
    const game = createTestGame();
    game.board.assetReserve = [];
    game.board.assetDiscard = [];

    expect(() => discardAssetFromReserve(game, "missing-asset")).toThrow(
      'Asset "missing-asset" is not in the Asset Reserve.',
    );
    expect(game.board.assetDiscard).toEqual([]);
  });
});
