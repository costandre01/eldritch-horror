import {
  describe,
  expect,
  it,
} from "vitest";

import {
  startInvestigatorActions,
} from "../engine/startInvestigatorActions";

import {
  createTestGame,
} from "./helpers/createTestGame";

describe(
  "startInvestigatorActions",
  () => {
    it(
      "throws when there is no active investigator",
      () => {
        const game =
          createTestGame();

        game.phase = "action";
        game.activeInvestigatorId = null;

        expect(() =>
          startInvestigatorActions(game),
        ).toThrow(
          "There is no active investigator.",
        );
      },
    );

    it(
      "throws when the game is not in the Action phase",
      () => {
        const game =
          createTestGame();

        game.activeInvestigatorId =
          "investigator-1";

        game.phase = "encounter";

        expect(() =>
          startInvestigatorActions(game),
        ).toThrow(
          "Investigator actions can only start during the Action phase.",
        );
      },
    );

    it(
      "throws when the active investigator does not exist",
      () => {
        const game =
          createTestGame();

        game.phase = "action";

        game.activeInvestigatorId =
          "missing-investigator";

        expect(() =>
          startInvestigatorActions(game),
        ).toThrow(
          'Investigator "missing-investigator" does not exist.',
        );
      },
    );

    it(
      "throws when the investigator definition does not exist",
      () => {
        const game =
          createTestGame();

        game.phase = "action";

        game.activeInvestigatorId =
          "investigator-1";

        game.investigators[
          "investigator-1"
        ].definitionId =
          "missing-definition";

        expect(() =>
          startInvestigatorActions(game),
        ).toThrow(
          'Investigator definition "missing-definition" does not exist.',
        );
      },
    );

    it(
      "throws when Travel is active",
      () => {
        const game =
          createTestGame();

        game.phase = "action";

        game.activeInvestigatorId =
          "investigator-1";

        game.investigators[
          "investigator-1"
        ].travelActive = true;

        expect(() =>
          startInvestigatorActions(game),
        ).toThrow(
          "Cannot start investigator actions while Travel is active.",
        );
      },
    );

    it(
      "starts a fresh Action turn",
      () => {
        const game =
          createTestGame();

        game.phase = "action";

        game.activeInvestigatorId =
          "investigator-1";

        game.investigators[
          "investigator-1"
        ].actionsPerformed = [
          "travel",
        ];

        game.pendingDecision =
          {
            type: "test",
          } as typeof game.pendingDecision;

        const result =
          startInvestigatorActions(
            game,
          );

        expect(
          result.investigators[
            "investigator-1"
          ].actionsPerformed,
        ).toEqual([]);

        expect(
          result.pendingDecision,
        ).toBeNull();
      },
    );

    it(
      "preserves the investigator identity when starting actions",
      () => {
        const game =
          createTestGame();

        game.phase = "action";

        game.activeInvestigatorId =
          "investigator-1";

        const investigatorBefore =
          game.investigators[
            "investigator-1"
          ];

        const result =
          startInvestigatorActions(
            game,
          );

        const investigatorAfter =
          result.investigators[
            "investigator-1"
          ];

        expect(
          investigatorAfter.id,
        ).toBe(
          investigatorBefore.id,
        );

        expect(
          investigatorAfter.definitionId,
        ).toBe(
          investigatorBefore.definitionId,
        );

        expect(
          investigatorAfter.spaceId,
        ).toBe(
          investigatorBefore.spaceId,
        );

        expect(
          investigatorAfter.health,
        ).toBe(
          investigatorBefore.health,
        );

        expect(
          investigatorAfter.sanity,
        ).toBe(
          investigatorBefore.sanity,
        );
      },
    );

    it(
      "does not modify the original investigator object",
      () => {
        const game =
          createTestGame();

        game.phase = "action";

        game.activeInvestigatorId =
          "investigator-1";

        game.investigators[
          "investigator-1"
        ].actionsPerformed = [
          "travel",
        ];

        const originalInvestigator =
          game.investigators[
            "investigator-1"
          ];

        const result =
          startInvestigatorActions(
            game,
          );

        expect(
          result.investigators[
            "investigator-1"
          ],
        ).not.toBe(
          originalInvestigator,
        );

        expect(
          originalInvestigator.actionsPerformed,
        ).toEqual([
          "travel",
        ]);

        expect(
          result.investigators[
            "investigator-1"
          ].actionsPerformed,
        ).toEqual([]);
      },
    );
  },
);