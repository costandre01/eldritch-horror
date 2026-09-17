export type MonsterTest = {
    skill: "will" | "strength" | "influence";
    modifier: number;
    damage: number;
};

export type MonsterToughness =
    | {
        type: "fixed";
        value: number;
    }
    | {
        type: "investigators-plus";
        value: number;
    }
    | {
        type: "ancient-one";
    };

export type MonsterSpecialAbility =
    | {
        type: "none";
    }

    /*
     * ============================================================
     * EPIC MONSTERS
     * ============================================================
     */

    | {
        /*
        * If you lose Sanity from the Will test,
        * place the lost Sanity on the Ancient One sheet.
        */
        type: "lose-sanity-to-ancient-one";
    }

    | {
        /*
         * A Deep One Monster ambushes the nearest investigator.
         */
        type: "deep-one-ambush-nearest";
    }

    | {
        /*
         * Roll 1 die. If the result is less than or equal
         * to the number of Investigators, spawn 1 Gate.
         */
        type: "roll-die-spawn-gate-if-at-most-investigators";
    }

    | {
        /*
         * Spawn 1 Ghoul Monster on this space.
         */
        type: "spawn-ghoul-on-space";
    }

    | {
        /*
         * This Epic Monster cannot lose Health unless
         * the required number of Mysteries have been solved.
         */
        type: "cannot-lose-health-until-mysteries-solved";

        mysteriesRequired: number;
    }

    | {
        /*
         * If the investigator fails the Will test,
         * do not resolve the Strength test.
         */
        type: "if-fail-will-skip-strength";
    }

    | {
        /*
         * Clues cannot be spent to reroll dice during
         * this Combat Encounter.
         */
        type: "cannot-spend-clues-to-reroll";
    }

    | {
        /*
         * Before resolving the Will test, lose 1 Health
         * and 1 Sanity unless 1 Clue is spent.
         */
        type: "lose-health-and-sanity-unless-spend-clue";
    }

    | {
        /*
         * If you lose Health from the Strength test,
         * discard 1 Ally Asset.
         */
        type: "lose-health-from-strength-discard-ally";
    }

    | {
        /*
         * Reckoning:
         * Roll 1 die. On a 1 or 2, advance Doom by 1.
         */
        type: "roll-die-advance-doom";
    }

    /*
     * ============================================================
     * NORMAL MONSTERS
     * ============================================================
     */

    | {
        /*
         * If you defeat this Monster during a Combat Encounter,
         * you may lose 1 Sanity and move 3 spaces instead of
         * resolving another encounter.
         */
        type: "defeat-move-instead-of-encounter";
    }

    | {
        /*
         * When this Monster is spawned, move it to a
         * specific space.
         */
        type: "spawn-move-to-space";

        spaceId: string;
    }

    | {
        /*
         * After resolving the Will test, roll 1 die.
         * On a 5 or 6, defeat this Monster.
         */
        type: "after-will-roll-die-defeat-on-5-6";
    }

    | {
        /*
         * If you pass the Will test, this Monster loses
         * Health equal to the test result.
         */
        type: "pass-will-damage-monster-by-test-result";
    }

    | {
        /*
         * If you lose Health from the Strength test,
         * gain the specified Condition.
         */
        type: "lose-health-from-strength-gain-condition";

        conditionDefinitionId: string;
    }

    | {
        /*
         * Gain a Condition.
         */
        type: "gain-condition";

        conditionDefinitionId: string;
    }

    | {
        /*
         * If you defeat this Monster during a Combat Encounter,
         * gain the specified Condition.
         */
        type: "defeat-gain-condition";

        conditionDefinitionId: string;
    }

    | {
        /*
         * Cultist statistics and abilities are determined
         * by the active Ancient One.
         */
        type: "use-ancient-one-cultist";
    }

    | {
        /*
         * If you defeat this Monster during a Combat Encounter,
         * you do not resolve an additional encounter.
         */
        type: "defeat-no-additional-encounter";
    }

    | {
        /*
         * Reckoning:
         * Move this Monster to the nearest space containing
         * an investigator.
         *
         * Then an investigator on that space immediately
         * encounters it.
         */
        type: "move-to-nearest-investigator-and-encounter";
    }

    | {
        /*
         * Reckoning:
         * Each investigator on this space or an adjacent space
         * loses Health and Sanity.
         */
        type: "adjacent-investigators-lose-health-and-sanity";

        health: number;
        sanity: number;
    }

    | {
        /*
        * If you fail the Strength test, you may discard
        * 1 Ally Asset instead of losing Health.
        */
        type: "fail-strength-discard-ally-instead-of-health";
    }
    | {
        /*
        * If you defeat this Monster during a Combat Encounter,
        * gain the specified Asset.
        */
        type: "defeat-gain-asset";

        assetDefinitionId: string;
    }
    | {
        /*
        * RECKONING:
        * Discard the nearest Clue and move this Monster
        * to that space.
        */
        type: "discard-nearest-clue-and-move-to-space";
    }
    | {
        /*
        * If you defeat this Monster during a Combat Encounter,
        * gain 1 Artifact.
        */
        type: "defeat-gain-artifact";
    }
    | {
        /*
        * RECKONING:
        *
        * If an investigator is on this Monster's space,
        * move both 1 space and delay the investigator.
        *
        * Otherwise, move this Monster 2 spaces toward
        * the nearest investigator.
        */
        type: "move-investigator-and-delay-or-move-toward-nearest";
    }
    | {
        /*
        * Before resolving the Strength test, the investigator
        * may attempt to disperse the mob with an Influence -1 test.
        *
        * If the test is passed, defeat this Monster.
        */
        type: "attempt-disperse-mob-before-combat";

        skill: "influence";
        modifier: -1;
    }
    | {
        /*
        * RECKONING:
        * Roll 1 die. On a 1 or 2, the nearest investigator
        * moves 1 space toward this Monster.
        */
        type: "roll-die-nearest-investigator-moves-toward";
    }
    | {
        /*
        * RECKONING:
        * This Monster recovers all Health.
        */
        type: "recover-all-health";
    }
    | {
        /*
        * If you defeat this Monster during a Combat Encounter,
        * recover the specified amount of Sanity.
        */
        type: "defeat-recover-sanity";
        amount: number;
    }
    | {
        /*
        * If the investigator loses Health from the Strength test
        * and this Monster is not defeated, it recovers Health.
        */
        type: "lose-health-from-strength-recover-health";
        amount: number;
    }
    | {
        /*
        * If you fail the Will test, lose Health.
        */
        type: "fail-will-lose-health";
        amount: number;
    }
    | {
        /*
        * RECKONING:
        * Roll 1 die. On a 1 or 2, the nearest investigator
        * gains the specified Condition.
        */
        type: "roll-die-nearest-investigator-gains-condition";
        conditionDefinitionId: string;
    }
    | {
        /*
        * If you fail the Will test, gain a Cursed Condition.
        */
        type: "fail-will-gain-condition";
        conditionDefinitionId: string;
    }
    | {
        /*
        * RECKONING:
        * Each investigator who has a Cursed Condition
        * loses Health.
        */
        type: "cursed-investigators-lose-health";
        amount: number;
    }
    | {
        /*
        * When this Monster is spawned, the Lead Investigator
        * gains the specified Condition.
        */
        type: "spawn-lead-investigator-gains-condition";

        conditionDefinitionId: string;
    }
    | {
        /*
        * When this Monster is defeated, an investigator may
        * discard the specified Condition.
        */
        type: "defeat-investigator-discard-condition";

        conditionDefinitionId: string;
    }
    | {
        /*
        * RECKONING:
        * Discard this Monster and spawn the specified
        * Epic Monster on this space.
        */
        type: "discard-and-spawn-epic-monster";

        epicMonsterDefinitionId: string;
    }
    | {
        /*
        * RECKONING:
        * Each investigator on this space loses 1 Sanity.
        */
        type: "each-investigator-on-space-lose-sanity";
        amount: number;
    }
    | {
        /*
        * If you lose Health from the Strength test,
        * resolve the specified effects.
        */
        type: "lose-health-from-strength";
        effects: {
          type: "gain-condition";
          conditionDefinitionId: string;
        }[];
    }
    | {
        /*
        * RECKONING:
        * Each investigator on this space loses Health.
        */
        type: "each-investigator-on-space-lose-health";
        amount: number;
    };


