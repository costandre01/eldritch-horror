import type { GameState } from "../models/GameState";
import type { DarkPowerResume } from "../models/PendingDecision";

import { startMonsterCombat } from "./startMonsterCombat";

import { easyMythos } from "../../content/core/mythos/easyMythos";
import { normalMythos } from "../../content/core/mythos/normalMythos";
import { hardMythos } from "../../content/core/mythos/hardMythos";

export function continueDarkPower(
  game: GameState,
  resume: DarkPowerResume,
): GameState {
  /*
   * ==========================================================
   * FIND NEXT INVESTIGATOR
   * ==========================================================
   *
   * The current Investigator has finished resolving
   * A Dark Power.
   *
   * This can happen because:
   *
   * - all of their Monsters were encountered; or
   * - the Investigator was defeated.
   *
   * Continue with the next Investigator from the original
   * Investigator snapshot who still has Monsters on their
   * current space.
   */

  let nextInvestigatorIndex =
    resume.currentInvestigatorIndex + 1;

  while (
    nextInvestigatorIndex <
    resume.investigatorIds.length
  ) {
    const nextInvestigatorId =
      resume.investigatorIds[
        nextInvestigatorIndex
      ];

    if (!nextInvestigatorId) {
      nextInvestigatorIndex++;
      continue;
    }

    const nextInvestigator =
      game.investigators[
        nextInvestigatorId
      ];

    /*
     * A defeated Investigator must not resolve
     * A Dark Power again.
     */
    if (
      !nextInvestigator ||
      nextInvestigator.isDefeated ||
      !nextInvestigator.spaceId
    ) {
      nextInvestigatorIndex++;
      continue;
    }

    const nextSpace =
      game.board.spaces[
        nextInvestigator.spaceId
      ];

    if (!nextSpace) {
      nextInvestigatorIndex++;
      continue;
    }

    const nextMonsterIds =
      nextSpace.monsterIds.filter(
        (monsterId) =>
          game.monsters[
            monsterId
          ] !== undefined,
      );

    if (nextMonsterIds.length > 0) {
      const nextResume: DarkPowerResume = {
        type: "mythos-dark-power",

        investigatorIds:
          resume.investigatorIds,

        currentInvestigatorIndex:
          nextInvestigatorIndex,

        monsterIds:
          nextMonsterIds,

        resolvedMonsterIds: [],
      };

      /*
       * ========================================================
       * ONE MONSTER
       * ========================================================
       */

      if (nextMonsterIds.length === 1) {
        const nextMonsterId =
          nextMonsterIds[0];

        if (!nextMonsterId) {
          throw new Error(
            "A Dark Power could not determine the next Monster.",
          );
        }

        return startMonsterCombat(
          {
            ...game,

            activeInvestigatorId:
              nextInvestigatorId,

            pendingDecision:
              null,

            combatOrder:
              null,
          },
          nextMonsterId,
          nextResume,
        );
      }

      /*
       * ========================================================
       * MULTIPLE MONSTERS
       * ========================================================
       *
       * The Investigator chooses the order in which the
       * Monsters are encountered.
       */

      return {
        ...game,

        activeInvestigatorId:
          nextInvestigatorId,

        combatOrder:
          null,

        pendingDecision: {
          type: "combat-order",

          title:
            "A Dark Power — Combat Order",

          message:
            "Choose the order in which you will encounter the Monsters on your space.",

          monsterIds:
            nextMonsterIds,

          orderedMonsterIds: [],

          source:
            "combat-order",

          resume:
            nextResume,
        },
      };
    }

    nextInvestigatorIndex++;
  }

  /*
   * ==========================================================
   * A DARK POWER FINISHED
   * ==========================================================
   *
   * Every applicable Investigator has finished resolving
   * the Mythos effect.
   */

  const currentMythos =
    [
      ...easyMythos,
      ...normalMythos,
      ...hardMythos,
    ].find(
      (mythos) =>
        mythos.id ===
        game.currentMythosId,
    );

  if (!currentMythos) {
    throw new Error(
      "A Dark Power could not find the current Mythos card.",
    );
  }

  return {
    ...game,

    board: {
      ...game.board,

      mythosDiscard: [
        ...game.board.mythosDiscard,
        currentMythos,
      ],
    },

    currentMythosId:
      null,

    activeInvestigatorId:
      null,

    pendingDecision:
      null,

    combatOrder:
      null,
  };
}