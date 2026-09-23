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
   * PERSONAL HISTORY
   * ============================================================
   */

  personalStory: {
    id: "cracking-the-code",

    name: "Cracking the Code",

    description:
      "Everyone expected great things from Trish when she was young. In school, she excelled in athletics and the sciences, but she surprised everyone after graduation by settling into a humble position at a commercial code company. What almost no one knows is that this particular company is a front for the Bureau's code-breaking agency, the Black Chamber. Now she finds herself in the city of Krasnoyarsk meeting another agent who has important information about an impending threat from a world beyond our own.",
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
        "Trish falls in and out of consciousness when you visit her in the hospital, but she happily turns over her equipment. Gain all of her possessions. Unfortunately, her journal has been seized by the police. You'll have to convince the local authorities to turn the book over to you [influence]. If you pass, you can read through all of Trish's notes; retreat [doom] Doom by 1. If you fail, the knowledge is lost. Whether you pass or not, discard her Investigator token.",

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
        "The doctor grimly hands you the items Trish had when she was brought in. Gain all of her possessions. \"It's not good,\" he warns. Inside her padded cell, she's written on every surface with a thick black pen. The text is a mix of dozens of codes. You start searching for anything you recognize [observation]. If you pass, you spot a hidden message in a familiar code; retreat [doom] Doom by 1. If you fail, Trish's message remains locked away. Whether you pass or not, discard her Investigator token.",

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