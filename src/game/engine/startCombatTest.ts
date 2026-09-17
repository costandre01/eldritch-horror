import type { GameState } from "../models/GameState";

import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../content/core/coreEpicMonsters";
import type { MonsterReckoningResume } from "../models/PendingDecision";

type CombatTestStage =
  | "horror"
  | "strength";

export function startCombatTest(
  game: GameState,
  monsterId: string,
  stage: CombatTestStage,
  resume?: MonsterReckoningResume,
): GameState {
  const monster =
    game.monsters[monsterId];

  if (!monster) {
    throw new Error(
      `Monster "${monsterId}" does not exist.`,
    );
  }

  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    throw new Error(
      "There is no active investigator.",
    );
  }

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
   * MONSTER DEFINITION
   * ============================================================
   */

  const definition =
    CORE_MONSTERS.find(
      (item) =>
        item.id ===
        monster.definitionId,
    ) ??
    CORE_EPIC_MONSTERS.find(
      (item) =>
        item.id ===
        monster.definitionId,
    );

  if (!definition) {
    throw new Error(
      `Monster definition "${monster.definitionId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * TEST
   * ============================================================
   */

  const test =
    stage === "horror"
      ? definition.horrorTest
      : definition.combatTest;

  /*
   * ============================================================
   * NO HORROR TEST
   * ============================================================
   *
   * Some monsters only have a Strength Test.
   *
   * In that case we skip Horror completely.
   */

  if (!test) {
    if (stage === "horror") {
      if (!definition.combatTest) {
        throw new Error(
          `Monster "${definition.name}" has no combat test.`,
        );
      }

      return startCombatTest(
        game,
        monsterId,
        "strength",
        resume,
      );
    }

    throw new Error(
      `Monster "${definition.name}" has no Strength Test.`,
    );
  }

  /*
   * ============================================================
   * CREATE TEST DECISION
   * ============================================================
   */

  return {
    ...game,

    pendingDecision: {
      type: "test",

      title:
        stage === "horror"
          ? "HORROR TEST"
          : "STRENGTH TEST",

      message:
        stage === "horror"
          ? `Resolve the Horror Test using ${test.skill}.`
          : `Resolve the Strength Test using ${test.skill}.`,

      skill:
        test.skill,

      modifier:
        test.modifier,

      investigatorId,

      source:
        `combat:${stage}:${monsterId}`,

      resume,
    },
  };
}