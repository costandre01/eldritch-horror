import type { MythosDefinition } from "../../../game/models/Mythos";

export const normalMythos: MythosDefinition[] = [
    {
        id: "a-dark-power",

        name: "A Dark Power",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - A Dark Power.jpg",

        flavorText:
            "Lightning cracks across the sky. You have a sinking dread that all the good you've accomplished is about to be undone.",

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
            "Each Monster recovers all Health. Then each investigator immediately encounters each Monster on his space in the order of his choice.",

        effects: [
            {
                type: "mythos-dark-power",
            }
        ],
    },

    {
        id: "ancient-guardians",

        name: "Ancient Guardians",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - Ancient Guardians.jpg",

        flavorText:
            "An article on the back page of the newspaper catches your attention. An unexplained attack on a remote outpost left no survivors. You've read about two other similar attacks happening in the same region. You can see that the forgotten corners of the globe are growing more dangerous.",

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
            "Spawn 2 Monsters on the Active Expedition space.",

        effects: [
            {
                type: "spawn-monsters",

                amount: 2,
                
                location: "active-expedition",
            },
        ],
    },

    {
        id: "arrests-made-in-murder-case",

        name: "Arrests Made in Murder Case!",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - Arrests Made in Murder Case!.jpg",

        flavorText:
            "You open the door of your hotel to find several stone-faced policemen. There's been a lot of unexplained deaths and nothing attracts suspicion like being a stranger.",

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
            "Each investigator on a City space with a Weapon possession tests Influence. If he fails, he discards 1 Weapon possession and gains a Detained Condition.",

        effects: [
            {
                type: "mythos-special",
                id: "arrests-made-in-murder-case",
            },
        ],
    },

    {
        id: "blood-flows",

        name: "Blood Flows",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - Blood Flows.jpg",

        flavorText:
            "\"Strong gris-gris,\" the old man told you. You've been wearing the pouch around your neck ever since New Orleans. \"You want it to spill blood fuh you,\" he drawled, \"you has to spill your blood fuh the gris-gris.\"",

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
            "The Lead Investigator discards 1 Monster of his choice and loses Health equal to its toughness.",

        effects: [
            {
                type: "mythos-special",
                id: "blood-flows",
            },
        ],
    },

    {
        id: "burden-of-greed",

        name: "Burden of Greed",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - Burden of Greed.jpg",

        flavorText:
            "You can't sleep and can't stop shaking. Compulsively, you open up your suitcase and count everything, gripping everything you own so tightly your hands bleed.",

        icons: [
            {
                type: "advance-omen",
            },
            {
                type: "mythos-reckoning",
            },
            {
                type: "spawn-clues",
            },
        ],

        text:
            "Each investigator may discard any number of Item possessions, then he loses 1 Health for each Item possession he has.",

        effects: [
            {
                type: "mythos-special",
                id: "burden-of-greed",
            },
        ],
    },

    {
        id: "calling-the-elder-things",

        name: "Calling the Elder Things",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - Calling the Elder Things.jpg",

        flavorText:
            "According to the police report, several individuals entered the warehouse in the middle of the night. They performed some sort of ritual which culminated in their death. What you know that the police don't is that, afterward, something inhuman left that warehouse.",

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
            "Spawn 1 Monster on each space that contains a Cultist Monster.",

        effects: [
            {
                type: "mythos-special",
                id: "calling-the-elder-things",
            },
        ],
    },

    {
        id: "dimensional-instability",

        name: "Dimensional Instability",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - Dimensional Instability.jpg",

        flavorText:
            "You cannot believe that this gibbering lunatic was once the smiling, lucid lawyer you spoke to this morning. \"Collapsed,\" his trembling hands indicated empty air. \"The worlds collided, and the door collapsed!\" He abruptly pulls himself off the floor and looks out the small window of his cell. \"But so too will they pull. They will rip and tear, and a new door will open elsewhere.\"",

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
            "Discard each Gate that corresponds to the current Omen and advance Doom by 1 for each Gate discarded.",

        effects: [
            {
                type: "mythos-special",
                id: "dimensional-instability",
            },
        ],
    },

    {
        id: "driven-to-bankruptcy",

        name: "Driven to Bankruptcy",

        difficulty: "normal",

        type: "ongoing",

        image:
            "/cards/Mythos/Mythos/Medium - Driven to Bankruptcy.jpg",

        flavorText:
            "Walking down the street, you are surrounded by locked doors and boarded up windows. You see only a few people striding down the sidewalk, and almost all of them avoid eye contact. Those that do look you in the eye glare at you suspiciously.",

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
            "When this card enters play, discard all cards from the reserve. Cards cannot be placed in the reserve.",

        effects: [
            {
                type: "mythos-special",
                id: "driven-to-bankruptcy",
            },
        ],

        reckoning: {
            type:
                "discard-self-and-place-assets",
        },
    },

    {
        id: "faded-from-society",

        name: "Faded From Society",

        difficulty: "normal",

        type: "rumor",

        image:
            "/cards/Mythos/Mythos/Medium - Faded From Society.jpg",

        flavorText:
            "Some dark magic has taken hold in you. Friends have started ignoring you as if you weren't even in the room. It's getting worse, and you fear that soon you will be invisible to every other person on Earth!",

        icons: [
            {
                type: "spawn-clues",
            },
            {
                type: "spawn-rumor",
                spaceId: "space-16",
            },
            {
                type: "place-eldritch-tokens",
                amount: 4,
            },
        ],

        text:
            "As an encounter, an investigator on space 16 may attempt to research similar occurrences from the past. If he passes, he learns about a Russian folktale where children go missing; he may spend Clues equal to half the number of investigators to solve this Rumor.",

        effects: [
            {
                type: "mythos-special",
                id: "faded-from-society-encounter",
            },
        ],

        reckoning: {
            type: "faded-from-society",
        },
    },

    {
        id: "from-bad-to-worse",

        name: "From Bad to Worse",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - From Bad to Worse.jpg",

        flavorText:
            "Piece by piece, you are falling apart. It's getting harder to successfully negotiate simple human interactions. Your wounds won't stop bleeding, and your hands won't stop shaking.",

        icons: [
            {
                type: "advance-omen",
            },
            {
                type: "mythos-reckoning",
            },
            {
                type: "spawn-clues",
            },
        ],

        text:
            "Each investigator loses 1 Health for each Injury Condition he has, loses 1 Sanity for each Madness Condition he has, and discards 1 Clue for each Deal Condition he has.",

        effects: [
            {
                type: "mythos-special",
                id: "from-bad-to-worse",
            },
        ],
    },

    {
        id: "haunting-nightmares",

        name: "Haunting Nightmares",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - Haunting Nightmares.jpg",

        flavorText:
            "You wake up in mid-scream, and your heart is racing. What little you can remember of your nightmare was so visceral and horrific that you dread falling back asleep.",

        icons: [
            {
                type: "advance-omen",
            },
            {
                type: "mythos-reckoning",
            },
            {
                type: "spawn-clues",
            },
        ],

        text:
            "Each investigator loses 2 Sanity and gains a Madness Condition unless he spends 1 Clue.",

        effects: [
            {
                type: "mythos-special",
                id: "haunting-nightmares",
            },
        ],
    },

    {
        id: "heat-wave-singes-the-globe",

        name: "Heat Wave Singes the Globe",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - Heat Wave Singes the Globe.jpg",

        flavorText:
            "Sweating and exhausted, you stop to rest in what little shade you can find. You've already heard stories of this heat wave claiming the lives of sick or elderly individuals. You fear that if you keep going at this pace, you might fall victim to it as well.",

        icons: [
            {
                type: "advance-omen",
            },
            {
                type: "mythos-reckoning",
            },
            {
                type: "spawn-clues",
            },
        ],

        text:
            "Each investigator loses 3 Health unless he becomes Delayed.",

        effects: [
            {
                type: "mythos-special",
                id: "heat-wave-singes-the-globe",
            },
        ],
    },

    {
        id: "legitimate-banking",

        name: "Legitimate Banking",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - Legitimate Banking.jpg",

        flavorText:
            "The man in the suit slides the contract across the desk. \"We've spoken to the police and the customs agents, and all of the necessary payments have been made. If you'll just sign this, indicating that you understand your obligations, you can be on your way.\" His assistant places a pen in your hand.",

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
            "The Lead Investigator gains a Debt Condition. If the Lead Investigator already had a Debt Condition, he resolves the reckoning effect on that card, treating all die rolls as 1s.",

        effects: [
            {
                type: "mythos-special",
                id: "legitimate-banking",
            },
        ],
    },

    {
        id: "no-peace-for-the-fallen",

        name: "No Peace For the Fallen",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - No Peace For the Fallen.jpg",

        flavorText:
            "You can feel the decay clinging to you. This sickening putrefaction is everywhere, and you fear the toll it's taking on your friends lying in hospital beds.",

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
            "Discard all possessions on defeated investigators' sheets and return all defeated investigator tokens and sheets to the game box. Then the Lead Investigator gains a Cursed Condition.",

        effects: [
            {
                type: "mythos-special",
                id: "no-peace-for-the-fallen",
            },
        ],
    },

    {
        id: "patrolling-the-border",

        name: "Patrolling the Border",

        difficulty: "normal",

        type: "ongoing",

        image:
            "/cards/Mythos/Mythos/Medium - Patrolling the Border.jpg",

        flavorText:
            "The soldiers refuse to explain why you must pass through this checkpoint, and simply asking makes you more suspicious in their eyes.",

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
            "When this card enters play, the Lead Investigator chooses 1 investigator to become Delayed.",

        effects: [
            {
                type: "mythos-special",
                id: "patrolling-the-border",
            },
        ],

        reckoning: {
            type: "city-investigators-test-observation",
        },
    },

    {
        id: "return-of-the-ancient-ones",

        name: "Return of the Ancient Ones",

        difficulty: "normal",

        type: "rumor",

        image:
            "/cards/Mythos/Mythos/Medium - Return of the Ancient Ones.jpg",

        flavorText:
            "After a sudden burst of flying debris, you are confronted by a terrifying figure. It is a stark reminder that dark forces in this world are working tirelessly to annihilate you.",

        icons: [
            {
                type: "spawn-clues",
            },
            {
                type: "spawn-rumor",
                spaceId: "space-19",
            },
        ],

        text:
            "When an investigator on space 19 defeats a Monster, he may spend 1 Clue to place that Monster on this card. When the total toughness of Monsters on this card is equal to or greater than the number of investigators, solve this Rumor.",

        effects: [
            {
                type: "mythos-special",
                id: "return-of-the-ancient-ones",
            },
        ],

        reckoning: {
            type: "return-of-the-ancient-ones",
        },
    },

    {
        id: "stars-aligned",

        name: "Stars Aligned",

        difficulty: "normal",

        type: "rumor",

        image:
            "/cards/Mythos/Mythos/Medium - Stars Aligned.jpg",

        flavorText:
            "A dozen unpleasant-looking strangers have settled into Panama with a large collection of astronomical reference books. There is something unique about this place and time that allows them to rip apart the fabric of reality.",

        icons: [
            {
                type: "spawn-clues",
            },
            {
                type: "spawn-rumor",
                spaceId: "space-7",
            },
        ],

        text:
            "As an encounter, an investigator on space 7 may attempt to find these strangers based on his observations of the stars. If he passes, he may spend Clues equal to half the number of investigators to solve this Rumor.",

        effects: [
            {
                type: "mythos-special",
                id: "stars-aligned-encounter",
            },
        ],

        reckoning: {
            type: "stars-aligned",
        },
    },

    {
        id: "the-bermuda-triangle",

        name: "The Bermuda Triangle",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - The Bermuda Triangle.jpg",

        flavorText:
            "These sudden thunderstorms have grown more common. Twice a day, rain that smells like seawater floods the streets, and cold winds that cut like glass threaten to pull doors off their hinges.",

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
            "Each investigator rolls 1 die. On a 1 or 2, he moves to space 8 and becomes Delayed.",

        effects: [
            {
                type: "mythos-special",
                id: "the-bermuda-triangle",
            },
        ],
    },

    {
        id: "the-wind-walker",

        name: "The Wind-Walker",

        difficulty: "normal",

        type: "rumor",

        image:
            "/cards/Mythos/Mythos/Medium - The Wind-Walker.jpg",

        flavorText:
            "The weather grows worse. Snow and ice cover cities that have never seen such weather before in their history.",

        icons: [
            {
                type: "spawn-clues",
            },
            {
                type: "place-eldritch-tokens",
                amount: 4,
            },
        ],

        text:
            "When this card enters play, spawn the Wind-Walker Epic Monster on space 4. When it is defeated, solve this Rumor.\n\nWhen there are no Eldritch tokens on this card, each investigator becomes Delayed and loses 6 Health, then solve this Rumor.",

        effects: [
            {
                type: "mythos-special",
                id: "the-wind-walker",
            },
        ],
        reckoning: {
            type: "wind-walker",
        },
    },

    {
        id: "the-world-shakes",

        name: "The World Shakes",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - The World Shakes.jpg",

        flavorText:
            "The scope of the tremor was so vast that newspapers in every country reported on the damage done and the tragic destruction of ancient wonders.",

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
            "Each investigator on the Active Expedition space or an adjacent space loses 2 Health and becomes Delayed. Then search the Expedition Encounter deck for each card corresponding to the Active Expedition and return it to the game box. Then shuffle the Expedition Encounter deck.",

        effects: [
            {
                type: "mythos-special",
                id: "the-world-shakes",
            },
        ],
    },

    {
        id: "tide-of-despair",

        name: "Tide of Despair",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - Tide of Despair.jpg",

        flavorText:
            "A cold, bitter wind howls through the trees and people everywhere cling to their fires and blankets. The chill has settled into your bones, and there's no warmth to be found.",

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
            "Each investigator loses 2 Health and 2 Sanity unless he discards a Blessed Condition.",

        effects: [
            {
                type: "mythos-special",
                id: "tide-of-despair",
            },
        ],
    },

    {
        id: "treacherous-magic",

        name: "Treacherous Magic",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - Treacherous Magic.jpg",

        flavorText:
            "Sitting down for a simple meal in a restaurant, it strikes you how alien the people around you seem. After everything you've seen and all the arcane secrets you have learned, can you truly think of yourself as one of them? The maître d’ asks you to please stop carving into the table with the knife.",

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
            "Each investigator may discard any number of Spells, then he loses 1 Sanity for each Spell he has. Each investigator that lost Sanity from this effect also gains a Madness Condition.",

        effects: [
            {
                type: "mythos-special",
                id: "treacherous-magic",
            },
        ],
    },

    {
        id: "unexpected-betrayal",

        name: "Unexpected Betrayal",

        difficulty: "normal",

        type: "event",

        image:
            "/cards/Mythos/Mythos/Medium - Unexpected Betrayal.jpg",

        flavorText:
            "After weeks of encountering ancient and monstrous creatures, you were unprepared for something so cold and personal as being betrayed by an associate. Lies can be every bit as destructive as any wizard's curse.",

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
            "Each investigator with at least 1 Ally Asset loses 3 Health and discards 1 Ally Asset.",

        effects: [
            {
                type: "mythos-special",
                id: "unexpected-betrayal",
            },
        ],
    },
]