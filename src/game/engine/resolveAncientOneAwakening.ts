import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { CORE_ANCIENT_ONES } from "../../content/core/coreAncientOnes";
import { spawnEpicMonsterAtSpace } from "./spawnEpicMonsterAtSpace";
import { showMythosContinue } from "./showMythosContinue";
import type { EncounterAwakeningResume } from "../models/PendingDecision";

export function resolveAncientOneAwakening(
  game: GameState,
  map: MapDefinition,
  nextIconIndex: number,
  resume?:
    | {
        type: "mythos";
        nextIconIndex: number;
        mythosIds: string[];
        resolvedMythosIds: string[];
      }
    | {
        type: "ancient-one-reckoning";
        abilityIndex: number;
        ancientOneId: string;
        ancientOneReckoningStage:
          | "front"
          | "awakened";
      }
    | {
        type: "yog-sothoth-reckoning";
        investigatorIds: string[];
        nextInvestigatorIndex: number;
        ancientOneAbilityIndex: number;
        ancientOneId: string;
        ancientOneReckoningStage:
          | "front"
          | "awakened";
      }
    | {
        type: "monster-reckoning";
        monsterId: string;
        monsterIds: string[];
        resolvedMonsterIds: string[];
        nextIconIndex: number;
      }
    | EncounterAwakeningResume,
): GameState {
  const ancientOneId =
    game.ancientOne.id;

  /*
   * ============================================================
   * RESUME DECISION
   * ============================================================
   */

  const resumeDecision =
    resume?.type ===
      "mythos"
      ? {
          type:
            "mythos-card-reckoning" as const,

          title:
            "MYTHOS RECKONING",

          message:
            "Continue resolving the Mythos Reckoning.",

          mythosIds:
            resume.mythosIds,

          resolvedMythosIds:
            resume.resolvedMythosIds,

          source:
            "mythos:card-reckoning" as const,

          nextIconIndex:
            resume.nextIconIndex,
        }
      : resume?.type ===
          "ancient-one-reckoning"
        ? {
            type:
              "mythos-ancient-one-reckoning" as const,

            title:
              "ANCIENT ONE RECKONING",

            message:
              "Continue resolving the Ancient One Reckoning.",

            abilityIndex:
              resume.abilityIndex + 1,

            nextIconIndex:
              nextIconIndex,

            ancientOneId:
              resume.ancientOneId,

            reckoningStage:
              resume.ancientOneReckoningStage,

            source:
              "mythos:ancient-one-reckoning" as const,
          }
        : resume?.type ===
            "yog-sothoth-reckoning"
          ? {
              type:
                "mythos-yog-sothoth-reckoning-resume" as const,

              title:
                "YOG-SOTHOTH — RECKONING",

              message:
                "Continue resolving Yog-Sothoth's Reckoning.",

              investigatorIds:
                resume.investigatorIds,

              nextInvestigatorIndex:
                resume.nextInvestigatorIndex,

              nextIconIndex:
                nextIconIndex,

              ancientOneAbilityIndex:
                resume.ancientOneAbilityIndex,

              ancientOneId:
                resume.ancientOneId,

              ancientOneReckoningStage:
                resume.ancientOneReckoningStage,

              source:
                "mythos:yog-sothoth-reckoning-resume" as const,
            }
          : resume?.type ===
              "monster-reckoning"
            ? {
                type:
                  "mythos-monster-reckoning-resume" as const,

                title:
                  "MONSTER RECKONING",

                message:
                  "Continue resolving the Monster Reckoning.",

                monsterId:
                  resume.monsterId,

                monsterIds:
                  resume.monsterIds,

                resolvedMonsterIds:
                  resume.resolvedMonsterIds,

                nextIconIndex:
                  nextIconIndex,

                source:
                  "mythos:monster-reckoning-resume" as const,
              }
            : resume?.type ===
                "encounter"
              ? {
                  type:
                    "encounter-awakening-resume" as const,

                  title:
                    "ENCOUNTER",

                  message:
                    "Continue resolving the Encounter.",

                  investigatorId:
                    resume.investigatorId,

                  effects:
                    resume.effects,

                  source:
                    "encounter:awakening-resume" as const,
                }
              : null;

  /*
   * ============================================================
   * ANCIENT ONE DEFINITION
   * ============================================================
   */

  const definition =
    CORE_ANCIENT_ONES.find(
      (ancientOne) =>
        ancientOne.id ===
        ancientOneId,
    );

  if (!definition) {
    throw new Error(
      `Ancient One definition not found: ${ancientOneId}`,
    );
  }

  /*
   * The Ancient One must already be awakened
   * before resolving its Awakening effect.
   */

  if (!game.ancientOne.awakened) {
    return game;
  }

  const awakening =
    definition.awakening;

  /*
   * ============================================================
   * NO IMMEDIATE EFFECT
   * ============================================================
   */

  if (
    awakening.type === "none"
  ) {
    if (resumeDecision) {
      return {
        ...game,
        pendingDecision:
          resumeDecision,
      };
    }

    return showMythosContinue(
      {
        ...game,
        pendingDecision: null,
      },
      nextIconIndex,
    );
  }

  /*
   * ============================================================
   * AZATHOTH
   * ============================================================
   *
   * The investigators immediately lose the game.
   */

  if (
    awakening.type ===
    "lose-game"
  ) {
    return {
      ...game,

      status: "defeat",

      pendingDecision: null,
    };
  }

  /*
   * ============================================================
   * SPAWN EPIC MONSTER
   * ============================================================
   */

  if (
    awakening.type ===
    "spawn-epic-monster"
  ) {
    const spawnedGame =
      spawnEpicMonsterAtSpace(
        {
          ...game,
          pendingDecision: null,
        },

        map,

        awakening.spaceId,

        awakening.epicMonsterDefinitionId,
      );

    if (resumeDecision) {
      return {
        ...spawnedGame,
        pendingDecision:
          resumeDecision,
      };
    }

    return showMythosContinue(
      spawnedGame,
      nextIconIndex,
    );
  }

  /*
   * ============================================================
   * SPAWN EPIC MONSTER AND MOVE MONSTERS
   * ============================================================
   */

  if (
    awakening.type ===
    "spawn-epic-monster-and-move-monsters"
  ) {
    let currentGame =
      spawnEpicMonsterAtSpace(
        {
          ...game,
          pendingDecision: null,
        },

        map,

        awakening.spaceId,

        awakening.epicMonsterDefinitionId,
      );

    /*
     * Find all matching Monsters that are currently
     * on the board.
     *
     * Monsters in the cup or discard are not moved.
     */

    const monstersToMove =
      Object.values(
        currentGame.monsters,
      ).filter(
        (monster) =>
          awakening.monsterDefinitionIds.includes(
            monster.definitionId,
          ) &&
          monster.spaceId !== null &&
          monster.health > 0,
      );

    for (
      const monster of monstersToMove
    ) {
      const previousSpaceId =
        monster.spaceId;

      if (!previousSpaceId) {
        continue;
      }

      const previousSpace =
        currentGame.board.spaces[
          previousSpaceId
        ];

      const targetSpace =
        currentGame.board.spaces[
          awakening.spaceId
        ];

      if (
        !previousSpace ||
        !targetSpace
      ) {
        continue;
      }

      /*
       * If the Monster is already in the target
       * space, there is nothing to move.
       */

      if (
        previousSpaceId ===
        awakening.spaceId
      ) {
        continue;
      }

      currentGame = {
        ...currentGame,

        monsters: {
          ...currentGame.monsters,

          [monster.id]: {
            ...currentGame.monsters[
              monster.id
            ],

            spaceId:
              awakening.spaceId,

            engagedInvestigatorId:
              null,
          },
        },

        board: {
          ...currentGame.board,

          spaces: {
            ...currentGame.board.spaces,

            [previousSpaceId]: {
              ...previousSpace,

              monsterIds:
                previousSpace.monsterIds.filter(
                  (monsterId) =>
                    monsterId !==
                    monster.id,
                ),
            },

            [awakening.spaceId]: {
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

    if (resumeDecision) {
      return {
        ...currentGame,
        pendingDecision:
          resumeDecision,
      };
    }

    return showMythosContinue(
      currentGame,
      nextIconIndex,
    );
  }

  return game;
}