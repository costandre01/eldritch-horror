import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  createTestGame,
} from "./helpers/createTestGame";

import {
  resolveMonsterSpawnAbilities,
} from "../engine/resolveMonsterSpawnAbilities";

import {
  gainCondition,
} from "../engine/gainCondition";

import {
  getLeadInvestigatorId,
} from "../engine/getLeadInvestigatorId";

import type {
  MonsterDefinition,
} from "../models/Monster";

vi.mock(
  "../engine/gainCondition",
  () => ({
    gainCondition: vi.fn(
      (game) => game,
    ),
  }),
);

vi.mock(
  "../engine/getLeadInvestigatorId",
  () => ({
    getLeadInvestigatorId: vi.fn(
      () => "investigator-1",
    ),
  }),
);

function createMonsterDefinition(
  id: string,
  specialAbilities: MonsterDefinition["specialAbilities"],
): MonsterDefinition {
  return {
    id,

    name: id,

    epic: false,

    frontImage:
      "/monster-front.jpg",

    backImage:
      "/monster-back.jpg",

    horrorTest: {
      skill: "will",
      modifier: 0,
      damage: 1,
    },

    combatTest: {
      skill: "strength",
      modifier: 0,
      damage: 1,
    },

    toughness: {
      type: "fixed",
      value: 3,
    },

    specialAbilities,

    quantity: 1,
  };
}

