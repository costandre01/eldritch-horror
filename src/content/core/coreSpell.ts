import type { SpellDefinition } from "../../game/models/SpellDefinition";

export const coreSpells: SpellDefinition[] = [
  /*
   * ============================================================
   * BLESSING OF ISIS
   * ============================================================
   */

  {
    id: "spell-blessing-of-isis",
    name: "Blessing of Isis",
    type: "ritual",

    description:
      "Action: Test Lore -1. If you pass, choose an investigator on your space that does not have a Blessed Condition to gain a Blessed Condition. Then flip this card.",

    loreBonus: -1,

    abilityIds: [],

    frontEffects: [
      {
        type: "action-test",
        testType: "lore",
        modifier: -1,

        onSuccess: [
          {
            type: "choose-investigator",
            location: "same-space",

            excludeConditionDefinitionId:
              "condition-blessed",

            effects: [
              {
                type: "gain-condition",
                conditionDefinitionId: "condition-blessed",
                target: "chosen-investigator",
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "blessing-of-isis-back-1",

        frontImage:
          "/cards/spells/core/blessing-of-isis/1/Blessing_of_Isis.png",

        backImage:
          "/cards/spells/core/blessing-of-isis/1/Blessing_of_Isis-back-1.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                exact: 0,

                effects: [
                  {
                    type: "gain-condition",
                    conditionDefinitionId: "condition-cursed",
                    target: "chosen-investigator",
                  },
                ],
              },

              {
                exact: 1,

                effects: [
                  {
                    type: "lose-sanity",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },

              {
                min: 2,

                effects: [],
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "blessing-of-isis-back-2",

        frontImage:
          "/cards/spells/core/blessing-of-isis/2/Blessing_of_Isis.png",

        backImage:
          "/cards/spells/core/blessing-of-isis/2/Blessing_of_Isis-back-2.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                min: 0,
                max: 2,

                effects: [
                  {
                    type: "lose-health",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },

              {
                min: 3,

                effects: [
                  {
                    type: "gain-condition-on-investigators-on-space",
                    conditionDefinitionId: "condition-blessed",
                  },
                ],
              },
            ],
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
   * CLAIRVOYANCE
   * ============================================================
   */

  {
    id: "spell-clairvoyance",
    name: "Clairvoyance",
    type: "incantation",

    description:
      "During the Encounter Phase, you may test Lore. If you pass, you may choose to encounter a Clue as if you are on its space, ignoring Monsters on that space. Then flip this card.",

    loreBonus: 0,

    abilityIds: [],

    frontEffects: [
      {
        type: "on-encounter-phase",
        testType: "lore",

        onSuccess: [
          {
            type: "choose-clue",
            encounterAsIfOnSpace: true,
            ignoreMonsters: true,
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "clairvoyance-back-1",

        frontImage:
          "/cards/spells/core/clairvoyance/1/Clairvoyance.png",

        backImage:
          "/cards/spells/core/clairvoyance/1/clairvoyance-back-1.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                exact: 0,

                effects: [
                  {
                    type: "discard-self-unless",
                    requirement: {
                      type: "gain-condition",
                      conditionDefinitionId: "condition-paranoia",
                      target: "caster",
                    },
                  },
                ],
              },

              {
                min: 1,
                max: 2,

                effects: [],
              },

              {
                min: 3,

                effects: [
                  {
                    type: "modify-research-encounter-tests",
                    additionalDice: 1,
                  },
                ],
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "clairvoyance-back-2",

        frontImage:
          "/cards/spells/core/clairvoyance/2/Clairvoyance.png",

        backImage:
          "/cards/spells/core/clairvoyance/2/clairvoyance-back-2.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                exact: 0,

                effects: [
                  {
                    type: "discard-chosen-clue",
                  },
                ],
              },

              {
                min: 1,
                max: 2,

                effects: [
                  {
                    type: "lose-sanity",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },

              {
                min: 3,

                effects: [
                  {
                    type: "gain-clues",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },
            ],
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
   * CONJURATION
   * ============================================================
   */

  {
    id: "spell-conjuration",
    name: "Conjuration",
    type: "ritual",

    description:
      "Action: Test Lore +1. If you pass, you may gain 1 Item or Trinket Asset from the reserve with value equal to or less than your test result. Then flip this card.",

    loreBonus: 1,

    abilityIds: [],

    frontEffects: [
      {
        type: "action-test",
        testType: "lore",
        modifier: 1,

        onSuccess: [
          {
            type: "choose-asset",
            from: "reserve",
            assetTypes: ["item", "trinket"],
            maxValueFromTestResult: true,
            target: "caster",
            optional: true,
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "conjuration-back-1",

        frontImage:
          "/cards/spells/core/conjuration/1/conjuration.png",

        backImage:
          "/cards/spells/core/conjuration/1/conjuration-back-1.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                exact: 0,

                effects: [
                  {
                    type: "discard-self-unless",
                    requirement: {
                      type: "rolled-face",
                      value: 4,
                    },
                  },
                ],
              },

              {
                min: 1,
                max: 3,

                effects: [
                  {
                    type: "lose-sanity",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },

              {
                min: 4,

                effects: [
                  {
                    type: "gain-asset",
                    from: "reserve",
                    assetTypes: ["item", "trinket"],
                    amount: 1,
                    target: "caster",
                  },
                ],
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "conjuration-back-2",

        frontImage:
          "/cards/spells/core/conjuration/2/conjuration.png",

        backImage:
          "/cards/spells/core/conjuration/2/conjuration-back-2.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                exact: 0,

                effects: [
                  {
                    type: "discard-self-unless",
                    requirement: {
                      type: "discard-item",
                      amount: 1,
                      target: "caster",
                    },
                  },
                ],
              },

              {
                exact: 1,

                effects: [
                  {
                    type: "lose-sanity",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },

              {
                min: 2,

                effects: [
                  {
                    type: "gain-assets-by-test-result",
                    from: "reserve",
                    assetTypes: ["item", "trinket"],
                    maxTotalValueFromTestResult: true,
                    target: "caster",
                  },
                ],
              },
            ],
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
   * FEED THE MIND
   * ============================================================
   */

  {
    id: "spell-feed-the-mind",
    name: "Feed the Mind",
    type: "ritual",

    description:
      "Action: Test Lore -1. If you pass, choose an investigator on your space to improve 1 skill of his choice. Then flip this card.",

    loreBonus: -1,

    abilityIds: [],

    frontEffects: [
      {
        type: "action-test",
        testType: "lore",
        modifier: -1,

        onSuccess: [
          {
            type: "choose-investigator",
            location: "same-space",

            effects: [
              {
                type: "improve-skill",
                amount: 1,
                target: "chosen-investigator",
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "feed-the-mind-back-1",

        frontImage:
          "/cards/spells/core/feed-the-mind/1/feed_the_mind.png",

        backImage:
          "/cards/spells/core/feed-the-mind/1/feed-the-mind-back-1.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                min: 0,
                max: 2,

                effects: [
                  {
                    type: "discard-self-unless",
                    requirement: {
                      type: "lose-sanity",
                      amount: 2,
                      target: "caster",
                    },
                  },
                ],
              },

              {
                min: 3,

                effects: [
                  {
                    type: "improve-skill",
                    amount: 1,
                    target: "chosen-investigator",
                  },
                ],
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "feed-the-mind-back-2",

        frontImage:
          "/cards/spells/core/feed-the-mind/2/feed_the_mind.png",

        backImage:
          "/cards/spells/core/feed-the-mind/2/feed-the-mind-back-2.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                exact: 0,

                effects: [
                  {
                    type: "discard-self-unless",
                    requirement: {
                      type: "rolled-face",
                      value: 4,
                    },
                  },
                ],
              },

              {
                min: 1,

                effects: [
                  {
                    type: "lose-sanity",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },
            ],
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
   * FLESH WARD
   * ============================================================
   */

  {
    id: "spell-flesh-ward",
    name: "Flesh Ward",
    type: "incantation",

    description:
      "Once per round, when an investigator would lose Health, you may test Lore. If you pass, prevent that investigator from losing up to 2 Health. Then flip this card.",

    loreBonus: 0,

    abilityIds: [],

    frontEffects: [
      {
        type: "on-health-loss",
        oncePerRound: true,
        testType: "lore",

        onSuccess: [
          {
            type: "prevent-health-loss",
            amount: 2,
            target: "triggering-investigator",
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "flesh-ward-back-1",

        frontImage:
          "/cards/spells/core/flesh-ward/1/fresh-ward.png",

        backImage:
          "/cards/spells/core/flesh-ward/1/fresh-ward-back-1.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                exact: 0,

                effects: [
                  {
                    type: "discard-self-unless",
                    requirement: {
                      type: "rolled-face",
                      value: 4,
                    },
                  },
                ],
              },

              {
                min: 1,

                effects: [
                  {
                    type: "lose-sanity",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "flesh-ward-back-2",

        frontImage:
          "/cards/spells/core/flesh-ward/2/fresh-ward.png",

        backImage:
          "/cards/spells/core/flesh-ward/2/fresh-ward-back-2.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                exact: 0,

                effects: [
                  {
                    type: "lose-health-unless-gain-condition",
                    amount: 1,
                    conditionDefinitionId:
                      "condition-internal-injury",
                    target: "chosen-investigator",
                  },
                ],
              },

              {
                min: 1,
                max: 2,

                effects: [],
              },

              {
                min: 3,

                effects: [
                  {
                    type: "prevent-health-loss",
                    amount: "test-result",
                    target: "chosen-investigator",
                  },
                ],
              },
            ],
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
   * INSTILL BRAVERY
   * ============================================================
   */

  {
    id: "spell-instill-bravery",
    name: "Instill Bravery",
    type: "incantation",

    description:
      "Once per round, when an investigator would lose Sanity, you may test Lore. If you pass, prevent that investigator from losing up to 2 Sanity. Then flip this card.",

    loreBonus: 0,

    abilityIds: [],

    frontEffects: [
      {
        type: "on-sanity-loss",
        oncePerRound: true,
        testType: "lore",

        onSuccess: [
          {
            type: "prevent-sanity-loss",
            amount: 2,
            target: "triggering-investigator",
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "instill-bravery-back-1",

        frontImage:
          "/cards/spells/core/instill-bravery/1/Instill_Bravery.png",

        backImage:
          "/cards/spells/core/instill-bravery/1/instill-bravery-back-1.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                exact: 0,

                effects: [
                  {
                    type: "discard-self-unless",
                    requirement: {
                      type: "rolled-face",
                      value: 4,
                    },
                  },
                ],
              },

              {
                min: 1,

                effects: [
                  {
                    type: "lose-health",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "instill-bravery-back-2",

        frontImage:
          "/cards/spells/core/instill-bravery/2/Instill_Bravery.png",

        backImage:
          "/cards/spells/core/instill-bravery/2/instill-bravery-back-2.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                exact: 0,

                effects: [
                  {
                    type: "lose-sanity-unless-gain-condition",
                    amount: 1,
                    conditionDefinitionId:
                      "condition-hallucinations",
                    target: "chosen-investigator",
                  },
                ],
              },

              {
                min: 1,
                max: 2,

                effects: [],
              },

              {
                min: 3,

                effects: [
                  {
                    type: "prevent-sanity-loss",
                    amount: "test-result",
                    target: "chosen-investigator",
                  },
                ],
              },
            ],
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
   * MISTS OF RELEH
   * ============================================================
   */

  {
    id: "spell-mists-of-releh",
    name: "Mists of Releh",
    type: "incantation",

    description:
      "During the Encounter Phase, you may test Lore. If you pass, you may choose an encounter as if there are no Monsters on your space. Then flip this card.",

    loreBonus: 0,

    abilityIds: [],

    frontEffects: [
      {
        type: "on-encounter-phase",
        testType: "lore",

        onSuccess: [
          {
            type: "choose-encounter",
            ignoreMonsters: true,
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "mists-of-releh-back-1",

        frontImage:
          "/cards/spells/core/mists-of-releh/1/mists-of-releh.png",

        backImage:
          "/cards/spells/core/mists-of-releh/1/mists-of-releh-back-1.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                min: 0,
                max: 1,

                effects: [
                  {
                    type: "lose-health",
                    amount: 1,
                    target: "caster",
                  },

                  {
                    type: "lose-sanity",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },

              {
                min: 2,

                effects: [],
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "mists-of-releh-back-2",

        frontImage:
          "/cards/spells/core/mists-of-releh/2/mists-of-releh.png",

        backImage:
          "/cards/spells/core/mists-of-releh/2/mists-of-releh-back-2.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                exact: 0,

                effects: [
                  {
                    type: "discard-self-unless",
                    requirement: {
                      type: "gain-condition",
                      conditionDefinitionId:
                        "condition-hallucinations",
                      target: "caster",
                    },
                  },
                ],
              },

              {
                min: 1,

                effects: [
                  {
                    type: "lose-sanity",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },
            ],
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
   * PLUMB THE VOID
   * ============================================================
   */

  {
    id: "spell-plumb-the-void",
    name: "Plumb the Void",
    type: "ritual",

    description:
      "Action: Test Lore -1. If you pass, an investigator of your choice may move to any space. Then flip this card.",

    loreBonus: -1,

    abilityIds: [],

    frontEffects: [
      {
        type: "action-test",
        testType: "lore",
        modifier: -1,

        onSuccess: [
          {
            type: "choose-investigator",
            location: "any-space",

            effects: [
              {
                type: "move-to-any-space",
                target: "chosen-investigator",
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "plumb-the-void-back-1",

        frontImage:
          "/cards/spells/core/plumb-the-void/1/Plumb_the_Void.png",

        backImage:
          "/cards/spells/core/plumb-the-void/1/plumb-the-void-back-1.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                exact: 0,

                effects: [
                  {
                    type: "lose-health",
                    amount: 3,
                    target: "chosen-investigator",
                  },
                ],
              },

              {
                min: 1,
                max: 2,

                effects: [
                  {
                    type: "lose-sanity",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },

              {
                min: 3,

                effects: [
                  {
                    type: "gain-additional-action",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "plumb-the-void-back-2",

        frontImage:
          "/cards/spells/core/plumb-the-void/2/Plumb_the_Void.png",

        backImage:
          "/cards/spells/core/plumb-the-void/2/plumb-the-void-back-2.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                min: 0,
                max: 1,

                effects: [
                  {
                    type: "discard-self-unless",
                    requirement: {
                      type: "gain-condition",
                      conditionDefinitionId: "condition-amnesia",
                      target: "caster",
                    },
                  },
                ],
              },

              {
                min: 2,

                effects: [],
              },
            ],
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
   * SHRIVELING
   * ============================================================
   */

  {
    id: "spell-shriveling",
    name: "Shriveling",
    type: "ritual",

    description:
      "Action: Test Lore. If you pass, choose a Monster on your space to lose 2 Health. Then flip this card.",

    loreBonus: 0,

    abilityIds: [],

    frontEffects: [
      {
        type: "action-test",
        testType: "lore",

        onSuccess: [
          {
            type: "choose-monster",
            location: "same-space",

            effects: [
              {
                type: "lose-monster-health",
                amount: 2,
                target: "chosen-monster",
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "shriveling-back-1",

        frontImage:
          "/cards/spells/core/shriveling/1/shriveling.png",

        backImage:
          "/cards/spells/core/shriveling/1/shriveling-back-1.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                min: 0,
                max: 1,

                effects: [
                  {
                    type: "discard-self-unless",
                    requirement: {
                      type: "lose-sanity",
                      amount: 2,
                      target: "caster",
                    },
                  },
                ],
              },

              {
                exact: 2,

                effects: [],
              },

              {
                min: 3,

                effects: [
                  {
                    type: "lose-monster-health",
                    amount: "test-result",
                    target: "chosen-monster",
                  },
                ],
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "shriveling-back-2",

        frontImage:
          "/cards/spells/core/shriveling/2/shriveling.png",

        backImage:
          "/cards/spells/core/shriveling/2/shriveling-back-2.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                exact: 0,

                effects: [
                  {
                    type: "lose-health",
                    amount: 2,
                    target: "caster",
                  },
                ],
              },

              {
                exact: 1,

                effects: [
                  {
                    type: "lose-sanity",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },

              {
                min: 2,

                effects: [
                  {
                    type: "lose-other-monsters-health",
                    amount: 2,
                    location: "same-space",
                  },
                ],
              },
            ],
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
   * WITHER
   * ============================================================
   */

  {
    id: "spell-wither",
    name: "Wither",
    type: "incantation",

    description:
      "When resolving a Combat Encounter, you may test Lore. If you pass, gain +3 Strength during that encounter. Then flip this card.",

    loreBonus: 0,

    abilityIds: [],

    frontEffects: [
      {
        type: "on-combat-encounter",
        testType: "lore",

        onSuccess: [
          {
            type: "modify-strength",
            amount: 3,
            target: "caster",
            duration: "this-combat-encounter",
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],

    backs: [
      {
        id: "wither-back-1",

        frontImage:
          "/cards/spells/core/wither/1/witer.png",

        backImage:
          "/cards/spells/core/wither/1/witer-back-1.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                min: 0,
                max: 1,

                effects: [
                  {
                    type: "discard-self-unless",
                    requirement: {
                      type: "lose-sanity",
                      amount: 2,
                      target: "caster",
                    },
                  },
                ],
              },

              {
                min: 2,

                effects: [
                  {
                    type: "lose-sanity",
                    amount: 1,
                    target: "caster",
                  },

                  {
                    type: "modify-strength",
                    amount: 5,
                    target: "caster",
                    duration: "this-combat-encounter",
                    replacePreviousModifier: true,
                  },
                ],
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },

      {
        id: "wither-back-2",

        frontImage:
          "/cards/spells/core/wither/2/witer.png",

        backImage:
          "/cards/spells/core/wither/2/witer-back-2.png",

        effects: [
          {
            type: "resolve-by-test-result",

            results: [
              {
                exact: 0,

                effects: [
                  {
                    type: "discard-self-unless",
                    requirement: {
                      type: "gain-condition",
                      conditionDefinitionId:
                        "condition-internal-injury",
                      target: "caster",
                    },
                  },
                ],
              },

              {
                exact: 1,

                effects: [
                  {
                    type: "lose-sanity",
                    amount: 1,
                    target: "caster",
                  },
                ],
              },

              {
                min: 2,

                effects: [
                  {
                    type: "allow-reroll",
                    amount: 1,
                    testType: "strength",
                    duration: "this-combat-encounter",
                  },
                ],
              },
            ],
          },

          {
            type: "flip-self",
          },
        ],
      },
    ],
  },
];