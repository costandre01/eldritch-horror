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

    return {
      ...game,

      activeInvestigatorId:
        nextInvestigatorId,

      investigatorTurnIndex:
        nextIndex,

      currentEncounterId: null,

      currentEncounterBackId: null,

      currentEncounterRevealed: false,

      currentEncounterFromFracturedReality:
        false,
    };
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