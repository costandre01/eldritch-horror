import type { GameState } from "../models/GameState";
import type { SpellBackEffect } from "../models/SpellDefinition/backEffects";

import { gainCondition } from "./gainCondition";

export interface ResolveSpellBackEffectsOptions {
  game: GameState;

  investigatorId: string;

  spellId: string;

  effects: SpellBackEffect[];
}

export function resolveSpellBackEffects(
  options: ResolveSpellBackEffectsOptions,
): GameState {
  let currentGame = options.game;

  const {
    investigatorId,
    spellId,
  } = options;

  /*
   * ============================================================
   * VALIDATE CASTER
   * ============================================================
   */

  const caster =
    currentGame.investigators[
      investigatorId
    ];

  if (!caster) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * VALIDATE SPELL
   * ============================================================
   */

  const spell =
    currentGame.spells[spellId];

  if (!spell) {
    throw new Error(
      `Spell "${spellId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * TEST RESULT
   * ============================================================
   *
   * IMPORTANT:
   *
   * The result belongs to this physical Spell.
   * We do NOT use GameState.lastTest here.
   */

  const testResult =
    spell.pendingTestResult;

  const testSuccesses =
    testResult?.successes ?? 0;

  /*
   * ============================================================
   * CHOSEN INVESTIGATOR
   * ============================================================
   */

  const chosenInvestigatorId =
    spell.pendingChosenInvestigatorId;

  /*
   * ============================================================
   * LOCAL STATE
   * ============================================================
   */

  let health =
    caster.health;

  let sanity =
    caster.sanity;

  let clues =
    caster.clues;

  let assetIds = [
    ...caster.assetIds,
  ];

  let shouldDiscard =
    false;

  /*
   * ============================================================
   * TARGET HELPER
   * ============================================================
   */

  const getTargetId = (
    target:
      | "caster"
      | "chosen-investigator",
  ): string => {
    if (
      target === "caster"
    ) {
      return investigatorId;
    }

    if (
      !chosenInvestigatorId
    ) {
      throw new Error(
        `Spell "${spellId}" requires a chosen investigator.`,
      );
    }

    return chosenInvestigatorId;
  };

  /*
   * ============================================================
   * RESOLVE EFFECTS
   * ============================================================
   */

  const resolveEffects = (
    effects: SpellBackEffect[],
  ): void => {
    for (
      const effect of effects
    ) {
      switch (
        effect.type
      ) {
        /*
         * ======================================================
         * RESOLVE BY TEST RESULT
         * ======================================================
         */

        case "resolve-by-test-result": {
          const branch =
            effect.results.find(
              (result) => {
                if (
                  result.exact !==
                  undefined
                ) {
                  return (
                    testSuccesses ===
                    result.exact
                  );
                }

                if (
                  result.min !==
                    undefined &&
                  testSuccesses <
                    result.min
                ) {
                  return false;
                }

                if (
                  result.max !==
                    undefined &&
                  testSuccesses >
                    result.max
                ) {
                  return false;
                }

                return true;
              },
            );

          if (!branch) {
            throw new Error(
              `No Spell back-effect branch matches test result ${testSuccesses}.`,
            );
          }

          resolveEffects(
            branch.effects,
          );

          break;
        }

        /*
         * ======================================================
         * LOSE HEALTH
         * ======================================================
         */

        case "lose-health": {
          const targetId =
            getTargetId(
              effect.target,
            );

          if (
            targetId ===
            investigatorId
          ) {
            health = Math.max(
              0,
              health -
                effect.amount,
            );
          } else {
            const target =
              currentGame
                .investigators[
                targetId
              ];

            if (!target) {
              throw new Error(
                `Investigator "${targetId}" does not exist.`,
              );
            }

            currentGame = {
              ...currentGame,

              investigators: {
                ...currentGame
                  .investigators,

                [targetId]: {
                  ...target,

                  health:
                    Math.max(
                      0,
                      target.health -
                        effect.amount,
                    ),
                },
              },
            };
          }

          break;
        }

        /*
         * ======================================================
         * LOSE SANITY
         * ======================================================
         */

        case "lose-sanity": {
          const targetId =
            getTargetId(
              effect.target,
            );

          if (
            targetId ===
            investigatorId
          ) {
            sanity = Math.max(
              0,
              sanity -
                effect.amount,
            );
          } else {
            const target =
              currentGame
                .investigators[
                targetId
              ];

            if (!target) {
              throw new Error(
                `Investigator "${targetId}" does not exist.`,
              );
            }

            currentGame = {
              ...currentGame,

              investigators: {
                ...currentGame
                  .investigators,

                [targetId]: {
                  ...target,

                  sanity:
                    Math.max(
                      0,
                      target.sanity -
                        effect.amount,
                    ),
                },
              },
            };
          }

          break;
        }

        /*
         * ======================================================
         * LOSE HEALTH UNLESS CONDITION
         * ======================================================
         */

        case "lose-health-unless-gain-condition": {
          /*
           * This requires a player choice:
           *
           * Lose Health
           * OR
           * Gain Condition.
           *
           * We do not automatically choose.
           */

          throw new Error(
            "Spell effect requires a choice between losing Health and gaining a Condition.",
          );
        }

        /*
         * ======================================================
         * LOSE SANITY UNLESS CONDITION
         * ======================================================
         */

        case "lose-sanity-unless-gain-condition": {
          /*
           * This requires a player choice:
           *
           * Lose Sanity
           * OR
           * Gain Condition.
           */

          throw new Error(
            "Spell effect requires a choice between losing Sanity and gaining a Condition.",
          );
        }

        /*
         * ======================================================
         * GAIN CONDITION
         * ======================================================
         */

        case "gain-condition": {
          const targetId =
            getTargetId(
              effect.target,
            );

          currentGame =
            gainCondition(
              currentGame,
              targetId,
              effect.conditionDefinitionId,
            );

          break;
        }

        /*
         * ======================================================
         * GAIN CONDITION ON INVESTIGATORS ON SPACE
         * ======================================================
         */

        case "gain-condition-on-investigators-on-space": {
          const currentCaster =
            currentGame
              .investigators[
              investigatorId
            ];

          if (!currentCaster) {
            break;
          }

          const spaceId =
            currentCaster.spaceId;

          if (
            spaceId === null
          ) {
            break;
          }

          /*
           * Determine the targets first.
           */

          const targetIds =
            Object.values(
              currentGame
                .investigators,
            )
              .filter(
                (investigator) =>
                  investigator.spaceId ===
                  spaceId,
              )
              .filter(
                (investigator) =>
                  !investigator.conditionIds.some(
                    (conditionId) =>
                      currentGame
                        .conditions[
                        conditionId
                      ]?.definitionId ===
                      effect.conditionDefinitionId,
                  ),
              )
              .map(
                (investigator) =>
                  investigator.id,
              );

          for (
            const targetId of
              targetIds
          ) {
            currentGame =
              gainCondition(
                currentGame,
                targetId,
                effect.conditionDefinitionId,
              );
          }

          break;
        }

        /*
         * ======================================================
         * IMPROVE SKILL
         * ======================================================
         */

        case "improve-skill": {
          /*
           * Skill selection belongs to the pending-choice
           * system. We never randomly choose a Skill.
           */

          throw new Error(
            "Spell effect requires a Skill choice.",
          );
        }

        /*
         * ======================================================
         * GAIN ASSET
         * ======================================================
         */

        case "gain-asset": {
          /*
           * The investigator must choose an Item/Trinket
           * from the Reserve.
           */

          throw new Error(
            "Spell effect requires an Asset choice.",
          );
        }

        /*
         * ======================================================
         * GAIN ASSETS BY TEST RESULT
         * ======================================================
         */

        case "gain-assets-by-test-result": {
          /*
           * The investigator must choose the Assets.
           */

          throw new Error(
            "Spell effect requires Asset choices.",
          );
        }

        /*
         * ======================================================
         * DISCARD ITEM
         * ======================================================
         */

        case "discard-item": {
          if (
            effect.target !==
            "caster"
          ) {
            throw new Error(
              "discard-item currently only supports the caster.",
            );
          }

          let remaining =
            effect.amount;

          const discardedIds: string[] =
            [];

          for (
            const assetId of
              assetIds
          ) {
            if (
              remaining <=
              0
            ) {
              break;
            }

            const asset =
              currentGame.assets[
                assetId
              ];

            if (!asset) {
              continue;
            }

            if (
              asset.type !==
              "item"
            ) {
              continue;
            }

            discardedIds.push(
              assetId,
            );

            remaining--;
          }

          if (
            discardedIds.length <
            effect.amount
          ) {
            throw new Error(
              "The investigator does not have enough Item Assets to discard.",
            );
          }

          assetIds =
            assetIds.filter(
              (assetId) =>
                !discardedIds.includes(
                  assetId,
                ),
            );

          currentGame = {
            ...currentGame,

            board: {
              ...currentGame.board,

              assetDiscard: [
                ...currentGame.board
                  .assetDiscard,

                ...discardedIds.map(
                  (assetId) =>
                    currentGame
                      .assets[
                      assetId
                    ],
                ),
              ],
            },
          };

          break;
        }

        /*
         * ======================================================
         * GAIN CLUES
         * ======================================================
         */

        case "gain-clues": {
          if (
            effect.target !==
            "caster"
          ) {
            throw new Error(
              "gain-clues currently only supports the caster.",
            );
          }

          clues +=
            effect.amount;

          break;
        }

        /*
         * ======================================================
         * DISCARD CHOSEN CLUE
         * ======================================================
         */

        case "discard-chosen-clue": {
          throw new Error(
            "Spell effect requires a Clue choice.",
          );
        }

        /*
         * ======================================================
         * MONSTER DAMAGE
         * ======================================================
         */

        case "lose-monster-health": {
          throw new Error(
            "Monster selection/damage is not implemented yet.",
          );
        }

        case "lose-other-monsters-health": {
          throw new Error(
            "Monster damage resolver is not implemented yet.",
          );
        }

        /*
         * ======================================================
         * ADDITIONAL ACTION
         * ======================================================
         */

        case "gain-additional-action": {
          throw new Error(
            "Additional Action integration is not implemented yet.",
          );
        }

        /*
         * ======================================================
         * MODIFY STRENGTH
         * ======================================================
         */

        case "modify-strength": {
          throw new Error(
            "Combat strength modifier integration is not implemented yet.",
          );
        }

        /*
         * ======================================================
         * ALLOW REROLL
         * ======================================================
         */

        case "allow-reroll": {
          throw new Error(
            "Reroll integration is not implemented yet.",
          );
        }

        /*
         * ======================================================
         * RESEARCH ENCOUNTER
         * ======================================================
         */

        case "modify-research-encounter-tests": {
          throw new Error(
            "Research Encounter modifier integration is not implemented yet.",
          );
        }

        /*
         * ======================================================
         * PREVENT HEALTH LOSS
         * ======================================================
         */

        case "prevent-health-loss": {
          throw new Error(
            "Health-loss prevention must be handled by the Health-loss event system.",
          );
        }

        /*
         * ======================================================
         * PREVENT SANITY LOSS
         * ======================================================
         */

        case "prevent-sanity-loss": {
          throw new Error(
            "Sanity-loss prevention must be handled by the Sanity-loss event system.",
          );
        }

        /*
         * ======================================================
         * FLIP SELF
         * ======================================================
         *
         * Back -> Front
         */

        case "flip-self": {
          currentGame = {
            ...currentGame,

            spells: {
              ...currentGame.spells,

              [spellId]: {
                ...currentGame
                  .spells[
                  spellId
                ],

                flipped: false,

                pendingTestResult:
                  null,

                pendingChosenInvestigatorId:
                  null,
              },
            },
          };

          break;
        }

        /*
         * ======================================================
         * DISCARD SELF
         * ======================================================
         */

        case "discard-self": {
          shouldDiscard =
            true;

          break;
        }

        /*
         * ======================================================
         * CONDITIONAL DISCARD
         * ======================================================
         */

        case "discard-self-unless": {
          /*
           * The actual alternative choice will be handled
           * by the choice system.
           *
           * We do not automatically decide for the player.
           */

          throw new Error(
            "Conditional Spell discard requires a player choice.",
          );
        }

        /*
         * ======================================================
         * EXHAUSTIVE CHECK
         * ======================================================
         */

        default: {
          const exhaustiveCheck:
            never = effect;

          throw new Error(
            `Unsupported Spell back effect: ${exhaustiveCheck}`,
          );
        }
      }
    }
  };

  /*
   * ============================================================
   * RESOLVE
   * ============================================================
   */

  resolveEffects(
    options.effects,
  );

  /*
   * ============================================================
   * SAVE CASTER STATE
   * ============================================================
   */

  const updatedCaster =
    currentGame.investigators[
      investigatorId
    ];

  if (!updatedCaster) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  currentGame = {
    ...currentGame,

    investigators: {
      ...currentGame.investigators,

      [investigatorId]: {
        ...updatedCaster,

        health,
        sanity,
        clues,
        assetIds,
      },
    },
  };

  /*
   * ============================================================
   * DISCARD SPELL
   * ============================================================
   */

  if (shouldDiscard) {
    const currentSpell =
      currentGame.spells[
        spellId
      ];

    if (currentSpell) {
      const owner =
        currentGame.investigators[
          investigatorId
        ];

      currentGame = {
        ...currentGame,

        board: {
            ...currentGame.board,

            spellDiscard: [
                ...currentGame.board.spellDiscard,

                currentSpell,
            ],
        },

        spells: {
          ...currentGame.spells,

          [spellId]: {
            ...currentSpell,

            flipped: false,

            pendingTestResult:
              null,

            pendingChosenInvestigatorId:
              null,
          },
        },

        investigators: {
          ...currentGame.investigators,

          [investigatorId]: {
            ...owner,

            spellIds:
              owner.spellIds.filter(
                (id) =>
                  id !== spellId,
              ),
          },
        },
      };
    }
  }

  return currentGame;
}