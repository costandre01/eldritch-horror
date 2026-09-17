import type { EncounterDefinition } from "../../../game/models/Encounter";

export const otherWorldEncounters: EncounterDefinition[] = [

    {
        id: "other-world-encounter-1",

        name: "Great Hall of Celaeno",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-1/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-1/Other_World_Encounter-back-1.png",

        initialText:
            "You are stunned to see a familiar face reading through tomes of dark sorcery. You try to catch a glimpse of what he's reading without alerting him to your presence ([observation]-1).",

        effects: [
            {
                type: "test",
                testType: "observation",
                modifier: -1,

                onSuccess: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "choice",

                                choices: [
                                    {
                                        text:
                                            "Gain 1 Clue.",

                                        effects: [
                                            {
                                                type: "gain-clues",
                                                amount: 1,
                                            },
                                        ],
                                    },

                                    {
                                        text:
                                            "Gain 1 Spell.",

                                        effects: [
                                            {
                                                type: "gain-spell",
                                                amount: 1,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-sanity",
                                amount: 2,
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "choice",

                        choices: [
                            {
                                text:
                                    "Spend 1 Clue.",

                                requirement: {
                                    type: "clues",
                                    amount: 1,
                                },

                                effects: [
                                    {
                                        type: "lose-clues",
                                        amount: 1,
                                    },
                                ],
                            },

                            {
                                text:
                                    "Lose 3 Sanity.",

                                effects: [
                                    {
                                        type: "lose-sanity",
                                        amount: 3,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-2",

        name: "The Future",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-2/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-2/Other_World_Encounter-back-2.png",

        initialText:
            "You stand in Times Square, New York, but not as you know it. The streets are empty, and the buildings have crumbled to dust. It appears that you will fail to save the world, and you try desperately not to fall into despair ([will]-1).",

        effects: [
            {
                type: "test",
                testType: "will",
                modifier: -1,

                onSuccess: [
                    {
                        type: "close-gate",
                    },

                    {
                        type: "test",
                        testType: "observation",

                        onSuccess: [
                            {
                                type: "gain-clues",
                                amount: 2,
                            },
                        ],

                        onFail: [],
                    },
                ],

                onFail: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [],

                        onFail: [
                            {
                                type: "lose-sanity",
                                amount: 6,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-3",

        name: "City of the Great Race",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-3/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-3/Other_World_Encounter-back-3.png",

        initialText:
            "On a high, stone shelf you find books containing the wisdom of both the distant past and the far-flung future. Unfortunately, the tomes were written using a series of strange curvilinear symbols. You do your best to translate the alien language ([lore]-1).",

        effects: [
            {
                type: "test",
                testType: "lore",
                modifier: -1,

                onSuccess: [
                    {
                        type: "close-gate",
                    },

                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "gain-clues",
                                amount: 1,
                            },
                        ],

                        onFail: [],
                    },
                ],

                onFail: [
                    {
                        type: "choice",

                        choices: [
                            {
                                text:
                                    "Spend 1 Clue.",

                                requirement: {
                                    type: "clues",
                                    amount: 1,
                                },

                                effects: [
                                    {
                                        type: "lose-clues",
                                        amount: 1,
                                    },
                                ],
                            },

                            {
                                text:
                                    "Do not spend a Clue.",

                                effects: [
                                    {
                                        type: "lose-sanity",
                                        amount: 2,
                                    },

                                    {
                                        type: "gain-condition",
                                        conditionDefinitionId:
                                            "condition-paranoia",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-4",

        name: "Lost Carcosa",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-4/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-4/Other_World_Encounter-back-4.png",

        initialText:
            "Turning the corner, you suddenly find yourself on stage. Other actors speak their dialogue and look at you expectantly. Someone offstage passes you a script, but the text is difficult to interpret ([lore]-1).",

        effects: [
            {
                type: "test",
                testType: "lore",
                modifier: -1,

                onSuccess: [
                    {
                        type: "choice",

                        choices: [
                            {
                                text:
                                    "Become Delayed to gain 2 Clues.",

                                effects: [
                                    {
                                        type: "become-delayed",
                                    },

                                    {
                                        type: "gain-clues",
                                        amount: 2,
                                    },
                                ],
                            },

                            {
                                text:
                                    "Do not become Delayed.",

                                effects: [],
                            },
                        ],

                        afterChoice: [
                            {
                                type: "close-gate",
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [],

                        onFail: [
                            {
                                type: "retreat-doom",
                                amount: 1,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-5",

        name: "The Past",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-5/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-5/Other_World_Encounter-back-5.png",

        initialText:
            "Through the slits in the closet door you see yourself as a small child, sitting up in bed. \"Who's there?\" asks a frightened voice. You try to calmly persuade your younger self that you're a friend ([influence]-1).",

        effects: [
            {
                type: "test",
                testType: "influence",
                modifier: -1,

                onSuccess: [
                    {
                        type: "choice",

                        choices: [
                            {
                                text:
                                    "Become Delayed to gain 2 Clues.",

                                effects: [
                                    {
                                        type: "become-delayed",
                                    },
                                    {
                                        type: "gain-clues",
                                        amount: 2,
                                    },
                                ],
                            },

                            {
                                text:
                                    "Do not become Delayed.",

                                effects: [],
                            },
                        ],

                        afterChoice: [
                            {
                                type: "close-gate",
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "test",
                        testType: "strength",

                        onSuccess: [],

                        onFail: [
                            {
                                type: "lose-health",
                                amount: 6,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-6",

        name: "The Past",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-6/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-6/Other_World_Encounter-back-6.png",

        initialText:
            "You find yourself standing in front of antique scientific equipment. According to the papers the year is 1771. You read through the notes and try to interpret the nature of the experiments ([lore]).",

        effects: [
            {
                type: "test",
                testType: "lore",

                onSuccess: [
                    {
                        type: "choice",

                        choices: [
                            {
                                text:
                                    "Become Delayed to gain 1 Spell.",

                                effects: [
                                    {
                                        type: "become-delayed",
                                    },
                                    {
                                        type: "gain-spell",
                                        amount: 1,
                                    },
                                ],
                            },

                            {
                                text:
                                    "Do not become Delayed.",

                                effects: [],
                            },
                        ],

                        afterChoice: [
                            {
                                type: "close-gate",
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [],

                        onFail: [
                            {
                                type: "lose-sanity",
                                amount: 3,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-7",

        name: "The Dreamlands",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-7/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-7/Other_World_Encounter-back-7.png",

        initialText:
            "In the cavern of flame, the bearded priests Nasht and Kaman-Thah warn you that it is too dangerous to continue. You insist that you possess the knowledge you need and are resolved to enter the Dreamlands ([will]-1). Roll 1 additional die for each [clue] Clues you have.",

        effects: [
            {
                type: "test",
                testType: "will",
                modifier: -1,

                onSuccess: [
                    {
                        type: "test",
                        testType: "strength",

                        /*
                        * +1 die for each Clue the investigator has.
                        *
                        * This is dynamic and therefore cannot be
                        * represented by a fixed modifier.
                        */
                        dicePerClue: 1,

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-health",
                                amount: 2,
                            },
                            {
                                type: "become-delayed",
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "become-delayed",
                    },
                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-hallucinations",
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-8",

        name: "The Future",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-8/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-8/Other_World_Encounter-back-8.png",

        initialText:
            "You find yourself in a familiar city, but there's no electricity. The only light comes from the greenish moon, and the only sound is distant screaming. You can feel your reason being overrun by fear ([will]).",

        effects: [
            {
                type: "test",
                testType: "will",

                onSuccess: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-health",
                                amount: 2,
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "test",
                        testType: "strength",

                        onSuccess: [],

                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-amnesia",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-9",

        name: "City of the Great Race",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-9/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-9/Other_World_Encounter-back-9.png",

        initialText:
            "You are horrified to realize that the body you are inhabiting in this world is not your own. The shock of seeing yourself in an alien, conical shell threatens to shatter your mind ([will]).",

        effects: [
            {
                type: "test",
                testType: "will",

                onSuccess: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-health",
                                amount: 2,
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "choice",

                        choices: [
                            {
                                text:
                                    "Spend 1 Clue.",

                                requirement: {
                                    type: "clues",
                                    amount: 1,
                                },

                                effects: [
                                    {
                                        type: "lose-clues",
                                        amount: 1,
                                    },
                                ],
                            },

                            {
                                text:
                                    "Do not spend a Clue.",

                                effects: [
                                    {
                                        type: "gain-condition",
                                        conditionDefinitionId:
                                            "condition-hallucinations",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-10",

        name: "Yuggoth",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-10/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-10/Other_World_Encounter-back-10.png",

        initialText:
            "You find a room filled with strange metal cylinders. Inside of each cylinder is a living brain that can communicate through a speaker box. You ask them for help ([influence]).",

        effects: [
            {
                type: "test",
                testType: "influence",

                onSuccess: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-sanity",
                                amount: 1,
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "choice",

                        choices: [
                            {
                                text:
                                    "Spend 1 Clue.",

                                requirement: {
                                    type: "clues",
                                    amount: 1,
                                },

                                effects: [
                                    {
                                        type: "lose-clues",
                                        amount: 1,
                                    },
                                ],
                            },

                            {
                                text:
                                    "Do not spend a Clue.",

                                effects: [
                                    {
                                        type: "lose-sanity",
                                        amount: 2,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-11",

        name: "Great Hall of Celaeno",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-11/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-11/Other_World_Encounter-back-11.png",

        initialText:
            "You are forbidden to enter the library unless you bear the necessary sigil. You draw the symbol to the best of your knowledge ([lore]).",

        effects: [
            {
                type: "test",
                testType: "lore",

                onSuccess: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "become-delayed",
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "choice",

                        choices: [
                            {
                                text:
                                    "Spend 1 Clue.",

                                requirement: {
                                    type: "clues",
                                    amount: 1,
                                },

                                effects: [
                                    {
                                        type: "lose-clues",
                                        amount: 1,
                                    },
                                ],
                            },

                            {
                                text:
                                    "Do not spend a Clue.",

                                effects: [
                                    {
                                        type: "gain-condition",
                                        conditionDefinitionId:
                                            "condition-amnesia",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-12",

        name: "Lost Carcosa",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-12/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-12/Other_World_Encounter-back-12.png",

        initialText:
            "You grow frustrated walking through the empty streets, able to hear people talking and laughing nearby, but unable to catch up to them. You try to focus and distinguish specific words from the mingling conversations ([observation]).",

        effects: [
            {
                type: "test",
                testType: "observation",

                onSuccess: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-paranoia",
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "choice",

                        choices: [
                            {
                                text:
                                    "Become Delayed.",

                                effects: [
                                    {
                                        type: "become-delayed",
                                    },
                                ],
                            },

                            {
                                text:
                                    "Lose 2 Sanity.",

                                effects: [
                                    {
                                        type: "lose-sanity",
                                        amount: 2,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-13",

        name: "Yuggoth",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-13/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-13/Other_World_Encounter-back-13.png",

        initialText:
            "You discover a waxen mask and artificial hands. Your mind reels as you realize that the old man you had spoken to earlier was actually some terrible creature disguised as a human ([will]).",

        effects: [
            {
                type: "test",
                testType: "will",

                onSuccess: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "become-delayed",
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "test",
                        testType: "lore",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-sanity",
                                amount: 3,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-14",

        name: "City of the Great Race",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-14/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-14/Other_World_Encounter-back-14.png",

        effects: [
            {
                type: "choice",

                choices: [
                    {
                        text:
                            "Spend 1 Clue.",

                        requirement: {
                            type: "clues",
                            amount: 1,
                        },

                        effects: [
                            {
                                type: "lose-clues",
                                amount: 1,
                            },

                            {
                                type: "test",
                                testType: "will",

                                onSuccess: [
                                    {
                                        type: "close-gate",
                                    },
                                ],

                                onFail: [
                                    {
                                        type: "lose-sanity",
                                        amount: 1,
                                    },
                                ],
                            },
                        ],
                    },

                    {
                        text:
                            "Do not spend a Clue.",

                        effects: [
                            {
                                type: "test",
                                testType: "strength",

                                onSuccess: [
                                    {
                                        type: "close-gate",
                                    },
                                ],

                                onFail: [
                                    {
                                        type: "lose-health",
                                        amount: 1,
                                    },
                                    {
                                        type: "lose-sanity",
                                        amount: 1,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-15",

        name: "Yuggoth",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-15/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-15/Other_World_Encounter-back-15.png",

        initialText:
            "You discover a fetid creature with wings and webbed feet. The beast is strange, like something from your wildest dreams. You may spend [clue] 1 Clue to resolve the pass effect. If you do not spend the Clue, resolve the fail effect.",

        effects: [
            {
                type: "choice",

                choices: [
                    {
                        text:
                            "Spend 1 Clue.",

                        requirement: {
                            type: "clues",
                            amount: 1,
                        },

                        effects: [
                            {
                                type: "lose-clues",
                                amount: 1,
                            },

                            {
                                type: "test",
                                testType: "lore",

                                onSuccess: [
                                    {
                                        type: "close-gate",
                                    },
                                ],

                                onFail: [
                                    {
                                        type: "gain-condition",
                                        conditionDefinitionId:
                                            "condition-hallucinations",
                                    },
                                ],
                            },
                        ],
                    },

                    {
                        text:
                            "Do not spend a Clue.",

                        effects: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-hallucinations",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-16",

        name: "Great Hall of Celaeno",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-16/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-16/Other_World_Encounter-back-16.png",

        initialText:
            "The book you are looking for is not on its proper shelf. You search the surrounding area, but after long hours you have lost the will to keep searching ([will]).",

        effects: [
            {
                type: "test",
                testType: "will",

                onSuccess: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-sanity",
                                amount: 1,
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "choice",

                        choices: [
                            {
                                text:
                                    "Spend 1 Clue.",

                                requirement: {
                                    type: "clues",
                                    amount: 1,
                                },

                                effects: [
                                    {
                                        type: "lose-clues",
                                        amount: 1,
                                    },

                                    {
                                        type: "close-gate",
                                    },
                                ],
                            },

                            {
                                text:
                                    "Do not spend a Clue.",

                                effects: [
                                    {
                                        type: "become-delayed",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-17",

        name: "Lost Carcosa",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-17/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-17/Other_World_Encounter-back-17.png",

        initialText:
            "Staring out at the cloudy water of Lake Hali, you are horrified to see the entire lake rippling, as if something at the bottom is about to surface. You are seized by a terrible panic that paralyzes you ([will]).",

        effects: [
            {
                type: "test",
                testType: "will",

                onSuccess: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-sanity",
                                amount: 1,
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "test",
                        testType: "lore",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-health",
                                amount: 2,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-18",

        name: "The Underworld",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-18/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-18/Other_World_Encounter-back-18.png",

        initialText:
            "You find yourself surrounded by ghouls. However, they don't seem to be antagonistic toward you. In fact, you believe you could persuade them to help you ([influence]).",

        effects: [
            {
                type: "test",
                testType: "influence",

                onSuccess: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-sanity",
                                amount: 1,
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "choice",

                        choices: [
                            {
                                text:
                                    "Discard 1 Item to close the Gate.",

                                requirement: {
                                    type: "items",
                                    amount: 1,
                                },

                                effects: [
                                    {
                                        type: "discard-item",
                                    },

                                    {
                                        type: "close-gate",
                                    },
                                ],
                            },

                            {
                                text:
                                    "Do not discard an Item.",

                                effects: [
                                    {
                                        type: "lose-health",
                                        amount: 1,
                                    },

                                    {
                                        type: "gain-condition",
                                        conditionDefinitionId:
                                            "condition-injury",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-19",

        name: "City of the Great Race",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-19/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-19/Other_World_Encounter-back-19.png",

        initialText:
            "You find others who, like you, have had their consciousness pulled into alien bodies from throughout time. You try to convince them to share their knowledge ([influence]).",

        effects: [
            {
                type: "test",
                testType: "influence",

                onSuccess: [
                    {
                        type: "gain-clues",
                        amount: 2,
                    },

                    {
                        type: "test",
                        testType: "lore",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-sanity",
                                amount: 1,
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-paranoia",
                    },

                    {
                        type: "choice",

                        choices: [
                            {
                                text:
                                    "Become Delayed.",

                                effects: [
                                    {
                                        type: "become-delayed",
                                    },
                                ],
                            },

                            {
                                text:
                                    "Do not become Delayed.",

                                effects: [
                                    {
                                        type: "lose-sanity",
                                        amount: 1,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-20",

        name: "Great Hall of Celaeno",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-20/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-20/Other_World_Encounter-back-20.png",

        initialText:
            "The book you are reading describes complex rituals in very abstract terms. You do your best to comprehend the dense material ([lore]).",

        effects: [
            {
                type: "test",
                testType: "lore",

                onSuccess: [
                    {
                        type: "gain-spell",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "influence",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "become-delayed",
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-hallucinations",
                    },

                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [],

                        onFail: [
                            {
                                type: "lose-health",
                                amount: 2,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-21",

        name: "The Dreamlands",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-21/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-21/Other_World_Encounter-back-21.png",

        initialText:
            "You are strictly admonished that in the city of Ulthar, no man may kill a cat. As a result, you see the city is filled with cats. If you know the language, you can communicate with these highly intelligent creatures ([lore]).",

        effects: [
            {
                type: "test",
                testType: "lore",

                onSuccess: [
                    {
                        type: "gain-clues",
                        amount: 1,
                    },

                    {
                        type: "choice",

                        choices: [
                            {
                                text:
                                    "Spend 1 Health to feed the cats and close the Gate.",

                                requirement: {
                                    type: "health",
                                    amount: 1,
                                },

                                effects: [
                                    {
                                        type: "lose-health",
                                        amount: 1,
                                    },

                                    {
                                        type: "close-gate",
                                    },
                                ],
                            },

                            {
                                text:
                                    "Do not spend 1 Health.",

                                effects: [
                                    {
                                        type: "become-delayed",
                                    },
                                ],
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "lose-health",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "observation",

                        onSuccess: [],

                        onFail: [
                            {
                                type: "discard-item",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-22",

        name: "Yuggoth",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-22/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-22/Other_World_Encounter-back-22.png",

        initialText:
            "The mi-go refuse to go near the city of green pyramids. You summon your courage and explore this abandoned area ([will]).",

        effects: [
            {
                type: "test",
                testType: "will",

                onSuccess: [
                    {
                        type: "gain-artifact",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "observation",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-amnesia",
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "test",
                        testType: "strength",

                        onSuccess: [],

                        onFail: [
                            {
                                type: "lose-health",
                                amount: 1,
                            },
                            {
                                type: "lose-sanity",
                                amount: 1,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-23",

        name: "The Abyss",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-23/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-23/Other_World_Encounter-back-23.png",

        initialText:
            "The nightgaunts seem intent on keeping you here in the darkness. You do your best to continue climbing out of these terrible depths without alerting them to your presence ([observation]).",

        effects: [
            {
                type: "test",
                testType: "observation",

                onSuccess: [
                    {
                        type: "improve-skill",
                        skillType: "will",
                    },

                    {
                        type: "test",
                        testType: "strength",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "close-gate",
                            },
                        ],

                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-back-injury",
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-leg-injury",
                    },

                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [],

                        onFail: [
                            {
                                type: "lose-health",
                                amount: 1,
                            },
                            {
                                type: "lose-sanity",
                                amount: 1,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "other-world-encounter-24",

        name: "Lost Carcosa",

        frontImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-24/Other_World_Encounter.png",

        backImage:
            "/cards/encounters/other-World-Encounters/Other_World_Encounter-24/Other_World_Encounter-back-24.png",

        initialText:
            "At an elaborate masquerade, you talk to decadent party-goers who are all maneuvering to be declared as the proper heir to the crown ([influence]).",

        effects: [
            {
                type: "test",
                testType: "influence",

                onSuccess: [
                    {
                        type: "gain-artifact",
                        amount: 1,
                    },

                    {
                        type: "choice",

                        choices: [
                            {
                                text:
                                    "Spend 2 Clues to gain the Queen's favor and close the Gate.",

                                requirement: {
                                    type: "clues",
                                    amount: 2,
                                },

                                effects: [
                                    {
                                        type: "lose-clues",
                                        amount: 2,
                                    },

                                    {
                                        type: "close-gate",
                                    },
                                ],
                            },

                            {
                                text:
                                    "Do not spend 2 Clues.",

                                effects: [
                                    {
                                        type: "become-delayed",
                                    },
                                ],
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "lose-sanity",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [],

                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-paranoia",
                            },
                        ],
                    },
                ],
            },
        ],
    },
]