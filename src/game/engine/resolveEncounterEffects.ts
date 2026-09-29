import type { GameState } from "../models/GameState";
import type { EncounterEffect } from "../models/Encounter";
import { discardCondition } from "./discardCondition";
import { gainArtifact } from "./gainArtifact";
import { startCombat } from "./startCombat";
import type { MapDefinition } from "../models/MapDefinition";
import { moveClue } from "./moveClue";
import {
  advanceOmen,
  moveOmen,
  placeEldritchTokenOnOmen,
  discardEldritchTokenFromOmen,
} from "./omenEngine";

import { advanceDoom } from "./doomEngine";
import { retreatDoom } from "./retreatDoom";
import { spawnMonsterAtSpace } from "./spawnMonster";
import { resolveAncientOneAwakening } from "./resolveAncientOneAwakening";
import { startOtherWorldEncounter } from "./startOtherWorldEncounter";
import { easyMythos } from "../../content/core/mythos/easyMythos";
import { normalMythos } from "../../content/core/mythos/normalMythos";
import { hardMythos } from "../../content/core/mythos/hardMythos";
import { solveMythosRumor } from "./solveMythosRumor";
import type { EyesEverywhereResume } from "../models/PendingDecision";
import { defeatInvestigator } from "./defeatInvestigator";
import { coreSpells } from "../../content/core/coreSpell";
import { returnRandomSolvedMysteryToDeck } from "./mysteryEngine";
import { devourInvestigator } from "./devourInvestigator";
import { getGainableSpellIds } from "./getGainableSpellIds";
import { CORE_CLUES } from "../../content/core/coreClues";
import {
  drawClueToken,
  gainInvestigatorClues,
  spendInvestigatorClues,
  spawnCluesAtSpace,
} from "./clueEngine";
import { getImprovableSkills, improveInvestigatorSkill } from "./improvementEngine";

function gainEncounterClues(
  game: GameState,
  investigatorId: string,
  requestedAmount: number,
): GameState {
  const investigator = game.investigators[investigatorId];
  if (!investigator) {
    throw new Error(`Investigator "${investigatorId}" does not exist.`);
  }

  const amount = Math.max(0, requestedAmount);
  if (amount === 0) {
    return game;
  }

  if (!game.currentEncounterIsResearch) {
    const currentGame = gainInvestigatorClues(game, investigatorId, amount);
    const gainedAmount =
      currentGame.investigators[investigatorId].clues - investigator.clues;
    return {
      ...currentGame,
      encounterCluesGained:
        currentGame.currentEncounterId !== null
          ? (currentGame.encounterCluesGained ?? 0) + gainedAmount
          : currentGame.encounterCluesGained,
    };
  }

  let currentGame = game;
  const gainedTokens = [] as NonNullable<typeof investigator.clueTokens>;
  const spaceId = investigator.spaceId;
  const space = spaceId ? currentGame.board.spaces[spaceId] : undefined;

  /* "Gain this Clue": take the encountered token from the board first. */
  if ((currentGame.encounterCluesGained ?? 0) === 0 && space?.clueTokenIds[0]) {
    const sourceSpaceId = spaceId as string;
    const clueTokenId = space.clueTokenIds[0];
    gainedTokens.push(
      CORE_CLUES.find((token) => token.id === clueTokenId) ?? {
        id: clueTokenId,
        spaceId: sourceSpaceId,
      },
    );
    currentGame = {
      ...currentGame,
      board: {
        ...currentGame.board,
        spaces: {
          ...currentGame.board.spaces,
          [sourceSpaceId]: {
            ...space,
            clues: Math.max(0, space.clues - 1),
            clueTokenIds: space.clueTokenIds.filter((id) => id !== clueTokenId),
          },
        },
      },
    };
  }

  /* Any additional Clues named by the encounter come from the pool. */
  const canDrawFromPool =
    gainedTokens.length > 0 || (currentGame.encounterCluesGained ?? 0) > 0;
  while (gainedTokens.length < amount && canDrawFromPool) {
    const drawn = drawClueToken(currentGame);
    currentGame = drawn.game;
    if (!drawn.clue) break;
    gainedTokens.push(drawn.clue);
  }

  const gainedAmount = gainedTokens.length;
  const latestInvestigator = currentGame.investigators[investigatorId] ?? investigator;

  return {
    ...currentGame,
    investigators: {
      ...currentGame.investigators,
      [investigatorId]: {
        ...latestInvestigator,
        clues: latestInvestigator.clues + gainedAmount,
        clueTokens: [...(latestInvestigator.clueTokens ?? []), ...gainedTokens],
      },
    },
    encounterCluesGained: (currentGame.encounterCluesGained ?? 0) + gainedAmount,
    encounterClueTokenIdsGained: [
      ...(currentGame.encounterClueTokenIdsGained ?? []),
      ...gainedTokens.map((token) => token.id),
    ],
  };
}

