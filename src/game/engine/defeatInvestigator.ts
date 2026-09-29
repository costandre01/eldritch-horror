import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { advanceDoom } from "./doomEngine";
import { discardCondition } from "./discardCondition";
import { findNearestCity } from "./findNearestCity";
import type { InvestigatorDefeatResume } from "../models/PendingDecision";

export function defeatInvestigator(
  game: GameState,
  map: MapDefinition,
  investigatorId: string,
  resumeMonsterId?: string,
  chosenDefeatType?:
    | "crippled"
    | "insane",
  defeatResume?: InvestigatorDefeatResume,
): GameState {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
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

  /*
   * Already defeated.
   *
   * Do not apply Doom / movement / Conditions
   * more than once.
   */
  if (investigator.isDefeated) {
    return game;
  }

  const healthDefeated =
    investigator.health <= 0;

  const sanityDefeated =
    investigator.sanity <= 0;

  /*
  * ==========================================================
  * DEFEAT TYPE
  * ==========================================================
  *
  * Health 0  -> Crippled
  * Sanity 0  -> Insane
  *
  * If both reached 0 at the same time, the player chooses
  * which Defeated Investigator marker is placed.
  */

  if (
    healthDefeated &&
    sanityDefeated &&
    !chosenDefeatType
  ) {
    return {
      ...game,

      pendingDecision: {
        type: "choice",

        title: "Investigator Defeated",

        message:
          "Your Health and Sanity were reduced to 0. Choose how the investigator was defeated.",

        options: [
          {
            id: `defeat-type:crippled:${investigatorId}`,
            title: "Crippled",
          },
          {
            id: `defeat-type:insane:${investigatorId}`,
            title: "Insane",
          },
        ],

        source:
          resumeMonsterId
            ? `defeat-type:${investigatorId}:${resumeMonsterId}`
            : `defeat-type:${investigatorId}`,

        resume:
          defeatResume,
      },
    };
  }

  const defeatType:
    | "crippled"
    | "insane" =
      chosenDefeatType ??
      (healthDefeated
        ? "crippled"
        : "insane");

  let currentGame = game;

  /*
   * ==========================================================
   * DOOM
   * ==========================================================
   */

  currentGame = advanceDoom(
    currentGame,
    1,
  );

  /*
   * ==========================================================
   * MOVE TO NEAREST CITY
   * ==========================================================
   */

  if (investigator.spaceId) {
    const nearestCityId =
      findNearestCity(
        map,
        investigator.spaceId,
      );

    if (nearestCityId) {
      currentGame = {
        ...currentGame,

        investigators: {
          ...currentGame.investigators,

          [investigatorId]: {
            ...currentGame.investigators[
              investigatorId
            ],

            spaceId:
              nearestCityId,
          },
        },
      };
    }
  }

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
   * MARK DEFEATED
   * ==========================================================
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

        defeatType,

        improvementTokens: {},
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
   * LEAD INVESTIGATOR DEFEATED
   * ==========================================================
   *
   * If the Lead is defeated, a new Lead must be
   * selected immediately.
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
     * Before the Ancient One awakens, even simultaneous defeat of
     * every investigator does not end the game. Those players choose
     * replacements at the end of the Mythos phase.
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

      currentGame = {
        ...currentGame,

        status: "defeat",

        activeInvestigatorId:
          null,

        pendingDecision:
          null,
      };

      return currentGame;
    }

    /*
     * Ask the players to choose the new Lead.
     *
     * The exact flow will be resumed by App.tsx
     * after the selection.
     */
    currentGame = {
      ...currentGame,

      activeInvestigatorId:
        null,

      pendingDecision: {
        type: "select-investigator",

        title:
          "Choose Lead Investigator",

        message:
          "The Lead Investigator was defeated. Choose a new Lead Investigator.",

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

          defeatResume,
        },
      },
    };
  }

  return currentGame;
}
