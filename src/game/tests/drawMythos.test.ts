import { describe, expect, it } from "vitest";

import type { GameState } from "../models/GameState";
import type { BoardState } from "../models/BoardState";
import type { MythosDefinition } from "../models/Mythos";

import { drawMythos } from "../engine/drawMythos";

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

    investigators: {},

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

    leadInvestigatorId: null,
    activeInvestigatorId: null,

    investigatorOrder: [],

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

function makeMythos(
  overrides: Partial<MythosDefinition> = {},
): MythosDefinition {
  return {
    id: "mythos-1",

    name: "Test Mythos",

    difficulty: "normal",

    type: "event",

    image: "/test/mythos-1.jpg",

    flavorText: "",

    icons: [],

    text: "",

    effects: [],

    ...overrides,
  };
}

describe("drawMythos", () => {
  it("throws when called outside the Mythos phase", () => {
    const game = makeGame({
      phase: "action",
    });

    expect(() =>
      drawMythos(game),
    ).toThrow(
      "A Mythos card can only be drawn during the Mythos phase.",
    );
  });

  it("ends the game in defeat when the Mythos deck is empty", () => {
    const game = makeGame({
      phase: "mythos",

      status: "playing",

      activeInvestigatorId: "i1",

      pendingDecision: {
        type: "choice",
        title: "Test",
        message: "Test",
        options: [],
        source: "test",
      },

      currentMythosId: "old-mythos",

      combatOrder: ["monster-1"],
    });

    const result = drawMythos(game);

    expect(result.status).toBe("defeat");

    expect(result.activeInvestigatorId).toBeNull();

    expect(result.pendingDecision).toBeNull();

    expect(result.pendingEncounterChoice).toBeNull();

    expect(result.currentMythosId).toBeNull();

    expect(result.combatOrder).toBeNull();

    expect(result.board.mythosDeck).toEqual([]);
  });

  it("draws the top Mythos card and sets it as the current Mythos", () => {
    const firstMythos = makeMythos({
      id: "mythos-1",
      name: "First Mythos",
    });

    const secondMythos = makeMythos({
      id: "mythos-2",
      name: "Second Mythos",
    });

    const game = makeGame({
      phase: "mythos",

      currentMythosId: null,

      board: makeBoard({
        mythosDeck: [
          firstMythos,
          secondMythos,
        ],
      }),
    });

    const result = drawMythos(game);

    expect(result.status).toBe("playing");

    expect(result.currentMythosId).toBe(
      "mythos-1",
    );

    expect(result.board.mythosDeck).toEqual([
      secondMythos,
    ]);

    expect(result.board.mythosDiscard).toEqual(
      [],
    );

    expect(result.board.mythosInPlay).toEqual(
      [],
    );
  });

  it("does not mutate the original Mythos deck", () => {
    const firstMythos = makeMythos({
      id: "mythos-1",
    });

    const secondMythos = makeMythos({
      id: "mythos-2",
    });

    const game = makeGame({
      board: makeBoard({
        mythosDeck: [
          firstMythos,
          secondMythos,
        ],
      }),
    });

    const originalDeck =
      game.board.mythosDeck;

    const result = drawMythos(game);

    expect(game.board.mythosDeck).toBe(
      originalDeck,
    );

    expect(game.board.mythosDeck).toEqual([
      firstMythos,
      secondMythos,
    ]);

    expect(result.board.mythosDeck).not.toBe(
      originalDeck,
    );
  });
});