import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

export const lolaHayes: InvestigatorDefinition = {
  id: "lola-hayes",

  name: "Lola Hayes",

  occupation: "The Actress",

  roles: [
    "all-rounder",
    "support",
  ],

  skills: {
    lore: 2,
    influence: 4,
    observation: 2,
    strength: 2,
    will: 3,
  },

  maxHealth: 5,

  maxSanity: 7,

  focusLimit: 2,

  startingSpaceId: "tokyo",

  startingClues: 0,

  startingAssetIds: [
    "asset-derringer-18",
  ],

  startingSpellIds: [],

  /*
   * Lola starts with 1 Improvement
   * of her choice.
   */
  startingImprovementCount: 1,

  /*
   * ============================================================
   * ABILITIES
   * ============================================================
   */

  abilities: [
    {
      id: "lola-action",

      type: "action",

      name: "Method Acting",

      description:
        "Spend any number of Improvement tokens, then improve 1 skill of your choice for each token spent.\n\nA +2 Improvement token counts as 2 tokens.",
    },

    {
      id: "lola-passive",

      type: "passive",

      name: "Supporting Cast",

      description:
        "Once per round, an investigator on your space may roll 1 additional die when resolving a test.",
    },
  ],

  /*
   * ============================================================
   * PERSONAL STORY
   * ============================================================
   */

  personalStory: {
    id: "in-the-limelight",

    name: "In the Limelight",

    description:
      "You are addicted to the attention.\n\nThe lights, the cameras, the interviewers and suitors — all of it. Better yet, you can use your rising influence to guide the future to the light.",

    mission: {
      type: "pass-tests-with-each-skill",

      description:
        "The first time you pass a test for each skill, place a matching Improvement token on this card.\n\nThen, if an Improvement token for each skill is on this card, discard this card and gain the Method Acting Reward.\n\nWhen you have only 1 [health] Health or 1 [sanity] Sanity, discard this card and gain the Denouement Consequence.",

      targetCount: 5,
    },

    reward: {
      id: "method-acting",

      name: "Method Acting",

      description:
        "When you gain this card, improve 2 skills of your choice.\n\nAfter you perform your action ability, you may perform 1 additional action.",
    },

    consequence: {
      id: "denouement",

      name: "Denouement",

      description:
        "Whenever you fail a test, discard 1 Improvement token.\n\nIf you cannot, lose all of your [sanity] Sanity.\n\nThis loss of Sanity cannot be prevented.",
    },
  },

  /*
   * ============================================================
   * DEFEAT ENCOUNTERS
   * ============================================================
   */

  defeatEncounters: [
    {
      id: "lola-defeat-health",

      type: "health-loss",

      title:
        "In Case of Crippling Injury or Death",

      description:
        "\"I'm fine darling. Help yourself, by the way.\" Lola nods at the equipment strewn across the hotel room. Gain all of her possessions. As convincing as she is, you know she's in pain. You try to persuade her to visit a hospital. If you pass, she sighs a breath of relief and tells you of all the horrors she's encountered; retreat [doom] Doom by 1. If you fail, the day after Lola leaves the city, she succumbs to her wounds. Whether you pass or not, discard her Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "She sighs a breath of relief and tells you of all the horrors she's encountered; retreat [doom] Doom by 1.",

        onFailure:
          "The day after Lola leaves the city, she succumbs to her wounds.",
      },

      discardInvestigatorToken: true,
    },

    {
      id: "lola-defeat-sanity",

      type: "sanity-loss",

      title:
        "In Case of Insanity or Other Psychosis",

      description:
        "The trail of Lola's belongings leads you into a derelict theater. Gain all of her possessions. She's on the stage, wringing her blood-soaked hands and reciting, \"Will these hands ne'er be clean?\" You try to direct her performance, hoping to better reveal her character. If you pass, she tells you of the Tattered King, indicating a goat she killed; retreat [doom] Doom by 1. If you fail, Lola's dialogue degenerates into gibberish. Whether you pass or not, discard her Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "She tells you of the Tattered King, indicating a goat she killed; retreat [doom] Doom by 1.",

        onFailure:
          "Lola's dialogue degenerates into gibberish.",
      },

      discardInvestigatorToken: true,
    },
  ],
};