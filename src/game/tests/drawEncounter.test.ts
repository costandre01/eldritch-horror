import { describe, expect, it } from "vitest";

import type { GameState } from "../models/GameState";
import type { EncounterDefinition } from "../models/Encounter";

import { drawEncounter } from "../engine/drawEncounter";

function makeEncounter(
  id: string,
  region: EncounterDefinition["region"] = "america",
): EncounterDefinition {
  return {
    id,
    name: `Encounter ${id}`,
    region,
    text: `Text ${id}`,
    choices: [],
  };
}

function makeGame(): GameState {
  return {
    phase: "encounter",

    scenarioId: "test-scenario",

    round: 1,

    status: "playing",

    currentMythosId: null,

    board: {
      encounterDecks: {
        america: ["encounter-1"],
        europe: [],
        asiaAustralia: [],
        general: [],
        research: [],
        "other-world": [],
        special: [],
        expedition: [],
      },

      encounterDiscards: {
        america: [],
        europe: [],
        asiaAustralia: [],
        general: [],
        research: [],
        "other-world": [],
        special: [],
        expedition: [],
      },
    } as unknown as GameState["board"],

    investigators: {},

    assets: {},

    spells: {},

    artifacts: {},

    conditions: {},

    encounters: {
      "encounter-1": makeEncounter("encounter-1"),
    },

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

    mysteries: {} as GameState["mysteries"],

    finalMystery: null,

    pendingDecision: null,

    encounterCluesGained: 0,
  };
}

