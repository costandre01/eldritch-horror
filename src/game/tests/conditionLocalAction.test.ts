import { afterEach, describe, expect, it, vi } from "vitest";

import { getConditionLocalActions, resolveConditionLocalActionTest, startConditionLocalAction } from "../engine/conditionLocalAction";
import { startTravel } from "../engine/startTravel";
import { tradeInvestigator } from "../engine/tradeInvestigator";
import { createTestGame } from "./helpers/createTestGame";
import type { GameState } from "../models/GameState";
import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";

const map = eldritchBaseMap;

function addFrontCondition(game: GameState, id: string, definitionId: string, backId: string): void {
  game.conditions[id] = {
    id,
    definitionId,
    instanceNumber: 1,
    frontImage: "/front.jpg",
    backImage: "/back.jpg",
    backId,
    flipped: false,
  };
  game.investigators["investigator-1"]!.conditionIds.push(id);
}

function prepareGame(): GameState {
  const game = createTestGame();
  game.phase = "action";
  game.scenarioId = map.id;
  game.pendingDecision = null;
  game.board.conditionDiscard = [];
  game.investigators["investigator-1"]!.spaceId = "san-francisco";
  game.investigators["investigator-1"]!.skills.influence = 1;
  return game;
}

afterEach(() => vi.restoreAllMocks());

describe("Condition Local Actions", () => {
  it("shows and resolves Debt's Influence Local Action, discarding it on a pass", () => {
    const game = prepareGame();
    addFrontCondition(game, "debt-1", "condition-debt", "debt-back-1");
    vi.spyOn(Math, "random").mockReturnValue(0.99);

    const actions = getConditionLocalActions(game, "investigator-1");
    expect(actions.map((action) => [action.conditionName, action.effect.testType])).toEqual([["Debt", "influence"]]);

    const started = startConditionLocalAction(game, "debt-1", map);
    expect(started.test.passed).toBe(true);
    expect(started.game.investigators["investigator-1"]?.actionsPerformed).toContain("component");
    expect(started.game.investigators["investigator-1"]?.conditionIds).toContain("debt-1");

    const completed = resolveConditionLocalActionTest(started.game, "investigator-1", "debt-1", started.test, map);
    expect(completed.investigators["investigator-1"]?.conditionIds).not.toContain("debt-1");
    expect(completed.board.conditionDeck).toContain("debt-1");
  });

  it("leaves Detained in play after a failed Local Action test", () => {
    const game = prepareGame();
    addFrontCondition(game, "detained-1", "condition-detained", "detained-back-1");
    vi.spyOn(Math, "random").mockReturnValue(0);

    const started = startConditionLocalAction(game, "detained-1", map);
    expect(started.test.passed).toBe(false);

    const completed = resolveConditionLocalActionTest(started.game, "investigator-1", "detained-1", started.test, map);
    expect(completed.investigators["investigator-1"]?.conditionIds).toContain("detained-1");
    expect(completed.board.conditionDiscard).toEqual([]);
  });

  it("restricts a Detained investigator to the Detained card's Local Action", () => {
    const game = prepareGame();
    addFrontCondition(game, "debt-1", "condition-debt", "debt-back-1");
    addFrontCondition(game, "detained-1", "condition-detained", "detained-back-1");

    expect(getConditionLocalActions(game, "investigator-1").map((action) => action.condition.id)).toEqual(["detained-1"]);
    expect(() => startConditionLocalAction(game, "debt-1", map)).toThrow("Detained restricts the Investigator to its own Local Action.");
    expect(() => startTravel(game)).toThrow("Detained restricts the Investigator to the Local Action on that Condition.");
    expect(() => tradeInvestigator(game, "investigator-2", {
      clues: 0,
      trainTickets: 0,
      shipTickets: 0,
      assetIds: [],
      artifactIds: [],
      spellIds: [],
      targetClues: 0,
      targetTrainTickets: 0,
      targetShipTickets: 0,
      targetAssetIds: [],
      targetArtifactIds: [],
      targetSpellIds: [],
    }, { brainCase: true })).toThrow("Detained restricts the Investigator to the Local Action on that Condition.");
  });

  it("does not expose Local Actions for flipped Conditions", () => {
    const game = prepareGame();
    addFrontCondition(game, "debt-1", "condition-debt", "debt-back-1");
    game.conditions["debt-1"]!.flipped = true;

    expect(getConditionLocalActions(game, "investigator-1")).toEqual([]);
  });

  it("requires the Local Action to be available in the Action phase", () => {
    const game = prepareGame();
    addFrontCondition(game, "debt-1", "condition-debt", "debt-back-1");
    game.phase = "encounter";

    expect(() => startConditionLocalAction(game, "debt-1", map)).toThrow("Condition Local Actions can only be performed during the Action phase.");
  });

  it("does not allow a Local Action while travel is still active", () => {
    const game = prepareGame();
    addFrontCondition(game, "debt-1", "condition-debt", "debt-back-1");
    game.investigators["investigator-1"]!.travelActive = true;

    expect(() => startConditionLocalAction(game, "debt-1", map)).toThrow("Finish the current travel before performing a Condition Local Action.");
  });
});
