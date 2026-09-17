export type SpaceType =
  | "city"
  | "wilderness"
  | "sea";

export type EncounterRegion =
  | "america"
  | "europe"
  | "asia-australia";

export type PathType =
  | "train"
  | "ship"
  | "uncharted";

export interface MapPathDefinition {
  toSpaceId: string;

  type: PathType;
}

export interface MapSpaceDefinition {
  id: string;

  name: string;

  type: SpaceType;

  encounterRegion?: EncounterRegion;

  isExpedition: boolean;

  connectedSpaceIds: string[];

  paths: MapPathDefinition[];
}

export interface MapDefinition {
  id: string;

  name: string;

  spaces: MapSpaceDefinition[];

  startingSpaceId: string;
}