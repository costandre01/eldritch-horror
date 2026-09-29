import {
  describe,
  expect,
  it,
} from "vitest";

import {
  resolveCombatTest,
} from "../engine/combat/resolveCombatTest";

import {
  createTestGame,
} from "./helpers/createTestGame";

import type {
  GameState,
} from "../models/GameState";

import type {
  PendingDecision,
} from "../models/PendingDecision";

import type {
  TestResult,
} from "../models/TestResult";
import { activatePossessionAbility } from "../engine/activatePossessionAbility";

function prepareGame(): GameState {
  const game =
    createTestGame();

  game.phase = "encounter";

  game.activeInvestigatorId =
    "investigator-1";

  game.investigators[
    "investigator-1"
  ].spaceId = "arkham";

  game.board = {
    ...game.board,

    spaces: {
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
    },

    monsterCup: [],
    monsterDiscard: [],

    assetDiscard: [],

    conditionDeck: [],
    };

  return game;
}

function addMonster(
  game: GameState,
  monsterId: string,
  definitionId: string,
  health: number,
  isEpic: boolean,
): void {
  game.monsters[
    monsterId
  ] = {
    id: monsterId,

    definitionId,

    health,

    maxHealth: health,

    spaceId: "arkham",

    engagedInvestigatorId:
      "investigator-1",

    isEpic,
  } as GameState["monsters"][string];

  game.board.spaces[
    "arkham"
  ].monsterIds.push(
    monsterId,
  );
}

function createStrengthDecision(
  monsterId: string,
): Extract<
  PendingDecision,
  { type: "test" }
> {
  return {
    type: "test",

    title:
      "Combat Test",

    message:
      "Resolve the Strength Test.",

    investigatorId:
      "investigator-1",

    skill:
      "strength",

    modifier: 0,

    difficulty: 1,

    source:
      `combat:strength:${monsterId}`,
  } as Extract<
    PendingDecision,
    { type: "test" }
  >;
}

function createHorrorDecision(
  monsterId: string,
): Extract<
  PendingDecision,
  { type: "test" }
> {
  return {
    type: "test",

    title:
      "Horror Test",

    message:
      "Resolve the Horror Test.",

    investigatorId:
      "investigator-1",

    skill:
      "will",

    modifier: 0,

    difficulty: 1,

    source:
      `combat:horror:${monsterId}`,
  } as Extract<
    PendingDecision,
    { type: "test" }
  >;
}

function createTestResult(
  skill:
    | "strength"
    | "will",
  successes: number,
): TestResult {
  return {
    skill,

    modifier: 0,

    difficulty: 1,

    diceRolled:
      successes,

    results:
      Array.from(
        {
          length:
            successes,
        },
        () => 6,
      ),

    successes,

    passed:
      successes >= 1,
  };
}

