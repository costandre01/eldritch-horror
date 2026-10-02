import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";
import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import { checkActiveMystery } from "./checkActiveMystery";

export function finishEmptyMythosPhase(
  game: GameState,
  map: MapDefinition = eldritchBaseMap,
): GameState {
  const phaseEndedGame: GameState = {
    ...game,
    activeInvestigatorId: null,
    pendingDecision: null,
    pendingEncounterChoice: null,
    currentMythosId: null,
    combatOrder: null,
  };

  const checkedGame = checkActiveMystery(
    phaseEndedGame,
    map,
  );

  if (checkedGame.status === "victory") {
    return checkedGame;
  }

  return {
    ...checkedGame,
    status: "defeat",
    activeInvestigatorId: null,
    pendingDecision: null,
    pendingEncounterChoice: null,
    currentMythosId: null,
    combatOrder: null,
  };
}
