import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { GameState } from "../models/GameState";

import { endInvestigatorEncounter } from "../engine/endInvestigatorEncounter";

function makeInvestigator(
  overrides: Record<string, unknown> = {},
) {
  return {
    id: "i1",
    definitionId: "akachi-onyele",

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

    resources: 5,
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

function makeGame(
  overrides: Partial<GameState> = {},
): GameState {
  return {
    scenarioId: "test",

    round: 1,

    status: "playing",

    phase: "encounter",

    currentMythosId: null,

    board: {
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

      encounterDecks: {
        america: [],
        europe: [],
        "asia-australia": [],
        general: [],
        research: [],
        "other-world": [],
        special: [],
        expedition: [],
      },

      encounterDiscards: {
        america: [],
        europe: [],
        "asia-australia": [],
        general: [],
        research: [],
        "other-world": [],
        special: [],
        expedition: [],
      },

      monsterCup: [],
      monsterDiscard: [],

      gateStack: [],
      gateDiscard: [],

      activeExpeditionSpaceId: null,

      mythosDeck: [],
      mythosDiscard: [],
      mythosInPlay: [],
    },

    investigators: {
      i1: makeInvestigator({
        id: "i1",
      }),

      i2: makeInvestigator({
        id: "i2",
        definitionId: "charlie-kane",
      }),

      i3: makeInvestigator({
        id: "i3",
        definitionId: "jim-culver",
      }),
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

    encounterCluesGained: 0,

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

    ancientOne: {} as any,

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
  } as GameState;
}

/**
 * endInvestigatorEncounter() exige inicialmente a fase
 * "encounter", mas o startInvestigatorActions() chamado
 * no caminho do próximo investigador exige "action".
 *
 * Esta fixture permite testar especificamente o caminho
 * interno que chama startInvestigatorActions(), fazendo
 * a primeira leitura devolver "encounter" e as seguintes
 * devolverem "action".
 */
function makeGameForNextInvestigator(
  overrides: Partial<GameState> = {},
): GameState {
  const game =
    makeGame(overrides);

  let phaseReads = 0;

  Object.defineProperty(
    game,
    "phase",
    {
      configurable: true,
      enumerable: true,

      get() {
        phaseReads++;

        if (phaseReads === 1) {
          return "encounter";
        }

        return "action";
      },
    },
  );

  return game;
}

describe(
  "endInvestigatorEncounter",
  () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it(
      "throws when there is no active investigator",
      () => {
        const game =
          makeGame({
            activeInvestigatorId: null,
          });

        expect(() =>
          endInvestigatorEncounter(game),
        ).toThrow(
          "There is no active investigator.",
        );
      },
    );

    it(
      "throws when the game is not in the Encounter phase",
      () => {
        const game =
          makeGame({
            phase: "action",
          });

        expect(() =>
          endInvestigatorEncounter(game),
        ).toThrow(
          "Investigator Encounters can only be ended during the Encounter phase.",
        );
      },
    );

    it(
      "throws when the current Encounter has not been fully resolved",
      () => {
        const game =
          makeGame({
            currentEncounterId:
              "encounter-1",
          });

        expect(() =>
          endInvestigatorEncounter(game),
        ).toThrow(
          "The current Encounter has not been fully resolved.",
        );
      },
    );

    it(
      "throws when a pending decision remains",
      () => {
        const game =
          makeGame({
            pendingDecision: {
              type: "choice",
              title: "Test",
              message: "Choose an option.",
              options: [],
            },
          });

        expect(() =>
          endInvestigatorEncounter(game),
        ).toThrow(
          "There is still a pending decision to resolve.",
        );
      },
    );

    it(
      "throws when a pending Encounter choice remains",
      () => {
        const game =
          makeGame({
            pendingEncounterChoice: {
              investigatorId: "i1",
              choices: [],
              afterChoice: [],
            } as any,
          });

        expect(() =>
          endInvestigatorEncounter(game),
        ).toThrow(
          "There is still a pending Encounter choice to resolve.",
        );
      },
    );

    it(
      "creates an Occult Research decision for one gained Clue",
      () => {
        const game =
          makeGame({
            currentEncounterId:
              null,

            currentEncounterBackId:
              "research-back",

            currentEncounterIsResearch:
              true,

            encounterCluesGained:
              1,

            mysteries: {
              selectedMysteryIds: [],

              activeMysteryId:
                "mystery-1",

              solvedMysteryIds: [],

              progress: {},
            },
          });

        const result =
          endInvestigatorEncounter(game);

        expect(
          result.currentEncounterId,
        ).toBeNull();

        expect(
          result.currentEncounterBackId,
        ).toBeNull();

        expect(
          result.currentEncounterRevealed,
        ).toBe(false);

        expect(
          result.currentEncounterDeckType,
        ).toBeNull();

        expect(
          result.pendingDecision,
        ).toEqual({
          type: "choice",

          title:
            "Occult Research",

          message:
            "You gained 1 Clue during this Research Encounter. " +
            "You may spend 1 of those Clues to place it on the active Mystery.",

          options: [
            {
              id:
                "occult-research:spend",

              title:
                "Spend 1 Clue",

              description:
                "Spend 1 Clue gained during this Research Encounter and place it on the active Mystery.",
            },

            {
              id:
                "occult-research:decline",

              title:
                "Do Not Spend",

              description:
                "Keep the Clue and finish the Encounter.",
            },
          ],

          source:
            "mystery:occult-research",
        });
      },
    );

    it(
      "uses the plural Clues text when more than one Clue was gained",
      () => {
        const game =
          makeGame({
            currentEncounterId:
              null,

            currentEncounterIsResearch:
              true,

            encounterCluesGained:
              2,

            mysteries: {
              selectedMysteryIds: [],

              activeMysteryId:
                "mystery-1",

              solvedMysteryIds: [],

              progress: {},
            },
          });

        const result =
          endInvestigatorEncounter(game);

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "choice",

          title:
            "Occult Research",

          message:
            "You gained 2 Clues during this Research Encounter. " +
            "You may spend 1 of those Clues to place it on the active Mystery.",
        });
      },
    );

    it(
      "throws if the investigator does not exist during Occult Research",
      () => {
        const game =
          makeGame({
            investigators: {},

            currentEncounterId:
              null,

            currentEncounterIsResearch:
              true,

            encounterCluesGained:
              1,

            mysteries: {
              selectedMysteryIds: [],

              activeMysteryId:
                "mystery-1",

              solvedMysteryIds: [],

              progress: {},
            },
          });

        expect(() =>
          endInvestigatorEncounter(game),
        ).toThrow(
          'Investigator "i1" does not exist.',
        );
      },
    );

    it(
      "moves to the next investigator and starts their actions",
      () => {
        const game =
          makeGameForNextInvestigator({
            investigatorTurnIndex:
              0,

            activeInvestigatorId:
              "i1",

            currentEncounterId:
              null,

            currentEncounterBackId:
              "old-back",

            currentEncounterRevealed:
              true,

            currentEncounterFromFracturedReality:
              true,
          });

        const result =
          endInvestigatorEncounter(game);

        expect(
          result.activeInvestigatorId,
        ).toBe("i2");

        expect(
          result.investigatorTurnIndex,
        ).toBe(1);

        expect(
          result.currentEncounterId,
        ).toBeNull();

        expect(
          result.currentEncounterBackId,
        ).toBeNull();

        expect(
          result.currentEncounterRevealed,
        ).toBe(false);

        expect(
          result.currentEncounterFromFracturedReality,
        ).toBe(false);

        expect(
            result.pendingDecision,
        ).toMatchObject({
            type: "investigator-turn",
            investigatorId: "i2",
            investigatorName: "Charlie Kane",
            phase: "encounter",
        });

        expect(
          result.investigators.i2.actionsPerformed,
        ).toEqual([]);
      },
    );

    it(
      "skips an empty investigator entry",
      () => {
        const game =
          makeGameForNextInvestigator({
            investigatorOrder: [
              "i1",
              "",
              "i2",
            ],

            investigatorTurnIndex:
              0,
          });

        const result =
          endInvestigatorEncounter(game);

        expect(
          result.activeInvestigatorId,
        ).toBe("i2");

        expect(
          result.investigatorTurnIndex,
        ).toBe(2);

        expect(
          result.investigators.i2.actionsPerformed,
        ).toEqual([]);
      },
    );

    it(
      "skips an investigator that does not exist",
      () => {
        const game =
          makeGameForNextInvestigator({
            investigatorOrder: [
              "i1",
              "missing",
              "i2",
            ],

            investigatorTurnIndex:
              0,
          });

        const result =
          endInvestigatorEncounter(game);

        expect(
          result.activeInvestigatorId,
        ).toBe("i2");

        expect(
          result.investigatorTurnIndex,
        ).toBe(2);

        expect(
          result.investigators.i2.actionsPerformed,
        ).toEqual([]);
      },
    );

    it(
      "skips a defeated investigator",
      () => {
        const game =
          makeGameForNextInvestigator({
            investigators: {
              i1: makeInvestigator({
                id: "i1",
              }),

              i2: makeInvestigator({
                id: "i2",

                isDefeated:
                  true,
              }),

              i3: makeInvestigator({
                id: "i3",
              }),
            },

            investigatorOrder: [
              "i1",
              "i2",
              "i3",
            ],

            investigatorTurnIndex:
              0,
          });

        const result =
          endInvestigatorEncounter(game);

        expect(
          result.activeInvestigatorId,
        ).toBe("i3");

        expect(
          result.investigatorTurnIndex,
        ).toBe(2);

        expect(
          result.investigators.i3.actionsPerformed,
        ).toEqual([]);
      },
    );

    it(
      "starts the Mythos phase when all investigators have finished",
      () => {
        const game =
          makeGame({
            investigatorOrder: [
              "i1",
            ],

            investigatorTurnIndex:
              0,

            phase:
              "encounter",

            activeInvestigatorId:
              "i1",

            currentEncounterId:
              null,

            currentEncounterBackId:
              null,

            currentEncounterRevealed:
              false,

            currentEncounterFromFracturedReality:
              true,
          });

        const result =
          endInvestigatorEncounter(game);

        expect(
          result.phase,
        ).toBe("mythos");

        expect(
          result.activeInvestigatorId,
        ).toBeNull();

        expect(
          result.investigatorTurnIndex,
        ).toBe(0);

        expect(
          result.currentEncounterId,
        ).toBeNull();

        expect(
          result.currentEncounterBackId,
        ).toBeNull();

        expect(
          result.currentEncounterRevealed,
        ).toBe(false);

        expect(
          result.currentEncounterFromFracturedReality,
        ).toBe(false);

        /*
         * Não há Mythos cards no fixture, portanto
         * startMythosPhase coloca o jogo em derrota.
         */
        expect(
          result.status,
        ).toBe("defeat");
      },
    );

    it(
      "throws when the next investigator cannot be determined",
      () => {
        let reads = 0;

        const investigatorOrder =
          [
            "i1",
            "i2",
          ];

        Object.defineProperty(
          investigatorOrder,
          "1",
          {
            configurable: true,

            get() {
              reads++;

              if (reads === 1) {
                return "i2";
              }

              return undefined;
            },
          },
        );

        const game =
          makeGame({
            investigatorOrder,
            investigatorTurnIndex:
              0,
          });

        expect(() =>
          endInvestigatorEncounter(game),
        ).toThrow(
          "Could not determine the next Investigator.",
        );
      },
    );

    it(
      "covers the defensive no-active-investigator check inside Occult Research",
      () => {
        let reads = 0;

        const game =
          makeGame({
            currentEncounterId:
              null,

            currentEncounterIsResearch:
              true,

            encounterCluesGained:
              1,

            mysteries: {
              selectedMysteryIds: [],

              activeMysteryId:
                "mystery-1",

              solvedMysteryIds: [],

              progress: {},
            },
          });

        Object.defineProperty(
          game,
          "activeInvestigatorId",
          {
            configurable: true,

            get() {
              reads++;

              if (reads === 1) {
                return "i1";
              }

              return null;
            },
          },
        );

        expect(() =>
          endInvestigatorEncounter(game),
        ).toThrow(
          "There is no active investigator.",
        );
      },
    );
  },
);