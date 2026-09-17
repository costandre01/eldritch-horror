import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { resolveMonsterToughness } from "./resolveMonsterToughness";
import { resolveMonsterSpawnAbilities } from "./resolveMonsterSpawnAbilities";


export function spawnMonster(
  game: GameState,
  map: MapDefinition,
): GameState {
  /*
   * ============================================================
   * FIND A MONSTER IN THE CUP
   * ============================================================
   *
   * The Monster Cup contains the physical Monster copies.
   *
   * We take one random Monster from the Cup.
   */

  if (game.board.monsterCup.length === 0) {
    throw new Error(
      "There are no Monsters available in the Monster Cup.",
    );
  }

  const randomMonsterIndex =
    Math.floor(
      Math.random() *
        game.board.monsterCup.length,
    );

  const monster =
    game.board.monsterCup[
      randomMonsterIndex
    ];

  if (!monster) {
    throw new Error(
      "Failed to retrieve a Monster from the Monster Cup.",
    );
  }

  /*
   * ============================================================
   * FIND MONSTER DEFINITION
   * ============================================================
   */

  const definition =
    CORE_MONSTERS.find(
      (candidate) =>
        candidate.id ===
        monster.definitionId,
    );

  if (!definition) {
    throw new Error(
      `Monster definition "${monster.definitionId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * CHOOSE RANDOM SPACE
   * ============================================================
   */

  if (map.spaces.length === 0) {
    throw new Error(
      "The map contains no spaces.",
    );
  }

  const randomSpaceIndex =
    Math.floor(
      Math.random() *
        map.spaces.length,
    );

  const randomSpace =
    map.spaces[randomSpaceIndex];

  if (!randomSpace) {
    throw new Error(
      "Failed to select a random space.",
    );
  }

  /*
   * ============================================================
   * RESOLVE MONSTER TOUGHNESS
   * ============================================================
   */

  const toughness =
    resolveMonsterToughness(
      game,
      definition,
    );

  /*
   * ============================================================
   * CREATE SPAWNED MONSTER
   * ============================================================
   *
   * The Monster is placed on the board but is NOT
   * engaged with an investigator.
   *
   * It also does NOT start combat.
   */

  const spawnedMonster = {
    ...monster,

    health: toughness,

    spaceId:
      randomSpace.id,

    engagedInvestigatorId:
      null,
  };

  /*
   * ============================================================
   * REMOVE MONSTER FROM CUP
   * ============================================================
   */

  const monsterCup =
    game.board.monsterCup.filter(
      (_, index) =>
        index !== randomMonsterIndex,
    );

  /*
   * ============================================================
   * ADD MONSTER TO SPACE
   * ============================================================
   */

  const boardSpace =
    game.board.spaces[
      randomSpace.id
    ];

  if (!boardSpace) {
    throw new Error(
      `Space "${randomSpace.id}" does not exist on the board.`,
    );
  }

  const monsterIds = [
    ...boardSpace.monsterIds,
    spawnedMonster.id,
  ];

  /*
   * ============================================================
   * RETURN UPDATED GAME
   * ============================================================
   */

  const gameAfterSpawn: GameState = {
    ...game,
    monsters: {
      ...game.monsters,
      [spawnedMonster.id]:
        spawnedMonster,
    },
    board: {
      ...game.board,
      monsterCup,
      spaces: {
        ...game.board.spaces,
        [randomSpace.id]: {
          ...boardSpace,
          monsterIds,
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

export function spawnMonsterAtSpace(
  game: GameState,
  spaceId: string,
  monsterDefinitionId?: string,
): GameState {
  const boardSpace =
    game.board.spaces[spaceId];

  if (!boardSpace) {
    throw new Error(
      `Space "${spaceId}" does not exist on the board.`,
    );
  }

  if (game.board.monsterCup.length === 0) {
    throw new Error(
      "There are no Monsters available in the Monster Cup.",
    );
  }

  const eligibleIndexes =
    game.board.monsterCup
      .map(
        (
          monster,
          index,
        ) => ({
          monster,
          index,
        }),
      )
      .filter(
        ({ monster }) =>
          !monsterDefinitionId ||
          monster.definitionId ===
            monsterDefinitionId,
      );

  if (eligibleIndexes.length === 0) {
    throw new Error(
      monsterDefinitionId
        ? `No Monster with definition "${monsterDefinitionId}" is available in the Monster Cup.`
        : "There are no eligible Monsters available in the Monster Cup.",
    );
  }

  const selected =
    eligibleIndexes[
      Math.floor(
        Math.random() *
          eligibleIndexes.length,
      )
    ];

  if (!selected) {
    throw new Error(
      "Failed to retrieve a Monster from the Monster Cup.",
    );
  }

  const randomMonsterIndex =
    selected.index;

  const monster =
    selected.monster;

  const definition =
    CORE_MONSTERS.find(
      (candidate) =>
        candidate.id ===
        monster.definitionId,
    );

  if (!definition) {
    throw new Error(
      `Monster definition "${monster.definitionId}" does not exist.`,
    );
  }

  const toughness =
    resolveMonsterToughness(
      game,
      definition,
    );

  const spawnedMonster = {
    ...monster,

    health: toughness,

    spaceId,

    engagedInvestigatorId:
      null,
  };

  const monsterCup =
    game.board.monsterCup.filter(
      (_, index) =>
        index !== randomMonsterIndex,
    );

  const monsterIds = [
    ...boardSpace.monsterIds,
    spawnedMonster.id,
  ];

  const gameAfterSpawn: GameState = {
    ...game,

    monsters: {
      ...game.monsters,

      [spawnedMonster.id]:
        spawnedMonster,
    },

    board: {
      ...game.board,

      monsterCup,

      spaces: {
        ...game.board.spaces,

        [spaceId]: {
          ...boardSpace,

          monsterIds,
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