import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import { advanceDoom } from "./doomEngine";
import { resolveAncientOneAwakening } from "./resolveAncientOneAwakening";

import { showMythosContinue } from "./showMythosContinue";

export function resolveYogSothothReckoning(
  game: GameState,
  map: MapDefinition,
  nextIconIndex: number,
  ancientOneAbilityIndex?: number,
  ancientOneId?: string,
  ancientOneReckoningStage?:
    | "front"
    | "awakened",
): GameState {
  /*
   * ============================================================
   * FIND INVESTIGATORS ON GATES
   * ============================================================
   *
   * Investigators are checked in the game's investigator order.
   */

  const investigatorIds =
    game.investigatorOrder.filter(
      (investigatorId) => {
        const investigator =
          game.investigators[
            investigatorId
          ];

        if (!investigator?.spaceId) {
          return false;
        }

        const space =
          game.board.spaces[
            investigator.spaceId
          ];

        return (space?.gates.length ?? 0) > 0;
      },
    );

  /*
   * ============================================================
   * NO INVESTIGATORS ON GATES
   * ============================================================
   */

  if (investigatorIds.length === 0) {
    return showMythosContinue(
      {
        ...game,
        pendingDecision: null,
      },
      nextIconIndex,
    );
  }

  /*
   * ============================================================
   * RESOLVE FIRST INVESTIGATOR
   * ============================================================
   */

  return resolveNextYogSothothInvestigator(
    game,
    map,
    investigatorIds,
    0,
    nextIconIndex,
    ancientOneAbilityIndex,
    ancientOneId,
    ancientOneReckoningStage,
  );
}

export function resolveNextYogSothothInvestigator(
  game: GameState,
  map: MapDefinition,
  investigatorIds: string[],
  investigatorIndex: number,
  nextIconIndex: number,
  ancientOneAbilityIndex?: number,
  ancientOneId?: string,
  ancientOneReckoningStage?:
    | "front"
    | "awakened",
): GameState {
  /*
   * ============================================================
   * FINISHED
   * ============================================================
   */

  if (
    investigatorIndex >=
    investigatorIds.length
  ) {
    return showMythosContinue(
      {
        ...game,
        pendingDecision: null,
      },
      nextIconIndex,
    );
  }

  const investigatorId =
    investigatorIds[investigatorIndex];

  if (!investigatorId) {
    return resolveNextYogSothothInvestigator(
      game,
      map,
      investigatorIds,
      investigatorIndex + 1,
      nextIconIndex,
      ancientOneAbilityIndex,
      ancientOneId,
      ancientOneReckoningStage,
    );
  }

  const investigator =
    game.investigators[
      investigatorId
    ];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * GET CURRENT SPELLS
   * ============================================================
   *
   * Only Spells that still exist in the game registry
   * can be selected.
   */

  const spellIds =
    investigator.spellIds.filter(
      (spellId) =>
        game.spells[spellId] !==
        undefined,
    );

  /*
   * ============================================================
   * NO SPELL
   * ============================================================
   *
   * If the investigator has no Spell,
   * Doom advances by 1 automatically.
   */

  if (spellIds.length === 0) {
    const wasAwakened =
      game.ancientOne.awakened;

    const updatedGame =
      advanceDoom(game, 1);

    if (
      !wasAwakened &&
      updatedGame.ancientOne.awakened
    ) {
      return resolveAncientOneAwakening(
        updatedGame,
        map,
        nextIconIndex,
        {
          type: "yog-sothoth-reckoning",
          investigatorIds,
          nextInvestigatorIndex:
            investigatorIndex + 1,
          ancientOneAbilityIndex:
            ancientOneAbilityIndex ?? 0,
          ancientOneId:
            ancientOneId ?? game.ancientOne.id,
          ancientOneReckoningStage:
            ancientOneReckoningStage ?? "awakened",
        },
      );
    }

    return resolveNextYogSothothInvestigator(
      updatedGame,
      map,
      investigatorIds,
      investigatorIndex + 1,
      nextIconIndex,
      ancientOneAbilityIndex,
      ancientOneId,
      ancientOneReckoningStage,
    );
  }

  /*
   * ============================================================
   * PLAYER CHOICE
   * ============================================================
   *
   * The investigator has at least one Spell.
   *
   * The player must choose:
   *
   * - discard 1 Spell
   * - OR advance Doom by 1
   */

  return {
    ...game,

    pendingDecision: {
      type: "mythos-yog-sothoth-spell",

      title:
        "YOG-SOTHOTH — RECKONING",

      message:
        "Discard 1 Spell or advance Doom by 1.",

      investigatorId,

      spellIds,

      nextInvestigatorIndex:
        investigatorIndex,

      investigatorIds,

      nextIconIndex,

      ancientOneAbilityIndex,

      source:
        "mythos:yog-sothoth-spell",
      
      ancientOneId,

      ancientOneReckoningStage,
    },
  };
}