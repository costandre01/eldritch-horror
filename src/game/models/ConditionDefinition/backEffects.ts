export type ConditionBackEffect =
  /*
   * ============================================================
   * CONDITIONS
   * ============================================================
   */

  | {
      type: "gain-condition";
      conditionDefinitionId: string;
    }

  /*
   * ============================================================
   * HEALTH / SANITY / DELAYED
   * ============================================================
   */

  | {
      type: "lose-health";
      amount: number;
    }

  | {
      type: "lose-sanity";
      amount: number;
    }

  | {
      type: "recover-health";
      amount: number;
    }

  | {
      type: "recover-sanity";
      amount: number;
    }

  | {
      type: "become-delayed";
    }

  /*
   * ============================================================
   * CARD CONTROL
   * ============================================================
   */

  | {
      type: "flip-self";
    }

  | {
      type: "discard-self";
    }

  /*
   * ============================================================
   * ASSETS
   * ============================================================
   */

  | {
      type: "discard-item";
      amount: number;
    }

  | {
      type: "discard-all-but-items";
      keep: number;
    }

  | {
      type: "discard-ally-asset";
    }

  | {
      type: "discard-gained-asset";
    }

  /*
   * ============================================================
   * CLUES
   * ============================================================
   */

  | {
      type: "gain-clues";
      amount: number;
    }

  | {
      type: "discard-all-clues";
    }

  /*
   * ============================================================
   * MONSTERS
   * ============================================================
   */

  | {
      type: "discard-monster";
    }

  | {
      type: "on-monster-ambush";
    }

  | {
      type: "devoured";
    }

  | {
      type: "devour-other-investigator";
    }

  /*
   * ============================================================
   * BOARD / DOOM / OMEN
   * ============================================================
   */

  | {
      type: "spawn-gates-per-spell";
    }

  | {
      type: "advance-omen";
      amount: number;
    }

  | {
      type: "advance-doom";
      amount: number;
    }

  | {
      type: "move-to-nearest-city";
    }

  /*
   * ============================================================
   * LOCATION CONDITIONS
   * ============================================================
   */

  | {
      type: "if-on-sea-space";

      effects: ConditionBackEffect[];

      otherwise: ConditionBackEffect[];
    }

  | {
      type: "lose-sanity-if-on-city";
      amount: number;
    }

  /*
   * ============================================================
   * OTHER INVESTIGATORS
   * ============================================================
   */

  | {
      type: "other-investigators-on-space-lose-health";
      amount: number;
    }

  /*
   * ============================================================
   * TESTS / CHOICES
   * ============================================================
   */

  | {
      type: "spend-clue-or-test";

      amount: number;

      testType:
        | "strength"
        | "influence"
        | "will"
        | "lore"
        | "observation";

      modifier: number;

      onFail: ConditionBackEffect[];
    }

  | {
      type: "fail-choice";

      choice: {
        type: "discard-ally";
        amount: number;
      };

      otherwise: ConditionBackEffect[];
    }

  | {
      type: "choose-gain-condition-or";

      conditionDefinitionId: string;

      otherwise: ConditionBackEffect[];
    }

  /*
   * ============================================================
   * PARANOIA / SPECIAL EFFECTS
   * ============================================================
   */

  | {
      type: "gain-random-item-and-test";

      testType:
        | "strength"
        | "influence"
        | "will"
        | "lore"
        | "observation";

      onFail: ConditionBackEffect[];

      then: ConditionBackEffect[];
    }

  /*
   * ============================================================
   * LEG INJURY
   * ============================================================
   */

  | {
      type: "become-delayed-or-flip";
    }

  | {
      type: "lose-health-unless-delayed";
      amount: number;
    };