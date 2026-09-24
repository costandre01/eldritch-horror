import {
  describe,
  expect,
  it,
} from "vitest";

import {
  resolveCombatEncounterEnd,
} from "../engine/resolveCombatEncounterEnd";

import {
  createTestGame,
} from "./helpers/createTestGame";

import type {
  GameState,
} from "../models/GameState";

import type {
  MapDefinition,
} from "../models/MapDefinition";

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
        connectedSpaceIds: [
          "square",
          "downtown",
        ],
        paths: [
          {
            toSpaceId: "square",
            type: "train",
          },
          {
            toSpaceId: "downtown",
            type: "uncharted",
          },
        ],
      },

      {
        id: "square",
        name: "Square",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [
          "arkham",
          "hospital",
          "university",
        ],
        paths: [
          {
            toSpaceId: "arkham",
            type: "train",
          },
          {
            toSpaceId: "hospital",
            type: "uncharted",
          },
          {
            toSpaceId: "university",
            type: "uncharted",
          },
        ],
      },

      {
        id: "downtown",
        name: "Downtown",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [
          "arkham",
          "hospital",
        ],
        paths: [
          {
            toSpaceId: "arkham",
            type: "uncharted",
          },
          {
            toSpaceId: "hospital",
            type: "uncharted",
          },
        ],
      },

      {
        id: "hospital",
        name: "Hospital",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [
          "square",
          "downtown",
          "southside",
        ],
        paths: [
          {
            toSpaceId: "square",
            type: "uncharted",
          },
          {
            toSpaceId: "downtown",
            type: "uncharted",
          },
          {
            toSpaceId: "southside",
            type: "uncharted",
          },
        ],
      },

      {
        id: "university",
        name: "University",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [
          "square",
        ],
        paths: [
          {
            toSpaceId: "square",
            type: "uncharted",
          },
        ],
      },

      {
        id: "southside",
        name: "Southside",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [
          "hospital",
          "rivertown",
        ],
        paths: [
          {
            toSpaceId: "hospital",
            type: "uncharted",
          },
          {
            toSpaceId: "rivertown",
            type: "uncharted",
          },
        ],
      },

      {
        id: "rivertown",
        name: "Rivertown",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [
          "southside",
        ],
        paths: [
          {
            toSpaceId: "southside",
            type: "uncharted",
          },
        ],
      },
    ],
  };
}

function prepareGame(): GameState {
  const game =
    createTestGame();

  game.phase =
    "encounter";

  game.activeInvestigatorId =
    "investigator-1";

  game.investigators[
    "investigator-1"
  ].spaceId =
    "arkham";

  game.investigators[
    "investigator-1"
  ].sanity = 4;

  game.board.spaces = {
    arkham: {
      spaceId: "arkham",
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    },

    square: {
      spaceId: "square",
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    },

    downtown: {
      spaceId: "downtown",
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    },

    hospital: {
      spaceId: "hospital",
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    },

    university: {
      spaceId: "university",
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    },

    southside: {
      spaceId: "southside",
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    },

    rivertown: {
      spaceId: "rivertown",
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    },
  };

  game.board.encounterDecks = {
    america: [],
    europe: [],
    "asia-australia": [],
    general: [],
    research: [],
    "other-world": [],
    special: [],
    expedition: [],
  };

  game.board.encounterDiscards = {
    america: [],
    europe: [],
    "asia-australia": [],
    general: [],
    research: [],
    "other-world": [],
    special: [],
    expedition: [],
  };

  game.board.mythosDeck = [];

  game.board.mythosInPlay = [];

  game.currentMythosId =
    "a-dark-power";

  game.pendingDecision = null;

  game.pendingEncounterChoice = null;

  game.ancientOne = {
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
  };

  return game;
}

