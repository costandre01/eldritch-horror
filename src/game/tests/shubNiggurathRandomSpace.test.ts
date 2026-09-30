import { describe, expect, it } from "vitest";

import { resolveAncientOneReckoning } from "../engine/resolveAncientOneReckoning";
import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";

import { createTestGame } from "./helpers/createTestGame";
import { createMonster } from "../engine/createMonster";
import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { resolveEncounterSpaceSelection } from "../engine/resolveEncounterSpaceSelection";

describe("Shub-Niggurath random space", () => {
  it("asks the Lead Investigator to choose a space when no Clues are available", () => {
    const game = createTestGame();

    game.ancientOne = {
      ...game.ancientOne,

      id: "shub-niggurath",
      name: "Shub-Niggurath",

      doom: 13,
      omenPosition: 0,

      awakened: false,
    };

    game.board = {
      ...game.board,

      cluePool: [],
      clueDiscard: [],

      monsterCup: [],
      monsterDiscard: [],
    };

    game.pendingDecision = {
      type: "mythos-ancient-one-reckoning",

      title: "ANCIENT ONE RECKONING",

      ancientOneId: "shub-niggurath",

      reckoningStage: "front",

      abilityIndex: 0,

      source: "mythos:ancient-one-reckoning",

      nextIconIndex: 2,
    };

    const result = resolveAncientOneReckoning(game, eldritchBaseMap);

    expect(result.pendingDecision?.type).toBe("select-space");

    if (
      !result.pendingDecision ||
      result.pendingDecision.type !== "select-space"
    ) {
      throw new Error("Expected a select-space decision.");
    }

    expect(result.pendingDecision.spaceIds).toEqual(
      eldritchBaseMap.spaces.map((space) => space.id),
    );

    expect(result.pendingDecision.resume).toEqual({
      type: "ancient-one-shub-random-space",

      nextIconIndex: 2,

      ancientOneAbilityIndex: 0,

      ancientOneId: "shub-niggurath",

      ancientOneReckoningStage: "front",
    });
  });

  it("spawns the Monster on the space chosen by the Lead Investigator", () => {
    const game = createTestGame();

    game.ancientOne = {
      ...game.ancientOne,

      id: "shub-niggurath",
      name: "Shub-Niggurath",

      doom: 13,
      omenPosition: 0,

      awakened: false,
    };

    game.board = {
      ...game.board,

      cluePool: [],
      clueDiscard: [],
    };

    const monsterDefinition = CORE_MONSTERS.find(
      (monster) => monster.id === "cultist",
    );

    if (!monsterDefinition) {
      throw new Error("Cultist definition not found.");
    }

    game.board.monsterCup = [createMonster(monsterDefinition, 1)];

    const monster = game.board.monsterCup[0];

    if (!monster) {
      throw new Error("Test game contains no Monster in the Monster Cup.");
    }

    const selectedSpaceId = eldritchBaseMap.spaces[0]?.id;

    if (!selectedSpaceId) {
      throw new Error("Test map contains no spaces.");
    }

    game.board.spaces = {
      [selectedSpaceId]: {
        spaceId: selectedSpaceId,

        clues: 0,
        clueTokenIds: [],

        monsterIds: [],

        gates: [],

        expedition: false,
        rumor: false,

        eldritchTokenCount: 0,
      },
    };

    const cupSizeBefore = game.board.monsterCup.length;

    game.pendingDecision = {
      type: "select-space",

      title: "Choose a Space",

      message:
        "There are no Clues available to determine a random space. The Lead Investigator chooses a space.",

      spaceIds: eldritchBaseMap.spaces.map((space) => space.id),

      source: "ancient-one:shub-niggurath-random-space",

      onSpaceSelected: [],

      resume: {
        type: "ancient-one-shub-random-space",

        nextIconIndex: 2,

        ancientOneAbilityIndex: 0,

        ancientOneId: "shub-niggurath",

        ancientOneReckoningStage: "front",
      },
    };

    const result = resolveEncounterSpaceSelection(
      game,
      selectedSpaceId,
      eldritchBaseMap,
    );

    expect(result.board.monsterCup).toHaveLength(cupSizeBefore - 1);

    expect(result.board.spaces[selectedSpaceId]?.monsterIds).toContain(
      monster.id,
    );

    expect(result.monsters[monster.id]?.spaceId).toBe(selectedSpaceId);

    expect(result.pendingDecision?.type).toBe("mythos-ancient-one-reckoning");

    if (
      !result.pendingDecision ||
      result.pendingDecision.type !== "mythos-ancient-one-reckoning"
    ) {
      throw new Error("Expected Ancient One Reckoning to continue.");
    }

    expect(result.pendingDecision.abilityIndex).toBe(1);

    expect(result.pendingDecision.nextIconIndex).toBe(2);
  });

  it("uses a Clue to determine the random space and discards that Clue", () => {
    const game = createTestGame();

    game.ancientOne = {
      ...game.ancientOne,

      id: "shub-niggurath",
      name: "Shub-Niggurath",

      doom: 13,
      omenPosition: 0,

      awakened: false,
    };

    const monsterDefinition = CORE_MONSTERS.find(
      (monster) => monster.id === "cultist",
    );

    if (!monsterDefinition) {
      throw new Error("Cultist definition not found.");
    }

    const monster = createMonster(monsterDefinition, 1);

    const targetSpaceId = eldritchBaseMap.spaces[0]?.id;

    if (!targetSpaceId) {
      throw new Error("Test map contains no spaces.");
    }

    const clue = {
      id: `clue-${targetSpaceId}`,
      spaceId: targetSpaceId,
    };

    game.board = {
      ...game.board,

      cluePool: [clue],
      clueDiscard: [],

      monsterCup: [monster],
      monsterDiscard: [],

      spaces: {
        [targetSpaceId]: {
          spaceId: targetSpaceId,

          clues: 0,
          clueTokenIds: [],

          monsterIds: [],

          gates: [],

          expedition: false,
          rumor: false,

          eldritchTokenCount: 0,
        },
      },
    };

    game.pendingDecision = {
      type: "mythos-ancient-one-reckoning",

      title: "ANCIENT ONE RECKONING",

      ancientOneId: "shub-niggurath",

      reckoningStage: "front",

      abilityIndex: 0,

      source: "mythos:ancient-one-reckoning",

      nextIconIndex: 2,
    };

    const result = resolveAncientOneReckoning(game, eldritchBaseMap);

    /*
     * The Clue determines the random space.
     */

    expect(result.monsters[monster.id]?.spaceId).toBe(targetSpaceId);

    expect(result.board.spaces[targetSpaceId]?.monsterIds).toContain(
      monster.id,
    );

    /*
     * The Clue used for Random Space is discarded.
     */

    expect(result.board.cluePool).toHaveLength(0);

    expect(result.board.clueDiscard).toContainEqual(clue);

    /*
     * The Monster was removed from the Cup.
     */

    expect(result.board.monsterCup).toHaveLength(0);

    /*
     * Shub's Reckoning continues normally.
     */

    expect(result.pendingDecision?.type).toBe("mythos-ancient-one-reckoning");

    if (
      !result.pendingDecision ||
      result.pendingDecision.type !== "mythos-ancient-one-reckoning"
    ) {
      throw new Error("Expected Ancient One Reckoning to continue.");
    }

    expect(result.pendingDecision.abilityIndex).toBe(1);

    expect(result.pendingDecision.nextIconIndex).toBe(2);
  });

  it("advances Doom by 2 when the spawned Monster makes 10 Monsters on the board", () => {
    const game = createTestGame();

    game.ancientOne = {
      ...game.ancientOne,

      id: "shub-niggurath",
      name: "Shub-Niggurath",

      doom: 13,
      omenPosition: 0,

      awakened: false,
    };

    const targetSpaceId = eldritchBaseMap.spaces[0]?.id;

    if (!targetSpaceId) {
      throw new Error("Test map contains no spaces.");
    }

    /*
     * Create physical Monster instances using
     * the real quantities defined in CORE_MONSTERS.
     */

    const physicalMonsters = CORE_MONSTERS.flatMap((definition) =>
      Array.from(
        {
          length: definition.quantity,
        },
        (_, index) => createMonster(definition, index + 1),
      ),
    );

    if (physicalMonsters.length < 10) {
      throw new Error(
        "Core Monster pool contains fewer than 10 physical Monsters.",
      );
    }

    /*
     * Nine Monsters are already on the board.
     */

    const existingMonsters = physicalMonsters.slice(0, 9).map((monster) => ({
      ...monster,

      health: 1,
      spaceId: targetSpaceId,
      engagedInvestigatorId: null,
    }));

    /*
     * A different physical Monster is waiting
     * in the Cup and will become number 10.
     */

    const monsterToSpawn = physicalMonsters[9];

    if (!monsterToSpawn) {
      throw new Error("Could not create the tenth physical Monster.");
    }

    const clue = {
      id: `clue-${targetSpaceId}`,
      spaceId: targetSpaceId,
    };

    /*
     * Register the nine Monsters already
     * present on the board.
     */

    game.monsters = Object.fromEntries(
      existingMonsters.map((monster) => [monster.id, monster]),
    );

    game.board = {
      ...game.board,

      cluePool: [clue],
      clueDiscard: [],

      monsterCup: [monsterToSpawn],

      monsterDiscard: [],

      spaces: {
        [targetSpaceId]: {
          spaceId: targetSpaceId,

          clues: 0,
          clueTokenIds: [],

          monsterIds: existingMonsters.map((monster) => monster.id),

          gates: [],

          expedition: false,
          rumor: false,

          eldritchTokenCount: 0,
        },
      },
    };

    game.pendingDecision = {
      type: "mythos-ancient-one-reckoning",

      title: "ANCIENT ONE RECKONING",

      ancientOneId: "shub-niggurath",

      reckoningStage: "front",

      abilityIndex: 0,

      source: "mythos:ancient-one-reckoning",

      nextIconIndex: 2,
    };

    const doomBefore = game.ancientOne.doom;

    const result = resolveAncientOneReckoning(game, eldritchBaseMap);

    /*
     * There must now be exactly
     * 10 living Monsters on the board.
     */

    const monstersOnBoard = Object.values(result.monsters).filter(
      (monster) => monster.spaceId !== null && monster.health > 0,
    );

    expect(monstersOnBoard).toHaveLength(10);

    /*
     * Shub-Niggurath's effect advances
     * Doom by 2.
     */

    expect(result.ancientOne.doom).toBe(doomBefore - 2);

    /*
     * The tenth Monster must have been
     * spawned on the random space.
     */

    expect(result.monsters[monsterToSpawn.id]?.spaceId).toBe(targetSpaceId);

    expect(result.board.spaces[targetSpaceId]?.monsterIds).toContain(
      monsterToSpawn.id,
    );

    /*
     * The Clue used to determine the
     * random space must be discarded.
     */

    expect(result.board.cluePool).toHaveLength(0);

    expect(result.board.clueDiscard).toContainEqual(clue);

    /*
     * Reckoning continues with the
     * next Ancient One ability.
     */

    expect(result.pendingDecision?.type).toBe("mythos-ancient-one-reckoning");

    if (
      !result.pendingDecision ||
      result.pendingDecision.type !== "mythos-ancient-one-reckoning"
    ) {
      throw new Error("Expected Ancient One Reckoning to continue.");
    }

    expect(result.pendingDecision.abilityIndex).toBe(1);

    expect(result.pendingDecision.nextIconIndex).toBe(2);
  });
});
