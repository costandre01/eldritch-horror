import type {
  EncounterChoice,
  EncounterEffect,
} from "./Encounter";

export interface EncounterPendingChoice {
  investigatorId: string;

  choices: EncounterChoice[];

  afterChoice: EncounterEffect[];
}