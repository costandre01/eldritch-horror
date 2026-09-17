import type { GameState } from "../models/GameState";

export function discardCondition(
  game: GameState,
  investigatorId: string,
  conditionId: string,
): GameState {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * CHECK OWNERSHIP
   */

  if (
    !investigator.conditionIds.includes(
      conditionId,
    )
  ) {
    throw new Error(
      `Condition "${conditionId}" is not associated with investigator "${investigatorId}".`,
    );
  }

  /*
   * CHECK CONDITION EXISTS
   */

  const condition =
    game.conditions[conditionId];

  if (!condition) {
    throw new Error(
      `Condition "${conditionId}" does not exist.`,
    );
  }

  /*
   * REMOVE CONDITION FROM INVESTIGATOR
   */

  const updatedConditionIds =
    investigator.conditionIds.filter(
      (id) => id !== conditionId,
    );

  /*
   * ADD CONDITION TO DISCARD
   */

  const updatedConditionDiscard = [
    ...game.board.conditionDiscard,
    conditionId,
  ];

  /*
   * RETURN UPDATED GAME
   */

  return {
    ...game,

    board: {
      ...game.board,

      conditionDiscard:
        updatedConditionDiscard,
    },

    investigators: {
      ...game.investigators,

      [investigatorId]: {
        ...investigator,

        conditionIds:
          updatedConditionIds,
      },
    },
  };
}