describe(
  "Monster return to cup",
  () => {
    it(
      "returns a defeated normal Monster to the Monster Cup",
      () => {
        const game =
          prepareGame();

        addMonster(
          game,
          "ghoul-1",
          "ghoul",
          1,
          false,
        );

        const result =
          resolveCombatTest(
            game,

            createStrengthDecision(
              "ghoul-1",
            ),

            createTestResult(
              "strength",
              1,
            ),
          );

        expect(
          result.board.spaces[
            "arkham"
          ].monsterIds,
        ).not.toContain(
          "ghoul-1",
        );

        expect(
          result.monsters[
            "ghoul-1"
          ].spaceId,
        ).toBeNull();

        expect(
          result.monsters[
            "ghoul-1"
          ].engagedInvestigatorId,
        ).toBeNull();

        expect(
          result.board.monsterCup.some(
            (monster) =>
              monster.id ===
              "ghoul-1",
          ),
        ).toBe(true);
      },
    );

    it(
      "does not return a defeated Epic Monster to the Monster Cup",
      () => {
        const game =
          prepareGame();

        addMonster(
          game,
          "cthylla-1",
          "cthylla",
          1,
          true,
        );

        const result =
          resolveCombatTest(
            game,

            createStrengthDecision(
              "cthylla-1",
            ),

            createTestResult(
              "strength",
              1,
            ),
          );

        expect(
          result.board.spaces[
            "arkham"
          ].monsterIds,
        ).not.toContain(
          "cthylla-1",
        );

        expect(
          result.monsters[
            "cthylla-1"
          ].spaceId,
        ).toBeNull();

        expect(
          result.board.monsterCup.some(
            (monster) =>
              monster.id ===
              "cthylla-1",
          ),
        ).toBe(false);

        expect(
          result.epicMonstersDefeated,
        ).toContain(
          "cthylla",
        );
      },
    );

    it(
      "returns a Ghost defeated during the Horror Test to the Monster Cup",
      () => {
        const game =
          prepareGame();

        addMonster(
          game,
          "ghost-1",
          "ghost",
          1,
          false,
        );

        const result =
          resolveCombatTest(
            game,

            createHorrorDecision(
              "ghost-1",
            ),

            createTestResult(
              "will",
              1,
            ),
          );

        expect(
          result.board.spaces[
            "arkham"
          ].monsterIds,
        ).not.toContain(
          "ghost-1",
        );

        expect(
          result.monsters[
            "ghost-1"
          ].spaceId,
        ).toBeNull();

        expect(
          result.board.monsterCup.some(
            (monster) =>
              monster.id ===
              "ghost-1",
          ),
        ).toBe(true);
      },
    );

    it(
      "returns a normal Monster defeated by Dynamite to the Monster Cup",
      () => {
        const game =
          prepareGame();

        game.phase = "action";

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.actionsPerformed = [];
        investigator.componentActionsUsedThisRound = [];

        addMonster(
          game,
          "ghoul-dynamite",
          "ghoul",
          3,
          false,
        );

        game.assets[
          "dynamite-test"
        ] = {
          id: "dynamite-test",
          name: "Dynamite",
          type: "item",
          traits: [],
          value: 0,
          description: "",
        };

        investigator.assetIds.push(
          "dynamite-test",
        );

        const result =
          activatePossessionAbility(
            game,
            "investigator-1",
            "asset",
            "dynamite-test",
            "action",
            {
              id: "test-map",
              name: "Test Map",
              startingSpaceId:
                "arkham",
              spaces: [],
            },
          );

        expect(
          result.board.spaces[
            "arkham"
          ].monsterIds,
        ).not.toContain(
          "ghoul-dynamite",
        );

        expect(
          result.monsters[
            "ghoul-dynamite"
          ].spaceId,
        ).toBeNull();

        expect(
          result.board.monsterCup.some(
            (monster) =>
              monster.id ===
              "ghoul-dynamite",
          ),
        ).toBe(true);
      },
    );

    it(
      "does not return an Epic Monster defeated by Dynamite to the Monster Cup",
      () => {
        const game =
          prepareGame();

        game.phase = "action";

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.actionsPerformed = [];
        investigator.componentActionsUsedThisRound = [];

        addMonster(
          game,
          "cthylla-dynamite",
          "cthylla",
          3,
          true,
        );

        game.assets[
          "dynamite-test"
        ] = {
          id: "dynamite-test",
          name: "Dynamite",
          type: "item",
          traits: [],
          value: 0,
          description: "",
        };

        investigator.assetIds.push(
          "dynamite-test",
        );

        const result =
          activatePossessionAbility(
            game,
            "investigator-1",
            "asset",
            "dynamite-test",
            "action",
            {
              id: "test-map",
              name: "Test Map",
              startingSpaceId:
                "arkham",
              spaces: [],
            },
          );

        expect(
          result.board.spaces[
            "arkham"
          ].monsterIds,
        ).not.toContain(
          "cthylla-dynamite",
        );

        expect(
          result.board.monsterCup.some(
            (monster) =>
              monster.id ===
              "cthylla-dynamite",
          ),
        ).toBe(false);
      },
    );
  },
);