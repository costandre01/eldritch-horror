import { describe, expect, it } from "vitest";

import type { SpellDefinition } from "../models/SpellDefinition";

import { createSpell } from "../engine/createSpell";

function makeDefinition(
  overrides: Partial<SpellDefinition> = {},
): SpellDefinition {
  return {
    id: "spell-test",
    name: "Test Spell",
    type: "incantation",
    description: "Test spell",
    loreBonus: 0,
    abilityIds: [],
    frontEffects: [],
    backs: [
      {
        id: "test-back-1",
        frontImage: "/test/front-1.png",
        backImage: "/test/back-1.png",
        effects: [],
      },
      {
        id: "test-back-2",
        frontImage: "/test/front-2.png",
        backImage: "/test/back-2.png",
        effects: [],
      },
    ],
    ...overrides,
  };
}

describe("createSpell", () => {
  it("creates a spell using the back corresponding to the instance number", () => {
    const definition = makeDefinition();

    const spell = createSpell(
      definition,
      1,
    );

    expect(spell).toEqual({
      id: "spell-test-001",
      definitionId: "spell-test",
      instanceNumber: 1,
      type: "incantation",
      frontImage: "/test/front-1.png",
      backImage: "/test/back-1.png",
      backId: "test-back-1",
      flipped: false,
      exhausted: false,
      pendingTestResult: null,
      pendingChosenInvestigatorId: null,
    });
  });

  it("uses the second back for the second instance", () => {
    const definition = makeDefinition();

    const spell = createSpell(
      definition,
      2,
    );

    expect(spell.id).toBe(
      "spell-test-002",
    );

    expect(spell.instanceNumber).toBe(2);

    expect(spell.backId).toBe(
      "test-back-2",
    );

    expect(spell.frontImage).toBe(
      "/test/front-2.png",
    );

    expect(spell.backImage).toBe(
      "/test/back-2.png",
    );
  });

  it("uses the explicitly supplied backId", () => {
    const definition = makeDefinition();

    const spell = createSpell(
      definition,
      1,
      "test-back-2",
    );

    expect(spell.backId).toBe(
      "test-back-2",
    );

    expect(spell.frontImage).toBe(
      "/test/front-2.png",
    );

    expect(spell.backImage).toBe(
      "/test/back-2.png",
    );
  });

  it("falls back to the first back when the instance number has no corresponding back", () => {
    const definition = makeDefinition();

    const spell = createSpell(
      definition,
      10,
    );

    expect(spell.backId).toBe(
      "test-back-1",
    );

    expect(spell.frontImage).toBe(
      "/test/front-1.png",
    );
  });

  it("throws when the spell has no back definitions", () => {
    const definition = makeDefinition({
      backs: [],
    });

    expect(() =>
      createSpell(
        definition,
        1,
      ),
    ).toThrow(
      'Spell "spell-test" has no back definition.',
    );
  });

  it("throws when the supplied backId does not exist", () => {
    const definition = makeDefinition();

    expect(() =>
      createSpell(
        definition,
        1,
        "back-does-not-exist",
      ),
    ).toThrow(
      'Back "back-does-not-exist" does not exist for Spell "spell-test".',
    );
  });
});