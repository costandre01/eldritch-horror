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

  return {
    ...game,

    board: {
      ...game.board,

      spaces,

      mythosInPlay,

      mythosDiscard: [
        ...game.board.mythosDiscard,
        mythos,
      ],
    },
  };
}