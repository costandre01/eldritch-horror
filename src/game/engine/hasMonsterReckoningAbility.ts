import type { MonsterDefinition } from "../models/Monster";

export function hasMonsterReckoningAbility(
  definition: MonsterDefinition,
): boolean {
  return definition.specialAbilities.some(
    (ability) =>
      ability.type ===
        "roll-die-advance-doom" ||
      ability.type ===
        "move-to-nearest-investigator-and-encounter" ||
      ability.type ===
        "adjacent-investigators-lose-health-and-sanity" ||
      ability.type ===
        "discard-nearest-clue-and-move-to-space" ||
      ability.type ===
        "move-investigator-and-delay-or-move-toward-nearest" ||
      ability.type ===
        "roll-die-nearest-investigator-moves-toward" ||
      ability.type ===
        "recover-all-health" ||
      ability.type ===
        "roll-die-nearest-investigator-gains-condition" ||
      ability.type ===
        "cursed-investigators-lose-health" ||
      ability.type ===
        "each-investigator-on-space-lose-sanity" ||
      ability.type ===
        "each-investigator-on-space-lose-health" ||
      ability.type ===
        "discard-and-spawn-epic-monster" ||
      ability.type ===
        "roll-die-spawn-gate-if-at-most-investigators" ||

      ability.type ===
        "spawn-ghoul-on-space" ||

      ability.type ===
        "deep-one-ambush-nearest",
  );
}