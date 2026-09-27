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

export interface TestRerollAbility {
  amount: number;
  resultModifier?: number;
  sanityCost?: number;
  rerollEachDieOnce?: boolean;
  skill?: Skill;
  combatOnly?: boolean;
  otherWorldOnly?: boolean;
  oncePerRound?: boolean;
}

export interface PassiveTestModifier {
  skill?: Skill;
  bonusDice?: number;
  combatOnly?: boolean;
  otherWorldOnly?: boolean;
  excludeOtherWorld?: boolean;
  cityOnly?: boolean;
  acquireAssetsOnly?: boolean;
  sixCountsAsTwo?: boolean;
  spellOnly?: boolean;
  investigatorsOnOwnerSpace?: boolean;
}

export interface Asset {
  id: string;

  name: string;

  type: AssetType;

  traits: AssetTrait[];

  value: number;
  
  description: string;

  skillModifiers?: Partial<Record<Skill, number>>;

  contextualSkillModifiers?: Partial<Record<"combat" | "spell", Partial<Record<Skill, number>>>>;

  passiveTestModifiers?: PassiveTestModifier[];

  monsterDamageReduction?: number;

  restSanityBonus?: number;

  testRerolls?: TestRerollAbility[];

  image?: string;
}
