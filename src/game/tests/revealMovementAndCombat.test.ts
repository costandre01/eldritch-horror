import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getByakheeReachableSpaces,
} from "../engine/getByakheeReachableSpaces";

import {
  retreatDoom,
} from "../engine/retreatDoom";

import {
  revealEncounter,
} from "../engine/revealEncounter";

import {
  startCombatOrder,
} from "../engine/startCombatOrder";

import type {
  MapDefinition,
} from "../models/MapDefinition";

import {
  createTestGame,
} from "./helpers/createTestGame";

describe("getByakheeReachableSpaces", () => {
  function createTestMap(): MapDefinition {
    return {
      id: "test-map",
      name: "Test Map",
      startingSpaceId: "a",
      spaces: [
        {
          id: "a",
          name: "A",
          type: "city",
          isExpedition: false,
          connectedSpaceIds: [
            "b",
          ],
          paths: [
            {
              toSpaceId: "b",
              type: "uncharted",
            },
          ],
        },
        {
          id: "b",
          name: "B",
          type: "city",
          isExpedition: false,
          connectedSpaceIds: [
            "a",
            "c",
          ],
          paths: [
            {
              toSpaceId: "a",
              type: "uncharted",
            },
            {
              toSpaceId: "c",
              type: "uncharted",
            },
          ],
        },
        {
          id: "c",
          name: "C",
          type: "wilderness",
          isExpedition: false,
          connectedSpaceIds: [
            "b",
            "d",
          ],
          paths: [
            {
              toSpaceId: "b",
              type: "uncharted",
            },
            {
              toSpaceId: "d",
              type: "uncharted",
            },
          ],
        },
        {
          id: "d",
          name: "D",
          type: "sea",
          isExpedition: false,
          connectedSpaceIds: [
            "c",
            "e",
          ],
          paths: [
            {
              toSpaceId: "c",
              type: "uncharted",
            },
            {
              toSpaceId: "e",
              type: "uncharted",
            },
          ],
        },
        {
          id: "e",
          name: "E",
          type: "city",
          isExpedition: false,
          connectedSpaceIds: [
            "d",
          ],
          paths: [
            {
              toSpaceId: "d",
              type: "uncharted",
            },
          ],
        },
      ],
    };
  }

  it("returns all spaces reachable within three moves", () => {
    const map =
      createTestMap();

    expect(
      getByakheeReachableSpaces(
        map,
        "a",
        3,
      ),
    ).toEqual([
      "b",
      "c",
      "d",
    ]);
  });

  it("uses three moves by default", () => {
    const map =
      createTestMap();

    expect(
      getByakheeReachableSpaces(
        map,
        "a",
      ),
    ).toEqual([
      "b",
      "c",
      "d",
    ]);
  });

  it("respects a smaller movement limit", () => {
    const map =
      createTestMap();

    expect(
      getByakheeReachableSpaces(
        map,
        "a",
        1,
      ),
    ).toEqual([
      "b",
    ]);
  });

  it("returns no spaces when maxMoves is zero", () => {
    const map =
      createTestMap();

    expect(
      getByakheeReachableSpaces(
        map,
        "a",
        0,
      ),
    ).toEqual([]);
  });

  it("does not revisit spaces in cycles", () => {
    const map =
      createTestMap();

    expect(
      getByakheeReachableSpaces(
        map,
        "b",
        10,
      ),
    ).toEqual([
      "a",
      "c",
      "d",
      "e",
    ]);
  });

  it("returns no spaces when the starting space does not exist", () => {
    const map =
      createTestMap();

    expect(
      getByakheeReachableSpaces(
        map,
        "missing",
      ),
    ).toEqual([]);
  });

  it("ignores paths to spaces that do not exist in the map", () => {
    const map =
      createTestMap();

    map.spaces[0].paths = [
      {
        toSpaceId: "missing",
        type: "uncharted",
      },
    ];

    expect(
      getByakheeReachableSpaces(
        map,
        "a",
      ),
    ).toEqual([
      "missing",
    ]);
  });
});

