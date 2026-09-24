import type { GameState } from "../models/GameState";

import { gainCondition } from "./gainCondition";
import { discardCondition } from "./discardCondition";
import { rollTest } from "./rollTest";

import type {
  ConditionFrontEffect,
  ConditionFrontTriggeredEffect,
} from "../models/ConditionDefinition/frontEffects";
import { defeatInvestigator } from "./defeatInvestigator";
import type { MapDefinition } from "../models/MapDefinition";

export interface ResolveConditionFrontEffectsResult {
  game: GameState;
  testResults: ReturnType<typeof rollTest>[];
}

export function resolveConditionFrontEffects(
  game: GameState,
  investigatorId: string,
  conditionId: string,
  effect: ConditionFrontEffect,
  map: MapDefinition,
  treatDiceAsOne = false,
): ResolveConditionFrontEffectsResult {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  const condition =
    game.conditions[conditionId];

  if (!condition) {
    throw new Error(
      `Condition "${conditionId}" does not exist.`,
    );
  }

  if (
    !investigator.conditionIds.includes(
      conditionId,
    )
  ) {
    throw new Error(
      `Condition "${conditionId}" is not associated with investigator "${investigatorId}".`,
    );
  }

  /*
   * ============================================================
   * CONDITION MUST BE ON FRONT
   * ============================================================
   */

  if (condition.flipped) {
    return {
      game,
      testResults: [],
    };
  }

  let currentGame = game;

  const testResults:
    ReturnType<typeof rollTest>[] = [];

  let shouldDiscard = false;

  /*
   * ============================================================
   * RESOLVE SPECIFIC FRONT EFFECT
   * ============================================================
   */

  switch (effect.type) {
    /*
     * ==========================================================
     * REST
     * ==========================================================
     */

    case "on-rest": {
      const results: number[] = [];

      for (
        let index = 0;
        index < effect.dice;
        index++
      ) {
        const roll =
          Math.floor(
            Math.random() * 6,
          ) + 1;

        results.push(roll);
      }

      const success =
        effect.successResults
          ? results.some(
              (result) =>
                effect.successResults!.includes(
                  result,
                ),
            )
          : effect.successMinimum !==
              undefined
            ? results.some(
                (result) =>
                  result >=
                  effect.successMinimum!,
              )
            : false;

      if (success) {
        const result =
          applyTriggeredEffects(
            currentGame,
            investigatorId,
            conditionId,
            effect.effects,
            map,
          );

        currentGame =
          result.game;

        shouldDiscard =
          shouldDiscard ||
          result.shouldDiscard;
      } else if (effect.otherwise) {
        if (
          effect.otherwise.type ===
          "test"
        ) {
          const test =
            rollTest(
              currentGame.investigators[
                investigatorId
              ],
              effect.otherwise
                .testType,
              0,
              1,
            );

          testResults.push(test);

          if (!test.passed) {
            const result =
              applyTriggeredEffects(
                currentGame,
                investigatorId,
                conditionId,
                effect.otherwise
                  .onFail,
                map,
              );

            currentGame =
              result.game;

            shouldDiscard =
              shouldDiscard ||
              result.shouldDiscard;
          }
        }
      }

      break;
    }

    /*
     * ==========================================================
     * TEST FAILED
     * ==========================================================
     */

    case "on-test-fail": {
      break;
    }

    /*
     * ==========================================================
     * WILL
     * ==========================================================
     */

    case "on-will": {
      const dice =
        effect.dice ?? 1;

      const results: number[] = [];

      for (
        let index = 0;
        index < dice;
        index++
      ) {
        const roll =
          Math.floor(
            Math.random() * 6,
          ) + 1;

        results.push(roll);
      }

      const success =
        effect.successResults
          ? results.some(
              (result) =>
                effect.successResults!.includes(
                  result,
                ),
            )
          : false;

      if (success) {
        const result =
          applyTriggeredEffects(
            currentGame,
            investigatorId,
            conditionId,
            effect.effects,
            map,
          );

        currentGame =
          result.game;

        shouldDiscard =
          shouldDiscard ||
          result.shouldDiscard;
      }

      break;
    }

    /*
     * ==========================================================
     * DAMAGE
     * ==========================================================
     */

    case "on-damage": {
      const result =
        applyTriggeredEffects(
          currentGame,
          investigatorId,
          conditionId,
          effect.effects,
          map,
        );

      currentGame =
        result.game;

      shouldDiscard =
        shouldDiscard ||
        result.shouldDiscard;

      break;
    }

    /*
     * ==========================================================
     * SANITY LOSS
     * ==========================================================
     */

    case "on-sanity-loss": {
      const result =
        applyTriggeredEffects(
          currentGame,
          investigatorId,
          conditionId,
          effect.effects,
          map,
        );

      currentGame =
        result.game;

      shouldDiscard =
        shouldDiscard ||
        result.shouldDiscard;

      break;
    }

    /*
     * ==========================================================
     * GAIN CONDITION
     * ==========================================================
     */

    case "on-gain-condition": {
      const result =
        applyTriggeredEffects(
          currentGame,
          investigatorId,
          conditionId,
          effect.effects,
          map,
        );

      currentGame =
        result.game;

      shouldDiscard =
        shouldDiscard ||
        result.shouldDiscard;

      break;
    }

    /*
     * ==========================================================
     * REPLACE GAIN CONDITION
     * ==========================================================
     */

    case "replace-gain-condition": {
      const result =
        applyTriggeredEffects(
          currentGame,
          investigatorId,
          conditionId,
          effect.effects,
          map,
        );

      currentGame =
        result.game;

      shouldDiscard =
        shouldDiscard ||
        result.shouldDiscard;

      break;
    }

    /*
     * ==========================================================
     * DEAL
     * ==========================================================
     */

    case "on-deal": {
      const results: number[] = [];

      for (
        let index = 0;
        index < effect.dice;
        index++
      ) {
        const roll =
          Math.floor(
            Math.random() * 6,
          ) + 1;

        results.push(roll);
      }

      const success =
        results.some(
          (result) =>
            effect.successResults.includes(
              result,
            ),
        );

      if (success) {
        const result =
          applyTriggeredEffects(
            currentGame,
            investigatorId,
            conditionId,
            effect.effects,
            map,
          );

        currentGame =
          result.game;

        shouldDiscard =
          shouldDiscard ||
          result.shouldDiscard;
      }

      break;
    }

    /*
     * ==========================================================
     * LOCAL ACTION TEST
     * ==========================================================
     */

    case "on-local-action-test": {
      break;
    }

    /*
     * ==========================================================
     * LOCAL ACTION TEST
     * ==========================================================
     */

    case "local-action-test": {
      break;
    }

    /*
    * ==========================================================
    * ENCOUNTER
    * ==========================================================
    */

    case "on-encounter": {
      /*
      * --------------------------------------------------------
      * ENCOUNTER TEST
      * --------------------------------------------------------
      */

      if (effect.testType) {
        const test =
          rollTest(
            currentGame.investigators[
              investigatorId
            ],
            effect.testType,
            0,
            1,
          );

        testResults.push(test);

        if (!test.passed) {
          const result =
            applyTriggeredEffects(
              currentGame,
              investigatorId,
              conditionId,
              effect.onFail ?? [],
              map,
            );

          currentGame =
            result.game;

          shouldDiscard =
            shouldDiscard ||
            result.shouldDiscard;
        }

        break;
      }

      /*
      * --------------------------------------------------------
      * SIMPLE ENCOUNTER EFFECT
      * --------------------------------------------------------
      */

      if (effect.dice === undefined) {
        const result =
          applyTriggeredEffects(
            currentGame,
            investigatorId,
            conditionId,
            effect.effects ?? [],
            map,
          );

        currentGame =
          result.game;

        shouldDiscard =
          shouldDiscard ||
          result.shouldDiscard;

        break;
      }

      /*
      * --------------------------------------------------------
      * ENCOUNTER DICE
      * --------------------------------------------------------
      */

      const results: number[] = [];

      for (
        let index = 0;
        index < effect.dice;
        index++
      ) {
        const roll =
          Math.floor(
            Math.random() * 6,
          ) + 1;

        results.push(roll);
      }

      const success =
        effect.successResults
          ? results.some(
              (result) =>
                effect.successResults!.includes(
                  result,
                ),
            )
          : false;

      if (success) {
        const result =
          applyTriggeredEffects(
            currentGame,
            investigatorId,
            conditionId,
            effect.effects ?? [],
            map,
          );

        currentGame =
          result.game;

        shouldDiscard =
          shouldDiscard ||
          result.shouldDiscard;
      }

      break;
    }

    /*
    * ==========================================================
    * RECKONING
    * ==========================================================
    */

    case "on-reckoning": {
      /*
      * --------------------------------------------------------
      * RECKONING TEST
      * --------------------------------------------------------
      */

      if (effect.testType) {
        if (treatDiceAsOne) {
          const investigator =
            currentGame.investigators[
              investigatorId
            ];

          const diceRolled = Math.max(
            0,
            investigator.skills[
              effect.testType
            ] + (effect.modifier ?? 0),
          );

          const test = {
            skill: effect.testType,
            modifier:
              effect.modifier ?? 0,
            difficulty: 1,
            diceRolled,
            results:
              Array(diceRolled).fill(1),
            successes: 0,
            passed: false,
          };

          testResults.push(test);

          const result =
            applyTriggeredEffects(
              currentGame,
              investigatorId,
              conditionId,
              effect.onFail ?? [],
              map,
            );

          currentGame =
            result.game;

          shouldDiscard =
            shouldDiscard ||
            result.shouldDiscard;

          break;
        }

        const test =
          rollTest(
            currentGame.investigators[
              investigatorId
            ],
            effect.testType,
            effect.modifier ?? 0,
            1,
          );

        testResults.push(test);

        if (test.passed) {
          const result =
            applyTriggeredEffects(
              currentGame,
              investigatorId,
              conditionId,
              effect.effects ?? [],
              map,
            );

          currentGame =
            result.game;

          shouldDiscard =
            shouldDiscard ||
            result.shouldDiscard;
        } else {
          const result =
            applyTriggeredEffects(
              currentGame,
              investigatorId,
              conditionId,
              effect.onFail ?? [],
              map,
            );

          currentGame =
            result.game;

          shouldDiscard =
            shouldDiscard ||
            result.shouldDiscard;
        }

        break;
      }

      /*
      * --------------------------------------------------------
      * RECKONING DICE
      * --------------------------------------------------------
      */

      if (effect.dice !== undefined) {
        const results: number[] =
          treatDiceAsOne
            ? Array(effect.dice).fill(1)
            : [];

        if (!treatDiceAsOne) {
          for (
            let index = 0;
            index < effect.dice;
            index++
          ) {
            const roll =
              Math.floor(
                Math.random() * 6,
              ) + 1;

            results.push(roll);
          }
        }

        const success =
          effect.successResults
            ? results.some(
                (result) =>
                  effect.successResults!.includes(
                    result,
                  ),
              )
            : false;

        if (success) {
          const result =
            applyTriggeredEffects(
              currentGame,
              investigatorId,
              conditionId,
              effect.effects ?? [],
              map,
            );

          currentGame =
            result.game;

          shouldDiscard =
            shouldDiscard ||
            result.shouldDiscard;
        }

        break;
      }

      /*
      * --------------------------------------------------------
      * SIMPLE RECKONING EFFECT
      * --------------------------------------------------------
      */

      const result =
        applyTriggeredEffects(
          currentGame,
          investigatorId,
          conditionId,
          effect.effects ?? [],
          map,
        );

      currentGame =
        result.game;

      shouldDiscard =
        shouldDiscard ||
        result.shouldDiscard;

      break;
    }

    /*
     * ==========================================================
     * MODIFY TEST SUCCESSES
     * ==========================================================
     */

    case "modify-test-successes": {
      break;
    }
  }

  /*
   * ============================================================
   * DISCARD CONDITION
   * ============================================================
   */

  if (shouldDiscard) {
    currentGame =
      discardCondition(
        currentGame,
        investigatorId,
        conditionId,
      );
  }

  /*
   * ============================================================
   * RETURN
   * ============================================================
   */

  return {
    game: currentGame,
    testResults,
  };
}

