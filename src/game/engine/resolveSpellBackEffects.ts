import type { GameState } from "../models/GameState";
import type { SpellBackEffect } from "../models/SpellDefinition/backEffects";
import type { PendingSpellBackResolution, SpellBackChoice } from "../models/PendingSpellBackResolution";

import { gainCondition } from "./gainCondition";
import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";
import { defeatInvestigator } from "./defeatInvestigator";
import { discardSpell } from "./discardSpell";

export interface ResolveSpellBackEffectsOptions {
  game: GameState;

  investigatorId: string;

  spellId: string;

  effects: SpellBackEffect[];
  resume?: PendingSpellBackResolution;
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

  let health = options.resume?.health ?? caster.health;

  let sanity = options.resume?.sanity ?? caster.sanity;

  let clues = options.resume?.clues ?? caster.clues;

  let assetIds = [...(options.resume?.assetIds ?? caster.assetIds)];

  let shouldDiscard = options.resume?.shouldDiscard ?? false;
  let paused = false;

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

  const hasConditionAvailable = (definitionId: string) =>
    currentGame.board.conditionDeck.some((conditionId) => currentGame.conditions[conditionId]?.definitionId === definitionId);

  const pauseForChoice = (
    choice: SpellBackChoice,
    remainingEffects: SpellBackEffect[],
    title: string,
    options: { id: string; title: string; description?: string }[],
  ) => {
    paused = true;
    const continuation: PendingSpellBackResolution = {
      investigatorId,
      spellId,
      remainingEffects,
      health,
      sanity,
      clues,
      assetIds: [...assetIds],
      shouldDiscard,
      choice,
    };
    currentGame = {
      ...currentGame,
      pendingSpellBackResolution: continuation,
      pendingDecision: {
        type: "choice",
        title,
        message: "Choose how to resolve this Spell effect.",
        options,
        source: `spell-back:${spellId}`,
      },
    };
  };

  /*
   * ============================================================
   * RESOLVE EFFECTS
   * ============================================================
   */