describe("retreatDoom", () => {
  it("increases Doom when the Ancient One has not awakened", () => {
    const game =
      createTestGame();

    game.ancientOne.doom = 5;
    game.ancientOne.awakened = false;

    const result =
      retreatDoom(
        game,
        2,
      );

    expect(
      result.ancientOne.doom,
    ).toBe(7);
  });

  it("does nothing when the amount is zero", () => {
    const game =
      createTestGame();

    game.ancientOne.doom = 5;
    game.ancientOne.awakened = false;

    const result =
      retreatDoom(
        game,
        0,
      );

    expect(result).toBe(game);

    expect(
      result.ancientOne.doom,
    ).toBe(5);
  });

  it("does nothing when the amount is negative", () => {
    const game =
      createTestGame();

    game.ancientOne.doom = 5;
    game.ancientOne.awakened = false;

    const result =
      retreatDoom(
        game,
        -3,
      );

    expect(result).toBe(game);

    expect(
      result.ancientOne.doom,
    ).toBe(5);
  });

  it("does not retreat Doom after the Ancient One awakens", () => {
    const game =
      createTestGame();

    game.ancientOne.doom = 5;
    game.ancientOne.awakened = true;

    const result =
      retreatDoom(
        game,
        3,
      );

    expect(result).toBe(game);

    expect(
      result.ancientOne.doom,
    ).toBe(5);
  });

  it("does not mutate the original game when Doom retreats", () => {
    const game =
      createTestGame();

    game.ancientOne.doom = 4;
    game.ancientOne.awakened = false;

    const result =
      retreatDoom(
        game,
        2,
      );

    expect(
      game.ancientOne.doom,
    ).toBe(4);

    expect(
      result.ancientOne.doom,
    ).toBe(6);
  });
});

