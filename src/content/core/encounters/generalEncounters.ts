import type { EncounterDefinition } from "../../../game/models/Encounter";

export const generalEncounters: EncounterDefinition[] = [

    /*
   * ============================================================
   * City Encounters
   * ============================================================
   */

    {
        id: "general-encounter-1-city",

        name: "City Encounters",

        type: "city",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-1/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-1/General_Encounter-back-1.png",

        text:
            "You make sure no one is watching before sneaking out of the shop with your stolen goods [observation]. If you pass, gain 1 Item Asset from the reserve or 1 random Item Asset from the deck. If you fail, you are caught by the store owner and arrested; gain a Detained Condition.",

        choices: [
            {
                text: "Sneak out of the shop.",

                effects: [
                    {
                        type: "test",

                        testType: "observation",

                        onSuccess: [
                            {
                                type: "choice",

                                choices: [
                                    {
                                        text: "Take an Item Asset from the Reserve.",

                                        effects: [
                                            {
                                                type: "gain-item-from-reserve",
                                            },
                                        ],
                                    },

                                    {
                                        text: "Gain 1 random Item Asset from the deck.",

                                        effects: [
                                            {
                                                type: "gain-random-item",
                                            },
                                        ],
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

    {
        id: "general-encounter-2-city",

        name: "City Encounters",

        type: "city",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-2/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-2/General_Encounter-back-2.png",

        text:
            "Corrupt members of the police force pressure you for a bribe. You speak to some people you know to take care of the problem [influence]. If you pass, the police are apologetic and share their leads with you; spawn [clue] 1 Clue. If you fail, gain a Debt Condition to pay the bribe.",

        choices: [
            {
                text: "Call in a favor.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "spawn-clues",
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
        id: "general-encounter-3-city",

        name: "City Encounters",

        type: "city",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-3/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-3/General_Encounter-back-3.png",

        text:
            "The shop is robbed while you are browsing! You attempt to fend off the thieves [strength]. If you pass, the store owner is very gracious; gain 1 Item Asset from the reserve or 1 random Item Asset from the deck. If you fail, lose [health] 1 Health and discard 1 Item possession.",

        choices: [
            {
                text: "Fend off the thieves.",

                effects: [
                    {
                        type: "test",

                        testType:
                            "strength",

                        onSuccess: [
                            {
                                type: "choice",

                                choices: [
                                    {
                                        text:
                                            "Take an Item Asset from the Reserve.",

                                        effects: [
                                            {
                                                type:
                                                    "gain-item-from-reserve",
                                            },
                                        ],
                                    },

                                    {
                                        text:
                                            "Gain 1 random Item Asset from the deck.",

                                        effects: [
                                            {
                                                type:
                                                    "gain-random-item",
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],

                        onFail: [
                            {
                                type:
                                    "lose-health",

                                amount: 1,
                            },

                            {
                                type:
                                    "discard-item",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-4-city",

        name: "City Encounters",

        type: "city",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-4/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-4/General_Encounter-back-4.png",

        text:
            "A group of intimidating Syndicate members demand you pay them for protection. You offer the well-dressed men what you can afford [influence]. If you fail, they make sure you meet with an accident; gain a Leg Injury Condition.",

        choices: [
            {
                text: "Negotiate with the Syndicate.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

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
        id: "general-encounter-5-city",

        name: "City Encounters",

        type: "city",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-5/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-5/General_Encounter-back-5.png",

        text:
            "A shady figure offers to sell you a weapon, no questions asked. You speak with him to determine his motives [influence]. If you pass, gain 1 random Weapon Asset from the deck. If you fail, the undercover policeman arrests you; gain a Detained Condition.",

        choices: [
            {
                text: "Determine his motives.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "gain-weapon",
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
        id: "general-encounter-6-city",

        name: "City Encounters",

        type: "city",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-6/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-6/General_Encounter-back-6.png",

        text:
            "You wander through the aisles of an antique book store. Although many extremely rare books can be found here, the organizational system is almost impossible to decipher ([lore]-1). If you pass, you're able to track down a hidden gem; gain 1 Tome Artifact.",

        choices: [
            {
                text: "Search for a rare book.",

                effects: [
                    {
                        type: "test",
                        testType: "lore",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "gain-artifact",
                                artifactType: "tome",
                                amount: 1,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-7-city",

        name: "City Encounters",

        type: "city",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-7/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-7/General_Encounter-back-7.png",

        text:
            "A friendly game of cards ends with a very high-stakes hand [influence]. If you pass, you amaze everyone watching and find a new friend; gain 1 random Ally Asset from the deck. If you fail, gain a Debt Condition to cover the loss.",

        choices: [
            {
                text: "Play the high-stakes hand.",

                effects: [
                    {
                        type: "test",
                        testType: "influence",

                        onSuccess: [
                            {
                                type: "gain-ally",
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
        id: "general-encounter-8-city",

        name: "City Encounters",

        type: "city",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-8/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-8/General_Encounter-back-8.png",

        text:
            "A night of drinking and good cheer helps raise your spirits. Recover [sanity] 2 Sanity. While you are celebrating, you hardly notice that you are being robbed [observation]. If you fail, discard 1 Item possession.",

        choices: [
            {
                text: "Enjoy the night.",

                effects: [
                    {
                        type: "gain-sanity",
                        amount: 2,
                    },
                    {
                        type: "test",
                        testType: "observation",

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
        id: "general-encounter-9-city",

        name: "City Encounters",

        type: "city",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-9/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-9/General_Encounter-back-9.png",

        text:
            "The police report that people are being abducted by a monster dwelling in the sewer system. Wandering through the underground tunnels you are suddenly attacked by a deep one [strength]! If you pass, you defeat the creature and rescue its hostage; gain 1 random Ally Asset from the deck. If you fail, lose [health] 1 Health from the struggle.",

        choices: [
            {
                text: "Fight the Deep One.",

                effects: [
                    {
                        type: "test",
                        testType: "strength",

                        onSuccess: [
                            {
                                type: "gain-ally",
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
        id: "general-encounter-10-city",

        name: "City Encounters",

        type: "city",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-10/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-10/General_Encounter-back-10.png",

        text:
            "The police ask for your help investigating a series of ritual killings. The grisly crime scenes threaten to overwhelm you with chills and nausea [will]. If you pass, you manage to examine the scene and find significant information; spawn [clue] 1 Clue. If you fail, you can't endure the horror; lose [sanity] 2 Sanity.",

        choices: [
            {
                text: "Examine the crime scene.",

                effects: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "spawn-clues",
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
            },
        ],
    },

    {
        id: "general-encounter-11-city",

        name: "City Encounters",

        type: "city",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-11/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-11/General_Encounter-back-11.png",

        text:
            "Legends say that this cemetery is haunted. Exploring the headstones, you encounter an angry specter, eager to share his story. The experience is nerve-wracking, but you try to listen [will]. If you pass, the spirit gratefully fades from view; recover [sanity] 2 Sanity. If you fail, his desperate voice echoes in your mind; gain a Paranoia Condition.",

        choices: [
            {
                text: "Listen to the specter.",

                effects: [
                    {
                        type: "test",
                        testType: "will",

                        onSuccess: [
                            {
                                type: "gain-sanity",
                                amount: 2,
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

    {
        id: "general-encounter-12-city",

        name: "City Encounters",

        type: "city",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-12/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-12/General_Encounter-back-12.png",

        text:
            "The Syndicate is engaged in a gang war with local thugs and is under intense legal scrutiny. You try to trade your political clout for assistance [influence]. If you pass, gain 1 Service Asset from the reserve or 1 random Service Asset from the deck.",

        choices: [
            {
                text: "Trade your political clout.",

                effects: [
                    {
                        type: "test",

                        testType: "influence",

                        onSuccess: [
                            {
                                type: "choice",

                                choices: [
                                    {
                                        text:
                                            "Take a Service Asset from the Reserve.",

                                        effects: [
                                            {
                                                type:
                                                    "gain-service-from-reserve",
                                            },
                                        ],
                                    },

                                    {
                                        text:
                                            "Gain 1 random Service Asset from the deck.",

                                        effects: [
                                            {
                                                type:
                                                    "gain-service",
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
   * Wilderness Encounters
   * ============================================================
   */

    {
        id: "general-encounter-1-wilderness",

        name: "Wilderness Encounters",

        type: "wilderness",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-1/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-1/General_Encounter-back-1.png",

        text:
            "The remains of a long-dead explorer lie before you. Some of his gear still seems salvageable, and he won't miss it. You dig through the dead man's pockets; gain 1 random Item Asset from the deck and lose [sanity] 1 Sanity.",

        choices: [
            {
                text: "Search the explorer's pockets.",

                effects: [
                    {
                        type: "gain-item",
                    },
                    {
                        type: "lose-sanity",
                        amount: 1,
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-2-wilderness",

        name: "Wilderness Encounters",

        type: "wilderness",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-2/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-2/General_Encounter-back-2.png",

        text:
            "Far from any road or village, you find a shallow grave marked only with an arcane symbol. As you dig, a growing dread weakens your resolve [will]. If you pass, you find a charred corpse clutching a journal; gain [clue] 1 Clue or improve [Lore]. If you fail, you run from the area; gain a Cursed Condition.",

        choices: [
            {
                text: "Search the grave.",

                effects: [
                    {
                        type: "test",

                        testType: "will",

                        onSuccess: [
                            {
                                type: "choice",

                                choices: [
                                    {
                                        text:
                                            "Gain 1 Clue.",

                                        effects: [
                                            {
                                                type:
                                                    "gain-clues",

                                                amount: 1,
                                            },
                                        ],
                                    },

                                    {
                                        text:
                                            "Improve Lore.",

                                        effects: [
                                            {
                                                type:
                                                    "improve-skill",

                                                skillType:
                                                    "lore",

                                                amount: 1,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],

                        onFail: [
                            {
                                type:
                                    "gain-condition",

                                conditionDefinitionId:
                                    "condition-cursed",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-3-wilderness",

        name: "Wilderness Encounters",

        type: "wilderness",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-3/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-3/General_Encounter-back-3.png",

        text:
            "You scrape away years of moss and lichen from the stone altar, uncovering a series of prehistoric symbols. You think you can interpret the carvings [lore]. If you pass, gain [clue] 1 Clue or 1 Spell.",

        choices: [
            {
                text: "Interpret the prehistoric carvings.",

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
                                            "Gain 1 Clue.",

                                        effects: [
                                            {
                                                type:
                                                    "gain-clues",

                                                amount: 1,
                                            },
                                        ],
                                    },

                                    {
                                        text:
                                            "Gain 1 Spell.",

                                        effects: [
                                            {
                                                type:
                                                    "gain-spell",
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

    {
        id: "general-encounter-4-wilderness",

        name: "Wilderness Encounters",

        type: "wilderness",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-4/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-4/General_Encounter-back-4.png",

        text:
            "The terrain ahead of you looks impassable, but going around would take too long. You'll need to find some way to move forward [observation]. If you pass, you discover a path; move 1 space. If you fail, you trip over the uneven ground; lose [health] 1 Health and gain a Leg Injury Condition.",

        choices: [
            {
                text: "Find a way through.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",

                        onSuccess: [
                            {
                                type: "move",
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
                                    "condition-leg-injury",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-5-wilderness",

        name: "Wilderness Encounters",

        type: "wilderness",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-5/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-5/General_Encounter-back-5.png",

        text:
            "The ground slopes upward so uniformly that you suspect a structure exists underneath. You search for a buried entrance to claim the treasures found inside. You may spend [clue] 1 Clue to gain 1 Artifact.",

        choices: [
            {
                text: "Spend 1 Clue.",

                effects: [
                    {
                        type: "lose-clues",
                        amount: 1,
                    },
                    {
                        type: "gain-artifact",
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
        id: "general-encounter-6-wilderness",

        name: "Wilderness Encounters",

        type: "wilderness",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-6/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-6/General_Encounter-back-6.png",

        text:
            "You help a young woman search the countryside for her uncle [observation]. If you pass, you find the eccentric, old man, and he gives you a gift for helping his niece; gain 1 Tome Artifact from the deck.",

        choices: [
            {
                text: "Search for the missing uncle.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",

                        onSuccess: [
                            {
                                type: "gain-artifact",
                                artifactType: "tome",
                                amount: 1,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-7-wilderness",

        name: "Wilderness Encounters",

        type: "wilderness",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-7/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-7/General_Encounter-back-7.png",

        text:
            "Your map is gone, and you must navigate based on your own observations [observation]. If you pass, you confidently progress on your journey; move 1 space. If you fail, you travel in circles; you become Delayed and gain a Madness Condition.",

        choices: [
            {
                text: "Navigate without your map.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",

                        onSuccess: [
                            {
                                type: "move",
                                amount: 1,
                            },
                        ],

                        onFail: [
                            {
                                type: "become-delayed",
                            },
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
        id: "general-encounter-8-wilderness",

        name: "Wilderness Encounters",

        type: "wilderness",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-8/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-8/General_Encounter-back-8.png",

        text:
            "Past where your campfire allows you to see, you hear voices chanting. You try to draw a protective sigil in the ground [lore]. If you pass, the next morning you find evidence of cult activity that you can use to identify the cult members; gain [clue] 1 Clue or improve [influence]Influence. If you fail, gain a Cursed Condition.",

        choices: [
            {
                text: "Draw a protective sigil.",

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
                                            "Gain 1 Clue.",

                                        effects: [
                                            {
                                                type:
                                                    "gain-clues",
                                                amount: 1,
                                            },
                                        ],
                                    },

                                    {
                                        text:
                                            "Improve Influence.",

                                        effects: [
                                            {
                                                type:
                                                    "improve-skill",
                                                skillType:
                                                    "influence",
                                                amount: 1,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],

                        onFail: [
                            {
                                type:
                                    "gain-condition",
                                conditionDefinitionId:
                                    "condition-cursed",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-9-wilderness",

        name: "Wilderness Encounters",

        type: "wilderness",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-9/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-9/General_Encounter-back-9.png",

        text:
            "In the middle of the night, a feral beast rips apart your camp and attacks you [strength]! If you pass, you feel invincible; improve [will] Will. If you fail, lose [health] 1 Health and gain a Leg Injury Condition.",

        choices: [
            {
                text: "Fight the feral beast.",

                effects: [
                    {
                        type: "test",
                        testType: "strength",

                        onSuccess: [
                            {
                                type: "improve-skill",
                                skillType: "will",
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
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-10-wilderness",

        name: "Wilderness Encounters",

        type: "wilderness",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-10/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-10/General_Encounter-back-10.png",

        text:
            "Extreme conditions have left you fevered and delirious. You force yourself to keep moving, putting a terrible strain on your body [strength]. If you fail, the fever grows worse and you begin seeing things; gain a Hallucinations Condition.",

        choices: [
            {
                text: "Force yourself to keep moving.",

                effects: [
                    {
                        type: "test",
                        testType: "strength",

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
        id: "general-encounter-11-wilderness",

        name: "Wilderness Encounters",

        type: "wilderness",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-11/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-11/General_Encounter-back-11.png",

        text:
            "According to your map, you can make a detour to visit a lake purported to have restorative powers. You may become Delayed to recover [sanity] 3 Sanity or discard a Madness Condition.",

        choices: [
            {
                text:
                    "Become Delayed to recover 3 Sanity.",

                effects: [
                    {
                        type: "become-delayed",
                    },
                    {
                        type: "gain-sanity",
                        amount: 3,
                    },
                ],
            },

            {
                text:
                    "Discard a Madness Condition.",

                effects: [
                    {
                        type: "discard-condition",
                        conditionDefinitionId:
                            "condition-madness",
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-12-wilderness",

        name: "Wilderness Encounters",

        type: "wilderness",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-12/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-12/General_Encounter-back-12.png",

        text:
            "You find a primitive painting on the wall of a cave and decide to explore the subterranean depths that lie beyond. The dark, constricting passages create a terrible sense of claustrophobia [will]. If you pass, gain 1 Artifact left by an ancient civilization. If you fail, lose [sanity] 2 Sanity.",

        choices: [
            {
                text: "Explore the subterranean passages.",

                effects: [
                    {
                        type: "test",
                        testType: "will",
                        modifier: -1,

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
            },
        ],
    },

    /*
   * ============================================================
   * Sea Encounters
   * ============================================================
   */

    {
        id: "general-encounter-1-sea",

        name: "Sea Encounters",

        type: "sea",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-1/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-1/General_Encounter-back-1.png",

        text:
            "You find the floating detritus of some sunken ship and search for any survivors or salvageable objects [observation]. If you pass, you discover a floating trunk; gain 1 Artifact. If you fail, you waste hours without result; become Delayed.",

        choices: [
            {
                text: "Search the wreckage.",

                effects: [
                    {
                        type: "test",
                        testType: "observation",

                        onSuccess: [
                            {
                                type: "gain-artifact",
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

    {
        id: "general-encounter-2-sea",

        name: "Sea Encounters",

        type: "sea",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-2/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-2/General_Encounter-back-2.png",

        text:
            "Your ship becomes lost in a dense fog bank, terrifying the superstitious crew. When the mist finally clears, you've somehow traveled hundreds of miles. Move 1 space and lose [sanity] 1 Sanity.",

        choices: [
            {
                text: "Navigate through the fog.",

                effects: [
                    {
                        type: "move",
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

    {
        id: "general-encounter-3-sea",

        name: "Sea Encounters",

        type: "sea",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-3/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-3/General_Encounter-back-3.png",

        text:
            "One of the sailors is singing an old sea shanty about a woman searching for her dead husband. The story seems familiar to you ([lore]-1). If you pass, you recognize it as the story of Isis, and the sailor teaches you the song; gain a Blessed Condition and recover [health] 1 Health and [sanity] 1 Sanity.",

        choices: [
            {
                text: "Listen to the sailor's song.",

                effects: [
                    {
                        type: "test",
                        testType: "lore",
                        modifier: -1,

                        onSuccess: [
                            {
                                type: "gain-condition",
                                conditionDefinitionId:
                                    "condition-blessed",
                            },
                            {
                                type: "gain-health",
                                amount: 1,
                            },
                            {
                                type: "gain-sanity",
                                amount: 1,
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-4-sea",

        name: "Sea Encounters",

        type: "sea",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-4/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-4/General_Encounter-back-4.png",

        text:
            "You discover a signal fire on a small island, but don't find any people. You search the beach for signs of life [observation]. If you pass, you spot a person hiding behind large stones; gain [clue] 1 Clue and 1 random Ally Asset from the deck. If you fail, the mystery remains unsolved; gain a Paranoia Condition.",

        choices: [
            {
                text: "Search the beach.",

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
                                type: "gain-ally",
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

    {
        id: "general-encounter-5-sea",

        name: "Sea Encounters",

        type: "sea",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-5/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-5/General_Encounter-back-5.png",

        text:
            "The captain tells you that you are passing over the site of a famous shipwreck. You can use this ship's deep-sea diving equipment to explore the wreckage. You may become Delayed to gain 1 Artifact.",

        choices: [
            {
                text: "Become Delayed to explore the wreck.",

                effects: [
                    {
                        type: "become-delayed",
                    },
                    {
                        type: "gain-artifact",
                        amount: 1,
                    },
                ],
            },

            {
                text: "Do nothing.",

                effects: [],
            },
        ],
    },

    {
        id: "general-encounter-6-sea",

        name: "Sea Encounters",

        type: "sea",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-6/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-6/General_Encounter-back-6.png",

        text:
            "The ship ahead of you seemed abandoned, but now you see that it is crewed entirely by ghostly figures. You try to discern what ship this had once been and what happened to it [lore]. If you pass, the spectral captain grants you aid; gain [clue] 1 Clue or improve [will] Will. If you fail, gain a Cursed Condition.",

        choices: [
            {
                text: "Identify the ghost ship.",

                effects: [
                    {
                        type: "test",
                        testType: "lore",

                        onSuccess: [
                            {
                                type: "choice",

                                choices: [
                                    {
                                        text: "Gain 1 Clue.",

                                        effects: [
                                            {
                                                type: "gain-clues",
                                                amount: 1,
                                            },
                                        ],
                                    },

                                    {
                                        text: "Improve Will.",

                                        effects: [
                                            {
                                                type: "improve-skill",
                                                skillType: "will",
                                                amount: 1,
                                            },
                                        ],
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
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-7-sea",

        name: "Sea Encounters",

        type: "sea",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-7/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-7/General_Encounter-back-7.png",

        text:
            "A sudden storm descends upon you and strong winds whip around your vessel. Huge waves toss your ship around like a toy, and you are thrown to the deck repeatedly. Lose [sanity] 1 Sanity and gain a Back Injury Condition.",

        choices: [
            {
                text: "Endure the storm.",

                effects: [
                    {
                        type: "lose-sanity",
                        amount: 1,
                    },
                    {
                        type: "gain-condition",
                        conditionDefinitionId:
                            "condition-back-injury",
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-8-sea",

        name: "Sea Encounters",

        type: "sea",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-8/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-8/General_Encounter-back-8.png",

        text:
            "You find a terrified stowaway aboard the ship. You attempt to comfort him and coax him into telling you his story [influence]. If you pass, he tells you about horrifying beasts and unbelievable worlds; gain [clue] 1 Clue.",

        choices: [
            {
                text: "Comfort the stowaway.",

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
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-9-sea",

        name: "Sea Encounters",

        type: "sea",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-9/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-9/General_Encounter-back-9.png",

        text:
            "The captain of the ship invites you to dine with him. You have the feeling that he's had some experience with unearthly creatures and try to convince him to share his story [influence]. If you pass, his tale includes highly-significant details; gain [clue] 1 Clue.",

        choices: [
            {
                text: "Ask the captain about his experiences.",

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
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-10-sea",

        name: "Sea Encounters",

        type: "sea",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-10/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-10/General_Encounter-back-10.png",

        text:
            "You're awakened in the night by gunfire. Deep ones have climbed aboard the ship and are trying to sabotage the engine. You do your best to help the crew fight them [strength]. If you fail, the engine is destroyed before you finish off the sea creatures, and you must wait to be rescued; become Delayed.",

        choices: [
            {
                text: "Fight the Deep Ones.",

                effects: [
                    {
                        type: "test",
                        testType: "strength",

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
        id: "general-encounter-11-sea",

        name: "Sea Encounters",

        type: "sea",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-11/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-11/General_Encounter-back-11.png",

        text:
            "One of the sailors speaks in a strange, ancient dialect. You try to communicate with the man based on obscure languages you have studied [lore]. If you pass, the peculiar man teaches you a chant; gain 1 Spell. If you fail, he growls an unintelligible phrase; gain a Cursed Condition.",

        choices: [
            {
                text: "Communicate with the sailor.",

                effects: [
                    {
                        type: "test",
                        testType: "lore",

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
                                    "condition-cursed",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "general-encounter-12-sea",

        name: "Sea Encounters",

        type: "sea",

        region: "general",

        frontImage:
            "/cards/encounters/General/General_Encounter-12/General_Encounter.png",

        backImage:
            "/cards/encounters/General/General_Encounter-12/General_Encounter-back-12.png",

        text:
            "A large wave washes across the deck, and a prized possession slips from your fingers. You dive into the water, holding your breath as long as you can to recover the object before it sinks out of reach [will]. If you fail, discard 1 Item possession.",

        choices: [
            {
                text: "Dive into the water.",

                effects: [
                    {
                        type: "test",
                        testType: "will",

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
]