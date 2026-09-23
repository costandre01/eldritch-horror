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
 * PERSONAL STORY
 * ============================================================
 */

export interface InvestigatorPersonalStory {
  id: string;

  name: string;

  description: string;
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