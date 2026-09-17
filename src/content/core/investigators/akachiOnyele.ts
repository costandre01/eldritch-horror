import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

export const akachiOnyele: InvestigatorDefinition = {
  id: "akachi-onyele",

  name: "Akachi Onyele",

  occupation: "The Shaman",

  roles: [
    "gate-closer",
  ],

  skills: {
    lore: 3,
    influence: 2,
    observation: 2,
    strength: 2,
    will: 4,
  },

  maxHealth: 5,

  maxSanity: 7,

  focusLimit: 2,

  startingSpaceId: "space-15",

  startingClues: 1,

  startingAssetIds: [],

  startingSpellIds: [
    "spell-mists-of-releh",
  ],

  startingImprovementCount: 0,

  /*
   * ============================================================
   * ABILITIES
   * ============================================================
   */

  abilities: [
    {
      id: "akachi-action",

      type: "action",

      name: "Gate Insight",

      description:
        "Look at the top 2 Gates in the Gate stack. Put 1 Gate on the top of the Gate stack, and the other on the bottom.",
    },

    {
      id: "akachi-passive",

      type: "passive",

      name: "Guardian of the Veil",

      description:
        "When you close a Gate during an Other World Encounter, you may move to any space containing a [clue] Clue or a Gate.",
    },
  ],

  /*
   * ============================================================
   * PERSONAL STORY
   * ============================================================
   */

  personalStory: {
    id: "guardian-of-the-veil",

    name: "Guardian of the Veil",

    description:
      "The spirits are restless. Something evil stirs, and gaining the favor of your ancestors may be the only way to stop what is coming.",

    mission: {
      type: "close-gates",

      description:
        "When you close a Gate during an Other World Encounter, place that Gate on this card.\n\nWhen there are 3 Gates on this card, resolve the Reward.",

      targetCount: 3,
    },

    reward: {
      id: "earth-speaks",

      name: "The Earth Speaks",

      description:
        "When you gain this card, improve [lore] and [will].\n\nWhen you close a Gate during an Other World Encounter, spawn [clue] 2 Clues.",
    },

    consequence: {
      id: "earths-anger",

      name: "The Earth's Anger",

      description:
        "When you gain this card, spawn 1 Gate.\n\nAfter resolving an Other World Encounter, if you did not discard that Gate, discard the nearest [clue] Clue on the game board.",
    },
  },

  /*
   * ============================================================
   * DEFEAT ENCOUNTERS
   * ============================================================
   */

  defeatEncounters: [
    {
      id: "akachi-defeat-health",

      type: "health-loss",

      title:
        "In Case of Crippling Injury or Death",

      description:
        "By the time you find Akachi, she's slipped into a coma. Doctors aren't certain if she will recover. Gain all of her possessions. The hospital staff has grown very fond of her, and you try to convince them to tell you what she said to them while she was conscious.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "You hear many stories; retreat [doom] Doom by 1.",

        onFailure:
          "You can't get anyone to share Akachi's story with you.",
      },

      discardInvestigatorToken: true,
    },

    {
      id: "akachi-defeat-sanity",

      type: "sanity-loss",

      title:
        "In Case of Insanity or Other Psychosis",

      description:
        "Akachi's mind has left this world and she no longer has interest in material goods. Gain all of her possessions. An Odinani man gives you a bitter drink to help you reach her. After you drink it, you are assaulted by nightmarish visions, but you force yourself to keep searching for her.",

      test: {
        skill: "will",

        modifier: 0,

        onSuccess:
          "You hear Akachi's voice sharing all she's learned; retreat [doom] Doom by 1.",

        onFailure:
          "You curl up in a corner until the drink wears off.",
      },

      discardInvestigatorToken: true,
    },
  ],
};