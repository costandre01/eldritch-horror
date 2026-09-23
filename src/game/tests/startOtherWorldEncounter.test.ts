import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { GameState } from "../models/GameState";

import {
  createTestGame,
} from "./helpers/createTestGame";

import {
  startOtherWorldEncounter,
} from "../engine/startOtherWorldEncounter";

import {
  drawEncounter,
} from "../engine/drawEncounter";

import {
  resolveCurrentEncounter,
} from "../engine/resolveCurrentEncounter";

vi.mock(
  "../engine/drawEncounter",
  () => ({
    drawEncounter: vi.fn(),
  }),
);

vi.mock(
  "../engine/resolveCurrentEncounter",
  () => ({
    resolveCurrentEncounter: vi.fn(),
  }),
);

describe("startOtherWorldEncounter", () => {
  it("throws when there is no active investigator", () => {
    const game =
      createTestGame();

    game.activeInvestigatorId =
      null;

    expect(() =>
      startOtherWorldEncounter(
        game,
        {} as never,
      ),
    ).toThrow(
      "There is no active investigator.",
    );

    expect(
      drawEncounter,
    ).not.toHaveBeenCalled();

    expect(
      resolveCurrentEncounter,
    ).not.toHaveBeenCalled();
  });

  it("throws when the active investigator does not exist", () => {
    const game =
      createTestGame();

    game.activeInvestigatorId =
      "investigator-missing";

    expect(() =>
      startOtherWorldEncounter(
        game,
        {} as never,
      ),
    ).toThrow(
      'Investigator "investigator-missing" does not exist.',
    );

    expect(
      drawEncounter,
    ).not.toHaveBeenCalled();

    expect(
      resolveCurrentEncounter,
    ).not.toHaveBeenCalled();
  });

  it("draws an Other World Encounter for the active investigator", () => {
    const game =
      createTestGame();

    const encounter = {
      id: "other-world-1",
      name: "Other World Encounter",
      region: "other-world",
    } as never;

    vi.mocked(
      drawEncounter,
    ).mockReturnValueOnce({
      game,
      encounter,
    });

    vi.mocked(
      resolveCurrentEncounter,
    ).mockReturnValueOnce(game);

    startOtherWorldEncounter(
      game,
      {} as never,
    );

    expect(
      drawEncounter,
    ).toHaveBeenCalledTimes(1);

    expect(
      drawEncounter,
    ).toHaveBeenCalledWith(
      game,
      "other-world",
    );
  });

  it("reveals the drawn Encounter immediately", () => {
    const game =
      createTestGame();

    const drawnGame = {
      ...game,

      currentEncounterId:
        "other-world-1",

      currentEncounterRevealed:
        false,

      currentEncounterFromFracturedReality:
        false,

      pendingDecision: {
        type: "test",
      } as never,
    };

    const encounter = {
      id: "other-world-1",
      name: "Other World Encounter",
      region: "other-world",
    } as never;

    vi.mocked(
      drawEncounter,
    ).mockReturnValueOnce({
      game: drawnGame,
      encounter,
    });

    vi.mocked(
      resolveCurrentEncounter,
    ).mockReturnValueOnce(
      drawnGame,
    );

    startOtherWorldEncounter(
      game,
      {} as never,
    );

    const resolvedGame =
      vi.mocked(
        resolveCurrentEncounter,
      ).mock.calls[0][0];

    expect(
      resolvedGame.currentEncounterRevealed,
    ).toBe(true);

    expect(
      resolvedGame.pendingDecision,
    ).toBeNull();

    expect(
      resolvedGame.currentEncounterFromFracturedReality,
    ).toBe(false);
  });

  it("sets currentEncounterFromFracturedReality when requested", () => {
    const game =
      createTestGame();

    const drawnGame = {
      ...game,

      currentEncounterRevealed:
        false,

      currentEncounterFromFracturedReality:
        false,

      pendingDecision: {
        type: "test",
      } as never,
    };

    vi.mocked(
      drawEncounter,
    ).mockReturnValueOnce({
      game: drawnGame,
      encounter: {} as never,
    });

    vi.mocked(
      resolveCurrentEncounter,
    ).mockReturnValueOnce(
      drawnGame,
    );

    startOtherWorldEncounter(
      game,
      {} as never,
      true,
    );

    const resolvedGame =
      vi.mocked(
        resolveCurrentEncounter,
      ).mock.calls[0][0];

    expect(
      resolvedGame.currentEncounterRevealed,
    ).toBe(true);

    expect(
      resolvedGame.currentEncounterFromFracturedReality,
    ).toBe(true);

    expect(
      resolvedGame.pendingDecision,
    ).toBeNull();
  });

  it("keeps currentEncounterFromFracturedReality false by default", () => {
    const game =
      createTestGame();

    const drawnGame = {
      ...game,

      currentEncounterFromFracturedReality:
        true,
    };

    vi.mocked(
      drawEncounter,
    ).mockReturnValueOnce({
      game: drawnGame,
      encounter: {} as never,
    });

    vi.mocked(
      resolveCurrentEncounter,
    ).mockReturnValueOnce(
      drawnGame,
    );

    startOtherWorldEncounter(
      game,
      {} as never,
    );

    const resolvedGame =
      vi.mocked(
        resolveCurrentEncounter,
      ).mock.calls[0][0];

    expect(
      resolvedGame.currentEncounterFromFracturedReality,
    ).toBe(false);
  });

  it("passes the revealed game and map to resolveCurrentEncounter", () => {
    const game =
      createTestGame();

    const drawnGame = {
      ...game,

      currentEncounterRevealed:
        false,

      pendingDecision: {
        type: "test",
      } as never,
    };

    const map = {
      id: "test-map",
    } as never;

    vi.mocked(
      drawEncounter,
    ).mockReturnValueOnce({
      game: drawnGame,
      encounter: {} as never,
    });

    const resolvedResult =
      {
        ...drawnGame,
        currentEncounterRevealed:
          true,
      };

    vi.mocked(
      resolveCurrentEncounter,
    ).mockReturnValueOnce(
      resolvedResult,
    );

    const result =
      startOtherWorldEncounter(
        game,
        map,
      );

    expect(
      resolveCurrentEncounter,
    ).toHaveBeenCalledTimes(1);

    expect(
      resolveCurrentEncounter,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        currentEncounterRevealed:
          true,

        currentEncounterFromFracturedReality:
          false,

        pendingDecision:
          null,
      }),
      map,
    );

    expect(
      result,
    ).toBe(
      resolvedResult,
    );
  });

  it("returns exactly the result from resolveCurrentEncounter", () => {
    const game =
      createTestGame();

    const drawnGame =
      {
        ...game,
      };

    const resolvedResult =
      {
        ...game,

        phase: "encounter",
      } as GameState;

    vi.mocked(
      drawEncounter,
    ).mockReturnValueOnce({
      game: drawnGame,
      encounter: {} as never,
    });

    vi.mocked(
      resolveCurrentEncounter,
    ).mockReturnValueOnce(
      resolvedResult,
    );

    const result =
      startOtherWorldEncounter(
        game,
        {} as never,
      );

    expect(
      result,
    ).toBe(
      resolvedResult,
    );
  });
});