import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { moveInvestigator } from "./moveInvestigator";
import { getTravelReachableSpaces } from "./getTravelReachableSpaces";
import { assertNormalActionAllowed } from "./conditionRestrictions";

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

  assertNormalActionAllowed(game, investigatorId);

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

  const destination = getTravelReachableSpaces(game, map).find(
    (space) => space.spaceId === destinationSpaceId,
  );

  if (!destination) {
    throw new Error(
      `Investigator cannot reach "${destinationSpaceId}" with the available tickets.`,
    );
  }

  let movedGame = game;
  let ticketUsed: "train" | "ship" | null = null;

  for (const nextSpaceId of destination.route) {
    const movingInvestigator =
      movedGame.investigators[investigatorId];
    const currentSpace = movingInvestigator?.spaceId
      ? map.spaces.find(
          (space) => space.id === movingInvestigator.spaceId,
        )
      : undefined;

    if (!movingInvestigator || !currentSpace) {
      throw new Error("The Travel route is no longer valid.");
    }

    const path = currentSpace.paths.find(
      (item) => item.toSpaceId === nextSpaceId,
    );
    if (!path) {
      throw new Error(
        `Investigator cannot travel from "${currentSpace.id}" to "${nextSpaceId}".`,
      );
    }

    const isFirstTravelMove =
      movingInvestigator.travelMoves === 0;

    ticketUsed = null;
    if (!isFirstTravelMove) {
      if (path.type === "train") {
        if (movingInvestigator.trainTickets <= 0) {
          throw new Error("No Train Ticket available.");
        }
        ticketUsed = "train";
      } else if (path.type === "ship") {
        if (movingInvestigator.shipTickets <= 0) {
          throw new Error("No Ship Ticket available.");
        }
        ticketUsed = "ship";
      } else {
        throw new Error(
          "An additional Travel movement cannot use an Uncharted path.",
        );
      }
    }

    movedGame = moveInvestigator(
      movedGame,
      map,
      investigatorId,
      nextSpaceId,
    );

    const updatedInvestigator =
      movedGame.investigators[investigatorId];
    movedGame = {
      ...movedGame,
      investigators: {
        ...movedGame.investigators,
        [investigatorId]: {
          ...updatedInvestigator,
          travelMoves: movingInvestigator.travelMoves + 1,
          travelHistory: [
            ...movingInvestigator.travelHistory,
            {
              fromSpaceId: currentSpace.id,
              toSpaceId: nextSpaceId,
              ticketUsed,
            },
          ],
          trainTickets:
            movingInvestigator.trainTickets -
            (ticketUsed === "train" ? 1 : 0),
          shipTickets:
            movingInvestigator.shipTickets -
            (ticketUsed === "ship" ? 1 : 0),
        },
      },
    };
  }

  return { game: movedGame, moved: true, ticketUsed };
}
