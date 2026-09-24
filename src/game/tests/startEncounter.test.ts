import {
  describe,
  expect,
  it,
} from "vitest";

import {
  startEncounter,
} from "../engine/startEncounter";

import {
  createTestGame,
} from "./helpers/createTestGame";

import type {
  GameState,
} from "../models/GameState";

import type {
  MapDefinition,
  SpaceType,
  EncounterRegion,
} from "../models/MapDefinition";

function createTestMap(
  spaceId = "arkham",
  options: {
    type?: SpaceType;
    isExpedition?: boolean;
    encounterRegion?: EncounterRegion;
} = {},
): MapDefinition {
  return {
    id: "test-map",
    name: "Test Map",
    startingSpaceId: spaceId,
    spaces: [
      {
        id: spaceId,
        name:
          spaceId === "arkham"
            ? "Arkham"
            : spaceId,
        type:
          options.type ??
          "city",
        isExpedition:
          options.isExpedition ??
          false,
        encounterRegion:
          options.encounterRegion,
        connectedSpaceIds: [],
        paths: [],
      },
    ],
  };
}

function prepareBoard(
  game: GameState,
): void {
  game.board = {
    spaces: {
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

      "space-2": {
        spaceId: "space-2",
        clues: 0,
        clueTokenIds: [],
        monsterIds: [],
        gates: [],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },

      "space-7": {
        spaceId: "space-7",
        clues: 0,
        clueTokenIds: [],
        monsterIds: [],
        gates: [],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },

      "space-8": {
        spaceId: "space-8",
        clues: 0,
        clueTokenIds: [],
        monsterIds: [],
        gates: [],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },

      "space-11": {
        spaceId: "space-11",
        clues: 0,
        clueTokenIds: [],
        monsterIds: [],
        gates: [],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },

      "space-13": {
        spaceId: "space-13",
        clues: 0,
        clueTokenIds: [],
        monsterIds: [],
        gates: [],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },

      "space-17": {
        spaceId: "space-17",
        clues: 0,
        clueTokenIds: [],
        monsterIds: [],
        gates: [],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },
    },

    cluePool: [],
    clueDiscard: [],

    assetDeck: [],
    assetReserve: [],
    assetDiscard: [],

    spellDeck: [],
    spellDiscard: [],

    artifactDeck: [],
    artifactDiscard: [],

    conditionDeck: [],
    conditionDiscard: [],

    encounterDecks: {
      america: [],
      europe: [],
      "asia-australia": [],
      general: [],
      research: [],
      "other-world": [],
      special: [],
      expedition: [],
    },

    encounterDiscards: {
      america: [],
      europe: [],
      "asia-australia": [],
      general: [],
      research: [],
      "other-world": [],
      special: [],
      expedition: [],
    },

    monsterCup: [],
    monsterDiscard: [],

    gateStack: [],
    gateDiscard: [],

    activeExpeditionSpaceId:
      null,

    mythosDeck: [],
    mythosDiscard: [],
    mythosInPlay: [],
  };
}

function addDeck(
  game: GameState,
  deckType:
    | "america"
    | "europe"
    | "asia-australia"
    | "general"
    | "research"
    | "other-world"
    | "special"
    | "expedition",
  encounterId = `${deckType}-encounter`,
): void {
  game.board.encounterDecks[deckType] = [
    encounterId,
  ];

  game.encounters[encounterId] = {
    id: encounterId,
    name: "Test Encounter",
    region:
      deckType === "research"
        ? "research"
        : deckType === "america"
          ? "america"
          : deckType === "europe"
            ? "europe"
            : deckType === "asia-australia"
              ? "asia-australia"
              : deckType === "expedition"
                ? "expedition"
                : "america",
    frontImage:
      `/cards/${deckType}.jpg`,
    backImage:
      `/cards/${deckType}-back.jpg`,
  } as GameState["encounters"][string];
}

function prepareGame(
  spaceId = "arkham",
): GameState {
  const game =
    createTestGame();

  game.phase = "encounter";
  game.activeInvestigatorId =
    "investigator-1";

  game.investigators[
    "investigator-1"
  ].spaceId = spaceId;

  prepareBoard(game);

  return game;
}

