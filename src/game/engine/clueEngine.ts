import type { GameState } from "../models/GameState";
import type { ClueToken } from "../models/ClueToken";

/*
 * ============================================================
 * SHUFFLE
 * ============================================================
 */

function shuffle<T>(
  items: T[],
): T[] {
  const result = [...items];

  for (
    let i = result.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() * (i + 1),
      );

    [
      result[i],
      result[j],
    ] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

/*
 * ============================================================
 * REFILL CLUE POOL
 * ============================================================
 */

function refillCluePool(
  game: GameState,
): GameState {
  if (
    game.board.cluePool.length > 0 ||
    game.board.clueDiscard.length === 0
  ) {
    return game;
  }

  return {
    ...game,

    board: {
      ...game.board,

      cluePool: shuffle(
        game.board.clueDiscard,
      ),

      clueDiscard: [],
    },
  };
}

/*
 * ============================================================
 * DRAW CLUE TOKEN
 * ============================================================
 */

export function drawClueToken(
  game: GameState,
): {
  game: GameState;
  clue: ClueToken | null;
} {
  let currentGame =
    refillCluePool(game);

  if (
    currentGame.board.cluePool.length === 0
  ) {
    return {
      game: currentGame,
      clue: null,
    };
  }

  const [
    clue,
    ...remainingPool
  ] =
    currentGame.board.cluePool;

  if (!clue) {
    return {
      game: currentGame,
      clue: null,
    };
  }

  currentGame = {
    ...currentGame,

    board: {
      ...currentGame.board,

      cluePool:
        remainingPool,
    },
  };

  return {
    game: currentGame,
    clue,
  };
}

/*
 * ============================================================
 * SPAWN ONE CLUE
 * ============================================================
 *
 * Retira um token aleatório da pool.
 *
 * A localização vem do próprio ClueToken.
 */

export function spawnClue(
  game: GameState,
): GameState {
  const {
    game: gameAfterDraw,
    clue,
  } =
    drawClueToken(game);

  if (!clue) {
    return gameAfterDraw;
  }

  const space =
    gameAfterDraw.board.spaces[
      clue.spaceId
    ];

  if (!space) {
    throw new Error(
      `Clue "${clue.id}" references unknown space "${clue.spaceId}".`,
    );
  }

  return {
    ...gameAfterDraw,

    board: {
      ...gameAfterDraw.board,

      spaces: {
        ...gameAfterDraw.board.spaces,

        [clue.spaceId]: {
          ...space,

          clues:
            space.clues + 1,

          clueTokenIds: [
            ...space.clueTokenIds,
            clue.id,
          ],
        },
      },
    },
  };
}

/*
 * ============================================================
 * SPAWN MULTIPLE CLUES
 * ============================================================
 */

export function spawnClues(
  game: GameState,
  amount: number,
): GameState {
  const clueAmount =
    Math.max(0, amount);

  let currentGame = game;

  for (
    let i = 0;
    i < clueAmount;
    i++
  ) {
    currentGame =
      spawnClue(
        currentGame,
      );
  }

  return currentGame;
}

/*
 * ============================================================
 * GET MYTHOS CLUE COUNT
 * ============================================================
 *
 * Reference Card:
 *
 * 1-2 Investigators -> 1 Clue
 * 3-4 Investigators -> 2 Clues
 * 5-6 Investigators -> 3 Clues
 * 7-8 Investigators -> 4 Clues
 */

export function getMythosClueSpawnCount(
  game: GameState,
): number {
  const investigatorCount =
    game.investigatorOrder.length;

  if (
    investigatorCount <= 2
  ) {
    return 1;
  }

  if (
    investigatorCount <= 4
  ) {
    return 2;
  }

  if (
    investigatorCount <= 6
  ) {
    return 3;
  }

  return 4;
}