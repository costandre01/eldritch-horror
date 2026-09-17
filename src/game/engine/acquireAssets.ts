import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import type { Investigator } from "../models/Investigator";

import { canPerformAction } from "./canPerformAction";
import { performTest } from "./performTest";

export function acquireAssets(
  game: GameState,
  map: MapDefinition,
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
   * CURRENT SPACE
   * ============================================================
   */

  if (!investigator.spaceId) {
    throw new Error(
      "Investigator has no current space.",
    );
  }

  const currentSpace =
    map.spaces.find(
      (space) =>
        space.id === investigator.spaceId,
    );

  if (!currentSpace) {
    throw new Error(
      `Space "${investigator.spaceId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * CITY VALIDATION
   * ============================================================
   */

  if (currentSpace.type !== "city") {
    throw new Error(
      "Acquire Assets can only be performed in a City.",
    );
  }

  /*
   * ============================================================
   * BOARD SPACE
   * ============================================================
   */

  const boardSpace =
    game.board.spaces[
      investigator.spaceId
    ];

  if (!boardSpace) {
    throw new Error(
      `Board space "${investigator.spaceId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * MONSTER VALIDATION
   * ============================================================
   *
   * Monster state is not implemented yet,
   * but the BoardState already contains monsterIds.
   */

  if (boardSpace.monsterIds.length > 0) {
    throw new Error(
      "Acquire Assets cannot be performed while a Monster is on the space.",
    );
  }

  /*
   * ============================================================
   * ACTION VALIDATION
   * ============================================================
   */

  if (
    !canPerformAction(
      investigator,
      "acquire-assets",
    )
  ) {
    throw new Error(
      "Investigator cannot perform Acquire Assets.",
    );
  }

  /*
   * ============================================================
   * MARK ACTION AS PERFORMED
   * ============================================================
   */

  const updatedInvestigator: Investigator = {
    ...investigator,

    actionsPerformed: [
      ...investigator.actionsPerformed,
      "acquire-assets",
    ],
  };

  /*
   * ============================================================
   * PERFORM INFLUENCE TEST
   * ============================================================
   *
   * performTest:
   *
   * 1. Rolls the Influence test.
   * 2. Saves lastTest.
   * 3. Resolves Condition triggers caused by
   *    the test result.
   */

  const testResult =
    performTest(
      {
        ...game,

        investigators: {
          ...game.investigators,

          [investigatorId]:
            updatedInvestigator,
        },
      },

      investigatorId,

      "influence",
    );

  /*
   * ============================================================
   * RETURN UPDATED GAME
   * ============================================================
   */

  return testResult.game;
}