import type { GameState } from "../models/GameState";
import type { PendingDecision } from "../models/PendingDecision";
import type { TestResult } from "../models/TestResult";

import { rollTest } from "./rollTest";

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
   * ROLL TEST
   * ============================================================
   *
   * The actual dice calculation remains inside rollTest().
   */

  const testResult =
    rollTest(
      investigator,
      decision.skill,
      decision.modifier,
      1,
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