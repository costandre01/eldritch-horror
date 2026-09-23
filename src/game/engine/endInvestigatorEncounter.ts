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

  /*
  * ============================================================
  * OCCULT RESEARCH
  * ============================================================
  *
  * A Research Encounter may allow the investigator to spend
  * 1 Clue gained during that Encounter on the active Mystery.
  *
  * The Encounter itself has already been fully resolved at
  * this point.
  */
  if (
    game.currentEncounterIsResearch &&
    (game.encounterCluesGained ?? 0) > 0 &&
    game.mysteries.activeMysteryId
  ) {
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
    * The physical Encounter has already been resolved.
    * Keep the Encounter state cleared, but preserve the
    * information necessary for the Occult Research decision.
    */
    return {
      ...game,

      currentEncounterId:
        null,

      currentEncounterBackId:
        null,

      currentEncounterRevealed:
        false,

      currentEncounterDeckType:
        null,

      pendingDecision: {
        type: "choice",

        title:
          "Occult Research",

        message:
          `You gained ${
            game.encounterCluesGained
          } Clue${
            game.encounterCluesGained === 1
              ? ""
              : "s"
          } during this Research Encounter. ` +
          "You may spend 1 of those Clues to place it on the active Mystery.",

        options: [
          {
            id:
              "occult-research:spend",

            title:
              "Spend 1 Clue",

            description:
              "Spend 1 Clue gained during this Research Encounter and place it on the active Mystery.",
          },

          {
            id:
              "occult-research:decline",

            title:
              "Do Not Spend",

            description:
              "Keep the Clue and finish the Encounter.",
          },
        ],

        source:
          "mystery:occult-research",
      },
    };
  }

  const currentIndex =
    game.investigatorTurnIndex;

  let nextIndex =
    currentIndex + 1;

  /*
   * ============================================================
   * MORE INVESTIGATORS
   * ============================================================
   */
  
  while (
    nextIndex <
    game.investigatorOrder.length
  ) {
    const nextInvestigatorId =
      game.investigatorOrder[nextIndex];

    if (!nextInvestigatorId) {
      nextIndex++;
      continue;
    }

    const nextInvestigator =
      game.investigators[
        nextInvestigatorId
      ];

    /*
    * Defeated Investigators no longer participate
    * in the current round.
    */
    if (
      !nextInvestigator ||
      nextInvestigator.isDefeated
    ) {
      nextIndex++;
      continue;
    }

    break;
  }

  if (
    nextIndex <
    game.investigatorOrder.length
  ) {
    const nextInvestigatorId =
      game.investigatorOrder[nextIndex];

    if (!nextInvestigatorId) {
      throw new Error(
        "Could not determine the next Investigator.",
      );
    }

    const nextInvestigator =
      game.investigators[nextInvestigatorId];

    if (!nextInvestigator) {
      throw new Error(
        `Investigator "${nextInvestigatorId}" does not exist.`,
      );
    }

    const investigatorDefinition =
      coreInvestigators.find(
        (definition) =>
          definition.id ===
          nextInvestigator.definitionId,
      );

    const investigatorName =
      investigatorDefinition?.name ??
      nextInvestigator.definitionId;

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

        title:
          "Encounter Phase",

        message:
          `É a vez de ${investigatorName}.`,

        investigatorId:
          nextInvestigatorId,

        investigatorName,

        phase:
          "encounter",

        image:
          investigatorImage,
      },
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