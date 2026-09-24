import type { GameState } from "../models/GameState";

/*
 * ============================================================
 * SET LEAD INVESTIGATOR
 * ============================================================
 *
 * investigatorOrder represents the fixed clockwise order
 * of the investigators.
 *
 * When the Lead changes, rotate that order so the Lead
 * becomes the first investigator of the round.
 */

export function setLeadInvestigator(
  game: GameState,
  investigatorId: string,
): GameState {
  const currentIndex =
    game.investigatorOrder.indexOf(
      investigatorId,
    );

  if (currentIndex === -1) {
    throw new Error(
      `Investigator "${investigatorId}" is not in the game.`,
    );
  }

  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  if (investigator.isDefeated) {
    throw new Error(
      `Investigator "${investigatorId}" is defeated and cannot become Lead.`,
    );
  }

  const rotatedOrder = [
    ...game.investigatorOrder.slice(
      currentIndex,
    ),

    ...game.investigatorOrder.slice(
      0,
      currentIndex,
    ),
  ];

  return {
    ...game,

    leadInvestigatorId:
      investigatorId,

    investigatorOrder:
      rotatedOrder,

    activeInvestigatorId:
      investigatorId,

    investigatorTurnIndex:
      0,

    pendingDecision:
      null,
  };
}