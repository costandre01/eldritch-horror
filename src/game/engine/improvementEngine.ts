import type { GameState } from "../models/GameState";
import type { Investigator, Skill } from "../models/Investigator";

export const IMPROVABLE_SKILLS: Skill[] = [
  "lore",
  "influence",
  "observation",
  "strength",
  "will",
];

export function getImprovementLevel(
  investigator: Investigator,
  skill: Skill,
): number {
  return investigator.improvementTokens?.[skill] ?? 0;
}

export function getImprovedSkillValue(
  investigator: Investigator,
  skill: Skill,
): number {
  return investigator.skills[skill] + getImprovementLevel(investigator, skill);
}

export function getImprovableSkills(investigator: Investigator): Skill[] {
  return IMPROVABLE_SKILLS.filter(
    (skill) => getImprovementLevel(investigator, skill) < 2,
  );
}

export function improveInvestigatorSkill(
  game: GameState,
  investigatorId: string,
  skill: Skill,
  amount = 1,
): GameState {
  const investigator = game.investigators[investigatorId];
  if (!investigator) {
    throw new Error(`Investigator "${investigatorId}" does not exist.`);
  }
  if (!IMPROVABLE_SKILLS.includes(skill) || !Number.isFinite(amount) || amount <= 0) {
    return game;
  }

  const currentLevel = getImprovementLevel(investigator, skill);
  const nextLevel = Math.min(2, currentLevel + Math.floor(amount)) as 1 | 2;
  if (nextLevel === currentLevel) return game;

  return {
    ...game,
    investigators: {
      ...game.investigators,
      [investigatorId]: {
        ...investigator,
        improvementTokens: {
          ...investigator.improvementTokens,
          [skill]: nextLevel,
        },
      },
    },
  };
}

export function startNextStartingImprovement(game: GameState): GameState {
  const queue = game.startingImprovementQueue ?? [];
  const investigatorId = queue[0];
  if (!investigatorId) return game;
  const investigator = game.investigators[investigatorId];
  if (!investigator || investigator.isDefeated) {
    return startNextStartingImprovement({
      ...game,
      startingImprovementQueue: queue.slice(1),
    });
  }
  const skills = getImprovableSkills(investigator);
  if (skills.length === 0) {
    return startNextStartingImprovement({
      ...game,
      startingImprovementQueue: queue.slice(1),
    });
  }

  return {
    ...game,
    pendingDecision: {
      type: "choice",
      title: "Starting Improvement",
      message: "Choose a skill for this investigator's starting Improvement token.",
      options: skills.map((skill) => ({
        id: skill,
        title: `${skill[0].toUpperCase()}${skill.slice(1)}`,
        description: `Place or upgrade the ${skill} Improvement token.`,
      })),
      source: `starting-improvement:${investigatorId}`,
    },
  };
}
