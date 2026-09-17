import type { EncounterDefinition } from "../../../game/models/Encounter";

export const researchEncountersAzaroth: EncounterDefinition[] = [
    /*
     * ============================================================
     * Azathoth - Research Encounter 1 - City
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-1-city",

        name: "Azathoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-1/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-1/Azathoth_Research-Encounter-back-1.png",

        text:
            "Inside a warehouse, you hear a clanging sound and discover a creature that resembles a metallic crate walking around on several legs. You try to follow the thing back to the cult's lair ([observation]-1). If you pass, gain this [clue] Clue and 1 additional Clue.",

        choices: [
            {
                text: "Follow the creature.",

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
     * Azathoth - Research Encounter 1 - Wilderness
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-1-wilderness",

        name: "Azathoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-1/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-1/Azathoth_Research-Encounter-back-1.png",

        text:
            "A meteor exploded in the air, scattering a glowing green powder. You try to find a sufficient amount of the compound ([observation]-1). If you pass, gain this [clue] Clue and move the Omen token to any space on the track without advancing Doom. If you fail, you are exposed to the terrible energy emanating from the substance; lose [health] 1 Health.",

        choices: [
            {
                text: "Search for the glowing compound.",

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
                                type: "move-omen",
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
     * Azathoth - Research Encounter 1 - Sea
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-1-sea",

        name: "Azathoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-1/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounter-1/Azathoth-Research-Encounter-back-1.png",

        text:
            "You overhear the navigator say that the stars are not as they should be. The ship is utterly lost. You believe you understand the significance of the new alignment of stars.",

        choices: [
            {
                text: "Interpret the new alignment of stars.",

                effects: [
                    {
                        type: "test",

                        testType: "lore",

                        onSuccess: [
                            {
                                type: "gain-clues",
                                amount: 2,
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
     * Azathoth - Research Encounter 2 - City
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-2-city",

        name: "Azathoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-2/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-2/Azathoth_Research-Encounter-back-2.png",

        text:
            "A few hours before the performance of the opera Massa di Requiem per Shuggay you have a chance to examine the libretto.",

        choices: [
            {
                text: "Examine the libretto.",

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
                                type: "place-eldritch-token-on-omen",
                                location: "green",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Azathoth - Research Encounter 2 - Wilderness
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-2-wilderness",

        name: "Azathoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-2/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-2/Azathoth_Research-Encounter-back-2.png",

        text:
            "Mi-go have dug up the meteor that you were seeking. Curious, you attempt to spy on them.",

        choices: [
            {
                text: "Spy on the mi-go.",

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
     * Azathoth - Research Encounter 2 - Sea
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-2-sea",

        name: "Azathoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-2/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-2/Azathoth_Research-Encounter-back-2.png",

        text:
            "Your ship is destroyed by a glowing rock that fell from the sky! Gain this Clue. You struggle to reach wreckage that can keep you afloat.",

        choices: [
            {
                text: "Reach the wreckage.",

                effects: [
                    {
                        type: "gain-clues",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "strength",

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

    /*
     * ============================================================
     * Azathoth - Research Encounter 3 - City
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-3-city",

        name: "Azathoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-3/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-3/Azathoth_Research-Encounter-back-3.png",

        text:
            "Scientists report that their sample of radium was stolen! Your investigation indicates a connection to worshippers of Azathoth.",

        choices: [
            {
                text: "Investigate the stolen radium.",

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
     * Azathoth - Research Encounter 3 - Wilderness
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-3-wilderness",

        name: "Azathoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-3/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-3/Azathoth_Research-Encounter-back-3.png",

        text:
            "An eerie mist surrounds you, and you find yourself in the court of Azathoth! Gain this Clue. Your mind can barely endure what you are seeing.",

        choices: [
            {
                text: "Endure the court of Azathoth.",

                effects: [
                    {
                        type: "gain-clues",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "discard-eldritch-token-from-omen",
                            },
                        ],

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

    /*
     * ============================================================
     * Azathoth - Research Encounter 3 - Sea
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-3-sea",

        name: "Azathoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-3/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-3/Azathoth_Research-Encounter-back-3.png",

        text:
            "You dream of floating through space, watching stars disappear. You try to recognize constellations so you'll remember which stars disappeared.",

        choices: [
            {
                text: "Study the constellations.",

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
                                type: "move-omen",
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
     * Azathoth - Research Encounter 4 - City
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-4-city",

        name: "Azathoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-4/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-4/Azathoth_Research-Encounter-back-4.png",

        text:
            "A team of geologists have disappeared after studying a chunk of rock that was retrieved from a nearby crater. You visit their lab and feel waves of strange energy emanating from the stone, eroding your body from the inside.",

        choices: [
            {
                text: "Examine the green stone.",

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
     * Azathoth - Research Encounter 4 - Wilderness
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-4-wilderness",

        name: "Azathoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-4/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-4/Azathoth_Research-Encounter-back-4.png",

        text:
            "This far away from city lights, you get an unparalleled view of the night sky. You comb the sky, hoping to catch sight of a meteor shower.",

        choices: [
            {
                text: "Search the night sky.",

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
                                type: "spawn-clues",
                                amount: 1,
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
     * Azathoth - Research Encounter 4 - Sea
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-4-sea",

        name: "Azathoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-4/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-4/Azathoth_Research-Encounter-back-4.png",

        text:
            "The Nemesis Moon, Ghroth, looms in the sky. You don't know why it's here, but you know that it is the harbinger of doom. Gain this Clue and place 1 Eldritch token on the green space of the Omen track.",

        choices: [
            {
                text: "Observe Ghroth.",

                effects: [
                    {
                        type: "gain-clues",
                        amount: 1,
                    },

                    {
                        type: "place-eldritch-token-on-omen",
                        location: "green",
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Azathoth - Research Encounter 5 - City
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-5-city",

        name: "Azathoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-5/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-5/Azathoth_Research-Encounter-back-5.png",

        text:
            "Doctors ask you to observe a trephination. They pull away a piece of his skull, and you examine the brain.",

        choices: [
            {
                text: "Examine the brain.",

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
                                type: "return-random-solved-mystery-to-deck",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Azathoth - Research Encounter 5 - Wilderness
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-5-wilderness",

        name: "Azathoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-5/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-5/Azathoth_Research-Encounter-back-5.png",

        text:
            "You discover a twenty-foot tall, gray metallic cone! Gain this Clue. You try to make sense of the alien technology inside.",

        choices: [
            {
                text: "Study the alien technology.",

                effects: [
                    {
                        type: "gain-clues",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "lore",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "discard-eldritch-token-from-omen",
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
     * Azathoth - Research Encounter 5 - Sea
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-5-sea",

        name: "Azathoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-5/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-5/Azathoth_Research-Encounter-back-5.png",

        text:
            "You wake up to find a large, winged creature in your cabin. It offers you an object to use in your fight against Azathoth. You may gain a Dark Pact Condition to gain this Clue and the T'tka Halot Artifact.",

        choices: [
            {
                text: "Accept the creature's offer.",

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
                                        type: "gain-artifact",
                                        artifactType:
                                            "t-tka-halot",
                                    },
                                ],
                            },

                            {
                                text: "Do not gain the Dark Pact.",

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
     * Azathoth - Research Encounter 6 - City
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-6-city",

        name: "Azathoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-6/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-6/Azathoth_Research-Encounter-back-6.png",

        text:
            "You attend a reading by Edward Pickman Derby from his book Azathoth and Other Horrors and ask him about the occult.",

        choices: [
            {
                text: "Ask Edward Pickman Derby about the occult.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "gain-clues",
                                amount: 1,
                            },
                        ],

                        onFail: [
                            {
                                type: "advance-omen",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Azathoth - Research Encounter 6 - Wilderness
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-6-wilderness",

        name: "Azathoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-6/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-6/Azathoth_Research-Encounter-back-6.png",

        text:
            "You examine an odd cave painting by torchlight. It depicts Azathoth sitting on a throne in the center of a starry spiral. You search for any signs of the painting's source.",

        choices: [
            {
                text: "Search for the painting's source.",

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
                                type: "advance-omen",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Azathoth - Research Encounter 6 - Sea
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-6-sea",

        name: "Azathoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-6/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-6/Azathoth_Research-Encounter-back-6.png",

        text:
            "You watch a meteor shower streak across the night sky.",

        choices: [
            {
                text: "Watch the meteor shower.",

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
                                type: "advance-omen",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
     * ============================================================
     * Azathoth - Research Encounter 7 - City
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-7-city",

        name: "Azathoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-7/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-7/Azathoth_Research-Encounter-back-7.png",

        text:
            "Something in your brain is manipulating your memories, trying to control you.",

        choices: [
            {
                text: "Resist the manipulation.",

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
     * Azathoth - Research Encounter 7 - Wilderness
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-7-wilderness",

        name: "Azathoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-7/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-7/Azathoth_Research-Encounter-back-7.png",

        text:
            "You ask the villagers about their peculiar folklore.",

        choices: [
            {
                text: "Ask about the villagers' folklore.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

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
            },
        ],
    },

    /*
     * ============================================================
     * Azathoth - Research Encounter 7 - Sea
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-7-sea",

        name: "Azathoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-7/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-7/Azathoth_Research-Encounter-back-7.png",

        text:
            "A volcano throws smoke and burning ash into the air. Despite the toxic fumes, you force yourself to continue watching.",

        choices: [
            {
                text: "Continue watching the volcano.",

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
     * Azathoth - Research Encounter 8 - City
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-8-city",

        name: "Azathoth Research Encounter",

        type: "city",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-8/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-8/Azathoth_Research-Encounter-back-8.png",

        text:
            "The university allows you to use its telescope to search for signs of a green comet.",

        choices: [
            {
                text: "Search for the green comet.",

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
     * Azathoth - Research Encounter 8 - Wilderness
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-8-wilderness",

        name: "Azathoth Research Encounter",

        type: "wilderness",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-8/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-8/Azathoth_Research-Encounter-back-8.png",

        text:
            "Something attacks you in the dark. Lose 1 Health. To your eyes, there's nothing around you but trees.",

        choices: [
            {
                text: "Search the trees.",

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
     * Azathoth - Research Encounter 8 - Sea
     * ============================================================
     */

    {
        id: "azathoth-research-encounter-8-sea",

        name: "Azathoth Research Encounter",

        type: "sea",

        region: "research",

        frontImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-8/Azathoth_Research-Encounter.png",

        backImage:
            "/cards/encounters/Research-encounters/Azathoth-Research-encounters-8/Azathoth_Research-Encounter-back-8.png",

        text:
            "A pale, blubbery-looking sailor tells you of a dream he's been having about a green stone at the bottom of the ocean. Gain this Clue. You try to use his description to determine the actual location.",

        choices: [
            {
                text: "Determine the location of the green stone.",

                effects: [
                    {
                        type: "gain-clues",
                        amount: 1,
                    },

                    {
                        type: "test",
                        testType: "observation",

                        onSuccess: [
                            {
                                type: "move-omen",
                            },
                        ],

                        onFail: [],
                    },
                ],
            },
        ],
    },

]