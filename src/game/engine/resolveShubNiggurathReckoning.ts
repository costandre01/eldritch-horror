import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { startMonsterCombat } from "./startMonsterCombat";

function continueAncientOneReckoning(
  game: GameState,
  ancientOneAbilityIndex: number,
  ancientOneId: string,
  ancientOneReckoningStage:
    | "front"
    | "awakened",
  nextIconIndex: number,
): GameState {
  return {
    ...game,
    pendingDecision: {
      type: "mythos-ancient-one-reckoning",

      title:
        "ANCIENT ONE — RECKONING",

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

export function resolveShubNiggurathReckoning(
  game: GameState,
  map: MapDefinition,
  investigatorIds: string[],
  nextInvestigatorIndex: number,
  nextIconIndex: number,
  monsterId: string,
  ancientOneAbilityIndex: number,
  ancientOneId: string,
  ancientOneReckoningStage:
    | "front"
    | "awakened",
): GameState {
  /*
   * ============================================================
   * CHECK WHETHER THE EPIC MONSTER STILL EXISTS
   * ============================================================
   */

  const monster =
    game.monsters[monsterId];

  if (
    !monster ||
    monster.spaceId === null
  ) {
    return continueAncientOneReckoning(
      {
        ...game,
        pendingDecision: null,
        activeInvestigatorId: null,
      },
      ancientOneAbilityIndex,
      ancientOneId,
      ancientOneReckoningStage,
      nextIconIndex,
    );
  }

  /*
   * ============================================================
   * FIND NEXT INVESTIGATOR
   * ============================================================
   */

  if (
    nextInvestigatorIndex >=
    investigatorIds.length
  ) {
    return continueAncientOneReckoning(
      {
        ...game,
        pendingDecision: null,
        activeInvestigatorId: null,
      },
      ancientOneAbilityIndex,
      ancientOneId,
      ancientOneReckoningStage,
      nextIconIndex,
    );
  }

  const investigatorId =
    investigatorIds[nextInvestigatorIndex];

  if (!investigatorId) {
    return resolveShubNiggurathReckoning(
      game,
      map,
      investigatorIds,
      nextInvestigatorIndex + 1,
      nextIconIndex,
      monsterId,
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

  if (investigator.isDefeated) {
    return resolveShubNiggurathReckoning(
      game,
      map,
      investigatorIds,
      nextInvestigatorIndex + 1,
      nextIconIndex,
      monsterId,
      ancientOneAbilityIndex,
      ancientOneId,
      ancientOneReckoningStage,
    );
  }

  /*
   * ============================================================
   * VERIFY INVESTIGATOR IS STILL ON SHUB-NIGGURATH'S SPACE
   * ============================================================
   */

  if (
    investigator.spaceId !==
    monster.spaceId
  ) {
    return resolveShubNiggurathReckoning(
      game,
      map,
      investigatorIds,
      nextInvestigatorIndex + 1,
      nextIconIndex,
      monsterId,
      ancientOneAbilityIndex,
      ancientOneId,
      ancientOneReckoningStage,
    );
  }

  /*
   * ============================================================
   * MAKE THIS INVESTIGATOR ACTIVE
   * ============================================================
   */

  const gameWithActiveInvestigator: GameState = {
    ...game,

    activeInvestigatorId:
      investigatorId,
  };

  /*
   * ============================================================
   * START COMBAT
   * ============================================================
   *
   * This is an existing Monster already on the board.
   *
   * The resume information tells the Combat flow that,
   * after this combat ends, it must return to the
   * Shub-Niggurath Reckoning instead of continuing
   * the normal Encounter flow.
   */

  return startMonsterCombat(
    gameWithActiveInvestigator,
    monsterId,
    {
      type:
        "shub-niggurath-reckoning",

      monsterId,

      investigatorIds,

      nextInvestigatorIndex:
        nextInvestigatorIndex,

      nextIconIndex,

      ancientOneAbilityIndex,

      ancientOneId,

      ancientOneReckoningStage,
    },
  );
}