export function resolveEncounterEffects(
  game: GameState,
  investigatorId: string,
  effects: EncounterEffect[],
  map: MapDefinition,
  combatResume?: EyesEverywhereResume,
): GameState {
  let currentGame = game;

  /*
   * ============================================================
   * EFFECT SEQUENCE
   * ============================================================
   *
   * We keep the current effect index so that effects such as
   * gain-spell and gain-condition can pause the sequence and
   * remember what still needs to be resolved afterwards.
   */

  for (
    let effectIndex = 0;
    effectIndex < effects.length;
    effectIndex++
  ) {
    const effect = effects[effectIndex];

    switch (effect.type) {
      /*
       * ==========================================================
       * GAIN HEALTH
       * ==========================================================
       */

      case "gain-health": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const amount =
          effect.amount ?? 0;

        currentGame = {
          ...currentGame,

          investigators: {
            ...currentGame.investigators,

            [investigatorId]: {
              ...investigator,

              health: Math.min(
                investigator.maxHealth,
                investigator.health + amount,
              ),
            },
          },
        };

        break;
      }

      /*
       * ==========================================================
       * GAIN SANITY
       * ==========================================================
       */

      case "gain-sanity": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const amount =
          effect.amount ?? 0;

        currentGame = {
          ...currentGame,

          investigators: {
            ...currentGame.investigators,

            [investigatorId]: {
              ...investigator,

              sanity: Math.min(
                investigator.maxSanity,
                investigator.sanity + amount,
              ),
            },
          },
        };

        break;
      }

      /*
       * ==========================================================
       * LOSE HEALTH
       * ==========================================================
       */

      case "lose-health": {
        const investigator =
          currentGame.investigators[investigatorId];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const amount =
          effect.amount ?? 0;

        if (amount > 0 && !effect.ignoreSpellLossReactions) {
          const reactions = Object.values(currentGame.investigators).flatMap((owner) => owner.spellIds.flatMap((spellId) => {
            const spell = currentGame.spells[spellId];
            const definition = spell && coreSpells.find((candidate) => candidate.id === spell.definitionId);
            if (!spell || spell.flipped || !definition) return [];
            return definition.frontEffects.flatMap((frontEffect, effectIndex) => {
              if (frontEffect.type !== "on-health-loss") return [];
              const key = `${spellId}:health-loss:${effectIndex}`;
              if (frontEffect.oncePerRound && currentGame.cardRerollUsedRound?.[key] === currentGame.round) return [];
              return [{ spellId, ownerId: owner.id, effectIndex, key, frontEffect }];
            });
          }));
          const protectorAssets = Object.values(currentGame.investigators)
            .filter((owner) => owner.spaceId === investigator.spaceId)
            .flatMap((owner) => owner.assetIds
              .map((assetId) => ({ ownerId: owner.id, assetId, asset: currentGame.assets[assetId] }))
              .filter((entry) => entry.asset?.name === "Bandages"));
          if (reactions.length > 0 || protectorAssets.length > 0) {
            return {
              ...currentGame,
              pendingDecision: {
                type: "choice",
                title: "Prevent Health Loss?",
                message: `You are about to lose ${amount} Health. You may use a Spell reaction.`,
                options: [
                  ...reactions.map(({ spellId, ownerId, frontEffect }) => ({ id: `loss-reaction:spell:${spellId}:${ownerId}`, title: coreSpells.find((candidate) => candidate.id === currentGame.spells[spellId]?.definitionId)?.name ?? spellId, description: `${ownerId}: test ${frontEffect.testType}.` })),
                  ...protectorAssets.map(({ assetId }) => ({ id: `loss-reaction:asset:${assetId}`, title: currentGame.assets[assetId]?.name ?? assetId, description: "Discard to prevent up to 2 Health loss." })),
                  { id: "loss-reaction:skip", title: "Do not prevent this loss" },
                ],
                source: `spell-loss:health:${investigatorId}:${amount}`,
                onComplete: effects.slice(effectIndex + 1),
              },
            };
          }
        }

        const newHealth = Math.max(
          0,
          investigator.health - amount,
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

        /*
        * Investigator is defeated if Health reaches 0
        * or if Sanity was already 0.
        */
        if (
          newHealth <= 0 ||
          investigator.sanity <= 0
        ) {
          currentGame =
            defeatInvestigator(
              currentGame,
              map,
              investigatorId,
            );

          return currentGame;
        }

        break;
      }

      /*
       * ==========================================================
       * LOSE SANITY
       * ==========================================================
       */

      case "lose-sanity": {
        const investigator =
          currentGame.investigators[investigatorId];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const amount =
          effect.amount ?? 0;

        if (amount > 0 && !effect.ignoreSpellLossReactions) {
          const reactions = Object.values(currentGame.investigators).flatMap((owner) => owner.spellIds.flatMap((spellId) => {
            const spell = currentGame.spells[spellId];
            const definition = spell && coreSpells.find((candidate) => candidate.id === spell.definitionId);
            if (!spell || spell.flipped || !definition) return [];
            return definition.frontEffects.flatMap((frontEffect, effectIndex) => {
              if (frontEffect.type !== "on-sanity-loss") return [];
              const key = `${spellId}:sanity-loss:${effectIndex}`;
              if (frontEffect.oncePerRound && currentGame.cardRerollUsedRound?.[key] === currentGame.round) return [];
              return [{ spellId, ownerId: owner.id, effectIndex, key, frontEffect }];
            });
          }));
          const protectorAssets = Object.values(currentGame.investigators)
            .filter((owner) => owner.spaceId === investigator.spaceId)
            .flatMap((owner) => owner.assetIds
              .map((assetId) => ({ ownerId: owner.id, assetId, asset: currentGame.assets[assetId] }))
              .filter((entry) => entry.asset?.name === "Whiskey"));
          const statueKey = `${investigator.id}:grotesque-statue`;
          const canUseStatue = investigator.artifactIds.some((artifactId) => currentGame.artifacts[artifactId]?.name === "Grotesque Statue")
            && investigator.clues > 0
            && currentGame.cardRerollUsedRound?.[statueKey] !== currentGame.round;
          if (reactions.length > 0 || protectorAssets.length > 0 || canUseStatue) {
            return {
              ...currentGame,
              pendingDecision: {
                type: "choice",
                title: "Prevent Sanity Loss?",
                message: `You are about to lose ${amount} Sanity. You may use a Spell reaction.`,
                options: [
                  ...reactions.map(({ spellId, ownerId, frontEffect }) => ({ id: `loss-reaction:spell:${spellId}:${ownerId}`, title: coreSpells.find((candidate) => candidate.id === currentGame.spells[spellId]?.definitionId)?.name ?? spellId, description: `${ownerId}: test ${frontEffect.testType}.` })),
                  ...protectorAssets.map(({ assetId }) => ({ id: `loss-reaction:asset:${assetId}`, title: currentGame.assets[assetId]?.name ?? assetId, description: "Discard to prevent up to 2 Sanity loss." })),
                  ...(canUseStatue ? [{ id: "loss-reaction:artifact:grotesque-statue", title: "Grotesque Statue", description: "Spend 1 Clue to prevent all Sanity loss." }] : []),
                  { id: "loss-reaction:skip", title: "Do not prevent this loss" },
                ],
                source: `spell-loss:sanity:${investigatorId}:${amount}`,
                onComplete: effects.slice(effectIndex + 1),
              },
            };
          }
        }

        const newSanity = Math.max(
          0,
          investigator.sanity - amount,
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

        /*
        * Investigator is defeated if Sanity reaches 0
        * or if Health was already 0.
        */
        if (
          investigator.health <= 0 ||
          newSanity <= 0
        ) {
          currentGame =
            defeatInvestigator(
              currentGame,
              map,
              investigatorId,
            );

          return currentGame;
        }

        break;
      }

      case "resolve-spell-loss": {
        const targetId =
          effect.target ??
          investigatorId;

        const target =
          currentGame.investigators[
            targetId
          ];

        if (!target) {
          throw new Error(
            `Investigator "${targetId}" does not exist.`,
          );
        }

        const amountLost =
          Math.max(
            0,
            (effect.lossAmount ?? 0) -
              (effect.preventedAmount ?? 0),
          );

        const stat =
          effect.spellLossStat ===
          "sanity"
            ? "sanity"
            : "health";

        const nextValue =
          Math.max(
            0,
            target[stat] -
              amountLost,
          );

        let nextGame =
          currentGame;

        /*
        * ============================================================
        * DISCARD ASSET
        * ============================================================
        */

        if (effect.assetId) {
          const owner =
            Object.values(
              nextGame.investigators,
            ).find(
              (candidate) =>
                candidate.assetIds.includes(
                  effect.assetId!,
                ),
            );

          const asset =
            nextGame.assets[
              effect.assetId
            ];

          if (owner && asset) {
            nextGame = {
              ...nextGame,

              investigators: {
                ...nextGame.investigators,

                [owner.id]: {
                  ...owner,

                  assetIds:
                    owner.assetIds.filter(
                      (id) =>
                        id !==
                        effect.assetId,
                    ),
                },
              },

              board: {
                ...nextGame.board,

                assetDiscard: [
                  ...nextGame.board
                    .assetDiscard,

                  asset,
                ],
              },
            };
          }
        }

        /*
        * ============================================================
        * GROTESQUE STATUE
        * ============================================================
        */

        if (
          effect.preventedAmount &&
          effect.spellLossStat ===
            "sanity" &&
          effect.artifactId
        ) {
          const clueOwner =
            nextGame.investigators[
              targetId
            ];

          if (clueOwner) {
            nextGame = {
              ...spendInvestigatorClues(nextGame, targetId, 1),

              cardRerollUsedRound: {
                ...nextGame
                  .cardRerollUsedRound,

                [`${targetId}:grotesque-statue`]:
                  nextGame.round,
              },
            };
          }
        }

        /*
        * ============================================================
        * APPLY FINAL LOSS
        * ============================================================
        *
        * IMPORTANT:
        * Use the investigator from nextGame here.
        *
        * nextGame may already contain changes made above,
        * such as discarded Assets or spent Clues.
        * ============================================================
        */

        const updatedTarget =
          nextGame.investigators[
            targetId
          ];

        if (!updatedTarget) {
          throw new Error(
            `Investigator "${targetId}" does not exist.`,
          );
        }

        currentGame = {
          ...nextGame,

          spells:
            effect.spellId &&
            nextGame.spells[
              effect.spellId
            ]
              ? {
                  ...nextGame.spells,

                  [effect.spellId]: {
                    ...nextGame.spells[
                      effect.spellId
                    ],

                    flipped: true,
                  },
                }
              : nextGame.spells,

          investigators: {
            ...nextGame.investigators,

            [targetId]: {
              ...updatedTarget,

              [stat]:
                nextValue,
            },
          },
        };

        /*
        * ============================================================
        * DEFEAT
        * ============================================================
        */

        if (
          nextValue <= 0 ||
          (
            stat === "sanity"
              ? updatedTarget.health <=
                0
              : updatedTarget.sanity <=
                0
          )
        ) {
          currentGame =
            defeatInvestigator(
              currentGame,
              map,
              targetId,
            );

          return currentGame;
        }

        break;
      }

      /*
       * ==========================================================
       * DISCARD SPELL
       * ==========================================================
       *
       * The investigator may choose one Spell they own
       * to discard.
       *
       * spellDefinitionIds can optionally restrict which
       * Spells are eligible.
       */

      case "discard-spell": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const spellIds =
          investigator.spellIds.filter(
            (spellId) => {
              const spell =
                currentGame.spells[
                  spellId
                ];

              if (!spell) {
                return false;
              }

              if (
                effect.spellDefinitionIds &&
                effect.spellDefinitionIds.length > 0
              ) {
                return effect.spellDefinitionIds.includes(
                  spell.definitionId,
                );
              }

              return true;
            },
          );

        /*
         * No Spell available.
         */

        if (spellIds.length === 0) {
          break;
        }

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "select-card",

            title:
              "Choose a Spell",

            message:
              "Choose 1 Spell to discard.",

            cardIds:
              spellIds,

            selectableCardIds:
              spellIds,

            minSelections: 1,

            maxSelections: 1,

            selectedCardIds: [],

            onComplete:
              effects.slice(
                effectIndex + 1,
              ),

            source:
              "discard-spell",
          },
        };

        return currentGame;
      }

      /*
       * ==========================================================
       * GAIN CLUES
       * ==========================================================
       */

      case "gain-clues": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        currentGame = gainEncounterClues(
          currentGame,
          investigatorId,
          effect.amount ?? 0,
        );

        break;
      }

      /*
       * ==========================================================
       * LOSE CLUES
       * ==========================================================
       */

      case "lose-clues": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        currentGame = spendInvestigatorClues(
          currentGame,
          investigatorId,
          effect.amount ?? 0,
        );

        break;
      }

      /*
       * ==========================================================
       * GAIN RESOURCES
       * ==========================================================
       */

      case "gain-resources": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const amount =
          effect.amount ?? 0;

        currentGame = {
          ...currentGame,

          investigators: {
            ...currentGame.investigators,

            [investigatorId]: {
              ...investigator,

              resources:
                investigator.resources + amount,
            },
          },
        };

        break;
      }

      /*
       * ==========================================================
       * LOSE RESOURCES
       * ==========================================================
       */

      case "lose-resources": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const amount =
          effect.amount ?? 0;

        currentGame = {
          ...currentGame,

          investigators: {
            ...currentGame.investigators,

            [investigatorId]: {
              ...investigator,

              resources: Math.max(
                0,
                investigator.resources - amount,
              ),
            },
          },
        };

        break;
      }

      /*
       * ==========================================================
       * GAIN CONDITION
       * ==========================================================
       */

      case "gain-condition": {
        if (!effect.conditionDefinitionId) {
          throw new Error(
            "Gain Condition requires conditionDefinitionId.",
          );
        }

        const conditionIds =
          currentGame.board.conditionDeck;

        if (conditionIds.length === 0) {
          break;
        }

        const selectableConditionIds =
          conditionIds.filter(
            (conditionId) =>
              currentGame.conditions[
                conditionId
              ]?.definitionId ===
              effect.conditionDefinitionId,
          );

        if (
          selectableConditionIds.length === 0
        ) {
          break;
        }

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "select-card",

            title:
              "Choose a Condition",

            message:
              "Choose a Condition to gain.",

            cardIds: [
              ...conditionIds,
            ],

            selectableCardIds:
              selectableConditionIds,

            minSelections: 1,

            maxSelections: 1,

            selectedCardIds: [],

            onComplete:
              effects.slice(
                effectIndex + 1,
              ),

            source:
              `gain-condition:${effect.conditionDefinitionId}`,
          },
        };

        return currentGame;
      }

      /*
       * ==========================================================
       * DISCARD CONDITION
       * ==========================================================
       */

      case "discard-condition": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        /*
         * --------------------------------------------------------
         * Single specific Condition
         * --------------------------------------------------------
         *
         * Existing behaviour:
         *
         * conditionDefinitionId: "condition-cursed"
         */

        if (effect.conditionDefinitionId) {
          const conditionId =
            investigator.conditionIds.find(
              (id) =>
                currentGame.conditions[id]
                  ?.definitionId ===
                effect.conditionDefinitionId,
            );

          if (conditionId) {
            currentGame =
              discardCondition(
                currentGame,
                investigatorId,
                conditionId,
              );
          }

          break;
        }

        /*
         * --------------------------------------------------------
         * Choose one Condition from several definitions
         * --------------------------------------------------------
         *
         * Example:
         *
         * conditionDefinitionIds: [
         *     "condition-cursed",
         *     "condition-dark-pact",
         * ]
         */

        if (
          effect.conditionDefinitionIds &&
          effect.conditionDefinitionIds.length > 0
        ) {
          const selectableConditionIds =
            investigator.conditionIds.filter(
              (conditionId) => {
                const condition =
                  currentGame.conditions[
                    conditionId
                  ];

                return (
                  !!condition &&
                  effect.conditionDefinitionIds!.includes(
                    condition.definitionId,
                  )
                );
              },
            );

          /*
           * The investigator does not have
           * any of the eligible Conditions.
           */

          if (
            selectableConditionIds.length === 0
          ) {
            break;
          }

          /*
           * Only one Condition may be discarded.
           */

          currentGame = {
            ...currentGame,

            pendingDecision: {
              type: "select-card",

              title:
                "Choose a Condition",

              message:
                "Choose 1 Condition to discard.",

              cardIds:
                selectableConditionIds,

              selectableCardIds:
                selectableConditionIds,

              minSelections: 1,

              maxSelections: 1,

              selectedCardIds: [],

              onComplete:
                effects.slice(
                  effectIndex + 1,
                ),

              source:
                "discard-condition",
            },
          };

          return currentGame;
        }

        throw new Error(
          "Discard Condition requires conditionDefinitionId or conditionDefinitionIds.",
        );
      }

      /*
       * ==========================================================
       * GAIN ARTIFACT
       * ==========================================================
       */

      case "gain-artifact": {
        const amount =
          effect.amount ?? 1;

        for (
          let i = 0;
          i < amount;
          i++
        ) {
          currentGame = gainArtifact(
            currentGame,
            investigatorId,
            effect.artifactId,
          );
        }

        break;
      }

      /*
       * ==========================================================
       * GAIN SPELL
       * ==========================================================
       */

      case "gain-spell": {
        const spellIds = getGainableSpellIds(currentGame, investigatorId);

        if (spellIds.length === 0) {
          break;
        }

        let selectableSpellIds =
          spellIds;

        if (effect.spellId) {
          selectableSpellIds =
            spellIds.filter(
              (spellId) =>
                spellId ===
                effect.spellId,
            );
        }

        if (effect.spellType) {
          selectableSpellIds =
            selectableSpellIds.filter(
              (spellId) => {
                const spell =
                  currentGame.board.spellDeck.find(
                    (item) =>
                      item.id ===
                      spellId,
                  );

                return (
                  spell?.type ===
                  effect.spellType
                );
              },
            );
        }

        if (
          selectableSpellIds.length ===
          0
        ) {
          break;
        }

        const selectionCount = Math.min(
          effect.amount ?? 1,
          selectableSpellIds.length,
        );

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "select-card",

            title:
              selectionCount > 1
                ? `Choose ${selectionCount} Spells`
                : "Choose a Spell",

            message:
              selectionCount > 1
                ? `Choose ${selectionCount} Spells to gain.`
                : "Choose a Spell to gain.",

            cardIds:
              spellIds,

            selectableCardIds:
              selectableSpellIds,

            minSelections:
              selectionCount,

            maxSelections:
              selectionCount,

            selectedCardIds: [],

            onComplete:
              effects.slice(
                effectIndex + 1,
              ),

            source:
              effect.spellId
                ? `gain-spell:${effect.spellId}`
                : "gain-spell",
          },
        };

        return currentGame;
      }

      /*
      * ==========================================================
      * MOVE TO NEAREST SPACE
      * ==========================================================
      *
      * Moves the investigator to the nearest space
      * of the requested type.
      */

      case "move-to-nearest-space": {
          const investigator =
              currentGame.investigators[
                  investigatorId
              ];

          if (!investigator) {
              throw new Error(
                  `Investigator "${investigatorId}" does not exist.`,
              );
          }

          if (!investigator.spaceId) {
              throw new Error(
                  `Investigator "${investigatorId}" has no current space.`,
              );
          }

          if (!effect.targetSpaceType) {
              throw new Error(
                  "Move to nearest space requires targetSpaceType.",
              );
          }

          const targetType =
              effect.targetSpaceType;

          const visited = new Set<string>([
              investigator.spaceId,
          ]);

          const queue: {
              spaceId: string;
              distance: number;
          }[] = [
              {
                  spaceId: investigator.spaceId,
                  distance: 0,
              },
          ];

          let nearestSpaceId:
              | string
              | undefined;

          while (queue.length > 0) {
              const current =
                  queue.shift();

              if (!current) {
                  break;
              }

              const currentSpace =
                  map.spaces.find(
                      (space) =>
                          space.id ===
                          current.spaceId,
                  );

              if (!currentSpace) {
                  continue;
              }

              /*
              * Do not consider the investigator's
              * current space as the destination.
              */
              if (
                  current.distance > 0 &&
                  currentSpace.type ===
                      targetType
              ) {
                  nearestSpaceId =
                      currentSpace.id;

                  break;
              }

              for (
                  const path of
                      currentSpace.paths
              ) {
                  const nextSpaceId =
                      path.toSpaceId;

                  if (
                      visited.has(
                          nextSpaceId,
                      )
                  ) {
                      continue;
                  }

                  visited.add(
                      nextSpaceId,
                  );

                  queue.push({
                      spaceId:
                          nextSpaceId,
                      distance:
                          current.distance +
                          1,
                  });
              }
          }

          if (!nearestSpaceId) {
              break;
          }

          /*
          * Move the investigator.
          *
          * Investigator position is stored directly
          * on the Investigator object through spaceId.
          */
          currentGame = {
              ...currentGame,

              investigators: {
                  ...currentGame.investigators,

                  [investigatorId]: {
                      ...investigator,

                      spaceId:
                          nearestSpaceId,
                  },
              },
          };

          break;
      }

      /*
       * ==========================================================
       * MOVE INVESTIGATOR
       * ==========================================================
       */

      case "move": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        if (!investigator.spaceId) {
          throw new Error(
            `Investigator "${investigatorId}" has no current space.`,
          );
        }

        const amount =
          effect.amount ?? 1;

        if (amount <= 0) {
          break;
        }

        const currentSpace =
          map.spaces.find(
            (space) =>
              space.id ===
              investigator.spaceId,
          );

        if (!currentSpace) {
          throw new Error(
            `Current space "${investigator.spaceId}" does not exist.`,
          );
        }

        if (amount === 1) {
          const spaceIds =
            currentSpace.paths.map(
              (path) =>
                path.toSpaceId,
            );

          if (spaceIds.length === 0) {
            break;
          }

          const encounter =
            currentGame.currentEncounterId
              ? currentGame.encounters[
                  currentGame.currentEncounterId
                ]
              : undefined;

          currentGame = {
            ...currentGame,

            pendingDecision: {
              type: "select-space",

              title:
                encounter?.name ??
                "Move",

              message:
                "Choose a space to move to.",

              image:
                encounter?.backImage ??
                encounter?.frontImage,

              spaceIds,

              onSpaceSelected: [],

              onComplete:
                effects.slice(
                  effectIndex + 1,
                ),

              source:
                `encounter:move:${
                  currentGame.currentEncounterId ??
                  "unknown"
                }`,
            },
          };

          return currentGame;
        }

        throw new Error(
          `Encounter movement of ${amount} spaces is not yet supported.`,
        );
      }

      /*
       * ==========================================================
       * GAIN SERVICE FROM RESERVE
       * ==========================================================
       */

      case "gain-service-from-reserve": {
        const reserveServiceIds =
          currentGame.board.assetReserve
            .filter(
              (asset) =>
                asset.type === "service",
            )
            .map(
              (asset) => asset.id,
            );

        if (
          reserveServiceIds.length === 0
        ) {
          break;
        }

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "select-card",

            title:
              "Choose a Service Asset",

            message:
              "Choose a Service Asset from the Reserve.",

            cardIds:
              reserveServiceIds,

            selectableCardIds:
              reserveServiceIds,

            minSelections: 1,

            maxSelections: 1,

            selectedCardIds: [],

            onComplete:
              effects.slice(
                effectIndex + 1,
              ),

            source:
              "gain-service-from-reserve",
          },
        };

        return currentGame;
      }

      /*
       * ==========================================================
       * GAIN ITEM FROM RESERVE
       * ==========================================================
       */

      case "gain-item-from-reserve": {
        const reserveItemIds =
          currentGame.board.assetReserve
            .filter(
              (asset) =>
                asset.type === "item" ||
                asset.type === "trinket",
            )
            .map(
              (asset) => asset.id,
            );

        if (
          reserveItemIds.length === 0
        ) {
          break;
        }

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "select-card",

            title:
              "Choose an Item Asset",

            message:
              "Choose an Item Asset from the Reserve.",

            cardIds:
              reserveItemIds,

            selectableCardIds:
              reserveItemIds,

            minSelections: 1,

            maxSelections: 1,

            selectedCardIds: [],

            onComplete:
              effects.slice(
                effectIndex + 1,
              ),

            source:
              "gain-item-from-reserve",
          },
        };

        return currentGame;
      }

      /*
       * ==========================================================
       * GAIN RANDOM ITEM FROM DECK
       * ==========================================================
       */

      case "gain-random-item": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const eligibleIndexes =
          currentGame.board.assetDeck
            .map(
              (
                asset,
                index,
              ) => ({
                asset,
                index,
              }),
            )
            .filter(
              ({ asset }) =>
                asset.type === "item" ||
                asset.type === "trinket",
            );

        if (
          eligibleIndexes.length === 0
        ) {
          break;
        }

        const selected =
          eligibleIndexes[
            Math.floor(
              Math.random() *
                eligibleIndexes.length,
            )
          ];

        if (!selected) {
          break;
        }

        const assetDeck = [
          ...currentGame.board.assetDeck,
        ];

        assetDeck.splice(
          selected.index,
          1,
        );

        currentGame = {
          ...currentGame,

          investigators: {
            ...currentGame.investigators,

            [investigatorId]: {
              ...investigator,

              assetIds: [
                ...investigator.assetIds,
                selected.asset.id,
              ],
            },
          },

          board: {
            ...currentGame.board,

            assetDeck,
          },
          cardRevealQueue: [
            ...(currentGame.cardRevealQueue ?? []),
            { id: selected.asset.id, kind: "Asset", name: selected.asset.name, image: selected.asset.image, description: selected.asset.description },
          ],
        };

        break;
      }

      /*
       * ==========================================================
       * GAIN ITEM(S)
       * ==========================================================
       */

      case "gain-item":
      case "gain-items": {
        const amount =
          effect.amount ?? 1;

        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        let assetDeck = [
          ...currentGame.board.assetDeck,
        ];

        const gainedAssetIds: string[] =
          [];

        for (
          let i = 0;
          i < amount;
          i++
        ) {
          const eligibleIndexes =
            assetDeck
              .map(
                (
                  asset,
                  index,
                ) => ({
                  asset,
                  index,
                }),
              )
              .filter(
                ({ asset }) =>
                  asset.type ===
                    "item" ||
                  asset.type ===
                    "trinket",
              );

          if (
            eligibleIndexes.length ===
            0
          ) {
            break;
          }

          const selected =
            eligibleIndexes[
              Math.floor(
                Math.random() *
                  eligibleIndexes.length,
              )
            ];

          if (!selected) {
            break;
          }

          assetDeck.splice(
            selected.index,
            1,
          );

          gainedAssetIds.push(
            selected.asset.id,
          );
        }

        if (
          gainedAssetIds.length > 0
        ) {
          currentGame = {
            ...currentGame,

            investigators: {
              ...currentGame.investigators,

              [investigatorId]: {
                ...investigator,

                assetIds: [
                  ...investigator.assetIds,
                  ...gainedAssetIds,
                ],
              },
            },

            board: {
              ...currentGame.board,

              assetDeck,
            },
            cardRevealQueue: [
              ...(currentGame.cardRevealQueue ?? []),
              ...gainedAssetIds.map((id) => {
                const asset = currentGame.board.assetDeck.find((card) => card.id === id);
                return { id, kind: "Asset" as const, name: asset?.name ?? "Asset", image: asset?.image, description: asset?.description };
              }),
            ],
          };
        }

        break;
      }

      /*
       * ==========================================================
       * GAIN WEAPON / ALLY / SERVICE
       * ==========================================================
       */

      case "gain-weapon":
      case "gain-ally":
      case "gain-service": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        let assetDeck = [
          ...currentGame.board.assetDeck,
        ];

        const eligibleIndexes =
          assetDeck
            .map(
              (
                asset,
                index,
              ) => ({
                asset,
                index,
              }),
            )
            .filter(
              ({ asset }) => {
                if (
                  effect.type ===
                  "gain-weapon"
                ) {
                  return asset.traits.includes(
                    "weapon",
                  );
                }

                if (
                  effect.type ===
                  "gain-ally"
                ) {
                  return (
                    asset.type ===
                    "ally"
                  );
                }

                return (
                  asset.type ===
                  "service"
                );
              },
            );

        if (
          eligibleIndexes.length > 0
        ) {
          const selected =
            eligibleIndexes[
              Math.floor(
                Math.random() *
                  eligibleIndexes.length,
              )
            ];

          if (selected) {
            assetDeck.splice(
              selected.index,
              1,
            );

            currentGame = {
              ...currentGame,

              investigators: {
                ...currentGame.investigators,

                [investigatorId]: {
                  ...investigator,

                  assetIds: [
                    ...investigator.assetIds,
                    selected.asset.id,
                  ],
                },
              },

              board: {
                ...currentGame.board,

                assetDeck,
              },
              cardRevealQueue: [
                ...(currentGame.cardRevealQueue ?? []),
                { id: selected.asset.id, kind: "Asset", name: selected.asset.name, image: selected.asset.image, description: selected.asset.description },
              ],
            };
          }
        }

        break;
      }

      /*
      * ==========================================================
      * DISCARD ALLY
      * ==========================================================
      *
      * Show the Allies currently owned by the investigator
      * and let the player choose one to discard.
      */

      case "discard-ally": {
          const investigator =
              currentGame.investigators[
                  investigatorId
              ];

          if (!investigator) {
              throw new Error(
                  `Investigator "${investigatorId}" does not exist.`,
              );
          }

          const allyIds =
              investigator.assetIds.filter(
                  (assetId) =>
                      currentGame.assets[
                          assetId
                      ]?.type === "ally",
              );

          /*
          * No Ally available.
          */

          if (allyIds.length === 0) {
              break;
          }

          /*
          * Pause the effect sequence and let
          * the player choose the Ally.
          */

          currentGame = {
              ...currentGame,

              pendingDecision: {
                  type: "select-card",

                  title:
                      "Choose an Ally",

                  message:
                      "Choose 1 Ally Asset to discard.",

                  cardIds:
                      allyIds,

                  selectableCardIds:
                      allyIds,

                  minSelections: 1,

                  maxSelections: 1,

                  selectedCardIds: [],

                  onComplete:
                      effects.slice(
                          effectIndex + 1,
                      ),

                  source:
                      "discard-ally",
              },
          };

          return currentGame;
      }

      /*
       * ==========================================================
       * DISCARD ITEM
       * ==========================================================
       */

      case "discard-item": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const amount =
          Math.max(
            1,
            effect.amount ?? 1,
          );

        const itemIds =
          investigator.assetIds.filter(
            (assetId) => {
              if (effect.assetId && assetId !== effect.assetId) return false;
              const asset =
                currentGame.assets[
                  assetId
                ];

              return (
                asset?.type === "item" ||
                asset?.type === "trinket"
              );
            },
          );

        if (itemIds.length === 0) {
          break;
        }

        const idsToDiscard =
          itemIds.slice(0, amount);

        const discardedAssets =
          idsToDiscard
            .map(
              (assetId) =>
                currentGame.assets[
                  assetId
                ],
            )
            .filter(
              (
                asset,
              ): asset is NonNullable<
                typeof asset
              > =>
                !!asset,
            );

        currentGame = {
          ...currentGame,

          investigators: {
            ...currentGame.investigators,

            [investigatorId]: {
              ...investigator,

              assetIds:
                investigator.assetIds.filter(
                  (id) =>
                    !idsToDiscard.includes(
                      id,
                    ),
                ),
            },
          },

          board: {
            ...currentGame.board,

            assetDiscard: [
              ...currentGame.board
                .assetDiscard,

              ...discardedAssets,
            ],
          },
        };

        break;
      }

      /*
       * ==========================================================
       * DISCARD MONSTER
       * ==========================================================
       *
       * No Monster specified:
       * choose one Monster anywhere.
       */

      case "discard-monster": {
        const monsterIds = (effect.monsterIds
          ? effect.monsterIds.map((id) => currentGame.monsters[id]).filter((monster) => !!monster?.spaceId).map((monster) => monster.id)
          : Object.values(currentGame.monsters)
            .filter(
              (monster) =>
                !!monster.spaceId,
            )
            .map(
              (monster) =>
                monster.id,
            ));

        if (
          monsterIds.length === 0
        ) {
          break;
        }

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "select-monster",

            title:
              "Choose a Monster",

            message:
              "Choose 1 Monster to discard.",

            monsterIds,

            onMonsterSelected: [
              {
                type:
                  "discard-selected-monster",
              },
            ],

            source:
              "encounter:discard-monster",
          },
        };

        return currentGame;
      }

      /*
       * ==========================================================
       * DISCARD SELECTED MONSTER
       * ==========================================================
       *
       * The actual selection is handled by
       * resolveEncounterMonsterSelection.
       */

      case "discard-selected-monster": {
        break;
      }

      /*
       * ==========================================================
       * LOSE MONSTER HEALTH
       * ==========================================================
       *
       * No Monster specified:
       * choose one Monster anywhere.
       */

      case "lose-monster-health": {
        const amount =
          effect.amount ?? 1;

        const monsterIds = effect.monsterIds
          ? effect.monsterIds.filter((id) => !!currentGame.monsters[id]?.spaceId)
          : Object.values(currentGame.monsters).filter((monster) => !!monster.spaceId).map((monster) => monster.id);

        if (
          monsterIds.length === 0
        ) {
          break;
        }

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "select-monster",

            title:
              "Choose a Monster",

            message:
              "Choose 1 Monster to lose Health.",

            monsterIds,

            onMonsterSelected: [
              {
                type:
                  "lose-selected-monster-health",

                amount,
              },
            ],

            source:
              "encounter:lose-monster-health",
          },
        };

        return currentGame;
      }

      /*
       * ==========================================================
       * LOSE SELECTED MONSTER HEALTH
       * ==========================================================
       */

      case "lose-selected-monster-health": {
        const amount =
          effect.amount ?? 1;

        const monsterId =
          effect.monsterIds?.[0];

        if (!monsterId) {
          throw new Error(
            "No Monster was selected.",
          );
        }

        const monster =
          currentGame.monsters[
            monsterId
          ];

        if (!monster) {
          throw new Error(
            `Monster "${monsterId}" does not exist.`,
          );
        }

        const newMonsterHealth =
          Math.max(
            0,
            monster.health - amount,
          );

        currentGame = {
          ...currentGame,

          monsters: {
            ...currentGame.monsters,

            [monsterId]: {
              ...monster,

              health:
                newMonsterHealth,
            },
          },

          epicMonstersDefeated:
            newMonsterHealth <= 0 &&
            monster.isEpic
              ? currentGame.epicMonstersDefeated.includes(
                  monster.definitionId,
                )
                ? currentGame.epicMonstersDefeated
                : [
                    ...currentGame.epicMonstersDefeated,
                    monster.definitionId,
                  ]
              : currentGame.epicMonstersDefeated,
        };

        break;
      }

      /*
       * ==========================================================
       * MOVE MONSTER
       * ==========================================================
       *
       * Choose one Monster anywhere on the board,
       * then choose its destination.
       */

      case "move-monster": {
        const monsterIds =
          Object.values(
            currentGame.monsters,
          )
            .filter(
              (monster) =>
                !!monster.spaceId,
            )
            .map(
              (monster) =>
                monster.id,
            );

        if (
          monsterIds.length === 0
        ) {
          break;
        }

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "select-monster",

            title:
              "Choose a Monster",

            message:
              "Choose 1 Monster to move.",

            monsterIds,

            onMonsterSelected: [
              {
                type:
                  "select-monster-destination",
              },
            ],

            source:
              "encounter:move-monster",
          },
        };

        return currentGame;
      }

      /*
       * ==========================================================
       * SELECT MONSTER DESTINATION
       * ==========================================================
       */

      case "select-monster-destination": {
        const monsterId =
          effect.monsterIds?.[0];

        if (!monsterId) {
          throw new Error(
            "No Monster was selected.",
          );
        }

        const monster =
          currentGame.monsters[
            monsterId
          ];

        if (!monster) {
          throw new Error(
            `Monster "${monsterId}" does not exist.`,
          );
        }

        if (!monster.spaceId) {
          throw new Error(
            `Monster "${monsterId}" is not on a space.`,
          );
        }

        const spaceIds =
          Object.keys(
            currentGame.board.spaces,
          ).filter(
            (spaceId) =>
              spaceId !==
              monster.spaceId,
          );

        if (
          spaceIds.length === 0
        ) {
          break;
        }

        const encounter =
          currentGame.currentEncounterId
            ? currentGame.encounters[
                currentGame.currentEncounterId
              ]
            : undefined;

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "select-space",

            title:
              encounter?.name ??
              "Choose a Destination",

            message:
              "Choose a space to move the Monster to.",

            image:
              encounter?.backImage ??
              encounter?.frontImage,

            spaceIds,

            onSpaceSelected: [
              {
                type:
                  "move-selected-monster",

                monsterIds: [
                  monsterId,
                ],
              },
            ],

            onComplete:
              effects.slice(
                effectIndex + 1,
              ),

            source:
              `encounter:move-monster:${monsterId}`,
          },
        };

        return currentGame;
      }

      /*
       * ==========================================================
       * MOVE SELECTED MONSTER
       * ==========================================================
       */

      case "move-selected-monster": {
        const monsterId =
          effect.monsterIds?.[0];

        if (!monsterId) {
          throw new Error(
            "No Monster was selected.",
          );
        }

        if (!effect.spaceId) {
          throw new Error(
            "Move selected Monster requires a destination space.",
          );
        }

        const monster =
          currentGame.monsters[
            monsterId
          ];

        if (!monster) {
          throw new Error(
            `Monster "${monsterId}" does not exist.`,
          );
        }

        const destinationSpace =
          currentGame.board.spaces[
            effect.spaceId
          ];

        if (!destinationSpace) {
          throw new Error(
            `Destination space "${effect.spaceId}" does not exist.`,
          );
        }

        const spaces = {
          ...currentGame.board.spaces,
        };

        /*
         * Remove Monster from current space.
         */

        if (monster.spaceId) {
          const currentSpace =
            spaces[monster.spaceId];

          if (currentSpace) {
            spaces[
              monster.spaceId
            ] = {
              ...currentSpace,

              monsterIds:
                currentSpace.monsterIds.filter(
                  (id) =>
                    id !== monsterId,
                ),
            };
          }
        }

        /*
         * Add Monster to destination.
         */

        spaces[
          effect.spaceId
        ] = {
          ...destinationSpace,

          monsterIds: [
            ...destinationSpace.monsterIds,
            monsterId,
          ],
        };

        currentGame = {
          ...currentGame,

          monsters: {
            ...currentGame.monsters,

            [monsterId]: {
              ...monster,

              spaceId:
                effect.spaceId,

              engagedInvestigatorId:
                null,
            },
          },

          board: {
            ...currentGame.board,

            spaces,
          },
        };

        break;
      }

      /*
       * ==========================================================
       * IMPROVE SKILL
       * ==========================================================
       */

      case "improve-skill": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const amount =
          effect.amount ?? 1;

        if (effect.skillType) {
          currentGame = improveInvestigatorSkill(
            currentGame,
            investigatorId,
            effect.skillType,
            amount,
          );

          break;
        }

        const improvableSkills = getImprovableSkills(investigator);
        if (improvableSkills.length === 0) break;

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "choice",

            title:
              "Improve a Skill",

            message:
              "Choose a skill to improve.",

            image:
              currentGame.currentEncounterId
                ? currentGame.encounters[
                    currentGame.currentEncounterId
                  ]?.backImage ??
                  currentGame.encounters[
                    currentGame.currentEncounterId
                  ]?.frontImage
                : undefined,

            options: improvableSkills.map((skill) => ({
              id: skill,
              title: `${skill[0].toUpperCase()}${skill.slice(1)}`,
              description: `Place or upgrade the ${skill} Improvement token.`,
            })),

            onComplete:
              effects.slice(
                effectIndex + 1,
              ),

            source:
              `improve-skill:${investigatorId}:${amount}`,
          },
        };

        return currentGame;
      }

      /*
      * ==========================================================
      * SPAWN GATE
      * ==========================================================
      *
      * Spawn a Gate at the investigator's current space.
      */

      case "spawn-gate": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        if (!investigator.spaceId) {
          throw new Error(
            `Investigator "${investigatorId}" is not on a space.`,
          );
        }

        const space =
          currentGame.board.spaces[
            investigator.spaceId
          ];

        if (!space) {
          throw new Error(
            `Space "${investigator.spaceId}" does not exist.`,
          );
        }

        /*
        * A Gate already exists at this space.
        * Do not create another one.
        */
        if (space.gates.length > 0) {
          break;
        }

        /*
        * ------------------------------------------------------------
        * DRAW GATE TOKEN
        * ------------------------------------------------------------
        */

        let gateStack = [
          ...currentGame.board.gateStack,
        ];

        let gateDiscard = [
          ...currentGame.board.gateDiscard,
        ];

        /*
        * If the Gate stack is empty,
        * recycle the Gate discard.
        */
        if (
          gateStack.length === 0 &&
          gateDiscard.length > 0
        ) {
          gateStack = [
            ...gateDiscard,
          ].sort(
            () => Math.random() - 0.5,
          );

          gateDiscard = [];
        }

        /*
        * No Gate token available.
        */
        if (gateStack.length === 0) {
          break;
        }

        const gateToken =
          gateStack.shift();

        if (!gateToken) {
          break;
        }

        /*
        * ------------------------------------------------------------
        * PLACE GATE
        * ------------------------------------------------------------
        *
        * The physical Gate token is placed at the investigator's
        * current space.
        *
        * We keep the token's omen/type information.
        */

        const placedGate = {
          ...gateToken,

          spaceId:
            investigator.spaceId,
        };

        currentGame = {
          ...currentGame,

          board: {
            ...currentGame.board,

            spaces: {
              ...currentGame.board.spaces,

              [investigator.spaceId]: {
                ...space,

                gates: [
                  ...space.gates,
                  placedGate,
                ],
              },
            },

            gateStack,

            gateDiscard,
          },
        };

        currentGame =
          spawnMonsterAtSpace(
            currentGame,
            investigator.spaceId,
          );

        break;
      }

      /*
       * ==========================================================
       * CLOSE GATE
       * ==========================================================
       */

      case "close-gate": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        if (!investigator.spaceId) {
          throw new Error(
            `Investigator "${investigatorId}" is not on a space.`,
          );
        }

        const space =
          currentGame.board.spaces[
            investigator.spaceId
          ];

        if (!space) {
          throw new Error(
            `Space "${investigator.spaceId}" does not exist.`,
          );
        }

        /*
        * ============================================================
        * FRACTURED REALITY
        * ============================================================
        *
        * If the investigator is resolving an Other World Encounter
        * through the Ancient Portal on Space 2 while Fractured
        * Reality is active, "close this Gate" solves the Rumor
        * instead of closing the Gate.
        */

        if (
          currentGame.currentEncounterFromFracturedReality
        ) {
          const fracturedReality =
            [
              ...easyMythos,
              ...normalMythos,
              ...hardMythos,
            ].find(
              (mythos) =>
                mythos.id ===
                "fractured-reality",
            );

          const fracturedRealityInPlay =
            currentGame.board.mythosInPlay.some(
              (entry) =>
                entry.definitionId ===
                "fractured-reality",
            );

          if (
            fracturedReality &&
            fracturedRealityInPlay
          ) {
            currentGame =
              solveMythosRumor(
                currentGame,
                fracturedReality,
              );

            break;
          }
        }

        /*
        * ============================================================
        * MYSTERIOUS LIGHTS
        * ============================================================
        *
        * While Mysterious Lights is in play,
        * Gates cannot be closed.
        */

        const mysteriousLightsInPlay =
          currentGame.board.mythosInPlay.some(
            (entry) =>
              entry.definitionId ===
              "mysterious-lights",
          );

        if (
          mysteriousLightsInPlay
        ) {
          break;
        }

        if (space.gates.length === 0) {
          break;
        }

        const closedGate =
          space.gates[0];

        if (!closedGate) {
          break;
        }

        currentGame = {
          ...currentGame,

          board: {
            ...currentGame.board,

            spaces: {
              ...currentGame.board.spaces,

              [investigator.spaceId]: {
                ...space,

                gates:
                  space.gates.slice(1),
              },
            },

            gateDiscard: [
              ...currentGame.board.gateDiscard,
              closedGate,
            ],
          },
        };

        if (
          currentGame.currentEncounterDeckType === "other-world" &&
          investigator.artifactIds.some(
            (artifactId) => currentGame.artifacts[artifactId]?.name === "Gate Box",
          )
        ) {
          const currentInvestigator = currentGame.investigators[investigatorId];
          if (currentInvestigator) {
            currentGame = gainInvestigatorClues(currentGame, investigatorId, 1);
          }
        }

        break;
      }

      /*
       * ==========================================================
       * ADVANCE OMEN
       * ==========================================================
       */

      case "advance-omen": {
        const wasAwakened =
          currentGame.ancientOne.awakened;

        currentGame = advanceOmen(
          currentGame,
          effect.amount ?? 1,
        );

        /*
        * Advancing the Omen can also advance Doom
        * because of matching Gates.
        *
        * If this causes the Ancient One to awaken
        * during an Encounter, resolve the Awakening
        * before continuing with the remaining effects.
        */
        if (
          !wasAwakened &&
          currentGame.ancientOne.awakened
        ) {
          return resolveAncientOneAwakening(
            currentGame,
            map,
            0,
            {
              type: "encounter",
              investigatorId,
              effects:
                effects.slice(
                  effectIndex + 1,
                ),
            },
          );
        }

        break;
      }

      case "return-random-solved-mystery-to-deck": {
        if (currentGame.mysteries.solvedMysteryIds.length === 0) break;
        currentGame = {
          ...currentGame,
          mysteries: returnRandomSolvedMysteryToDeck(currentGame.mysteries),
        };
        break;
      }

      case "move-omen": {
        currentGame = moveOmen(
          currentGame,
          effect.amount ?? 1,
        );

        break;
      }

      case "place-eldritch-token-on-omen": {
        currentGame =
          placeEldritchTokenOnOmen(
            currentGame,
            effect.amount ?? 1,
            effect.location,
          );

        break;
      }

      case "discard-eldritch-token-from-omen": {
        currentGame =
          discardEldritchTokenFromOmen(
            currentGame,
            effect.amount ?? 1,
          );

        break;
      }

      /*
       * ==========================================================
       * PLACE ELDRITCH TOKEN
       * ==========================================================
       */

      case "place-eldritch-token": {
        const amount =
          effect.amount ?? 1;

        /*
        * ==========================================================
        * YOG-SOTHOTH — FINAL MYSTERY
        * ==========================================================
        *
        * During The Key and the Gate, Eldritch Tokens belong
        * to the Final Mystery rather than the normal Ancient
        * One Eldritch Token counter.
        */

        if (
          currentGame.finalMystery?.id ===
          "yog-sothoth-the-key-and-the-gate"
        ) {
          const newTokenCount =
            currentGame.finalMystery
              .eldritchTokenCount +
            amount;

          const requiredTokens =
            Math.ceil(
              Object.keys(
                currentGame.investigators,
              ).length / 2,
            );

          currentGame = {
            ...currentGame,

            finalMystery: {
              ...currentGame.finalMystery,

              eldritchTokenCount:
                newTokenCount,
            },
          };

          if (
            newTokenCount >=
            requiredTokens
          ) {
            currentGame = {
              ...currentGame,

              status: "victory",
              activeInvestigatorId: null,
              pendingDecision: null,
              pendingEncounterChoice: null,
            };
          }

          break;
        }

        /*
        * ==========================================================
        * NORMAL ANCIENT ONE TOKEN
        * ==========================================================
        */

        currentGame = {
          ...currentGame,

          ancientOne: {
            ...currentGame.ancientOne,

            eldritchTokens:
              currentGame.ancientOne
                .eldritchTokens +
              amount,
          },
        };

        break;
      }

      /*
      * ==========================================================
      * DEVOURED
      * ==========================================================
      */

      case "devoured": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        currentGame =
          devourInvestigator(
            currentGame,
            map,
            investigatorId,
          );

        return currentGame;
      }

      /*
       * ==========================================================
       * BECOME DELAYED
       * ==========================================================
       */

      case "become-delayed": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        if (!effect.ignorePocketWatch && investigator.assetIds.some((assetId) => currentGame.assets[assetId]?.name === "Pocket Watch")) {
          return {
            ...currentGame,
            pendingDecision: {
              type: "choice",
              title: "Pocket Watch",
              message: "You cannot become Delayed unless you choose to.",
              options: [
                { id: "pocket-watch:delay", title: "Choose to become Delayed" },
                { id: "pocket-watch:prevent", title: "Prevent becoming Delayed" },
              ],
              source: `asset:pocket-watch:${investigatorId}`,
              onComplete: effects.slice(effectIndex + 1),
            },
          };
        }

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
       * ==========================================================
       * SELECT SPACE
       * ==========================================================
       */

      case "select-space": {
        if (
          !effect.spaceIds ||
          effect.spaceIds.length === 0
        ) {
          throw new Error(
            "Select Space requires at least one spaceId.",
          );
        }

        const encounter =
          currentGame.currentEncounterId
            ? currentGame.encounters[
                currentGame.currentEncounterId
              ]
            : undefined;

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "select-space",

            title:
              encounter?.name ??
              "Choose a Space",

            message:
              "Choose a space.",

            image:
              encounter?.backImage ??
              encounter?.frontImage,

            spaceIds:
              effect.spaceIds,

            onSpaceSelected:
              effect.onSpaceSelected ?? [],

            onComplete:
              effects.slice(
                effectIndex + 1,
              ),

            source:
              `encounter:${
                currentGame.currentEncounterId ??
                "unknown"
              }`,
          },
        };

        return currentGame;
      }

      /*
      * ==========================================================
      * SELECT GATE
      * ==========================================================
      */

      case "select-gate": {
        const gateIds = Object.entries(
          currentGame.board.spaces,
        )
          .filter(
            ([, space]) =>
              space.gates.length > 0,
          )
          .map(([spaceId]) => spaceId);

        if (gateIds.length === 0) {
          break;
        }

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "select-space",

            title: "Choose a Gate",

            message: "Choose 1 Gate to discard.",

            spaceIds: gateIds,

            onSpaceSelected:
              effect.onGateSelected ?? [],

            onComplete:
              effects.slice(effectIndex + 1),

            source: "encounter:select-gate",
          },
        };

        return currentGame;
      }

      /*
       * ==========================================================
       * SPAWN CLUES
       * ==========================================================
       */

      case "spawn-clues": {
        if (!effect.spaceId) {
          throw new Error(
            "Spawn Clues requires spaceId.",
          );
        }

        const space =
          currentGame.board.spaces[
            effect.spaceId
          ];

        if (!space) {
          throw new Error(
            `Space "${effect.spaceId}" does not exist.`,
          );
        }

        const amount =
          effect.amount ?? 1;

        currentGame = spawnCluesAtSpace(currentGame, effect.spaceId, amount);

        break;
      }

      /*
       * ==========================================================
       * CHOICE
       * ==========================================================
       */

      case "choice": {
        if (
          !effect.choices ||
          effect.choices.length === 0
        ) {
          throw new Error(
            "Encounter Choice requires at least one choice.",
          );
        }

        const encounter =
          currentGame.currentEncounterId
            ? currentGame.encounters[
                currentGame.currentEncounterId
              ]
            : undefined;

        currentGame = {
          ...currentGame,

          pendingEncounterChoice: {
            investigatorId,

            choices:
              effect.choices,

            afterChoice:
              effect.afterChoice ?? [],
          },

          pendingDecision: {
            type: "choice",

            title:
              encounter?.name ??
              "Encounter",

            message:
              encounter?.initialText ??
              encounter?.text ??
              "Choose how you want to proceed.",

            image:
              encounter?.backImage ??
              encounter?.frontImage,

            options:
              effect.choices.map(
                (
                  choice,
                  index,
                ) => ({
                  id:
                    String(index),

                  title:
                    choice.text ||
                    `Choice ${
                      index + 1
                    }`,

                  description:
                    "Choose this option to resolve the Encounter.",

                  requirement:
                    choice.requirement,
                }),
              ),

            onComplete:
              effects.slice(
                effectIndex + 1,
              ),

            source:
              `encounter:${
                currentGame.currentEncounterId ??
                "unknown"
              }`,
          },
        };

        return currentGame;
      }


      /*
       * ==========================================================
       * GAIN CLUE
       * ==========================================================
       *
       * Singular alias of gain-clues.
       */

      case "gain-clue": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        currentGame = gainEncounterClues(
          currentGame,
          investigatorId,
          effect.amount ?? 1,
        );

        break;
      }

      /*
       * ==========================================================
       * SPAWN MONSTER
       * ==========================================================
       *
       * Takes a physical Monster from the Monster Cup and places
       * it on a space.
       *
       * If monsterDefinitionId is provided, only Monsters with
       * that definition are eligible.
       *
       * location:
       * - "same-space" = investigator's current space
       * - omitted      = effect.spaceId, or investigator space
       */

      case "spawn-monster": {
        const amount =
          Math.max(
            1,
            effect.amount ?? 1,
          );

        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const destinationSpaceId =
          effect.spaceId ??
          investigator.spaceId;

        if (!destinationSpaceId) {
          throw new Error(
            `Investigator "${investigatorId}" has no current space.`,
          );
        }

        const destinationSpace =
          currentGame.board.spaces[
            destinationSpaceId
          ];

        if (!destinationSpace) {
          throw new Error(
            `Destination space "${destinationSpaceId}" does not exist.`,
          );
        }

        for (
          let i = 0;
          i < amount;
          i++
        ) {
          if (
            currentGame.board.monsterCup.length ===
            0
          ) {
            break;
          }

          currentGame =
            spawnMonsterAtSpace(
              currentGame,
              destinationSpaceId,
              effect.monsterDefinitionId,
            );
        }

        break;
      }

      /*
       * ==========================================================
       * MOVE MONSTER TO SPACE
       * ==========================================================
       *
       * Moves an existing Monster to a specific space.
       *
       * If monsterIds is already present, the Monster is moved
       * immediately.
       *
       * If monsterDefinitionId is present, the first matching
       * Monster on the board is moved.
       *
       * If neither is present, the player chooses a Monster.
       */

      case "move-monster-to-space": {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const selectedMonsterId =
          effect.monsterIds?.[0];

        let monsterId =
          selectedMonsterId;

        if (!monsterId &&
            effect.monsterDefinitionId) {
          monsterId =
            Object.values(
              currentGame.monsters,
            ).find(
              (monster) =>
                monster.spaceId !== null &&
                monster.definitionId ===
                  effect.monsterDefinitionId,
            )?.id;
        }

        /*
         * If no Monster was specified, let the player
         * choose one from the Monsters currently on the board.
         */

        if (!monsterId) {
          const monsterIds =
            Object.values(
              currentGame.monsters,
            )
              .filter(
                (monster) =>
                  !!monster.spaceId,
              )
              .map(
                (monster) =>
                  monster.id,
              );

          if (
            monsterIds.length === 0
          ) {
            break;
          }

          currentGame = {
            ...currentGame,

            pendingDecision: {
              type: "select-monster",

              title:
                "Choose a Monster",

              message:
                "Choose 1 Monster to move.",

              monsterIds,

              onMonsterSelected: [
                {
                  ...effect,

                  monsterIds: undefined,
                },
              ],

              onComplete:
                effects.slice(
                  effectIndex + 1,
                ),

              source:
                "encounter:move-monster-to-space",
            },
          };

          return currentGame;
        }

        const monster =
          currentGame.monsters[
            monsterId
          ];

        if (!monster) {
          throw new Error(
            `Monster "${monsterId}" does not exist.`,
          );
        }

        if (!monster.spaceId) {
          throw new Error(
            `Monster "${monsterId}" is not on the board.`,
          );
        }

        const destinationSpaceId =
          effect.spaceId ??
          investigator.spaceId;

        if (!destinationSpaceId) {
          throw new Error(
            "Move Monster to Space requires a destination space.",
          );
        }

        const destinationSpace =
          currentGame.board.spaces[
            destinationSpaceId
          ];

        if (!destinationSpace) {
          throw new Error(
            `Destination space "${destinationSpaceId}" does not exist.`,
          );
        }

        const spaces = {
          ...currentGame.board.spaces,
        };

        const oldSpace =
          spaces[monster.spaceId];

        if (oldSpace) {
          spaces[
            monster.spaceId
          ] = {
            ...oldSpace,

            monsterIds:
              oldSpace.monsterIds.filter(
                (id) =>
                  id !== monsterId,
              ),
          };
        }

        spaces[
          destinationSpaceId
        ] = {
          ...destinationSpace,

          monsterIds:
            destinationSpace.monsterIds.includes(
              monsterId,
            )
              ? destinationSpace.monsterIds
              : [
                  ...destinationSpace.monsterIds,
                  monsterId,
                ],
        };

        currentGame = {
          ...currentGame,

          monsters: {
            ...currentGame.monsters,

            [monsterId]: {
              ...monster,

              spaceId:
                destinationSpaceId,

              engagedInvestigatorId:
                null,
            },
          },

          board: {
            ...currentGame.board,

            spaces,
          },
        };

        break;
      }

      /*
      * ==========================================================
      * MOVE MONSTER TO INVESTIGATOR
      * ==========================================================
      *
      * Moves an existing Monster to the investigator's
      * current space without creating a new Monster.
      */

      case "move-monster-to-investigator": {
        const monsterId =
          effect.monsterIds?.[0];

        if (!monsterId) {
          throw new Error(
            "Move Monster to Investigator requires a monsterId.",
          );
        }

        const monster =
          currentGame.monsters[monsterId];

        if (!monster) {
          throw new Error(
            `Monster "${monsterId}" does not exist.`,
          );
        }

        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const destinationSpaceId:
          | string
          | undefined =
          effect.spaceId ??
          investigator.spaceId ??
          undefined;

        if (!destinationSpaceId) {
          throw new Error(
            `Investigator "${investigatorId}" has no current space.`,
          );
        }

        const destinationSpace =
          currentGame.board.spaces[
            destinationSpaceId
          ];

        if (!destinationSpace) {
          throw new Error(
            `Destination space "${destinationSpaceId}" does not exist.`,
          );
        }

        const spaces = {
          ...currentGame.board.spaces,
        };

        /*
        * Remove Monster from its current space.
        */

        if (monster.spaceId) {
          const currentSpace =
            spaces[monster.spaceId];

          if (currentSpace) {
            spaces[monster.spaceId] = {
              ...currentSpace,

              monsterIds:
                currentSpace.monsterIds.filter(
                  (id) =>
                    id !== monsterId,
                ),
            };
          }
        }

        /*
        * Add Monster to investigator's space.
        */

        if (
          !destinationSpace.monsterIds.includes(
            monsterId,
          )
        ) {
          spaces[destinationSpaceId] = {
            ...destinationSpace,

            monsterIds: [
              ...destinationSpace.monsterIds,
              monsterId,
            ],
          };
        }

        currentGame = {
          ...currentGame,

          monsters: {
            ...currentGame.monsters,

            [monsterId]: {
              ...monster,

              spaceId:
                destinationSpaceId,
            },
          },

          board: {
            ...currentGame.board,

            spaces,
          },
        };

        break;
      }

      /*
       * ==========================================================
       * COMBAT EXISTING MONSTER
       * ==========================================================
       *
       * Starts Combat against a physical Monster that is already
       * on the board.
       *
       * The Monster is NOT removed from the Monster Cup.
       */

      case "combat-existing-monster": {
        const monsterId =
          effect.monsterIds?.[0];

        if (!monsterId) {
          throw new Error(
            "Combat existing Monster requires a monsterId.",
          );
        }

        const monster =
          currentGame.monsters[monsterId];

        if (!monster) {
          throw new Error(
            `Monster "${monsterId}" does not exist.`,
          );
        }

        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        if (!investigator.spaceId) {
          throw new Error(
            `Investigator "${investigatorId}" is not on a space.`,
          );
        }

        if (
          monster.spaceId !==
          investigator.spaceId
        ) {
          throw new Error(
            `Monster "${monsterId}" is not in the investigator's space.`,
          );
        }

        currentGame = {
          ...currentGame,

          monsters: {
            ...currentGame.monsters,

            [monsterId]: {
              ...monster,

              engagedInvestigatorId:
                investigatorId,
            },
          },

          pendingDecision: {
            type: "combat",

            title:
              `Combat: ${monster.definitionId}`,

            message:
              "You are engaged with a Monster.",

            monsterId,

            onDefeat:
              effect.onDefeat ?? [],

            onNotDefeated:
              effect.onNotDefeated ?? [],

            source:
              `combat:${monsterId}`,
          },
        };

        break;
      }

      /*
       * ==========================================================
       * MOVE CLUE
       * ==========================================================
       */

      case "move-clue": {
        const fromSpaceId =
          effect.fromSpaceId ??
          currentGame.investigators[
            investigatorId
          ]?.spaceId;

        if (!fromSpaceId) {
          throw new Error(
            "Move Clue requires a source space.",
          );
        }

        currentGame = moveClue(
          currentGame,
          map,
          fromSpaceId,
          effect.targetSpaceType ??
            "sea",
        );

        if (
          currentGame.pendingDecision?.type === "select-space" &&
          currentGame.pendingDecision.resume?.type === "encounter-nearest-clue"
        ) {
          currentGame = {
            ...currentGame,
            pendingDecision: {
              ...currentGame.pendingDecision,
              onComplete: effects.slice(effectIndex + 1),
            },
          };
          return currentGame;
        }

        break;
      }

      /*
      * ==========================================================
      * SPAWN DARK YOUNG OR RANDOM MONSTER
      * ==========================================================
      *
      * If there is already a Dark Young on the board,
      * spawn a random Monster instead.
      *
      * Otherwise spawn a Dark Young.
      *
      * The spawned Monster immediately engages in combat.
      */

      case "spawn-dark-young-or-random-monster": {
          const DARK_YOUNG_DEFINITION_ID =
              "dark-young";

          const darkYoungAlreadyOnBoard =
              Object.values(
                  currentGame.monsters,
              ).some(
                  (monster) =>
                      monster.definitionId ===
                          DARK_YOUNG_DEFINITION_ID &&
                      !!monster.spaceId,
              );

          if (darkYoungAlreadyOnBoard) {
              /*
              * Dark Young already exists.
              * Spawn a random Monster instead.
              */

              if (
                  currentGame.board.monsterCup.length === 0
              ) {
                  break;
              }

              const randomIndex =
                  Math.floor(
                      Math.random() *
                          currentGame.board.monsterCup.length,
                  );

              const monster =
                  currentGame.board.monsterCup[
                      randomIndex
                  ];

              if (!monster) {
                  break;
              }

              currentGame =
                  startCombat(
                      currentGame,
                      investigatorId,
                      monster.definitionId,
                      effect.onDefeat ?? [],
                      effect.onNotDefeated ?? [],
                  );

              return currentGame;
          }

          /*
          * No Dark Young on the board.
          * Spawn and fight a Dark Young.
          */

          currentGame =
              startCombat(
                  currentGame,
                  investigatorId,
                  DARK_YOUNG_DEFINITION_ID,
                  effect.onDefeat ?? [],
                  effect.onNotDefeated ?? [],
              );

          return currentGame;
      }

      /*
      * ==========================================================
      * COMBAT RANDOM MONSTER
      * ==========================================================
      *
      * A Monster ambushes the investigator.
      * Choose one physical Monster at random
      * from the Monster Cup.
      */

      case "combat-random-monster": {
        if (
          currentGame.board.monsterCup.length === 0
        ) {
          break;
        }

        const randomIndex =
          Math.floor(
            Math.random() *
              currentGame.board.monsterCup.length,
          );

        const monster =
          currentGame.board.monsterCup[
            randomIndex
          ];

        if (!monster) {
          break;
        }

        currentGame =
          startCombat(
            currentGame,
            investigatorId,
            monster.definitionId,
            effect.onDefeat ?? [],
            effect.onNotDefeated ?? [],
            combatResume,
          );

        return currentGame;
      }

      /*
       * ==========================================================
       * COMBAT
       * ==========================================================
       */

      case "combat": {
        if (!effect.monsterDefinitionId) {
          throw new Error(
            "Combat effect requires a monsterDefinitionId.",
          );
        }

        currentGame = startCombat(
          currentGame,
          investigatorId,
          effect.monsterDefinitionId,
          effect.onDefeat ?? [],
          effect.onNotDefeated ?? [],
        );

        return currentGame;
      }

      /*
      * ==========================================================
      * CONDITIONAL
      * ==========================================================
      */

      case "conditional": {
        if (!effect.condition) {
          throw new Error(
            "Conditional effect requires a condition.",
          );
        }

        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        let conditionMet = false;

        switch (effect.condition.type) {
          case "has-spell":
            conditionMet =
              investigator.spellIds.length > 0;
            break;

          case "has-condition":
            if (
              !effect.condition.conditionDefinitionId
            ) {
              throw new Error(
                "has-condition requires conditionDefinitionId.",
              );
            }

            conditionMet =
              investigator.conditionIds.some(
                (conditionId) =>
                  currentGame.conditions[
                    conditionId
                  ]?.definitionId ===
                  effect.condition
                    ?.conditionDefinitionId,
              );
            break;

          case "has-monster": {
            if (
              !effect.condition.monsterDefinitionId
            ) {
              throw new Error(
                "has-monster requires monsterDefinitionId.",
              );
            }

            conditionMet =
              Object.values(
                currentGame.monsters,
              ).some(
                (monster) =>
                  monster.definitionId ===
                    effect.condition
                      ?.monsterDefinitionId &&
                  !!monster.spaceId,
              );

            break;
          }

          default:
            throw new Error(
              `Unsupported conditional type: ${effect.condition.type}`,
            );
        }

        const conditionalEffects =
          conditionMet
            ? effect.thenEffects ?? []
            : effect.elseEffects ?? [];

        if (conditionalEffects.length > 0) {
          currentGame =
            resolveEncounterEffects(
              currentGame,
              investigatorId,
              conditionalEffects,
              map,
            );
        }

        /*
        * If the conditional branch created a
        * pending decision, stop here.
        */

        if (
          currentGame.pendingDecision
        ) {
          return currentGame;
        }

        break;
      }

      /*
       * ==========================================================
       * ROLL SINGLE DIE
       * ==========================================================
       *
       * Rolls exactly 1 die.
       *
       * The actual roll is performed by the UI because the
       * result must be displayed to the player.
       *
       * 1–2:
       *   -> onOneOrTwo
       *
       * 3–6:
       *   -> onThreeToSix
       *
       * After the result, the remaining effects continue
       * through onComplete.
       */

      case "roll-single-die": {
        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "single-die-roll",

            title:
              currentGame.currentEncounterId
                ? currentGame.encounters[
                    currentGame.currentEncounterId
                  ]?.name ??
                  "Roll 1 Die"
                : "Roll 1 Die",

            message:
              "Roll 1 die.",

            image:
              currentGame.currentEncounterId
                ? currentGame.encounters[
                    currentGame.currentEncounterId
                  ]?.backImage ??
                  currentGame.encounters[
                    currentGame.currentEncounterId
                  ]?.frontImage
                : undefined,

            investigatorId,

            onOneOrTwo:
              effect.onOneOrTwo ?? [],

            onThreeToSix:
              effect.onThreeToSix ?? [],

            onComplete:
              effects.slice(
                effectIndex + 1,
              ),

            source:
              "encounter:single-die-roll",
          },
        };

        return currentGame;
      }

      /*
       * ==========================================================
       * TEST
       * ==========================================================
       */

      case "test": {
        if (!effect.testType) {
          throw new Error(
            "Encounter Test requires testType.",
          );
        }

        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
          );
        }

        const encounter =
          currentGame.currentEncounterId
            ? currentGame.encounters[
                currentGame.currentEncounterId
              ]
            : undefined;

        /*
         * ========================================================
         * ENCOUNTER CARD IMAGE
         * ========================================================
         *
         * For Tests we want to show the actual Encounter card,
         * where the player can see the text, actions and tests.
         *
         * frontImage = actual Encounter card
         * backImage  = card back / generic Encounter back
         */

        const encounterImage =
          encounter?.backImage;

        /*
         * ========================================================
         * CREATE PENDING TEST
         * ========================================================
         *
         * The Test itself does NOT resolve onSuccess / onFail yet.
         *
         * Those effects are stored in the pending decision and
         * will only be resolved after the dice result is shown.
         */

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "test",

            title:
              encounter?.name ??
              "Encounter Test",

            message:
              effect.testText ??
              encounter?.text ??
              encounter?.initialText ??
              "Roll the required test to resolve this Encounter.",

            image:
              encounterImage,

            skill:
              effect.testType,

            modifier:
              effect.modifier ?? 0,

            investigatorId,

            onSuccess:
              effect.onSuccess ?? [],

            onFail:
              effect.onFail ?? [],

            minSuccesses:
              effect.minSuccesses,

            /*
             * Effects that appear after this Test.
             *
             * Example:
             *
             * Test Observation
             *      ↓
             * Test Will
             *
             * The Test result screen will resolve:
             *
             * onSuccess / onFail
             * +
             * onComplete
             */

            onComplete:
              effects.slice(
                effectIndex + 1,
              ),

            source:
              `encounter:${
                currentGame.currentEncounterId ??
                "unknown"
              }`,
          },
        };

        return currentGame;
      }

      /*
       * ==========================================================
       * ADVANCE DOOM
       * ==========================================================
       *
       * Reduce Doom by the specified amount.
       * Used by effects that explicitly reduce Doom.
       */

      case "advance-doom": {
        const amount =
          effect.amount ?? 1;

        const wasAwakened =
          currentGame.ancientOne.awakened;

        currentGame =
          advanceDoom(
            currentGame,
            amount,
          );

        /*
        * If Doom reached 0 during an Encounter,
        * resolve the Ancient One Awakening immediately.
        *
        * The effects after this Advance Doom effect
        * must be resumed after the Awakening.
        */
        if (
          !wasAwakened &&
          currentGame.ancientOne.awakened
        ) {
          return resolveAncientOneAwakening(
            currentGame,
            map,
            0,
            {
              type: "encounter",
              investigatorId,
              effects:
                effects.slice(
                  effectIndex + 1,
                ),
            },
          );
        }

        break;
      }

      case "retreat-doom": {
        const amount =
          effect.amount ?? 1;

        currentGame =
          retreatDoom(
            currentGame,
            amount,
          );

        break;
      }

      /*
      * ==========================================================
      * START OTHER WORLD ENCOUNTER
      * ==========================================================
      */

      case "start-other-world-encounter": {
        currentGame =
          startOtherWorldEncounter(
            currentGame,
            map,
          );

        return currentGame;
      }

      case "solve-mythos-rumor": {
        if (!effect.mythosId) {
          throw new Error(
            "Solve Mythos Rumor requires mythosId.",
          );
        }

        const mythos =
          [
            ...easyMythos,
            ...normalMythos,
            ...hardMythos,
          ].find(
            (definition) =>
              definition.id ===
              effect.mythosId,
          );

        if (!mythos) {
          throw new Error(
            `Mythos "${effect.mythosId}" does not exist.`,
          );
        }

        currentGame =
          solveMythosRumor(
            currentGame,
            mythos,
          );

        break;
      }

      /*
       * ==========================================================
       * UNSUPPORTED EFFECT
       * ==========================================================
       */

      default: {
        throw new Error(
          `Unsupported Encounter effect: ${effect.type}`,
        );
      }
    }
  }

  return currentGame;
}