describe("drawEncounter", () => {
  it("draws the top Encounter from the deck", () => {
    const game = makeGame();

    game.board.encounterDecks.america = [
      "encounter-1",
      "encounter-2",
    ];

    game.encounters["encounter-2"] =
      makeEncounter("encounter-2");

    const result = drawEncounter(game, "america");

    expect(result.encounter.id).toBe("encounter-1");

    expect(
      result.game.board.encounterDecks.america,
    ).toEqual(["encounter-2"]);
  });

  it("sets the current Encounter state correctly", () => {
    const game = makeGame();

    const result = drawEncounter(game, "america");

    expect(result.game.currentEncounterId).toBe(
      "encounter-1",
    );

    expect(
      result.game.currentEncounterBackId,
    ).toBeNull();

    expect(
      result.game.currentEncounterRevealed,
    ).toBe(false);

    expect(
      result.game.currentEncounterIsResearch,
    ).toBe(false);

    expect(
      result.game.currentEncounterDeckType,
    ).toBe("america");

    expect(
      result.game.encounterCluesGained,
    ).toBe(0);
  });

  it("marks Research Encounters as Research", () => {
    const game = makeGame();

    game.board.encounterDecks.research = [
      "research-1",
    ];

    game.encounters["research-1"] =
      makeEncounter(
        "research-1",
        "research",
      );

    const result = drawEncounter(
      game,
      "research",
    );

    expect(
      result.encounter.id,
    ).toBe("research-1");

    expect(
      result.game.currentEncounterIsResearch,
    ).toBe(true);
  });

  it("clears the current Encounter back when drawing a new Encounter", () => {
    const game = makeGame();

    game.currentEncounterId =
      "old-encounter";

    game.currentEncounterBackId =
      "old-back";

    game.currentEncounterRevealed =
      true;

    game.currentEncounterIsResearch =
      true;

    game.currentEncounterDeckType =
      "europe";

    game.encounterCluesGained =
      5;

    const result = drawEncounter(
      game,
      "america",
    );

    expect(
      result.game.currentEncounterId,
    ).toBe("encounter-1");

    expect(
      result.game.currentEncounterBackId,
    ).toBeNull();

    expect(
      result.game.currentEncounterRevealed,
    ).toBe(false);

    expect(
      result.game.currentEncounterIsResearch,
    ).toBe(false);

    expect(
      result.game.currentEncounterDeckType,
    ).toBe("america");

    expect(
      result.game.encounterCluesGained,
    ).toBe(0);
  });

  it("reshuffles the discard pile when the Encounter deck is empty", () => {
    const game = makeGame();

    game.board.encounterDecks.america =
      [];

    game.board.encounterDiscards.america = [
      "discard-1",
      "discard-2",
    ];

    game.encounters["discard-1"] =
      makeEncounter("discard-1");

    game.encounters["discard-2"] =
      makeEncounter("discard-2");

    const result = drawEncounter(
      game,
      "america",
    );

    expect([
      "discard-1",
      "discard-2",
    ]).toContain(
      result.encounter.id,
    );

    expect(
      result.game.board.encounterDecks
        .america,
    ).toHaveLength(1);

    expect(
      result.game.board.encounterDecks
        .america,
    ).not.toContain(
      result.encounter.id,
    );

    expect(
      result.game.board.encounterDiscards
        .america,
    ).toEqual([]);
  });

  it("preserves all discarded cards except the drawn card after reshuffle", () => {
    const game = makeGame();

    game.board.encounterDecks.america =
      [];

    game.board.encounterDiscards.america = [
      "discard-1",
      "discard-2",
      "discard-3",
    ];

    game.encounters["discard-1"] =
      makeEncounter("discard-1");

    game.encounters["discard-2"] =
      makeEncounter("discard-2");

    game.encounters["discard-3"] =
      makeEncounter("discard-3");

    const result = drawEncounter(
      game,
      "america",
    );

    const drawnId =
      result.encounter.id;

    expect([
      "discard-1",
      "discard-2",
      "discard-3",
    ]).toContain(drawnId);

    const remainingCards =
      result.game.board.encounterDecks
        .america;

    expect(
      remainingCards,
    ).toHaveLength(2);

    expect(
      remainingCards,
    ).not.toContain(drawnId);

    expect(
      remainingCards.every(
        (id) =>
          id === "discard-1" ||
          id === "discard-2" ||
          id === "discard-3",
      ),
    ).toBe(true);

    expect(
      result.game.board.encounterDiscards
        .america,
    ).toEqual([]);
  });

  it("throws when the Encounter deck does not exist", () => {
    const game = makeGame();

    delete (
      game.board.encounterDecks as Partial<
        typeof game.board.encounterDecks
      >
    ).america;

    expect(
      () =>
        drawEncounter(
          game,
          "america",
        ),
    ).toThrow(
      'Encounter deck "america" does not exist.',
    );
  });

  it("throws when the Encounter discard does not exist", () => {
    const game = makeGame();

    delete (
      game.board.encounterDiscards as Partial<
        typeof game.board.encounterDiscards
      >
    ).america;

    expect(
      () =>
        drawEncounter(
          game,
          "america",
        ),
    ).toThrow(
      'Encounter discard "america" does not exist.',
    );
  });

  it("throws when both the deck and discard pile are empty", () => {
    const game = makeGame();

    game.board.encounterDecks.america =
      [];

    game.board.encounterDiscards.america =
      [];

    expect(
      () =>
        drawEncounter(
          game,
          "america",
        ),
    ).toThrow(
      'Encounter deck "america" is empty and has no discarded cards to reshuffle.',
    );
  });

  it("throws when the top card does not contain a valid Encounter id", () => {
    const game = makeGame();

    game.board.encounterDecks.america = [
      "",
    ];

    game.board.encounterDiscards.america =
      [];

    expect(
      () =>
        drawEncounter(
          game,
          "america",
        ),
    ).toThrow(
      'Failed to draw an Encounter from the "america" deck.',
    );
  });

  it("throws when the Encounter id does not exist", () => {
    const game = makeGame();

    game.board.encounterDecks.america = [
      "unknown-encounter",
    ];

    game.board.encounterDiscards.america =
      [];

    expect(
      () =>
        drawEncounter(
          game,
          "america",
        ),
    ).toThrow(
      'Encounter "unknown-encounter" does not exist.',
    );
  });
});