import type { GameState } from "../models/GameState";
import type { Skill } from "../models/Investigator";

export function getEffectiveSkill(
  game: GameState,
  investigatorId: string,
  skill: Skill,
): number {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  let skillValue =
    investigator.skills[skill];

  for (const assetId of investigator.assetIds) {
    const asset =
      game.assets[assetId];

    if (!asset) {
      continue;
    }

    skillValue +=
      asset.skillModifiers?.[skill] ?? 0;
  }

  return skillValue;
}