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
  startMonsterReckoning,
} from "../engine/startMonsterReckoning";

import {
  startAncientOneReckoning,
} from "../engine/startAncientOneReckoning";

vi.mock(
  "../engine/startAncientOneReckoning",
  () => ({
    startAncientOneReckoning: vi.fn(),
  }),
);

describe("startMonsterReckoning", () => {
  it("passes directly to Ancient One Reckoning when there are no valid Monsters", () => {
    const game =
      createTestGame();

    const map =
      {} as never;

    const nextIconIndex =
      4;

    const result = game;

    vi.mocked(
        startAncientOneReckoning,
    ).mockReturnValueOnce(
        result,
    );

    const returnedGame =
      startMonsterReckoning(
        game,
        map,
        nextIconIndex,
      );

    expect(
      startAncientOneReckoning,
    ).toHaveBeenCalledTimes(1);

    expect(
      startAncientOneReckoning,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        pendingDecision: null,
      }),
      map,
      nextIconIndex,
    );

    expect(
      returnedGame,
    ).toBe(result);
  });

  it("ignores Monsters that are still in the cup", () => {
    const game =
      createTestGame();

    game.monsters = {
      "dark-young-1": {
        id: "dark-young-1",
        definitionId: "dark-young",
        health: 0,
        spaceId: null,
        engagedInvestigatorId: null,
        isEpic: false,
      },
    };

    const map =
      {} as never;

    vi.mocked(
      startAncientOneReckoning,
    ).mockReturnValueOnce(
      game,
    );

    startMonsterReckoning(
      game,
      map,
      2,
    );

    expect(
      startAncientOneReckoning,
    ).toHaveBeenCalledTimes(1);
  });

  it("ignores Monsters that have no Health", () => {
    const game =
      createTestGame();

    game.monsters = {
      "dark-young-1": {
        id: "dark-young-1",
        definitionId: "dark-young",
        health: 0,
        spaceId: "space-1",
        engagedInvestigatorId: null,
        isEpic: false,
      },
    };

    const map =
      {} as never;

    vi.mocked(
      startAncientOneReckoning,
    ).mockReturnValueOnce(
      game,
    );

    startMonsterReckoning(
      game,
      map,
      2,
    );

    expect(
      startAncientOneReckoning,
    ).toHaveBeenCalledTimes(1);
  });

  it("ignores Monsters without a Reckoning ability", () => {
    const game =
      createTestGame();

    game.monsters = {
      "cultist-1": {
        id: "cultist-1",
        definitionId: "cultist",
        health: 3,
        spaceId: "space-1",
        engagedInvestigatorId: null,
        isEpic: false,
      },
    };

    const map =
      {} as never;

    vi.mocked(
      startAncientOneReckoning,
    ).mockReturnValueOnce(
      game,
    );

    startMonsterReckoning(
      game,
      map,
      2,
    );

    expect(
      startAncientOneReckoning,
    ).toHaveBeenCalledTimes(1);
  });

  it("creates a pending Monster Reckoning with valid Monsters", () => {
    const game =
      createTestGame();

    game.monsters = {
      "dark-young-1": {
        id: "dark-young-1",
        definitionId: "dark-young",
        health: 4,
        spaceId: "space-1",
        engagedInvestigatorId: null,
        isEpic: false,
      },

      "cultist-1": {
        id: "cultist-1",
        definitionId: "cultist",
        health: 3,
        spaceId: "space-2",
        engagedInvestigatorId: null,
        isEpic: false,
      },
    };

    const map =
      {} as never;

    const result =
      startMonsterReckoning(
        game,
        map,
        7,
      );

    expect(
      startAncientOneReckoning,
    ).not.toHaveBeenCalled();

    expect(
      result.pendingDecision,
    ).toEqual({
      type:
        "mythos-reckoning-monsters",

      title:
        "MYTHOS — RECKONING",

      message:
        "Resolve the Reckoning effects of the Monsters.",

      monsterIds: [
        "dark-young-1",
      ],

      resolvedMonsterIds: [],

      nextIconIndex: 7,

      remainingPasses: 1,

      source:
        "mythos:reckoning-monsters",
    });
  });

  it("includes all valid Monsters in their original object order", () => {
    const game =
      createTestGame();

    game.monsters = {
      "dark-young-1": {
        id: "dark-young-1",
        definitionId: "dark-young",
        health: 4,
        spaceId: "space-1",
        engagedInvestigatorId: null,
        isEpic: false,
      },

      "star-spawn-1": {
        id: "star-spawn-1",
        definitionId: "star-spawn",
        health: 5,
        spaceId: "space-2",
        engagedInvestigatorId: null,
        isEpic: false,
      },

      "cultist-1": {
        id: "cultist-1",
        definitionId: "cultist",
        health: 3,
        spaceId: "space-3",
        engagedInvestigatorId: null,
        isEpic: false,
      },

      "deep-one-1": {
        id: "deep-one-1",
        definitionId: "deep-one",
        health: 3,
        spaceId: "space-4",
        engagedInvestigatorId: null,
        isEpic: false,
      },
    };

    const result =
      startMonsterReckoning(
        game,
        {} as never,
        9,
        3,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type:
        "mythos-reckoning-monsters",

      monsterIds: [
        "dark-young-1",
        "star-spawn-1",
        "deep-one-1",
      ],

      resolvedMonsterIds: [],

      nextIconIndex: 9,

      remainingPasses: 3,

      source:
        "mythos:reckoning-monsters",
    });
  });

  it("ignores an unknown Monster definition", () => {
    const game =
      createTestGame();

    game.monsters = {
      "unknown-1": {
        id: "unknown-1",
        definitionId: "monster-that-does-not-exist",
        health: 5,
        spaceId: "space-1",
        engagedInvestigatorId: null,
        isEpic: false,
      },
    };

    const map =
      {} as never;

    vi.mocked(
      startAncientOneReckoning,
    ).mockReturnValueOnce(
      game,
    );

    const result =
      startMonsterReckoning(
        game,
        map,
        3,
      );

    expect(
      startAncientOneReckoning,
    ).toHaveBeenCalledTimes(1);

    expect(
      result,
    ).toBe(game);
  });

  it("does not mutate the original game when creating the pending decision", () => {
    const game =
      createTestGame();

    game.monsters = {
      "dark-young-1": {
        id: "dark-young-1",
        definitionId: "dark-young",
        health: 4,
        spaceId: "space-1",
        engagedInvestigatorId: null,
        isEpic: false,
      },
    };

    const originalPendingDecision =
      game.pendingDecision;

    const result =
      startMonsterReckoning(
        game,
        {} as never,
        5,
      );

    expect(
      game.pendingDecision,
    ).toBe(
      originalPendingDecision,
    );

    expect(
      result,
    ).not.toBe(game);

    expect(
      result.pendingDecision,
    ).not.toBeNull();
  });
});