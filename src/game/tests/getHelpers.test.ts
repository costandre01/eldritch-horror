import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getLeadInvestigatorId,
} from "../engine/getLeadInvestigatorId";

import {
  hasMonsterReckoningAbility,
} from "../engine/hasMonsterReckoningAbility";

import {
  getInvestigatorConditions,
  getInvestigatorConditionsByCategory,
} from "../engine/getInvestigatorConditions";

import type {
  MonsterDefinition,
  MonsterSpecialAbility,
} from "../models/Monster";

import {
  createTestGame,
} from "./helpers/createTestGame";

describe("getLeadInvestigatorId", () => {
  it("returns the explicitly stored Lead Investigator", () => {
    const game =
      createTestGame();

    game.leadInvestigatorId =
      "investigator-2";

    expect(
      getLeadInvestigatorId(game),
    ).toBe("investigator-2");
  });

  it("falls back to the first investigator in investigatorOrder", () => {
    const game =
      createTestGame();

    game.leadInvestigatorId =
      undefined as unknown as string;

    game.investigatorOrder = [
      "investigator-3",
      "investigator-2",
      "investigator-1",
    ];

    expect(
      getLeadInvestigatorId(game),
    ).toBe("investigator-3");
  });

  it("throws when there are no investigators available", () => {
    const game =
      createTestGame();

    game.leadInvestigatorId =
      undefined as unknown as string;

    game.investigatorOrder = [];

    expect(() =>
      getLeadInvestigatorId(game),
    ).toThrow(
      "There are no Investigators available.",
    );
  });
});

describe("hasMonsterReckoningAbility", () => {
  const reckoningAbilityTypes = [
    "roll-die-advance-doom",
    "move-to-nearest-investigator-and-encounter",
    "adjacent-investigators-lose-health-and-sanity",
    "discard-nearest-clue-and-move-to-space",
    "move-investigator-and-delay-or-move-toward-nearest",
    "roll-die-nearest-investigator-moves-toward",
    "recover-all-health",
    "roll-die-nearest-investigator-gains-condition",
    "cursed-investigators-lose-health",
    "each-investigator-on-space-lose-sanity",
    "each-investigator-on-space-lose-health",
    "discard-and-spawn-epic-monster",
    "roll-die-spawn-gate-if-at-most-investigators",
    "spawn-ghoul-on-space",
    "deep-one-ambush-nearest",
  ] as const;

  it.each(
    reckoningAbilityTypes,
  )(
    "returns true for the Reckoning ability %s",
    (abilityType) => {
      const definition =
        {
          id: "test-monster",
          name: "Test Monster",
          epic: false,
          frontImage: "",
          backImage: "",
          horrorTest: {
            skill: "will",
            modifier: 0,
            damage: 1,
          },
          combatTest: {
            skill: "strength",
            modifier: 0,
            damage: 1,
          },
          toughness: {
            type: "fixed",
            value: 1,
          },
          specialAbilities: [
            {
              type: abilityType,
            } as MonsterSpecialAbility,
          ],
          quantity: 1,
        } satisfies MonsterDefinition;

      expect(
        hasMonsterReckoningAbility(
          definition,
        ),
      ).toBe(true);
    },
  );

  it("returns false when the monster has no Reckoning ability", () => {
    const definition =
      {
        id: "test-monster",
        name: "Test Monster",
        epic: false,
        frontImage: "",
        backImage: "",
        horrorTest: {
          skill: "will",
          modifier: 0,
          damage: 1,
        },
        combatTest: {
          skill: "strength",
          modifier: 0,
          damage: 1,
        },
        toughness: {
          type: "fixed",
          value: 1,
        },
        specialAbilities: [
          {
            type: "none",
          },
        ],
        quantity: 1,
      } satisfies MonsterDefinition;

    expect(
      hasMonsterReckoningAbility(
        definition,
      ),
    ).toBe(false);
  });

  it("returns false for an empty special ability list", () => {
    const definition =
      {
        id: "test-monster",
        name: "Test Monster",
        epic: false,
        frontImage: "",
        backImage: "",
        horrorTest: {
          skill: "will",
          modifier: 0,
          damage: 1,
        },
        combatTest: {
          skill: "strength",
          modifier: 0,
          damage: 1,
        },
        toughness: {
          type: "fixed",
          value: 1,
        },
        specialAbilities: [],
        quantity: 1,
      } satisfies MonsterDefinition;

    expect(
      hasMonsterReckoningAbility(
        definition,
      ),
    ).toBe(false);
  });
});

