import type { GameState } from "../models/GameState";
import type {
  MonsterDefinition,
  MonsterTest,
} from "../models/Monster";

import { CORE_ANCIENT_ONES } from "../../content/core/coreAncientOnes";

export function resolveMonsterTest(
  game: GameState,
  definition: MonsterDefinition,
  type: "horror" | "combat",
): MonsterTest | null {
  if (
    definition.toughness.type !==
    "ancient-one"
  ) {
    return type === "horror"
      ? definition.horrorTest
      : definition.combatTest;
  }

  const ancientOneDefinition =
    CORE_ANCIENT_ONES.find(
      (ancientOne) =>
        ancientOne.id ===
        game.ancientOne.id,
    );

  if (!ancientOneDefinition) {
    throw new Error(
      `Ancient One "${game.ancientOne.id}" not found.`,
    );
  }

  const cultist =
    ancientOneDefinition.cultist.front;

  return type === "horror"
    ? cultist.horrorTest
    : cultist.combatTest;
}