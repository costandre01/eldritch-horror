import { describe, expect, it, vi } from "vitest";
import { defeatInvestigator } from "../engine/defeatInvestigator";
import { getEffectiveSkill } from "../engine/getEffectiveSkill";
import {
  getImprovementLevel,
  improveInvestigatorSkill,
  startNextStartingImprovement,
} from "../engine/improvementEngine";
import { performTest } from "../engine/performTest";
import { resolveGameFlowChoice } from "../engine/resolveGameFlowChoice";
import { rollTest } from "../engine/rollTest";
import type { MapDefinition } from "../models/MapDefinition";
import { createTestGame } from "./helpers/createTestGame";

const map: MapDefinition = {
  id: "test-map",
  name: "Test Map",
  startingSpaceId: "city",
  spaces: [{
    id: "city",
    name: "City",
    type: "city",
    isExpedition: false,
    connectedSpaceIds: [],
    paths: [],
  }],
};

describe("Improvement tokens", () => {
  it("places +1, upgrades it to +2, and never exceeds +2", () => {
    const game = createTestGame();
    game.investigators["investigator-1"].skills.lore = 2;

    const once = improveInvestigatorSkill(
      game,
      "investigator-1",
      "lore",
    );

    const twice = improveInvestigatorSkill(
      once,
      "investigator-1",
      "lore",
    );

    const threeTimes = improveInvestigatorSkill(
      twice,
      "investigator-1",
      "lore",
    );

    const investigator =
      threeTimes.investigators["investigator-1"];

    expect(
      investigator.skills.lore,
    ).toBe(2);

    expect(
      getImprovementLevel(
        investigator,
        "lore",
      ),
    ).toBe(2);

    expect(
      getEffectiveSkill(
        threeTimes,
        investigator.id,
        "lore",
      ),
    ).toBe(4);

    expect(
      rollTest(
        investigator,
        "lore",
      ).diceRolled,
    ).toBe(4);
  });

  it("discards every Improvement token when the investigator is defeated", () => {
    const game = createTestGame();

    game.ancientOne = {
      ...game.ancientOne,
      doom: 10,
      awakened: false,
    };

    game.investigators["investigator-2"] = {
      ...game.investigators["investigator-2"],
      health: 0,
      spaceId: "city",
      improvementTokens: {
        lore: 2,
        strength: 1,
      },
    };

    const result =
      defeatInvestigator(
        game,
        map,
        "investigator-2",
      );

    expect(
      result.investigators[
        "investigator-2"
      ].isDefeated,
    ).toBe(true);

    expect(
      result.investigators[
        "investigator-2"
      ].improvementTokens,
    ).toEqual({});
  });

  it("asks the player where to place a starting Improvement", () => {
    const game = createTestGame();

    game.pendingDecision = null;

    game.startingImprovementQueue = [
      "investigator-1",
    ];

    const awaitingChoice =
      startNextStartingImprovement(game);

    expect(
      awaitingChoice.pendingDecision?.source,
    ).toBe(
      "starting-improvement:investigator-1",
    );

    const result =
      resolveGameFlowChoice(
        awaitingChoice,
        "observation",
        map,
      );

    expect(
      result.investigators[
        "investigator-1"
      ].improvementTokens,
    ).toEqual({
      observation: 1,
    });

    expect(
      result.startingImprovementQueue,
    ).toEqual([]);

    expect(
      result.pendingDecision,
    ).toBeNull();
  });
});

describe("Blessed and Cursed skill tests", () => {
  it("counts 5 and 6 as successes normally", () => {
    const game = createTestGame();

    game.investigators[
      "investigator-1"
    ].skills.lore = 2;

    vi.spyOn(
      Math,
      "random",
    )
      .mockReturnValueOnce(3 / 6)
      .mockReturnValueOnce(4 / 6);

    const result = performTest(
      game,
      "investigator-1",
      "lore",
      0,
      1,
      map,
    );

    expect(
      result.test.results,
    ).toEqual([4, 5]);

    expect(
      result.test.successes,
    ).toBe(1);

    expect(
      result.test.passed,
    ).toBe(true);

    vi.restoreAllMocks();
  });

  it("counts 4, 5 and 6 as successes while Blessed", () => {
    const game = createTestGame();

    game.investigators[
      "investigator-1"
    ].skills.lore = 2;

    game.conditions = {
      "condition-blessed-1": {
        id: "condition-blessed-1",
        definitionId:
          "condition-blessed",
        instanceNumber: 1,
        frontImage:
          "/blessed.png",
        backImage:
          "/blessed-back.png",
        backId:
          "blessed-back-1",
        flipped: false,
      },
    };

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-blessed-1",
    ];

    vi.spyOn(
      Math,
      "random",
    )
      .mockReturnValueOnce(3 / 6)
      .mockReturnValueOnce(4 / 6);

    const result = performTest(
      game,
      "investigator-1",
      "lore",
      0,
      1,
      map,
    );

    expect(
      result.test.results,
    ).toEqual([4, 5]);

    expect(
      result.test.successes,
    ).toBe(2);

    expect(
      result.test.passed,
    ).toBe(true);

    vi.restoreAllMocks();
  });

  it("does not apply Blessed or Cursed test modifiers after the Condition is flipped", () => {
    const game = createTestGame();

    game.investigators[
      "investigator-1"
    ].skills.lore = 2;

    game.conditions = {
      "condition-blessed-1": {
        id: "condition-blessed-1",
        definitionId:
          "condition-blessed",
        instanceNumber: 1,
        frontImage:
          "/blessed.png",
        backImage:
          "/blessed-back.png",
        backId:
          "blessed-back-1",
        flipped: true,
      },
    };

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-blessed-1",
    ];

    vi.spyOn(
      Math,
      "random",
    )
      .mockReturnValueOnce(3 / 6)
      .mockReturnValueOnce(4 / 6);

    try {
      const result = performTest(
        game,
        "investigator-1",
        "lore",
        0,
        1,
        map,
      );

      expect(
        result.test.results,
      ).toEqual([4, 5]);

      expect(
        result.test.successes,
      ).toBe(1);
    } finally {
      vi.restoreAllMocks();
    }
  });

  it("counts only 6 as a success while Cursed", () => {
    const game = createTestGame();

    game.investigators[
      "investigator-1"
    ].skills.lore = 2;

    game.conditions = {
      "condition-cursed-1": {
        id: "condition-cursed-1",
        definitionId:
          "condition-cursed",
        instanceNumber: 1,
        frontImage:
          "/cursed.png",
        backImage:
          "/cursed-back.png",
        backId:
          "cursed-back-1",
        flipped: false,
      },
    };

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-cursed-1",
    ];

    vi.spyOn(
      Math,
      "random",
    )
      .mockReturnValueOnce(4 / 6)
      .mockReturnValueOnce(5 / 6);

    const result = performTest(
      game,
      "investigator-1",
      "lore",
      0,
      1,
      map,
    );

    expect(
      result.test.results,
    ).toEqual([5, 6]);

    expect(
      result.test.successes,
    ).toBe(1);

    expect(
      result.test.passed,
    ).toBe(true);

    vi.restoreAllMocks();
  });
});