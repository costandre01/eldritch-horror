import { describe, expect, it } from "vitest";

import type { GameState } from "../models/GameState";
import type { BoardState } from "../models/BoardState";
import type { Investigator } from "../models/Investigator";

import { endInvestigatorActions } from "../engine/endInvestigatorActions";

function makeInvestigator(
  id: string,
  definitionId = "silas-marsh",
  overrides: Partial<Investigator> = {},
): Investigator {
  return {
    id,
    definitionId,

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

    conditionIds: [],

    actionsPerformed: [],

    personalStoryProgress: 0,

    ...overrides,
  };
}

function makeBoard(): BoardState {
  return {
    spaces: {},

    cluePool: [],
    clueDiscard: [],

    assetDeck: [],
    assetReserve: [],
    assetDiscard: [],

    spellDeck: [],
    spellDiscard: [],

    artifactDeck: [],
    artifactDiscard: [],

    conditionDeck: [],
    conditionDiscard: [],

    encounterDecks:
      {} as BoardState["encounterDecks"],

    encounterDiscards:
      {} as BoardState["encounterDiscards"],

    monsterCup: [],
    monsterDiscard: [],

    gateStack: [],
    gateDiscard: [],

    activeExpeditionSpaceId: null,

    mythosDeck: [],
    mythosDiscard: [],
    mythosInPlay: [],
  };
}

function makeGame(
  overrides: Partial<GameState> = {},
): GameState {
  return {
    scenarioId: "test-scenario",

    round: 1,

    status: "playing",

    phase: "action",

    currentMythosId: null,

    board: makeBoard(),

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

    investigatorTurnIndex: 0,

    pendingInvestigatorReplacements: [],

    lastTest: null,

    pendingSpellChoice: null,

    pendingEncounterChoice: null,

    ancientOne:
      {} as GameState["ancientOne"],

    monsters: {},

    combatOrder: null,

    epicMonstersDefeated: [],

    mysteries: {
      selectedMysteryIds: [],
      activeMysteryId: null,
      solvedMysteryIds: [],
      progress: {},
    },

    finalMystery: null,

    pendingDecision: null,

    ...overrides,
  };
}

