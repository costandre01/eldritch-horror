import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createInvestigator,
} from "../engine/createInvestigator";

import {
  createMonster,
} from "../engine/createMonster";

import {
  akachiOnyele,
} from "../../content/core/investigators/akachiOnyele";

import {
  CORE_MONSTERS,
} from "../../content/core/coreMonsters";

import type {
  InvestigatorDefinition,
} from "../models/InvestigatorDefinition";

describe("createInvestigator", () => {
  it("creates an investigator using the definition defaults", () => {
    const investigator =
      createInvestigator({
        definition:
          akachiOnyele,
      });

    expect(investigator.id).toBe(
      "akachi-onyele-001",
    );

    expect(investigator.definitionId).toBe(
      "akachi-onyele",
    );

    expect(investigator.health).toBe(5);
    expect(investigator.maxHealth).toBe(5);

    expect(investigator.sanity).toBe(7);
    expect(investigator.maxSanity).toBe(7);

    expect(investigator.skills).toEqual(
      akachiOnyele.skills,
    );

    expect(investigator.clues).toBe(1);

    expect(investigator.spaceId).toBe(
      "space-15",
    );

    expect(investigator.resources).toBe(0);

    expect(investigator.trainTickets).toBe(0);
    expect(investigator.shipTickets).toBe(0);
    expect(investigator.travelMoves).toBe(0);
    expect(investigator.travelActive).toBe(false);

    expect(
      investigator.travelStartSpaceId,
    ).toBe(null);

    expect(investigator.travelHistory).toEqual(
      [],
    );

    expect(
      investigator.engagedMonsterIds,
    ).toEqual([]);

    expect(investigator.isDelayed).toBe(false);
    expect(investigator.isDefeated).toBe(false);

    expect(investigator.assetIds).toEqual(
      akachiOnyele.startingAssetIds,
    );

    expect(investigator.spellIds).toEqual(
      akachiOnyele.startingSpellIds,
    );

    expect(investigator.artifactIds).toEqual(
      [],
    );

    expect(investigator.conditionIds).toEqual(
      [],
    );

    expect(investigator.actionsPerformed).toEqual(
      [],
    );

    expect(
      investigator.personalStoryProgress,
    ).toBe(0);
  });

  it("uses the specified instance number in the investigator id", () => {
    const investigator =
      createInvestigator({
        definition:
          akachiOnyele,
        instanceNumber: 7,
      });

    expect(investigator.id).toBe(
      "akachi-onyele-007",
    );
  });

  it("uses the default instance number when it is not provided", () => {
    const investigator =
      createInvestigator({
        definition:
          akachiOnyele,
      });

    expect(investigator.id).toBe(
      "akachi-onyele-001",
    );
  });

  it("allows starting spells to be overridden", () => {
    const investigator =
      createInvestigator({
        definition:
          akachiOnyele,
        startingSpellIds: [
          "spell-test-1",
          "spell-test-2",
        ],
      });

    expect(investigator.spellIds).toEqual([
      "spell-test-1",
      "spell-test-2",
    ]);
  });

  it("copies mutable definition arrays and skills into the investigator state", () => {
    const definition: InvestigatorDefinition = {
      ...akachiOnyele,

      skills: {
        ...akachiOnyele.skills,
      },

      startingAssetIds: [
        "asset-test",
      ],

      startingSpellIds: [
        "spell-test",
      ],
    };

    const investigator =
      createInvestigator({
        definition,
      });

    expect(investigator.skills).not.toBe(
      definition.skills,
    );

    expect(
      investigator.assetIds,
    ).not.toBe(
      definition.startingAssetIds,
    );

    expect(
      investigator.spellIds,
    ).not.toBe(
      definition.startingSpellIds,
    );

    expect(investigator.skills).toEqual(
      definition.skills,
    );

    expect(investigator.assetIds).toEqual([
      "asset-test",
    ]);

    expect(investigator.spellIds).toEqual([
      "spell-test",
    ]);
  });
});

describe("createMonster", () => {
  const cultist =
    CORE_MONSTERS.find(
      (monster) =>
        monster.id === "cultist",
    );

  const byakhee =
    CORE_MONSTERS.find(
      (monster) =>
        monster.id === "byakhee",
    );

  const epicMonster = {
    ...CORE_MONSTERS[0],
    id: "test-epic-monster",
    epic: true,
    quantity: 0,
  };

  it("creates a normal monster with the expected initial state", () => {
    if (!cultist) {
      throw new Error(
        "Cultist definition was not found.",
      );
    }

    const monster =
      createMonster(
        cultist,
        1,
      );

    expect(monster.id).toBe(
      "cultist-1",
    );

    expect(monster.definitionId).toBe(
      "cultist",
    );

    expect(monster.health).toBe(0);

    expect(monster.spaceId).toBe(
      null,
    );

    expect(
      monster.engagedInvestigatorId,
    ).toBe(null);

    expect(monster.isEpic).toBe(false);
  });

  it("creates the requested monster instance number within the available quantity", () => {
    if (!byakhee) {
      throw new Error(
        "Byakhee definition was not found.",
      );
    }

    const monster =
      createMonster(
        byakhee,
        byakhee.quantity,
      );

    expect(monster.id).toBe(
      `byakhee-${byakhee.quantity}`,
    );

    expect(monster.definitionId).toBe(
      "byakhee",
    );
  });

  it("rejects an instance number below 1", () => {
    if (!cultist) {
      throw new Error(
        "Cultist definition was not found.",
      );
    }

    expect(() =>
      createMonster(
        cultist,
        0,
      ),
    ).toThrow(
      "Monster instance number must be at least 1.",
    );

    expect(() =>
      createMonster(
        cultist,
        -1,
      ),
    ).toThrow(
      "Monster instance number must be at least 1.",
    );
  });

  it("rejects a normal monster instance above its physical quantity", () => {
    if (!cultist) {
      throw new Error(
        "Cultist definition was not found.",
      );
    }

    expect(() =>
      createMonster(
        cultist,
        cultist.quantity + 1,
      ),
    ).toThrow(
      `Cannot create Monster "${cultist.id}" instance ${cultist.quantity + 1}. The definition only contains ${cultist.quantity} physical copies.`,
    );
  });

  it("allows an instance up to the physical quantity", () => {
    if (!cultist) {
      throw new Error(
        "Cultist definition was not found.",
      );
    }

    const monster =
      createMonster(
        cultist,
        cultist.quantity,
      );

    expect(monster.id).toBe(
      `cultist-${cultist.quantity}`,
    );
  });

  it("allows epic monsters even when the instance exceeds quantity", () => {
    const monster =
      createMonster(
        epicMonster,
        10,
      );

    expect(monster.id).toBe(
      "test-epic-monster-10",
    );

    expect(monster.definitionId).toBe(
      "test-epic-monster",
    );

    expect(monster.isEpic).toBe(true);
  });
});