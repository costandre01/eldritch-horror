import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

export const charlieKane: InvestigatorDefinition = {
  id: "charlie-kane",

  name: "Charlie Kane",

  occupation: "The Politician",

  roles: [
    "support",
  ],

  skills: {
    lore: 2,
    influence: 4,
    observation: 3,
    strength: 2,
    will: 2,
  },

  maxHealth: 4,

  maxSanity: 8,

  startingSpaceId: "san-francisco",

  startingClues: 0,

  startingAssetIds: [
    "asset-personal-assistant",
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
      id: "charlie-action",

      type: "action",

      name: "Political Connections",

      description:
        "Another investigator of your choice may immediately perform 1 additional action.",
    },

    {
      id: "charlie-passive",

      type: "passive",

      name: "Well Connected",

      description:
        "When you perform an Acquire Assets action, you may allow other investigators to gain any cards you purchase.",
    },
  ],

  /*
   * ============================================================
   * PERSONAL HISTORY
   * ============================================================
   */

  personalStory: {
    id: "charlie-kane",

    name: "Personal History",

    description:
      "When the press asks if Charlie is planning a run for national office, he smiles and says that he’s focused on the important issues. The truth is that he would love to launch his campaign, but right now the most important issue is preventing the end of the world without causing a panic. To do this, he’s been calling in favors across the country. Most recently, Charlie’s stopped in San Francisco to visit Hearst Castle. With the help of his friends and his finances, Charlie believes he can fix this problem without sacrificing a single vote.",
  },

  /*
   * ============================================================
   * DEFEAT ENCOUNTERS
   * ============================================================
   */

  defeatEncounters: [
    {
      id: "charlie-defeat-health",

      type: "health-loss",

      title:
        "In Case of Crippling Injury or Death",

      description:
        "The nurse at the front desk hands you a parcel. Gain all of his possessions. \"Mr. Kane said to give you this package, but the doctor insists that no visitors be admitted.\" You try to convince her to make an exception for you [influence]. If you pass, you find that Charlie's health is beyond recovery, but he's still in good spirits and you have a long talk; retreat [doom] Doom by 1. If you fail, Charlie spends the rest of his days cut off from all human contact. Whether you pass or not, discard his Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "You find that Charlie's health is beyond recovery, but he's still in good spirits and you have a long talk; retreat [doom] Doom by 1.",

        onFailure:
          "Charlie spends the rest of his days cut off from all human contact.",
      },

      discardInvestigatorToken: true,
    },

    {
      id: "charlie-defeat-sanity",

      type: "sanity-loss",

      title:
        "In Case of Insanity or Other Psychosis",

      description:
        "The first thing Charlie does when you enter the restaurant is hand you all of his belongings. Gain all of his possessions. He offers you deals, promising to sell you Atlantis and introduce you to Caesar. You negotiate carefully with him [influence]. If you pass, he tells you all he knows in exchange for your napkin ring and a salt shaker; retreat [doom] Doom by 1. If you fail, Charlie gets angry and insists that you'll be sorry when he's the President of the world. Whether you pass or not, discard his Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "He tells you all he knows in exchange for your napkin ring and a salt shaker; retreat [doom] Doom by 1.",

        onFailure:
          "Charlie gets angry and insists that you'll be sorry when he's the President of the world.",
      },

      discardInvestigatorToken: true,
    },
  ],
};