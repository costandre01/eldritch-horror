import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

export const leoAnderson: InvestigatorDefinition = {
  id: "leo-anderson",

  name: "Leo Anderson",

  occupation: "The Expedition Leader",

  roles: [
    "expedition",
    "all-rounder",
  ],

  skills: {
    lore: 2,
    influence: 2,
    observation: 3,
    strength: 3,
    will: 3,
  },

  maxHealth: 6,

  maxSanity: 6,

  focusLimit: 2,

  startingSpaceId: "space-10",

  startingClues: 0,

  startingAssetIds: [
    "asset-hired-muscle",
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
      id: "leo-action",

      type: "action",

      name: "Expedition Leader",

      description:
        "Test [influence] Influence.\n\nIf you pass, gain 1 Ally Asset of your choice from the reserve or the discard pile.",
    },

    {
      id: "leo-passive",

      type: "passive",

      name: "Wilderness Expertise",

      description:
        "If you are on a [wilderness] Wilderness space, investigators on your space roll 1 additional die when resolving tests.",
    },
  ],

  /*
   * ============================================================
   * PERSONAL STORY
   * ============================================================
   */

  personalStory: {
    id: "the-expedition",

    name: "The Expedition",

    description:
      "Keep moving. You can die on your own time.",

    mission: {
      type: "ally-assets",

      description:
        "When you have 5 or more Ally Assets, discard this card and gain the Full Party Reward.\n\nWhen another investigator is defeated or devoured, discard this card and gain the All Your Fault Consequence.",

      targetCount: 5,
    },

    reward: {
      id: "full-party",

      name: "Full Party",

      description:
        "When you gain this card, gain 1 Character Unique Asset.\n\nYou cannot discard your Ally Assets unless you choose to.",
    },

    consequence: {
      id: "all-your-fault",

      name: "All Your Fault",

      description:
        "Roll 1 fewer die when resolving an [influence] Influence or [strength] Strength test.\n\nYour maximum [health] Health and [sanity] Sanity are reduced by 1.",
    },
  },

  /*
   * ============================================================
   * DEFEAT ENCOUNTERS
   * ============================================================
   */

  defeatEncounters: [
    {
      id: "leo-defeat-health",

      type: "health-loss",

      title:
        "In Case of Crippling Injury or Death",

      description:
        "\"It's all in the drawer,\" Leo tells you. \"Take it and leave me here to die. I deserve it.\" Gain all of his possessions. Leo's injuries have left him bedridden and in agony in this hotel. Worse, he's lost his will to live. You try to convince him that he hasn't failed his friends. If you pass, he draws you several maps and promises to let you check him into a hospital; retreat [doom] Doom by 1. If you fail, he never speaks to you again. Whether you pass or not, discard his Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "He draws you several maps and promises to let you check him into a hospital; retreat [doom] Doom by 1.",

        onFailure:
          "He never speaks to you again.",
      },

      discardInvestigatorToken: true,
    },

    {
      id: "leo-defeat-sanity",

      type: "sanity-loss",

      title:
        "In Case of Insanity or Other Psychosis",

      description:
        "You find Leo's canvas bag in his hotel room. Gain all of his possessions. While you are distracted, Leo attacks you. His face covered with tribal markings, and he speaks a hodgepodge of tribal dialects. You try to subdue him. If you pass, you get Leo to an asylum, and the doctors learn some of what happened to him; retreat [doom] Doom by 1. If you fail, Leo is gone when you regain consciousness. Whether you pass or not, discard his Investigator token.",

      test: {
        skill: "strength",

        modifier: 0,

        onSuccess:
          "You get Leo to an asylum, and the doctors learn some of what happened to him; retreat [doom] Doom by 1.",

        onFailure:
          "Leo is gone when you regain consciousness.",
      },

      discardInvestigatorToken: true,
    },
  ],
};