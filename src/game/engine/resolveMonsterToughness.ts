import type { GameState } from "../models/GameState";
import type { MonsterDefinition } from "../models/Monster";

import { CORE_ANCIENT_ONES } from "../../content/core/coreAncientOnes";

export function resolveMonsterToughness(
  game: GameState,
  definition: MonsterDefinition,
): number {
  const toughness =
    definition.toughness;

  /*
   * ============================================================
   * FIXED
   * ============================================================
   */

  if (
    toughness.type ===
    "fixed"
  ) {
    return toughness.value;
  }

  /*
   * ============================================================
   * INVESTIGATORS + VALUE
   * ============================================================
   */

  if (
    toughness.type ===
    "investigators-plus"
  ) {
    return (
      Object.keys(
        game.investigators,
      ).length +
      toughness.value
    );
  }

  /*
   * ============================================================
   * ANCIENT ONE
   * ============================================================
   *
   * Cultist Toughness comes from the active Ancient One.
   */

  if (
    toughness.type ===
    "ancient-one"
  ) {
    const ancientOne =
      CORE_ANCIENT_ONES.find(
        (definition) =>
          definition.id ===
          game.ancientOne.id,
      );

    if (!ancientOne) {
      throw new Error(
        `Ancient One definition not found: ${game.ancientOne.id}`,
      );
    }

    /*
     * The game is currently using the front
     * Cultist statistics.
     *
     * We will later switch this to the
     * awakened statistics when the Ancient One
     * awakening state is represented in GameState.
     */

    return (
      ancientOne.cultist.front
        .toughness
    );
  }

  /*
   * ============================================================
   * EXHAUSTIVENESS
   * ============================================================
   */

  const _exhaustiveCheck: never =
    toughness;

  return _exhaustiveCheck;
}