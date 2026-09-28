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
  if (
    game.status !== "playing" ||
    game.phase !== "action" ||
    game.activeInvestigatorId !== investigatorId
  ) {
    throw new Error("Actions can only be performed by the active investigator during the Action phase.");
  }

  if (isRestrictedByDetained(game, investigatorId)) {
    throw new Error("Detained restricts the Investigator to the Local Action on that Condition.");
  }
}
