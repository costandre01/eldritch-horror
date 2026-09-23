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
        "Spend any number of [health] Health or [sanity] Sanity, then recover an equal number of Health or Sanity.",
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
   * PERSONAL HISTORY
   * ============================================================
   */

  personalStory: {
    id: "all-that-stands",

    name: "All That Stands",

    description:
      "Lily speaks rarely and when she does, her words are measured and wise. After a lifetime of disciplined training, every gesture is graceful, uncluttered by hesitation. When she was an infant, an obscure sect of monks believed that she was born for a special purpose, to face a great evil. Now, the monks believe that the great evil is at hand, and they have brought Lily to Shanghai to begin fulfilling her destiny.",
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
        "When you reach the hospital, you find Lily's things, but she is not in her bed. Gain all of her possessions. You quickly find that she's been kidnapped by cultists! You fight to free her [strength]. If you pass, you interrogate the cultists, and Lily is safely returned to the hospital to begin the slow healing process; retreat [doom] Doom by 1. If you fail, Lily disappears into the darkness. Whether you pass or not, discard her Investigator token.",

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
        "You barely recognize the small woman huddled in an alleyway, her few belongings scattered next to her. Gain all of her possessions. \"It wasn't true,\" Lily sobs. \"I have no destiny. I cannot fight the darkness.\" You reassure her that she has already done her part and that others will finish the task [influence]. If you pass, she chants over you, passing her destiny on to you; retreat Doom by 1. If you fail, Lily eventually falls into a catatonic state. Whether you pass or not, discard her Investigator token.",

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