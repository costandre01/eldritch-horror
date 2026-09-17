import type { GameState } from "../../models/GameState";
import type { PendingDecision } from "../../models/PendingDecision";

import { startCombatTest } from "../startCombatTest";

export type MonsterAbilityAction =
  | "resolve"
  | "skip";

export function resolveMonsterAbility(
  game: GameState,
  decision: Extract<
    PendingDecision,
    { type: "monster-ability" }
  >,
  action: MonsterAbilityAction,
): GameState {
  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    throw new Error(
      "There is no active investigator.",
    );
  }

  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * RIOT
   * ============================================================
   *
   * Attempt to disperse the mob before combat.
   *
   * Resolve:
   * -> create Influence test
   *
   * Skip:
   * -> go directly to Strength Test
   */

  if (
    decision.ability.type ===
    "attempt-disperse-mob-before-combat"
  ) {
    /*
     * ----------------------------------------------------------
     * ATTEMPT DISPERSAL
     * ----------------------------------------------------------
     */

    if (action === "resolve") {
      const testDecision: PendingDecision = {
        type: "test",

        title:
          "Disperse the Mob",

        message:
          "Attempt to disperse the Riot before combat.",

        skill:
          decision.ability.skill,

        modifier:
          decision.ability.modifier,

        investigatorId,

        source:
          `monster-ability-test:attempt-disperse:${decision.monsterId}`,

        resume: decision.resume,
      };

      return {
        ...game,

        pendingDecision:
          testDecision,

        lastTest:
          null,
      };
    }

    /*
     * ----------------------------------------------------------
     * SKIP
     * ----------------------------------------------------------
     *
     * Riot has no Horror Test.
     * Go directly to Strength.
     */

    return startCombatTest(
      {
        ...game,

        pendingDecision:
          null,
      },
      decision.monsterId,
      "strength",
      decision.resume,
    );
  }

  /*
   * ============================================================
   * WIND-WALKER
   * ============================================================
   *
   * Resolve:
   * -> spend 1 Clue
   * -> continue to Horror Test
   *
   * Skip:
   * -> lose 1 Health and 1 Sanity
   * -> continue to Horror Test
   */

  if (
    decision.ability.type ===
    "lose-health-and-sanity-unless-spend-clue"
  ) {
    /*
     * ----------------------------------------------------------
     * SPEND CLUE
     * ----------------------------------------------------------
     */

    if (action === "resolve") {
      if (
        investigator.clues <= 0
      ) {
        /*
         * Preserve current behaviour:
         * nothing happens if there is no Clue.
         */

        return game;
      }

      const updatedInvestigator = {
        ...investigator,

        clues:
          investigator.clues - 1,
      };

      const gameWithoutAbility: GameState = {
        ...game,

        investigators: {
          ...game.investigators,

          [investigatorId]:
            updatedInvestigator,
        },

        pendingDecision:
          null,
      };

      return startCombatTest(
        gameWithoutAbility,
        decision.monsterId,
        "horror",
        decision.resume,
      );
    }

    /*
     * ----------------------------------------------------------
     * SKIP / DO NOT SPEND CLUE
     * ----------------------------------------------------------
     */

    const newHealth =
      Math.max(
        0,
        investigator.health - 1,
      );

    const newSanity =
      Math.max(
        0,
        investigator.sanity - 1,
      );

    const updatedGame: GameState = {
      ...game,

      investigators: {
        ...game.investigators,

        [investigatorId]: {
          ...investigator,

          health:
            newHealth,

          sanity:
            newSanity,
        },
      },

      pendingDecision:
        null,
    };

    /*
     * Investigator defeated.
     */

    if (
      newHealth <= 0 ||
      newSanity <= 0
    ) {
      return {
        ...updatedGame,

        pendingDecision: {
          type: "continue",

          title:
            "INVESTIGATOR DEFEATED",

          message:
            "The investigator has lost all Health or Sanity.",

          source:
            `combat-defeat:${investigatorId}`,

          resume:
            decision.resume,
        },
      };
    }

    /*
     * Continue to Horror Test.
     */

    return startCombatTest(
      updatedGame,
      decision.monsterId,
      "horror",
      decision.resume,
    );
  }

  /*
   * ============================================================
   * UNSUPPORTED ABILITY
   * ============================================================
   */

  throw new Error(
    `Unsupported monster ability: ${decision.ability.type}`,
  );
}