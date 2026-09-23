import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

export const dianaStanley: InvestigatorDefinition = {
  id: "diana-stanley",

  name: "Diana Stanley",

  occupation: "The Redeemed Cultist",

  roles: [
    "magic",
    "combat",
  ],

  skills: {
    lore: 4,
    influence: 2,
    observation: 3,
    strength: 3,
    will: 1,
  },

  maxHealth: 7,

  maxSanity: 5,

  startingSpaceId: "space-7",

  startingClues: 0,

  startingAssetIds: [
    "asset-arcane-manuscripts",
  ],

  startingSpellIds: [
    "spell-wither",
  ],

  startingImprovementCount: 0,

  /*
   * ============================================================
   * ABILITIES
   * ============================================================
   */

  abilities: [
    {
      id: "diana-action",

      type: "action",

      name: "Redeemed Cultist",

      description:
        "If there is a Cultist Monster on your space, discard all Monsters on your space or move the Cultist Monster to any other space.",
    },

    {
      id: "diana-passive",

      type: "passive",

      name: "Silver Twilight Knowledge",

      description:
        "Reduce the horror of Monsters you encounter to 1.",
    },
  ],

  /*
   * ============================================================
   * PERSONAL HISTORY
   * ============================================================
   */

  personalStory: {
    id: "diana-stanley",

    name: "Personal History",

    description:
      "When Diana was initiated into the Order of the Silver Twilight, she believed it to be nothing more than a community organization. But as she has learned more of its true nature, she has become convinced that a growing evil threatens the world, and that the Silver Twilight will play a role in that threat. She believes her best chance to prevent this is to use her position to sabotage the organization from within. Carl Sanford, the head of the Order, has recognized her skills and recently sent her to Panama for additional training.",
  },

  /*
   * ============================================================
   * DEFEAT ENCOUNTERS
   * ============================================================
   */

  defeatEncounters: [
    {
      id: "diana-defeat-health",

      type: "health-loss",

      title:
        "In Case of Crippling Injury or Death",

      description:
        "In her hospital, Diana tells you to pick up your things and bids you farewell. Gain all of her possessions. You infer that she is being watched. Using your knowledge of the Silver Twilight, you try to determine which doctors can be trusted [lore]. If you pass, you move Diana to a new hospital and she shares her secrets with you; retreat [doom] Doom by 1. If you fail, Diana remains under the Lodge's watchful eye. Whether you pass or not, discard her Investigator token.",

      test: {
        skill: "lore",

        modifier: 0,

        onSuccess:
          "You move Diana to a new hospital and she shares her secrets with you; retreat [doom] Doom by 1.",

        onFailure:
          "Diana remains under the Lodge's watchful eye.",
      },

      discardInvestigatorToken: true,
    },

    {
      id: "diana-defeat-sanity",

      type: "sanity-loss",

      title:
        "In Case of Insanity or Other Psychosis",

      description:
        "It's obviously Diana, but she claims to be a woman named Iris who has lived in this city her whole life. In her trash, you find Diana's things. Gain all of her possessions. It's clear that she has disassociated from her former life. You share all of your memories of Diana to restore her identity [influence]. If you pass, she tells you of the horrors that brought her to this state; retreat [doom] Doom by 1. If you fail, Diana sternly asks you to leave her alone. Whether you pass or not, discard her Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "She tells you of the horrors that brought her to this state; retreat [doom] Doom by 1.",

        onFailure:
          "Diana sternly asks you to leave her alone.",
      },

      discardInvestigatorToken: true,
    },
  ],
};