import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import {
  solveActiveMystery,
} from "./mysteryEngine";
import {
  resolveMysteryEnterPlay,
} from "./resolveMysteryEnterPlay";
import {
  CORE_MONSTERS,
} from "../../content/core/coreMonsters";
import {
  resolveMonsterToughness,
} from "./resolveMonsterToughness";

function getInvestigatorCount(
  game: GameState,
): number {
  return Object.keys(
    game.investigators,
  ).length;
}

function isActiveMysteryComplete(
  game: GameState,
): boolean {
  const mysteryId =
    game.mysteries.activeMysteryId;

  if (!mysteryId) {
    return false;
  }

  const progress =
    game.mysteries.progress[mysteryId];

  if (!progress) {
    return false;
  }

  const investigatorCount =
    getInvestigatorCount(game);

  switch (mysteryId) {
    /*
     * ============================================================
     * AZATHOTH
     * ============================================================
     */

    case "azathoth-occult-research":
      return (
        progress.clueTokenIds.length >=
        investigatorCount
      );

    case "azathoth-omen-of-devastation":
      return (
        progress.eldritchTokenCount >=
        Math.ceil(
          investigatorCount / 2,
        )
      );

    case "azathoth-seed-of-the-daemon-sultan":
      return (
        progress.eldritchTokenCount >=
        Math.ceil(
          investigatorCount / 2,
        )
      );

    case "azathoth-the-true-name":
      return (
        progress.eldritchTokenCount >=
        Math.ceil(
          investigatorCount / 2,
        )
      );

    /*
     * ============================================================
     * CTHULHU
     * ============================================================
     */

    case "cthulhu-rlyeh-risen":
      return (
        progress.eldritchTokenCount >=
        Math.ceil(
          investigatorCount / 2,
        )
      );

    case "cthulhu-the-deep-ones-attack":
      return (
        progress.eldritchTokenCount >=
        investigatorCount
      );

    case "cthulhu-the-stars-are-right":
      return (
        progress.clueTokenIds.length >=
        investigatorCount
      );

    case "cthulhu-watching-the-stars":
      return game.epicMonstersDefeated.includes(
        "cthylla",
      );

    /*
     * ============================================================
     * SHUB-NIGGURATH
     * ============================================================
     */

    case "shub-niggurath-hunting-the-thousand": {
      let totalToughness = 0;

      for (
        const monsterId of
        progress.monsterIds
      ) {
        const monster =
          game.monsters[monsterId];

        if (!monster) {
          continue;
        }

        const definition =
          CORE_MONSTERS.find(
            (entry) =>
              entry.id ===
              monster.definitionId,
          );

        if (!definition) {
          continue;
        }

        totalToughness +=
          resolveMonsterToughness(
            game,
            definition,
          );
      }

      return (
        totalToughness >=
        investigatorCount * 2
      );
    }

    case "shub-niggurath-nature-of-the-all-mother":
      return (
        progress.clueTokenIds.length >=
        investigatorCount
      );

    case "shub-niggurath-rituals-in-the-wild":
      return (
        progress.eldritchTokenCount >=
        Math.ceil(
          investigatorCount / 2,
        )
      );

    case "shub-niggurath-spawn-of-the-black-goat":
      return game.epicMonstersDefeated.includes(
        "nug",
      );

    /*
     * ============================================================
     * YOG-SOTHOTH
     * ============================================================
     */

    case "yog-sothoth-arcane-understanding":
      return (
        progress.eldritchTokenCount >=
        Math.ceil(
          investigatorCount / 2,
        )
      );

    case "yog-sothoth-spawn-of-yog-sothoth":
      return game.epicMonstersDefeated.includes(
        "dunwich-horror",
      );

    case "yog-sothoth-the-beyond-one":
      return (
        progress.clueTokenIds.length >=
        investigatorCount
      );

    case "yog-sothoth-where-the-old-ones-broke-through":
      return (
        progress.gateIds.length >=
        Math.ceil(
          investigatorCount / 2,
        )
      );

    default:
      return false;
  }
}

export function checkActiveMystery(
  game: GameState,
  map: MapDefinition,
): GameState {
  /*
   * No active Mystery.
   */

  if (
    !game.mysteries.activeMysteryId
  ) {
    return game;
  }

  /*
   * After the Ancient One awakens,
   * the normal Mysteries are no longer
   * the victory mechanism.
   *
   * Final Mystery will be handled separately.
   */

  if (game.ancientOne.awakened) {
    return game;
  }

  if (
    !isActiveMysteryComplete(game)
  ) {
    return game;
  }

  /*
   * ============================================================
   * SOLVE ACTIVE MYSTERY
   * ============================================================
   */

  const solvedGame: GameState = {
    ...game,

    mysteries:
      solveActiveMystery(
        game.mysteries,
      ),
  };

  /*
   * ============================================================
   * VICTORY
   * ============================================================
   *
   * Solving 3 Mysteries wins the game
   * before the Ancient One awakens.
   */

  if (
    solvedGame.mysteries
      .solvedMysteryIds.length >= 3
  ) {
    return {
      ...solvedGame,

      status: "victory",

      activeInvestigatorId:
        null,

      pendingDecision:
        null,

      pendingEncounterChoice:
        null,
    };
  }

  /*
   * ============================================================
   * REVEAL NEXT MYSTERY
   * ============================================================
   *
   * solveActiveMystery() already selects
   * the next unresolved Mystery.
   *
   * Now apply its "when this Mystery
   * enters play" effect.
   */

  return resolveMysteryEnterPlay(
    solvedGame,
    map,
  );
}