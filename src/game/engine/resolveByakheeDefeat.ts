import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { startEncounter } from "./startEncounter";
import { getByakheeReachableSpaces } from "./getByakheeReachableSpaces";

export function resolveByakheeDefeat(
  game: GameState,
  map: MapDefinition,
  choiceId: string,
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

  if (!investigator.spaceId) {
    throw new Error(
      "Investigator has no current space.",
    );
  }

  /*
   * ==========================================================
   * NORMAL ADDITIONAL ENCOUNTER
   * ==========================================================
   */

  if (choiceId === "encounter") {
    return startEncounter(
      {
        ...game,
        pendingDecision: null,
      },
      map,
    );
  }

  /*
   * ==========================================================
   * BYAKHEE MOVEMENT
   * ==========================================================
   *
   * The investigator loses 1 Sanity and may move
   * directly to any space within 3 movement steps.
   *
   * The final destination is selected directly
   * on the map.
   */

  if (choiceId !== "move") {
    return game;
  }

  const newSanity =
    Math.max(
      0,
      investigator.sanity - 1,
    );

  /*
   * Find every space reachable within
   * a maximum of 3 movement steps.
   */

  const destinationIds =
    getByakheeReachableSpaces(
      map,
      investigator.spaceId,
      3,
    );

  return {
    ...game,

    investigators: {
      ...game.investigators,

      [investigatorId]: {
        ...investigator,

        sanity: newSanity,
      },
    },

    /*
     * Keep the pending decision so the map knows
     * which spaces can be selected.
     *
     * The GameFlowOverlay is hidden for this
     * specific decision in App.tsx.
     */

    pendingDecision: {
      type: "select-space",

      title:
        "BYAKHEE — MOVE",

      message:
        "Choose your final destination.",

      spaceIds:
        destinationIds,

      onSpaceSelected: [],

      source:
        "byakhee-move",
    },
  };
}