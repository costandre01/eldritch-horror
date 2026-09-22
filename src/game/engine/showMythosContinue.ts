import type { GameState } from "../models/GameState";

import { easyMythos } from "../../content/core/mythos/easyMythos";
import { normalMythos } from "../../content/core/mythos/normalMythos";
import { hardMythos } from "../../content/core/mythos/hardMythos";

const ALL_MYTHOS = [
  ...easyMythos,
  ...normalMythos,
  ...hardMythos,
];

export function showMythosContinue(
  game: GameState,
  nextIconIndex: number,
): GameState {
  const mythos = game.currentMythosId
    ? ALL_MYTHOS.find(
        (definition) =>
          definition.id === game.currentMythosId,
      )
    : undefined;

  if (!mythos) {
    throw new Error(
      "Cannot show Mythos card because there is no current Mythos.",
    );
  }

  return {
    ...game,

    pendingDecision: {
      type: "continue",

      title: mythos.name,

      message: mythos.text,

      image: mythos.image,

      source: `mythos-card:${nextIconIndex}`,
    },
  };
}