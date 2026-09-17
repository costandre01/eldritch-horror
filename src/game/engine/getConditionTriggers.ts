import type { GameState } from "../models/GameState";

import {
  coreConditionDefinitions,
} from "../../content/core/coreConditions";

import type {
  ConditionFrontEffect,
} from "../models/ConditionDefinition/frontEffects";

import type { ConditionTrigger } from "./ConditionTrigger";

export interface ConditionTriggerResult {
  conditionId: string;
  effect: ConditionFrontEffect;
}

export function getConditionTriggers(
  game: GameState,
  investigatorId: string,
  trigger: ConditionTrigger,
): ConditionTriggerResult[] {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  const results: ConditionTriggerResult[] =
    [];

  /*
   * ============================================================
   * ACTIVE CONDITIONS
   * ============================================================
   */

  for (
    const conditionId of investigator.conditionIds
  ) {
    const condition =
      game.conditions[conditionId];

    if (!condition) {
      continue;
    }

    /*
     * Front triggers only apply while the
     * Condition is on its front.
     */

    if (condition.flipped) {
      continue;
    }

    const definition =
      coreConditionDefinitions.find(
        (item) =>
          item.id ===
          condition.definitionId,
      );

    if (!definition) {
      continue;
    }

    for (
      const effect of definition.frontEffects
    ) {
      if (effect.type !== trigger) {
        continue;
      }

      results.push({
        conditionId,
        effect,
      });
    }
  }

  return results;
}