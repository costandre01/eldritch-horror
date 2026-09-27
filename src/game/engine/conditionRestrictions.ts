import type { GameState } from "../models/GameState";

export function isRestrictedByDetained(
  game: GameState,
  investigatorId: string,
): boolean {
  const investigator = game.investigators[investigatorId];
  return !!investigator?.conditionIds.some((conditionId) => {
    const condition = game.conditions[conditionId];
    return condition?.definitionId === "condition-detained" && !condition.flipped;
  });
}

export function assertNormalActionAllowed(
  game: GameState,
  investigatorId: string,
): void {
  if (isRestrictedByDetained(game, investigatorId)) {
    throw new Error("Detained restricts the Investigator to the Local Action on that Condition.");
  }
}
