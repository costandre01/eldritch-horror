import type { SpellBackEffect } from "./SpellDefinition/backEffects";
import type { SpellFrontEffect } from "./SpellDefinition/frontEffects";

export type SpellType =
  | "incantation"
  | "ritual"
  | "glamour";

export interface SpellBackDefinition {
  id: string;

  frontImage: string;

  backImage: string;

  effects: SpellBackEffect[];
}

export interface SpellDefinition {
  id: string;

  name: string;

  type: SpellType;

  description: string;

  loreBonus: number;

  abilityIds: string[];

  frontEffects: SpellFrontEffect[];

  backs: SpellBackDefinition[];
}