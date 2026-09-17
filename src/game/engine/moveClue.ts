import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

export function moveClue(
  game: GameState,
  map: MapDefinition,
  fromSpaceId: string,
  targetSpaceType: "sea" | "city" | "wilderness",
): GameState {
  const fromSpace =
    game.board.spaces[fromSpaceId];

  if (!fromSpace) {
    throw new Error(
      `Space "${fromSpaceId}" does not exist.`,
    );
  }

  if (fromSpace.clues <= 0) {
    return game;
  }

  const visited = new Set<string>();
  const queue: string[] = [
    fromSpaceId,
  ];

  visited.add(fromSpaceId);

  while (queue.length > 0) {
    const currentSpaceId =
      queue.shift()!;

    const currentSpace =
      map.spaces.find(
        (space) =>
          space.id === currentSpaceId,
      );

    if (!currentSpace) {
      continue;
    }

    /*
     * The Clue must move to another space.
     */
    if (
      currentSpaceId !== fromSpaceId &&
      currentSpace.type ===
        targetSpaceType
    ) {
      const targetSpace =
        game.board.spaces[
          currentSpaceId
        ];

      if (!targetSpace) {
        throw new Error(
          `Space "${currentSpaceId}" does not exist in BoardState.`,
        );
      }

      return {
        ...game,

        board: {
          ...game.board,

          spaces: {
            ...game.board.spaces,

            [fromSpaceId]: {
              ...fromSpace,

              clues:
                fromSpace.clues - 1,
            },

            [currentSpaceId]: {
              ...targetSpace,

              clues:
                targetSpace.clues + 1,
            },
          },
        },
      };
    }

    for (
      const connectedSpaceId of
        currentSpace.connectedSpaceIds
    ) {
      if (
        visited.has(
          connectedSpaceId,
        )
      ) {
        continue;
      }

      visited.add(
        connectedSpaceId,
      );

      queue.push(
        connectedSpaceId,
      );
    }
  }

  /*
   * No valid destination was found.
   * Leave the Clue where it is.
   */
  return game;
}