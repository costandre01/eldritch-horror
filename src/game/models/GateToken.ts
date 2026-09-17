export type GateOmen =
  | "green"
  | "blue"
  | "red";

export interface GateToken {
  id: string;
  spaceId: string;
  omen: GateOmen;
}