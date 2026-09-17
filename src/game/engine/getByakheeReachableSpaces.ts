import type { MapDefinition } from "../models/MapDefinition";

export function getByakheeReachableSpaces(
  map: MapDefinition,
  startSpaceId: string,
  maxMoves = 3,
): string[] {
  const visited = new Set<string>();
  const queue: {
    spaceId: string;
    distance: number;
  }[] = [];

  queue.push({
    spaceId: startSpaceId,
    distance: 0,
  });

  visited.add(startSpaceId);

  const reachable: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

    if (
      current.distance >= maxMoves
    ) {
      continue;
    }

    const currentSpace =
      map.spaces.find(
        (space) =>
          space.id ===
          current.spaceId,
      );

    if (!currentSpace) {
      continue;
    }

    for (const path of currentSpace.paths) {
      const destinationId =
        path.toSpaceId;

      if (
        visited.has(destinationId)
      ) {
        continue;
      }

      visited.add(destinationId);

      const distance =
        current.distance + 1;

      reachable.push(
        destinationId,
      );

      queue.push({
        spaceId: destinationId,
        distance,
      });
    }
  }

  return reachable;
}