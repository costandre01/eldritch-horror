import type { SpellType } from "./SpellDefinition";
import type { TestResult } from "./TestResult";

export interface Spell {
  id: string;

  definitionId: string;

  instanceNumber: number;

  type: SpellType;

  frontImage: string;

  backImage: string;

  backId: string;

  flipped: boolean;

  exhausted: boolean;

  pendingTestResult: TestResult | null;

  pendingChosenInvestigatorId: string | null;
}