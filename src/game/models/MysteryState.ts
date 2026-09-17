import type { MysteryProgress } from "./MysteryProgress";

export interface MysteryState {
  selectedMysteryIds: string[];

  activeMysteryId: string | null;

  solvedMysteryIds: string[];

  progress: Record<
    string,
    MysteryProgress
  >;
}