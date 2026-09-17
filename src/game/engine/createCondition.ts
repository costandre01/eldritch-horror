import type { Condition } from "../models/Condition";
import type { ConditionDefinition } from "../models/ConditionDefinition";

export function createCondition(
  definition: ConditionDefinition,
  instanceNumber: number,
  backId: string,
): Condition {
  const back =
    definition.backs.find(
      (item) => item.id === backId,
    );

  if (!back) {
    throw new Error(
      `Back "${backId}" does not exist for condition "${definition.id}".`,
    );
  }

  return {
    id: `${definition.id}-${String(
      instanceNumber,
    ).padStart(3, "0")}`,

    definitionId:
      definition.id,

    instanceNumber,

    frontImage:
      back.frontImage,

    backImage:
      back.backImage,

    backId,

    flipped: false,
  };
}