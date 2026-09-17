import type { InvestigatorAction } from "../types/InvestigatorAction";
import type { TravelMove } from "./TravelMove";

/*
 * ============================================================
 * SKILLS
 * ============================================================
 */

export type Skill =
  | "lore"
  | "influence"
  | "observation"
  | "strength"
  | "will";

export interface InvestigatorSkills {
  lore: number;
  influence: number;
  observation: number;
  strength: number;
  will: number;
}

/*
 * ============================================================
 * INVESTIGATOR
 * ============================================================
 */

export interface Investigator {
  /*
   * ==========================================================
   * IDENTITY
   * ==========================================================
   */

  id: string;

  definitionId: string;

  health: number;

  maxHealth: number;

  sanity: number;

  maxSanity: number;

  skills: InvestigatorSkills;

  resources: number;

  clues: number;

  spaceId: string | null;

  trainTickets: number;

  shipTickets: number;

  travelMoves: number;

  travelActive: boolean;

  travelHistory: TravelMove[];

  travelStartSpaceId: string | null;

  engagedMonsterIds: string[];

  isDelayed: boolean;

  isDefeated: boolean;

  assetIds: string[];

  spellIds: string[];

  artifactIds: string[];

  conditionIds: string[];

  actionsPerformed: InvestigatorAction[];

  personalStoryProgress: number;
}