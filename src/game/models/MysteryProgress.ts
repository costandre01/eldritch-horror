export interface MysteryProgress {
  mysteryId: string;

  clueTokenIds: string[];

  eldritchTokenCount: number;

  monsterIds: string[];

  gateIds: string[];

  mysteryTokenSpaceId: string | null;

  eldritchTokenSpaceIds: string[];
}