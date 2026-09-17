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

  focusLimit: 2,

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
   * PERSONAL STORY
   * ============================================================
   */

  personalStory: {
    id: "bound-by-the-past",

    name: "Bound by the Past",

    description:
      "The Lodge is not as innocent as they pretend.\n\nI have learned that nothing is ever as it seems, myself included.",

    mission: {
      type: "custom",

      description:
        "When you discard a Monster as part of your action ability, you may place it on this card.\n\nThen, if the total toughness of Monsters on this card is 8 or greater, discard this card and gain the Redeemed Reward.\n\nAt the end of the Encounter Phase, if there are 3 or more Cultist Monsters on the game board, discard this card and gain the One of Us Consequence.",
    },

    reward: {
      id: "redeemed",

      name: "Redeemed",

      description:
        "When you gain this card, retreat [doom] Doom by 1.\n\nOnce per round, during the Action Phase, gain 1 [focus] Focus.", 
    },

    consequence: {
      id: "one-of-us",

      name: "One of Us",

      description:
        "When you gain this card, advance [doom] Doom by 1.\n\nRoll 1 fewer die when resolving a test during a Combat Encounter or an Other World Encounter.",
    },
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
        "In her hospital, Diana tells you to pick up your things and bids you farewell. Gain all of her possessions. You infer that she is being watched. Using your knowledge of the Silver Twilight, you try to determine which doctors can be trusted.",

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
        "It's obviously Diana, but she claims to be a woman named Iris who has lived in this city her whole life. In her trash, you find Diana's things. Gain all of her possessions. It's clear that she has disassociated from her former life. You share all of your memories of Diana to restore her identity.",

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