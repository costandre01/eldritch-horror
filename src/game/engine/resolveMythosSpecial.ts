import { coreConditionDefinitions } from "../../content/core/coreConditions";
import { CORE_EPIC_MONSTERS } from "../../content/core/coreEpicMonsters";
import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { easyMythos } from "../../content/core/mythos/easyMythos";
import { hardMythos } from "../../content/core/mythos/hardMythos";
import { normalMythos } from "../../content/core/mythos/normalMythos";
import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import type { MythosDefinition } from "../models/Mythos";
import { advanceDoom } from "./doomEngine";
import { gainCondition } from "./gainCondition";
import { getInvestigatorConditionsByCategory } from "./getInvestigatorConditions";
import { getLeadInvestigatorId } from "./getLeadInvestigatorId";
import { hasMonsterReckoningAbility } from "./hasMonsterReckoningAbility";
import { resolveAncientOneAwakening } from "./resolveAncientOneAwakening";
import { resolveConditionFrontEffects } from "./resolveConditionFrontEffects";

import { resolveEncounterEffects } from "./resolveEncounterEffects";
import { solveMythosRumor } from "./solveMythosRumor";
import { spawnEpicMonsterAtSpace } from "./spawnEpicMonsterAtSpace";
import { spawnMonsterAtSpace } from "./spawnMonster";
import { startConditionReckoning } from "./startConditionReckoning";
import { startMonsterReckoning } from "./startMonsterReckoning";
import { startOtherWorldEncounter } from "./startOtherWorldEncounter";

const ALL_MYTHOS = [
    ...easyMythos,
    ...normalMythos,
    ...hardMythos,
];

function createSilverTwilightAidChoice(
  game: GameState,
  investigatorIndex: number,
): GameState {
  const investigatorId =
    game.investigatorOrder[
      investigatorIndex
    ];

  if (!investigatorId) {
    return {
      ...game,

      currentMythosId: null,

      pendingDecision: null,
    };
  }

  const investigator =
    game.investigators[
      investigatorId
    ];

  if (!investigator) {
    return {
      ...game,

      pendingDecision: null,
    };
  }

  const options = [
    {
      id:
        `silver-twilight-aid:clue:${investigatorIndex}`,

      title:
        "Gain 1 Clue",

      description:
        "Gain 1 Clue.",
    },

    ...(game.board.assetDeck.length > 0
      ? [
          {
            id:
              `silver-twilight-aid:asset:${investigatorIndex}`,

            title:
              "Gain 1 Asset",

            description:
              "Gain 1 Asset.",
          },
        ]
      : []),

    ...(game.board.spellDeck.length > 0
      ? [
          {
            id:
              `silver-twilight-aid:spell:${investigatorIndex}`,

            title:
              "Gain 1 Spell",

            description:
              "Choose 1 Spell from the Spell deck.",
          },
        ]
      : []),

    {
      id:
        `silver-twilight-aid:pass:${investigatorIndex}`,

      title:
        "Do Nothing",

      description:
        "Do not gain a Clue, Asset, or Spell.",
    },
  ];

  return {
    ...game,

    pendingDecision: {
      type: "choice",

      title:
        "Silver Twilight Aid",

      message:
        "This Investigator may gain 1 Clue, gain 1 Asset, or gain 1 Spell.",

      options,

      source:
        `mythos:silver-twilight-aid:${investigatorIndex}`,
    },
  };
}

export function resumeSilverTwilightAid(
  game: GameState,
  _map: MapDefinition,
  investigatorIndex: number,
): GameState {
  if (
    investigatorIndex >=
    game.investigatorOrder.length
  ) {
    return {
      ...game,

      currentMythosId: null,

      pendingDecision: null,
    };
  }

  return createSilverTwilightAidChoice(
    game,
    investigatorIndex,
  );
}

function getArrestsMadeInvestigators(
  game: GameState,
  map: MapDefinition,
): string[] {
  return game.investigatorOrder.filter(
    (investigatorId) => {
      const investigator =
        game.investigators[investigatorId];

      if (
        !investigator ||
        !investigator.spaceId
      ) {
        return false;
      }

      const space =
        map.spaces.find(
          (item) =>
            item.id ===
            investigator.spaceId,
        );

      if (
        space?.type !== "city"
      ) {
        return false;
      }

      return investigator.assetIds.some(
        (assetId) =>
          game.assets[assetId]?.traits.includes(
            "weapon",
          ),
      );
    },
  );
}

export function startArrestsMade(
  game: GameState,
  _map: MapDefinition,
  investigatorIds: string[],
  investigatorIndex: number,
): GameState {
  /*
   * Todos os Investigators elegíveis
   * já foram tratados.
   */

  if (
    investigatorIndex >=
    investigatorIds.length
  ) {
    return {
      ...game,

      currentMythosId:
        null,

      pendingDecision:
        null,

      activeInvestigatorId:
        null,
    };
  }

  const investigatorId =
    investigatorIds[investigatorIndex];

  if (!investigatorId) {
    throw new Error(
      "Arrests Made could not determine the next Investigator.",
    );
  }

  const investigator =
    game.investigators[
      investigatorId
    ];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  return {
    ...game,

    activeInvestigatorId:
      investigatorId,

    pendingDecision: {
      type: "test",

      title:
        "Arrests Made in Murder Case!",

      message:
        "Test Influence.",

      image:
        "/cards/Mythos/Mythos/Medium - Arrests Made in Murder Case!.jpg",

      skill:
        "influence",

      modifier:
        0,

      investigatorId,

      source:
        `mythos:arrests-made:test:${investigatorId}:${investigatorIndex}`,

      resume: {
        type:
          "mythos-arrests-made",

        investigatorIds,

        currentInvestigatorIndex:
          investigatorIndex,
      },
    },
  };
}

export function startUnexpectedBetrayal(
    game: GameState,
    investigatorIndex: number,
): GameState {
    while (
        investigatorIndex <
        game.investigatorOrder.length
    ) {
        const investigatorId =
            game.investigatorOrder[
                investigatorIndex
            ];

        if (!investigatorId) {
            investigatorIndex++;
            continue;
        }

        const investigator =
            game.investigators[
                investigatorId
            ];

        if (!investigator) {
            investigatorIndex++;
            continue;
        }

        const allyIds =
            investigator.assetIds.filter(
                (assetId) =>
                    game.assets[
                        assetId
                    ]?.type === "ally",
            );

        /*
         * Sem Ally: passa ao próximo Investigator.
         */
        if (allyIds.length === 0) {
            investigatorIndex++;
            continue;
        }

        /*
         * Perde 3 Health.
         */
        const newHealth =
            Math.max(
                0,
                investigator.health - 3,
            );

        const isDefeated =
            newHealth <= 0 ||
            investigator.sanity <= 0;

        const updatedGame: GameState = {
            ...game,

            activeInvestigatorId:
                investigatorId,

            investigators: {
                ...game.investigators,

                [investigatorId]: {
                    ...investigator,

                    health:
                        newHealth,

                    isDefeated,
                },
            },
        };

        /*
         * Se a perda de Health derrotou o Investigator,
         * não pode continuar a escolher um Ally.
         *
         * Passa diretamente ao próximo Investigator.
         */
        if (isDefeated) {
            return startUnexpectedBetrayal(
                updatedGame,
                investigatorIndex + 1,
            );
        }

        /*
         * O Investigator continua ativo e escolhe
         * exatamente 1 Ally para descartar.
         */
        return {
            ...updatedGame,

            pendingDecision: {
                type: "select-card",

                title:
                    "Unexpected Betrayal",

                message:
                    "Choose 1 Ally Asset to discard.",

                cardIds:
                    allyIds,

                selectableCardIds:
                    allyIds,

                minSelections: 1,

                maxSelections: 1,

                selectedCardIds: [],

                investigatorId,

                source:
                    `mythos:unexpected-betrayal:${investigatorIndex}`,
            },
        };
    }

    /*
     * Todos os Investigators foram tratados.
     */
    return {
        ...game,

        currentMythosId:
            null,

        pendingDecision:
            null,

        activeInvestigatorId:
            null,
    };
}

function getItemIds(
  game: GameState,
  investigatorId: string,
): string[] {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    return [];
  }

  return investigator.assetIds.filter(
    (assetId) => {
      const asset =
        game.assets[assetId];

      return (
        asset !== undefined &&
        (
          asset.type === "item" ||
          asset.type === "trinket"
        )
      );
    },
  );
}

export function startBurdenOfGreed(
  game: GameState,
  investigatorIndex: number,
): GameState {
  const investigatorId =
    game.investigatorOrder[
      investigatorIndex
    ];

  /*
   * All Investigators have resolved
   * Burden of Greed.
   */

  if (!investigatorId) {
    return {
      ...game,

      currentMythosId: null,

      pendingDecision: null,

      activeInvestigatorId: null,
    };
  }

  const investigator =
    game.investigators[
      investigatorId
    ];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  const itemIds =
    getItemIds(
      game,
      investigatorId,
    );

  /*
   * This Investigator has no Items.
   *
   * He loses 0 Health and we immediately
   * continue with the next Investigator.
   */

  if (itemIds.length === 0) {
    return startBurdenOfGreed(
      game,
      investigatorIndex + 1,
    );
  }

  return {
    ...game,

    activeInvestigatorId:
      investigatorId,

    pendingDecision: {
      type: "select-card",

      title:
        "Burden of Greed",

      message:
        "Choose any number of Item possessions to discard, then finish.",

      cardIds:
        itemIds,

      selectableCardIds:
        itemIds,

      minSelections: 0,

      maxSelections:
        itemIds.length,

      selectedCardIds: [],

      investigatorId,

      source:
        `mythos:burden-of-greed:${investigatorIndex}`,
    },
  };
}

function getSpellIds(
  game: GameState,
  investigatorId: string,
): string[] {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    return [];
  }

  return investigator.spellIds.filter(
    (spellId) =>
      game.spells[spellId] !== undefined,
  );
}

