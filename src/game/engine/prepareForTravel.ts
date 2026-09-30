import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { canPerformAction } from "./canPerformAction";
import { assertNormalActionAllowed } from "./conditionRestrictions";

export function prepareForTravel(
  game: GameState,
  map: MapDefinition,
  ticketType: "train" | "ship",
  discardTicketType?: "train" | "ship",
): GameState {
  const investigatorId =
    game.activeInvestigatorId;

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

  if (
    !canPerformAction(
      investigator,
      "prepare-for-travel",
    )
  ) {
    throw new Error(
      "Investigator cannot perform Prepare for Travel.",
    );
  }

  const currentSpaceId =
    investigator.spaceId;

  if (!currentSpaceId) {
    throw new Error(
      `Investigator "${investigatorId}" has no current space.`,
    );
  }

  const currentSpace =
    map.spaces.find(
      (space) =>
        space.id === currentSpaceId,
    );

  if (!currentSpace) {
    throw new Error(
      `Space "${currentSpaceId}" does not exist.`,
    );
  }

  if (currentSpace.type !== "city") {
    throw new Error(
      "Prepare for Travel can only be performed in a City.",
    );
  }

  const hasRequiredPath =
    currentSpace.paths.some(
      (path) => path.type === ticketType,
    );

  if (!hasRequiredPath) {
    throw new Error(
      `Cannot gain a ${ticketType} Travel Ticket because this City has no ${ticketType} path.`,
    );
  }

  const totalTickets =
    investigator.trainTickets +
    investigator.shipTickets;

  let trainTickets =
    investigator.trainTickets;

  let shipTickets =
    investigator.shipTickets;

  /*
  * If the investigator already has 2 Travel Tickets,
  * 1 ticket must be discarded before gaining the new one.
  */
  if (totalTickets >= 2) {
    if (!discardTicketType) {
      throw new Error(
        "Investigator must discard a Travel Ticket before gaining another one.",
      );
    }

    if (discardTicketType === "train") {
      if (trainTickets <= 0) {
        throw new Error(
          "Investigator has no Train Ticket to discard.",
        );
      }

      trainTickets -= 1;
    } else {
      if (shipTickets <= 0) {
        throw new Error(
          "Investigator has no Ship Ticket to discard.",
        );
      }

      shipTickets -= 1;
    }
  }

  if (ticketType === "train") {
    trainTickets += 1;
  } else {
    shipTickets += 1;
  }

  return {
    ...game,

    investigators: {
      ...game.investigators,

      [investigatorId]: {
        ...investigator,

        trainTickets,
        shipTickets,

        actionsPerformed: [
          ...investigator.actionsPerformed,
          "prepare-for-travel",
        ],
      },
    },
  };
}
