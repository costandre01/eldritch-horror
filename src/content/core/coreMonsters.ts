import type { MonsterDefinition } from "../../game/models/Monster";

export const CORE_MONSTERS: MonsterDefinition[] = [
    {
        id: "byakhee",

        name: "Byakhee",

        epic: false,

        frontImage:
        "/cards/Monsters/Monster/Byakhee/Byakhee.jpg",

        backImage:
        "/cards/Monsters/Monster/Byakhee/Byakhee-back.jpg",

        horrorTest: {
        skill: "will",
        modifier: 0,
        damage: 1,
        },

        combatTest: {
        skill: "strength",
        modifier: 0,
        damage: 2,
        },

        toughness: {
        type: "fixed",
        value: 2,
        },

        /*
        * If you defeat this Monster during a Combat Encounter,
        * you may lose 1 Sanity and move 3 spaces instead of
        * resolving another encounter.
        */
        specialAbilities: [
        {
            type: "defeat-move-instead-of-encounter",
        },
        ],

        quantity: 1,
    },

    {
        id: "colour-out-of-space",

        name: "Colour Out of Space",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Colour-Out-of-Space/Color-Out-of-Space.jpg",

        backImage:
            "/cards/Monsters/Monster/Colour-Out-of-Space/Color-Out-of-Space-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 2,
        },

        combatTest: null,

        toughness: {
            type: "fixed",
            value: 2,
        },

        /*
        * When this Monster is spawned, move it to Tunguska.
        *
        * After resolving the Will test, roll 1 die.
        * On a 5 or 6, defeat this Monster.
        */
        specialAbilities: [
            {
            type: "spawn-move-to-space",
            spaceId: "tunguska",
            },
            {
            type: "after-will-roll-die-defeat-on-5-6",
            },
        ],

        quantity: 1,
    },

    {
        id: "cthonian",

        name: "Cthonian",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Cthonian/Cthonian.jpg",

        backImage:
            "/cards/Monsters/Monster/Cthonian/Cthonian-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: -1,
            damage: 2,
        },

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 3,
        },

        toughness: {
            type: "fixed",
            value: 4,
        },

        /*
        * When this Monster is spawned, move it to
        * The Heart of Africa.
        */
        specialAbilities: [
            {
            type: "spawn-move-to-space",
            spaceId: "heart-of-africa",
            },
        ],

        quantity: 1,
    },

    {
        id: "cultist",

        name: "Cultist",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Cultist/Cultist.jpg",

        backImage:
            "/cards/Monsters/Monster/Cultist/Cultist-back.jpg",

        /*
        * Cultist statistics are NOT defined on the
        * Monster token itself.
        *
        * They depend on the Ancient One currently in play.
        *
        * The Ancient One sheet defines:
        * - Horror Test
        * - Horror damage
        * - Combat Test
        * - Combat damage
        * - Toughness
        * - Special / Reckoning abilities
        */

        horrorTest: null,

        combatTest: null,

        toughness: {
            type: "ancient-one",
        },

        /*
        * Cultist rules are resolved from the
        * active Ancient One sheet.
        */
        specialAbilities: [
            {
                type: "use-ancient-one-cultist",
            },
        ],

        /*
        * Core Set contains 5 Cultist tokens.
        *
        * Expansion Cultists are added separately when
        * their respective expansions are enabled.
        */
        quantity: 5,
    },

    {
        id: "dark-young",

        name: "Dark Young",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Dark-Young/Dark-Young.jpg",

        backImage:
            "/cards/Monsters/Monster/Dark-Young/Dark-Young-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: -1,
            damage: 3,
        },

        combatTest: {
            skill: "strength",
            modifier: -3,
            damage: 3,
        },

        toughness: {
            type: "fixed",
            value: 5,
        },

        /*
        * RECKONING:
        * Roll 1 die. On a 1 or 2, advance Doom by 1.
        */
        specialAbilities: [
            {
            type: "roll-die-advance-doom",
            },
        ],

        quantity: 1,
    },

    {
        id: "deep-one",

        name: "Deep One",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Deep-One/Deep-One.jpg",

        backImage:
            "/cards/Monsters/Monster/Deep-One/Deep-One-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 2,
        },

        combatTest: {
            skill: "strength",
            modifier: -1,
            damage: 1,
        },

        toughness: {
            type: "fixed",
            value: 2,
        },

        /*
        * RECKONING:
        * Each investigator on this space loses 1 Sanity.
        */
        specialAbilities: [
            {
            type: "each-investigator-on-space-lose-sanity",
            amount: 1,
            },
        ],

        quantity: 1,
    },

    {
        id: "elder-thing",

        name: "Elder Thing",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Elder-Thing/Elder-Thing.jpg",

        backImage:
            "/cards/Monsters/Monster/Elder-Thing/Elder-Thing-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 3,
        },

        combatTest: {
            skill: "strength",
            modifier: -1,
            damage: 2,
        },

        toughness: {
            type: "fixed",
            value: 3,
        },

        /*
        * When this Monster is spawned, move it to Antarctica.
        */
        specialAbilities: [
            {
            type: "spawn-move-to-space",
            spaceId: "antarctica",
            },
        ],

        quantity: 1,
    },

    {
        id: "ghost",

        name: "Ghost",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Ghost/Ghost.jpg",

        backImage:
            "/cards/Monsters/Monster/Ghost/Ghost-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: -1,
            damage: 2,
        },

        combatTest: null,

        toughness: {
            type: "fixed",
            value: 2,
        },

        /*
        * If you pass the Will test, this Monster loses
        * Health equal to the test result.
        */
        specialAbilities: [
            {
                type:
                    "pass-will-damage-monster-by-test-result",
            },
        ],

        quantity: 1,
    },

    {
        id: "ghoul",

        name: "Ghoul",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Ghoul/Ghoul.jpg",

        backImage:
            "/cards/Monsters/Monster/Ghoul/Ghoul-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 1,
            damage: 1,
        },

        combatTest: {
            skill: "strength",
            modifier: 0,
            damage: 2,
        },

        toughness: {
            type: "fixed",
            value: 1,
        },

        /*
        * If you lose Health from the Strength test,
        * gain a Paranoia Condition.
        */
        specialAbilities: [
            {
            type: "lose-health-from-strength",
            effects: [
                {
                type: "gain-condition",
                conditionDefinitionId:
                    "condition-paranoia",
                },
            ],
            },
        ],

        /*
        * Core Set contains 2 Ghoul Monsters.
        */
        quantity: 2,
    },

    {
        id: "gnoph-keh",

        name: "Gnoph-Keh",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Gnoph-Keh/Gnoph-Keh.jpg",

        backImage:
            "/cards/Monsters/Monster/Gnoph-Keh/Gnoph-Keh-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 1,
        },

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 2,
        },

        toughness: {
            type: "fixed",
            value: 3,
        },

        /*
        * When this Monster is spawned, move it to
        * The Himalayas.
        *
        * RECKONING:
        * Each investigator on this space loses 1 Health.
        */
        specialAbilities: [
            {
                type: "spawn-move-to-space",
                spaceId: "the-himalayas",
            },
            {
                type: "each-investigator-on-space-lose-health",
                amount: 1,
            },
        ],

        /*
        * Core Set contains 1 Gnoph-Keh Monster.
        */
        quantity: 1,
    },

    {
        id: "goat-spawn",

        name: "Goat Spawn",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Goat-Spawn/Goat-Spawn.jpg",

        backImage:
            "/cards/Monsters/Monster/Goat-Spawn/Goat-Spawn-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 1,
        },

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 2,
        },

        toughness: {
            type: "fixed",
            value: 2,
        },

        /*
        * If you defeat this Monster during a Combat Encounter,
        * you may gain a Dark Pact Condition to discard
        * 1 Monster from any space.
        */
        specialAbilities: [
            {
                type: "defeat-gain-condition",
                conditionDefinitionId:
                    "condition-dark-pact",
            },
        ],

        quantity: 2,
    },

    {
        id: "gug",

        name: "Gug",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Gug/Gug.jpg",

        backImage:
            "/cards/Monsters/Monster/Gug/Gug-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 2,
        },

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 3,
        },

        toughness: {
            type: "fixed",
            value: 4,
        },

        /*
        * If you defeat this Monster during a Combat Encounter,
        * you do not resolve an additional encounter.
        */
        specialAbilities: [
            {
                type: "defeat-no-additional-encounter",
            },
        ],

        quantity: 1,
    },

    {
        id: "hound-of-tindalos",

        name: "Hound of Tindalos",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Hound-of-Tindalos/Hound-of-Tindalos.jpg",

        backImage:
            "/cards/Monsters/Monster/Hound-of-Tindalos/Hound-of-Tindalos-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 2,
        },

        combatTest: {
            skill: "strength",
            modifier: -1,
            damage: 3,
        },

        toughness: {
            type: "fixed",
            value: 3,
        },

        /*
        * RECKONING:
        * Move this Monster to the nearest space containing
        * an investigator.
        *
        * Then an investigator on that space immediately
        * encounters it.
        */
        specialAbilities: [
            {
                type: "move-to-nearest-investigator-and-encounter",
            },
        ],

        quantity: 1,
    },

    {
        id: "lloigor",

        name: "Lloigor",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Lloigor/Lloigor.jpg",

        backImage:
            "/cards/Monsters/Monster/Lloigor/Lloigor-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 2,
        },

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 3,
        },

        toughness: {
            type: "fixed",
            value: 4,
        },

        /*
        * RECKONING:
        * Each investigator on this space or an adjacent
        * space loses 1 Health and 1 Sanity.
        */
        specialAbilities: [
            {
                type: "adjacent-investigators-lose-health-and-sanity",
                health: 1,
                sanity: 1,
            },
        ],

        quantity: 1,
    },

    {
        id: "maniac",

        name: "Maniac",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Maniac/Maniac.jpg",

        backImage:
            "/cards/Monsters/Monster/Maniac/Maniac-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 1,
            damage: 1,
        },

        combatTest: {
            skill: "strength",
            modifier: -1,
            damage: 2,
        },

        toughness: {
            type: "fixed",
            value: 1,
        },

        /*
        * If you fail the Strength test, you may discard
        * 1 Ally Asset instead of losing Health.
        *
        * If you defeat this Monster during a Combat Encounter,
        * gain 1 Axe Asset.
        */
        specialAbilities: [
            {
                type: "fail-strength-discard-ally-instead-of-health",
            },
            {
                type: "defeat-gain-asset",
                assetDefinitionId: "axe",
            },
        ],

        quantity: 1,
    },

    {
        id: "mi-go",

        name: "Mi-Go",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Mi-go/Mi-go.jpg",

        backImage:
            "/cards/Monsters/Monster/Mi-go/Mi-go-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 1,
        },

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 2,
        },

        toughness: {
            type: "fixed",
            value: 3,
        },

        /*
        * RECKONING:
        * Discard the nearest Clue and move this Monster
        * to that space.
        *
        * If you defeat this Monster during a Combat Encounter,
        * gain 1 Artifact.
        */
        specialAbilities: [
            {
                type: "discard-nearest-clue-and-move-to-space",
            },
            {
                type: "defeat-gain-artifact",
            },
        ],

        /*
        * Core Set contains 1 Mi-Go Monsters.
        */
        quantity: 1,
    },

    {
        id: "mummy",

        name: "Mummy",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Mummy/Mummy.jpg",

        backImage:
            "/cards/Monsters/Monster/Mummy/Mummy-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 2,
        },

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 2,
        },

        toughness: {
            type: "fixed",
            value: 3,
        },

        /*
        * When this Monster is spawned, move it to The Pyramids.
        */
        specialAbilities: [
            {
                type: "spawn-move-to-space",
                spaceId: "the-pyramids",
            },
        ],

        /*
        * Core Set contains 1 Mummy Monster.
        */
        quantity: 1,
    },

    {
        id: "nightgaunt",

        name: "Nightgaunt",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Nightgaunt/Nightgaunt.jpg",

        backImage:
            "/cards/Monsters/Monster/Nightgaunt/Nightgaunt-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 2,
        },

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 1,
        },

        toughness: {
            type: "fixed",
            value: 2,
        },

        /*
        * RECKONING:
        *
        * If there is an investigator on this space,
        * move him and this Monster 1 space and he
        * becomes Delayed.
        *
        * Otherwise, move this Monster 2 spaces
        * toward the nearest investigator.
        */
        specialAbilities: [
            {
                type: "move-investigator-and-delay-or-move-toward-nearest",
            },
        ],

        /*
        * Core Set contains 1 Nightgaunt Monster.
        */
        quantity: 1,
    },

    {
        id: "riot",

        name: "Riot",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Riot/Riot.jpg",

        backImage:
            "/cards/Monsters/Monster/Riot/Riot-back.jpg",

        /*
        * This Monster has no Horror Test.
        */
        horrorTest: null,

        combatTest: {
            skill: "strength",
            modifier: -3,
            damage: 3,
        },

        toughness: {
            type: "fixed",
            value: 3,
        },

        /*
        * Before resolving the Strength test, you may
        * attempt to disperse the mob (Influence -1).
        *
        * If you pass, defeat this Monster.
        */
        specialAbilities: [
            {
                type: "attempt-disperse-mob-before-combat",
                skill: "influence",
                modifier: -1,
            },
        ],

        /*
        * Core Set contains 1 Riot Monster.
        */
        quantity: 1,
    },

    {
        id: "serpent-people",

        name: "Serpent People",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Serpent-People/Serpent-People.jpg",

        backImage:
            "/cards/Monsters/Monster/Serpent-People/Serpent-People-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 2,
        },

        combatTest: {
            skill: "strength",
            modifier: -1,
            damage: 3,
        },

        toughness: {
            type: "fixed",
            value: 2,
        },

        /*
        * When this Monster is spawned, move it to The Amazon.
        *
        * RECKONING:
        * Roll 1 die. On a 1 or 2, the nearest investigator
        * moves 1 space toward this Monster.
        */
        specialAbilities: [
            {
                type: "spawn-move-to-space",
                spaceId: "amazon",
            },
            {
                type: "roll-die-nearest-investigator-moves-toward",
            },
        ],

        /*
        * Core Set contains 1 Serpent People Monster.
        */
        quantity: 1,
    },

    {
        id: "shoggoth",

        name: "Shoggoth",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Shoggoth/Shoggoth.jpg",

        backImage:
            "/cards/Monsters/Monster/Shoggoth/Shoggoth-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 3,
        },

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 2,
        },

        toughness: {
            type: "fixed",
            value: 4,
        },

        /*
        * RECKONING:
        * This Monster recovers all Health.
        */
        specialAbilities: [
            {
                type: "recover-all-health",
            },
        ],

        /*
        * Core Set contains 1 Shoggoth Monster.
        */
        quantity: 1,
    },

    {
        id: "skeleton",

        name: "Skeleton",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Skeleton/Skeleton.jpg",

        backImage:
            "/cards/Monsters/Monster/Skeleton/Skeleton-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 2,
        },

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 1,
        },

        toughness: {
            type: "fixed",
            value: 2,
        },

        /*
        * If you defeat this Monster during a Combat Encounter,
        * recover 1 Sanity.
        */
        specialAbilities: [
            {
                type: "defeat-recover-sanity",
                amount: 1,
            },
        ],

        /*
        * Core Set contains 1 Skeleton Monster.
        */
        quantity: 1,
    },

    {
        id: "star-spawn",

        name: "Star Spawn",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Star-Spawn/Star-Spawn.jpg",

        backImage:
            "/cards/Monsters/Monster/Star-Spawn/Star-Spawn-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: -1,
            damage: 3,
        },

        combatTest: {
            skill: "strength",
            modifier: -3,
            damage: 3,
        },

        toughness: {
            type: "fixed",
            value: 5,
        },

        /*
        * RECKONING:
        * Roll 1 die. On a 1 or 2,
        * advance Doom by 1.
        */
        specialAbilities: [
            {
                type: "roll-die-advance-doom",
            },
        ],

        /*
        * Core Set contains 1 Star Spawn Monster.
        */
        quantity: 1,
    },

    {
        id: "vampire",

        name: "Vampire",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Vampire/Vampire.jpg",

        backImage:
            "/cards/Monsters/Monster/Vampire/Vampire-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: -1,
            damage: 1,
        },

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 2,
        },

        toughness: {
            type: "fixed",
            value: 3,
        },

        /*
        * If you fail the Will test, do not resolve
        * the Strength test.
        *
        * If you lose Health from the Strength test
        * and this Monster is not defeated, it recovers
        * 2 Health.
        */
        specialAbilities: [
            {
                type: "if-fail-will-skip-strength",
            },
            {
                type: "lose-health-from-strength-recover-health",
                amount: 2,
            },
        ],

        /*
        * Core Set contains 1 Vampire Monster.
        */
        quantity: 1,
    },

    {
        id: "warlock",

        name: "Warlock",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Warlock/Warlock.jpg",

        backImage:
            "/cards/Monsters/Monster/Warlock/Warlock-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 1,
        },

        combatTest: {
            skill: "strength",
            modifier: -1,
            damage: 1,
        },

        toughness: {
            type: "fixed",
            value: 1,
        },

        /*
        * If you fail the Will test, lose 1 Health.
        *
        * RECKONING:
        * Roll 1 die. On a 1 or 2, the nearest investigator
        * gains a Cursed Condition.
        */
        specialAbilities: [
            {
                type: "fail-will-lose-health",
                amount: 1,
            },
            {
                type: "roll-die-nearest-investigator-gains-condition",
                conditionDefinitionId: "condition-cursed",
            },
        ],

        /*
        * Core Set contains 1 Warlock Monster.
        */
        quantity: 1,
    },

    {
        id: "witch",

        name: "Witch",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Witch/Witch.jpg",

        backImage:
            "/cards/Monsters/Monster/Witch/Witch-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: -1,
            damage: 0,
        },

        combatTest: {
            skill: "strength",
            modifier: -1,
            damage: 1,
        },

        toughness: {
            type: "fixed",
            value: 1,
        },

        /*
        * If you fail the Will test, gain a Cursed Condition.
        *
        * RECKONING:
        * Each investigator who has a Cursed Condition
        * loses 1 Health.
        */
        specialAbilities: [
            {
                type: "fail-will-gain-condition",
                conditionDefinitionId: "condition-cursed",
            },
            {
                type: "cursed-investigators-lose-health",
                amount: 1,
            },
        ],

        /*
        * Core Set contains 1 Witch Monster.
        */
        quantity: 1,
    },

    {
        id: "wraith",

        name: "Wraith",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Wraith/Wraith.jpg",

        backImage:
            "/cards/Monsters/Monster/Wraith/Wraith-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: -1,
            damage: 2,
        },

        combatTest: {
            skill: "strength",
            modifier: -1,
            damage: 2,
        },

        toughness: {
            type: "fixed",
            value: 3,
        },

        /*
        * When this Monster is spawned, the Lead Investigator
        * gains a Cursed Condition.
        *
        * When this Monster is defeated, an investigator may
        * discard a Cursed Condition.
        */
        specialAbilities: [
            {
                type: "spawn-lead-investigator-gains-condition",
                conditionDefinitionId: "condition-cursed",
            },
            {
                type: "defeat-investigator-discard-condition",
                conditionDefinitionId: "condition-cursed",
            },
        ],

        /*
        * Core Set contains 1 Wraith Monster.
        */
        quantity: 1,
    },

    {
        id: "zombie",

        name: "Zombie",

        epic: false,

        frontImage:
            "/cards/Monsters/Monster/Zombie/Zombie.jpg",

        backImage:
            "/cards/Monsters/Monster/Zombie/Zombie-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 1,
        },

        combatTest: {
            skill: "strength",
            modifier: -1,
            damage: 2,
        },

        toughness: {
            type: "fixed",
            value: 2,
        },

        /*
        * RECKONING:
        * Discard this Monster and spawn the Zombie Horde
        * Epic Monster on this space.
        */
        specialAbilities: [
            {
                type: "discard-and-spawn-epic-monster",
                epicMonsterDefinitionId: "zombie-horde",
            },
        ],

        /*
        * Core Set contains 1 Zombie Monsters.
        */
        quantity: 1,
    },
];