import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { coreConditionDefinitions } from "../../content/core/coreConditions";
import { resolveConditionFrontEffects } from "./resolveConditionFrontEffects";
import { showMythosContinue } from "./showMythosContinue";

export function resolveConditionReckoning(
  game: GameState,
  _map: MapDefinition,
): GameState {
  const decision = game.pendingDecision;

  if (
    !decision ||
    decision.type !== "mythos-condition-reckoning"
  ) {
    throw new Error(
      "There is no active Condition Reckoning decision.",
    );
  }

  /*
   * ============================================================
   * CURRENT INVESTIGATOR
   * ============================================================
   */

  const investigatorId =
    decision.investigatorIds[
      decision.currentInvestigatorIndex
    ];

  if (!investigatorId) {
    const gameWithoutDecision: GameState = {
      ...game,
      pendingDecision: null,
    };

    return showMythosContinue(
      gameWithoutDecision,
      decision.nextIconIndex,
    );
  }

  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  if (investigator.isDefeated) {
    const nextInvestigatorIndex =
      decision.currentInvestigatorIndex + 1;

    if (
      nextInvestigatorIndex >=
      decision.investigatorIds.length
    ) {
      const gameWithoutDecision: GameState = {
        ...game,
        pendingDecision: null,
      };

      return showMythosContinue(
        gameWithoutDecision,
        decision.nextIconIndex,
      );
    }

    return {
      ...game,
      pendingDecision: {
        ...decision,
        currentInvestigatorIndex:
          nextInvestigatorIndex,
        currentConditionIndex: 0,
      },
    };
  }

  /*
   * ============================================================
   * CURRENT CONDITION
   * ============================================================
   */

  const investigatorConditionIds =
    decision.conditionIds[
      decision.currentInvestigatorIndex
    ] ?? [];

  const conditionId =
    investigatorConditionIds[
      decision.currentConditionIndex
    ];

  /*
   * This investigator has no more Conditions.
   */

  if (!conditionId) {
    const nextInvestigatorIndex =
      decision.currentInvestigatorIndex + 1;

    if (
      nextInvestigatorIndex >=
      decision.investigatorIds.length
    ) {
      const gameWithoutDecision: GameState = {
        ...game,
        pendingDecision: null,
      };

      return showMythosContinue(
        gameWithoutDecision,
        decision.nextIconIndex,
      );
    }

    return {
      ...game,
      pendingDecision: {
        ...decision,
        currentInvestigatorIndex:
          nextInvestigatorIndex,
        currentConditionIndex: 0,
      },
    };
  }

  /*
   * ============================================================
   * CONDITION INSTANCE
   * ============================================================
   */

  const condition = game.conditions[conditionId];

  /*
   * The Condition may have been removed by
   * another effect.
   */

  if (!condition) {
    return {
      ...game,

      pendingDecision: {
        ...decision,

        currentConditionIndex:
          decision.currentConditionIndex + 1,
      },
    };
  }

  /*
   * ============================================================
   * CONDITION DEFINITION
   * ============================================================
   */

  const definition =
    coreConditionDefinitions.find(
      (conditionDefinition) =>
        conditionDefinition.id ===
        condition.definitionId,
    );

  if (!definition) {
    throw new Error(
      `Condition definition "${condition.definitionId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * FIND RECKONING EFFECT
   * ============================================================
   */

  const reckoningEffect =
    definition.frontEffects.find(
      (effect) =>
        effect.type === "on-reckoning",
    );

  /*
   * No Reckoning effect.
   *
   * Simply continue with the next Condition.
   */

  if (!reckoningEffect) {
    return {
      ...game,

      pendingDecision: {
        ...decision,

        currentConditionIndex:
          decision.currentConditionIndex + 1,
      },
    };
  }

  /*
   * ============================================================
   * RESOLVE RECKONING EFFECT
   * ============================================================
   */

  const result =
    resolveConditionFrontEffects(
      game,
      investigatorId,
      conditionId,
      reckoningEffect,
      _map,
      decision.treatDiceAsOne ?? false,
    );

  const resolvedGame =
    result.game;

  return {
    ...resolvedGame,

    pendingDecision: {
      ...decision,

      currentConditionIndex:
        decision.currentConditionIndex + 1,
    },
  };
}