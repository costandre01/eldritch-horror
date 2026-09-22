import { coreInvestigators } from "../../content/core/investigators";
import type { GameState } from "../models/GameState";
import { startMythosPhase } from "./startMythosPhase";

export function endInvestigatorEncounter(
  game: GameState,
): GameState {

  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    throw new Error(
      "There is no active investigator.",
    );
  }

  if (game.phase !== "encounter") {
    throw new Error(
      "Investigator Encounters can only be ended during the Encounter phase.",
    );
  }

  /*
   * An Encounter must not still be active.
   */

  if (game.currentEncounterId) {
    throw new Error(
      "The current Encounter has not been fully resolved.",
    );
  }

  /*
   * No pending decision may remain.
   */

  if (game.pendingDecision) {
    throw new Error(
      "There is still a pending decision to resolve.",
    );
  }

  if (game.pendingEncounterChoice) {
    throw new Error(
      "There is still a pending Encounter choice to resolve.",
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

    const nextGame: GameState = {
      ...game,

      activeInvestigatorId:
        nextInvestigatorId,

      investigatorTurnIndex:
        nextIndex,

      currentEncounterId:
        null,

      currentEncounterBackId:
        null,

      currentEncounterRevealed:
        false,

      currentEncounterFromFracturedReality:
        false,

      pendingDecision: {
        type: "investigator-turn",

        title: "Encounter Phase",

        message:
          `É a vez de ${investigatorName}.`,

        investigatorId:
          nextInvestigatorId,

        investigatorName,

        phase: "encounter",

        image:
          investigatorImage,
      },
    };

    return nextGame;
  }

  /*
   * ============================================================
   * ALL INVESTIGATORS FINISHED ENCOUNTERS
   * ============================================================
   */

  const mythosGame: GameState = {
    ...game,

    phase: "mythos",

    activeInvestigatorId: null,

    investigatorTurnIndex: 0,

    currentEncounterId: null,

    currentEncounterBackId: null,

    currentEncounterRevealed: false,

    currentEncounterFromFracturedReality:
      false,
  };

  return startMythosPhase(mythosGame);
}