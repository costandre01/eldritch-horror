import type { GameState } from "../models/GameState";
import type { MonsterDefinition } from "../models/Monster";

import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../content/core/coreEpicMonsters";
import type { MapDefinition } from "../models/MapDefinition";
import { startAncientOneReckoning } from "./startAncientOneReckoning";
import { gainCondition } from "./gainCondition";
import { startMonsterCombat } from "./startMonsterCombat";
import { spawnEpicMonsterAtSpace } from "./spawnEpicMonsterAtSpace";
import { resolveAncientOneAwakening } from "./resolveAncientOneAwakening";
import { startMonsterReckoning } from "./startMonsterReckoning";

function getMonsterDefinition(
  definitionId: string,
): MonsterDefinition | undefined {
  return (
    CORE_MONSTERS.find(
      (definition) =>
        definition.id === definitionId,
    ) ??
    CORE_EPIC_MONSTERS.find(
      (definition) =>
        definition.id === definitionId,
    )
  );
}

export function resolveMonsterReckoning(
  game: GameState,
  map: MapDefinition,
  monsterId: string,
): GameState {
  const decision =
    game.pendingDecision;

  if (
    !decision ||
    decision.type !==
      "mythos-reckoning-monsters"
  ) {
    throw new Error(
      "There is no pending Monster Reckoning.",
    );
  }

  if (
    decision.resolvedMonsterIds.includes(
      monsterId,
    )
  ) {
    return game;
  }

  const monster =
    game.monsters[monsterId];

  if (
    !monster ||
    monster.spaceId === null ||
    monster.health <= 0
  ) {
    const resolvedMonsterIds = [
      ...decision.resolvedMonsterIds,
      monsterId,
    ];

    const allResolved =
      resolvedMonsterIds.length ===
      decision.monsterIds.length;

    if (allResolved) {
      const gameWithoutDecision: GameState = {
        ...game,
        pendingDecision: null,
      };

      const remainingPasses =
        decision.remainingPasses ?? 1;

      if (remainingPasses > 1) {
        return startMonsterReckoning(
          gameWithoutDecision,
          map,
          decision.nextIconIndex,
          remainingPasses - 1,
        );
      }

      return startAncientOneReckoning(
        gameWithoutDecision,
        map,
        decision.nextIconIndex,
      );
    }

    return {
      ...game,

      pendingDecision: {
        ...decision,

        resolvedMonsterIds,
      },
    };
  }

  const definition =
    getMonsterDefinition(
      monster.definitionId,
    );

  if (!definition) {
    throw new Error(
      `Monster definition "${monster.definitionId}" does not exist.`,
    );
  }

  let updatedGame = game;

  /*
   * ============================================================
   * DEEP ONE
   * ============================================================
   */

  const loseSanityAbility =
    definition.specialAbilities.find(
      (ability) =>
        ability.type ===
        "each-investigator-on-space-lose-sanity",
    );

  if (
    loseSanityAbility?.type ===
    "each-investigator-on-space-lose-sanity"
  ) {
    const investigators =
      Object.values(
        updatedGame.investigators,
      );

    const updatedInvestigators = {
      ...updatedGame.investigators,
    };

    for (const investigator of investigators) {
      if (
        !investigator.isDefeated &&
        investigator.spaceId ===
          monster.spaceId
      ) {
        updatedInvestigators[
          investigator.id
        ] = {
          ...investigator,

          sanity: Math.max(
            0,
            investigator.sanity -
              loseSanityAbility.amount,
          ),

          isDefeated:
            investigator.health <= 0 ||
            investigator.sanity -
              loseSanityAbility.amount <=
            0,
        };
      }
    }

    updatedGame = {
      ...updatedGame,

      investigators:
        updatedInvestigators,
    };
  }

  /*
   * ============================================================
   * GNOPH-KEH
   * ============================================================
   */

  const loseHealthAbility =
    definition.specialAbilities.find(
      (ability) =>
        ability.type ===
        "each-investigator-on-space-lose-health",
    );

  if (
    loseHealthAbility?.type ===
    "each-investigator-on-space-lose-health"
  ) {
    const investigators =
      Object.values(
        updatedGame.investigators,
      );

    const updatedInvestigators = {
      ...updatedGame.investigators,
    };

    for (const investigator of investigators) {
      if (
        !investigator.isDefeated &&
        investigator.spaceId ===
          monster.spaceId
      ) {
        updatedInvestigators[
          investigator.id
        ] = {
          ...investigator,

          health: Math.max(
            0,
            investigator.health -
              loseHealthAbility.amount,
          ),

          isDefeated:
            investigator.health -
              loseHealthAbility.amount <=
            0 ||
            investigator.sanity <= 0,
        };
      }
    }

    updatedGame = {
      ...updatedGame,

      investigators:
        updatedInvestigators,
    };
  }

  /*
  * ============================================================
  * LLOIGOR — ADJACENT INVESTIGATORS LOSE HEALTH AND SANITY
  * ============================================================
  */

  const adjacentLoseHealthAndSanityAbility =
    definition.specialAbilities.find(
      (ability) =>
        ability.type ===
        "adjacent-investigators-lose-health-and-sanity",
    );

  if (
    adjacentLoseHealthAndSanityAbility?.type ===
    "adjacent-investigators-lose-health-and-sanity"
  ) {
    const updatedInvestigators = {
      ...updatedGame.investigators,
    };

    for (const investigator of Object.values(
      updatedGame.investigators,
    )) {
      if (
        investigator.isDefeated ||
        investigator.spaceId === null
      ) {
        continue;
      }

      const investigatorSpace =
        map.spaces.find(
          (space) =>
            space.id === investigator.spaceId,
        );

      const monsterSpace =
        map.spaces.find(
          (space) =>
            space.id === monster.spaceId,
        );

      if (
        !investigatorSpace ||
        !monsterSpace
      ) {
        continue;
      }

      const isOnMonsterSpace =
        investigator.spaceId ===
        monster.spaceId;

      const isAdjacent =
        monsterSpace.connectedSpaceIds.includes(
          investigator.spaceId,
        );

      if (
        !isOnMonsterSpace &&
        !isAdjacent
      ) {
        continue;
      }

      const healthLoss =
        adjacentLoseHealthAndSanityAbility.health;

      const sanityLoss =
        adjacentLoseHealthAndSanityAbility.sanity;

      updatedInvestigators[
        investigator.id
      ] = {
        ...investigator,

        health: Math.max(
          0,
          investigator.health - healthLoss,
        ),

        sanity: Math.max(
          0,
          investigator.sanity - sanityLoss,
        ),

        isDefeated:
          investigator.health - healthLoss <=
            0 ||
          investigator.sanity - sanityLoss <=
            0,
      };
    }

    updatedGame = {
      ...updatedGame,

      investigators:
        updatedInvestigators,
    };
  }

  /*
   * ============================================================
   * SHOGGOTH — RECOVER ALL HEALTH
   * ============================================================
   */

  const recoverAllHealthAbility =
    definition.specialAbilities.find(
      (ability) =>
        ability.type ===
        "recover-all-health",
    );

  if (
    recoverAllHealthAbility?.type ===
    "recover-all-health"
  ) {
    const maxHealth =
      definition.toughness.type === "fixed"
        ? definition.toughness.value
        : monster.health;

    updatedGame = {
      ...updatedGame,

      monsters: {
        ...updatedGame.monsters,

        [monster.id]: {
          ...updatedGame.monsters[
            monster.id
          ],

          health: maxHealth,
        },
      },
    };
  }

  /*
   * ============================================================
   * WITCH — CURSED INVESTIGATORS LOSE HEALTH
   * ============================================================
   */

  const cursedInvestigatorsLoseHealthAbility =
    definition.specialAbilities.find(
      (ability) =>
        ability.type ===
        "cursed-investigators-lose-health",
    );

  if (
    cursedInvestigatorsLoseHealthAbility?.type ===
    "cursed-investigators-lose-health"
  ) {
    const updatedInvestigators = {
      ...updatedGame.investigators,
    };

    for (const investigator of Object.values(
      updatedGame.investigators,
    )) {
      if (
        investigator.isDefeated ||
        !investigator.conditionIds.includes(
          "condition-cursed",
        )
      ) {
        continue;
      }

      updatedInvestigators[
        investigator.id
      ] = {
        ...investigator,

        health: Math.max(
          0,
          investigator.health -
            cursedInvestigatorsLoseHealthAbility.amount,
        ),

        isDefeated:
          investigator.health -
            cursedInvestigatorsLoseHealthAbility.amount <=
            0 ||
          investigator.sanity <= 0,
      };
    }

    updatedGame = {
      ...updatedGame,

      investigators:
        updatedInvestigators,
    };
  }

  /*
   * ============================================================
   * MI-GO — DISCARD NEAREST CLUE AND MOVE TO SPACE
   * ============================================================
   */

  const discardNearestClueAbility =
    definition.specialAbilities.find(
      (ability) =>
        ability.type ===
        "discard-nearest-clue-and-move-to-space",
    );

  if (
    discardNearestClueAbility?.type ===
    "discard-nearest-clue-and-move-to-space"
  ) {
    const visited = new Set<string>();
    const queue: string[] = [
      monster.spaceId,
    ];

    visited.add(monster.spaceId);

    let targetSpaceId:
      | string
      | null = null;

    while (queue.length > 0) {
      const currentSpaceId =
        queue.shift()!;

      const currentBoardSpace =
        updatedGame.board.spaces[
          currentSpaceId
        ];

      if (
        currentBoardSpace &&
        currentBoardSpace.clues > 0 &&
        currentSpaceId !== monster.spaceId
      ) {
        targetSpaceId =
          currentSpaceId;

        break;
      }

      const currentMapSpace =
        map.spaces.find(
          (space) =>
            space.id === currentSpaceId,
        );

      if (!currentMapSpace) {
        continue;
      }

      for (
        const connectedSpaceId of
          currentMapSpace.connectedSpaceIds
      ) {
        if (
          visited.has(
            connectedSpaceId,
          )
        ) {
          continue;
        }

        visited.add(
          connectedSpaceId,
        );

        queue.push(
          connectedSpaceId,
        );
      }
    }

    if (targetSpaceId) {
      const sourceSpace =
        updatedGame.board.spaces[
          targetSpaceId
        ];

      const targetSpace =
        updatedGame.board.spaces[
          targetSpaceId
        ];

      if (
        sourceSpace &&
        targetSpace &&
        sourceSpace.clues > 0
      ) {
        const clueTokenId =
          sourceSpace.clueTokenIds[0];

        const clueToken = {
          id:
            clueTokenId ??
            `clue-${targetSpaceId}`,
          spaceId:
            targetSpaceId,
        };

        const currentMonsterSpace =
          updatedGame.board.spaces[
            monster.spaceId
          ];

        if (currentMonsterSpace) {
          updatedGame = {
            ...updatedGame,

            board: {
              ...updatedGame.board,

              spaces: {
                ...updatedGame.board.spaces,

                [monster.spaceId]: {
                  ...currentMonsterSpace,

                  monsterIds:
                    currentMonsterSpace.monsterIds.filter(
                      (id) =>
                        id !== monster.id,
                    ),
                },

                [targetSpaceId]: {
                  ...targetSpace,

                  clues:
                    targetSpace.clues - 1,

                  clueTokenIds:
                    targetSpace.clueTokenIds.filter(
                      (id) =>
                        id !== clueToken.id,
                    ),

                  monsterIds:
                    targetSpace.monsterIds.includes(
                      monster.id,
                    )
                      ? targetSpace.monsterIds
                      : [
                          ...targetSpace.monsterIds,
                          monster.id,
                        ],
                },
              },

              clueDiscard: [
                ...updatedGame.board.clueDiscard,
                clueToken,
              ],
            },

            monsters: {
              ...updatedGame.monsters,

              [monster.id]: {
                ...updatedGame.monsters[
                  monster.id
                ],

                spaceId:
                  targetSpaceId,

                engagedInvestigatorId:
                  null,
              },
            },
          };
        }
      }
    }
  }

  /*
   * ============================================================
   * SERPENT PEOPLE — NEAREST INVESTIGATOR MOVES TOWARD
   * ============================================================
   */

  const rollDieNearestInvestigatorMovesAbility =
    definition.specialAbilities.find(
      (ability) =>
        ability.type ===
        "roll-die-nearest-investigator-moves-toward",
    );

  if (
    rollDieNearestInvestigatorMovesAbility?.type ===
    "roll-die-nearest-investigator-moves-toward"
  ) {
    const roll =
      Math.floor(Math.random() * 6) + 1;

    if (roll <= 2) {
      const investigators =
        Object.values(
          updatedGame.investigators,
        ).filter(
          (investigator) =>
            !investigator.isDefeated &&
            investigator.spaceId !== null,
        );

      if (investigators.length > 0) {
        const distanceFromMonster =
          new Map<string, number>();

        const queue: string[] = [
          monster.spaceId,
        ];

        distanceFromMonster.set(
          monster.spaceId,
          0,
        );

        while (queue.length > 0) {
          const currentSpaceId =
            queue.shift()!;

          const currentDistance =
            distanceFromMonster.get(
              currentSpaceId,
            )!;

          const currentSpace =
            map.spaces.find(
              (space) =>
                space.id ===
                currentSpaceId,
            );

          if (!currentSpace) {
            continue;
          }

          for (
            const connectedSpaceId of
              currentSpace.connectedSpaceIds
          ) {
            if (
              distanceFromMonster.has(
                connectedSpaceId,
              )
            ) {
              continue;
            }

            distanceFromMonster.set(
              connectedSpaceId,
              currentDistance + 1,
            );

            queue.push(
              connectedSpaceId,
            );
          }
        }

        let nearestInvestigator:
          | (typeof investigators)[number]
          | null = null;

        let nearestDistance =
          Infinity;

        for (const investigator of investigators) {
          const distance =
            distanceFromMonster.get(
              investigator.spaceId!,
            ) ?? Infinity;

          if (
            distance < nearestDistance
          ) {
            nearestInvestigator =
              investigator;

            nearestDistance =
              distance;
          }
        }

        if (
          nearestInvestigator &&
          nearestInvestigator.spaceId !==
            monster.spaceId
        ) {
          const investigatorSpace =
            map.spaces.find(
              (space) =>
                space.id ===
                nearestInvestigator!.spaceId,
            );

          if (investigatorSpace) {
            let bestNextSpaceId:
              | string
              | null = null;

            let bestDistance =
              nearestDistance;

            for (
              const connectedSpaceId of
                investigatorSpace.connectedSpaceIds
            ) {
              const distance =
                distanceFromMonster.get(
                  connectedSpaceId,
                ) ?? Infinity;

              if (
                distance < bestDistance
              ) {
                bestDistance =
                  distance;

                bestNextSpaceId =
                  connectedSpaceId;
              }
            }

            if (bestNextSpaceId) {
              updatedGame = {
                ...updatedGame,

                investigators: {
                  ...updatedGame.investigators,

                  [nearestInvestigator.id]: {
                    ...updatedGame.investigators[
                      nearestInvestigator.id
                    ],

                    spaceId:
                      bestNextSpaceId,
                  },
                },
              };
            }
          }
        }
      }
    }
  }

  /*
   * ============================================================
   * NIGHTGAUNT — MOVE INVESTIGATOR AND DELAY
   * ============================================================
   *
   * If an investigator is on this Monster's space,
   * move both 1 space and delay the investigator.
   *
   * Otherwise, move this Monster 2 spaces toward
   * the nearest investigator.
   */

  const moveInvestigatorAndDelayAbility =
    definition.specialAbilities.find(
      (ability) =>
        ability.type ===
        "move-investigator-and-delay-or-move-toward-nearest",
    );

  if (
    moveInvestigatorAndDelayAbility?.type ===
    "move-investigator-and-delay-or-move-toward-nearest"
  ) {
    const investigatorsOnSpace =
      Object.values(
        updatedGame.investigators,
      ).filter(
        (investigator) =>
          !investigator.isDefeated &&
          investigator.spaceId ===
            monster.spaceId,
      );

    /*
     * ----------------------------------------------------------
     * INVESTIGATOR ON SAME SPACE
     * ----------------------------------------------------------
     */

    if (
      investigatorsOnSpace.length > 0
    ) {
      const investigator =
        investigatorsOnSpace[0];

      const monsterSpace =
        map.spaces.find(
          (space) =>
            space.id === monster.spaceId,
        );

      if (monsterSpace) {
        const nextSpaceId =
          monsterSpace.connectedSpaceIds[0];

        if (nextSpaceId) {
          const currentMonsterSpace =
            updatedGame.board.spaces[
              monster.spaceId
            ];

          const nextSpace =
            updatedGame.board.spaces[
              nextSpaceId
            ];

          if (
            currentMonsterSpace &&
            nextSpace
          ) {
            updatedGame = {
              ...updatedGame,

              investigators: {
                ...updatedGame.investigators,

                [investigator.id]: {
                  ...updatedGame.investigators[
                    investigator.id
                  ],

                  spaceId:
                    nextSpaceId,

                  isDelayed:
                    true,
                },
              },

              monsters: {
                ...updatedGame.monsters,

                [monster.id]: {
                  ...updatedGame.monsters[
                    monster.id
                  ],

                  spaceId:
                    nextSpaceId,

                  engagedInvestigatorId:
                    null,
                },
              },

              board: {
                ...updatedGame.board,

                spaces: {
                  ...updatedGame.board.spaces,

                  [monster.spaceId]: {
                    ...currentMonsterSpace,

                    monsterIds:
                      currentMonsterSpace.monsterIds.filter(
                        (id) =>
                          id !== monster.id,
                      ),
                  },

                  [nextSpaceId]: {
                    ...nextSpace,

                    monsterIds:
                      nextSpace.monsterIds.includes(
                        monster.id,
                      )
                        ? nextSpace.monsterIds
                        : [
                            ...nextSpace.monsterIds,
                            monster.id,
                          ],
                  },
                },
              },
            };
          }
        }
      }
    } else {
      /*
       * --------------------------------------------------------
       * NO INVESTIGATOR ON SAME SPACE
       * --------------------------------------------------------
       *
       * Move the Nightgaunt 2 spaces toward
       * the nearest investigator.
       */

      const investigators =
        Object.values(
          updatedGame.investigators,
        ).filter(
          (investigator) =>
            !investigator.isDefeated &&
            investigator.spaceId !== null,
        );

      if (
        investigators.length > 0
      ) {
        const distanceFromMonster =
          new Map<string, number>();

        const previousSpace =
          new Map<string, string | null>();

        const queue: string[] = [
          monster.spaceId,
        ];

        distanceFromMonster.set(
          monster.spaceId,
          0,
        );

        previousSpace.set(
          monster.spaceId,
          null,
        );

        while (
          queue.length > 0
        ) {
          const currentSpaceId =
            queue.shift()!;

          const currentDistance =
            distanceFromMonster.get(
              currentSpaceId,
            )!;

          const currentSpace =
            map.spaces.find(
              (space) =>
                space.id ===
                currentSpaceId,
            );

          if (!currentSpace) {
            continue;
          }

          for (
            const connectedSpaceId of
              currentSpace.connectedSpaceIds
          ) {
            if (
              distanceFromMonster.has(
                connectedSpaceId,
              )
            ) {
              continue;
            }

            distanceFromMonster.set(
              connectedSpaceId,
              currentDistance + 1,
            );

            previousSpace.set(
              connectedSpaceId,
              currentSpaceId,
            );

            queue.push(
              connectedSpaceId,
            );
          }
        }

        let nearestInvestigator:
          | (typeof investigators)[number]
          | null = null;

        let nearestDistance =
          Infinity;

        for (
          const investigator of
            investigators
        ) {
          const distance =
            distanceFromMonster.get(
              investigator.spaceId!,
            ) ?? Infinity;

          if (
            distance <
            nearestDistance
          ) {
            nearestDistance =
              distance;

            nearestInvestigator =
              investigator;
          }
        }

        if (
          nearestInvestigator &&
          nearestDistance !== Infinity
        ) {
          let targetSpaceId =
            nearestInvestigator.spaceId!;

          /*
           * Find the first space on the shortest
           * path from the Nightgaunt to the investigator.
           */

          const path: string[] = [];

          let currentSpaceId =
            nearestInvestigator.spaceId!;

          while (
            currentSpaceId !==
            monster.spaceId
          ) {
            path.unshift(
              currentSpaceId,
            );

            const previous =
              previousSpace.get(
                currentSpaceId,
              );

            if (!previous) {
              break;
            }

            currentSpaceId =
              previous;
          }

          /*
           * Move up to 2 spaces.
           */

          if (path.length >= 1) {
            targetSpaceId =
              path[
                Math.min(
                  1,
                  path.length - 1,
                )
              ];
          }

          const currentMonsterSpace =
            updatedGame.board.spaces[
              monster.spaceId
            ];

          const targetSpace =
            updatedGame.board.spaces[
              targetSpaceId
            ];

          if (
            currentMonsterSpace &&
            targetSpace
          ) {
            updatedGame = {
              ...updatedGame,

              monsters: {
                ...updatedGame.monsters,

                [monster.id]: {
                  ...updatedGame.monsters[
                    monster.id
                  ],

                  spaceId:
                    targetSpaceId,

                  engagedInvestigatorId:
                    null,
                },
              },

              board: {
                ...updatedGame.board,

                spaces: {
                  ...updatedGame.board.spaces,

                  [monster.spaceId]: {
                    ...currentMonsterSpace,

                    monsterIds:
                      currentMonsterSpace.monsterIds.filter(
                        (id) =>
                          id !== monster.id,
                      ),
                  },

                  [targetSpaceId]: {
                    ...targetSpace,

                    monsterIds:
                      targetSpace.monsterIds.includes(
                        monster.id,
                      )
                        ? targetSpace.monsterIds
                        : [
                            ...targetSpace.monsterIds,
                            monster.id,
                          ],
                  },
                },
              },
            };
          }
        }
      }
    }
  }

  /*
  * ============================================================
  * ZOMBIE — SPAWN ZOMBIE HORDE
  * ============================================================
  *
  * Spawn the Zombie Horde Epic Monster on this space.
  * If it is successfully spawned, discard this Zombie.
  */

  const discardAndSpawnEpicMonsterAbility =
    definition.specialAbilities.find(
      (ability) =>
        ability.type ===
        "discard-and-spawn-epic-monster",
    );

  if (
    discardAndSpawnEpicMonsterAbility?.type ===
    "discard-and-spawn-epic-monster"
  ) {
    const epicMonsterAlreadyInPlay =
      Object.values(
        updatedGame.monsters,
      ).some(
        (existingMonster) =>
          existingMonster.definitionId ===
            discardAndSpawnEpicMonsterAbility.epicMonsterDefinitionId &&
          existingMonster.isEpic &&
          existingMonster.spaceId !== null,
      );

    const epicMonsterAlreadyDefeated =
      updatedGame.epicMonstersDefeated.includes(
        discardAndSpawnEpicMonsterAbility.epicMonsterDefinitionId,
      );

    /*
    * If the Epic Monster is already in play,
    * the Zombie is NOT discarded.
    */

    if (
      !epicMonsterAlreadyInPlay &&
      !epicMonsterAlreadyDefeated
    ) {
      const zombieSpaceId =
        monster.spaceId;

      if (zombieSpaceId) {
        updatedGame =
          spawnEpicMonsterAtSpace(
            updatedGame,
            map,
            zombieSpaceId,
            discardAndSpawnEpicMonsterAbility.epicMonsterDefinitionId,
          );

        /*
        * The Epic Monster was spawned successfully.
        * Now discard the Zombie.
        */

        const zombieSpace =
          updatedGame.board.spaces[
            zombieSpaceId
          ];

        if (zombieSpace) {
          updatedGame = {
            ...updatedGame,

            board: {
              ...updatedGame.board,

              spaces: {
                ...updatedGame.board.spaces,

                [zombieSpaceId]: {
                  ...zombieSpace,

                  monsterIds:
                    zombieSpace.monsterIds.filter(
                      (id) =>
                        id !== monster.id,
                    ),
                },
              },
            },
          };
        }

        const {
          [monster.id]:
            discardedZombie,
          ...remainingMonsters
        } = updatedGame.monsters;

        updatedGame = {
          ...updatedGame,

          monsters:
            remainingMonsters,

          board: {
            ...updatedGame.board,

            monsterDiscard: [
              ...updatedGame.board
                .monsterDiscard,
              discardedZombie,
            ],
          },
        };
      }
    }
  }

  /*
   * ============================================================
   * WARLOCK — NEAREST INVESTIGATOR GAINS CONDITION
   * ============================================================
   */

  const rollDieNearestInvestigatorGainsConditionAbility =
    definition.specialAbilities.find(
      (ability) =>
        ability.type ===
        "roll-die-nearest-investigator-gains-condition",
    );

  if (
    rollDieNearestInvestigatorGainsConditionAbility?.type ===
    "roll-die-nearest-investigator-gains-condition"
  ) {
    const roll =
      Math.floor(Math.random() * 6) + 1;

    if (roll <= 2) {
      const investigators =
        Object.values(
          updatedGame.investigators,
        ).filter(
          (investigator) =>
            !investigator.isDefeated &&
            investigator.spaceId !== null,
        );

      if (investigators.length > 0) {
        const distanceFromMonster =
          new Map<string, number>();

        const queue: string[] = [
          monster.spaceId,
        ];

        distanceFromMonster.set(
          monster.spaceId,
          0,
        );

        while (queue.length > 0) {
          const currentSpaceId =
            queue.shift()!;

          const currentDistance =
            distanceFromMonster.get(
              currentSpaceId,
            )!;

          const currentSpace =
            map.spaces.find(
              (space) =>
                space.id ===
                currentSpaceId,
            );

          if (!currentSpace) {
            continue;
          }

          for (
            const connectedSpaceId of
              currentSpace.connectedSpaceIds
          ) {
            if (
              distanceFromMonster.has(
                connectedSpaceId,
              )
            ) {
              continue;
            }

            distanceFromMonster.set(
              connectedSpaceId,
              currentDistance + 1,
            );

            queue.push(
              connectedSpaceId,
            );
          }
        }

        let nearestInvestigator:
          | (typeof investigators)[number]
          | null = null;

        let nearestDistance =
          Infinity;

        for (const investigator of investigators) {
          const distance =
            distanceFromMonster.get(
              investigator.spaceId!,
            ) ?? Infinity;

          if (
            distance <
            nearestDistance
          ) {
            nearestInvestigator =
              investigator;

            nearestDistance =
              distance;
          }
        }

        if (nearestInvestigator) {
          updatedGame =
            gainCondition(
              updatedGame,
              nearestInvestigator.id,
              rollDieNearestInvestigatorGainsConditionAbility.conditionDefinitionId,
            );
        }
      }
    }
  }

  /*
   * ============================================================
   * HOUND OF TINDALOS — MOVE TO NEAREST INVESTIGATOR
   * AND ENCOUNTER
   * ============================================================
   */

  const moveToNearestInvestigatorAbility =
    definition.specialAbilities.find(
      (ability) =>
        ability.type ===
        "move-to-nearest-investigator-and-encounter",
    );

  if (
    moveToNearestInvestigatorAbility?.type ===
    "move-to-nearest-investigator-and-encounter"
  ) {
    const investigators =
      game.investigatorOrder
        .map(
          (investigatorId) =>
            updatedGame.investigators[
              investigatorId
            ],
        )
        .filter(
          (
            investigator,
          ): investigator is NonNullable<
            typeof investigator
          > =>
            investigator !== undefined &&
            !investigator.isDefeated &&
            investigator.spaceId !== null,
        );

    if (investigators.length > 0) {
      /*
       * --------------------------------------------------------
       * CALCULATE DISTANCE FROM HOUND
       * --------------------------------------------------------
       */

      const distanceFromMonster =
        new Map<string, number>();

      const queue: string[] = [
        monster.spaceId,
      ];

      distanceFromMonster.set(
        monster.spaceId,
        0,
      );

      while (queue.length > 0) {
        const currentSpaceId =
          queue.shift()!;

        const currentDistance =
          distanceFromMonster.get(
            currentSpaceId,
          )!;

        const currentSpace =
          map.spaces.find(
            (space) =>
              space.id ===
              currentSpaceId,
          );

        if (!currentSpace) {
          continue;
        }

        for (
          const connectedSpaceId of
            currentSpace.connectedSpaceIds
        ) {
          if (
            distanceFromMonster.has(
              connectedSpaceId,
            )
          ) {
            continue;
          }

          distanceFromMonster.set(
            connectedSpaceId,
            currentDistance + 1,
          );

          queue.push(
            connectedSpaceId,
          );
        }
      }

      /*
       * --------------------------------------------------------
       * FIND NEAREST INVESTIGATOR
       * --------------------------------------------------------
       *
       * investigatorOrder is used to provide a deterministic
       * result if two investigators are equally close.
       */

      let nearestInvestigator =
        investigators[0];

      let nearestDistance =
        distanceFromMonster.get(
          nearestInvestigator.spaceId!,
        ) ?? Infinity;

      for (
        const investigator of
          investigators
      ) {
        const distance =
          distanceFromMonster.get(
            investigator.spaceId!,
          ) ?? Infinity;

        if (
          distance <
          nearestDistance
        ) {
          nearestInvestigator =
            investigator;

          nearestDistance =
            distance;
        }
      }

      /*
       * --------------------------------------------------------
       * MOVE HOUND TO INVESTIGATOR SPACE
       * --------------------------------------------------------
       */

      const targetSpaceId =
        nearestInvestigator.spaceId;

      if (targetSpaceId) {
        const currentMonsterSpace =
          updatedGame.board.spaces[
            monster.spaceId
          ];

        const targetSpace =
          updatedGame.board.spaces[
            targetSpaceId
          ];

        if (
          currentMonsterSpace &&
          targetSpace
        ) {
          updatedGame = {
            ...updatedGame,

            monsters: {
              ...updatedGame.monsters,

              [monster.id]: {
                ...updatedGame.monsters[
                  monster.id
                ],

                spaceId:
                  targetSpaceId,

                engagedInvestigatorId:
                  null,
              },
            },

            board: {
              ...updatedGame.board,

              spaces: {
                ...updatedGame.board.spaces,

                [monster.spaceId]: {
                  ...currentMonsterSpace,

                  monsterIds:
                    currentMonsterSpace.monsterIds.filter(
                      (id) =>
                        id !== monster.id,
                    ),
                },

                [targetSpaceId]: {
                  ...targetSpace,

                  monsterIds:
                    targetSpace.monsterIds.includes(
                      monster.id,
                    )
                      ? targetSpace.monsterIds
                      : [
                          ...targetSpace.monsterIds,
                          monster.id,
                        ],
                },
              },
            },

            activeInvestigatorId:
              nearestInvestigator.id,
          };

          /*
           * ------------------------------------------------------
           * IMMEDIATELY ENCOUNTER THE HOUND
           * ------------------------------------------------------
           */

          return startMonsterCombat(
            updatedGame,
            monster.id,
            {
              type:
                "monster-reckoning",

              monsterId:
                monster.id,

              monsterIds:
                decision.monsterIds,

              resolvedMonsterIds:
                decision.resolvedMonsterIds,

              nextIconIndex:
                decision.nextIconIndex,

              remainingPasses:
                decision.remainingPasses ?? 1,
            }
          );
        }
      }
    }
  }

  /*
   * ============================================================
   * ROLL DIE — ADVANCE DOOM
   * ============================================================
   */

  const rollDieAdvanceDoomAbility =
    definition.specialAbilities.find(
      (ability) =>
        ability.type ===
        "roll-die-advance-doom",
    );

  if (
    rollDieAdvanceDoomAbility?.type ===
    "roll-die-advance-doom"
  ) {
    const roll =
      Math.floor(Math.random() * 6) + 1;

    if (roll <= 2) {
      const wasAwakened =
        updatedGame.ancientOne.awakened;

      const doom =
        updatedGame.ancientOne.doom;

      const newDoom =
        Math.max(0, doom - 1);

      updatedGame = {
        ...updatedGame,

        ancientOne: {
          ...updatedGame.ancientOne,

          doom: newDoom,

          awakened:
            updatedGame.ancientOne.awakened ||
            newDoom === 0,
        },
      };

      if (
        !wasAwakened &&
        updatedGame.ancientOne.awakened
      ) {
        return resolveAncientOneAwakening(
          updatedGame,
          map,
          decision.nextIconIndex,
          {
            type: "monster-reckoning",

            monsterId:
              monsterId,

            monsterIds:
              decision.monsterIds,

            resolvedMonsterIds:
              decision.resolvedMonsterIds,

            nextIconIndex:
              decision.nextIconIndex,

            remainingPasses:
              decision.remainingPasses ?? 1,
          },
        );
      }
    }
  }

  /*
   * ============================================================
   * MARK MONSTER AS RESOLVED
   * ============================================================
   */

    const resolvedMonsterIds = [
        ...decision.resolvedMonsterIds,
        monsterId,
    ];

    const allResolved =
        resolvedMonsterIds.length ===
        decision.monsterIds.length;

    if (allResolved) {
      const gameWithoutDecision: GameState = {
        ...updatedGame,
        pendingDecision: null,
      };

      const remainingPasses =
        decision.remainingPasses ?? 1;

      if (remainingPasses > 1) {
        return startMonsterReckoning(
          gameWithoutDecision,
          map,
          decision.nextIconIndex,
          remainingPasses - 1,
        );
      }

      return startAncientOneReckoning(
        gameWithoutDecision,
        map,
        decision.nextIconIndex,
      );
    }

    return {
        ...updatedGame,

        pendingDecision: {
            ...decision,

            resolvedMonsterIds,
        },
    };
}