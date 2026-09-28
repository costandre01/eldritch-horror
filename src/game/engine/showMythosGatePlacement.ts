import type { GameState } from "../models/GameState";
import { showMythosMonsterPlacement } from "./showMythosMonsterPlacement";

export function showMythosGatePlacement(before: GameState, after: GameState, nextIconIndex: number): GameState {
  const previousGateIds = new Set(Object.values(before.board.spaces).flatMap((space) => space.gates.map((gate) => gate.id)));
  const gates = Object.values(after.board.spaces).flatMap((space) => space.gates).filter((gate) => !previousGateIds.has(gate.id));
  if (gates.length === 0) return showMythosMonsterPlacement(before, after, nextIconIndex);
  const monsterIds = Object.values(after.monsters).filter((monster) => !before.monsters[monster.id] && monster.spaceId).map((monster) => monster.id);
  return {
    ...after,
    pendingDecision: {
      type: "mythos-gates",
      title: "Spawn Gates",
      message: "New Gates and their Monsters are placed on the map.",
      gateTokenIds: gates.map((gate) => gate.id),
      spaceIds: gates.map((gate) => gate.spaceId),
      monsterIds,
      nextIconIndex,
      source: "mythos:spawn-gates",
    },
  };
}
