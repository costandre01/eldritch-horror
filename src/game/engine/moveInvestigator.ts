import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

export function moveInvestigator(
  game: GameState,
  map: MapDefinition,
  investigatorId: string,
  destinationSpaceId: string,
): GameState {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  if (!investigator.spaceId) {
    throw new Error(
      `Investigator "${investigatorId}" has no current space.`,
    );
  }

  const currentSpace = map.spaces.find(
    (space) => space.id === investigator.spaceId,
  );

  if (!currentSpace) {
    throw new Error(
      `Current space "${investigator.spaceId}" does not exist.`,
    );
  }

  const destination = currentSpace.paths.find(
    (path) => path.toSpaceId === destinationSpaceId,
  );

  if (!destination) {
    throw new Error(
      `Investigator cannot move from "${currentSpace.id}" to "${destinationSpaceId}".`,
    );
  }

  return {
    ...game,

    investigators: {
      ...game.investigators,

      [investigatorId]: {
        ...investigator,
        spaceId: destinationSpaceId,
      },
    },
  };
}