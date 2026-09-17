import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import { resolveEncounterEffects } from "./resolveEncounterEffects";

export function resolveEncounterChoice(
  game: GameState,
  choiceIndex: number,
  map: MapDefinition,
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

  /*
   * ============================================================
   * PENDING ENCOUNTER CHOICE
   * ============================================================
   *
   * Used by Encounter effects that create a choice
   * during resolution.
   */

  if (game.pendingEncounterChoice) {
    const pending =
      game.pendingEncounterChoice;

    if (
      pending.investigatorId !==
      investigatorId
    ) {
      throw new Error(
        "This choice belongs to another investigator.",
      );
    }

    const choice =
      pending.choices[choiceIndex];

    if (!choice) {
      throw new Error(
        `Encounter choice "${choiceIndex}" does not exist.`,
      );
    }

    /*
     * ==========================================================
     * VALIDATE CHOICE REQUIREMENT
     * ==========================================================
     *
     * Some choices require the investigator to have a certain
     * amount of a resource before they can be selected.
     *
     * Example:
     *
     * Spend 1 Clue.
     *
     * requirement:
     * {
     *   type: "clues",
     *   amount: 1
     * }
     *
     * This validation happens inside the game engine as well
     * as in the UI.
     *
     * The engine validation is important because the UI must
     * never be considered the security boundary.
     */

    if (choice.requirement) {
      const requirement =
        choice.requirement;

      let availableAmount =
        0;

      switch (
        requirement.type
      ) {
        case "clues":
          availableAmount =
            investigator.clues;
          break;

        case "resources":
          availableAmount =
            investigator.resources;
          break;

        default:
          throw new Error(
            `Unknown choice requirement "${requirement.type}".`,
          );
      }

      if (
        availableAmount <
        requirement.amount
      ) {
        throw new Error(
          `Investigator does not have enough ${requirement.type}. Required: ${requirement.amount}. Available: ${availableAmount}.`,
        );
      }
    }

    /*
     * ==========================================================
     * CAPTURE CONTINUATION
     * ==========================================================
     *
     * A Choice created by resolveEncounterEffects can also
     * have effects waiting after the choice itself.
     */

    const decision =
      game.pendingDecision;

    const decisionOnComplete =
      decision &&
      decision.type === "choice"
        ? decision.onComplete ?? []
        : [];

    /*
     * ==========================================================
     * CLEAR THE CHOICE BEING RESOLVED
     * ==========================================================
     *
     * The player has already selected this choice.
     *
     * We must remove the old pending choice before resolving
     * its effects.
     */

    let currentGame: GameState = {
      ...game,

      pendingEncounterChoice:
        null,

      pendingDecision:
        null,
    };

    /*
     * ==========================================================
     * RESOLVE SELECTED CHOICE
     * ==========================================================
     */

    currentGame =
      resolveEncounterEffects(
        currentGame,
        investigatorId,
        choice.effects,
        map,
      );

    /*
     * ==========================================================
     * ANOTHER PLAYER DECISION
     * ==========================================================
     *
     * The selected choice may create:
     *
     * - another Choice
     * - a Test
     * - Combat
     * - Select Space
     * - Select Investigator
     * - Select Card
     * - etc.
     *
     * Do NOT continue or discard the Encounter yet.
     */

    if (
      currentGame.pendingEncounterChoice ||
      currentGame.pendingDecision
    ) {
      return currentGame;
    }

    /*
     * ==========================================================
     * AFTER CHOICE
     * ==========================================================
     *
     * Resolve effects that happen after the selected choice.
     */

    currentGame =
      resolveEncounterEffects(
        currentGame,
        investigatorId,
        [
          ...pending.afterChoice,
          ...decisionOnComplete,
        ],
        map,
      );

    /*
     * ==========================================================
     * ANOTHER PLAYER DECISION AFTER CHOICE
     * ==========================================================
     */

    if (
      currentGame.pendingEncounterChoice ||
      currentGame.pendingDecision
    ) {
      return currentGame;
    }

    /*
     * ==========================================================
     * COMPLETE PENDING CHOICE CHAIN
     * ==========================================================
     */

    return {
      ...currentGame,

      pendingEncounterChoice:
        null,
    };
  }

  /*
   * ============================================================
   * CURRENT ENCOUNTER
   * ============================================================
   *
   * This is the original Encounter choice system.
   *
   * It is used by the older Encounter format:
   *
   * {
   *   choices: [...]
   * }
   */

  const encounterId =
    game.currentEncounterId;

  if (!encounterId) {
    throw new Error(
      "There is no active Encounter.",
    );
  }

  const encounter =
    game.encounters[encounterId];

  if (!encounter) {
    throw new Error(
      `Encounter "${encounterId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * VALIDATE OLD-STYLE ENCOUNTER
   * ============================================================
   */

  if (!encounter.choices) {
    throw new Error(
      `Encounter "${encounter.id}" does not contain choices.`,
    );
  }

  /*
   * ============================================================
   * GET CHOICE
   * ============================================================
   */

  const choice =
    encounter.choices[choiceIndex];

  if (!choice) {
    throw new Error(
      `Encounter choice "${choiceIndex}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * VALIDATE OLD-STYLE CHOICE REQUIREMENT
   * ============================================================
   *
   * We also validate requirements here so that old-style
   * Encounter choices receive exactly the same protection.
   */

  if (choice.requirement) {
    const requirement =
      choice.requirement;

    let availableAmount =
      0;

    switch (
      requirement.type
    ) {
      case "clues":
        availableAmount =
          investigator.clues;
        break;

      case "resources":
        availableAmount =
          investigator.resources;
        break;

      default:
        throw new Error(
          `Unknown choice requirement "${requirement.type}".`,
        );
    }

    if (
      availableAmount <
      requirement.amount
    ) {
      throw new Error(
        `Investigator does not have enough ${requirement.type}. Required: ${requirement.amount}. Available: ${availableAmount}.`,
      );
    }
  }

  /*
   * ============================================================
   * RESOLVE EFFECTS
   * ============================================================
   */

  let currentGame =
    resolveEncounterEffects(
      game,
      investigatorId,
      choice.effects,
      map,
    );

  /*
   * ============================================================
   * PENDING DECISION
   * ============================================================
   *
   * If the choice created another interaction,
   * the Encounter is NOT finished.
   *
   * This is particularly important for Tests,
   * Select Space, Select Monster, Combat, etc.
   */

  if (
    currentGame.pendingEncounterChoice ||
    currentGame.pendingDecision
  ) {
    return currentGame;
  }

  /*
   * ============================================================
   * DETERMINE PHYSICAL ENCOUNTER DECK
   * ============================================================
   */

  if (!encounter.region) {
    throw new Error(
      `Encounter "${encounter.id}" does not have an Encounter region.`,
    );
  }

  const encounterDeckType =
    encounter.region;

  /*
   * ============================================================
   * DISCARD ENCOUNTER
   * ============================================================
   */

  currentGame = {
    ...currentGame,

    board: {
      ...currentGame.board,

      encounterDiscards: {
        ...currentGame.board
          .encounterDiscards,

        [encounterDeckType]: [
          ...currentGame.board
            .encounterDiscards[
              encounterDeckType
            ],

          encounter.id,
        ],
      },
    },

    currentEncounterId:
      null,

    currentEncounterBackId:
      null,

    currentEncounterRevealed:
      false,

    currentEncounterDeckType:
      null,
  };

  return currentGame;
}