export function startTreacherousMagic(
  game: GameState,
  investigatorIndex: number,
): GameState {
  const investigatorId =
    game.investigatorOrder[
      investigatorIndex
    ];

  /*
   * All Investigators have resolved
   * Treacherous Magic.
   */

  if (!investigatorId) {
    return {
      ...game,

      currentMythosId: null,

      pendingDecision: null,

      activeInvestigatorId: null,
    };
  }

  const investigator =
    game.investigators[
      investigatorId
    ];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  const spellIds =
    getSpellIds(
      game,
      investigatorId,
    );

  /*
   * This Investigator has no Spells.
   *
   * He loses 0 Sanity and we immediately
   * continue with the next Investigator.
   */

  if (spellIds.length === 0) {
    return startTreacherousMagic(
      game,
      investigatorIndex + 1,
    );
  }

  return {
    ...game,

    activeInvestigatorId:
      investigatorId,

    pendingDecision: {
      type: "select-card",

      title:
        "Treacherous Magic",

      message:
        "Choose any number of Spell possessions to discard, then finish.",

      cardIds:
        spellIds,

      selectableCardIds:
        spellIds,

      minSelections: 0,

      maxSelections:
        spellIds.length,

      selectedCardIds: [],

      investigatorId,

      source:
        `mythos:treacherous-magic:${investigatorIndex}`,
    },
  };
}

export function startPatrollingTheBorder(
    game: GameState,
): GameState {
    const investigatorIds =
        game.investigatorOrder.filter(
            (investigatorId) =>
                game.investigators[
                    investigatorId
                ] !== undefined,
        );

    if (investigatorIds.length === 0) {
        return {
            ...game,
            currentMythosId: null,
            pendingDecision: null,
        };
    }

    return {
        ...game,

        pendingDecision: {
            type: "choice",

            title:
                "Patrolling the Border",

            message:
                "The Lead Investigator chooses 1 investigator to become Delayed.",

            image:
                "/cards/Mythos/Mythos/Medium - Patrolling the Border.jpg",

            options:
              investigatorIds.map(
                  (investigatorId) => ({
                      id:
                          `patrolling-the-border:${investigatorId}`,

                      title:
                          investigatorId,

                      description:
                          "Become Delayed.",
                  }),
              ),

            source:
                "mythos:patrolling-the-border:choose-investigator",
        },
    };
}

export function startEyesEverywhere(
  game: GameState,
  mythos: MythosDefinition,
  investigatorIndex: number,
): GameState {
  /*
   * ============================================================
   * ALL INVESTIGATORS RESOLVED
   * ============================================================
   */

  if (
    investigatorIndex >=
    game.investigatorOrder.length
  ) {
    return {
      ...game,

      board: {
        ...game.board,

        mythosDiscard: [
          ...game.board.mythosDiscard,
          mythos,
        ],
      },

      currentMythosId: null,

      pendingDecision: null,

      activeInvestigatorId: null,

      combatOrder: null,
    };
  }

  const investigatorId =
    game.investigatorOrder[
      investigatorIndex
    ];

  if (!investigatorId) {
    return startEyesEverywhere(
      game,
      mythos,
      investigatorIndex + 1,
    );
  }

  const investigator =
    game.investigators[
      investigatorId
    ];

  if (!investigator) {
    return startEyesEverywhere(
      game,
      mythos,
      investigatorIndex + 1,
    );
  }

  /*
   * A defeated Investigator no longer resolves
   * the remaining effects of the Mythos card.
   */

  if (investigator.isDefeated) {
    return startEyesEverywhere(
      game,
      mythos,
      investigatorIndex + 1,
    );
  }

  return {
    ...game,

    activeInvestigatorId:
      investigatorId,

    pendingDecision: {
      type: "single-die-roll",

      title:
        "Eyes Everywhere",

      message:
        "Roll 1 die: 1-2 lose 2 Health and 2 Sanity; 3-5 are ambushed by a Monster; 6 has no effect.",

      image:
        mythos.image,

      investigatorId,

      onOneOrTwo: [
        {
          type: "lose-health",
          amount: 2,
        },
        {
          type: "lose-sanity",
          amount: 2,
        },
      ],

      onThreeToFive: [
        {
          type: "combat-random-monster",
        },
      ],

      onSix: [],

      onComplete: [],

      source:
        `mythos:eyes-everywhere:${investigatorIndex}`,
    },
  };
}