describe(
  "startEncounter",
  () => {
    it(
      "throws when there is no active investigator",
      () => {
        const game =
          prepareGame();

        game.activeInvestigatorId =
          null;

        expect(() =>
          startEncounter(
            game,
            createTestMap(),
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
          startEncounter(
            game,
            createTestMap(),
          ),
        ).toThrow(
          'Investigator "missing-investigator" does not exist.',
        );
      },
    );

    it(
      "throws when the game is not in the Encounter phase",
      () => {
        const game =
          prepareGame();

        game.phase = "action";

        expect(() =>
          startEncounter(
            game,
            createTestMap(),
          ),
        ).toThrow(
          "An Encounter can only start during the Encounter phase.",
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
          startEncounter(
            game,
            createTestMap(),
          ),
        ).toThrow(
          "Investigator has no current space.",
        );
      },
    );

    it(
      "throws when the investigator space does not exist on the map",
      () => {
        const game =
          prepareGame(
            "missing-space",
          );

        expect(() =>
          startEncounter(
            game,
            createTestMap(),
          ),
        ).toThrow(
          'Space "missing-space" does not exist.',
        );
      },
    );

    it(
      "creates a General Encounter choice at a city",
      () => {
        const game =
          prepareGame();

        addDeck(
          game,
          "general",
        );

        const result =
          startEncounter(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.title,
          ).toBe(
            "Choose Encounter",
          );

          expect(
            result.pendingDecision.message,
          ).toBe(
            "Choose an Encounter for Arkham.",
          );

          expect(
            result.pendingDecision.source,
          ).toBe(
            "encounter-selection:arkham",
          );

          expect(
            result.pendingDecision.options,
          ).toHaveLength(1);

          expect(
            result.pendingDecision.options[0],
          ).toEqual({
            id: "general",
            title: "General",
            description:
              "Draw a General Encounter for Arkham.",
            image:
              "/cards/general.jpg",
          });
        }
      },
    );

    it(
      "offers the regional deck together with General",
      () => {
        const game =
          prepareGame();

        addDeck(
          game,
          "america",
        );

        addDeck(
          game,
          "general",
        );

        const result =
          startEncounter(
            game,
            createTestMap(
              "arkham",
              {
                encounterRegion:
                  "america",
              },
            ),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

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
            "america",
            "general",
          ]);
        }
      },
    );

    it(
      "supports Europe as the regional deck",
      () => {
        const game =
          prepareGame();

        addDeck(
          game,
          "europe",
        );

        const result =
          startEncounter(
            game,
            createTestMap(
              "arkham",
              {
                encounterRegion:
                  "europe",
              },
            ),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options[0]
              .id,
          ).toBe("europe");

          expect(
            result.pendingDecision.options[0]
              .title,
          ).toBe("Europe");

          expect(
            result.pendingDecision.options[0]
              .description,
          ).toBe(
            "Draw a Europe Encounter for Arkham.",
          );
        }
      },
    );

    it(
      "supports Asia / Australia as the regional deck",
      () => {
        const game =
          prepareGame();

        addDeck(
          game,
          "asia-australia",
        );

        const result =
          startEncounter(
            game,
            createTestMap(
              "arkham",
              {
                encounterRegion:
                  "asia-australia",
              },
            ),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options[0]
              .id,
          ).toBe(
            "asia-australia",
          );

          expect(
            result.pendingDecision.options[0]
              .title,
          ).toBe(
            "Asia / Australia",
          );
        }
      },
    );

    it(
      "supports Wilderness as a General Encounter location",
      () => {
        const game =
          prepareGame();

        addDeck(
          game,
          "general",
        );

        const result =
          startEncounter(
            game,
            createTestMap(
              "arkham",
              {
                type:
                  "wilderness",
              },
            ),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options[0]
              .id,
          ).toBe("general");
        }
      },
    );

    it(
      "supports Sea as a General Encounter location",
      () => {
        const game =
          prepareGame();

        addDeck(
          game,
          "general",
        );

        const result =
          startEncounter(
            game,
            createTestMap(
              "arkham",
              {
                type: "sea",
              },
            ),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options[0]
              .id,
          ).toBe("general");
        }
      },
    );

    it(
      "supports Expedition Encounters at an Expedition space",
      () => {
        const game =
          prepareGame();

        addDeck(
          game,
          "expedition",
          "expedition-card",
        );

        game.encounters[
          "expedition-card"
        ].name = "Arkham";

        const result =
          startEncounter(
            game,
            createTestMap(
              "arkham",
              {
                isExpedition:
                  true,
              },
            ),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options[0]
              .id,
          ).toBe("expedition");

          expect(
            result.pendingDecision.options[0]
              .title,
          ).toBe("Expedition");

          expect(
            result.pendingDecision.options[0]
              .image,
          ).toBe(
            "/cards/expedition.jpg",
          );
        }
      },
    );

    it(
      "does not offer Expedition when Secrets of the Past is in play",
      () => {
        const game =
          prepareGame();

        addDeck(
          game,
          "expedition",
        );

        addDeck(
          game,
          "general",
        );

        game.board.mythosInPlay = [
          {
            definitionId:
              "secrets-of-the-past",
          },
        ] as GameState["board"]["mythosInPlay"];

        const result =
          startEncounter(
            game,
            createTestMap(
              "arkham",
              {
                isExpedition:
                  true,
              },
            ),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

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

    it(
      "offers Secrets of the Past at the active Expedition",
      () => {
        const game =
          prepareGame();

        addDeck(
          game,
          "general",
        );

        game.board.activeExpeditionSpaceId =
          "arkham";

        game.board.mythosInPlay = [
          {
            definitionId:
              "secrets-of-the-past",
          },
        ] as GameState["board"]["mythosInPlay"];

        const result =
          startEncounter(
            game,
            createTestMap(
              "arkham",
              {
                isExpedition:
                  true,
              },
            ),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options.map(
              (option) =>
                option.id,
            ),
          ).toContain(
            "secrets-of-the-past-encounter",
          );
        }
      },
    );

    it(
      "offers Yog-Sothoth Special Encounter when the final mystery is active and a Gate is present",
      () => {
        const game =
          prepareGame();

        addDeck(
          game,
          "special",
        );

        game.finalMystery = {
          id:
            "yog-sothoth-the-key-and-the-gate",
        } as GameState["finalMystery"];

        game.board.spaces.arkham.gates = [
            {
                id: "gate-1",
                spaceId: "arkham",
                omen: "green",
            },
        ];

        const result =
          startEncounter(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options.map(
              (option) =>
                option.id,
            ),
          ).toContain(
            "special",
          );
        }
      },
    );

    it(
      "does not offer Yog-Sothoth Special Encounter without a Gate",
      () => {
        const game =
          prepareGame();

        addDeck(
            game,
            "general",
        );

        addDeck(
          game,
          "special",
        );

        game.finalMystery = {
          id:
            "yog-sothoth-the-key-and-the-gate",
        } as GameState["finalMystery"];

        const result =
          startEncounter(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options.map(
              (option) =>
                option.id,
            ),
          ).not.toContain(
            "special",
          );
        }
      },
    );

    it(
      "throws when no Encounter deck or special encounter is available",
      () => {
        const game =
          prepareGame();

        expect(() =>
          startEncounter(
            game,
            createTestMap(),
          ),
        ).toThrow(
          'No Encounter decks are available at "Arkham".',
        );
      },
    );

    it(
      "offers Growing Madness at Space 8",
      () => {
        const game =
          prepareGame(
            "space-8",
          );

        game.board.mythosInPlay = [
          {
            definitionId:
              "growing-madness",
          },
        ] as GameState["board"]["mythosInPlay"];

        addDeck(
          game,
          "general",
        );

        const result =
          startEncounter(
            game,
            createTestMap(
              "space-8",
              {
                type: "sea",
              },
            ),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          const option =
            result.pendingDecision.options.find(
              (item) =>
                item.id ===
                "growing-madness-encounter",
            );

          expect(option).toEqual(
            expect.objectContaining({
              id:
                "growing-madness-encounter",
              title:
                "Growing Madness",
              description:
                "Attempt to find the uncharted isle.",
            }),
          );
        }
      },
    );

    it(
      "offers Stars Aligned at Space 7",
      () => {
        const game =
          prepareGame(
            "space-7",
          );

        game.board.mythosInPlay = [
          {
            definitionId:
              "stars-aligned",
          },
        ] as GameState["board"]["mythosInPlay"];

        addDeck(
          game,
          "general",
        );

        const result =
          startEncounter(
            game,
            createTestMap(
              "space-7",
              {
                type: "city",
              },
            ),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          const option =
            result.pendingDecision.options.find(
              (item) =>
                item.id ===
                "stars-aligned-encounter",
            );

          expect(option).toEqual(
            expect.objectContaining({
              id:
                "stars-aligned-encounter",
              title:
                "Stars Aligned",
              description:
                "Attempt to find the strangers studying the stars.",
            }),
          );
        }
      },
    );

    it(
      "offers Dimensions Collide at Space 11",
      () => {
        const game =
          prepareGame(
            "space-11",
          );

        game.board.mythosInPlay = [
          {
            definitionId:
              "dimensions-collide",
          },
        ] as GameState["board"]["mythosInPlay"];

        addDeck(
          game,
          "general",
        );

        const result =
          startEncounter(
            game,
            createTestMap(
              "space-11",
              {
                type: "city",
              },
            ),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options.map(
              (option) =>
                option.id,
            ),
          ).toContain(
            "dimensions-collide-encounter",
          );
        }
      },
    );

    it(
      "offers Mysterious Lights at Space 13",
      () => {
        const game =
          prepareGame(
            "space-13",
          );

        game.board.mythosInPlay = [
          {
            definitionId:
              "mysterious-lights",
          },
        ] as GameState["board"]["mythosInPlay"];

        addDeck(
          game,
          "general",
        );

        const result =
          startEncounter(
            game,
            createTestMap(
              "space-13",
              {
                type: "sea",
              },
            ),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options.map(
              (option) =>
                option.id,
            ),
          ).toContain(
            "mysterious-lights-encounter",
          );
        }
      },
    );

    it(
      "offers Spreading Sickness at Space 17",
      () => {
        const game =
          prepareGame(
            "space-17",
          );

        game.board.mythosInPlay = [
          {
            definitionId:
              "spreading-sickness",
          },
        ] as GameState["board"]["mythosInPlay"];

        addDeck(
          game,
          "general",
        );

        const result =
          startEncounter(
            game,
            createTestMap(
              "space-17",
              {
                type: "city",
              },
            ),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options.map(
              (option) =>
                option.id,
            ),
          ).toContain(
            "spreading-sickness-encounter",
          );
        }
      },
    );

    it(
      "removes duplicate deck types",
      () => {
        const game =
          prepareGame();

        addDeck(
          game,
          "general",
        );

        const result =
          startEncounter(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options.filter(
              (option) =>
                option.id ===
                "general",
            ),
          ).toHaveLength(1);
        }
      },
    );

    it(
      "returns undefined image when the deck is empty",
      () => {
        const game =
          prepareGame();

        game.board.encounterDecks.general =
          [];

        game.board.encounterDecks.america =
          ["missing-encounter"];

        const result =
          startEncounter(
            game,
            createTestMap(
              "arkham",
              {
                encounterRegion:
                  "america",
              },
            ),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options[0]
              .image,
          ).toBeUndefined();
        }
      },
    );

    it(
      "uses the fallback description for an unknown deck type",
      () => {
        const game =
          prepareGame();

        game.board.encounterDecks.general =
          ["general-encounter"];

        const result =
          startEncounter(
            game,
            createTestMap(),
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.options[0]
              .description,
          ).toBe(
            "Draw a General Encounter for Arkham.",
          );
        }
      },
    );
  },
);