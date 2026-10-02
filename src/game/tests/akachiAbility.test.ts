import { describe, expect, it } from "vitest";

import { activateInvestigatorAbility } from "../engine/activateInvestigatorAbility";
import { resolveGameFlowChoice } from "../engine/resolveGameFlowChoice";

import { createTestGame } from "./helpers/createTestGame";
import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";
import type { GameState } from "../models/GameState";

describe("Akachi Onyele — Gate Insight", () => {
  function createAkachiGame(): GameState {
    const game = createTestGame();

    const investigatorId = game.activeInvestigatorId;

    if (!investigatorId) {
      throw new Error("Test game has no active investigator.");
    }

    return {
      ...game,

      phase: "action" as const,

      pendingDecision: null,
      pendingEncounterChoice: null,

      board: {
        ...game.board,

        gateStack: [
          {
            id: "gate-arkham",
            spaceId: "arkham",
            omen: "green",
          },
          {
            id: "gate-london",
            spaceId: "london",
            omen: "blue",
          },
          {
            id: "gate-tokyo",
            spaceId: "tokyo",
            omen: "red",
          },
          {
            id: "gate-buenos-aires",
            spaceId: "buenos-aires",
            omen: "green",
          },
        ],
      },

      investigators: {
        ...game.investigators,

        [investigatorId]: {
          ...game.investigators[investigatorId],

          definitionId: "akachi-onyele",

          actionsPerformed: [],

          componentActionsUsedThisRound: [],
        },
      },
    };
  }

  it("opens a choice using the top 2 Gates", () => {
    const game = createAkachiGame();

    const firstGate = game.board.gateStack[0];

    const secondGate = game.board.gateStack[1];

    expect(firstGate).toBeDefined();
    expect(secondGate).toBeDefined();

    const result = activateInvestigatorAbility(game, "akachi-action");

    expect(result.pendingDecision?.type).toBe("choice");

    if (result.pendingDecision?.type !== "choice") {
      throw new Error("Expected a choice decision.");
    }

    expect(result.pendingDecision.source).toBe(
      "investigator-ability:akachi-action",
    );

    expect(result.pendingDecision.options.map((option) => option.id)).toEqual([
      `akachi-gate:${firstGate!.id}`,
      `akachi-gate:${secondGate!.id}`,
    ]);
  });

  it("counts Gate Insight as one Component Action", () => {
    const game = createAkachiGame();

    const investigatorId = game.activeInvestigatorId!;

    const result = activateInvestigatorAbility(game, "akachi-action");

    expect(result.investigators[investigatorId].actionsPerformed).toContain(
      "component",
    );

    expect(
      result.investigators[investigatorId].componentActionsUsedThisRound,
    ).toContain("investigator:akachi-action");
  });

  it("keeps the selected Gate on top and moves the other Gate to the bottom", () => {
    const game = createAkachiGame();

    const firstGate = game.board.gateStack[0]!;

    const secondGate = game.board.gateStack[1]!;

    const started = activateInvestigatorAbility(game, "akachi-action");

    const result = resolveGameFlowChoice(
      started,
      `akachi-gate:${secondGate.id}`,
      eldritchBaseMap,
    );

    expect(result.board.gateStack[0].id).toBe(secondGate.id);

    expect(result.board.gateStack[result.board.gateStack.length - 1].id).toBe(
      firstGate.id,
    );

    expect(result.pendingDecision).toBeNull();
  });

  it("does not change the order of the remaining Gates", () => {
    const game = createAkachiGame();

    const firstGate = game.board.gateStack[0]!;

    const originalRemaining = game.board.gateStack
      .slice(2)
      .map((gate) => gate.id);

    const started = activateInvestigatorAbility(game, "akachi-action");

    const result = resolveGameFlowChoice(
      started,
      `akachi-gate:${firstGate.id}`,
      eldritchBaseMap,
    );

    expect(result.board.gateStack.slice(1, -1).map((gate) => gate.id)).toEqual(
      originalRemaining,
    );
  });

  it("cannot use Gate Insight twice in the same round", () => {
    const game = createAkachiGame();

    const firstUse = activateInvestigatorAbility(game, "akachi-action");

    const firstGate = firstUse.board.gateStack[0]!;

    const resolved = resolveGameFlowChoice(
      firstUse,
      `akachi-gate:${firstGate.id}`,
      eldritchBaseMap,
    );

    expect(() =>
      activateInvestigatorAbility(resolved, "akachi-action"),
    ).toThrow("This Investigator Action ability was already used this round.");
  });

  it("rejects a Gate that was not revealed", () => {
    const game = createAkachiGame();

    const started = activateInvestigatorAbility(game, "akachi-action");

    const thirdGate = started.board.gateStack[2];

    expect(thirdGate).toBeDefined();

    expect(() =>
      resolveGameFlowChoice(
        started,
        `akachi-gate:${thirdGate!.id}`,
        eldritchBaseMap,
      ),
    ).toThrow(
      "The selected Gate is not one of the Gates revealed by Gate Insight.",
    );
  });
});
