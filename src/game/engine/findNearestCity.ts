import type { MapDefinition } from "../models/MapDefinition";

export function findNearestCity(
  map: MapDefinition,
  startSpaceId: string,
): string | null {
  const queue: string[] = [
    startSpaceId,
  ];

  const visited = new Set<string>();

  while (queue.length > 0) {
    const spaceId = queue.shift()!;

    if (visited.has(spaceId)) {
      continue;
    }

    visited.add(spaceId);

    const space = map.spaces.find(
      (item) => item.id === spaceId,
    );

    if (!space) {
      continue;
    }

    if (space.type === "city") {
      return space.id;
    }

    for (const nextSpaceId of space.connectedSpaceIds) {
      if (!visited.has(nextSpaceId)) {
        queue.push(nextSpaceId);
      }
    }
  }

  return null;
}