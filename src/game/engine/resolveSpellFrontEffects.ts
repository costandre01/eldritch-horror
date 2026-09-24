import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import type {
  SpellFrontEffect,
  SpellFrontTriggeredEffect,
} from "../models/SpellDefinition/frontEffects";
import type { TestResult } from "../models/TestResult";

import { performTest } from "./performTest";
import { resolveSpellFrontTriggeredEffects } from "./resolveSpellFrontTriggeredEffects";

export interface ResolveSpellFrontEffectsResult {
  game: GameState;

  testResult: TestResult | null;

  shouldFlip: boolean;

  triggeredEffects: SpellFrontTriggeredEffect[];
}

export function resolveSpellFrontEffects(
  game: GameState,
  investigatorId: string,
  spellId: string,
  effect: SpellFrontEffect,
  map: MapDefinition,
): ResolveSpellFrontEffectsResult {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  const spell =
    game.spells[spellId];

  if (!spell) {
    throw new Error(
      `Spell "${spellId}" does not exist.`,
    );
  }

  if (
    !investigator.spellIds.includes(
      spellId,
    )
  ) {
    throw new Error(
      `Spell "${spellId}" is not associated with investigator "${investigatorId}".`,
    );
  }

  /*
   * ============================================================
   * SPELL STATE
   * ============================================================
   *
   * Front effects can only be activated while
   * the Spell is on its front side.
   */

  if (spell.flipped) {
    return {
      game,

      testResult: null,

      shouldFlip: false,

      triggeredEffects: [],
    };
  }

  let currentGame = game;

  let testResult: TestResult | null =
    null;

  let triggeredEffects:
    SpellFrontTriggeredEffect[] = [];

  /*
   * ============================================================
   * TEST HELPER
   * ============================================================
   */

  const resolveTest = (
    testType:
      | "strength"
      | "influence"
      | "will"
      | "lore"
      | "observation",

    modifier: number,

    onSuccess: SpellFrontTriggeredEffect[],
  ): TestResult => {
    const result =
      performTest(
        currentGame,
        investigatorId,
        testType,
        modifier,
        1,
        map,
      );

    currentGame =
      result.game;

    if (result.test.passed) {
      triggeredEffects =
        onSuccess;
    }

    return result.test;
  };

  /*
   * ============================================================
   * RESOLVE FRONT TEST
   * ============================================================
   */

  if (
    effect.type ===
    "action-test"
  ) {
    testResult =
      resolveTest(
        effect.testType,
        effect.modifier ?? 0,
        effect.onSuccess,
      );
  }

  /*
   * ============================================================
   * ENCOUNTER PHASE
   * ============================================================
   */

  else if (
    effect.type ===
    "on-encounter-phase"
  ) {
    testResult =
      resolveTest(
        effect.testType,
        effect.modifier ?? 0,
        effect.onSuccess,
      );
  }

  /*
   * ============================================================
   * COMBAT ENCOUNTER
   * ============================================================
   */

  else if (
    effect.type ===
    "on-combat-encounter"
  ) {
    testResult =
      resolveTest(
        effect.testType,
        effect.modifier ?? 0,
        effect.onSuccess,
      );
  }

  /*
   * ============================================================
   * HEALTH LOSS
   * ============================================================
   */

  else if (
    effect.type ===
    "on-health-loss"
  ) {
    testResult =
      resolveTest(
        effect.testType,
        effect.modifier ?? 0,
        effect.onSuccess,
      );
  }

  /*
   * ============================================================
   * SANITY LOSS
   * ============================================================
   */

  else if (
    effect.type ===
    "on-sanity-loss"
  ) {
    testResult =
      resolveTest(
        effect.testType,
        effect.modifier ?? 0,
        effect.onSuccess,
      );
  }

  /*
   * ============================================================
   * SAVE TEST RESULT ON SPELL
   * ============================================================
   *
   * The result belongs to this specific Spell.
   * We do NOT rely on global lastTest.
   */

  if (testResult !== null) {
    currentGame = {
      ...currentGame,

      spells: {
        ...currentGame.spells,

        [spellId]: {
          ...currentGame.spells[spellId],

          pendingTestResult:
            testResult,

          flipped:
            testResult.passed,
        },
      },
    };
  }

  /*
   * ============================================================
   * RESOLVE SUCCESS EFFECTS
   * ============================================================
   *
   * Examples:
   *
   * Blessing of Isis
   * -> choose investigator
   *
   * Conjuration
   * -> choose Asset
   *
   * Shriveling
   * -> choose Monster
   *
   * Feed the Mind
   * -> choose Skill
   */

  if (
    triggeredEffects.length > 0
  ) {
    const triggeredResult =
      resolveSpellFrontTriggeredEffects(
        currentGame,
        investigatorId,
        spellId,
        triggeredEffects,
      );

    currentGame =
      triggeredResult.game;

    return {
      game: currentGame,

      testResult,

      shouldFlip:
        triggeredResult.shouldFlip ||
        testResult !== null,

      triggeredEffects,
    };
  }

  /*
   * ============================================================
   * NO SUCCESS EFFECTS
   * ============================================================
   *
   * If a test was performed, the Spell
   * moves to its back.
   */

  return {
    game: currentGame,

    testResult,

    shouldFlip:
      testResult !== null,

    triggeredEffects,
  };
}