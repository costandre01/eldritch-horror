import {
  describe,
  expect,
  it,
} from "vitest";

import {
  drawExpeditionEncounter,
} from "../engine/drawExpeditionEncounter";

import {
  createTestGame,
} from "./helpers/createTestGame";

describe("drawExpeditionEncounter", () => {
  it("throws when the Expedition Encounter deck is empty", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      ...game.board.encounterDecks,
      expedition: [],
    };

    expect(() =>
      drawExpeditionEncounter(
        game,
      ),
    ).toThrow(
      "Expedition Encounter deck is empty.",
    );
  });

  it("draws the top Expedition Encounter", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      ...game.board.encounterDecks,

      expedition: [
        "encounter-top",
        "encounter-second",
        "encounter-third",
      ],
    };

    game.encounters = {
      ...game.encounters,

      "encounter-top": {
        id: "encounter-top",
        name: "Antarctica",
        region: "research",
      },

      "encounter-second": {
        id: "encounter-second",
        name: "The Amazon",
        region: "research",
      },

      "encounter-third": {
        id: "encounter-third",
        name: "The Himalayas",
        region: "research",
      },
    };

    const result =
      drawExpeditionEncounter(
        game,
      );

    expect(
      result.encounter,
    ).toEqual(
      game.encounters[
        "encounter-top"
      ],
    );
  });

  it("removes only the top Expedition Encounter from the deck", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      ...game.board.encounterDecks,

      expedition: [
        "encounter-top",
        "encounter-second",
        "encounter-third",
      ],
    };

    game.encounters = {
      ...game.encounters,

      "encounter-top": {
        id: "encounter-top",
        name: "Antarctica",
        region: "research",
      },

      "encounter-second": {
        id: "encounter-second",
        name: "The Amazon",
        region: "research",
      },

      "encounter-third": {
        id: "encounter-third",
        name: "The Himalayas",
        region: "research",
      },
    };

    const result =
      drawExpeditionEncounter(
        game,
      );

    expect(
      result.game.board
        .encounterDecks.expedition,
    ).toEqual([
      "encounter-second",
      "encounter-third",
    ]);
  });

  it("sets the drawn card as the current Encounter", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      ...game.board.encounterDecks,

      expedition: [
        "encounter-top",
      ],
    };

    game.encounters = {
      ...game.encounters,

      "encounter-top": {
        id: "encounter-top",
        name: "Antarctica",
        region: "research",
      },
    };

    const result =
      drawExpeditionEncounter(
        game,
      );

    expect(
      result.game.currentEncounterId,
    ).toBe(
      "encounter-top",
    );

    expect(
      result.game.currentEncounterBackId,
    ).toBeNull();

    expect(
      result.game.currentEncounterRevealed,
    ).toBe(false);

    expect(
      result.game.currentEncounterIsResearch,
    ).toBe(false);

    expect(
      result.game.currentEncounterDeckType,
    ).toBe("expedition");
  });

  it("throws when the top Expedition Encounter does not exist", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      ...game.board.encounterDecks,

      expedition: [
        "missing-encounter",
      ],
    };

    expect(() =>
      drawExpeditionEncounter(
        game,
      ),
    ).toThrow(
      'Encounter "missing-encounter" does not exist.',
    );
  });

  it("preserves the other board state when drawing an Expedition Encounter", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      ...game.board.encounterDecks,

      expedition: [
        "encounter-top",
        "encounter-second",
      ],

      america: [
        "america-1",
      ],
    };

    game.encounters = {
      ...game.encounters,

      "encounter-top": {
        id: "encounter-top",
        name: "Antarctica",
        region: "research",
      },

      "encounter-second": {
        id: "encounter-second",
        name: "The Amazon",
        region: "research",
      },
    };

    const originalBoard =
      game.board;

    const result =
      drawExpeditionEncounter(
        game,
      );

    expect(
      result.game.board.spaces,
    ).toBe(
      originalBoard.spaces,
    );

    expect(
      result.game.board
        .encounterDecks.america,
    ).toEqual([
      "america-1",
    ]);
  });
});