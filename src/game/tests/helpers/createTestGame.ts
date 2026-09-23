import type { GameState } from "../../models/GameState";
import type { Investigator } from "../../models/Investigator";

export function createTestInvestigator(
  id: string,
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
    spaceId: null,
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
    actionsPerformed: [
      "travel",
    ],
    personalStoryProgress: 0,
  };
}

export function createTestGame(): GameState {
  return {
    scenarioId: "test",
    round: 1,
    status: "playing",
    phase: "mythos",

    currentMythosId: "mythos-test",

    board:
      {} as GameState["board"],

    investigators: {
      "investigator-1":
        createTestInvestigator(
          "investigator-1",
        ),

      "investigator-2":
        createTestInvestigator(
          "investigator-2",
        ),

      "investigator-3":
        createTestInvestigator(
          "investigator-3",
        ),
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
      "investigator-2",
      "investigator-3",
    ],

    investigatorTurnIndex: 2,

    pendingInvestigatorReplacements: [],

    lastTest: null,

    pendingSpellChoice: null,
    pendingEncounterChoice: null,

    ancientOne:
      {} as GameState["ancientOne"],

    monsters: {},

    combatOrder: null,

    epicMonstersDefeated: [],

    mysteries:
      {} as GameState["mysteries"],

    finalMystery: null,

    pendingDecision: {
      type: "test",
    } as GameState["pendingDecision"],
  };
}