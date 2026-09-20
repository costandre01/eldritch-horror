import type { EncounterEffect } from "./Encounter";

export type MythosDifficulty =
  | "easy"
  | "normal"
  | "hard";

export type MythosType =
  | "event"
  | "ongoing"
  | "rumor";

export type MythosIcon =
  | {
      type: "advance-omen";
    }
  | {
      type: "mythos-reckoning";
    }
  | {
      type: "spawn-gates";
    }
  | {
      type: "monster-surge";
    }
  | {
      type: "spawn-clues";
    }
  | {
      type: "spawn-rumor";

      spaceId: string;
    }
  | {
      type: "place-eldritch-tokens";

      amount: number;
    };

export type MythosReckoning =
  | {
      type: "discard-eldritch-token";
    }

  | {
      type: "lead-gains-madness";
    }

  | {
      type: "return-active-expedition";
    }

  | {
      type: "discard-self-and-place-assets";
    }

  | {
      type: "city-investigators-test-observation";
    }

  | {
      type: "discard-self";
    };

export interface MythosDefinition {
  id: string;

  name: string;

  difficulty: MythosDifficulty;

  type: MythosType;

  image: string;

  flavorText?: string;

  icons: MythosIcon[];

  text: string;

  effects: MythosEffect[];

  reckoning?: MythosReckoning;
}

export type MythosEffect =
  | {
      type: "gain-condition";

      conditionDefinitionId: string;

      investigator: "lead" | "active";
    }

  | {
      type: "solve-rumor";

      amount: number;
    }

  | {
      type: "test-and-gain-clues";

      investigator: "lead";

      skill: "influence";
    }

  | {
      type: "gain-dark-pact-to-solve-rumor";

      investigator: "lead";

      amount: number;
    }

  | {
      type: "gain-debt-to-discard-condition";

      investigator: "each";
    }
  | {
      type: "mythos-special";

      id: string;
    }

  | {
      type: "doom-per-gate";
    }
  | {
      type: "gain-artifact";

      investigator: "lead";
    }

  | {
      type: "roll-single-die";

      investigator: "lead";

      onOneOrTwo: EncounterEffect[];
    }
  | {
      type: "move-omen-choice";
      investigator: "lead";
    }
  | {
      type: "gain-ally";
      investigator: "lead";
    }
  | {
      type: "select-gate";
    }
  | {
      type: "world-fights-back";
    }
  | {
      type: "mythos-dark-power";
    }
  | {
      type: "blood-flows";
    }
  | {
      type: "spawn-monsters";

      amount: number;

      location:
        | "active-expedition";
    };