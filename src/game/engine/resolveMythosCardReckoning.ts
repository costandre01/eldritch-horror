import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { easyMythos } from "../../content/core/mythos/easyMythos";
import { normalMythos } from "../../content/core/mythos/normalMythos";
import { hardMythos } from "../../content/core/mythos/hardMythos";
import { startConditionReckoning } from "./startConditionReckoning";
import { gainConditionByCategory } from "./gainCondition";
import { getInvestigatorConditionsByCategory } from "./getInvestigatorConditions";
import { resolveMythosSpecial } from "./resolveMythosSpecial";
import { solveMythosRumor } from "./solveMythosRumor";
import { resolveAncientOneAwakening } from "./resolveAncientOneAwakening";
import { advanceDoom } from "./doomEngine";
import { spawnMonsterAtSpace } from "./spawnMonster";
import { advanceOmen } from "./omenEngine";
import { resolveEncounterEffects } from "./resolveEncounterEffects";

const ALL_MYTHOS = [
  ...easyMythos,
  ...normalMythos,
  ...hardMythos,
];

export function resolveMythosCardReckoning(
  game: GameState,
  _map: MapDefinition,
): GameState {
  const decision =
    game.pendingDecision;

  if (
    !decision ||
    decision.type !==
      "mythos-card-reckoning"
  ) {
    throw new Error(
      "There is no active Mythos card Reckoning decision.",
    );
  }

  /*
   * ============================================================
   * FIND NEXT MYTHOS
   * ============================================================
   */

  const mythosId =
    decision.mythosIds.find(
      (id) =>
        !decision.resolvedMythosIds.includes(
          id,
        ),
    );

  /*
   * All Mythos cards have been resolved.
   */

  if (!mythosId) {
    const remainingPasses =
        decision.remainingPasses ?? 1;

    /*
     * From Beyond:
     *
     * Se ainda existir uma segunda passagem,
     * reiniciamos os Mythos que possuem Reckoning.
     */

    if (remainingPasses > 1) {
        return {
            ...game,

            pendingDecision: {
                ...decision,

                resolvedMythosIds: [],

                remainingPasses:
                    remainingPasses - 1,
            },
        };
    }

    const gameWithoutDecision: GameState = {
        ...game,
        pendingDecision: null,
    };

    return startConditionReckoning(
        gameWithoutDecision,
        _map,
        decision.nextIconIndex,
    );
  }

  const mythos =
    ALL_MYTHOS.find(
      (definition) =>
        definition.id ===
        mythosId,
    );

  if (!mythos) {
    throw new Error(
      `Mythos "${mythosId}" does not exist.`,
    );
  }

  const mythosInPlayIndex =
    game.board.mythosInPlay.findIndex(
      (entry) =>
        entry.definitionId ===
        mythosId,
    );

  /*
   * The Mythos may have been removed from play
   * by another effect.
   */

  if (
    mythosInPlayIndex === -1
  ) {
    return {
      ...game,

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };
  }

  const mythosInPlay =
    game.board.mythosInPlay[
      mythosInPlayIndex
    ];

  if (!mythosInPlay) {
    return {
      ...game,

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };
  }

  if (
    mythos.reckoning?.type ===
    "lead-gains-madness"
  ) {
    const leadInvestigatorId =
      game.leadInvestigatorId;

    if (!leadInvestigatorId) {
      throw new Error(
        "There is no Lead Investigator.",
      );
    }

    let currentGame =
      gainConditionByCategory(
        game,
        leadInvestigatorId,
        "madness",
      );

    const madnessCount =
      getInvestigatorConditionsByCategory(
        currentGame,
        leadInvestigatorId,
        "madness",
      ).length;

    const eldritchTokensToDiscard =
      Math.min(
        madnessCount,
        mythosInPlay.eldritchTokens,
      );

    const updatedMythosInPlay = [
      ...currentGame.board.mythosInPlay,
    ];

    const remainingEldritchTokens =
      mythosInPlay.eldritchTokens -
      eldritchTokensToDiscard;

    updatedMythosInPlay[
      mythosInPlayIndex
    ] = {
      ...mythosInPlay,

      eldritchTokens:
        remainingEldritchTokens,
    };

    currentGame = {
      ...currentGame,

      board: {
        ...currentGame.board,

        mythosInPlay:
          updatedMythosInPlay,
      },
    };

    /*
    * ==========================================================
    * GROWING MADNESS
    * ==========================================================
    *
    * Growing Madness is immediately resolved when its last
    * Eldritch Token is discarded.
    *
    * IMPORTANT:
    *
    * resolveMythosSpecial() may change the pendingDecision.
    * Therefore, when the Rumor is solved, we must return its
    * result directly and must NOT recreate the old Reckoning
    * decision afterwards.
    */

    if (
      mythos.id === "growing-madness" &&
      remainingEldritchTokens === 0
    ) {
      return resolveMythosSpecial(
        currentGame,
        mythos,
        "growing-madness",
        _map,
      );
    }

    /*
    * Mark this Mythos Reckoning as resolved.
    */

    return {
      ...currentGame,

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };
  }

  /*
   * ============================================================
   * RETURN ACTIVE EXPEDITION
   * ============================================================
   *
   * Return all Expedition Encounter cards belonging to the
   * Active Expedition from the Expedition Encounter deck
   * to the game box.
   *
   * If the Expedition Encounter deck becomes empty,
   * the investigators lose the game.
   */

  if (
    mythos.reckoning?.type ===
    "return-active-expedition"
  ) {
    const activeExpeditionSpaceId =
      game.board.activeExpeditionSpaceId;

    if (!activeExpeditionSpaceId) {
      return {
        ...game,

        pendingDecision: {
          ...decision,

          resolvedMythosIds: [
            ...decision.resolvedMythosIds,
            mythosId,
          ],
        },
      };
    }

    const activeExpeditionSpace =
      _map.spaces.find(
        (space) =>
          space.id ===
          activeExpeditionSpaceId,
      );

    if (!activeExpeditionSpace) {
      throw new Error(
        `Active Expedition space "${activeExpeditionSpaceId}" does not exist.`,
      );
    }

    const expeditionDeck =
      game.board.encounterDecks.expedition;

    const remainingExpeditionDeck =
      expeditionDeck.filter(
        (encounterId) =>
          game.encounters[
            encounterId
          ]?.name !==
          activeExpeditionSpace.name,
      );

    /*
     * If the Expedition Encounter deck is now empty,
     * the investigators lose the game.
     */

    if (
      remainingExpeditionDeck.length === 0
    ) {
      return {
        ...game,

        board: {
          ...game.board,

          encounterDecks: {
            ...game.board.encounterDecks,

            expedition:
              remainingExpeditionDeck,
          },
        },

        status: "defeat",

        pendingDecision: null,
      };
    }

    return {
      ...game,

      board: {
        ...game.board,

        encounterDecks: {
          ...game.board.encounterDecks,

          expedition:
            remainingExpeditionDeck,
        },
      },

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };
  }

  /*
   * ============================================================
   * RECKONING
   * ============================================================
   */

  if (
    mythos.reckoning?.type ===
    "discard-self-and-place-assets"
  ) {
    /*
    * ==========================================================
    * DRIVEN TO BANKRUPTCY
    * ==========================================================
    *
    * Discard this Mythos.
    *
    * Then place the top 4 cards of the Asset deck
    * in the Reserve.
    */

    const assetDeck = [
      ...game.board.assetDeck,
    ];

    const assetsToReserve =
      assetDeck.splice(
        0,
        Math.min(
          4,
          assetDeck.length,
        ),
      );

    const remainingMythosInPlay =
      game.board.mythosInPlay.filter(
        (entry) =>
          entry.definitionId !==
          mythosId,
      );

    return {
      ...game,

      board: {
        ...game.board,

        assetDeck,

        assetReserve: [
          ...game.board.assetReserve,
          ...assetsToReserve,
        ],

        mythosInPlay:
          remainingMythosInPlay,

        mythosDiscard: [
          ...game.board.mythosDiscard,
          mythos,
        ],
      },

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };
  }

  /*
   * ============================================================
   * FADED FROM SOCIETY
   * ============================================================
   *
   * Search the Asset deck, Asset discard pile and Reserve
   * for every Asset whose value is greater than or equal
   * to the number of Eldritch Tokens on this Mythos.
   *
   * Those Assets are returned to the game box.
   *
   * Then discard 1 Eldritch Token from this Mythos.
   *
   * If there are no Eldritch Tokens remaining,
   * solve this Rumor.
   */

  if (
    mythos.reckoning?.type ===
    "faded-from-society"
  ) {
    const eldritchTokens =
      mythosInPlay.eldritchTokens;

    /*
     * ==========================================================
     * REMOVE ASSETS FROM THE GAME
     * ==========================================================
     *
     * Assets returned to the game box are simply removed
     * from the Asset deck, discard pile and Reserve.
     */

    const assetDeck =
      game.board.assetDeck.filter(
        (asset) =>
          asset.value <
          eldritchTokens,
      );

    const assetDiscard =
      game.board.assetDiscard.filter(
        (asset) =>
          asset.value <
          eldritchTokens,
      );

    const assetReserve =
      game.board.assetReserve.filter(
        (asset) =>
          asset.value <
          eldritchTokens,
      );

    /*
     * ==========================================================
     * DISCARD 1 ELDRITCH TOKEN
     * ==========================================================
     */

    const remainingEldritchTokens =
      Math.max(
        0,
        eldritchTokens - 1,
      );

    const updatedMythosInPlay = [
      ...game.board.mythosInPlay,
    ];

    updatedMythosInPlay[
      mythosInPlayIndex
    ] = {
      ...mythosInPlay,

      eldritchTokens:
        remainingEldritchTokens,
    };

    let updatedGame: GameState = {
      ...game,

      board: {
        ...game.board,

        assetDeck,

        assetDiscard,

        assetReserve,

        mythosInPlay:
          updatedMythosInPlay,
      },
    };

    /*
     * ==========================================================
     * SOLVE RUMOR
     * ==========================================================
     *
     * If the last Eldritch Token was discarded,
     * Faded From Society is solved.
     */

    if (
      remainingEldritchTokens === 0
    ) {
      return solveMythosRumor(
        updatedGame,
        mythos,
      );
    }

    /*
     * ==========================================================
     * CONTINUE RECKONING
     * ==========================================================
     */

    return {
      ...updatedGame,

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };
  }

  /*
   * ==========================================================
   * THE WIND-WALKER RECKONING
   * ==========================================================
   *
   * Discard 1 Eldritch Token.
   *
   * When the last token is removed:
   *   -> Each Investigator becomes Delayed.
   *   -> Each Investigator loses 6 Health.
   *   -> Solve the Rumor.
   */

  if (
    mythos.reckoning?.type ===
    "wind-walker"
  ) {
    const eldritchTokens =
      Math.max(
        0,
        mythosInPlay.eldritchTokens - 1,
      );

    const updatedMythosInPlay =
      [
        ...game.board.mythosInPlay,
      ];

    updatedMythosInPlay[
      mythosInPlayIndex
    ] = {
      ...mythosInPlay,

      eldritchTokens,
    };

    const updatedGame: GameState = {
      ...game,

      board: {
        ...game.board,

        mythosInPlay:
          updatedMythosInPlay,
      },
    };

    /*
     * ==========================================================
     * LAST ELDRITCH TOKEN
     * ==========================================================
     */

    if (
      eldritchTokens === 0
    ) {
      return resolveMythosSpecial(
        updatedGame,
        mythos,
        "the-wind-walker",
        _map,
      );
    }

    return {
      ...updatedGame,

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };
  }

  /*
  * ============================================================
  * DIMENSIONS COLLIDE
  * ============================================================
  *
  * Discard Eldritch Tokens equal to half the number
  * of Gates currently on the board.
  */

  if (
      mythos.reckoning?.type ===
      "dimensions-collide"
  ) {
      const gateCount =
          Object.values(
              game.board.spaces,
          ).reduce(
              (total, space) =>
                  total +
                  space.gates.length,
              0,
          );

      const tokensToDiscard =
          Math.min(
              Math.floor(
                  gateCount / 2,
              ),
              mythosInPlay.eldritchTokens,
          );

      const remainingEldritchTokens =
          mythosInPlay.eldritchTokens -
          tokensToDiscard;

      const updatedMythosInPlay = [
          ...game.board.mythosInPlay,
      ];

      updatedMythosInPlay[
          mythosInPlayIndex
      ] = {
          ...mythosInPlay,

          eldritchTokens:
              remainingEldritchTokens,
      };

      const updatedGame: GameState = {
          ...game,

          board: {
              ...game.board,

              mythosInPlay:
                  updatedMythosInPlay,
          },
      };

      /*
      * If the last Eldritch Token was removed,
      * the investigators immediately lose.
      */

      if (
          remainingEldritchTokens === 0
      ) {
          return {
              ...updatedGame,

              status:
                  "defeat",

              pendingDecision:
                  null,

              activeInvestigatorId:
                  null,
          };
      }

      return {
          ...updatedGame,

          pendingDecision: {
              ...decision,

              resolvedMythosIds: [
                  ...decision.resolvedMythosIds,
                  mythosId,
              ],
          },
      };
  }

  if (
    mythos.reckoning?.type ===
    "spreading-sickness"
  ) {
      const currentHealthTokens =
          mythosInPlay.healthTokens ?? 0;

      const healthTokens =
          currentHealthTokens + 1;

      const updatedMythosInPlay = [
          ...game.board.mythosInPlay,
      ];

      updatedMythosInPlay[
          mythosInPlayIndex
      ] = {
          ...mythosInPlay,

          healthTokens,
      };

      let currentGame: GameState = {
          ...game,

          board: {
              ...game.board,

              mythosInPlay:
                  updatedMythosInPlay,
          },
      };

      /*
      * Each investigator loses 1 Health
      * for each Health token on the card.
      */

      for (
          const investigatorId of
              currentGame.investigatorOrder
      ) {
          currentGame =
              resolveEncounterEffects(
                  currentGame,
                  investigatorId,
                  [
                      {
                          type: "lose-health",
                          amount:
                              healthTokens,
                      },
                  ],
                  _map,
              );
      }

      return {
          ...currentGame,

          pendingDecision: {
              ...decision,

              resolvedMythosIds: [
                  ...decision.resolvedMythosIds,
                  mythosId,
              ],
          },
      };
  }

  if (
    mythos.reckoning?.type ===
    "discard-eldritch-token"
  ) {
    const eldritchTokens =
      Math.max(
        0,
        mythosInPlay.eldritchTokens - 1,
      );

    const updatedMythosInPlay =
      [
        ...game.board.mythosInPlay,
      ];

    updatedMythosInPlay[
      mythosInPlayIndex
    ] = {
      ...mythosInPlay,

      eldritchTokens,
    };

    const updatedGame: GameState = {
      ...game,

      board: {
        ...game.board,

        mythosInPlay:
          updatedMythosInPlay,
      },

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };

    /*
    * ==========================================================
    * MYTHOS REACHES 0 ELDritch TOKENS
    * ==========================================================
    *
    * Growing Madness, Fractured Reality and Lost Knowledge
    * resolve their 0 Eldritch Token effect immediately when
    * their last Eldritch Token is removed.
    */

    if (
      eldritchTokens === 0 &&
      (
        mythos.id ===
          "growing-madness" ||
        mythos.id ===
          "fractured-reality" ||
        mythos.id ===
          "lost-knowledge"
      )
    ) {
      return resolveMythosSpecial(
        updatedGame,
        mythos,
        mythos.id,
        _map,
      );
    }

    return updatedGame;
  }

  /*
  * ==========================================================
  * PATROLLING THE BORDER
  * ==========================================================
  */

  if (
      mythos.reckoning?.type ===
      "city-investigators-test-observation"
  ) {
      const cityInvestigatorIds =
          game.investigatorOrder.filter(
              (investigatorId) => {
                  const investigator =
                      game.investigators[
                          investigatorId
                      ];

                  if (
                      !investigator ||
                      !investigator.spaceId
                  ) {
                      return false;
                  }

                  const space =
                      _map.spaces.find(
                          (item) =>
                              item.id ===
                              investigator.spaceId,
                      );

                  return (
                      space?.type ===
                      "city"
                  );
              },
          );

      /*
      * No investigators in Cities.
      * The Mythos is simply discarded.
      */

      if (
          cityInvestigatorIds.length === 0
      ) {
          const updatedMythosInPlay =
              game.board.mythosInPlay.filter(
                  (entry) =>
                      entry.definitionId !==
                      mythos.id,
              );

          return {
              ...game,

              board: {
                  ...game.board,

                  mythosInPlay:
                      updatedMythosInPlay,

                  mythosDiscard: [
                      ...game.board.mythosDiscard,
                      mythos,
                  ],
              },

              pendingDecision: {
                  ...decision,

                  resolvedMythosIds: [
                      ...decision.resolvedMythosIds,
                      mythosId,
                  ],
              },
          };
      }

      const investigatorId =
          cityInvestigatorIds[0];

      if (!investigatorId) {
          throw new Error(
              "Patrolling the Border could not determine the Investigator.",
          );
      }

      return {
          ...game,

          activeInvestigatorId:
              investigatorId,

          pendingDecision: {
              type: "test",

              title:
                  "Patrolling the Border",

              message:
                  "Test Observation.",

              image:
                  mythos.image,

              skill:
                  "observation",

              modifier:
                  0,

              investigatorId,

              source:
                  `mythos:patrolling-the-border:test:${investigatorId}:0`,

              resume: {
                  type:
                      "mythos-patrolling-the-border",

                  investigatorIds:
                      cityInvestigatorIds,

                  currentInvestigatorIndex:
                      0,
              },
          },
      };
  }

  /*
   * ==========================================================
   * RETURN OF THE ANCIENT ONES
   * ==========================================================
   *
   * Spawn 1 Monster on Space 19.
   *
   * If there are 4 or more Monsters on Space 19,
   * set Doom to 0 and solve the Rumor.
   */

  if (
    mythos.reckoning?.type ===
    "return-of-the-ancient-ones"
  ) {
    let currentGame =
      spawnMonsterAtSpace(
        game,
        "space-19",
      );

    const space19 =
      currentGame.board.spaces[
        "space-19"
      ];

    if (!space19) {
      return {
        ...currentGame,

        pendingDecision: {
          ...decision,

          resolvedMythosIds: [
            ...decision.resolvedMythosIds,
            mythosId,
          ],
        },
      };
    }

    const monsterCount =
      space19.monsterIds.filter(
        (id) =>
          currentGame.monsters[id] !==
          undefined,
      ).length;

    /*
     * Less than 4 Monsters:
     * the Rumor remains in play.
     */

    if (
      monsterCount < 4
    ) {
      return {
        ...currentGame,

        pendingDecision: {
          ...decision,

          resolvedMythosIds: [
            ...decision.resolvedMythosIds,
            mythosId,
          ],
        },
      };
    }

    /*
     * 4 or more Monsters:
     *
     * Set Doom to 0.
     *
     * advanceDoom() also triggers the normal
     * Ancient One Awakening flow when appropriate.
     */

    const wasAwakened =
      currentGame.ancientOne.awakened;

    currentGame =
      advanceDoom(
        currentGame,
        currentGame.ancientOne.doom,
      );

    const solvedGame =
      solveMythosRumor(
        currentGame,
        mythos,
      );

    if (
      !wasAwakened &&
      currentGame.ancientOne.awakened
    ) {
      const reckoningDecision =
        currentGame.pendingDecision;

      if (
        !reckoningDecision ||
        reckoningDecision.type !==
          "mythos-card-reckoning"
      ) {
        throw new Error(
          "Return of the Ancient Ones awakened the Ancient One, but the Mythos Reckoning decision could not be resumed.",
        );
      }

      return resolveAncientOneAwakening(
        solvedGame,
        _map,
        reckoningDecision.nextIconIndex,
        {
          type: "mythos",

          nextIconIndex:
            reckoningDecision.nextIconIndex,

          mythosIds:
            reckoningDecision.mythosIds,

          resolvedMythosIds:
            reckoningDecision.resolvedMythosIds,
        },
      );
    }

    return {
      ...solvedGame,

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };
  }

  /*
  * ============================================================
  * STARS ALIGNED
  * ============================================================
  *
  * Reckoning:
  * Advance the Omen by 1.
  */

  if (
    mythos.reckoning?.type ===
    "stars-aligned"
  ) {
    const wasAwakened =
      game.ancientOne.awakened;

    const advancedGame =
      advanceOmen(
        game,
        1,
      );

    /*
    * Advancing the Omen may cause Doom
    * to reach 0 and awaken the Ancient One.
    */

    if (
      !wasAwakened &&
      advancedGame.ancientOne.awakened
    ) {
      return resolveAncientOneAwakening(
        advancedGame,
        _map,
        decision.nextIconIndex,
      );
    }

    return {
      ...advancedGame,

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };
  }

  /*
  * ============================================================
  * STRANGE SIGHTINGS
  * ============================================================
  *
  * Discard this Mythos card during Reckoning.
  */

  if (
    mythos.reckoning?.type ===
    "strange-sightings"
  ) {
    const remainingMythosInPlay =
      game.board.mythosInPlay.filter(
        (entry) =>
          entry.definitionId !==
          mythos.id,
      );

    return {
      ...game,

      board: {
        ...game.board,

        mythosInPlay:
          remainingMythosInPlay,

        mythosDiscard: [
          ...game.board.mythosDiscard,
          mythos,
        ],
      },

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };
  }

  /*
   * No supported Reckoning effect.
   */

  return {
    ...game,

    pendingDecision: {
      ...decision,

      resolvedMythosIds: [
        ...decision.resolvedMythosIds,
        mythosId,
      ],
    },
  };
}