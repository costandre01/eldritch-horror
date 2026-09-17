import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { easyMythos } from "../../content/core/mythos/easyMythos";
import { normalMythos } from "../../content/core/mythos/normalMythos";
import { hardMythos } from "../../content/core/mythos/hardMythos";
import { startConditionReckoning } from "./startConditionReckoning";
import { gainConditionByCategory } from "./gainCondition";
import { getInvestigatorConditionsByCategory } from "./getInvestigatorConditions";
import { resolveMythosSpecial } from "./resolveMythosSpecial";

const ALL_MYTHOS = [
  ...easyMythos,
  ...normalMythos,
  ...hardMythos,
];

export function resolveMythosCardReckoning(
  game: GameState,
  _map: MapDefinition,
): GameState {
  const decision =
    game.pendingDecision;

  if (
    !decision ||
    decision.type !==
      "mythos-card-reckoning"
  ) {
    throw new Error(
      "There is no active Mythos card Reckoning decision.",
    );
  }

  /*
   * ============================================================
   * FIND NEXT MYTHOS
   * ============================================================
   */

  const mythosId =
    decision.mythosIds.find(
      (id) =>
        !decision.resolvedMythosIds.includes(
          id,
        ),
    );

  /*
   * All Mythos cards have been resolved.
   */

  if (!mythosId) {
    const gameWithoutDecision: GameState = {
        ...game,
        pendingDecision: null,
    };

    return startConditionReckoning(
        gameWithoutDecision,
        _map,
        decision.nextIconIndex,
    );
    }

  const mythos =
    ALL_MYTHOS.find(
      (definition) =>
        definition.id ===
        mythosId,
    );

  if (!mythos) {
    throw new Error(
      `Mythos "${mythosId}" does not exist.`,
    );
  }

  const mythosInPlayIndex =
    game.board.mythosInPlay.findIndex(
      (entry) =>
        entry.definitionId ===
        mythosId,
    );

  /*
   * The Mythos may have been removed from play
   * by another effect.
   */

  if (
    mythosInPlayIndex === -1
  ) {
    return {
      ...game,

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };
  }

  const mythosInPlay =
    game.board.mythosInPlay[
      mythosInPlayIndex
    ];

  if (!mythosInPlay) {
    return {
      ...game,

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };
  }

  if (
    mythos.reckoning?.type ===
    "lead-gains-madness"
  ) {
    const leadInvestigatorId =
      game.leadInvestigatorId;

    if (!leadInvestigatorId) {
      throw new Error(
        "There is no Lead Investigator.",
      );
    }

    let currentGame =
      gainConditionByCategory(
        game,
        leadInvestigatorId,
        "madness",
      );

    const madnessCount =
      getInvestigatorConditionsByCategory(
        currentGame,
        leadInvestigatorId,
        "madness",
      ).length;

    const eldritchTokensToDiscard =
      Math.min(
        madnessCount,
        mythosInPlay.eldritchTokens,
      );

    const updatedMythosInPlay = [
      ...currentGame.board.mythosInPlay,
    ];

    const remainingEldritchTokens =
      mythosInPlay.eldritchTokens -
      eldritchTokensToDiscard;

    updatedMythosInPlay[
      mythosInPlayIndex
    ] = {
      ...mythosInPlay,

      eldritchTokens:
        remainingEldritchTokens,
    };

    currentGame = {
      ...currentGame,

      board: {
        ...currentGame.board,

        mythosInPlay:
          updatedMythosInPlay,
      },
    };

    /*
    * ==========================================================
    * GROWING MADNESS
    * ==========================================================
    *
    * Growing Madness is immediately resolved when its last
    * Eldritch Token is discarded.
    *
    * IMPORTANT:
    *
    * resolveMythosSpecial() may change the pendingDecision.
    * Therefore, when the Rumor is solved, we must return its
    * result directly and must NOT recreate the old Reckoning
    * decision afterwards.
    */

    if (
      mythos.id === "growing-madness" &&
      remainingEldritchTokens === 0
    ) {
      return resolveMythosSpecial(
        currentGame,
        mythos,
        "growing-madness",
        _map,
      );
    }

    /*
    * Mark this Mythos Reckoning as resolved.
    */

    return {
      ...currentGame,

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };
  }

  /*
   * ============================================================
   * RECKONING
   * ============================================================
   */

  if (
    mythos.reckoning?.type ===
    "discard-eldritch-token"
  ) {
    const eldritchTokens =
      Math.max(
        0,
        mythosInPlay.eldritchTokens - 1,
      );

    const updatedMythosInPlay =
      [
        ...game.board.mythosInPlay,
      ];

    updatedMythosInPlay[
      mythosInPlayIndex
    ] = {
      ...mythosInPlay,

      eldritchTokens,
    };

    const updatedGame: GameState = {
      ...game,

      board: {
        ...game.board,

        mythosInPlay:
          updatedMythosInPlay,
      },

      pendingDecision: {
        ...decision,

        resolvedMythosIds: [
          ...decision.resolvedMythosIds,
          mythosId,
        ],
      },
    };

    /*
    * ==========================================================
    * MYTHOS REACHES 0 ELDritch TOKENS
    * ==========================================================
    *
    * Growing Madness and Fractured Reality resolve
    * immediately when their last Eldritch Token is removed.
    */

    if (
      eldritchTokens === 0 &&
      (
        mythos.id ===
          "growing-madness" ||
        mythos.id ===
          "fractured-reality"
      )
    ) {
      return resolveMythosSpecial(
        updatedGame,
        mythos,
        mythos.id,
        _map,
      );
    }

    return updatedGame;
  }

  /*
   * No supported Reckoning effect.
   */

  return {
    ...game,

    pendingDecision: {
      ...decision,

      resolvedMythosIds: [
        ...decision.resolvedMythosIds,
        mythosId,
      ],
    },
  };
}