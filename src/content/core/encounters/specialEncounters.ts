import type { EncounterDefinition } from "../../../game/models/Encounter";

export const specialEncounters: EncounterDefinition[] = [

    /*
     * ============================================================
     * THE KEY AND THE GATE
     * ============================================================
     */

    {
        id: "the-key-and-the-gate-special-encounter-1",

        name: "The Key and the Gate",

        frontImage:
            "/cards/encounters/special-Encounters/The-Key-and-the-Gate-special-Encounters-1/The-Key-and-the-Gate-special-Encounters.png",

        backImage:
            "/cards/encounters/special-Encounters/The-Key-and-the-Gate-special-Encounters-1/The-Key-and-the-Gate-special-Encounters-back-1.png",

        effects: [
            {
                type: "test",
                testType: "will",
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
                                        text: "Discard 1 Spell to place 1 Eldritch Token on the Ancient One sheet.",
                                        effects: [
                                            {
                                                type: "discard-spell",
                                            },
                                            {
                                                type: "place-eldritch-token",
                                                amount: 1,
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
                                type: "lose-sanity",
                                amount: 3,
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "devoured",
                    },
                ],
            },
        ],
    },

    {
        id: "the-key-and-the-gate-special-encounter-2",

        name: "The Key and the Gate",

        frontImage:
            "/cards/encounters/special-Encounters/The-Key-and-the-Gate-special-Encounters-2/The-Key-and-the-Gate-special-Encounters.png",

        backImage:
            "/cards/encounters/special-Encounters/The-Key-and-the-Gate-special-Encounters-2/The-Key-and-the-Gate-special-Encounters-back-2.png",

        effects: [
            {
                type: "test",
                testType: "will",
                modifier: -1,

                onSuccess: [
                    {
                        type: "test",
                        testType: "influence",
                        minSuccesses: 3,

                        onSuccess: [
                            {
                                type: "choice",
                                choices: [
                                    {
                                        text: "Return home and place 1 Eldritch Token.",
                                        effects: [
                                            {
                                                type: "move-to-nearest-space",
                                                targetSpaceType: "city",
                                            },
                                            {
                                                type: "place-eldritch-token",
                                                amount: 1,
                                            },
                                        ],
                                    },
                                    {
                                        text: "Do not return home.",
                                        effects: [],
                                    },
                                ],
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

                onFail: [
                    {
                        type: "devoured",
                    },
                ],
            },
        ],
    },

    {
        id: "the-key-and-the-gate-special-encounter-3",

        name: "The Key and the Gate",

        frontImage:
            "/cards/encounters/special-Encounters/The-Key-and-the-Gate-special-Encounters-3/The-Key-and-the-Gate-special-Encounters.png",

        backImage:
            "/cards/encounters/special-Encounters/The-Key-and-the-Gate-special-Encounters-3/The-Key-and-the-Gate-special-Encounters-back-3.png",

        effects: [
            {
                type: "test",
                testType: "observation",
                modifier: -1,

                onSuccess: [
                    {
                        type: "test",
                        testType: "strength",
                        minSuccesses: 3,

                        onSuccess: [
                            {
                                type: "place-eldritch-token",
                                amount: 1,
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

                onFail: [
                    {
                        type: "devoured",
                    },
                ],
            },
        ],
    },

    {
        id: "the-key-and-the-gate-special-encounter-4",

        name: "The Key and the Gate",

        frontImage:
            "/cards/encounters/special-Encounters/The-Key-and-the-Gate-special-Encounters-4/The-Key-and-the-Gate-special-Encounters.png",

        backImage:
            "/cards/encounters/special-Encounters/The-Key-and-the-Gate-special-Encounters-4/The-Key-and-the-Gate-special-Encounters-back-4.png",

        effects: [
            {
                type: "test",
                testType: "strength",
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
                                        text: "Gain Amnesia to place 1 Eldritch Token.",
                                        effects: [
                                            {
                                                type: "gain-condition",
                                                conditionDefinitionId:
                                                    "condition-amnesia",
                                            },
                                            {
                                                type: "place-eldritch-token",
                                                amount: 1,
                                            },
                                        ],
                                    },
                                    {
                                        text: "Do not gain Amnesia.",
                                        effects: [],
                                    },
                                ],
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

                onFail: [
                    {
                        type: "devoured",
                    },
                ],
            },
        ],
    },

    {
        id: "the-key-and-the-gate-special-encounter-5",

        name: "The Key and the Gate",

        frontImage:
            "/cards/encounters/special-Encounters/The-Key-and-the-Gate-special-Encounters-5/The-Key-and-the-Gate-special-Encounters.png",

        backImage:
            "/cards/encounters/special-Encounters/The-Key-and-the-Gate-special-Encounters-5/The-Key-and-the-Gate-special-Encounters-back-5.png",

        effects: [
            {
                type: "test",
                testType: "lore",
                modifier: -1,

                onSuccess: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "place-eldritch-token",
                                amount: 1,
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

                onFail: [
                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-cursed",
                    },
                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-madness",
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

    {
        id: "the-key-and-the-gate-special-encounter-6",

        name: "The Key and the Gate",

        frontImage:
            "/cards/encounters/special-Encounters/The-Key-and-the-Gate-special-Encounters-6/The-Key-and-the-Gate-special-Encounters.png",

        backImage:
            "/cards/encounters/special-Encounters/The-Key-and-the-Gate-special-Encounters-6/The-Key-and-the-Gate-special-Encounters-back-6.png",

        effects: [
            {
                type: "test",
                testType: "lore",
                modifier: -1,

                onSuccess: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "place-eldritch-token",
                                amount: 1,
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

                onFail: [
                    {
                        type: "gain-spell",
                        amount: 2,
                    },

                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-dark-pact",
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * R'LYEH RISEN
     * ============================================================
     */

    {
        id: "rlyeh-risen-special-encounter-1",

        name: "R'lyeh Risen",

        frontImage:
            "/cards/encounters/special-Encounters/R'lyeh-Risen-special-Encounters-1/R'lyeh-Risen-special-Encounters.png",

        backImage:
            "/cards/encounters/special-Encounters/R'lyeh-Risen-special-Encounters-1/R'lyeh-Risen-special-Encounters-back-1.png",

        effects: [
            {
                type: "test",
                testType: "lore",
                modifier: -1,

                onSuccess: [
                    {
                        type: "test",
                        testType: "influence",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "place-eldritch-token",
                                amount: 1,
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

                onFail: [
                    {
                        type: "retreat-doom",
                        amount: 1,
                    },
                ],
            },
        ],
    },

    {
        id: "rlyeh-risen-special-encounter-2",

        name: "R'lyeh Risen",

        frontImage:
            "/cards/encounters/special-Encounters/R'lyeh-Risen-special-Encounters-2/R'lyeh-Risen-special-Encounters.png",

        backImage:
            "/cards/encounters/special-Encounters/R'lyeh-Risen-special-Encounters-2/R'lyeh-Risen-special-Encounters-back-2.png",

        effects: [
            {
                type: "test",
                testType: "strength",
                modifier: -1,

                onSuccess: [
                    {
                        type: "test",
                        testType: "observation",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "place-eldritch-token",
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

    {
        id: "rlyeh-risen-special-encounter-3",

        name: "R'lyeh Risen",

        frontImage:
            "/cards/encounters/special-Encounters/R'lyeh-Risen-special-Encounters-3/R'lyeh-Risen-special-Encounters.png",

        backImage:
            "/cards/encounters/special-Encounters/R'lyeh-Risen-special-Encounters-3/R'lyeh-Risen-special-Encounters-back-3.png",

        effects: [
            {
                type: "test",
                testType: "will",
                modifier: -1,

                onSuccess: [
                    {
                        type: "test",
                        testType: "lore",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "place-eldritch-token",
                                amount: 1,
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

                onFail: [
                    {
                        type: "lose-sanity",
                        amount: 3,
                    },
                ],
            },
        ],
    },

    {
        id: "rlyeh-risen-special-encounter-4",

        name: "R'lyeh Risen",

        frontImage:
            "/cards/encounters/special-Encounters/R'lyeh-Risen-special-Encounters-4/R'lyeh-Risen-special-Encounters.png",

        backImage:
            "/cards/encounters/special-Encounters/R'lyeh-Risen-special-Encounters-4/R'lyeh-Risen-special-Encounters-back-4.png",

        effects: [
            {
                type: "test",
                testType: "strength",
                modifier: -1,

                onSuccess: [
                    {
                        type: "test",
                        testType: "will",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "place-eldritch-token",
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
                        type: "lose-health",
                        amount: 3,
                    },
                ],
            },
        ],
    },

    {
        id: "rlyeh-risen-special-encounter-5",

        name: "R'lyeh Risen",

        frontImage:
            "/cards/encounters/special-Encounters/R'lyeh-Risen-special-Encounters-5/R'lyeh-Risen-special-Encounters.png",

        backImage:
            "/cards/encounters/special-Encounters/R'lyeh-Risen-special-Encounters-5/R'lyeh-Risen-special-Encounters-back-5.png",

        effects: [
            {
                type: "test",
                testType: "observation",
                modifier: -1,

                onSuccess: [
                    {
                        type: "test",
                        testType: "lore",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "place-eldritch-token",
                                amount: 1,
                            },
                        ],

                        onFail: [
                            {
                                type: "lose-health",
                                amount: 3,
                            },
                        ],
                    },
                ],

                onFail: [
                    {
                        type: "lose-health",
                        amount: 3,
                    },
                ],
            },
        ],
    },

    {
        id: "rlyeh-risen-special-encounter-6",

        name: "R'lyeh Risen",

        frontImage:
            "/cards/encounters/special-Encounters/R'lyeh-Risen-special-Encounters-6/R'lyeh-Risen-special-Encounters.png",

        backImage:
            "/cards/encounters/special-Encounters/R'lyeh-Risen-special-Encounters-6/R'lyeh-Risen-special-Encounters-back-6.png",

        effects: [
            {
                type: "lose-sanity",
                amount: 1,
            },

            {
                type: "test",
                testType: "observation",
                modifier: -1,

                onSuccess: [
                    {
                        type: "test",
                        testType: "lore",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "place-eldritch-token",
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

                    {
                        type: "test",
                        testType: "lore",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "place-eldritch-token",
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
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-leg-injury",
                    },

                    {
                        type: "spawn-monster",
                        amount: 1,
                        location: "same-space",
                    },
                ],
            },
        ],
    },
];