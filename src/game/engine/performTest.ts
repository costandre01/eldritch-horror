import type { GameState } from "../models/GameState";
import type { Skill } from "../models/Investigator";
import type { TestResult } from "../models/TestResult";

import { rollTest } from "./rollTest";
import { getEffectiveSkill } from "./getEffectiveSkill";
import { getPassiveTestModifiers, type PassiveTestContext } from "./getPassiveTestModifiers";
import { resolveTestConditions } from "./resolveTestConditions";
import type { MapDefinition } from "../models/MapDefinition";

export interface PerformTestResult {
  game: GameState;
  test: TestResult;
}

export function performTest(
  game: GameState,
  investigatorId: string,
  skill: Skill,
  modifier = 0,
  difficulty = 1,
  map: MapDefinition,
  context: Omit<PassiveTestContext, "skill"> = {},
): PerformTestResult {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * CALCULATE EFFECTIVE SKILL
   * ============================================================
   *
   * Includes:
   *
   * - Investigator base skill
   * - Passive Asset skill modifiers
   *
   */

  const effectiveSkill =
    getEffectiveSkill(
      game,
      investigatorId,
      skill,
      context.spell && context.combat
        ? "combat-spell"
        : context.spell
          ? "spell"
          : context.combat
            ? "combat"
            : null,
    );

  const passiveModifiers = getPassiveTestModifiers(game, investigatorId, {
    skill,
    ...context,
  });

  /*
   * ============================================================
   * ROLL TEST
   * ============================================================
   */

  const test = rollTest(
    {
      ...investigator,

      skills: {
        ...investigator.skills,

        [skill]: effectiveSkill,
      },
    },
    skill,
    modifier + passiveModifiers.bonusDice,
    difficulty,
    { sixCountsAsTwo: passiveModifiers.sixCountsAsTwo },
  );

  /*
   * ============================================================
   * SAVE TEST RESULT
   * ============================================================
   */

  let currentGame: GameState = {
    ...game,

    lastTest: test,
  };

  /*
   * ============================================================
   * RESOLVE CONDITION TRIGGERS
   * ============================================================
   *
   * Failed tests may trigger Conditions such as:
   *
   * on-test-fail
   */

  currentGame =
    resolveTestConditions(
      currentGame,
      investigatorId,
      test,
      map,
    );

  return {
    game: currentGame,
    test,
  };
}
