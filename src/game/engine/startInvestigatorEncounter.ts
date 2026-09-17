import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { startMonsterCombat } from "./startMonsterCombat";
import { startEncounter } from "./startEncounter";
import { startCombatOrder } from "./startCombatOrder";

export function startInvestigatorEncounter(
  game: GameState,
  map: MapDefinition,
): GameState {
  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    throw new Error(
      "There is no active investigator.",
    );
  }

  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  if (game.phase !== "encounter") {
    throw new Error(
      "Investigator encounters can only start during the Encounter phase.",
    );
  }

  if (!investigator.spaceId) {
    throw new Error(
      "Investigator has no current space.",
    );
  }

  /*
   * ============================================================
   * FIND MONSTERS IN INVESTIGATOR'S SPACE
   * ============================================================
   */

  const monstersInSpace =
    Object.values(game.monsters).filter(
      (monster) =>
        monster.spaceId ===
        investigator.spaceId,
    );

  /*
   * ============================================================
   * COMBAT
   * ============================================================
   *
   * If one or more monsters are present, the investigator must
   * resolve Combat before resolving a normal Encounter.
   *
   * Only one monster is started at a time.
   *
   * After that combat is resolved, the next monster will be
   * started until no monsters remain.
   */

  if (monstersInSpace.length === 1) {
    return startMonsterCombat(
      game,
      monstersInSpace[0].id,
    );
  }

  if (monstersInSpace.length > 1) {
    return startCombatOrder(
      game,
      monstersInSpace.map(
        (monster) => monster.id,
      ),
    );
  }

  /*
   * ============================================================
   * NORMAL ENCOUNTER
   * ============================================================
   *
   * There are no monsters left in the investigator's space.
   *
   * The investigator may now resolve one normal Encounter.
   */

  return startEncounter(
    game,
    map,
  );
}