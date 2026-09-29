import type { GameState } from "../models/GameState";
import type { ConditionCategory } from "../models/ConditionDefinition";

import { coreConditionDefinitions } from "../../content/core/coreConditions";
import { drawCondition } from "./drawCondition";
import { discardCondition } from "./discardCondition";

export function gainCondition(
  game: GameState,
  investigatorId: string,
  definitionId: string,
): GameState {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * EXISTING CONDITION REPLACEMENT EFFECTS
   * ============================================================
   *
   * Some Conditions replace the effect of gaining another
   * Condition.
   *
   * Blessed / Cursed are the main examples:
   *
   * - Blessed + gain Blessed -> flip Blessed instead
   * - Blessed + gain Cursed  -> discard Blessed instead
   * - Cursed  + gain Cursed  -> flip Cursed instead
   * - Cursed  + gain Blessed -> discard Cursed instead
   *
   * The new Condition is not drawn when one of these replacement
   * effects applies.
   */

  for (
    const conditionId of
    investigator.conditionIds
  ) {
    const condition =
      game.conditions[conditionId];

    if (
      !condition ||
      condition.flipped
    ) {
      continue;
    }

    const definition =
      coreConditionDefinitions.find(
        (candidate) =>
          candidate.id ===
          condition.definitionId,
      );

    if (!definition) {
      continue;
    }

    const replacementEffect =
      definition.frontEffects.find(
        (effect) =>
          effect.type ===
            "replace-gain-condition" &&
          effect.conditionDefinitionId ===
            definitionId,
      );

    if (
      !replacementEffect ||
      replacementEffect.type !==
        "replace-gain-condition"
    ) {
      continue;
    }

    /*
     * ----------------------------------------------------------
     * FLIP EXISTING CONDITION
     * ----------------------------------------------------------
     */

    const flipsSelf =
      replacementEffect.effects.some(
        (effect) =>
          effect.type ===
          "flip-self",
      );

    if (flipsSelf) {
      return {
        ...game,

        conditions: {
          ...game.conditions,

          [conditionId]: {
            ...condition,
            flipped: true,
          },
        },
      };
    }

    /*
     * ----------------------------------------------------------
     * DISCARD EXISTING CONDITION
     * ----------------------------------------------------------
     */

    const discardsSelf =
      replacementEffect.effects.some(
        (effect) =>
          effect.type ===
          "discard-self",
      );

    if (discardsSelf) {
      return discardCondition(
        game,
        investigatorId,
        conditionId,
      );
    }
  }

  /*
   * ============================================================
   * DUPLICATE CONDITION
   * ============================================================
   *
   * If no replacement effect handled the gain above, an
   * investigator cannot gain another copy of a Condition
   * that they already have.
   */

  const alreadyHasCondition =
    investigator.conditionIds.some(
      (conditionId) =>
        game.conditions[conditionId]
          ?.definitionId ===
        definitionId,
    );

  if (alreadyHasCondition) {
    return game;
  }

  /*
   * ============================================================
   * DRAW CONDITION
   * ============================================================
   */

  const result =
    drawCondition(
      game,
      definitionId,
    );

  if (!result.conditionId) {
    return result.game;
  }

  /*
   * ============================================================
   * GIVE CONDITION TO INVESTIGATOR
   * ============================================================
   */

  const conditionIds = [
    ...investigator.conditionIds,
    result.conditionId,
  ];

  return {
    ...result.game,

    investigators: {
      ...result.game.investigators,

      [investigatorId]: {
        ...result.game.investigators[
          investigatorId
        ],

        conditionIds,
      },
    },
  };
}

export function gainConditionByCategory(
  game: GameState,
  investigatorId: string,
  category: ConditionCategory,
  random: () => number = Math.random,
): GameState {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * OWNED CONDITIONS
   * ============================================================
   */

  const ownedDefinitionIds =
    new Set(
      investigator.conditionIds
        .map(
          (conditionId) =>
            game.conditions[conditionId]
              ?.definitionId,
        )
        .filter(
          (id): id is string =>
            id !== undefined,
        ),
    );

  /*
   * ============================================================
   * AVAILABLE CONDITIONS
   * ============================================================
   */

  const availableDefinitionIds =
    coreConditionDefinitions
      .filter(
        (definition) =>
          definition.category ===
            category &&
          !ownedDefinitionIds.has(
            definition.id,
          ) &&
          game.board.conditionDeck.some(
            (conditionId) =>
              game.conditions[
                conditionId
              ]?.definitionId ===
              definition.id,
          ),
      )
      .map(
        (definition) =>
          definition.id,
      );

  if (
    availableDefinitionIds.length === 0
  ) {
    return game;
  }

  /*
   * ============================================================
   * RANDOM CONDITION
   * ============================================================
   */

  const randomIndex =
    Math.floor(
      random() *
        availableDefinitionIds.length,
    );

  const definitionId =
    availableDefinitionIds[
      randomIndex
    ];

  if (!definitionId) {
    return game;
  }

  return gainCondition(
    game,
    investigatorId,
    definitionId,
  );
}