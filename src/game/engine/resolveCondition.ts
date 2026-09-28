import type { GameState } from "../models/GameState";

import {
  coreConditionDefinitions,
} from "../../content/core/coreConditions";

import { coreMaps } from "../../content/core/maps";

import { gainCondition } from "./gainCondition";
import { discardCondition } from "./discardCondition";
import { advanceDoom } from "./doomEngine";
import { findNearestCity } from "./findNearestCity";
import { advanceOmen } from "./omenEngine";
import { spawnMythosGates } from "./spawnMythosGates";
import { defeatInvestigator } from "./defeatInvestigator";
import { resolveEncounterEffects } from "./resolveEncounterEffects";
import { devourInvestigator } from "./devourInvestigator";

export function resolveCondition(
  game: GameState,
  investigatorId: string,
  conditionId: string,
): GameState {
  /*
   * ============================================================
   * FIND INVESTIGATOR
   * ============================================================
   */

  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * FIND CONDITION
   * ============================================================
   */

  const condition =
    game.conditions[conditionId];

  if (!condition) {
    throw new Error(
      `Condition "${conditionId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * CHECK OWNERSHIP
   * ============================================================
   */

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
   * CONDITION MUST BE FLIPPED
   * ============================================================
   */

  if (!condition.flipped) {
    throw new Error(
      "Condition must be flipped before it can be resolved.",
    );
  }

  /*
   * ============================================================
   * FIND CONDITION DEFINITION
   * ============================================================
   */

  const definition =
    coreConditionDefinitions.find(
      (item) =>
        item.id ===
        condition.definitionId,
    );

  if (!definition) {
    throw new Error(
      `Condition definition "${condition.definitionId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * FIND SPECIFIC BACK
   * ============================================================
   */

  const back =
    definition.backs.find(
      (item) =>
        item.id === condition.backId,
    );

  if (!back) {
    throw new Error(
      `Condition back "${condition.backId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * CURRENT GAME
   * ============================================================
   */

  let currentGame = game;

  /*
   * ============================================================
   * INVESTIGATOR STATE
   * ============================================================
   */

  let health =
    investigator.health;

  let sanity =
    investigator.sanity;

  let isDelayed =
    investigator.isDelayed;

  let clues =
    investigator.clues;

  let assetIds = [
    ...investigator.assetIds,
  ];

  /*
   * ============================================================
   * CONDITION STATE
   * ============================================================
   */

  let flipped: boolean =
    condition.flipped;

  /*
   * ============================================================
   * SHOULD DISCARD
   * ============================================================
   */

  let shouldDiscard = false;
  let gainedAssetId: string | null = null;

  const commitProgress = (): GameState => {
    let next: GameState = {
      ...currentGame,
      conditions: {
        ...currentGame.conditions,
        [conditionId]: { ...currentGame.conditions[conditionId], flipped },
      },
      investigators: {
        ...currentGame.investigators,
        [investigatorId]: {
          ...currentGame.investigators[investigatorId],
          health, sanity, clues, assetIds, isDelayed,
        },
      },
    };
    if (shouldDiscard) next = discardCondition(next, investigatorId, conditionId);
    return next;
  };

  /*
   * ============================================================
   * FIND MAP
   * ============================================================
   */

  const map =
    coreMaps.find(
      (item) =>
        item.id === game.scenarioId,
    );

  if (!map) {
    throw new Error(
      `Map "${game.scenarioId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * FIND CURRENT SPACE
   * ============================================================
   */

  const currentSpace =
    map.spaces.find(
      (space) =>
        space.id === investigator.spaceId,
    );

  if (
    investigator.spaceId !== null &&
    !currentSpace
  ) {
    throw new Error(
      `Map space "${investigator.spaceId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * APPLY BACK EFFECTS
   * ============================================================
   */

  for (const effect of back.effects) {
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
        health = Math.max(
          0,
          health - effect.amount,
        );

        break;
      }

      /*
       * --------------------------------------------------------
       * LOSE SANITY
       * --------------------------------------------------------
       */

      case "lose-sanity": {
        sanity = Math.max(
          0,
          sanity - effect.amount,
        );

        break;
      }

      /*
       * --------------------------------------------------------
       * RECOVER HEALTH
       * --------------------------------------------------------
       */

      case "recover-health": {
        health = Math.min(
          investigator.maxHealth,
          health + effect.amount,
        );

        break;
      }

      /*
       * --------------------------------------------------------
       * RECOVER SANITY
       * --------------------------------------------------------
       */

      case "recover-sanity": {
        sanity = Math.min(
          investigator.maxSanity,
          sanity + effect.amount,
        );

        break;
      }

      /*
       * --------------------------------------------------------
       * BECOME DELAYED
       * --------------------------------------------------------
       */

      case "become-delayed": {
        isDelayed = true;

        break;
      }

      /*
       * --------------------------------------------------------
       * GAIN CLUES
       * --------------------------------------------------------
       */

      case "gain-clues": {
        clues += effect.amount;

        break;
      }

      /*
       * --------------------------------------------------------
       * DISCARD ALL CLUES
       * --------------------------------------------------------
       */

      case "discard-all-clues": {
        clues = 0;

        break;
      }

      /*
       * --------------------------------------------------------
       * FLIP SELF
       * --------------------------------------------------------
       *
       * The card is currently on its back.
       * flip-self returns it to the front.
       */

      case "flip-self": {
        flipped = false;

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
       * ========================================================
       * ASSETS
       * ========================================================
       */

      /*
       * --------------------------------------------------------
       * DISCARD ITEM
       * --------------------------------------------------------
       */

      case "discard-item": {
        let remaining =
          effect.amount;

        const discardedAssets: string[] =
          [];

        for (const assetId of assetIds) {
          if (remaining <= 0) {
            break;
          }

          const asset =
            currentGame.assets[assetId];

          if (!asset) {
            continue;
          }

          if (
            asset.type !== "item"
          ) {
            continue;
          }

          discardedAssets.push(
            assetId,
          );

          remaining--;
        }

        assetIds =
          assetIds.filter(
            (id) =>
              !discardedAssets.includes(
                id,
              ),
          );

        currentGame = {
          ...currentGame,

          board: {
            ...currentGame.board,

            assetDiscard: [
              ...currentGame.board
                .assetDiscard,

              ...discardedAssets.map(
                (id) =>
                  currentGame.assets[
                    id
                  ],
              ),
            ],
          },
        };

        break;
      }

      /*
       * --------------------------------------------------------
       * DISCARD ALL BUT ITEMS
       * --------------------------------------------------------
       *
       * Keep "effect.keep" Item possessions.
       * All other Assets are discarded.
       */

      case "discard-all-but-items": {
        const items: string[] = [];
        const discarded: string[] = [];

        for (const assetId of assetIds) {
          const asset =
            currentGame.assets[assetId];

          if (!asset) {
            continue;
          }

          if (
            asset.type === "item" &&
            items.length < effect.keep
          ) {
            items.push(assetId);
          } else {
            discarded.push(assetId);
          }
        }

        assetIds = items;

        currentGame = {
          ...currentGame,

          board: {
            ...currentGame.board,

            assetDiscard: [
              ...currentGame.board
                .assetDiscard,

              ...discarded.map(
                (id) =>
                  currentGame.assets[
                    id
                  ],
              ),
            ],
          },
        };

        break;
      }

      /*
       * --------------------------------------------------------
       * DISCARD ALLY ASSET
       * --------------------------------------------------------
       */

      case "discard-ally-asset": {
        const allyId =
          assetIds.find(
            (assetId) => {
              const asset =
                currentGame.assets[
                  assetId
                ];

              return (
                asset?.type === "ally"
              );
            },
          );

        if (allyId) {
          assetIds =
            assetIds.filter(
              (id) =>
                id !== allyId,
            );

          currentGame = {
            ...currentGame,

            board: {
              ...currentGame.board,

              assetDiscard: [
                ...currentGame.board
                  .assetDiscard,

                currentGame.assets[
                  allyId
                ],
              ],
            },
          };
        }

        break;
      }

      /*
       * ========================================================
       * MAP
       * ========================================================
       */

      /*
       * --------------------------------------------------------
       * LOSE SANITY IF ON CITY
       * --------------------------------------------------------
       */

      case "lose-sanity-if-on-city": {
        if (
          currentSpace?.type ===
          "city"
        ) {
          sanity = Math.max(
            0,
            sanity - effect.amount,
          );
        }

        break;
      }

      /*
       * --------------------------------------------------------
       * IF ON SEA SPACE
       * --------------------------------------------------------
       *
       * Nested effects will be implemented when the
       * generic back-effect resolver is extracted.
       */

      case "if-on-sea-space": {
        if (currentSpace?.type === "sea") {
          const devoured =
            effect.effects.some(
              (nested) =>
                nested.type === "devoured",
            );

          if (devoured) {
            return devourInvestigator(
              currentGame,
              map,
              investigatorId,
            );
          }
        } else {
          for (
            const nested of
              effect.otherwise
          ) {
            if (
              nested.type ===
              "lose-health"
            ) {
              health = Math.max(
                0,
                health - nested.amount,
              );
            }

            if (
              nested.type ===
              "discard-self"
            ) {
              shouldDiscard = true;
            }
          }
        }

        break;
      }

      /*
       * --------------------------------------------------------
       * MOVE TO NEAREST CITY
       * --------------------------------------------------------
       */

      case "move-to-nearest-city": {
        if (!investigator.spaceId) {
          break;
        }

        const nearestCityId =
          findNearestCity(
            map,
            investigator.spaceId,
          );

        if (nearestCityId) {
          currentGame = {
            ...currentGame,

            investigators: {
              ...currentGame.investigators,

              [investigatorId]: {
                ...currentGame.investigators[
                  investigatorId
                ],

                spaceId:
                  nearestCityId,
              },
            },
          };
        }

        break;
      }

      case "discard-monster": {
        const monsterIds: string[] = [];

        for (
          const space of Object.values(
            currentGame.board.spaces,
          )
        ) {
          monsterIds.push(
            ...space.monsterIds,
          );
        }

        if (monsterIds.length === 0) {
          break;
        }

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "select-monster",

            title: "Discard a Monster",

            message:
              "Choose 1 Monster to discard.",

            monsterIds,

            onMonsterSelected: [],

            source:
              `encounter:${currentGame.currentEncounterId ?? "unknown"}`,
          },
        };

        return currentGame;
      }

      case "advance-doom": {
        currentGame =
          advanceDoom(
            currentGame,
            effect.amount,
          );

        break;
      }

      case "fail-choice": {
        if (
          effect.choice.type !==
          "discard-ally"
        ) {
          throw new Error(
            `Unsupported fail-choice type "${effect.choice.type}".`,
          );
        }

        const allyIds =
          assetIds.filter(
            (assetId) =>
              currentGame.assets[
                assetId
              ]?.type === "ally",
          );

        /*
        * If the investigator has no Ally,
        * resolve the "otherwise" effects immediately.
        */

        if (allyIds.length === 0) {
          for (
            const otherwiseEffect of
              effect.otherwise
          ) {
            /*
            * We cannot recursively call resolveCondition
            * here because the current Condition is already
            * being resolved.
            *
            * For the current Debt effect, the otherwise
            * effects are handled explicitly below.
            */

            switch (
              otherwiseEffect.type
            ) {
              case "move-to-nearest-city": {
                if (
                  investigator.spaceId === null
                ) {
                  break;
                }

                /*
                * Breadth-first search.
                *
                * Procura a City mais próxima através
                * das ligações do mapa.
                */

                const queue: string[] = [
                  investigator.spaceId,
                ];

                const visited =
                  new Set<string>();

                let nearestCityId:
                  | string
                  | null = null;

                while (
                  queue.length > 0
                ) {
                  const spaceId =
                    queue.shift()!;

                  if (
                    visited.has(spaceId)
                  ) {
                    continue;
                  }

                  visited.add(spaceId);

                  const space =
                    map.spaces.find(
                      (item) =>
                        item.id === spaceId,
                    );

                  if (!space) {
                    continue;
                  }

                  if (
                    space.type === "city"
                  ) {
                    nearestCityId =
                      space.id;

                    break;
                  }

                  for (
                    const nextId of
                      space.connectedSpaceIds
                  ) {
                    if (
                      !visited.has(nextId)
                    ) {
                      queue.push(nextId);
                    }
                  }
                }

                if (nearestCityId) {
                  currentGame = {
                    ...currentGame,

                    investigators: {
                      ...currentGame.investigators,

                      [investigatorId]: {
                        ...currentGame.investigators[
                          investigatorId
                        ],

                        spaceId:
                          nearestCityId,
                      },
                    },
                  };
                }

                break;
              }

              case "gain-condition": {
                currentGame =
                  gainCondition(
                    currentGame,
                    investigatorId,
                    otherwiseEffect.conditionDefinitionId,
                  );

                break;
              }

              default:
                throw new Error(
                  `Unsupported fail-choice otherwise effect "${otherwiseEffect.type}".`,
                );
            }
          }

          break;
        }

        /*
        * The investigator has at least one Ally.
        *
        * The player must decide whether to discard one.
        */

        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "select-card",

            title:
              "Discard an Ally?",

            message:
              "Discard 1 Ally to avoid moving to the nearest City and gaining Detained.",

            cardIds: allyIds,

            selectableCardIds:
              allyIds,

            minSelections: 0,

            maxSelections: 1,

            selectedCardIds: [],

            source:
              `condition:fail-choice:${investigatorId}:${conditionId}`,
          },
        };

        return currentGame;
      }

      /* Special backs with tests, combat, and player choices. */

      case "discard-gained-asset": {
        if (!gainedAssetId || !assetIds.includes(gainedAssetId)) break;
        const gainedAsset = currentGame.assets[gainedAssetId];
        assetIds = assetIds.filter((id) => id !== gainedAssetId);
        if (gainedAsset) currentGame = { ...currentGame, board: { ...currentGame.board, assetDiscard: [...currentGame.board.assetDiscard, gainedAsset] } };
        break;
      }

      case "on-monster-ambush": {
        if (!investigator.spaceId) break;
        if (currentGame.board.monsterCup.length === 0) {
          flipped = false;
          break;
        }
        flipped = false;
        currentGame = commitProgress();
        return resolveEncounterEffects(currentGame, investigatorId, [{ type: "combat-random-monster" }], map);
      }

      case "devoured": {
        return devourInvestigator(
          currentGame,
          map,
          investigatorId,
        );
      }

      case "devour-other-investigator": {
        const otherIds = currentGame.investigatorOrder.filter((id) => id !== investigatorId && !currentGame.investigators[id]?.isDefeated);
        if (otherIds.length === 0) break;
        currentGame = { ...currentGame, pendingDecision: {
          type: "choice", title: "One of the Thousand", message: "Choose another investigator to be devoured.",
          image: back.backImage,
          options: otherIds.map((id) => ({ id: `condition:devour-other:${investigatorId}:${conditionId}:${id}`, title: currentGame.investigators[id]?.definitionId ?? id, description: "This investigator is devoured." })),
          source: `condition:devour-other:${investigatorId}:${conditionId}`,
        } };
        return commitProgress();
      }

      case "spend-clue-or-test": {
        currentGame = {
          ...currentGame,

          pendingDecision: {
            type: "choice",

            title:
              back.id.startsWith("detained-back")
                ? "Detained"
                : definition.name,

            message: `Spend ${effect.amount} Clue${
              effect.amount === 1 ? "" : "s"
            } or take a ${effect.testType} test (${
              effect.modifier >= 0 ? "+" : ""
            }${effect.modifier}).`,

            image: back.backImage,

            options: [
              {
                id: `condition:spend-clue:${investigatorId}:${conditionId}`,

                title: `Spend ${effect.amount} Clue${
                  effect.amount === 1 ? "" : "s"
                }`,

                description:
                  `Spend ${effect.amount} Clue${
                    effect.amount === 1 ? "" : "s"
                  } to resolve this Condition.`,
              },

              {
                id: `condition:test:${investigatorId}:${conditionId}`,

                title:
                  `Take ${effect.testType} test`,

                description:
                  `Take a ${effect.testType} test (${
                    effect.modifier >= 0 ? "+" : ""
                  }${effect.modifier}).`,
              },
            ],

            source:
              `condition:spend-clue-or-test:${investigatorId}:${conditionId}`,
          },
        };

        return currentGame;
      }

      case "choose-gain-condition-or": {
        currentGame = { ...currentGame, pendingDecision: {
          type: "choice", title: "Make a Deal", message: `Gain ${coreConditionDefinitions.find((d) => d.id === effect.conditionDefinitionId)?.name ?? "the offered Condition"}, or advance Doom by 1.`, image: back.backImage,
          options: [
            { id: `condition:deal:gain:${investigatorId}:${conditionId}`, title: "Accept the Deal", description: "Gain the offered Condition." },
            { id: `condition:deal:refuse:${investigatorId}:${conditionId}`, title: "Refuse", description: "Advance Doom by 1." },
          ],
          source: `condition:deal:${investigatorId}:${conditionId}:${effect.conditionDefinitionId}`,
        } };
        return commitProgress();
      }

      case "gain-random-item-and-test": {
        const eligible = currentGame.board.assetDeck.map((asset, index) => ({ asset, index })).filter(({ asset }) => asset.type === "item");
        const selected = eligible[Math.floor(Math.random() * eligible.length)];
        if (!selected) { shouldDiscard = true; break; }
        gainedAssetId = selected.asset.id;
        assetIds = [...assetIds, selected.asset.id];
        const assetDeck = [...currentGame.board.assetDeck];
        assetDeck.splice(selected.index, 1);
        const latest = currentGame.investigators[investigatorId];
        if (!latest) break;
        currentGame = { ...currentGame, board: { ...currentGame.board, assetDeck }, investigators: { ...currentGame.investigators,
          [investigatorId]: { ...latest, assetIds: [...latest.assetIds, selected.asset.id] } },
          cardRevealQueue: [...(currentGame.cardRevealQueue ?? []), { id: selected.asset.id, kind: "Asset", name: selected.asset.name, image: selected.asset.image, description: selected.asset.description }],
        };
        currentGame = commitProgress();
        currentGame = discardCondition(currentGame, investigatorId, conditionId);
        return { ...currentGame, pendingDecision: {
          type: "test", title: "Kleptomania", message: `Test ${effect.testType}. You need at least ${selected.asset.value} success${selected.asset.value === 1 ? "" : "es"}.`,
          skill: effect.testType, modifier: 0, minSuccesses: selected.asset.value, investigatorId,
          onSuccess: [],
          onFail: [ { type: "discard-item", amount: 1, assetId: selected.asset.id }, { type: "gain-condition", conditionDefinitionId: "condition-detained" } ],
          image: back.backImage, source: `condition:kleptomania:${investigatorId}`,
        } };
      }

      case "become-delayed-or-flip": {
        currentGame = { ...currentGame, pendingDecision: {
          type: "choice", title: "Leg Injury", message: "Become Delayed or flip this Condition.", image: back.backImage,
          options: [
            { id: `condition:leg-injury:delayed:${investigatorId}:${conditionId}`, title: "Become Delayed", description: "Become Delayed and discard this Condition." },
            { id: `condition:leg-injury:flip:${investigatorId}:${conditionId}`, title: "Flip the Condition", description: "Return it to its front." },
          ], source: `condition:leg-injury:${investigatorId}:${conditionId}`,
        } };
        return commitProgress();
      }

      case "lose-health-unless-delayed": {
        if (!isDelayed) health = Math.max(0, health - effect.amount);
        break;
      }

      case "advance-omen": {
        currentGame = advanceOmen(currentGame, effect.amount);
        break;
      }

      case "spawn-gates-per-spell": {
        const spellCount = currentGame.investigators[investigatorId]?.spellIds.length ?? 0;
        if (spellCount > 0) currentGame = spawnMythosGates(currentGame, 0, spellCount, false);
        break;
      }

      case "other-investigators-on-space-lose-health": {
        if (!investigator.spaceId) break;
        for (const otherId of currentGame.investigatorOrder) {
          if (otherId === investigatorId) continue;
          const other = currentGame.investigators[otherId];
          if (!other || other.spaceId !== investigator.spaceId || other.isDefeated) continue;
          const nextHealth = Math.max(0, other.health - effect.amount);
          currentGame = { ...currentGame, investigators: { ...currentGame.investigators, [otherId]: { ...other, health: nextHealth } } };
          if (nextHealth === 0) currentGame = defeatInvestigator(currentGame, map, otherId);
        }
        break;
      }

      /*
       * --------------------------------------------------------
       * SAFETY CHECK
       * --------------------------------------------------------
       */

      default: {
        const exhaustiveCheck: never =
          effect;

        throw new Error(
          `Unsupported condition effect: ${exhaustiveCheck}`,
        );
      }
    }
  }

  /*
   * ============================================================
   * UPDATE CONDITION STATE
   * ============================================================
   */

  currentGame = {
    ...currentGame,

    conditions: {
      ...currentGame.conditions,

      [conditionId]: {
        ...currentGame.conditions[
          conditionId
        ],

        flipped,
      },
    },
  };

  /*
   * ============================================================
   * UPDATE INVESTIGATOR STATE
   * ============================================================
   */

  currentGame = {
    ...currentGame,

    investigators: {
      ...currentGame.investigators,

      [investigatorId]: {
        ...currentGame.investigators[
          investigatorId
        ],

        health,
        sanity,
        clues,
        assetIds,
        isDelayed,
      },
    },
  };

  /*
   * ============================================================
   * DISCARD ONLY WHEN EXPLICITLY REQUESTED
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

  if (health <= 0 && !currentGame.investigators[investigatorId]?.isDefeated) {
    return defeatInvestigator(currentGame, map, investigatorId);
  }

  /*
   * ============================================================
   * RETURN UPDATED GAME
   * ============================================================
   */

  return currentGame;
}
