import type { EncounterDefinition } from "../../../game/models/Encounter";

export const researchEncountersShubNiggurath: EncounterDefinition[] = [

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 1 - City
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-1-city",

        name: "Shub-Niggurath Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-1/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-1/Shub-Niggurath-Research-encounters-back-1.png",

        text:
            "You search for insight into what the Order of the Death's Head was doing before they left the city.",

        choices: [
            {
                text: "Search for insight.",

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
                                type: "discard-monster",
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
     * Shub-Niggurath - Research Encounter 1 - Wilderness
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-1-wilderness",

        name: "Shub-Niggurath Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-1/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-1/Shub-Niggurath-Research-encounters-back-1.png",

        text:
            "The moon is full, and a satyr-like creature pulls itself from an undulating mass of sludge. A Goat Spawn ambushes you! If you defeat it, gain this Clue and 1 additional Clue. If you fail, you wake up the next morning with no memory of how you survived; gain an Amnesia Condition.",

        choices: [
            {
                text: "Fight the Goat Spawn.",

                effects: [
                    {
                        type: "combat",

                        monsterDefinitionId:
                            "goat-spawn",

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
                                    "condition-amnesia",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 1 - Sea
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-1-sea",

        name: "Shub-Niggurath Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-1/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-1/Shub-Niggurath-Research-encounters-back-1.png",

        text:
            "You search the ship for a creature that's been attacking the crew. If you pass, you find the beast asleep in the cargo hold and easily overpower it; gain this Clue and 1 additional Clue. If you fail, it finds you; a Monster ambushes you!",

        choices: [
            {
                text: "Search the ship.",

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
                                type: "combat-random-monster",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 2 - City
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-2-city",

        name: "Shub-Niggurath Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-2/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-2/Shub-Niggurath-Research-encounters-back-2.png",

        text:
            "You've captured one of the Brotherhood's knights. These assassins are rarely captured alive, and this may be your only chance of interrogating one.",

        choices: [
            {
                text: "Interrogate the knight.",

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
                                type: "lose-health",

                                amount: 2,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 2 - Wilderness
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-2-wilderness",

        name: "Shub-Niggurath Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-2/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-2/Shub-Niggurath-Research-encounters-back-2.png",

        text:
            "The cultists weave through the trees, making it hard to follow them.",

        choices: [
            {
                text: "Follow the cultists.",

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
                                type:
                                    "spawn-dark-young-or-random-monster",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 2 - Sea
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-2-sea",

        name: "Shub-Niggurath Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-2/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-2/Shub-Niggurath-Research-encounters-back-2.png",

        text:
            "You negotiate with the crew to fight on your behalf.",

        choices: [
            {
                text: "Negotiate with the crew.",

                effects: [
                    {
                        type: "test",

                        testType: "influence",

                        modifier: -1,

                        onSuccess: [
                            {
                                type: "gain-clues",

                                amount: 1,
                            },

                            {
                                type: "discard-monster",
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
     * Shub-Niggurath - Research Encounter 3 - City
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-3-city",

        name: "Shub-Niggurath Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-3/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-3/Shub-Niggurath-Research-encounters-back-3.png",

        text:
            "A midnight break-in at the museum has left several guards dead. Based on descriptions of the stolen items, you try to identify what was taken.",

        choices: [
            {
                text: "Identify the stolen items.",

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
                                type: "gain-artifact",

                                artifactId:
                                    "furnace-of-yeb",
                            },

                            {
                                type: "gain-artifact",

                                artifactId:
                                    "torch-of-nug",
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
     * Shub-Niggurath - Research Encounter 3 - Wilderness
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-3-wilderness",

        name: "Shub-Niggurath Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-3/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-3/Shub-Niggurath-Research-encounters-back-3.png",

        text:
            "The faces of the robed figures are hidden behind wooden goat masks. Their chanting corrupts your thoughts. You may gain a Dark Pact to gain this Clue and improve Strength. If you do not gain the Condition, you find yourself alone, unsure if the cultists were really there; gain a Paranoia Condition.",

        choices: [
            {
                text: "Face the masked cultists.",

                effects: [
                    {
                        type: "choice",

                        choices: [
                            {
                                text: "Gain Dark Pact.",

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
                                        type: "improve-skill",

                                        skillType: "strength",

                                        amount: 1,
                                    },
                                ],
                            },

                            {
                                text: "Do not gain Dark Pact.",

                                effects: [
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
     * Shub-Niggurath - Research Encounter 3 - Sea
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-3-sea",

        name: "Shub-Niggurath Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-3/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-3/Shub-Niggurath-Research-encounters-back-3.png",

        text:
            "One of the crew secretly worships the Black Goat, and he has set the ship on fire. You race to fight the flames.",

        choices: [
            {
                text: "Fight the flames.",

                effects: [
                    {
                        type: "test",

                        testType: "strength",

                        modifier: -1,

                        onSuccess: [
                            {
                                type: "gain-clues",

                                amount: 2,
                            },
                        ],

                        onFail: [
                            {
                                type: "move-to-nearest-space",

                                targetSpaceType:
                                    "wilderness",
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
     * Shub-Niggurath - Research Encounter 4 - City
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-4-city",

        name: "Shub-Niggurath Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-4/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-4/Shub-Niggurath-Research-encounters-back-4.png",

        text:
            "In your nightmare, the chanting of the Cult of the Black Goat threatens your sanity.",

        choices: [
            {
                text: "Resist the chanting.",

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
                                type: "move-to-nearest-space",

                                targetSpaceType:
                                    "wilderness",
                            },

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

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 4 - Wilderness
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-4-wilderness",

        name: "Shub-Niggurath Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-4/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-4/Shub-Niggurath-Research-encounters-back-4.png",

        text:
            "This area has been prepared for a sacrifice. You keep an eye out for the Cult to return.",

        choices: [
            {
                text: "Watch for the Cult.",

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
                                type: "discard-ally",
                            },

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

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 4 - Sea
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-4-sea",

        name: "Shub-Niggurath Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-4/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-4/Shub-Niggurath-Research-encounters-back-4.png",

        text:
            "You stop to examine a ship that has run aground.",

        choices: [
            {
                text: "Examine the ship.",

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
                                type: "move-clue",

                                targetSpaceType:
                                    "wilderness",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 5 - City
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-5-city",

        name: "Shub-Niggurath Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-5/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-5/Shub-Niggurath-Research-encounters-back-5.png",

        text:
            "You search an underground temple dedicated to a fertility goddess.",

        choices: [
            {
                text: "Search the temple.",

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

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 5 - Wilderness
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-5-wilderness",

        name: "Shub-Niggurath Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-5/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-5/Shub-Niggurath-Research-encounters-back-5.png",

        text:
            "The hooded figure hands you a chalice, but you are suspicious of its content.",

        choices: [
            {
                text: "Examine the chalice.",

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
                                type: "combat",

                                monsterDefinitionId:
                                    "dark-young",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 5 - Sea
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-5-sea",

        name: "Shub-Niggurath Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-5/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-5/Shub-Niggurath-Research-encounters-back-5.png",

        text:
            "Under the full moon, the sailor turns into a beast. You lock him in his cabin and brace the door.",

        choices: [
            {
                text: "Brace the cabin door.",

                effects: [
                    {
                        type: "test",

                        testType: "strength",

                        modifier: -1,

                        onSuccess: [
                            {
                                type: "gain-clues",

                                amount: 1,
                            },
                        ],

                        onFail: [
                            {
                                type: "move-clue",

                                targetSpaceType:
                                    "wilderness",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 6 - City
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-6-city",

        name: "Shub-Niggurath Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-6/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-6/Shub-Niggurath-Research-encounters-back-6.png",

        text:
            "Blood begins to drip from your ears, nose, and mouth. A witch is casting a hex against you, and you must resist it!",

        choices: [
            {
                text: "Resist the hex.",

                effects: [
                    {
                        type: "test",

                        testType: "will",

                        onSuccess: [
                            {
                                type: "gain-clues",

                                amount: 1,
                            },

                            {
                                type: "lose-monster-health",

                                amount: 2,
                            },
                        ],

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
        ],
    },

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 6 - Wilderness
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-6-wilderness",

        name: "Shub-Niggurath Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-6/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-6/Shub-Niggurath-Research-encounters-back-6.png",

        text:
            "The Cult of the Black Goat has chosen you as the target of their ritual hunt. You try to cover your tracks and evade all of their traps.",

        choices: [
            {
                text: "Evade the Cult.",

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
     * Shub-Niggurath - Research Encounter 6 - Sea
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-6-sea",

        name: "Shub-Niggurath Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-6/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-6/Shub-Niggurath-Research-encounters-back-6.png",

        text:
            "One of the sailors tells you that you've been marked and must be purified by fire. He brands your skin. Lose 2 Health. You feel the pain break the dark influences that cling to you; gain this Clue and you may discard a Cursed or Dark Pact Condition.",

        choices: [
            {
                text: "Accept the purification.",

                effects: [
                    {
                        type: "lose-health",

                        amount: 2,
                    },

                    {
                        type: "gain-clues",

                        amount: 1,
                    },

                    {
                        type: "discard-condition",

                        conditionDefinitionIds: [
                            "condition-cursed",
                            "condition-dark-pact",
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 7 - City
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-7-city",

        name: "Shub-Niggurath Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-7/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-7/Shub-Niggurath-Research-encounters-back-7.png",

        text:
            "You identify an important member of the local government as a worshiper of the Black Goat and try to pressure him into revealing the cult's secrets.",

        choices: [
            {
                text: "Pressure him for information.",

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
     * Shub-Niggurath - Research Encounter 7 - Wilderness
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-7-wilderness",

        name: "Shub-Niggurath Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-7/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-7/Shub-Niggurath-Research-encounters-back-7.png",

        text:
            "A group of cultists have been eviscerated by some creature they summoned but could not control. You think you know a way to send the abomination back where it belongs.",

        choices: [
            {
                text: "Banish the abomination.",

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
                                type: "advance-doom",

                                amount: 1,
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

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 7 - Sea
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-7-sea",

        name: "Shub-Niggurath Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-7/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-7/Shub-Niggurath-Research-encounters-back-7.png",

        text:
            "The crew is gone, and all of the navigational equipment has been destroyed. You decide to search a nearby island.",

        choices: [
            {
                text: "Search the nearby island.",

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
                                    "condition-delayed",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 8 - City
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-8-city",

        name: "Shub-Niggurath Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-8/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-8/Shub-Niggurath-Research-encounters-back-8.png",

        text:
            "As he lies dying, the bleeding priest begs you to guard the sword. He tells you Brother Tristam and his Order will stop at nothing. If you make a solemn vow, he will give you his ancient blade. You may gain a Dark Pact Condition to gain this Clue and the Sword of Saint Jerome Artifact.",

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
                                            "sword-of-saint-jerome",
                                    },
                                ],
                            },

                            {
                                text: "Refuse the vow.",

                                effects: [],
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 8 - Wilderness
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-8-wilderness",

        name: "Shub-Niggurath Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-8/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-8/Shub-Niggurath-Research-encounters-back-8.png",

        text:
            "The locals in a small village are celebrating an ancient pagan holiday. Some of the songs and traditions seem to have occult significance.",

        choices: [
            {
                text: "Study the songs and traditions.",

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
                        ],

                        onFail: [
                            {
                                type: "combat",

                                monsterDefinitionId:
                                    "goat-spawn",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Shub-Niggurath - Research Encounter 8 - Sea
     * ============================================================
     */

    {
        id: "shub-niggurath-research-encounter-8-sea",

        name: "Shub-Niggurath Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-8/Shub-Niggurath-Research-encounters.png",

        backImage:
            "/cards/encounters/Research-encounters/Shub-Niggurath-Research-encounters-8/Shub-Niggurath-Research-encounters-back-8.png",

        text:
            "You can't shake the feeling that something is hunting you. You stay awake all night to watch for the threat.",

        choices: [
            {
                text: "Watch for the threat.",

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
                                type: "combat-random-monster",
                            },
                        ],
                    },
                ],
            },
        ],
    },

];