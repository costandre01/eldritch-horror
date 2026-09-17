import type { GameState } from "../models/GameState";

export function undoTravel(
  game: GameState,
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

  /*
   * ============================================================
   * TRAVEL MUST BE FINISHED
   * ============================================================
   *
   * Undo Travel reverses the complete Travel action.
   *
   * Therefore Travel must already have been ended.
   */

  if (investigator.travelActive) {
    throw new Error(
      "Finish Travel before undoing the Travel action.",
    );
  }

  /*
   * ============================================================
   * LAST ACTION MUST BE TRAVEL
   * ============================================================
   *
   * This is the important safety rule.
   *
   * If another action was performed after Travel,
   * we cannot undo Travel because that would change
   * the game state after that action.
   */

  const lastAction =
    investigator.actionsPerformed[
      investigator.actionsPerformed.length - 1
    ];

  if (lastAction !== "travel") {
    throw new Error(
      "Travel cannot be undone because another action was performed afterwards.",
    );
  }

  /*
   * ============================================================
   * TRAVEL START POSITION
   * ============================================================
   */

  if (!investigator.travelStartSpaceId) {
    throw new Error(
      "Travel start space is not available.",
    );
  }

  /*
   * ============================================================
   * RETURN TICKETS
   * ============================================================
   *
   * Return every ticket consumed during this Travel.
   */

  let trainTickets =
    investigator.trainTickets;

  let shipTickets =
    investigator.shipTickets;

  for (const move of investigator.travelHistory) {
    if (move.ticketUsed === "train") {
      trainTickets += 1;
    }

    if (move.ticketUsed === "ship") {
      shipTickets += 1;
    }
  }

  /*
   * ============================================================
   * UNDO COMPLETE TRAVEL
   * ============================================================
   */

  return {
    ...game,

    investigators: {
      ...game.investigators,

      [investigatorId]: {
        ...investigator,

        /*
         * Return to the space where Travel started.
         */

        spaceId:
          investigator.travelStartSpaceId,

        /*
         * Remove the Travel action.
         */

        actionsPerformed:
          investigator.actionsPerformed.slice(
            0,
            -1,
          ),

        /*
         * Return tickets spent during Travel.
         */

        trainTickets,

        shipTickets,

        /*
         * Clear Travel state.
         */

        travelMoves: 0,

        travelActive: false,

        travelHistory: [],

        travelStartSpaceId: null,
      },
    },
  };
}