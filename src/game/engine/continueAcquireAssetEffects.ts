import type { GameState } from "../models/GameState";
import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";
import { coreInvestigators } from "../../content/core/investigators";

/** Starts the next unresolved immediate effect from one Acquire Assets action. */
export function continueAcquireAssetEffects(game: GameState): GameState {
  let queue = game.pendingAcquireAssetEffects;
  if (!queue) return game;

  while ((queue.charlieAssetIds?.length ?? 0) > 0) {
    const [assetId, ...remaining] = queue.charlieAssetIds ?? [];
    queue = { ...queue, charlieAssetIds: remaining };

    const charlie = game.investigators[queue.investigatorId];
    const asset = assetId ? game.assets[assetId] : undefined;
    const targets = game.investigatorOrder
      .map((id) => game.investigators[id])
      .filter(
        (investigator) =>
          investigator !== undefined &&
          !investigator.isDefeated,
      );

    if (
      !charlie ||
      charlie.definitionId !== "charlie-kane" ||
      !asset ||
      (!charlie.assetIds.includes(asset.id) &&
        !game.board.assetDiscard.some((card) => card.id === asset.id)) ||
      targets.length < 2
    ) {
      continue;
    }

    return {
      ...game,
      pendingAcquireAssetEffects: queue,
      pendingDecision: {
        type: "choice",
        title: "Charlie Kane — Well Connected",
        message: `Choose who gains ${asset.name}.`,
        options: targets.map((target) => ({
          id: `charlie-acquire-assets:${target.id}`,
          title:
            coreInvestigators.find(
              (definition) => definition.id === target.definitionId,
            )?.name ?? target.id,
          description:
            target.id === charlie.id
              ? `Charlie keeps ${asset.name}.`
              : `${asset.name} is given to this investigator.`,
        })),
        source: `investigator:charlie-acquire-assets:${charlie.id}:${asset.id}`,
      },
    };
  }

  while (queue.assetIds.length > 0) {
    const [assetId, ...remaining] = queue.assetIds;
    const recipientId =
      queue.assetRecipientIds?.[assetId] ?? queue.investigatorId;
    const investigator = game.investigators[recipientId];
    const asset = game.board.assetDiscard.find((card) => card.id === assetId);
    queue = { ...queue, assetIds: remaining };
    const base = { ...game, pendingDecision: null, pendingAcquireAssetEffects: queue };
    if (!investigator || !asset) continue;

    if (asset.name === "Sanctuary") {
      if (investigator.conditionIds.length === 0) continue;
      return {
        ...base,
        pendingDecision: {
          type: "choice",
          title: "Sanctuary",
          message: "You may immediately discard 1 Condition.",
          options: [
            ...investigator.conditionIds.map((conditionId) => ({ id: `sanctuary:discard:${conditionId}`, title: game.conditions[conditionId]?.definitionId ?? conditionId })),
            { id: "sanctuary:skip", title: "Keep all Conditions" },
          ],
          source: `asset:sanctuary:${assetId}:${investigator.id}`,
        },
      };
    }

    if (asset.name === "Agency Quarantine") {
      return {
        ...base,
        pendingDecision: {
          type: "select-space",
          title: "Agency Quarantine",
          message: "Choose a space. Each Monster there loses 4 Health.",
          spaceIds: Object.keys(game.board.spaces),
          onSpaceSelected: [],
          source: `asset:agency-quarantine:${assetId}`,
        },
      };
    }

    if (asset.name === "Delivery Service") {
      const targets = Object.values(game.investigators).filter((candidate) => !candidate.isDefeated && candidate.id !== investigator.id);
      if (targets.length === 0) continue;
      return {
        ...base,
        pendingDecision: {
          type: "choice",
          title: "Delivery Service",
          message: "Choose another investigator to receive any number of your Item possessions.",
          options: targets.map((target) => ({ id: `delivery-service:${target.id}`, title: target.id })),
          source: `asset:delivery-service:${assetId}:${investigator.id}`,
        },
      };
    }

    if (asset.name === "Wireless Report") {
      const targets = Object.values(game.investigators).filter((candidate) => !candidate.isDefeated && candidate.id !== investigator.id);
      if (investigator.clues === 0 || targets.length === 0) continue;
      const options = targets.flatMap((target) => Array.from({ length: investigator.clues + 1 }, (_, amount) => ({
        id: `wireless-report:${target.id}:${amount}`,
        title: `${target.id}: give ${amount} Clue${amount === 1 ? "" : "s"}`,
      })));
      return {
        ...base,
        pendingDecision: {
          type: "choice",
          title: "Wireless Report",
          message: "Choose another investigator anywhere and how many Clues to give.",
          options,
          source: `asset:wireless-report:${assetId}:${investigator.id}`,
        },
      };
    }

    if (asset.name === "Charter Flight" && investigator.spaceId) {
      const distance = new Map<string, number>([[investigator.spaceId, 0]]);
      const pending = [investigator.spaceId];
      while (pending.length > 0) {
        const current = pending.shift()!;
        const nextDistance = (distance.get(current) ?? 0) + 1;
        if (nextDistance > 2) continue;
        const space = eldritchBaseMap.spaces.find((candidate) => candidate.id === current);
        for (const neighborId of space?.connectedSpaceIds ?? []) {
          if (!distance.has(neighborId)) {
            distance.set(neighborId, nextDistance);
            pending.push(neighborId);
          }
        }
      }
      return {
        ...base,
        pendingDecision: {
          type: "select-space",
          title: "Charter Flight",
          message: "Move up to 2 spaces.",
          spaceIds: [...distance.keys()],
          onSpaceSelected: [],
          source: `asset:charter-flight:${investigator.id}`,
        },
      };
    }
  }

  return { ...game, pendingDecision: null, pendingAcquireAssetEffects: null };
}
