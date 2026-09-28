import type { GameState } from "../models/GameState";
import type { MythosDefinition } from "../models/Mythos";

export function solveMythosRumor(
  game: GameState,
  mythos: MythosDefinition,
): GameState {
  if (mythos.type !== "rumor") {
    throw new Error(
      `Mythos "${mythos.id}" is not a Rumor.`,
    );
  }

  const mythosInPlay =
    game.board.mythosInPlay.filter(
      (entry) =>
        entry.definitionId !== mythos.id,
    );

  /*
   * Remove the Rumor marker from the space
   * where this Rumor was spawned.
   */

  let spaces = {
    ...game.board.spaces,
  };

  const epicMonsterByRumor: Record<string, string | undefined> = {
    "lost-knowledge": "tick-tock-men",
    "the-wind-walker": "wind-walker",
    "web-between-worlds": "spinner-of-webs",
  };
  const epicDefinitionId = epicMonsterByRumor[mythos.id];
  const removedEpicMonsterIds = new Set(
    Object.values(game.monsters)
      .filter((monster) => monster.definitionId === epicDefinitionId)
      .map((monster) => monster.id),
  );

  const rumorIcon =
    mythos.icons.find(
      (icon) =>
        icon.type === "spawn-rumor",
    );

  if (
    rumorIcon &&
    rumorIcon.type === "spawn-rumor"
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

  if (removedEpicMonsterIds.size > 0) {
    spaces = Object.fromEntries(
      Object.entries(spaces).map(([spaceId, space]) => [
        spaceId,
        {
          ...space,
          monsterIds: space.monsterIds.filter(
            (monsterId) => !removedEpicMonsterIds.has(monsterId),
          ),
        },
      ]),
    );
  }

  const monsters = { ...game.monsters };
  for (const monsterId of removedEpicMonsterIds) {
    const monster = monsters[monsterId];
    if (monster) {
      monsters[monsterId] = {
        ...monster,
        spaceId: null,
        engagedInvestigatorId: null,
      };
    }
  }

  const investigators = Object.fromEntries(
    Object.entries(game.investigators).map(([investigatorId, investigator]) => [
      investigatorId,
      {
        ...investigator,
        engagedMonsterIds: investigator.engagedMonsterIds.filter(
          (monsterId) => !removedEpicMonsterIds.has(monsterId),
        ),
      },
    ]),
  );

  return {
    ...game,

    monsters,
    investigators,

    board: {
      ...game.board,

      spaces,

      mythosInPlay,

      mythosDiscard: [
        ...(game.board.mythosDiscard ?? []),
        mythos,
      ],
    },
  };
}
