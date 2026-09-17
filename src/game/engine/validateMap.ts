import type { MapDefinition } from "../models/MapDefinition";

export function validateMap(map: MapDefinition): void {
  const spacesById = new Map(
    map.spaces.map((space) => [space.id, space]),
  );

  const errors: string[] = [];

  for (const space of map.spaces) {
    if (space.paths.length === 0) {
      errors.push(
        `Space "${space.id}" has no paths.`,
      );
    }

    for (const path of space.paths) {
      const target = spacesById.get(path.toSpaceId);

      if (!target) {
        errors.push(
          `Space "${space.id}" points to unknown space "${path.toSpaceId}".`,
        );

        continue;
      }

      if (!space.connectedSpaceIds.includes(path.toSpaceId)) {
        errors.push(
          `Space "${space.id}" has path to "${path.toSpaceId}" but it is missing from connectedSpaceIds.`,
        );
      }

      const reversePath = target.paths.find(
        (reverse) => reverse.toSpaceId === space.id,
      );

      if (!reversePath) {
        errors.push(
          `Missing reverse path: "${space.id}" -> "${target.id}".`,
        );

        continue;
      }

      if (reversePath.type !== path.type) {
        errors.push(
          `Path type mismatch between "${space.id}" and "${target.id}": ${path.type} != ${reversePath.type}.`,
        );
      }

      if (!target.connectedSpaceIds.includes(space.id)) {
        errors.push(
          `Space "${target.id}" has reverse path to "${space.id}" but it is missing from connectedSpaceIds.`,
        );
      }
    }
  }

  if (!spacesById.has(map.startingSpaceId)) {
    errors.push(
      `Starting space "${map.startingSpaceId}" does not exist.`,
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid map "${map.id}":\n\n${errors.join("\n")}`,
    );
  }
}