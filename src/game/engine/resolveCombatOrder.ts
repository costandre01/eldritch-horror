import type { GameState } from "../models/GameState";

import { startMonsterCombat } from "./startMonsterCombat";

import type {
  MonsterReckoningResume,
  DarkPowerResume,
} from "../models/PendingDecision";

export function resolveCombatOrder(
  game: GameState,
  orderedMonsterIds: string[],
  resume?:
    | MonsterReckoningResume
    | DarkPowerResume,
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

  const updatedResume =
    resume?.type === "mythos-dark-power"
      ? {
          ...resume,
          monsterIds: orderedMonsterIds,
          resolvedMonsterIds: [],
        }
      : resume;

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
    updatedResume,
  );
}