import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  drawClueToken,
  getMythosClueSpawnCount,
  spawnClue,
  spawnClues,
} from "../engine/clueEngine";

import {
  createTestGame,
} from "./helpers/createTestGame";

import type {
  GameState,
} from "../models/GameState";

function prepareGame(): GameState {
  const game =
    createTestGame();

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
  };

  game.board.cluePool = [];

  game.board.clueDiscard = [];

  return game;
}

describe(
  "clueEngine",
  () => {
    it(
      "draws a clue from the existing clue pool",
      () => {
        const game =
          prepareGame();

        game.board.cluePool = [
          {
            id: "clue-1",
            spaceId: "arkham",
          },
          {
            id: "clue-2",
            spaceId: "square",
          },
        ];

        const result =
          drawClueToken(game);

        expect(
          result.clue,
        ).toEqual({
          id: "clue-1",
          spaceId: "arkham",
        });

        expect(
          result.game.board.cluePool,
        ).toEqual([
          {
            id: "clue-2",
            spaceId: "square",
          },
        ]);

        expect(
          result.game.board.clueDiscard,
        ).toEqual([]);
      },
    );

    it(
      "returns no clue when both the pool and discard are empty",
      () => {
        const game =
          prepareGame();

        const result =
          drawClueToken(game);

        expect(
          result.clue,
        ).toBeNull();

        expect(
          result.game,
        ).toBe(game);
      },
    );

    it(
      "refills the clue pool from the discard pile when the pool is empty",
      () => {
        const game =
          prepareGame();

        const clue1 = {
          id: "clue-1",
          spaceId: "arkham",
        };

        const clue2 = {
          id: "clue-2",
          spaceId: "square",
        };

        game.board.clueDiscard = [
          clue1,
          clue2,
        ];

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(0);

        const result =
          drawClueToken(game);

        expect(
          result.clue,
        ).not.toBeNull();

        expect(
          [
            clue1,
            clue2,
          ],
        ).toContainEqual(
          result.clue,
        );

        expect(
          result.game.board.clueDiscard,
        ).toEqual([]);

        expect(
          result.game.board.cluePool,
        ).toHaveLength(1);

        vi.restoreAllMocks();
      },
    );

    it(
      "handles an invalid empty entry at the top of the clue pool",
      () => {
        const game =
          prepareGame();

        game.board.cluePool = [
          undefined as never,
        ];

        const result =
          drawClueToken(game);

        expect(
          result.clue,
        ).toBeNull();

        expect(
          result.game.board.cluePool,
        ).toEqual([
          undefined,
        ]);
      },
    );

    it(
      "spawns a clue on the space referenced by the token",
      () => {
        const game =
          prepareGame();

        game.board.cluePool = [
          {
            id: "clue-1",
            spaceId: "arkham",
          },
        ];

        const result =
          spawnClue(game);

        expect(
          result.board.spaces.arkham.clues,
        ).toBe(1);

        expect(
          result.board.spaces.arkham.clueTokenIds,
        ).toEqual([
          "clue-1",
        ]);

        expect(
          result.board.cluePool,
        ).toEqual([]);
      },
    );

    it(
      "throws when a clue references an unknown space",
      () => {
        const game =
          prepareGame();

        game.board.cluePool = [
          {
            id: "clue-unknown",
            spaceId: "unknown-space",
          },
        ];

        expect(() =>
          spawnClue(game),
        ).toThrow(
          'Clue "clue-unknown" references unknown space "unknown-space".',
        );
      },
    );

    it(
      "returns the game unchanged when spawning a clue with no available clue",
      () => {
        const game =
          prepareGame();

        const result =
          spawnClue(game);

        expect(
          result,
        ).toBe(game);
      },
    );

    it(
      "spawns multiple clues",
      () => {
        const game =
          prepareGame();

        game.board.cluePool = [
          {
            id: "clue-1",
            spaceId: "arkham",
          },
          {
            id: "clue-2",
            spaceId: "arkham",
          },
          {
            id: "clue-3",
            spaceId: "square",
          },
        ];

        const result =
          spawnClues(
            game,
            3,
          );

        expect(
          result.board.spaces.arkham.clues,
        ).toBe(2);

        expect(
          result.board.spaces.square.clues,
        ).toBe(1);

        expect(
          result.board.spaces.arkham.clueTokenIds,
        ).toEqual([
          "clue-1",
          "clue-2",
        ]);

        expect(
          result.board.spaces.square.clueTokenIds,
        ).toEqual([
          "clue-3",
        ]);

        expect(
          result.board.cluePool,
        ).toEqual([]);
      },
    );

    it(
      "does not spawn clues when the requested amount is negative",
      () => {
        const game =
          prepareGame();

        game.board.cluePool = [
          {
            id: "clue-1",
            spaceId: "arkham",
          },
        ];

        const result =
          spawnClues(
            game,
            -3,
          );

        expect(
          result,
        ).toBe(game);

        expect(
          result.board.spaces.arkham.clues,
        ).toBe(0);

        expect(
          result.board.cluePool,
        ).toHaveLength(1);
      },
    );

    it(
      "does not spawn clues when the requested amount is zero",
      () => {
        const game =
          prepareGame();

        game.board.cluePool = [
          {
            id: "clue-1",
            spaceId: "arkham",
          },
        ];

        const result =
          spawnClues(
            game,
            0,
          );

        expect(
          result,
        ).toBe(game);
      },
    );

    it(
      "uses the correct Mythos clue count for each investigator range",
      () => {
        const game =
          prepareGame();

        game.investigatorOrder = [
          "1",
        ];

        expect(
          getMythosClueSpawnCount(
            game,
          ),
        ).toBe(1);

        game.investigatorOrder = [
          "1",
          "2",
          "3",
        ];

        expect(
          getMythosClueSpawnCount(
            game,
          ),
        ).toBe(2);

        game.investigatorOrder = [
          "1",
          "2",
          "3",
          "4",
          "5",
        ];

        expect(
          getMythosClueSpawnCount(
            game,
          ),
        ).toBe(3);

        game.investigatorOrder = [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
        ];

        expect(
          getMythosClueSpawnCount(
            game,
          ),
        ).toBe(4);
      },
    );

    it(
      "uses the maximum Mythos clue count for eight investigators",
      () => {
        const game =
          prepareGame();

        game.investigatorOrder = [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
        ];

        expect(
          getMythosClueSpawnCount(
            game,
          ),
        ).toBe(4);
      },
    );
  },
);