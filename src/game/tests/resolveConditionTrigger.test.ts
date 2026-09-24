import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  createTestGame,
} from "./helpers/createTestGame";

import {
  resolveConditionTrigger,
} from "../engine/resolveConditionTrigger";

import {
  getConditionTriggers,
} from "../engine/getConditionTriggers";

import {
  resolveConditionFrontEffects,
} from "../engine/resolveConditionFrontEffects";

import type {
  ConditionFrontEffect,
} from "../models/ConditionDefinition/frontEffects";

import type {
  MapDefinition,
} from "../models/MapDefinition";

vi.mock(
  "../engine/getConditionTriggers",
  () => ({
    getConditionTriggers:
      vi.fn(),
  }),
);

vi.mock(
  "../engine/resolveConditionFrontEffects",
  () => ({
    resolveConditionFrontEffects:
      vi.fn(),
  }),
);

const mockedGetConditionTriggers =
  vi.mocked(
    getConditionTriggers,
  );

const mockedResolveConditionFrontEffects =
  vi.mocked(
    resolveConditionFrontEffects,
  );

const testMap = {} as MapDefinition;

function createOnRestEffect(
  overrides: Partial<
    Extract<
      ConditionFrontEffect,
      {
        type: "on-rest";
      }
    >
  > = {},
): ConditionFrontEffect {
  return {
    type:
      "on-rest",

    dice:
      1,

    effects: [],

    ...overrides,
  };
}

function createOnEncounterEffect(
  overrides: Partial<
    Extract<
      ConditionFrontEffect,
      {
        type: "on-encounter";
      }
    >
  > = {},
): ConditionFrontEffect {
  return {
    type:
      "on-encounter",

    effects: [],

    ...overrides,
  };
}

