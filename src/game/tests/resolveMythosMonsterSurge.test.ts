import {
  describe,
  expect,
  it,
} from "vitest";

import {
  resolveMythosMonsterSurge,
} from "../engine/resolveMythosMonsterSurge";

import {
  createMonster,
} from "../engine/createMonster";

import {
  CORE_MONSTERS,
} from "../../content/core/coreMonsters";

import type {
  GameState,
} from "../models/GameState";

import type {
  MapDefinition,
} from "../models/MapDefinition";

import {
  createTestGame,
} from "./helpers/createTestGame";

function createTestMap(): MapDefinition {
  return {
    id: "test-map",

    name: "Test Map",

    startingSpaceId:
      "arkham",

    spaces: [
      {
        id: "arkham",

        name: "Arkham",

        type: "city",

        isExpedition: false,

        connectedSpaceIds: [
          "square",
        ],

        paths: [],
      },

      {
        id: "square",

        name: "Square",

        type: "city",

        isExpedition: false,

        connectedSpaceIds: [
          "arkham",
        ],

        paths: [],
      },

      {
        id: "university",

        name: "University",

        type: "city",

        isExpedition: false,

        connectedSpaceIds: [],

        paths: [],
      },
    ],
  };
}

function prepareGame(
  investigatorCount = 3,
): GameState {
  const game =
    createTestGame();

  game.phase =
    "mythos";

  game.currentMythosId =
    "that-which-consumes";

  game.investigatorOrder =
    [
      "investigator-1",
      "investigator-2",
      "investigator-3",
    ].slice(
      0,
      investigatorCount,
    );

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
  };

  game.board.gateStack = [];

  game.board.gateDiscard = [];

  game.board.monsterCup = [];

  game.board.monsterDiscard = [];

  game.pendingDecision = null;

  return game;
}

function addMonsterToCup(
  game: GameState,
  instanceNumber: number,
): void {
  const definition =
    CORE_MONSTERS.find(
      (monster) =>
        monster.id === "cultist",
    );

  if (!definition) {
    throw new Error(
      "Cultist definition not found.",
    );
  }

  game.board.monsterCup.push(
    createMonster(
      definition,
      instanceNumber,
    ),
  );
}

function addGate(
  game: GameState,
  gateId: string,
  spaceId: string,
  omen:
    | "green"
    | "blue"
    | "red",
): void {
  game.board.spaces[
    spaceId
  ].gates.push({
    id: gateId,

    spaceId,

    omen,
  });
}

