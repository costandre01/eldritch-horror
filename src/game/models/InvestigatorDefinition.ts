import type { InvestigatorSkills } from "./Investigator";

/*
 * ============================================================
 * INVESTIGATOR ABILITIES
 * ============================================================
 */

export type InvestigatorAbilityType =
  | "action"
  | "passive";

export interface InvestigatorAbility {
  id: string;

  type: InvestigatorAbilityType;

  name: string;

  description: string;
}

/*
 * ============================================================
 * PERSONAL STORY MISSION
 * ============================================================
 */

export type InvestigatorPersonalStoryMissionType =
  | "close-gates"
  | "solve-mystery"
  | "doom-threshold"
  | "improve-skills"
  | "improve-all-skills"
  | "defeat-monsters"
  | "gain-clues"
  | "gain-allies"
  | "ally-assets"
  | "spend-resources"
  | "pass-tests-with-each-skill"
  | "mystery-or-omen"
  | "mystery-or-doom"
  | "custom";

export interface InvestigatorPersonalStoryMission {
  /*
   * Identifies the general type of objective.
   */

  type: InvestigatorPersonalStoryMissionType;

  /*
   * Human-readable description of the objective.
   */

  description: string;

  /*
   * Generic counter.
   *
   * Examples:
   *
   * close 3 Gates
   * defeat 6 Monsters
   * gain 5 Clues
   */

  targetCount?: number;

  /*
   * Used for missions based on Doom.
   *
   * Example:
   *
   * "When Doom advances to 6 or lower..."
   */

  doomThreshold?: number;
}

/*
 * ============================================================
 * PERSONAL STORY
 * ============================================================
 */

export interface InvestigatorPersonalStory {
  id: string;

  name: string;

  description: string;

  mission: InvestigatorPersonalStoryMission;

  /*
   * Reward side of the Personal Story.
   */

  reward: {
    id: string;

    name: string;

    description: string;
  };

  /*
   * Consequence side of the Personal Story.
   */

  consequence: {
    id: string;

    name: string;

    description: string;
  };
}

/*
 * ============================================================
 * DEFEAT ENCOUNTERS
 * ============================================================
 *
 * These are the special encounters that happen when an
 * investigator is defeated by Health loss or Sanity loss.
 */

export interface InvestigatorDefeatEncounter {
  id: string;

  type:
    | "health-loss"
    | "sanity-loss";

  title: string;

  description: string;

  /*
   * Some defeat encounters require a test.
   */

  test?: {
    skill:
      | "lore"
      | "influence"
      | "observation"
      | "strength"
      | "will";

    modifier: number;

    /*
     * Text describing what happens if the test succeeds.
     */

    onSuccess: string;

    /*
     * Text describing what happens if the test fails.
     */

    onFailure: string;
  };

  /*
   * Whether the investigator token is removed after
   * resolving the encounter.
   */

  discardInvestigatorToken: boolean;
}

/*
 * ============================================================
 * INVESTIGATOR DEFINITION
 * ============================================================
 */

export interface InvestigatorDefinition {
  /*
   * ==========================================================
   * BASIC INFORMATION
   * ==========================================================
   */

  id: string;

  name: string;

  occupation: string;

  roles: string[];

  /*
   * ==========================================================
   * SKILLS
   * ==========================================================
   */

  skills: InvestigatorSkills;

  /*
   * ==========================================================
   * HEALTH / SANITY
   * ==========================================================
   */

  maxHealth: number;

  maxSanity: number;

  /*
   * ==========================================================
   * FOCUS
   * ==========================================================
   */

  focusLimit: number;

  /*
   * ==========================================================
   * STARTING POSITION
   * ==========================================================
   */

  startingSpaceId: string;

  startingClues: number;

  /*
   * ==========================================================
   * STARTING POSSESSIONS
   * ==========================================================
   */

  startingAssetIds: string[];

  startingSpellIds: string[];

  /*
   * ==========================================================
   * IMPROVEMENTS
   * ==========================================================
   */

  startingImprovementCount: number;

  /*
   * ==========================================================
   * ABILITIES
   * ==========================================================
   *
   * Instead of only storing IDs, each investigator definition
   * now contains the actual ability information.
   */

  abilities: InvestigatorAbility[];

  /*
   * ==========================================================
   * PERSONAL STORY
   * ==========================================================
   */

  personalStory: InvestigatorPersonalStory;

  /*
   * ==========================================================
   * DEFEAT ENCOUNTERS
   * ==========================================================
   *
   * Usually one Health-loss encounter and one Sanity-loss
   * encounter.
   */

  defeatEncounters: InvestigatorDefeatEncounter[];
}