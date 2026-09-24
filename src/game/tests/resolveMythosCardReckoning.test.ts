import {
  describe,
  expect,
  it,
} from "vitest";

import {
  resolveMythosCardReckoning,
} from "../engine/resolveMythosCardReckoning";

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
    startingSpaceId: "city",
    spaces: [
      {
        id: "city",
        name: "City",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [],
        paths: [],
      },
      {
        id: "space-8",
        name: "Space 8",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [],
        paths: [],
      },
      {
        id: "space-16",
        name: "Space 16",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [],
        paths: [],
      },
      {
        id: "space-19",
        name: "Space 19",
        type: "city",
        isExpedition: false,
        connectedSpaceIds: [],
        paths: [],
      },
      {
        id: "wilderness",
        name: "Wilderness",
        type: "wilderness",
        isExpedition: false,
        connectedSpaceIds: [],
        paths: [],
      },
    ],
  };
}

function createBoardSpace(
  spaceId: string,
) {
  return {
    spaceId,
    clues: 0,
    clueTokenIds: [],
    monsterIds: [],
    gates: [],
    expedition: false,
    rumor: false,
    eldritchTokenCount: 0,
  };
}

function prepareGame(
  mythosId: string,
  eldritchTokens = 0,
): GameState {
  const game = createTestGame();

  game.currentMythosId = mythosId;

  game.board.spaces = {
    city: createBoardSpace("city"),
    "space-8": createBoardSpace("space-8"),
    "space-16": createBoardSpace("space-16"),
    "space-19": createBoardSpace("space-19"),
    wilderness: createBoardSpace("wilderness"),
  };

  game.board.mythosInPlay = [
    {
      definitionId: mythosId,
      eldritchTokens,
    },
  ];

  game.board.mythosDiscard = [];

  game.board.assetDeck = [];
  game.board.assetDiscard = [];
  game.board.assetReserve = [];

  game.board.encounterDecks = {
    america: [],
    europe: [],
    "asia-australia": [],
    general: [],
    research: [],
    "other-world": [],
    special: [],
    "expedition": [],
  };

  game.board.conditionDeck = [];

    game.pendingDecision = {
        type: "mythos-card-reckoning",
        title: "Mythos Reckoning",
        message: "Resolve the Mythos Reckoning.",
        source: "mythos:card-reckoning",
        mythosIds: [mythosId],
        resolvedMythosIds: [],
        nextIconIndex: 0,
    };

  return game;
}

