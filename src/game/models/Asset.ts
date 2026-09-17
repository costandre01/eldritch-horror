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

  /*
   * Image of the physical card.
   *
   * Optional for now because some of the
   * old placeholder Assets do not have an
   * image registered yet.
   */
  image?: string;
}