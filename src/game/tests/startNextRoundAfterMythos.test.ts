import { describe, expect, it } from "vitest";

import type { GameState } from "../models/GameState";
import type { Investigator } from "../models/Investigator";

import { startNextRoundAfterMythos } from "../engine/startNextRoundAfterMythos";

function makeInvestigator(
  id: string,
  overrides: Partial<Investigator> = {},
): Investigator {
  return {
    id,
    definitionId: "silas-marsh",

    health: 5,
    maxHealth: 5,

    sanity: 5,
    maxSanity: 5,

    skills: {
      lore: 2,
      influence: 2,
      observation: 2,
      strength: 2,
      will: 2,
    },

    resources: 3,
    clues: 0,

    spaceId: "space-1",

    trainTickets: 0,
    shipTickets: 0,

    travelMoves: 0,
    travelActive: false,
    travelHistory: [],
    travelStartSpaceId: null,

    engagedMonsterIds: [],

    isDelayed: false,
    isDefeated: false,

    assetIds: [],
    spellIds: [],
    artifactIds: [],

    actionsPerformed: [],

    conditionIds: [],

    personalStoryProgress: 0,

    ...overrides,
  };
}

function makeGame(
  overrides: Partial<GameState> = {},
): GameState {
  return {
    scenarioId: "test-scenario",

    round: 3,

    status: "playing",

    phase: "mythos",

    currentMythosId: "a-proposition",

    board: {} as GameState["board"],

    investigators: {
      i1: makeInvestigator("i1"),
      i2: makeInvestigator("i2"),
      i3: makeInvestigator("i3"),
    },

    assets: {},
    spells: {},
    artifacts: {},
    conditions: {},

    encounters: {},

    currentEncounterId: null,
    currentEncounterBackId: null,
    currentEncounterRevealed: false,
    currentEncounterIsResearch: false,
    currentEncounterDeckType: null,
    currentEncounterFromFracturedReality: false,

    leadInvestigatorId: "i1",
    activeInvestigatorId: "i1",

    investigatorOrder: [
      "i1",
      "i2",
      "i3",
    ],

    investigatorTurnIndex: 2,

    pendingInvestigatorReplacements: [],

    lastTest: null,

    pendingSpellChoice: null,
    pendingEncounterChoice: null,

    ancientOne: {} as GameState["ancientOne"],

    monsters: {},

    combatOrder: null,

    ...({
      pendingDecision: {
        type: "continue",
        title: "Mythos",
        message: "Continue",
        source: "test",
      },
    } as Partial<GameState>),

    ...overrides,
  } as GameState;
}

describe("startNextRoundAfterMythos", () => {
  it("throws when trying to start a new round outside the Mythos phase", () => {
    const game = makeGame({
      phase: "action",
    });

    expect(() =>
      startNextRoundAfterMythos(
        game,
        "i2",
      ),
    ).toThrow(
      "A new round can only start from the Mythos phase.",
    );
  });

  it("throws when the selected investigator is not in the game", () => {
    const game = makeGame({
      phase: "mythos",
      investigatorOrder: [
        "i1",
        "i2",
        "i3",
      ],
    });

    expect(() =>
      startNextRoundAfterMythos(
        game,
        "unknown-investigator",
      ),
    ).toThrow(
      'Investigator "unknown-investigator" is not in the game.',
    );
  });

  it("starts a new Action round with the selected investigator as Lead", () => {
    const game = makeGame({
      round: 3,
      phase: "mythos",
      currentMythosId: "a-proposition",
      leadInvestigatorId: "i1",
      activeInvestigatorId: "i1",
      investigatorOrder: [
        "i1",
        "i2",
        "i3",
      ],
      investigatorTurnIndex: 2,
    });

    const result = startNextRoundAfterMythos(
      game,
      "i2",
    );

    expect(result.round).toBe(4);

    expect(result.phase).toBe("action");

    expect(result.currentMythosId).toBeNull();

    expect(result.leadInvestigatorId).toBe(
      "i2",
    );

    expect(result.activeInvestigatorId).toBe(
      "i2",
    );

    expect(result.investigatorTurnIndex).toBe(
      0,
    );

    expect(result.investigatorOrder).toEqual([
      "i2",
      "i3",
      "i1",
    ]);

    expect(result.pendingDecision).toBeNull();
  });

  it("rotates the investigator order when the new Lead is not first", () => {
    const game = makeGame({
      investigatorOrder: [
        "i1",
        "i2",
        "i3",
      ],
    });

    const result = startNextRoundAfterMythos(
      game,
      "i3",
    );

    expect(result.investigatorOrder).toEqual([
      "i3",
      "i1",
      "i2",
    ]);

    expect(result.leadInvestigatorId).toBe(
      "i3",
    );

    expect(result.activeInvestigatorId).toBe(
      "i3",
    );
  });

  it("resets the new Lead's actions when the new round starts", () => {
    const game = makeGame({
      investigators: {
        i1: makeInvestigator("i1", {
          actionsPerformed: [],
        }),

        i2: makeInvestigator("i2", {
          actionsPerformed: [
            "travel",
            "acquire-assets",
          ] as Investigator["actionsPerformed"],
        }),

        i3: makeInvestigator("i3", {
          actionsPerformed: [
            "travel",
          ] as Investigator["actionsPerformed"],
        }),
      },
    });

    const result = startNextRoundAfterMythos(
      game,
      "i2",
    );

    expect(
      result.investigators.i2.actionsPerformed,
    ).toEqual([]);

    expect(
      result.investigators.i1.actionsPerformed,
    ).toEqual([]);

    expect(
      result.investigators.i3.actionsPerformed,
    ).toEqual([
      "travel",
    ]);
  });
});