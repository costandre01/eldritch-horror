import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { drawEncounter } from "./drawEncounter";
import { resolveCurrentEncounter } from "./resolveCurrentEncounter";

export function startOtherWorldEncounter(
  game: GameState,
  map: MapDefinition,
  fromFracturedReality = false,
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

  const drawnEncounter =
    drawEncounter(
      game,
      "other-world",
    );

  /*
   * The Other World Encounter is immediately
   * revealed and resolved.
   */

  const revealedGame: GameState = {
    ...drawnEncounter.game,

    currentEncounterRevealed:
      true,

    currentEncounterFromFracturedReality:
      fromFracturedReality,

    pendingDecision:
      null,
  };

  return resolveCurrentEncounter(
    revealedGame,
    map,
  );
}