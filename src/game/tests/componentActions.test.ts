import { describe, expect, it } from "vitest";

import { activatePossessionAbility } from "../engine/activatePossessionAbility";
import { startConditionLocalAction } from "../engine/conditionLocalAction";
import { resolveSpellFrontEffects } from "../engine/resolveSpellFrontEffects";

import { createTestGame } from "./helpers/createTestGame";

import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";
import { coreAssets } from "../../content/core/coreAssets";
import { coreConditionDefinitions } from "../../content/core/coreConditions";
import { coreSpells } from "../../content/core/coreSpell";

function prepareGame() {
  const game = createTestGame();

  game.phase = "action";
  game.activeInvestigatorId = "investigator-1";
  game.investigatorTurnIndex = 0;
  game.pendingDecision = null;
  game.pendingEncounterChoice = null;

  game.board.spaces = {
    "space-1": {
      spaceId: "space-1",
      clues: 0,
      clueTokenIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
      monsterIds: [],
    },
  };

  const investigator = game.investigators["investigator-1"];

  investigator.spaceId = "space-1";
  investigator.actionsPerformed = [];
  investigator.componentActionsUsedThisRound = [];

  return game;
}

function addAsset(
  game: ReturnType<typeof createTestGame>,
  investigatorId: string,
  definitionId: string,
  instanceSuffix: string,
) {
  const definition = coreAssets.find((asset) => asset.id === definitionId);

  if (!definition) {
    throw new Error(`Asset "${definitionId}" does not exist.`);
  }

  const instanceId = `${definitionId}-${instanceSuffix}`;

  game.assets[instanceId] = {
    ...definition,
    id: instanceId,
  };

  game.investigators[investigatorId].assetIds.push(instanceId);

  return instanceId;
}

function addCondition(
  game: ReturnType<typeof createTestGame>,
  investigatorId: string,
  definitionId: string,
  instanceSuffix: string,
) {
  const definition = coreConditionDefinitions.find(
    (condition) => condition.id === definitionId,
  );

  if (!definition) {
    throw new Error(`Condition "${definitionId}" does not exist.`);
  }

  const instanceId = `${definitionId}-${instanceSuffix}`;

  game.conditions[instanceId] = {
    id: instanceId,
    definitionId,
    instanceNumber: 1,
    frontImage: "test-front.png",
    backImage: "test-back.png",
    backId: "test-back",
    flipped: false,
  };

  game.investigators[investigatorId].conditionIds.push(instanceId);

  return instanceId;
}

function addSpell(
  game: ReturnType<typeof createTestGame>,
  investigatorId: string,
  definitionId: string,
  instanceSuffix: string,
) {
  const definition = coreSpells.find((spell) => spell.id === definitionId);

  if (!definition) {
    throw new Error(`Spell "${definitionId}" does not exist.`);
  }

  const instanceId = `${definitionId}-${instanceSuffix}`;

  game.spells[instanceId] = {
    id: instanceId,
    definitionId,
    instanceNumber: 1,
    type: definition.type,
    frontImage: "test-front.png",
    backImage: "test-back.png",
    backId: "test-back",
    flipped: false,
    exhausted: false,
    pendingTestResult: null,
    pendingChosenInvestigatorId: null,
    pendingChosenMonsterId: null,
    pendingChosenClueId: null,
  };

  game.investigators[investigatorId].spellIds.push(instanceId);

  return {
    spellId: instanceId,
    definition,
  };
}

