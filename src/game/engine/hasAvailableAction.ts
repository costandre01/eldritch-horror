import type { Investigator } from "../models/Investigator";

export function hasAvailableAction(
  investigator: Investigator,
): boolean {
  return investigator.actionsPerformed.length < 2;
}