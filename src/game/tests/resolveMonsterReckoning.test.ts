import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  resolveMonsterReckoning,
} from "../engine/resolveMonsterReckoning";

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
    ],
  };
}

function prepareGame(): GameState {
  const game = createTestGame();

  game.board.spaces = {};

  for (const spaceId of [
    "arkham",
    "square",
    "downtown",
    "hospital",
    "university",
  ]) {
    game.board.spaces[spaceId] = {
      spaceId,
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    };
  }

  game.board.clueDiscard = [];
  game.pendingInvestigatorReplacements = [];

  game.ancientOne = {
    id: "cthulhu",
    name: "Cthulhu",
    doom: 10,
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
  game.monsters[monsterId] = {
    id: monsterId,
    definitionId,
    spaceId,
    health: 3,
    maxHealth: 3,
    engagedInvestigatorId: null,
    isEpic: false,
    ...overrides,
  } as GameState["monsters"][string];

  if (spaceId && game.board.spaces[spaceId]) {
    game.board.spaces[spaceId].monsterIds.push(
      monsterId,
    );
  }
}

function startMonsterReckoning(
  game: GameState,
  monsterIds: string[],
  nextIconIndex = 0,
  remainingPasses = 1,
): void {
  game.pendingDecision = {
    type: "mythos-reckoning-monsters",
    title: "MYTHOS — RECKONING",
    message:
      "Resolve the Reckoning effects of the Monsters.",
    monsterIds,
    resolvedMonsterIds: [],
    nextIconIndex,
    remainingPasses,
    source: "mythos:reckoning-monsters",
  };
}

describe(
  "resolveMonsterReckoning",
  () => {
    it(
      "throws when there is no pending Monster Reckoning",
      () => {
        const game = prepareGame();

        expect(() =>
          resolveMonsterReckoning(
            game,
            createTestMap(),
            "monster-1",
          ),
        ).toThrow(
          "There is no pending Monster Reckoning.",
        );
      },
    );

    it(
      "returns the same game when the Monster was already resolved",
      () => {
        const game = prepareGame();

        addMonster(
          game,
          "monster-1",
          "cultist",
        );

        startMonsterReckoning(
          game,
          ["monster-1"],
        );

        if (
            game.pendingDecision?.type ===
            "mythos-reckoning-monsters"
        ) {
            game.pendingDecision.resolvedMonsterIds = [
                "monster-1",
            ];
        }

        const result =
          resolveMonsterReckoning(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(result).toBe(game);
      },
    );

    it(
      "resolves a missing Monster and starts Ancient One Reckoning when it was the last Monster",
      () => {
        const game = prepareGame();

        startMonsterReckoning(
          game,
          ["monster-1"],
          4,
          1,
        );

        const result =
          resolveMonsterReckoning(
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
          ).toBe("cthulhu");

          expect(
            result.pendingDecision.nextIconIndex,
          ).toBe(4);
        }
      },
    );

    it(
        "starts another Monster Reckoning pass when remaining passes are greater than one",
        () => {
            const game = prepareGame();

            addMonster(
                game,
                "monster-1",
                "deep-one",
            );

            startMonsterReckoning(
                game,
                ["monster-1"],
                3,
                2,
            );

            const result =
                resolveMonsterReckoning(
                    game,
                    createTestMap(),
                    "monster-1",
                );

            expect(
                result.pendingDecision?.type,
            ).toBe(
                "mythos-reckoning-monsters",
            );

            if (
                result.pendingDecision?.type ===
                "mythos-reckoning-monsters"
            ) {
                
            expect(
                result.pendingDecision.monsterIds,
            ).toEqual([
                "monster-1",
            ]);

            expect(
                result.pendingDecision.remainingPasses,
            ).toBe(1);

            expect(
                result.pendingDecision.nextIconIndex,
            ).toBe(3);
            }
        },
    );

    it(
      "Deep One makes investigators on its space lose Sanity",
      () => {
        const game = prepareGame();

        addMonster(
          game,
          "monster-1",
          "deep-one",
          "arkham",
        );

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.spaceId =
          "arkham";
        investigator.sanity = 3;
        investigator.health = 5;
        investigator.isDefeated = false;

        startMonsterReckoning(
          game,
          ["monster-1"],
        );

        const result =
          resolveMonsterReckoning(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.investigators[
            "investigator-1"
          ].sanity,
        ).toBe(2);

        expect(
          result.investigators[
            "investigator-1"
          ].isDefeated,
        ).toBe(false);
      },
    );

    it(
      "queues an investigator replacement when Deep One defeats an investigator",
      () => {
        const game = prepareGame();

        addMonster(
          game,
          "monster-1",
          "deep-one",
          "arkham",
        );

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.spaceId =
          "arkham";
        investigator.sanity = 1;
        investigator.health = 5;
        investigator.isDefeated = false;

        startMonsterReckoning(
          game,
          ["monster-1"],
        );

        const result =
          resolveMonsterReckoning(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.investigators[
            "investigator-1"
          ].sanity,
        ).toBe(0);

        expect(
          result.investigators[
            "investigator-1"
          ].isDefeated,
        ).toBe(true);

        expect(
          result.pendingInvestigatorReplacements,
        ).toContain(
          "investigator-1",
        );
      },
    );

    it(
      "Gnoph-Keh makes investigators on its space lose Health",
      () => {
        const game = prepareGame();

        addMonster(
          game,
          "monster-1",
          "gnoph-keh",
          "arkham",
        );

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.spaceId =
          "arkham";
        investigator.health = 3;
        investigator.sanity = 5;
        investigator.isDefeated = false;

        startMonsterReckoning(
          game,
          ["monster-1"],
        );

        const result =
          resolveMonsterReckoning(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.investigators[
            "investigator-1"
          ].health,
        ).toBe(2);
      },
    );

    it(
      "Lloigor affects investigators on its space and adjacent spaces",
      () => {
        const game = prepareGame();

        addMonster(
          game,
          "monster-1",
          "lloigor",
          "arkham",
        );

        const onSpace =
          game.investigators[
            "investigator-1"
          ];

        onSpace.spaceId = "arkham";
        onSpace.health = 3;
        onSpace.sanity = 3;
        onSpace.isDefeated = false;

        game.investigators[
          "investigator-2"
        ] = {
          ...onSpace,
          id: "investigator-2",
          spaceId: "square",
          health: 4,
          sanity: 4,
          isDefeated: false,
        };

        startMonsterReckoning(
          game,
          ["monster-1"],
        );

        const result =
          resolveMonsterReckoning(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.investigators[
            "investigator-1"
          ].health,
        ).toBe(2);

        expect(
          result.investigators[
            "investigator-1"
          ].sanity,
        ).toBe(2);

        expect(
          result.investigators[
            "investigator-2"
          ].health,
        ).toBe(3);

        expect(
          result.investigators[
            "investigator-2"
          ].sanity,
        ).toBe(3);
      },
    );

    it(
      "Shoggoth recovers all of its Health",
      () => {
        const game = prepareGame();

        addMonster(
          game,
          "monster-1",
          "shoggoth",
          "arkham",
          {
            health: 1,
          },
        );

        startMonsterReckoning(
          game,
          ["monster-1"],
        );

        const result =
          resolveMonsterReckoning(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.monsters[
            "monster-1"
          ].health,
        ).toBe(4);
      },
    );

    it(
      "Witch makes Cursed investigators lose Health",
      () => {
        const game = prepareGame();

        addMonster(
          game,
          "monster-1",
          "witch",
          "arkham",
        );

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.conditionIds = [
          "condition-cursed",
        ];
        investigator.health = 3;
        investigator.sanity = 5;
        investigator.isDefeated = false;

        startMonsterReckoning(
          game,
          ["monster-1"],
        );

        const result =
          resolveMonsterReckoning(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.investigators[
            "investigator-1"
          ].health,
        ).toBe(2);
      },
    );

    it(
      "Mi-Go discards the nearest Clue and moves to that space",
      () => {
        const game = prepareGame();

        addMonster(
          game,
          "monster-1",
          "mi-go",
          "arkham",
        );

        game.board.spaces.square.clues = 1;
        game.board.spaces.square.clueTokenIds = [
          "clue-square",
        ];

        startMonsterReckoning(
          game,
          ["monster-1"],
        );

        const result =
          resolveMonsterReckoning(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.monsters[
            "monster-1"
          ].spaceId,
        ).toBe("square");

        expect(
          result.board.spaces.square.clues,
        ).toBe(0);

        expect(
          result.board.clueDiscard,
        ).toContainEqual({
          id: "clue-square",
          spaceId: "square",
        });
      },
    );

    it(
      "Nightgaunt moves an investigator on its space and delays them",
      () => {
        const game = prepareGame();

        addMonster(
          game,
          "monster-1",
          "nightgaunt",
          "arkham",
        );

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.spaceId =
          "arkham";
        investigator.isDefeated = false;
        investigator.isDelayed = false;

        startMonsterReckoning(
          game,
          ["monster-1"],
        );

        const result =
          resolveMonsterReckoning(
            game,
            createTestMap(),
            "monster-1",
          );

        expect(
          result.investigators[
            "investigator-1"
          ].spaceId,
        ).toBe("square");

        expect(
          result.investigators[
            "investigator-1"
          ].isDelayed,
        ).toBe(true);

        expect(
          result.monsters[
            "monster-1"
          ].spaceId,
        ).toBe("square");
      },
    );

    it(
      "Serpent People move the nearest investigator when the die roll is 1 or 2",
      () => {
        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(0);

        try {
          const game = prepareGame();

          addMonster(
            game,
            "monster-1",
            "serpent-people",
            "arkham",
          );

          const investigator =
            game.investigators[
              "investigator-1"
            ];

          investigator.spaceId =
            "hospital";
          investigator.isDefeated = false;

          startMonsterReckoning(
            game,
            ["monster-1"],
          );

          const result =
            resolveMonsterReckoning(
              game,
              createTestMap(),
              "monster-1",
            );

          expect(
            result.investigators[
              "investigator-1"
            ].spaceId,
          ).toBe("square");
        } finally {
          vi.restoreAllMocks();
        }
      },
    );
  },
);