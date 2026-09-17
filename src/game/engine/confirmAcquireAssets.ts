import type { GameState } from "../models/GameState";

export function confirmAcquireAssets(
  game: GameState,
  assetIds: string[],
  useBankLoan: boolean,
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
    game.lastTest.skill !==
    "influence"
  ) {
    throw new Error(
      "The current test is not an Influence test.",
    );
  }

  const selectedAssets =
    game.board.assetReserve.filter(
      (asset) =>
        assetIds.includes(asset.id),
    );

  if (
    selectedAssets.length !==
    assetIds.length
  ) {
    throw new Error(
      "One or more selected Assets are not in the Reserve.",
    );
  }

  /*
  * ============================================================
  * BANK LOAN
  * ============================================================
  *
  * Bank Loan:
  * Gain a Debt Condition to immediately
  * add 2 successes to the Acquire Assets test.
  */

  const effectiveSuccesses =
    game.lastTest.successes +
    (useBankLoan ? 2 : 0);

  /*
  * ============================================================
  * BANK LOAN - DEBT
  * ============================================================
  */

  let debtId: string | null = null;

  if (useBankLoan) {
    debtId =
      game.board.conditionDeck.find(
        (conditionId) =>
          game.conditions[
            conditionId
          ]?.definitionId ===
          "condition-debt",
      ) ?? null;

    if (!debtId) {
      throw new Error(
        "There are no Debt Conditions available.",
      );
    }
  }

  /*
   * TOTAL VALUE OF SELECTED ASSETS
   */

  const totalValue =
    selectedAssets.reduce(
      (total, asset) =>
        total + asset.value,
      0,
    );

  /*
   * RESOURCES NEEDED
   *
   * Resources automatically cover
   * the value that exceeds the
   * successes obtained on the test.
   */

  const resourcesNeeded =
    Math.max(
      0,
      totalValue -
        effectiveSuccesses,
    );

  /*
   * CHECK AVAILABLE RESOURCES
   */

  if (
    resourcesNeeded >
    investigator.resources
  ) {
    throw new Error(
      "The investigator does not have enough Resources for the selected Assets.",
    );
  }

  /*
   * ADD ASSETS TO INVESTIGATOR
   */

  const updatedInvestigator = {
    ...investigator,

    assetIds: [
      ...investigator.assetIds,
      ...selectedAssets.map(
        (asset) => asset.id,
      ),
    ],

    conditionIds: debtId
      ? [
          ...investigator.conditionIds,
          debtId,
        ]
      : investigator.conditionIds,

    resources:
      investigator.resources -
      resourcesNeeded,
  };

  /*
   * REMOVE SELECTED ASSETS
   */

  const remainingReserve =
    game.board.assetReserve.filter(
      (asset) =>
        !assetIds.includes(asset.id),
    );

  /*
   * REFILL RESERVE
   */

  const assetDeck = [
    ...game.board.assetDeck,
  ];

  while (
    remainingReserve.length < 4 &&
    assetDeck.length > 0
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
          assetDeck.length,
      );

    const nextAsset =
      assetDeck.splice(
        randomIndex,
        1,
      )[0];

    if (nextAsset) {
      remainingReserve.push(
        nextAsset,
      );
    }
  }

  const conditionDeck =
    debtId
      ? game.board.conditionDeck.filter(
          (conditionId) =>
            conditionId !== debtId,
        )
      : game.board.conditionDeck;

  return {
    ...game,

    investigators: {
      ...game.investigators,

      [investigatorId]:
        updatedInvestigator,
    },

    board: {
      ...game.board,

      assetDeck,

      assetReserve:
        remainingReserve,

      conditionDeck,
    },

    lastTest: null,
  };
}