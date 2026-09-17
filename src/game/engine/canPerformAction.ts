import type { InvestigatorAction } from "../types/InvestigatorAction";
import type { Investigator } from "../models/Investigator";

export function canPerformAction(
  investigator: Investigator,
  action: InvestigatorAction,
): boolean {
  if (investigator.actionsPerformed.length >= 2) {
    return false;
  }

  if (
    investigator.actionsPerformed.includes(action)
  ) {
    return false;
  }

  return true;
}