export type ConditionFrontEffect =
  /*
   * ============================================================
   * REST
   * ============================================================
   */

  | {
      type: "on-rest";

      optional?: boolean;

      dice: number;

      successMinimum?: number;

      successResults?: number[];

      effects: ConditionFrontTriggeredEffect[];

      otherwise?: {
        type: "test";

        testType:
          | "strength"
          | "influence"
          | "will"
          | "lore"
          | "observation";

        onFail: ConditionFrontTriggeredEffect[];
      };
    }

  /*
   * ============================================================
   * TESTS
   * ============================================================
   */

  | {
      type: "on-test-fail";

      testType?:
        | "strength"
        | "influence"
        | "will"
        | "lore"
        | "observation";

      effects: ConditionFrontTriggeredEffect[];
    }

  | {
      type: "on-will";

      dice?: number;

      successResults?: number[];

      effects: ConditionFrontTriggeredEffect[];
    }

  /*
   * ============================================================
   * DAMAGE / SANITY
   * ============================================================
   */

  | {
      type: "on-damage";

      effects: ConditionFrontTriggeredEffect[];
    }

  | {
      type: "on-sanity-loss";

      effects: ConditionFrontTriggeredEffect[];
    }

  /*
   * ============================================================
   * CONDITION GAIN
   * ============================================================
   */

  | {
      type: "on-gain-condition";

      conditionDefinitionId: string;

      effects: ConditionFrontTriggeredEffect[];
    }

  | {
      type: "replace-gain-condition";

      conditionDefinitionId: string;

      effects: ConditionFrontTriggeredEffect[];
    }

  /*
   * ============================================================
   * DEAL
   * ============================================================
   */

  | {
      type: "on-deal";

      dice: number;

      successResults: number[];

      effects: ConditionFrontTriggeredEffect[];
    }

  /*
   * ============================================================
   * LOCAL ACTION
   * ============================================================
   */

  | {
      type: "on-local-action-test";

      action: string;

      testType:
        | "strength"
        | "influence"
        | "will"
        | "lore"
        | "observation";

      effects: ConditionFrontTriggeredEffect[];
    }

  | {
      type: "local-action-test";

      testType:
        | "strength"
        | "influence"
        | "will"
        | "lore"
        | "observation";

      modifier?: number;

      onSuccess: ConditionFrontTriggeredEffect[];
    }

    /*
    * ============================================================
    * ENCOUNTER
    * ============================================================
    */

    | {
        type: "on-encounter";

        /*
        * If true, the normal Encounter is prevented.
        *
        * Example:
        * "Instead of resolving an encounter, flip this card."
        */

        preventsEncounter?: boolean;

        dice?: number;

        successResults?: number[];

        testType?:
          | "strength"
          | "influence"
          | "will"
          | "lore"
          | "observation";

        effects?: ConditionFrontTriggeredEffect[];

        onFail?: ConditionFrontTriggeredEffect[];
      }

    /*
    * ============================================================
    * RECKONING
    * ============================================================
    */

    | {
        type: "on-reckoning";

        dice?: number;

        successResults?: number[];

        testType?:
          | "strength"
          | "influence"
          | "will"
          | "lore"
          | "observation";

        modifier?: number;

        effects?: ConditionFrontTriggeredEffect[];

        onFail?: ConditionFrontTriggeredEffect[];
      }

    /*
    * ============================================================
    * TEST SUCCESS MODIFIERS
    * ============================================================
    */

    | {
        type: "modify-test-successes";

        successfulResults: number[];
      };

/*
 * ============================================================
 * TRIGGERED EFFECTS
 * ============================================================
 */

export type ConditionFrontTriggeredEffect =
  | {
      type: "gain-condition";

      conditionDefinitionId: string;
    }

  | {
      type: "lose-health";

      amount: number;
    }

  | {
      type: "lose-sanity";

      amount: number;
    }

  | {
      type: "become-delayed";
    }

  | {
      type: "discard-self";
    }

  | {
      type: "flip-self";
    };