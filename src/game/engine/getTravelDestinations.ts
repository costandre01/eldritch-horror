import type { MapDefinition } from "../models/MapDefinition";

export interface TravelDestination {
  spaceId: string;
  pathType: "train" | "ship" | "uncharted";
}

export function getTravelDestinations(
  map: MapDefinition,
  currentSpaceId: string,
): TravelDestination[] {
  const currentSpace = map.spaces.find(
    (space) => space.id === currentSpaceId,
  );

  if (!currentSpace) {
    throw new Error(
      `Space "${currentSpaceId}" does not exist.`,
    );
  }

  return currentSpace.paths.map((path) => ({
    spaceId: path.toSpaceId,
    pathType: path.type,
  }));
}