function addMonster(
  game: GameState,
  monsterId: string,
  definitionId: string,
  spaceId = "arkham",
  overrides: Partial<
    GameState["monsters"][string]
  > = {},
): void {
  game.monsters[
    monsterId
  ] = {
    id: monsterId,
    definitionId,
    spaceId,
    health: 3,
    maxHealth: 3,
    engagedInvestigatorId:
      null,
    isEpic: false,
    ...overrides,
  } as GameState["monsters"][string];

  if (
    spaceId &&
    game.board.spaces[spaceId]
  ) {
    game.board.spaces[
      spaceId
    ].monsterIds.push(
      monsterId,
    );
  }
}

function addGeneralEncounter(
  game: GameState,
): void {
  game.board.encounterDecks.general = [
    "encounter-1",
  ];

  game.encounters[
    "encounter-1"
  ] = {
    id: "encounter-1",
    name: "Test Encounter",
    region: "america",
    frontImage:
      "/cards/general.jpg",
    backImage:
      "/cards/general-back.jpg",
  } as GameState["encounters"][string];
}

describe(
  "resolveCombatEncounterEnd",
  () => {
    it(
      "throws when there is no active investigator",
      () => {
        const game =
          prepareGame();

        game.activeInvestigatorId =
          null;

        expect(() =>
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          ),
        ).toThrow(
          "There is no active investigator.",
        );
      },
    );

    it(
      "throws when the active investigator does not exist",
      () => {
        const game =
          prepareGame();

        game.activeInvestigatorId =
          "missing-investigator";

        expect(() =>
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          ),
        ).toThrow(
          'Investigator "missing-investigator" does not exist.',
        );
      },
    );

    it(
      "ends the Investigator Encounter when the investigator has no space",
      () => {
        const game =
          prepareGame();

        game.investigators[
          "investigator-1"
        ].spaceId =
          null;

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.pendingDecision,
        ).toBeNull();

        expect(
          result.activeInvestigatorId,
        ).toBeNull();

        expect(
          result.phase,
        ).toBe("mythos");
      },
    );

    it(
      "starts the next unencountered Monster using the stored combat order",
      () => {
        const game =
          prepareGame();

        addMonster(
          game,
          "monster-1",
          "cultist",
          "arkham",
          {
            engagedInvestigatorId:
              "investigator-1",
          },
        );

        addMonster(
          game,
          "monster-2",
          "cultist",
          "arkham",
        );

        game.combatOrder = [
          "monster-2",
        ];

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("combat");

        if (
          result.pendingDecision?.type ===
          "combat"
        ) {
          expect(
            result.pendingDecision.monsterId,
          ).toBe("monster-2");
        }
      },
    );

    it(
      "starts a remaining non-Epic Monster before an Epic Monster",
      () => {
        const game =
          prepareGame();

        addMonster(
          game,
          "monster-1",
          "cultist",
          "arkham",
          {
            engagedInvestigatorId:
              "investigator-1",
          },
        );

        addMonster(
          game,
          "epic-1",
          "azathoth",
          "arkham",
          {
            isEpic: true,
          },
        );

        addMonster(
          game,
          "monster-2",
          "cultist",
          "arkham",
        );

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("combat");

        if (
          result.pendingDecision?.type ===
          "combat"
        ) {
          expect(
            result.pendingDecision.monsterId,
          ).toBe("monster-2");
        }
      },
    );

    it(
      "ends the Encounter when a Monster survives and there are no unencountered Monsters",
      () => {
        const game =
          prepareGame();

        addMonster(
          game,
          "monster-1",
          "cultist",
          "arkham",
          {
            engagedInvestigatorId:
              "investigator-1",
          },
        );

        game.monsters[
          "monster-1"
        ].health = 2;

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.pendingDecision,
        ).toBeNull();

        expect(
          result.activeInvestigatorId,
        ).toBeNull();

        expect(
          result.phase,
        ).toBe("mythos");
      },
    );

    it(
      "ends the Encounter when the defeated Monster no longer exists",
      () => {
        const game =
          prepareGame();

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "missing-monster",
          );

        expect(
          result.pendingDecision,
        ).toBeNull();

        expect(
          result.activeInvestigatorId,
        ).toBeNull();

        expect(
          result.phase,
        ).toBe("mythos");
      },
    );

    it(
      "offers another Encounter after defeating the last normal Monster",
      () => {
        const game =
          prepareGame();

        addMonster(
          game,
          "monster-1",
          "cultist",
          "arkham",
          {
            engagedInvestigatorId:
              "investigator-1",
          },
        );

        addGeneralEncounter(
          game,
        );

        game.monsters[
          "monster-1"
        ].spaceId =
          null;

        game.board.spaces.arkham.monsterIds =
          [];

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");
      },
    );

    it(
      "offers the Byakhee defeat choice instead of immediately starting another Encounter",
      () => {
        const game =
          prepareGame();

        addMonster(
          game,
          "monster-1",
          "byakhee",
          "arkham",
          {
            engagedInvestigatorId:
              "investigator-1",
          },
        );

        game.monsters[
          "monster-1"
        ].spaceId =
          null;

        game.board.spaces.arkham.monsterIds =
          [];

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.source,
          ).toBe(
            "byakhee-defeat:monster-1",
          );

          expect(
            result.pendingDecision.options.map(
              (option) =>
                option.id,
            ),
          ).toEqual([
            "move",
            "encounter",
          ]);
        }
      },
    );

    it(
      "does not offer another Encounter after defeating a Gug",
      () => {
        const game =
          prepareGame();

        addMonster(
          game,
          "monster-1",
          "gug",
          "arkham",
          {
            engagedInvestigatorId:
              "investigator-1",
          },
        );

        game.monsters[
          "monster-1"
        ].spaceId =
          null;

        game.board.spaces.arkham.monsterIds =
          [];

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.activeInvestigatorId,
        ).toBeNull();

        expect(
          result.pendingDecision,
        ).toBeNull();

        expect(
          result.phase,
        ).toBe("mythos");
      },
    );

    it(
      "throws when a Dark Power resume cannot find the current Mythos",
      () => {
        const game =
          prepareGame();

        game.currentMythosId =
          "missing-mythos";

        game.pendingDecision = {
          type: "combat",
          title: "Combat",
          message:
            "Resolve combat.",
          monsterId:
            "monster-1",
          stage: "start",
          resume: {
            type:
              "mythos-dark-power",
            investigatorIds: [
              "investigator-1",
            ],
            currentInvestigatorIndex:
              0,
            monsterIds: [],
            resolvedMonsterIds: [],
          },
        };

        expect(() =>
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          ),
        ).toThrow(
          "A Dark Power could not find the current Mythos card.",
        );
      },
    );

    /*
     * ==========================================================
     * SHUB-NIGGURATH RECKONING
     * ==========================================================
     */

    it(
      "returns to Ancient One Reckoning when Shub-Niggurath combat ends after the Monster is gone",
      () => {
        const game =
          prepareGame();

        game.activeInvestigatorId =
          null;

        game.pendingDecision = {
          type: "combat",
          title: "Combat",
          monsterId:
            "epic-monster-1",
          stage: "resolved",
          resume: {
            type:
              "shub-niggurath-reckoning",
            monsterId:
              "epic-monster-1",
            investigatorIds: [
              "investigator-1",
            ],
            nextInvestigatorIndex:
              0,
            nextIconIndex:
              3,
            ancientOneAbilityIndex:
              1,
            ancientOneId:
              "azathoth",
            ancientOneReckoningStage:
              "front",
          },
        };

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "epic-monster-1",
          );

        expect(
          result.pendingDecision?.type,
        ).toBe(
          "mythos-ancient-one-reckoning",
        );

        if (
          result.pendingDecision?.type ===
          "mythos-ancient-one-reckoning"
        ) {
          expect(
            result.pendingDecision.abilityIndex,
          ).toBe(2);

          expect(
            result.pendingDecision.ancientOneId,
          ).toBe("azathoth");

          expect(
            result.pendingDecision.nextIconIndex,
          ).toBe(3);
        }

        expect(
          result.activeInvestigatorId,
        ).toBeNull();
      },
    );

        it(
      "starts Ancient One Reckoning when Monster Reckoning has resolved all Monsters",
      () => {
        const game =
          prepareGame();

        game.ancientOne.id =
          "cthulhu";

        addMonster(
          game,
          "monster-1",
          "cultist",
          "arkham",
        );

        game.pendingDecision = {
          type: "combat",
          title: "Combat",
          monsterId:
            "monster-1",
          stage: "resolved",
          resume: {
            type:
              "monster-reckoning",
            monsterId:
              "monster-1",
            monsterIds: [
              "monster-1",
            ],
            nextIconIndex:
              4,
            resolvedMonsterIds: [],
            remainingPasses: 1,
          },
        };

        game.monsters[
          "monster-1"
        ].health = 0;

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.pendingDecision?.type,
        ).toBe(
          "mythos-ancient-one-reckoning",
        );

        if (
          result.pendingDecision?.type ===
          "mythos-ancient-one-reckoning"
        ) {
          expect(
            result.pendingDecision.ancientOneId,
          ).toBe(
            "cthulhu",
          );

          expect(
            result.pendingDecision.nextIconIndex,
          ).toBe(4);

          expect(
            result.pendingDecision.abilityIndex,
          ).toBe(0);
        }

        expect(
          result.activeInvestigatorId,
        ).toBeNull();
      },
    );

    it(
      "skips a Dark Power Investigator whose space does not exist on the board",
      () => {
        const game =
          prepareGame();

        game.investigators[
          "investigator-2"
        ] = {
          ...game.investigators[
            "investigator-1"
          ],
          id:
            "investigator-2",
          spaceId:
            "missing-space",
        };

        game.pendingDecision = {
          type: "combat",
          title: "Combat",
          monsterId:
            "monster-1",
          stage: "resolved",
          resume: {
            type:
              "mythos-dark-power",
            investigatorIds: [
              "investigator-1",
              "investigator-2",
            ],
            currentInvestigatorIndex:
              0,
            monsterIds: [
              "monster-1",
            ],
            resolvedMonsterIds: [],
          },
        };

        game.currentMythosId =
          "a-proposition";

        game.board.mythosDiscard =
          [];

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.currentMythosId,
        ).toBeNull();

        expect(
          result.activeInvestigatorId,
        ).toBeNull();

        expect(
          result.pendingDecision,
        ).toBeNull();

        expect(
          result.board.mythosDiscard.length,
        ).toBe(1);
      },
    );

    it(
      "throws when Dark Power finds one Monster but cannot determine its ID",
      () => {
        const game =
          prepareGame();

        game.investigators[
          "investigator-2"
        ] = {
          ...game.investigators[
            "investigator-1"
          ],
          id:
            "investigator-2",
          spaceId:
            "square",
        };

        addMonster(
          game,
          "",
          "cultist",
          "square",
        );

        game.pendingDecision = {
          type: "combat",
          title: "Combat",
          monsterId:
            "monster-1",
          stage: "resolved",
          resume: {
            type:
              "mythos-dark-power",
            investigatorIds: [
              "investigator-1",
              "investigator-2",
            ],
            currentInvestigatorIndex:
              0,
            monsterIds: [
              "monster-1",
            ],
            resolvedMonsterIds: [],
          },
        };

        game.board.mythosDiscard = [];

        expect(() =>
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          ),
        ).toThrow(
          "A Dark Power could not determine the next Monster.",
        );
      },
    );

    it(
      "skips a valid Dark Power Investigator who has no Monsters",
      () => {
        const game =
          prepareGame();

        game.investigators[
          "investigator-2"
        ] = {
          ...game.investigators[
            "investigator-1"
          ],
          id:
            "investigator-2",
          spaceId:
            "square",
        };

        game.board.spaces.square.monsterIds =
          [];

        game.pendingDecision = {
          type: "combat",
          title: "Combat",
          monsterId:
            "monster-1",
          stage: "resolved",
          resume: {
            type:
              "mythos-dark-power",
            investigatorIds: [
              "investigator-1",
              "investigator-2",
            ],
            currentInvestigatorIndex:
              0,
            monsterIds: [
              "monster-1",
            ],
            resolvedMonsterIds: [],
          },
        };

        game.currentMythosId =
          "a-proposition";

        game.board.mythosDiscard =
          [];

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.currentMythosId,
        ).toBeNull();

        expect(
          result.activeInvestigatorId,
        ).toBeNull();

        expect(
          result.pendingDecision,
        ).toBeNull();

        expect(
          result.board.mythosDiscard.length,
        ).toBe(1);
      },
    );

    /*
     * ==========================================================
     * MONSTER RECKONING
     * ==========================================================
     */

    it(
      "continues Monster Reckoning with the next unresolved Monster",
      () => {
        const game =
          prepareGame();

        addMonster(
          game,
          "monster-2",
          "cultist",
          "arkham",
        );

        game.pendingDecision = {
          type: "combat",
          title: "Combat",
          monsterId:
            "monster-1",
          stage: "resolved",
          resume: {
            type:
              "monster-reckoning",
            monsterId:
              "monster-1",
            monsterIds: [
              "monster-1",
              "monster-2",
            ],
            nextIconIndex:
              4,
            resolvedMonsterIds: [],
            remainingPasses: 1,
          },
        };

        /*
         * monster-2 is deliberately made already
         * defeated so resolveMonsterReckoning()
         * records it as resolved without entering
         * another Monster ability.
         */
        game.monsters[
          "monster-2"
        ].health = 0;

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.pendingDecision?.type,
        ).toBe(
          "continue",
        );
      },
    );

    it(
      "starts another Monster Reckoning pass when remaining passes are greater than one",
      () => {
        const game =
          prepareGame();

        game.pendingDecision = {
          type: "combat",
          title: "Combat",
          monsterId:
            "monster-1",
          stage: "resolved",
          resume: {
            type:
              "monster-reckoning",
            monsterId:
              "monster-1",
            monsterIds: [
              "monster-1",
            ],
            nextIconIndex:
              5,
            resolvedMonsterIds: [],
            remainingPasses: 2,
          },
        };

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.pendingDecision?.type,
        ).toBe(
          "continue",
        );

        expect(
          result.activeInvestigatorId,
        ).toBeNull();
      },
    );

    /*
     * ==========================================================
     * DARK POWER
     * ==========================================================
     */

    it(
      "starts the next Monster for the same Investigator during Dark Power",
      () => {
        const game =
          prepareGame();

        addMonster(
          game,
          "monster-2",
          "cultist",
          "arkham",
        );

        game.pendingDecision = {
          type: "combat",
          title: "Combat",
          monsterId:
            "monster-1",
          stage: "resolved",
          resume: {
            type:
              "mythos-dark-power",
            investigatorIds: [
              "investigator-1",
            ],
            currentInvestigatorIndex:
              0,
            monsterIds: [
              "monster-1",
              "monster-2",
            ],
            resolvedMonsterIds: [],
          },
        };

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("combat");

        if (
          result.pendingDecision?.type ===
          "combat"
        ) {
          expect(
            result.pendingDecision.monsterId,
          ).toBe("monster-2");
        }

        expect(
          result.activeInvestigatorId,
        ).toBe(
          "investigator-1",
        );
      },
    );

    it(
      "moves to the next Investigator during Dark Power when they have one Monster",
      () => {
        const game =
          prepareGame();

        game.investigators[
          "investigator-2"
        ] = {
          ...game.investigators[
            "investigator-1"
          ],
          id:
            "investigator-2",
          spaceId:
            "square",
        };

        addMonster(
          game,
          "monster-2",
          "cultist",
          "square",
        );

        game.board.spaces.square.monsterIds =
          [
            "monster-2",
          ];

        game.pendingDecision = {
          type: "combat",
          title: "Combat",
          monsterId:
            "monster-1",
          stage: "resolved",
          resume: {
            type:
              "mythos-dark-power",
            investigatorIds: [
              "investigator-1",
              "investigator-2",
            ],
            currentInvestigatorIndex:
              0,
            monsterIds: [
              "monster-1",
            ],
            resolvedMonsterIds: [],
          },
        };

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.activeInvestigatorId,
        ).toBe(
          "investigator-2",
        );

        expect(
          result.pendingDecision?.type,
        ).toBe("combat");

        if (
          result.pendingDecision?.type ===
          "combat"
        ) {
          expect(
            result.pendingDecision.monsterId,
          ).toBe("monster-2");

          expect(
            result.pendingDecision.resume?.type,
          ).toBe(
            "mythos-dark-power",
          );
        }
      },
    );

    it(
      "asks the next Investigator for Combat Order when they have multiple Monsters during Dark Power",
      () => {
        const game =
          prepareGame();

        game.investigators[
          "investigator-2"
        ] = {
          ...game.investigators[
            "investigator-1"
          ],
          id:
            "investigator-2",
          spaceId:
            "square",
        };

        addMonster(
          game,
          "monster-2",
          "cultist",
          "square",
        );

        addMonster(
          game,
          "monster-3",
          "cultist",
          "square",
        );

        game.board.spaces.square.monsterIds =
          [
            "monster-2",
            "monster-3",
          ];

        game.pendingDecision = {
          type: "combat",
          title: "Combat",
          monsterId:
            "monster-1",
          stage: "resolved",
          resume: {
            type:
              "mythos-dark-power",
            investigatorIds: [
              "investigator-1",
              "investigator-2",
            ],
            currentInvestigatorIndex:
              0,
            monsterIds: [
              "monster-1",
            ],
            resolvedMonsterIds: [],
          },
        };

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.activeInvestigatorId,
        ).toBe(
          "investigator-2",
        );

        expect(
          result.pendingDecision?.type,
        ).toBe(
          "combat-order",
        );

        if (
          result.pendingDecision?.type ===
          "combat-order"
        ) {
          expect(
            result.pendingDecision.monsterIds,
          ).toEqual([
            "monster-2",
            "monster-3",
          ]);

          expect(
            result.pendingDecision.orderedMonsterIds,
          ).toEqual([]);

          expect(
            result.pendingDecision.resume?.type,
          ).toBe(
            "mythos-dark-power",
          );
        }
      },
    );

    it(
      "skips an empty Investigator entry during Dark Power",
      () => {
        const game =
          prepareGame();

        game.investigators[
          "investigator-2"
        ] = {
          ...game.investigators[
            "investigator-1"
          ],
          id:
            "investigator-2",
          spaceId:
            "square",
        };

        addMonster(
          game,
          "monster-2",
          "cultist",
          "square",
        );

        game.board.spaces.square.monsterIds =
          [
            "monster-2",
          ];

        game.pendingDecision = {
          type: "combat",
          title: "Combat",
          monsterId:
            "monster-1",
          stage: "resolved",
          resume: {
            type:
              "mythos-dark-power",
            investigatorIds: [
              "investigator-1",
              "",
              "investigator-2",
            ],
            currentInvestigatorIndex:
              0,
            monsterIds: [
              "monster-1",
            ],
            resolvedMonsterIds: [],
          },
        };

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.activeInvestigatorId,
        ).toBe(
          "investigator-2",
        );
      },
    );

    it(
      "skips an Investigator without a space during Dark Power",
      () => {
        const game =
          prepareGame();

        game.investigators[
          "investigator-2"
        ] = {
          ...game.investigators[
            "investigator-1"
          ],
          id:
            "investigator-2",
          spaceId:
            null,
        };

        game.investigators[
          "investigator-3"
        ] = {
          ...game.investigators[
            "investigator-1"
          ],
          id:
            "investigator-3",
          spaceId:
            "square",
        };

        addMonster(
          game,
          "monster-3",
          "cultist",
          "square",
        );

        game.board.spaces.square.monsterIds =
          [
            "monster-3",
          ];

        game.pendingDecision = {
          type: "combat",
          title: "Combat",
          monsterId:
            "monster-1",
          stage: "resolved",
          resume: {
            type:
              "mythos-dark-power",
            investigatorIds: [
              "investigator-1",
              "investigator-2",
              "investigator-3",
            ],
            currentInvestigatorIndex:
              0,
            monsterIds: [
              "monster-1",
            ],
            resolvedMonsterIds: [],
          },
        };

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.activeInvestigatorId,
        ).toBe(
          "investigator-3",
        );

        expect(
          result.pendingDecision?.type,
        ).toBe("combat");
      },
    );

    it(
      "discards the current Mythos when Dark Power has finished",
      () => {
        const game =
          prepareGame();

        game.currentMythosId =
          "a-proposition";

        game.board.mythosDiscard =
          [];

        game.pendingDecision = {
          type: "combat",
          title: "Combat",
          monsterId:
            "monster-1",
          stage: "resolved",
          resume: {
            type:
              "mythos-dark-power",
            investigatorIds: [
              "investigator-1",
            ],
            currentInvestigatorIndex:
              0,
            monsterIds: [
              "monster-1",
            ],
            resolvedMonsterIds: [],
          },
        };

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.currentMythosId,
        ).toBeNull();

        expect(
          result.activeInvestigatorId,
        ).toBeNull();

        expect(
          result.pendingDecision,
        ).toBeNull();

        expect(
          result.board.mythosDiscard.some(
            (mythos) =>
              mythos.id ===
              "a-proposition",
          ),
        ).toBe(true);
      },
    );

    /*
     * ==========================================================
     * LOST KNOWLEDGE
     * ==========================================================
     */

    it(
      "solves Lost Knowledge when Tick-Tock Men are defeated",
      () => {
        const game =
          prepareGame();

        addMonster(
          game,
          "tick-tock-men-1",
          "tick-tock-men",
          "arkham",
          {
            engagedInvestigatorId:
              "investigator-1",
          },
        );

        game.monsters[
          "tick-tock-men-1"
        ].spaceId =
          null;

        game.board.spaces.arkham.monsterIds =
          [];

        game.board.mythosInPlay = [
          {
            definitionId:
              "lost-knowledge",
            eldritchTokens: 0,
          },
        ];

        addGeneralEncounter(
          game,
        );

        expect(() =>
            resolveCombatEncounterEnd(
                game,
                createTestMap(),
                "tick-tock-men-1",
            ),
        ).toThrow(
            'Mythos "lost-knowledge" is not a Rumor.',
        );
      },
    );

    /*
     * ==========================================================
     * UNRECOGNIZED DEFEATED MONSTER
     * ==========================================================
     */

    it(
      "continues to the additional Encounter when the defeated Monster definition is unknown",
      () => {
        const game =
          prepareGame();

        addMonster(
          game,
          "monster-unknown",
          "unknown-monster",
          "arkham",
          {
            engagedInvestigatorId:
              "investigator-1",
          },
        );

        game.monsters[
          "monster-unknown"
        ].spaceId =
          null;

        game.board.spaces.arkham.monsterIds =
          [];

        addGeneralEncounter(
          game,
        );

        const result =
          resolveCombatEncounterEnd(
            game,
            createTestMap(),
            "monster-unknown",
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");
      },
    );
  },
);