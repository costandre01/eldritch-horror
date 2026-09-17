import type { EncounterDefinition } from "../../../game/models/Encounter";

export const americaEncounters: EncounterDefinition[] = [

    /*
    * ============================================================
    * Arkham
    * ============================================================
    */

    {
        id: "americas-encounter-1-arkham",

        name: "Arkham",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-1/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-1/Americas_Encounter-back-1.png",

        text:
            "In the restricted section of Miskatonic University's library, you study an esoteric tome. Gain 1 Incantation Spell. You try to decode a note written in the margin [lore]. If you fail, the words put strange visions into your mind; gain a Hallucinations Condition.",

        choices: [
            {
                text: "Try to decode the note.",

                effects: [
                    {
                        type: "gain-spell",
                        spellType: "incantation",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "lore",

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
        ],
    },

    {
        id: "americas-encounter-2-arkham",

        name: "Arkham",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-2/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-2/Americas_Encounter-back-2.png",

        text:
            "During the night, you have a nightmare about the old witch, Keziah Mason. In the dream, she shares her power with you; gain 1 Incantation Spell. When you wake up, you fear that the old witch will someday ask you for a favor in return ([will]+1). If you fail, gain a Paranoia Condition.",

        choices: [
            {
                text: "Face the nightmare.",

                effects: [
                    {
                        type: "gain-spell",
                        spellType: "incantation",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "will",
                        modifier: 1,

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

    {
        id: "americas-encounter-3-arkham",

        name: "Arkham",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-3/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-3/Americas_Encounter-back-3.png",

        text:
            "The Silver Twilight Lodge members ask you several riddles to prove your knowledge ([lore]+1). If you pass, they instruct you in their ways; gain 1 Spell.",

        choices: [
            {
                text: "Answer the riddles.",

                effects: [
                    {
                        type: "test",
                        testType: "lore",
                        modifier: 1,

                        onSuccess: [
                            {
                                type: "gain-spell",
                                spellType: "spell",
                                amount: 1,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "americas-encounter-4-arkham",

        name: "Arkham",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-4/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-4/Americas_Encounter-back-4.png",

        text:
            "An anonymous patient in the asylum pleads with you to share what you've learned. You may spend [clue] 1 Clue to share what you know. If you spend the Clue, the man begins chanting in a long-dead language; gain 1 Incantation Spell.",

        choices: [
            {
                text: "Spend 1 Clue.",

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
                        type: "gain-spell",
                        spellType: "incantation",
                        amount: 1,
                    },
                ],
            },

            {
                text: "Do not spend 1 Clue.",

                effects: [],
            },
        ],
    },

    {
        id: "americas-encounter-5-arkham",

        name: "Arkham",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-5/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-5/Americas_Encounter-back-5.png",

        text:
            "Some ritual had been performed in the Black Cave, but the cultists are long gone. You look around for anything they may have left behind [observation]. If you pass, you find a scrap of parchment and gain 1 Incantation Spell. If you fail, lose [health] 1 Health as you stumble around in the dark..",

        choices: [
            {
                text: "Search the Black Cave.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",

                        onSuccess: [
                            {
                                type: "gain-spell",
                                spellType: "incantation",
                                amount: 1,
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-health",
                                amount: 1,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "americas-encounter-6-arkham",

        name: "Arkham",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-6/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-6/Americas_Encounter-back-6.png",

        text:
            "Inside Ye Olde Magick Shoppe, Miriam Beecher talks to you about the finer points of the occult [lore]. If you pass, you impress her with your acumen, and she gives you a rare text; gain 1 Incantation Spell. If you fail, you lose track of time and can't seem to remember when you departed; gain an Amnesia Condition.",
            //

        choices: [
            {
                text: "Discuss the occult with Miriam Beecher.",

                effects: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "gain-spell",
                                spellType: "incantation",
                                amount: 1,
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
            },
        ],
    },

    {
        id: "americas-encounter-7-arkham",

        name: "Arkham",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-7/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-7/Americas_Encounter-back-7.png",

        text:
            "The administrators of Arkham's Historical Society take great pains to show you their extensive collection of historical documents. You may become Delayed to gain 2 Spells.",

        choices: [
            {
                text: "Become Delayed to gain 2 Spells.",

                effects: [
                    {
                        type: "become-delayed",
                    },
                    {
                        type: "gain-spell",
                        amount: 2,
                    },
                ],
            },

            {
                text: "Do not become Delayed.",

                effects: [],
            },
        ],
    },

    {
        id: "americas-encounter-8-arkham",

        name: "Arkham",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-8/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-8/Americas_Encounter-back-8.png",

        text:
            "A fortune teller in Independence Square warns you of dire events. You try to interpret her words [lore]. If you pass, you discern that you ultimately survive; gain a Blessed Condition. If you fail, you fear an inevitable doom; gain a Paranoia Condition.",

        choices: [
            {
                text: "Interpret the fortune teller's words.",

                effects: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-blessed",
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
            },
        ],
    },

    /*
   * ============================================================
   * San Francisco
   * ============================================================
   */

    {
        id: "americas-encounter-1-san-francisco",

        name: "San Francisco",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-1/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-1/Americas_Encounter-back-1.png",

        text:
            "Inspector Jack Manion is looking for information about the Tongs in Chinatown. If you can help him, he'll teach you the basics of police work in exchange. You may spend [clue] 1 Clue to improve [observation].",

        choices: [
            {
                text: "Spend 1 Clue.",

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
                        type: "improve-skill",
                        skillType: "observation",
                    },
                ],
            },

            {
                text: "Do not spend 1 Clue.",

                effects: [],
            },
        ],
    },

    {
        id: "americas-encounter-2-san-francisco",

        name: "San Francisco",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-2/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-2/Americas_Encounter-back-2.png",

        text:
            "You find the husk of a squid-like creature in a tunnel. Just seeing it terrifies you ([will] -1). If you pass, you identify the cthonian; improve 1 skill of your choice as scientists clamor to contribute to its study. If you fail, you run headlong through the tunnel; gain a Leg Injury Condition.",

        choices: [
            {
                text: "Examine the creature.",

                effects: [
                    {
                        type: "test",
                        testType: "will",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "improve-skill",
                            },
                        ],

                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-leg-injury",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "americas-encounter-3-san-francisco",

        name: "San Francisco",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-3/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-3/Americas_Encounter-back-3.png",

        text:
            "You meet Hammett, a former Pinkerton Agent, on the street car and try to convince him to teach you how to be a detective [influence]. If you pass, he agrees; improve Observation. If you fail, he's too distracted by his financial woes; gain a Debt Condition while helping to support his family.",

        choices: [
            {
                text: "Convince Hammett to teach you.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "improve-skill",
                                skillType: "observation",
                            },
                        ],

                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-debt",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "americas-encounter-4-san-francisco",

        name: "San Francisco",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-4/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-4/Americas_Encounter-back-4.png",

        text:
            "You speak to a military prisoner on Alcatraz Island. He tells you his story of deserting after encountering a horrific creature [will]. If you pass, he thanks you for believing him and blesses your name; gain a Blessed Condition. If you fail, the story throws you into a hysterical fit, and the guards arrest you; gain a Detained Condition.",

        choices: [
            {
                text: "Listen to his story.",

                effects: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-blessed",
                            },
                        ],

                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-detained",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "americas-encounter-5-san-francisco",

        name: "San Francisco",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-5/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-5/Americas_Encounter-back-5.png",

        text:
            "You are invited to the Hearst Castle and find yourself surrounded by the best and brightest. You may become Delayed to stay for a few days. If you become Delayed, you pick up some amazing talents; improve 1 skill of your choice.",

        choices: [
            {
                text: "Become Delayed to improve 1 Skill.",

                effects: [
                    {
                        type: "become-delayed",
                    },
                    {
                        type: "improve-skill",
                    },
                ],
            },

            {
                text: "Do not become Delayed.",

                effects: [],
            },
        ],
    },

    {
        id: "americas-encounter-6-san-francisco",

        name: "San Francisco",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-6/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-6/Americas_Encounter-back-6.png",

        text:
            "While patrolling in Chinatown, you become adept at spotting signs of cult activity. Improve [observation]. You find their temple, but must dispel a hex on the door to enter [lore]. If you fail, lose [health] 1 Health and [sanity] 1 Sanity as the hex saps your life away.",

        choices: [
            {
                text: "Dispel the hex.",

                effects: [
                    {
                        type: "improve-skill",
                        skillType: "observation",
                    },

                    {
                        type: "test",
                        testType: "lore",

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
        id: "americas-encounter-7-san-francisco",

        name: "San Francisco",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-7/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-7/Americas_Encounter-back-7.png",

        text:
            "The Examiner hires you to spend a night in the Winchester Mystery House. They provide you with experts in detecting the supernatural. Improve [observation]. The odd architecture and the building's history threaten to unhinge your mind as the evening passes ([will]-1). If you fail, lose [sanity] 2 Sanity.",

        choices: [
            {
                text: "Spend the night at the Winchester Mystery House.",

                effects: [
                    {
                        type: "improve-skill",
                        skillType: "observation",
                    },

                    {
                        type: "test",
                        testType: "will",
                        modifier: -1,

                        onFail: [
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

    {
        id: "americas-encounter-8-san-francisco",

        name: "San Francisco",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-8/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-8/Americas_Encounter-back-8.png",

        text:
            "A pulp author named Smith invites you to read his work. The stories disturb you [will]. If you pass, you gain insight into how the invisible world remains hidden; improve [observation]. If you fail, the tale chills you to the bone; gain a Madness Condition.",

        choices: [
            {
                text: "Read Smith's work.",

                effects: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "improve-skill",
                                skillType: "observation",
                            },
                        ],

                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-madness",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
   * ============================================================
   * Buenos Aires
   * ============================================================
   */

    {
        id: "americas-encounter-1-buenos-aires",

        name: "Buenos Aires",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-1/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-1/Americas_Encounter-back-1.png",

        text:
            "In an ancient underground chamber, you study strange scientific and magic paraphernalia once used by the Serpent Men [lore]. If you pass, you manipulate the devices to transform yourself and gain a Blessed Condition. If you fail, the devices remain utterly alien; lose [sanity] 2 Sanity.",

        choices: [
            {
                text: "Study the strange devices.",

                effects: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-blessed",
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
            },
        ],
    },

    {
        id: "americas-encounter-2-buenos-aires",

        name: "Buenos Aires",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-2/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-2/Americas_Encounter-back-2.png",

        text:
            "You sneak into the temple and overhear the rough croaking of deep ones chanting. You recognize familiar elements to the words they are intoning [lore]. If you pass, gain 1 Ritual Spell. If you fail, it's nothing more than horrific noise; lose [sanity] 1 Sanity.",

        choices: [
            {
                text: "Study the words they are chanting.",

                effects: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "gain-spell",
                                spellType: "ritual",
                                amount: 1,
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
        ],
    },

    {
        id: "americas-encounter-3-buenos-aires",

        name: "Buenos Aires",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-3/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-3/Americas_Encounter-back-3.png",

        text:
            "The museum's curator shows you a unique golden jewel that was recovered from the sea. You believe that the symbols on it indicate that something is hidden inside ([lore]+1). If you pass, you reveal a small scroll; gain 1 Spell. If you fail, you damage the jewel and must pay for the repairs; gain a Debt Condition.",

        choices: [
            {
                text: "Examine the golden jewel.",

                effects: [
                    {
                        type: "test",
                        testType: "lore",
                        modifier: 1,

                        onSuccess: [
                            {
                                type: "gain-spell",
                                spellType: "spell",
                                amount: 1,
                            },
                        ],

                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-debt",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "americas-encounter-4-buenos-aires",

        name: "Buenos Aires",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-4/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-4/Americas_Encounter-back-4.png",

        text:
            "A student has been studying the university's copy of the Necronomicon and is eager to share what he's learned in exchange for hearing what you know. You may spend [clue] 1 Clue to share what you know and gain 1 Ritual Spell.",

        choices: [
            {
                text: "Spend 1 Clue.",

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
                        type: "gain-spell",
                        spellType: "ritual",
                        amount: 1,
                    },
                ],
            },

            {
                text: "Do not spend 1 Clue.",

                effects: [],
            },
        ],
    },

    {
        id: "americas-encounter-5-buenos-aires",

        name: "Buenos Aires",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-5/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-5/Americas_Encounter-back-5.png",

        text:
            "You sneak aboard a ship loaded with stolen antiquities, including an ancient stone table. Reading it, you gain 1 Ritual Spell. Memorizing the words, you feel yourself slipping into a trance [will]. If you fail, you wake up imprisoned for theft; gain a Detained Condition.",

        choices: [
            {
                text: "Read and memorize the words.",

                effects: [
                    {
                        type: "gain-spell",
                        spellType: "ritual",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "will",

                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-detained",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "americas-encounter-6-buenos-aires",

        name: "Buenos Aires",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-6/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-6/Americas_Encounter-back-6.png",

        text:
            "An old woman warns you that you've angered Yig and teaches you a protective chant. Gain 1 Ritual Spell. Concerned that she may be right, you learn all you can about Yig [lore]. If you fail, you learn nothing; gain a Paranoia Condition.",

        choices: [
            {
                text: "Learn all you can about Yig.",

                effects: [
                    {
                        type: "gain-spell",
                        spellType: "ritual",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "lore",

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

    {
        id: "americas-encounter-7-buenos-aires",

        name: "Buenos Aires",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-7/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-7/Americas_Encounter-back-7.png",

        text:
            "At the hospital you find a bald, old man with leathery skin and a flat face. He speaks very slowly, but his story is fascinating. You may become Delayed to gain 2 Spells as he recounts all the details of his time worshiping the Father of Serpents.",

        choices: [
            {
                text: "Become Delayed to gain 2 Spells.",

                effects: [
                    {
                        type: "become-delayed",
                    },
                    {
                        type: "gain-spell",
                        spellType: "spell",
                        amount: 2,
                    },
                ],
            },

            {
                text: "Do not become Delayed.",

                effects: [],
            },
        ],
    },

    {
        id: "americas-encounter-8-buenos-aires",

        name: "Buenos Aires",

        type: "city",

        region: "america",

        frontImage:
            "/cards/encounters/Americas/Americas_Encounter-8/Americas_Encounter.png",

        backImage:
            "/cards/encounters/Americas/Americas_Encounter-8/Americas_Encounter-back-8.png",

        text:
            "A copy of the Necronomicon is kept at the University of Buenos Aires, but the librarian tells you that it's not available for viewing at this time. You try to convince him of the book's importance [influence]. If you pass, he relents and allows you a brief look at the book; gain 1 Ritual Spell.",

        choices: [
            {
                text: "Convince the librarian.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "gain-spell",
                                spellType: "ritual",
                                amount: 1,
                            },
                        ],
                    },
                ],
            },
        ],
    },
];