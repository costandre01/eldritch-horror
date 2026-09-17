import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { CORE_ANCIENT_ONES } from "../../content/core/coreAncientOnes";
import { spawnMonster } from "./spawnMonster";
import { resolveYogSothothReckoning } from "./resolveYogSothothReckoning";
import { resolveShubNiggurathReckoning } from "./resolveShubNiggurathReckoning";
import { showMythosContinue } from "./showMythosContinue";
import { startMythosCardReckoning } from "./startMythosCardReckoning";
import { advanceDoom } from "./doomEngine";
import { resolveAncientOneAwakening } from "./resolveAncientOneAwakening";

function getAncientOneDefinition(
  ancientOneId: string,
) {
  return CORE_ANCIENT_ONES.find(
    (ancientOne) => ancientOne.id === ancientOneId,
  );
}

function continueAncientOneReckoning(
  game: GameState,
  decision: Extract<
    GameState["pendingDecision"],
    {
      type: "mythos-ancient-one-reckoning";
    }
  >,
): GameState {
  return {
    ...game,
    pendingDecision: {
      ...decision,
      abilityIndex:
        decision.abilityIndex + 1,
    },
  };
}

export function resolveAncientOneReckoning(
  game: GameState,
  map: MapDefinition,
): GameState {
  const decision = game.pendingDecision;

  if (
    !decision ||
    decision.type !== "mythos-ancient-one-reckoning"
  ) {
    throw new Error(
      "There is no active Ancient One Reckoning decision.",
    );
  }

  const ancientOne = getAncientOneDefinition(
    decision.ancientOneId,
  );

  if (!ancientOne) {
    throw new Error(
      `Ancient One "${decision.ancientOneId}" does not exist.`,
    );
  }

  const abilities =
    decision.reckoningStage === "awakened"
      ? ancientOne.reckoning.awakened
      : ancientOne.reckoning.front;

  const ability = abilities[decision.abilityIndex];

  /*
   * ============================================================
   * NO MORE ANCIENT ONE RECKONING EFFECTS
   * ============================================================
   */

  if (!ability) {
    const gameWithoutDecision: GameState = {
      ...game,
      pendingDecision: null,
    };

    return startMythosCardReckoning(
      gameWithoutDecision,
      map,
      decision.nextIconIndex,
    );
  }

  switch (ability.type) {
    /*
     * ============================================================
     * CTHULHU
     * ============================================================
     *
     * Each investigator on a Sea space that does not already
     * contain an Eldritch Token places 1 Eldritch Token there.
     */

    case "place-eldritch-token-on-sea": {
      const investigators = Object.values(
        game.investigators,
      );

      const tokenSpaceIds = [
        ...game.ancientOne.eldritchTokenSpaceIds,
      ];

      let tokensPlaced = 0;

      for (const investigator of investigators) {
        if (!investigator.spaceId) {
          continue;
        }

        const space = map.spaces.find(
          (candidate) =>
            candidate.id === investigator.spaceId,
        );

        if (!space || space.type !== "sea") {
          continue;
        }

        if (
          tokenSpaceIds.includes(
            investigator.spaceId,
          )
        ) {
          continue;
        }

        tokenSpaceIds.push(
          investigator.spaceId,
        );

        tokensPlaced += 1;
      }

      const gameAfterEffect: GameState = {
        ...game,

        ancientOne: {
          ...game.ancientOne,

          eldritchTokens:
            game.ancientOne.eldritchTokens +
            tokensPlaced,

          eldritchTokenSpaceIds:
            tokenSpaceIds,
        },
      };

      return continueAncientOneReckoning(
        gameAfterEffect,
        decision,
      );
    }

    /*
     * ============================================================
     * SHUB-NIGGURATH
     * ============================================================
     *
     * Spawn 1 Monster on a random space.
     *
     * Then, if there are 10 or more Monsters on the board,
     * advance Doom by 2.
     */

    case "spawn-monster-and-advance-doom": {
      const gameAfterSpawn =
        spawnMonster(
          game,
          map,
        );

      const monstersOnBoard =
        Object.values(
          gameAfterSpawn.monsters,
        ).filter(
          (monster) =>
            monster.spaceId !== null &&
            monster.health > 0,
        ).length;

      const wasAwakened =
        gameAfterSpawn.ancientOne.awakened;

      const gameAfterDoom =
        monstersOnBoard >= 10
          ? advanceDoom(
              gameAfterSpawn,
              2,
            )
          : gameAfterSpawn;

      /*
      * If the Ancient One awakened because
      * of this Doom advance, resolve its
      * Awakening immediately.
      */

      if (
        !wasAwakened &&
        gameAfterDoom.ancientOne.awakened
      ) {
        return resolveAncientOneAwakening(
          gameAfterDoom,
          map,
          decision.nextIconIndex,
          {
            type: "ancient-one-reckoning",
            abilityIndex:
              decision.abilityIndex,
            ancientOneId:
              decision.ancientOneId,
            ancientOneReckoningStage:
              decision.reckoningStage,
          },
        );
      }

      return continueAncientOneReckoning(
        gameAfterDoom,
        decision,
      );
    }

    /*
     * ============================================================
     * YOG-SOTHOTH
     * ============================================================
     *
     * Each investigator on a Gate must:
     *
     * - discard 1 Spell
     * OR
     * - advance Doom by 1.
     *
     * The actual interaction is handled by the
     * Yog-Sothoth Reckoning resolver.
     */

    case "investigators-on-gate-advance-doom-unless-discard-spell": {
      return resolveYogSothothReckoning(
        {
          ...game,
          pendingDecision: null,
        },
        map,
        decision.nextIconIndex,
        decision.abilityIndex,
        decision.ancientOneId,
        decision.reckoningStage,
      );
    }

    case "each-investigator-lose-sanity": {
      const investigators =
        Object.values(
          game.investigators,
        );

      const updatedInvestigators = {
        ...game.investigators,
      };

      for (const investigator of investigators) {
        updatedInvestigators[investigator.id] = {
          ...investigator,

          sanity: Math.max(
            0,
            investigator.sanity -
              ability.amount,
          ),

          isDefeated:
            investigator.sanity -
              ability.amount <= 0 ||
            investigator.health <= 0,
        };
      }

      const gameAfterEffect: GameState = {
        ...game,

        investigators:
          updatedInvestigators,
      };

      return continueAncientOneReckoning(
        gameAfterEffect,
        decision,
      );
    }

    case "lose-sanity-per-sanity-token": {
      const sanityLoss =
        game.ancientOne.sanityTokens;

      if (sanityLoss <= 0) {
        return continueAncientOneReckoning(
          game,
          decision,
        );
      }

      const investigators =
        Object.values(
          game.investigators,
        );

      const updatedInvestigators = {
        ...game.investigators,
      };

      for (const investigator of investigators) {
        updatedInvestigators[investigator.id] = {
          ...investigator,

          sanity: Math.max(
            0,
            investigator.sanity -
              sanityLoss,
          ),

          isDefeated:
            investigator.sanity -
              sanityLoss <= 0 ||
            investigator.health <= 0,
        };
      }

      const gameAfterEffect: GameState = {
        ...game,

        investigators:
          updatedInvestigators,
      };

      return continueAncientOneReckoning(
        gameAfterEffect,
        decision,
      );
    }

    case "investigators-on-ancient-one-space-combat": {
      /*
       * ============================================================
       * SHUB-NIGGURATH — AWAKENED
       * ============================================================
       *
       * Each investigator on the space containing the
       * Shub-Niggurath Epic Monster must immediately
       * resolve a Combat Encounter against it.
       */

      const shubNiggurath =
        Object.values(
          game.monsters,
        ).find(
          (monster) =>
            monster.definitionId ===
              "shub-niggurath" &&
            monster.spaceId !== null,
        );

      /*
       * Shub-Niggurath is not currently on the board.
       */

      if (!shubNiggurath) {
        return continueAncientOneReckoning(
          {
            ...game,
            pendingDecision: null,
          },
          decision,
        );
      }

      /*
       * ============================================================
       * FIND INVESTIGATORS ON SHUB-NIGGURATH'S SPACE
       * ============================================================
       *
       * Use the normal investigator order.
       */

      const investigatorIds =
        game.investigatorOrder.filter(
          (investigatorId) => {
            const investigator =
              game.investigators[
                investigatorId
              ];

            if (
              !investigator ||
              investigator.isDefeated ||
              !investigator.spaceId
            ) {
              return false;
            }

            return (
              investigator.spaceId ===
              shubNiggurath.spaceId
            );
          },
        );

      /*
       * No investigators are on the space.
       */

      if (investigatorIds.length === 0) {
        return continueAncientOneReckoning(
          {
            ...game,
            pendingDecision: null,
          },
          decision,
        );
      }

      /*
       * ============================================================
       * START FIRST COMBAT
       * ============================================================
       */

      return resolveShubNiggurathReckoning(
        {
          ...game,
          pendingDecision: null,
        },
        map,
        investigatorIds,
        0,
        decision.nextIconIndex,
        shubNiggurath.id,
        decision.abilityIndex,
        decision.ancientOneId,
        decision.reckoningStage,
      );
    }

    /*
     * ============================================================
     * FALLBACK
     * ============================================================
     */

    default: {
      const gameWithoutDecision: GameState = {
        ...game,
        pendingDecision: null,
      };

      return showMythosContinue(
        gameWithoutDecision,
        decision.nextIconIndex,
      );
    }
  }
}