describe("Component Actions", () => {
  /*
   * ============================================================
   * POSSESSIONS
   * ============================================================
   */

  it("records a possession Component Action when it is used", () => {
    const game = prepareGame();

    const catBurglarId = addAsset(
      game,
      "investigator-1",
      "asset-cat-burglar",
      "test",
    );

    const result = activatePossessionAbility(
      game,
      "investigator-1",
      "asset",
      catBurglarId,
      "action",
      eldritchBaseMap,
    );

    const investigator = result.investigators["investigator-1"];

    expect(investigator.actionsPerformed).toContain("component");

    expect(investigator.componentActionsUsedThisRound).toContain(
      `asset:${catBurglarId}:action`,
    );
  });

  it("cannot use the same possession Component Action twice in the same round", () => {
    const game = prepareGame();

    const catBurglarId = addAsset(
      game,
      "investigator-1",
      "asset-cat-burglar",
      "test",
    );

    const firstUse = activatePossessionAbility(
      game,
      "investigator-1",
      "asset",
      catBurglarId,
      "action",
      eldritchBaseMap,
    );

    firstUse.pendingDecision = null;

    expect(() =>
      activatePossessionAbility(
        firstUse,
        "investigator-1",
        "asset",
        catBurglarId,
        "action",
        eldritchBaseMap,
      ),
    ).toThrow("This Component Action was already used this round.");
  });

  it("allows two different possession Component Actions in the same round", () => {
    const game = prepareGame();

    const firstCatBurglarId = addAsset(
      game,
      "investigator-1",
      "asset-cat-burglar",
      "first",
    );

    const secondCatBurglarId = addAsset(
      game,
      "investigator-1",
      "asset-cat-burglar",
      "second",
    );

    const firstUse = activatePossessionAbility(
      game,
      "investigator-1",
      "asset",
      firstCatBurglarId,
      "action",
      eldritchBaseMap,
    );

    firstUse.pendingDecision = null;

    const secondUse = activatePossessionAbility(
      firstUse,
      "investigator-1",
      "asset",
      secondCatBurglarId,
      "action",
      eldritchBaseMap,
    );

    const investigator = secondUse.investigators["investigator-1"];

    expect(investigator.actionsPerformed).toEqual(["component", "component"]);

    expect(investigator.componentActionsUsedThisRound).toContain(
      `asset:${firstCatBurglarId}:action`,
    );

    expect(investigator.componentActionsUsedThisRound).toContain(
      `asset:${secondCatBurglarId}:action`,
    );
  });

  it("allows the same possession Component Action again after the round usage is reset", () => {
    const game = prepareGame();

    const catBurglarId = addAsset(
      game,
      "investigator-1",
      "asset-cat-burglar",
      "test",
    );

    const firstUse = activatePossessionAbility(
      game,
      "investigator-1",
      "asset",
      catBurglarId,
      "action",
      eldritchBaseMap,
    );

    firstUse.pendingDecision = null;

    const investigator = firstUse.investigators["investigator-1"];

    investigator.actionsPerformed = [];
    investigator.componentActionsUsedThisRound = [];

    expect(() =>
      activatePossessionAbility(
        firstUse,
        "investigator-1",
        "asset",
        catBurglarId,
        "action",
        eldritchBaseMap,
      ),
    ).not.toThrow();
  });

  /*
   * ============================================================
   * CONDITIONS
   * ============================================================
   */

  it("records a Condition Component Action when it is used", () => {
    const game = prepareGame();

    const debtId = addCondition(
      game,
      "investigator-1",
      "condition-debt",
      "test",
    );

    const result = startConditionLocalAction(game, debtId, eldritchBaseMap);

    const investigator = result.game.investigators["investigator-1"];

    expect(investigator.actionsPerformed).toContain("component");

    expect(investigator.componentActionsUsedThisRound).toContain(
      `condition:${debtId}:local-action`,
    );
  });

  it("cannot use the same Condition Component Action twice in the same round", () => {
    const game = prepareGame();

    const debtId = addCondition(
      game,
      "investigator-1",
      "condition-debt",
      "test",
    );

    const firstUse = startConditionLocalAction(game, debtId, eldritchBaseMap);

    /*
     * Debt can discard itself on a
     * successful test. Restore ownership
     * because this test is specifically
     * checking the Component Action
     * per-round restriction.
     */
    firstUse.game.conditions[debtId] = {
      id: debtId,
      definitionId: "condition-debt",
      instanceNumber: 1,
      frontImage: "test-front.png",
      backImage: "test-back.png",
      backId: "test-back",
      flipped: false,
    };

    if (
      !firstUse.game.investigators["investigator-1"].conditionIds.includes(
        debtId,
      )
    ) {
      firstUse.game.investigators["investigator-1"].conditionIds.push(debtId);
    }

    expect(() =>
      startConditionLocalAction(firstUse.game, debtId, eldritchBaseMap),
    ).toThrow("This Component Action was already used this round.");
  });

  it("allows the same Condition Component Action again after the round usage is reset", () => {
    const game = prepareGame();

    const debtId = addCondition(
      game,
      "investigator-1",
      "condition-debt",
      "test",
    );

    const firstUse = startConditionLocalAction(game, debtId, eldritchBaseMap);

    firstUse.game.conditions[debtId] = {
      id: debtId,
      definitionId: "condition-debt",
      instanceNumber: 1,
      frontImage: "test-front.png",
      backImage: "test-back.png",
      backId: "test-back",
      flipped: false,
    };

    const investigator = firstUse.game.investigators["investigator-1"];

    if (!investigator.conditionIds.includes(debtId)) {
      investigator.conditionIds.push(debtId);
    }

    investigator.actionsPerformed = [];
    investigator.componentActionsUsedThisRound = [];

    expect(() =>
      startConditionLocalAction(firstUse.game, debtId, eldritchBaseMap),
    ).not.toThrow();
  });

  /*
   * ============================================================
   * SPELLS
   * ============================================================
   */

  it("records and consumes a Spell Component Action when an Action Spell is used", () => {
    const game = prepareGame();

    const { spellId, definition } = addSpell(
      game,
      "investigator-1",
      "spell-blessing-of-isis",
      "test",
    );

    const effect = definition.frontEffects.find(
      (candidate) => candidate.type === "action-test",
    );

    if (!effect || effect.type !== "action-test") {
      throw new Error("Blessing of Isis has no Action test.");
    }

    const result = resolveSpellFrontEffects(
      game,
      "investigator-1",
      spellId,
      effect,
      eldritchBaseMap,
      {
        deferTriggeredEffects: true,
      },
    );

    const investigator = result.game.investigators["investigator-1"];

    expect(investigator.actionsPerformed).toContain("component");

    expect(investigator.componentActionsUsedThisRound).toContain(
      `spell:${spellId}:action`,
    );
  });

  it("cannot use the same Spell Component Action twice in the same round", () => {
    const game = prepareGame();

    const { spellId, definition } = addSpell(
      game,
      "investigator-1",
      "spell-blessing-of-isis",
      "test",
    );

    const effect = definition.frontEffects.find(
      (candidate) => candidate.type === "action-test",
    );

    if (!effect || effect.type !== "action-test") {
      throw new Error("Blessing of Isis has no Action test.");
    }

    const firstUse = resolveSpellFrontEffects(
      game,
      "investigator-1",
      spellId,
      effect,
      eldritchBaseMap,
      {
        deferTriggeredEffects: true,
      },
    );

    /*
     * Keep the Spell on its front side
     * so this test isolates the
     * per-round Component Action rule.
     */
    firstUse.game.spells[spellId].flipped = false;

    expect(() =>
      resolveSpellFrontEffects(
        firstUse.game,
        "investigator-1",
        spellId,
        effect,
        eldritchBaseMap,
        {
          deferTriggeredEffects: true,
        },
      ),
    ).toThrow("This Component Action was already used this round.");
  });

  it("allows two different Spell Component Actions in the same round", () => {
    const game = prepareGame();

    const firstSpell = addSpell(
      game,
      "investigator-1",
      "spell-blessing-of-isis",
      "first",
    );

    const secondSpell = addSpell(
      game,
      "investigator-1",
      "spell-conjuration",
      "second",
    );

    const firstEffect = firstSpell.definition.frontEffects.find(
      (candidate) => candidate.type === "action-test",
    );

    const secondEffect = secondSpell.definition.frontEffects.find(
      (candidate) => candidate.type === "action-test",
    );

    if (
      !firstEffect ||
      firstEffect.type !== "action-test" ||
      !secondEffect ||
      secondEffect.type !== "action-test"
    ) {
      throw new Error("Test Spells have no Action test.");
    }

    const firstUse = resolveSpellFrontEffects(
      game,
      "investigator-1",
      firstSpell.spellId,
      firstEffect,
      eldritchBaseMap,
      {
        deferTriggeredEffects: true,
      },
    );

    const secondUse = resolveSpellFrontEffects(
      firstUse.game,
      "investigator-1",
      secondSpell.spellId,
      secondEffect,
      eldritchBaseMap,
      {
        deferTriggeredEffects: true,
      },
    );

    const investigator = secondUse.game.investigators["investigator-1"];

    expect(investigator.actionsPerformed).toEqual(["component", "component"]);

    expect(investigator.componentActionsUsedThisRound).toContain(
      `spell:${firstSpell.spellId}:action`,
    );

    expect(investigator.componentActionsUsedThisRound).toContain(
      `spell:${secondSpell.spellId}:action`,
    );
  });

  it("allows the same Spell Component Action again after the round usage is reset", () => {
    const game = prepareGame();

    const { spellId, definition } = addSpell(
      game,
      "investigator-1",
      "spell-blessing-of-isis",
      "test",
    );

    const effect = definition.frontEffects.find(
      (candidate) => candidate.type === "action-test",
    );

    if (!effect || effect.type !== "action-test") {
      throw new Error("Blessing of Isis has no Action test.");
    }

    const firstUse = resolveSpellFrontEffects(
      game,
      "investigator-1",
      spellId,
      effect,
      eldritchBaseMap,
      {
        deferTriggeredEffects: true,
      },
    );

    const investigator = firstUse.game.investigators["investigator-1"];

    investigator.actionsPerformed = [];
    investigator.componentActionsUsedThisRound = [];

    firstUse.game.spells[spellId].flipped = false;

    expect(() =>
      resolveSpellFrontEffects(
        firstUse.game,
        "investigator-1",
        spellId,
        effect,
        eldritchBaseMap,
        {
          deferTriggeredEffects: true,
        },
      ),
    ).not.toThrow();
  });
});
