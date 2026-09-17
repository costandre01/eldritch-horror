import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { moveInvestigator } from "./moveInvestigator";

export interface TravelResult {
  game: GameState;
  moved: boolean;
  ticketUsed: "train" | "ship" | null;
}

export function travelInvestigator(
  game: GameState,
  map: MapDefinition,
  destinationSpaceId: string,
): TravelResult {
  const investigatorId = game.activeInvestigatorId;

  if (!investigatorId) {
    throw new Error(
      "There is no active investigator.",
    );
  }

  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  if (!investigator.travelActive) {
    throw new Error(
      "Travel has not been started.",
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

  const path = currentSpace.paths.find(
    (item) => item.toSpaceId === destinationSpaceId,
  );

  if (!path) {
    throw new Error(
      `Investigator cannot travel from "${currentSpace.id}" to "${destinationSpaceId}".`,
    );
  }

  const isFirstMove =
    investigator.travelMoves === 0;

  let ticketUsed: "train" | "ship" | null = null;

  if (!isFirstMove) {
    if (path.type === "train") {
      if (investigator.trainTickets <= 0) {
        throw new Error(
          "No Train Ticket available.",
        );
      }

      ticketUsed = "train";
    }

    if (path.type === "ship") {
      if (investigator.shipTickets <= 0) {
        throw new Error(
          "No Ship Ticket available.",
        );
      }

      ticketUsed = "ship";
    }

    if (path.type === "uncharted") {
      throw new Error(
        "An additional Travel movement cannot use an Uncharted path.",
      );
    }
  }

  const movedGame = moveInvestigator(
    game,
    map,
    investigatorId,
    destinationSpaceId,
  );

  const movedInvestigator =
    movedGame.investigators[investigatorId];

  return {
    game: {
      ...movedGame,

      investigators: {
        ...movedGame.investigators,

        [investigatorId]: {
          ...movedInvestigator,

          travelMoves:
            investigator.travelMoves + 1,

          travelHistory: [
            ...investigator.travelHistory,
            {
              fromSpaceId: currentSpace.id,
              toSpaceId: destinationSpaceId,
              ticketUsed,
            },
          ],

          trainTickets:
            ticketUsed === "train"
              ? investigator.trainTickets - 1
              : investigator.trainTickets,

          shipTickets:
            ticketUsed === "ship"
              ? investigator.shipTickets - 1
              : investigator.shipTickets,
        },
      },
    },

    moved: true,

    ticketUsed,
  };
}