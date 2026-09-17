import type { Condition } from "../../game/models/Condition";

import { createCondition } from "../../game/engine/createCondition";

import {
  coreConditionDefinitions,
} from "./coreConditions";

export const coreConditionCards: Condition[] =
  coreConditionDefinitions.flatMap(
    (definition) =>
      definition.backs.map(
        (back, index) =>
          createCondition(
            definition,
            index + 1,
            back.id,
          ),
      ),
  );