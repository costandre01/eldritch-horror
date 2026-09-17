export type MysteryType =
  | "research-encounter"
  | "eldritch-tokens"
  | "epic-monster"
  | "special-encounter"
  | "miscellaneous";

export interface MysteryDefinition {
  id: string;

  name: string;

  ancientOneId: string;

  type: MysteryType;

  image: string;

  text: string;
}