describe("endInvestigatorActions", () => {
  it("throws when there is no active investigator", () => {
    const game = makeGame({
      activeInvestigatorId: null,
    });

    expect(() =>
      endInvestigatorActions(game),
    ).toThrow(
      "There is no active investigator.",
    );
  });

  it("throws when the active investigator does not exist", () => {
    const game = makeGame({
      activeInvestigatorId:
        "unknown-investigator",
    });

    expect(() =>
      endInvestigatorActions(game),
    ).toThrow(
      'Investigator "unknown-investigator" does not exist.',
    );
  });

  it("throws when called outside the Action phase", () => {
    const game = makeGame({
      phase: "encounter",
    });

    expect(() =>
      endInvestigatorActions(game),
    ).toThrow(
      "Investigator actions can only be ended during the Action phase.",
    );
  });

  it("throws when Travel is still active", () => {
    const game = makeGame({
      activeInvestigatorId: "i1",

      investigators: {
        i1: makeInvestigator(
          "i1",
          "silas-marsh",
          {
            travelActive: true,
          },
        ),

        i2: makeInvestigator("i2"),
      },

      investigatorOrder: [
        "i1",
        "i2",
      ],

      investigatorTurnIndex: 0,
    });

    expect(() =>
      endInvestigatorActions(game),
    ).toThrow(
      "Cannot end investigator actions while Travel is active.",
    );
  });

  it("moves to the next investigator during the Action phase", () => {
    const game = makeGame({
      activeInvestigatorId: "i1",

      investigatorOrder: [
        "i1",
        "i2",
        "i3",
      ],

      investigatorTurnIndex: 0,
    });

    const result =
      endInvestigatorActions(game);

    expect(
      result.phase,
    ).toBe("action");

    expect(
      result.activeInvestigatorId,
    ).toBe("i2");

    expect(
      result.investigatorTurnIndex,
    ).toBe(1);

    expect(result.pendingDecision).toMatchObject({
      type: "investigator-turn",

      title: "Action Phase",

      investigatorId: "i2",

      investigatorName: "Silas Marsh",

      phase: "action",

      image:
        "/cards/investigators/Silas_Marsh/Silas_Marsh.png",
    });
  });

  it("uses the definitionId when the next investigator has no matching definition", () => {
    const game = makeGame({
      activeInvestigatorId: "i1",

      investigators: {
        i1: makeInvestigator("i1"),

        i2: makeInvestigator(
          "i2",
          "unknown-investigator",
        ),
      },

      investigatorOrder: [
        "i1",
        "i2",
      ],

      investigatorTurnIndex: 0,
    });

    const result =
      endInvestigatorActions(game);

    expect(
      result.activeInvestigatorId,
    ).toBe("i2");

    expect(
      result.investigatorTurnIndex,
    ).toBe(1);

    expect(result.pendingDecision).toMatchObject({
      type: "investigator-turn",

      title: "Action Phase",

      investigatorId: "i2",

      investigatorName:
        "unknown-investigator",

      phase: "action",
    });

    if (
      result.pendingDecision?.type ===
      "investigator-turn"
    ) {
      expect(
        result.pendingDecision.image,
      ).toBeUndefined();
    }
  });

  it("throws when the next investigator in the order does not exist", () => {
    const game = makeGame({
      activeInvestigatorId: "i1",

      investigators: {
        i1: makeInvestigator("i1"),
      },

      investigatorOrder: [
        "i1",
        "missing-investigator",
      ],

      investigatorTurnIndex: 0,
    });

    expect(() =>
      endInvestigatorActions(game),
    ).toThrow(
      'Investigator "missing-investigator" does not exist.',
    );
  });

  it("starts the Encounter phase after the last investigator finishes Actions", () => {
    const game = makeGame({
      activeInvestigatorId: "i3",

      investigatorOrder: [
        "i1",
        "i2",
        "i3",
      ],

      investigatorTurnIndex: 2,
    });

    const result =
      endInvestigatorActions(game);

    expect(
      result.phase,
    ).toBe("encounter");

    expect(
      result.activeInvestigatorId,
    ).toBe("i1");

    expect(
      result.investigatorTurnIndex,
    ).toBe(0);

    expect(result.pendingDecision).toMatchObject({
      type: "investigator-turn",

      title: "Encounter Phase",

      investigatorId: "i1",

      investigatorName: "Silas Marsh",

      phase: "encounter",

      image:
        "/cards/investigators/Silas_Marsh/Silas_Marsh.png",
    });
  });

  it("uses the definitionId when the first investigator has no matching definition", () => {
    const game = makeGame({
      investigators: {
        i1: makeInvestigator(
          "i1",
          "unknown-investigator",
        ),

        i2: makeInvestigator("i2"),
      },

      investigatorOrder: [
        "i1",
        "i2",
      ],

      activeInvestigatorId: "i2",

      investigatorTurnIndex: 1,
    });

    const result =
      endInvestigatorActions(game);

    expect(
      result.phase,
    ).toBe("encounter");

    expect(
      result.activeInvestigatorId,
    ).toBe("i1");

    expect(
      result.investigatorTurnIndex,
    ).toBe(0);

    expect(result.pendingDecision).toMatchObject({
      type: "investigator-turn",

      title: "Encounter Phase",

      investigatorId: "i1",

      investigatorName:
        "unknown-investigator",

      phase: "encounter",
    });

    if (
      result.pendingDecision?.type ===
      "investigator-turn"
    ) {
      expect(
        result.pendingDecision.image,
      ).toBeUndefined();
    }
  });

  it("throws when there are no investigators in the turn order", () => {
    const game = makeGame({
      activeInvestigatorId: "i1",

      investigatorOrder: [],

      investigators: {
        i1: makeInvestigator("i1"),
      },

      investigatorTurnIndex: 0,
    });

    expect(() =>
      endInvestigatorActions(game),
    ).toThrow(
      "There are no investigators in the turn order.",
    );
  });

  it("throws when the first investigator in the order does not exist", () => {
    const game = makeGame({
      activeInvestigatorId: "i2",

      investigatorOrder: [
        "missing-investigator",
        "i2",
      ],

      investigators: {
        i2: makeInvestigator("i2"),
      },

      investigatorTurnIndex: 1,
    });

    expect(() =>
      endInvestigatorActions(game),
    ).toThrow(
      'Investigator "missing-investigator" does not exist.',
    );
  });
});