describe(
  "resolveMythosMonsterSurge",
  () => {
    it(
      "spawns 1 Monster at each matching Gate with 1-2 investigators",
      () => {
        const game =
          prepareGame(2);

        addGate(
          game,
          "gate-1",
          "arkham",
          "green",
        );

        addGate(
          game,
          "gate-2",
          "square",
          "green",
        );

        addMonsterToCup(
          game,
          1,
        );

        addMonsterToCup(
          game,
          2,
        );

        const result =
          resolveMythosMonsterSurge(
            game,
            createTestMap(),
            3,
          );

        expect(
          result.board.spaces[
            "arkham"
          ].monsterIds,
        ).toHaveLength(1);

        expect(
          result.board.spaces[
            "square"
          ].monsterIds,
        ).toHaveLength(1);

        expect(
          result.board.monsterCup,
        ).toHaveLength(0);

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "continue",

          source:
            "mythos-card:3",
        });
      },
    );

    it(
      "spawns 2 Monsters at each matching Gate with 3-6 investigators",
      () => {
        const game =
          prepareGame(3);

        addGate(
          game,
          "gate-1",
          "arkham",
          "green",
        );

        addMonsterToCup(
          game,
          1,
        );

        addMonsterToCup(
          game,
          2,
        );

        const result =
          resolveMythosMonsterSurge(
            game,
            createTestMap(),
            4,
          );

        expect(
          result.board.spaces[
            "arkham"
          ].monsterIds,
        ).toHaveLength(2);

        expect(
          result.board.monsterCup,
        ).toHaveLength(0);

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "continue",

          source:
            "mythos-card:4",
        });
      },
    );

    it(
      "spawns 3 Monsters at each matching Gate with 7-8 investigators",
      () => {
        const game =
          prepareGame();

        game.investigatorOrder = [
          "investigator-1",
          "investigator-2",
          "investigator-3",
          "investigator-4",
          "investigator-5",
          "investigator-6",
          "investigator-7",
        ];

        addGate(
          game,
          "gate-1",
          "arkham",
          "green",
        );

        addMonsterToCup(
          game,
          1,
        );

        addMonsterToCup(
          game,
          2,
        );

        addMonsterToCup(
          game,
          3,
        );

        const result =
          resolveMythosMonsterSurge(
            game,
            createTestMap(),
            5,
          );

        expect(
          result.board.spaces[
            "arkham"
          ].monsterIds,
        ).toHaveLength(3);

        expect(
          result.board.monsterCup,
        ).toHaveLength(0);

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "continue",

          source:
            "mythos-card:5",
        });
      },
    );

    it(
      "only surges Gates matching the current Omen",
      () => {
        const game =
          prepareGame(3);

        addGate(
          game,
          "green-gate",
          "arkham",
          "green",
        );

        addGate(
          game,
          "red-gate",
          "square",
          "red",
        );

        addMonsterToCup(
          game,
          1,
        );

        addMonsterToCup(
          game,
          2,
        );

        const result =
          resolveMythosMonsterSurge(
            game,
            createTestMap(),
            2,
          );

        expect(
          result.board.spaces[
            "arkham"
          ].monsterIds,
        ).toHaveLength(2);

        expect(
          result.board.spaces[
            "square"
          ].monsterIds,
        ).toHaveLength(0);

        expect(
          result.board.spaces[
            "square"
          ].gates,
        ).toHaveLength(1);

        expect(
          result.board.spaces[
            "square"
          ].gates[0]?.omen,
        ).toBe("red");
      },
    );

    it(
      "surges every matching Gate on the board",
      () => {
        const game =
          prepareGame(3);

        addGate(
          game,
          "gate-1",
          "arkham",
          "green",
        );

        addGate(
          game,
          "gate-2",
          "square",
          "green",
        );

        addGate(
          game,
          "gate-3",
          "university",
          "green",
        );

        for (
          let i = 1;
          i <= 5;
          i++
        ) {
          addMonsterToCup(
            game,
            i,
          );
        }

        const result =
          resolveMythosMonsterSurge(
            game,
            createTestMap(),
            6,
          );

        expect(
          result.board.spaces[
            "arkham"
          ].monsterIds,
        ).toHaveLength(2);

        expect(
          result.board.spaces[
            "square"
          ].monsterIds,
        ).toHaveLength(2);

        expect(
          result.board.spaces[
            "university"
          ].monsterIds,
        ).toHaveLength(1);

        expect(
          result.board.monsterCup,
        ).toHaveLength(0);
      },
    );

    it(
      "stops spawning when the Monster Cup becomes empty",
      () => {
        const game =
          prepareGame(3);

        addGate(
          game,
          "gate-1",
          "arkham",
          "green",
        );

        addMonsterToCup(
          game,
          1,
        );

        const result =
          resolveMythosMonsterSurge(
            game,
            createTestMap(),
            7,
          );

        expect(
          result.board.spaces[
            "arkham"
          ].monsterIds,
        ).toHaveLength(1);

        expect(
          result.board.monsterCup,
        ).toHaveLength(0);

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "continue",

          source:
            "mythos-card:7",
        });
      },
    );

    it(
      "does not spawn more Monsters after the Ancient One is already awakened",
      () => {
        const game =
          prepareGame(3);

        game.ancientOne.awakened =
          true;

        addGate(
          game,
          "gate-1",
          "arkham",
          "green",
        );

        addMonsterToCup(
          game,
          1,
        );

        addMonsterToCup(
          game,
          2,
        );

        const result =
          resolveMythosMonsterSurge(
            game,
            createTestMap(),
            8,
          );

        expect(
          result.board.spaces[
            "arkham"
          ].monsterIds,
        ).toHaveLength(0);

        expect(
          result.board.monsterCup,
        ).toHaveLength(2);
      },
    );

    it(
      "spawns a new Gate when no Gate matches the current Omen",
      () => {
        const game =
          prepareGame(3);

        addGate(
          game,
          "red-gate",
          "arkham",
          "red",
        );

        game.board.gateStack = [
          {
            id: "new-gate",

            spaceId:
              "square",

            omen: "blue",
          },
        ];

        addMonsterToCup(
          game,
          1,
        );

        const result =
          resolveMythosMonsterSurge(
            game,
            createTestMap(),
            9,
          );

        expect(
          result.board.spaces[
            "arkham"
          ].gates,
        ).toHaveLength(1);

        expect(
          result.board.spaces[
            "square"
          ].gates,
        ).toHaveLength(1);

        expect(
          result.board.spaces[
            "square"
          ].gates[0]?.id,
        ).toBe("new-gate");

        expect(
          result.board.spaces[
            "square"
          ].monsterIds,
        ).toHaveLength(1);

        expect(
          result.board.gateStack,
        ).toHaveLength(0);

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "continue",

          source:
            "mythos-card:9",
        });
      },
    );

    it(
      "leaves Doom unchanged when no matching Gate exists and no Gate is available",
      () => {
        const game =
          prepareGame(3);

        game.board.gateStack = [];

        game.board.gateDiscard = [];

        addMonsterToCup(
          game,
          1,
        );

        const result =
          resolveMythosMonsterSurge(
            game,
            createTestMap(),
            10,
          );

        expect(
          result.ancientOne.doom,
        ).toBe(14);

        expect(
          result.board.monsterCup,
        ).toHaveLength(1);

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "continue",

          source:
            "mythos-card:10",
        });
      },
    );

    it(
      "recycles the Gate discard when the Gate stack is empty",
      () => {
        const game =
          prepareGame(3);

        game.board.gateStack = [];

        game.board.gateDiscard = [
          {
            id: "discarded-gate",

            spaceId:
              "square",

            omen: "blue",
          },
        ];

        addMonsterToCup(
          game,
          1,
        );

        const result =
          resolveMythosMonsterSurge(
            game,
            createTestMap(),
            11,
          );

        expect(
          result.board.spaces[
            "square"
          ].gates,
        ).toHaveLength(1);

        expect(
          result.board.spaces[
            "square"
          ].gates[0]?.id,
        ).toBe(
          "discarded-gate",
        );

        expect(
          result.board.spaces[
            "square"
          ].monsterIds,
        ).toHaveLength(1);

        expect(
          result.board.gateDiscard,
        ).toHaveLength(0);

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "continue",

          source:
            "mythos-card:11",
        });
      },
    );
  },
);