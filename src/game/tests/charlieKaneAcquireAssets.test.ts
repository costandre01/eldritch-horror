import {
  describe,
  expect,
  it,
} from "vitest";

import { coreAssets } from "../../content/core/coreAssets";
import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";
import { confirmAcquireAssets } from "../engine/confirmAcquireAssets";
import { resolveGameFlowChoice } from "../engine/resolveGameFlowChoice";
import type { GameState } from "../models/GameState";
import { createTestGame } from "./helpers/createTestGame";

function createAcquireAssetsGame(): GameState {
  const game = createTestGame();
  const revolver = coreAssets.find(
    (asset) => asset.id === "asset-38-revolver",
  );
  const automatic = coreAssets.find(
    (asset) => asset.id === "asset-45-automatic",
  );
  const privateCare = coreAssets.find(
    (asset) => asset.name === "Private Care",
  );
  const sanctuary = coreAssets.find(
    (asset) => asset.name === "Sanctuary",
  );

  if (!revolver || !automatic || !privateCare || !sanctuary) {
    throw new Error("The test Assets are missing from the core set.");
  }

  return {
    ...game,
    activeInvestigatorId: "investigator-1",
    investigators: {
      ...game.investigators,
      "investigator-1": {
        ...game.investigators["investigator-1"],
        definitionId: "charlie-kane",
      },
      "investigator-3": {
        ...game.investigators["investigator-3"],
        isDefeated: true,
      },
    },
    assets: {
      [revolver.id]: revolver,
      [automatic.id]: automatic,
      [privateCare.id]: privateCare,
      [sanctuary.id]: sanctuary,
    },
    board: {
      ...game.board,
      assetReserve: [revolver, automatic, privateCare, sanctuary],
      assetDeck: [],
      assetDiscard: [],
      conditionDeck: [],
    },
    lastTest: {
      skill: "influence",
      modifier: 0,
      difficulty: 1,
      diceRolled: 4,
      results: [6, 6, 6, 6],
      successes: 4,
      passed: true,
    },
    pendingDecision: null,
  };
}

