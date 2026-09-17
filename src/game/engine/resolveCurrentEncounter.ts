import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { resolveEncounterEffects } from "./resolveEncounterEffects";

export function resolveCurrentEncounter(
  game: GameState,
  map: MapDefinition,
): GameState {
  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    throw new Error(
      "There is no active investigator.",
    );
  }

  /*
   * ============================================================
   * CURRENT ENCOUNTER
   * ============================================================
   */

  if (!game.currentEncounterId) {
    throw new Error(
      "There is no active Encounter.",
    );
  }

  if (!game.currentEncounterRevealed) {
    throw new Error(
      "The Encounter card has not been revealed.",
    );
  }

  const encounterId =
    game.currentEncounterId;

  const encounter =
    game.encounters[encounterId];

  if (!encounter) {
    throw new Error(
      `Encounter "${encounterId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * SOURCE DECK
   * ============================================================
   */

  const encounterDeckType =
    game.currentEncounterDeckType;

  if (!encounterDeckType) {
    throw new Error(
      `Encounter "${encounter.id}" has no source deck.`,
    );
  }

  /*
   * ============================================================
   * CARD-BASED ENCOUNTER
   * ============================================================
   */

  if (
    encounter.effects &&
    encounter.effects.length > 0
  ) {
    let currentGame =
      resolveEncounterEffects(
        game,
        investigatorId,
        encounter.effects,
        map,
      );

    /*
     * The Encounter is not finished while
     * another decision is waiting.
     */

    if (
      currentGame.pendingEncounterChoice ||
      currentGame.pendingDecision
    ) {
      return currentGame;
    }

    /*
     * DISCARD ENCOUNTER
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
    };

    return currentGame;
  }

  /*
   * ============================================================
   * OLD-STYLE ENCOUNTER WITH CHOICES
   * ============================================================
   */

  if (
    encounter.choices &&
    encounter.choices.length > 0
  ) {
    /*
     * ==========================================================
     * SINGLE CHOICE
     * ==========================================================
     *
     * If there is only one choice, the player does not need
     * an extra "Choose an option" screen.
     *
     * Resolve that choice immediately.
     */

    if (
      encounter.choices &&
      encounter.choices.length > 0
    ) {
      return {
        ...game,

        pendingEncounterChoice: {
          investigatorId,

          choices:
            encounter.choices,

          afterChoice: [],
        },

        pendingDecision: {
          type: "choice",

          title:
            encounter.name,

          message:
            encounter.initialText ??
            encounter.text ??
            "Choose how to resolve this Encounter.",

          image:
            encounter.backImage ??
            encounter.frontImage,

          options:
            encounter.choices.map(
              (
                choice,
                index,
              ) => ({
                id:
                  String(index),

                title:
                  choice.text,

                description:
                  "Choose this option to resolve the Encounter.",
              }),
            ),

          source:
            `encounter:${encounter.id}`,
        },
      };
    }

    /*
     * ==========================================================
     * MULTIPLE CHOICES
     * ==========================================================
     *
     * Two or more choices still require the player to choose.
     */

    return {
      ...game,

      pendingEncounterChoice: {
        investigatorId,

        choices:
          encounter.choices,

        afterChoice: [],
      },

      pendingDecision: {
        type: "choice",

        title:
          encounter.name,

        message:
          encounter.text ??
          "Choose how to resolve this Encounter.",

        image:
          encounter.backImage,

        options:
          encounter.choices.map(
            (
              choice,
              index,
            ) => ({
              id:
                String(index),

              title:
                choice.text,

              description:
                "Choose this option to resolve the Encounter.",
            }),
          ),

        source:
          `encounter:${encounter.id}`,
      },
    };
  }

  /*
   * ============================================================
   * ENCOUNTER WITHOUT CHOICES
   * ============================================================
   */

  if (encounter.text) {
    return {
      ...game,

      pendingDecision: {
        type: "continue",

        title:
          encounter.name,

        message:
          encounter.text,

        image:
          encounter.backImage ??
          encounter.frontImage,

        source:
          `encounter:${encounter.id}`,
      },
    };
  }

  /*
   * ============================================================
   * INVALID ENCOUNTER
   * ============================================================
   */

  throw new Error(
    `Encounter "${encounter.id}" has no effects, choices, or text to resolve.`,
  );
}