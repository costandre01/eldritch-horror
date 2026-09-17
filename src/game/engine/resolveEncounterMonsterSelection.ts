import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { resolveEncounterEffects } from "./resolveEncounterEffects";

export function resolveEncounterMonsterSelection(
  game: GameState,
  monsterId: string,
  map: MapDefinition,
): GameState {
  const decision =
    game.pendingDecision;

  if (
    !decision ||
    decision.type !== "select-monster"
  ) {
    throw new Error(
      "There is no pending Monster selection.",
    );
  }

  if (
    !decision.monsterIds.includes(
      monsterId,
    )
  ) {
    throw new Error(
      `Monster "${monsterId}" cannot be selected.`,
    );
  }

  const monster =
    game.monsters[monsterId];

  if (!monster) {
    throw new Error(
      `Monster "${monsterId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * CLEAR PENDING DECISION
   * ============================================================
   */

  let currentGame: GameState = {
    ...game,

    pendingDecision: null,
  };

  /*
   * ============================================================
   * GET SELECTED MONSTER EFFECTS
   * ============================================================
   */

  const effects =
    decision.onMonsterSelected;

  /*
   * ============================================================
   * DISCARD SELECTED MONSTER
   * ============================================================
   *
   * This is used by effects such as:
   *
   * - discard-monster
   *
   * The Monster is removed from the board and placed
   * in the Monster discard.
   */

  const shouldDiscard =
    effects.some(
      (effect) =>
        effect.type ===
        "discard-selected-monster",
    );

  if (shouldDiscard) {
    /*
     * Remove Monster from its current space.
     */

    if (monster.spaceId) {
      const space =
        currentGame.board.spaces[
          monster.spaceId
        ];

      if (space) {
        currentGame = {
          ...currentGame,

          board: {
            ...currentGame.board,

            spaces: {
              ...currentGame.board.spaces,

              [monster.spaceId]: {
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

    /*
     * Remove Monster from the active registry.
     */

    const {
      [monsterId]:
        discardedMonster,
      ...remainingMonsters
    } = currentGame.monsters;

    /*
     * Add Monster to the discard.
     */

    currentGame = {
      ...currentGame,

      monsters:
        remainingMonsters,

      board: {
        ...currentGame.board,

        monsterDiscard: [
          ...currentGame.board
            .monsterDiscard,

          discardedMonster,
        ],
      },
    };

    /*
     * Resolve any effects that were waiting
     * after the Monster selection.
     */

    if (
      decision.onComplete &&
      decision.onComplete.length > 0
    ) {
      currentGame =
        resolveEncounterEffects(
          currentGame,
          game.activeInvestigatorId!,
          decision.onComplete,
          map,
        );
    }

    return currentGame;
  }

  /*
   * ============================================================
   * NORMAL MONSTER SELECTION
   * ============================================================
   *
   * Pass the selected Monster ID to the effects
   * waiting for the selection.
   *
   * Examples:
   *
   * - lose-selected-monster-health
   * - select-monster-destination
   * - move-selected-monster
   */

  if (
    effects.length > 0
  ) {
    const resolvedEffects =
      effects.map((effect) => ({
        ...effect,

        monsterIds:
          effect.monsterIds ??
          [monsterId],
      }));

    currentGame =
      resolveEncounterEffects(
        currentGame,
        game.activeInvestigatorId!,
        resolvedEffects,
        map,
      );
  }

  /*
   * ============================================================
   * ANOTHER PLAYER DECISION
   * ============================================================
   *
   * The selected Monster may lead to another
   * selection, such as choosing its destination.
   *
   * Do not continue while a new decision is pending.
   */

  if (
    currentGame.pendingDecision
  ) {
    return currentGame;
  }

  /*
   * ============================================================
   * CONTINUE AFTER MONSTER SELECTION
   * ============================================================
   */

  if (
    decision.onComplete &&
    decision.onComplete.length > 0
  ) {
    currentGame =
      resolveEncounterEffects(
        currentGame,
        game.activeInvestigatorId!,
        decision.onComplete,
        map,
      );
  }

  return currentGame;
}