import type { GameState } from "../models/GameState";
import type { Skill } from "../models/Investigator";
import { getImprovedSkillValue } from "./improvementEngine";

export function getEffectiveSkill(
  game: GameState,
  investigatorId: string,
  skill: Skill,
  context: "combat" | "spell" | "combat-spell" | null = null,
): number {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  const bonuses: number[] = [];

  for (const assetId of investigator.assetIds) {
    const asset =
      game.assets[assetId];

    if (!asset) {
      continue;
    }

    bonuses.push(asset.skillModifiers?.[skill] ?? 0);

    if (context === "combat" || context === "combat-spell") {
      bonuses.push(asset.contextualSkillModifiers?.combat?.[skill] ?? 0);
    }
    if (context === "spell" || context === "combat-spell") {
      bonuses.push(asset.contextualSkillModifiers?.spell?.[skill] ?? 0);
    }
  }

  for (const artifactId of investigator.artifactIds) {
    const artifact = game.artifacts[artifactId];
    if (!artifact) continue;
    bonuses.push(artifact.skillModifiers?.[skill] ?? 0);
    if (context === "combat" || context === "combat-spell") {
      bonuses.push(artifact.contextualSkillModifiers?.combat?.[skill] ?? 0);
    }
    if (context === "spell" || context === "combat-spell") {
      bonuses.push(artifact.contextualSkillModifiers?.spell?.[skill] ?? 0);
    }
  }

  if (context === "combat" || context === "combat-spell") {
    bonuses.push(...(game.activeCombatSkillModifiers ?? [])
      .filter((modifier) => modifier.investigatorId === investigatorId && modifier.skill === skill)
      .map((modifier) => modifier.amount));
  }

  // Tests use the single highest applicable "gain +N" bonus. Additional
  // dice are handled separately by getPassiveTestModifiers.
  return getImprovedSkillValue(investigator, skill) + Math.max(0, ...bonuses);
}
