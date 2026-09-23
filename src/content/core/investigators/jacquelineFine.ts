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
   * PERSONAL HISTORY
   * ============================================================
   */

  personalStory: {
    id: "jacqueline-fine",

    name: "Personal History",

    description:
      "At first, Jacqueline's dreams of fire and destruction seemed like a curse. Monsters ran rampant through city streets and some greater darkness loomed on the horizon. However, she has recently learned to control her visions and observe events in detail. Yesterday, she traveled from Boston to Minneapolis to explore an abandoned warehouse she'd seen in her dreams. Inside, she found evidence of a terrible cult that had practiced unspeakable rituals there. Jacqueline hopes to use what she's learned to prevent the terrible future that haunts her sleep.",
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
        "Somehow, Jacqueline knew you would be at this café to receive the parcel. Gain all of her possessions. Strangely, everyone here encountered her sometime after she was injured. You try to convince everyone to share their story [influence]. If you pass, you get the whole message Jacqueline hoped to convey; retreat [doom] Doom by 1. If you fail, the story is incomplete and makes no sense. Whether you pass or not, discard her Investigator token.",

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
        "You visit Jacqueline in the asylum and claim her belongings. Gain all of her possessions. She seems lost in her own world, talking to visions only she sees. You do your best to interpret what she's seeing based on what she says [lore]. If you pass, you have a clear idea of what she's experiencing; retreat [doom] Doom by 1. If you fail, Jacqueline remains trapped in a world only she can see. Whether you pass or not, discard her Investigator token.",

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