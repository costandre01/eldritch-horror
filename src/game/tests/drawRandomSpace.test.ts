import {
  describe,
  expect,
  it,
} from "vitest";

import { drawRandomSpace } from "../engine/clueEngine";
import type { GameState } from "../models/GameState";

function createGame(
  cluePool: {
    id: string;
    spaceId: string;
  }[],
  clueDiscard: {
    id: string;
    spaceId: string;
  }[] = [],
): GameState {
  return {
    board: {
      cluePool,
      clueDiscard,
    },
  } as GameState;
}

describe("drawRandomSpace", () => {
  it("uses a Clue from the Clue Pool to determine the random space", () => {
    const clue = {
      id: "clue-tokyo",
      spaceId: "tokyo",
    };

    const game = createGame([
      clue,
    ]);

    const result =
      drawRandomSpace(game);

    expect(result.spaceId).toBe(
      "tokyo",
    );

    expect(
      result.game.board.cluePool,
    ).toHaveLength(0);

    expect(
      result.game.board.clueDiscard,
    ).toContainEqual(clue);
  });

  it("discards the Clue used to determine the random space", () => {
    const clue = {
      id: "clue-london",
      spaceId: "london",
    };

    const game = createGame([
      clue,
    ]);

    const result =
      drawRandomSpace(game);

    expect(
      result.game.board.clueDiscard,
    ).toContainEqual(clue);

    expect(
      result.game.board.cluePool,
    ).not.toContainEqual(clue);
  });

  it("recycles the Clue discard when the Clue Pool is empty", () => {
    const clue = {
      id: "clue-rome",
      spaceId: "rome",
    };

    const game = createGame(
      [],
      [clue],
    );

    const result =
      drawRandomSpace(game);

    expect(result.spaceId).toBe(
      "rome",
    );

    expect(
      result.game.board.cluePool,
    ).toHaveLength(0);

    expect(
      result.game.board.clueDiscard,
    ).toContainEqual(clue);
  });

  it("returns null when there are no Clues in either the Pool or discard", () => {
    const game = createGame(
      [],
      [],
    );

    const result =
      drawRandomSpace(game);

    expect(result.spaceId).toBeNull();

    expect(
      result.game.board.cluePool,
    ).toHaveLength(0);

    expect(
      result.game.board.clueDiscard,
    ).toHaveLength(0);
  });
});