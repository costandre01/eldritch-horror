import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

export const markHarrigan: InvestigatorDefinition = {
  id: "mark-harrigan",

  name: "Mark Harrigan",

  occupation: "The Soldier",

  roles: [
    "combat",
  ],

  skills: {
    lore: 1,
    influence: 2,
    observation: 2,
    strength: 4,
    will: 4,
  },

  maxHealth: 8,

  maxSanity: 4,

  focusLimit: 2,

  startingSpaceId: "space-14",

  startingClues: 0,

  startingAssetIds: [
    "asset-38-revolver",
    "asset-kerosene",
  ],

  startingSpellIds: [],

  startingImprovementCount: 0,

  /*
   * ============================================================
   * ABILITIES
   * ============================================================
   */

  abilities: [
    {
      id: "mark-action",

      type: "action",

      name: "One Man Army",

      description:
        "You and 1 Monster on your space each lose 1 [health] Health.",
    },

    {
      id: "mark-passive",

      type: "passive",

      name: "Unstoppable",

      description:
        "You cannot become Delayed or gain a Detained Condition unless you choose to.",
    },
  ],

  /*
   * ============================================================
   * PERSONAL STORY
   * ============================================================
   */

  personalStory: {
    id: "shadowed-heart",

    name: "Shadowed Heart",

    description:
      "Determined, you are unable to resist the plea for help.\n\nYou will not fail them like you failed her.",

    mission: {
      type: "defeat-monsters",

      description:
        "When you defeat a non-Epic Monster during a Combat Encounter, place that Monster on this card.\n\nThen, if the total toughness of Monsters on this card is 10 or greater, discard this card and gain the A Reason to Live Reward.\n\nWhen another investigator is defeated or devoured, discard this card and gain the Total Abandon Consequence.",

      targetCount: 10,
    },

    reward: {
      id: "a-reason-to-live",

      name: "A Reason to Live",

      description:
        "Your maximum [sanity] Sanity is increased by 2.\n\nWhen you gain this card, recover 2 [sanity] Sanity.\n\nWhen a Monster loses [health] Health from your Action ability, it loses 2 additional Health.",
    },

    consequence: {
      id: "total-abandon",

      name: "Total Abandon",

      description:
        "Increase the damage and horror of Monsters you encounter by 1.\n\nAfter resolving a Combat Encounter, you and that Monster each lose 1 [health] Health.",
    },
  },

  /*
   * ============================================================
   * DEFEAT ENCOUNTERS
   * ============================================================
   */

  defeatEncounters: [
    {
      id: "mark-defeat-health",

      type: "health-loss",

      title:
        "In Case of Crippling Injury or Death",

      description:
        "While you are collecting Mark's things, you smell smoke on the hospital. Gain all of his possessions. The hospital has been set on fire, and you run to Mark's room and try to carry him to safety. If you pass, Mark is able to tell you who set the fire; retreat [doom] Doom by 1. If you fail, the smoke overcomes Mark, and he dies outside the hospital. Whether you pass or not, discard his Investigator token.",

      test: {
        skill: "strength",

        modifier: 0,

        onSuccess:
          "Mark is able to tell you who set the fire; retreat [doom] Doom by 1.",

        onFailure:
          "The smoke overcomes Mark, and he dies outside the hospital.",
      },

      discardInvestigatorToken: true,
    },

    {
      id: "mark-defeat-sanity",

      type: "sanity-loss",

      title:
        "In Case of Insanity or Other Psychosis",

      description:
        "You take custody of Mark's belongings and arrange to visit him in the asylum. Gain all of his possessions. To your dismay, Mark is convinced that you are a creature disguising itself as a human. You do your best to convince him that you are telling the truth. If you pass, he shows you sketches he made of the horrible monsters that he's been hunting; retreat [doom] Doom by 1. If you fail, Mark screams accusations of murder at you. Whether you pass or not, discard his Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "He shows you sketches he made of the horrible monsters that he's been hunting; retreat [doom] Doom by 1.",

        onFailure:
          "Mark screams accusations of murder at you.",
      },

      discardInvestigatorToken: true,
    },
  ],
};