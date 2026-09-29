import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

export function syncActiveExpedition(
  game: GameState,
  map: MapDefinition,
): GameState {
  /*
   * ============================================================
   * TOP EXPEDITION CARD
   * ============================================================
   *
   * The Active Expedition token always corresponds to the
   * location shown on the top card of the Expedition deck.
   */

  const topExpeditionId =
    game.board.encounterDecks.expedition[0];

  /*
   * ============================================================
   * EMPTY DECK
   * ============================================================
   *
   * Normally the Expedition deck should not remain empty.
   * However, keeping the state valid here prevents an old
   * Active Expedition from remaining on the board if another
   * effect temporarily removes every card.
   */

  if (!topExpeditionId) {
    return {
      ...game,

      board: {
        ...game.board,

        activeExpeditionSpaceId: null,
      },
    };
  }

  /*
   * ============================================================
   * FIND ENCOUNTER
   * ============================================================
   */

  const topExpedition =
    game.encounters[topExpeditionId];

  if (!topExpedition) {
    throw new Error(
      `Expedition Encounter "${topExpeditionId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * FIND MATCHING EXPEDITION SPACE
   * ============================================================
   *
   * Expedition Encounter names currently match the name of
   * their Expedition space in the project content.
   */

  const expeditionSpace =
    map.spaces.find(
      (space) =>
        space.isExpedition &&
        space.name === topExpedition.name,
    );

  if (!expeditionSpace) {
    throw new Error(
      `No Expedition space matches "${topExpedition.name}".`,
    );
  }

  /*
   * ============================================================
   * UPDATE ACTIVE EXPEDITION
   * ============================================================
   */

  if (
    game.board.activeExpeditionSpaceId ===
    expeditionSpace.id
  ) {
    return game;
  }

  return {
    ...game,

    board: {
      ...game.board,

      activeExpeditionSpaceId:
        expeditionSpace.id,
    },
  };
}