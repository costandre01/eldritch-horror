import type { GameState } from "../models/GameState";

export function revealEncounter(
  game: GameState,
): GameState {
  if (!game.currentEncounterId) {
    throw new Error(
      "There is no active Encounter.",
    );
  }

  const encounter =
    game.encounters[
      game.currentEncounterId
    ];

  if (!encounter) {
    throw new Error(
      `Encounter "${game.currentEncounterId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * ALREADY REVEALED
   * ============================================================
   */

  if (game.currentEncounterRevealed) {
    return game;
  }

  /*
   * ============================================================
   * REVEAL CARD
   * ============================================================
   *
   * The physical card is now turned over.
   *
   * frontImage = card back / hidden side
   * backImage  = revealed Encounter side
   */

  const revealedImage =
    encounter.backImage ??
    encounter.frontImage;

  /*
   * ============================================================
   * ENCOUNTER WITH CHOICES
   * ============================================================
   *
   * The card is revealed first.
   *
   * The player then sees the card text and the possible
   * actions printed on the Encounter.
   *
   * Example:
   *
   * "Search for an entrance."
   */

  if (
    encounter.choices &&
    encounter.choices.length > 0
  ) {
    return {
      ...game,

      currentEncounterRevealed:
        true,

      pendingDecision: {
        type: "choice",

        title:
          encounter.name,

        message:
          encounter.text ??
          encounter.initialText ??
          "Choose an action.",

        image:
          revealedImage,

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
                "Choose this action to resolve the Encounter.",
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
   *
   * If the Encounter has no explicit choices, the card itself
   * becomes the action.
   *
   * The actual effects are resolved when the player presses
   * RESOLVE ENCOUNTER.
   */

  return {
    ...game,

    currentEncounterRevealed:
      true,

    pendingDecision: {
      type: "continue",

      title:
        encounter.name,

      message:
        encounter.text ??
        encounter.initialText ??
        "Resolve this Encounter.",

      image:
        revealedImage,

      source:
        `encounter:${encounter.id}`,
    },
  };
}