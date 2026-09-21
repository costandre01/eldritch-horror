import type { MythosDefinition } from "../../../game/models/Mythos";

export const hardMythos: MythosDefinition[] = [
    {
        id: "all-for-nothing",

        name: "All For Nothing",

        difficulty: "hard",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Hard - All For Nothing.jpg",

        flavorText:
            "You wrap the towel around some ice and apply it to your injuries, hoping to reduce the swelling. You make a mental list of all the sacrifices that you've had to make and those that you've asked of others. All that terrible loss and you can't for the life of you think of any good that's been accomplished.",

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
            "Shuffle a solved Mystery back into the deck unless investigators as a group spend Clues equal to half the number of investigators. If there were no solved Mysteries, advance Doom by 1 instead.",

        effects: [
            {
                type: "mythos-special",
                id: "all-for-nothing",
            },
        ],
    },

    {
        id: "desperate-times",

        name: "Desperate Times",

        difficulty: "hard",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Hard - Desperate Times.jpg",

        flavorText:
            "You hear it again and again on the news. Every day the world takes another step toward utter annihilation. You ask yourself, how much would you sacrifice to prevent that disaster? Even if you could only grant humanity one more day of existence, could you honestly say that the price was too high?",

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
            "Doom advances by 2 unless the Lead Investigator gains a Dark Pact Condition.",

        effects: [
            {
                type: "mythos-special",
                id: "desperate-times",
            },
        ],
    },

    {
        id: "dimensions-collide",

        name: "Dimensions Collide",

        difficulty: "hard",

        type: "rumor",

        image:
            "/cards/Mythos/Mythos/Hard - Dimensions Collide.jpg",

        flavorText:
            "Everywhere that these portals have been reported, earthquakes shake the streets into rubble, and sinkholes swallow buildings whole.",

        icons: [
            {
                type: "spawn-clues",
            },
            {
                type: "spawn-rumor",
                spaceId: "space-11",
            },
            {
                type: "place-eldritch-tokens",
                amount: 8,
            },
        ],

        text:
            "As an encounter, an investigator on space 11 may attempt to infiltrate a hidden sect of Tcho-Tchos that is destabilizing the fabric of reality by invoking Chaugnar Faugn [observation]. If he passes, he puts an end to their rituals; he may spend Clues equal to half the number of investigators to solve this Rumor. When there are no Eldritch tokens on this card, investigators lose the game.",

        effects: [
            {
                type: "mythos-special",
                id: "dimensions-collide",
            },
        ],

        reckoning: {
            type: "dimensions-collide",
        },
    },

    {
        id: "eyes-everywhere",

        name: "Eyes Everywhere",

        difficulty: "hard",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Hard - Eyes Everywhere.jpg",

        flavorText:
            "Now that you know what to look for, you see them all around you: the man pretending to be asleep on the bench, the woman watching you in the reflection of a tobacconist's shop, the trio who have been following you since you left the station. They've been tracking your every move.",

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
            "Each investigator rolls 1 die and resolves the matching effect: 1-2: He is assaulted and loses 2 Health and 2 Sanity. 3-5: A Monster ambushes him. 6: No effect.",

        effects: [
            {
                type: "mythos-special",
                id: "eyes-everywhere",
            },
        ],
    },

    {
        id: "from-beyond",

        name: "From Beyond",

        difficulty: "hard",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Hard - From Beyond.jpg",

        flavorText:
            "The shop owner's body was found in the storeroom among those curios and antiques deemed \"too esoteric for public display.\" While the police ascribed his death to natural causes, you see it for something more sinister. The insidious powers from outside of reality are growing more aggressive, impatient for the meal they plan to make of this world.",

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
            "Resolve the Reckoning effect on each Mythos card in play twice unless investigators, as a group, spend Clues equal to half the number of investigators. If there are no Mythos cards in play with a Reckoning effect, advance Doom by 1.",

        effects: [
            {
                type: "mythos-special",
                id: "from-beyond",
            },
        ],
    },

    {
        id: "mysterious-lights",

        name: "Mysterious Lights",

        difficulty: "hard",

        type: "rumor",

        image:
            "/cards/Mythos/Mythos/Hard - Mysterious Lights.jpg",

        flavorText:
            "You've never seen the Aurora Borealis flashing with such intensity. Even south of the arctic circle, the air feels alive with alien energies that cannot be dispelled.",

        icons: [
            {
                type: "spawn-clues",
            },
            {
                type: "spawn-rumor",
                spaceId: "space-13",
            },
        ],

        text:
            "Gates cannot be closed.\n\nAs an encounter, an investigator on space 13 may fly a plane over the arctic ice to scout for the source of these unusually intense northern lights. If he passes, he catches sight of an unoccupied mi-go outpost and attempts to turn off their bizarre devices; he may spend Clues equal to half the number of investigators to solve this Rumor.",

        effects: [
            {
                type: "mythos-special",
                id: "mysterious-lights",
            },
        ],
    },

    {
         id: "perplexing-stars",

        name: "Perplexing Stars",

        difficulty: "hard",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Hard - Perplexing Stars.jpg",

        flavorText:
            "Before your very eyes the stars shift in the night sky. Constellations break apart and reform, shattering your previous predictions of the omens.",

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
            "Move the Omen counterclockwise by 1. Then advance Doom by 1 for each Gate on the game board that corresponds to the current Omen.",

        effects: [
            {
                type: "mythos-special",
                id: "perplexing-stars",
            },
        ],
    },

    {
        id: "rising-terror",

        name: "Rising Terror",

        difficulty: "hard",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Hard - Rising Terror.jpg",

        flavorText:
            "The full moon seems to stir the blood of every beast. Even listless, old hounds seem possessed by the spirit of some feral ancestor, vicious and cruel.",

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
            "Resolve the Reckoning effect on each Monster on the game board twice. If there are no Monsters on the game board with a Reckoning effect, advance Doom by 1.",

        effects: [
            {
                type: "mythos-special",
                id: "rising-terror",
            },
        ],
    },

    {
        id: "spreading-sickness",

        name: "Spreading Sickness",

        difficulty: "hard",

        type: "rumor",

        image:
            "/cards/Mythos/Mythos/Hard - Spreading Sickness.jpg",

        flavorText:
            "When people see your jaundiced skin or hear your loud coughing fits, they avoid you like a leper. Without exception, the disease next brings fever and swollen red sores. Death follows in a few weeks.",

        icons: [
            {
                type: "spawn-clues",
            },
            {
                type: "spawn-rumor",
                spaceId: "space-17",
            },
        ],

        text:
            "As an encounter, an investigator on space 17 may consult the Bombay doctors. He may spend Clues equal to the number of investigators to solve this Rumor. He may spend 1 fewer Clue for each Health token on this card.",

        effects: [
            {
                type: "mythos-special",
                id: "spreading-sickness",
            },
        ],

        reckoning: {
            type: "spreading-sickness",
        },
    },

    {
        id: "strange-sightings",

        name: "Strange Sightings",

        difficulty: "hard",

        type: "ongoing",

        image:
            "/cards/Mythos/Mythos/Hard - Strange Sightings.jpg",

        flavorText:
            "Pulling the curtain back slightly, you see that same suspicious man watching your hotel. You're going to have to sneak out the back exit and try to lose him again.",

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
            "Investigators cannot perform Rest actions.",

        effects: [],

        reckoning: {
            type: "strange-sightings",
        },
    },

    {
        id: "the-storm",

        name: "The Storm",

        difficulty: "hard",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Hard - The Storm.jpg",

        flavorText:
            "The wind suddenly picks up, causing a shiver despite the clear, blue sky. Looking to the horizon, you see steely-gray clouds approaching.",

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
            "Each investigator discards Clues equal to the number of Rumor Mythos cards in play. If there are no Rumor Mythos cards in play, draw and resolve 1 Rumor Mythos card from the game box.",

        effects: [
            {
                type: "mythos-special",
                id: "the-storm",
            },
        ],
    },

    {
        id: "tied-to-a-dark-purpose",

        name: "Tied to a Dark Purpose",

        difficulty: "hard",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Hard - Tied to a Dark Purpose.jpg",

        flavorText:
            "Keep running. Never look back. You've known for a long time now that the consequences of your actions are always one step behind you. But now, it's all catching up to you.",

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
            "Resolve the Reckoning effect on all Conditions, treating all die rolls as 1s.",

        effects: [
            /*
            * TODO:
            *
            * For ALL Conditions currently in play:
            *
            *   -> Resolve the Condition's Reckoning effect.
            *   -> Treat every die roll made by the effect as 1.
            */
        ],
    },

    {
        id: "torn-asunder",

        name: "Torn Asunder",

        difficulty: "hard",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Hard - Torn Asunder.jpg",

        flavorText:
            "Strange forces stretch you in all directions. The portals between worlds are pulling reality apart, and you feel these unearthly energies coming from all corners of the globe.",

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
            "Each investigator loses Health equal to the number of Gates on the game board that correspond to the current Omen. If there are no Gates that correspond to the current Omen, advance the Omen by 1.",

        effects: [
            /*
            * TODO:
            *
            * For EACH investigator:
            *
            *   -> Count Gates on the board that correspond
            *      to the current Omen.
            *   -> Investigator loses Health equal to that number.
            *
            * If there are no matching Gates:
            *
            *   -> Advance the Omen by 1.
            */
        ],
    },

    {
        id: "web-between-worlds",

        name: "Web Between Worlds",

        difficulty: "hard",

        type: "rumor",

        image:
            "/cards/Mythos/Mythos/Hard - Web Between Worlds.jpg",

        flavorText:
            "A sect of Atlach-Nachda worshipers have called forth the nightmarish spider.",

        icons: [
            {
                type: "spawn-clues",
            },
            {
                type: "spawn-rumor",
                spaceId: "space-9",
            },
        ],

        text:
            "When this card enters play, spawn the Spinner of Webs Epic Monster on space 9. When it is defeated, solve this Rumor.\n\nWhen there are no Eldritch tokens on this card, investigators lose the game.",

        effects: [
            /*
            * TODO:
            *
            * When this Rumor enters play:
            *
            *   -> Spawn the Spinner of Webs Epic Monster
            *      on Space 9.
            *
            *   -> When that Epic Monster is defeated,
            *      solve this Rumor.
            *
            * If there are no Eldritch tokens on this card:
            *
            *   -> Investigators lose the game.
            */
        ],

        /*
        * TODO: RECKONING
        *
        *   -> Discard 1 Eldritch token from this card,
        *      unless the investigators as a group spend
        *      Clues equal to half the number of investigators.
        */
    },
]