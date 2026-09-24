import type { Investigator } from "../models/Investigator";

export function hasAvailableAction(
  investigator: Investigator,
): boolean {
  if (investigator.isDelayed) {
    return false;
  }

  return investigator.actionsPerformed.length < 2;
}