describe(
  "resolveConditionTrigger",
  () => {
    it(
      "returns the same game when there are no triggers",
      () => {
        const game =
          createTestGame();

        mockedGetConditionTriggers.mockReturnValue(
          [],
        );

        const result =
          resolveConditionTrigger(
            game,
            "investigator-1",
            "on-rest",
            testMap,
          );

        expect(
          result.game,
        ).toBe(game);

        expect(
          result.optionalConditionIds,
        ).toEqual([]);

        expect(
          result.preventsEncounter,
        ).toBe(false);

        expect(
          mockedResolveConditionFrontEffects,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "collects optional Rest conditions without resolving them",
      () => {
        const game =
          createTestGame();

        mockedGetConditionTriggers.mockReturnValue([
          {
            conditionId:
              "condition-optional",

            effect:
              createOnRestEffect({
                optional:
                  true,
              }),
          },
        ]);

        const result =
          resolveConditionTrigger(
            game,
            "investigator-1",
            "on-rest",
            testMap,
          );

        expect(
          result.optionalConditionIds,
        ).toEqual([
          "condition-optional",
        ]);

        expect(
          result.game,
        ).toBe(game);

        expect(
          result.preventsEncounter,
        ).toBe(false);

        expect(
          mockedResolveConditionFrontEffects,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "resolves a normal trigger automatically",
      () => {
        const game =
          createTestGame();

        const nextGame =
          {
            ...game,
            round: 2,
          };

        const effect =
          createOnRestEffect();

        mockedGetConditionTriggers.mockReturnValue([
          {
            conditionId:
              "condition-1",

            effect,
          },
        ]);

        mockedResolveConditionFrontEffects.mockReturnValue({
          game:
            nextGame,

          testResults: [],
        });

        const result =
          resolveConditionTrigger(
            game,
            "investigator-1",
            "on-rest",
            testMap,
          );

        expect(
          mockedResolveConditionFrontEffects,
        ).toHaveBeenCalledTimes(1);

        expect(
          mockedResolveConditionFrontEffects,
        ).toHaveBeenCalledWith(
          game,
          "investigator-1",
          "condition-1",
          effect,
          testMap,
        );

        expect(
          result.game,
        ).toBe(nextGame);

        expect(
          result.optionalConditionIds,
        ).toEqual([]);

        expect(
          result.preventsEncounter,
        ).toBe(false);
      },
    );

    it(
      "marks the encounter as prevented when the Condition says so",
      () => {
        const game =
          createTestGame();

        const effect =
          createOnEncounterEffect({
            preventsEncounter:
              true,
          });

        mockedGetConditionTriggers.mockReturnValue([
          {
            conditionId:
              "condition-encounter",

            effect,
          },
        ]);

        mockedResolveConditionFrontEffects.mockReturnValue({
          game,
          testResults: [],
        });

        const result =
          resolveConditionTrigger(
            game,
            "investigator-1",
            "on-encounter",
            testMap,
          );

        expect(
          result.preventsEncounter,
        ).toBe(true);

        expect(
          result.optionalConditionIds,
        ).toEqual([]);

        expect(
          mockedResolveConditionFrontEffects,
        ).toHaveBeenCalledWith(
          game,
          "investigator-1",
          "condition-encounter",
          effect,
          testMap,
        );
      },
    );

    it(
      "does not prevent an encounter when preventsEncounter is false",
      () => {
        const game =
          createTestGame();

        const effect =
          createOnEncounterEffect({
            preventsEncounter:
              false,
          });

        mockedGetConditionTriggers.mockReturnValue([
          {
            conditionId:
              "condition-encounter",

            effect,
          },
        ]);

        mockedResolveConditionFrontEffects.mockReturnValue({
          game,
          testResults: [],
        });

        const result =
          resolveConditionTrigger(
            game,
            "investigator-1",
            "on-encounter",
            testMap,
          );

        expect(
          result.preventsEncounter,
        ).toBe(false);

        expect(
          mockedResolveConditionFrontEffects,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      "does not prevent an encounter when the trigger is not on-encounter",
      () => {
        const game =
          createTestGame();

        const effect =
          createOnRestEffect();

        mockedGetConditionTriggers.mockReturnValue([
          {
            conditionId:
              "condition-1",

            effect,
          },
        ]);

        mockedResolveConditionFrontEffects.mockReturnValue({
          game,
          testResults: [],
        });

        const result =
          resolveConditionTrigger(
            game,
            "investigator-1",
            "on-rest",
            testMap,
          );

        expect(
          result.preventsEncounter,
        ).toBe(false);
      },
    );

    it(
      "resolves multiple triggers in order",
      () => {
        const game =
          createTestGame();

        const game2 =
          {
            ...game,
            round: 2,
          };

        const game3 =
          {
            ...game2,
            round: 3,
          };

        const effect1 =
          createOnRestEffect();

        const effect2 =
          createOnRestEffect();

        mockedGetConditionTriggers.mockReturnValue([
          {
            conditionId:
              "condition-1",

            effect:
              effect1,
          },
          {
            conditionId:
              "condition-2",

            effect:
              effect2,
          },
        ]);

        mockedResolveConditionFrontEffects
          .mockReturnValueOnce({
            game:
              game2,

            testResults: [],
          })
          .mockReturnValueOnce({
            game:
              game3,

            testResults: [],
          });

        const result =
          resolveConditionTrigger(
            game,
            "investigator-1",
            "on-rest",
            testMap,
          );

        expect(
          mockedResolveConditionFrontEffects,
        ).toHaveBeenCalledTimes(2);

        expect(
          mockedResolveConditionFrontEffects,
        ).toHaveBeenNthCalledWith(
          1,
          game,
          "investigator-1",
          "condition-1",
          effect1,
          testMap,
        );

        expect(
          mockedResolveConditionFrontEffects,
        ).toHaveBeenNthCalledWith(
          2,
          game2,
          "investigator-1",
          "condition-2",
          effect2,
          testMap,
        );

        expect(
          result.game,
        ).toBe(game3);
      },
    );

    it(
      "can collect an optional Rest condition and resolve another trigger",
      () => {
        const game =
          createTestGame();

        const nextGame =
          {
            ...game,
            round: 2,
          };

        const optionalEffect =
          createOnRestEffect({
            optional:
              true,
          });

        const automaticEffect =
          createOnRestEffect();

        mockedGetConditionTriggers.mockReturnValue([
          {
            conditionId:
              "condition-optional",

            effect:
              optionalEffect,
          },
          {
            conditionId:
              "condition-automatic",

            effect:
              automaticEffect,
          },
        ]);

        mockedResolveConditionFrontEffects.mockReturnValue({
          game:
            nextGame,

          testResults: [],
        });

        const result =
          resolveConditionTrigger(
            game,
            "investigator-1",
            "on-rest",
            testMap,
          );

        expect(
          result.optionalConditionIds,
        ).toEqual([
          "condition-optional",
        ]);

        expect(
          result.game,
        ).toBe(nextGame);

        expect(
          mockedResolveConditionFrontEffects,
        ).toHaveBeenCalledTimes(1);

        expect(
          mockedResolveConditionFrontEffects,
        ).toHaveBeenCalledWith(
          game,
          "investigator-1",
          "condition-automatic",
          automaticEffect,
          testMap,
        );
      },
    );
  },
);