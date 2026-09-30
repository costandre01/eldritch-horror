import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { createMonster } from "./createMonster";
import { getSetAsideMonsterCounts } from "./monsterSetup";
import { resolveMonsterToughness } from "./resolveMonsterToughness";
import { resolveMonsterSpawnAbilities } from "./resolveMonsterSpawnAbilities";
import { drawRandomSpace } from "./clueEngine";


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
   * DETERMINE RANDOM SPACE
   * ============================================================
   *
   * A "random space" in Eldritch Horror is determined by
   * drawing a random Clue token from the Clue Pool and using
   * the space printed on that token.
   *
   * The Clue used to determine the random space is discarded.
   */

  const {
    game: gameAfterRandomSpace,
    spaceId: randomSpaceId,
  } = drawRandomSpace(game);

  if (!randomSpaceId) {
    /*
     * Officially, if no Clue is available, the Lead Investigator
     * chooses the space.
     *
     * That exceptional choice will be handled by the caller/UI.
     */
    throw new Error(
      "A random space could not be determined because there are no Clues available.",
    );
  }

  const randomSpace =
    map.spaces.find(
      (space) =>
        space.id === randomSpaceId,
    );

  if (!randomSpace) {
    throw new Error(
      `Random-space Clue references unknown map space "${randomSpaceId}".`,
    );
  }

  /*
   * ============================================================
   * RESOLVE MONSTER TOUGHNESS
   * ============================================================
   */

  const toughness =
    resolveMonsterToughness(
      gameAfterRandomSpace,
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
    gameAfterRandomSpace.board.monsterCup.filter(
      (_, index) =>
        index !== randomMonsterIndex,
    );

  /*
   * ============================================================
   * ADD MONSTER TO SPACE
   * ============================================================
   */

  const boardSpace =
    gameAfterRandomSpace.board.spaces[
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
    ...gameAfterRandomSpace,

    monsters: {
      ...gameAfterRandomSpace.monsters,

      [spawnedMonster.id]:
        spawnedMonster,
    },

    board: {
      ...gameAfterRandomSpace.board,

      monsterCup,

      spaces: {
        ...gameAfterRandomSpace.board.spaces,

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

  const monsterSetAside =
    game.board.monsterSetAside ??
    (() => {
      // Older saves did not retain the setup set-aside pool. Rebuild
      // only physical tokens that are absent from every saved zone.
      const counts = getSetAsideMonsterCounts(
        game.ancientOne.id,
      );
      const representedIds = new Set([
        ...game.board.monsterCup.map(
          (monster) => monster.id,
        ),
        ...(
          game.board.monsterDiscard ??
          []
        ).map(
          (monster) => monster.id,
        ),
        ...Object.keys(game.monsters),
      ]);

      return Object.entries(
        counts,
      ).flatMap(
        ([
          definitionId,
          setAsideCount,
        ]) => {
          const definition =
            CORE_MONSTERS.find(
              (candidate) =>
                candidate.id ===
                definitionId,
            );

          if (!definition) {
            return [];
          }

          const cupCount = Math.max(
            0,
            definition.quantity -
              setAsideCount,
          );

          const actualSetAsideCount =
            Math.min(
              definition.quantity,
              setAsideCount,
            );

          return Array.from(
            {
              length:
                actualSetAsideCount,
            },
            (_, offset) =>
              createMonster(
                definition,
                cupCount +
                  offset +
                  1,
              ),
          ).filter(
            (monster) =>
              !representedIds.has(
                monster.id,
              ),
          );
        },
      );
    })();

  const setAsideMatches =
    monsterDefinitionId
      ? monsterSetAside.filter(
          (monster) =>
            monster.definitionId ===
            monsterDefinitionId,
        )
      : [];

  const selectedSetAside =
    setAsideMatches[
      Math.floor(
        Math.random() *
          setAsideMatches.length,
      )
    ];

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

  if (
    !selectedSetAside &&
    eligibleIndexes.length === 0
  ) {
    /*
     * A named spawn with no remaining matching token
     * has no effect.
     *
     * In particular, do not leave the Mythos
     * Reckoning stuck.
     */
    if (monsterDefinitionId) {
      return game;
    }

    throw new Error(
      "There are no eligible Monsters available in the Monster Cup.",
    );
  }

  const selected =
    selectedSetAside
      ? undefined
      : eligibleIndexes[
          Math.floor(
            Math.random() *
              eligibleIndexes.length,
          )
        ];

  if (
    !selectedSetAside &&
    !selected
  ) {
    throw new Error(
      "Failed to retrieve a Monster from the Monster Cup.",
    );
  }

  const randomMonsterIndex =
    selected?.index;

  const monster =
    selectedSetAside ??
    selected?.monster;

  if (!monster) {
    throw new Error(
      "Failed to retrieve a Monster from its pool.",
    );
  }

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
    randomMonsterIndex === undefined
      ? game.board.monsterCup
      : game.board.monsterCup.filter(
          (_, index) =>
            index !==
            randomMonsterIndex,
        );

  const remainingSetAside =
    selectedSetAside
      ? monsterSetAside.filter(
          (candidate) =>
            candidate.id !==
            selectedSetAside.id,
        )
      : monsterSetAside;

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

      monsterSetAside:
        remainingSetAside,

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