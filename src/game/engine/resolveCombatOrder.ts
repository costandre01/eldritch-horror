import type { GameState } from "../models/GameState";

import { startMonsterCombat } from "./startMonsterCombat";

export function resolveCombatOrder(
  game: GameState,
  orderedMonsterIds: string[],
): GameState {
  if (orderedMonsterIds.length < 2) {
    throw new Error(
      "Combat order requires at least two Monsters.",
    );
  }

  const firstMonsterId =
    orderedMonsterIds[0];

  if (!firstMonsterId) {
    throw new Error(
      "Combat order has no first Monster.",
    );
  }

  const updatedGame: GameState = {
    ...game,

    combatOrder:
      orderedMonsterIds,

    pendingDecision:
      null,
  };

  return startMonsterCombat(
    updatedGame,
    firstMonsterId,
  );
}