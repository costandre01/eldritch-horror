import {
  getMythosClueSpawnCount,
  spawnClues,
} from "./clueEngine";

import type { GameState } from "../models/GameState";

export function addMythosEldritchTokens(
  game: GameState,
  mythosId: string,
  amount: number,
): GameState {
  const tokenAmount =
    Math.max(0, amount);

  if (tokenAmount === 0) {
    return game;
  }

  const mythosIndex =
    game.board.mythosInPlay.findIndex(
      (mythos) =>
        mythos.definitionId ===
        mythosId,
    );

  if (mythosIndex === -1) {
    throw new Error(
      `Mythos "${mythosId}" is not in play.`,
    );
  }

  const mythosInPlay = [
    ...game.board.mythosInPlay,
  ];

  const current =
    mythosInPlay[mythosIndex];

  if (!current) {
    throw new Error(
      `Mythos "${mythosId}" could not be found.`,
    );
  }

  mythosInPlay[mythosIndex] = {
    ...current,

    eldritchTokens:
      current.eldritchTokens +
      tokenAmount,
  };

  return {
    ...game,

    board: {
      ...game.board,

      mythosInPlay,
    },
  };
}

export function prepareAdvanceOmen(
  game: GameState,
  nextIconIndex: number,
): GameState {
  const currentPosition =
    ((game.ancientOne.omenPosition % 4) + 4) % 4;

  const targetPosition =
    (currentPosition + 1) % 4;

  return {
    ...game,

    pendingDecision: {
      type: "mythos-omen",

      title: "Advance Omen",

      message:
        "The Omen advances clockwise.",

      currentPosition,

      targetPosition,

      steps: 1,

      nextIconIndex,

      source: "mythos:advance-omen",
    },
  };
}

export function spawnMythosClues(
  game: GameState,
): GameState {
  const amount =
    getMythosClueSpawnCount(game);

  return spawnClues(
    game,
    amount,
  );
}

export function spawnMythosRumor(
  game: GameState,
  spaceId: string,
): GameState {
  const space =
    game.board.spaces[spaceId];

  if (!space) {
    throw new Error(
      `Space "${spaceId}" does not exist.`,
    );
  }

  return {
    ...game,

    board: {
      ...game.board,

      spaces: {
        ...game.board.spaces,

        [spaceId]: {
          ...space,

          rumor: true,
        },
      },
    },
  };
}