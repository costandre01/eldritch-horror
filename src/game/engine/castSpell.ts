import type { GameState } from "../models/GameState";
import type { Skill } from "../models/Investigator";
import type { MapDefinition } from "../models/MapDefinition";

import { performTest } from "./performTest";

export interface CastSpellOptions {
  game: GameState;

  investigatorId: string;

  spellId: string;

  skill: Skill;

  modifier: number;
}

export interface CastSpellResult {
  game: GameState;

  testPassed: boolean;

  testResults: number[];

  successes: number;
}

export function castSpell(
  options: CastSpellOptions,
  map: MapDefinition,
): CastSpellResult {
  const {
    game,
    investigatorId,
    spellId,
    skill,
    modifier,
  } = options;

  /*
   * ============================================================
   * INVESTIGATOR
   * ============================================================
   */

  const investigator =
    game.investigators[
      investigatorId
    ];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * SPELL
   * ============================================================
   */

  const spell =
    game.spells[spellId];

  if (!spell) {
    throw new Error(
      `Spell "${spellId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * OWNERSHIP
   * ============================================================
   */

  if (
    !investigator.spellIds.includes(
      spellId,
    )
  ) {
    throw new Error(
      `Spell "${spellId}" does not belong to investigator "${investigatorId}".`,
    );
  }

  /*
   * ============================================================
   * SPELL STATE
   * ============================================================
   */

  if (spell.flipped) {
    throw new Error(
      "This Spell is currently on its back side.",
    );
  }

  /*
   * ============================================================
   * TEST
   * ============================================================
   */

  const result =
    performTest(
      game,
      investigatorId,
      skill,
      modifier,
      1,
      map,
    );

  /*
   * ============================================================
   * SAVE TEST RESULT ON SPELL
   * ============================================================
   */

  const updatedSpell = {
    ...result.game.spells[
      spellId
    ],

    pendingTestResult:
      result.test,

    flipped: true,
  };

  const updatedGame: GameState = {
    ...result.game,

    spells: {
      ...result.game.spells,

      [spellId]:
        updatedSpell,
    },
  };

  return {
    game: updatedGame,

    testPassed:
      result.test.passed,

    testResults:
      result.test.results,

    successes:
      result.test.successes,
  };
}