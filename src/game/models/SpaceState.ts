import type { GateToken } from "./GateToken";

export interface SpaceState {
  spaceId: string;

  clues: number;

  clueTokenIds: string[];

  monsterIds: string[];

  gates: GateToken[];

  expedition: boolean;

  rumor: boolean;

  eldritchTokenCount: number;
}