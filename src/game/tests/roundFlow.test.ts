import {
  describe,
  expect,
  it,
} from "vitest";

import { startNextRoundAfterMythos } from "../engine/startNextRoundAfterMythos";

import {
  createTestGame,
} from "./helpers/createTestGame";

describe(
  "Round Flow",
  () => {
    it(
      "starts a new round with the selected Lead Investigator",
      () => {
        const game =
          createTestGame();

        const result =
          startNextRoundAfterMythos(
            game,
            "investigator-2",
          );

        expect(
          result.round,
        ).toBe(2);

        expect(
          result.phase,
        ).toBe("action");

        expect(
          result.leadInvestigatorId,
        ).toBe(
          "investigator-2",
        );

        expect(
          result.activeInvestigatorId,
        ).toBe(
          "investigator-2",
        );

        expect(
          result.investigatorTurnIndex,
        ).toBe(0);

        expect(
          result.investigatorOrder,
        ).toEqual([
          "investigator-2",
          "investigator-3",
          "investigator-1",
        ]);

        expect(
          result.currentMythosId,
        ).toBeNull();

        expect(
          result.pendingDecision,
        ).toBeNull();

        expect(
          result.investigators[
            "investigator-2"
          ].actionsPerformed,
        ).toEqual([]);
      },
    );

    it(
      "rotates correctly when the second investigator becomes Lead",
      () => {
        const game =
          createTestGame();

        const result =
          startNextRoundAfterMythos(
            game,
            "investigator-3",
          );

        expect(
          result.round,
        ).toBe(2);

        expect(
          result.phase,
        ).toBe("action");

        expect(
          result.leadInvestigatorId,
        ).toBe(
          "investigator-3",
        );

        expect(
          result.activeInvestigatorId,
        ).toBe(
          "investigator-3",
        );

        expect(
          result.investigatorTurnIndex,
        ).toBe(0);

        expect(
          result.investigatorOrder,
        ).toEqual([
          "investigator-3",
          "investigator-1",
          "investigator-2",
        ]);
      },
    );
  },
);