import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

export interface TravelReachableSpace {
  spaceId: string;
  moves: number;
  trainTicketsUsed: number;
  shipTicketsUsed: number;
}

interface SearchState {
  spaceId: string;
  moves: number;
  trainTicketsUsed: number;
  shipTicketsUsed: number;
}

export function getTravelReachableSpaces(
  game: GameState,
  map: MapDefinition,
): TravelReachableSpace[] {
  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    return [];
  }

  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    return [];
  }

  if (!investigator.travelActive) {
    return [];
  }

  if (!investigator.spaceId) {
    return [];
  }

  const maxTrainTickets =
    investigator.trainTickets;

  const maxShipTickets =
    investigator.shipTickets;

  const queue: SearchState[] = [
    {
      spaceId: investigator.spaceId,
      moves: 0,
      trainTicketsUsed: 0,
      shipTicketsUsed: 0,
    },
  ];

  const visited = new Set<string>();

  const reachable = new Map<
    string,
    TravelReachableSpace
  >();

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

    const stateKey = [
      current.spaceId,
      current.moves,
      current.trainTicketsUsed,
      current.shipTicketsUsed,
    ].join("|");

    if (visited.has(stateKey)) {
      continue;
    }

    visited.add(stateKey);

    const currentSpace = map.spaces.find(
      (space) => space.id === current.spaceId,
    );

    if (!currentSpace) {
      continue;
    }

    for (const path of currentSpace.paths) {
      const nextMoves =
        current.moves + 1;

      let nextTrainTicketsUsed =
        current.trainTicketsUsed;

      let nextShipTicketsUsed =
        current.shipTicketsUsed;

      /*
       * First movement is free.
       */
      if (current.moves > 0) {
        if (path.type === "train") {
          if (
            nextTrainTicketsUsed >=
            maxTrainTickets
          ) {
            continue;
          }

          nextTrainTicketsUsed += 1;
        }

        if (path.type === "ship") {
          if (
            nextShipTicketsUsed >=
            maxShipTickets
          ) {
            continue;
          }

          nextShipTicketsUsed += 1;
        }

        /*
         * Uncharted paths can only be
         * used for the first movement.
         */
        if (path.type === "uncharted") {
          continue;
        }
      }

      const nextState: SearchState = {
        spaceId: path.toSpaceId,
        moves: nextMoves,
        trainTicketsUsed:
          nextTrainTicketsUsed,
        shipTicketsUsed:
          nextShipTicketsUsed,
      };

      /*
       * Keep the cheapest way we found to
       * reach this space.
       */
      const existing =
        reachable.get(path.toSpaceId);

      if (
        !existing ||
        nextState.moves < existing.moves ||
        (
          nextState.moves === existing.moves &&
          nextState.trainTicketsUsed +
            nextState.shipTicketsUsed <
            existing.trainTicketsUsed +
              existing.shipTicketsUsed
        )
      ) {
        reachable.set(path.toSpaceId, {
          spaceId: path.toSpaceId,
          moves: nextState.moves,
          trainTicketsUsed:
            nextState.trainTicketsUsed,
          shipTicketsUsed:
            nextState.shipTicketsUsed,
        });
      }

      queue.push(nextState);
    }
  }

  return Array.from(reachable.values());
}