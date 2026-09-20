import { CORE_EPIC_MONSTERS } from "../../content/core/coreEpicMonsters";
import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { easyMythos } from "../../content/core/mythos/easyMythos";
import { hardMythos } from "../../content/core/mythos/hardMythos";
import { normalMythos } from "../../content/core/mythos/normalMythos";
import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { resolveEncounterEffects } from "./resolveEncounterEffects";
import { resolveMonsterToughness } from "./resolveMonsterToughness";

export function resolveEncounterMonsterSelection(
  game: GameState,
  monsterId: string,
  map: MapDefinition,
): GameState {
  const decision =
    game.pendingDecision;

  if (
    !decision ||
    decision.type !== "select-monster"
  ) {
    throw new Error(
      "There is no pending Monster selection.",
    );
  }

  if (
    !decision.monsterIds.includes(
      monsterId,
    )
  ) {
    throw new Error(
      `Monster "${monsterId}" cannot be selected.`,
    );
  }

  const monster =
    game.monsters[monsterId];

  if (!monster) {
    throw new Error(
      `Monster "${monsterId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * CLEAR PENDING DECISION
   * ============================================================
   */

  let currentGame: GameState = {
    ...game,

    pendingDecision: null,
  };

  /*
   * ============================================================
   * GET SELECTED MONSTER EFFECTS
   * ============================================================
   */

  const effects =
    decision.onMonsterSelected;

  /*
   * ============================================================
   * DISCARD SELECTED MONSTER
   * ============================================================
   *
   * This is used by effects such as:
   *
   * - discard-selected-monster
   *
   * The Monster is removed from the board and placed
   * in the Monster discard.
   */

  const shouldDiscard =
    effects.some(
      (effect) =>
        effect.type ===
        "discard-selected-monster",
    );

  if (shouldDiscard) {
    /*
     * ==========================================================
     * BLOOD FLOWS — GET TOUGHNESS
     * ==========================================================
     *
     * Blood Flows makes the Lead Investigator lose Health
     * equal to the Toughness of the selected Monster.
     *
     * Toughness must be calculated before the Monster
     * is removed from the game.
     */

    let bloodFlowsToughness:
      | number
      | null = null;

    if (
      decision.source ===
      "mythos:blood-flows"
    ) {
      const definition =
        CORE_MONSTERS.find(
          (monsterDefinition) =>
            monsterDefinition.id ===
            monster.definitionId,
        ) ??
        CORE_EPIC_MONSTERS.find(
          (monsterDefinition) =>
            monsterDefinition.id ===
            monster.definitionId,
        );

      if (!definition) {
        throw new Error(
          `Monster definition "${monster.definitionId}" does not exist.`,
        );
      }

      bloodFlowsToughness =
        resolveMonsterToughness(
          game,
          definition,
        );
    }

    /*
     * ==========================================================
     * REMOVE MONSTER FROM ITS CURRENT SPACE
     * ==========================================================
     */

    if (monster.spaceId) {
      const space =
        currentGame.board.spaces[
          monster.spaceId
        ];

      if (space) {
        currentGame = {
          ...currentGame,

          board: {
            ...currentGame.board,

            spaces: {
              ...currentGame.board.spaces,

              [monster.spaceId]: {
                ...space,

                monsterIds:
                  space.monsterIds.filter(
                    (id) =>
                      id !== monsterId,
                  ),
              },
            },
          },
        };
      }
    }

    /*
     * ==========================================================
     * REMOVE MONSTER FROM ACTIVE REGISTRY
     * ==========================================================
     */

    const {
      [monsterId]:
        discardedMonster,
      ...remainingMonsters
    } = currentGame.monsters;

    /*
     * ==========================================================
     * ADD MONSTER TO DISCARD
     * ==========================================================
     */

    currentGame = {
      ...currentGame,

      monsters:
        remainingMonsters,

      board: {
        ...currentGame.board,

        monsterDiscard: [
          ...currentGame.board
            .monsterDiscard,

          discardedMonster,
        ],
      },
    };

    /*
     * ==========================================================
     * BLOOD FLOWS — LEAD LOSES HEALTH
     * ==========================================================
     */

    if (
      bloodFlowsToughness !== null
    ) {
      const investigatorId =
        decision.investigatorId ??
        game.activeInvestigatorId;

      if (!investigatorId) {
        throw new Error(
          "Blood Flows has no Lead Investigator.",
        );
      }

      currentGame =
        resolveEncounterEffects(
          currentGame,
          investigatorId,
          [
            {
              type: "lose-health",

              amount:
                bloodFlowsToughness,
            },
          ],
          map,
        );
    }

    /*
     * ==========================================================
     * RESOLVE ANY EFFECTS WAITING AFTER MONSTER SELECTION
     * ==========================================================
     */

    if (
      decision.onComplete &&
      decision.onComplete.length > 0
    ) {
      const investigatorId =
        decision.investigatorId ??
        game.activeInvestigatorId;

      if (!investigatorId) {
        return currentGame;
      }

      currentGame =
        resolveEncounterEffects(
          currentGame,
          investigatorId,
          decision.onComplete,
          map,
        );
    }

    /*
     * ============================================================
     * THE WORLD FIGHTS BACK — CONTINUE
     * ============================================================
     */

    if (
      decision.source?.startsWith(
        "mythos:world-fights-back-monster:",
      )
    ) {
      const investigatorIndex =
        Number(
          decision.source.split(":")[3] ?? "0",
        );

      if (
        !Number.isInteger(
          investigatorIndex,
        ) ||
        investigatorIndex < 0
      ) {
        return currentGame;
      }

      const nextIndex =
        investigatorIndex + 1;

      const nextInvestigatorId =
        currentGame.investigatorOrder[
          nextIndex
        ];

      /*
       * All Investigators have resolved the effect.
       * Discard the Event Mythos.
       */

      if (!nextInvestigatorId) {
        const mythosId =
          currentGame.currentMythosId;

        if (!mythosId) {
          return {
            ...currentGame,
            pendingDecision: null,
          };
        }

        const mythos =
          [
            ...easyMythos,
            ...normalMythos,
            ...hardMythos,
          ].find(
            (definition) =>
              definition.id ===
              mythosId,
          );

        if (!mythos) {
          return {
            ...currentGame,
            pendingDecision: null,
          };
        }

        return {
          ...currentGame,

          board: {
            ...currentGame.board,

            mythosDiscard: [
              ...currentGame.board
                .mythosDiscard,
              mythos,
            ],
          },

          currentMythosId: null,
          pendingDecision: null,
        };
      }

      const nextInvestigator =
        currentGame.investigators[
          nextInvestigatorId
        ];

      if (!nextInvestigator) {
        return currentGame;
      }

      let hasMonster = false;

      if (
        nextInvestigator.spaceId
      ) {
        const nextSpace =
          currentGame.board.spaces[
            nextInvestigator.spaceId
          ];

        if (nextSpace) {
          hasMonster =
            nextSpace.monsterIds.some(
              (id) =>
                currentGame.monsters[id] !==
                undefined,
            );
        }
      }

      return {
        ...currentGame,

        pendingDecision: {
          type: "choice",

          title:
            "The World Fights Back",

          message:
            "This Investigator may recover 2 Health, recover 2 Sanity, or discard 1 Monster from his space.",

          options: [
            {
              id:
                `world-fights-back:health:${nextIndex}`,

              title:
                "Recover 2 Health",

              description:
                "Recover 2 Health.",
            },

            {
              id:
                `world-fights-back:sanity:${nextIndex}`,

              title:
                "Recover 2 Sanity",

              description:
                "Recover 2 Sanity.",
            },

            ...(hasMonster
              ? [
                  {
                    id:
                      `world-fights-back:monster:${nextIndex}`,

                    title:
                      "Discard 1 Monster",

                    description:
                      "Choose 1 Monster on this Investigator's space to discard.",
                  },
                ]
              : []),

            {
              id:
                `world-fights-back:pass:${nextIndex}`,

              title:
                "Do Nothing",

              description:
                "Do not use the effect.",
            },
          ],

          source:
            `mythos:world-fights-back:${nextIndex}`,
        },
      };
    }

    return currentGame;
  }

  /*
   * ============================================================
   * NORMAL MONSTER SELECTION
   * ============================================================
   *
   * Pass the selected Monster ID to the effects
   * waiting for the selection.
   *
   * Examples:
   *
   * - lose-selected-monster-health
   * - select-monster-destination
   * - move-selected-monster
   */

  if (
    effects.length > 0
  ) {
    const resolvedEffects =
      effects.map((effect) => ({
        ...effect,

        monsterIds:
          effect.monsterIds ??
          [monsterId],
      }));

    const investigatorId =
      decision.investigatorId ??
      game.activeInvestigatorId;

    if (!investigatorId) {
      return currentGame;
    }

    currentGame =
      resolveEncounterEffects(
        currentGame,
        investigatorId,
        resolvedEffects,
        map,
      );
  }

  /*
   * ============================================================
   * ANOTHER PLAYER DECISION
   * ============================================================
   *
   * The selected Monster may lead to another
   * selection, such as choosing its destination.
   *
   * Do not continue while a new decision is pending.
   */

  if (
    currentGame.pendingDecision
  ) {
    return currentGame;
  }

  /*
   * ============================================================
   * CONTINUE AFTER MONSTER SELECTION
   * ============================================================
   */

  if (
    decision.onComplete &&
    decision.onComplete.length > 0
  ) {
    const investigatorId =
      decision.investigatorId ??
      game.activeInvestigatorId;

    if (!investigatorId) {
      return currentGame;
    }

    currentGame =
      resolveEncounterEffects(
        currentGame,
        investigatorId,
        decision.onComplete,
        map,
      );
  }

  return currentGame;
}