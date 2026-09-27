import type { SpellBackEffect } from "./SpellDefinition/backEffects";

export type SpellBackChoice =
  | { type: "conditional-discard"; requirement: Extract<SpellBackEffect, { type: "discard-self-unless" }>["requirement"] }
  | { type: "health-or-condition"; effect: Extract<SpellBackEffect, { type: "lose-health-unless-gain-condition" }> }
  | { type: "sanity-or-condition"; effect: Extract<SpellBackEffect, { type: "lose-sanity-unless-gain-condition" }> }
  | { type: "improve-skill"; effect: Extract<SpellBackEffect, { type: "improve-skill" }> }
  | { type: "gain-asset"; effect: Extract<SpellBackEffect, { type: "gain-asset" }> }
  | { type: "gain-assets-by-test-result"; effect: Extract<SpellBackEffect, { type: "gain-assets-by-test-result" }>; remainingValue: number };

export interface PendingSpellBackResolution {
  investigatorId: string;
  spellId: string;
  remainingEffects: SpellBackEffect[];
  health: number;
  sanity: number;
  clues: number;
  assetIds: string[];
  shouldDiscard: boolean;
  choice: SpellBackChoice;
}
