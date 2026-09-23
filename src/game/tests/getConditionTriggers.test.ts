import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createTestGame,
} from "./helpers/createTestGame";

import {
  getConditionTriggers,
} from "../engine/getConditionTriggers";

import type {
  Condition,
} from "../models/Condition";

function createCondition(
  overrides: Partial<Condition> = {},
): Condition {
  return {
    id:
      "condition-1",

    definitionId:
      "condition-amnesia",

    instanceNumber:
      1,

    frontImage:
      "/cards/conditions/amnesia/1/amnesia.png",

    backImage:
      "/cards/conditions/amnesia/1/amnesia-back-1.png",

    backId:
      "amnesia-back-1",

    flipped:
      false,

    ...overrides,
  };
}

describe("getConditionTriggers", () => {
  it("throws when the Investigator does not exist", () => {
    const game =
      createTestGame();

    expect(() =>
      getConditionTriggers(
        game,
        "investigator-missing",
        "on-rest",
      ),
    ).toThrow(
      'Investigator "investigator-missing" does not exist.',
    );
  });

  it("returns an empty array when the Investigator has no Conditions", () => {
    const game =
      createTestGame();

    game.investigators[
      "investigator-1"
    ].conditionIds = [];

    expect(
      getConditionTriggers(
        game,
        "investigator-1",
        "on-rest",
      ),
    ).toEqual([]);
  });

  it("ignores a Condition instance that does not exist", () => {
    const game =
      createTestGame();

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-missing",
    ];

    expect(
      getConditionTriggers(
        game,
        "investigator-1",
        "on-rest",
      ),
    ).toEqual([]);
  });

  it("ignores a flipped Condition", () => {
    const game =
      createTestGame();

    game.conditions[
      "condition-1"
    ] =
      createCondition({
        flipped:
          true,
      });

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-1",
    ];

    expect(
      getConditionTriggers(
        game,
        "investigator-1",
        "on-rest",
      ),
    ).toEqual([]);
  });

  it("ignores a Condition whose definition does not exist", () => {
    const game =
      createTestGame();

    game.conditions[
      "condition-1"
    ] =
      createCondition({
        definitionId:
          "condition-does-not-exist",
      });

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-1",
    ];

    expect(
      getConditionTriggers(
        game,
        "investigator-1",
        "on-rest",
      ),
    ).toEqual([]);
  });

  it("returns the matching front trigger", () => {
    const game =
      createTestGame();

    game.conditions[
      "condition-1"
    ] =
      createCondition();

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-1",
    ];

    const results =
      getConditionTriggers(
        game,
        "investigator-1",
        "on-rest",
      );

    expect(
      results,
    ).toHaveLength(1);

    expect(
      results[0].conditionId,
    ).toBe(
      "condition-1",
    );

    expect(
      results[0].effect,
    ).toEqual({
      type:
        "on-rest",

      dice:
        1,

      successMinimum:
        5,

      effects: [
        {
          type:
            "discard-self",
        },
      ],
    });
  });

  it("ignores front effects whose trigger type does not match", () => {
    const game =
      createTestGame();

    game.conditions[
      "condition-1"
    ] =
      createCondition();

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-1",
    ];

    expect(
      getConditionTriggers(
        game,
        "investigator-1",
        "on-damage",
      ),
    ).toEqual([]);
  });

  it("returns the correct trigger when the Condition contains multiple front effects", () => {
    const game =
      createTestGame();

    game.conditions[
      "condition-1"
    ] =
      createCondition();

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-1",
    ];

    const results =
      getConditionTriggers(
        game,
        "investigator-1",
        "on-test-fail",
      );

    expect(
      results,
    ).toHaveLength(1);

    expect(
      results[0],
    ).toEqual({
      conditionId:
        "condition-1",

      effect: {
        type:
          "on-test-fail",

        testType:
          "will",

        effects: [
          {
            type:
              "flip-self",
          },
        ],
      },
    });
  });

  it("collects matching triggers from multiple Conditions", () => {
    const game =
      createTestGame();

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-1",
      "condition-2",
    ];

    game.conditions[
      "condition-1"
    ] =
      createCondition({
        id:
          "condition-1",

        definitionId:
          "condition-amnesia",
      });

    game.conditions[
      "condition-2"
    ] =
      createCondition({
        id:
          "condition-2",

        definitionId:
          "condition-back-injury",
      });

    const results =
      getConditionTriggers(
        game,
        "investigator-1",
        "on-rest",
      );

    expect(
      results,
    ).toHaveLength(2);

    expect(
      results.map(
        (result) =>
          result.conditionId,
      ),
    ).toEqual([
      "condition-1",
      "condition-2",
    ]);

    expect(
      results[0].effect.type,
    ).toBe(
      "on-rest",
    );

    expect(
      results[1].effect.type,
    ).toBe(
      "on-rest",
    );
  });
});