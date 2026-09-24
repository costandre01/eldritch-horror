import type { GameState } from "../models/GameState";

import {
  coreConditionDefinitions,
} from "../../content/core/coreConditions";

import { coreMaps } from "../../content/core/maps";

import { gainCondition } from "./gainCondition";
import { discardCondition } from "./discardCondition";
import { advanceDoom } from "./doomEngine";
import { findNearestCity } from "./findNearestCity";

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
        /*
         * The effect contains nested effects.
         *
         * We currently only resolve the condition itself
         * here. The generic recursive resolver should be
         * extracted before relying on complex nested effects.
         */

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

      /*
       * ========================================================
       * NOT IMPLEMENTED YET
       * TODO
       * ========================================================
       *
       * These effects require systems that we have not created
       * yet, such as Monsters, Tests or player Choices.
       */

      case "discard-gained-asset": {
        throw new Error(
          "Effect 'discard-gained-asset' is not implemented yet.",
        );
      }

      case "on-monster-ambush": {
        throw new Error(
          "Effect 'on-monster-ambush' is not implemented yet.",
        );
      }

      case "devoured": {
        throw new Error(
          "Effect 'devoured' is not implemented yet.",
        );
      }

      case "devour-other-investigator": {
        throw new Error(
          "Effect 'devour-other-investigator' is not implemented yet.",
        );
      }

      case "spend-clue-or-test": {
        throw new Error(
          "Effect 'spend-clue-or-test' is not implemented yet.",
        );
      }

      case "choose-gain-condition-or": {
        throw new Error(
          "Effect 'choose-gain-condition-or' is not implemented yet.",
        );
      }

      case "gain-random-item-and-test": {
        throw new Error(
          "Effect 'gain-random-item-and-test' is not implemented yet.",
        );
      }

      case "become-delayed-or-flip": {
        throw new Error(
          "Effect 'become-delayed-or-flip' is not implemented yet.",
        );
      }

      case "lose-health-unless-delayed": {
        throw new Error(
          "Effect 'lose-health-unless-delayed' is not implemented yet.",
        );
      }

      case "advance-omen": {
        throw new Error(
          "Effect 'advance-omen' is not implemented yet.",
        );
      }

      case "spawn-gates-per-spell": {
        throw new Error(
          "Effect 'spawn-gates-per-spell' is not implemented yet.",
        );
      }

      case "other-investigators-on-space-lose-health": {
        throw new Error(
          "Effect 'other-investigators-on-space-lose-health' is not implemented yet.",
        );
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

  /*
   * ============================================================
   * RETURN UPDATED GAME
   * ============================================================
   */

  return currentGame;
}