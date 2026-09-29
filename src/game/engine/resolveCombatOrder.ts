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

  /*
  * ============================================================
  * VALIDATE COMBAT ORDER
  * ============================================================
  *
  * Non-Epic Monsters must be encountered before Epic Monsters.
  *
  * The investigator may choose the order among the
  * Non-Epic Monsters and among the Epic Monsters, but an
  * Epic Monster cannot appear before a remaining Non-Epic
  * Monster.
  */

  let epicMonsterFound = false;

  for (const monsterId of orderedMonsterIds) {
    const monster =
      game.monsters[monsterId];

    if (!monster) {
      throw new Error(
        `Monster "${monsterId}" does not exist.`,
      );
    }

    if (monster.isEpic) {
      epicMonsterFound = true;

      continue;
    }

    if (epicMonsterFound) {
      throw new Error(
        "Non-Epic Monsters must be encountered before Epic Monsters.",
      );
    }
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