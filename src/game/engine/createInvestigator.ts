import type { Investigator } from "../models/Investigator";
import type { InvestigatorDefinition } from "../models/InvestigatorDefinition";

/*
 * ============================================================
 * CREATE INVESTIGATOR OPTIONS
 * ============================================================
 */

export interface CreateInvestigatorOptions {
  definition: InvestigatorDefinition;

  instanceNumber?: number;

  /*
   * Allows the game to override the investigator's starting
   * spells when necessary.
   */

  startingSpellIds?: string[];
}

/*
 * ============================================================
 * CREATE INVESTIGATOR
 * ============================================================
 */

export function createInvestigator(
  options: CreateInvestigatorOptions,
): Investigator {
  const instanceNumber =
    options.instanceNumber ?? 1;

  /*
   * ==========================================================
   * INVESTIGATOR ID
   * ==========================================================
   *
   * Example:
   *
   * akachi-onyele-001
   */

  const id =
    `${options.definition.id}-${String(
      instanceNumber,
    ).padStart(3, "0")}`;

  /*
   * ==========================================================
   * CREATE STATE
   * ==========================================================
   */

  return {
    /*
     * ========================================================
     * IDENTITY
     * ========================================================
     */

    id,

    definitionId:
      options.definition.id,

    /*
     * ========================================================
     * HEALTH / SANITY
     * ========================================================
     */

    health:
      options.definition.maxHealth,

    maxHealth:
      options.definition.maxHealth,

    sanity:
      options.definition.maxSanity,

    maxSanity:
      options.definition.maxSanity,

    /*
     * ========================================================
     * SKILLS
     * ========================================================
     *
     * Copy the object so the live investigator state can be
     * changed without modifying the definition.
     */

    skills: {
      ...options.definition.skills,
    },

    /*
     * ========================================================
     * RESOURCES
     * ========================================================
     */

    resources: 0,

    clues:
      options.definition.startingClues,

    /*
     * ========================================================
     * LOCATION
     * ========================================================
     */

    spaceId:
      options.definition.startingSpaceId,

    /*
     * ========================================================
     * TRAVEL
     * ========================================================
     */

    trainTickets: 0,

    shipTickets: 0,

    travelMoves: 0,

    travelActive: false,

    travelHistory: [],

    travelStartSpaceId: null,

    /*
     * ========================================================
     * COMBAT
     * ========================================================
     */

    engagedMonsterIds: [],

    /*
     * ========================================================
     * STATUS
     * ========================================================
     */

    isDelayed: false,

    isDefeated: false,

    /*
     * ========================================================
     * POSSESSIONS
     * ========================================================
     */

    assetIds: [
      ...options.definition.startingAssetIds,
    ],

    spellIds: [
      ...(
        options.startingSpellIds ??
        options.definition.startingSpellIds
      ),
    ],

    artifactIds: [],

    /*
     * ========================================================
     * CONDITIONS
     * ========================================================
     */

    conditionIds: [],

    /*
     * ========================================================
     * ACTIONS
     * ========================================================
     */

    actionsPerformed: [],

    /*
     * ========================================================
     * PERSONAL STORY
     * ========================================================
     *
     * Every investigator starts their Personal Story at 0.
     *
     * Examples:
     *
     * Akachi:
     * 0 / 3 Gates
     *
     * Diana:
     * 0 / 8 Monster Toughness
     *
     * Jacqueline:
     * 0 / 6 Monsters
     *
     * The exact meaning is defined by the investigator's
     * Personal Story.
     */

    personalStoryProgress: 0,
  };
}