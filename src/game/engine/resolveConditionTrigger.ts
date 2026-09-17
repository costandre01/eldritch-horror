import type { GameState } from "../models/GameState";

import type { ConditionTrigger } from "./ConditionTrigger";

import {
  getConditionTriggers,
} from "./getConditionTriggers";

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
      );

    currentGame =
      result.game;
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