export function resolveMythosSpecial(
  game: GameState,
  mythos: MythosDefinition,
  specialId: string,
  map: MapDefinition,
): GameState {
  switch (specialId) {

    case "spreading-sickness-encounter": {
      if (
          mythos.id !==
          "spreading-sickness"
      ) {
          throw new Error(
              `Mythos "${mythos.id}" cannot resolve Spreading Sickness Encounter.`,
          );
      }

      const investigatorId =
          game.activeInvestigatorId;

      if (!investigatorId) {
          throw new Error(
              "There is no active investigator.",
          );
      }

      const investigator =
          game.investigators[
              investigatorId
          ];

      if (!investigator) {
          throw new Error(
              `Investigator "${investigatorId}" does not exist.`,
          );
      }

      if (
          investigator.spaceId !==
          "space-17"
      ) {
          return game;
      }

      const mythosInPlay =
          game.board.mythosInPlay.find(
              (entry) =>
                  entry.definitionId ===
                  "spreading-sickness",
          );

      if (!mythosInPlay) {
          return game;
      }

      const investigatorCount =
          game.investigatorOrder.length;

      const healthTokens =
          mythosInPlay.healthTokens ?? 0;

      const clueCost =
          Math.max(
              0,
              investigatorCount -
                  healthTokens,
          );

      return {
          ...game,

          pendingDecision: {
              type: "test",

              title:
                  mythos.name,

              message:
                  clueCost > 0
                      ? `Consult the Bombay doctors. Pass an Observation test, then spend ${clueCost} Clue${
                          clueCost === 1
                              ? ""
                              : "s"
                      } to solve this Rumor.`
                      : "Consult the Bombay doctors. Pass an Observation test to solve this Rumor.",

              image:
                  mythos.image,

              skill:
                  "observation",

              modifier:
                  0,

              investigatorId,

              onSuccess: [
                  {
                      type: "choice",

                      choices:
                          clueCost > 0
                              ? [
                                  {
                                      text:
                                          `Spend ${clueCost} Clue${
                                              clueCost === 1
                                                  ? ""
                                                  : "s"
                                          } to solve this Rumor.`,

                                      requirement: {
                                          type:
                                              "clues",

                                          amount:
                                              clueCost,
                                      },

                                      effects: [
                                          {
                                              type:
                                                  "lose-clues",

                                              amount:
                                                  clueCost,
                                          },
                                          {
                                              type:
                                                  "solve-mythos-rumor",

                                              mythosId:
                                                  "spreading-sickness",
                                          },
                                      ],
                                  },
                              ]
                              : [
                                  {
                                      text:
                                          "Solve this Rumor.",

                                      requirement: {
                                          type:
                                              "clues",

                                          amount:
                                              0,
                                      },

                                      effects: [
                                          {
                                              type:
                                                  "solve-mythos-rumor",

                                              mythosId:
                                                  "spreading-sickness",
                                          },
                                      ],
                                  },
                              ],
                  },
              ],

              onFail: [],

              minSuccesses:
                  1,

              onComplete: [],

              source:
                  "mythos:spreading-sickness-encounter",
          },
      };
    }

    case "rising-terror": {
      if (
        mythos.id !==
        "rising-terror"
      ) {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Rising Terror.`,
        );
      }

      const monstersWithReckoning =
        Object.values(
          game.monsters,
        ).filter(
          (monster) => {
            if (
              monster.spaceId === null ||
              monster.health <= 0
            ) {
              return false;
            }

            const definition =
              CORE_MONSTERS.find(
                (definition) =>
                  definition.id ===
                  monster.definitionId,
              ) ??
              CORE_EPIC_MONSTERS.find(
                (definition) =>
                  definition.id ===
                  monster.definitionId,
              );

            if (!definition) {
              return false;
            }

            return hasMonsterReckoningAbility(
              definition,
            );
          },
        );

      /*
      * If there are no Monsters with a
      * Reckoning effect, advance Doom by 1.
      */
      if (
        monstersWithReckoning.length === 0
      ) {
        const result =
          advanceDoom(game, 1);

        if (
          !game.ancientOne.awakened &&
          result.ancientOne.awakened
        ) {
          return resolveAncientOneAwakening(
            result,
            map,
            mythos.icons.length,
          );
        }

        return {
          ...result,
          currentMythosId: mythos.id,
          pendingDecision: null,
          activeInvestigatorId: null,
        };
      }

      /*
      * Resolve every Monster Reckoning twice.
      */
      return startMonsterReckoning(
        game,
        map,
        mythos.icons.length,
        2,
      );
    }

    case "perplexing-stars": {
      if (
          mythos.id !==
          "perplexing-stars"
      ) {
          throw new Error(
              `Mythos "${mythos.id}" cannot resolve Perplexing Stars.`,
          );
      }

      /*
      * ==========================================================
      * PERPLEXING STARS
      * ==========================================================
      *
      * 1. Move the Omen counterclockwise by 1.
      * 2. Count Gates matching the NEW Omen.
      * 3. Advance Doom by 1 for each matching Gate.
      */

      /*
      * Omen positions:
      *
      * 0 -> Green
      * 1 -> Blue
      * 2 -> Red
      * 3 -> Blue
      *
      * Moving counterclockwise by 1 is equivalent to
      * subtracting 1 from the current position.
      */

      const currentOmenPosition =
          (
              game.ancientOne.omenPosition %
                  4 +
              4
          ) % 4;

      const newOmenPosition =
          (
              currentOmenPosition - 1 + 4
          ) % 4;

      const omenByPosition: Record<
          number,
          "green" | "blue" | "red"
      > = {
          0: "green",
          1: "blue",
          2: "red",
          3: "blue",
      };

      const currentOmen =
          omenByPosition[
              newOmenPosition
          ];

      if (!currentOmen) {
          throw new Error(
              "Could not determine the current Omen.",
          );
      }

      /*
      * Move the Omen counterclockwise.
      */
      let currentGame: GameState = {
          ...game,

          ancientOne: {
              ...game.ancientOne,

              omenPosition:
                  newOmenPosition,
          },
      };

      /*
      * Count every Gate on the board that
      * corresponds to the NEW Omen.
      */
      const matchingGateCount =
          Object.values(
              currentGame.board.spaces,
          ).reduce(
              (total, space) =>
                  total +
                  space.gates.filter(
                      (gate) =>
                          gate.omen ===
                          currentOmen,
                  ).length,
              0,
          );

      /*
      * Advance Doom by 1 for each matching Gate.
      */
      if (matchingGateCount > 0) {
          const wasAwakened =
              currentGame.ancientOne.awakened;

          currentGame =
              advanceDoom(
                  currentGame,
                  matchingGateCount,
              );

          /*
          * If Doom caused the Ancient One
          * to awaken, resolve the Awakening.
          */
          if (
              !wasAwakened &&
              currentGame.ancientOne.awakened
          ) {
              return resolveAncientOneAwakening(
                  currentGame,
                  map,
                  mythos.icons.length,
              );
          }
      }

      /*
      * Finish the Mythos card.
      */
      return {
          ...currentGame,

          currentMythosId:
              null,

          pendingDecision:
              null,

          activeInvestigatorId:
              null,
      };
    }

    case "mysterious-lights-encounter": {
      if (
          mythos.id !==
          "mysterious-lights"
      ) {
          throw new Error(
              `Mythos "${mythos.id}" cannot resolve Mysterious Lights Encounter.`,
          );
      }

      const investigatorId =
          game.activeInvestigatorId;

      if (!investigatorId) {
          throw new Error(
              "There is no active investigator.",
          );
      }

      const investigator =
          game.investigators[
              investigatorId
          ];

      if (!investigator) {
          throw new Error(
              `Investigator "${investigatorId}" does not exist.`,
          );
      }

      if (
          investigator.spaceId !==
          "space-13"
      ) {
          return game;
      }

      const clueCost =
          Math.ceil(
              game.investigatorOrder.length /
                  2,
          );

      return {
          ...game,

          pendingDecision: {
              type: "test",

              title:
                  mythos.name,

              message:
                  "Fly a plane over the arctic ice and scout for the source of the mysterious lights.",

              image:
                  mythos.image,

              skill:
                  "observation",

              modifier:
                  0,

              investigatorId,

              onSuccess: [
                  {
                      type: "choice",

                      choices: [
                          {
                              text:
                                  `Spend ${clueCost} Clue${
                                      clueCost === 1
                                          ? ""
                                          : "s"
                                  } to solve this Rumor.`,

                              requirement: {
                                  type:
                                      "clues",

                                  amount:
                                      clueCost,
                              },

                              effects: [
                                  {
                                      type:
                                          "lose-clues",

                                      amount:
                                          clueCost,
                                  },

                                  {
                                      type:
                                          "solve-mythos-rumor",

                                      mythosId:
                                          "mysterious-lights",
                                  },
                              ],
                          },
                      ],
                  },
              ],

              onFail: [],

              minSuccesses:
                  1,

              onComplete: [],

              source:
                  "mythos:mysterious-lights-encounter",
          },
      };
    }

    case "from-beyond": {
      if (
          mythos.id !==
          "from-beyond"
      ) {
          throw new Error(
              `Mythos "${mythos.id}" cannot resolve From Beyond.`,
          );
      }

      /*
      * Find all Mythos currently in play
      * that have a Reckoning effect.
      */

      const mythosWithReckoning =
          game.board.mythosInPlay.filter(
              (entry) => {
                  const definition =
                      ALL_MYTHOS.find(
                          (item) =>
                              item.id ===
                              entry.definitionId,
                      );

                  return (
                      definition?.reckoning !==
                      undefined
                  );
              },
          );

      /*
      * If there are no Mythos cards with
      * a Reckoning effect, advance Doom by 1.
      */

      if (
          mythosWithReckoning.length === 0
      ) {
          const wasAwakened =
              game.ancientOne.awakened;

          const advancedGame =
              advanceDoom(
                  game,
                  1,
              );

          /*
          * Doom reaching 0 awakens
          * the Ancient One.
          */

          if (
              !wasAwakened &&
              advancedGame.ancientOne.awakened
          ) {
              return resolveAncientOneAwakening(
                  advancedGame,
                  map,
                  mythos.icons.length,
                  {
                      type: "mythos",
                      nextIconIndex:
                          mythos.icons.length,
                      mythosIds: [],
                      resolvedMythosIds: [],
                  },
              );
          }

          return advancedGame;
      }

      /*
      * Investigators may spend Clues as a group
      * to prevent the Reckoning effects.
      */

      const clueCost =
          Math.ceil(
              game.investigatorOrder.length /
                  2,
          );

      return {
          ...game,

          pendingDecision: {
              type: "choice",

              title:
                  "From Beyond",

              message:
                  `The investigators may spend ${clueCost} Clue${
                      clueCost === 1
                          ? ""
                          : "s"
                  } as a group to prevent the Reckoning effects.`,

              options: [
                  {
                      id:
                          "from-beyond:spend-clues",

                      title:
                          "Spend Clues",

                      description:
                          `Spend ${clueCost} Clue${
                              clueCost === 1
                                  ? ""
                                  : "s"
                          } to prevent the Reckoning effects.`,
                  },
                  {
                      id:
                          "from-beyond:resolve-reckonings",

                      title:
                          "Resolve Reckonings",

                      description:
                          "Resolve the Reckoning effect on each Mythos card in play twice.",
                  },
              ],

              source:
                  "mythos:from-beyond",
          },
      };
    }

    case "eyes-everywhere": {
      if (
        mythos.id !==
        "eyes-everywhere"
      ) {
        throw new Error(
          "Invalid Mythos for Eyes Everywhere.",
        );
      }

      return startEyesEverywhere(
        game,
        mythos,
        0,
      );
    }

    case "dimensions-collide-encounter": {
      if (
          mythos.id !==
          "dimensions-collide"
      ) {
          throw new Error(
              `Mythos "${mythos.id}" cannot resolve Dimensions Collide Encounter.`,
          );
      }

      const investigatorId =
          game.activeInvestigatorId;

      if (!investigatorId) {
          throw new Error(
              "There is no active investigator.",
          );
      }

      const investigator =
          game.investigators[
              investigatorId
          ];

      if (!investigator) {
          throw new Error(
              `Investigator "${investigatorId}" does not exist.`,
          );
      }

      /*
      * Dimensions Collide can only be researched
      * on Space 11.
      */

      if (
          investigator.spaceId !==
          "space-11"
      ) {
          return game;
      }

      const investigatorCount =
          game.investigatorOrder.length;

      const clueCost =
          Math.ceil(
              investigatorCount / 2,
          );

      return {
          ...game,

          pendingDecision: {
              type: "test",

              title:
                  mythos.name,

              message:
                  "Attempt to infiltrate the hidden sect of Tcho-Tchos destabilizing the fabric of reality.",

              image:
                  mythos.image,

              skill:
                  "observation",

              modifier:
                  0,

              investigatorId,

              onSuccess: [
                  {
                      type: "choice",

                      choices: [
                          {
                              text:
                                  `Spend ${clueCost} Clue${
                                      clueCost === 1
                                          ? ""
                                          : "s"
                                  } to solve this Rumor.`,

                              requirement: {
                                  type:
                                      "clues",

                                  amount:
                                      clueCost,
                              },

                              effects: [
                                  {
                                      type:
                                          "lose-clues",

                                      amount:
                                          clueCost,
                                  },
                                  {
                                      type:
                                          "solve-mythos-rumor",

                                      mythosId:
                                          "dimensions-collide",
                                  },
                              ],
                          },
                      ],
                  },
              ],

              onFail: [],

              minSuccesses:
                  1,

              onComplete: [],

              source:
                  "mythos:dimensions-collide-encounter",
          },
      };
    }

    case "dimensions-collide": {
      if (
          mythos.id !==
          "dimensions-collide"
      ) {
          throw new Error(
              `Mythos "${mythos.id}" cannot resolve Dimensions Collide.`,
          );
      }

      const mythosInPlay =
          game.board.mythosInPlay.find(
              (entry) =>
                  entry.definitionId ===
                  "dimensions-collide",
          );

      if (!mythosInPlay) {
          return game;
      }

      /*
      * ==========================================================
      * DIMENSIONS COLLIDE — 0 ELDRITCH TOKENS
      * ==========================================================
      *
      * When there are no Eldritch Tokens on this Rumor,
      * the investigators immediately lose the game.
      */

      if (
          mythosInPlay.eldritchTokens === 0
      ) {
          return {
              ...game,

              status:
                  "defeat",

              pendingDecision:
                  null,

              activeInvestigatorId:
                  null,
          };
      }

      return game;
    }

    case "desperate-times": {
      if (
          mythos.id !==
          "desperate-times"
      ) {
          throw new Error(
              `Mythos "${mythos.id}" cannot resolve Desperate Times.`,
          );
      }

      const leadInvestigatorId =
          getLeadInvestigatorId(game);

      if (!leadInvestigatorId) {
          return {
              ...game,

              currentMythosId:
                  null,

              pendingDecision:
                  null,

              activeInvestigatorId:
                  null,
          };
      }

      /*
      * ==========================================================
      * DESPERATE TIMES
      * ==========================================================
      *
      * The Lead Investigator chooses:
      *
      * -> Gain a Dark Pact Condition and prevent Doom
      *    from advancing.
      *
      * OR
      *
      * -> Do not gain Dark Pact and Doom advances by 2.
      */

      return {
          ...game,

          activeInvestigatorId:
              leadInvestigatorId,

          pendingDecision: {
              type: "choice",

              title:
                  "Desperate Times",

              message:
                  "The Lead Investigator must choose whether to gain a Dark Pact Condition or allow Doom to advance by 2.",

              options: [
                  {
                      id:
                          "desperate-times:dark-pact",

                      title:
                          "Gain Dark Pact",

                      description:
                          "Gain a Dark Pact Condition and prevent Doom from advancing.",
                  },

                  {
                      id:
                          "desperate-times:doom",

                      title:
                          "Do Not Gain Dark Pact",

                      description:
                          "Do not gain Dark Pact. Doom advances by 2.",
                  },
              ],

              source:
                  "mythos:desperate-times",
          },
      };
    }

    case "all-for-nothing": {
      if (
          mythos.id !==
          "all-for-nothing"
      ) {
          throw new Error(
              `Mythos "${mythos.id}" cannot resolve All For Nothing.`,
          );
      }

      /*
      * ==========================================================
      * ALL FOR NOTHING
      * ==========================================================
      *
      * If there are no solved Mysteries:
      *   -> Advance Doom by 1.
      *
      * Otherwise:
      *   -> Investigators may collectively spend Clues
      *      equal to half the number of investigators.
      *   -> If they do not, return 1 solved Mystery to
      *      the Mystery deck.
      */

      const solvedMysteryIds =
          game.mysteries.solvedMysteryIds;

      /*
      * ==========================================================
      * NO SOLVED MYSTERIES
      * ==========================================================
      */

      if (
          solvedMysteryIds.length === 0
      ) {
          const wasAwakened =
              game.ancientOne.awakened;

          const updatedGame =
              advanceDoom(
                  game,
                  1,
              );

          /*
          * If Doom awakened the Ancient One,
          * continue through the normal Awakening flow.
          */

          if (
              !wasAwakened &&
              updatedGame.ancientOne.awakened
          ) {
              return resolveAncientOneAwakening(
                  {
                      ...updatedGame,

                      currentMythosId:
                          mythos.id,
                  },
                  map,
                  mythos.icons.length,
              );
          }

          return {
              ...updatedGame,

              currentMythosId:
                  null,

              pendingDecision:
                  null,

              activeInvestigatorId:
                  null,
          };
      }

      /*
      * ==========================================================
      * SOLVED MYSTERY EXISTS
      * ==========================================================
      *
      * Half the number of investigators, rounded up.
      */

      const clueCost =
          Math.ceil(
              game.investigatorOrder.length /
                  2,
          );

      return {
          ...game,

          pendingDecision: {
              type: "choice",

              title:
                  "All For Nothing",

              message:
                  `The investigators may collectively spend ${clueCost} Clue${
                      clueCost === 1
                          ? ""
                          : "s"
                  } to prevent a solved Mystery from returning to the deck.`,

              options: [
                  {
                      id:
                          "all-for-nothing:spend-clues",

                      title:
                          `Spend ${clueCost} Clue${
                              clueCost === 1
                                  ? ""
                                  : "s"
                          }`,

                      description:
                          "Spend the required Clues as a group.",
                  },

                  {
                      id:
                          "all-for-nothing:do-not-spend",

                      title:
                          "Do Not Spend",

                      description:
                          "Shuffle a solved Mystery back into the Mystery deck.",
                  },
              ],

              source:
                  "mythos:all-for-nothing",
          },
      };
    }

    case "unexpected-betrayal": {
      if (
          mythos.id !==
          "unexpected-betrayal"
      ) {
          throw new Error(
              `Mythos "${mythos.id}" cannot resolve Unexpected Betrayal.`,
          );
      }

      return startUnexpectedBetrayal(
          game,
          0,
      );
    }

    case "patrolling-the-border": {
      if (
          mythos.id !==
          "patrolling-the-border"
      ) {
          throw new Error(
              `Mythos "${mythos.id}" cannot resolve Patrolling the Border.`,
          );
      }

      return startPatrollingTheBorder(
          game,
      );
    }

    case "haunting-nightmares": {
      if (
        mythos.id !==
        "haunting-nightmares"
      ) {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Haunting Nightmares.`,
        );
      }

      const investigatorId =
        game.investigatorOrder[0];

      if (!investigatorId) {
        return {
          ...game,

          currentMythosId:
            null,

          pendingDecision:
            null,

          activeInvestigatorId:
            null,
        };
      }

      const investigator =
        game.investigators[
          investigatorId
        ];

      if (!investigator) {
        throw new Error(
          `Investigator "${investigatorId}" does not exist.`,
        );
      }

      const options = [];

      /*
      * The Investigator may spend 1 Clue
      * to avoid the effect.
      */

      if (investigator.clues > 0) {
        options.push({
          id:
            `haunting-nightmares:spend-clue:0`,

          title:
            "Spend 1 Clue",

          description:
            "Spend 1 Clue to avoid losing Sanity and gaining a Madness Condition.",
        });
      }

      /*
      * Otherwise the Investigator suffers
      * the full effect.
      */

      options.push({
        id:
          "haunting-nightmares:do-not-spend:0",

        title:
          "Do Not Spend Clue",

        description:
          "Lose 2 Sanity and gain 1 Madness Condition.",
      });

      return {
        ...game,

        activeInvestigatorId:
          investigatorId,

        pendingDecision: {
          type: "choice",

          title:
            "Haunting Nightmares",

          message:
            "This Investigator may spend 1 Clue to avoid losing 2 Sanity and gaining a Madness Condition.",

          options,

          source:
            "mythos:haunting-nightmares:0",
        },
      };
    }

    case "no-peace-for-the-fallen": {
      if (
          mythos.id !==
          "no-peace-for-the-fallen"
      ) {
          throw new Error(
              `Mythos "${mythos.id}" cannot resolve No Peace For the Fallen.`,
          );
      }

      /*
      * ==========================================================
      * FIND DEFEATED INVESTIGATORS
      * ==========================================================
      */

      const defeatedInvestigatorIds =
          game.investigatorOrder.filter(
              (investigatorId) =>
                  game.investigators[
                      investigatorId
                  ]?.isDefeated === true,
          );

      /*
      * ==========================================================
      * DISCARD ALL POSSESSIONS
      * ==========================================================
      *
      * Possessions include:
      * - Assets
      * - Spells
      * - Artifacts
      */

      let currentGame =
          game;

      for (
          const investigatorId of
              defeatedInvestigatorIds
      ) {
          const investigator =
              currentGame.investigators[
                  investigatorId
              ];

          if (!investigator) {
              continue;
          }

          /*
          * ------------------------------------------------------
          * ASSETS
          * ------------------------------------------------------
          */

          const discardedAssets =
              investigator.assetIds
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
                          asset !==
                          undefined,
                  );

          /*
          * ------------------------------------------------------
          * SPELLS
          * ------------------------------------------------------
          */

          const discardedSpells =
              investigator.spellIds
                  .map(
                      (spellId) =>
                          currentGame.spells[
                              spellId
                          ],
                  )
                  .filter(
                      (
                          spell,
                      ): spell is NonNullable<
                          typeof spell
                      > =>
                          spell !==
                          undefined,
                  );

          /*
          * ------------------------------------------------------
          * ARTIFACTS
          * ------------------------------------------------------
          */

          const discardedArtifacts =
              investigator.artifactIds
                  .map(
                      (artifactId) =>
                          currentGame.artifacts[
                              artifactId
                          ],
                  )
                  .filter(
                      (
                          artifact,
                      ): artifact is NonNullable<
                          typeof artifact
                      > =>
                          artifact !==
                          undefined,
                  );

          /*
          * Add all possessions to their respective
          * discard piles.
          */

          currentGame = {
              ...currentGame,

              board: {
                  ...currentGame.board,

                  assetDiscard: [
                      ...currentGame.board
                          .assetDiscard,
                      ...discardedAssets,
                  ],

                  spellDiscard: [
                      ...currentGame.board
                          .spellDiscard,
                      ...discardedSpells,
                  ],

                  artifactDiscard: [
                      ...currentGame.board
                          .artifactDiscard,
                      ...discardedArtifacts,
                  ],
              },
          };
      }

      /*
      * ==========================================================
      * REMOVE DEFEATED INVESTIGATORS
      * ==========================================================
      *
      * Returning the Investigator token and sheet to the
      * game box means they are no longer part of the game.
      */

      if (
          defeatedInvestigatorIds.length >
          0
      ) {
          const remainingInvestigatorIds =
              currentGame.investigatorOrder.filter(
                  (investigatorId) =>
                      !defeatedInvestigatorIds.includes(
                          investigatorId,
                      ),
              );

          const remainingInvestigators = {
              ...currentGame.investigators,
          };

          for (
              const investigatorId of
                  defeatedInvestigatorIds
          ) {
              delete remainingInvestigators[
                  investigatorId
              ];
          }

          currentGame = {
              ...currentGame,

              investigators:
                  remainingInvestigators,

              investigatorOrder:
                  remainingInvestigatorIds,

              activeInvestigatorId:
                  null,
          };

          /*
          * If the Lead Investigator was one of the
          * defeated investigators, pass the Lead
          * Investigator token to a remaining investigator.
          */

          if (
              !currentGame.investigators[
                  currentGame.leadInvestigatorId ??
                  ""
              ]
          ) {
              currentGame = {
                  ...currentGame,

                  leadInvestigatorId:
                      remainingInvestigatorIds[0] ??
                      null,
              };
          }
      }

      /*
      * ==========================================================
      * LEAD INVESTIGATOR GAINS CURSED
      * ==========================================================
      */

      const leadInvestigatorId =
          getLeadInvestigatorId(
              currentGame,
          );

      if (
          leadInvestigatorId
      ) {
          currentGame =
              gainCondition(
                  currentGame,
                  leadInvestigatorId,
                  "condition-cursed",
              );
      }

      return currentGame;
    }

    case "legitimate-banking": {
      if (
          mythos.id !==
          "legitimate-banking"
      ) {
          throw new Error(
              `Mythos "${mythos.id}" cannot resolve Legitimate Banking.`,
          );
      }

      const investigatorId =
          getLeadInvestigatorId(
              game,
          );

      if (!investigatorId) {
          throw new Error(
              "Legitimate Banking could not determine the Lead Investigator.",
          );
      }

      const investigator =
          game.investigators[
              investigatorId
          ];

      if (!investigator) {
          throw new Error(
              `Investigator "${investigatorId}" does not exist.`,
          );
      }

      /*
      * The card checks whether the Lead Investigator
      * already had a Debt BEFORE gaining the new one.
      */
      const existingDebtId =
          investigator.conditionIds.find(
              (conditionId) =>
                  game.conditions[
                      conditionId
                  ]?.definitionId ===
                  "condition-debt",
          );

      /*
      * The Lead Investigator gains a Debt Condition.
      */
      let currentGame =
          gainCondition(
              game,
              investigatorId,
              "condition-debt",
          );

      /*
      * If he already had Debt, resolve the Reckoning
      * effect on that existing Debt card.
      */
      if (existingDebtId) {
          const debtDefinition =
              coreConditionDefinitions.find(
                  (definition) =>
                      definition.id ===
                      "condition-debt",
              );

          if (!debtDefinition) {
              throw new Error(
                  'Condition definition "condition-debt" does not exist.',
              );
          }

          const reckoningEffect =
              debtDefinition.frontEffects.find(
                  (effect) =>
                      effect.type ===
                      "on-reckoning",
              );

          if (!reckoningEffect) {
              throw new Error(
                  'Condition "condition-debt" has no Reckoning effect.',
              );
          }

          const result =
              resolveConditionFrontEffects(
                  currentGame,
                  investigatorId,
                  existingDebtId,
                  reckoningEffect,
                  map,
              );

          currentGame =
              result.game;
      }

      return currentGame;
    }

    case "from-bad-to-worse": {
      if (
        mythos.id !==
        "from-bad-to-worse"
      ) {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve From Bad to Worse.`,
        );
      }

      /*
      * ==========================================================
      * FROM BAD TO WORSE
      * ==========================================================
      *
      * Each Investigator:
      *
      *   -> loses 1 Health for each Injury Condition;
      *   -> loses 1 Sanity for each Madness Condition;
      *   -> discards 1 Clue for each Deal Condition.
      */

      let currentGame = game;

      for (
        const investigatorId of
          currentGame.investigatorOrder
      ) {
        const injuryCount =
          getInvestigatorConditionsByCategory(
            currentGame,
            investigatorId,
            "Injury",
          ).length;

        const madnessCount =
          getInvestigatorConditionsByCategory(
            currentGame,
            investigatorId,
            "madness",
          ).length;

        const dealCount =
          getInvestigatorConditionsByCategory(
            currentGame,
            investigatorId,
            "Deal",
          ).length;

        const effects = [];

        if (injuryCount > 0) {
          effects.push({
            type: "lose-health" as const,
            amount: injuryCount,
          });
        }

        if (madnessCount > 0) {
          effects.push({
            type: "lose-sanity" as const,
            amount: madnessCount,
          });
        }

        if (dealCount > 0) {
          effects.push({
            type: "lose-clues" as const,
            amount: dealCount,
          });
        }

        if (effects.length > 0) {
          currentGame =
            resolveEncounterEffects(
              currentGame,
              investigatorId,
              effects,
              map,
            );
        }
      }

      return {
        ...currentGame,

        currentMythosId:
          null,

        pendingDecision:
          null,

        activeInvestigatorId:
          null,
      };
    }

    case "growing-madness": {
      if (mythos.id !== "growing-madness") {
        throw new Error(
          `Mythos special "${specialId}" does not match Mythos "${mythos.id}".`,
        );
      }

      /*
       * Growing Madness is only resolved when
       * there are no Eldritch Tokens on the Mythos.
       */

      const mythosInPlay =
        game.board.mythosInPlay.find(
          (entry) =>
            entry.definitionId ===
            mythos.id,
        );

      if (!mythosInPlay) {
        return game;
      }

      if (
        mythosInPlay.eldritchTokens > 0
      ) {
        return game;
      }

      /*
       * Every investigator loses 3 Sanity.
       */

      let currentGame = game;

      for (
        const investigatorId of
          Object.keys(
            currentGame.investigators,
          )
      ) {
        currentGame =
          resolveEncounterEffects(
            currentGame,
            investigatorId,
            [
              {
                type: "lose-sanity",
                amount: 3,
              },
            ],
            map,
          );
      }

      /*
      * ==========================================================
      * SOLVE GROWING MADNESS
      * ==========================================================
      *
      * Growing Madness is represented as an Ongoing Mythos in
      * the current model, but its card text instructs the player
      * to solve this Mythos when there are no Eldritch Tokens.
      */

      const remainingMythosInPlay =
        currentGame.board.mythosInPlay.filter(
          (entry) =>
            entry.definitionId !==
            mythos.id,
        );

      const rumorIcon =
        mythos.icons.find(
          (icon) =>
            icon.type ===
            "spawn-rumor",
        );

      const spaces = {
        ...currentGame.board.spaces,
      };

      if (
        rumorIcon &&
        rumorIcon.type ===
          "spawn-rumor"
      ) {
        const space =
          spaces[rumorIcon.spaceId];

        if (space) {
          spaces[rumorIcon.spaceId] = {
            ...space,
            rumor: false,
          };
        }
      }

      return {
        ...currentGame,

        board: {
          ...currentGame.board,

          spaces,

          mythosInPlay:
            remainingMythosInPlay,

          mythosDiscard: [
            ...currentGame.board.mythosDiscard,
            mythos,
          ],
        },
      };
    }

    case "burden-of-greed": {
      if (mythos.id !== "burden-of-greed") {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Burden of Greed.`,
        );
      }

      return startBurdenOfGreed(
        game,
        0,
      );
    }

    case "blood-flows": {
      if (mythos.id !== "blood-flows") {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Blood Flows.`,
        );
      }

      const leadInvestigatorId =
        getLeadInvestigatorId(game);

      if (!leadInvestigatorId) {
        throw new Error(
          "There is no Lead Investigator.",
        );
      }

      const monsterIds =
        Object.values(game.monsters)
          .filter(
            (monster) =>
              !!monster.spaceId,
          )
          .map(
            (monster) =>
              monster.id,
          );

      /*
      * ============================================================
      * NO MONSTERS
      * ============================================================
      *
      * There is no Monster available to discard.
      */

      if (monsterIds.length === 0) {
        return {
          ...game,

          currentMythosId:
            null,

          pendingDecision:
            null,
        };
      }

      /*
      * ============================================================
      * CHOOSE MONSTER
      * ============================================================
      *
      * The Lead Investigator chooses any Monster
      * currently on the game board.
      */

      return {
        ...game,

        activeInvestigatorId:
          leadInvestigatorId,

        pendingDecision: {
          type: "select-monster",

          title:
            "Blood Flows",

          message:
            "Choose 1 Monster to discard. The Lead Investigator loses Health equal to its toughness.",

          monsterIds,

          onMonsterSelected: [
            {
              type:
                "discard-selected-monster",
            },
          ],

          onComplete: [],

          investigatorId:
            leadInvestigatorId,

          source:
            "mythos:blood-flows",
        },
      };
    }

    case "calling-the-elder-things": {
      if (
        mythos.id !==
        "calling-the-elder-things"
      ) {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Calling the Elder Things.`,
        );
      }

      /*
      * ==========================================================
      * CALLING THE ELDER THINGS
      * ==========================================================
      *
      * Spawn 1 Monster on each space that contains
      * a Cultist Monster.
      *
      * Each space is processed only once, regardless
      * of how many Cultists are present there.
      */

      const cultistSpaceIds =
        Object.entries(
          game.board.spaces,
        )
          .filter(
            ([, space]) =>
              space.monsterIds.some(
                (monsterId) =>
                  game.monsters[
                    monsterId
                  ]?.definitionId ===
                  "cultist",
              ),
          )
          .map(
            ([spaceId]) =>
              spaceId,
          );

      /*
      * No spaces contain a Cultist.
      */

      if (
        cultistSpaceIds.length === 0
      ) {
        return {
          ...game,

          currentMythosId:
            null,

          pendingDecision:
            null,

          activeInvestigatorId:
            null,
        };
      }

      /*
      * Spawn exactly 1 Monster on each
      * Cultist-containing space.
      */

      let currentGame = game;

      for (
        const spaceId of
          cultistSpaceIds
      ) {
        currentGame =
          spawnMonsterAtSpace(
            currentGame,
            spaceId,
          );
      }

      return {
        ...currentGame,

        currentMythosId:
          null,

        pendingDecision:
          null,

        activeInvestigatorId:
          null,
      };
    }

    case "dimensional-instability": {
      if (
        mythos.id !==
        "dimensional-instability"
      ) {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Dimensional Instability.`,
        );
      }

      /*
      * ==========================================================
      * DETERMINE CURRENT OMEN
      * ==========================================================
      *
      * Omen track:
      *
      * 0 -> Green
      * 1 -> Blue
      * 2 -> Red
      * 3 -> Blue
      */

      const omenByPosition: Record<
        number,
        "green" | "blue" | "red"
      > = {
        0: "green",
        1: "blue",
        2: "red",
        3: "blue",
      };

      const currentOmen =
        omenByPosition[
          (
            (
              game.ancientOne.omenPosition %
              4
            ) + 4
          ) % 4
        ];

      if (!currentOmen) {
        throw new Error(
          "Could not determine the current Omen.",
        );
      }

      /*
      * ==========================================================
      * FIND AND DISCARD MATCHING GATES
      * ==========================================================
      */

      const updatedSpaces = {
        ...game.board.spaces,
      };

      const discardedGates =
        [];

      for (
        const [
          spaceId,
          space,
        ] of Object.entries(
          game.board.spaces,
        )
      ) {
        const matchingGates =
          space.gates.filter(
            (gate) =>
              gate.omen ===
              currentOmen,
          );

        if (
          matchingGates.length === 0
        ) {
          continue;
        }

        const remainingGates =
          space.gates.filter(
            (gate) =>
              gate.omen !==
              currentOmen,
          );

        updatedSpaces[spaceId] = {
          ...space,

          gates:
            remainingGates,
        };

        discardedGates.push(
          ...matchingGates,
        );
      }

      /*
      * ==========================================================
      * ADVANCE DOOM
      * ==========================================================
      *
      * Doom advances by 1 for each
      * Gate discarded.
      */

      const wasAwakened =
        game.ancientOne.awakened;

      let resolvedGame: GameState = {
        ...game,

        board: {
          ...game.board,

          spaces:
            updatedSpaces,

          gateDiscard: [
            ...game.board.gateDiscard,
            ...discardedGates,
          ],
        },
      };

      if (
        discardedGates.length > 0
      ) {
        resolvedGame =
          advanceDoom(
            resolvedGame,
            discardedGates.length,
          );
      }

      /*
      * ==========================================================
      * ANCIENT ONE AWAKENING
      * ==========================================================
      *
      * If this card caused the Ancient One
      * to awaken, resolve the Awakening effect
      * before continuing the Mythos.
      */

      if (
        !wasAwakened &&
        resolvedGame.ancientOne.awakened
      ) {
        return resolveAncientOneAwakening(
          {
            ...resolvedGame,

            currentMythosId:
              mythos.id,
          },

          map,

          mythos.icons.length,
        );
      }

      /*
      * ==========================================================
      * FINISH MYTHOS
      * ==========================================================
      */

      return {
        ...resolvedGame,

        currentMythosId:
          null,

        pendingDecision:
          null,

        activeInvestigatorId:
          null,
      };
    }

    case "arrests-made-in-murder-case": {
      if (
        mythos.id !==
        "arrests-made-in-murder-case"
      ) {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Arrests Made in Murder Case!.`,
        );
      }

      const investigatorIds =
        getArrestsMadeInvestigators(
          game,
          map,
        );

      return startArrestsMade(
        game,
        map,
        investigatorIds,
        0,
      );
    }

    case "fractured-reality": {
      if (
        mythos.id !== "fractured-reality"
      ) {
        throw new Error(
          `Mythos special "${specialId}" does not match Mythos "${mythos.id}".`,
        );
      }

      const mythosInPlay =
        game.board.mythosInPlay.find(
          (entry) =>
            entry.definitionId ===
            mythos.id,
        );

      if (!mythosInPlay) {
        return game;
      }

      /*
      * Fractured Reality is only resolved when
      * there are no Eldritch Tokens on the Rumor.
      */

      if (
        mythosInPlay.eldritchTokens > 0
      ) {
        return game;
      }

      /*
      * Count all Gates currently on the board.
      */

      const gateCount =
        Object.values(
          game.board.spaces,
        ).reduce(
          (total, space) =>
            total + space.gates.length,
          0,
        );

      /*
      * Remember whether the Ancient One
      * was already awakened before Doom advances.
      */

      const wasAwakened =
        game.ancientOne.awakened;

      /*
      * Advance Doom by 1 for each Gate.
      *
      * advanceDoom() also marks the Ancient One
      * as awakened if Doom reaches 0.
      */

      const currentGame =
        advanceDoom(
          game,
          gateCount,
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
            "Fractured Reality awakened the Ancient One, but the Mythos Reckoning decision could not be resumed.",
          );
        }

        return resolveAncientOneAwakening(
          solvedGame,
          map,
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


      return solvedGame;
    }

    case "fractured-reality-encounter": {
        if (
            mythos.id !== "fractured-reality"
        ) {
            throw new Error(
            `Mythos special "${specialId}" does not match Mythos "${mythos.id}".`,
            );
        }

        const investigatorId =
            game.activeInvestigatorId;

        if (!investigatorId) {
            throw new Error(
            "There is no active investigator.",
            );
        }

        const investigator =
            game.investigators[investigatorId];

        if (!investigator) {
            throw new Error(
            `Investigator "${investigatorId}" does not exist.`,
            );
        }

        if (
            investigator.spaceId !==
            "space-2"
        ) {
            return game;
        }

        return startOtherWorldEncounter(
            game,
            map,
            true,
        );
    }

    case "lost-knowledge": {
      if (mythos.id !== "lost-knowledge") {
        throw new Error(
          `Invalid Mythos for Lost Knowledge: "${mythos.id}".`,
        );
      }

      const mythosInPlay =
        game.board.mythosInPlay.find(
          (entry) =>
            entry.definitionId ===
            mythos.id,
        );

      if (!mythosInPlay) {
        return game;
      }

      /*
       * ==========================================================
       * LOST KNOWLEDGE — ENTERS PLAY
       * ==========================================================
       *
       * The Mythos enters play with 3 Eldritch Tokens.
       * Spawn the Tick-Tock Men on Space 21.
       */

      if (
        mythosInPlay.eldritchTokens > 0
      ) {
        return spawnEpicMonsterAtSpace(
          game,
          map,
          "space-21",
          "tick-tock-men",
        );
      }

      /*
       * ==========================================================
       * LOST KNOWLEDGE — 0 ELDRITCH TOKENS
       * ==========================================================
       *
       * Discard all Clues on the game board, then each
       * Investigator discards all Clues.
       */

      const clueTokensToDiscard: {
        id: string;
        spaceId: string;
      }[] = [];

      const updatedSpaces = {
        ...game.board.spaces,
      };

      /*
       * Remove every Clue token from the board.
       */

      for (
        const [
          spaceId,
          space,
        ] of Object.entries(
          game.board.spaces,
        )
      ) {
        for (
          const clueTokenId of
            space.clueTokenIds
        ) {
          clueTokensToDiscard.push({
            id: clueTokenId,
            spaceId,
          });
        }

        updatedSpaces[spaceId] = {
          ...space,

          clues: 0,

          clueTokenIds: [],
        };
      }

      /*
       * Remove every Clue from every Investigator.
       */

      const updatedInvestigators = {
        ...game.investigators,
      };

      for (
        const [
          investigatorId,
          investigator,
        ] of Object.entries(
          game.investigators,
        )
      ) {
        updatedInvestigators[
          investigatorId
        ] = {
          ...investigator,

          clues: 0,
        };
      }

      /*
       * Move all physical Clue tokens to the discard.
       */

      return {
        ...game,

        investigators:
          updatedInvestigators,

        board: {
          ...game.board,

          spaces:
            updatedSpaces,

          clueDiscard: [
            ...game.board.clueDiscard,
            ...clueTokensToDiscard,
          ],
        },
      };
    }

    case "silver-twilight-aid": {
      if (
        mythos.id !== "silver-twilight-aid"
      ) {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Silver Twilight Aid.`,
        );
      }

      return createSilverTwilightAidChoice(
        game,
        0,
      );
    }

    case "faded-from-society-encounter": {
      if (
        mythos.id !==
        "faded-from-society"
      ) {
        throw new Error(
          `Mythos "${specialId}" cannot resolve Faded From Society.`,
        );
      }

      const investigatorId =
        game.activeInvestigatorId;

      if (!investigatorId) {
        throw new Error(
          "There is no active investigator.",
        );
      }

      const investigator =
        game.investigators[
          investigatorId
        ];

      if (!investigator) {
        throw new Error(
          `Investigator "${investigatorId}" does not exist.`,
        );
      }

      /*
       * Faded From Society can only be researched
       * on Space 16.
       */

      if (
        investigator.spaceId !==
        "space-16"
      ) {
        return game;
      }

      const investigatorCount =
        game.investigatorOrder.length;

      const clueCost =
        Math.ceil(
          investigatorCount / 2,
        );

      return {
        ...game,

        pendingDecision: {
          type: "test",

          title:
            mythos.name,

          message:
            "Research similar occurrences from the past.",

          image:
            mythos.image,

          skill:
            "observation",

          modifier: 0,

          investigatorId,

          onSuccess: [
            {
              type: "choice",

              choices: [
                {
                  text:
                    `Spend ${clueCost} Clue${
                      clueCost === 1
                        ? ""
                        : "s"
                    } to solve this Rumor.`,

                  requirement: {
                    type: "clues",
                    amount:
                      clueCost,
                  },

                  effects: [
                    {
                      type:
                        "lose-clues",

                      amount:
                        clueCost,
                    },
                    {
                      type:
                        "solve-mythos-rumor",

                      mythosId:
                        "faded-from-society",
                    },
                  ],
                },
              ],
            },
          ],

          onFail: [],

          minSuccesses: 1,

          onComplete: [],

          source:
            "mythos:faded-from-society-encounter",
        },
      };
    }
    
    case "growing-madness-encounter": {
      if (mythos.id !== "growing-madness") {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Growing Madness.`,
        );
      }

      const investigatorId =
        game.activeInvestigatorId;

      if (!investigatorId) {
        throw new Error(
          "There is no active investigator.",
        );
      }

      const investigator =
        game.investigators[
          investigatorId
        ];

      if (!investigator) {
        throw new Error(
          `Investigator "${investigatorId}" does not exist.`,
        );
      }

      if (
        investigator.spaceId !==
        "space-8"
      ) {
        return game;
      }

      const investigatorCount =
        game.investigatorOrder.length;

      const clueCost =
        Math.ceil(
          investigatorCount / 2,
        );

      return {
        ...game,

        pendingDecision: {
          type: "test",

          title:
            mythos.name,

          message:
            "Attempt to find the uncharted isle.",

          image:
            mythos.image,

          skill:
            "observation",

          modifier: 0,

          investigatorId,

          onSuccess: [
            {
              type: "choice",

              choices: [
                {
                  text:
                    `Spend ${clueCost} Clue${
                      clueCost === 1
                        ? ""
                        : "s"
                    } to solve this Rumor.`,

                  requirement: {
                    type: "clues",
                    amount:
                      clueCost,
                  },

                  effects: [
                    {
                      type: "lose-clues",
                      amount:
                        clueCost,
                    },
                    {
                      type:
                        "solve-mythos-rumor",
                      mythosId:
                        "growing-madness",
                    },
                  ],
                },
              ],
            },
          ],

          onFail: [],

          minSuccesses: 1,

          onComplete: [],

          source:
            "mythos:growing-madness-encounter",
        },
      };
    }

    case "heat-wave-singes-the-globe": {
      if (
        mythos.id !==
        "heat-wave-singes-the-globe"
      ) {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Heat Wave Singes the Globe.`,
        );
      }

      const investigatorId =
        game.investigatorOrder[0];

      if (!investigatorId) {
        return {
          ...game,

          currentMythosId:
            null,

          pendingDecision:
            null,

          activeInvestigatorId:
            null,
        };
      }

      const investigator =
        game.investigators[
          investigatorId
        ];

      if (!investigator) {
        throw new Error(
          `Investigator "${investigatorId}" does not exist.`,
        );
      }

      const options = [];

      /*
      * An Investigator who is already Delayed
      * cannot become Delayed again.
      */

      if (!investigator.isDelayed) {
        options.push({
          id:
            "heat-wave-singes-the-globe:delayed:0",

          title:
            "Become Delayed",

          description:
            "Become Delayed and do not lose Health.",
        });
      }

      options.push({
        id:
          "heat-wave-singes-the-globe:health:0",

        title:
          "Do Not Become Delayed",

        description:
          "Lose 3 Health.",
      });

      return {
        ...game,

        activeInvestigatorId:
          investigatorId,

        pendingDecision: {
          type: "choice",

          title:
            "Heat Wave Singes the Globe",

          message:
            "This Investigator may become Delayed to avoid losing 3 Health.",

          options,

          source:
            "mythos:heat-wave-singes-the-globe:0",
        },
      };
    }

        case "return-of-the-ancient-ones": {
      if (
        mythos.id !==
        "return-of-the-ancient-ones"
      ) {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Return of the Ancient Ones.`,
        );
      }

      return {
        ...game,

        currentMythosId:
          null,

        pendingDecision:
          null,

        activeInvestigatorId:
          null,
      };
    }

    case "stars-aligned-encounter": {
      if (
        mythos.id !==
        "stars-aligned"
      ) {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Stars Aligned.`,
        );
      }

      const investigatorId =
        game.activeInvestigatorId;

      if (!investigatorId) {
        throw new Error(
          "There is no active investigator.",
        );
      }

      const investigator =
        game.investigators[
          investigatorId
        ];

      if (!investigator) {
        throw new Error(
          `Investigator "${investigatorId}" does not exist.`,
        );
      }

      /*
      * Stars Aligned can only be researched
      * on Space 7.
      */

      if (
        investigator.spaceId !==
        "space-7"
      ) {
        return game;
      }

      const investigatorCount =
        game.investigatorOrder.length;

      const clueCost =
        Math.ceil(
          investigatorCount / 2,
        );

      return {
        ...game,

        pendingDecision: {
          type: "test",

          title:
            mythos.name,

          message:
            "Attempt to find the strangers based on your observations of the stars.",

          image:
            mythos.image,

          skill:
            "observation",

          modifier:
            0,

          investigatorId,

          onSuccess: [
            {
              type: "choice",

              choices: [
                {
                  text:
                    `Spend ${clueCost} Clue${
                      clueCost === 1
                        ? ""
                        : "s"
                    } to solve this Rumor.`,

                  requirement: {
                    type: "clues",

                    amount:
                      clueCost,
                  },

                  effects: [
                    {
                      type:
                        "lose-clues",

                      amount:
                        clueCost,
                    },
                    {
                      type:
                        "solve-mythos-rumor",

                      mythosId:
                        "stars-aligned",
                    },
                  ],
                },
              ],
            },
          ],

          onFail: [],

          minSuccesses: 1,

          onComplete: [],

          source:
            "mythos:stars-aligned-encounter",
        },
      };
    }

    /*
     * ============================================================
     * THE BERMUDA TRIANGLE
     * ============================================================
     *
     * Each Investigator rolls 1 die.
     *
     * On 1-2:
     *   -> Move to Space 8.
     *   -> Become Delayed.
     */

    case "the-bermuda-triangle": {
      const investigatorIds =
        game.investigatorOrder;

      if (
        investigatorIds.length === 0
      ) {
        return {
          ...game,
          currentMythosId: null,
          pendingDecision: null,
          activeInvestigatorId: null,
        };
      }

      /*
       * The first call starts at Investigator 0.
       *
       * Subsequent calls use:
       *
       *   the-bermuda-triangle:1
       *   the-bermuda-triangle:2
       *   ...
       */

      let investigatorIndex = 0;

      if (
        specialId.includes(":")
      ) {
        const parsedIndex =
          Number(
            specialId.split(":")[1],
          );

        if (
          Number.isInteger(
            parsedIndex,
          )
        ) {
          investigatorIndex =
            parsedIndex;
        }
      }

      const investigatorId =
        investigatorIds[
          investigatorIndex
        ];

      if (!investigatorId) {
        return {
          ...game,
          currentMythosId: null,
          pendingDecision: null,
          activeInvestigatorId: null,
        };
      }

      return {
        ...game,

        activeInvestigatorId:
          investigatorId,

        pendingDecision: {
          type: "single-die-roll",

          title:
            mythos.name,

          message:
            "Roll 1 die. On a 1 or 2, move to Space 8 and become Delayed.",

          image:
            mythos.image,

          investigatorId,

          onOneOrTwo: [],

          onThreeToSix: [],

          onComplete: [],

          source:
            `mythos:the-bermuda-triangle:${investigatorIndex}`,
        },
      };
    }

    /*
     * ============================================================
     * THE WIND-WALKER
     * ============================================================
     *
     * When the Rumor enters play:
     *   -> Spawn the Wind-Walker Epic Monster on Space 4.
     *
     * When there are no Eldritch Tokens:
     *   -> Each Investigator becomes Delayed.
     *   -> Each Investigator loses 6 Health.
     *   -> Solve the Rumor.
     */

    case "the-wind-walker": {
      if (
        mythos.id !== "the-wind-walker"
      ) {
        throw new Error(
          `Invalid Mythos for The Wind-Walker: "${mythos.id}".`,
        );
      }

      const mythosInPlay =
        game.board.mythosInPlay.find(
          (entry) =>
            entry.definitionId ===
            "the-wind-walker",
        );

      if (!mythosInPlay) {
        return game;
      }

      /*
       * ==========================================================
       * ENTERS PLAY
       * ==========================================================
       *
       * The Rumor starts with 4 Eldritch Tokens.
       * Spawn the Wind-Walker on Space 4.
       */

      if (
        mythosInPlay.eldritchTokens > 0
      ) {
        return spawnEpicMonsterAtSpace(
          game,
          map,
          "space-4",
          "wind-walker",
        );
      }

      /*
       * ==========================================================
       * 0 ELDRITCH TOKENS
       * ==========================================================
       *
       * Each Investigator becomes Delayed
       * and loses 6 Health.
       */

      let currentGame =
        game;

      for (
        const investigatorId of
          currentGame.investigatorOrder
      ) {
        const investigator =
          currentGame.investigators[
            investigatorId
          ];

        if (!investigator) {
          continue;
        }

        currentGame = {
          ...currentGame,

          investigators: {
            ...currentGame.investigators,

            [investigatorId]: {
              ...investigator,

              isDelayed: true,

              health: Math.max(
                0,
                investigator.health - 6,
              ),

              isDefeated:
                investigator.health - 6 <=
                  0 ||
                investigator.sanity <= 0,
            },
          },
        };
      }

      return solveMythosRumor(
        currentGame,
        mythos,
      );
    }

    /*
    * ============================================================
    * WEB BETWEEN WORLDS
    * ============================================================
    *
    * When the Rumor enters play:
    *   -> Spawn the Spinner of Webs Epic Monster on Space 9.
    *
    * When there are no Eldritch Tokens:
    *   -> Investigators lose the game.
    */

    case "web-between-worlds": {
      if (
        mythos.id !==
        "web-between-worlds"
      ) {
        throw new Error(
          `Invalid Mythos for Web Between Worlds: "${mythos.id}".`,
        );
      }

      const mythosInPlay =
        game.board.mythosInPlay.find(
          (entry) =>
            entry.definitionId ===
            "web-between-worlds",
        );

      if (!mythosInPlay) {
        return game;
      }

      /*
      * ==========================================================
      * ENTERS PLAY
      * ==========================================================
      *
      * The Rumor starts with 4 Eldritch Tokens.
      * Spawn the Spinner of Webs on Space 9.
      */

      if (
        mythosInPlay.eldritchTokens > 0
      ) {
        return spawnEpicMonsterAtSpace(
          game,
          map,
          "space-9",
          "spinner-of-webs",
        );
      }

      /*
      * ==========================================================
      * 0 ELDRITCH TOKENS
      * ==========================================================
      *
      * The investigators lose the game.
      */

      return {
        ...game,

        status:
          "defeat",

        pendingDecision:
          null,

        activeInvestigatorId:
          null,
      };
    }

    /*
     * ============================================================
     * THE WORLD SHAKES
     * ============================================================
     *
     * Each Investigator on the Active Expedition space or an
     * adjacent space:
     *
     *   -> Loses 2 Health.
     *   -> Becomes Delayed.
     *
     * Then remove every Expedition Encounter belonging to the
     * Active Expedition from the Expedition Encounter deck and
     * shuffle the remaining deck.
     */

    case "the-world-shakes": {
      const activeExpeditionSpaceId =
        game.board.activeExpeditionSpaceId;

      if (!activeExpeditionSpaceId) {
        return game;
      }

      const activeExpeditionSpace =
        map.spaces.find(
          (space) =>
            space.id ===
            activeExpeditionSpaceId,
        );

      if (!activeExpeditionSpace) {
        throw new Error(
          `Active Expedition space "${activeExpeditionSpaceId}" does not exist.`,
        );
      }

      /*
       * ==========================================================
       * AFFECTED SPACES
       * ==========================================================
       *
       * The Active Expedition space itself plus every space
       * directly connected to it.
       */

      const affectedSpaceIds = new Set<string>([
        activeExpeditionSpace.id,
        ...activeExpeditionSpace.connectedSpaceIds,
      ]);

      /*
       * ==========================================================
       * AFFECT INVESTIGATORS
       * ==========================================================
       */

      const updatedInvestigators = {
        ...game.investigators,
      };

      for (
        const investigatorId of
          game.investigatorOrder
      ) {
        const investigator =
          game.investigators[
            investigatorId
          ];

        if (!investigator) {
          continue;
        }

        if (
          !investigator.spaceId ||
          !affectedSpaceIds.has(
            investigator.spaceId,
          )
        ) {
          continue;
        }

        const newHealth =
          Math.max(
            0,
            investigator.health - 2,
          );

        updatedInvestigators[
          investigatorId
        ] = {
          ...investigator,

          health:
            newHealth,

          isDelayed:
            true,

          isDefeated:
            newHealth <= 0 ||
            investigator.sanity <= 0,
        };
      }

      /*
       * ==========================================================
       * REMOVE ACTIVE EXPEDITION ENCOUNTERS
       * ==========================================================
       *
       * Expedition Encounter cards are identified by the name
       * of the Expedition space.
       *
       * They are returned to the game box, so they are removed
       * from the deck and are NOT added to the discard pile.
       */

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
       * ==========================================================
       * SHUFFLE
       * ==========================================================
       */

      const shuffledExpeditionDeck =
        [...remainingExpeditionDeck];

      for (
        let i =
          shuffledExpeditionDeck.length - 1;
        i > 0;
        i--
      ) {
        const j =
          Math.floor(
            Math.random() * (i + 1),
          );

        const current =
          shuffledExpeditionDeck[i];

        shuffledExpeditionDeck[i] =
          shuffledExpeditionDeck[j];

        shuffledExpeditionDeck[j] =
          current;
      }

      return {
        ...game,

        investigators:
          updatedInvestigators,

        board: {
          ...game.board,

          encounterDecks: {
            ...game.board.encounterDecks,

            expedition:
              shuffledExpeditionDeck,
          },
        },
      };
    }

    case "treacherous-magic": {
      if (
        mythos.id !== "treacherous-magic"
      ) {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Treacherous Magic.`,
        );
      }

      return startTreacherousMagic(
        game,
        0,
      );
    }

    case "tide-of-despair": {
      if (
        mythos.id !== "tide-of-despair"
      ) {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve Tide of Despair.`,
        );
      }

      const investigatorIds =
        game.investigatorOrder;

      if (
        investigatorIds.length === 0
      ) {
        return {
          ...game,

          currentMythosId:
            null,

          pendingDecision:
            null,

          activeInvestigatorId:
            null,
        };
      }

      /*
      * The first Investigator is index 0.
      *
      * Subsequent Investigators use:
      *
      * tide-of-despair:1
      * tide-of-despair:2
      * ...
      */

      let investigatorIndex = 0;

      if (
        specialId.includes(":")
      ) {
        const parsedIndex =
          Number(
            specialId.split(":")[1],
          );

        if (
          Number.isInteger(
            parsedIndex,
          )
        ) {
          investigatorIndex =
            parsedIndex;
        }
      }

      const investigatorId =
        investigatorIds[
          investigatorIndex
        ];

      if (!investigatorId) {
        return {
          ...game,

          currentMythosId:
            null,

          pendingDecision:
            null,

          activeInvestigatorId:
            null,
        };
      }

      const investigator =
        game.investigators[
          investigatorId
        ];

      if (!investigator) {
        throw new Error(
          `Investigator "${investigatorId}" does not exist.`,
        );
      }

      /*
      * Find a Blessed Condition.
      */

      const blessedConditionId =
        investigator.conditionIds.find(
          (conditionId) =>
            game.conditions[
              conditionId
            ]?.definitionId ===
            "condition-blessed",
        );

      /*
      * No Blessed:
      *
      * Lose 2 Health and 2 Sanity immediately.
      */

      if (!blessedConditionId) {
        const newHealth =
          Math.max(
            0,
            investigator.health - 2,
          );

        const newSanity =
          Math.max(
            0,
            investigator.sanity - 2,
          );

        const updatedGame: GameState = {
          ...game,

          investigators: {
            ...game.investigators,

            [investigatorId]: {
              ...investigator,

              health:
                newHealth,

              sanity:
                newSanity,

              isDefeated:
                newHealth <= 0 ||
                newSanity <= 0,
            },
          },
        };

        const nextIndex =
          investigatorIndex + 1;

        const nextInvestigatorId =
          updatedGame.investigatorOrder[
            nextIndex
          ];

        /*
        * Last Investigator.
        */

        if (!nextInvestigatorId) {
          return {
            ...updatedGame,

            currentMythosId:
              null,

            pendingDecision:
              null,

            activeInvestigatorId:
              null,
          };
        }

        return resolveMythosSpecial(
          updatedGame,
          mythos,
          `tide-of-despair:${nextIndex}`,
          map,
        );
      }

      /*
      * Investigator has Blessed:
      * give him the choice.
      */

      return {
        ...game,

        activeInvestigatorId:
          investigatorId,

        pendingDecision: {
          type: "choice",

          title:
            "Tide of Despair",

          message:
            "Discard your Blessed Condition to avoid losing 2 Health and 2 Sanity.",

          options: [
            {
              id:
                `tide-of-despair:discard-blessed:${investigatorIndex}`,

              title:
                "Discard Blessed",

              description:
                "Discard the Blessed Condition and avoid losing Health and Sanity.",
            },

            {
              id:
                `tide-of-despair:keep-blessed:${investigatorIndex}`,

              title:
                "Keep Blessed",

              description:
                "Keep the Blessed Condition and lose 2 Health and 2 Sanity.",
            },
          ],

          source:
            `mythos:tide-of-despair:${investigatorIndex}`,
        },
      };
    }

    case "the-storm": {
      if (mythos.id !== "the-storm") {
        throw new Error(
          `Mythos "${mythos.id}" cannot resolve The Storm.`,
        );
      }

      /*
      * ============================================================
      * THE STORM
      * ============================================================
      *
      * Each Investigator discards Clues equal to the
      * number of Rumor Mythos cards currently in play.
      */

      const rumorCount =
        game.board.mythosInPlay.filter(
          (entry) => {
            const definition =
              [
                ...easyMythos,
                ...normalMythos,
                ...hardMythos,
              ].find(
                (item) =>
                  item.id ===
                  entry.definitionId,
              );

            return (
              definition?.type === "rumor"
            );
          },
        ).length;

      /*
      * ============================================================
      * RUMORS ALREADY IN PLAY
      * ============================================================
      */

      if (rumorCount > 0) {
        let currentGame = game;

        for (
          const investigatorId of
            currentGame.investigatorOrder
        ) {
          const investigator =
            currentGame.investigators[
              investigatorId
            ];

          if (!investigator) {
            continue;
          }

          currentGame = {
            ...currentGame,

            investigators: {
              ...currentGame.investigators,

              [investigatorId]: {
                ...investigator,

                clues: Math.max(
                  0,
                  investigator.clues -
                    rumorCount,
                ),
              },
            },
          };
        }

        return {
          ...currentGame,

          currentMythosId: null,

          pendingDecision: null,

          activeInvestigatorId: null,
        };
      }

      /*
      * ============================================================
      * NO RUMORS IN PLAY
      * ============================================================
      *
      * Find Rumor Mythos cards that are still in the game box.
      */

      const allMythos = [
        ...easyMythos,
        ...normalMythos,
        ...hardMythos,
      ];

      const mythosInPlayIds =
        new Set(
          game.board.mythosInPlay.map(
            (entry) =>
              entry.definitionId,
          ),
        );

      const mythosDeckIds =
        new Set(
          game.board.mythosDeck.map(
            (definition) =>
              definition.id,
          ),
        );

      const mythosDiscardIds =
        new Set(
          game.board.mythosDiscard.map(
            (definition) =>
              definition.id,
          ),
        );

      const rumorsInGameBox =
        allMythos.filter(
          (definition) =>
            definition.type === "rumor" &&
            !mythosInPlayIds.has(
              definition.id,
            ) &&
            !mythosDeckIds.has(
              definition.id,
            ) &&
            !mythosDiscardIds.has(
              definition.id,
            ),
        );

      /*
      * No Rumors available in the game box.
      */

      if (rumorsInGameBox.length === 0) {
        return {
          ...game,

          currentMythosId: null,

          pendingDecision: null,

          activeInvestigatorId: null,
        };
      }

      /*
      * Draw 1 random Rumor from the game box.
      */

      const randomIndex =
        Math.floor(
          Math.random() *
            rumorsInGameBox.length,
        );

      const rumor =
        rumorsInGameBox[randomIndex];

      if (!rumor) {
        return {
          ...game,

          currentMythosId: null,

          pendingDecision: null,

          activeInvestigatorId: null,
        };
      }

      /*
      * The Storm is an Event, so it is discarded.
      * The selected Rumor becomes the current Mythos.
      */

      return {
        ...game,

        board: {
          ...game.board,

          mythosDiscard: [
            ...game.board.mythosDiscard,
            mythos,
          ],
        },

        currentMythosId:
          rumor.id,

        pendingDecision: {
          type: "continue",

          title: "MYTHOS",

          message:
            "Resolve the Rumor Mythos card drawn from the game box.",

          source: "mythos-card:0",
        },

        activeInvestigatorId: null,
      };
    }

    case "tied-to-a-dark-purpose": {
      /*
      * ============================================================
      * TIED TO A DARK PURPOSE
      * ============================================================
      *
      * Resolve the Reckoning effect on all Conditions.
      *
      * Every die rolled by those Reckoning effects is treated
      * as a 1.
      */

      return startConditionReckoning(
        game,
        map,
        0,
        true,
      );
    }

    case "torn-asunder": {
      /*
      * ============================================================
      * TORN ASUNDER
      * ============================================================
      *
      * Each Investigator loses Health equal to the
      * number of Gates on the board corresponding
      * to the current Omen.
      *
      * If there are no matching Gates, advance the
      * Omen by 1.
      */

      /*
      * ------------------------------------------------------------
      * DETERMINE CURRENT OMEN
      * ------------------------------------------------------------
      *
      * Omen track:
      *
      * 0 -> Green
      * 1 -> Blue
      * 2 -> Red
      * 3 -> Blue
      */

      const omenByPosition: Record<
        number,
        "green" | "blue" | "red"
      > = {
        0: "green",
        1: "blue",
        2: "red",
        3: "blue",
      };

      const currentOmen =
        omenByPosition[
          (
            (
              game.ancientOne.omenPosition %
              4
            ) + 4
          ) % 4
        ];

      if (!currentOmen) {
        throw new Error(
          "Could not determine the current Omen.",
        );
      }

      /*
      * ------------------------------------------------------------
      * COUNT MATCHING GATES
      * ------------------------------------------------------------
      */

      const matchingGateCount =
        Object.values(
          game.board.spaces,
        ).reduce(
          (total, space) =>
            total +
            space.gates.filter(
              (gate) =>
                gate.omen === currentOmen,
            ).length,
          0,
        );

      /*
      * ------------------------------------------------------------
      * NO MATCHING GATES
      * ------------------------------------------------------------
      *
      * Advance Omen by 1.
      */

      if (matchingGateCount === 0) {
        return {
          ...game,

          ancientOne: {
            ...game.ancientOne,

            omenPosition:
              (
                game.ancientOne.omenPosition +
                1
              ) % 4,
          },

          currentMythosId: null,

          pendingDecision: null,

          activeInvestigatorId: null,
        };
      }

      /*
      * ------------------------------------------------------------
      * MATCHING GATES
      * ------------------------------------------------------------
      *
      * Each Investigator loses Health equal
      * to the number of matching Gates.
      *
      * Use resolveEncounterEffects so that the
      * normal Health-loss / defeat handling is preserved.
      */

      let currentGame = game;

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
                  matchingGateCount,
              },
            ],
            map,
          );
      }

      return {
        ...currentGame,

        currentMythosId: null,

        pendingDecision: null,

        activeInvestigatorId: null,
      };
    }

    case "web-between-worlds": {
      /*
      * ============================================================
      * WEB BETWEEN WORLDS
      * ============================================================
      *
      * When the Rumor enters play, spawn the Spinner of Webs
      * Epic Monster on Space 9.
      */

      if (
        mythos.id !==
        "web-between-worlds"
      ) {
        throw new Error(
          `Invalid Mythos for Web Between Worlds: "${mythos.id}".`,
        );
      }

      return spawnEpicMonsterAtSpace(
        game,
        map,
        "space-9",
        "spinner-of-webs",
      );
    }

    /*
    * No supported special effect.
    */

    default:
      throw new Error(
        `Unsupported Mythos special effect "${specialId}".`,
      );
  }
}