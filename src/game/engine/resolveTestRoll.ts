import type { GameState } from "../models/GameState";
import type { PendingDecision } from "../models/PendingDecision";
import type { TestResult } from "../models/TestResult";

import { rollTest } from "./rollTest";
import { getEffectiveSkill } from "./getEffectiveSkill";
import { getPassiveTestModifiers } from "./getPassiveTestModifiers";
import { getSuccessfulTestResults } from "./getSuccessfulTestResults";

export interface ResolveTestRollResult {
  game: GameState;
  testResult: TestResult;
  testDecision: Extract<
    PendingDecision,
    { type: "test" }
  >;
}

export function resolveTestRoll(
  game: GameState,
): ResolveTestRollResult {
  const decision =
    game.pendingDecision;

  if (
    !decision ||
    decision.type !== "test"
  ) {
    throw new Error(
      "There is no pending Test decision.",
    );
  }

  const investigator =
    game.investigators[
      decision.investigatorId
    ];

  if (!investigator) {
    throw new Error(
      `Investigator "${decision.investigatorId}" does not exist.`,
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
      decision.investigatorId,
      decision.skill,
      decision.source?.startsWith("combat:") && decision.source.includes("spell:")
        ? "combat-spell"
        : decision.source?.startsWith("combat:")
          ? "combat"
          : decision.source?.includes("spell:")
            ? "spell"
            : null,
    );

  const passiveModifiers = getPassiveTestModifiers(game, decision.investigatorId, {
    skill: decision.skill,
    combat: decision.source?.startsWith("combat:") ?? false,
    spell: decision.source?.includes("spell:") ?? false,
    acquireAssets: decision.source?.startsWith("acquire-assets") ?? false,
  });

  /*
   * ============================================================
   * ROLL TEST
   * ============================================================
   *
   * The actual dice calculation remains inside rollTest().
   */

  const testResult =
    rollTest(
      {
        ...investigator,

        skills: {
          ...investigator.skills,

          [decision.skill]:
            effectiveSkill,
        },
        improvementTokens: {},
      },
      decision.skill,
      decision.modifier + passiveModifiers.bonusDice,
      decision.minSuccesses ?? 1,
      {
        sixCountsAsTwo:
          passiveModifiers.sixCountsAsTwo,

        successfulResults:
          getSuccessfulTestResults(
            game,
            decision.investigatorId,
          ),
      },
    );

  /*
   * ============================================================
   * STORE TEST DECISION
   * ============================================================
   *
   * The original Test decision is returned separately because
   * React needs to keep it while the Dice Result modal is open.
   */

  const updatedGame: GameState = {
    ...game,

    /*
     * The Test decision is temporarily removed while
     * the dice result is displayed.
     */

    pendingDecision:
      null,

    lastTest:
      testResult,
  };

  return {
    game: updatedGame,
    testResult,
    testDecision: decision,
  };
}
