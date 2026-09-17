import type { EncounterDefinition } from "../../../game/models/Encounter";

export const europeEncounters: EncounterDefinition[] = [

    /*
   * ============================================================
   * London
   * ============================================================
   */

    {
        id: "europe-encounter-1-london",

        name: "London",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-1/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-1/Europe_Encounter-back-1.png",

        text:
            "The Silver Twilight Lodge is locked up tight. You look over the old building for a possible entrance [observation]. If you pass, the Lodge members are delighted by your ingenuity and offer their favor; gain a Blessed Condition. If you fail, you waste fruitless hours searching and become Delayed.",

        choices: [
            {
                text: "Search for an entrance.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",

                        onSuccess: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-blessed",
                            },
                        ],

                        onFail: [
                            {
                                type: "become-delayed",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "europe-encounter-2-london",

        name: "London",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-2/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-2/Europe_Encounter-back-2.png",

        text:
            "Inside the Herefordshire Asylum, a patient asks you if you've seen the Yellow Sign. You listen to his story of the King in Yellow [observation]. If you pass, spawn [clue] 2 Clues. If you fail, his gibberish imprints itself onto your subconscious; gain a Hallucinations Condition.",

        choices: [
            {
                text: "Listen to the patient's story.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",

                        onSuccess: [
                            {
                                type: "spawn-clues",
                                amount: 2,
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
        ],
    },

    {
        id: "europe-encounter-3-london",

        name: "London",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-3/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-3/Europe_Encounter-back-3.png",

        text:
            "You peruse The Scoop, a tabloid paper that specializes in strange and lurid stories ([observation]-1). If you pass, gain [clue] 1 Clue as you find a vital bit of information.",

        choices: [
            {
                text: "Search through The Scoop.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "gain-clues",
                                amount: 1,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "europe-encounter-4-london",

        name: "London",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-4/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-4/Europe_Encounter-back-4.png",

        text:
            "In exchange for a generous donation, the Penhew Foundation will happily show the results of its global explorations. You may gain a Debt Condition to gain [clue] 2 Clues.",

        choices: [
            {
                text: "Gain a Debt Condition.",

                effects: [
                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-debt",
                    },
                    {
                        type: "gain-clues",
                        amount: 2,
                    },
                ],
            },

            {
                text: "Do not gain a Debt Condition.",

                effects: [],
            },
        ],
    },

    {
        id: "europe-encounter-5-london",

        name: "London",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-5/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-5/Europe_Encounter-back-5.png",

        text:
            "Impulsively, you look through the inspector's files while his back is turned. Spawn [clue] 1 Clue on a space of your choice. Unfortunately, he sees you, and you'll need to fight your way out of Scotland Yard [strength]. If you fail, gain a Detained Condition as there is no shortage of police to arrest you.",

        choices: [
            {
                text: "Search the inspector's files.",

                effects: [
                    {
                        type: "select-space",

                        onSpaceSelected: [
                            {
                                type: "spawn-clues",
                                amount: 1,
                            },
                        ],
                    },

                    {
                        type: "test",

                        testType: "strength",

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
        id: "europe-encounter-6-london",

        name: "London",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-6/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-6/Europe_Encounter-back-6.png",

        text:
            "You meet an eccentric painter in Soho who offers to show you his work. Amid his bizarre, alien landscapes, you notice some familiar details [observation]. If you pass, spawn [clue] 1 Clue on a space of your choice. If you fail, you see nothing but horrors; lose [sanity] 1 Sanity.",

        choices: [
            {
                text: "Examine the painter's work.",

                effects: [
                    {
                        type: "test",

                        testType: "observation",

                        onSuccess: [
                            {
                                type: "select-space",

                                onSpaceSelected: [
                                    {
                                        type: "spawn-clues",

                                        amount: 1,
                                    },
                                ],
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
        id: "europe-encounter-7-london",

        name: "London",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-7/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-7/Europe_Encounter-back-7.png",

        text:
            "At the lecture of a noted archaeologist, he reveals startling information! Spawn [clue] 2 Clues. During the presentation, a stranger tries to sneak a scarab into your pocket. It is inscribed with words, \"Cursed be he who moves my body. To him shall come fire, water, and pestilence [observation].\" If you fail, gain an Internal Injury Condition.",

        choices: [
            {
                text: "Watch the stranger carefully.",

                effects: [
                    {
                        type: "spawn-clues",
                        amount: 2,
                    },

                    {
                        type: "test",
                        testType: "observation",

                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-internal-injury",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "europe-encounter-8-london",

        name: "London",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-8/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-8/Europe_Encounter-back-8.png",

        text:
            "You are invited to journey down to Oxford to examine John Dee's translation of the Necronomicon. You may become Delayed to spawn [clue] 2 Clues.",

        choices: [
            {
                text: "Become Delayed.",

                effects: [
                    {
                        type: "become-delayed",
                    },

                    {
                        type: "spawn-clues",
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

    /*
   * ============================================================
   * Rome
   * ============================================================
   */

    {
        id: "europe-encounter-1-rome",

        name: "Rome",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-1/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-1/Europe_Encounter-back-1.png",

        text:
            "The Vatican Library is so vast! You ask a librarian for a recommendation [influence]. If you pass, he leads you to a codex that recounts how worshipers of Shub-Niggurath were driven out of Rome, and the story renews your confidence; improve [will].",

        choices: [
            {
                text: "Ask the librarian for a recommendation.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "improve-skill",
                                skillType: "will",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "europe-encounter-2-rome",

        name: "Rome",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-2/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-2/Europe_Encounter-back-2.png",

        text:
            "You have an inspirational dream in which you are a proud Roman quaestor. Improve [will]. Your reverie is interrupted by a band of small, primitive men running wild outside. You try to negotiate with this lost tribe of Miri Nigri [influence]. If you fail, lose [health] 1 Health and [sanity] 1 Sanity as they continue their pursuit of some ancient grudge.",

        choices: [
            {
                text: "Negotiate with the Miri Nigri.",

                effects: [
                    {
                        type: "improve-skill",
                        skillType: "will",
                    },
                    {
                        type: "test",
                        testType: "influence",

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
        id: "europe-encounter-3-rome",

        name: "Rome",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-3/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-3/Europe_Encounter-back-3.png",

        text:
            "You speak to a number of Vatican authorities about your investigations. They carefully consider your story ([influence]-1). If you pass, you are thanked for doing good work; gain a Blessed Condition. If you fail, you are demoralized by their rejection; lose [sanity] 1 Sanity and discard a Blessed Condition.",

        choices: [
            {
                text: "Explain your investigations.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",
                        modifier: -1,

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
                                amount: 1,
                            },
                            {
                                type: "discard-condition",
                                conditionDefinitionId:
                                    "condition-blessed",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "europe-encounter-4-rome",

        name: "Rome",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-4/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-4/Europe_Encounter-back-4.png",

        text:
            "You discover a hidden shrine to Cybele in an ancient catacomb. It will be a long process to excavate the find, but removing such a blight from Rome's foundations will grant you a higher reward. You may become Delayed to gain a Blessed Condition.",

        choices: [
            {
                text: "Become Delayed to excavate the shrine.",

                effects: [
                    {
                        type: "become-delayed",
                    },
                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-blessed",
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
        id: "europe-encounter-5-rome",

        name: "Rome",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-5/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-5/Europe_Encounter-back-5.png",

        text:
            "Ever since arriving in Rome, you've had nightmares about being betrayed. You try to assure yourself that they are only dreams [will]. If you pass, the nightmare stops; improve [will]. If you fail, the nightmares continue; lose [sanity] 1 Sanity.",

        choices: [
            {
                text: "Confront the nightmares.",

                effects: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "improve-skill",
                                skillType: "will",
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
        id: "europe-encounter-6-rome",

        name: "Rome",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-6/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-6/Europe_Encounter-back-6.png",

        text:
            "A group of Blackshirts are interrogating an old priest, and you try to intervene [influence]. If you pass, they let the priest go, and he is eternally grateful; gain a Blessed Condition. If you fail, you are shoved against a wall and arrested; gain a Detained Condition.",

        choices: [
            {
                text: "Intervene on the priest's behalf.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

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
        id: "europe-encounter-7-rome",

        name: "Rome",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-7/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-7/Europe_Encounter-back-7.png",

        text:
            "A witch cult must have used this villa to conduct their rituals. They've left behind a number of small potions. You may drink one to improve 1 skill of your choice. If you improve a skill, you must resist the ill effects of the elixir [will]. If you fail, gain a Cursed Condition.",

        choices: [
            {
                text: "Drink one of the potions.",

                effects: [
                    {
                        type: "improve-skill",
                    },

                    {
                        type: "test",
                        testType: "will",

                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-cursed",
                            },
                        ],
                    },
                ],
            },

            {
                text: "Do not drink a potion.",

                effects: [],
            },
        ],
    },

    {
        id: "europe-encounter-8-rome",

        name: "Rome",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-8/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-8/Europe_Encounter-back-8.png",

        text:
            "You are invigorated by a visit to a magnificent cathedral. Improve [will]. In the basement, you find a mosaic depicting robed men bowing before a great fire. To your horror, it is surrounded by scorch marks that resemble human silhouettes ([will]-1). If you fail, gain a Paranoia Condition.",

        choices: [
            {
                text: "Investigate the mosaic.",

                effects: [
                    {
                        type: "improve-skill",
                        skillType: "will",
                    },

                    {
                        type: "test",
                        testType: "will",
                        modifier: -1,

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
   * Istanbul
   * ============================================================
   */

    {
        id: "europe-encounter-1-istanbul",

        name: "Istanbul",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-1/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-1/Europe_Encounter-back-1.png",

        text:
            "Inside the loud hustle and bustle of the Grand Bazaar, you negotiate to find a skilled instructor to tutor you ([influence]-1). If you pass, improve 1 skill of your choice. If you fail, the instructor teaches you nothing; gain a Debt Condition to pay for his lessons.",

        choices: [
            {
                text: "Negotiate with the instructor.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",
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
                                    "condition-debt",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "europe-encounter-2-istanbul",

        name: "Istanbul",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-2/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-2/Europe_Encounter-back-2.png",

        text:
            "People from every walk of life can be found enjoying the cleansing steam of the Turkish baths. Inside, you'll eventually find an expert in any given field. You may become Delayed to improve 1 skill of your choice.",

        choices: [
            {
                text: "Become Delayed to seek an expert.",

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
        id: "europe-encounter-3-istanbul",

        name: "Istanbul",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-3/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-3/Europe_Encounter-back-3.png",

        text:
            "Professor Azap at the Topkapi Museum is not easily impressed. Only serious scholars can earn his respect [lore]. If you pass, he offers you any help the institute can provide; improve [influence].",

        choices: [
            {
                text: "Impress Professor Azap.",

                effects: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "improve-skill",
                                skillType: "influence",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "europe-encounter-4-istanbul",

        name: "Istanbul",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-4/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-4/Europe_Encounter-back-4.png",

        text:
            "You see a horrid apparition slowly ascending the stairs and have the immediate impulse to run away [will]. If you pass, you discover that it wants only to take revenge on the murderous cultists for all of their victims; improve [influence]. If you fail, you are overcome by terror; gain a Madness Condition.",

        choices: [
            {
                text: "Face the apparition.",

                effects: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "improve-skill",
                                skillType: "influence",
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

    {
        id: "europe-encounter-5-istanbul",

        name: "Istanbul",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-5/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-5/Europe_Encounter-back-5.png",

        text:
            "The British Ambassador, Sir Douglas Rutherford, begs for your help. His child has been abducted by the Brothers of the Skin. You may spend [clue] 1 Clue to find the cultists and recover the boy. If you do, improve [influence].",

        choices: [
            {
                text: "Spend 1 Clue to rescue the boy.",

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
                        skillType: "influence",
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
        id: "europe-encounter-6-istanbul",

        name: "Istanbul",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-6/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-6/Europe_Encounter-back-6.png",

        text:
            "Members of the Turkish parliament offer you help in exchange for clearing a group of cultists out of the Shunned Mosque. Improve [influence]. Inside, you interrupt a ritual and must resist the effect of its magical energies [will]. If you fail, lose [health] 2 Health as your skin writhes across your body.",

        choices: [
            {
                text: "Clear the cultists from the mosque.",

                effects: [
                    {
                        type: "improve-skill",
                        skillType: "influence",
                    },

                    {
                        type: "test",
                        testType: "will",

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
        id: "europe-encounter-7-istanbul",

        name: "Istanbul",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-7/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-7/Europe_Encounter-back-7.png",

        text:
            "A secret group of scholars has taken an interest in you. Improve [influence]. They show you a shocking, ancient text written by Theodorus Philetas regarding his translation of the Necronomicon. His words deeply disturb you [will]. If you fail, lose [sanity] 2 Sanity.",

        choices: [
            {
                text: "Study the ancient text.",

                effects: [
                    {
                        type: "improve-skill",
                        skillType: "influence",
                    },
                    {
                        type: "test",
                        testType: "will",

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
        id: "europe-encounter-8-istanbul",

        name: "Istanbul",

        type: "city",

        region: "europe",

        frontImage:
            "/cards/encounters/Europe/Europe_Encounter-8/Europe_Encounter.png",

        backImage:
            "/cards/encounters/Europe/Europe_Encounter-8/Europe_Encounter-back-8.png",

        text:
            "You suspect that you are being followed. You use a reflective window to watch the people walking behind you [observation]. If you pass, you spot someone stalking you and escape into a mosque, and the imam there prays for your safety; gain a Blessed Condition. If you fail, the assassin finds you first; gain a Back Injury Condition.",

        choices: [
            {
                text: "Watch the people following you.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",

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
                                    "condition-back-injury",
                            },
                        ],
                    },
                ],
            },
        ],
    },
]