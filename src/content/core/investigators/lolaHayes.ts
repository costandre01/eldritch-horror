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
        "Spend any number of Improvement tokens, then improve 1 skill of your choice for each token spent (a +2 Improvement token counts as 2 tokens).",
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
   * PERSONAL HISTORY
   * ============================================================
   */

  personalStory: {
    id: "in-the-limelight",

    name: "In the Limelight",

    description:
      "Around the world, Lola has performed dramatic roles for sold-out houses. However, after being cast in the controversial play, The King in Yellow, Lola needed to \"take some time\" to recover from her \"exhaustion.\" Now that she's checked herself out of the asylum, she's ready for her big comeback. But this time she'll play a different role in the fight against the horrors that threaten this world. She's started by traveling to Tokyo to track down the only other surviving cast member of her previous theatrical endeavor.",
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
        "\"I'm fine, darling. Help yourself, by the way.\" Lola nods at the equipment strewn across the hotel room. Gain all of her possessions. As convincing as she is, you know she's in pain. You try to persuade her to visit a hospital [influence]. If you pass, she sighs a breath of relief and tells you of all the horrors she's encountered; retreat Doom by 1. If you fail, the day after Lola leaves the city, she succumbs to her wounds. Whether you pass or not, discard her Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "She sighs a breath of relief and tells you of all the horrors she's encountered; retreat Doom by 1.",

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
        "The trail of Lola's belongings leads you into a derelict theater. Gain all of her possessions. She's on the stage wringing her blood-soaked hands and reciting, \"Will these hands ne'er be clean?\" You try to direct her performance, hoping to better reveal her character [influence]. If you pass, she tells you of the Tattered King, indicating a goat she's killed; retreat Doom by 1. If you fail, Lola's dialogue degenerates into gibberish. Whether you pass or not, discard her Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "She tells you of the Tattered King, indicating a goat she's killed; retreat [doom] Doom by 1.",

        onFailure:
          "Lola's dialogue degenerates into gibberish.",
      },

      discardInvestigatorToken: true,
    },
  ],
};