describe("getInvestigatorConditions", () => {
  it("returns the investigator conditions that exist in game.conditions", () => {
    const game =
      createTestGame();

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-amnesia-1",
      "condition-missing",
      "condition-blessed-1",
    ];

    game.conditions = {
      "condition-amnesia-1": {
        id: "condition-amnesia-1",
        definitionId: "condition-amnesia",
        instanceNumber: 1,
        frontImage: "/amnesia.png",
        backImage: "/amnesia-back.png",
        backId: "amnesia-back-1",
        flipped: false,
      },

      "condition-blessed-1": {
        id: "condition-blessed-1",
        definitionId: "condition-blessed",
        instanceNumber: 1,
        frontImage: "/blessed.png",
        backImage: "/blessed-back.png",
        backId: "blessed-back-1",
        flipped: false,
      },
    };

    const conditions =
      getInvestigatorConditions(
        game,
        "investigator-1",
      );

    expect(conditions).toHaveLength(2);

    expect(
      conditions.map(
        (condition) =>
          condition.definitionId,
      ),
    ).toEqual([
      "condition-amnesia",
      "condition-blessed",
    ]);
  });

  it("returns an empty array when the investigator has no conditions", () => {
    const game =
      createTestGame();

    game.investigators[
      "investigator-1"
    ].conditionIds = [];

    game.conditions = {};

    expect(
      getInvestigatorConditions(
        game,
        "investigator-1",
      ),
    ).toEqual([]);
  });

  it("throws when the investigator does not exist", () => {
    const game =
      createTestGame();

    expect(() =>
      getInvestigatorConditions(
        game,
        "investigator-does-not-exist",
      ),
    ).toThrow(
      'Investigator "investigator-does-not-exist" does not exist.',
    );
  });
});

describe("getInvestigatorConditionsByCategory", () => {
  it("returns only conditions belonging to the requested category", () => {
    const game =
      createTestGame();

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-amnesia-1",
      "condition-blessed-1",
      "condition-cursed-1",
    ];

    game.conditions = {
      "condition-amnesia-1": {
        id: "condition-amnesia-1",
        definitionId: "condition-amnesia",
        instanceNumber: 1,
        frontImage: "/amnesia.png",
        backImage: "/amnesia-back.png",
        backId: "amnesia-back-1",
        flipped: false,
      },

      "condition-blessed-1": {
        id: "condition-blessed-1",
        definitionId: "condition-blessed",
        instanceNumber: 1,
        frontImage: "/blessed.png",
        backImage: "/blessed-back.png",
        backId: "blessed-back-1",
        flipped: false,
      },

      "condition-cursed-1": {
        id: "condition-cursed-1",
        definitionId: "condition-cursed",
        instanceNumber: 1,
        frontImage: "/cursed.png",
        backImage: "/cursed-back.png",
        backId: "cursed-back-1",
        flipped: false,
      },
    };

    const madnessConditions =
      getInvestigatorConditionsByCategory(
        game,
        "investigator-1",
        "madness",
      );

    expect(
      madnessConditions,
    ).toHaveLength(1);

    expect(
      madnessConditions[0]?.definitionId,
    ).toBe("condition-amnesia");
  });

  it("returns an empty array when no condition matches the category", () => {
    const game =
      createTestGame();

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-amnesia-1",
    ];

    game.conditions = {
      "condition-amnesia-1": {
        id: "condition-amnesia-1",
        definitionId: "condition-amnesia",
        instanceNumber: 1,
        frontImage: "/amnesia.png",
        backImage: "/amnesia-back.png",
        backId: "amnesia-back-1",
        flipped: false,
      },
    };

    expect(
      getInvestigatorConditionsByCategory(
        game,
        "investigator-1",
        "Boon",
      ),
    ).toEqual([]);
  });

  it("ignores conditions whose definitions are not found", () => {
    const game =
      createTestGame();

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-unknown-1",
    ];

    game.conditions = {
      "condition-unknown-1": {
        id: "condition-unknown-1",
        definitionId: "condition-that-does-not-exist",
        instanceNumber: 1,
        frontImage: "/unknown.png",
        backImage: "/unknown-back.png",
        backId: "unknown-back-1",
        flipped: false,
      },
    };

    expect(
      getInvestigatorConditionsByCategory(
        game,
        "investigator-1",
        "madness",
      ),
    ).toEqual([]);
  });
});