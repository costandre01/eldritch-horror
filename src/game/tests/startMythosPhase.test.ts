import { describe, expect, it } from "vitest";

import type { GameState } from "../models/GameState";
import type { BoardState } from "../models/BoardState";
import type { Investigator } from "../models/Investigator";

import { startMythosPhase } from "../engine/startMythosPhase";

function makeInvestigator(
  id: string,
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
  };
}

function makeBoard(
  overrides: Partial<BoardState> = {},
): BoardState {
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

    encounterDecks: {} as BoardState["encounterDecks"],
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

    ...overrides,
  };
}

function makeGame(
  overrides: Partial<GameState> = {},
): GameState {
  return {
    scenarioId: "test-scenario",

    round: 1,

    status: "playing",

    phase: "mythos",

    currentMythosId: null,

    board: makeBoard(),

    investigators: {
      i1: makeInvestigator("i1"),
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

    investigatorOrder: ["i1"],

    investigatorTurnIndex: 0,

    pendingInvestigatorReplacements: [],

    lastTest: null,

    pendingSpellChoice: null,
    pendingEncounterChoice: null,

    ancientOne: {} as GameState["ancientOne"],

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

describe("startMythosPhase", () => {
  it("throws when called outside the Mythos phase", () => {
    const game = makeGame({
      phase: "action",
    });

    expect(() =>
      startMythosPhase(game),
    ).toThrow(
      "Mythos Phase can only be started when the game is in the Mythos phase.",
    );
  });

  it("ends the game in defeat when the Mythos deck is empty", () => {
    const game = makeGame({
      phase: "mythos",

      status: "playing",

      activeInvestigatorId: "i1",

      pendingDecision: {
        type: "choice",
        title: "Something",
        message: "Something",
        options: [],
        source: "test",
      },

      pendingEncounterChoice: null,

      currentMythosId: "old-mythos",

      combatOrder: ["monster-1"],
    });

    const result = startMythosPhase(game);

    expect(result.status).toBe("defeat");

    expect(result.activeInvestigatorId).toBeNull();

    expect(result.pendingDecision).toBeNull();

    expect(result.pendingEncounterChoice).toBeNull();

    expect(result.currentMythosId).toBeNull();

    expect(result.combatOrder).toBeNull();

    expect(result.phase).toBe("mythos");
  });

  it("creates the Mythos card draw decision when the deck has cards", () => {
    const mythos = {
      id: "a-proposition",

      name: "A Proposition",

      difficulty: "easy",

      type: "event",

      image:
        "/cards/Mythos/Mythos/Easy - A Proposition.jpg",

      flavorText: "",

      icons: [],

      text: "",

      effects: [],
    } as GameState["board"]["mythosDeck"][number];

    const game = makeGame({
      phase: "mythos",

      board: makeBoard({
        mythosDeck: [mythos],
      }),
    });

    const result = startMythosPhase(game);

    expect(result.pendingDecision).toEqual({
      type: "choice",

      title: "Mythos Phase",

      message:
        "Draw the top card of the Mythos deck.",

      image:
        "/cards/Mystery/Mythos-back.jpg",

      options: [
        {
          id: "draw-mythos",
          title: "Draw Mythos Card",
        },
      ],

      source: "mythos-selection",
    });
  });
});