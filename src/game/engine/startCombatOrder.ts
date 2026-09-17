import type { GameState } from "../models/GameState";

export function startCombatOrder(
  game: GameState,
  monsterIds: string[],
): GameState {
  if (monsterIds.length < 2) {
    throw new Error(
      "Combat order requires at least two Monsters.",
    );
  }

  return {
    ...game,

    pendingDecision: {
      type: "combat-order",

      title:
        "CHOOSE COMBAT ORDER",

      message:
        "Choose the order in which the Monsters will be encountered.",

      monsterIds,

      orderedMonsterIds: [],

      source: "combat-order",
    },
  };
}