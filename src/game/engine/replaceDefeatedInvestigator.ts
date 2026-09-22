import type { GameState } from "../models/GameState";

import { coreInvestigators } from "../../content/core/investigators";

import { createInvestigator } from "./createInvestigator";

export function replaceDefeatedInvestigator(
  game: GameState,
  defeatedInvestigatorId: string,
  replacementDefinitionId: string,
): GameState {
  const defeatedInvestigator =
    game.investigators[
      defeatedInvestigatorId
    ];

  if (!defeatedInvestigator) {
    throw new Error(
      `Investigator "${defeatedInvestigatorId}" does not exist.`,
    );
  }

  if (!defeatedInvestigator.isDefeated) {
    throw new Error(
      `Investigator "${defeatedInvestigatorId}" is not defeated.`,
    );
  }

  const definition =
    coreInvestigators.find(
      (investigator) =>
        investigator.id ===
        replacementDefinitionId,
    );

  if (!definition) {
    throw new Error(
      `Investigator definition "${replacementDefinitionId}" does not exist.`,
    );
  }

  /*
   * A defeated Investigator cannot be selected again.
   */

  const definitionAlreadyInUse =
    Object.values(
      game.investigators,
    ).some(
      (investigator) =>
        investigator.definitionId ===
        definition.id,
    );

  if (definitionAlreadyInUse) {
    throw new Error(
      `Investigator "${definition.id}" is already in use.`,
    );
  }

  /*
   * ==========================================================
   * STARTING SPELLS
   * ==========================================================
   *
   * The InvestigatorDefinition contains Spell definition IDs.
   *
   * The live game, however, uses physical Spell instances
   * from BoardState.spellDeck.
   */

  const startingSpellIds: string[] = [];

  let spellDeck = [
    ...game.board.spellDeck,
  ];

  for (
    const spellDefinitionId of
      definition.startingSpellIds
  ) {
    const spellIndex =
      spellDeck.findIndex(
        (spell) =>
          spell.definitionId ===
          spellDefinitionId,
      );

    if (spellIndex === -1) {
      /*
       * No physical copy is currently
       * available.
       *
       * Do not create an invalid Spell ID.
       */
      continue;
    }

    const spell =
      spellDeck[spellIndex];

    if (!spell) {
      continue;
    }

    startingSpellIds.push(
      spell.id,
    );

    spellDeck =
      spellDeck.filter(
        (_, index) =>
          index !== spellIndex,
      );
  }

  /*
   * ==========================================================
   * CREATE NEW INVESTIGATOR
   * ==========================================================
   */

  const sameDefinitionCount =
    Object.values(
      game.investigators,
    ).filter(
      (investigator) =>
        investigator.definitionId ===
        definition.id,
    ).length;

  const newInvestigator =
    createInvestigator({
      definition,

      instanceNumber:
        sameDefinitionCount + 1,

      startingSpellIds,
    });

  /*
   * ==========================================================
   * ADD NEW INVESTIGATOR
   * ==========================================================
   *
   * Keep the defeated Investigator in the registry.
   *
   * This is important because several existing game flows
   * still use isDefeated to ignore that Investigator.
   */

  const investigators = {
    ...game.investigators,

    [newInvestigator.id]:
      newInvestigator,
  };

  /*
   * ==========================================================
   * REPLACE TURN ORDER POSITION
   * ==========================================================
   */

  const investigatorOrder =
    game.investigatorOrder.map(
      (investigatorId) =>
        investigatorId ===
        defeatedInvestigatorId
          ? newInvestigator.id
          : investigatorId,
    );

  return {
    ...game,

    investigators,

    investigatorOrder,

    board: {
      ...game.board,

      spellDeck,
    },

    activeInvestigatorId:
      newInvestigator.id,
  };
}