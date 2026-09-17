import type { GameState } from "../models/GameState";

export function discardAsset(
  game: GameState,
  assetId: string,
): GameState {
  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    throw new Error(
      "There is no active investigator.",
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

  /*
   * Só pode descartar se não ganhou
   * nenhum Asset.
   */

  const reserve =
    game.board.assetReserve;

  const asset =
    reserve.find(
      (item) => item.id === assetId,
    );

  if (!asset) {
    throw new Error(
      `Asset "${assetId}" is not in the Reserve.`,
    );
  }

  /*
   * Retirar da Reserve
   */

  const remainingReserve =
    reserve.filter(
      (item) => item.id !== assetId,
    );

  /*
   * Adicionar ao discard
   */

  const assetDiscard = [
    ...game.board.assetDiscard,
    asset,
  ];

  /*
   * Repor Reserve
   */

  const assetDeck = [
    ...game.board.assetDeck,
  ];

  if (
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

  return {
    ...game,

    board: {
      ...game.board,

      assetDeck,

      assetReserve:
        remainingReserve,

      assetDiscard,
    },

    lastTest: null,
  };
}