import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import { endInvestigatorEncounter } from "./endInvestigatorEncounter";
import { resolveEncounterEffects } from "./resolveEncounterEffects";
import { syncActiveExpedition } from "./syncActiveExpedition";

function getSilverKeyDiscount(game: GameState, investigatorId: string, choice: import("../models/Encounter").EncounterChoice) {
  const investigator = game.investigators[investigatorId];
  if (!investigator || choice.requirement?.type !== "clues" || choice.requirement.amount < 1) return null;
  const artifactId = investigator.artifactIds.find((id) => game.artifacts[id]?.name === "The Silver Key");
  if (!artifactId || game.cardRerollUsedRound?.[`${artifactId}:clue-discount`] === game.round) return null;
  if (!choice.effects.some((effect) => effect.type === "lose-clues" && (effect.amount ?? 0) > 0)) return null;
  return {
    artifactId,
    choice: {
      ...choice,
      requirement: { ...choice.requirement, amount: choice.requirement.amount - 1 },
      text: choice.text.replace(/spend\s+(\d+)\s+clue/i, (_match, value: string) => `spend ${Math.max(0, Number(value) - 1)} Clue`),
      effects: choice.effects.map((effect) => effect.type === "lose-clues" && (effect.amount ?? 0) > 0
        ? { ...effect, amount: (effect.amount ?? 0) - 1 }
        : effect),
    },
  };
}

export function resolveEncounterChoice(
  game: GameState,
  choiceIndex: number,
  map: MapDefinition,
  useSilverKey?: boolean,
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

    const originalChoice =
      pending.choices[choiceIndex];

    if (!originalChoice) {
      throw new Error(
        `Encounter choice "${choiceIndex}" does not exist.`,
      );
    }

    const availableDiscount = getSilverKeyDiscount(game, investigatorId, originalChoice);

    if (availableDiscount && useSilverKey === undefined) {
      return {
        ...game,
        pendingDecision: {
          type: "choice",
          title: "The Silver Key",
          message: "Do you want to use The Silver Key to spend 1 less Clue for this effect?",
          image: game.artifacts[availableDiscount.artifactId]?.image,
          options: [
            {
              id: "use",
              title: "Use The Silver Key",
              description: "Spend 1 less Clue and mark this once-per-round ability as used.",
            },
            {
              id: "decline",
              title: "Do not use it",
              description: "Pay the original Clue cost.",
              requirement: originalChoice.requirement,
            },
          ],
          onComplete:
            game.pendingDecision?.type === "choice"
              ? game.pendingDecision.onComplete
              : undefined,
          source: `silver-key-clue-discount:${choiceIndex}`,
        },
      };
    }

    const discount = useSilverKey ? availableDiscount : null;
    const choice = discount?.choice ?? originalChoice;

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
      cardRerollUsedRound: discount
        ? { ...game.cardRerollUsedRound, [`${discount.artifactId}:clue-discount`]: game.round }
        : game.cardRerollUsedRound,
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
    * ============================================================
    */

    currentGame = {
      ...currentGame,

      pendingEncounterChoice:
        null,
    };

    /*
    * ==========================================================
    * COMPLETE ENCOUNTER
    * ==========================================================
    */

    if (
      currentGame.currentEncounterId &&
      !currentGame.pendingDecision &&
      !currentGame.pendingEncounterChoice
    ) {
      const encounterId =
        currentGame.currentEncounterId;

      const encounterDeckType =
        currentGame.currentEncounterDeckType;

      if (!encounterDeckType) {
        throw new Error(
          `Encounter "${encounterId}" has no source deck.`,
        );
      }

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

      /*
      * ==========================================================
      * SYNC ACTIVE EXPEDITION
      * ==========================================================
      */

      if (
        encounterDeckType ===
        "expedition"
      ) {
        currentGame =
          syncActiveExpedition(
            currentGame,
            map,
          );
      }

      return endInvestigatorEncounter(
        currentGame,
      );
    }

    return currentGame;
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

  const originalChoice =
    encounter.choices[choiceIndex];

  if (!originalChoice) {
    throw new Error(
      `Encounter choice "${choiceIndex}" does not exist.`,
    );
  }

  const availableDiscount = getSilverKeyDiscount(game, investigatorId, originalChoice);

  if (availableDiscount && useSilverKey === undefined) {
    return {
      ...game,
      pendingDecision: {
        type: "choice",
        title: "The Silver Key",
        message: "Do you want to use The Silver Key to spend 1 less Clue for this effect?",
        image: game.artifacts[availableDiscount.artifactId]?.image,
        options: [
          {
            id: "use",
            title: "Use The Silver Key",
            description: "Spend 1 less Clue and mark this once-per-round ability as used.",
          },
          {
            id: "decline",
            title: "Do not use it",
            description: "Pay the original Clue cost.",
            requirement: originalChoice.requirement,
          },
        ],
        source: `silver-key-clue-discount:${choiceIndex}`,
      },
    };
  }

  const discount = useSilverKey ? availableDiscount : null;
  const choice = discount?.choice ?? originalChoice;

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
      discount
        ? { ...game, cardRerollUsedRound: { ...game.cardRerollUsedRound, [`${discount.artifactId}:clue-discount`]: game.round } }
        : game,
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

  return endInvestigatorEncounter(
    currentGame,
  );
}
