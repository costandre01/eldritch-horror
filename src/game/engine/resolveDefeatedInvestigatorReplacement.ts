import { coreInvestigators } from "../../content/core/investigators";

import type { GameState } from "../models/GameState";

import { createInvestigator } from "./createInvestigator";

function getAvailableInvestigatorIds(
  game: GameState,
): string[] {
  return coreInvestigators
    .filter(
      (definition) =>
        !Object.values(
          game.investigators,
        ).some(
          (investigator) =>
            investigator.definitionId ===
            definition.id,
        ),
    )
    .map(
      (definition) =>
        definition.id,
    );
}

function getNextReplacementDecision(
  game: GameState,
): GameState {
  const defeatedInvestigatorId =
    game.pendingInvestigatorReplacements[0];

  if (!defeatedInvestigatorId) {
    /*
     * All replacements are complete.
     *
     * The existing Mythos flow will now choose
     * the Lead Investigator.
     */
    const selectableInvestigatorIds =
      game.investigatorOrder.filter(
        (investigatorId) => {
          const investigator =
            game.investigators[
              investigatorId
            ];

          return (
            investigator &&
            !investigator.isDefeated &&
            investigatorId !==
              game.leadInvestigatorId
          );
        },
      );

    /*
     * Solo / only active Investigator.
     */
    if (
      selectableInvestigatorIds.length ===
      0
    ) {
      const currentLead =
        game.leadInvestigatorId;

      if (!currentLead) {
        throw new Error(
          "There is no Lead Investigator after Investigator replacement.",
        );
      }

      /*
       * We deliberately do not start the next
       * round here yet.
       *
       * The normal end-of-Mythos flow should
       * handle that transition.
       */
      return {
        ...game,
        pendingDecision: {
          type: "select-investigator",

          title:
            "Choose Lead Investigator",

          message:
            "Choose which investigator receives the Lead Investigator token for the next round.",

          investigatorIds: [
            currentLead,
          ],

          source:
            "mythos:end-lead",
        },
      };
    }

    return {
      ...game,

      pendingDecision: {
        type: "select-investigator",

        title:
          "Choose Lead Investigator",

        message:
          "Choose which investigator receives the Lead Investigator token for the next round.",

        investigatorIds:
          selectableInvestigatorIds,

        source:
          "mythos:end-lead",
      },
    };
  }

  const availableInvestigatorIds =
    getAvailableInvestigatorIds(
      game,
    );

  if (
    availableInvestigatorIds.length ===
    0
  ) {
    return {
      ...game,

      status: "defeat",

      activeInvestigatorId:
        null,

      pendingDecision:
        null,
    };
  }

  return {
    ...game,

    activeInvestigatorId:
      null,

    pendingDecision: {
      type: "select-investigator",

      title:
        "Choose a New Investigator",

      message:
        "Your Investigator was defeated. Choose a new Investigator.",

      investigatorIds:
        availableInvestigatorIds,

      source:
        `mythos:defeated-replacement:${defeatedInvestigatorId}`,
    },
  };
}

