import type { GameState } from "../models/GameState";
import { getLeadInvestigatorId } from "./getLeadInvestigatorId";

export function endMythos(
  game: GameState,
): GameState {
  /*
   * ============================================================
   * VALIDATION
   * ============================================================
   */

  if (game.phase !== "mythos") {
    throw new Error(
      "Mythos Phase can only be ended during the Mythos phase.",
    );
  }

  /*
   * A pending decision must be resolved first.
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

  /*
   * ============================================================
   * START NEW INVESTIGATOR ROUND
   * ============================================================
   *
   * The first investigator in investigatorOrder becomes
   * the active investigator for the new Action Phase.
   */

  const firstInvestigatorId =
    getLeadInvestigatorId(game);

  if (!firstInvestigatorId) {
    throw new Error(
      "There are no Investigators available to start the Action phase.",
    );
  }

  return {
    ...game,

    phase: "action",

    activeInvestigatorId:
      firstInvestigatorId,

    investigatorTurnIndex: 0,

    currentEncounterId: null,

    currentEncounterBackId: null,

    currentEncounterRevealed: false,

    pendingDecision: null,

    pendingEncounterChoice: null,
  };
}