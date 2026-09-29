import type { InvestigatorAction } from "../types/InvestigatorAction";
import type { TravelMove } from "./TravelMove";
import type { ClueToken } from "./ClueToken";

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

export type InvestigatorDefeatType =
  | "crippled"
  | "insane"
  | "devoured";

export interface InvestigatorSkills {
  lore: number;
  influence: number;
  observation: number;
  strength: number;
  will: number;
}

export type ImprovementTokenValue = 1 | 2;
export type ImprovementTokens = Partial<Record<Skill, ImprovementTokenValue>>;

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

  /** +1/+2 Improvement token currently placed beside each skill. */
  improvementTokens?: ImprovementTokens;

  resources: number;

  clues: number;

  /** Physical Clue tokens currently held by this investigator. */
  clueTokens?: ClueToken[];

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

  defeatType: InvestigatorDefeatType | null;

  assetIds: string[];

  spellIds: string[];

  artifactIds: string[];

  conditionIds: string[];

  actionsPerformed: InvestigatorAction[];

  componentActionsUsedThisRound?: string[];

  additionalActionsThisRound?: number;

  personalStoryProgress: number;
}
