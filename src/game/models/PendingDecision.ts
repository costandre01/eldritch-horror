import type { EncounterEffect } from "./Encounter";
import type { MonsterSpecialAbility } from "./Monster";

export type EyesEverywhereResume = {
  type: "eyes-everywhere";

  investigatorIds: string[];

  currentInvestigatorIndex: number;
};

export type PatrollingTheBorderResume = {
    type: "mythos-patrolling-the-border";

    investigatorIds: string[];

    currentInvestigatorIndex: number;
};

export type ArrestsMadeResume = {
  type: "mythos-arrests-made";
  investigatorIds: string[];
  currentInvestigatorIndex: number;
};

export type MonsterReckoningResume =
  | {
      type: "shub-niggurath-reckoning";

      monsterId: string;

      investigatorIds: string[];

      nextInvestigatorIndex: number;

      nextIconIndex: number;

      ancientOneAbilityIndex: number;

      ancientOneId: string;

      ancientOneReckoningStage:
        | "front"
        | "awakened";
    }
  | {
      type: "monster-reckoning";

      monsterId: string;

      monsterIds: string[];

      nextIconIndex: number;

      resolvedMonsterIds: string[];

      remainingPasses?: number;
    };

export type AncientOneAwakeningResume =
  | {
      type: "mythos";
      
      nextIconIndex: number;

      mythosIds: string[];

      resolvedMythosIds: string[];
    }
  | {
      type: "ancient-one-reckoning";
      nextIconIndex: number;
      ancientOneAbilityIndex: number;
      ancientOneId: string;
      ancientOneReckoningStage: "front" | "awakened";
    }
  | EncounterAwakeningResume;

export type EncounterAwakeningResume = {
  type: "encounter";
  investigatorId: string;
  effects: EncounterEffect[];
};