  const resolveEffects = (
    effects: SpellBackEffect[],
    trailingEffects: SpellBackEffect[] = [],
  ): void => {
    for (let effectIndex = 0; effectIndex < effects.length; effectIndex++) {
      if (paused) return;
      const effect = effects[effectIndex];
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

          /*
          * Effects that must run after the selected
          * test-result branch.
          *
          * Example:
          *
          * resolve-by-test-result
          *   -> branch effects
          * flip-self
          *
          * If the branch pauses for a choice, these
          * effects are stored in the continuation.
          * Otherwise they must be resolved immediately
          * after the branch.
          */

          const remainingEffects = [
            ...effects.slice(
              effectIndex + 1,
            ),

            ...trailingEffects,
          ];

          resolveEffects(
            branch.effects,
            remainingEffects,
          );

          /*
          * A choice inside the branch paused the
          * Spell resolution.
          *
          * pauseForChoice() already received the
          * trailing effects through resolveEffects(),
          * so they will be resumed later.
          */

          if (paused) {
            return;
          }

          /*
          * The branch finished without pausing.
          * Continue with the effects that follow
          * resolve-by-test-result.
          */

          resolveEffects(
            remainingEffects,
          );

          return;
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
          const mayPreventSanity = caster.artifactIds.some(
            (artifactId) => currentGame.artifacts[artifactId]?.name === "Glass of Mortlan",
          );
          const sanityLoss = Math.max(0, effect.amount - (mayPreventSanity ? 1 : 0));

          if (
            targetId ===
            investigatorId
          ) {
            sanity = Math.max(
              0,
              sanity - sanityLoss,
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
                        sanityLoss,
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
          getTargetId(effect.target);
          pauseForChoice(
            { type: "health-or-condition", effect },
            [...effects.slice(effectIndex + 1), ...trailingEffects],
            "Choose the Spell cost",
            [
              { id: "lose-health", title: `Lose ${effect.amount} Health` },
              ...(hasConditionAvailable(effect.conditionDefinitionId)
                ? [{ id: "gain-condition", title: "Gain a Condition", description: effect.conditionDefinitionId }]
                : []),
            ],
          );
          return;
        }

        /*
         * ======================================================
         * LOSE SANITY UNLESS CONDITION
         * ======================================================
         */

        case "lose-sanity-unless-gain-condition": {
          getTargetId(effect.target);
          pauseForChoice(
            { type: "sanity-or-condition", effect },
            [...effects.slice(effectIndex + 1), ...trailingEffects],
            "Choose the Spell cost",
            [
              { id: "lose-sanity", title: `Lose ${effect.amount} Sanity` },
              ...(hasConditionAvailable(effect.conditionDefinitionId)
                ? [{ id: "gain-condition", title: "Gain a Condition", description: effect.conditionDefinitionId }]
                : []),
            ],
          );
          return;
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
          pauseForChoice(
            { type: "improve-skill", effect },
            [...effects.slice(effectIndex + 1), ...trailingEffects],
            "Choose a skill to improve",
            ["lore", "influence", "observation", "strength", "will"].map((skill) => ({
              id: skill,
              title: skill[0].toUpperCase() + skill.slice(1),
            })),
          );
          return;
        }

        /*
         * ======================================================
         * GAIN ASSET
         * ======================================================
         */

        case "gain-asset": {
          const eligible = currentGame.board.assetReserve.filter((asset) => effect.assetTypes.includes(asset.type as "item" | "trinket"));
          if (!eligible.length) break;
          pauseForChoice(
            { type: "gain-asset", effect },
            [...effects.slice(effectIndex + 1), ...trailingEffects],
            "Choose an Asset from the Reserve",
            eligible.map((asset) => ({ id: asset.id, title: asset.name, description: `Valor ${asset.value}` })),
          );
          return;
        }

        /*
         * ======================================================
         * GAIN ASSETS BY TEST RESULT
         * ======================================================
         */

        case "gain-assets-by-test-result": {
          const eligible = currentGame.board.assetReserve.filter((asset) => effect.assetTypes.includes(asset.type as "item" | "trinket") && asset.value <= testSuccesses);
          if (!eligible.length) break;
          pauseForChoice(
            { type: "gain-assets-by-test-result", effect, remainingValue: testSuccesses },
            [...effects.slice(effectIndex + 1), ...trailingEffects],
            "Choose Assets up to the test result",
            [
              { id: "done", title: "Terminar escolha" },
              ...eligible.map((asset) => ({ id: asset.id, title: asset.name, description: `Valor ${asset.value}` })),
            ],
          );
          return;
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
          const clueId = spell.pendingChosenClueId;
          const space = clueId
            ? Object.values(currentGame.board.spaces).find((candidate) => candidate.clueTokenIds.includes(clueId))
            : undefined;
          if (!clueId || !space) throw new Error("This Spell has no selected Clue to discard.");
          currentGame = {
            ...currentGame,
            board: {
              ...currentGame.board,
              spaces: {
                ...currentGame.board.spaces,
                [space.spaceId]: {
                  ...space,
                  clues: Math.max(0, space.clues - 1),
                  clueTokenIds: space.clueTokenIds.filter((id) => id !== clueId),
                },
              },
              clueDiscard: [...currentGame.board.clueDiscard, { id: clueId, spaceId: space.spaceId }],
            },
          };
          break;
        }

        /*
         * ======================================================
         * MONSTER DAMAGE
         * ======================================================
         */

        case "lose-monster-health": {
          const chosenMonsterId = spell.pendingChosenMonsterId ??
            Object.values(currentGame.monsters).find((monster) => monster.spaceId === caster.spaceId)?.id;
          const monster = chosenMonsterId ? currentGame.monsters[chosenMonsterId] : undefined;
          if (!monster || !chosenMonsterId || !monster.spaceId) throw new Error("There is no selected Monster on this space.");
          const amount = effect.amount === "test-result" ? testSuccesses : effect.amount;
          const healthAfter = Math.max(0, monster.health - amount);
          currentGame = {
            ...currentGame,
            monsters: {
              ...currentGame.monsters,
              [chosenMonsterId]: { ...monster, health: healthAfter, spaceId: healthAfter > 0 ? monster.spaceId : null },
            },
            ...(healthAfter === 0 && currentGame.board.spaces[monster.spaceId]
              ? {
                  board: {
                    ...currentGame.board,
                    spaces: {
                      ...currentGame.board.spaces,
                      [monster.spaceId]: {
                        ...currentGame.board.spaces[monster.spaceId],
                        monsterIds: currentGame.board.spaces[monster.spaceId].monsterIds.filter((id) => id !== chosenMonsterId),
                      },
                    },
                  },
                }
              : {}),
          };
          break;
        }

        case "lose-other-monsters-health": {
          const ownerSpaceId = currentGame.investigators[investigatorId]?.spaceId;
          const space = ownerSpaceId ? currentGame.board.spaces[ownerSpaceId] : undefined;
          if (!space) break;
          const monsters = { ...currentGame.monsters };
          const defeatedIds: string[] = [];
          for (const id of space.monsterIds) {
            const monster = monsters[id];
            if (!monster) continue;
            const health = Math.max(0, monster.health - effect.amount);
            monsters[id] = { ...monster, health, spaceId: health > 0 ? monster.spaceId : null };
            if (health === 0) defeatedIds.push(id);
          }
          currentGame = {
            ...currentGame,
            monsters,
            board: {
              ...currentGame.board,
              spaces: {
                ...currentGame.board.spaces,
                [space.spaceId]: { ...space, monsterIds: space.monsterIds.filter((id) => !defeatedIds.includes(id)) },
              },
            },
          };
          break;
        }

        /*
         * ======================================================
         * ADDITIONAL ACTION
         * ======================================================
         */

        case "gain-additional-action": {
          const owner = currentGame.investigators[investigatorId];
          if (owner) {
            currentGame = {
              ...currentGame,
              investigators: {
                ...currentGame.investigators,
                [investigatorId]: {
                  ...owner,
                  additionalActionsThisRound: (owner.additionalActionsThisRound ?? 0) + effect.amount,
                },
              },
            };
          }
          break;
        }

        /*
         * ======================================================
         * MODIFY STRENGTH
         * ======================================================
         */

        case "modify-strength": {
          currentGame = {
            ...currentGame,
            activeCombatSkillModifiers: [
              ...(effect.replacePreviousModifier
                ? (currentGame.activeCombatSkillModifiers ?? []).filter(
                    (modifier) => !modifier.id.startsWith(`spell:${spellId}:`),
                  )
                : currentGame.activeCombatSkillModifiers ?? []),
              {
                id: `spell:${spellId}:combat-strength`,
                investigatorId,
                skill: "strength",
                amount: effect.amount,
                duration: "this-combat-encounter",
              },
            ],
          };
          break;
        }

        /*
         * ======================================================
         * ALLOW REROLL
         * ======================================================
         */

        case "allow-reroll": {
          currentGame = {
            ...currentGame,
            activeTestRerolls: [
              ...(currentGame.activeTestRerolls ?? []),
              {
                id: `spell:${spellId}:${effect.testType}:${effect.duration}`,
                investigatorId,
                skill: effect.testType,
                amount: effect.amount,
                duration: effect.duration,
              },
            ],
          };
          break;
        }

        /*
         * ======================================================
         * RESEARCH ENCOUNTER
         * ======================================================
         */

        case "modify-research-encounter-tests": {
          currentGame = {
            ...currentGame,
            researchEncounterBonusDice: {
              ...currentGame.researchEncounterBonusDice,
              [investigatorId]: (currentGame.researchEncounterBonusDice?.[investigatorId] ?? 0) + effect.additionalDice,
            },
          };
          break;
        }

        /*
         * ======================================================
         * PREVENT HEALTH LOSS
         * ======================================================
         */

        case "prevent-health-loss": {
          // The pending loss is reduced before this back is presented. This
          // entry remains on the back so the rest of its effects resolve in
          // the normal card flow.
          break;
        }

        /*
         * ======================================================
         * PREVENT SANITY LOSS
         * ======================================================
         */

        case "prevent-sanity-loss": {
          break;
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
          if (effect.requirement.type === "rolled-face") {
            // This is a deterministic condition, not a player choice: retain
            // the Spell only when one of its actual rolled dice shows the face.
            if (!testResult?.results.includes(effect.requirement.value)) {
              shouldDiscard = true;
            }
            break;
          }
          const requirement = effect.requirement;
          const options = requirement.type === "lose-sanity"
            ? [
                ...(sanity >= requirement.amount ? [{ id: "pay-cost", title: `Lose ${requirement.amount} Sanity` }] : []),
                { id: "discard-spell", title: "Descartar esta Spell" },
              ]
            : requirement.type === "gain-condition"
              ? [
                  ...(hasConditionAvailable(requirement.conditionDefinitionId)
                    ? [{ id: "meet-requirement", title: `Gain ${requirement.conditionDefinitionId}` }]
                    : []),
                  { id: "discard-spell", title: "Descartar esta Spell" },
                ]
              : [
                  ...assetIds
                    .map((assetId) => currentGame.assets[assetId])
                    .filter((asset) => asset?.type === "item")
                    .map((asset) => ({ id: `discard-item:${asset.id}`, title: `Descartar ${asset.name}` })),
                  { id: "discard-spell", title: "Descartar esta Spell" },
                ];
          pauseForChoice(
            { type: "conditional-discard", requirement },
            [...effects.slice(effectIndex + 1), ...trailingEffects],
            "Choose how to keep the Spell",
            options,
          );
          return;
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

  if (paused) return currentGame;

  for (const targetId of new Set([investigatorId, chosenInvestigatorId].filter((id): id is string => !!id))) {
    const target = currentGame.investigators[targetId];
    if (target && !target.isDefeated && (target.health <= 0 || target.sanity <= 0)) {
      currentGame = defeatInvestigator(currentGame, eldritchBaseMap, targetId);
    }
  }

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
      currentGame = discardSpell(currentGame, investigatorId, spellId);
    }
  }

  /*
  * ============================================================
  * CLEAR SPELL BACK RESOLUTION
  * ============================================================
  *
  * Reaching this point means that every back effect has
  * finished resolving and no further player choice is pending.
  *
  * Any continuation created while resolving this Spell is now
  * complete.
  */

  currentGame = {
    ...currentGame,

    pendingSpellBackResolution:
      null,
  };

  return currentGame;
}
