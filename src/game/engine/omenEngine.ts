import type { GameState } from "../models/GameState";
import { advanceDoom } from "./doomEngine";

export const OMEN_POSITIONS = {
  green: 0,
  blueRight: 1,
  red: 2,
  blueLeft: 3,
} as const;

const OMEN_POSITION_COUNT = 4;

function normalizeOmenPosition(
  position: number,
): number {
  return (
    ((position % OMEN_POSITION_COUNT) +
      OMEN_POSITION_COUNT) %
    OMEN_POSITION_COUNT
  );
}

function getOmenPositionFromLocation(
  location?: string,
): number | null {
  if (!location) {
    return null;
  }

  switch (location.toLowerCase()) {
    case "green":
      return OMEN_POSITIONS.green;

    case "blue-right":
    case "blueright":
    case "blue_right":
      return OMEN_POSITIONS.blueRight;

    case "red":
      return OMEN_POSITIONS.red;

    case "blue-left":
    case "blueleft":
    case "blue_left":
      return OMEN_POSITIONS.blueLeft;

    default:
      return null;
  }
}

export function moveOmen(
  game: GameState,
  amount: number,
): GameState {
  const currentPosition =
    game.ancientOne.omenPosition;

  const newPosition = normalizeOmenPosition(
    currentPosition + amount,
  );

  return {
    ...game,

    ancientOne: {
      ...game.ancientOne,

      omenPosition: newPosition,
    },
  };
}

function getOmenColorFromPosition(
  position: number,
): "green" | "blue" | "red" {
  switch (normalizeOmenPosition(position)) {
    case OMEN_POSITIONS.green:
      return "green";

    case OMEN_POSITIONS.blueRight:
      return "blue";

    case OMEN_POSITIONS.red:
      return "red";

    case OMEN_POSITIONS.blueLeft:
      return "blue";

    default:
      return "green";
  }
}

export function advanceOmen(
  game: GameState,
  amount = 1,
): GameState {
  const steps = Math.max(0, amount);

  if (steps === 0) {
    return game;
  }

  let currentGame = game;

  for (let i = 0; i < steps; i++) {
    const currentPosition =
      normalizeOmenPosition(
        currentGame.ancientOne.omenPosition,
      );

    const newPosition =
      normalizeOmenPosition(
        currentPosition + 1,
      );

    const newOmenColor =
      getOmenColorFromPosition(newPosition);

    const matchingGateCount =
      Object.values(
        currentGame.board.spaces,
      ).reduce(
        (count, space) =>
          count +
          space.gates.filter(
            (gate) =>
              gate.omen === newOmenColor,
          ).length,
        0,
      );

    const gameAfterDoom =
      advanceDoom(
        currentGame,
        matchingGateCount,
      );

    currentGame = {
      ...gameAfterDoom,

      ancientOne: {
        ...gameAfterDoom.ancientOne,

        omenPosition: newPosition,
      },
    };

    if (currentGame.ancientOne.awakened) {
      break;
    }
  }

  return currentGame;
}

export function placeEldritchTokenOnOmen(
  game: GameState,
  amount = 1,
  location?: string,
): GameState {
  const tokenAmount = Math.max(0, amount);

  if (tokenAmount === 0) {
    return game;
  }

  /*
   * Se a carta indicar uma localização específica
   * do Omen track, usamos essa posição.
   *
   * Caso contrário, usamos a posição atual do Omen.
   */
  const specifiedPosition =
    getOmenPositionFromLocation(location);

  const omenPosition =
    specifiedPosition ??
    normalizeOmenPosition(
      game.ancientOne.omenPosition,
    );

  const newTokenPositions = [
    ...game.ancientOne.eldritchTokenPositions,
  ];

  for (let i = 0; i < tokenAmount; i++) {
    newTokenPositions.push(omenPosition);
  }

  return {
    ...game,

    ancientOne: {
      ...game.ancientOne,

      eldritchTokens:
        game.ancientOne.eldritchTokens +
        tokenAmount,

      eldritchTokenPositions:
        newTokenPositions,
    },
  };
}

export function discardEldritchTokenFromOmen(
  game: GameState,
  amount = 1,
): GameState {
  const tokenAmount = Math.max(0, amount);

  if (tokenAmount === 0) {
    return game;
  }

  const omenPosition =
    normalizeOmenPosition(
      game.ancientOne.omenPosition,
    );

  const tokenPositions = [
    ...game.ancientOne.eldritchTokenPositions,
  ];

  let remainingToRemove = tokenAmount;

  const remainingTokenPositions =
    tokenPositions.filter((position) => {
      if (
        position === omenPosition &&
        remainingToRemove > 0
      ) {
        remainingToRemove -= 1;
        return false;
      }

      return true;
    });

  const removed =
    tokenPositions.length -
    remainingTokenPositions.length;

  if (removed === 0) {
    return game;
  }

  return {
    ...game,

    ancientOne: {
      ...game.ancientOne,

      eldritchTokens: Math.max(
        0,
        game.ancientOne.eldritchTokens -
          removed,
      ),

      eldritchTokenPositions:
        remainingTokenPositions,
    },
  };
}

export function getCurrentOmen(
  game: GameState,
): "green" | "blue" | "red" {
  switch (
    normalizeOmenPosition(
      game.ancientOne.omenPosition,
    )
  ) {
    case OMEN_POSITIONS.green:
      return "green";

    case OMEN_POSITIONS.blueRight:
      return "blue";

    case OMEN_POSITIONS.red:
      return "red";

    case OMEN_POSITIONS.blueLeft:
      return "blue";

    default:
      return "green";
  }
}