import type { GameState } from "../models/GameState";

import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../content/core/coreEpicMonsters";
import { resolveMonsterToughness } from "./resolveMonsterToughness";
import { getMonsterCombatStartAbility } from "./monsterAbilities";
import type { MonsterReckoningResume } from "../models/PendingDecision";

export function startMonsterCombat(
  game: GameState,
  monsterId: string,
  resume?: MonsterReckoningResume,
): GameState {
  const monster =
    game.monsters[monsterId];

  if (!monster) {
    throw new Error(
      `Monster "${monsterId}" does not exist.`,
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

  const isMonsterReckoningCombat =
    resume?.type ===
      "shub-niggurath-reckoning" ||
    resume?.type ===
      "monster-reckoning";

  if (
    game.phase !== "encounter" &&
    !isMonsterReckoningCombat
  ) {
    throw new Error(
      "Combat can only start during the Encounter phase.",
    );
  }

  if (!investigator.spaceId) {
    throw new Error(
      "Investigator has no current space.",
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

  /*
   * ============================================================
   * RESOLVE MONSTER DEFINITION
   * ============================================================
   */

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

  /*
   * ============================================================
   * RESOLVE CURRENT TOUGHNESS
   * ============================================================
   *
   * This is mainly important for monsters whose toughness
   * depends on the current game state.
   */

  const toughness =
    resolveMonsterToughness(
      game,
      definition,
    );

  /*
   * ============================================================
   * RESOLVE CURRENT HEALTH
   * ============================================================
   *
   * Monsters placed on the map may initially have health = 0
   * because they have not entered combat yet.
   *
   * In that case, initialise their Health to their Toughness.
   *
   * If the monster has already taken damage, keep its current
   * Health and only clamp it to the valid range.
   */

  const health =
    monster.health > 0
      ? Math.min(
          monster.health,
          toughness,
        )
      : toughness;

  /*
   * ============================================================
   * CHECK COMBAT START ABILITY
   * ============================================================
   *
   * Some monsters have a special ability that must be
   * resolved before the normal Combat flow begins.
   *
   * Examples:
   *
   * - Riot
   * - Wind-Walker
   */

  const combatStartAbility =
    getMonsterCombatStartAbility(
      definition,
    );

  /*
   * ============================================================
   * START COMBAT WITH SPECIAL ABILITY
   * ============================================================
   *
   * If the monster has a Combat-start ability, pause the
   * Combat flow and show the Special Ability popup first.
   */

  if (combatStartAbility) {
    return {
      ...game,

      monsters: {
        ...game.monsters,

        [monsterId]: {
          ...monster,

          health,

          engagedInvestigatorId:
            investigatorId,
        },
      },

      pendingDecision: {
        type: "monster-ability",

        title:
          "SPECIAL ABILITY",

        image:
          definition.backImage,

        monsterId,

        ability:
          combatStartAbility,

        source:
          `monster-ability:${monsterId}`,

        resume,
      },
    };
  }

  /*
   * ============================================================
   * NORMAL COMBAT START
   * ============================================================
   *
   * No Combat-start special ability exists.
   *
   * Continue with the normal Combat popup.
   */

  return {
    ...game,

    monsters: {
      ...game.monsters,

      [monsterId]: {
        ...monster,

        health,

        engagedInvestigatorId:
          investigatorId,
      },
    },

    pendingDecision: {
      type: "combat",

      title:
        `Combat: ${definition.name}`,

      message:
        `You are engaged with ${definition.name}.`,

      image:
        definition.frontImage,

      monsterId,

      stage:
        "start",

      source:
        `combat:${monsterId}`,

      resume,
    },
  };
}