export interface MonsterDefinition {
    id: string;

    name: string;

    /*
     * Epic Monsters are not placed in the normal
     * Monster Cup.
     */
    epic: boolean;

    /*
     * Images of the physical Monster card.
     */
    frontImage: string;

    backImage: string;

    /*
     * Horror test.
     *
     * null means this Monster has no Horror Test.
     */
    horrorTest: MonsterTest | null;

    /*
     * Combat test.
     *
     * null means this Monster has no normal Combat Test.
     *
     * Examples:
     * - Ghost
     * - Colour Out of Space
     * - Tick-Tock Men
     */
    combatTest: MonsterTest | null;

    /*
     * Toughness can either be fixed,
     * based on the number of Investigators,
     * or determined by the Ancient One.
     */
    toughness: MonsterToughness;

    /*
     * A Monster may have multiple special abilities.
     */
    specialAbilities: MonsterSpecialAbility[];

    /*
     * Number of physical copies in the Monster Cup.
     *
     * Epic Monsters use 0 because they are not
     * placed in the normal Monster Cup.
     */
    quantity: number;
}


export interface Monster {
    /*
     * Unique physical Monster instance ID.
     *
     * Examples:
     *
     * cultist-1
     * cultist-2
     * cultist-3
     */
    id: string;

    /*
     * ID of the MonsterDefinition.
     */
    definitionId: string;

    /*
     * Current Health.
     */
    health: number;

    /*
     * Current map space.
     *
     * null means the Monster is currently in
     * the Monster Cup or otherwise not on the map.
     */
    spaceId: string | null;

    /*
     * Investigator currently engaged with this Monster.
     *
     * null means the Monster is not engaged.
     */
    engagedInvestigatorId: string | null;

    /*
     * Cached information indicating whether
     * this Monster is Epic.
     */
    isEpic: boolean;
}