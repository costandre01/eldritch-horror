import { describe, expect, it } from "vitest";

import { coreSpells } from "../../content/core/coreSpell";
import { createSpell } from "../engine/createSpell";
import { getSpellLossPrevention } from "../engine/getSpellLossPrevention";
import { getActionSpellOptions, getCombatSpellOptions, getEncounterSpellOptions } from "../engine/encounterSpellWindow";
import { resolveSpellChoice } from "../engine/resolveSpellChoice";
import { resolveSpellFrontTriggeredEffects } from "../engine/resolveSpellFrontTriggeredEffects";
import type { TestResult } from "../models/TestResult";
import { createTestGame } from "./helpers/createTestGame";

const passed = (successes: number): TestResult => ({
  skill: "lore",
  modifier: 0,
  difficulty: 1,
  diceRolled: Math.max(1, successes),
  results: Array.from({ length: Math.max(1, successes) }, () => 6),
  successes,
  passed: successes > 0,
});

function setupSpell(definitionId: string, backNumber = 1) {
  const definition = coreSpells.find((candidate) => candidate.id === definitionId)!;
  const spell = createSpell(definition, backNumber);
  const game = createTestGame();
  game.activeInvestigatorId = "investigator-1";
  game.investigators["investigator-1"].spaceId = "arkham";
  game.investigators["investigator-1"].spellIds = [spell.id];
  game.spells = { [spell.id]: { ...spell, pendingTestResult: passed(2) } };
  game.board = {
    ...game.board,
    spaces: {
      arkham: {
        spaceId: "arkham",
        clueTokenIds: [],
        monsterIds: [],
        clues: 0,
        gates: [],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },
    },
    assetReserve: [],
  };
  return { game, definition, spell };
}

describe("Spell activation choices", () => {
  it("offers every core Spell only in its activation window", () => {
    const game = createTestGame();
    const instances = coreSpells.map((definition) => createSpell(definition, 1));
    game.activeInvestigatorId = "investigator-1";
    game.pendingDecision = null;
    game.investigators["investigator-1"].spellIds = instances.map((spell) => spell.id);
    game.spells = Object.fromEntries(instances.map((spell) => [spell.id, spell]));

    game.phase = "action";
    expect(getActionSpellOptions(game).map((option) => option.name).sort()).toEqual([
      "Blessing of Isis", "Conjuration", "Feed the Mind", "Plumb the Void", "Shriveling",
    ]);

    game.phase = "encounter";
    expect(getEncounterSpellOptions(game).map((option) => option.name).sort()).toEqual([
      "Clairvoyance", "Mists of Releh",
    ]);

    game.pendingDecision = { type: "combat", title: "Combat", monsterId: "monster-1", stage: "start" };
    expect(getCombatSpellOptions(game).map((option) => option.name)).toEqual(["Wither"]);

    expect(coreSpells.filter((definition) => definition.frontEffects.some((effect) =>
      effect.type === "on-health-loss" || effect.type === "on-sanity-loss")).map((definition) => definition.name).sort()).toEqual([
      "Flesh Ward", "Instill Bravery",
    ]);
  });

  it("allows Conjuration to decline its optional Asset and still flips", () => {
    const { game, definition, spell } = setupSpell("spell-conjuration");
    const front = definition.frontEffects[0];
    if (front.type !== "action-test") throw new Error("Invalid test fixture");

    const offered = resolveSpellFrontTriggeredEffects(game, "investigator-1", spell.id, front.onSuccess).game;
    expect(offered.pendingSpellChoice?.optional).toBe(true);

    const skipped = resolveSpellChoice(offered, "skip-spell-choice");
    expect(skipped.pendingSpellChoice).toBeNull();
    expect(skipped.spells[spell.id].flipped).toBe(true);
  });

  it("allows Clairvoyance to keep the normal encounter when no Clue is chosen", () => {
    const { game, definition, spell } = setupSpell("spell-clairvoyance");
    const front = definition.frontEffects[0];
    if (front.type !== "on-encounter-phase") throw new Error("Invalid test fixture");

    const offered = resolveSpellFrontTriggeredEffects(game, "investigator-1", spell.id, front.onSuccess).game;
    expect(offered.pendingSpellChoice?.type).toBe("choose-clue");
    const skipped = resolveSpellChoice(offered, "skip-spell-choice");
    expect(skipped.pendingSpellChoice).toBeNull();
    expect(skipped.ignoreMonstersForNextEncounter).not.toBe(true);
    expect(skipped.spells[spell.id].flipped).toBe(true);
  });

  it("does not deadlock Shriveling when there is no legal Monster target", () => {
    const { game, definition, spell } = setupSpell("spell-shriveling");
    const front = definition.frontEffects[0];
    if (front.type !== "action-test") throw new Error("Invalid test fixture");

    const resolved = resolveSpellFrontTriggeredEffects(game, "investigator-1", spell.id, front.onSuccess).game;
    expect(resolved.pendingSpellChoice).toBeNull();
    expect(resolved.spells[spell.id].flipped).toBe(true);
  });
});

describe("loss reaction Spell prevention", () => {
  it("includes the selected back effect and always returns zero on a failed cast", () => {
    const definition = coreSpells.find((candidate) => candidate.id === "spell-flesh-ward")!;
    expect(getSpellLossPrevention(definition, "flesh-ward-back-2", 0, "health", passed(3))).toBe(5);
    expect(getSpellLossPrevention(definition, "flesh-ward-back-2", 0, "health", passed(0))).toBe(0);
  });
});
