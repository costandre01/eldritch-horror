import type { Skill } from "./Investigator";

export type AssetType =
  | "item"
  | "trinket"
  | "ally"
  | "service";

export type AssetTrait =
  | "weapon"
  | "tome"
  | "magical"
  | "relic"
  | "teamwork";

export interface Asset {
  id: string;

  name: string;

  type: AssetType;

  traits: AssetTrait[];

  value: number;
  
  description: string;

  skillModifiers?: Partial<Record<Skill, number>>;

  image?: string;
}