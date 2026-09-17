export type AssetType =
  | "item"
  | "trinket"
  | "ally"
  | "service";

export type AssetHandRequirement =
  | "none"
  | "one-hand"
  | "two-hands";

export interface AssetDefinition {
  id: string;

  name: string;

  type: AssetType;

  hands: AssetHandRequirement;

  bonus: number;

  description: string;

  abilityIds: string[];
}