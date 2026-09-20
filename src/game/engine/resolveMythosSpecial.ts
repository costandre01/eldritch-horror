import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import type { MythosDefinition } from "../models/Mythos";
import { advanceDoom } from "./doomEngine";
import { getLeadInvestigatorId } from "./getLeadInvestigatorId";
import { resolveAncientOneAwakening } from "./resolveAncientOneAwakening";

import { resolveEncounterEffects } from "./resolveEncounterEffects";
import { solveMythosRumor } from "./solveMythosRumor";
import { spawnEpicMonsterAtSpace } from "./spawnEpicMonsterAtSpace";
import { startOtherWorldEncounter } from "./startOtherWorldEncounter";

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

export function resolveMythosSpecial(
  game: GameState,
  mythos: MythosDefinition,
  specialId: string,
  map: MapDefinition,
): GameState {
  switch (specialId) {
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

    default:
      throw new Error(
        `Unsupported Mythos special effect "${specialId}".`,
      );
  }
}