describe("Charlie Kane — Acquire Assets", () => {
  it("lets Charlie give each purchased card to another investigator", () => {
    const game = createAcquireAssetsGame();

    const afterPurchase = confirmAcquireAssets(
      game,
      ["asset-38-revolver", "asset-45-automatic"],
      false,
    );

    expect(afterPurchase.pendingDecision).toMatchObject({
      type: "choice",
      source:
        "investigator:charlie-acquire-assets:investigator-1:asset-38-revolver",
    });
    expect(afterPurchase.pendingDecision?.type === "choice"
      ? afterPurchase.pendingDecision.options.map((option) => option.id)
      : [],
    ).toEqual([
      "charlie-acquire-assets:investigator-1",
      "charlie-acquire-assets:investigator-2",
    ]);

    const afterFirstChoice = resolveGameFlowChoice(
      afterPurchase,
      "charlie-acquire-assets:investigator-2",
      eldritchBaseMap,
    );

    expect(afterFirstChoice.investigators["investigator-1"].assetIds)
      .toEqual(["asset-45-automatic"]);
    expect(afterFirstChoice.investigators["investigator-2"].assetIds)
      .toEqual(["asset-38-revolver"]);
    expect(afterFirstChoice.pendingDecision).toMatchObject({
      type: "choice",
      source:
        "investigator:charlie-acquire-assets:investigator-1:asset-45-automatic",
    });

    const afterSecondChoice = resolveGameFlowChoice(
      afterFirstChoice,
      "charlie-acquire-assets:investigator-2",
      eldritchBaseMap,
    );

    expect(afterSecondChoice.investigators["investigator-1"].assetIds)
      .toEqual([]);
    expect(afterSecondChoice.investigators["investigator-2"].assetIds)
      .toEqual(["asset-38-revolver", "asset-45-automatic"]);
    expect(afterSecondChoice.pendingDecision).toBeNull();
    expect(afterSecondChoice.pendingAcquireAssetEffects).toBeNull();
  });

  it("lets Charlie keep a purchased card", () => {
    const game = createAcquireAssetsGame();
    const afterPurchase = confirmAcquireAssets(
      game,
      ["asset-38-revolver"],
      false,
    );

    const result = resolveGameFlowChoice(
      afterPurchase,
      "charlie-acquire-assets:investigator-1",
      eldritchBaseMap,
    );

    expect(result.investigators["investigator-1"].assetIds)
      .toEqual(["asset-38-revolver"]);
    expect(result.investigators["investigator-2"].assetIds)
      .toEqual([]);
    expect(result.pendingDecision).toBeNull();
  });

  it("lets another investigator gain the effect of a purchased Service", () => {
    const game = createAcquireAssetsGame();
    const privateCare = coreAssets.find(
      (asset) => asset.name === "Private Care",
    )!;
    game.investigators["investigator-1"].health = 1;
    game.investigators["investigator-1"].sanity = 1;
    game.investigators["investigator-2"].health = 2;
    game.investigators["investigator-2"].sanity = 2;

    const afterPurchase = confirmAcquireAssets(
      game,
      [privateCare.id],
      false,
    );

    expect(afterPurchase.investigators["investigator-1"]).toMatchObject({
      health: 1,
      sanity: 1,
    });
    expect(afterPurchase.pendingDecision).toMatchObject({
      type: "choice",
      source:
        `investigator:charlie-acquire-assets:investigator-1:${privateCare.id}`,
    });

    const result = resolveGameFlowChoice(
      afterPurchase,
      "charlie-acquire-assets:investigator-2",
      eldritchBaseMap,
    );

    expect(result.investigators["investigator-1"]).toMatchObject({
      health: 1,
      sanity: 1,
    });
    expect(result.investigators["investigator-2"]).toMatchObject({
      health: 5,
      sanity: 5,
    });
    expect(result.pendingDecision).toBeNull();
  });

  it("resolves a transferred Service for its recipient", () => {
    const game = createAcquireAssetsGame();
    const sanctuary = coreAssets.find(
      (asset) => asset.name === "Sanctuary",
    )!;
    game.conditions = {
      "charlie-condition": {
        id: "charlie-condition",
        definitionId: "condition-debt",
        instanceNumber: 1,
        frontImage: "/condition.png",
        backImage: "/condition-back.png",
        backId: "condition-back-1",
        flipped: false,
      },
      "recipient-condition": {
        id: "recipient-condition",
        definitionId: "condition-amnesia",
        instanceNumber: 1,
        frontImage: "/condition.png",
        backImage: "/condition-back.png",
        backId: "condition-back-1",
        flipped: false,
      },
    };
    game.investigators["investigator-1"].conditionIds = [
      "charlie-condition",
    ];
    game.investigators["investigator-2"].conditionIds = [
      "recipient-condition",
    ];

    const afterPurchase = confirmAcquireAssets(
      game,
      [sanctuary.id],
      false,
    );
    const afterRecipient = resolveGameFlowChoice(
      afterPurchase,
      "charlie-acquire-assets:investigator-2",
      eldritchBaseMap,
    );

    expect(afterRecipient.pendingDecision).toMatchObject({
      type: "choice",
      source:
        `asset:sanctuary:${sanctuary.id}:investigator-2`,
    });
    expect(afterRecipient.pendingDecision?.type === "choice"
      ? afterRecipient.pendingDecision.options.map((option) => option.id)
      : [],
    ).toContain("sanctuary:discard:recipient-condition");
    expect(afterRecipient.pendingDecision?.type === "choice"
      ? afterRecipient.pendingDecision.options.map((option) => option.id)
      : [],
    ).not.toContain("sanctuary:discard:charlie-condition");

    const result = resolveGameFlowChoice(
      afterRecipient,
      "sanctuary:discard:recipient-condition",
      eldritchBaseMap,
    );

    expect(result.investigators["investigator-1"].conditionIds)
      .toEqual(["charlie-condition"]);
    expect(result.investigators["investigator-2"].conditionIds)
      .toEqual([]);
    expect(result.pendingAcquireAssetEffects).toBeNull();
  });

  it("does not interrupt another investigator's purchase", () => {
    const game = createAcquireAssetsGame();
    game.investigators["investigator-1"].definitionId = "akachi-onyele";

    const result = confirmAcquireAssets(
      game,
      ["asset-38-revolver"],
      false,
    );

    expect(result.investigators["investigator-1"].assetIds)
      .toEqual(["asset-38-revolver"]);
    expect(result.pendingDecision).toBeNull();
    expect(result.pendingAcquireAssetEffects).toBeNull();
  });
});
