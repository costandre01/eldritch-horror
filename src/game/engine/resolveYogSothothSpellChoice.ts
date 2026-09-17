import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import { advanceDoom } from "./doomEngine";
import { resolveAncientOneAwakening } from "./resolveAncientOneAwakening";

import { resolveMythos } from "./resolveMythos";

export function resolveYogSothothSpellChoice(
  game: GameState,
  map: MapDefinition,
  choice: string,
): GameState {
  const decision = game.pendingDecision;

  if (
    !decision ||
    decision.type !== "mythos-yog-sothoth-spell"
  ) {
    throw new Error(
      "There is no active Yog-Sothoth Spell decision.",
    );
  }

  const investigator =
    game.investigators[
      decision.investigatorId
    ];

  if (!investigator) {
    throw new Error(
      `Investigator "${decision.investigatorId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * ADVANCE DOOM
   * ============================================================
   */

  if (choice === "doom") {
    const wasAwakened =
      game.ancientOne.awakened;

    const updatedGame: GameState = {
      ...advanceDoom(game, 1),

      pendingDecision: null,
    };

    if (
      !wasAwakened &&
      updatedGame.ancientOne.awakened
    ) {
      return resolveAncientOneAwakening(
        updatedGame,
        map,
        decision.nextIconIndex,
        {
          type: "yog-sothoth-reckoning",
          investigatorIds:
            decision.investigatorIds,
          nextInvestigatorIndex:
            decision.nextInvestigatorIndex + 1,
          ancientOneAbilityIndex:
            decision.ancientOneAbilityIndex ?? 0,
          ancientOneId:
            decision.ancientOneId ??
            game.ancientOne.id,
          ancientOneReckoningStage:
            decision.ancientOneReckoningStage ??
            "awakened",
        },
      );
    }

    return resolveNextYogSothothInvestigator(
      updatedGame,
      map,
      decision.investigatorIds,
      decision.nextInvestigatorIndex + 1,
      decision.nextIconIndex,
      decision.ancientOneAbilityIndex,
      decision.ancientOneId,
      decision.ancientOneReckoningStage,
    );
  }

  /*
   * ============================================================
   * DISCARD SPELL
   * ============================================================
   */

  if (!decision.spellIds.includes(choice)) {
    throw new Error(
      `Spell "${choice}" cannot be selected for this Yog-Sothoth Reckoning.`,
    );
  }

  if (!investigator.spellIds.includes(choice)) {
    throw new Error(
      `Investigator "${investigator.id}" does not possess Spell "${choice}".`,
    );
  }

  const spell =
    game.spells[choice];

  if (!spell) {
    throw new Error(
      `Spell "${choice}" does not exist.`,
    );
  }

  const updatedInvestigator = {
    ...investigator,

    spellIds:
      investigator.spellIds.filter(
        (spellId) =>
          spellId !== choice,
      ),
  };

  const updatedGame: GameState = {
    ...game,

    investigators: {
      ...game.investigators,

      [investigator.id]:
        updatedInvestigator,
    },

    board: {
      ...game.board,

      spellDiscard: [
        ...game.board.spellDiscard,
        spell,
      ],
    },

    pendingDecision: null,
  };

  return resolveNextYogSothothInvestigator(
    updatedGame,
    map,
    decision.investigatorIds,
    decision.nextInvestigatorIndex + 1,
    decision.nextIconIndex,
    decision.ancientOneAbilityIndex,
    decision.ancientOneId,
    decision.ancientOneReckoningStage,
  );
}

function resolveNextYogSothothInvestigator(
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
    if (
      ancientOneAbilityIndex !== undefined &&
      ancientOneId !== undefined &&
      ancientOneReckoningStage !== undefined
    ) {
      return {
        ...game,
        pendingDecision: {
          type: "mythos-ancient-one-reckoning",
          title: "ANCIENT ONE — RECKONING",
          message:
            "Continue resolving the Ancient One Reckoning.",
          ancientOneId,
          reckoningStage:
            ancientOneReckoningStage,
          abilityIndex:
            ancientOneAbilityIndex + 1,
          source:
            "mythos:ancient-one-reckoning",
          nextIconIndex,
        },
      };
    }

    return resolveMythos(
      {
        ...game,
        pendingDecision: null,
      },
      map,
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
   * Doom advances automatically.
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
            ancientOneId ??
            game.ancientOne.id,
          ancientOneReckoningStage:
            ancientOneReckoningStage ??
            "awakened",
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

      source:
        "mythos:yog-sothoth-spell",

      ancientOneAbilityIndex,

      ancientOneId,

      ancientOneReckoningStage,
    },
  };
}