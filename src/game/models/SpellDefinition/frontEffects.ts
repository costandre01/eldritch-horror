export type SpellFrontEffect =
  /*
   * ============================================================
   * ACTION / TEST
   * ============================================================
   */

  | {
      type: "action-test";

      testType:
        | "strength"
        | "influence"
        | "will"
        | "lore"
        | "observation";

      modifier?: number;

      onSuccess: SpellFrontTriggeredEffect[];
    }

  /*
   * ============================================================
   * ENCOUNTER PHASE
   * ============================================================
   */

  | {
      type: "on-encounter-phase";

      testType:
        | "strength"
        | "influence"
        | "will"
        | "lore"
        | "observation";

      modifier?: number;

      onSuccess: SpellFrontTriggeredEffect[];
    }

  /*
   * ============================================================
   * COMBAT ENCOUNTER
   * ============================================================
   */

  | {
      type: "on-combat-encounter";

      testType:
        | "strength"
        | "influence"
        | "will"
        | "lore"
        | "observation";

      modifier?: number;

      onSuccess: SpellFrontTriggeredEffect[];
    }

  /*
   * ============================================================
   * HEALTH / SANITY LOSS
   * ============================================================
   */

  | {
      type: "on-health-loss";

      oncePerRound?: boolean;

      testType:
        | "strength"
        | "influence"
        | "will"
        | "lore"
        | "observation";

      modifier?: number;

      onSuccess: SpellFrontTriggeredEffect[];
    }

  | {
      type: "on-sanity-loss";

      oncePerRound?: boolean;

      testType:
        | "strength"
        | "influence"
        | "will"
        | "lore"
        | "observation";

      modifier?: number;

      onSuccess: SpellFrontTriggeredEffect[];
    };

/*
 * ============================================================
 * TRIGGERED EFFECTS
 * ============================================================
 */

export type SpellFrontTriggeredEffect =
  /*
   * ============================================================
   * CARD CONTROL
   * ============================================================
   */

  | {
      type: "flip-self";
    }

  /*
   * ============================================================
   * INVESTIGATORS
   * ============================================================
   */

  | {
        type: "choose-investigator";

        location:
            | "same-space"
            | "any-space";

        excludeConditionDefinitionId?: string;

        effects: SpellFrontTriggeredEffect[];
    }

  | {
      type: "improve-skill";

      amount: number;

      target:
        | "caster"
        | "chosen-investigator";
    }

  /*
   * ============================================================
   * CONDITIONS
   * ============================================================
   */

  | {
      type: "gain-condition";

      conditionDefinitionId: string;

      target:
        | "caster"
        | "chosen-investigator";
    }

  /*
   * ============================================================
   * MONSTERS
   * ============================================================
   */

  | {
      type: "choose-monster";

      location: "same-space";

      effects: SpellFrontTriggeredEffect[];
    }

  | {
      type: "lose-monster-health";

      amount: number;

      target: "chosen-monster";
    }

  /*
   * ============================================================
   * CLUES / ENCOUNTERS
   * ============================================================
   */

  | {
      type: "choose-clue";

      encounterAsIfOnSpace: true;

      ignoreMonsters: true;
    }

  | {
      type: "choose-encounter";

      ignoreMonsters: true;
    }

  /*
   * ============================================================
   * ASSETS
   * ============================================================
   */

  | {
      type: "choose-asset";

      from: "reserve";

      assetTypes: ("item" | "trinket")[];

      maxValueFromTestResult?: true;

      target: "caster";

      optional?: boolean;
    }

  /*
   * ============================================================
   * MOVEMENT
   * ============================================================
   */

  | {
      type: "move-to-any-space";

      target:
        | "caster"
        | "chosen-investigator";
    }

  /*
   * ============================================================
   * DAMAGE PREVENTION
   * ============================================================
   */

  | {
      type: "prevent-health-loss";

      amount: number;

      target:
        | "chosen-investigator"
        | "triggering-investigator";
    }

  | {
      type: "prevent-sanity-loss";

      amount: number;

      target:
        | "chosen-investigator"
        | "triggering-investigator";
    }

  /*
   * ============================================================
   * COMBAT
   * ============================================================
   */

  | {
      type: "modify-strength";

      amount: number;

      target: "caster";

      duration: "this-combat-encounter";
    }

  | {
      type: "gain-additional-action";

      amount: number;

      target: "caster";
    }

  | {
      type: "allow-reroll";

      amount: number;

      testType:
        | "strength"
        | "influence"
        | "will"
        | "lore"
        | "observation";

      duration:
        | "this-test"
        | "this-combat-encounter";
    };