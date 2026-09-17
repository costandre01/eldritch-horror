import type {
  Monster,
  MonsterDefinition,
} from "../models/Monster";

export function createMonster(
  definition: MonsterDefinition,
  instanceNumber: number,
): Monster {
  if (instanceNumber < 1) {
    throw new Error(
      "Monster instance number must be at least 1.",
    );
  }

  if (
    !definition.epic &&
    instanceNumber > definition.quantity
  ) {
    throw new Error(
      `Cannot create Monster "${definition.id}" instance ${instanceNumber}. The definition only contains ${definition.quantity} physical copies.`,
    );
  }

  return {
    id: `${definition.id}-${instanceNumber}`,

    definitionId: definition.id,

    /*
     * A Monster in the Cup has not entered combat yet.
     */
    health: 0,

    spaceId: null,

    engagedInvestigatorId: null,

    isEpic: definition.epic,
  };
}