import type { GameState } from "../models/GameState";
import type { Skill } from "../models/Investigator";

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

    if (context === "combat" || context === "combat-spell") {
      skillValue += asset.contextualSkillModifiers?.combat?.[skill] ?? 0;
    }
    if (context === "spell" || context === "combat-spell") {
      skillValue += asset.contextualSkillModifiers?.spell?.[skill] ?? 0;
    }
  }

  for (const artifactId of investigator.artifactIds) {
    const artifact = game.artifacts[artifactId];
    if (!artifact) continue;
    skillValue += artifact.skillModifiers?.[skill] ?? 0;
    if (context === "combat" || context === "combat-spell") {
      skillValue += artifact.contextualSkillModifiers?.combat?.[skill] ?? 0;
    }
    if (context === "spell" || context === "combat-spell") {
      skillValue += artifact.contextualSkillModifiers?.spell?.[skill] ?? 0;
    }
  }

  if (context === "combat" || context === "combat-spell") {
    skillValue += (game.activeCombatSkillModifiers ?? [])
      .filter((modifier) => modifier.investigatorId === investigatorId && modifier.skill === skill)
      .reduce((total, modifier) => total + modifier.amount, 0);
  }

  return skillValue;
}
