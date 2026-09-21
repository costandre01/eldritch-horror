import type { GameState } from "../models/GameState";

import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { resolveMonsterToughness } from "./resolveMonsterToughness";
import type { EncounterEffect } from "../models/Encounter";
import { resolveMonsterSpawnAbilities } from "./resolveMonsterSpawnAbilities";
import type { DarkPowerResume, EyesEverywhereResume, MonsterReckoningResume } from "../models/PendingDecision";

export function startCombat(
  game: GameState,
  investigatorId: string,
  monsterDefinitionId: string,
  onDefeat: EncounterEffect[] = [],
  onNotDefeated: EncounterEffect[] = [],
  resume?:
    | MonsterReckoningResume
    | DarkPowerResume
    | EyesEverywhereResume,
): GameState {
  const investigator =
    game.investigators[investigatorId];

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

  const definition =
    CORE_MONSTERS.find(
      (monster) =>
        monster.id === monsterDefinitionId,
    );

  if (!definition) {
    throw new Error(
      `Monster definition "${monsterDefinitionId}" does not exist.`,
    );
  }

  /*
   * Find one physical copy of this Monster
   * currently available in the Monster Cup.
   */
  const monsterIndex =
    game.board.monsterCup.findIndex(
      (monster) =>
        monster.definitionId ===
        monsterDefinitionId,
    );

  if (monsterIndex === -1) {
    throw new Error(
      `There is no "${definition.name}" available in the Monster Cup.`,
    );
  }

  const monster =
    game.board.monsterCup[monsterIndex];

  if (!monster) {
    throw new Error(
      "Failed to retrieve Monster from the Monster Cup.",
    );
  }

  /*
   * Resolve the Monster's starting Health.
   */
  const toughness =
    resolveMonsterToughness(
      game,
      definition,
    );

  const engagedMonster = {
    ...monster,

    health: toughness,

    spaceId:
      investigator.spaceId,

    engagedInvestigatorId:
      investigatorId,
  };

  /*
   * Remove the physical Monster from the Cup.
   */
  const monsterCup =
    game.board.monsterCup.filter(
      (_, index) =>
        index !== monsterIndex,
    );

  /*
   * Add the Monster to the investigator's space.
   */
  const space =
    game.board.spaces[
      investigator.spaceId
    ];

  if (!space) {
    throw new Error(
      `Space "${investigator.spaceId}" does not exist.`,
    );
  }

  const monsterIds = [
    ...space.monsterIds,
    monster.id,
  ];

  const gameAfterSpawn: GameState = {
    ...game,

    monsters: {
      ...game.monsters,

      [monster.id]:
        engagedMonster,
    },

    board: {
      ...game.board,

      monsterCup,

      spaces: {
        ...game.board.spaces,

        [investigator.spaceId]: {
          ...space,

          monsterIds,
        },
      },
    },
  };

  const gameWithSpawnAbilities =
    resolveMonsterSpawnAbilities(
      gameAfterSpawn,
      monster.id,
      definition,
    );

  return {
    ...gameWithSpawnAbilities,

    pendingDecision: {
      type: "combat",

      title:
        `Combat: ${definition.name}`,

      message:
        `You are engaged with ${definition.name}.`,

      image:
        definition.frontImage,

      monsterId:
        monster.id,

      onDefeat,

      onNotDefeated,

      source:
        `combat:${monster.id}`,

      resume,
    },
  };
}