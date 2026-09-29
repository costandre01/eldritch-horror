import { coreConditionDefinitions } from "../../content/core/coreConditions";
import type { Condition } from "../models/Condition";
import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import type { TestResult } from "../models/TestResult";
import type { ConditionFrontEffect } from "../models/ConditionDefinition/frontEffects";
import { canPerformAction } from "./canPerformAction";
import { performTest } from "./performTest";
import { resolveConditionFrontEffects } from "./resolveConditionFrontEffects";
import { isRestrictedByDetained } from "./conditionRestrictions";

export interface ConditionLocalAction {
  condition: Condition;
  conditionName: string;
  effect: Extract<ConditionFrontEffect, { type: "local-action-test" | "on-local-action-test" }>;
}

export function getConditionLocalActions(
  game: GameState,
  investigatorId: string,
): ConditionLocalAction[] {
  const investigator = game.investigators[investigatorId];
  if (!investigator) return [];

  const ownedConditions = investigator.conditionIds.flatMap((conditionId) => {
    const condition = game.conditions[conditionId];
    if (!condition || condition.flipped) return [];
    const definition = coreConditionDefinitions.find((candidate) => candidate.id === condition.definitionId);
    const effect = definition?.frontEffects.find(
      (frontEffect): frontEffect is ConditionLocalAction["effect"] =>
        frontEffect.type === "local-action-test" || frontEffect.type === "on-local-action-test",
    );
    return condition && definition && effect ? [{ condition, conditionName: definition.name, effect }] : [];
  });

  const detained = ownedConditions.find((entry) => entry.condition.definitionId === "condition-detained");
  return detained ? [detained] : ownedConditions;
}

export function hasDetainedActionRestriction(
  game: GameState,
  investigatorId: string,
): boolean {
  return isRestrictedByDetained(game, investigatorId);
}

export function startConditionLocalAction(
  game: GameState,
  conditionId: string,
  map: MapDefinition,
): { game: GameState; test: TestResult; effect: ConditionLocalAction["effect"] } {
  const investigatorId = game.activeInvestigatorId;
  if (!investigatorId) throw new Error("There is no active investigator.");
  if (game.phase !== "action") throw new Error("Condition Local Actions can only be performed during the Action phase.");

  const investigator = game.investigators[investigatorId];
  const condition = game.conditions[conditionId];
  if (!investigator) throw new Error(`Investigator "${investigatorId}" does not exist.`);
  if (investigator.travelActive) throw new Error("Finish the current travel before performing a Condition Local Action.");
  if (!condition || !investigator.conditionIds.includes(conditionId)) {
    throw new Error(`Condition "${conditionId}" is not owned by the active Investigator.`);
  }
  if (condition.flipped) throw new Error("A flipped Condition cannot perform its Local Action.");

  const definition = coreConditionDefinitions.find((candidate) => candidate.id === condition.definitionId);
  const effect = definition?.frontEffects.find(
    (frontEffect): frontEffect is ConditionLocalAction["effect"] =>
      frontEffect.type === "local-action-test" || frontEffect.type === "on-local-action-test",
  );
  if (!effect) throw new Error(`Condition "${conditionId}" has no Local Action test.`);

  const componentActionKey =
    `condition:${conditionId}:local-action`;

  if (
    investigator.componentActionsUsedThisRound?.includes(
      componentActionKey,
    )
  ) {
    throw new Error(
      "This Component Action was already used this round.",
    );
  }

  const available = getConditionLocalActions(game, investigatorId);
  if (!available.some((entry) => entry.condition.id === conditionId)) {
    throw new Error("Detained restricts the Investigator to its own Local Action.");
  }
  if (!canPerformAction(investigator, "component")) {
    throw new Error("Investigator cannot perform another action this round.");
  }

  const actionGame: GameState = {
    ...game,
    investigators: {
      ...game.investigators,
            [investigatorId]: {
        ...investigator,

        actionsPerformed: [
          ...investigator.actionsPerformed,
          "component",
        ],

        componentActionsUsedThisRound: [
          ...(investigator.componentActionsUsedThisRound ?? []),
          componentActionKey,
        ],
      },
    },
  };
  const result = performTest(actionGame, investigatorId, effect.testType, "modifier" in effect ? effect.modifier ?? 0 : 0, 1, map);
  return { game: result.game, test: result.test, effect };
}

export function resolveConditionLocalActionTest(
  game: GameState,
  investigatorId: string,
  conditionId: string,
  test: TestResult,
  map: MapDefinition,
): GameState {
  const condition = game.conditions[conditionId];
  const investigator = game.investigators[investigatorId];
  if (!condition || !investigator || !investigator.conditionIds.includes(conditionId)) return game;
  const definition = coreConditionDefinitions.find((candidate) => candidate.id === condition.definitionId);
  const effect = definition?.frontEffects.find(
    (frontEffect): frontEffect is ConditionLocalAction["effect"] =>
      frontEffect.type === "local-action-test" || frontEffect.type === "on-local-action-test",
  );
  if (!effect) return game;

  return resolveConditionFrontEffects(
    { ...game, lastTest: test },
    investigatorId,
    conditionId,
    effect,
    map,
    false,
    test,
  ).game;
}
