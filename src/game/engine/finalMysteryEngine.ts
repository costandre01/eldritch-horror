import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { spawnEpicMonsterAtSpace } from "./spawnEpicMonsterAtSpace";

export function startFinalMystery(
  game: GameState,
  map: MapDefinition,
): GameState {
  const finalMystery =
    game.finalMystery;

  if (!finalMystery) {
    return game;
  }

  /*
   * ============================================================
   * CTHULHU
   * ============================================================
   *
   * The Final Mystery begins by spawning
   * Cthulhu on space 3.
   */

  if (
    finalMystery.id ===
    "cthulhu-risen-from-the-sea"
  ) {
    return spawnEpicMonsterAtSpace(
      game,
      map,
      "space-3",
      "cthulhu",
    );
  }

  /*
   * ============================================================
   * OTHER FINAL MYSTERIES
   * ============================================================
   *
   * These will be implemented separately,
   * using their own rules.
   */

  return game;
}