import type { AncientOneDefinition } from "../../game/models/AncientOneDefinition";

export const CORE_ANCIENT_ONES: AncientOneDefinition[] = [
    {
        id: "azathoth",
        name: "Azathoth",

        frontImage:
            "/cards/Ancient-Ones/Azathoth/Azathoth.jpg",

        backImage:
            "/cards/Ancient-Ones/Azathoth/Azathoth-back.jpg",

        startingDoom: 15,

        mysteriesToSolve: 3,

        availableMysteryCount: 4,

        mythosDeckSize: 16,

        mythosStages: [
        {
            green: 1,
            yellow: 2,
            blue: 1,
        },
        {
            green: 2,
            yellow: 3,
            blue: 1,
        },
        {
            green: 2,
            yellow: 4,
            blue: 0,
        },
        ],

        cultist: {
            front: {
                horrorTest: {
                    skill: "will",
                    modifier: 0,
                    damage: 1,
                },
                    combatTest: null,
                    toughness: 1,
            },

            awakened: {
                horrorTest: {
                    skill: "will",
                    modifier: 0,
                    damage: 1,
                },
                    combatTest: null,
                    toughness: 1,
            },
        },

        awakening: {
            type: "lose-game",
        },

        reckoning: {
            front: [],
            awakened: [
                {
                    type: "each-investigator-lose-sanity",
                    amount: 1,
                },
            ],
        },
    },

    {
        id: "cthulhu",
        name: "Cthulhu",

        frontImage:
            "/cards/Ancient-Ones/Cthulhu/Cthulhu.jpg",

        backImage:
            "/cards/Ancient-Ones/Cthulhu/Cthulhu-back.jpg",

        startingDoom: 12,

        mysteriesToSolve: 3,

        availableMysteryCount: 4,

        mythosDeckSize: 15,

        mythosStages: [
        {
            green: 0,
            yellow: 2,
            blue: 2,
        },
        {
            green: 1,
            yellow: 3,
            blue: 0,
        },
        {
            green: 3,
            yellow: 4,
            blue: 0,
        },
        ],

        cultist: {
            front: {
                horrorTest: null,

                combatTest: {
                    skill: "strength",
                    modifier: 0,
                    damage: 1,
                },

                toughness: 1,
            },

            awakened: {
                horrorTest: null,

                combatTest: {
                    skill: "strength",
                    modifier: 0,
                    damage: 1,
                },

                toughness: 2,
            },
        },

        awakening: {
            type: "spawn-epic-monster",
            epicMonsterDefinitionId: "cthulhu",
            spaceId: "space-3",
        },

        reckoning: {
            front: [
                {
                    type: "place-eldritch-token-on-sea",
                },
            ],

            awakened: [
                {
                    type: "lose-sanity-per-sanity-token",
                },
            ],
        },
    },

    {
        id: "shub-niggurath",
        name: "Shub-Niggurath",

        frontImage:
            "/cards/Ancient-Ones/Shub-Niggurath/Shub-Niggurath.jpg",

        backImage:
            "/cards/Ancient-Ones/Shub-Niggurath/Shub-Niggurath-back.jpg",

        startingDoom: 13,

        mysteriesToSolve: 3,

        availableMysteryCount: 4,

        mythosDeckSize: 16,

        mythosStages: [
        {
            green: 1,
            yellow: 2,
            blue: 1,
        },
        {
            green: 3,
            yellow: 2,
            blue: 1,
        },
        {
            green: 2,
            yellow: 4,
            blue: 0,
        },
        ],

        cultist: {
            front: {
                horrorTest: null,

                combatTest: {
                    skill: "strength",
                    modifier: -1,
                    damage: 1,
                },

                toughness: 1,
            },

            awakened: {
                horrorTest: null,

                combatTest: {
                    skill: "strength",
                    modifier: -2,
                    damage: 1,
                },

                toughness: 2,
            },
        },

        awakening: {
            type: "spawn-epic-monster-and-move-monsters",
            epicMonsterDefinitionId: "shub-niggurath",
            spaceId: "heart-of-africa",
            monsterDefinitionIds: [
                "ghoul",
                "goat-spawn",
                "dark-young",
            ],
        },

        reckoning: {
            front: [
                {
                    type: "spawn-monster-and-advance-doom",
                },
            ],

            awakened: [
                {
                    type: "investigators-on-ancient-one-space-combat",
                },
            ],
        },
    },

    {
        id: "yog-sothoth",
        name: "Yog-Sothoth",

        frontImage:
            "/cards/Ancient-Ones/Yog-Sothoth/Yog-Sothoth.jpg",

        backImage:
            "/cards/Ancient-Ones/Yog-Sothoth/Yog-Sothoth-back.jpg",

        startingDoom: 14,

        mysteriesToSolve: 3,

        availableMysteryCount: 4,

        mythosDeckSize: 16,

        mythosStages: [
        {
            green: 0,
            yellow: 2,
            blue: 1,
        },
        {
            green: 2,
            yellow: 3,
            blue: 1,
        },
        {
            green: 3,
            yellow: 4,
            blue: 0,
        },
        ],

        cultist: {
            front: {
                horrorTest: null,

                combatTest: {
                    skill: "strength",
                    modifier: 0,
                    damage: 1,
                },

                toughness: 1,
            },

            awakened: {
                horrorTest: null,

                combatTest: {
                    skill: "strength",
                    modifier: -1,
                    damage: 1,
                },

                toughness: 1,
            },
        },

        awakening: {
            type: "none",
        },

        reckoning: {
            front: [
                {
                    type:
                        "investigators-on-gate-advance-doom-unless-discard-spell",
                },
            ],

            awakened: [
                {
                    type:
                        "investigators-on-gate-place-gate-or-discard-spell",
                },
            ],
        },
    },
];