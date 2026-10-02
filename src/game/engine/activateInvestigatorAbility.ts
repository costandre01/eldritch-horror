import type { GameState } from "../models/GameState";

import { canPerformAction } from "./canPerformAction";

/*
 * ============================================================
 * ACTIVATE INVESTIGATOR ABILITY
 * ============================================================
 *
 * Central entry point for Investigator Action abilities.
 *
 * Each Investigator ability should:
 *
 * - validate that the Investigator can act;
 * - respect the normal Action Phase rules;
 * - count as a Component Action;
 * - prevent the same Component Action being used twice
 *   during the same round;
 * - create a Pending Decision whenever player input
 *   is required.
 */

export function activateInvestigatorAbility(
  game: GameState,
  abilityId: string,
): GameState {
  /*
   * ==========================================================
   * ACTIVE INVESTIGATOR
   * ==========================================================
   */

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
   * ==========================================================
   * GENERAL VALIDATION
   * ==========================================================
   */

  if (game.phase !== "action") {
    throw new Error(
      "Investigator Action abilities can only be used during the Action phase.",
    );
  }

  if (game.pendingDecision) {
    throw new Error(
      "A pending decision must be resolved first.",
    );
  }

  if (game.pendingEncounterChoice) {
    throw new Error(
      "A pending Encounter choice must be resolved first.",
    );
  }

  if (investigator.travelActive) {
    throw new Error(
      "Finish the current travel before performing an Investigator Action ability.",
    );
  }

  /*
   * Investigator abilities are Component Actions.
   *
   * This means they still consume one of the Investigator's
   * available actions, but different Component Actions may be
   * performed during the same round.
   */

  if (
    !canPerformAction(
      investigator,
      "component",
    )
  ) {
    throw new Error(
      "Investigator cannot perform another action this round.",
    );
  }

  /*
   * ==========================================================
   * COMPONENT ACTION KEY
   * ==========================================================
   */

  const componentActionKey =
    `investigator:${abilityId}`;

  if (
    investigator
      .componentActionsUsedThisRound
      ?.includes(componentActionKey)
  ) {
    throw new Error(
      "This Investigator Action ability was already used this round.",
    );
  }

  /*
   * ==========================================================
   * AKACHI ONYELE — GATE INSIGHT
   * ==========================================================
   *
   * Action:
   *
   * Look at the top 2 Gates in the Gate stack.
   * Put 1 Gate on the top of the Gate stack,
   * and the other on the bottom.
   */

  if (abilityId === "akachi-action") {
    if (
      investigator.definitionId !==
      "akachi-onyele"
    ) {
      throw new Error(
        "Only Akachi Onyele can use Gate Insight.",
      );
    }

    const topGates =
      game.board.gateStack.slice(0, 2);

    /*
     * Normally the Gate stack contains enough Gates.
     *
     * However, do not consume Akachi's Action if there
     * are fewer than 2 Gates available to resolve the
     * ability.
     */

    if (topGates.length < 2) {
      throw new Error(
        "Gate Insight requires at least 2 Gates in the Gate stack.",
      );
    }

    const updatedInvestigator = {
      ...investigator,

      actionsPerformed: [
        ...investigator.actionsPerformed,
        "component" as const,
      ],

      componentActionsUsedThisRound: [
        ...(
          investigator
            .componentActionsUsedThisRound ??
          []
        ),

        componentActionKey,
      ],
    };

    return {
      ...game,

      investigators: {
        ...game.investigators,

        [investigatorId]:
          updatedInvestigator,
      },

      /*
       * The player chooses which of the two Gates remains
       * on top.
       *
       * The other Gate will later be moved to the bottom
       * by the resolver.
       */

      pendingDecision: {
        type: "choice",

        title:
          "Gate Insight",

        message:
          "Look at the top 2 Gates in the Gate stack. Choose the Gate to leave on top. The other Gate will be placed on the bottom of the Gate stack.",

        source:
          "investigator-ability:akachi-action",

        options:
          topGates.map(
            (gate) => ({
              id:
                `akachi-gate:${gate.id}`,

              title:
                gate.spaceId,

              description:
                `Omen: ${gate.omen}`,
            }),
          ),
      },
    };
  }

  /*
   * ==========================================================
   * UNKNOWN / NOT YET IMPLEMENTED
   * ==========================================================
   */

  throw new Error(
    `Investigator ability "${abilityId}" is not implemented.`,
  );
}