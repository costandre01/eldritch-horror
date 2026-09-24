import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import type { ConditionTrigger } from "./ConditionTrigger";

import {
  getConditionTriggers,
} from "./getConditionTriggers";
import { resolveCondition } from "./resolveCondition";

import {
  resolveConditionFrontEffects,
} from "./resolveConditionFrontEffects";

export interface ResolveConditionTriggerResult {
  game: GameState;

  optionalConditionIds: string[];

  preventsEncounter: boolean;
}

export function resolveConditionTrigger(
  game: GameState,
  investigatorId: string,
  trigger: ConditionTrigger,
  map: MapDefinition,
): ResolveConditionTriggerResult {
  let currentGame = game;

  const triggers =
    getConditionTriggers(
      currentGame,
      investigatorId,
      trigger,
    );

  const optionalConditionIds: string[] =
    [];

  let preventsEncounter = false;

  /*
   * ============================================================
   * RESOLVE TRIGGERS
   * ============================================================
   */

  for (const triggerResult of triggers) {
    const effect =
      triggerResult.effect;

    /*
     * ==========================================================
     * OPTIONAL REST
     * ==========================================================
     *
     * Optional Rest effects are not resolved
     * automatically.
     */

    if (
      effect.type === "on-rest" &&
      effect.optional
    ) {
      optionalConditionIds.push(
        triggerResult.conditionId,
      );

      continue;
    }

    /*
     * ==========================================================
     * ENCOUNTER REPLACEMENT
     * ==========================================================
     *
     * Some Conditions say:
     *
     * "Instead of resolving an encounter,
     *  flip this card."
     *
     * These Conditions prevent the normal
     * Encounter from being resolved.
     */

    if (
      trigger === "on-encounter" &&
      effect.type === "on-encounter" &&
      effect.preventsEncounter
    ) {
      preventsEncounter = true;
    }

    /*
     * ==========================================================
     * AUTOMATIC TRIGGER
     * ==========================================================
     */

    const result =
      resolveConditionFrontEffects(
        currentGame,
        investigatorId,
        triggerResult.conditionId,
        effect,
        map,
      );

    currentGame =
      result.game;

    /*
    * Detained replaces the normal Encounter.
    * After the front of the card flips,
    * immediately resolve its selected back.
    */
    if (
      trigger === "on-encounter" &&
      currentGame.conditions[
        triggerResult.conditionId
      ]?.definitionId === "condition-detained" &&
      currentGame.conditions[
        triggerResult.conditionId
      ]?.flipped
    ) {
      preventsEncounter = true;

      currentGame = resolveCondition(
        currentGame,
        investigatorId,
        triggerResult.conditionId,
      );

      break;
    }
  }

  /*
   * ============================================================
   * RETURN
   * ============================================================
   */

  return {
    game: currentGame,

    optionalConditionIds,

    preventsEncounter,
  };
}