import type { GameState } from "../models/GameState";
import { coreInvestigators } from "../../content/core/investigators";
import { startMythosPhase } from "./startMythosPhase";

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

  const currentIndex =
    game.investigatorTurnIndex;

  let nextIndex =
    currentIndex + 1;

  while (nextIndex < game.investigatorOrder.length) {
    const candidateId = game.investigatorOrder[nextIndex];
    const candidate = candidateId ? game.investigators[candidateId] : undefined;

    if (candidateId && !candidate) {
      throw new Error(`Investigator "${candidateId}" does not exist.`);
    }

    if (candidate && !candidate.isDefeated) {
      break;
    }

    nextIndex++;
  }

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
          `It is ${investigatorName}'s turn.`,

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

  if (game.investigatorOrder.length === 0) {
    throw new Error("There are no investigators in the turn order.");
  }

  let firstInvestigatorIndex = -1;
  for (let index = 0; index < game.investigatorOrder.length; index++) {
    const candidateId = game.investigatorOrder[index];
    const candidate = candidateId ? game.investigators[candidateId] : undefined;
    if (candidateId && !candidate) {
      throw new Error(`Investigator "${candidateId}" does not exist.`);
    }
    if (candidate && !candidate.isDefeated) {
      firstInvestigatorIndex = index;
      break;
    }
  }

  /*
   * If everybody was defeated during the Action phase, the game
   * continues through the round. Replacements are chosen only at
   * the end of the Mythos phase.
   */
  if (firstInvestigatorIndex === -1) {
    return startMythosPhase({
      ...game,
      phase: "mythos",
      activeInvestigatorId: null,
      investigatorTurnIndex: 0,
      pendingDecision: null,
    });
  }

  const firstInvestigatorId =
    game.investigatorOrder[firstInvestigatorIndex];

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

    investigatorTurnIndex: firstInvestigatorIndex,

    pendingDecision: {
      type: "investigator-turn",

      title: "Encounter Phase",

      message:
        `It is ${investigatorName}'s turn.`,

      investigatorId:
        firstInvestigatorId,

      investigatorName,

      phase: "encounter",

      image:
        investigatorImage,
    },
  };
}