describe(
  "resolveMythosCardReckoning",
  () => {
    it(
      "throws when there is no Mythos card Reckoning decision",
      () => {
        const game = createTestGame();

        game.pendingDecision = null;

        expect(() =>
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          ),
        ).toThrow(
          "There is no active Mythos card Reckoning decision.",
        );
      },
    );

    it(
      "throws when the Mythos definition does not exist",
      () => {
        const game = prepareGame(
          "mythos-does-not-exist",
        );

        expect(() =>
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          ),
        ).toThrow(
          'Mythos "mythos-does-not-exist" does not exist.',
        );
      },
    );

    it(
      "marks a Mythos as resolved when it has already been removed from play",
      () => {
        const game = prepareGame(
          "growing-madness",
        );

        game.board.mythosInPlay = [];

        const result =
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe(
          "mythos-card-reckoning",
        );

        if (
          result.pendingDecision?.type ===
          "mythos-card-reckoning"
        ) {
          expect(
            result.pendingDecision
              .resolvedMythosIds,
          ).toEqual([
            "growing-madness",
          ]);
        }
      },
    );

    it(
      "starts Condition Reckoning after all Mythos cards are resolved",
      () => {
        const game = prepareGame(
          "growing-madness",
        );

        if (
          game.pendingDecision?.type ===
          "mythos-card-reckoning"
        ) {
          game.pendingDecision
            .resolvedMythosIds = [
            "growing-madness",
          ];
        }

        const result =
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("continue");
      },
    );

    it(
      "supports the second Mythos Reckoning pass",
      () => {
        const game = prepareGame(
          "growing-madness",
        );

        if (
          game.pendingDecision?.type ===
          "mythos-card-reckoning"
        ) {
          game.pendingDecision
            .resolvedMythosIds = [
            "growing-madness",
          ];

          game.pendingDecision
            .remainingPasses = 2;
        }

        const result =
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe(
          "mythos-card-reckoning",
        );

        if (
          result.pendingDecision?.type ===
          "mythos-card-reckoning"
        ) {
          expect(
            result.pendingDecision
              .resolvedMythosIds,
          ).toEqual([]);

          expect(
            result.pendingDecision
              .remainingPasses,
          ).toBe(1);
        }
      },
    );

    it(
      "throws when Growing Madness has no Lead Investigator",
      () => {
        const game = prepareGame(
          "growing-madness",
          2,
        );

        game.leadInvestigatorId = null;

        expect(() =>
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          ),
        ).toThrow(
          "There is no Lead Investigator.",
        );
      },
    );

    it(
      "resolves Growing Madness Reckoning without discarding tokens when no Madness is available",
      () => {
        const game = prepareGame(
          "growing-madness",
          3,
        );

        const result =
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.board.mythosInPlay[0]
            ?.eldritchTokens,
        ).toBe(3);

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "mythos-card-reckoning",
          resolvedMythosIds: [
            "growing-madness",
          ],
        });
      },
    );

    it(
      "returns the Active Expedition encounters belonging to the active Expedition space",
      () => {
        const game = prepareGame(
          "secrets-of-the-past",
        );

        game.board.activeExpeditionSpaceId =
          "city";

        game.board.encounterDecks.expedition = [
          "encounter-1",
          "encounter-2",
          "encounter-3",
        ];

        game.encounters = {
          "encounter-1": {
            name: "City",
          } as never,
          "encounter-2": {
            name: "Other Space",
          } as never,
          "encounter-3": {
            name: "City",
          } as never,
        };

        const result =
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.board.encounterDecks
            .expedition,
        ).toEqual([
          "encounter-2",
        ]);

        expect(
          result.status,
        ).toBe("playing");

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "mythos-card-reckoning",
          resolvedMythosIds: [
            "secrets-of-the-past",
          ],
        });
      },
    );

    it(
      "causes defeat when returning the Active Expedition empties the Expedition deck",
      () => {
        const game = prepareGame(
          "secrets-of-the-past",
        );

        game.board.activeExpeditionSpaceId =
          "city";

        game.board.encounterDecks.expedition = [
          "encounter-1",
        ];

        game.encounters = {
          "encounter-1": {
            name: "City",
          } as never,
        };

        const result =
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.board.encounterDecks
            .expedition,
        ).toEqual([]);

        expect(result.status)
          .toBe("defeat");

        expect(
          result.pendingDecision,
        ).toBeNull();
      },
    );

    it(
      "resolves Active Expedition Reckoning when there is no active Expedition",
      () => {
        const game = prepareGame(
          "secrets-of-the-past",
        );

        game.board.activeExpeditionSpaceId =
          null;

        const result =
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "mythos-card-reckoning",
          resolvedMythosIds: [
            "secrets-of-the-past",
          ],
        });
      },
    );

    it(
      "removes high-value Assets during Faded From Society Reckoning",
      () => {
        const game = prepareGame(
          "faded-from-society",
          3,
        );

        game.board.assetDeck = [
          {
            id: "asset-1",
            value: 2,
          } as never,
          {
            id: "asset-2",
            value: 3,
          } as never,
          {
            id: "asset-3",
            value: 4,
          } as never,
        ];

        game.board.assetDiscard = [
          {
            id: "asset-4",
            value: 1,
          } as never,
          {
            id: "asset-5",
            value: 5,
          } as never,
        ];

        game.board.assetReserve = [
          {
            id: "asset-6",
            value: 2,
          } as never,
          {
            id: "asset-7",
            value: 3,
          } as never,
        ];

        const result =
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.board.assetDeck.map(
            (asset) => asset.id,
          ),
        ).toEqual([
          "asset-1",
        ]);

        expect(
          result.board.assetDiscard.map(
            (asset) => asset.id,
          ),
        ).toEqual([
          "asset-4",
        ]);

        expect(
          result.board.assetReserve.map(
            (asset) => asset.id,
          ),
        ).toEqual([
          "asset-6",
        ]);

        expect(
          result.board.mythosInPlay[0]
            ?.eldritchTokens,
        ).toBe(2);
      },
    );

    it(
      "discards one Eldritch Token during a normal token Reckoning",
      () => {
        const game = prepareGame(
          "fractured-reality",
          3,
        );

        const result =
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.board.mythosInPlay[0]
            ?.eldritchTokens,
        ).toBe(2);

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "mythos-card-reckoning",
          resolvedMythosIds: [
            "fractured-reality",
          ],
        });
      },
    );

    it(
      "creates a test for the first Investigator in a City for Patrolling the Border",
      () => {
        const game = prepareGame(
          "patrolling-the-border",
        );

        game.investigators[
          "investigator-1"
        ].spaceId = "city";

        game.investigators[
          "investigator-2"
        ].spaceId = "wilderness";

        const result =
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.activeInvestigatorId,
        ).toBe("investigator-1");

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "test",
          title: "Patrolling the Border",
          skill: "observation",
          investigatorId:
            "investigator-1",
          source:
            "mythos:patrolling-the-border:test:investigator-1:0",
        });
      },
    );

    it(
      "discards Patrolling the Border when nobody is in a City",
      () => {
        const game = prepareGame(
          "patrolling-the-border",
        );

        game.investigators[
          "investigator-1"
        ].spaceId = "wilderness";

        game.investigators[
          "investigator-2"
        ].spaceId = "wilderness";

        game.investigators[
          "investigator-3"
        ].spaceId = null;

        const result =
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.board.mythosInPlay,
        ).toEqual([]);

        expect(
          result.board.mythosDiscard
            .map(
              (mythos) => mythos.id,
            ),
        ).toContain(
          "patrolling-the-border",
        );

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "mythos-card-reckoning",
          resolvedMythosIds: [
            "patrolling-the-border",
          ],
        });
      },
    );

    it(
      "spawns a Monster on Space 19 for Return of the Ancient Ones",
      () => {
        const game = prepareGame(
          "return-of-the-ancient-ones",
        );

        game.board.monsterCup = [
          {
            id: "monster-4",
            definitionId: "cultist",
          } as never,
        ];

        game.monsters = {
          "monster-1": {
            id: "monster-1",
            definitionId: "cultist",
          } as never,
          "monster-2": {
            id: "monster-2",
            definitionId: "cultist",
          } as never,
          "monster-3": {
            id: "monster-3",
            definitionId: "cultist",
          } as never,
        };

        game.board.spaces[
          "space-19"
        ].monsterIds = [
          "monster-1",
          "monster-2",
        ];

        game.ancientOne = {
          id: "azathoth",
          name: "Azathoth",
          doom: 15,
          omenPosition: 0,
          eldritchTokens: 0,
          eldritchTokenPositions: [],
          eldritchTokenSpaceIds: [],
          awakened: false,
          sanityTokens: 0,
          gateCount: 0,
        };

        const map = createTestMap();

        const result =
          resolveMythosCardReckoning(
            game,
            map,
          );

        expect(
          result.board.spaces[
            "space-19"
          ]?.monsterIds.length,
        ).toBe(3);

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "mythos-card-reckoning",
          resolvedMythosIds: [
            "return-of-the-ancient-ones",
          ],
        });
      },
    );

    it(
      "advances the Omen during Stars Aligned Reckoning",
      () => {
        const game = prepareGame(
          "stars-aligned",
        );

        game.ancientOne = {
          id: "azathoth",
          name: "Azathoth",
          doom: 15,
          omenPosition: 0,
          eldritchTokens: 0,
          eldritchTokenPositions: [],
          eldritchTokenSpaceIds: [],
          awakened: false,
          sanityTokens: 0,
          gateCount: 0,
        };

        const result =
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.ancientOne.omenPosition,
        ).toBe(1);

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "mythos-card-reckoning",
          resolvedMythosIds: [
            "stars-aligned",
          ],
        });
      },
    );

    it(
      "discards one Eldritch Token during Wind-Walker Reckoning",
      () => {
        const game = prepareGame(
          "the-wind-walker",
          2,
        );

        const result =
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.board.mythosInPlay[0]
            ?.eldritchTokens,
        ).toBe(1);

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "mythos-card-reckoning",
          resolvedMythosIds: [
            "the-wind-walker",
          ],
        });
      },
    );

    it(
      "uses the default path for a Mythos Reckoning type without a specific handler",
      () => {
        const game = prepareGame(
          "spreading-sickness",
        );

        const result =
          resolveMythosCardReckoning(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision,
        ).toMatchObject({
          type: "mythos-card-reckoning",
          resolvedMythosIds: [
            "spreading-sickness",
          ],
        });
      },
    );
  },
);