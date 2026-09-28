import type { SpellDefinition } from "../models/SpellDefinition";
import type { SpellBackEffect } from "../models/SpellDefinition/backEffects";
import type { TestResult } from "../models/TestResult";

function branchMatches(
  branch: { exact?: number; min?: number; max?: number },
  successes: number,
) {
  if (branch.exact !== undefined) return successes === branch.exact;
  return (branch.min === undefined || successes >= branch.min)
    && (branch.max === undefined || successes <= branch.max);
}

function preventionOnBack(
  effects: SpellBackEffect[],
  stat: "health" | "sanity",
  successes: number,
): number {
  const type = stat === "health" ? "prevent-health-loss" : "prevent-sanity-loss";
  let prevented = 0;
  for (const effect of effects) {
    if (effect.type === type) {
      prevented += effect.amount === "test-result" ? successes : effect.amount;
    } else if (effect.type === "resolve-by-test-result") {
      const branch = effect.results.find((candidate) => branchMatches(candidate, successes));
      if (branch) prevented += preventionOnBack(branch.effects, stat, successes);
    }
  }
  return prevented;
}

/** Returns all prevention granted by the front and the physical card back. */
export function getSpellLossPrevention(
  definition: SpellDefinition,
  backId: string,
  effectIndex: number,
  stat: "health" | "sanity",
  test: TestResult,
): number {
  if (!test.passed) return 0;
  const front = definition.frontEffects[effectIndex];
  const type = stat === "health" ? "prevent-health-loss" : "prevent-sanity-loss";
  const frontAmount = front && (front.type === "on-health-loss" || front.type === "on-sanity-loss")
    ? front.onSuccess.reduce((total, effect) =>
        effect.type === type ? total + effect.amount : total, 0)
    : 0;
  const back = definition.backs.find((candidate) => candidate.id === backId);
  return frontAmount + (back ? preventionOnBack(back.effects, stat, test.successes) : 0);
}
