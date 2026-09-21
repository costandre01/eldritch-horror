import type { GameState } from "../models/GameState";

import { easyMythos } from "../../content/core/mythos/easyMythos";
import { normalMythos } from "../../content/core/mythos/normalMythos";
import { hardMythos } from "../../content/core/mythos/hardMythos";

import type { MapDefinition } from "../models/MapDefinition";
import { showMythosContinue } from "./showMythosContinue";

export function startMythosCardReckoning(
    game: GameState,
    _map: MapDefinition,
    nextIconIndex: number,
    remainingPasses: number = 1,
): GameState {
  /*
   * Snapshot dos Mythos que estão atualmente
   * em jogo e que possuem um efeito de Reckoning.
   */

  const mythosDefinitions = [
    ...easyMythos,
    ...normalMythos,
    ...hardMythos,
  ];

  const mythosIds =
    game.board.mythosInPlay
      .filter((mythosInPlay) => {
        const definition =
          mythosDefinitions.find(
            (mythos) =>
              mythos.id ===
              mythosInPlay.definitionId,
          );

        return (
          definition?.reckoning !==
          undefined
        );
      })
      .map(
        (mythosInPlay) =>
          mythosInPlay.definitionId,
      );

  /*
   * Não existem Mythos com Reckoning.
   *
   * Por enquanto continuamos para o próximo
   * passo do fluxo Mythos.
   */

  if (mythosIds.length === 0) {
    const gameWithoutDecision: GameState = {
      ...game,
      pendingDecision: null,
    };

    return showMythosContinue(
      gameWithoutDecision,
      nextIconIndex,
    );
  }

  return {
    ...game,

    pendingDecision: {
      type: "mythos-card-reckoning",

      title:
        "MYTHOS — RECKONING",

      message:
        "Resolve the Reckoning effects of the Mythos cards in play.",

      mythosIds,

      resolvedMythosIds: [],

      source:
        "mythos:card-reckoning",

      nextIconIndex,

      remainingPasses,
    },
  };
}