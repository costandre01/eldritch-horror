import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

export const trishScarborough: InvestigatorDefinition = {
  id: "trish-scarborough",

  name: "Trish Scarborough",

  occupation: "The Spy",

  roles: [
    "research",
  ],

  skills: {
    lore: 1,
    influence: 3,
    observation: 4,
    strength: 3,
    will: 2,
  },

  maxHealth: 7,

  maxSanity: 5,

  focusLimit: 2,

  startingSpaceId: "space-16",

  startingClues: 0,

  startingAssetIds: [
    "asset-45-automatic",
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
      id: "trish-action",

      type: "action",

      name: "Code Breaker",

      description:
        "If you do not have any [clue] Clues, gain 1 [clue] Clue.",
    },

    {
      id: "trish-passive",

      type: "passive",

      name: "Decipher",

      description:
        "If an investigator on your space spends a [clue] Clue to reroll a die, he may reroll up to 2 dice instead.",
    },
  ],

  /*
   * ============================================================
   * PERSONAL STORY
   * ============================================================
   */

  personalStory: {
    id: "cracking-the-code",

    name: "Cracking the Code",

    description:
      "We lie all the time. But the truth is in there.\n\nYou just have to know how to decode people.",

    mission: {
      type: "mystery-or-doom",

      description:
        "When a Mystery is solved, discard this card and gain the Breaking the Limits Reward.\n\nWhen [doom] Doom advances to 6 or lower, discard this card and gain the Shadows Consequence.",
    },

    reward: {
      id: "breaking-the-limits",

      name: "Breaking the Limits",

      description:
        "Gain +X to all skills where X is the number of [focus] Focus you have.\n\nOnce per round, when you spend 1 [focus] Focus, you may gain 1 [focus] Focus.",
    },

    consequence: {
      id: "shadows",

      name: "Shadows",

      description:
        "Roll 1 fewer die when resolving an Influence or Observation test.\n\nYou cannot reroll each die more than once.",
    },
  },

  /*
   * ============================================================
   * DEFEAT ENCOUNTERS
   * ============================================================
   */

  defeatEncounters: [
    {
      id: "trish-defeat-health",

      type: "health-loss",

      title:
        "In Case of Crippling Injury or Death",

      description:
        "Trish falls in and out of consciousness when you visit her in the hospital, but she happily turns over her equipment. Gain all of her possessions. Unfortunately, her journal has been seized by the police. You'll have to convince the local authorities to turn the book over to you. If you pass, you can read through all of Trish's notes; retreat [doom] Doom by 1. If you fail, the knowledge is lost. Whether you pass or not, discard her Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "You can read through all of Trish's notes; retreat [doom] Doom by 1.",

        onFailure:
          "The knowledge is lost.",

      },

      discardInvestigatorToken: true,
    },

    {
      id: "trish-defeat-sanity",

      type: "sanity-loss",

      title:
        "In Case of Insanity or Other Psychosis",

      description:
        "The doctor grimly hands you the items Trish had when she was brought in. Gain all of her possessions. \"It's not good,\" he warns. Inside her padded cell, she's written on every surface with a thick black pen. The text is a mix of dozens of codes. You start searching for anything you recognize. If you pass, you spot a hidden message in a familiar code; retreat [doom] Doom by 1. If you fail, Trish's message remains locked away. Whether you pass or not, discard her Investigator token.",

      test: {
        skill: "observation",

        modifier: 0,

        onSuccess:
          "You spot a hidden message in a familiar code; retreat [doom] Doom by 1.",

        onFailure:
          "Trish's message remains locked away.",
      },

      discardInvestigatorToken: true,
    },
  ],
};