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

  focusLimit: 2,

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
   * PERSONAL STORY
   * ============================================================
   */

  personalStory: {
    id: "citizen-kane",

    name: "Citizen Kane",

    description:
      "You carefully negotiate with your contacts in order to ensure that all possible permutations of the future have been prepared for.\n\nAfter all, how will you run for office next year if the world has already ended?",

    mission: {
      type: "solve-mystery",

      description:
        "When a Mystery is solved, discard this card and gain the Kane for Office Reward.\n\nWhen [doom] Doom advances to 6 or lower, discard this card and gain the Dark Times consequence.",

      doomThreshold: 6,
    },

    reward: {
      id: "kane-for-office",

      name: "Kane for Office",

      description:
        "When you gain this card, improve [influence] and [will].\n\nOnce per round, when [doom] Doom advances, you may spend 2 [clue] Clues to retreat [doom] Doom by 1.",
    },

    consequence: {
      id: "dark-times",

      name: "Dark Times",

      description:
        "When you perform an Acquire Assets Action, increase the value of each card in the reserve by 1.",
    },
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
        'The nurse at the front desk hands you a parcel. Gain all of his possessions. "Mr. Kane said to give you this package, but the doctor insists that no visitors be admitted." You try to convince her to make you an exception for you.',

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
        "The first thing Charlie does when you enter the restaurant is hand you all of his belongings. Gain all of his possessions. He offers you deals, promising to sell you Atlantis and introduce you to Caesar. You negotiate carefully with him.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "He tells you all he knows in exchange for your napkin ring and a salt shaker; retreat [doom] Doom by 1.",

        onFailure:
          "Charlie gets angry and insists that you'll be sorry when he's President of the world.",
      },

      discardInvestigatorToken: true,
    },
  ],
};