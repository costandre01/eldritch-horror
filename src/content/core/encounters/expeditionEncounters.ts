import type { EncounterDefinition } from "../../../game/models/Encounter";

export const expeditionEncounters: EncounterDefinition[] = [

    /*
     * ============================================================
     * THE AMAZON
     * ============================================================
     */

    {
        id: "the-amazon-expedition-encounter-1",

        name: "The Amazon",

        frontImage:
            "/cards/encounters/Expedition-Encounters/The-Amazon-Expedition-Encounters-1/The-Amazon-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/The-Amazon-Expedition-Encounters-1/The-Amazon-Expedition-Encounters-back-1.png",

        effects: [
            {
                type: "test",
                testType: "strength",

                onSuccess: [
                    {
                        type: "retreat-doom",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "lore",

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

                onFail: [
                    {
                        type: "lose-health",
                        amount: 1,
                    },

                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-internal-injury",
                    },

                    {
                        type: "test",
                        testType: "observation",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "retreat-doom",
                                amount: 1,
                            },
                        ],

                        onFail: [],
                    },
                ],
            },
        ],
    },

    {
        id: "the-amazon-expedition-encounter-2",

        name: "The Amazon",

        frontImage:
            "/cards/encounters/Expedition-Encounters/The-Amazon-Expedition-Encounters-2/The-Amazon-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/The-Amazon-Expedition-Encounters-2/The-Amazon-Expedition-Encounters-back-2.png",

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
                                type: "gain-artifact",
                                amount: 1,
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

    {
        id: "the-amazon-expedition-encounter-3",

        name: "The Amazon",

        frontImage:
            "/cards/encounters/Expedition-Encounters/The-Amazon-Expedition-Encounters-3/The-Amazon-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/The-Amazon-Expedition-Encounters-3/The-Amazon-Expedition-Encounters-back-3.png",

        effects: [
            {
                type: "test",
                testType: "strength",

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
                                type: "gain-clues",
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

                onFail: [
                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-leg-injury",
                    },

                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "gain-artifact",
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
     * ANTARCTICA
     * ============================================================
     */

    {
        id: "antarctica-expedition-encounter-1",

        name: "Antarctica",

        frontImage:
            "/cards/encounters/Expedition-Encounters/Antarctica-Expedition-Encounters-1/Antarctica-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/Antarctica-Expedition-Encounters-1/Antarctica-Expedition-Encounters-back-1.png",

        effects: [
            {
                type: "test",
                testType: "strength",

                onSuccess: [
                    {
                        type: "retreat-doom",
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
                                    "condition-amnesia",
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
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-back-injury",
                    },

                    {
                        type: "test",
                        testType: "observation",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "retreat-doom",
                                amount: 1,
                            },
                        ],

                        onFail: [],
                    },
                ],
            },
        ],
    },

    {
        id: "antarctica-expedition-encounter-2",

        name: "Antarctica",

        frontImage:
            "/cards/encounters/Expedition-Encounters/Antarctica-Expedition-Encounters-2/Antarctica-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/Antarctica-Expedition-Encounters-2/Antarctica-Expedition-Encounters-back-2.png",

        effects: [
            {
                type: "test",
                testType: "observation",

                onSuccess: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "gain-artifact",
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

                onFail: [
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
        id: "antarctica-expedition-encounter-3",

        name: "Antarctica",

        frontImage:
            "/cards/encounters/Expedition-Encounters/Antarctica-Expedition-Encounters-3/Antarctica-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/Antarctica-Expedition-Encounters-3/Antarctica-Expedition-Encounters-back-3.png",

        effects: [
            {
                type: "test",
                testType: "strength",

                onSuccess: [
                    {
                        type: "gain-artifact",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "observation",
                        modifier: -1,

                        onSuccess: [],

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
                            "condition-leg-injury",
                    },

                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "gain-artifact",
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
     * THE HEART OF AFRICA
     * ============================================================
     */

    {
        id: "the-heart-of-africa-expedition-encounter-1",

        name: "The Heart of Africa",

        frontImage:
            "/cards/encounters/Expedition-Encounters/The-Heart-of-Africa-Expedition-Encounters-1/The-Heart-of-Africa-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/The-Heart-of-Africa-Expedition-Encounters-1/The-Heart-of-Africa-Expedition-Encounters-back-1.png",

        effects: [
            {
                type: "test",
                testType: "strength",

                onSuccess: [
                    {
                        type: "retreat-doom",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "lore",

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

                onFail: [
                    {
                        type: "lose-health",
                        amount: 1,
                    },

                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-back-injury",
                    },

                    {
                        type: "test",
                        testType: "observation",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "retreat-doom",
                                amount: 1,
                            },
                        ],

                        onFail: [],
                    },
                ],
            },
        ],
    },

    {
        id: "the-heart-of-africa-expedition-encounter-2",

        name: "The Heart of Africa",

        frontImage:
            "/cards/encounters/Expedition-Encounters/The-Heart-of-Africa-Expedition-Encounters-2/The-Heart-of-Africa-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/The-Heart-of-Africa-Expedition-Encounters-2/The-Heart-of-Africa-Expedition-Encounters-back-2.png",

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
                                type: "gain-artifact",
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

                onFail: [
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
        id: "the-heart-of-africa-expedition-encounter-3",

        name: "The Heart of Africa",

        frontImage:
            "/cards/encounters/Expedition-Encounters/The-Heart-of-Africa-Expedition-Encounters-3/The-Heart-of-Africa-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/The-Heart-of-Africa-Expedition-Encounters-3/The-Heart-of-Africa-Expedition-Encounters-back-3.png",

        effects: [
            {
                type: "test",
                testType: "strength",

                onSuccess: [
                    {
                        type: "gain-artifact",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "observation",
                        modifier: -1,

                        onSuccess: [],

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
                            "condition-leg-injury",
                    },

                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "gain-artifact",
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
     * THE HIMALAYAS
     * ============================================================
     */

    {
        id: "the-himalayas-expedition-encounter-1",

        name: "The Himalayas",

        frontImage:
            "/cards/encounters/Expedition-Encounters/The-Himalayas-Expedition-Encounters-1/The-Himalayas-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/The-Himalayas-Expedition-Encounters-1/The-Himalayas-Expedition-Encounters-back-1.png",

        effects: [
            {
                type: "spawn-monster",
                amount: 1,
                location: "same-space",
            },

            {
                type: "test",
                testType: "lore",

                onSuccess: [
                    {
                        type: "retreat-doom",
                        amount: 1,
                    },
                ],

                onFail: [
                    {
                        type: "lose-sanity",
                        amount: 2,
                    },
                ],
            },

            {
                type: "test",
                testType: "observation",

                onSuccess: [
                    {
                        type: "retreat-doom",
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

    {
        id: "the-himalayas-expedition-encounter-2",

        name: "The Himalayas",

        frontImage:
            "/cards/encounters/Expedition-Encounters/The-Himalayas-Expedition-Encounters-2/The-Himalayas-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/The-Himalayas-Expedition-Encounters-2/The-Himalayas-Expedition-Encounters-back-2.png",

        effects: [
            {
                type: "test",
                testType: "observation",

                onSuccess: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "gain-artifact",
                                amount: 1,
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
        id: "the-himalayas-expedition-encounter-3",

        name: "The Himalayas",

        frontImage:
            "/cards/encounters/Expedition-Encounters/The-Himalayas-Expedition-Encounters-3/The-Himalayas-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/The-Himalayas-Expedition-Encounters-3/The-Himalayas-Expedition-Encounters-back-3.png",

        effects: [
            {
                type: "test",
                testType: "strength",

                onSuccess: [
                    {
                        type: "gain-artifact",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "lore",
                        modifier: -1,

                        onSuccess: [],

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
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "gain-artifact",
                                amount: 1,
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
     * THE PYRAMIDS
     * ============================================================
     */

    {
        id: "the-pyramids-expedition-encounter-1",

        name: "The Pyramids",

        frontImage:
            "/cards/encounters/Expedition-Encounters/The-Pyramids-Expedition-Encounters-1/The-Pyramids-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/The-Pyramids-Expedition-Encounters-1/The-Pyramids-Expedition-Encounters-back-1.png",

        effects: [
            {
                type: "test",
                testType: "strength",

                onSuccess: [
                    {
                        type: "retreat-doom",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "lore",

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

                onFail: [
                    {
                        type: "lose-health",
                        amount: 1,
                    },

                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-internal-injury",
                    },

                    {
                        type: "test",
                        testType: "observation",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "retreat-doom",
                                amount: 1,
                            },
                        ],

                        onFail: [],
                    },
                ],
            },
        ],
    },

    {
        id: "the-pyramids-expedition-encounter-2",

        name: "The Pyramids",

        frontImage:
            "/cards/encounters/Expedition-Encounters/The-Pyramids-Expedition-Encounters-2/The-Pyramids-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/The-Pyramids-Expedition-Encounters-2/The-Pyramids-Expedition-Encounters-back-2.png",

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
                                type: "gain-artifact",
                                amount: 1,
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
                                type: "lose-health",
                                amount: 1,
                            },

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
        id: "the-pyramids-expedition-encounter-3",

        name: "The Pyramids",

        frontImage:
            "/cards/encounters/Expedition-Encounters/The-Pyramids-Expedition-Encounters-3/The-Pyramids-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/The-Pyramids-Expedition-Encounters-3/The-Pyramids-Expedition-Encounters-back-3.png",

        effects: [
            {
                type: "test",
                testType: "strength",

                onSuccess: [
                    {
                        type: "gain-artifact",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "observation",
                        modifier: -1,

                        onSuccess: [],

                        onFail: [
                            {
                                type: "lose-health",
                                amount: 1,
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
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "gain-artifact",
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
     * TUNGUSKA
     * ============================================================
     */

    {
        id: "tunguska-expedition-encounter-1",

        name: "Tunguska",

        frontImage:
            "/cards/encounters/Expedition-Encounters/Tunguska-Expedition-Encounters-1/Tunguska-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/Tunguska-Expedition-Encounters-1/Tunguska-Expedition-Encounters-back-1.png",

        effects: [
            {
                type: "test",
                testType: "strength",

                onSuccess: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "retreat-doom",
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

                onFail: [
                    {
                        type: "lose-health",
                        amount: 1,
                    },

                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-leg-injury",
                    },

                    {
                        type: "test",
                        testType: "observation",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "retreat-doom",
                                amount: 1,
                            },
                        ],

                        onFail: [],
                    },
                ],
            },
        ],
    },

    {
        id: "tunguska-expedition-encounter-2",

        name: "Tunguska",

        frontImage:
            "/cards/encounters/Expedition-Encounters/Tunguska-Expedition-Encounters-2/Tunguska-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/Tunguska-Expedition-Encounters-2/Tunguska-Expedition-Encounters-back-2.png",

        effects: [
            {
                type: "test",
                testType: "observation",

                onSuccess: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "gain-artifact",
                                amount: 1,
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

    {
        id: "tunguska-expedition-encounter-3",

        name: "Tunguska",

        frontImage:
            "/cards/encounters/Expedition-Encounters/Tunguska-Expedition-Encounters-3/Tunguska-Expedition-Encounters.png",

        backImage:
            "/cards/encounters/Expedition-Encounters/Tunguska-Expedition-Encounters-3/Tunguska-Expedition-Encounters-back-3.png",

        effects: [
            {
                type: "test",
                testType: "strength",

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
                                type: "gain-clues",
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

                onFail: [
                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-internal-injury",
                    },

                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "gain-artifact",
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
];