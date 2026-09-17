import type { GameState } from "../../models/GameState";

import { CORE_MONSTERS } from "../../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../../content/core/coreEpicMonsters";

export function resolveMonsterSingleDieRoll(
  game: GameState,
  monsterId: string,
  result: number,
): GameState {
  const monster =
    game.monsters[monsterId];

  if (!monster) {
    throw new Error(
      `Monster "${monsterId}" does not exist.`,
    );
  }

  const monsterDefinition =
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

  if (!monsterDefinition) {
    throw new Error(
      `Monster definition "${monster.definitionId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * COLOUR OUT OF SPACE
   * ============================================================
   *
   * On a 5 or 6, defeat the Monster.
   */

  if (
    result >= 5
  ) {
    const spaceId =
      monster.spaceId;

    let updatedGame: GameState = {
      ...game,

      monsters: {
        ...game.monsters,

        [monsterId]: {
          ...monster,

          health: 0,

          spaceId: null,

          engagedInvestigatorId:
            null,
        },
      },

      epicMonstersDefeated:
        monsterDefinition.epic
          ? game.epicMonstersDefeated.includes(
              monsterDefinition.id,
            )
            ? game.epicMonstersDefeated
            : [
                ...game.epicMonstersDefeated,
                monsterDefinition.id,
              ]
          : game.epicMonstersDefeated,

      pendingDecision:
        null,
    };

    /*
     * Remove the Monster from the space.
     */

    if (spaceId) {
      const space =
        updatedGame.board.spaces[
          spaceId
        ];

      if (space) {
        updatedGame = {
          ...updatedGame,

          board: {
            ...updatedGame.board,

            spaces: {
              ...updatedGame.board.spaces,

              [spaceId]: {
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

    return {
      ...updatedGame,

      pendingDecision: {
        type: "continue",

        title:
          `${monsterDefinition.name} DEFEATED`,

        message:
          `${monsterDefinition.name} has been defeated.`,

        image:
          monsterDefinition.frontImage,

        source:
          `combat-defeated:${monsterId}`,
      },
    };
  }

  /*
   * ============================================================
   * 1–4
   * ============================================================
   *
   * Monster survives.
   * Return to the normal Combat popup.
   */

  return {
    ...game,

    pendingDecision: {
      type: "combat",

      title:
        `Combat: ${monsterDefinition.name}`,

      message:
        `You are engaged with ${monsterDefinition.name}.`,

      image:
        monsterDefinition.backImage,

      monsterId,

      stage:
        "start",

      source:
        `combat:${monsterId}`,
    },
  };
}