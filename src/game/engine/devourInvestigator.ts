import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { advanceDoom } from "./doomEngine";
import { discardCondition } from "./discardCondition";
import { discardSpell } from "./discardSpell";

export function devourInvestigator(
  game: GameState,
  _map: MapDefinition,
  investigatorId: string,
  resumeMonsterId?: string,
): GameState {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * Already defeated / devoured.
   *
   * Do not resolve Doom or discard possessions
   * more than once.
   */
  if (investigator.isDefeated) {
    return game;
  }

  const resumePendingDecision =
    game.pendingDecision?.type ===
      "mythos-reckoning-monsters" &&
    resumeMonsterId
      ? {
          ...game.pendingDecision,

          resolvedMonsterIds:
            game.pendingDecision.resolvedMonsterIds.includes(
              resumeMonsterId,
            )
              ? game.pendingDecision.resolvedMonsterIds
              : [
                  ...game.pendingDecision
                    .resolvedMonsterIds,
                  resumeMonsterId,
                ],
        }
      : undefined;

  let currentGame = game;

  /*
   * ==========================================================
   * DOOM
   * ==========================================================
   *
   * A devoured Investigator causes Doom to advance by 1.
   */

  currentGame = advanceDoom(
    currentGame,
    1,
  );

  /*
   * ==========================================================
   * DISCARD ASSETS
   * ==========================================================
   */

  const assetsToDiscard =
    investigator.assetIds
      .map(
        (assetId) =>
          currentGame.assets[assetId],
      )
      .filter(
        (asset) => asset !== undefined,
      );

  /*
   * ==========================================================
   * DISCARD SPELLS
   * ==========================================================
   */

  const spellsToDiscard =
    investigator.spellIds
      .map(
        (spellId) =>
          currentGame.spells[spellId],
      )
      .filter(
        (spell) => spell !== undefined,
      );

  /*
   * ==========================================================
   * DISCARD ARTIFACTS
   * ==========================================================
   */

  const artifactsToDiscard =
    investigator.artifactIds
      .map(
        (artifactId) =>
          currentGame.artifacts[artifactId],
      )
      .filter(
        (artifact) => artifact !== undefined,
      );

  for (const spell of spellsToDiscard) {
    currentGame = discardSpell(currentGame, investigatorId, spell.id);
  }

  currentGame = {
    ...currentGame,

    board: {
      ...currentGame.board,

      clueDiscard: [
        ...(currentGame.board.clueDiscard ?? []),
        ...(currentGame.investigators[investigatorId].clueTokens ?? []),
      ],

      assetDiscard: [
        ...currentGame.board.assetDiscard,
        ...assetsToDiscard,
      ],

      artifactDiscard: [
        ...currentGame.board.artifactDiscard,
        ...artifactsToDiscard,
      ],
    },
  };

  /*
   * ==========================================================
   * DISCARD CONDITIONS
   * ==========================================================
   */

  const conditionIds = [
    ...investigator.conditionIds,
  ];

  for (const conditionId of conditionIds) {
    currentGame =
      discardCondition(
        currentGame,
        investigatorId,
        conditionId,
      );
  }

  /*
   * ==========================================================
   * MARK AS DEVOURED
   * ==========================================================
   *
   * Unlike a normally defeated Investigator,
   * no defeated Investigator token remains
   * on a City space.
   */

  currentGame = {
    ...currentGame,

    investigators: {
      ...currentGame.investigators,

      [investigatorId]: {
        ...currentGame.investigators[
          investigatorId
        ],

        isDefeated: true,

        defeatType:
          "devoured",

        spaceId:
          null,

        assetIds:
          [],

        spellIds:
          [],

        artifactIds:
          [],

        conditionIds:
          [],

        clues:
          0,

        clueTokens: [],

        improvementTokens: {},

        trainTickets:
          0,

        shipTickets:
          0,

        resources:
          0,

        engagedMonsterIds:
          [],
      },
    },

    investigatorOrder: currentGame.ancientOne.awakened
      ? currentGame.investigatorOrder.filter((id) => id !== investigatorId)
      : currentGame.investigatorOrder,

    pendingInvestigatorReplacements: currentGame.ancientOne.awakened
      ? currentGame.pendingInvestigatorReplacements.filter((id) => id !== investigatorId)
      : currentGame.pendingInvestigatorReplacements.includes(investigatorId)
        ? currentGame.pendingInvestigatorReplacements
        : [...currentGame.pendingInvestigatorReplacements, investigatorId],
  };

  if (currentGame.ancientOne.awakened && currentGame.investigatorOrder.length === 0) {
    return {
      ...currentGame,
      status: "defeat",
      activeInvestigatorId: null,
      pendingDecision: null,
    };
  }

  /*
   * ==========================================================
   * LEAD INVESTIGATOR DEVOURED
   * ==========================================================
   */

  if (
    currentGame.leadInvestigatorId ===
    investigatorId
  ) {
    const selectableInvestigatorIds =
      currentGame.investigatorOrder.filter(
        (candidateId) => {
          const candidate =
            currentGame.investigators[
              candidateId
            ];

          return (
            candidate &&
            !candidate.isDefeated &&
            candidateId !== investigatorId
          );
        },
      );

    /*
     * No investigator remains.
     */

    if (
      selectableInvestigatorIds.length === 0
    ) {
      if (!currentGame.ancientOne.awakened) {
        return {
          ...currentGame,
          activeInvestigatorId: null,
          pendingDecision: resumePendingDecision ?? null,
        };
      }

      return {
        ...currentGame,

        status:
          "defeat",

        activeInvestigatorId:
          null,

        pendingDecision:
          null,
      };
    }

    /*
     * Choose a new Lead Investigator.
     */

    currentGame = {
      ...currentGame,

      activeInvestigatorId:
        null,

      pendingDecision: {
        type:
          "select-investigator",

        title:
          "Choose Lead Investigator",

        message:
          "The Lead Investigator was devoured. Choose a new Lead Investigator.",

        investigatorIds:
          selectableInvestigatorIds,

        source:
          "defeat:lead",

        resume: {
          type:
            "defeat-lead",

          phase:
            currentGame.phase ===
            "mythos"
              ? "mythos"
              : "action",

          pendingDecision:
            resumePendingDecision,
        },
      },
    };
  }

  return currentGame;
}
