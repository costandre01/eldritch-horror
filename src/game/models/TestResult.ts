import type { Skill } from "./Investigator";

export interface TestResult {
  skill: Skill;

  modifier: number;

  difficulty: number;

  diceRolled: number;

  results: number[];

  successes: number;

  passed: boolean;
}