import type { GameState } from "../models/GameState";
import { getCurrentOmen } from "./omenEngine";
import type { MapDefinition } from "../models/MapDefinition";

import { showMythosContinue } from "./showMythosContinue";
import { spawnMythosGates } from "./spawnMythosGates";
import { spawnMonsterAtSpace } from "./spawnMonster";
import { resolveAncientOneAwakening } from "./resolveAncientOneAwakening";

export function resolveMythosMonsterSurge(
  game: GameState,
  map: MapDefinition,
  nextIconIndex: number,
): GameState {
  /*
   * ============================================================
   * MONSTER SURGE
   * ============================================================
   *
   * 1–2 investigators -> 1 Monster per matching Gate
   * 3–6 investigators -> 2 Monsters per matching Gate
   * 7–8 investigators -> 3 Monsters per matching Gate
   */

  const investigatorCount =
    game.investigatorOrder.length;

  const monstersPerGate =
    investigatorCount <= 2
      ? 1
      : investigatorCount <= 6
        ? 2
        : 3;

  /*
  * The current Omen determines which Gates receive
  * the Monster Surge.
  *
  * Each GateToken stores its Omen symbol directly.
  */

  const currentOmen = getCurrentOmen(game);

  const matchingGateSpaceIds = Object.entries(
    game.board.spaces,
  )
    .flatMap(
      ([spaceId, space]) =>
        space.gates
          .filter(
            (gate) =>
              gate.omen === currentOmen,
          )
          .map(() => spaceId),
    );

  /*
   * If there are no matching Gates, Monster Surge
   * becomes a normal Gate spawn.
   *
   * We leave that branch for the next step so that
   * the Gate spawning logic stays centralized.
   */

  if (matchingGateSpaceIds.length === 0) {
    /*
    * If no Gate matches the current Omen,
    * Monster Surge spawns exactly one Gate.
    */

    const wasAwakened =
      game.ancientOne.awakened;

    const gameAfterGateSpawn =
      spawnMythosGates(
        game,
        nextIconIndex,
        1,
      );

    /*
    * If spawning the replacement Gate caused
    * Doom to reach 0, resolve the Ancient One
    * Awakening immediately.
    */

    if (
      !wasAwakened &&
      gameAfterGateSpawn.ancientOne.awakened
    ) {
      return resolveAncientOneAwakening(
        gameAfterGateSpawn,
        map,
        nextIconIndex,
      );
    }

    return gameAfterGateSpawn;
  }

  let currentGame = game;

  /*
   * Spawn the required number of Monsters at every
   * matching Gate.
   */

    for (const spaceId of matchingGateSpaceIds) {
      if (currentGame.ancientOne.awakened) {
        break;
      }

      for (let i = 0; i < monstersPerGate; i++) {
        if (currentGame.ancientOne.awakened) {
          break;
        }
        
        if (currentGame.board.monsterCup.length === 0) {
          break;
        }

        currentGame =
          spawnMonsterAtSpace(
            currentGame,
            spaceId,
          );
      }
    }

  return showMythosContinue(
    currentGame,
    nextIconIndex,
  );
}