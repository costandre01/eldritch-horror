import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import type { EncounterDeckType } from "../models/BoardState";

import { resolveConditionTrigger } from "./resolveConditionTrigger";
import { easyMythos } from "../../content/core/mythos/easyMythos";
import { normalMythos } from "../../content/core/mythos/normalMythos";
import { hardMythos } from "../../content/core/mythos/hardMythos";

export function startEncounter(
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

  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * PHASE VALIDATION
   * ============================================================
   */

  if (game.phase !== "encounter") {
    throw new Error(
      "An Encounter can only start during the Encounter phase.",
    );
  }

  /*
   * ============================================================
   * SPACE VALIDATION
   * ============================================================
   */

  if (!investigator.spaceId) {
    throw new Error(
      "Investigator has no current space.",
    );
  }

  const currentSpace =
    map.spaces.find(
      (space) =>
        space.id ===
        investigator.spaceId,
    );

  if (!currentSpace) {
    throw new Error(
      `Space "${investigator.spaceId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * CONDITION TRIGGERS
   * ============================================================
   */

  const result =
    resolveConditionTrigger(
      game,
      investigatorId,
      "on-encounter",
    );

  /*
   * ============================================================
   * ENCOUNTER REPLACED BY CONDITION
   * ============================================================
   */

  if (result.preventsEncounter) {
    return result.game;
  }

  /*
   * ============================================================
   * POSSIBLE ENCOUNTER DECKS
   * ============================================================
   *
   * Determine every Encounter deck that can be used at the
   * investigator's current location.
   *
   * The player will ALWAYS see the available decks and choose
   * one, even when there is only a single available deck.
   *
   * The actual Encounter card is drawn only after the player
   * selects a deck.
   */

  const possibleDeckTypes:
    EncounterDeckType[] = [];

  /*
   * ============================================================
   * EXPEDITION
   * ============================================================
   *
   * Expedition spaces can use the Expedition Encounter deck.
   */

  if (currentSpace.isExpedition) {
    if (
      result.game.board
        .encounterDecks.expedition
        .length > 0
    ) {
      possibleDeckTypes.push(
        "expedition",
      );
    }
  }

  /*
   * ============================================================
   * REGIONAL ENCOUNTER
   * ============================================================
   *
   * The map determines the regional Encounter deck.
   *
   * Example:
   *
   * Rome
   *   encounterRegion: "europe"
   *
   * therefore:
   *
   *   Europe Encounter deck
   */

  if (
    currentSpace.encounterRegion
  ) {
    const region =
      currentSpace.encounterRegion;

    if (
      result.game.board
        .encounterDecks[region]
        .length > 0
    ) {
      possibleDeckTypes.push(
        region,
      );
    }
  }

  /*
   * ============================================================
   * GENERAL ENCOUNTER
   * ============================================================
   *
   * City, Wilderness and Sea locations may use the General
   * Encounter deck.
   */

  if (
    currentSpace.type === "city" ||
    currentSpace.type === "wilderness" ||
    currentSpace.type === "sea"
  ) {
    if (
      result.game.board
        .encounterDecks.general
        .length > 0
    ) {
      possibleDeckTypes.push(
        "general",
      );
    }
  }

  /*
   * ============================================================
   * REMOVE DUPLICATES
   * ============================================================
   */

  const uniqueDeckTypes =
    Array.from(
      new Set(
        possibleDeckTypes,
      ),
    );

  /*
  * ============================================================
  * FRACTURED REALITY — ANCIENT PORTAL
  * ============================================================
  *
  * If Fractured Reality is currently in play and the
  * investigator is on Space 2, the investigator may use
  * the Ancient Portal instead of resolving a normal Encounter.
  */

  const fracturedReality =
    currentSpace.id === "space-2"
      ? [
          ...easyMythos,
          ...normalMythos,
          ...hardMythos,
        ].find(
          (mythos) =>
            mythos.id ===
              "fractured-reality" &&
            mythos.type === "rumor" &&
            result.game.board.mythosInPlay.some(
              (entry) =>
                entry.definitionId ===
                "fractured-reality",
            ),
        )
      : undefined;

  /*
   * ============================================================
   * NO AVAILABLE ENCOUNTER
   * ============================================================
   */

  if (
    uniqueDeckTypes.length === 0 &&
    !fracturedReality
  ) {
    throw new Error(
      `No Encounter decks are available at "${currentSpace.name}".`,
    );
  }

  /*
   * ============================================================
   * GROWING MADNESS — UNCHARTED ISLE
   * ============================================================
   *
   * If Growing Madness is in play and the investigator is
   * on space 8, the investigator may attempt the Rumor
   * instead of choosing a normal Encounter deck.
   */

  const growingMadnessInPlay =
    result.game.board.mythosInPlay.some(
      (entry) =>
        entry.definitionId ===
        "growing-madness",
    );

  const canAttemptGrowingMadness =
    currentSpace.id === "space-8" &&
    growingMadnessInPlay;

  /*
   * ============================================================
   * ENCOUNTER DECK SELECTION
   * ============================================================
   *
   * IMPORTANT:
   *
   * We ALWAYS show the available Encounter decks.
   *
   * Even if there is only one:
   *
   *   General
   *
   * it is still displayed as a selectable option.
   *
   * The player chooses the physical deck first.
   *
   * Only after that choice will App.tsx:
   *
   *   1. Draw the Encounter
   *   2. Reveal the Encounter
   *   3. Resolve the Encounter
   *
   * This keeps the Encounter flow consistent regardless of
   * how many decks are available.
   */

  return {
    ...result.game,

    pendingDecision: {
      type: "choice",

      title:
        "Choose Encounter",

      message:
        `Choose an Encounter for ${currentSpace.name}.`,

      options: [
        ...uniqueDeckTypes.map(
          (deckType) => ({
            id:
              deckType,

            title:
              getEncounterDeckName(
                deckType,
              ),

            description:
              getEncounterDeckDescription(
                deckType,
                currentSpace.name,
              ),

            image:
              getEncounterDeckImage(
                result.game,
                deckType,
                currentSpace.name,
              ),
          }),
        ),

        ...(canAttemptGrowingMadness
          ? [
              {
                id:
                  "growing-madness-encounter",

                title:
                  "Growing Madness",

                description:
                  "Attempt to find the uncharted isle.",

                image:
                  [
                    ...easyMythos,
                    ...normalMythos,
                    ...hardMythos,
                  ].find(
                    (definition) =>
                      definition.id ===
                      "growing-madness",
                  )?.image,
              },
            ]
          : []),
      ],

      source:
        `encounter-selection:${currentSpace.id}`,
    },
  };
}

/*
 * ============================================================
 * GET ENCOUNTER DECK DISPLAY NAME
 * ============================================================
 */

function getEncounterDeckName(
  deckType: EncounterDeckType,
): string {
  switch (deckType) {
    case "america":
      return "America";

    case "europe":
      return "Europe";

    case "asia-australia":
      return "Asia / Australia";

    case "general":
      return "General";

    case "research":
      return "Research";

    case "other-world":
      return "Other World";

    case "special":
      return "Special";

    case "expedition":
      return "Expedition";

    default:
      return deckType;
  }
}

/*
 * ============================================================
 * GET ENCOUNTER DECK IMAGE
 * ============================================================
 *
 * The first physical card in the deck provides the image used
 * by the UI to represent that Encounter deck.
 *
 * This does NOT draw or remove the card.
 *
 * It only reads the first card so the UI can display the
 * appropriate physical deck/card back.
 */

function getEncounterDeckImage(
  game: GameState,
  deckType: EncounterDeckType,
  expeditionName?: string,
): string | undefined {
  const deck =
    game.board.encounterDecks[
      deckType
    ];

  let topEncounterId: string | undefined;

  if (
    deckType === "expedition" &&
    expeditionName
  ) {
    topEncounterId =
      deck.find(
        (encounterId) =>
          game.encounters[
            encounterId
          ]?.name === expeditionName,
      );
  } else {
    topEncounterId =
      deck[0];
  }

  if (!topEncounterId) {
    return undefined;
  }

  const encounter =
    game.encounters[
      topEncounterId
    ];

  if (!encounter) {
    return undefined;
  }

  return encounter.frontImage;
}

/*
 * ============================================================
 * GET ENCOUNTER DECK DESCRIPTION
 * ============================================================
 */

function getEncounterDeckDescription(
  deckType: EncounterDeckType,
  spaceName: string,
): string {
  switch (deckType) {
    case "expedition":
      return `Draw an Expedition Encounter for ${spaceName}.`;

    case "general":
      return `Draw a General Encounter for ${spaceName}.`;

    case "america":
      return `Draw an America Encounter for ${spaceName}.`;

    case "europe":
      return `Draw a Europe Encounter for ${spaceName}.`;

    case "asia-australia":
      return `Draw an Asia / Australia Encounter for ${spaceName}.`;

    case "research":
      return `Draw a Research Encounter for ${spaceName}.`;

    case "other-world":
      return `Draw an Other World Encounter for ${spaceName}.`;

    case "special":
      return `Draw a Special Encounter for ${spaceName}.`;

    default:
      return `Draw an Encounter for ${spaceName}.`;
  }
}