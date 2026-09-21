import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import type { MonsterDefinition } from "../models/Monster";

import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../content/core/coreEpicMonsters";

import { hasMonsterReckoningAbility } from "./getMonsterReckoningAbilities";
import { startAncientOneReckoning } from "./startAncientOneReckoning";

function getMonsterDefinition(
  monsterDefinitionId: string,
): MonsterDefinition | undefined {
  return (
    CORE_MONSTERS.find(
      (definition) =>
        definition.id === monsterDefinitionId,
    ) ??
    CORE_EPIC_MONSTERS.find(
      (definition) =>
        definition.id === monsterDefinitionId,
    )
  );
}

export function startMonsterReckoning(
  game: GameState,
  map: MapDefinition,
  nextIconIndex: number,
  remainingPasses: number = 1,
): GameState {
  /*
   * Snapshot dos monstros que existem
   * no momento em que o Reckoning começa.
   *
   * Monstros criados durante este Reckoning
   * não entram nesta resolução.
   */

  const monsterIds = Object.values(
    game.monsters,
  )
    .filter(
      (monster) =>
        monster.spaceId !== null &&
        monster.health > 0,
    )
    .filter((monster) => {
      const definition =
        getMonsterDefinition(
          monster.definitionId,
        );

      if (!definition) {
        return false;
      }

      return hasMonsterReckoningAbility(
        definition,
      );
    })
    .map(
      (monster) =>
        monster.id,
    );

  if (monsterIds.length === 0) {
    const gameWithoutDecision: GameState = {
      ...game,
      pendingDecision: null,
    };

    return startAncientOneReckoning(
      gameWithoutDecision,
      map,
      nextIconIndex,
    );
  }

  return {
    ...game,

    pendingDecision: {
      type: "mythos-reckoning-monsters",

      title:
        "MYTHOS — RECKONING",

      message:
        "Resolve the Reckoning effects of the Monsters.",

      monsterIds,

      resolvedMonsterIds: [],

      nextIconIndex,
      
      remainingPasses,

      source:
        "mythos:reckoning-monsters",
    },
  };
}