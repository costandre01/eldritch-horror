import type {
  GameState,
} from "../models/GameState";

import {
  coreConditionDefinitions,
} from "../../content/core/coreConditions";

export function getSuccessfulTestResults(
  game: GameState,
  investigatorId: string,
): number[] {
  const investigator =
    game.investigators[
      investigatorId
    ];

  if (!investigator) {
    return [5, 6];
  }

  for (
    const conditionId of
    investigator.conditionIds
  ) {
    const condition =
      game.conditions[
        conditionId
      ];

    /*
     * Only the front side of a Condition
     * can provide frontEffects.
     *
     * Once the Condition has been flipped,
     * effects such as Blessed/Cursed test
     * modifiers no longer apply.
     */
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

    const modifier =
      definition.frontEffects.find(
        (effect) =>
          effect.type ===
          "modify-test-successes",
      );

    if (
      modifier?.type ===
      "modify-test-successes"
    ) {
      return [
        ...modifier.successfulResults,
      ];
    }
  }

  /*
   * Normal investigator:
   *
   * 5 and 6 are successes.
   */
  return [5, 6];
}