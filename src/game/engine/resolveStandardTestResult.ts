import type { GameState } from "../models/GameState";
import type { PendingDecision } from "../models/PendingDecision";
import type { TestResult } from "../models/TestResult";

import { endInvestigatorEncounter } from "./endInvestigatorEncounter";

export type StandardTestResult =
  | {
      type: "state";
      game: GameState;
    }
  | {
      type: "acquire-assets";
      game: GameState;
    };

export function resolveStandardTestResult(
  game: GameState,
  testDecision: Extract<
    PendingDecision,
    { type: "test" }
  >,
  diceTest: TestResult,
): StandardTestResult {
  const passed =
    diceTest.passed;

  /*
   * ============================================================
   * FOLLOW-UP EFFECTS
   * ============================================================
   *
   * On success:
   *   onSuccess
   *
   * On failure:
   *   onFail
   *
   * Afterwards:
   *   onComplete
   */

  const followUpEffects =
    passed
      ? (
          testDecision.onSuccess ??
          []
        )
      : (
          testDecision.onFail ??
          []
        );

  const continuationEffects = [
    ...followUpEffects,

    ...(testDecision.onComplete ??
      []),
  ];

  /*
   * ============================================================
   * ACQUIRE ASSETS
   * ============================================================
   *
   * Acquire Assets is special because the Test result
   * opens the Asset Reserve UI.
   *
   * The React component will take care of opening the modal.
   */

  if (
    testDecision.source?.startsWith(
      "acquire-assets:",
    )
  ) {
    return {
      type: "acquire-assets",

      game: {
        ...game,

        lastTest:
          diceTest,
      },
    };
  }

  /*
   * ============================================================
   * NO FOLLOW-UP EFFECTS
   * ============================================================
   *
   * The Encounter is finished immediately.
   */

  if (
    continuationEffects.length === 0
  ) {
    const encounterId =
      game.currentEncounterId;

    const encounterDeckType =
      game.currentEncounterDeckType;

    let finishedGame: GameState = {
      ...game,

      pendingDecision:
        null,

      lastTest:
        diceTest,

      currentEncounterId:
        null,

      currentEncounterBackId:
        null,

      currentEncounterRevealed:
        false,

      currentEncounterDeckType:
        null,
    };

    /*
     * ==========================================================
     * DISCARD PHYSICAL ENCOUNTER
     * ==========================================================
     */

    if (
      encounterId &&
      encounterDeckType
    ) {
      finishedGame = {
        ...finishedGame,

        board: {
          ...finishedGame.board,

          encounterDiscards: {
            ...finishedGame.board
              .encounterDiscards,

            [encounterDeckType]: [
              ...finishedGame.board
                .encounterDiscards[
                  encounterDeckType
                ],

              encounterId,
            ],
          },
        },
      };
    }

    /*
     * ==========================================================
     * END INVESTIGATOR ENCOUNTER
     * ==========================================================
     */

    const nextGame =
      endInvestigatorEncounter(
        finishedGame,
      );

    return {
      type: "state",
      game: nextGame,
    };
  }

  /*
   * ============================================================
   * PASS / FAIL RESULT
   * ============================================================
   *
   * Show the result first.
   *
   * The actual effects are executed when the player
   * presses CONTINUE.
   */

  const resultDecision: PendingDecision =
    {
        type: "continue",

        title:
        passed
            ? "PASS EFFECT"
            : "FAIL EFFECT",

        message:
        passed
            ? "The test was successful."
            : "The test failed.",

        image:
        testDecision.image,

        onComplete:
        continuationEffects,

        source:
        `test-result:${testDecision.investigatorId}`,
    };

  return {
    type: "state",

    game: {
      ...game,

      pendingDecision:
        resultDecision,

      lastTest:
        diceTest,
    },
  };
}