import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import { canPerformAction } from "./canPerformAction";
import { defeatInvestigator } from "./defeatInvestigator";
import { assertNormalActionAllowed } from "./conditionRestrictions";

type PossessionKind = "asset" | "artifact";

function discardAsset(game: GameState, investigatorId: string, assetId: string): GameState {
  const investigator = game.investigators[investigatorId];
  const asset = game.assets[assetId];
  if (!investigator || !asset || !investigator.assetIds.includes(assetId)) throw new Error("This Asset is not owned by the active investigator.");
  return {
    ...game,
    investigators: { ...game.investigators, [investigatorId]: { ...investigator, assetIds: investigator.assetIds.filter((id) => id !== assetId) } },
    board: { ...game.board, assetDiscard: [...game.board.assetDiscard, asset] },
  };
}

function damageMonstersAtSpace(game: GameState, spaceId: string, amount: number): GameState {
  const space = game.board.spaces[spaceId];
  if (!space) return game;
  const monsters = { ...game.monsters };
  const defeated: string[] = [];
  const discarded = [...game.board.monsterDiscard];
  for (const id of space.monsterIds) {
    const monster = monsters[id];
    if (!monster) continue;
    const health = Math.max(0, monster.health - amount);
    monsters[id] = { ...monster, health, spaceId: health > 0 ? spaceId : null };
    if (health === 0) {
      defeated.push(id);
      discarded.push(monsters[id]);
    }
  }
  return {
    ...game,
    monsters,
    board: {
      ...game.board,
      monsterDiscard: discarded,
      spaces: { ...game.board.spaces, [spaceId]: { ...space, monsterIds: space.monsterIds.filter((id) => !defeated.includes(id)) } },
    },
  };
}

