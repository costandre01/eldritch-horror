import {
  describe,
  expect,
  it,
} from "vitest";

import {
  discardAsset,
} from "../engine/discardAsset";

import {
  discardCondition,
} from "../engine/discardCondition";

import {
  advanceDoom,
} from "../engine/doomEngine";

import {
  createTestGame,
} from "./helpers/createTestGame";

describe("discardAsset", () => {
  it("removes the Asset from the active Investigator and adds it to the discard pile", () => {
    const game =
      createTestGame();

    const asset = {
      id: "asset-test",
      name: "Test Asset",
      type: "item" as const,
      traits: [],
      value: 2,
      description: "Test asset",
    };

    game.assets = {
      "asset-test": asset,
    };

    game.investigators[
      "investigator-1"
    ].assetIds = [
      "asset-test",
    ];

    game.board.assetDiscard = [];

    const result =
      discardAsset(
        game,
        "asset-test",
      );

    expect(
      result.investigators[
        "investigator-1"
      ].assetIds,
    ).toEqual([]);

    expect(
      result.board.assetDiscard,
    ).toEqual([
      asset,
    ]);
  });

  it("preserves existing discarded Assets", () => {
    const game =
      createTestGame();

    const existingAsset = {
      id: "asset-existing",
      name: "Existing Asset",
      type: "item" as const,
      traits: [],
      value: 1,
      description: "Existing asset",
    };

    const asset = {
      id: "asset-test",
      name: "Test Asset",
      type: "item" as const,
      traits: [],
      value: 2,
      description: "Test asset",
    };

    game.assets = {
      "asset-test": asset,
    };

    game.investigators[
      "investigator-1"
    ].assetIds = [
      "asset-test",
    ];

    game.board.assetDiscard = [
      existingAsset,
    ];

    const result =
      discardAsset(
        game,
        "asset-test",
      );

    expect(
      result.board.assetDiscard,
    ).toEqual([
      existingAsset,
      asset,
    ]);
  });

  it("does not change the Asset Reserve", () => {
    const game =
      createTestGame();

    const asset = {
      id: "asset-test",
      name: "Test Asset",
      type: "item" as const,
      traits: [],
      value: 2,
      description: "Test asset",
    };

    const reserveAsset = {
      id: "asset-reserve",
      name: "Reserve Asset",
      type: "item" as const,
      traits: [],
      value: 3,
      description: "Reserve asset",
    };

    game.assets = {
      "asset-test": asset,
    };

    game.investigators[
      "investigator-1"
    ].assetIds = [
      "asset-test",
    ];

    game.board.assetDiscard = [];

    game.board.assetReserve = [
      reserveAsset,
    ];

    const result =
      discardAsset(
        game,
        "asset-test",
      );

    expect(
      result.board.assetReserve,
    ).toEqual([
      reserveAsset,
    ]);
  });

  it("clears lastTest", () => {
    const game =
      createTestGame();

    const asset = {
      id: "asset-test",
      name: "Test Asset",
      type: "item" as const,
      traits: [],
      value: 2,
      description: "Test asset",
    };

    game.assets = {
      "asset-test": asset,
    };

    game.investigators[
      "investigator-1"
    ].assetIds = [
      "asset-test",
    ];

    game.board.assetDiscard = [];

    game.lastTest = {
        skill: "will",
        modifier: 0,
        difficulty: 1,
        diceRolled: 1,
        results: [5],
        successes: 1,
        passed: true,
    };

    const result =
      discardAsset(
        game,
        "asset-test",
      );

    expect(
      result.lastTest,
    ).toBeNull();
  });

  it("throws when there is no active Investigator", () => {
    const game =
      createTestGame();

    game.activeInvestigatorId =
      null;

    expect(() =>
      discardAsset(
        game,
        "asset-test",
      ),
    ).toThrow(
      "There is no active investigator.",
    );
  });

  it("throws when the active Investigator does not exist", () => {
    const game =
      createTestGame();

    game.activeInvestigatorId =
      "investigator-does-not-exist";

    expect(() =>
      discardAsset(
        game,
        "asset-test",
      ),
    ).toThrow(
      'Investigator "investigator-does-not-exist" does not exist.',
    );
  });

  it("throws when the Asset is not owned by the active Investigator", () => {
    const game =
      createTestGame();

    expect(() =>
      discardAsset(
        game,
        "asset-test",
      ),
    ).toThrow(
      'Asset "asset-test" is not owned by Investigator "investigator-1".',
    );
  });

  it("throws when the owned Asset does not exist", () => {
    const game =
      createTestGame();

    game.investigators[
      "investigator-1"
    ].assetIds = [
      "asset-test",
    ];

    expect(() =>
      discardAsset(
        game,
        "asset-test",
      ),
    ).toThrow(
      'Asset "asset-test" does not exist.',
    );
  });
});

