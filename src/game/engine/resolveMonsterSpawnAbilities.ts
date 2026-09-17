import type { GameState } from "../models/GameState";
import type {
  MonsterDefinition,
  MonsterSpecialAbility,
} from "../models/Monster";

import { gainCondition } from "./gainCondition";
import { getMonsterSpawnAbilities } from "./monsterAbilities";
import { getLeadInvestigatorId } from "./getLeadInvestigatorId";

export function resolveMonsterSpawnAbilities(
  game: GameState,
  monsterId: string,
  definition: MonsterDefinition,
): GameState {
  const monster =
    game.monsters[monsterId];

  if (!monster) {
    throw new Error(
      `Monster "${monsterId}" does not exist.`,
    );
  }

  const abilities =
    getMonsterSpawnAbilities(
      definition,
    );

  let currentGame = game;

  for (const ability of abilities) {
    currentGame =
      resolveMonsterSpawnAbility(
        currentGame,
        monsterId,
        ability,
      );
  }

  return currentGame;
}

/*
 * ============================================================
 * RESOLVE SINGLE SPAWN ABILITY
 * ============================================================
 */

function resolveMonsterSpawnAbility(
  game: GameState,
  monsterId: string,
  ability: MonsterSpecialAbility,
): GameState {
  switch (ability.type) {
    /*
     * ----------------------------------------------------------
     * MOVE MONSTER TO SPECIFIC SPACE
     * ----------------------------------------------------------
     */

    case "spawn-move-to-space": {
      const monster =
        game.monsters[monsterId];

      if (!monster) {
        return game;
      }

      const targetSpace =
        game.board.spaces[
          ability.spaceId
        ];

      if (!targetSpace) {
        throw new Error(
          `Spawn ability references unknown space: ${ability.spaceId}`,
        );
      }

      if (
        monster.spaceId ===
        ability.spaceId
      ) {
        return game;
      }

      /*
       * Remove Monster from its current space.
       */

      const spaces = {
        ...game.board.spaces,
      };

      if (monster.spaceId) {
        const currentSpace =
          spaces[monster.spaceId];

        if (currentSpace) {
          spaces[monster.spaceId] = {
            ...currentSpace,

            monsterIds:
              currentSpace.monsterIds.filter(
                (id) =>
                  id !== monsterId,
              ),
          };
        }
      }

      /*
       * Add Monster to target space.
       */

      spaces[ability.spaceId] = {
        ...targetSpace,

        monsterIds: [
          ...targetSpace.monsterIds,
          monsterId,
        ],
      };

      return {
        ...game,

        monsters: {
          ...game.monsters,

          [monsterId]: {
            ...monster,

            spaceId:
              ability.spaceId,
          },
        },

        board: {
          ...game.board,

          spaces,
        },
      };
    }

    /*
     * ----------------------------------------------------------
     * LEAD INVESTIGATOR GAINS CONDITION
     * ----------------------------------------------------------
     */

    case "spawn-lead-investigator-gains-condition": {
        const leadInvestigatorId =
            getLeadInvestigatorId(game);

        return gainCondition(
            game,
            leadInvestigatorId,
            ability.conditionDefinitionId,
        );
    }

    default:
      return game;
  }
}