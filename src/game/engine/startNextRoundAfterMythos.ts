import type { GameState } from "../models/GameState";

import { setLeadInvestigator } from "./setLeadInvestigator";
import { startInvestigatorActions } from "./startInvestigatorActions";

export function startNextRoundAfterMythos(
  game: GameState,
  leadInvestigatorId: string,
): GameState {
  if (game.phase !== "mythos") {
    throw new Error(
      "A new round can only start from the Mythos phase.",
    );
  }

  if (
    !game.investigatorOrder.includes(
      leadInvestigatorId,
    )
  ) {
    throw new Error(
      `Investigator "${leadInvestigatorId}" is not in the game.`,
    );
  }

  /*
   * The Mythos Phase is over.
   *
   * The selected investigator becomes the Lead,
   * the investigator order is rotated so that the
   * new Lead starts the round, and the round advances.
   */

  const gameWithNewRound: GameState = {
    ...game,

    round:
      game.round + 1,

    phase:
      "action",

    currentMythosId:
      null,

    activeInvestigatorId:
      leadInvestigatorId,

    investigatorTurnIndex:
      0,

    pendingDecision:
      null,
  };

  const gameWithLead =
    setLeadInvestigator(
      gameWithNewRound,
      leadInvestigatorId,
    );

  /*
  * A new round gives every investigator
  * a fresh set of available actions.
  */
  const investigators = Object.fromEntries(
    Object.entries(
      gameWithLead.investigators,
    ).map(
      ([investigatorId, investigator]) => [
        investigatorId,
        {
          ...investigator,
          actionsPerformed: [],
        },
      ],
    ),
  );

  const gameWithResetActions: GameState = {
    ...gameWithLead,

    investigators,
  };

  /*
  * Start the new Lead's Action turn.
  *
  * startInvestigatorActions() also clears
  * the active investigator's actions and
  * pending decision, so we keep it as the
  * final step of starting the round.
  */
  return startInvestigatorActions(
    gameWithResetActions,
  );
}