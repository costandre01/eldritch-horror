import type { EncounterDefinition } from "../../../game/models/Encounter";

export const researchEncountersYogSothoth: EncounterDefinition[] = [

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 1 - City
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-1-city",

        name: "Yog-Sothoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-1/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-1/Yog-Sothoth-Research-encounters-back-1.png",

        text:
            "Randolph Carter claims that the Silver Twilight Lodge stole a unique family treasure. You investigate the local Lodge.",

        choices: [
            {
                text: "Investigate the local Lodge.",

                effects: [
                    {
                        type: "test",

                        testType: "observation",

                        onSuccess: [
                            {
                                type: "gain-clues",

                                amount: 1,
                            },

                            {
                                type: "choice",

                                choices: [
                                    {
                                        text: "Discard 1 Spell to gain the Silver Key.",

                                        effects: [
                                            {
                                                type: "discard-spell",
                                            },

                                            {
                                                type: "gain-artifact",

                                                artifactId:
                                                    "the-silver-key",
                                            },
                                        ],
                                    },

                                    {
                                        text: "Do not discard a Spell.",

                                        effects: [],
                                    },
                                ],
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

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 1 - Wilderness
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-1-wilderness",

        name: "Yog-Sothoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-1/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-1/Yog-Sothoth-Research-encounters-back-1.png",

        text:
            "Talking to one of the locals, you realize that this village and its surrounding farms are inhabited by worshipers of Yog-Sothoth. A Cultist Monster ambushes you! If you defeat it, you manage to reach safety; gain this Clue.",

        choices: [
            {
                text: "Fight the Cultist.",

                effects: [
                    {
                        type: "combat",

                        monsterDefinitionId:
                            "cultist",

                        onDefeat: [
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

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 1 - Sea
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-1-sea",

        name: "Yog-Sothoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-1/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-1/Yog-Sothoth-Research-encounters-back-1.png",

        text:
            "A strange fog covers the water, but no one else seems to see it. If you pass, you find that the fog originates from a circle of stones on the beach of a small island; gain this Clue. If you fail, the mist impairs your vision; discard this Clue unless you discard 1 Spell.",

        choices: [
            {
                text: "Investigate the strange fog.",

                effects: [
                    {
                        type: "test",

                        testType: "observation",

                        onSuccess: [
                            {
                                type: "gain-clues",

                                amount: 1,
                            },
                        ],

                        onFail: [
                            {
                                type: "choice",

                                choices: [
                                    {
                                        text: "Discard 1 Spell.",

                                        effects: [
                                            {
                                                type: "discard-spell",
                                            },
                                        ],
                                    },

                                    {
                                        text: "Do not discard a Spell.",

                                        effects: [
                                            {
                                                type: "lose-clues",

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
        ],
    },

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 2 - City
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-2-city",

        name: "Yog-Sothoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-2/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-2/Yog-Sothoth-Research-encounters-back-2.png",

        text:
            "An old man approaches you and begs you to make a solemn vow to deliver a book to his grandson, Wilbur, in a town called Dunwich. You may gain a Dark Pact Condition to gain this Clue and the Necronomicon Artifact. If you do not gain the Condition, discard this Clue.",

        choices: [
            {
                text: "Make a solemn vow.",

                effects: [
                    {
                        type: "choice",

                        choices: [
                            {
                                text: "Accept the Dark Pact.",

                                effects: [
                                    {
                                        type: "gain-condition",

                                        conditionDefinitionId:
                                            "condition-dark-pact",
                                    },

                                    {
                                        type: "gain-clues",

                                        amount: 1,
                                    },

                                    {
                                        type: "gain-artifact",

                                        artifactId:
                                            "necronomicon",
                                    },
                                ],
                            },

                            {
                                text: "Refuse the vow.",

                                effects: [
                                    {
                                        type: "lose-clues",

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

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 2 - Wilderness
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-2-wilderness",

        name: "Yog-Sothoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-2/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-2/Yog-Sothoth-Research-encounters-back-2.png",

        text:
            "You watch several mi-go operate alien technology. Gain this Clue. If you have at least 1 Spell, the mi-go are suddenly aware of your presence and turn their strange devices toward you. If you fail, their devices erode your sense of reason; lose 1 Sanity and gain a Paranoia Condition.",

        choices: [
            {
                text: "Watch the mi-go.",

                effects: [
                    {
                        type: "gain-clues",

                        amount: 1,
                    },

                    {
                        type: "conditional",

                        condition: {
                            type: "has-spell",
                        },

                        thenEffects: [
                            {
                                type: "test",

                                testType: "observation",

                                onSuccess: [],

                                onFail: [
                                    {
                                        type: "lose-sanity",

                                        amount: 1,
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

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 2 - Sea
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-2-sea",

        name: "Yog-Sothoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-2/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-2/Yog-Sothoth-Research-encounters-back-2.png",

        text:
            "You see a white ship on the horizon, its sails apparently unaffected by the strong winds you feel racing across the waves. You use a telescope to examine the craft. If you pass, you see the ship passing through a fog bank into another world; gain this Clue and 1 additional Clue.",

        choices: [
            {
                text: "Examine the white ship.",

                effects: [
                    {
                        type: "test",

                        testType: "observation",

                        modifier: -1,

                        onSuccess: [
                            {
                                type: "gain-clues",

                                amount: 2,
                            },
                        ],

                        onFail: [],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 3 - City
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-3-city",

        name: "Yog-Sothoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-3/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-3/Yog-Sothoth-Research-encounters-back-3.png",

        text:
            "The library has received several requests from the Whateley family for information about the Necronomicon. You tell the staff to ignore all such requests from that family.",

        choices: [
            {
                text: "Investigate the Whateley requests.",

                effects: [
                    {
                        type: "test",

                        testType: "influence",

                        modifier: -1,

                        onSuccess: [
                            {
                                type: "gain-clues",

                                amount: 2,
                            },
                        ],

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

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 3 - Wilderness
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-3-wilderness",

        name: "Yog-Sothoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-3/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-3/Yog-Sothoth-Research-encounters-back-3.png",

        text:
            "The terrain has been flattened by some enormous creature. You follow its path of destruction.",

        choices: [
            {
                text: "Follow the path of destruction.",

                effects: [
                    {
                        type: "test",

                        testType: "observation",

                        onSuccess: [
                            {
                                type: "gain-clues",

                                amount: 2,
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

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 3 - Sea
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-3-sea",

        name: "Yog-Sothoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-3/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-3/Yog-Sothoth-Research-encounters-back-3.png",

        text:
            "Your ship travels through a time portal, and you hear news of future events on the radio.",

        choices: [
            {
                text: "Listen to the radio.",

                effects: [
                    {
                        type: "gain-clues",
                        amount: 1,
                    },

                    {
                        type: "conditional",

                        condition: {
                            type: "has-monster",
                            monsterDefinitionId:
                                "hound-of-tindalos",
                        },

                        thenEffects: [
                            {
                                type:
                                    "move-monster-to-investigator",

                                monsterDefinitionId:
                                    "hound-of-tindalos",
                            },

                            {
                                type:
                                    "combat-existing-monster",

                                monsterDefinitionId:
                                    "hound-of-tindalos",
                            },
                        ],

                        elseEffects: [
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

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 4 - City
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-4-city",

        name: "Yog-Sothoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-4/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-4/Yog-Sothoth-Research-encounters-back-4.png",

        text:
            "You attempt to sneak into the local Silver Twilight Lodge.",

        choices: [
            {
                text: "Sneak into the Silver Twilight Lodge.",

                effects: [
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
            },
        ],
    },

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 4 - Wilderness
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-4-wilderness",

        name: "Yog-Sothoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-4/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-4/Yog-Sothoth-Research-encounters-back-4.png",

        text:
            "Local lore speaks of a place of tremendous arcane potential.",

        choices: [
            {
                text: "Search for the place of arcane potential.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "gain-clues",
                                amount: 2,
                            },
                        ],

                        onFail: [
                            {
                                type: "spawn-gate",
                            },

                            {
                                type: "discard-spell",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 4 - Sea
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-4-sea",

        name: "Yog-Sothoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-4/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-4/Yog-Sothoth-Research-encounters-back-4.png",

        text:
            "Sheets of luminescent colors fill the horizon. You hear a hum in the air, almost like a voice.",

        choices: [
            {
                text: "Listen to the strange voice.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",

                        onSuccess: [
                            {
                                type: "gain-clues",
                                amount: 1,
                            },

                            {
                                type: "gain-spell",
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

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 5 - City
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-5-city",

        name: "Yog-Sothoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-5/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-5/Yog-Sothoth-Research-encounters-back-5.png",

        text:
            "Carl Sanford, head of Arkham's Silver Twilight Lodge, has tracked you down to find out what you know about Yog-Sothoth.",

        choices: [
            {
                text: "Speak with Carl Sanford.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "gain-clues",
                                amount: 1,
                            },

                            {
                                type: "gain-spell",
                                amount: 1,
                            },
                        ],

                        onFail: [
                            {
                                type: "spawn-gate",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 5 - Wilderness
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-5-wilderness",

        name: "Yog-Sothoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-5/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-5/Yog-Sothoth-Research-encounters-back-5.png",

        text:
            "A rumor has passed through the small communities of a witch named Lavinia. You sift through many eyewitness accounts to determine if Wilbur Whateley's mother still lives.",

        choices: [
            {
                text: "Investigate the eyewitness accounts.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "gain-clues",
                                amount: 2,
                            },
                        ],

                        onFail: [
                            {
                                type: "spawn-gate",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 5 - Sea
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-5-sea",

        name: "Yog-Sothoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-5/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-5/Yog-Sothoth-Research-encounters-back-5.png",

        text:
            "Large, winged crustaceans land on your ship and command you to join Yog-Sothoth. You may gain a Dark Pact Condition.",

        choices: [
            {
                text: "Join Yog-Sothoth.",

                effects: [
                    {
                        type: "gain-condition",

                        conditionDefinitionId:
                            "condition-dark-pact",
                    },

                    {
                        type: "gain-clues",
                        amount: 2,
                    },
                ],
            },

            {
                text: "Refuse.",

                effects: [
                    {
                        type: "spawn-gate",
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 6 - City
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-6-city",

        name: "Yog-Sothoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-6/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-6/Yog-Sothoth-Research-encounters-back-6.png",

        text:
            "You hear of a bookstore that sells extremely rare volumes, but it is in an area that is very difficult to navigate.",

        choices: [
            {
                text: "Search for the bookstore.",

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

                            {
                                type: "gain-artifact",
                                artifactType: "tome",
                                amount: 1,
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

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 6 - Wilderness
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-6-wilderness",

        name: "Yog-Sothoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-6/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-6/Yog-Sothoth-Research-encounters-back-6.png",

        text:
            "You dream of being in all places and existing at all times. You know that you will wake up soon, so you use this heightened state to explore significant times and places.",

        choices: [
            {
                text: "Explore significant times and places.",

                effects: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "gain-clues",
                                amount: 1,
                            },
                        ],

                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId: "condition-amnesia",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 6 - Sea
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-6-sea",

        name: "Yog-Sothoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-6/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-6/Yog-Sothoth-Research-encounters-back-6.png",

        text:
            "The captain believes that you're bad luck. You search for the true source of the ship's trouble.",

        choices: [
            {
                text: "Search for the source of the ship's trouble.",

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
                        onFail: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId: "condition-cursed",
                            },
                        ],
                    },
                ]
            },
        ],
    },

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 7 - City
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-7-city",

        name: "Yog-Sothoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-7/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-7/Yog-Sothoth-Research-encounters-back-7.png",

        text:
            "A noted politician walks straight toward you, glaring. A Cultist Monster ambushes you! If you defeat it, you find out that he was secretly a member of the Silver Twilight Lodge; gain this Clue. If you do not defeat it, the magical attack leaves you deeply shaken; gain a Paranoia Condition.",

        choices: [
            {
                text: "Fight the Cultist.",

                effects: [
                    {
                        type: "combat",
                        monsterDefinitionId: "cultist",

                        onDefeat: [
                            {
                                type: "gain-clues",
                                amount: 1,
                            },
                        ],

                        onNotDefeated: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId: "condition-paranoia",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 7 - Wilderness
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-7-wilderness",

        name: "Yog-Sothoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-7/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-7/Yog-Sothoth-Research-encounters-back-7.png",

        text:
            "At midnight, you feel an eerie presence surrounding the stone altar at the top of the hill. This strange presence fills your mind with blasphemous secrets. Gain this Clue. If you have at least 1 Spell, the entity tries to pull you into a deep trance.",

        choices: [
            {
                text: "Resist the entity.",

                effects: [
                    {
                        type: "gain-clues",
                        amount: 1,
                    },

                    {
                        type: "conditional",

                        condition: {
                            type: "has-spell",
                        },

                        thenEffects: [
                            {
                                type: "test",
                                testType: "will",

                                onSuccess: [],

                                onFail: [
                                    {
                                        type: "lose-sanity",
                                        amount: 1,
                                    },
                                    {
                                        type: "become-delayed",
                                    },
                                ],
                            },
                        ],

                        elseEffects: [],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 7 - Sea
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-7-sea",

        name: "Yog-Sothoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-7/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-7/Yog-Sothoth-Research-encounters-back-7.png",

        text:
            "The punctures in reality have caused a terrible storm over the ocean, but you believe you know a way to patch the rift between worlds.",

        choices: [
            {
                text: "Patch the rift between worlds.",

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
                                        text: "Discard 1 Spell to discard 1 Gate.",
                                        effects: [
                                            {
                                                type: "discard-spell",
                                            },
                                            {
                                                type: "select-gate",
                                                onGateSelected: [
                                                    {
                                                        type: "close-gate",
                                                    }
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        text: "Do not discard a Spell.",
                                        effects: [],
                                    },
                                ],
                            },
                        ],

                        onFail: [],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 8 - City
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-8-city",

        name: "Yog-Sothoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-8/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-8/Yog-Sothoth-Research-encounters-back-8.png",

        text:
            "A distraught woman claims that her missing son struck a bargain with the Lurker at the Threshold. You try to find the boy and free him from the debt.",

        choices: [
            {
                text: "Find the boy.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",

                        onSuccess: [
                            {
                                type: "choice",
                                choices: [
                                    {
                                        text: "Discard 1 Spell to gain 2 Clues.",
                                        effects: [
                                            {
                                                type: "discard-spell",
                                            },
                                            {
                                                type: "gain-clues",
                                                amount: 2,
                                            },
                                        ],
                                    },
                                    {
                                        text: "Do not discard a Spell.",
                                        effects: [],
                                    },
                                ],
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-clues",
                                amount: 1,
                            },
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-cursed",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 8 - Wilderness
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-8-wilderness",

        name: "Yog-Sothoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-8/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-8/Yog-Sothoth-Research-encounters-back-8.png",

        text:
            "You find footprints that indicate a large number of people passed through the area. You try to follow their path.",

        choices: [
            {
                text: "Follow the footprints.",

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
                            {
                                type: "gain-spell",
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

    /*
     * ============================================================
     * Yog-Sothoth - Research Encounter 8 - Sea
     * ============================================================
     */

    {
        id: "yog-sothoth-research-encounter-8-sea",

        name: "Yog-Sothoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-8/Yog-Sothoth-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Yog-Sothoth-Research-encounters-8/Yog-Sothoth-Research-encounters-back-8.png",

        text:
            "The punctures in reality have caused a terrible storm over the ocean, but you believe you know a way to patch the rift between worlds.",

        choices: [
            {
                text: "Patch the rift between worlds.",

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
                                        text: "Discard 1 Spell to discard 1 Gate.",
                                        effects: [
                                            {
                                                type: "discard-spell",
                                            },
                                            {
                                                type: "select-gate",
                                                onGateSelected: [
                                                    {
                                                        type: "close-gate",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        text: "Do not discard a Spell.",
                                        effects: [],
                                    },
                                ],
                            },
                        ],

                        onFail: [],
                    },
                ],
            },
        ],
    },

];