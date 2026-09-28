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
   * Conditions are double-sided cards. The official discard rule
   * immediately shuffles them back into their deck, face-up.
   */
  const updatedConditionDeck = [
    ...(game.board.conditionDeck ?? []),
    conditionId,
  ];

  for (let index = updatedConditionDeck.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [updatedConditionDeck[index], updatedConditionDeck[randomIndex]] =
      [updatedConditionDeck[randomIndex], updatedConditionDeck[index]];
  }

  /*
   * RETURN UPDATED GAME
   */

  return {
    ...game,

    board: {
      ...game.board,
      conditionDeck: updatedConditionDeck,
      conditionDiscard: (game.board.conditionDiscard ?? []).filter(
        (id) => id !== conditionId,
      ),
    },

    conditions: {
      ...game.conditions,
      [conditionId]: {
        ...condition,
        flipped: false,
      },
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