export type PendingDecision =
  | {
      type: "continue";

      title: string;

      message: string;

      image?: string;

      source?: string;

      effectResult?:
        | "pass"
        | "fail";

      onComplete?: EncounterEffect[];

      resume?:
        | MonsterReckoningResume
        | DarkPowerResume
        | ArrestsMadeResume
        | PatrollingTheBorderResume
        | EyesEverywhereResume;
    }

  | {
      type: "choice";

      title: string;

      message?: string;

      image?: string;

      options: PendingChoiceOption[];

      source?: string;

      onComplete?: EncounterEffect[];
    }

  | {
      type: "test";

      title: string;

      message?: string;

      skill:
        | "lore"
        | "influence"
        | "observation"
        | "strength"
        | "will";

      modifier: number;

      investigatorId: string;

      minSuccesses?: number;

      onSuccess?: EncounterEffect[];

      onFail?: EncounterEffect[];

      source?: string;

      image?: string;

      onComplete?: EncounterEffect[];

      resume?:
        | MonsterReckoningResume
        | DarkPowerResume
        | ArrestsMadeResume
        | PatrollingTheBorderResume
        | EyesEverywhereResume;
    }

  | {
      type: "single-die-roll";

      title: string;

      message?: string;

      image?: string;

      investigatorId: string;

      onOneOrTwo?: EncounterEffect[];

      onThreeToFive?: EncounterEffect[];

      onThreeToSix?: EncounterEffect[];

      onSix?: EncounterEffect[];

      onComplete?: EncounterEffect[];

      source?: string;
    }

  | {
      type: "select-space";

      title: string;

      message?: string;

      image?: string;

      spaceIds: string[];

      source?: string;

      onSpaceSelected: EncounterEffect[];

      onComplete?: EncounterEffect[];

      resume?:
        | {
            type:
              "mystery-nearest-clue";

            mysteryId: string;

            clueTokenId: string;

            sourceSpaceId: string;

            remainingClues: {
              clueTokenId: string;
              sourceSpaceId: string;
            }[];
          }
        | {
            type:
              "mystery-deep-ones-attack";

            mysteryId: string;

            investigatorIds: string[];

            currentInvestigatorIndex: number;
          };
    }

  | {
      type: "select-investigator";

      title: string;

      message?: string;

      image?: string;

      investigatorIds: string[];

      source?: string;

      resume?:
        | {
            type: "defeat-lead";

            phase:
              | "action"
              | "mythos";
          };
    }

  | {
      type: "select-card";

      title: string;

      message?: string;

      image?: string;

      cardIds: string[];

      selectableCardIds: string[];

      minSelections: number;

      maxSelections: number;

      selectedCardIds?: string[];

      onComplete?: EncounterEffect[];

      source?: string;

      investigatorId?: string;

      resume?:
        | MonsterReckoningResume
        | DarkPowerResume
        | ArrestsMadeResume
        | PatrollingTheBorderResume
        | EyesEverywhereResume;
    }

  | {
      type: "reveal-encounter";

      title: string;

      message?: string;

      image?: string;

      source?: string;
    }

  | {
      type: "combat";

      title: string;

      message?: string;

      image?: string;

      monsterId: string;

      stage?:
        | "start"
        | "horror"
        | "strength"
        | "resolved";

      onDefeat?: EncounterEffect[];

      onNotDefeated?: EncounterEffect[];

      source?: string;

      resume?:
        | MonsterReckoningResume
        | DarkPowerResume
        | ArrestsMadeResume
        | PatrollingTheBorderResume
        | EyesEverywhereResume;
    }

  | {
      type: "investigator-turn";

      title: string;

      message: string;

      investigatorId: string;

      investigatorName: string;

      phase: "action" | "encounter";

      source?: string;

      image?: string;
    }

  | {
      type: "select-monster";

      title: string;

      message?: string;

      image?: string;

      monsterIds: string[];

      source?: string;
      
      investigatorId?: string;

      onMonsterSelected: EncounterEffect[];

      onComplete?: EncounterEffect[];
    }

  | {
      type: "mythos-omen";

      title: string;

      message?: string;

      currentPosition: number;

      targetPosition: number;

      steps: number;

      nextIconIndex: number;

      source?: string;
    }

  | {
      type: "mythos-ancient-one-awakening";

      title: string;

      message?: string;

      ancientOneId: string;

      resume: AncientOneAwakeningResume;

      source: "mythos:ancient-one-awakening";
    }

  | {
      type: "encounter-awakening-resume";

      title: string;

      message?: string;

      investigatorId: string;

      effects: EncounterEffect[];

      source: "encounter:awakening-resume";
    }

  | {
      type: "monster-ability";

      title: string;

      message?: string;

      image?: string;

      monsterId: string;

      ability: MonsterSpecialAbility;

      source?: string;

      resume?:
        | MonsterReckoningResume
        | DarkPowerResume
        | ArrestsMadeResume
        | PatrollingTheBorderResume
        | EyesEverywhereResume;
    }
  | {
      type: "mythos-reckoning-monsters";

      title: string;

      message?: string;

      monsterIds: string[];

      resolvedMonsterIds: string[];

      source: "mythos:reckoning-monsters";

      nextIconIndex: number;

      remainingPasses?: number;
    }
  | {
      type: "combat-order";

      title: string;

      message?: string;

      monsterIds: string[];

      orderedMonsterIds: string[];

      source: "combat-order";

      resume?:
        | MonsterReckoningResume
        | DarkPowerResume;
    }
  | {
      type: "mythos-ancient-one-reckoning";
      
      title: string;

      message?: string;

      ancientOneId: string;

      reckoningStage:
        | "front"
        | "awakened";

      abilityIndex: number;

      source: "mythos:ancient-one-reckoning";

      nextIconIndex: number;
    }
  | {
      type: "mythos-monster-reckoning-resume";

      title: string;

      message?: string;

      monsterId: string;

      monsterIds: string[];

      resolvedMonsterIds: string[];

      nextIconIndex: number;

      source: "mythos:monster-reckoning-resume";
    }
  | {
      type: "mythos-card-reckoning";

      title: string;

      message?: string;

      mythosIds: string[];

      resolvedMythosIds: string[];

      source: "mythos:card-reckoning";

      nextIconIndex: number;

      remainingPasses?: number;
    }
  | {
      type: "mythos-yog-sothoth-spell";

      title: string;

      message?: string;

      investigatorId: string;

      spellIds: string[];

      nextInvestigatorIndex: number;

      investigatorIds: string[];

      nextIconIndex: number;

      source: "mythos:yog-sothoth-spell";

      ancientOneAbilityIndex?: number;

      ancientOneId?: string;

      ancientOneReckoningStage?:
        | "front"
        | "awakened";
    }
  | {
      type: "mythos-yog-sothoth-reckoning-resume";

      title: string;

      message?: string;

      investigatorIds: string[];

      nextInvestigatorIndex: number;

      nextIconIndex: number;

      ancientOneAbilityIndex: number;

      ancientOneId: string;

      ancientOneReckoningStage:
        | "front"
        | "awakened";

      source:
        "mythos:yog-sothoth-reckoning-resume";
    }
  | {
      type: "mythos-condition-reckoning";

      title: string;

      message?: string;

      investigatorIds: string[];

      currentInvestigatorIndex: number;

      conditionIds: string[][];

      currentConditionIndex: number;

      source: "mythos:condition-reckoning";

      nextIconIndex: number;

      treatDiceAsOne?: boolean;
    };

export type DarkPowerResume = {
  type: "mythos-dark-power";

  investigatorIds: string[];

  currentInvestigatorIndex: number;

  monsterIds: string[];

  resolvedMonsterIds: string[];
};

export interface PendingChoiceOption {
  id: string;

  title: string;

  description?: string;

  image?: string;

  requirement?: {
    type:
      | "clues"
      | "resources"
      | "items"
      | "health";

    amount: number;

    onSelect?: EncounterEffect[];
  };
}