describe("discardCondition", () => {
  it("removes the Condition from the Investigator and adds it to the discard pile", () => {
    const game =
      createTestGame();

    const condition = {
      id: "condition-test",
      definitionId: "condition-amnesia",
      instanceNumber: 1,
      frontImage: "/condition.png",
      backImage: "/condition-back.png",
      backId: "condition-back",
      flipped: false,
    };

    game.conditions = {
      "condition-test": condition,
    };

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-test",
    ];

    game.board.conditionDiscard = [];

    const result =
      discardCondition(
        game,
        "investigator-1",
        "condition-test",
      );

    expect(
      result.investigators[
        "investigator-1"
      ].conditionIds,
    ).toEqual([]);

    expect(
      result.board.conditionDiscard,
    ).toEqual([
      "condition-test",
    ]);
  });

  it("preserves existing discarded Conditions", () => {
    const game =
      createTestGame();

    const condition = {
      id: "condition-test",
      definitionId: "condition-amnesia",
      instanceNumber: 1,
      frontImage: "/condition.png",
      backImage: "/condition-back.png",
      backId: "condition-back",
      flipped: false,
    };

    game.conditions = {
      "condition-test": condition,
    };

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-test",
    ];

    game.board.conditionDiscard = [
      "condition-existing",
    ];

    const result =
      discardCondition(
        game,
        "investigator-1",
        "condition-test",
      );

    expect(
      result.board.conditionDiscard,
    ).toEqual([
      "condition-existing",
      "condition-test",
    ]);
  });

  it("throws when the Investigator does not exist", () => {
    const game =
      createTestGame();

    expect(() =>
      discardCondition(
        game,
        "investigator-does-not-exist",
        "condition-test",
      ),
    ).toThrow(
      'Investigator "investigator-does-not-exist" does not exist.',
    );
  });

  it("throws when the Investigator does not own the Condition", () => {
    const game =
      createTestGame();

    expect(() =>
      discardCondition(
        game,
        "investigator-1",
        "condition-test",
      ),
    ).toThrow(
      'Condition "condition-test" is not associated with investigator "investigator-1".',
    );
  });

  it("throws when the owned Condition does not exist", () => {
    const game =
      createTestGame();

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-test",
    ];

    expect(() =>
      discardCondition(
        game,
        "investigator-1",
        "condition-test",
      ),
    ).toThrow(
      'Condition "condition-test" does not exist.',
    );
  });
});

describe("advanceDoom", () => {
  it("advances Doom toward zero", () => {
    const game =
      createTestGame();

    game.ancientOne.doom = 5;
    game.ancientOne.awakened = false;

    const result =
      advanceDoom(
        game,
        2,
      );

    expect(
      result.ancientOne.doom,
    ).toBe(3);

    expect(
      result.ancientOne.awakened,
    ).toBe(false);
  });

  it("does not allow Doom to go below zero", () => {
    const game =
      createTestGame();

    game.ancientOne.doom = 2;
    game.ancientOne.awakened = false;

    const result =
      advanceDoom(
        game,
        5,
      );

    expect(
      result.ancientOne.doom,
    ).toBe(0);
  });

  it("awakens the Ancient One when Doom reaches zero", () => {
    const game =
      createTestGame();

    game.ancientOne.doom = 2;
    game.ancientOne.awakened = false;

    const result =
      advanceDoom(
        game,
        2,
      );

    expect(
      result.ancientOne.doom,
    ).toBe(0);

    expect(
      result.ancientOne.awakened,
    ).toBe(true);
  });

  it("does nothing when the amount is zero", () => {
    const game =
      createTestGame();

    game.ancientOne.doom = 5;
    game.ancientOne.awakened = false;

    const result =
      advanceDoom(
        game,
        0,
      );

    expect(result).toBe(game);
  });

  it("does nothing when the amount is negative", () => {
    const game =
      createTestGame();

    game.ancientOne.doom = 5;
    game.ancientOne.awakened = false;

    const result =
      advanceDoom(
        game,
        -3,
      );

    expect(result).toBe(game);
  });

  it("preserves an Ancient One that is already awakened", () => {
    const game =
      createTestGame();

    game.ancientOne.doom = 5;
    game.ancientOne.awakened = true;

    const result =
      advanceDoom(
        game,
        2,
      );

    expect(
      result.ancientOne.doom,
    ).toBe(3);

    expect(
      result.ancientOne.awakened,
    ).toBe(true);
  });
});