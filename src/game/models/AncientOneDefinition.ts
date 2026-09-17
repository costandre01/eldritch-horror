import type { MonsterTest } from "./Monster";

export interface MythosStage {
  green: number;
  yellow: number;
  blue: number;
}

export interface AncientOneCultistStats {
  horrorTest: MonsterTest | null;
  combatTest: MonsterTest | null;
  toughness: number;
}

export type AncientOneReckoningAbility =
  | {
      type: "place-eldritch-token-on-sea";
    }
  | {
      type: "spawn-monster-and-advance-doom";
    }
  | {
      type: "investigators-on-gate-advance-doom-unless-discard-spell";
    }
  | {
      type: "each-investigator-lose-sanity";
      amount: number;
    }
  | {
      type: "lose-sanity-per-sanity-token";
    }
  | {
      type: "investigators-on-ancient-one-space-combat";
    }
  | {
      type: "investigators-on-gate-place-gate-or-discard-spell";
    };

export type AncientOneAwakening =
  | {
      type: "none";
    }
  | {
      type: "lose-game";
    }
  | {
      type: "spawn-epic-monster";
      epicMonsterDefinitionId: string;
      spaceId: string;
    }
  | {
      type: "spawn-epic-monster-and-move-monsters";
      epicMonsterDefinitionId: string;
      spaceId: string;
      monsterDefinitionIds: string[];
    };

export interface AncientOneDefinition {
  id: string;
  name: string;

  frontImage: string;
  backImage: string;

  startingDoom: number;

  mysteriesToSolve: number;
  availableMysteryCount: number;

  mythosDeckSize: number;

  mythosStages: [
    MythosStage,
    MythosStage,
    MythosStage,
  ];

  cultist: {
    front: AncientOneCultistStats;
    awakened: AncientOneCultistStats;
  };

  reckoning: {
    front: AncientOneReckoningAbility[];
    awakened: AncientOneReckoningAbility[];
  };

  awakening: AncientOneAwakening;
}