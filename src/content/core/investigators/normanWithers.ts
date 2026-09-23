import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

export const normanWithers: InvestigatorDefinition = {
  id: "norman-withers",

  name: "Norman Withers",

  occupation: "The Astronomer",

  roles: [
    "magic",
    "gate-closer",
  ],

  skills: {
    lore: 3,
    influence: 1,
    observation: 3,
    strength: 2,
    will: 4,
  },

  maxHealth: 5,

  maxSanity: 7,

  startingSpaceId: "arkham",

  startingClues: 0,

  startingAssetIds: [],

  startingSpellIds: [
    "spell-feed-the-mind",
  ],

  startingImprovementCount: 0,

  /*
   * ============================================================
   * ABILITIES
   * ============================================================
   */

  abilities: [
    {
      id: "norman-action",

      type: "action",

      name: "Written in the Stars",

      description:
        "Spend 2 [clue] Clues to discard 1 Monster on a space containing a Gate.",
    },

    {
      id: "norman-passive",

      type: "passive",

      name: "Astronomer",

      description:
        "Once per round, you may spend 1 [sanity] Sanity in place of spending 1 [clue] Clue.",
    },
  ],

  /*
   * ============================================================
   * PERSONAL HISTORY
   * ============================================================
   */

  personalStory: {
    id: "written-in-the-stars",

    name: "Written in the Stars",

    description:
      "The scientific community ridiculed Norman for his claim that six stars disappeared from the sky. After exhausting every plausible astronomical explanation for answers, he took a position at Miskatonic University and began exploring more improbable possibilities in the restricted section of their library. While reading an ancient text of dark prophecies, Norman found an exact description of the phenomenon he'd observed. If the tome is to be believed, a terrible incursion into our world is imminent.",
  },

  /*
   * ============================================================
   * DEFEAT ENCOUNTERS
   * ============================================================
   */

  defeatEncounters: [
    {
      id: "norman-defeat-health",

      type: "health-loss",

      title:
        "In Case of Crippling Injury or Death",

      description:
        "Norman can barely move in his hospital bed and points to his notes and suitcase. Gain all of his possessions. He begs you to use his telescope to record the current locations of the stars. The work is slow and demanding, but you focus as best you can to give him accurate results [will]. If you pass, Norman's insight into the Ancient One proves accurate; retreat [doom] Doom by 1. If you fail, Norman can make no sense of the night sky. Whether you pass or not, discard his Investigator token.",

      test: {
        skill: "will",

        modifier: 0,

        onSuccess:
          "Norman's insight into the Ancient One proves accurate; retreat [doom] Doom by 1.",

        onFailure:
          "Norman can make no sense of the night sky.",
      },

      discardInvestigatorToken: true,
    },

    {
      id: "norman-defeat-sanity",

      type: "sanity-loss",

      title:
        "In Case of Insanity or Other Psychosis",

      description:
        "The doctors would like you to look at Norman's notes and belongings. Gain all of his possessions. They are trying to gain some insight into his catatonic state. You try to convince them to move Norman to a room with a view of the night sky [influence]. If you pass, Norman becomes slightly responsive, and you are able to question him; retreat [doom] Doom by 1. If you fail, Norman's condition grows steadily worse. Whether you pass or not, discard his Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "Norman becomes slightly responsive, and you are able to question him; retreat [doom] Doom by 1.",

        onFailure:
          "Norman's condition grows steadily worse.",
      },

      discardInvestigatorToken: true,
    },
  ],
};