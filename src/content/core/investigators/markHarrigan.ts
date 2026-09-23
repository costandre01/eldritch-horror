import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

export const markHarrigan: InvestigatorDefinition = {
  id: "mark-harrigan",

  name: "Mark Harrigan",

  occupation: "The Soldier",

  roles: [
    "combat",
  ],

  skills: {
    lore: 1,
    influence: 2,
    observation: 2,
    strength: 4,
    will: 4,
  },

  maxHealth: 8,

  maxSanity: 4,

  startingSpaceId: "space-14",

  startingClues: 0,

  startingAssetIds: [
    "asset-38-revolver",
    "asset-kerosene",
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
      id: "mark-action",

      type: "action",

      name: "One Man Army",

      description:
        "You and a 1 Monster on your space each lose 1 [health] Health.",
    },

    {
      id: "mark-passive",

      type: "passive",

      name: "Unstoppable",

      description:
        "You cannot become Delayed or gain a Detained Condition unless you choose to.",
    },
  ],

  /*
   * ============================================================
   * PERSONAL HISTORY
   * ============================================================
   */

  personalStory: {
    id: "shadowed-heart",

    name: "Shadowed Heart",

    description:
      "During the war, Mark witnessed horrors he could not explain, and he wrote of what he saw in letters to his beloved wife, Sophie. When Mark returned home, he discovered that Sophie was no longer human. One of the beasts that Mark had seen overseas had taken over her body, killing her in the process. Afterwards, Mark's thirst for vengeance lead him to Helsinki, where some of these creatures had posed as German soldiers during the Great War.",
  },

  /*
   * ============================================================
   * DEFEAT ENCOUNTERS
   * ============================================================
   */

  defeatEncounters: [
    {
      id: "mark-defeat-health",

      type: "health-loss",

      title:
        "In Case of Crippling Injury or Death",

      description:
        "While you are collecting Mark's things, you smell smoke in the hospital. Gain all of his possessions. The hospital has been set on fire, and you run to Mark's room and try to carry him to safety [strength]. If you pass, Mark is able to tell you who set the fire; retreat [doom] Doom by 1. If you fail, the smoke overcomes Mark, and he dies outside the hospital. Whether you pass or not, discard his Investigator token.",

      test: {
        skill: "strength",

        modifier: 0,

        onSuccess:
          "Mark is able to tell you who set the fire; retreat [doom] Doom by 1.",

        onFailure:
          "The smoke overcomes Mark, and he dies outside the hospital.",
      },

      discardInvestigatorToken: true,
    },

    {
      id: "mark-defeat-sanity",

      type: "sanity-loss",

      title:
        "In Case of Insanity or Other Psychosis",

      description:
        "You take custody of Mark's belongings and arrange to visit him in the asylum. Gain all of his possessions. To your dismay, Mark is convinced that you are a creature disguising itself as a human. You do your best to convince him that you are telling the truth [influence]. If you pass, he shows you sketches he made of the horrible monsters that he's been hunting; retreat [doom] Doom by 1. If you fail, Mark screams accusations of murder at you. Whether you pass or not, discard his Investigator token.",

      test: {
        skill: "influence",

        modifier: 0,

        onSuccess:
          "He shows you sketches he made of the horrible monsters that he's been hunting; retreat [doom] Doom by 1.",

        onFailure:
          "Mark screams accusations of murder at you.",
      },

      discardInvestigatorToken: true,
    },
  ],
};