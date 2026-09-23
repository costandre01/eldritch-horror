import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

export const silasMarsh: InvestigatorDefinition = {
  id: "silas-marsh",

  name: "Silas Marsh",

  occupation: "The Sailor",

  roles: [
    "all-rounder",
  ],

  skills: {
    lore: 1,
    influence: 3,
    observation: 3,
    strength: 3,
    will: 3,
  },

  maxHealth: 8,

  maxSanity: 4,

  startingSpaceId: "sydney",

  startingClues: 0,

  startingAssetIds: [
    "asset-fishing-net",
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
      id: "silas-action",

      type: "action",

      name: "Full Sail",

      description:
        "Move 1 space along a [ship-path] Ship path, then perform 1 additional action.",
    },

    {
      id: "silas-passive",

      type: "passive",

      name: "At Sea",

      description:
        "If you are on a [sea] Sea space, investigators on your space roll 1 additional die when resolving tests.",
    },
  ],

  /*
   * ============================================================
   * PERSONAL HISTORY
   * ============================================================
   */

  personalStory: {
    id: "smooth-sailing",

    name: "Smooth Sailing",

    description:
      "Even as a child in Innsmouth, Silas had a special connection to the sea. He's an able and well-reasoned man on land, but on the ocean he possesses a singular strength and wit. It's earned him a sterling reputation in every port across the globe, particularly in Sydney, where Silas set ashore last night. But this morning, the smell of the briny air carries dread as well as joy. There is something in his past, something in Innsmouth, that he knows will someday catch up to him.",
  },

  /*
   * ============================================================
   * DEFEAT ENCOUNTERS
   * ============================================================
   */

  defeatEncounters: [
    {
      id: "silas-defeat-health",

      type: "health-loss",

      title:
        "In Case of Crippling Injury or Death",

      description:
        "Silas had hidden his belongings in the prearranged cache, but the man himself is nowhere to be found. Gain all of his possessions. You search local hospitals filled with the unidentified dead or dying [observation]. If you pass, you find Silas alive but incapacitated, and you arrange a private nurse to watch over him; retreat [doom] Doom by 1. If you fail, Silas dies alone and unrecognized. Whether you pass or not, discard his Investigator token.",

      test: {
        skill: "observation",

        modifier: 0,

        onSuccess:
          "You find Silas alive but incapacitated, and you arrange a private nurse to watch over him; retreat [doom] Doom by 1.",

        onFailure:
          "Silas dies alone and unrecognized.",
      },

      discardInvestigatorToken: true,
    },

    {
      id: "silas-defeat-sanity",

      type: "sanity-loss",

      title:
        "In Case of Insanity or Other Psychosis",

      description:
        "You find Silas and gain all of his possessions. He has grown pale, and his breath has become a loud wheeze. He tells you, \"I'm a Marsh. It's in my blood. Not long now, I'll join my family, down in the deep.\" You ask a doctor to watch him overnight [influence]. If you pass, the sailor shares all he's learned before dying peacefully in his sleep; retreat [doom] Doom by 1. If you fail, Silas surrenders his humanity and disappears into the sea. Whether you pass or not, discard his Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "The sailor shares all he's learned before dying peacefully in his sleep; retreat [doom] Doom by 1.",

        onFailure:
          "Silas surrenders his humanity and disappears into the sea.",
      },

      discardInvestigatorToken: true,
    },
  ],
};