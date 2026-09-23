import {
  describe,
  expect,
  it,
} from "vitest";

import { setLeadInvestigator } from "../engine/setLeadInvestigator";
import { createTestGame } from "./helpers/createTestGame";

describe("setLeadInvestigator", () => {
  it("sets the first investigator as Lead", () => {
    const game = createTestGame();

    const result =
      setLeadInvestigator(
        game,
        "investigator-1",
      );

    expect(
      result.leadInvestigatorId,
    ).toBe("investigator-1");

    expect(
      result.activeInvestigatorId,
    ).toBe("investigator-1");

    expect(
      result.investigatorTurnIndex,
    ).toBe(0);

    expect(
      result.investigatorOrder,
    ).toEqual([
      "investigator-1",
      "investigator-2",
      "investigator-3",
    ]);

    expect(
      result.pendingDecision,
    ).toBeNull();
  });

  it("rotates the investigator order when the second investigator becomes Lead", () => {
    const game = createTestGame();

    const result =
      setLeadInvestigator(
        game,
        "investigator-2",
      );

    expect(
      result.leadInvestigatorId,
    ).toBe("investigator-2");

    expect(
      result.activeInvestigatorId,
    ).toBe("investigator-2");

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
      result.pendingDecision,
    ).toBeNull();
  });

  it("rotates the investigator order when the last investigator becomes Lead", () => {
    const game = createTestGame();

    const result =
      setLeadInvestigator(
        game,
        "investigator-3",
      );

    expect(
      result.leadInvestigatorId,
    ).toBe("investigator-3");

    expect(
      result.activeInvestigatorId,
    ).toBe("investigator-3");

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

    expect(
      result.pendingDecision,
    ).toBeNull();
  });

  it("throws when the investigator is not in the game", () => {
    const game = createTestGame();

    expect(() =>
      setLeadInvestigator(
        game,
        "investigator-does-not-exist",
      ),
    ).toThrow(
      'Investigator "investigator-does-not-exist" is not in the game.',
    );
  });

  it("does not mutate the original game", () => {
    const game = createTestGame();

    const originalOrder = [
      ...game.investigatorOrder,
    ];

    const result =
      setLeadInvestigator(
        game,
        "investigator-2",
      );

    expect(
      game.investigatorOrder,
    ).toEqual(originalOrder);

    expect(
      game.leadInvestigatorId,
    ).toBe("investigator-1");

    expect(result).not.toBe(game);
  });
});