export function resolveDefeatedInvestigatorReplacement(
  game: GameState,
  investigatorDefinitionId: string,
  defeatedInvestigatorId: string,
): GameState {
  /*
   * ==========================================================
   * VALIDATION
   * ==========================================================
   */

  if (
    !game.pendingInvestigatorReplacements.includes(
      defeatedInvestigatorId,
    )
  ) {
    throw new Error(
      `Investigator "${defeatedInvestigatorId}" is not waiting for replacement.`,
    );
  }

  const definition =
    coreInvestigators.find(
      (item) =>
        item.id ===
        investigatorDefinitionId,
    );

  if (!definition) {
    throw new Error(
      `Investigator definition "${investigatorDefinitionId}" does not exist.`,
    );
  }

  /*
   * The chosen Investigator must still be unused.
   */

  const alreadyUsed =
    Object.values(
      game.investigators,
    ).some(
      (investigator) =>
        investigator.definitionId ===
        definition.id,
    );

  if (alreadyUsed) {
    throw new Error(
      `Investigator "${definition.id}" has already been used.`,
    );
  }

  /*
   * ==========================================================
   * CREATE NEW INVESTIGATOR
   * ==========================================================
   */

  const newInvestigator =
    createInvestigator({
      definition,

      instanceNumber: 1,

      /*
       * Starting spells are assigned below from
       * the physical Spell cards actually available.
       */
      startingSpellIds: [],
    });

  /*
   * ==========================================================
   * STARTING ASSETS
   * ==========================================================
   *
   * Find the physical starting Asset in:
   *
   *   reserve
   *   deck
   *   discard
   *
   * If the physical card is unavailable because it is
   * being held by another Investigator, the new
   * Investigator simply does not receive it.
   */

  let assetReserve =
    [...game.board.assetReserve];

  let assetDeck =
    [...game.board.assetDeck];

  let assetDiscard =
    [...game.board.assetDiscard];

  const startingAssetIds: string[] = [];

  for (
    const startingAssetId of
    definition.startingAssetIds
  ) {
    let assetIndex =
      assetReserve.findIndex(
        (asset) =>
          asset.id ===
          startingAssetId,
      );

    if (assetIndex >= 0) {
      const asset =
        assetReserve[assetIndex];

      assetReserve =
        assetReserve.filter(
          (_, index) =>
            index !== assetIndex,
        );

      startingAssetIds.push(
        asset.id,
      );

      continue;
    }

    assetIndex =
      assetDeck.findIndex(
        (asset) =>
          asset.id ===
          startingAssetId,
      );

    if (assetIndex >= 0) {
      const asset =
        assetDeck[assetIndex];

      assetDeck =
        assetDeck.filter(
          (_, index) =>
            index !== assetIndex,
        );

      startingAssetIds.push(
        asset.id,
      );

      continue;
    }

    assetIndex =
      assetDiscard.findIndex(
        (asset) =>
          asset.id ===
          startingAssetId,
      );

    if (assetIndex >= 0) {
      const asset =
        assetDiscard[assetIndex];

      assetDiscard =
        assetDiscard.filter(
          (_, index) =>
            index !== assetIndex,
        );

      startingAssetIds.push(
        asset.id,
      );
    }
  }

  /*
   * ==========================================================
   * STARTING SPELLS
   * ==========================================================
   *
   * A Spell is a physical card instance.
   *
   * Prefer the Spell deck, then the discard pile.
   */

  let spellDeck =
    [...game.board.spellDeck];

  let spellDiscard =
    [...game.board.spellDiscard];

  const startingSpellIds: string[] =
    [];

  for (
    const startingSpellDefinitionId of
    definition.startingSpellIds
  ) {
    const spellIndex =
      spellDeck.findIndex(
        (spell) =>
          spell.definitionId ===
          startingSpellDefinitionId,
      );

    if (spellIndex >= 0) {
      const spell =
        spellDeck[spellIndex];

      spellDeck =
        spellDeck.filter(
          (_, index) =>
            index !== spellIndex,
        );

      startingSpellIds.push(
        spell.id,
      );

      continue;
    }

    const discardIndex =
      spellDiscard.findIndex(
        (spell) =>
          spell.definitionId ===
          startingSpellDefinitionId,
      );

    if (discardIndex >= 0) {
      const spell =
        spellDiscard[discardIndex];

      spellDiscard =
        spellDiscard.filter(
          (_, index) =>
            index !== discardIndex,
        );

      startingSpellIds.push(
        spell.id,
      );
    }
  }

  /*
   * Create the final Investigator with the
   * physical possessions actually obtained.
   */

  const investigator = {
    ...newInvestigator,

    assetIds:
      startingAssetIds,

    spellIds:
      startingSpellIds,
  };

  /*
   * ==========================================================
   * UPDATE INVESTIGATORS
   * ==========================================================
   */

  const investigators = {
    ...game.investigators,

    [investigator.id]:
      investigator,
  };

  /*
   * ==========================================================
   * UPDATE INVESTIGATOR ORDER
   * ==========================================================
   *
   * The defeated Investigator remains in the registry
   * for the record, but is removed from the active order.
   *
   * The replacement takes that position.
   */

  const defeatedIndex =
    game.investigatorOrder.indexOf(
      defeatedInvestigatorId,
    );

  const investigatorOrder =
    game.investigatorOrder.filter(
      (id) =>
        id !==
        defeatedInvestigatorId,
    );

  if (defeatedIndex >= 0) {
    investigatorOrder.splice(
      Math.min(
        defeatedIndex,
        investigatorOrder.length,
      ),
      0,
      investigator.id,
    );
  } else {
    investigatorOrder.push(
      investigator.id,
    );
  }

  /*
   * ==========================================================
   * REMOVE REPLACED INVESTIGATOR FROM QUEUE
   * ==========================================================
   */

  const pendingInvestigatorReplacements =
    game.pendingInvestigatorReplacements.filter(
      (id) =>
        id !==
        defeatedInvestigatorId,
    );

  const updatedGame: GameState = {
    ...game,

    investigators,

    investigatorOrder,

    pendingInvestigatorReplacements,

    board: {
      ...game.board,

      assetReserve,

      assetDeck,

      assetDiscard,

      spellDeck,

      spellDiscard,
    },

    activeInvestigatorId:
      null,

    pendingDecision:
      null,
  };

  /*
   * ==========================================================
   * NEXT STEP
   * ==========================================================
   *
   * If another Investigator was defeated at the
   * same time, choose that replacement first.
   *
   * Otherwise continue to Lead selection.
   */

  return getNextReplacementDecision(
    updatedGame,
  );
}