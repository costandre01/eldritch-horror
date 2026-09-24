import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  resolveConditionReckoning,
} from "../engine/resolveConditionReckoning";

import {
  createTestGame,
} from "./helpers/createTestGame";

import type {
  GameState,
} from "../models/GameState";

import type {
  MapDefinition,
} from "../models/MapDefinition";

function createTestMap(): MapDefinition {
  return {
    id: "test-map",
    name: "Test Map",
    startingSpaceId: "arkham",
    spaces: [
      {
        id: "arkham",
        name: "Arkham",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [],
        paths: [],
      },
    ],
  };
}

function prepareGame(): GameState {
  const game =
    createTestGame();

  game.currentMythosId =
    "a-proposition";

  return game;
}

function createDecision(
  overrides: Partial<
    Extract<
      GameState["pendingDecision"],
      {
        type: "mythos-condition-reckoning";
      }
    >
  > = {},
): Extract<
  GameState["pendingDecision"],
  {
    type: "mythos-condition-reckoning";
  }
> {
  return {
    type:
      "mythos-condition-reckoning",

    title:
      "CONDITION RECKONING",

    message:
      "Resolve Condition Reckoning.",

    investigatorIds: [
      "investigator-1",
    ],

    currentInvestigatorIndex:
      0,

    conditionIds: [
      [],
    ],

    currentConditionIndex:
      0,

    source:
      "mythos:condition-reckoning",

    nextIconIndex:
      0,

    ...overrides,
  };
}

