import { describe, expect, it } from "vitest";

import { continueDarkPower } from "../engine/continueDarkPower";

import { createTestGame } from "./helpers/createTestGame";

import type { GameState } from "../models/GameState";

import type { DarkPowerResume } from "../models/PendingDecision";

function prepareGame(): GameState {
  const game = createTestGame();

  game.ancientOne = {
    ...game.ancientOne,
    id: "azathoth",
  };

  game.phase = "mythos";

  game.activeInvestigatorId = null;

  game.currentMythosId = "a-proposition";

  game.board.mythosDiscard = [];

  game.pendingDecision = null;

  game.combatOrder = null;

  game.investigators["investigator-1"].spaceId = "arkham";

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

    square: {
      spaceId: "square",
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    },
  };

  return game;
}

function addInvestigator(
  game: GameState,
  investigatorId: string,
  spaceId: string | null,
): void {
  game.investigators[investigatorId] = {
    ...game.investigators["investigator-1"],

    id: investigatorId,

    spaceId,

    isDefeated: false,
  };
}

function addMonster(game: GameState, monsterId: string, spaceId: string): void {
  game.monsters[monsterId] = {
    id: monsterId,

    definitionId: "cultist",

    spaceId,

    health: 3,

    maxHealth: 3,

    engagedInvestigatorId: null,

    isEpic: false,
  } as GameState["monsters"][string];

  game.board.spaces[spaceId].monsterIds.push(monsterId);
}

function createResume(
  investigatorIds: string[],
  currentInvestigatorIndex = 0,
): DarkPowerResume {
  return {
    type: "mythos-dark-power",

    investigatorIds,

    currentInvestigatorIndex,

    monsterIds: [],

    resolvedMonsterIds: [],
  };
}

describe("continueDarkPower", () => {
  it("starts Combat for the next Investigator when they have one Monster", () => {
    const game = prepareGame();

    addInvestigator(game, "investigator-2", "square");

    addMonster(game, "monster-2", "square");

    const resume = createResume(["investigator-1", "investigator-2"]);

    const result = continueDarkPower(game, resume);

    expect(result.activeInvestigatorId).toBe("investigator-2");

    expect(result.pendingDecision?.type).toBe("combat");

    if (result.pendingDecision?.type === "combat") {
      expect(result.pendingDecision.monsterId).toBe("monster-2");

      expect(result.pendingDecision.resume?.type).toBe("mythos-dark-power");

      if (result.pendingDecision.resume?.type === "mythos-dark-power") {
        expect(result.pendingDecision.resume.currentInvestigatorIndex).toBe(1);

        expect(result.pendingDecision.resume.monsterIds).toEqual(["monster-2"]);

        expect(result.pendingDecision.resume.resolvedMonsterIds).toEqual([]);
      }
    }
  });

  it("asks for Combat Order when the next Investigator has multiple Monsters", () => {
    const game = prepareGame();

    addInvestigator(game, "investigator-2", "square");

    addMonster(game, "monster-2", "square");

    addMonster(game, "monster-3", "square");

    const result = continueDarkPower(
      game,
      createResume(["investigator-1", "investigator-2"]),
    );

    expect(result.activeInvestigatorId).toBe("investigator-2");

    expect(result.pendingDecision?.type).toBe("combat-order");

    if (result.pendingDecision?.type === "combat-order") {
      expect(result.pendingDecision.monsterIds).toEqual([
        "monster-2",
        "monster-3",
      ]);

      expect(result.pendingDecision.orderedMonsterIds).toEqual([]);

      expect(result.pendingDecision.resume?.type).toBe("mythos-dark-power");
    }
  });

  it("skips defeated Investigators", () => {
    const game = prepareGame();

    addInvestigator(game, "investigator-2", "square");

    game.investigators["investigator-2"].isDefeated = true;

    addInvestigator(game, "investigator-3", "square");

    addMonster(game, "monster-3", "square");

    const result = continueDarkPower(
      game,
      createResume(["investigator-1", "investigator-2", "investigator-3"]),
    );

    expect(result.activeInvestigatorId).toBe("investigator-3");

    expect(result.pendingDecision?.type).toBe("combat");

    if (result.pendingDecision?.type === "combat") {
      expect(result.pendingDecision.monsterId).toBe("monster-3");
    }
  });

  it("skips Investigators without Monsters", () => {
    const game = prepareGame();

    addInvestigator(game, "investigator-2", "square");

    addInvestigator(game, "investigator-3", "square");

    addMonster(game, "monster-3", "square");

    game.investigators["investigator-2"].spaceId = "arkham";

    const result = continueDarkPower(
      game,
      createResume(["investigator-1", "investigator-2", "investigator-3"]),
    );

    expect(result.activeInvestigatorId).toBe("investigator-3");

    expect(result.pendingDecision?.type).toBe("combat");
  });

  it("discards the current Mythos when no Investigators remain to resolve", () => {
    const game = prepareGame();

    const result = continueDarkPower(game, createResume(["investigator-1"]));

    expect(result.currentMythosId).toBeNull();

    expect(result.activeInvestigatorId).toBeNull();

    expect(result.pendingDecision).toBeNull();

    expect(result.combatOrder).toBeNull();

    expect(
      result.board.mythosDiscard.some(
        (mythos) => mythos.id === "a-proposition",
      ),
    ).toBe(true);
  });

  it("throws when Dark Power finishes but the current Mythos does not exist", () => {
    const game = prepareGame();

    game.currentMythosId = "missing-mythos";

    expect(() =>
      continueDarkPower(game, createResume(["investigator-1"])),
    ).toThrow("A Dark Power could not find the current Mythos card.");
  });
});
