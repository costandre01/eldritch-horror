import type { MonsterDefinition } from "../../game/models/Monster";

export const CORE_EPIC_MONSTERS: MonsterDefinition[] = [
    {
        id: "cthulhu",

        name: "Cthulhu",

        epic: true,

        frontImage:
        "/cards/Monsters/Epic-Monster/Cthulhu/Cthulhu.jpg",

        backImage:
        "/cards/Monsters/Epic-Monster/Cthulhu/Cthulhu-back.jpg",

        horrorTest: {
        skill: "will",
        modifier: -2,
        damage: 5,
        },

        combatTest: {
        skill: "strength",
        modifier: -2,
        damage: 4,
        },

        toughness: {
        type: "investigators-plus",
        value: 3,
        },

        specialAbilities: [
            {
                type: "lose-sanity-to-ancient-one",
            },
        ],

        quantity: 0,
    },

    {
        id: "cthylla",

        name: "Cthylla",

        epic: true,

        frontImage:
            "/cards/Monsters/Epic-Monster/Cthylla/Cthylla.jpg",

        backImage:
            "/cards/Monsters/Epic-Monster/Cthylla/Cthylla-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: -1,
            damage: 4,
        },

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 2,
        },

        toughness: {
            type: "investigators-plus",
            value: 2,
        },

        /*
        * RECKONING:
        * A Deep One Monster ambush
        * the nearest investigator.
        */
        specialAbilities: [
            {
                type: "deep-one-ambush-nearest",
            },
        ],

        quantity: 0,
    },

    {
        id: "dunwich-horror",

        name: "Dunwich Horror",

        epic: true,

        frontImage:
            "/cards/Monsters/Epic-Monster/Dunwich-Horror/Dunwich-Horror.jpg",

        backImage:
            "/cards/Monsters/Epic-Monster/Dunwich-Horror/Dunwich-Horror-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: -1,
            damage: 3,
        },

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 3,
        },

        toughness: {
            type: "investigators-plus",
            value: 2,
        },

        /*
        * RECKONING:
        * Roll 1 die. If the result is less than or
        * equal to the number of Investigators, spawn
        * 1 Gate.
        */
        specialAbilities: [
            {
                type: "roll-die-spawn-gate-if-at-most-investigators",
            },
        ],

        quantity: 0,
    },

    {
        id: "nug",

        name: "Nug",

        epic: true,

        frontImage:
            "/cards/Monsters/Epic-Monster/Nug/Nug.jpg",

        backImage:
            "/cards/Monsters/Epic-Monster/Nug/Nug-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: -1,
            damage: 2,
        },

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 4,
        },

        toughness: {
            type: "investigators-plus",
            value: 2,
        },

        /*
        * RECKONING:
        * Spawn 1 Ghoul Monster on this space.
        */
        specialAbilities: [
            {
                type: "spawn-ghoul-on-space",
            },
        ],

        quantity: 0,
    },

    {
        id: "shub-niggurath",

        name: "Shub-Niggurath",

        epic: true,

        frontImage:
            "/cards/Monsters/Epic-Monster/Shub-Niggurath/Shub-Niggurath.jpg",

        backImage:
            "/cards/Monsters/Epic-Monster/Shub-Niggurath/Shub-Niggurath-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: -1,
            damage: 4,
        },

        combatTest: {
            skill: "strength",
            modifier: -3,
            damage: 5,
        },

        toughness: {
            type: "investigators-plus",
            value: 3,
        },

        /*
        * This Epic Monster cannot lose Health unless
        * 3 Mysteries have been solved.
        */
        specialAbilities: [
            {
                type: "cannot-lose-health-until-mysteries-solved",
                mysteriesRequired: 3,
            },
        ],

        quantity: 0,
    },

    {
        id: "spinner-of-webs",

        name: "Spinner of Webs",

        epic: true,

        frontImage:
            "/cards/Monsters/Epic-Monster/Spinner-of-Webs/Spinner-of-Webs.jpg",

        backImage:
            "/cards/Monsters/Epic-Monster/Spinner-of-Webs/Spinner-of-Webs-back.jpg",

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
            type: "investigators-plus",
            value: 2,
        },

        /*
        * If the investigator fails the Will test,
        * the Strength test is not resolved.
        */
        specialAbilities: [
            {
                type: "if-fail-will-skip-strength",
            },
        ],

        quantity: 0,
    },

    {
        id: "tick-tock-men",

        name: "Tick-Tock Men",

        epic: true,

        frontImage:
            "/cards/Monsters/Epic-Monster/Tick-Tock-Men/Tick-Tock-Men.jpg",

        backImage:
            "/cards/Monsters/Epic-Monster/Tick-Tock-Men/Tick-Tock-Men-back.jpg",

        horrorTest: null,

        combatTest: {
            skill: "strength",
            modifier: -2,
            damage: 3,
        },

        toughness: {
            type: "investigators-plus",
            value: 2,
        },

        /*
        * Clues cannot be spent to reroll dice
        * during this Combat Encounter.
        */
        specialAbilities: [
            {
                type: "cannot-spend-clues-to-reroll",
            },
        ],

        quantity: 0,
    },

    {
        id: "wind-walker",

        name: "Wind-Walker",

        epic: true,

        frontImage:
            "/cards/Monsters/Epic-Monster/Wind-Walker/Wind-Walker.jpg",

        backImage:
            "/cards/Monsters/Epic-Monster/Wind-Walker/Wind-Walker-back.jpg",

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
            type: "investigators-plus",
            value: 2,
        },

        /*
        * Before resolving the Will test, the investigator
        * loses 1 Health and 1 Sanity unless they spend
        * 1 Clue.
        */
        specialAbilities: [
            {
                type: "lose-health-and-sanity-unless-spend-clue",
            },
        ],

        quantity: 0,
    },

    {
        id: "zombie-horde",

        name: "Zombie Horde",

        epic: true,

        frontImage:
            "/cards/Monsters/Epic-Monster/Zombie-Horde/Zombie-Horde.jpg",

        backImage:
            "/cards/Monsters/Epic-Monster/Zombie-Horde/Zombie-Horde-back.jpg",

        horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 2,
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
        * If you lose Health from the Strength test,
        * discard 1 Ally Asset.
        */
        specialAbilities: [
            {
            type: "lose-health-from-strength-discard-ally",
            },

            /*
            * RECKONING:
            * Roll 1 die. On a 1 or 2,
            * advance Doom by 1.
            */
            {
            type: "roll-die-advance-doom",
            },
        ],

        quantity: 0,
    },
];