function prepareGame() {
  const game =
    createTestGame();

  game.board = {
    spaces: {
      "space-1": {
        spaceId: "space-1",

        clues: 0,

        clueTokenIds: [],

        monsterIds: [
          "monster-1",
        ],

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

      "space-3": {
        spaceId: "space-3",

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

  game.monsters = {
    "monster-1": {
      id: "monster-1",

      definitionId:
        "test-monster",

      health: 3,

      spaceId: "space-1",

      engagedInvestigatorId:
        null,

      isEpic: false,
    },
  };

  return game;
}

describe(
  "resolveMonsterSpawnAbilities",
  () => {
    it(
      "throws when the Monster does not exist",
      () => {
        const game =
          prepareGame();

        const definition =
          createMonsterDefinition(
            "test-monster",
            [],
          );

        expect(() =>
          resolveMonsterSpawnAbilities(
            game,
            "monster-missing",
            definition,
          ),
        ).toThrow(
          'Monster "monster-missing" does not exist.',
        );
      },
    );

    it(
      "returns the current game when a Monster disappears before a later Spawn Move ability",
      () => {
        const game =
          prepareGame();

        vi.mocked(
          gainCondition,
        ).mockImplementationOnce(
          (currentGame) => {
            const {
              ["monster-1"]:
                _removedMonster,
              ...remainingMonsters
            } = currentGame.monsters;

            return {
              ...currentGame,

              monsters:
                remainingMonsters,
            };
          },
        );

        const definition =
          createMonsterDefinition(
            "test-monster",
            [
              {
                type:
                  "spawn-lead-investigator-gains-condition",

                conditionDefinitionId:
                  "condition-cursed",
              },

              {
                type:
                  "spawn-move-to-space",

                spaceId:
                  "space-2",
              },
            ],
          );

        const result =
          resolveMonsterSpawnAbilities(
            game,
            "monster-1",
            definition,
          );

        expect(
          result.monsters[
            "monster-1"
          ],
        ).toBeUndefined();

        expect(
          result.board.spaces[
            "space-2"
          ].monsterIds,
        ).toEqual([]);
      },
    );

    it(
      "returns the same game when the Monster has no Spawn abilities",
      () => {
        const game =
          prepareGame();

        const definition =
          createMonsterDefinition(
            "test-monster",
            [],
          );

        const result =
          resolveMonsterSpawnAbilities(
            game,
            "monster-1",
            definition,
          );

        expect(
          result,
        ).toBe(game);

        expect(
          result.monsters[
            "monster-1"
          ].spaceId,
        ).toBe("space-1");
      },
    );

    it(
      "moves a Monster to the specified space",
      () => {
        const game =
          prepareGame();

        const definition =
          createMonsterDefinition(
            "test-monster",
            [
              {
                type:
                  "spawn-move-to-space",

                spaceId:
                  "space-2",
              },
            ],
          );

        const result =
          resolveMonsterSpawnAbilities(
            game,
            "monster-1",
            definition,
          );

        expect(
          result.monsters[
            "monster-1"
          ].spaceId,
        ).toBe("space-2");

        expect(
          result.board.spaces[
            "space-1"
          ].monsterIds,
        ).toEqual([]);

        expect(
          result.board.spaces[
            "space-2"
          ].monsterIds,
        ).toEqual([
          "monster-1",
        ]);
      },
    );

    it(
      "does not duplicate a Monster when it is already in the target space",
      () => {
        const game =
          prepareGame();

        game.monsters[
          "monster-1"
        ].spaceId =
          "space-2";

        game.board.spaces[
          "space-1"
        ].monsterIds = [];

        game.board.spaces[
          "space-2"
        ].monsterIds = [
          "monster-1",
        ];

        const definition =
          createMonsterDefinition(
            "test-monster",
            [
              {
                type:
                  "spawn-move-to-space",

                spaceId:
                  "space-2",
              },
            ],
          );

        const result =
          resolveMonsterSpawnAbilities(
            game,
            "monster-1",
            definition,
          );

        expect(
          result,
        ).toBe(game);

        expect(
          result.board.spaces[
            "space-2"
          ].monsterIds,
        ).toEqual([
          "monster-1",
        ]);
      },
    );

    it(
      "throws when a Spawn ability references an unknown space",
      () => {
        const game =
          prepareGame();

        const definition =
          createMonsterDefinition(
            "test-monster",
            [
              {
                type:
                  "spawn-move-to-space",

                spaceId:
                  "space-does-not-exist",
              },
            ],
          );

        expect(() =>
          resolveMonsterSpawnAbilities(
            game,
            "monster-1",
            definition,
          ),
        ).toThrow(
          "Spawn ability references unknown space: space-does-not-exist",
        );
      },
    );

    it(
      "removes the Monster from its previous space before moving it",
      () => {
        const game =
          prepareGame();

        game.board.spaces[
          "space-1"
        ].monsterIds = [
          "another-monster",

          "monster-1",

          "third-monster",
        ];

        const definition =
          createMonsterDefinition(
            "test-monster",
            [
              {
                type:
                  "spawn-move-to-space",

                spaceId:
                  "space-3",
              },
            ],
          );

        const result =
          resolveMonsterSpawnAbilities(
            game,
            "monster-1",
            definition,
          );

        expect(
          result.board.spaces[
            "space-1"
          ].monsterIds,
        ).toEqual([
          "another-monster",

          "third-monster",
        ]);

        expect(
          result.board.spaces[
            "space-3"
          ].monsterIds,
        ).toEqual([
          "monster-1",
        ]);
      },
    );

    it(
      "handles a Monster that has no current space",
      () => {
        const game =
          prepareGame();

        game.monsters[
          "monster-1"
        ].spaceId = null;

        game.board.spaces[
          "space-1"
        ].monsterIds = [];

        const definition =
          createMonsterDefinition(
            "test-monster",
            [
              {
                type:
                  "spawn-move-to-space",

                spaceId:
                  "space-2",
              },
            ],
          );

        const result =
          resolveMonsterSpawnAbilities(
            game,
            "monster-1",
            definition,
          );

        expect(
          result.monsters[
            "monster-1"
          ].spaceId,
        ).toBe("space-2");

        expect(
          result.board.spaces[
            "space-2"
          ].monsterIds,
        ).toEqual([
          "monster-1",
        ]);
      },
    );

    it(
      "passes the Lead Investigator condition to gainCondition",
      () => {
        const game =
          prepareGame();

        const definition =
          createMonsterDefinition(
            "test-monster",
            [
              {
                type:
                  "spawn-lead-investigator-gains-condition",

                conditionDefinitionId:
                  "condition-cursed",
              },
            ],
          );

        resolveMonsterSpawnAbilities(
          game,
          "monster-1",
          definition,
        );

        expect(
          getLeadInvestigatorId,
        ).toHaveBeenCalledWith(
          game,
        );

        expect(
          gainCondition,
        ).toHaveBeenCalledTimes(1);

        expect(
          gainCondition,
        ).toHaveBeenCalledWith(
          game,
          "investigator-1",
          "condition-cursed",
        );
      },
    );

    it(
      "uses the GameState returned by gainCondition",
      () => {
        const game =
          prepareGame();

        const modifiedGame = {
          ...game,

          activeInvestigatorId:
            "investigator-2",
        };

        vi.mocked(
          gainCondition,
        ).mockReturnValueOnce(
          modifiedGame,
        );

        const definition =
          createMonsterDefinition(
            "test-monster",
            [
              {
                type:
                  "spawn-lead-investigator-gains-condition",

                conditionDefinitionId:
                  "condition-cursed",
              },
            ],
          );

        const result =
          resolveMonsterSpawnAbilities(
            game,
            "monster-1",
            definition,
          );

        expect(
          result,
        ).toBe(modifiedGame);
      },
    );

    it(
      "resolves multiple Spawn abilities in sequence",
      () => {
        const game =
          prepareGame();

        const definition =
          createMonsterDefinition(
            "test-monster",
            [
              {
                type:
                  "spawn-move-to-space",

                spaceId:
                  "space-2",
              },

              {
                type:
                  "spawn-move-to-space",

                spaceId:
                  "space-3",
              },
            ],
          );

        const result =
          resolveMonsterSpawnAbilities(
            game,
            "monster-1",
            definition,
          );

        expect(
          result.monsters[
            "monster-1"
          ].spaceId,
        ).toBe("space-3");

        expect(
          result.board.spaces[
            "space-1"
          ].monsterIds,
        ).toEqual([]);

        expect(
          result.board.spaces[
            "space-2"
          ].monsterIds,
        ).toEqual([]);

        expect(
          result.board.spaces[
            "space-3"
          ].monsterIds,
        ).toEqual([
          "monster-1",
        ]);
      },
    );

    it(
      "returns the current GameState for unsupported ability types",
      () => {
        const game =
          prepareGame();

        const definition =
          createMonsterDefinition(
            "test-monster",
            [
              {
                type:
                  "recover-all-health",
              },
            ],
          );

        const result =
          resolveMonsterSpawnAbilities(
            game,
            "monster-1",
            definition,
          );

        expect(
          result,
        ).toBe(game);
      },
    );
  },
);