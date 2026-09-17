export type SpellBackEffect =
  /*
   * ============================================================
   * TEST RESULT
   * ============================================================
   */

  | {
      type: "resolve-by-test-result";

      results: SpellTestResultBranch[];
    }

  /*
   * ============================================================
   * HEALTH / SANITY
   * ============================================================
   */

  | {
      type: "lose-health";

      amount: number;

      target:
        | "caster"
        | "chosen-investigator";
    }

  | {
      type: "lose-sanity";

      amount: number;

      target:
        | "caster"
        | "chosen-investigator";
    }

  | {
      type: "lose-health-unless-gain-condition";

      amount: number;

      conditionDefinitionId: string;

      target:
        | "caster"
        | "chosen-investigator";
    }

  | {
      type: "lose-sanity-unless-gain-condition";

      amount: number;

      conditionDefinitionId: string;

      target:
        | "caster"
        | "chosen-investigator";
    }

  /*
   * ============================================================
   * DAMAGE / SANITY PREVENTION
   * ============================================================
   */

  | {
      type: "prevent-health-loss";

      amount:
        | number
        | "test-result";

      target:
        | "chosen-investigator"
        | "triggering-investigator";
    }

  | {
      type: "prevent-sanity-loss";

      amount:
        | number
        | "test-result";

      target:
        | "chosen-investigator"
        | "triggering-investigator";
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

  | {
      type: "gain-condition-on-investigators-on-space";

      conditionDefinitionId: string;
    }

  /*
   * ============================================================
   * SKILLS
   * ============================================================
   */

  | {
      type: "improve-skill";

      amount: number;

      target:
        | "caster"
        | "chosen-investigator";
    }

  /*
   * ============================================================
   * ASSETS
   * ============================================================
   */

  | {
        type: "gain-asset";

        from: "reserve";

        assetTypes: ("item" | "trinket")[];

        amount: number;

        target: "caster";
    }

  | {
        type: "gain-assets-by-test-result";

        from: "reserve";

        assetTypes: ("item" | "trinket")[];

        maxTotalValueFromTestResult: true;

        target: "caster";
    }

  | {
      type: "discard-item";

      amount: number;

      target: "caster";
    }

  /*
   * ============================================================
   * CLUES
   * ============================================================
   */

  | {
      type: "gain-clues";

      amount: number;

      target: "caster";
    }

  | {
      type: "discard-chosen-clue";
    }

  /*
   * ============================================================
   * MONSTERS
   * ============================================================
   */

  | {
      type: "lose-monster-health";

      amount:
        | number
        | "test-result";

      target: "chosen-monster";
    }

  | {
      type: "lose-other-monsters-health";

      amount: number;

      location: "same-space";
    }

  /*
   * ============================================================
   * ACTIONS
   * ============================================================
   */

  | {
      type: "gain-additional-action";

      amount: number;

      target: "caster";
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

      replacePreviousModifier?: true;
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
    }

  /*
   * ============================================================
   * RESEARCH ENCOUNTER
   * ============================================================
   */

  | {
      type: "modify-research-encounter-tests";

      additionalDice: number;
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
   * CONDITIONAL DISCARD
   * ============================================================
   */

  | {
      type: "discard-self-unless";

      requirement:
        | {
            type: "lose-sanity";

            amount: number;

            target: "caster";
          }
        | {
            type: "gain-condition";

            conditionDefinitionId: string;

            target:
              | "caster"
              | "chosen-investigator";
          }
        | {
            type: "discard-item";

            amount: number;

            target: "caster";
          }
        | {
            type: "rolled-face";

            value: number;
          };
    };

/*
 * ============================================================
 * TEST RESULT BRANCH
 * ============================================================
 */

export interface SpellTestResultBranch {
  exact?: number;

  min?: number;

  max?: number;

  effects: SpellBackEffect[];
}