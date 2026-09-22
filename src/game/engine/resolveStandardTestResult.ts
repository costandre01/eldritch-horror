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
  * ==========================================================
  * MYTHOS — PATROLLING THE BORDER
  * ==========================================================
  */

  if (
      testDecision.source?.startsWith(
          "mythos:patrolling-the-border:test:",
      )
  ) {
      const sourceParts =
          testDecision.source.split(":");

      const investigatorId =
          sourceParts[3];

      const investigatorIndex =
          Number(
              sourceParts[4],
          );

      if (
          !investigatorId ||
          !Number.isInteger(
              investigatorIndex,
          )
      ) {
          throw new Error(
              "Patrolling the Border test has an invalid source.",
          );
      }

      return {
          type: "state",

          game: {
              ...game,

              pendingDecision: {
                  type: "continue",

                  title:
                      passed
                          ? "PASS"
                          : "FAIL",

                  message:
                      passed
                          ? "The Observation test was successful."
                          : "The Observation test failed.",

                  image:
                      testDecision.image,

                  onComplete: [],

                  source:
                      `mythos:patrolling-the-border:test-result:${investigatorId}:${investigatorIndex}:${passed ? "pass" : "fail"}`,

                  resume:
                      testDecision.resume,
              },

              lastTest:
                  diceTest,
          },
      };
  }

  /*
  * ============================================================
  * MYTHOS — ARRESTS MADE IN MURDER CASE!
  * ============================================================
  */

  if (
    testDecision.source?.startsWith(
      "mythos:arrests-made:test:",
    )
  ) {
    const sourceParts =
      testDecision.source.split(":");

    const investigatorId =
      sourceParts[3];

    const investigatorIndex =
      Number(sourceParts[4]);

    if (
      !investigatorId ||
      !Number.isInteger(
        investigatorIndex,
      )
    ) {
      throw new Error(
        "Arrests Made test has an invalid source.",
      );
    }

    return {
      type: "state",

      game: {
        ...game,

        pendingDecision: {
          type: "continue",

          title:
            passed
              ? "PASS"
              : "FAIL",

          message:
            passed
              ? "The Influence test was successful."
              : "The Influence test failed.",

          image:
            testDecision.image,

          onComplete:
            [],

          source:
            `mythos:arrests-made:test-result:${investigatorId}:${investigatorIndex}:${passed ? "pass" : "fail"}`,

          resume:
            testDecision.resume,
        },

        lastTest:
          diceTest,
      },
    };
  }

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
        `encounter:test-result:${testDecision.investigatorId}`,
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