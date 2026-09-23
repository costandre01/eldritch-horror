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
   * PERSONAL HISTORY
   * ============================================================
   */

  personalStory: {
    id: "the-expedition",

    name: "The Expedition",

    description:
      "Leo Anderson has spent his whole life getting into the deadliest and most obscure corners of the globe. Along the way, he's lost good people. Fever takes some; others are claimed by wild beasts. After a recent, disastrous venture in the Yucatan, Leo barely made it back to Buenos Aires alive. He's sick of burying the people who trusted him. But the job's not done yet. The world is in danger, and crying in his drink won't fix that. He's picked up a little hired help here, and in the morning, he'll head back out into the wild.",
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
        "\"It's all in the drawer,\" Leo tells you. \"Take it and leave me here to die. I deserve it.\" Gain all of his possessions. Leo's injuries have left him bedridden and in agony in this hotel. Worse, he's lost his will to live. You try to convince him that he hasn't failed his friends [influence]. If you pass, he draws you several maps and promises to let you check him into a hospital; retreat [doom] Doom by 1. If you fail, he never speaks to you again. Whether you pass or not, discard his Investigator token.",

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
        "You find Leo's canvas bag in his hotel room. Gain all of his possessions. While you are distracted, Leo attacks you. His face covered with tribal markings, and he speaks a hodgepodge of tribal dialects. You try to subdue him [strength]. If you pass, you get Leo to an asylum, and the doctors learn some of what happened to him; retreat [doom] Doom by 1. If you fail, Leo is gone when you regain consciousness. Whether you pass or not, discard his Investigator token.",

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