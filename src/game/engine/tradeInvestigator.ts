import type { GameState } from "../models/GameState";

import { canPerformAction } from "./canPerformAction";

/*
 * ============================================================
 * TRADE OFFER
 * ============================================================
 */

export interface TradeOffer {
  /*
   * Active Investigator -> Target
   */

  clues: number;

  trainTickets: number;

  shipTickets: number;

  assetIds: string[];

  artifactIds: string[];

  spellIds: string[];

  /*
   * Target Investigator -> Active Investigator
   */

  targetClues: number;

  targetTrainTickets: number;

  targetShipTickets: number;

  targetAssetIds: string[];

  targetArtifactIds: string[];

  targetSpellIds: string[];
}

/*
 * ============================================================
 * TRADE INVESTIGATOR
 * ============================================================
 */

export function tradeInvestigator(
  game: GameState,
  targetInvestigatorId: string,
  offer: TradeOffer,
): GameState {
  /*
   * ==========================================================
   * ACTIVE INVESTIGATOR
   * ==========================================================
   */

  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    throw new Error(
      "There is no active investigator.",
    );
  }

  const investigator =
    game.investigators[
      investigatorId
    ];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * ==========================================================
   * TARGET INVESTIGATOR
   * ==========================================================
   */

  const targetInvestigator =
    game.investigators[
      targetInvestigatorId
    ];

  if (!targetInvestigator) {
    throw new Error(
      `Investigator "${targetInvestigatorId}" does not exist.`,
    );
  }

  /*
   * ==========================================================
   * SELF TRADE
   * ==========================================================
   */

  if (
    investigator.id ===
    targetInvestigator.id
  ) {
    throw new Error(
      "An investigator cannot trade with himself.",
    );
  }

  /*
   * ==========================================================
   * SAME SPACE
   * ==========================================================
   */

  if (
    investigator.spaceId !==
    targetInvestigator.spaceId
  ) {
    throw new Error(
      "Investigators must be on the same space to trade.",
    );
  }

  /*
   * ==========================================================
   * ACTION VALIDATION
   * ==========================================================
   */

  if (
    !canPerformAction(
      investigator,
      "trade",
    )
  ) {
    throw new Error(
      "Investigator cannot perform Trade.",
    );
  }

  /*
   * ==========================================================
   * NORMALIZE OFFER
   * ==========================================================
   */

  const clues =
    offer.clues ?? 0;

  const trainTickets =
    offer.trainTickets ?? 0;

  const shipTickets =
    offer.shipTickets ?? 0;

  const assetIds =
    offer.assetIds ?? [];

  const artifactIds =
    offer.artifactIds ?? [];

  const spellIds =
    offer.spellIds ?? [];

  const targetClues =
    offer.targetClues ?? 0;

  const targetTrainTickets =
    offer.targetTrainTickets ?? 0;

  const targetShipTickets =
    offer.targetShipTickets ?? 0;

  const targetAssetIds =
    offer.targetAssetIds ?? [];

  const targetArtifactIds =
    offer.targetArtifactIds ?? [];

  const targetSpellIds =
    offer.targetSpellIds ?? [];

  /*
   * ==========================================================
   * NUMERIC VALIDATION
   * ==========================================================
   */

  if (clues < 0) {
    throw new Error(
      "Clues to trade cannot be negative.",
    );
  }

  if (trainTickets < 0) {
    throw new Error(
      "Train Tickets to trade cannot be negative.",
    );
  }

  if (shipTickets < 0) {
    throw new Error(
      "Ship Tickets to trade cannot be negative.",
    );
  }

  if (targetClues < 0) {
    throw new Error(
      "Target Clues to trade cannot be negative.",
    );
  }

  if (targetTrainTickets < 0) {
    throw new Error(
      "Target Train Tickets to trade cannot be negative.",
    );
  }

  if (targetShipTickets < 0) {
    throw new Error(
      "Target Ship Tickets to trade cannot be negative.",
    );
  }

  /*
   * ==========================================================
   * RESOURCE VALIDATION
   * ==========================================================
   */

  if (
    clues >
    investigator.clues
  ) {
    throw new Error(
      "Investigator does not have enough Clues.",
    );
  }

  if (
    trainTickets >
    investigator.trainTickets
  ) {
    throw new Error(
      "Investigator does not have enough Train Tickets.",
    );
  }

  if (
    shipTickets >
    investigator.shipTickets
  ) {
    throw new Error(
      "Investigator does not have enough Ship Tickets.",
    );
  }

  if (
    targetClues >
    targetInvestigator.clues
  ) {
    throw new Error(
      "Target Investigator does not have enough Clues.",
    );
  }

  if (
    targetTrainTickets >
    targetInvestigator.trainTickets
  ) {
    throw new Error(
      "Target Investigator does not have enough Train Tickets.",
    );
  }

  if (
    targetShipTickets >
    targetInvestigator.shipTickets
  ) {
    throw new Error(
      "Target Investigator does not have enough Ship Tickets.",
    );
  }

  /*
   * ==========================================================
   * POSSESSION VALIDATION
   * ==========================================================
   *
   * Every selected card must actually belong to the
   * corresponding Investigator.
   */

  validateOwnedIds(
    assetIds,
    investigator.assetIds,
    "Asset",
    investigator.id,
  );

  validateOwnedIds(
    artifactIds,
    investigator.artifactIds,
    "Artifact",
    investigator.id,
  );

  validateOwnedIds(
    spellIds,
    investigator.spellIds,
    "Spell",
    investigator.id,
  );

  validateOwnedIds(
    targetAssetIds,
    targetInvestigator.assetIds,
    "Asset",
    targetInvestigator.id,
  );

  validateOwnedIds(
    targetArtifactIds,
    targetInvestigator.artifactIds,
    "Artifact",
    targetInvestigator.id,
  );

  validateOwnedIds(
    targetSpellIds,
    targetInvestigator.spellIds,
    "Spell",
    targetInvestigator.id,
  );

  /*
   * ==========================================================
   * AT LEAST ONE POSSESSION
   * ==========================================================
   */

  const hasMine =
    clues > 0 ||
    trainTickets > 0 ||
    shipTickets > 0 ||
    assetIds.length > 0 ||
    artifactIds.length > 0 ||
    spellIds.length > 0;

  const hasTheirs =
    targetClues > 0 ||
    targetTrainTickets > 0 ||
    targetShipTickets > 0 ||
    targetAssetIds.length > 0 ||
    targetArtifactIds.length > 0 ||
    targetSpellIds.length > 0;

  if (
    !hasMine &&
    !hasTheirs
  ) {
    throw new Error(
      "Trade must include at least one possession.",
    );
  }

  /*
   * ==========================================================
   * UPDATE ACTIVE INVESTIGATOR
   * ==========================================================
   */

  const investigatorAssetIds =
    removeIds(
      investigator.assetIds,
      assetIds,
    ).concat(
      targetAssetIds,
    );

  const investigatorArtifactIds =
    removeIds(
      investigator.artifactIds,
      artifactIds,
    ).concat(
      targetArtifactIds,
    );

  const investigatorSpellIds =
    removeIds(
      investigator.spellIds,
      spellIds,
    ).concat(
      targetSpellIds,
    );

  /*
   * ==========================================================
   * UPDATE TARGET INVESTIGATOR
   * ==========================================================
   */

  const targetAssetIdsUpdated =
    removeIds(
      targetInvestigator.assetIds,
      targetAssetIds,
    ).concat(
      assetIds,
    );

  const targetArtifactIdsUpdated =
    removeIds(
      targetInvestigator.artifactIds,
      targetArtifactIds,
    ).concat(
      artifactIds,
    );

  const targetSpellIdsUpdated =
    removeIds(
      targetInvestigator.spellIds,
      targetSpellIds,
    ).concat(
      spellIds,
    );

  /*
   * ==========================================================
   * RETURN UPDATED GAME
   * ==========================================================
   */

  return {
    ...game,

    investigators: {
      ...game.investigators,

      /*
       * --------------------------------------------------------
       * ACTIVE INVESTIGATOR
       * --------------------------------------------------------
       */

      [investigatorId]: {
        ...investigator,

        clues:
          investigator.clues -
          clues +
          targetClues,

        trainTickets:
          investigator.trainTickets -
          trainTickets +
          targetTrainTickets,

        shipTickets:
          investigator.shipTickets -
          shipTickets +
          targetShipTickets,

        assetIds:
          investigatorAssetIds,

        artifactIds:
          investigatorArtifactIds,

        spellIds:
          investigatorSpellIds,

        actionsPerformed: [
          ...investigator.actionsPerformed,
          "trade",
        ],
      },

      /*
       * --------------------------------------------------------
       * TARGET INVESTIGATOR
       * --------------------------------------------------------
       */

      [targetInvestigatorId]: {
        ...targetInvestigator,

        clues:
          targetInvestigator.clues -
          targetClues +
          clues,

        trainTickets:
          targetInvestigator.trainTickets -
          targetTrainTickets +
          trainTickets,

        shipTickets:
          targetInvestigator.shipTickets -
          targetShipTickets +
          shipTickets,

        assetIds:
          targetAssetIdsUpdated,

        artifactIds:
          targetArtifactIdsUpdated,

        spellIds:
          targetSpellIdsUpdated,
      },
    },
  };
}

/*
 * ============================================================
 * VALIDATE OWNED IDS
 * ============================================================
 */

function validateOwnedIds(
  selectedIds: string[],
  ownedIds: string[],
  type: string,
  investigatorId: string,
) {
  const uniqueIds =
    new Set(selectedIds);

  /*
   * Prevent duplicate IDs from being submitted.
   */

  if (
    uniqueIds.size !==
    selectedIds.length
  ) {
    throw new Error(
      `${type} selection contains duplicate IDs.`,
    );
  }

  /*
   * Every selected card must belong to
   * the Investigator.
   */

  for (
    const id of selectedIds
  ) {
    if (
      !ownedIds.includes(id)
    ) {
      throw new Error(
        `Investigator "${investigatorId}" does not own ${type} "${id}".`,
      );
    }
  }
}

/*
 * ============================================================
 * REMOVE IDS
 * ============================================================
 */

function removeIds(
  sourceIds: string[],
  idsToRemove: string[],
): string[] {
  if (
    idsToRemove.length === 0
  ) {
    return [
      ...sourceIds,
    ];
  }

  const removeSet =
    new Set(
      idsToRemove,
    );

  return sourceIds.filter(
    (id) =>
      !removeSet.has(id),
  );
}