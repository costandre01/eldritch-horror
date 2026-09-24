import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  resolveConditionFrontEffects as resolveConditionFrontEffectsEngine,
} from "../engine/resolveConditionFrontEffects";

import {
  createTestGame,
} from "./helpers/createTestGame";

import type {
  GameState,
} from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

function addCondition(
  game: GameState,
  conditionId = "condition-1",
  definitionId = "condition-amnesia",
  flipped = false,
): void {
  game.conditions[conditionId] = {
    id: conditionId,
    definitionId,
    instanceNumber: 1,
    frontImage:
      "/cards/conditions/test.png",
    backImage:
      "/cards/conditions/test-back.png",
    backId: "test-back-1",
    flipped,
  };

  game.investigators[
    "investigator-1"
  ].conditionIds = [
    conditionId,
  ];
}

function prepareGame(): GameState {
  const game =
    createTestGame();

  game.investigators[
    "investigator-1"
  ].health = 5;

  game.investigators[
    "investigator-1"
  ].maxHealth = 5;

  game.investigators[
    "investigator-1"
  ].sanity = 5;

  game.investigators[
    "investigator-1"
  ].maxSanity = 5;

  return game;
}

const testMap: MapDefinition = {
  id: "test-map",
  name: "Test Map",
  startingSpaceId: "test-city",
  spaces: [
    {
      id: "test-city",
      name: "Test City",
      type: "city",
      isExpedition: false,
      connectedSpaceIds: [],
      paths: [],
    },
  ],
};

function resolveConditionFrontEffectsTest(
  game: GameState,
  investigatorId: string,
  conditionId: string,
  effect: Parameters<
    typeof resolveConditionFrontEffectsEngine
  >[3],
  treatDiceAsOne = false,
) {
  return resolveConditionFrontEffectsEngine(
    game,
    investigatorId,
    conditionId,
    effect,
    testMap,
    treatDiceAsOne,
  );
}

