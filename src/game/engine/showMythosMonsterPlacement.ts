import type { GameState } from "../models/GameState";
import { showMythosContinue } from "./showMythosContinue";

// Capture only this icon's new monsters; Continue must not spawn them again.
export function showMythosMonsterPlacement(
  before: GameState,
  after: GameState,
  nextIconIndex: number,
): GameState {
  const monsters = Object.values(after.monsters).filter(
    (monster) => !before.monsters[monster.id] && monster.spaceId,
  );
  if (monsters.length === 0) {
    return showMythosContinue(after, nextIconIndex);
  }
  return {
    ...after,
    pendingDecision: {
      type: "mythos-monsters",
      title: "Spawn Monsters",
      message: "New Monsters are placed on the map.",
      monsterIds: monsters.map((monster) => monster.id),
      spaceIds: monsters.map((monster) => monster.spaceId!),
      nextIconIndex,
      source: "mythos:spawn-monsters",
    },
  };
}
