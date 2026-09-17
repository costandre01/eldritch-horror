import type { GameState } from "../models/GameState";
import type { Skill } from "../models/Investigator";
import type { TestResult } from "../models/TestResult";

import { rollTest } from "./rollTest";
import { resolveTestConditions } from "./resolveTestConditions";

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
   * ROLL TEST
   * ============================================================
   */

  const test = rollTest(
    investigator,
    skill,
    modifier,
    difficulty,
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
    );

  return {
    game: currentGame,
    test,
  };
}