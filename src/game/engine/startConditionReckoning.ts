import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import { showMythosContinue } from "./showMythosContinue";

export function startConditionReckoning(
  game: GameState,
  _map: MapDefinition,
  nextIconIndex: number,
  treatDiceAsOne = false,
): GameState {
  const investigatorIds =
    game.investigatorOrder.filter(
      (investigatorId) => {
        const investigator =
          game.investigators[investigatorId];

        return (
          investigator !== undefined &&
          !investigator.isDefeated &&
          investigator.conditionIds.length > 0
        );
      },
    );

  const conditionIds =
    investigatorIds.map(
      (investigatorId) => [
        ...(game.investigators[
          investigatorId
        ]?.conditionIds ?? []),
      ],
    );

  if (
    conditionIds.every(
      (ids) => ids.length === 0,
    )
  ) {
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
      type: "mythos-condition-reckoning",
      title: "CONDITIONS — RECKONING",
      message:
        "Resolve the Reckoning effects of the investigators' Conditions.",
      investigatorIds,
      currentInvestigatorIndex: 0,
      conditionIds,
      currentConditionIndex: 0,
      source: "mythos:condition-reckoning",
      nextIconIndex,
      treatDiceAsOne,
    },
  };
}