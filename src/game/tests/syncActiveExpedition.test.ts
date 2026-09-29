import {
  describe,
  expect,
  it,
} from "vitest";

import {
  syncActiveExpedition,
} from "../engine/syncActiveExpedition";

import {
  createTestGame,
} from "./helpers/createTestGame";

import type {
  MapDefinition,
} from "../models/MapDefinition";

describe("syncActiveExpedition", () => {
  const map: MapDefinition = {
    id: "test-map",
    name: "Test Map",

    startingSpaceId:
      "antarctica",

    spaces: [
      {
        id: "antarctica",
        name: "Antarctica",
        type: "wilderness",
        isExpedition: true,
        connectedSpaceIds: [],
        paths: [],
      },
      {
        id: "amazon",
        name: "The Amazon",
        type: "wilderness",
        isExpedition: true,
        connectedSpaceIds: [],
        paths: [],
      },
      {
        id: "himalayas",
        name: "The Himalayas",
        type: "wilderness",
        isExpedition: true,
        connectedSpaceIds: [],
        paths: [],
      },
    ],
  };

  it("sets the Active Expedition from the top Expedition Encounter", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      ...game.board.encounterDecks,

      expedition: [
        "expedition-antarctica",
        "expedition-amazon",
      ],
    };

    game.encounters = {
      ...game.encounters,

      "expedition-antarctica": {
        id: "expedition-antarctica",
        name: "Antarctica",
        region: "research",
      },

      "expedition-amazon": {
        id: "expedition-amazon",
        name: "The Amazon",
        region: "research",
      },
    };

    game.board.activeExpeditionSpaceId =
      "amazon";

    const result =
      syncActiveExpedition(
        game,
        map,
      );

    expect(
      result.board
        .activeExpeditionSpaceId,
    ).toBe("antarctica");
  });

  it("moves the Active Expedition when the top card changes", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      ...game.board.encounterDecks,

      expedition: [
        "expedition-amazon",
        "expedition-himalayas",
      ],
    };

    game.encounters = {
      ...game.encounters,

      "expedition-amazon": {
        id: "expedition-amazon",
        name: "The Amazon",
        region: "research",
      },

      "expedition-himalayas": {
        id: "expedition-himalayas",
        name: "The Himalayas",
        region: "research",
      },
    };

    game.board.activeExpeditionSpaceId =
      "antarctica";

    const result =
      syncActiveExpedition(
        game,
        map,
      );

    expect(
      result.board
        .activeExpeditionSpaceId,
    ).toBe("amazon");
  });

  it("sets the Active Expedition to null when the deck is empty", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      ...game.board.encounterDecks,
      expedition: [],
    };

    game.board.activeExpeditionSpaceId =
      "antarctica";

    const result =
      syncActiveExpedition(
        game,
        map,
      );

    expect(
      result.board
        .activeExpeditionSpaceId,
    ).toBeNull();
  });

  it("throws when the top Expedition Encounter does not exist", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      ...game.board.encounterDecks,

      expedition: [
        "missing-expedition",
      ],
    };

    expect(() =>
      syncActiveExpedition(
        game,
        map,
      ),
    ).toThrow(
      'Expedition Encounter "missing-expedition" does not exist.',
    );
  });

  it("throws when no Expedition space matches the top card", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      ...game.board.encounterDecks,

      expedition: [
        "unknown-expedition",
      ],
    };

    game.encounters = {
      ...game.encounters,

      "unknown-expedition": {
        id: "unknown-expedition",
        name: "Unknown Expedition",
        region: "research",
      },
    };

    expect(() =>
      syncActiveExpedition(
        game,
        map,
      ),
    ).toThrow(
      'No Expedition space matches "Unknown Expedition".',
    );
  });

  it("returns the same GameState when the Active Expedition is already correct", () => {
    const game =
      createTestGame();

    game.board.encounterDecks = {
      ...game.board.encounterDecks,

      expedition: [
        "expedition-antarctica",
      ],
    };

    game.encounters = {
      ...game.encounters,

      "expedition-antarctica": {
        id: "expedition-antarctica",
        name: "Antarctica",
        region: "research",
      },
    };

    game.board.activeExpeditionSpaceId =
      "antarctica";

    const result =
      syncActiveExpedition(
        game,
        map,
      );

    expect(result).toBe(game);
  });
});