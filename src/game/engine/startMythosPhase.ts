import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";
import { finishEmptyMythosPhase } from "./finishEmptyMythosPhase";

export function startMythosPhase(
  game: GameState,
  map: MapDefinition = eldritchBaseMap,
): GameState {
  if (game.phase !== "mythos") {
    throw new Error(
      "Mythos Phase can only be started when the game is in the Mythos phase.",
    );
  }

  if (game.board.mythosDeck.length === 0) {
    return finishEmptyMythosPhase(game, map);
  }

  return {
    ...game,

    pendingDecision: {
      type: "choice",

      title: "Mythos Phase",

      message:
        "Draw the top card of the Mythos deck.",

      image:
        "/cards/Mystery/Mythos-back.jpg",

      options: [
        {
          id: "draw-mythos",
          title: "Draw Mythos Card",
        },
      ],

      source: "mythos-selection",
    },
  };
}
