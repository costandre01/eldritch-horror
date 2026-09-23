import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createTestGame,
} from "./helpers/createTestGame";

import {
  resolveMonsterToughness,
} from "../engine/resolveMonsterToughness";

import type {
  GameState,
} from "../models/GameState";

import type {
  MonsterDefinition,
} from "../models/Monster";

function createMonsterDefinition(
  toughness: MonsterDefinition["toughness"],
): MonsterDefinition {
  return {
    id:
      "test-monster",

    name:
      "Test Monster",

    epic:
      false,

    frontImage:
      "/test/front.jpg",

    backImage:
      "/test/back.jpg",

    horrorTest:
      null,

    combatTest:
      null,

    toughness,

    specialAbilities: [],

    quantity:
      1,
  };
}

describe(
  "resolveMonsterToughness",
  () => {
    it(
      "returns the fixed Toughness value",
      () => {
        const game =
          createTestGame();

        const definition =
          createMonsterDefinition({
            type:
              "fixed",

            value:
              5,
          });

        expect(
          resolveMonsterToughness(
            game,
            definition,
          ),
        ).toBe(5);
      },
    );

    it(
      "returns the number of Investigators plus the configured value",
      () => {
        const game =
          createTestGame();

        const definition =
          createMonsterDefinition({
            type:
              "investigators-plus",

            value:
              2,
          });

        expect(
          Object.keys(
            game.investigators,
          ),
        ).toHaveLength(3);

        expect(
          resolveMonsterToughness(
            game,
            definition,
          ),
        ).toBe(5);
      },
    );

    it(
      "supports investigators-plus with zero additional Toughness",
      () => {
        const game =
          createTestGame();

        const definition =
          createMonsterDefinition({
            type:
              "investigators-plus",

            value:
              0,
          });

        expect(
          resolveMonsterToughness(
            game,
            definition,
          ),
        ).toBe(3);
      },
    );

    it(
      "returns the active Ancient One Cultist front Toughness",
      () => {
        const game =
          createTestGame();

        game.ancientOne =
          {
            id:
              "cthulhu",
          } as GameState["ancientOne"];

        const definition =
          createMonsterDefinition({
            type:
              "ancient-one",
          });

        expect(
          resolveMonsterToughness(
            game,
            definition,
          ),
        ).toBe(1);
      },
    );

    it(
      "throws when the Ancient One definition does not exist",
      () => {
        const game =
          createTestGame();

        game.ancientOne =
          {
            id:
              "ancient-one-does-not-exist",
          } as GameState["ancientOne"];

        const definition =
          createMonsterDefinition({
            type:
              "ancient-one",
          });

        expect(() =>
          resolveMonsterToughness(
            game,
            definition,
          ),
        ).toThrow(
          "Ancient One definition not found: ancient-one-does-not-exist",
        );
      },
    );

    it(
      "returns the exhaustive-check value for an invalid runtime Toughness type",
      () => {
        const game =
          createTestGame();

        const invalidToughness =
          {
            type:
              "invalid-runtime-type",
          };

        const definition =
          createMonsterDefinition(
            invalidToughness as unknown as MonsterDefinition["toughness"],
          );

        expect(
          resolveMonsterToughness(
            game,
            definition,
          ),
        ).toBe(
          invalidToughness,
        );
      },
    );
  },
);