export type FinalMysteryId =
  | "azathoth-world-is-devoured"
  | "cthulhu-risen-from-the-sea"
  | "shub-niggurath-battle-in-the-woods"
  | "yog-sothoth-the-key-and-the-gate";

export interface FinalMysteryState {
  id: FinalMysteryId;
  eldritchTokenCount: number;
}