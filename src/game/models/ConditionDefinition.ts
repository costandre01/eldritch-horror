import type {
  ConditionBackEffect,
} from "./ConditionDefinition/backEffects";

import type {
  ConditionFrontEffect,
} from "./ConditionDefinition/frontEffects";


export type ConditionCategory =
  | "madness"
  | "Injury"
  | "Boon"
  | "Bane"
  | "Deal"
  | "Deal-Common"
  | "Restriction";


export interface ConditionBackDefinition {
  id: string;

  frontImage: string;

  backImage: string;

  effects: ConditionBackEffect[];
}


export interface ConditionDefinition {
  id: string;

  name: string;

  folderName: string;

  copies: number;

  category: ConditionCategory;

  frontEffects: ConditionFrontEffect[];

  backs: ConditionBackDefinition[];
}