describe(
  "resolveConditionFrontEffects",
  () => {
    it(
      "throws when the investigator does not exist",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        expect(() =>
          resolveConditionFrontEffectsTest(
            game,
            "missing-investigator",
            "condition-1",
            {
              type: "on-damage",
              effects: [],
            },
          ),
        ).toThrow(
          'Investigator "missing-investigator" does not exist.',
        );
      },
    );

    it(
      "throws when the Condition does not exist",
      () => {
        const game =
          prepareGame();

        expect(() =>
          resolveConditionFrontEffectsTest(
            game,
            "investigator-1",
            "missing-condition",
            {
              type: "on-damage",
              effects: [],
            },
          ),
        ).toThrow(
          'Condition "missing-condition" does not exist.',
        );
      },
    );

    it(
      "throws when the Condition does not belong to the investigator",
      () => {
        const game =
          prepareGame();

        game.conditions[
          "condition-1"
        ] = {
          id: "condition-1",
          definitionId:
            "condition-amnesia",
          instanceNumber: 1,
          frontImage:
            "/cards/conditions/test.png",
          backImage:
            "/cards/conditions/test-back.png",
          backId: "test-back-1",
          flipped: false,
        };

        expect(() =>
          resolveConditionFrontEffectsTest(
            game,
            "investigator-1",
            "condition-1",
            {
              type: "on-damage",
              effects: [],
            },
          ),
        ).toThrow(
          'Condition "condition-1" is not associated with investigator "investigator-1".',
        );
      },
    );

    it(
      "does nothing when the Condition is already flipped",
      () => {
        const game =
          prepareGame();

        addCondition(
          game,
          "condition-1",
          "condition-amnesia",
          true,
        );

        const result =
          resolveConditionFrontEffectsTest(
            game,
            "investigator-1",
            "condition-1",
            {
              type: "on-damage",
              effects: [
                {
                  type: "lose-health",
                  amount: 2,
                },
              ],
            },
          );

        expect(
          result.game.investigators[
            "investigator-1"
          ].health,
        ).toBe(5);

        expect(
          result.testResults,
        ).toEqual([]);
      },
    );

    it(
      "resolves on-damage triggered effects",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        const result =
          resolveConditionFrontEffectsTest(
            game,
            "investigator-1",
            "condition-1",
            {
              type: "on-damage",
              effects: [
                {
                  type: "lose-health",
                  amount: 2,
                },
                {
                  type: "lose-sanity",
                  amount: 1,
                },
                {
                  type: "become-delayed",
                },
              ],
            },
          );

        const investigator =
          result.game.investigators[
            "investigator-1"
          ];

        expect(
          investigator.health,
        ).toBe(3);

        expect(
          investigator.sanity,
        ).toBe(4);

        expect(
          investigator.isDelayed,
        ).toBe(true);

        expect(
          result.testResults,
        ).toEqual([]);
      },
    );

    it(
      "flips the Condition through a triggered effect",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        const result =
          resolveConditionFrontEffectsTest(
            game,
            "investigator-1",
            "condition-1",
            {
              type: "on-damage",
              effects: [
                {
                  type: "flip-self",
                },
              ],
            },
          );

        expect(
          result.game.conditions[
            "condition-1"
          ].flipped,
        ).toBe(true);
      },
    );

    it(
      "discards the Condition when discard-self is triggered",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        game.board.conditionDiscard = [];

        const result =
          resolveConditionFrontEffectsTest(
            game,
            "investigator-1",
            "condition-1",
            {
              type: "on-damage",
              effects: [
                {
                  type: "discard-self",
                },
              ],
            },
          );

        expect(
          result.game.investigators[
            "investigator-1"
          ].conditionIds,
        ).toEqual([]);

        expect(
          result.game.board.conditionDiscard,
        ).toContain(
          "condition-1",
        );
      },
    );

    it(
      "gains a new Condition through a triggered gain-condition effect",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        game.conditions[
          "condition-2"
        ] = {
          id: "condition-2",
          definitionId:
            "condition-cursed",
          instanceNumber: 1,
          frontImage:
            "/cards/conditions/cursed.png",
          backImage:
            "/cards/conditions/cursed-back.png",
          backId: "cursed-back-1",
          flipped: false,
        };

        game.board.conditionDeck = [
          "condition-2",
        ];

        const result =
          resolveConditionFrontEffectsTest(
            game,
            "investigator-1",
            "condition-1",
            {
              type: "on-damage",
              effects: [
                {
                  type: "gain-condition",
                  conditionDefinitionId:
                    "condition-cursed",
                },
              ],
            },
          );

        expect(
          result.game.investigators[
            "investigator-1"
          ].conditionIds,
        ).toContain(
          "condition-1",
        );

        expect(
          result.game.investigators[
            "investigator-1"
          ].conditionIds,
        ).toContain(
          "condition-2",
        );

        expect(
          result.game.board.conditionDeck,
        ).toEqual([]);
      },
    );

    it(
      "resolves on-will when a successful die is rolled",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.9,
        );

        try {
          const result =
            resolveConditionFrontEffectsTest(
              game,
              "investigator-1",
              "condition-1",
              {
                type: "on-will",
                dice: 1,
                successResults: [6],
                effects: [
                  {
                    type: "lose-sanity",
                    amount: 2,
                  },
                ],
              },
            );

          expect(
            result.game.investigators[
              "investigator-1"
            ].sanity,
          ).toBe(3);
        } finally {
          vi.restoreAllMocks();
        }
      },
    );

    it(
      "does not resolve on-will effects when there is no success",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0,
        );

        try {
          const result =
            resolveConditionFrontEffectsTest(
              game,
              "investigator-1",
              "condition-1",
              {
                type: "on-will",
                dice: 1,
                successResults: [6],
                effects: [
                  {
                    type: "lose-sanity",
                    amount: 2,
                  },
                ],
              },
            );

          expect(
            result.game.investigators[
              "investigator-1"
            ].sanity,
          ).toBe(5);
        } finally {
          vi.restoreAllMocks();
        }
      },
    );

    it(
      "resolves on-deal when a successful die is rolled",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0,
        );

        try {
          const result =
            resolveConditionFrontEffectsTest(
              game,
              "investigator-1",
              "condition-1",
              {
                type: "on-deal",
                dice: 1,
                successResults: [1],
                effects: [
                  {
                    type: "lose-health",
                    amount: 2,
                  },
                ],
              },
            );

          expect(
            result.game.investigators[
              "investigator-1"
            ].health,
          ).toBe(3);
        } finally {
          vi.restoreAllMocks();
        }
      },
    );

    it(
      "does not resolve on-deal effects when there is no success",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0,
        );

        try {
          const result =
            resolveConditionFrontEffectsTest(
              game,
              "investigator-1",
              "condition-1",
              {
                type: "on-deal",
                dice: 1,
                successResults: [6],
                effects: [
                  {
                    type: "lose-health",
                    amount: 2,
                  },
                ],
              },
            );

          expect(
            result.game.investigators[
              "investigator-1"
            ].health,
          ).toBe(5);
        } finally {
          vi.restoreAllMocks();
        }
      },
    );

    it(
      "resolves a simple on-encounter effect",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        const result =
          resolveConditionFrontEffectsTest(
            game,
            "investigator-1",
            "condition-1",
            {
              type: "on-encounter",
              effects: [
                {
                  type: "flip-self",
                },
              ],
            },
          );

        expect(
          result.game.conditions[
            "condition-1"
          ].flipped,
        ).toBe(true);
      },
    );

    it(
      "resolves an on-encounter test failure",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        game.investigators[
          "investigator-1"
        ].skills.will = 0;

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0,
        );

        try {
          const result =
            resolveConditionFrontEffectsTest(
              game,
              "investigator-1",
              "condition-1",
              {
                type: "on-encounter",
                testType: "will",
                onFail: [
                  {
                    type: "flip-self",
                  },
                ],
              },
            );

          expect(
            result.testResults,
          ).toHaveLength(1);

          expect(
            result.testResults[0].passed,
          ).toBe(false);

          expect(
            result.game.conditions[
              "condition-1"
            ].flipped,
          ).toBe(true);
        } finally {
          vi.restoreAllMocks();
        }
      },
    );

    it(
      "resolves on-encounter dice success",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0,
        );

        try {
          const result =
            resolveConditionFrontEffectsTest(
              game,
              "investigator-1",
              "condition-1",
              {
                type: "on-encounter",
                dice: 1,
                successResults: [1],
                effects: [
                  {
                    type: "flip-self",
                  },
                ],
              },
            );

          expect(
            result.game.conditions[
              "condition-1"
            ].flipped,
          ).toBe(true);
        } finally {
          vi.restoreAllMocks();
        }
      },
    );

    it(
      "resolves on-reckoning test success",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        game.investigators[
          "investigator-1"
        ].skills.will = 1;

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.9,
        );

        try {
          const result =
            resolveConditionFrontEffectsTest(
              game,
              "investigator-1",
              "condition-1",
              {
                type: "on-reckoning",
                testType: "will",
                effects: [
                  {
                    type: "flip-self",
                  },
                ],
              },
            );

          expect(
            result.testResults,
          ).toHaveLength(1);

          expect(
            result.testResults[0].passed,
          ).toBe(true);

          expect(
            result.game.conditions[
              "condition-1"
            ].flipped,
          ).toBe(true);
        } finally {
          vi.restoreAllMocks();
        }
      },
    );

    it(
      "resolves on-reckoning test failure",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        game.investigators[
          "investigator-1"
        ].skills.will = 0;

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0,
        );

        try {
          const result =
            resolveConditionFrontEffectsTest(
              game,
              "investigator-1",
              "condition-1",
              {
                type: "on-reckoning",
                testType: "will",
                onFail: [
                  {
                    type: "flip-self",
                  },
                ],
              },
            );

          expect(
            result.testResults,
          ).toHaveLength(1);

          expect(
            result.testResults[0].passed,
          ).toBe(false);

          expect(
            result.game.conditions[
              "condition-1"
            ].flipped,
          ).toBe(true);
        } finally {
          vi.restoreAllMocks();
        }
      },
    );

    it(
      "treats Reckoning test dice as one when requested",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        game.investigators[
          "investigator-1"
        ].skills.will = 2;

        const result =
          resolveConditionFrontEffectsTest(
            game,
            "investigator-1",
            "condition-1",
            {
              type: "on-reckoning",
              testType: "will",
              onFail: [
                {
                  type: "flip-self",
                },
              ],
            },
            true,
          );

        expect(
          result.testResults,
        ).toHaveLength(1);

        expect(
          result.testResults[0].results,
        ).toEqual([1, 1]);

        expect(
          result.testResults[0].passed,
        ).toBe(false);

        expect(
          result.game.conditions[
            "condition-1"
          ].flipped,
        ).toBe(true);
      },
    );

    it(
      "resolves Reckoning dice success",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0,
        );

        try {
          const result =
            resolveConditionFrontEffectsTest(
              game,
              "investigator-1",
              "condition-1",
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
            );

          expect(
            result.game.conditions[
              "condition-1"
            ].flipped,
          ).toBe(true);
        } finally {
          vi.restoreAllMocks();
        }
      },
    );

    it(
      "resolves a simple Reckoning effect",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        const result =
          resolveConditionFrontEffectsTest(
            game,
            "investigator-1",
            "condition-1",
            {
              type: "on-reckoning",
              effects: [
                {
                  type: "lose-health",
                  amount: 2,
                },
              ],
            },
          );

        expect(
          result.game.investigators[
            "investigator-1"
          ].health,
        ).toBe(3);
      },
    );

    it(
      "does nothing for the currently unsupported local action effects",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        const localAction =
          resolveConditionFrontEffectsTest(
            game,
            "investigator-1",
            "condition-1",
            {
              type: "local-action-test",
              testType: "influence",
              onSuccess: [
                {
                  type: "flip-self",
                },
              ],
            },
          );

        expect(
          localAction.game.conditions[
            "condition-1"
          ].flipped,
        ).toBe(false);

        const onLocalAction =
          resolveConditionFrontEffectsTest(
            game,
            "investigator-1",
            "condition-1",
            {
              type: "on-local-action-test",
              action: "deal",
              testType: "influence",
              effects: [
                {
                  type: "flip-self",
                },
              ],
            },
          );

        expect(
          onLocalAction.game.conditions[
            "condition-1"
          ].flipped,
        ).toBe(false);
      },
    );

    it(
      "does nothing for modify-test-successes",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        const result =
          resolveConditionFrontEffectsTest(
            game,
            "investigator-1",
            "condition-1",
            {
              type: "modify-test-successes",
              successfulResults: [
                4,
                5,
                6,
              ],
            },
          );

        expect(
          result.game,
        ).toBe(game);

        expect(
          result.testResults,
        ).toEqual([]);
      },
    );

    it(
      "uses on-rest success results",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0,
        );

        try {
          const result =
            resolveConditionFrontEffectsTest(
              game,
              "investigator-1",
              "condition-1",
              {
                type: "on-rest",
                dice: 1,
                successResults: [1],
                effects: [
                  {
                    type: "flip-self",
                  },
                ],
              },
            );

          expect(
            result.game.conditions[
              "condition-1"
            ].flipped,
          ).toBe(true);
        } finally {
          vi.restoreAllMocks();
        }
      },
    );

    it(
      "uses on-rest success minimum",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.8,
        );

        try {
          const result =
            resolveConditionFrontEffectsTest(
              game,
              "investigator-1",
              "condition-1",
              {
                type: "on-rest",
                dice: 1,
                successMinimum: 5,
                effects: [
                  {
                    type: "flip-self",
                  },
                ],
              },
            );

          expect(
            result.game.conditions[
              "condition-1"
            ].flipped,
          ).toBe(true);
        } finally {
          vi.restoreAllMocks();
        }
      },
    );

    it(
      "resolves the on-rest otherwise test failure",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0,
        );

        try {
          const result =
            resolveConditionFrontEffectsTest(
              game,
              "investigator-1",
              "condition-1",
              {
                type: "on-rest",
                dice: 1,
                successMinimum: 6,
                effects: [],
                otherwise: {
                  type: "test",
                  testType: "will",
                  onFail: [
                    {
                      type: "flip-self",
                    },
                  ],
                },
              },
            );

          expect(
            result.testResults,
          ).toHaveLength(1);

          expect(
            result.testResults[0].passed,
          ).toBe(false);

          expect(
            result.game.conditions[
              "condition-1"
            ].flipped,
          ).toBe(true);
        } finally {
          vi.restoreAllMocks();
        }
      },
    );

    it(
      "resolves on-test-fail as a no-op",
      () => {
        const game =
          prepareGame();

        addCondition(game);

        const result =
          resolveConditionFrontEffectsTest(
            game,
            "investigator-1",
            "condition-1",
            {
              type: "on-test-fail",
              testType: "will",
              effects: [
                {
                  type: "flip-self",
                },
              ],
            },
          );

        expect(
          result.game.conditions[
            "condition-1"
          ].flipped,
        ).toBe(false);

        expect(
          result.testResults,
        ).toEqual([]);
      },
    );
  },
);