import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createTestGame,
} from "./helpers/createTestGame";

import {
  startMonsterCombat,
} from "../engine/startMonsterCombat";

import type {
  DarkPowerResume,
  MonsterReckoningResume,
} from "../models/PendingDecision";

function prepareGame() {
  const game =
    createTestGame();

  game.phase =
    "encounter";

  game.activeInvestigatorId =
    "investigator-1";

  game.investigators[
    "investigator-1"
  ].spaceId =
    "space-1";

  game.monsters = {
    "dark-young-1": {
      id: "dark-young-1",

      definitionId:
        "dark-young",

      health: 0,

      spaceId:
        "space-1",

      engagedInvestigatorId:
        null,

      isEpic: false,
    },
  };

  return game;
}

describe("startMonsterCombat", () => {
  it("throws when the Monster does not exist", () => {
    const game =
      prepareGame();

    expect(() =>
      startMonsterCombat(
        game,
        "monster-missing",
      ),
    ).toThrow(
      'Monster "monster-missing" does not exist.',
    );
  });

  it("throws when there is no active investigator", () => {
    const game =
      prepareGame();

    game.activeInvestigatorId =
      null;

    expect(() =>
      startMonsterCombat(
        game,
        "dark-young-1",
      ),
    ).toThrow(
      "There is no active investigator.",
    );
  });

  it("throws when the active investigator does not exist", () => {
    const game =
      prepareGame();

    game.activeInvestigatorId =
      "investigator-missing";

    expect(() =>
      startMonsterCombat(
        game,
        "dark-young-1",
      ),
    ).toThrow(
      'Investigator "investigator-missing" does not exist.',
    );
  });

  it("throws when combat is started outside the Encounter phase", () => {
    const game =
      prepareGame();

    game.phase =
      "mythos";

    expect(() =>
      startMonsterCombat(
        game,
        "dark-young-1",
      ),
    ).toThrow(
      "Combat can only start during the Encounter phase.",
    );
  });

  it("allows combat during Monster Reckoning even outside the Encounter phase", () => {
    const game =
      prepareGame();

    game.phase =
      "mythos";

    const resume: MonsterReckoningResume = {
      type:
        "monster-reckoning",

      monsterId:
        "dark-young-1",

      monsterIds: [
        "dark-young-1",
      ],

      nextIconIndex:
        1,

      resolvedMonsterIds: [],

      remainingPasses:
        1,
    };

    const result =
      startMonsterCombat(
        game,
        "dark-young-1",
        resume,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type:
        "combat",

      monsterId:
        "dark-young-1",

      resume,
    });
  });

  it("allows combat during Dark Power even outside the Encounter phase", () => {
    const game =
      prepareGame();

    game.phase =
      "mythos";

    const resume: DarkPowerResume = {
      type:
        "mythos-dark-power",

      investigatorIds: [
        "investigator-1",
      ],

      currentInvestigatorIndex:
        0,

      monsterIds: [
        "dark-young-1",
      ],

      resolvedMonsterIds: [],
    };

    const result =
      startMonsterCombat(
        game,
        "dark-young-1",
        resume,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type:
        "combat",

      monsterId:
        "dark-young-1",

      resume,
    });
  });

  it("throws when the investigator has no current space", () => {
    const game =
      prepareGame();

    game.investigators[
      "investigator-1"
    ].spaceId = null;

    expect(() =>
      startMonsterCombat(
        game,
        "dark-young-1",
      ),
    ).toThrow(
      "Investigator has no current space.",
    );
  });

  it("throws when the Monster is not in the investigator's space", () => {
    const game =
      prepareGame();

    game.monsters[
      "dark-young-1"
    ].spaceId =
      "space-2";

    expect(() =>
      startMonsterCombat(
        game,
        "dark-young-1",
      ),
    ).toThrow(
      'Monster "dark-young-1" is not in the investigator\'s space.',
    );
  });

  it("throws when the Monster definition does not exist", () => {
    const game =
      prepareGame();

    game.monsters[
      "dark-young-1"
    ].definitionId =
      "monster-does-not-exist";

    expect(() =>
      startMonsterCombat(
        game,
        "dark-young-1",
      ),
    ).toThrow(
      'Monster definition "monster-does-not-exist" does not exist.',
    );
  });

  it("initializes a Monster with zero Health to its Toughness", () => {
    const game =
      prepareGame();

    game.monsters[
      "dark-young-1"
    ].health = 0;

    const result =
      startMonsterCombat(
        game,
        "dark-young-1",
      );

    expect(
      result.monsters[
        "dark-young-1"
      ].health,
    ).toBe(5);

    expect(
      result.monsters[
        "dark-young-1"
      ].engagedInvestigatorId,
    ).toBe(
      "investigator-1",
    );
  });

  it("keeps existing Monster Health when it is below Toughness", () => {
    const game =
      prepareGame();

    game.monsters[
      "dark-young-1"
    ].health = 2;

    const result =
      startMonsterCombat(
        game,
        "dark-young-1",
      );

    expect(
      result.monsters[
        "dark-young-1"
      ].health,
    ).toBe(2);
  });

  it("clamps existing Monster Health to its Toughness", () => {
    const game =
      prepareGame();

    game.monsters[
      "dark-young-1"
    ].health = 99;

    const result =
      startMonsterCombat(
        game,
        "dark-young-1",
      );

    expect(
      result.monsters[
        "dark-young-1"
      ].health,
    ).toBe(5);
  });

  it("engages the Monster with the active investigator", () => {
    const game =
      prepareGame();

    const result =
      startMonsterCombat(
        game,
        "dark-young-1",
      );

    expect(
      result.monsters[
        "dark-young-1"
      ].engagedInvestigatorId,
    ).toBe(
      "investigator-1",
    );
  });

  it("creates the normal Combat pending decision", () => {
    const game =
      prepareGame();

    const result =
      startMonsterCombat(
        game,
        "dark-young-1",
      );

    expect(
      result.pendingDecision,
    ).toEqual({
      type:
        "combat",

      title:
        "Combat: Dark Young",

      message:
        "You are engaged with Dark Young.",

      image:
        "/cards/Monsters/Monster/Dark-Young/Dark-Young.jpg",

      monsterId:
        "dark-young-1",

      stage:
        "start",

      source:
        "combat:dark-young-1",

      resume:
        undefined,
    });
  });

  it("uses the Monster back image and special ability for Riot", () => {
    const game =
      prepareGame();

    game.monsters = {
      "riot-1": {
        id:
          "riot-1",

        definitionId:
          "riot",

        health: 0,

        spaceId:
          "space-1",

        engagedInvestigatorId:
          null,

        isEpic: false,
      },
    };

    const result =
      startMonsterCombat(
        game,
        "riot-1",
      );

    expect(
      result.pendingDecision,
    ).toEqual({
      type:
        "monster-ability",

      title:
        "SPECIAL ABILITY",

      image:
        "/cards/Monsters/Monster/Riot/Riot-back.jpg",

      monsterId:
        "riot-1",

      ability: {
        type:
          "attempt-disperse-mob-before-combat",

        skill:
          "influence",

        modifier:
          -1,
      },

      source:
        "monster-ability:riot-1",

      resume:
        undefined,
    });
  });

  it("engages Riot with the investigator before resolving its Combat-start ability", () => {
    const game =
      prepareGame();

    game.monsters = {
      "riot-1": {
        id:
          "riot-1",

        definitionId:
          "riot",

        health: 0,

        spaceId:
          "space-1",

        engagedInvestigatorId:
          null,

        isEpic: false,
      },
    };

    const result =
      startMonsterCombat(
        game,
        "riot-1",
      );

    expect(
      result.monsters[
        "riot-1"
      ].health,
    ).toBe(3);

    expect(
      result.monsters[
        "riot-1"
      ].engagedInvestigatorId,
    ).toBe(
      "investigator-1",
    );

    expect(
      result.pendingDecision?.type,
    ).toBe(
      "monster-ability",
    );
  });

  it("uses the Combat-start ability of Wind-Walker", () => {
    const game =
      prepareGame();

    game.monsters = {
      "wind-walker-1": {
        id:
          "wind-walker-1",

        definitionId:
          "wind-walker",

        health: 0,

        spaceId:
          "space-1",

        engagedInvestigatorId:
          null,

        isEpic: true,
      },
    };

    const result =
      startMonsterCombat(
        game,
        "wind-walker-1",
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type:
        "monster-ability",

      title:
        "SPECIAL ABILITY",

      image:
        "/cards/Monsters/Epic-Monster/Wind-Walker/Wind-Walker-back.jpg",

      monsterId:
        "wind-walker-1",

      ability: {
        type:
          "lose-health-and-sanity-unless-spend-clue",
      },

      source:
        "monster-ability:wind-walker-1",
    });

    expect(
      result.monsters[
        "wind-walker-1"
      ].health,
    ).toBe(5);
  });

  it("preserves a Monster Reckoning resume in the normal Combat decision", () => {
    const game =
      prepareGame();

    const resume: MonsterReckoningResume = {
      type:
        "monster-reckoning",

      monsterId:
        "dark-young-1",

      monsterIds: [
        "dark-young-1",
      ],

      nextIconIndex:
        4,

      resolvedMonsterIds: [],

      remainingPasses:
        2,
    };

    const result =
      startMonsterCombat(
        game,
        "dark-young-1",
        resume,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type:
        "combat",

      monsterId:
        "dark-young-1",

      resume,
    });
  });

  it("preserves a Dark Power resume in a special ability decision", () => {
    const game =
      prepareGame();

    game.monsters = {
      "riot-1": {
        id:
          "riot-1",

        definitionId:
          "riot",

        health: 3,

        spaceId:
          "space-1",

        engagedInvestigatorId:
          null,

        isEpic: false,
      },
    };

    const resume: DarkPowerResume = {
      type:
        "mythos-dark-power",

      investigatorIds: [
        "investigator-1",
      ],

      currentInvestigatorIndex:
        0,

      monsterIds: [
        "riot-1",
      ],

      resolvedMonsterIds: [],
    };

    const result =
      startMonsterCombat(
        game,
        "riot-1",
        resume,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type:
        "monster-ability",

      monsterId:
        "riot-1",

      resume,
    });
  });

  it("does not mutate the original game", () => {
    const game =
      prepareGame();

    const originalHealth =
      game.monsters[
        "dark-young-1"
      ].health;

    const originalEngaged =
      game.monsters[
        "dark-young-1"
      ].engagedInvestigatorId;

    const result =
      startMonsterCombat(
        game,
        "dark-young-1",
      );

    expect(
      result,
    ).not.toBe(game);

    expect(
      game.monsters[
        "dark-young-1"
      ].health,
    ).toBe(
      originalHealth,
    );

    expect(
      game.monsters[
        "dark-young-1"
      ].engagedInvestigatorId,
    ).toBe(
      originalEngaged,
    );
  });
});