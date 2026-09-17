import type {
  MonsterDefinition,
  MonsterSpecialAbility,
} from "../models/Monster";

/*
 * ============================================================
 * COMBAT START
 * ============================================================
 *
 * Abilities that happen before the Horror Test.
 */

export function getMonsterCombatStartAbility(
  definition: MonsterDefinition,
): MonsterSpecialAbility | null {
  const ability =
    definition.specialAbilities.find(
      (ability) =>
        ability.type ===
          "attempt-disperse-mob-before-combat" ||
        ability.type ===
          "lose-health-and-sanity-unless-spend-clue",
    );

  return ability ?? null;
}

/*
 * ============================================================
 * HORROR RESULT
 * ============================================================
 *
 * Abilities that depend on the result of the Will/Horror Test.
 */

export function getMonsterHorrorResultAbilities(
  definition: MonsterDefinition,
): MonsterSpecialAbility[] {
  return definition.specialAbilities.filter(
    (ability) =>
      ability.type ===
        "lose-sanity-to-ancient-one" ||
      ability.type ===
        "after-will-roll-die-defeat-on-5-6" ||
      ability.type ===
        "pass-will-damage-monster-by-test-result" ||
      ability.type ===
        "if-fail-will-skip-strength" ||
      ability.type ===
        "fail-will-lose-health" ||
      ability.type ===
        "fail-will-gain-condition",
  );
}

/*
 * ============================================================
 * STRENGTH RESULT
 * ============================================================
 *
 * Abilities that depend on the Strength Test.
 */

export function getMonsterStrengthResultAbilities(
  definition: MonsterDefinition,
): MonsterSpecialAbility[] {
  return definition.specialAbilities.filter(
    (ability) =>
      ability.type ===
        "lose-health-from-strength" ||
      ability.type ===
        "lose-health-from-strength-gain-condition" ||
      ability.type ===
        "lose-health-from-strength-recover-health" ||
      ability.type ===
        "lose-health-from-strength-discard-ally" ||
      ability.type ===
        "fail-strength-discard-ally-instead-of-health",
  );
}

/*
 * ============================================================
 * DEFEAT
 * ============================================================
 *
 * Abilities that happen when the Monster is defeated.
 */

export function getMonsterDefeatAbilities(
  definition: MonsterDefinition,
): MonsterSpecialAbility[] {
  return definition.specialAbilities.filter(
    (ability) =>
      ability.type ===
        "defeat-move-instead-of-encounter" ||
      ability.type ===
        "defeat-gain-condition" ||
      ability.type ===
        "defeat-no-additional-encounter" ||
      ability.type ===
        "defeat-gain-asset" ||
      ability.type ===
        "defeat-gain-artifact" ||
      ability.type ===
        "defeat-recover-sanity" ||
      ability.type ===
        "defeat-investigator-discard-condition",
  );
}

/*
 * ============================================================
 * RECKONING
 * ============================================================
 *
 * Abilities that happen during the Mythos/Ancient One
 * Reckoning step.
 */

export function getMonsterReckoningAbilities(
  definition: MonsterDefinition,
): MonsterSpecialAbility[] {
  return definition.specialAbilities.filter(
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
        "spawn-ghoul-on-space" ||
      ability.type ===
        "discard-and-spawn-epic-monster" ||
      ability.type ===
        "each-investigator-on-space-lose-sanity" ||
      ability.type ===
        "each-investigator-on-space-lose-health",
  );
}

/*
 * ============================================================
 * SPAWN
 * ============================================================
 *
 * Abilities that happen when the Monster enters the board.
 */

export function getMonsterSpawnAbilities(
  definition: MonsterDefinition,
): MonsterSpecialAbility[] {
  return definition.specialAbilities.filter(
    (ability) =>
      ability.type ===
        "spawn-move-to-space" ||
      ability.type ===
        "spawn-lead-investigator-gains-condition",
  );
}