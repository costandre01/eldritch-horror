import type {
  Investigator,
  Skill,
} from "../models/Investigator";

import type { TestResult } from "../models/TestResult";

import {
  getImprovedSkillValue,
} from "./improvementEngine";

export interface RollTestOptions {
  sixCountsAsTwo?: boolean;

  /*
   * Dice results that count as successes.
   *
   * Normal:
   *   5, 6
   *
   * Blessed:
   *   4, 5, 6
   *
   * Cursed:
   *   6
   */
  successfulResults?: number[];
}

export function rollTest(
  investigator: Investigator,
  skill: Skill,
  modifier = 0,
  difficulty = 1,
  options: RollTestOptions = {},
): TestResult {
  const skillValue =
    getImprovedSkillValue(
      investigator,
      skill,
    );

  const diceRolled = Math.max(
    1,
    skillValue + modifier,
  );

  const results: number[] = [];

  let successes = 0;

  const successfulResults =
    options.successfulResults ??
    [5, 6];

  for (
    let index = 0;
    index < diceRolled;
    index++
  ) {
    const roll =
      Math.floor(
        Math.random() * 6,
      ) + 1;

    results.push(roll);

    if (
      successfulResults.includes(
        roll,
      )
    ) {
      successes++;
    }

    /*
     * Some effects make a 6 count as
     * two successes.
     *
     * The first success has already
     * been counted above, so add only
     * the additional success here.
     */
    if (
      roll === 6 &&
      options.sixCountsAsTwo &&
      successfulResults.includes(6)
    ) {
      successes++;
    }
  }

  return {
    skill,
    modifier,
    difficulty,
    diceRolled,
    results,
    successes,
    passed:
      successes >= difficulty,
    sixCountsAsTwo:
      options.sixCountsAsTwo,
  };
}