/*
 * ==============================================================
 * APPLY TRIGGERED EFFECTS
 * ==============================================================
 */

function applyTriggeredEffects(
  game: GameState,
  investigatorId: string,
  conditionId: string,
  effects: ConditionFrontTriggeredEffect[],
  map: MapDefinition,
): {
  game: GameState;
  shouldDiscard: boolean;
} {
  let currentGame = game;

  let shouldDiscard = false;

  for (const effect of effects) {
    switch (effect.type) {
      /*
       * --------------------------------------------------------
       * GAIN CONDITION
       * --------------------------------------------------------
       */

      case "gain-condition": {
        currentGame =
          gainCondition(
            currentGame,
            investigatorId,
            effect.conditionDefinitionId,
          );

        break;
      }

      /*
       * --------------------------------------------------------
       * LOSE HEALTH
       * --------------------------------------------------------
       */

      case "lose-health": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const newHealth = Math.max(
          0,
          investigator.health -
            effect.amount,
        );

        currentGame = {
          ...currentGame,

          investigators: {
            ...currentGame.investigators,

            [investigatorId]: {
              ...investigator,

              health: newHealth,
            },
          },
        };

        if (
          newHealth <= 0 ||
          investigator.sanity <= 0
        ) {
          if (!map) {
            throw new Error(
              "MapDefinition is required to defeat an investigator.",
            );
          }

          currentGame =
            defeatInvestigator(
              currentGame,
              map,
              investigatorId,
            );
        }

        break;
      }

      /*
       * --------------------------------------------------------
       * LOSE SANITY
       * --------------------------------------------------------
       */

      case "lose-sanity": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const newSanity = Math.max(
          0,
          investigator.sanity -
            effect.amount,
        );

        currentGame = {
          ...currentGame,

          investigators: {
            ...currentGame.investigators,

            [investigatorId]: {
              ...investigator,

              sanity: newSanity,
            },
          },
        };

        if (
          newSanity <= 0 ||
          investigator.health <= 0
        ) {
          if (!map) {
            throw new Error(
              "MapDefinition is required to defeat an investigator.",
            );
          }

          currentGame =
            defeatInvestigator(
              currentGame,
              map,
              investigatorId,
            );
        }

        break;
      }

      /*
       * --------------------------------------------------------
       * BECOME DELAYED
       * --------------------------------------------------------
       */

      case "become-delayed": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        currentGame = {
          ...currentGame,

          investigators: {
            ...currentGame.investigators,

            [investigatorId]: {
              ...investigator,

              isDelayed: true,
            },
          },
        };

        break;
      }

      /*
       * --------------------------------------------------------
       * DISCARD SELF
       * --------------------------------------------------------
       */

      case "discard-self": {
        shouldDiscard = true;

        break;
      }

      /*
       * --------------------------------------------------------
       * FLIP SELF
       * --------------------------------------------------------
       */

      case "flip-self": {
        const condition =
          currentGame.conditions[
            conditionId
          ];

        currentGame = {
          ...currentGame,

          conditions: {
            ...currentGame.conditions,

            [conditionId]: {
              ...condition,

              flipped: true,
            },
          },
        };

        break;
      }

      /*
       * --------------------------------------------------------
       * EXHAUSTIVE CHECK
       * --------------------------------------------------------
       */

      default: {
        const exhaustiveCheck: never =
          effect;

        throw new Error(
          `Unsupported condition triggered effect: ${exhaustiveCheck}`,
        );
      }
    }
  }

  return {
    game: currentGame,
    shouldDiscard,
  };
}