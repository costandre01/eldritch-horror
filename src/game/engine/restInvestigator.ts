import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { canPerformAction } from "./canPerformAction";
import { endInvestigatorActions } from "./endInvestigatorActions";
import { resolveConditionTrigger } from "./resolveConditionTrigger";
import { coreConditionDefinitions } from "../../content/core/coreConditions";
import { assertNormalActionAllowed } from "./conditionRestrictions";

export function restInvestigator(
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

  assertNormalActionAllowed(game, investigatorId);

  if (
    !canPerformAction(
      investigator,
      "rest",
    )
  ) {
    throw new Error(
      "Investigator cannot perform Rest.",
    );
  }

  const hasMonsterOnSpace =
    Object.values(game.monsters).some(
      (monster) =>
        monster.spaceId === investigator.spaceId,
    );

  if (hasMonsterOnSpace) {
    throw new Error(
      "Investigator cannot perform Rest while a Monster is on their space.",
    );
  }

  /*
   * ============================================================
   * REST
   * ============================================================
   *
   * Recover 1 Health and 1 Sanity.
   */

  const additionalSanityRecovery =
    investigator.assetIds.reduce(
      (total, assetId) =>
        total + (game.assets[assetId]?.restSanityBonus ?? 0),
      0,
    );

  let currentGame: GameState = {
    ...game,

    investigators: {
      ...game.investigators,

      [investigatorId]: {
        ...investigator,

        health: Math.min(
          investigator.maxHealth,
          investigator.health + 1,
        ),

        sanity: Math.min(
          investigator.maxSanity,
          investigator.sanity + 1 + additionalSanityRecovery,
        ),

        actionsPerformed: [
          ...investigator.actionsPerformed,
          "rest",
        ],
      },
    },
  };

  /*
   * ============================================================
   * CONDITION TRIGGERS
   * ============================================================
   *
   * Resolve automatic Conditions triggered by Rest.
   *
   * Optional Rest effects are returned by the trigger system
   * and are NOT automatically resolved.
   */

  const triggerResult =
    resolveConditionTrigger(
      currentGame,
      investigatorId,
      "on-rest",
      map,
    );

  currentGame =
    triggerResult.game;

  const restedInvestigator = currentGame.investigators[investigatorId];
  const witchDoctorOwner = restedInvestigator?.spaceId
    ? Object.values(currentGame.investigators).find((owner) =>
        !owner.isDefeated && owner.spaceId === restedInvestigator.spaceId &&
        owner.assetIds.some((assetId) => currentGame.assets[assetId]?.name === "Witch Doctor"),
      )
    : undefined;
  const arcaneTomeIds = restedInvestigator?.assetIds.filter((assetId) => currentGame.assets[assetId]?.name === "Arcane Tome") ?? [];
  const puzzleBoxIds = restedInvestigator?.assetIds.filter((assetId) => currentGame.assets[assetId]?.name === "Puzzle Box") ?? [];
  if ((witchDoctorOwner || arcaneTomeIds.length || puzzleBoxIds.length) && !currentGame.pendingDecision && restedInvestigator) {
    const cursedConditionIds = restedInvestigator.conditionIds.filter((conditionId) => {
      const condition = currentGame.conditions[conditionId];
      const definition = condition && coreConditionDefinitions.find((item) => item.id === condition.definitionId);
      return definition?.id === "condition-cursed";
    });
    const options = [
      ...(restedInvestigator.health < restedInvestigator.maxHealth
        ? [{ id: "recover-health", title: "Recover 1 additional Health" }]
        : []),
      ...cursedConditionIds.map((conditionId) => ({ id: `discard-condition:${conditionId}`, title: "Discard Cursed Condition" })),
      ...arcaneTomeIds.map((assetId) => ({ id: `use-arcane-tome:${assetId}`, title: "Use Arcane Tome: test Lore to gain a Spell" })),
      ...puzzleBoxIds.map((assetId) => ({ id: `use-puzzle-box:${assetId}`, title: "Try to open Puzzle Box" })),
      { id: "skip", title: "Skip optional abilities" },
    ];
    currentGame = {
      ...currentGame,
      pendingDecision: {
        type: "choice",
        title: witchDoctorOwner ? "Rest effects" : "Rest abilities",
        message: "Choose an optional ability or skip these effects.",
        options,
        source: `asset:rest:${investigatorId}`,
      },
    };
  }

  if (
    currentGame.phase === "action" &&
    currentGame.investigators[
      investigatorId
    ]?.isDelayed
  ) {
    return endInvestigatorActions(
      currentGame,
    );
  }

  /*
   * ============================================================
   * RETURN
   * ============================================================
   */

  return currentGame;
}
