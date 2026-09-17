export type EncounterType =
  | "city"
  | "wilderness"
  | "sea";

export type EncounterRegion =
  | "america"
  | "europe"
  | "asia-australia"
  | "general"
  | "research";

export interface EncounterEffect {
  type:
    | "gain-health"
    | "gain-sanity"
    | "lose-health"
    | "lose-sanity"
    | "gain-clues"
    | "gain-clue"
    | "lose-clues"
    | "gain-resources"
    | "lose-resources"
    | "gain-condition"
    | "discard-condition"
    | "gain-artifact"
    | "gain-spell"

    // ==========================================================
    // ITEM ASSETS
    // ==========================================================

    | "gain-item"
    | "gain-items"
    | "gain-item-from-reserve"
    | "gain-random-item"
    | "gain-service-from-reserve"

    | "gain-weapon"
    | "gain-ally"
    | "gain-service"
    | "discard-item"
    | "discard-monster"
    | "lose-monster-health"
    | "move"
    | "move-monster"
    | "move-monster-to-space"
    | "spawn-monster"
    | "devoured"
    | "spawn-gate"
    | "advance-doom"
    | "place-eldritch-token"
    | "improve-skill"
    | "close-gate"
    | "become-delayed"
    | "test"
    | "choice"
    | "select-space"
    | "spawn-clues"
    | "move-omen"
    | "discard-eldritch-token-from-omen"
    | "place-eldritch-token-on-omen"
    | "return-random-solved-mystery-to-deck"
    | "advance-omen"
    | "move-clue"
    | "combat"
    | "select-monster"
    | "discard-selected-monster"
    | "lose-selected-monster-health"
    | "move-selected-monster"
    | "select-monster-destination"
    | "combat-random-monster"
    | "spawn-dark-young-or-random-monster"
    | "move-to-nearest-space"
    | "discard-ally"
    | "discard-spell"
    | "conditional"
    | "move-monster-to-investigator"
    | "combat-existing-monster"
    | "select-gate"
    | "retreat-doom"
    | "start-other-world-encounter"
    | "solve-mythos-rumor"
    | "roll-single-die";

  amount?: number;

  conditionDefinitionId?: string;

  conditionDefinitionIds?: string[];

  spellDefinitionIds?: string[];

  artifactType?: string;

  artifactId?: string;

  itemType?: string;

  location?: string;

  target?: string;

  spaceId?: string;

  choices?: EncounterChoice[];

  afterChoice?: EncounterEffect[];

  spaceIds?: string[];

  onSpaceSelected?: EncounterEffect[];

  monsterDefinitionId?: string;

  onDefeat?: EncounterEffect[];

  onNotDefeated?: EncounterEffect[];

  fromSpaceId?: string;

  monsterIds?: string[];

  onMonsterSelected?: EncounterEffect[];

  gateIds?: string[];
  onGateSelected?: EncounterEffect[];

  minSuccesses?: number;

  condition?: {
    type:
      | "has-spell"
      | "has-condition"
      | "has-monster";

    conditionDefinitionId?: string;

    monsterDefinitionId?: string;
  };

  thenEffects?: EncounterEffect[];

  elseEffects?: EncounterEffect[];

  targetSpaceType?:
    | "sea"
    | "city"
    | "wilderness";

  spellType?:
    | "incantation"
    | "ritual"
    | "spell";

  spellId?: string;

  skillType?:
    | "strength"
    | "influence"
    | "will"
    | "lore"
    | "observation";

  testType?:
    | "strength"
    | "influence"
    | "will"
    | "lore"
    | "observation";

  modifier?: number;

  testText?: string;

  dicePerClue?: number;

  onSuccess?: EncounterEffect[];

  onFail?: EncounterEffect[];

  onOneOrTwo?: EncounterEffect[];

  onThreeToSix?: EncounterEffect[];

  mythosId?: string;
}

export interface EncounterChoice {
  text: string;

  effects: EncounterEffect[];

  requirement?: {
    type:
      | "clues"
      | "resources"
      | "items"
      | "health";

    amount: number;
  };
}

export interface EncounterBack {
  id: string;

  frontImage: string;

  backImage: string;

  effects: EncounterEffect[];
}

export interface EncounterDefinition {
  id: string;

  name: string;

  /*
   * ==========================================================
   * OLD ENCOUNTER FORMAT
   * ==========================================================
   */

  type?: EncounterType;

  region?: EncounterRegion;

  text?: string;

  choices?: EncounterChoice[];

  /*
   * ==========================================================
   * CARD ENCOUNTER FORMAT
   * ==========================================================
   */

  frontImage?: string;

  backImage?: string;

  initialText?: string;

  effects?: EncounterEffect[];

  /*
   * ==========================================================
   * MULTI-BACK ENCOUNTER FORMAT
   * ==========================================================
   */

  backs?: EncounterBack[];
}