export function activatePossessionAbility(
  game: GameState,
  investigatorId: string,
  kind: PossessionKind,
  cardId: string,
  ability: "action" | "combat" | "free-action" | "action-heal" | "encounter",
  map: MapDefinition,
): GameState {
  const investigator = game.investigators[investigatorId];
  if (!investigator) throw new Error("There is no active investigator.");
  const asset = kind === "asset" ? game.assets[cardId] : undefined;
  const artifact = kind === "artifact" ? game.artifacts[cardId] : undefined;
  if (kind === "asset" ? !asset || !investigator.assetIds.includes(cardId) : !artifact || !investigator.artifactIds.includes(cardId)) {
    throw new Error("This possession is not owned by the active investigator.");
  }
  const cardName = asset?.name ?? artifact?.name;
  const spaceId = investigator.spaceId;
  const space = spaceId ? game.board.spaces[spaceId] : undefined;

  if (ability === "combat") {
    if (game.phase !== "encounter" || !space || space.monsterIds.length === 0) throw new Error("This ability can only be used during a Combat Encounter.");
    if (cardName === "Carbine Rifle") {
      const usedKey = `${cardId}:carbine`;
      if (game.cardRerollUsedRound?.[usedKey] === game.round) throw new Error("Carbine Rifle was already used this round.");
      return {
        ...game,
        cardRerollUsedRound: { ...game.cardRerollUsedRound, [usedKey]: game.round },
        activeCombatSkillModifiers: [...(game.activeCombatSkillModifiers ?? []), { id: usedKey, investigatorId, skill: "strength", amount: 5 }],
      };
    }
    if (cardName === "Kerosene" || cardName === "Holy Water") {
      const current = game.activeCombatSkillModifiers ?? [];
      const modifiers = cardName === "Holy Water"
        ? [{ id: `${cardId}:holy-water-strength`, investigatorId, skill: "strength" as const, amount: 5 }, { id: `${cardId}:holy-water-will`, investigatorId, skill: "will" as const, amount: 5 }]
        : [{ id: `${cardId}:kerosene-strength`, investigatorId, skill: "strength" as const, amount: 5 }];
      const discarded = discardAsset(game, investigatorId, cardId);
      return { ...discarded, activeCombatSkillModifiers: [...current, ...modifiers] };
    }
    throw new Error("This possession has no combat ability available here.");
  }

  if (ability === "free-action") {
    if (cardName !== "Ruby of R'lyeh" || game.phase !== "action") throw new Error("Ruby of R'lyeh can only be used during the Action Phase.");
    const usedKey = `${cardId}:ruby`;
    if (game.cardRerollUsedRound?.[usedKey] === game.round) throw new Error("Ruby of R'lyeh was already used this round.");
    if (investigator.sanity < 1) throw new Error("Not enough Sanity to use Ruby of R'lyeh.");
    let updated: GameState = {
      ...game,
      cardRerollUsedRound: { ...game.cardRerollUsedRound, [usedKey]: game.round },
      investigators: { ...game.investigators, [investigatorId]: { ...investigator, sanity: investigator.sanity - 1, additionalActionsThisRound: (investigator.additionalActionsThisRound ?? 0) + 1 } },
    };
    if (investigator.sanity === 1) updated = defeatInvestigator(updated, map, investigatorId);
    return updated;
  }

  if (ability === "encounter") {
    if (cardName !== "Pallid Mask" || game.phase !== "encounter") throw new Error("Pallid Mask can only be used during the Encounter Phase.");
    return { ...game, ignoreMonstersForNextEncounter: true };
  }

  if (ability === "action-heal") {
    assertNormalActionAllowed(game, investigatorId);
    if (cardName !== "Holy Water" || game.phase !== "action" || !canPerformAction(investigator, "component")) throw new Error("Holy Water's action cannot be performed now.");
    if (!space) throw new Error("The investigator has no space on the map.");
    const validTargets = Object.values(game.investigators).filter((target) => target.spaceId === space.spaceId);
    const withAction = {
      ...game,
      investigators: { ...game.investigators, [investigatorId]: { ...investigator, actionsPerformed: [...investigator.actionsPerformed, "component" as const] } },
    };
    const discarded = discardAsset(withAction, investigatorId, cardId);
    return {
      ...discarded,
      pendingDecision: {
        type: "choice",
        title: "Holy Water",
        message: "Choose an investigator on your space to gain a Blessed Condition.",
        options: validTargets.map((target) => ({ id: `holy-water:${target.id}`, title: target.id })),
        source: `asset:holy-water:${investigatorId}`,
      },
    };
  }

  assertNormalActionAllowed(game, investigatorId);
  if (game.phase !== "action" || !canPerformAction(investigator, "component")) throw new Error("This action cannot be performed now.");
  if (!space) throw new Error("The investigator has no space on the map.");
  if (cardName === "Cat Burglar") {
    const used = {
      ...game,
      investigators: {
        ...game.investigators,
        [investigatorId]: {
          ...investigator,
          actionsPerformed: [...investigator.actionsPerformed, "component" as const],
        },
      },
      pendingDecision: {
        type: "single-die-roll" as const,
        title: "Cat Burglar",
        message: "On 1, discard Cat Burglar. On 5 or 6, gain an Item or Trinket Asset from the reserve.",
        investigatorId,
        source: `asset:cat-burglar:${cardId}`,
      },
    };
    return used;
  }
  let updated: GameState;
  if (cardName === "Dynamite") {
    updated = discardAsset(game, investigatorId, cardId);
    updated = damageMonstersAtSpace(updated, space.spaceId, 3);
  } else if (cardName === "Flute of the Outer Gods") {
    if (investigator.health <= 2 || investigator.sanity <= 2) throw new Error("You need more than 2 Health and 2 Sanity to use the Flute.");
    updated = {
      ...game,
      investigators: { ...game.investigators, [investigatorId]: { ...investigator, health: investigator.health - 2, sanity: investigator.sanity - 2 } },
    };
    updated = damageMonstersAtSpace(updated, space.spaceId, Number.MAX_SAFE_INTEGER);
  } else if (cardName === "Lightning Gun") {
    updated = {
      ...game,
      investigators: { ...game.investigators, [investigatorId]: { ...investigator, health: Math.max(0, investigator.health - 1), actionsPerformed: [...investigator.actionsPerformed, "component"] } },
    };
    updated = damageMonstersAtSpace(updated, space.spaceId, 1);
    if (investigator.health <= 1) updated = defeatInvestigator(updated, map, investigatorId);
    return updated;
  } else if (["Cultes des Goules", "De Vermis Mysteriis", "Necronomicon", "T'tka Halot"].includes(cardName ?? "")) {
    const optionalCostChoices = investigator.sanity >= 1;
    const onSuccess = !optionalCostChoices ? [] : cardName === "Cultes des Goules"
      ? [{ type: "choice" as const, choices: [
          { text: "Spend 1 Sanity to gain 2 Clues", effects: [{ type: "lose-sanity" as const, amount: 1 }, { type: "gain-clues" as const, amount: 2 }] },
          { text: "Do not use the Artifact", effects: [] },
        ] }]
      : cardName === "De Vermis Mysteriis"
        ? [{ type: "choice" as const, choices: [
            { text: "Spend 1 Sanity to improve a Skill", effects: [{ type: "lose-sanity" as const, amount: 1 }, { type: "improve-skill" as const, amount: 1 }] },
            { text: "Do not use the Artifact", effects: [] },
          ] }]
        : cardName === "Necronomicon"
          ? [{ type: "choice" as const, choices: [
              { text: "Spend 1 Sanity to gain 2 Spells", effects: [{ type: "lose-sanity" as const, amount: 1 }, { type: "gain-spell" as const, amount: 2 }] },
              { text: "Do not use the Artifact", effects: [] },
            ] }]
          : space.monsterIds.length > 0
            ? [{ type: "choice" as const, choices: [
                { text: "Spend 1 Sanity to deal 3 damage to a Monster here", effects: [{ type: "lose-sanity" as const, amount: 1 }, { type: "lose-monster-health" as const, amount: 3, monsterIds: [...space.monsterIds] }] },
                { text: "Do not use the Artifact", effects: [] },
              ] }]
            : [];
    return {
      ...game,
      investigators: { ...game.investigators, [investigatorId]: { ...investigator, actionsPerformed: [...investigator.actionsPerformed, "component"] } },
      pendingDecision: {
        type: "test",
        title: cardName ?? "Artifact",
        message: "Test Lore. If you pass, you may resolve the Artifact's effect.",
        skill: "lore",
        modifier: 0,
        investigatorId,
        onSuccess,
        source: `artifact:${cardId}`,
      },
    };
  } else {
    throw new Error("This possession has no Action ability implemented.");
  }

  const current = updated.investigators[investigatorId];
  if (!current) return updated;
  return {
    ...updated,
    investigators: { ...updated.investigators, [investigatorId]: { ...current, actionsPerformed: [...current.actionsPerformed, "component"] } },
  };
}
