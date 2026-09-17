import type { GameState } from "../models/GameState";

export function getLeadInvestigatorId(
  game: GameState,
): string {
  /*
   * New games store the Lead explicitly.
   *
   * Fallback keeps older saved games compatible.
   */

  const leadInvestigatorId =
    game.leadInvestigatorId ??
    game.investigatorOrder[0];

  if (!leadInvestigatorId) {
    throw new Error(
      "There are no Investigators available.",
    );
  }

  return leadInvestigatorId;
}