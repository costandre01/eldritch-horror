import type { GameState } from "../models/GameState";
import type { ConditionCategory } from "../models/ConditionDefinition";

import { coreConditionDefinitions } from "../../content/core/coreConditions";
import { drawCondition } from "./drawCondition";

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

  // An investigator cannot gain or choose to gain a second copy of the
  // same Condition, even if another physical copy is available.
  if (investigator.conditionIds.some(
    (conditionId) => game.conditions[conditionId]?.definitionId === definitionId,
  )) {
    return game;
  }

  const result =
    drawCondition(
      game,
      definitionId,
    );

  if (!result.conditionId) {
    return result.game;
  }

  const conditionIds = [
    ...investigator.conditionIds,
    result.conditionId,
  ];

  return {
    ...result.game,
    investigators: {
      ...result.game.investigators,
      [investigatorId]: {
        ...result.game.investigators[investigatorId],
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
  const investigator = game.investigators[investigatorId];
  if (!investigator) {
    throw new Error(`Investigator "${investigatorId}" does not exist.`);
  }
  const ownedDefinitionIds = new Set(
    investigator.conditionIds
      .map((conditionId) => game.conditions[conditionId]?.definitionId)
      .filter((id): id is string => id !== undefined),
  );

  const availableDefinitionIds =
    coreConditionDefinitions
      .filter(
        (definition) =>
          definition.category === category &&
          !ownedDefinitionIds.has(definition.id) &&
          game.board.conditionDeck.some(
            (conditionId) =>
              game.conditions[conditionId]?.definitionId ===
              definition.id,
          ),
      )
      .map(
        (definition) => definition.id,
      );

  if (availableDefinitionIds.length === 0) {
    return game;
  }

  const randomIndex = Math.floor(
    random() * availableDefinitionIds.length,
  );

  const definitionId =
    availableDefinitionIds[randomIndex];

  if (!definitionId) {
    return game;
  }

  return gainCondition(
    game,
    investigatorId,
    definitionId,
  );
}
