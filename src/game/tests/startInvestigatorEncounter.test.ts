import { describe, expect, it } from "vitest";

import { startInvestigatorEncounter } from "../engine/startInvestigatorEncounter";

import type { GameState } from "../models/GameState";
import type { Investigator } from "../models/Investigator";
import type { Monster } from "../models/Monster";
import type { MapDefinition } from "../models/MapDefinition";

function createTestInvestigator(
  id = "investigator-1",
): Investigator {
  return {
    id,
    definitionId: "akachi-onyele",
    health: 5,
    maxHealth: 5,
    sanity: 5,
    maxSanity: 5,
    skills: {
      lore: 0,
      influence: 0,
      observation: 0,
      strength: 0,
      will: 0,
    },
    resources: 0,
    clues: 0,
    spaceId: "arkham",
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
  };
}

function createTestMonster(
  id: string,
  definitionId = "cultist",
  isEpic = false,
): Monster {
  return {
    id,
    definitionId,
    health: 1,
    spaceId: "arkham",
    engagedInvestigatorId: null,
    isEpic,
  };
}

function createTestMap(): MapDefinition {
  return {
    id: "test-map",
    name: "Test Map",
    startingSpaceId: "arkham",
    spaces: [
      {
        id: "arkham",
        name: "Arkham",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [],
        paths: [],
      },
    ],
  };
}

function createTestGame(
  monsters: Record<string, Monster> = {},
): GameState {
  return {
    scenarioId: "test",
    round: 1,
    status: "playing",
    phase: "encounter",

    currentMythosId: null,

    board: {} as GameState["board"],

    investigators: {
      "investigator-1":
        createTestInvestigator(),
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

    leadInvestigatorId:
      "investigator-1",

    activeInvestigatorId:
      "investigator-1",

    investigatorOrder: [
      "investigator-1",
    ],

    investigatorTurnIndex: 0,

    pendingInvestigatorReplacements: [],

    lastTest: null,

    pendingSpellChoice: null,
    pendingEncounterChoice: null,

    ancientOne: {
        id: "azathoth",
        name: "Azathoth",
        doom: 15,
        omenPosition: 0,
        eldritchTokens: 0,
        eldritchTokenPositions: [],
        eldritchTokenSpaceIds: [],
        awakened: false,
        sanityTokens: 0,
        gateCount: 0,
    },

    monsters,

    combatOrder: null,

    epicMonstersDefeated: [],

    mysteries:
      {} as GameState["mysteries"],

    finalMystery: null,

    pendingDecision: null,
  };
}

describe("startInvestigatorEncounter", () => {
  it("throws when there is no active investigator", () => {
    const game = createTestGame();

    game.activeInvestigatorId = null;

    expect(() =>
      startInvestigatorEncounter(
        game,
        createTestMap(),
      ),
    ).toThrow(
      "There is no active investigator.",
    );
  });

  it("throws when the active investigator does not exist", () => {
    const game = createTestGame();

    game.activeInvestigatorId =
      "missing-investigator";

    expect(() =>
      startInvestigatorEncounter(
        game,
        createTestMap(),
      ),
    ).toThrow(
      'Investigator "missing-investigator" does not exist.',
    );
  });

  it("throws when the game is not in the Encounter phase", () => {
    const game = createTestGame();

    game.phase = "action";

    expect(() =>
      startInvestigatorEncounter(
        game,
        createTestMap(),
      ),
    ).toThrow(
      "Investigator encounters can only start during the Encounter phase.",
    );
  });

  it("throws when the investigator has no current space", () => {
    const game = createTestGame();

    game.investigators[
      "investigator-1"
    ].spaceId = null;

    expect(() =>
      startInvestigatorEncounter(
        game,
        createTestMap(),
      ),
    ).toThrow(
      "Investigator has no current space.",
    );
  });

  it("starts combat immediately when exactly one Monster is present", () => {
    const monster =
      createTestMonster(
        "cultist-1",
      );

    const game = createTestGame({
      "cultist-1": monster,
    });

    const result =
      startInvestigatorEncounter(
        game,
        createTestMap(),
      );

    expect(
      result.pendingDecision,
    ).not.toBeNull();

    expect(
      result.monsters[
        "cultist-1"
      ].health,
    ).toBeGreaterThan(0);

    expect(
      result.monsters[
        "cultist-1"
      ].engagedInvestigatorId,
    ).toBe("investigator-1");
  });

  it("asks for Combat Order when multiple Monsters are present", () => {
    const game = createTestGame({
      "cultist-1":
        createTestMonster(
          "cultist-1",
          "cultist",
          false,
        ),

      "cultist-2":
        createTestMonster(
          "cultist-2",
          "cultist",
          false,
        ),
    });

    const result =
      startInvestigatorEncounter(
        game,
        createTestMap(),
      );

    expect(
      result.pendingDecision?.type,
    ).toBe("combat-order");

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type: "combat-order",
      monsterIds: [
        "cultist-1",
        "cultist-2",
      ],
      orderedMonsterIds: [],
      source: "combat-order",
    });
  });

  it("includes all Monsters from the investigator's space in Combat Order", () => {
    const game = createTestGame({
      "cultist-1":
        createTestMonster(
          "cultist-1",
        ),

      "cultist-2":
        createTestMonster(
          "cultist-2",
        ),

      "cultist-3":
        createTestMonster(
          "cultist-3",
        ),
    });

    const result =
      startInvestigatorEncounter(
        game,
        createTestMap(),
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type: "combat-order",
      monsterIds: [
        "cultist-1",
        "cultist-2",
        "cultist-3",
      ],
    });
  });

  it("ignores Monsters that are in another space", () => {
    const game = createTestGame({
      "cultist-1":
        createTestMonster(
          "cultist-1",
        ),

      "cultist-2":
        createTestMonster(
          "cultist-2",
        ),
    });

    game.monsters[
      "cultist-2"
    ].spaceId = "shanghai";

    const result =
      startInvestigatorEncounter(
        game,
        createTestMap(),
      );

    expect(
      result.monsters[
        "cultist-1"
      ].engagedInvestigatorId,
    ).toBe("investigator-1");

    expect(
      result.monsters[
        "cultist-2"
      ].engagedInvestigatorId,
    ).toBeNull();
  });
});