import type {
  Investigator,
  Skill,
} from "../models/Investigator";

import type { TestResult } from "../models/TestResult";

export function rollTest(
  investigator: Investigator,
  skill: Skill,
  modifier = 0,
  difficulty = 1,
): TestResult {
  const skillValue =
    investigator.skills[skill];

  const diceRolled = Math.max(
    0,
    skillValue + modifier,
  );

  const results: number[] = [];

  let successes = 0;

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

    if (roll >= 5) {
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
  };
}