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

export function spendInvestigatorClues(
  game: GameState,
  investigatorId: string,
  requestedAmount: number,
): GameState {
  const investigator = game.investigators[investigatorId];
  if (!investigator) {
    throw new Error(`Investigator "${investigatorId}" does not exist.`);
  }

  const amount = Math.min(
    investigator.clues,
    Math.max(0, requestedAmount),
  );
  if (amount === 0) return game;

  const trackedTokens = investigator.clueTokens ?? [];
  const eligibleIds = new Set(game.encounterClueTokenIdsGained ?? []);
  const discardOrder = [
    ...trackedTokens.filter((token) => !eligibleIds.has(token.id)),
    ...trackedTokens.filter((token) => eligibleIds.has(token.id)),
  ];
  const trackedAmount = Math.max(
    0,
    amount - Math.max(0, investigator.clues - trackedTokens.length),
  );
  const discardedTokens = discardOrder.slice(0, trackedAmount);
  const discardedIds = new Set(discardedTokens.map((token) => token.id));
  const remainingTokens = trackedTokens.filter((token) => !discardedIds.has(token.id));
  const remainingClues = investigator.clues - amount;

  return {
    ...game,
    investigators: {
      ...game.investigators,
      [investigatorId]: {
        ...investigator,
        clues: remainingClues,
        clueTokens: remainingTokens,
      },
    },
    board: {
      ...game.board,
      clueDiscard: [...(game.board.clueDiscard ?? []), ...discardedTokens],
    },
    encounterCluesGained: game.currentEncounterIsResearch
      ? Math.min(game.encounterCluesGained ?? 0, remainingClues)
      : game.encounterCluesGained,
    encounterClueTokenIdsGained: (game.encounterClueTokenIdsGained ?? [])
      .filter((id) => remainingTokens.some((token) => token.id === id)),
  };
}

export function gainInvestigatorClues(
  game: GameState,
  investigatorId: string,
  requestedAmount: number,
): GameState {
  const investigator = game.investigators[investigatorId];
  if (!investigator) {
    throw new Error(`Investigator "${investigatorId}" does not exist.`);
  }

  let currentGame = game;
  const gainedTokens: ClueToken[] = [];
  const amount = Math.max(0, requestedAmount);
  while (gainedTokens.length < amount) {
    const drawn = drawClueToken(currentGame);
    currentGame = drawn.game;
    if (!drawn.clue) break;
    gainedTokens.push(drawn.clue);
  }

  const currentInvestigator = currentGame.investigators[investigatorId] ?? investigator;
  return {
    ...currentGame,
    investigators: {
      ...currentGame.investigators,
      [investigatorId]: {
        ...currentInvestigator,
        clues: currentInvestigator.clues + gainedTokens.length,
        clueTokens: [...(currentInvestigator.clueTokens ?? []), ...gainedTokens],
      },
    },
  };
}

export function spawnCluesAtSpace(
  game: GameState,
  spaceId: string,
  requestedAmount: number,
): GameState {
  let currentGame = game;
  const amount = Math.max(0, requestedAmount);
  for (let index = 0; index < amount; index++) {
    const drawn = drawClueToken(currentGame);
    currentGame = drawn.game;
    if (!drawn.clue) break;
    const space = currentGame.board.spaces[spaceId];
    if (!space) throw new Error(`Space "${spaceId}" does not exist.`);
    currentGame = {
      ...currentGame,
      board: {
        ...currentGame.board,
        spaces: {
          ...currentGame.board.spaces,
          [spaceId]: {
            ...space,
            clues: space.clues + 1,
            clueTokenIds: [...space.clueTokenIds, drawn.clue.id],
          },
        },
      },
    };
  }
  return currentGame;
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
