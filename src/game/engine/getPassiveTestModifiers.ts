import type { GameState } from "../models/GameState";
import type { Skill } from "../models/Investigator";
import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";

export interface PassiveTestContext {
  skill: Skill;
  combat?: boolean;
  otherWorld?: boolean;
  acquireAssets?: boolean;
  spell?: boolean;
}

export interface PassiveTestModifierResult {
  bonusDice: number;
  sixCountsAsTwo: boolean;
}

export function getPassiveTestModifiers(
  game: GameState,
  investigatorId: string,
  context: PassiveTestContext,
): PassiveTestModifierResult {
  const investigator = game.investigators[investigatorId];
  if (!investigator) {
    return { bonusDice: 0, sixCountsAsTwo: false };
  }

  const otherWorld = context.otherWorld ?? Boolean(
    game.currentEncounterId?.startsWith("other-world-encounter"),
  );

  let bonusDice = 0;
  let sixCountsAsTwo = false;
  bonusDice += game.currentEncounterIsResearch
    ? game.researchEncounterBonusDice?.[investigatorId] ?? 0
    : 0;

  for (const owner of Object.values(game.investigators)) {
    const sharesSpace = Boolean(
      owner.spaceId && owner.spaceId === investigator.spaceId,
    );
    const ownerSpace = eldritchBaseMap.spaces.find((space) => space.id === owner.spaceId);
    const assets = owner.assetIds.map((id) => game.assets[id]).filter(Boolean);
    const artifacts = owner.artifactIds.map((id) => game.artifacts[id]).filter(Boolean);
    const cards = [...assets, ...artifacts];

    for (const card of cards) {
      for (const modifier of card.passiveTestModifiers ?? []) {
        if (modifier.skill && modifier.skill !== context.skill) continue;
        if (modifier.combatOnly && !context.combat) continue;
        if (modifier.otherWorldOnly && !otherWorld) continue;
        if (modifier.excludeOtherWorld && otherWorld) continue;
        if (modifier.cityOnly && ownerSpace?.type !== "city") continue;
        if (modifier.acquireAssetsOnly && !context.acquireAssets) continue;
        if (modifier.spellOnly && !context.spell) continue;
        if (owner.id !== investigatorId && !(modifier.investigatorsOnOwnerSpace && sharesSpace)) continue;

        bonusDice += modifier.bonusDice ?? 0;
        sixCountsAsTwo ||= modifier.sixCountsAsTwo ?? false;
      }
    }
  }

  return { bonusDice, sixCountsAsTwo };
}
