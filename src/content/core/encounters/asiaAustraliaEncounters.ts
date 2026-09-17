import type { EncounterDefinition } from "../../../game/models/Encounter";

export const asiaAustraliaEncounters: EncounterDefinition[] = [

    /*
   * ============================================================
   * Shanghai
   * ============================================================
   */

    {
        id: "asia-australia-encounter-1-shanghai",

        name: "Shanghai",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-1/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-1/Asia-Australia_Encounter-back-1.png",

        text:
            "You search through old copies of The Shanghai Courier to find strange or unexplained stories [observation]. If you pass, you discover a pattern of arcane activity in the city; improve [lore]. If you fail, lose [sanity] 1 Sanity as no pattern emerges from all this horror.",

        choices: [
            {
                text: "Search the old newspapers.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",

                        onSuccess: [
                            {
                                type: "improve-skill",
                                skillType: "lore",
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
        id: "asia-australia-encounter-2-shanghai",

        name: "Shanghai",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-2/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-2/Asia-Australia_Encounter-back-2.png",

        text:
            "If you can convince Chu Min to help, he will use New China's vast resources to provide you with any sort of instruction you require [influence]. If you pass, improve 1 skill of your choice. If you fail, lose [health] 1 Health as his men force you out onto the street.",

        choices: [
            {
                text: "Convince Chu Min to help.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "improve-skill",
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
        id: "asia-australia-encounter-3-shanghai",

        name: "Shanghai",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-3/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-3/Asia-Australia_Encounter-back-3.png",

        text:
            "The shrine holds an abundance of ancient relics. Improve [lore]. Your eye catches strange figures written on the ceiling. You find it hard to look away [will]. If you fail, the writing seems to move on its own; gain a Hallucinations Condition.",

        choices: [
            {
                text: "Study the strange writing.",

                effects: [
                    {
                        type: "improve-skill",
                        skillType: "lore",
                    },

                    {
                        type: "test",
                        testType: "will",

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
        id: "asia-australia-encounter-4-shanghai",

        name: "Shanghai",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-4/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-4/Asia-Australia_Encounter-back-4.png",

        text:
            "The Shanghai Museum recommends you speak to Mu Hsien, a preeminent scholar of the occult. You send him a message that you hope will convince him to help [influence]. If you pass, improve [lore] as he shares his wealth of knowledge.",

        choices: [
            {
                text: "Convince Mu Hsien to help.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "improve-skill",
                                skillType: "lore",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "asia-australia-encounter-5-shanghai",

        name: "Shanghai",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-5/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-5/Asia-Australia_Encounter-back-5.png",

        text:
            "The decadent crime lord, Lin Tang-Yu, offers you access to his library of occult treasures in exchange for information. You may spend [clue] 1 Clue to improve [lore].",

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
                        skillType: "lore",
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
        id: "asia-australia-encounter-6-shanghai",

        name: "Shanghai",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-6/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-6/Asia-Australia_Encounter-back-6.png",

        text:
            "You break into a warehouse filled with ancient wonders and learn much by studying its content. Improve [lore]. You must remain silent to avoid being caught [observation]. If you fail, they question you for days; become Delayed.",

        choices: [
            {
                text: "Search the warehouse.",

                effects: [
                    {
                        type: "improve-skill",
                        skillType: "lore",
                    },

                    {
                        type: "test",
                        testType: "observation",

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
        id: "asia-australia-encounter-7-shanghai",

        name: "Shanghai",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-7/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-7/Asia-Australia_Encounter-back-7.png",

        text:
            "The old man offers to make tea for you. You see him mix in a strange, green powder that he calls \"tyuk\". You may become Delayed to wait for it to brew. If you become Delayed, the tyuk seems to heighten all of your senses; improve 1 skill of your choice.",

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
        id: "asia-australia-encounter-8-shanghai",

        name: "Shanghai",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-8/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-8/Asia-Australia_Encounter-back-8.png",

        text:
            "You spot an odd, fish-like man pull a young monk underwater! You dive in to rescue him, holding your breath as long as you can [strength]. If you pass, the grateful monk prays over you; gain a Blessed Condition. If you fail, you are implicated in his disappearance; gain a Detained Condition.",

        choices: [
            {
                text: "Rescue the young monk.",

                effects: [
                    {
                        type: "test",
                        testType: "strength",

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

    /*
   * ============================================================
   * Tokyo
   * ============================================================
   */

    {
        id: "asia-australia-encounter-1-tokyo",

        name: "Tokyo",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-1/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-1/Asia-Australia_Encounter-back-1.png",

        text:
            "You ask the enigmatic Dragon Lords to rid the world of potential threats to Japan [influence]. If you pass, each Monster on a space of your choice loses 2 Health as the mysterious group casts their spells. If you fail, the Dragon Lords lash out at you; gain a Back Injury Condition.",

        choices: [
            {
                text: "Ask the Dragon Lords for help.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "lose-monster-health",
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
        id: "asia-australia-encounter-2-tokyo",

        name: "Tokyo",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-2/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-2/Asia-Australia_Encounter-back-2.png",

        text:
            "You may become Delayed to explore some submerged pyramids off the coast of Okinawa. If you do, you discover ancient writing that claims to harm one's enemies; 1 Monster of your choice on any space loses 3 Health.",

        choices: [
            {
                text: "Become Delayed to explore the pyramids.",

                effects: [
                    {
                        type: "become-delayed",
                    },

                    {
                        type: "lose-monster-health",
                        amount: 3,
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
        id: "asia-australia-encounter-3-tokyo",

        name: "Tokyo",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-3/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-3/Asia-Australia_Encounter-back-3.png",

        text:
            "You find a gem bearing the symbol of the Emerald Lama. In its facets, you see the image of some horrible beast. Suddenly, the creature is right next to you! Choose 1 non-Epic Monster on any space and move it to your space, then encounter it.",

        choices: [
            {
                text: "Face the creature.",

                effects: [
                    {
                        type: "move-monster-to-space",
                    },
                ],
            },
        ],
    },

    {
        id: "asia-australia-encounter-4-tokyo",

        name: "Tokyo",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-4/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-4/Asia-Australia_Encounter-back-4.png",

        text:
            "The reigning Emperor has been plagued by nightmares. His advisors ask your opinion and you assure them that these horrors are real [influence]. If you pass, they act immediately; 1 Monster of your choice on any space loses 2 Health. If you fail, gain a Detained Condition.",

        choices: [
            {
                text: "Convince the Emperor's advisors.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "lose-selected-monster-health",
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
        id: "asia-australia-encounter-5-tokyo",

        name: "Tokyo",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-5/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-5/Asia-Australia_Encounter-back-5.png",

        text:
            "Captain Isoge Taro of the Imperial Japanese Navy takes particular interest in your investigations. You describe the threats that the world is facing ([influence]-1). If you pass, you convince him to help you; 1 Monster of your choice on any space loses 3 Health. If you fail, he is convinced that you are a dangerous menace; gain a Detained Condition.",

        choices: [
            {
                text: "Convince Captain Isoge Taro.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "lose-selected-monster-health",
                                amount: 3,
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
        id: "asia-australia-encounter-6-tokyo",

        name: "Tokyo",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-6/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-6/Asia-Australia_Encounter-back-6.png",

        text:
            "The Brotherhood of the Black Lotus has poisoned you! You fall into a coma and confront your greatest fears [will]. If you pass, you awake and feel transformed; gain a Blessed Condition. If you fail, the nightmares follow you into the waking world; gain a Hallucinations Condition.",

        choices: [
            {
                text: "Confront your greatest fears.",

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
                                    "condition-hallucinations",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "asia-australia-encounter-7-tokyo",

        name: "Tokyo",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-7/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-7/Asia-Australia_Encounter-back-7.png",

        text:
            "A strange man dressed in the charred robes of a monk offers you help in exchange for knowledge. You may spend [clue] 1 Clue to convince the Black Monk to assist you and discard 1 Monster of your choice from any space.",

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
                        type: "discard-monster",
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
        id: "asia-australia-encounter-8-tokyo",

        name: "Tokyo",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-8/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-8/Asia-Australia_Encounter-back-8.png",

        text:
            "A translation of The Tao of Immortality is kept in the Tokyo University Library. If you are deemed trustworthy, you are granted access to the ancient text [influence]. If you pass, you can use the arcane manual to move 1 Monster of your choice from any space to another space of your choice.",

        choices: [
            {
                text: "Convince the library to trust you.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "move-monster",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    /*
   * ============================================================
   * Sydney
   * ============================================================
   */

    {
        id: "asia-australia-encounter-1-sydney",

        name: "Sydney",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-1/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-1/Asia-Australia_Encounter-back-1.png",

        text:
            "You dream of crossing a vast desert hunted by an enormous winged creature. In the dream, you turn to face your fears [will]. If you pass, you wake up feeling more alive than ever; improve [strength]. If you fail, the fear lingers; lose [sanity] 1 Sanity.",

        choices: [
            {
                text: "Face your fears.",

                effects: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "improve-skill",
                                skillType: "strength",
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
        id: "asia-australia-encounter-2-sydney",

        name: "Sydney",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-2/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-2/Asia-Australia_Encounter-back-2.png",

        text:
            "A group of hunters provide you with the skills to track down a bunyip. Improve [strength]. When you find the massive four-legged creature, your weapons cannot pierce its leathery hide. You try to protect yourself from the beast's terrible claws and teeth ([strength]-1). If you fail, lose [health] 2 Health.",

        choices: [
            {
                text: "Protect yourself from the bunyip.",

                effects: [
                    {
                        type: "improve-skill",
                        skillType: "strength",
                    },

                    {
                        type: "test",
                        testType: "strength",
                        modifier: -1,

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
        id: "asia-australia-encounter-3-sydney",

        name: "Sydney",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-3/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-3/Asia-Australia_Encounter-back-3.png",

        text:
            "Your money and passport have been stolen! You work on the Sydney Harbor Bridge to pay the bills. Improve [strength] as you meet the job's rigorous demands. When your passport is found at the scene of a crime, you need to prove your innocence [influence]. If you fail, gain a Detained Condition.",

        choices: [
            {
                text: "Prove your innocence.",

                effects: [
                    {
                        type: "improve-skill",
                        skillType: "strength",
                    },

                    {
                        type: "test",
                        testType: "influence",

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
        id: "asia-australia-encounter-4-sydney",

        name: "Sydney",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-4/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-4/Asia-Australia_Encounter-back-4.png",

        text:
            "Several passengers on an underground train have been trapped by a tunnel collapse. The dark and claustrophobic climb through the rubble is terrifying [will]. If you pass, your nerves hold out enough to help dig a clear path for the survivors; improve [strength]. If you fail, lose [sanity] 1 Sanity.",

        choices: [
            {
                text: "Climb through the rubble.",

                effects: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "improve-skill",
                                skillType: "strength",
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
        id: "asia-australia-encounter-5-sydney",

        name: "Sydney",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-5/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-5/Asia-Australia_Encounter-back-5.png",

        text:
            "The Theosophical Society is excited to hear what knowledge you have gained during your travels. You may spend [clue] 1 Clue. If you do, they gratefully provide you with an exercise and diet regimen that fortifies your vitality; improve [strength].",

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
                        skillType: "strength",
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
        id: "asia-australia-encounter-6-sydney",

        name: "Sydney",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-6/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-6/Asia-Australia_Encounter-back-6.png",

        text:
            "Due to a city-wide shortage of supplies, shopkeepers won't even show you their wares unless you prove that you can pay top dollar ([influence]-1). If you pass, gain 1 random Weapon Asset from the deck. If you fail, you are roped into a devious scheme; gain a Debt Condition.",

        choices: [
            {
                text: "Prove that you can pay.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "gain-weapon",
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
        id: "asia-australia-encounter-7-sydney",

        name: "Sydney",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-7/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-7/Asia-Australia_Encounter-back-7.png",

        text:
            "An old, aboriginal man is on trial for a murder that you know he didn't commit. You agree to testify to prove his innocence [influence]. If you pass, he speaks to the spirits on your behalf; gain a Blessed Condition. If you fail, you are accused of perjury; gain a Detained Condition.",

        choices: [
            {
                text: "Testify to prove his innocence.",

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
        id: "asia-australia-encounter-8-sydney",

        name: "Sydney",

        type: "city",

        region: "asia-australia",

        frontImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-8/Asia-Australia_Encounter.png",

        backImage:
            "/cards/encounters/Asia-Australia/Asia-Australia_Encounter-8/Asia-Australia_Encounter-back-8.png",

        text:
            "The constable sees you admire the abandoned weapon. \"Give it a bit to see if anyone claims it,\" he says. \"If not, you can help yourself.\" You may become Delayed to gain 1 random Weapon Asset from the deck.",

        choices: [
            {
                text: "Become Delayed.",

                effects: [
                    {
                        type: "become-delayed",
                    },
                    {
                        type: "gain-weapon",
                    },
                ],
            },

            {
                text: "Do not become Delayed.",

                effects: [],
            },
        ],
    },
]