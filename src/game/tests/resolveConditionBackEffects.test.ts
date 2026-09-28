import { describe, expect, it, vi } from "vitest";

import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";
import { resolveCondition } from "../engine/resolveCondition";
import { resolveGameFlowChoice } from "../engine/resolveGameFlowChoice";
import { createTestGame } from "./helpers/createTestGame";
import type { GameState } from "../models/GameState";

const map = eldritchBaseMap;

function gameWithCondition(definitionId: string, backId: string): GameState {
  const game = createTestGame();
  game.scenarioId = map.id;
  game.board = {
    ...game.board,

    conditionDiscard: [],

    assetDiscard: [],
    assetDeck: [],

    spellDiscard: [],
    artifactDiscard: [],

    monsterCup: [],

    spaces: Object.fromEntries(
      map.spaces.map((space) => [
        space.id,
        {
          spaceId: space.id,
          clues: 0,
          clueTokenIds: [],
          monsterIds: [],
          gates: [],
          expedition:
            space.isExpedition,
          rumor: false,
          eldritchTokenCount: 0,
        },
      ]),
    ),
  };
  game.ancientOne = {
    id: "azathoth",
    name: "Azathoth",
    doom: 15,
    omenPosition: 0,
    eldritchTokens: 0,
    eldritchTokenPositions: [],
    eldritchTokenSpaceIds: [],
    awakened: false,
    sanityTokens: 0,
    gateCount: 0,
  };

  const investigator = game.investigators["investigator-1"]!;
  investigator.spaceId = "san-francisco";
  investigator.health = 5;
  investigator.maxHealth = 5;
  investigator.sanity = 5;
  investigator.maxSanity = 5;
  investigator.conditionIds = ["condition-test"];
  game.conditions["condition-test"] = {
    id: "condition-test",
    definitionId,
    instanceNumber: 1,
    frontImage: "/front.jpg",
    backImage: "/back.jpg",
    backId,
    flipped: true,
  };

  return game;
}

