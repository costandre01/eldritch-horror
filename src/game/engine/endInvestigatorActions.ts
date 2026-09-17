import type { GameState } from "../models/GameState";
import { coreInvestigators } from "../../content/core/investigators";

export function endInvestigatorActions(
  game: GameState,
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

  if (game.phase !== "action") {
    throw new Error(
      "Investigator actions can only be ended during the Action phase.",
    );
  }

  if (investigator.travelActive) {
    throw new Error(
      "Cannot end investigator actions while Travel is active.",
    );
  }

  if (investigator.actionsPerformed.length < 2) {
    throw new Error(
      "Investigator has not performed both actions.",
    );
  }

  const currentIndex =
    game.investigatorTurnIndex;

  const nextIndex =
    currentIndex + 1;

  /*
   * ============================================================
   * MORE INVESTIGATORS
   * ============================================================
   */

  if (
    nextIndex <
    game.investigatorOrder.length
  ) {
    const nextInvestigatorId =
      game.investigatorOrder[nextIndex];

    const nextInvestigator =
      game.investigators[
        nextInvestigatorId
      ];

    if (!nextInvestigator) {
      throw new Error(
        `Investigator "${nextInvestigatorId}" does not exist.`,
      );
    }

    /*
     * ==========================================================
     * RESOLVE INVESTIGATOR DEFINITION
     * ==========================================================
     */

    const investigatorDefinition =
      coreInvestigators.find(
        (definition) =>
          definition.id ===
          nextInvestigator.definitionId,
      );

    const investigatorName =
      investigatorDefinition?.name ??
      nextInvestigator.definitionId;

    /*
     * ==========================================================
     * RESOLVE INVESTIGATOR IMAGE
     * ==========================================================
     */

    const investigatorImage =
      investigatorDefinition
        ? `/cards/investigators/${investigatorDefinition.name.replace(
            /\s+/g,
            "_",
          )}/${investigatorDefinition.name.replace(
            /\s+/g,
            "_",
          )}.png`
        : undefined;

    return {
      ...game,

      activeInvestigatorId:
        nextInvestigatorId,

      investigatorTurnIndex:
        nextIndex,

      pendingDecision: {
        type: "investigator-turn",

        title: "Action Phase",

        message:
          `É a vez de ${investigatorName}.`,

        investigatorId:
          nextInvestigatorId,

        investigatorName,

        phase: "action",

        image:
          investigatorImage,
      },
    };
  }

  /*
   * ============================================================
   * ALL INVESTIGATORS FINISHED ACTIONS
   * ============================================================
   *
   * Start Encounter Phase with Investigator 1.
   */

  const firstInvestigatorId =
    game.investigatorOrder[0];

  if (!firstInvestigatorId) {
    throw new Error(
      "There are no investigators in the turn order.",
    );
  }

  const firstInvestigator =
    game.investigators[
      firstInvestigatorId
    ];

  if (!firstInvestigator) {
    throw new Error(
      `Investigator "${firstInvestigatorId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * RESOLVE INVESTIGATOR DEFINITION
   * ============================================================
   */

  const investigatorDefinition =
    coreInvestigators.find(
      (definition) =>
        definition.id ===
        firstInvestigator.definitionId,
    );

  const investigatorName =
    investigatorDefinition?.name ??
    firstInvestigator.definitionId;

  /*
   * ============================================================
   * RESOLVE INVESTIGATOR IMAGE
   * ============================================================
   */

  const investigatorImage =
    investigatorDefinition
      ? `/cards/investigators/${investigatorDefinition.name.replace(
          /\s+/g,
          "_",
        )}/${investigatorDefinition.name.replace(
          /\s+/g,
          "_",
        )}.png`
      : undefined;

  return {
    ...game,

    phase: "encounter",

    activeInvestigatorId:
      firstInvestigatorId,

    investigatorTurnIndex: 0,

    pendingDecision: {
      type: "investigator-turn",

      title: "Encounter Phase",

      message:
        `É a vez de ${investigatorName}.`,

      investigatorId:
        firstInvestigatorId,

      investigatorName,

      phase: "encounter",

      image:
        investigatorImage,
    },
  };
}