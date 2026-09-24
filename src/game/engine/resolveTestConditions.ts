import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import type { TestResult } from "../models/TestResult";

import {
  getConditionTriggers,
} from "./getConditionTriggers";

import {
  resolveConditionFrontEffects,
} from "./resolveConditionFrontEffects";

export function resolveTestConditions(
  game: GameState,
  investigatorId: string,
  test: TestResult,
  map: MapDefinition,
): GameState {
  /*
   * Only failed tests can trigger
   * on-test-fail Conditions.
   */

  if (test.passed) {
    return game;
  }

  let currentGame = game;

  const triggers =
    getConditionTriggers(
      currentGame,
      investigatorId,
      "on-test-fail",
    );

  for (const triggerResult of triggers) {
    const effect =
      triggerResult.effect;

    /*
     * If the Condition specifies a skill,
     * it must match the failed test.
     */

    if (
      effect.type === "on-test-fail" &&
      effect.testType !== undefined &&
      effect.testType !== test.skill
    ) {
      continue;
    }

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
  }

  return currentGame;
}