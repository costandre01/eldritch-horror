import type { ConditionDefinition } from "../../game/models/ConditionDefinition";

export const coreConditionDefinitions: ConditionDefinition[] = [
  /*
   * ============================================================
   * AMNESIA
   * ============================================================
   */

  {
    id: "condition-amnesia",
    name: "Amnesia",
    folderName: "amnesia",
    copies: 3,
    category: "madness",

    frontEffects: [
      {
        type: "on-rest",

        dice: 1,
        successMinimum: 5,

        effects: [
          {
            type: "discard-self",
          },
        ],
      },

      {
        type: "on-test-fail",

        testType: "will",

        effects: [
          {
            type: "flip-self",
          },
        ],
      },

      {
        type: "on-reckoning",

        testType: "will",

        onFail: [
          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "amnesia-back-1",

        frontImage:
          "/cards/conditions/amnesia/1/amnesia.png",

        backImage:
          "/cards/conditions/amnesia/1/amnesia-back-1.png",

        effects: [
          {
            type: "gain-condition",
            conditionDefinitionId:
              "condition-detained",
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "amnesia-back-2",

        frontImage:
          "/cards/conditions/amnesia/2/amnesia.png",

        backImage:
          "/cards/conditions/amnesia/2/amnesia-back-2.png",

        effects: [
          {
            type: "gain-condition",
            conditionDefinitionId:
              "condition-dark-pact",
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "amnesia-back-3",

        frontImage:
          "/cards/conditions/amnesia/3/amnesia.png",

        backImage:
          "/cards/conditions/amnesia/3/amnesia-back-3.png",

        effects: [
          {
            type: "gain-condition",
            conditionDefinitionId:
              "condition-debt",
          },

          {
            type: "discard-self",
          },
        ],
      },
    ],
  },

  /*
   * ============================================================
   * BACK INJURY
   * ============================================================
   */

  {
    id: "condition-back-injury",
    name: "Back Injury",
    folderName: "back-injury",
    copies: 3,
    category: "Injury",

    frontEffects: [
      {
        type: "on-rest",

        dice: 1,
        successMinimum: 5,

        effects: [
          {
            type: "discard-self",
          },
        ],
      },

      {
        type: "on-test-fail",

        testType: "strength",

        effects: [
          {
            type: "flip-self",
          },
        ],
      },

      {
        type: "on-reckoning",

        testType: "strength",

        onFail: [
          {
            type: "flip-self",
          },
        ],
      },
    ],
    backs: [
      {
        id: "back-injury-back-1",

        frontImage:
          "/cards/conditions/back-injury/1/back_injury.png",

        backImage:
          "/cards/conditions/back-injury/1/back-injury-back-1.png",

        effects: [
          {
            type: "discard-all-but-items",
            keep: 1,
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "back-injury-back-2",
        frontImage:
          "/cards/conditions/back-injury/2/back_injury.png",
        backImage:
          "/cards/conditions/back-injury/2/back-injury-back-2.png",

        effects: [
          {
            type: "discard-item",
            amount: 1,
          },

          {
            type: "become-delayed",
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "back-injury-back-3",
        frontImage:
          "/cards/conditions/back-injury/3/back_injury.png",
        backImage:
          "/cards/conditions/back-injury/3/back-injury-back-3.png",

        effects: [
          {
            type: "discard-item",
            amount: 1,
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],
  },

  /*
   * ============================================================
   * BLESSED
   * ============================================================
   */

  {
    id: "condition-blessed",
    name: "Blessed",
    folderName: "blessed",
    copies: 3,
    category: "Boon",
    
    frontEffects: [
      {
        type: "modify-test-successes",
        successfulResults: [4, 5, 6],
      },

      {
        type: "on-gain-condition",
        conditionDefinitionId: "condition-blessed",

        effects: [
          {
            type: "flip-self",
          },
        ],
      },

      {
        type: "on-gain-condition",
        conditionDefinitionId: "condition-cursed",

        effects: [
          {
            type: "discard-self",
          },
        ],
      },

      {
        type: "on-encounter",

        dice: 1,
        successResults: [1, 2],

        effects: [
          {
            type: "discard-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "blessed-back-1",
        frontImage:
          "/cards/conditions/blessed/1/blessed.png",
        backImage:
          "/cards/conditions/blessed/1/blessed-back-1.png",

        effects: [
          {
            type: "recover-health",
            amount: 2,
          },

          {
            type: "recover-sanity",
            amount: 2,
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "blessed-back-2",
        frontImage:
          "/cards/conditions/blessed/2/blessed.png",
        backImage:
          "/cards/conditions/blessed/2/blessed-back-2.png",

        effects: [
          {
            type: "discard-monster",
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "blessed-back-3",
        frontImage:
          "/cards/conditions/blessed/3/blessed.png",
        backImage:
          "/cards/conditions/blessed/3/blessed-back-3.png",

        effects: [
          {
            type: "gain-clues",
            amount: 2,
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],
  },

  /*
   * ============================================================
   * CURSED
   * ============================================================
   */

  {
    id: "condition-cursed",
    name: "Cursed",
    folderName: "cursed",
    copies: 3,
    category: "Bane",

    frontEffects: [
      {
        type: "modify-test-successes",
        successfulResults: [6],
      },

      {
        type: "replace-gain-condition",
        conditionDefinitionId:
          "condition-cursed",

        effects: [
          {
            type: "flip-self",
          },
        ],
      },

      {
        type: "replace-gain-condition",
        conditionDefinitionId:
          "condition-blessed",

        effects: [
          {
            type: "discard-self",
          },
        ],
      },

      {
        type: "on-encounter",

        dice: 1,
        successResults: [4, 5, 6],

        effects: [
          {
            type: "discard-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "cursed-back-1",
        frontImage:
          "/cards/conditions/cursed/1/cursed.png",
        backImage:
          "/cards/conditions/cursed/1/cursed-back-1.png",

        effects: [
          {
            type: "on-monster-ambush",
          },
        ],
      },

      {
        id: "cursed-back-2",
        frontImage:
          "/cards/conditions/cursed/2/cursed.png",
        backImage:
          "/cards/conditions/cursed/2/cursed-back-2.png",

        effects: [
          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "cursed-back-3",
        frontImage:
          "/cards/conditions/cursed/3/cursed.png",
        backImage:
          "/cards/conditions/cursed/3/cursed-back-3.png",

        effects: [
          {
            type: "if-on-sea-space",
            effects: [
              {
                type: "devoured",
              },
            ],
            otherwise: [
              {
                type: "lose-health",
                amount: 3,
              },
              {
                type: "discard-self",
              },
            ],
          },
        ],
      },
    ],
  },

  /*
   * ============================================================
   * DARK PACT
   * ============================================================
   */

  {
    id: "condition-dark-pact",
    name: "Dark Pact",
    folderName: "dark-pact",
    copies: 6,
    category: "Deal",

    frontEffects: [
      {
        type: "on-reckoning",

        dice: 1,
        successResults: [1],

        effects: [
          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "dark-pact-back-1",
        frontImage:
          "/cards/conditions/dark-pact/1/dark-Pact.png",
        backImage:
          "/cards/conditions/dark-pact/1/dark-Pact-back-1.png",

        effects: [
          {
            type: "devour-other-investigator",
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "dark-pact-back-2",
        frontImage:
          "/cards/conditions/dark-pact/2/dark-Pact.png",
        backImage:
          "/cards/conditions/dark-pact/2/dark-Pact-back-2.png",

        effects: [
          {
            type: "devoured",
          },
        ],
      },

      {
        id: "dark-pact-back-3",
        frontImage:
          "/cards/conditions/dark-pact/3/dark-Pact.png",
        backImage:
          "/cards/conditions/dark-pact/3/dark-Pact-back-3.png",

        effects: [
          {
            type: "spawn-gates-per-spell",
          },

          {
            type: "advance-omen",
            amount: 1,
          },

          {
            type: "discard-self",
          },
        ],
      },
    ],
  },

  /*
   * ============================================================
   * DEBT
   * ============================================================
   */

  {
    id: "condition-debt",
    name: "Debt",
    folderName: "debt",
    copies: 6,
    category: "Deal-Common",

    frontEffects: [
      {
        type: "on-local-action-test",
        action: "deal",
        testType: "influence",

        effects: [
          {
            type: "discard-self",
          },
        ],
      },

      {
        type: "on-reckoning",
        effects: [
          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "debt-back-1",
        frontImage:
          "/cards/conditions/debt/1/debt.png",
        backImage:
          "/cards/conditions/debt/1/debt-back-1.png",

        effects: [
          {
            type: "lose-sanity",
            amount: 3,
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "debt-back-2",
        frontImage:
          "/cards/conditions/debt/2/debt.png",
        backImage:
          "/cards/conditions/debt/2/debt-back-2.png",

        effects: [
          {
            type: "discard-item",
            amount: 2,
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "debt-back-3",
        frontImage:
          "/cards/conditions/debt/3/debt.png",
        backImage:
          "/cards/conditions/debt/3/debt-back-3.png",

        effects: [
          {
            type: "lose-health",
            amount: 3,
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "debt-back-4",
        frontImage:
          "/cards/conditions/debt/4/debt.png",
        backImage:
          "/cards/conditions/debt/4/debt-back-4.png",

        effects: [
          {
            type: "fail-choice",

            choice: {
              type: "discard-ally",
              amount: 1,
            },

            otherwise: [
              {
                type: "move-to-nearest-city",
              },
              {
                type: "gain-condition",
                conditionDefinitionId:
                  "condition-detained",
              },
            ],
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "debt-back-5",
        frontImage:
          "/cards/conditions/debt/5/debt.png",
        backImage:
          "/cards/conditions/debt/5/debt-back-5.png",

        effects: [
          {
            type: "choose-gain-condition-or",
            conditionDefinitionId:
              "condition-dark-pact",

            otherwise: [
              {
                type: "advance-doom",
                amount: 1,
              },
            ],
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "debt-back-6",
        frontImage:
          "/cards/conditions/debt/6/debt.png",
        backImage:
          "/cards/conditions/debt/6/debt-back-6.png",

        effects: [
          {
            type: "gain-condition",
            conditionDefinitionId:
              "condition-amnesia",
          },

          {
            type: "discard-self",
          },
        ],
      },
    ],
  },

  /*
   * ============================================================
   * DETAINED
   * ============================================================
   */

  {
    id: "condition-detained",
    name: "Detained",
    folderName: "detained",
    copies: 3,
    category: "Restriction",

    frontEffects: [
      {
        type: "on-encounter",
        effects: [
          {
            type: "flip-self",
          },
        ],
      },

      {
        type: "local-action-test",
        testType: "influence",

        onSuccess: [
          {
            type: "discard-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "detained-back-1",
        frontImage:
          "/cards/conditions/detained/1/detained.png",
        backImage:
          "/cards/conditions/detained/1/detained-back-1.png",

        effects: [
          {
            type: "spend-clue-or-test",
            amount: 1,

            testType: "will",
            modifier: -1,

            onFail: [
              {
                type: "lose-sanity",
                amount: 3,
              },
              {
                type: "gain-condition",
                conditionDefinitionId:
                  "condition-paranoia",
              },
            ],
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "detained-back-2",
        frontImage:
          "/cards/conditions/detained/2/detained.png",
        backImage:
          "/cards/conditions/detained/2/detained-back-2.png",

        effects: [
          {
            type: "spend-clue-or-test",
            amount: 1,

            testType: "influence",
            modifier: -1,

            onFail: [
              {
                type: "lose-health",
                amount: 2,
              },
              {
                type: "lose-sanity",
                amount: 2,
              },
            ],
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "detained-back-3",
        frontImage:
          "/cards/conditions/detained/3/detained.png",
        backImage:
          "/cards/conditions/detained/3/detained-back-3.png",

        effects: [
          {
            type: "spend-clue-or-test",
            amount: 1,

            testType: "strength",
            modifier: -1,

            onFail: [
              {
                type: "lose-health",
                amount: 3,
              },
              {
                type: "gain-condition",
                conditionDefinitionId:
                  "condition-internal-injury",
              },
            ],
          },

          {
            type: "discard-self",
          },
        ],
      },
    ],
  },

  /*
   * ============================================================
   * HALLUCINATIONS
   * ============================================================
   */

  {
    id: "condition-hallucinations",
    name: "Hallucinations",
    folderName: "hallucinations",
    copies: 3,
    category: "madness",

    frontEffects: [
      {
        type: "on-rest",

        dice: 1,
        successResults: [5, 6],

        effects: [
          {
            type: "discard-self",
          },
        ],
      },

      {
        type: "on-encounter",

        testType: "will",

        onFail: [
          {
            type: "flip-self",
          },
        ],
      },

      {
        type: "on-reckoning",

        testType: "will",

        onFail: [
          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "hallucinations-back-1",
        frontImage:
          "/cards/conditions/hallucinations/1/hallucinations.png",
        backImage:
          "/cards/conditions/hallucinations/1/hallucinations-back-1.png",

        effects: [
          {
            type: "discard-all-clues",
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "hallucinations-back-2",
        frontImage:
          "/cards/conditions/hallucinations/2/hallucinations.png",
        backImage:
          "/cards/conditions/hallucinations/2/hallucinations-back-2.png",

        effects: [
          {
            type: "lose-sanity",
            amount: 3,
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "hallucinations-back-3",
        frontImage:
          "/cards/conditions/hallucinations/3/hallucinations.png",
        backImage:
          "/cards/conditions/hallucinations/3/hallucinations-back-3.png",

        effects: [
          {
            type: "lose-sanity",
            amount: 1,
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],
  },

  /*
   * ============================================================
   * INTERNAL INJURY
   * ============================================================
   */

  {
    id: "condition-internal-injury",
    name: "Internal Injury",
    folderName: "internal-injury",
    copies: 3,
    category: "Injury",

    frontEffects: [
      {
        type: "on-rest",

        dice: 1,
        successResults: [5, 6],

        effects: [
          {
            type: "discard-self",
          },
        ],
      },

      {
        type: "on-encounter",

        testType: "strength",

        onFail: [
          {
            type: "flip-self",
          },
        ],
      },

      {
        type: "on-reckoning",

        testType: "strength",

        onFail: [
          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "internal-injury-back-1",
        frontImage:
          "/cards/conditions/internal-injury/1/internal_injury.png",
        backImage:
          "/cards/conditions/internal-injury/1/internal_injury-back-1.png",

        effects: [
          {
            type: "lose-health",
            amount: 1,
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "internal-injury-back-2",
        frontImage:
          "/cards/conditions/internal-injury/2/internal_injury.png",
        backImage:
          "/cards/conditions/internal-injury/2/internal_injury-back-2.png",

        effects: [
          {
            type: "lose-health",
            amount: 3,
          },

          {
            type: "discard-self",
          },
        ],
      },

      {
        id: "internal-injury-back-3",
        frontImage:
          "/cards/conditions/internal-injury/3/internal_injury.png",
        backImage:
          "/cards/conditions/internal-injury/3/internal_injury-back-3.png",

        effects: [
          {
            type: "lose-health",
            amount: 1,
          },

          {
            type: "become-delayed",
          },

          {
            type: "discard-self",
          },
        ],
      },
    ],
  },

  /*
   * ============================================================
   * LEG INJURY
   * ============================================================
   */

  {
    id: "condition-leg-injury",
    name: "Leg Injury",
    folderName: "leg-injury",
    copies: 3,
    category: "Injury",

    frontEffects: [
      {
        type: "on-rest",

        dice: 1,
        successResults: [5, 6],

        effects: [
          {
            type: "discard-self",
          },
        ],
      },

      {
        type: "on-encounter",

        testType: "strength",

        onFail: [
          {
            type: "flip-self",
          },
        ],
      },

      {
        type: "on-reckoning",

        testType: "strength",

        onFail: [
          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "leg-injury-back-1",
        frontImage:
          "/cards/conditions/leg-injury/1/leg_injury.png",
        backImage:
          "/cards/conditions/leg-injury/1/leg_injury-back-1.png",

        effects: [
          {
            type: "become-delayed",
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "leg-injury-back-2",
        frontImage:
          "/cards/conditions/leg-injury/2/leg_injury.png",
        backImage:
          "/cards/conditions/leg-injury/2/leg_injury-back-2.png",

        effects: [
          {
            type: "lose-health",
            amount: 1,
          },

          {
            type: "become-delayed-or-flip",
          },
        ],
      },

      {
        id: "leg-injury-back-3",
        frontImage:
          "/cards/conditions/leg-injury/3/leg_injury.png",
        backImage:
          "/cards/conditions/leg-injury/3/leg_injury-back-3.png",

        effects: [
          {
            type: "lose-health-unless-delayed",
            amount: 2,
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],
  },

  /*
   * ============================================================
   * PARANOIA
   * ============================================================
   */

  {
    id: "condition-paranoia",
    name: "Paranoia",
    folderName: "paranoia",
    copies: 3,
    category: "madness",

    frontEffects: [
      {
        type: "on-rest",

        dice: 1,
        successResults: [5, 6],

        effects: [
          {
            type: "discard-self",
          },
        ],
      },

      {
        type: "on-encounter",

        testType: "will",

        onFail: [
          {
            type: "flip-self",
          },
        ],
      },

      {
        type: "on-reckoning",

        testType: "will",

        onFail: [
          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "paranoia-back-1",
        frontImage:
          "/cards/conditions/paranoia/1/paranoia.png",
        backImage:
          "/cards/conditions/paranoia/1/paranoia-back-1.png",

        effects: [
          {
            type: "lose-sanity-if-on-city",
            amount: 2,
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "paranoia-back-2",
        frontImage:
          "/cards/conditions/paranoia/2/paranoia.png",
        backImage:
          "/cards/conditions/paranoia/2/paranoia-back-2.png",

        effects: [
          {
            type: "gain-random-item-and-test",
            testType: "observation",

            onFail: [
              {
                type: "discard-gained-asset",
              },
              {
                type: "gain-condition",
                conditionDefinitionId:
                  "condition-detained",
              },
            ],

            then: [
              {
                type: "discard-self",
              },
            ],
          },
        ],
      },

      {
        id: "paranoia-back-3",
        frontImage:
          "/cards/conditions/paranoia/3/paranoia.png",
        backImage:
          "/cards/conditions/paranoia/3/paranoia-back-3.png",

        effects: [
          {
            type: "other-investigators-on-space-lose-health",
            amount: 2,
          },

          {
            type: "discard-ally-asset",
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],
  },
];