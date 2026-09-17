import { coreConditionDefinitions } from "../../content/core/coreConditions";
import type { Condition } from "../models/Condition";
import type { ConditionCategory } from "../models/ConditionDefinition";
import type { GameState } from "../models/GameState";

export function getInvestigatorConditions(
  game: GameState,
  investigatorId: string,
): Condition[] {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  return investigator.conditionIds
    .map(
      (conditionId) =>
        game.conditions[conditionId],
    )
    .filter(
      (
        condition,
      ): condition is Condition =>
        condition !== undefined,
    );
}

export function getInvestigatorConditionsByCategory(
  game: GameState,
  investigatorId: string,
  category: ConditionCategory,
): Condition[] {
  const conditions =
    getInvestigatorConditions(
      game,
      investigatorId,
    );

  return conditions.filter(
    (condition) => {
      const definition =
        coreConditionDefinitions.find(
          (definition) =>
            definition.id ===
            condition.definitionId,
        );

      return definition?.category === category;
    },
  );
}