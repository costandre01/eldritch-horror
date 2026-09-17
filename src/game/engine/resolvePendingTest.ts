import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { rollTest } from "./rollTest";

export function resolvePendingTest(
  game: GameState,
  _map: MapDefinition,
): GameState {

  const decision =
    game.pendingDecision;

  /*
   * ============================================================
   * VALIDATION
   * ============================================================
   */

  if (!decision) {
    throw new Error(
      "There is no pending decision.",
    );
  }

  if (decision.type !== "test") {
    throw new Error(
      `Pending decision "${decision.type}" is not a test.`,
    );
  }

  /*
   * ============================================================
   * INVESTIGATOR
   * ============================================================
   */

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
   * The actual dice roll is handled by rollTest().
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
   * CLEAR CURRENT TEST
   * ============================================================
   *
   * The Test has now been resolved.
   *
   * We keep the result in lastTest so the UI can display
   * the dice result.
   */

  const currentGame: GameState = {
    ...game,

    pendingDecision: null,

    lastTest: testResult,
  };

  /*
   * ============================================================
   * RESULT
   * ============================================================
   *
   * Do NOT immediately resolve the follow-up effects.
   *
   * We first return to the Encounter card.
   *
   * This allows the player to see:
   *
   *   PASS EFFECT
   *
   * or
   *
   *   FAIL EFFECT
   *
   * before continuing.
   */

  const passed =
    decision.minSuccesses !== undefined
      ? testResult.successes >=
        decision.minSuccesses
      : testResult.passed;

  const followUpEffects =
    passed
      ? (
          decision.onSuccess ??
          []
        )
      : (
          decision.onFail ??
          []
        );

  /*
   * ============================================================
   * ENCOUNTER CONTINUATION
   * ============================================================
   *
   * onComplete contains the effects that were waiting after
   * this Test.
   *
   * Example:
   *
   * [
   *   Test Lore,
   *   Test Observation
   * ]
   *
   * After Lore:
   *
   *   PASS EFFECT
   *        ↓
   *   Continue
   *        ↓
   *   Observation Test
   *
   * We therefore store both:
   *
   *   - the selected branch
   *   - the remaining effects
   *
   * inside the next Continue decision.
   */

  const continuationEffects = [
    ...followUpEffects,
    ...(decision.onComplete ?? []),
  ];

  /*
   * ============================================================
   * ENCOUNTER DATA
   * ============================================================
   *
   * Retrieve the current Encounter so the card can be shown
   * again after the dice result.
   */

  const encounter =
    currentGame.currentEncounterId
      ? currentGame.encounters[
          currentGame.currentEncounterId
        ]
      : undefined;

  /*
   * ============================================================
   * RETURN TO ENCOUNTER CARD
   * ============================================================
   *
   * The player must press CONTINUE before the next effect
   * is resolved.
   *
   * effectResult identifies the branch:
   *
   *   pass
   *   fail
   */

  return {
    ...currentGame,

    pendingDecision: {
      type: "continue",

      title:
        encounter?.name ??
        decision.title,

      message:
        encounter?.initialText ??
        encounter?.text ??
        decision.message ??
        "",

      image:
        encounter?.backImage ??
        decision.image,

      effectResult:
        passed
          ? "pass"
          : "fail",

      onComplete:
        continuationEffects,

      source:
        `encounter:test-result:${decision.investigatorId}`,
    },
  };
}