describe("resolveCondition back effects", () => {
  it("applies Leg Injury damage and asks whether to delay or flip", () => {
    const game = gameWithCondition("condition-leg-injury", "leg-injury-back-2");

    const result = resolveCondition(game, "investigator-1", "condition-test");

    expect(result.investigators["investigator-1"]?.health).toBe(4);
    expect(result.pendingDecision).toMatchObject({
      type: "choice",
      source: "condition:leg-injury:investigator-1:condition-test",
      options: expect.arrayContaining([
        expect.objectContaining({ id: "condition:leg-injury:delayed:investigator-1:condition-test" }),
        expect.objectContaining({ id: "condition:leg-injury:flip:investigator-1:condition-test" }),
      ]),
    });
  });

  it("resolves the Leg Injury delay choice and discards the Condition", () => {
    const game = gameWithCondition("condition-leg-injury", "leg-injury-back-2");
    game.pendingDecision = {
      type: "choice",
      title: "Leg Injury",
      message: "Choose.",
      options: [],
      source: "condition:leg-injury:investigator-1:condition-test",
    };

    const result = resolveGameFlowChoice(
      game,
      "condition:leg-injury:delayed:investigator-1:condition-test",
      map,
    );

    expect(result.investigators["investigator-1"]?.isDelayed).toBe(true);
    expect(result.investigators["investigator-1"]?.conditionIds).toEqual([]);
    expect(result.board.conditionDeck).toContain("condition-test");
    expect(result.pendingDecision).toBeNull();
  });

  it("flips Leg Injury back to its front without delaying", () => {
    const game = gameWithCondition("condition-leg-injury", "leg-injury-back-2");
    game.pendingDecision = {
      type: "choice",
      title: "Leg Injury",
      message: "Choose.",
      options: [],
      source: "condition:leg-injury:investigator-1:condition-test",
    };

    const result = resolveGameFlowChoice(
      game,
      "condition:leg-injury:flip:investigator-1:condition-test",
      map,
    );

    expect(result.conditions["condition-test"]?.flipped).toBe(false);
    expect(result.investigators["investigator-1"]?.isDelayed).toBe(false);
    expect(result.investigators["investigator-1"]?.conditionIds).toContain("condition-test");
  });

  it("does not lose health from Leg Injury while already delayed", () => {
    const game = gameWithCondition("condition-leg-injury", "leg-injury-back-3");
    game.investigators["investigator-1"]!.isDelayed = true;

    const result = resolveCondition(game, "investigator-1", "condition-test");

    expect(result.investigators["investigator-1"]?.health).toBe(5);
    expect(result.conditions["condition-test"]?.flipped).toBe(false);
  });

  it("damages only other investigators sharing the space, then flips Paranoia", () => {
    const game = gameWithCondition("condition-paranoia", "paranoia-back-3");
    game.investigators["investigator-2"]!.spaceId = "san-francisco";
    game.investigators["investigator-2"]!.health = 4;
    game.investigators["investigator-3"]!.spaceId = "arkham";

    const result = resolveCondition(game, "investigator-1", "condition-test");

    expect(result.investigators["investigator-1"]?.health).toBe(5);
    expect(result.investigators["investigator-2"]?.health).toBe(2);
    expect(result.investigators["investigator-3"]?.health).toBe(5);
    expect(result.conditions["condition-test"]?.flipped).toBe(false);
  });

  it("reveals a random Item and sets the failure threshold to its value", () => {
    const game = gameWithCondition("condition-paranoia", "paranoia-back-2");
    const item = {
      id: "test-item",
      name: "Test Item",
      type: "item" as const,
      traits: [],
      value: 3,
      description: "An Item for the test.",
    };
    game.board.assetDeck = [item];
    vi.spyOn(Math, "random").mockReturnValue(0);

    const result = resolveCondition(game, "investigator-1", "condition-test");

    expect(result.investigators["investigator-1"]?.assetIds).toContain(item.id);
    expect(result.board.assetDeck).toEqual([]);
    expect(result.cardRevealQueue?.at(-1)).toMatchObject({ id: item.id, name: item.name });
    expect(result.pendingDecision).toMatchObject({ type: "test", skill: "observation", minSuccesses: 3 });
    expect(result.investigators["investigator-1"]?.conditionIds).not.toContain("condition-test");
    expect(result.board.conditionDeck).toContain("condition-test");
    vi.restoreAllMocks();
  });

  it("discards Paranoia when no Item is available", () => {
    const game = gameWithCondition("condition-paranoia", "paranoia-back-2");
    game.board.assetDeck = [{
      id: "only-spell",
      name: "Not an Item",
      type: "ally",
      traits: [],
      value: 1,
      description: "Not eligible.",
    }];

    const result = resolveCondition(game, "investigator-1", "condition-test");

    expect(result.pendingDecision).toEqual(game.pendingDecision);
    expect(result.investigators["investigator-1"]?.conditionIds).toEqual([]);
    expect(result.board.conditionDeck).toContain("condition-test");
    expect(result.board.assetDeck).toHaveLength(1);
  });

  it("applies the Cursed back's land penalty and discards it", () => {
    const game = gameWithCondition("condition-cursed", "cursed-back-3");

    const result = resolveCondition(game, "investigator-1", "condition-test");

    expect(result.investigators["investigator-1"]?.health).toBe(2);
    expect(result.investigators["investigator-1"]?.conditionIds).toEqual([]);
    expect(result.board.conditionDeck).toContain("condition-test");
  });

  it("devours an investigator resolving Cursed while at sea", () => {
    const game = gameWithCondition(
      "condition-cursed",
      "cursed-back-3",
    );

    game.investigators[
      "investigator-1"
    ]!.spaceId = "space-3";

    const startingDoom =
      game.ancientOne.doom;

    const result = resolveCondition(
      game,
      "investigator-1",
      "condition-test",
    );

    const investigator =
      result.investigators[
        "investigator-1"
      ]!;

    expect(
      investigator.isDefeated,
    ).toBe(true);

    expect(
      investigator.defeatType,
    ).toBe("devoured");

    expect(
      investigator.spaceId,
    ).toBeNull();

    expect(
      result.ancientOne.doom,
    ).toBe(startingDoom - 1);

    expect(
      result.board.conditionDeck,
    ).toContain("condition-test");

    expect(
      investigator.conditionIds,
    ).toEqual([]);

    expect(
      result.pendingInvestigatorReplacements,
    ).toContain(
      "investigator-1",
    );
  });

  it("advances the Omen and discards the Dark Pact back", () => {
    const game = gameWithCondition("condition-dark-pact", "dark-pact-back-3");

    const result = resolveCondition(game, "investigator-1", "condition-test");

    expect(result.ancientOne.omenPosition).toBe(1);
    expect(result.investigators["investigator-1"]?.conditionIds).toEqual([]);
    expect(result.board.conditionDeck).toContain("condition-test");
  });

  it("does not spend a Clue or dismiss the choice when the investigator has none", () => {
    const game = gameWithCondition("condition-detained", "detained-back-1");
    game.investigators["investigator-1"]!.clues = 0;
    game.pendingDecision = {
      type: "choice",
      title: "Detained",
      message: "Spend a Clue or test.",
      options: [],
      source: "condition:spend-clue-or-test:investigator-1:condition-test",
    };

    const result = resolveGameFlowChoice(
      game,
      "condition:spend-clue:investigator-1:condition-test",
      map,
    );

    expect(result).toBe(game);
    expect(result.investigators["investigator-1"]?.clues).toBe(0);
    expect(result.investigators["investigator-1"]?.conditionIds).toContain("condition-test");
    expect(result.pendingDecision).not.toBeNull();
  });
});