describe("revealEncounter", () => {
  it("throws when there is no active Encounter", () => {
    const game =
      createTestGame();

    game.currentEncounterId =
      null;

    expect(() =>
      revealEncounter(game),
    ).toThrow(
      "There is no active Encounter.",
    );
  });

  it("throws when the active Encounter does not exist", () => {
    const game =
      createTestGame();

    game.currentEncounterId =
      "encounter-missing";

    expect(() =>
      revealEncounter(game),
    ).toThrow(
      'Encounter "encounter-missing" does not exist.',
    );
  });

  it("returns the game unchanged when the Encounter is already revealed", () => {
    const game =
      createTestGame();

    game.currentEncounterId =
      "encounter-test";

    game.currentEncounterRevealed =
      true;

    game.encounters = {
      "encounter-test": {
        id: "encounter-test",
        name: "Test Encounter",
        text: "Already revealed.",
      },
    };

    const result =
      revealEncounter(game);

    expect(result).toBe(game);
  });

  it("reveals an Encounter with choices and creates a choice decision", () => {
    const game =
      createTestGame();

    game.currentEncounterId =
      "encounter-test";

    game.currentEncounterRevealed =
      false;

    game.encounters = {
      "encounter-test": {
        id: "encounter-test",
        name: "Test Encounter",
        text: "Choose what to do.",
        frontImage: "/front.png",
        backImage: "/back.png",
        choices: [
          {
            text: "Search",
            effects: [],
          },
          {
            text: "Leave",
            effects: [],
          },
        ],
      },
    };

    const result =
      revealEncounter(game);

    expect(
      result.currentEncounterRevealed,
    ).toBe(true);

    expect(
      result.pendingDecision,
    ).toEqual({
      type: "choice",
      title: "Test Encounter",
      message: "Choose what to do.",
      image: "/back.png",
      options: [
        {
          id: "0",
          title: "Search",
          description:
            "Choose this action to resolve the Encounter.",
        },
        {
          id: "1",
          title: "Leave",
          description:
            "Choose this action to resolve the Encounter.",
        },
      ],
      source: "encounter:encounter-test",
    });
  });

  it("uses frontImage when an Encounter has no backImage", () => {
    const game =
      createTestGame();

    game.currentEncounterId =
      "encounter-test";

    game.encounters = {
      "encounter-test": {
        id: "encounter-test",
        name: "Test Encounter",
        text: "Resolve this.",
        frontImage: "/front.png",
      },
    };

    const result =
      revealEncounter(game);

    expect(
      result.currentEncounterRevealed,
    ).toBe(true);

    expect(
      result.pendingDecision,
    ).toEqual({
      type: "continue",
      title: "Test Encounter",
      message: "Resolve this.",
      image: "/front.png",
      source: "encounter:encounter-test",
    });
  });

  it("creates a continue decision for an Encounter without choices", () => {
    const game =
      createTestGame();

    game.currentEncounterId =
      "encounter-test";

    game.encounters = {
      "encounter-test": {
        id: "encounter-test",
        name: "Test Encounter",
        initialText:
          "Resolve the Encounter.",
        backImage: "/back.png",
        choices: [],
      },
    };

    const result =
      revealEncounter(game);

    expect(
      result.currentEncounterRevealed,
    ).toBe(true);

    expect(
      result.pendingDecision,
    ).toEqual({
      type: "continue",
      title: "Test Encounter",
      message:
        "Resolve the Encounter.",
      image: "/back.png",
      source: "encounter:encounter-test",
    });
  });

  it("uses the fallback message when the Encounter has no text", () => {
    const game =
      createTestGame();

    game.currentEncounterId =
      "encounter-test";

    game.encounters = {
      "encounter-test": {
        id: "encounter-test",
        name: "Test Encounter",
      },
    };

    const result =
      revealEncounter(game);

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type: "continue",
      message:
        "Resolve this Encounter.",
    });
  });

  it("uses the fallback choice message when a choice Encounter has no text", () => {
    const game =
      createTestGame();

    game.currentEncounterId =
      "encounter-test";

    game.encounters = {
      "encounter-test": {
        id: "encounter-test",
        name: "Test Encounter",
        choices: [
          {
            text: "Choose",
            effects: [],
          },
        ],
      },
    };

    const result =
      revealEncounter(game);

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type: "choice",
      message:
        "Choose an action.",
    });
  });
});

describe("startCombatOrder", () => {
  it("throws when fewer than two Monsters are provided", () => {
    const game =
      createTestGame();

    expect(() =>
      startCombatOrder(
        game,
        [
          "monster-1",
        ],
      ),
    ).toThrow(
      "Combat order requires at least two Monsters.",
    );
  });

  it("throws when no Monsters are provided", () => {
    const game =
      createTestGame();

    expect(() =>
      startCombatOrder(
        game,
        [],
      ),
    ).toThrow(
      "Combat order requires at least two Monsters.",
    );
  });

  it("creates a combat-order pending decision", () => {
    const game =
      createTestGame();

    const result =
      startCombatOrder(
        game,
        [
          "monster-1",
          "monster-2",
          "monster-3",
        ],
      );

    expect(
      result.pendingDecision,
    ).toEqual({
      type: "combat-order",
      title:
        "CHOOSE COMBAT ORDER",
      message:
        "Choose the order in which the Monsters will be encountered.",
      monsterIds: [
        "monster-1",
        "monster-2",
        "monster-3",
      ],
      orderedMonsterIds: [],
      source: "combat-order",
    });
  });

  it("does not mutate the original game", () => {
    const game =
      createTestGame();

    const result =
      startCombatOrder(
        game,
        [
          "monster-1",
          "monster-2",
        ],
      );

    expect(
      game.pendingDecision,
    ).toEqual({
      type: "test",
    });

    expect(
      result.pendingDecision,
    ).not.toBe(
      game.pendingDecision,
    );
  });
});