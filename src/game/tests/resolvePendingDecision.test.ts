import {
  describe,
  expect,
  it,
} from "vitest";

import {
  resolvePendingDecision,
} from "../engine/resolvePendingDecision";

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

  game.phase = "encounter";
  game.activeInvestigatorId =
    "investigator-1";

  return game;
}

describe(
  "resolvePendingDecision",
  () => {
    it(
      "throws when there is no pending decision",
      () => {
        const game =
          prepareGame();

        game.pendingDecision =
          null;

        expect(() =>
          resolvePendingDecision(
            game,
            createTestMap(),
          ),
        ).toThrow(
          "There is no pending decision to resolve.",
        );
      },
    );

    it(
      "clears a normal Continue decision when there is no current Encounter",
      () => {
        const game =
          prepareGame();

        game.pendingDecision = {
          type: "continue",
          title: "Continue",
          message:
            "Continue the Encounter.",
        };

        const result =
          resolvePendingDecision(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision,
        ).toBeNull();

        expect(
          result.currentEncounterId,
        ).toBe(
          game.currentEncounterId,
        );
      },
    );

    it(
      "discards the current Encounter on a normal Continue",
      () => {
        const game =
          prepareGame();

        game.board.encounterDecks.general = [
          "encounter-1",
        ];

        game.board.encounterDiscards.general = [];

        game.currentEncounterId =
          "encounter-1";

        game.currentEncounterBackId =
          "encounter-1-back";

        game.currentEncounterRevealed =
          true;

        game.currentEncounterDeckType =
          "general";

        game.pendingDecision = {
          type: "continue",
          title: "Continue",
          message:
            "Continue the Encounter.",
        };

        const result =
          resolvePendingDecision(
            game,
            createTestMap(),
          );

        expect(
          result.board.encounterDiscards.general,
        ).toEqual([
          "encounter-1",
        ]);

        expect(
          result.currentEncounterId,
        ).toBeNull();

        expect(
          result.currentEncounterBackId,
        ).toBeNull();

        expect(
          result.currentEncounterRevealed,
        ).toBe(false);

        expect(
          result.currentEncounterDeckType,
        ).toBeNull();

        expect(
          result.pendingDecision,
        ).toBeNull();
      },
    );

    it(
      "resolves onComplete effects from a Continue decision",
      () => {
        const game =
          prepareGame();

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.health = 2;

        game.pendingDecision = {
          type: "continue",
          title: "Continue",
          message:
            "Continue the Encounter.",
          onComplete: [
            {
              type: "gain-health",
              amount: 2,
            },
          ],
        };

        const result =
          resolvePendingDecision(
            game,
            createTestMap(),
          );

        expect(
          result.investigators[
            "investigator-1"
          ].health,
        ).toBe(4);

        expect(
          result.pendingDecision,
        ).toBeNull();
      },
    );

    it(
      "keeps the Encounter open when onComplete creates another decision",
      () => {
        const game =
          prepareGame();

        game.currentEncounterId =
          "encounter-1";

        game.currentEncounterDeckType =
          "general";

        game.board.encounterDiscards.general = [];

        game.pendingDecision = {
          type: "continue",
          title: "Continue",
          message:
            "Continue the Encounter.",
          onComplete: [
            {
              type: "choice",
              choices: [
                {
                  text: "Continue",
                  effects: [],
                },
              ],
            },
          ],
        };

        const result =
          resolvePendingDecision(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision,
        ).not.toBeNull();

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        expect(
          result.pendingEncounterChoice,
        ).not.toBeNull();

        expect(
          result.currentEncounterId,
        ).toBe("encounter-1");

        expect(
          result.currentEncounterDeckType,
        ).toBe("general");

        expect(
          result.board.encounterDiscards.general,
        ).toEqual([]);
      },
    );

    it(
      "discards the Encounter after onComplete effects finish",
      () => {
        const game =
          prepareGame();

        game.currentEncounterId =
          "encounter-1";

        game.currentEncounterBackId =
          "encounter-1-back";

        game.currentEncounterRevealed =
          true;

        game.currentEncounterDeckType =
          "general";

        game.board.encounterDiscards.general = [];

        game.pendingDecision = {
          type: "continue",
          title: "Continue",
          message:
            "Continue the Encounter.",
          onComplete: [
            {
              type: "gain-health",
              amount: 1,
            },
          ],
        };

        const result =
          resolvePendingDecision(
            game,
            createTestMap(),
          );

        expect(
          result.board.encounterDiscards.general,
        ).toEqual([
          "encounter-1",
        ]);

        expect(
          result.currentEncounterId,
        ).toBeNull();

        expect(
          result.currentEncounterBackId,
        ).toBeNull();

        expect(
          result.currentEncounterRevealed,
        ).toBe(false);

        expect(
          result.currentEncounterDeckType,
        ).toBeNull();

        expect(
          result.pendingDecision,
        ).toBeNull();
      },
    );

    it(
      "throws when the pending decision is not a Continue decision",
      () => {
        const game =
          prepareGame();

        game.pendingDecision = {
          type: "choice",
          title: "Choose",
          message:
            "Choose an option.",
          options: [],
        };

        expect(() =>
          resolvePendingDecision(
            game,
            createTestMap(),
          ),
        ).toThrow(
          'Pending decision "choice" cannot be resolved by resolvePendingDecision.',
        );
      },
    );
  },
);