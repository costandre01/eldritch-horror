import type { MonsterSpecialAbility } from "../models/Monster";

export function getMonsterAbilityText(
  ability: MonsterSpecialAbility,
): string {
  switch (ability.type) {
    case "none":
      return "";

    case "lose-sanity-to-ancient-one":
      return "If you lose Sanity from the Will test, place the lost Sanity on the Ancient One sheet.";

    case "deep-one-ambush-nearest":
      return "A Deep One Monster ambushes the nearest investigator.";

    case "roll-die-spawn-gate-if-at-most-investigators":
      return "Roll 1 die. If the result is less than or equal to the number of Investigators, spawn 1 Gate.";

    case "spawn-ghoul-on-space":
      return "Spawn 1 Ghoul Monster on this space.";

    case "cannot-lose-health-until-mysteries-solved":
      return `This Monster cannot lose Health unless ${ability.mysteriesRequired} Mysteries have been solved.`;

    case "if-fail-will-skip-strength":
      return "If you fail the Will test, do not resolve the Strength test.";

    case "cannot-spend-clues-to-reroll":
      return "Clues cannot be spent to reroll dice during this Combat Encounter.";

    case "lose-health-and-sanity-unless-spend-clue":
      return "Before resolving the Will test, lose 1 Health and 1 Sanity unless you spend 1 Clue.";

    case "lose-health-from-strength-discard-ally":
      return "If you lose Health from the Strength test, discard 1 Ally Asset.";

    case "roll-die-advance-doom":
      return "During Reckoning, roll 1 die. On a 1 or 2, advance Doom by 1.";

    case "defeat-move-instead-of-encounter":
      return "If you defeat this Monster, you may lose 1 Sanity and move 3 spaces instead of resolving another encounter.";

    case "spawn-move-to-space":
      return `When this Monster is spawned, move it to ${ability.spaceId}.`;

    case "after-will-roll-die-defeat-on-5-6":
      return "After resolving the Will test, roll 1 die. On a 5 or 6, defeat this Monster.";

    case "pass-will-damage-monster-by-test-result":
      return "If you pass the Will test, this Monster loses Health equal to the test result.";

    case "lose-health-from-strength-gain-condition":
      return `If you lose Health from the Strength test, gain a Condition.`;

    case "gain-condition":
      return `Gain the specified Condition.`;

    case "defeat-gain-condition":
      return `If you defeat this Monster, gain the specified Condition.`;

    case "use-ancient-one-cultist":
      return "Use the Cultist statistics and abilities shown on the Ancient One sheet.";

    case "defeat-no-additional-encounter":
      return "If you defeat this Monster, you do not resolve an additional encounter.";

    case "move-to-nearest-investigator-and-encounter":
      return "Move this Monster to the nearest space containing an investigator. Then an investigator on that space immediately encounters it.";

    case "adjacent-investigators-lose-health-and-sanity":
      return `Each investigator on this space or an adjacent space loses ${ability.health} Health and ${ability.sanity} Sanity.`;

    case "fail-strength-discard-ally-instead-of-health":
      return "If you fail the Strength test, you may discard 1 Ally Asset instead of losing Health.";

    case "defeat-gain-asset":
      return "If you defeat this Monster, gain the specified Asset.";

    case "discard-nearest-clue-and-move-to-space":
      return "Discard the nearest Clue and move this Monster to that space.";

    case "defeat-gain-artifact":
      return "If you defeat this Monster, gain 1 Artifact.";

    case "move-investigator-and-delay-or-move-toward-nearest":
      return "If an investigator is on this Monster's space, move both 1 space and delay the investigator. Otherwise, move this Monster 2 spaces toward the nearest investigator.";

    case "attempt-disperse-mob-before-combat":
      return `Before resolving the Strength test, you may attempt to disperse the mob with an Influence ${ability.modifier}. If you pass, defeat this Monster.`;

    case "roll-die-nearest-investigator-moves-toward":
      return "During Reckoning, roll 1 die. On a 1 or 2, the nearest investigator moves 1 space toward this Monster.";

    case "recover-all-health":
      return "During Reckoning, this Monster recovers all Health.";

    case "defeat-recover-sanity":
      return `If you defeat this Monster, recover ${ability.amount} Sanity.`;

    case "lose-health-from-strength-recover-health":
      return `If you lose Health from the Strength test and this Monster is not defeated, it recovers ${ability.amount} Health.`;

    case "fail-will-lose-health":
      return `If you fail the Will test, lose ${ability.amount} Health.`;

    case "roll-die-nearest-investigator-gains-condition":
      return "During Reckoning, roll 1 die. On a 1 or 2, the nearest investigator gains the specified Condition.";

    case "fail-will-gain-condition":
      return "If you fail the Will test, gain the specified Condition.";

    case "cursed-investigators-lose-health":
      return `During Reckoning, each investigator with a Cursed Condition loses ${ability.amount} Health.`;

    case "spawn-lead-investigator-gains-condition":
      return "When this Monster is spawned, the Lead Investigator gains the specified Condition.";

    case "defeat-investigator-discard-condition":
      return "When this Monster is defeated, an investigator may discard the specified Condition.";

    case "discard-and-spawn-epic-monster":
      return "During Reckoning, discard this Monster and spawn the specified Epic Monster on this space.";

    case "each-investigator-on-space-lose-sanity":
      return `During Reckoning, each investigator on this space loses ${ability.amount} Sanity.`;

    case "lose-health-from-strength":
      return "If you lose Health from the Strength test, resolve the specified effects.";

    case "each-investigator-on-space-lose-health":
      return `During Reckoning, each investigator on this space loses ${ability.amount} Health.`;

    default: {
      const exhaustiveCheck: never = ability;
      return exhaustiveCheck;
    }
  }
}