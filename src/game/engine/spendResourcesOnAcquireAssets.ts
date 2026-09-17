import type { GameState } from "../models/GameState";

export function spendResourcesOnAcquireAssets(
  game: GameState,
  amount: number,
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

  if (!game.lastTest) {
    throw new Error(
      "There is no active test.",
    );
  }

  if (
    !Number.isInteger(amount) ||
    amount < 0
  ) {
    throw new Error(
      "Resource amount must be a non-negative integer.",
    );
  }

  if (amount > investigator.resources) {
    throw new Error(
      "Investigator does not have enough Resources.",
    );
  }

  const updatedInvestigator = {
    ...investigator,

    resources:
      investigator.resources - amount,
  };

  const updatedTest = {
    ...game.lastTest,

    successes:
      game.lastTest.successes + amount,

    passed:
      game.lastTest.successes + amount >=
      game.lastTest.difficulty,
  };

  return {
    ...game,

    investigators: {
      ...game.investigators,

      [investigatorId]:
        updatedInvestigator,
    },

    lastTest: updatedTest,
  };
}