import {
  describe,
  expect,
  it,
} from "vitest";

import {
  resolveByakheeDefeat,
} from "../engine/resolveByakheeDefeat";

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
        connectedSpaceIds: [
          "square",
        ],
        paths: [
          {
            toSpaceId: "square",
            type: "train",
          },
        ],
      },

      {
        id: "square",
        name: "Square",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [
          "arkham",
          "hospital",
        ],
        paths: [
          {
            toSpaceId: "arkham",
            type: "train",
          },
          {
            toSpaceId: "hospital",
            type: "uncharted",
          },
        ],
      },

      {
        id: "hospital",
        name: "Hospital",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [
          "square",
          "university",
        ],
        paths: [
          {
            toSpaceId: "square",
            type: "uncharted",
          },
          {
            toSpaceId: "university",
            type: "uncharted",
          },
        ],
      },

      {
        id: "university",
        name: "University",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [
          "hospital",
        ],
        paths: [
          {
            toSpaceId: "hospital",
            type: "uncharted",
          },
        ],
      },
    ],
  };
}

function prepareGame(): GameState {
  const game =
    createTestGame();

  game.phase =
    "encounter";

  game.activeInvestigatorId =
    "investigator-1";

  game.investigators[
    "investigator-1"
  ].spaceId =
    "arkham";

  game.investigators[
    "investigator-1"
  ].sanity = 4;

  game.pendingDecision = null;

  game.pendingEncounterChoice = null;

  game.board.spaces = {
    arkham: {
      spaceId: "arkham",
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    },

    square: {
      spaceId: "square",
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    },

    hospital: {
      spaceId: "hospital",
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    },

    university: {
      spaceId: "university",
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    },
  };

  game.board.encounterDecks = {
    america: [],
    europe: [],
    "asia-australia": [],
    general: [],
    research: [],
    "other-world": [],
    special: [],
    expedition: [],
  };

  game.board.encounterDiscards = {
    america: [],
    europe: [],
    "asia-australia": [],
    general: [],
    research: [],
    "other-world": [],
    special: [],
    expedition: [],
  };

  game.board.mythosDeck = [];

  game.board.mythosInPlay = [];

  return game;
}

function addGeneralEncounter(
  game: GameState,
): void {
  game.board.encounterDecks.general = [
    "encounter-1",
  ];

  game.encounters[
    "encounter-1"
  ] = {
    id: "encounter-1",
    name: "Test Encounter",
    region: "america",
    frontImage:
      "/cards/general.jpg",
    backImage:
      "/cards/general-back.jpg",
  } as GameState["encounters"][string];
}

describe(
  "resolveByakheeDefeat",
  () => {
    it(
      "throws when there is no active investigator",
      () => {
        const game =
          prepareGame();

        game.activeInvestigatorId =
          null;

        expect(() =>
          resolveByakheeDefeat(
            game,
            createTestMap(),
            "move",
          ),
        ).toThrow(
          "There is no active investigator.",
        );
      },
    );

    it(
      "throws when the active investigator does not exist",
      () => {
        const game =
          prepareGame();

        game.activeInvestigatorId =
          "missing-investigator";

        expect(() =>
          resolveByakheeDefeat(
            game,
            createTestMap(),
            "move",
          ),
        ).toThrow(
          'Investigator "missing-investigator" does not exist.',
        );
      },
    );

    it(
      "throws when the investigator has no current space",
      () => {
        const game =
          prepareGame();

        game.investigators[
          "investigator-1"
        ].spaceId = null;

        expect(() =>
          resolveByakheeDefeat(
            game,
            createTestMap(),
            "move",
          ),
        ).toThrow(
          "Investigator has no current space.",
        );
      },
    );

    it(
      "returns the same game for an unknown choice",
      () => {
        const game =
          prepareGame();

        const result =
          resolveByakheeDefeat(
            game,
            createTestMap(),
            "unknown-choice",
          );

        expect(result).toBe(game);
      },
    );

    it(
      "loses 1 Sanity when choosing to move",
      () => {
        const game =
          prepareGame();

        const result =
          resolveByakheeDefeat(
            game,
            createTestMap(),
            "move",
          );

        expect(
          result.investigators[
            "investigator-1"
          ].sanity,
        ).toBe(3);
      },
    );

    it(
      "does not reduce Sanity below zero",
      () => {
        const game =
          prepareGame();

        game.investigators[
          "investigator-1"
        ].sanity = 0;

        const result =
          resolveByakheeDefeat(
            game,
            createTestMap(),
            "move",
          );

        expect(
          result.investigators[
            "investigator-1"
          ].sanity,
        ).toBe(0);
      },
    );

    it(
      "creates a space selection for a Byakhee move",
      () => {
        const game =
          prepareGame();

        const result =
          resolveByakheeDefeat(
            game,
            createTestMap(),
            "move",
          );

        expect(
          result.pendingDecision,
        ).not.toBeNull();

        if (
          result.pendingDecision?.type ===
          "select-space"
        ) {
          expect(
            result.pendingDecision.title,
          ).toBe(
            "BYAKHEE — MOVE",
          );

          expect(
            result.pendingDecision.message,
          ).toBe(
            "Choose your final destination.",
          );

          expect(
            result.pendingDecision.source,
          ).toBe(
            "byakhee-move",
          );

          expect(
            result.pendingDecision.onSpaceSelected,
          ).toEqual([]);

          expect(
            result.pendingDecision.spaceIds,
          ).toEqual([
            "square",
            "hospital",
            "university",
          ]);
        }
      },
    );

    it(
      "clears the Byakhee defeat decision and opens Encounter deck selection",
      () => {
        const game =
          prepareGame();

        addGeneralEncounter(game);

        game.pendingDecision = {
          type: "choice",
          title: "BYAKHEE",
          message: "Choose.",
          source:
            "byakhee-defeat:monster-1",
          options: [
            {
              id: "move",
              title: "Move",
            },
            {
              id: "encounter",
              title: "Encounter",
            },
          ],
        };

        const result =
          resolveByakheeDefeat(
            game,
            createTestMap(),
            "encounter",
          );

        expect(
          result.pendingDecision,
        ).not.toBeNull();

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options.map(
              (option) =>
                option.id,
            ),
          ).toEqual([
            "general",
          ]);
        }
      },
    );
  },
);