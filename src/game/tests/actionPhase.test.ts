import {
  describe,
  expect,
  it,
} from "vitest";

import { endInvestigatorActions } from "../engine/endInvestigatorActions";

import {
  createTestGame,
} from "./helpers/createTestGame";

describe(
  "Action Phase",
  () => {
    it(
      "transitions from Action to Encounter after all investigators finish actions",
      () => {
        let game =
          createTestGame();

        game = {
          ...game,
          phase: "action",
          investigatorTurnIndex: 0,
          activeInvestigatorId:
            game.investigatorOrder[0],
          pendingDecision: null,
          pendingEncounterChoice: null,
          currentEncounterId: null,
        };

        expect(
          game.phase,
        ).toBe("action");

        expect(
          game.investigatorTurnIndex,
        ).toBe(0);

        // Investigator 1 finishes actions
        game =
          endInvestigatorActions(
            game,
          );

        expect(
          game.phase,
        ).toBe("action");

        expect(
          game.investigatorTurnIndex,
        ).toBe(1);

        expect(
          game.activeInvestigatorId,
        ).toBe(
          game.investigatorOrder[1],
        );

        // Investigator 2 finishes actions
        game =
          endInvestigatorActions(
            game,
          );

        expect(
          game.phase,
        ).toBe("action");

        expect(
          game.investigatorTurnIndex,
        ).toBe(2);

        expect(
          game.activeInvestigatorId,
        ).toBe(
          game.investigatorOrder[2],
        );

        // Investigator 3 finishes actions.
        // The Action phase should now end.
        game =
          endInvestigatorActions(
            game,
          );

        expect(
          game.phase,
        ).toBe("encounter");

        expect(
          game.investigatorTurnIndex,
        ).toBe(0);

        expect(
          game.activeInvestigatorId,
        ).toBe(
          game.investigatorOrder[0],
        );
      },
    );
  },
);