describe(
  "resolveConditionReckoning",
  () => {
    it(
      "throws when there is no active Condition Reckoning decision",
      () => {
        const game =
          prepareGame();

        game.pendingDecision =
          null;

        expect(() =>
          resolveConditionReckoning(
            game,
            createTestMap(),
          ),
        ).toThrow(
          "There is no active Condition Reckoning decision.",
        );
      },
    );

    it(
      "throws when the pending decision has another type",
      () => {
        const game =
          prepareGame();

        game.pendingDecision = {
          type: "continue",
          title: "Continue",
          message: "Continue.",
        };

        expect(() =>
          resolveConditionReckoning(
            game,
            createTestMap(),
          ),
        ).toThrow(
          "There is no active Condition Reckoning decision.",
        );
      },
    );

    it(
      "shows the Mythos Continue when there is no investigator left",
      () => {
        const game =
          prepareGame();

        game.pendingDecision =
          createDecision({
            investigatorIds: [],
          });

        const result =
          resolveConditionReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("continue");

        expect(
          result.pendingDecision?.source,
        ).toBe(
          "mythos-card:0",
        );
      },
    );

    it(
      "throws when the current investigator does not exist",
      () => {
        const game =
          prepareGame();

        game.pendingDecision =
          createDecision({
            investigatorIds: [
              "missing-investigator",
            ],
          });

        expect(() =>
          resolveConditionReckoning(
            game,
            createTestMap(),
          ),
        ).toThrow(
          'Investigator "missing-investigator" does not exist.',
        );
      },
    );

    it(
      "moves to the next investigator when the current investigator is defeated",
      () => {
        const game =
          prepareGame();

        game.investigators[
          "investigator-1"
        ].isDefeated = true;

        game.investigators[
          "investigator-2"
        ] = {
          ...game.investigators[
            "investigator-1"
          ],
          id: "investigator-2",
          isDefeated: false,
          conditionIds: [],
        };

        game.pendingDecision =
          createDecision({
            investigatorIds: [
              "investigator-1",
              "investigator-2",
            ],

            conditionIds: [
              [],
              [],
            ],
          });

        const result =
          resolveConditionReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe(
          "mythos-condition-reckoning",
        );

        if (
          result.pendingDecision?.type ===
          "mythos-condition-reckoning"
        ) {
          expect(
            result.pendingDecision
              .currentInvestigatorIndex,
          ).toBe(1);

          expect(
            result.pendingDecision
              .currentConditionIndex,
          ).toBe(0);
        }
      },
    );

    it(
      "shows Mythos Continue when the last investigator is defeated",
      () => {
        const game =
          prepareGame();

        game.investigators[
          "investigator-1"
        ].isDefeated = true;

        game.pendingDecision =
          createDecision();

        const result =
          resolveConditionReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("continue");

        expect(
          result.pendingDecision?.source,
        ).toBe(
          "mythos-card:0",
        );
      },
    );

    it(
      "moves to the next investigator when there are no more Conditions",
      () => {
        const game =
          prepareGame();

        game.pendingDecision =
          createDecision({
            investigatorIds: [
              "investigator-1",
              "investigator-2",
            ],

            conditionIds: [
              [],
              [],
            ],
          });

        const result =
          resolveConditionReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe(
          "mythos-condition-reckoning",
        );

        if (
          result.pendingDecision?.type ===
          "mythos-condition-reckoning"
        ) {
          expect(
            result.pendingDecision
              .currentInvestigatorIndex,
          ).toBe(1);

          expect(
            result.pendingDecision
              .currentConditionIndex,
          ).toBe(0);
        }
      },
    );

    it(
      "shows Mythos Continue when all investigators have no more Conditions",
      () => {
        const game =
          prepareGame();

        game.pendingDecision =
          createDecision({
            investigatorIds: [
              "investigator-1",
            ],

            conditionIds: [
              [],
            ],
          });

        const result =
          resolveConditionReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("continue");

        expect(
          result.pendingDecision?.source,
        ).toBe(
          "mythos-card:0",
        );
      },
    );

    it(
      "skips a Condition instance that no longer exists",
      () => {
        const game =
          prepareGame();

        game.pendingDecision =
          createDecision({
            conditionIds: [
              [
                "missing-condition",
                "another-condition",
              ],
            ],
          });

        const result =
          resolveConditionReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe(
          "mythos-condition-reckoning",
        );

        if (
          result.pendingDecision?.type ===
          "mythos-condition-reckoning"
        ) {
          expect(
            result.pendingDecision
              .currentConditionIndex,
          ).toBe(1);
        }
      },
    );

    it(
      "moves past a Condition without a Reckoning effect",
      () => {
        const game =
          prepareGame();

        game.conditions[
          "condition-1"
        ] = {
          id: "condition-1",
          definitionId:
            "condition-blessed",
          instanceNumber: 1,
          frontImage:
            "/cards/conditions/blessed/1/blessed.png",
          backImage:
            "/cards/conditions/blessed/1/blessed-back-1.png",
          backId:
            "blessed-back-1",
          flipped: false,
        };

        game.investigators[
          "investigator-1"
        ].conditionIds = [
          "condition-1",
        ];

        game.pendingDecision =
          createDecision({
            conditionIds: [
              [
                "condition-1",
              ],
            ],
          });

        const result =
          resolveConditionReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe(
          "mythos-condition-reckoning",
        );

        if (
          result.pendingDecision?.type ===
          "mythos-condition-reckoning"
        ) {
          expect(
            result.pendingDecision
              .currentConditionIndex,
          ).toBe(1);
        }
      },
    );

    it(
      "resolves a Condition Reckoning effect",
      () => {
        const game =
          prepareGame();

        game.conditions[
          "condition-1"
        ] = {
          id: "condition-1",
          definitionId:
            "condition-dark-pact",
          instanceNumber: 1,
          frontImage:
            "/cards/conditions/dark-pact/1/dark-Pact.png",
          backImage:
            "/cards/conditions/dark-pact/1/dark-Pact-back-1.png",
          backId:
            "dark-pact-back-1",
          flipped: false,
        };

        game.investigators[
          "investigator-1"
        ].conditionIds = [
          "condition-1",
        ];

        game.pendingDecision =
          createDecision({
            conditionIds: [
              [
                "condition-1",
              ],
            ],
          });

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(0);

        try {
          const result =
            resolveConditionReckoning(
              game,
              createTestMap(),
            );

          expect(
            result.pendingDecision?.type,
          ).toBe(
            "mythos-condition-reckoning",
          );

          if (
            result.pendingDecision?.type ===
            "mythos-condition-reckoning"
          ) {
            expect(
              result.pendingDecision
                .currentConditionIndex,
            ).toBe(1);
          }

          expect(
            result.conditions[
              "condition-1"
            ].flipped,
          ).toBe(true);
        } finally {
          vi.restoreAllMocks();
        }
      },
    );
  },
);