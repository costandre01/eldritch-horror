import type { InvestigatorAction } from "../types/InvestigatorAction";

export interface InvestigatorActionState {
  action: InvestigatorAction;

  spaceId: string | null;

  health: number;
  sanity: number;

  resources: number;
  clues: number;

  trainTickets: number;
  shipTickets: number;

  assetIds: string[];
  conditionIds: string[];
}