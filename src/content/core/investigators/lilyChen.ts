import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

export const lilyChen: InvestigatorDefinition = {
  id: "lily-chen",

  name: "Lily Chen",

  occupation: "The Martial Artist",

  roles: [
    "combat",
    "all-rounder",
  ],

  skills: {
    lore: 2,
    influence: 2,
    observation: 2,
    strength: 4,
    will: 3,
  },

  maxHealth: 6,

  maxSanity: 6,

  focusLimit: 2,

  startingSpaceId: "shanghai",

  startingClues: 0,

  startingAssetIds: [
    "asset-protective-amulet",
    "asset-lucky-rabbits-foot",
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
      id: "lily-action",

      type: "action",

      name: "Inner Balance",

      description:
        "Spend any number of [health] Health or [sanity] Sanity, then recover an equal amount of [health] Health or [sanity] Sanity.",
    },

    {
      id: "lily-passive",

      type: "passive",

      name: "Perfect Discipline",

      description:
        "When you improve a skill, you may immediately improve that skill again.",
    },
  ],

  /*
   * ============================================================
   * PERSONAL STORY
   * ============================================================
   */

  personalStory: {
    id: "all-that-stands",

    name: "All That Stands",

    description:
      "I have been preparing to confront this evil for my entire life.\n\nMy focus must be absolute.",

    mission: {
      type: "improve-all-skills",

      description:
        "When you have improved each of your skills, discard this card and gain The Chosen One Reward.\n\nWhen [doom] Doom advances to 6 or lower, discard this card and gain the Doomed to Failure Consequence.",

      targetCount: 5,
    },

    reward: {
      id: "the-chosen-one",

      name: "The Chosen One",

      description:
        "After you perform your action ability, recover 1 [health] Health and 1 [sanity] Sanity.\n\nRoll 2 additional dice when resolving tests while encountering Epic Monsters.",
    },

    consequence: {
      id: "doomed-to-failure",

      name: "Doomed to Failure",

      description:
        "When you gain this card, discard 1 Improvement token for each skill.\n\nYou cannot improve a skill a second time unless you spend 1 [health] Health or 1 [sanity] Sanity.",
    },
  },

  /*
   * ============================================================
   * DEFEAT ENCOUNTERS
   * ============================================================
   */

  defeatEncounters: [
    {
      id: "lily-defeat-health",

      type: "health-loss",

      title:
        "In Case of Crippling Injury or Death",

      description:
        "When you reach the hospital, you find Lily's things, but she is not in her bed. Gain all of her possessions. You quickly find that she's been kidnapped by cultists! You fight to free her. If you pass, you interrogate the cultists, and Lily is safely returned to the hospital to begin the slow healing process; retreat [doom] Doom by 1. If you fail, Lily disappears into the darkness. Whether you pass or not, discard her Investigator token.",

      test: {
        skill: "strength",

        modifier: 0,

        onSuccess:
          "You interrogate the cultists, and Lily is safely returned to the hospital to begin the slow healing process; retreat [doom] Doom by 1.",

        onFailure:
          "Lily disappears into the darkness.",
      },

      discardInvestigatorToken: true,
    },

    {
      id: "lily-defeat-sanity",

      type: "sanity-loss",

      title:
        "In Case of Insanity or Other Psychosis",

      description:
        "You barely recognize the small woman huddled in the alleyway, her few belongings scattered next to her. Gain all of her possessions. \"It wasn't true,\" Lily sobs. \"I have no destiny. I cannot fight the darkness.\" You reassure her that she has already done her part and that others will finish the task. If you pass, she chants over you, passing her destiny on to you; retreat [doom] Doom by 1. If you fail, Lily eventually falls into a catatonic state. Whether you pass or not, discard her Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "She chants over you, passing her destiny on to you; retreat [doom] Doom by 1.",

        onFailure:
          "Lily eventually falls into a catatonic state.",
      },

      discardInvestigatorToken: true,
    },
  ],
};