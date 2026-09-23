import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { EncounterEffect } from "../models/Encounter";

import {
  createTestGame,
} from "./helpers/createTestGame";

import {
  startCombat,
} from "../engine/startCombat";

import {
  resolveMonsterSpawnAbilities,
} from "../engine/resolveMonsterSpawnAbilities";
import type { MonsterReckoningResume } from "../models/PendingDecision";

vi.mock(
  "../engine/resolveMonsterSpawnAbilities",
  () => ({
    resolveMonsterSpawnAbilities: vi.fn(
      (game) => game,
    ),
  }),
);

function createSpace(
  spaceId: string,
  monsterIds: string[] = [],
) {
  return {
    spaceId,
    clues: 0,
    clueTokenIds: [],
    monsterIds,
    gates: [],
    expedition: false,
    rumor: false,
    eldritchTokenCount: 0,
  };
}

function prepareGame() {
  const game =
    createTestGame();

  game.investigators[
    "investigator-1"
  ].spaceId = "space-1";

  game.board = {
    spaces: {
      "space-1":
        createSpace(
          "space-1",
          ["existing-monster"],
        ),
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

    monsterCup: [
      {
        id: "dark-young-1",
        definitionId: "dark-young",
        health: 0,
        spaceId: null,
        engagedInvestigatorId: null,
        isEpic: false,
      },
    ],

    monsterDiscard: [],

    gateStack: [],
    gateDiscard: [],

    activeExpeditionSpaceId:
      null,

    mythosDeck: [],
    mythosDiscard: [],
    mythosInPlay: [],
  };

  return game;
}

describe("startCombat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

    it("throws when the Monster Cup index does not contain a Monster", () => {
        const game =
            prepareGame();

        vi.spyOn(
            game.board.monsterCup,
            "findIndex",
        ).mockReturnValueOnce(0);

        game.board.monsterCup[0] =
            undefined as never;

        expect(() =>
            startCombat(
                game,
                "investigator-1",
                "dark-young",
            ),
        ).toThrow(
            "Failed to retrieve Monster from the Monster Cup.",
        );

        expect(
            resolveMonsterSpawnAbilities,
        ).not.toHaveBeenCalled();
    });

    it("throws when the investigator's space does not exist", () => {
        const game =
            prepareGame();

        delete game.board.spaces[
            "space-1"
        ];

        expect(() =>
            startCombat(
                game,
                "investigator-1",
                "dark-young",
            ),
        ).toThrow(
            'Space "space-1" does not exist.',
        );

        expect(
            resolveMonsterSpawnAbilities,
        ).not.toHaveBeenCalled();
    });

  it("throws when the investigator does not exist", () => {
    const game =
      prepareGame();

    expect(() =>
      startCombat(
        game,
        "investigator-missing",
        "dark-young",
      ),
    ).toThrow(
      'Investigator "investigator-missing" does not exist.',
    );

    expect(
      resolveMonsterSpawnAbilities,
    ).not.toHaveBeenCalled();
  });

  it("throws when the investigator is not on a space", () => {
    const game =
      prepareGame();

    game.investigators[
      "investigator-1"
    ].spaceId = null;

    expect(() =>
      startCombat(
        game,
        "investigator-1",
        "dark-young",
      ),
    ).toThrow(
      'Investigator "investigator-1" is not on a space.',
    );

    expect(
      resolveMonsterSpawnAbilities,
    ).not.toHaveBeenCalled();
  });

  it("throws when the Monster definition does not exist", () => {
    const game =
      prepareGame();

    expect(() =>
      startCombat(
        game,
        "investigator-1",
        "monster-does-not-exist",
      ),
    ).toThrow(
      'Monster definition "monster-does-not-exist" does not exist.',
    );

    expect(
      resolveMonsterSpawnAbilities,
    ).not.toHaveBeenCalled();
  });

  it("throws when the requested Monster is not in the Monster Cup", () => {
    const game =
      prepareGame();

    game.board.monsterCup = [];

    expect(() =>
      startCombat(
        game,
        "investigator-1",
        "dark-young",
      ),
    ).toThrow(
      'There is no "Dark Young" available in the Monster Cup.',
    );

    expect(
      resolveMonsterSpawnAbilities,
    ).not.toHaveBeenCalled();
  });

  it("removes the physical Monster from the Monster Cup", () => {
    const game =
      prepareGame();

    const result =
      startCombat(
        game,
        "investigator-1",
        "dark-young",
      );

    expect(
      result.board.monsterCup,
    ).toHaveLength(0);

    expect(
      game.board.monsterCup,
    ).toHaveLength(1);
  });

  it("creates the engaged Monster with the correct Toughness and investigator", () => {
    const game =
      prepareGame();

    const result =
      startCombat(
        game,
        "investigator-1",
        "dark-young",
      );

    const monster =
      result.monsters[
        "dark-young-1"
      ];

    expect(
      monster,
    ).toBeDefined();

    expect(
      monster.health,
    ).toBe(5);

    expect(
      monster.spaceId,
    ).toBe("space-1");

    expect(
      monster.engagedInvestigatorId,
    ).toBe(
      "investigator-1",
    );

    expect(
      monster.definitionId,
    ).toBe("dark-young");
  });

  it("adds the Monster to the investigator's space without removing existing Monsters", () => {
    const game =
      prepareGame();

    const result =
      startCombat(
        game,
        "investigator-1",
        "dark-young",
      );

    expect(
      result.board.spaces[
        "space-1"
      ].monsterIds,
    ).toEqual([
      "existing-monster",
      "dark-young-1",
    ]);
  });

  it("calls resolveMonsterSpawnAbilities with the spawned Monster and definition", () => {
    const game =
      prepareGame();

    startCombat(
      game,
      "investigator-1",
      "dark-young",
    );

    expect(
      resolveMonsterSpawnAbilities,
    ).toHaveBeenCalledTimes(1);

    expect(
      resolveMonsterSpawnAbilities,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        monsters: expect.objectContaining({
          "dark-young-1":
            expect.objectContaining({
              definitionId:
                "dark-young",

              health: 5,

              spaceId:
                "space-1",

              engagedInvestigatorId:
                "investigator-1",
            }),
        }),
      }),
      "dark-young-1",
      expect.objectContaining({
        id: "dark-young",
        name: "Dark Young",
      }),
    );
  });

  it("uses the game returned by resolveMonsterSpawnAbilities", () => {
    const game =
      prepareGame();

    const modifiedGame = {
      ...game,

      activeInvestigatorId:
        "investigator-2",
    };

    vi.mocked(
      resolveMonsterSpawnAbilities,
    ).mockReturnValueOnce(
      modifiedGame,
    );

    const result =
      startCombat(
        game,
        "investigator-1",
        "dark-young",
      );

    expect(
      result.activeInvestigatorId,
    ).toBe(
      "investigator-2",
    );
  });

  it("creates the Combat pending decision", () => {
    const game =
      prepareGame();

    const result =
      startCombat(
        game,
        "investigator-1",
        "dark-young",
      );

    expect(
      result.pendingDecision,
    ).toEqual({
      type: "combat",

      title:
        "Combat: Dark Young",

      message:
        "You are engaged with Dark Young.",

      image:
        "/cards/Monsters/Monster/Dark-Young/Dark-Young.jpg",

      monsterId:
        "dark-young-1",

      onDefeat: [],

      onNotDefeated: [],

      source:
        "combat:dark-young-1",

      resume: undefined,
    });
  });

  it("preserves the onDefeat and onNotDefeated effects", () => {
    const game =
      prepareGame();

    const onDefeat =
      [
        {
          type: "gain-health",
          amount: 1,
        },
      ] as EncounterEffect[];

    const onNotDefeated =
      [
        {
          type: "lose-health",
          amount: 1,
        },
      ] as EncounterEffect[];

    const result =
      startCombat(
        game,
        "investigator-1",
        "dark-young",
        onDefeat,
        onNotDefeated,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type: "combat",

      monsterId:
        "dark-young-1",

      onDefeat,

      onNotDefeated,
    });
  });

  it("preserves a Monster Reckoning resume", () => {
    const game =
      prepareGame();

    const resume: MonsterReckoningResume = {
        type:
            "monster-reckoning",

        monsterId:
            "another-monster",

        monsterIds: [
            "another-monster",
        ],

        nextIconIndex: 3,

        resolvedMonsterIds: [],

        remainingPasses: 2,
    };

    const result =
      startCombat(
        game,
        "investigator-1",
        "dark-young",
        [],
        [],
        resume,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type: "combat",

      monsterId:
        "dark-young-1",

      resume,
    });
  });

  it("returns a new GameState without mutating the original game", () => {
    const game =
      prepareGame();

    const originalCupLength =
      game.board.monsterCup.length;

    const originalMonsterIds =
      [
        ...game.board.spaces[
          "space-1"
        ].monsterIds,
      ];

    const result =
      startCombat(
        game,
        "investigator-1",
        "dark-young",
      );

    expect(
      result,
    ).not.toBe(game);

    expect(
      game.board.monsterCup,
    ).toHaveLength(
      originalCupLength,
    );

    expect(
      game.board.spaces[
        "space-1"
      ].monsterIds,
    ).toEqual(
      originalMonsterIds,
    );

    expect(
      game.monsters,
    ).toEqual({});
  });
});