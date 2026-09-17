import type { GameState } from "../models/GameState";
import type { AncientOneDefinition } from "../models/AncientOneDefinition";

import { CORE_ANCIENT_ONES } from "../../content/core/coreAncientOnes";
import type { MapDefinition } from "../models/MapDefinition";
import { startMythosCardReckoning } from "./startMythosCardReckoning";

function getAncientOneDefinition(
  ancientOneId: string,
): AncientOneDefinition | undefined {
  return CORE_ANCIENT_ONES.find(
    (ancientOne) => ancientOne.id === ancientOneId,
  );
}

export function startAncientOneReckoning(
  game: GameState,
  _map: MapDefinition,
  nextIconIndex: number,
): GameState {
  const ancientOne = game.ancientOne;

  const definition = getAncientOneDefinition(ancientOne.id);

  if (!definition) {
    throw new Error(
      `Ancient One "${ancientOne.id}" does not exist.`,
    );
  }

  const abilities = ancientOne.awakened
    ? definition.reckoning.awakened
    : definition.reckoning.front;

  if (abilities.length === 0) {
    const gameWithoutDecision: GameState = {
      ...game,
      pendingDecision: null,
    };

    return startMythosCardReckoning(
      gameWithoutDecision,
      _map,
      nextIconIndex,
    );
  }

  return {
    ...game,
    pendingDecision: {

      type: "mythos-ancient-one-reckoning",

      title: "ANCIENT ONE — RECKONING",

      message: `Resolve the Reckoning effect of ${definition.name}.`,

      ancientOneId: ancientOne.id,

      reckoningStage:
        ancientOne.awakened
          ? "awakened"
          : "front",

      abilityIndex: 0,

      source: "mythos:ancient-one-reckoning",
      
      nextIconIndex,
    },
  };
}