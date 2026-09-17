import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

export const jacquelineFine: InvestigatorDefinition = {
  id: "jacqueline-fine",

  name: "Jacqueline Fine",

  occupation: "The Psychic",

  roles: [
    "support",
    "research",
  ],

  skills: {
    lore: 4,
    influence: 2,
    observation: 3,
    strength: 1,
    will: 3,
  },

  maxHealth: 4,

  maxSanity: 8,

  focusLimit: 2,

  startingSpaceId: "space-5",

  startingClues: 1,

  startingAssetIds: [],

  startingSpellIds: [
    "spell-flesh-ward",
  ],

  startingImprovementCount: 0,

  /*
   * ============================================================
   * ABILITIES
   * ============================================================
   */

  abilities: [
    {
      id: "jacqueline-action",

      type: "action",

      name: "Trade Clues",

      description:
        "You may trade any number of [clue] Clues with an investigator on any space.",
    },

    {
      id: "jacqueline-passive",

      type: "passive",

      name: "Read the Future",

      description:
        "Once per round, when another investigator gains a non-Common Condition, you may look at the back of that card and gain 1 [clue] Clue.",
    },
  ],

  /*
   * ============================================================
   * PERSONAL STORY
   * ============================================================
   */

  personalStory: {
    id: "arbiter-of-fate",

    name: "Arbiter of Fate",

    description:
      "The visions are a warning.\n\nThe future can be rewritten.",

    mission: {
      type: "custom",

      description:
        "After you gain a [clue] Clue from your passive ability, you may spend 5 [clue] Clues and discard this card to gain the Oracle Reward.\n\nWhen [doom] Doom advances to 6 or lower, shuffle the Mythos deck, discard this card, and gain the Dark Future Consequence.",

      doomThreshold: 6,
    },

    reward: {
      id: "oracle",

      name: "Oracle",

      description:
        "Once per round, when [doom] Doom advances, gain 1 [clue] Clue.\n\nYou may spend 3 [clue] Clues to negate the text effect of an Event Mythos card.",
    },

    consequence: {
      id: "dark-future",

      name: "Dark Future",

      description:
        "Your maximum [sanity] Sanity is reduced by 2.\n\nAfter you gain a [clue] Clue using your passive ability, lose 1 [sanity] Sanity.",
    },
  },

  /*
   * ============================================================
   * DEFEAT ENCOUNTERS
   * ============================================================
   */

  defeatEncounters: [
    {
      id: "jacqueline-defeat-health",

      type: "health-loss",

      title:
        "In Case of Crippling Injury or Death",

      description:
        "Somehow, Jacqueline knew you would be at this café to receive the parcel. Gain all of her possessions. Strangely, everyone here encountered her sometime after she was injured. You try to convince everyone to share their story.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "You get the whole message Jacqueline hoped to convey; retreat [doom] Doom by 1.",

        onFailure:
          "The story is incomplete and makes no sense.",
      },

      discardInvestigatorToken: true,
    },

    {
      id: "jacqueline-defeat-sanity",

      type: "sanity-loss",

      title:
        "In Case of Insanity or Other Psychosis",

      description:
        "You visit Jacqueline in the asylum and claim her belongings. Gain all of her possessions. She seems lost in her own world, talking to visions only she sees. You do your best to interpret what she's seeing based on what she says.",

      test: {
        skill: "lore",

        modifier: 0,

        onSuccess:
          "You have a clear idea of what she's experiencing; retreat [doom] Doom by 1.",

        onFailure:
          "Jacqueline remains trapped in a world only she can see.",
      },

      discardInvestigatorToken: true,
    },
  ],
};