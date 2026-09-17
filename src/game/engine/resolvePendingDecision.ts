import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { resolveEncounterEffects } from "./resolveEncounterEffects";

export function resolvePendingDecision(
  game: GameState,
  map: MapDefinition,
): GameState {
  const decision =
    game.pendingDecision;

  /*
   * ============================================================
   * VALIDATION
   * ============================================================
   */

  if (!decision) {
    throw new Error(
      "There is no pending decision to resolve.",
    );
  }

  /*
   * ============================================================
   * CONTINUE
   * ============================================================
   *
   * Continue can be used for:
   *
   * - normal descriptive Encounters
   * - returning to an Encounter after a Test
   *
   * When an Encounter Test has just been resolved,
   * decision.onComplete contains the effects that must happen
   * after the player presses Continue.
   *
   * Example:
   *
   * Test Observation
   *       ↓
   * Dice Result
   *       ↓
   * PASS EFFECT
   *       ↓
   * Continue
   *       ↓
   * Test Will
   */

  if (decision.type === "continue") {
    /*
     * ==========================================================
     * CONTINUE ENCOUNTER EFFECTS
     * ==========================================================
     */

    if (
      decision.onComplete &&
      decision.onComplete.length > 0
    ) {
      let currentGame: GameState = {
        ...game,

        pendingDecision:
          null,
      };

      /*
       * Resolve the effects that were waiting after the
       * previous decision.
       *
       * This can create another:
       *
       * - Test
       * - Choice
       * - Select Space
       * - Select Investigator
       * - Select Card
       * - Select Monster
       * - Combat
       * - etc.
       */

      currentGame =
        resolveEncounterEffects(
          currentGame,
          currentGame.activeInvestigatorId!,
          decision.onComplete,
          map,
        );

      /*
       * ========================================================
       * WAIT FOR NEXT DECISION
       * ========================================================
       *
       * If the next effect requires player interaction,
       * DO NOT discard the Encounter.
       */

      if (
        currentGame.pendingDecision ||
        currentGame.pendingEncounterChoice
      ) {
        return currentGame;
      }

      /*
       * If there are no more decisions, the Encounter can
       * continue to completion below.
       */

      if (
        currentGame.currentEncounterId &&
        currentGame.currentEncounterDeckType
      ) {
        const encounterId =
          currentGame.currentEncounterId;

        const deckType =
          currentGame.currentEncounterDeckType;

        return {
          ...currentGame,

          board: {
            ...currentGame.board,

            encounterDiscards: {
              ...currentGame.board
                .encounterDiscards,

              [deckType]: [
                ...currentGame.board
                  .encounterDiscards[
                    deckType
                  ],

                encounterId,
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

          pendingDecision:
            null,
        };
      }

      return currentGame;
    }

    /*
     * ==========================================================
     * NORMAL CONTINUE
     * ==========================================================
     *
     * Used by an Encounter that simply requires the player
     * to press Continue.
     */

    if (
      game.currentEncounterId &&
      game.currentEncounterDeckType
    ) {
      const encounterId =
        game.currentEncounterId;

      const deckType =
        game.currentEncounterDeckType;

      return {
        ...game,

        board: {
          ...game.board,

          encounterDiscards: {
            ...game.board
              .encounterDiscards,

            [deckType]: [
              ...game.board
                .encounterDiscards[
                  deckType
                ],

              encounterId,
            ],
          },
        },

        pendingDecision:
          null,

        currentEncounterId:
          null,

        currentEncounterBackId:
          null,

        currentEncounterRevealed:
          false,

        currentEncounterDeckType:
          null,
      };
    }

    return {
      ...game,

      pendingDecision:
        null,
    };
  }

  /*
   * ============================================================
   * OTHER DECISIONS
   * ============================================================
   *
   * Other decision types must be resolved by their dedicated
   * engine functions.
   */

  throw new Error(
    `Pending decision "${decision.type}" cannot be resolved by resolvePendingDecision.`,
  );
}