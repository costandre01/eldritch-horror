import type { GameState } from "../models/GameState";

/** Discard an Asset owned by the active Investigator. */
export function discardAsset(
  game: GameState,
  assetId: string,
): GameState {
  const investigatorId = game.activeInvestigatorId;
  if (!investigatorId) {
    throw new Error("There is no active investigator.");
  }

  const investigator = game.investigators[investigatorId];
  if (!investigator) {
    throw new Error(`Investigator "${investigatorId}" does not exist.`);
  }

  if (!investigator.assetIds.includes(assetId)) {
    throw new Error(`Asset "${assetId}" is not owned by Investigator "${investigatorId}".`);
  }

  const asset = game.assets[assetId];
  if (!asset) {
    throw new Error(`Asset "${assetId}" does not exist.`);
  }

  return {
    ...game,
    investigators: {
      ...game.investigators,
      [investigatorId]: {
        ...investigator,
        assetIds: investigator.assetIds.filter((id) => id !== assetId),
      },
    },
    board: {
      ...game.board,
      assetDiscard: [...game.board.assetDiscard, asset],
    },
    lastTest: null,
  };
}
