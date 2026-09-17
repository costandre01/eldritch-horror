import type {
  MapPathDefinition,
  MapSpaceDefinition,
} from "../models/MapDefinition";

export function getPathToSpace(
  space: MapSpaceDefinition,
  targetSpaceId: string,
): MapPathDefinition | undefined {
  return space.paths.find(
    (path) => path.toSpaceId === targetSpaceId,
  );
}

export function areSpacesConnected(
  space: MapSpaceDefinition,
  targetSpaceId: string,
): boolean {
  return space.paths.some(
    (path) => path.toSpaceId === targetSpaceId,
  );
}