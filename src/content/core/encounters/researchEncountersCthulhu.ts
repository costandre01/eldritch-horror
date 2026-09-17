import type { EncounterDefinition } from "../../../game/models/Encounter";

export const researchEncountersCthulhu: EncounterDefinition[] = [

    /*
     * ============================================================
     * Cthulhu - Research Encounter 1 - City
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-1-city",

        name: "Cthulhu Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-1/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-1/Cthulhu-Research-Encounter-back-1.png",

        text:
            "The librarian tells you that the book you're looking for was checked out by someone named Mr. Marsh. You scout the city to find him before he leaves town.",

        choices: [
            {
                text: "Scout the city for Mr. Marsh.",

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
                                type: "move-clue",
                                target: "nearest-sea",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Cthulhu - Research Encounter 1 - Wilderness
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-1-wilderness",

        name: "Cthulhu Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-1/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-1/Cthulhu-Research-Encounter-back-1.png",

        text:
            "In a remote area, you discover an ancient ritual underway. A Cultist Monster ambushes you! If you defeat it, the cultists abandon their ritual; gain this Clue. If you do not defeat it, you are incorporated into the ceremony; gain a Cursed Condition.",

        choices: [
            {
                text: "Stop the ritual.",

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

                        onNotDefeated: [
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
     * Cthulhu - Research Encounter 1 - Sea
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-1-sea",

        name: "Cthulhu Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-1/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-1/Cthulhu-Research-Encounter-back-1.png",

        text:
            "You wake up on a reef with no sign of your ship. An enormous Star Spawn rises from the sea and places its thought into your mind. You may gain a Dark Pact Condition to gain this Clue and a Mists of Releh Spell. If you do not, discard this Clue and a Star Spawn Monster ambushes you.",

        choices: [
            {
                text: "Listen to the Star Spawn.",

                effects: [
                    {
                        type: "choice",

                        choices: [
                            {
                                text: "Gain a Dark Pact Condition.",

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
                                        type: "gain-spell",
                                        spellType: "incantation",
                                    },
                                ],
                            },

                            {
                                text: "Do not gain the Dark Pact.",

                                effects: [
                                    {
                                        type: "lose-clues",
                                        amount: 1,
                                    },

                                    {
                                        type: "combat",
                                        monsterDefinitionId:
                                            "star-spawn",
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
     * Cthulhu - Research Encounter 2 - City
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-2-city",

        name: "Cthulhu Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-2/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-2/Cthulhu-Research-Encounter-back-2.png",

        text:
            "You recognize allusions to Cthulhu in a sculptor's recent works. You speak to the artist about his inspirations.",

        choices: [
            {
                text: "Speak to the artist.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

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
     * Cthulhu - Research Encounter 2 - Wilderness
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-2-wilderness",

        name: "Cthulhu Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-2/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-2/Cthulhu-Research-Encounter-back-2.png",

        text:
            "This cavern collapsed thousands of years ago. Your excavations reveal ritual carvings that you think correspond to modern cults.",

        choices: [
            {
                text: "Examine the ritual carvings.",

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
     * Cthulhu - Research Encounter 2 - Sea
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-2-sea",

        name: "Cthulhu Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-2/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-2/Cthulhu-Research-Encounter-back-2.png",

        text:
            "Looking across the water, you see visions of an ancient island city populated by horrible creatures. The city is horrible to behold.",

        choices: [
            {
                text: "Study the vision.",

                effects: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "gain-clues",
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

    /*
     * ============================================================
     * Cthulhu - Research Encounter 3 - City
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-3-city",

        name: "Cthulhu Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-3/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-3/Cthulhu-Research-Encounter-back-3.png",

        text:
            "The police ask for help in tracking down a cultist sect.",

        choices: [
            {
                text: "Help the police track down the cultists.",

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
                                type: "discard-item",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Cthulhu - Research Encounter 3 - Wilderness
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-3-wilderness",

        name: "Cthulhu Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-3/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-3/Cthulhu-Research-Encounter-back-3.png",

        text:
            "You uncover an ancient stone statue of Cthulhu carved from an unknown green stone. Just looking at it threatens your mental stability.",

        choices: [
            {
                text: "Examine the statue.",

                effects: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "gain-clues",
                                amount: 1,
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

    /*
     * ============================================================
     * Cthulhu - Research Encounter 3 - Sea
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-3-sea",

        name: "Cthulhu Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-3/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-3/Cthulhu-Research-Encounter-back-3.png",

        text:
            "In the middle of the night you see an army of Deep Ones climbing in and out of the water.",

        choices: [
            {
                text: "Wait for the Deep Ones to leave.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "gain-artifact",
                                artifactType: "artifact-grotesque-statue",
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-sanity",
                                amount: 3,
                            },

                            {
                                type: "combat",
                                monsterDefinitionId: "deep-one",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Cthulhu - Research Encounter 4 - City
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-4-city",

        name: "Cthulhu Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-4/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-4/Cthulhu-Research-Encounter-back-4.png",

        text:
            "A man tells you about his terrible dreams of underwater cities. You suspect you understand the source of such nightmares.",

        choices: [
            {
                text: "Investigate the source of his nightmares.",

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
                                type: "combat",
                                monsterDefinitionId: "deep-one",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Cthulhu - Research Encounter 4 - Wilderness
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-4-wilderness",

        name: "Cthulhu Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-4/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-4/Cthulhu-Research-Encounter-back-4.png",

        text:
            "You try to track down an old hermit who supposedly knows the secrets of Cthulhu's cults.",

        choices: [
            {
                text: "Track down the old hermit.",

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
                                type: "move-clue",
                                target: "nearest-sea",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Cthulhu - Research Encounter 4 - Sea
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-4-sea",

        name: "Cthulhu Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-4/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-4/Cthulhu-Research-Encounter-back-4.png",

        text:
            "Your ship encounters another vessel engaged in deep-sea excavation. You sneak aboard their craft to see what they've found.",

        choices: [
            {
                text: "Sneak aboard the vessel.",

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
     * Cthulhu - Research Encounter 5 - City
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-5-city",

        name: "Cthulhu Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-5/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-5/Cthulhu-Research-Encounter-back-5.png",

        text:
            "You dream of a city built from massive green stones set at non-Euclidean angles. You try to retain as many details as you can to investigate when you wake up.",

        choices: [
            {
                text: "Retain the details of the dream.",

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
     * Cthulhu - Research Encounter 5 - Wilderness
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-5-wilderness",

        name: "Cthulhu Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-5/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-5/Cthulhu-Research-Encounter-back-5.png",

        text:
            "You try to interpret the strange constellations in the night sky above you.",

        choices: [
            {
                text: "Interpret the strange constellations.",

                effects: [
                    {
                        type: "test",
                        testType: "lore",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "gain-clues",
                                amount: 1,
                            },

                            {
                                type: "retreat-doom",
                                amount: 1,
                            },
                        ],

                        onFail: [
                            {
                                type: "move-clue",
                                targetSpaceType: "sea",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Cthulhu - Research Encounter 5 - Sea
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-5-sea",

        name: "Cthulhu Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-5/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-5/Cthulhu-Research-Encounter-back-5.png",

        text:
            "Some dark shape is moving under the waves.",

        choices: [
            {
                text: "Watch the dark shape.",

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
                                type: "combat",
                                monsterDefinitionId:
                                    "star-spawn",

                                onDefeat: [
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
        ],
    },

    /*
     * ============================================================
     * Cthulhu - Research Encounter 6 - City
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-6-city",

        name: "Cthulhu Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-6/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-6/Cthulhu-Research-Encounter-back-6.png",

        text:
            "After the police raid a local Order of Dagon, you have a chance to search the temple.",

        choices: [
            {
                text: "Search the temple.",

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
                                spellId: "mists-of-releh",
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
     * Cthulhu - Research Encounter 6 - Wilderness
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-6-wilderness",

        name: "Cthulhu Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-6/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-6/Cthulhu-Research-Encounter-back-6.png",

        text:
            "Cultists have snuck into your camp, trying to steal your equipment.",

        choices: [
            {
                text: "Catch the cultists.",

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
                                type: "discard-item",
                                amount: 2,
                            },

                            {
                                type: "move-clue",
                                targetSpaceType: "sea",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Cthulhu - Research Encounter 6 - Sea
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-6-sea",

        name: "Cthulhu Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-6/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-6/Cthulhu-Research-Encounter-back-6.png",

        text:
            "You listen intently as the island natives tell a folktale.",

        choices: [
            {
                text: "Listen to the folktale.",

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
                                type: "retreat-doom",
                                amount: 1,
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

    /*
     * ============================================================
     * Cthulhu - Research Encounter 7 - City
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-7-city",

        name: "Cthulhu Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-7/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-7/Cthulhu-Research-Encounter-back-7.png",

        text:
            "The cult of Cthulhu anticipated your arrival. A Cultist Monster ambushes you! If you defeat it, gain this Clue. If you do not defeat it, you cannot recall how you escaped; gain an Amnesia Condition and move this Clue to the nearest Sea space.",

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

                        onNotDefeated: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-amnesia",
                            },

                            {
                                type: "move-clue",
                                targetSpaceType: "sea",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Cthulhu - Research Encounter 7 - Wilderness
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-7-wilderness",

        name: "Cthulhu Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-7/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-7/Cthulhu-Research-Encounter-back-7.png",

        text:
            "You have a vivid dream of R'lyeh and fear that you won't be able to wake up if you can't find your way out of the city.",

        choices: [
            {
                text: "Find your way out of the dream.",

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
                                amount: 2,
                            },

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
     * Cthulhu - Research Encounter 7 - Sea
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-7-sea",

        name: "Cthulhu Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-7/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-7/Cthulhu-Research-Encounter-back-7.png",

        text:
            "As you stare across the water, a webbed hand reaches from below the surface and grabs your leg! A Deep One Monster ambushes you. If you defeat it, gain this Clue and 1 additional Clue. If you do not defeat it, gain a Leg Injury Condition.",

        choices: [
            {
                text: "Fight the Deep One.",

                effects: [
                    {
                        type: "combat",
                        monsterDefinitionId:
                            "deep-one",

                        onDefeat: [
                            {
                                type: "gain-clues",
                                amount: 2,
                            },
                        ],

                        onNotDefeated: [
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

    /*
     * ============================================================
     * Cthulhu - Research Encounter 8 - City
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-8-city",

        name: "Cthulhu Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-8/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-8/Cthulhu-Research-Encounter-back-8.png",

        text:
            "You see dozens of people with the distinct features of deep one hybrids. They watch you constantly, and you'll have to fight to escape.",

        choices: [
            {
                text: "Fight to escape.",

                effects: [
                    {
                        type: "test",
                        testType: "strength",

                        onSuccess: [
                            {
                                type: "gain-clues",
                                amount: 1,
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-health",
                                amount: 1,
                            },

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
     * Cthulhu - Research Encounter 8 - Wilderness
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-8-wilderness",

        name: "Cthulhu Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-8/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-8/Cthulhu-Research-Encounter-back-8.png",

        text:
            "The mi-go have lured you into the wild to put an end to your investigation. You try to drive the creatures off before they can do any lasting damage.",

        choices: [
            {
                text: "Drive off the mi-go.",

                effects: [
                    {
                        type: "test",
                        testType: "strength",

                        onSuccess: [
                            {
                                type: "gain-clues",
                                amount: 1,
                            },
                        ],

                        onFail: [
                            {
                                type: "become-delayed",
                            },

                            {
                                type: "move-clue",
                                targetSpaceType: "sea",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Cthulhu - Research Encounter 8 - Sea
     * ============================================================
     */

    {
        id: "cthulhu-research-encounter-8-sea",

        name: "Cthulhu Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-8/Cthulhu-Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Cthulhu-Research-encounters-8/Cthulhu-Research-Encounter-back-8.png",

        text:
            "During the night, you hear the sounds of the crew battling some unseen enemy. Suddenly, you are face-to-face with one of the fish-like monstrosities! Gain this Clue and lose 1 Sanity. A Deep One Monster ambushes you. If you defeat it, you find an odd relic; gain the Ruby of R'lyeh Artifact.",

        choices: [
            {
                text: "Face the Deep One.",

                effects: [
                    {
                        type: "gain-clues",
                        amount: 1,
                    },

                    {
                        type: "lose-sanity",
                        amount: 1,
                    },

                    {
                        type: "combat",
                        monsterDefinitionId:
                            "deep-one",

                        onDefeat: [
                            {
                                type: "gain-artifact",
                                artifactId: "ruby-of-rlyeh",
                            }
                        ],
                    },
                ],
            },
        ],
    },

];