import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { CORE_EPIC_MONSTERS } from "../../content/core/coreEpicMonsters";
import { createMonster } from "./createMonster";
import { resolveMonsterToughness } from "./resolveMonsterToughness";
import { resolveMonsterSpawnAbilities } from "./resolveMonsterSpawnAbilities";

export function spawnEpicMonsterAtSpace(
  game: GameState,
  _map: MapDefinition,
  spaceId: string,
  epicMonsterDefinitionId: string,
): GameState {
  const boardSpace =
    game.board.spaces[spaceId];

  if (!boardSpace) {
    throw new Error(
      `Space "${spaceId}" does not exist on the board.`,
    );
  }

  const definition =
    CORE_EPIC_MONSTERS.find(
      (candidate) =>
        candidate.id ===
        epicMonsterDefinitionId,
    );

  if (!definition) {
    throw new Error(
      `Epic Monster definition "${epicMonsterDefinitionId}" does not exist.`,
    );
  }

  if (!definition.epic) {
    throw new Error(
      `Monster definition "${epicMonsterDefinitionId}" is not an Epic Monster.`,
    );
  }

  /*
   * Epic Monsters are unique physical components.
   *
   * If this Epic Monster is already in play,
   * it cannot be spawned again.
   */

  const alreadyDefeated =
    game.epicMonstersDefeated.includes(
      epicMonsterDefinitionId,
    );

  if (alreadyDefeated) {
    return game;
  }

  const alreadyInPlay =
    Object.values(game.monsters).some(
      (monster) =>
        monster.definitionId ===
          epicMonsterDefinitionId &&
        monster.isEpic &&
        monster.spaceId !== null,
    );

  if (alreadyInPlay) {
    return game;
  }

  /*
   * Epic Monsters are not taken from the Monster Cup.
   *
   * They are created directly from their definition.
   */

  const epicMonster =
    createMonster(
      definition,
      1,
    );

  const toughness =
    resolveMonsterToughness(
      game,
      definition,
    );

  const spawnedMonster = {
    ...epicMonster,

    health: toughness,

    spaceId,

    engagedInvestigatorId:
      null,
  };

  const gameAfterSpawn: GameState = {
    ...game,

    monsters: {
      ...game.monsters,

      [spawnedMonster.id]:
        spawnedMonster,
    },

    board: {
      ...game.board,

      spaces: {
        ...game.board.spaces,

        [spaceId]: {
          ...boardSpace,

          monsterIds: [
            ...boardSpace.monsterIds,
            spawnedMonster.id,
          ],
        },
      },
    },
  };

  return resolveMonsterSpawnAbilities(
    gameAfterSpawn,
    spawnedMonster.id,
    definition,
  );
}