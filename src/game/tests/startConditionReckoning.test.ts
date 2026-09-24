import { describe, expect, it } from "vitest";

import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { startConditionReckoning } from "../engine/startConditionReckoning";

function makeInvestigator(
  overrides: Partial<GameState["investigators"][string]> = {},
) {
  return {
    id: "i1",
    name: "Investigator",
    isDefeated: false,
    conditionIds: [],
    ...overrides,
  } as GameState["investigators"][string];
}

function makeGame(
  overrides: Partial<GameState> = {},
): GameState {
  return {
    investigatorOrder: ["i1"],
    investigators: {
      i1: makeInvestigator(),
    },
    currentMythosId: "a-proposition",
    pendingDecision: null,
    ...overrides,
  } as GameState;
}

const map = {} as MapDefinition;

describe("startConditionReckoning", () => {
  it("creates a pending Condition Reckoning decision when an investigator has Conditions", () => {
    const game = makeGame({
      investigatorOrder: ["i1"],
      investigators: {
        i1: makeInvestigator({
          conditionIds: ["debt", "paranoia"],
        }),
      },
    });

    const result = startConditionReckoning(
      game,
      map,
      3,
    );

    expect(result.pendingDecision).toMatchObject({
      type: "mythos-condition-reckoning",
      title: "CONDITIONS — RECKONING",
      message:
        "Resolve the Reckoning effects of the investigators' Conditions.",
      investigatorIds: ["i1"],
      currentInvestigatorIndex: 0,
      conditionIds: [["debt", "paranoia"]],
      currentConditionIndex: 0,
      source: "mythos:condition-reckoning",
      nextIconIndex: 3,
      treatDiceAsOne: false,
    });
  });

  it("continues the Mythos flow when there are no Conditions to resolve", () => {
    const game = makeGame({
      currentMythosId: "a-proposition",
      investigatorOrder: ["i1"],
      investigators: {
        i1: makeInvestigator({
          conditionIds: [],
        }),
      },
    });

    const result = startConditionReckoning(
      game,
      map,
      4,
    );

    expect(result.pendingDecision).toMatchObject({
      type: "continue",
      source: "mythos-card:4",
    });

    expect(result.pendingDecision).not.toBeNull();

    if (result.pendingDecision?.type === "continue") {
      expect(result.pendingDecision.title).toBe(
        "A Proposition",
      );
    }
  });

  it("ignores defeated investigators even when they have Conditions", () => {
    const game = makeGame({
      currentMythosId: "a-proposition",
      investigatorOrder: ["i1"],
      investigators: {
        i1: makeInvestigator({
          isDefeated: true,
          conditionIds: ["debt"],
        }),
      },
    });

    const result = startConditionReckoning(
      game,
      map,
      5,
    );

    expect(result.pendingDecision).toMatchObject({
      type: "continue",
      source: "mythos-card:5",
    });

    expect(result.pendingDecision).not.toBeNull();

    if (result.pendingDecision?.type === "continue") {
      expect(result.pendingDecision.title).toBe(
        "A Proposition",
      );
    }
  });

  it("ignores investigators without Conditions when another investigator has Conditions", () => {
    const game = makeGame({
      investigatorOrder: ["i1", "i2"],
      investigators: {
        i1: makeInvestigator({
          id: "i1",
          conditionIds: [],
        }),
        i2: makeInvestigator({
          id: "i2",
          conditionIds: ["paranoia"],
        }),
      },
    });

    const result = startConditionReckoning(
      game,
      map,
      6,
    );

    expect(result.pendingDecision).toMatchObject({
      type: "mythos-condition-reckoning",
      investigatorIds: ["i2"],
      currentInvestigatorIndex: 0,
      conditionIds: [["paranoia"]],
      currentConditionIndex: 0,
      nextIconIndex: 6,
      treatDiceAsOne: false,
    });
  });

  it("supports treating dice as one", () => {
    const game = makeGame({
      investigatorOrder: ["i1"],
      investigators: {
        i1: makeInvestigator({
          conditionIds: ["debt"],
        }),
      },
    });

    const result = startConditionReckoning(
      game,
      map,
      7,
      true,
    );

    expect(result.pendingDecision).toMatchObject({
      type: "mythos-condition-reckoning",
      investigatorIds: ["i1"],
      conditionIds: [["debt"]],
      nextIconIndex: 7,
      treatDiceAsOne: true,
    });
  });
});