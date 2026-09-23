import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

export const jimCulver: InvestigatorDefinition = {
  id: "jim-culver",

  name: "Jim Culver",

  occupation: "The Musician",

  roles: [
    "magic",
    "support",
  ],

  skills: {
    lore: 3,
    influence: 3,
    observation: 2,
    strength: 2,
    will: 3,
  },

  maxHealth: 7,

  maxSanity: 5,

  startingSpaceId: "space-6",

  startingClues: 1,

  startingAssetIds: [],

  startingSpellIds: [
    "spell-shriveling",
  ],

  startingImprovementCount: 0,

  /*
   * ============================================================
   * ABILITIES
   * ============================================================
   */

  abilities: [
    {
      id: "jim-action",

      type: "action",

      name: "Healing Melody",

      description:
        "Each investigator on your space recovers 1 [sanity] Sanity.",
    },

    {
      id: "jim-passive",

      type: "passive",

      name: "Dead Rising",

      description:
        "Investigators on your space roll 1 additional die when resolving tests during Combat Encounters.",
    },
  ],

  /*
   * ============================================================
   * PERSONAL HISTORY
   * ============================================================
   */

  personalStory: {
    id: "dead-rising",

    name: "Dead Rising",

    description:
      "You can learn much from the departed.\n\nIn particular, those who have tried—and failed—to off you and your friends seem much more willing to speak in death than in life.",
  },

  /*
   * ============================================================
   * DEFEAT ENCOUNTERS
   * ============================================================
   */

  defeatEncounters: [
    {
      id: "jim-defeat-health",

      type: "health-loss",

      title:
        "In Case of Crippling Injury or Death",

      description:
        "Seeing Jim in this hospital bed is heartbreaking. He hands you a key to a safety deposit box. Gain all of his possessions. The severity of the injuries means that he'll never speak or play music again. You gently try to coax him into writing down everything he's learned [influence]. If you pass, Jim fills a dozen sheets of paper with arcane illustrations; retreat [doom] Doom by 1. If you fail, all Jim wants is to listen to a record of his own music played over and over. Whether you pass or not, discard his Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "Jim fills a dozen sheets of paper with arcane illustrations; retreat [doom] Doom by 1.",

        onFailure:
          "All Jim wants is to listen to a record of his own music played over and over.",
      },

      discardInvestigatorToken: true,
    },

    {
      id: "jim-defeat-sanity",

      type: "sanity-loss",

      title:
        "In Case of Insanity or Other Psychosis",

      description:
        "At the cemetery's gate, you find Jim's old suitcase and hear wild and erratic music ahead. Gain all of his possessions. Summoning all your nerve, you walk toward the crowd of dancing cadavers that surround Jim [will]. If you pass, you spend the night learning the secrets of the dead; retreat [doom] Doom by 1. If you fail, you run, and Jim is never seen by a living soul again. Whether you pass or not, discard his Investigator token.",

      test: {
        skill: "will",

        modifier: 0,

        onSuccess:
          "You spend the night learning the secrets of the dead; retreat [doom] Doom by 1.",

        onFailure:
          "You run, and Jim is never seen by a living soul again.",
      },

      discardInvestigatorToken: true,
    },
  ],
};