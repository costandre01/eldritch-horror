import { describe, expect, it } from "vitest";

import {
  getMythosById,
  resolveMythos,
} from "../engine/resolveMythos";
import { resolveMythosSpecial } from "../engine/resolveMythosSpecial";

import { createTestGame } from "./helpers/createTestGame";
import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";
import { resolveGameFlowChoice } from "../engine/resolveGameFlowChoice";

describe("getMythosById", () => {
  it("returns an existing Mythos by id", () => {
    const mythos = getMythosById("a-proposition");

    expect(mythos.id).toBe("a-proposition");
    expect(mythos.name).toBe("A Proposition");
  });

  it("throws when the Mythos does not exist", () => {
    expect(() =>
      getMythosById("mythos-that-does-not-exist"),
    ).toThrow(
      'Mythos "mythos-that-does-not-exist" does not exist.',
    );
  });

  it("uses the official errata text for Lost Knowledge", () => {
    expect(getMythosById("lost-knowledge").text).toContain(
      "each investigator discards all Clues, and then discard all Clues on the game board and solve this Rumor.",
    );
  });
});

describe("resolveMythos", () => {
  function prepareCard(cardId: string) {
    const game = createTestGame();
    game.phase = "mythos";
    game.status = "playing";
    game.currentMythosId = cardId;
    game.leadInvestigatorId = "investigator-1";
    game.investigatorOrder = ["investigator-1"];
    game.activeInvestigatorId = "investigator-1";
    game.board = {
      ...game.board,
      spaces: {},
      mythosInPlay: [],
      mythosDiscard: [],
      assetReserve: [],
      assetDeck: [],
      assetDiscard: [],
    };
    game.mysteries = {
      ...game.mysteries,
      activeMysteryId: null,
    };
    game.pendingEncounterChoice = null;
    game.pendingDecision = null;
    game.pendingInvestigatorReplacements = [];
    return game;
  }

  it("resolves Lost Knowledge in the official Clue discard order", () => {
    const game = prepareCard("lost-knowledge");
    const mythos = getMythosById("lost-knowledge");

    game.investigatorOrder = ["investigator-1", "investigator-2"];
    game.investigators["investigator-1"].clues = 1;
    game.investigators["investigator-1"].clueTokens = [
      { id: "investigator-clue-1", spaceId: "arkham" },
    ];
    game.investigators["investigator-2"].clues = 1;
    game.investigators["investigator-2"].clueTokens = [
      { id: "investigator-clue-2", spaceId: "tokyo" },
    ];
    game.board.spaces = {
      arkham: {
        spaceId: "arkham",
        clues: 1,
        clueTokenIds: ["board-clue-1"],
        monsterIds: [],
        gates: [],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },
      tokyo: {
        spaceId: "tokyo",
        clues: 1,
        clueTokenIds: ["board-clue-2"],
        monsterIds: [],
        gates: [],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },
    };
    game.board.clueDiscard = [];
    game.board.mythosInPlay = [
      { definitionId: "lost-knowledge", eldritchTokens: 0 },
    ];

    const result = resolveMythosSpecial(
      game,
      mythos,
      "lost-knowledge",
      eldritchBaseMap,
    );

    expect(result.investigators["investigator-1"]).toMatchObject({
      clues: 0,
      clueTokens: [],
    });
    expect(result.investigators["investigator-2"]).toMatchObject({
      clues: 0,
      clueTokens: [],
    });
    expect(result.board.spaces.arkham).toMatchObject({
      clues: 0,
      clueTokenIds: [],
    });
    expect(result.board.spaces.tokyo).toMatchObject({
      clues: 0,
      clueTokenIds: [],
    });
    expect(result.board.clueDiscard.map((clue) => clue.id)).toEqual([
      "investigator-clue-1",
      "investigator-clue-2",
      "board-clue-1",
      "board-clue-2",
    ]);
    expect(result.board.mythosInPlay).not.toContainEqual(
      expect.objectContaining({ definitionId: "lost-knowledge" }),
    );
    expect(result.board.mythosDiscard).toContainEqual(
      expect.objectContaining({ id: "lost-knowledge" }),
    );
  });

  it("keeps a Mythos special choice active and finishes it into the next round", () => {
    const game = prepareCard("heat-wave-singes-the-globe");

    const choiceGame = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("heat-wave-singes-the-globe").icons.length,
    );

    expect(choiceGame.pendingDecision).toMatchObject({
      type: "choice",
      source: "mythos:heat-wave-singes-the-globe:0",
    });

    const result = resolveGameFlowChoice(
      choiceGame,
      "heat-wave-singes-the-globe:delayed:0",
      eldritchBaseMap,
    );

    expect(result.phase).not.toBe("mythos");
    expect(result.currentMythosId).toBeNull();
    expect(result.round).toBe(2);
  });

  it("finishes synchronous specials that used to clear the current card early", () => {
    const game = prepareCard("calling-the-elder-things");

    expect(() =>
      resolveMythos(
        game,
        eldritchBaseMap,
        getMythosById("calling-the-elder-things").icons.length,
      ),
    ).not.toThrow();

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("calling-the-elder-things").icons.length,
    );

    expect(result.phase).toBe("action");
    expect(result.currentMythosId).toBeNull();
  });

  it("advances the Omen and Doom for Torn Asunder when no Gate matches the current Omen", () => {
    const game = prepareCard("torn-asunder");

    game.ancientOne = {
      id: "cthulhu",
      name: "Cthulhu",
      doom: 10,
      omenPosition: 0,
      eldritchTokens: 0,
      eldritchTokenPositions: [],
      eldritchTokenSpaceIds: [],
      awakened: false,
      sanityTokens: 0,
      gateCount: 1,
    };
    game.board.spaces = {
      arkham: {
        spaceId: "arkham",
        clues: 0,
        clueTokenIds: [],
        monsterIds: [],
        gates: [
          {
            id: "blue-gate",
            spaceId: "arkham",
            omen: "blue",
          },
        ],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },
    };

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("torn-asunder").icons.length,
    );

    expect(result.ancientOne.omenPosition).toBe(1);
    expect(result.ancientOne.doom).toBe(9);
    expect(result.phase).toBe("action");
  });

  it("does not advance the Omen for Torn Asunder when Gates match the current Omen", () => {
    const game = prepareCard("torn-asunder");

    game.ancientOne = {
      id: "cthulhu",
      name: "Cthulhu",
      doom: 10,
      omenPosition: 0,
      eldritchTokens: 0,
      eldritchTokenPositions: [],
      eldritchTokenSpaceIds: [],
      awakened: false,
      sanityTokens: 0,
      gateCount: 2,
    };
    game.board.spaces = {
      arkham: {
        spaceId: "arkham",
        clues: 0,
        clueTokenIds: [],
        monsterIds: [],
        gates: [
          {
            id: "green-gate-1",
            spaceId: "arkham",
            omen: "green",
          },
          {
            id: "green-gate-2",
            spaceId: "arkham",
            omen: "green",
          },
        ],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },
    };

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("torn-asunder").icons.length,
    );

    expect(result.ancientOne.omenPosition).toBe(0);
    expect(result.ancientOne.doom).toBe(10);
    expect(result.investigators["investigator-1"]?.health).toBe(3);
    expect(result.phase).toBe("action");
  });

  it("resolves Unexpected Betrayal Health loss before asking for an Ally", () => {
    const game = prepareCard("unexpected-betrayal");
    const ally = {
      id: "asset-test-ally",
      name: "Test Ally",
      type: "ally" as const,
      traits: [],
      value: 1,
      description: "Test Ally",
    };

    game.assets[ally.id] = ally;
    game.investigators["investigator-1"] = {
      ...game.investigators["investigator-1"],
      health: 5,
      assetIds: [ally.id],
    };

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("unexpected-betrayal").icons.length,
    );

    expect(result.investigators["investigator-1"].health).toBe(2);
    expect(result.pendingDecision).toMatchObject({
      type: "select-card",
      source: "mythos:unexpected-betrayal:0",
      cardIds: [ally.id],
    });
  });

  it("offers normal Health-loss prevention during Unexpected Betrayal", () => {
    const game = prepareCard("unexpected-betrayal");
    const ally = {
      id: "asset-test-ally",
      name: "Test Ally",
      type: "ally" as const,
      traits: [],
      value: 1,
      description: "Test Ally",
    };
    const bandages = {
      id: "asset-test-bandages",
      name: "Bandages",
      type: "service" as const,
      traits: [],
      value: 1,
      description: "Prevent Health loss.",
    };

    game.assets[ally.id] = ally;
    game.assets[bandages.id] = bandages;
    game.investigators["investigator-1"] = {
      ...game.investigators["investigator-1"],
      assetIds: [ally.id, bandages.id],
    };

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("unexpected-betrayal").icons.length,
    );

    expect(result.investigators["investigator-1"].health).toBe(5);
    expect(result.pendingDecision).toMatchObject({
      type: "choice",
      source: "spell-loss:health:investigator-1:3",
    });
    if (result.pendingDecision?.type !== "choice") {
      throw new Error("Expected a Health-loss prevention choice.");
    }
    expect(result.pendingDecision.options).toContainEqual(
      expect.objectContaining({
        id: `loss-reaction:asset:${bandages.id}`,
      }),
    );
  });

  it("uses the full defeat procedure when Unexpected Betrayal reduces Health to zero", () => {
    const game = prepareCard("unexpected-betrayal");
    const ally = {
      id: "asset-test-ally",
      name: "Test Ally",
      type: "ally" as const,
      traits: [],
      value: 1,
      description: "Test Ally",
    };

    game.ancientOne = {
      id: "cthulhu",
      name: "Cthulhu",
      doom: 10,
      omenPosition: 0,
      eldritchTokens: 0,
      eldritchTokenPositions: [],
      eldritchTokenSpaceIds: [],
      awakened: false,
      sanityTokens: 0,
      gateCount: 0,
    };
    game.assets[ally.id] = ally;
    game.investigators["investigator-1"] = {
      ...game.investigators["investigator-1"],
      health: 3,
      improvementTokens: { strength: 2 },
      assetIds: [ally.id],
    };

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("unexpected-betrayal").icons.length,
    );
    const defeated = result.investigators["investigator-1"];

    expect(defeated.health).toBe(0);
    expect(defeated.isDefeated).toBe(true);
    expect(defeated.defeatType).toBe("crippled");
    expect(defeated.improvementTokens).toEqual({});
    expect(defeated.assetIds).toContain(ally.id);
    expect(result.ancientOne.doom).toBe(9);
    expect(result.pendingInvestigatorReplacements).toContain(
      "investigator-1",
    );
  });

  it("resolves The World Shakes for investigators on or adjacent to the Active Expedition", () => {
    const game = prepareCard("the-world-shakes");
    game.investigatorOrder = [
      "investigator-1",
      "investigator-2",
      "investigator-3",
    ];
    game.investigators["investigator-1"] = {
      ...game.investigators["investigator-1"],
      spaceId: "the-amazon",
    };
    game.investigators["investigator-2"] = {
      ...game.investigators["investigator-2"],
      spaceId: "buenos-aires",
    };
    game.investigators["investigator-3"] = {
      ...game.investigators["investigator-3"],
      spaceId: "arkham",
    };
    game.board.activeExpeditionSpaceId = "the-amazon";
    game.board.encounterDecks = {
      america: [],
      europe: [],
      "asia-australia": [],
      general: [],
      research: [],
      "other-world": [],
      special: [],
      expedition: ["amazon-1", "himalayas-1", "amazon-2"],
    };
    game.encounters = {
      "amazon-1": { id: "amazon-1", name: "The Amazon" },
      "amazon-2": { id: "amazon-2", name: "The Amazon" },
      "himalayas-1": { id: "himalayas-1", name: "The Himalayas" },
    };

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("the-world-shakes").icons.length,
    );

    expect(result.investigators["investigator-1"]).toMatchObject({
      health: 3,
      isDelayed: true,
    });
    expect(result.investigators["investigator-2"]).toMatchObject({
      health: 3,
      isDelayed: true,
    });
    expect(result.investigators["investigator-3"]).toMatchObject({
      health: 5,
      isDelayed: false,
    });
    expect(result.board.encounterDecks.expedition).toEqual([
      "himalayas-1",
    ]);
    expect(result.board.activeExpeditionSpaceId).toBe("the-himalayas");
    expect(result.pendingDecision).toMatchObject({
      type: "continue",
      source: "mythos-card:4",
    });
  });

  it("offers Health-loss prevention during The World Shakes and resumes the card", () => {
    const game = prepareCard("the-world-shakes");
    const bandages = {
      id: "asset-test-bandages",
      name: "Bandages",
      type: "service" as const,
      traits: [],
      value: 1,
      description: "Prevent Health loss.",
    };

    game.assets[bandages.id] = bandages;
    game.investigators["investigator-1"] = {
      ...game.investigators["investigator-1"],
      spaceId: "the-amazon",
      assetIds: [bandages.id],
    };
    game.board.activeExpeditionSpaceId = "the-amazon";
    game.board.encounterDecks = {
      america: [],
      europe: [],
      "asia-australia": [],
      general: [],
      research: [],
      "other-world": [],
      special: [],
      expedition: ["amazon-1", "himalayas-1"],
    };
    game.encounters = {
      "amazon-1": { id: "amazon-1", name: "The Amazon" },
      "himalayas-1": { id: "himalayas-1", name: "The Himalayas" },
    };

    const prevention = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("the-world-shakes").icons.length,
    );

    expect(prevention.pendingDecision).toMatchObject({
      type: "choice",
      source: "spell-loss:health:investigator-1:2",
    });

    const result = resolveGameFlowChoice(
      prevention,
      `loss-reaction:asset:${bandages.id}`,
      eldritchBaseMap,
    );

    expect(result.investigators["investigator-1"]).toMatchObject({
      health: 5,
      isDelayed: true,
    });
    expect(result.investigators["investigator-1"].assetIds).not.toContain(
      bandages.id,
    );
    expect(result.board.encounterDecks.expedition).toEqual([
      "himalayas-1",
    ]);
    expect(result.pendingDecision).toMatchObject({
      type: "continue",
      source: "mythos-card:4",
    });
  });

  it("uses the full defeat procedure for lethal Health loss from The World Shakes", () => {
    const game = prepareCard("the-world-shakes");
    game.ancientOne = {
      id: "cthulhu",
      name: "Cthulhu",
      doom: 10,
      omenPosition: 0,
      eldritchTokens: 0,
      eldritchTokenPositions: [],
      eldritchTokenSpaceIds: [],
      awakened: false,
      sanityTokens: 0,
      gateCount: 0,
    };
    game.investigators["investigator-1"] = {
      ...game.investigators["investigator-1"],
      health: 2,
      spaceId: "the-amazon",
      improvementTokens: { observation: 2 },
    };
    game.board.activeExpeditionSpaceId = "the-amazon";
    game.board.encounterDecks = {
      america: [],
      europe: [],
      "asia-australia": [],
      general: [],
      research: [],
      "other-world": [],
      special: [],
      expedition: ["amazon-1", "himalayas-1"],
    };
    game.encounters = {
      "amazon-1": { id: "amazon-1", name: "The Amazon" },
      "himalayas-1": { id: "himalayas-1", name: "The Himalayas" },
    };

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("the-world-shakes").icons.length,
    );
    const defeated = result.investigators["investigator-1"];

    expect(defeated).toMatchObject({
      health: 0,
      isDefeated: true,
      defeatType: "crippled",
      improvementTokens: {},
    });
    expect(result.ancientOne.doom).toBe(9);
    expect(result.pendingInvestigatorReplacements).toContain(
      "investigator-1",
    );
    expect(result.board.encounterDecks.expedition).toEqual([
      "himalayas-1",
    ]);
    expect(result.pendingDecision).toMatchObject({
      type: "continue",
      source: "mythos-card:4",
    });
  });

  it("applies both losses from Tide of Despair and returns to the Mythos card", () => {
    const game = prepareCard("tide-of-despair");

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("tide-of-despair").icons.length,
    );

    expect(result.investigators["investigator-1"]).toMatchObject({
      health: 3,
      sanity: 3,
      isDefeated: false,
    });
    expect(result.pendingDecision).toMatchObject({
      type: "continue",
      source: "mythos-card:4",
    });
  });

  it("offers prevention separately for both Tide of Despair losses", () => {
    const game = prepareCard("tide-of-despair");
    const bandages = {
      id: "asset-test-bandages",
      name: "Bandages",
      type: "service" as const,
      traits: [],
      value: 1,
      description: "Prevent Health loss.",
    };
    const whiskey = {
      id: "asset-test-whiskey",
      name: "Whiskey",
      type: "item" as const,
      traits: [],
      value: 1,
      description: "Prevent Sanity loss.",
    };

    game.assets[bandages.id] = bandages;
    game.assets[whiskey.id] = whiskey;
    game.investigators["investigator-1"] = {
      ...game.investigators["investigator-1"],
      assetIds: [bandages.id, whiskey.id],
    };

    const healthPrevention = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("tide-of-despair").icons.length,
    );

    expect(healthPrevention.pendingDecision).toMatchObject({
      type: "choice",
      source: "spell-loss:health:investigator-1:2:defer",
    });

    const sanityPrevention = resolveGameFlowChoice(
      healthPrevention,
      `loss-reaction:asset:${bandages.id}`,
      eldritchBaseMap,
    );

    expect(sanityPrevention.pendingDecision).toMatchObject({
      type: "choice",
      source: "spell-loss:sanity:investigator-1:2:defer",
    });

    const result = resolveGameFlowChoice(
      sanityPrevention,
      `loss-reaction:asset:${whiskey.id}`,
      eldritchBaseMap,
    );

    expect(result.investigators["investigator-1"]).toMatchObject({
      health: 5,
      sanity: 5,
      isDefeated: false,
    });
    expect(result.pendingDecision).toMatchObject({
      type: "continue",
      source: "mythos-card:4",
    });
  });

  it("returns a discarded Blessed Condition to its deck during Tide of Despair", () => {
    const game = prepareCard("tide-of-despair");
    const blessedId = "condition-test-blessed";

    game.board.conditionDeck = [];
    game.conditions[blessedId] = {
      id: blessedId,
      definitionId: "condition-blessed",
      instanceNumber: 1,
      frontImage: "blessed-front.png",
      backImage: "blessed-back.png",
      backId: "blessed-back-1",
      flipped: false,
    };
    game.investigators["investigator-1"] = {
      ...game.investigators["investigator-1"],
      conditionIds: [blessedId],
    };

    const choice = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("tide-of-despair").icons.length,
    );

    expect(choice.pendingDecision).toMatchObject({
      type: "choice",
      source: "mythos:tide-of-despair:investigator-1",
    });

    const result = resolveGameFlowChoice(
      choice,
      `tide-of-despair:discard-blessed:investigator-1`,
      eldritchBaseMap,
    );

    expect(result.investigators["investigator-1"]).toMatchObject({
      health: 5,
      sanity: 5,
      conditionIds: [],
    });
    expect(result.board.conditionDeck).toContain(blessedId);
    expect(result.pendingDecision).toMatchObject({
      type: "continue",
      source: "mythos-card:4",
    });
  });

  it("keeps Blessed and resolves both Tide of Despair losses when chosen", () => {
    const game = prepareCard("tide-of-despair");
    const blessedId = "condition-test-blessed";

    game.board.conditionDeck = [];
    game.conditions[blessedId] = {
      id: blessedId,
      definitionId: "condition-blessed",
      instanceNumber: 1,
      frontImage: "blessed-front.png",
      backImage: "blessed-back.png",
      backId: "blessed-back-1",
      flipped: false,
    };
    game.investigators["investigator-1"] = {
      ...game.investigators["investigator-1"],
      conditionIds: [blessedId],
    };

    const choice = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("tide-of-despair").icons.length,
    );
    const result = resolveGameFlowChoice(
      choice,
      "tide-of-despair:keep-blessed:investigator-1",
      eldritchBaseMap,
    );

    expect(result.investigators["investigator-1"]).toMatchObject({
      health: 3,
      sanity: 3,
      conditionIds: [blessedId],
      isDefeated: false,
    });
    expect(result.pendingDecision).toMatchObject({
      type: "continue",
      source: "mythos-card:4",
    });
  });

  it("allows choosing the defeat type when both Tide of Despair losses reach zero", () => {
    const game = prepareCard("tide-of-despair");
    game.ancientOne = {
      id: "cthulhu",
      name: "Cthulhu",
      doom: 10,
      omenPosition: 0,
      eldritchTokens: 0,
      eldritchTokenPositions: [],
      eldritchTokenSpaceIds: [],
      awakened: false,
      sanityTokens: 0,
      gateCount: 0,
    };
    game.investigators["investigator-1"] = {
      ...game.investigators["investigator-1"],
      health: 2,
      sanity: 2,
      improvementTokens: { will: 2 },
    };

    const defeatChoice = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("tide-of-despair").icons.length,
    );

    expect(defeatChoice.investigators["investigator-1"]).toMatchObject({
      health: 0,
      sanity: 0,
      isDefeated: false,
    });
    expect(defeatChoice.pendingDecision).toMatchObject({
      type: "choice",
      source: "defeat-type:investigator-1",
    });

    const result = resolveGameFlowChoice(
      defeatChoice,
      "defeat-type:crippled:investigator-1",
      eldritchBaseMap,
    );

    expect(result.investigators["investigator-1"]).toMatchObject({
      isDefeated: true,
      defeatType: "crippled",
      improvementTokens: {},
    });
    expect(result.ancientOne.doom).toBe(9);
    expect(result.pendingInvestigatorReplacements).toContain(
      "investigator-1",
    );
    expect(result.pendingDecision).toMatchObject({
      type: "continue",
      source: "mythos-card:4",
    });
  });

  it("resolves awakening when Torn Asunder advances the Omen to Doom zero", () => {
    const game = prepareCard("torn-asunder");

    game.ancientOne = {
      id: "azathoth",
      name: "Azathoth",
      doom: 1,
      omenPosition: 0,
      eldritchTokens: 0,
      eldritchTokenPositions: [],
      eldritchTokenSpaceIds: [],
      awakened: false,
      sanityTokens: 0,
      gateCount: 1,
    };
    game.board.spaces = {
      arkham: {
        spaceId: "arkham",
        clues: 0,
        clueTokenIds: [],
        monsterIds: [],
        gates: [
          {
            id: "blue-gate",
            spaceId: "arkham",
            omen: "blue",
          },
        ],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },
    };

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("torn-asunder").icons.length,
    );

    expect(result.ancientOne.omenPosition).toBe(1);
    expect(result.ancientOne.doom).toBe(0);
    expect(result.ancientOne.awakened).toBe(true);
    expect(result.status).toBe("defeat");
  });

  it("implements Driven to Bankruptcy entering play", () => {
    const game = prepareCard("driven-to-bankruptcy");
    const result = resolveMythos(
      game,
      eldritchBaseMap,
      getMythosById("driven-to-bankruptcy").icons.length,
    );

    expect(result.board.assetReserve).toEqual([]);
    expect(result.phase).toBe("action");
  });

  it("throws when called outside the Mythos phase", () => {
    const game = createTestGame();

    game.phase = "action";

    expect(() =>
      resolveMythos(
        game,
        eldritchBaseMap,
      ),
    ).toThrow(
      "Mythos can only be resolved during the Mythos phase.",
    );
  });

  it("finishes Omen of Good Fortune and asks for the Lead when the Omen is not moved", () => {
    const game = createTestGame();

    game.phase = "mythos";
    game.currentMythosId =
      "omen-of-good-fortune";

    game.leadInvestigatorId =
      "investigator-1";

    game.investigatorOrder = [
      "investigator-1",
      "investigator-2",
      "investigator-3",
    ];

    game.ancientOne.omenPosition = 2;

    game.board.mythosDiscard = [];

    game.mysteries.activeMysteryId =
      null;

    game.pendingEncounterChoice =
      null;

    game.pendingInvestigatorReplacements =
      [];

    /*
     * Skip the three Mythos icons and resolve
     * only the card-specific effect.
     */

    const choiceGame = resolveMythos(
      game,
      eldritchBaseMap,
      3,
    );

    expect(
      choiceGame.pendingDecision,
    ).toMatchObject({
      type: "choice",
      source:
        "mythos:omen-of-good-fortune",
    });

    /*
     * The Lead Investigator chooses to leave
     * the Omen exactly where it is.
     */

    const result =
      resolveGameFlowChoice(
        choiceGame,
        "omen-position:pass",
        eldritchBaseMap,
      );

    /*
     * The Omen must not move.
     */

    expect(
      result.ancientOne.omenPosition,
    ).toBe(2);

    /*
     * The Mythos card must finish normally.
     */

    expect(
      result.currentMythosId,
    ).toBeNull();

    expect(
      result.board.mythosDiscard.some(
        (mythos) =>
          mythos.id ===
          "omen-of-good-fortune",
      ),
    ).toBe(true);

    /*
     * Most importantly, finishing the card
     * must continue to the end-of-Mythos
     * Lead Investigator selection.
     */

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type: "select-investigator",
      source: "mythos:end-lead",
    });

    expect(
      result.pendingDecision?.type,
    ).toBe(
      "select-investigator",
    );
  });

  it("finishes Omen of Good Fortune and asks for the Lead after moving the Omen", () => {
    const game = createTestGame();

    game.phase = "mythos";
    game.currentMythosId =
      "omen-of-good-fortune";

    game.leadInvestigatorId =
      "investigator-1";

    game.investigatorOrder = [
      "investigator-1",
      "investigator-2",
      "investigator-3",
    ];

    game.ancientOne.omenPosition = 2;

    game.board.mythosDiscard = [];

    game.mysteries.activeMysteryId =
      null;

    game.pendingEncounterChoice =
      null;

    game.pendingInvestigatorReplacements =
      [];

    /*
     * Skip the Mythos icons and reach
     * Omen of Good Fortune's special choice.
     */

    const choiceGame = resolveMythos(
      game,
      eldritchBaseMap,
      3,
    );

    expect(
      choiceGame.pendingDecision,
    ).toMatchObject({
      type: "choice",
      source:
        "mythos:omen-of-good-fortune",
    });

    /*
     * Move the Omen to position 0.
     */

    const result =
      resolveGameFlowChoice(
        choiceGame,
        "omen-position:0",
        eldritchBaseMap,
      );

    /*
     * The Omen moves without interrupting
     * the end of the Mythos Phase.
     */

    expect(
      result.ancientOne.omenPosition,
    ).toBe(0);

    expect(
      result.currentMythosId,
    ).toBeNull();

    expect(
      result.board.mythosDiscard.some(
        (mythos) =>
          mythos.id ===
          "omen-of-good-fortune",
      ),
    ).toBe(true);

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type: "select-investigator",
      source: "mythos:end-lead",
    });

    expect(
      result.pendingDecision?.type,
    ).toBe(
      "select-investigator",
    );
  });

  it("throws when there is no current Mythos", () => {
    const game = createTestGame();

    game.phase = "mythos";
    game.currentMythosId = null;

    expect(() =>
      resolveMythos(
        game,
        eldritchBaseMap,
      ),
    ).toThrow(
      "There is no current Mythos to resolve.",
    );
  });

  it("throws when the current Mythos id does not exist", () => {
    const game = createTestGame();

    game.phase = "mythos";
    game.currentMythosId =
      "mythos-that-does-not-exist";

    expect(() =>
      resolveMythos(
        game,
        eldritchBaseMap,
      ),
    ).toThrow(
      'Mythos "mythos-that-does-not-exist" does not exist.',
    );
  });

  it("starts resolving an advance-omen Mythos at the first icon", () => {
    const game = createTestGame();

    game.phase = "mythos";
    game.currentMythosId = "a-proposition";

    const result = resolveMythos(
      game,
      eldritchBaseMap,
    );

    expect(result.phase).toBe("mythos");

    expect(
      result.currentMythosId,
    ).toBe("a-proposition");

    expect(
      result.pendingDecision,
    ).not.toBeNull();
  });

  it("does not add a persistent Mythos again when resuming from a later icon", () => {
    const game = createTestGame();

    game.phase = "mythos";

    game.currentMythosId =
      "strange-sightings";

    game.board.mythosInPlay = [];

    game.board.spaces = {
      arkham: {
        spaceId: "arkham",
        clues: 0,
        clueTokenIds: [],
        monsterIds: [],
        gates: [],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },
    };

    game.board.gateStack = [];
    game.board.gateDiscard = [];

    const before =
      game.board.mythosInPlay.length;

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      1,
    );

    expect(
      result.board.mythosInPlay.length,
    ).toBe(before);
  });

  it("creates a pending decision for a Mythos test effect", () => {
    const game = createTestGame();

    game.phase = "mythos";

    game.currentMythosId =
      "buying-information";

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      3,
    );

    expect(
      result.pendingDecision,
    ).not.toBeNull();

    expect(
      result.pendingDecision?.type,
    ).toBe("test");
  });

  it("creates a pending decision for a Mythos single-die roll", () => {
    const game = createTestGame();

    game.phase = "mythos";

    game.currentMythosId =
      "heart-of-corruption";

    game.board.artifactDeck = [];

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      3,
    );

    expect(
      result.pendingDecision,
    ).not.toBeNull();

    expect(
      result.pendingDecision?.type,
    ).toBe("single-die-roll");
  });

  it("creates a pending decision for selecting a Gate", () => {
    const game = createTestGame();

    game.phase = "mythos";

    game.currentMythosId =
      "that-which-consumes";

    game.board.spaces = {
      arkham: {
        spaceId: "arkham",
        clues: 0,
        clueTokenIds: [],
        monsterIds: [],
        gates: [
          {
            id: "gate-test-1",
            spaceId: "arkham",
            omen: "green",
          },
        ],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },
    };

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      3,
    );

    expect(
      result.pendingDecision,
    ).not.toBeNull();

    expect(
      result.pendingDecision?.type,
    ).toBe("select-space");
  });

  it("creates a pending decision for gaining Dark Pact when a Rumor is in play", () => {
    const game = createTestGame();

    game.phase = "mythos";

    game.currentMythosId =
      "a-proposition";

    game.board.mythosInPlay = [];

    game.board.mythosInPlay.push({
      definitionId:
        "spreading-sickness",
      eldritchTokens: 1,
    });

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      3,
    );

    expect(
      result.pendingDecision,
    ).not.toBeNull();

    expect(
      result.pendingDecision?.type,
    ).toBe("choice");
  });

  it("creates a pending decision for gaining Debt", () => {
    const game = createTestGame();

    game.phase = "mythos";

    game.currentMythosId =
      "everyone-has-a-price";

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      3,
    );

    expect(
      result.pendingDecision,
    ).not.toBeNull();

    expect(
      result.pendingDecision?.type,
    ).toBe("choice");
  });

  it("includes the current Lead Investigator when choosing the Lead for the next round", () => {
    const game = createTestGame();

    game.phase = "mythos";

    /*
     * Secrets of the Past has one Mythos
     * icon and no card-specific effects.
     *
     * Starting at icon index 1 skips the
     * only icon and lets this test reach
     * the end of the Mythos Phase.
     */
    game.currentMythosId =
      "secrets-of-the-past";

    game.leadInvestigatorId =
      "investigator-1";

    game.investigatorOrder = [
      "investigator-1",
      "investigator-2",
      "investigator-3",
    ];

    game.board.mythosInPlay = [];

    /*
     * Isolate the Lead Investigator logic.
     *
     * Mystery resolution and any decisions
     * already present in createTestGame()
     * must not interrupt the end of the
     * Mythos Phase.
     */
    game.mysteries.activeMysteryId = null;

    game.pendingDecision = null;

    game.pendingEncounterChoice = null;

    game.pendingInvestigatorReplacements = [];

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      1,
    );

    expect(
      result.pendingDecision?.type,
    ).toBe("select-investigator");

    if (
      result.pendingDecision?.type !==
      "select-investigator"
    ) {
      throw new Error(
        "Expected a Lead Investigator selection.",
      );
    }

    expect(
      result.pendingDecision.source,
    ).toBe("mythos:end-lead");

    expect(
      result.pendingDecision.investigatorIds,
    ).toEqual([
      "investigator-1",
      "investigator-2",
      "investigator-3",
    ]);

    /*
     * The current Lead must remain one of
     * the available choices.
     */
    expect(
      result.pendingDecision.investigatorIds,
    ).toContain(
      "investigator-1",
    );
  });

  it("keeps the current Lead automatically in a solo game", () => {
    const game = createTestGame();

    game.phase = "mythos";

    game.currentMythosId =
      "secrets-of-the-past";

    game.leadInvestigatorId =
      "investigator-1";

    game.investigatorOrder = [
      "investigator-1",
    ];

    game.investigators = {
      "investigator-1":
        game.investigators[
          "investigator-1"
        ],
    };

    game.board.mythosInPlay = [];

    /*
     * Isolate the end-of-Mythos transition
     * from unrelated Mystery or pending
     * decision state.
     */
    game.mysteries.activeMysteryId = null;

    game.pendingDecision = null;

    game.pendingEncounterChoice = null;

    game.pendingInvestigatorReplacements = [];

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      1,
    );

    expect(
      result.leadInvestigatorId,
    ).toBe("investigator-1");

    expect(
      result.round,
    ).toBe(
      game.round + 1,
    );

    expect(
      result.phase,
    ).toBe("action");

    expect(
      result.activeInvestigatorId,
    ).toBe("investigator-1");
  });
});
