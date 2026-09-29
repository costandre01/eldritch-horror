import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

export function moveClue(
  game: GameState,
  map: MapDefinition,
  fromSpaceId: string,
  targetSpaceType: "sea" | "city" | "wilderness",
): GameState {
  const fromSpace = game.board.spaces[fromSpaceId];
  if (!fromSpace) throw new Error(`Space "${fromSpaceId}" does not exist.`);

  const clueTokenId = fromSpace.clueTokenIds[0];
  if (fromSpace.clues <= 0 || !clueTokenId) return game;

  const visited = new Set([fromSpaceId]);
  let frontier = [fromSpaceId];
  let destinations: string[] = [];

  while (frontier.length > 0 && destinations.length === 0) {
    const nextFrontier: string[] = [];
    for (const currentSpaceId of frontier) {
      const currentSpace = map.spaces.find((space) => space.id === currentSpaceId);
      if (!currentSpace) continue;
      for (const connectedSpaceId of currentSpace.connectedSpaceIds) {
        if (visited.has(connectedSpaceId)) continue;
        visited.add(connectedSpaceId);
        const connectedSpace = map.spaces.find((space) => space.id === connectedSpaceId);
        if (!connectedSpace) continue;
        if (connectedSpace.type === targetSpaceType) destinations.push(connectedSpaceId);
        nextFrontier.push(connectedSpaceId);
      }
    }
    frontier = nextFrontier;
  }

  destinations = [...new Set(destinations)];
  if (destinations.length === 0) return game;

  if (destinations.length > 1) {
    return {
      ...game,
      pendingDecision: {
        type: "select-space",
        title: "Move Clue",
        message: `Choose the nearest ${targetSpaceType} space for the Clue.`,
        spaceIds: destinations,
        onSpaceSelected: [],
        source: "encounter:nearest-clue",
        resume: {
          type: "encounter-nearest-clue",
          clueTokenId,
          sourceSpaceId: fromSpaceId,
        },
      },
    };
  }

  return movePhysicalClue(game, clueTokenId, fromSpaceId, destinations[0]);
}

export function movePhysicalClue(
  game: GameState,
  clueTokenId: string,
  fromSpaceId: string,
  destinationSpaceId: string,
): GameState {
  const fromSpace = game.board.spaces[fromSpaceId];
  const targetSpace = game.board.spaces[destinationSpaceId];
  if (!fromSpace || !targetSpace) throw new Error("Clue source or destination does not exist.");
  if (!fromSpace.clueTokenIds.includes(clueTokenId)) return game;

  return {
    ...game,
    board: {
      ...game.board,
      spaces: {
        ...game.board.spaces,
        [fromSpaceId]: {
          ...fromSpace,
          clues: Math.max(0, fromSpace.clues - 1),
          clueTokenIds: fromSpace.clueTokenIds.filter((id) => id !== clueTokenId),
        },
        [destinationSpaceId]: {
          ...targetSpace,
          clues: targetSpace.clues + 1,
          clueTokenIds: [...targetSpace.clueTokenIds, clueTokenId],
        },
      },
    },
  };
}
