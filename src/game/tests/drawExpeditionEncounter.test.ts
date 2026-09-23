import {
  describe,
  expect,
  it,
  vi,
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
      expedition: [],
    } as never;

    expect(() =>
      drawExpeditionEncounter(
        game,
        "Antarctica",
      ),
    ).toThrow(
      "Expedition Encounter deck is empty.",
    );
  });

  it("throws when no Encounter belongs to the requested Expedition", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      expedition: [
        "encounter-1",
        "encounter-2",
      ],
    } as never;

    game.encounters = {
      "encounter-1": {
        id: "encounter-1",
        name: "The Amazon",
        region: "research",
      },

      "encounter-2": {
        id: "encounter-2",
        name: "The Antarctic Expedition",
        region: "research",
      },
    };

    expect(() =>
      drawExpeditionEncounter(
        game,
        "The Himalayas",
      ),
    ).toThrow(
      'No Expedition Encounters exist for "The Himalayas".',
    );
  });

  it("draws a matching Expedition Encounter and removes it from the deck", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      expedition: [
        "encounter-other",
        "encounter-antarctica",
        "encounter-last",
      ],
    } as never;

    game.encounters = {
      "encounter-other": {
        id: "encounter-other",
        name: "The Amazon",
        region: "research",
      },

      "encounter-antarctica": {
        id: "encounter-antarctica",
        name: "Antarctica",
        region: "research",
      },

      "encounter-last": {
        id: "encounter-last",
        name: "The Amazon",
        region: "research",
      },
    };

    vi.spyOn(
      Math,
      "random",
    ).mockReturnValue(0);

    const result =
      drawExpeditionEncounter(
        game,
        "Antarctica",
      );

    expect(
      result.encounter,
    ).toEqual(
      game.encounters[
        "encounter-antarctica"
      ],
    );

    expect(
      result.game.board.encounterDecks
        .expedition,
    ).toEqual([
      "encounter-other",
      "encounter-last",
    ]);

    expect(
      result.game.currentEncounterId,
    ).toBe(
      "encounter-antarctica",
    );

    expect(
      result.game.currentEncounterBackId,
    ).toBeNull();

    expect(
      result.game.currentEncounterRevealed,
    ).toBe(false);

    expect(
      result.game.currentEncounterDeckType,
    ).toBe("expedition");

    vi.restoreAllMocks();
  });

  it("can select a later matching Encounter using the random index", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      expedition: [
        "encounter-1",
        "encounter-2",
        "encounter-3",
      ],
    } as never;

    game.encounters = {
      "encounter-1": {
        id: "encounter-1",
        name: "Antarctica",
        region: "research",
      },

      "encounter-2": {
        id: "encounter-2",
        name: "The Amazon",
        region: "research",
      },

      "encounter-3": {
        id: "encounter-3",
        name: "Antarctica",
        region: "research",
      },
    };

    vi.spyOn(
      Math,
      "random",
    ).mockReturnValue(0.99);

    const result =
      drawExpeditionEncounter(
        game,
        "Antarctica",
      );

    expect(
      result.encounter.id,
    ).toBe("encounter-3");

    expect(
      result.game.board.encounterDecks
        .expedition,
    ).toEqual([
      "encounter-1",
      "encounter-2",
    ]);

    vi.restoreAllMocks();
  });

  it("sets currentEncounterIsResearch to false for a non-research Expedition Encounter", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      expedition: [
        "encounter-1",
      ],
    } as never;

    game.encounters = {
      "encounter-1": {
        id: "encounter-1",
        name: "Antarctica",
        region: "america",
      },
    };

    vi.spyOn(
      Math,
      "random",
    ).mockReturnValue(0);

    const result =
      drawExpeditionEncounter(
        game,
        "Antarctica",
      );

    expect(
      result.game.currentEncounterIsResearch,
    ).toBe(false);

    vi.restoreAllMocks();
  });

  it("sets currentEncounterIsResearch to true for a research Expedition Encounter", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      expedition: [
        "encounter-1",
      ],
    } as never;

    game.encounters = {
      "encounter-1": {
        id: "encounter-1",
        name: "Antarctica",
        region: "research",
      },
    };

    vi.spyOn(
      Math,
      "random",
    ).mockReturnValue(0);

    const result =
      drawExpeditionEncounter(
        game,
        "Antarctica",
      );

    expect(
      result.game.currentEncounterIsResearch,
    ).toBe(true);

    vi.restoreAllMocks();
  });

  it("throws when Math.random produces an invalid matching index", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      expedition: [
        "encounter-1",
      ],
    } as never;

    game.encounters = {
      "encounter-1": {
        id: "encounter-1",
        name: "Antarctica",
        region: "research",
      },
    };

    vi.spyOn(
      Math,
      "random",
    ).mockReturnValue(1);

    expect(() =>
      drawExpeditionEncounter(
        game,
        "Antarctica",
      ),
    ).toThrow(
      "Failed to draw Expedition Encounter.",
    );

    vi.restoreAllMocks();
  });

  it("throws when the selected Encounter disappears before it is resolved", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      expedition: [
        "encounter-1",
      ],
    } as never;

    let accessCount = 0;

    const encounter = {
      id: "encounter-1",
      name: "Antarctica",
      region: "research" as const,
    };

    Object.defineProperty(
      game.encounters,
      "encounter-1",
      {
        configurable: true,

        get() {
          accessCount += 1;

          return accessCount === 1
            ? encounter
            : undefined;
        },
      },
    );

    vi.spyOn(
      Math,
      "random",
    ).mockReturnValue(0);

    expect(() =>
      drawExpeditionEncounter(
        game,
        "Antarctica",
      ),
    ).toThrow(
      'Encounter "encounter-1" does not exist.',
    );

    vi.restoreAllMocks();
  });

  it("throws when the selected Encounter is no longer present in the deck", () => {
    const game =
      createTestGame();

    const deck = [
      "encounter-1",
    ] as string[] & {
      indexOf: (
        searchElement: string,
        fromIndex?: number,
      ) => number;
    };

    deck.indexOf = () => -1;

    game.board.encounterDecks = {
      expedition: deck,
    } as never;

    game.encounters = {
      "encounter-1": {
        id: "encounter-1",
        name: "Antarctica",
        region: "research",
      },
    };

    vi.spyOn(
      Math,
      "random",
    ).mockReturnValue(0);

    expect(() =>
      drawExpeditionEncounter(
        game,
        "Antarctica",
      ),
    ).toThrow(
      'Expedition Encounter "encounter-1" was not found in the deck.',
    );

    vi.restoreAllMocks();
  });

  it("preserves the other board state when drawing an Expedition Encounter", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      expedition: [
        "encounter-1",
        "encounter-2",
      ],

      america: [
        "america-1",
      ],
    } as never;

    game.encounters = {
      "encounter-1": {
        id: "encounter-1",
        name: "Antarctica",
        region: "research",
      },

      "encounter-2": {
        id: "encounter-2",
        name: "The Amazon",
        region: "research",
      },
    };

    const originalBoard =
      game.board;

    vi.spyOn(
      Math,
      "random",
    ).mockReturnValue(0);

    const result =
      drawExpeditionEncounter(
        game,
        "Antarctica",
      );

    expect(
      result.game.board.spaces,
    ).toBe(
      originalBoard.spaces,
    );

    expect(
      result.game.board.encounterDecks
        .america,
    ).toEqual([
      "america-1",
    ]);

    vi.restoreAllMocks();
  });
});