import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { canPerformAction } from "./canPerformAction";
import { rollTest } from "./rollTest";
import { getEffectiveSkill } from "./getEffectiveSkill";

import type { AcquireAssetsResult } from "../models/AcquireAssetsResult";

export function startAcquireAssets(
  game: GameState,
  map: MapDefinition,
): AcquireAssetsResult {
  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    throw new Error(
      "There is no active investigator.",
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

  if (
    !canPerformAction(
      investigator,
      "acquire-assets",
    )
  ) {
    throw new Error(
      "Investigator cannot perform Acquire Assets.",
    );
  }

  if (!investigator.spaceId) {
    throw new Error(
      "Investigator has no current space.",
    );
  }

  const space = map.spaces.find(
    (item) =>
      item.id === investigator.spaceId,
  );

  if (!space) {
    throw new Error(
      `Space "${investigator.spaceId}" does not exist.`,
    );
  }

  if (space.type !== "city") {
    throw new Error(
      "Acquire Assets can only be performed in a City.",
    );
  }

  const boardSpace =
    game.board.spaces[
      investigator.spaceId
    ];

  if (!boardSpace) {
    throw new Error(
      `Board space "${investigator.spaceId}" does not exist.`,
    );
  }

  if (
    boardSpace.monsterIds.length > 0
  ) {
    throw new Error(
      "Cannot Acquire Assets while a Monster is present.",
    );
  }

  /*
   * ============================================================
   * CALCULATE EFFECTIVE INFLUENCE
   * ============================================================
   *
   * Includes:
   *
   * - Investigator base Influence
   * - Passive Asset skill modifiers
   *
   */

  const effectiveInfluence =
    getEffectiveSkill(
      game,
      investigatorId,
      "influence",
    );

  /*
   * ============================================================
   * ROLL INFLUENCE TEST
   * ============================================================
   */

  const test = rollTest(
    {
      ...investigator,

      skills: {
        ...investigator.skills,

        influence:
          effectiveInfluence,
      },
    },
    "influence",
  );

  return {
    test,

    availableAssetIds:
      game.board.assetReserve.map(
        (asset) => asset.id,
      ),
  };
}