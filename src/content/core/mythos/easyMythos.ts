import type { MythosDefinition } from "../../../game/models/Mythos";

export const easyMythos: MythosDefinition[] = [
    {
        id: "a-proposition",

        name: "A Proposition",

        difficulty: "easy",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Easy - A Proposition.jpg",

        flavorText:
            "You had told everyone the parchment was indecipherable, but you were lying. You know the ritual necessary to summon and bind the dark power. You could strike a bargain with it. The situation is desperate, but you know that a solution is within its power. But what will it ask of you in return?",

        icons: [
            {
                type: "advance-omen",
            },
            {
                type: "monster-surge",
            },
            {
                type: "spawn-clues",
            },
        ],

        text:
            "The Lead Investigator may gain a Dark Pact Condition to immediately solve 1 RUMOR Mythos in play.",

        effects: [
            {
                type: "gain-dark-pact-to-solve-rumor",

                investigator: "lead",

                amount: 1,
            },
        ],
    },

    {
        id: "buying-information",

        name: "Buying Information",

        difficulty: "easy",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Easy - Buying Information.jpg",

        flavorText:
            "\"When you get there, stop at this address.\" The nervous little man hands you a business card for a restaurant. \"Ask for the catch of the day and then tuck a sawbuck into your napkin.\" These guys can get you the answers you need.\n\nWhen you get the bill for your meal, it already includes directions to a payphone. It's already ringing by the time you find it. You answer and explain your situation to the gruff voice on the other end of the line.",

        icons: [
            {
                type: "advance-omen",
            },
            {
                type: "monster-surge",
            },
            {
                type: "spawn-clues",
            },
        ],

        text:
            "The Lead Investigator tests Influence and gains a number of Clues equal to his test result.",

        effects: [
            {
                type: "test-and-gain-clues",

                investigator: "lead",

                skill: "influence",
            },
        ],
    },

    {
        id: "everyone-has-a-price",

        name: "Everyone Has a Price",

        difficulty: "easy",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Easy - Everyone Has a Price.jpg",

        flavorText:
            "He writes the price on a piece of paper and slides it across the table. It's more than you can afford, but you don't have any other options, and this greedy lout knows it.",

        icons: [
            {
                type: "advance-omen",
            },
            {
                type: "mythos-reckoning",
            },
            {
                type: "spawn-gates",
            },
        ],

        text:
            "Each investigator may gain a Debt Condition to discard 1 Condition.",

        effects: [
            {
                type: "gain-debt-to-discard-condition",

                investigator: "each",
            },
        ],
    },

    {
        id: "fractured-reality",

        name: "Fractured Reality",

        difficulty: "easy",

        type: "rumor",

        image:
            "/cards/Mythos/Mythos/Easy - Fractured Reality.jpg",

        flavorText:
            "The strange phenomenon is an echo of the catastrophic destruction of Mu. The repercussions of the serpent people's over-reaching ambition still take their toll.",

        icons: [
            {
                type: "spawn-clues",
            },
            {
                type: "spawn-rumor",

                spaceId: "space-2",
            },
            {
                type: "place-eldritch-tokens",

                amount: 4,
            },
        ],

        text:
            "As an encounter, an investigator on space 2 may use an ancient portal created by a long-dead wizard of Mu; he resolves an Other World Encounter. If the effect allows him to \"close this Gate,\" solve this Rumor instead.\n\nWhen there are no Eldritch tokens on this card, advance Doom by 1 for each Gate on the game board, and then solve this Rumor.",

        effects: [
            {
                type: "mythos-special",
                id: "fractured-reality",
            },
        ],

        reckoning: {
            type: "discard-eldritch-token",
        },
    },

    {
        id: "growing-madness",

        name: "Growing Madness",

        difficulty: "easy",

        type: "ongoing",

        image:
            "/cards/Mythos/Mythos/Easy - Growing Madness.jpg",

        flavorText:
            "You dream of a life as an insane wizard thousands of years ago in Atlantis. You also dream of that same wizard still alive today on an uncharted island.",

        icons: [
            {
                type: "spawn-clues",
            },
            {
                type: "spawn-rumor",
                spaceId: "space-8",
            },
            {
                type: "place-eldritch-tokens",
                amount: 4,
            },
        ],

        text:
            "As an encounter, an investigator on space 8 may attempt to find the uncharted isle. If he passes, he may spend Clues equal to half no investigators to solve this Rumor.\n\nWhen there are no Eldritch tokens on this card, each investigator loses 3 Sanity, then solve this Rumor.",

        effects: [
            {
                type: "mythos-special",
                id: "growing-madness",
            },
        ],

        reckoning: {
            type: "lead-gains-madness",
        },
    },

    {
        id: "heart-of-corruption",

        name: "Heart of Corruption",

        difficulty: "easy",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Easy - Heart of Corruption.jpg",

        flavorText:
            "You compared the picture in the magazine to the drawing on the old, tattered map. It was definitely a match, but what could be so valuable that it required so much secrecy, and why was that particular point on the map marked with blood?",

        icons: [
            {
                type: "advance-omen",
            },
            {
                type: "monster-surge",
            },
            {
                type: "spawn-clues",
            },
        ],

        text:
            "The Lead Investigator gains 1 Artifact, then rolls 1 die. On a 1 or 2, he loses 2 Health and 2 Sanity.",

        effects: [
            {
                type: "gain-artifact",
                investigator: "lead",
            },

            {
                type: "roll-single-die",
                investigator: "lead",
                onOneOrTwo: [
                    {
                        type: "lose-health",
                        amount: 2,
                    },
                    {
                        type: "lose-sanity",
                        amount: 2,
                    },
                ],
            },
        ],
    },

    {
        id: "lost-knowledge",

        name: "Lost Knowledge",

        difficulty: "easy",

        type: "ongoing",

        image:
            "/cards/Mythos/Mythos/Easy - Lost Knowledge.jpg",

        flavorText:
            "Your contact in the capital is hesitant to speak about those called \"The Watches.\" He says they work for a number of different governments, but answer to some other authority.",

        icons: [
            {
                type: "spawn-clues",
            },
            {
                type: "place-eldritch-tokens",
                amount: 3,
            },
        ],

        text:
            "When this card enters play, spawn the Tick Tock Men Epic Monster on space 21. When it is defeated, solve this Rumor.\n\nWhen there are no Eldritch tokens on this card, discard all Clues on the game board, then each investigator discards all Clues.",

        effects: [
            {
                type: "mythos-special",
                id: "lost-knowledge",
            },
        ],

        reckoning: {
            type: "discard-eldritch-token",
        },
    },

    {
        id: "omen-of-good-fortune",

        name: "Omen of Good Fortune",

        difficulty: "easy",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Easy - Omen of Good Fortune.jpg",

        flavorText:
            "You drop a penny into the peculiar mechanical device. The automaton waves its hand and turns over a card bearing the words, \"Good luck is with you.\"",

        icons: [
            {
                type: "advance-omen",
            },
            {
                type: "mythos-reckoning",
            },
            {
                type: "spawn-gates",
            },
        ],

        text:
            "The Lead Investigator may move the Omen to a space of his choice on the Omen track without advancing Doom.",

        effects: [
            {
                type: "move-omen-choice",
                investigator: "lead",
            },
        ],
    },

    {
        id: "rally-the-people",

        name: "Rally the People",

        difficulty: "easy",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Easy - Rally the People.jpg",

        flavorText:
            "After the noise and violence is over, one of the shopkeepers peers out from his shuttered windows. Amazed to see you alive, he opens the window and calls out, \"Is it over? Are we safe?\" You wave to let him know that everything is fine.",

        icons: [
            {
                type: "advance-omen",
            },
            {
                type: "mythos-reckoning",
            },
            {
                type: "spawn-gates",
            },
        ],

        text:
            "The Lead Investigator gains 1 random Ally Asset from the deck.",

        effects: [
            {
                type: "gain-ally",
                investigator: "lead",
            },
        ],
    },

    {
        id: "secrets-of-the-past",

        name: "Secrets of the Past",

        difficulty: "easy",

        type: "ongoing",

        image:
            "/cards/Mythos/Mythos/Easy - Secrets of the Past.jpg",

        flavorText:
            "At the market you learn that another group of men have been asking about the same lost temple. You hope you get there first.",

        icons: [
            {
                type: "spawn-clues",
            },
        ],

        text:
            "Investigators cannot resolve Expedition Encounters.\n\nAs an encounter, an investigator on the Active Expedition space may attempt to uncover secrets lost to time and history. If he passes, he may spend Clues equal to half no investigators to solve this Rumor.",

        effects: [],

        reckoning: {
            type: "return-active-expedition",
        },
    },

    {
        id: "silver-twilight-aid",

        name: "Silver Twilight Aid",

        difficulty: "easy",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Easy - Silver Twilight Aid.jpg",

        flavorText:
            "Once inside the lodge, your host invites you to follow him upstairs. Several members stare in astonishment. Outsiders are rarely granted such access. At the top of the stairs you are ushered into a library, filled with rare and exotic tomes. \"Now,\" he says, \"how can we help you?\"",

        icons: [
            {
                type: "advance-omen",
            },
            {
                type: "mythos-reckoning",
            },
            {
                type: "spawn-gates",
            },
        ],

        text:
            "Each investigator may do one of the following: gain 1 Clue, gain 1 Asset, or gain 1 Spell.",

        effects: [
            {
                type: "mythos-special",
                id: "silver-twilight-aid",
            },
        ],
    },

    {
        id: "support-of-the-church",

        name: "Support of the Church",

        difficulty: "easy",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Easy - Support of the Church.jpg",

        flavorText:
            "You hang your head in exhaustion and frustration. You jump suddenly when a hand rests on your shoulder. To your relief, you turn to find the local priest. \"Have faith, my child,\" he tells you. \"Your good works have not gone unseen. Your brave acts are making a difference.\"",

        icons: [
            {
                type: "advance-omen",
            },
            {
                type: "monster-surge",
            },
            {
                type: "spawn-clues",
            },
        ],

        text:
            "The Lead Investigator gains a Blessed Condition.",

        effects: [
            {
                type: "gain-condition",

                conditionDefinitionId:
                    "condition-blessed",

                investigator: "lead",
            },
        ],
    },

    {
        id: "that-which-consumes",

        name: "That Which Consumes",

        difficulty: "easy",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Easy - That Which Consumes.jpg",

        flavorText:
            "In one night, the whole monstrous undertaking has disappeared. Every occult sigil has been sanded from the wall and painted over. Every name on your list has moved to a new city without notice. You would like to believe that you managed to drive them out, but you fear that it signifies something worse. The dark goal they'd been pursuing is now accomplished.",

        icons: [
            {
                type: "advance-omen",
            },
            {
                type: "monster-surge",
            },
            {
                type: "spawn-clues",
            },
        ],

        text:
            "Investigators, as a group, choose 1 Gate on the game board and discard it. If the discarded Gate does not correspond to the current Omen, advance Doom by 1.",

        effects: [
            {
            type: "select-gate",
            },
        ],
    },

    {
        id: "the-world-fights-back",

        name: "The World Fights Back",

        difficulty: "easy",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Easy - The World Fights Back.jpg",

        flavorText:
            "Across the globe, headlines announce terrors that threaten to engulf humanity. Individuals everywhere take action against these horrors and assist those who have already been fighting the ancient one.",

        icons: [
            {
                type: "advance-omen",
            },
            {
                type: "mythos-reckoning",
            },
            {
                type: "spawn-gates",
            },
        ],

        text:
            "Each investigator may do one of the following: Recover 2 Health, Recover 2 Sanity, or discard 1 Monster from his space.",

        effects: [
            {
                type: "world-fights-back",
            },
        ],
    },
];