import type { GameState } from "../models/GameState";
import { coreSpells } from "../../content/core/coreSpell";
import { canPerformAction } from "./canPerformAction";
import { isRestrictedByDetained } from "./conditionRestrictions";

export interface SpellActivationOption {
  spellId: string;
  effectIndex: number;
  name: string;
  description: string;
  image: string;
}

function collectSpellOptions(
  game: GameState,
  investigatorId: string,
  effectType: "action-test" | "on-encounter-phase" | "on-combat-encounter",
): SpellActivationOption[] {
  const investigator = game.investigators[investigatorId];
  if (!investigator) return [];
  return investigator.spellIds.flatMap((id) => {
    const spell = game.spells[id];
    if (!spell || spell.flipped || spell.exhausted) return [];
    const definition = coreSpells.find((entry) => entry.id === spell.definitionId);
    return definition?.frontEffects.flatMap((effect, index) => effect.type === effectType
      ? [{ spellId: id, effectIndex: index, name: definition.name, description: definition.description, image: spell.frontImage }]
      : []) ?? [];
  });
}

export function getActionSpellOptions(game: GameState): SpellActivationOption[] {
  const investigatorId = game.activeInvestigatorId;
  const investigator = investigatorId ? game.investigators[investigatorId] : undefined;
  if (!investigatorId || !investigator || game.phase !== "action" || game.pendingDecision ||
      game.pendingSpellChoice || game.pendingSpellBackResolution ||
      isRestrictedByDetained(game, investigatorId) || !canPerformAction(investigator, "component")) return [];
  return collectSpellOptions(game, investigatorId, "action-test");
}

export function isEncounterSpellWindowOpen(game: GameState, investigatorId: string): boolean {
  return game.phase === "encounter" && game.activeInvestigatorId === investigatorId &&
    !game.investigators[investigatorId]?.isDefeated &&
    game.encounterStartedRound?.[investigatorId] !== game.round &&
    !game.currentEncounterId && !game.pendingDecision && !game.pendingEncounterChoice &&
    !game.pendingSpellChoice && !game.pendingSpellBackResolution && !game.combatOrder &&
    !Object.values(game.spells).some((spell) => spell.pendingTestResult);
}

export function getEncounterSpellOptions(game: GameState) {
  const investigatorId = game.activeInvestigatorId;
  if (!investigatorId || !isEncounterSpellWindowOpen(game, investigatorId)) return [];
  return collectSpellOptions(game, investigatorId, "on-encounter-phase")
    .filter((option) => game.encounterSpellUsedRound?.[option.spellId] !== game.round);
}

export function getCombatSpellOptions(game: GameState): SpellActivationOption[] {
  const investigatorId = game.activeInvestigatorId;
  const decision = game.pendingDecision;
  if (!investigatorId || decision?.type !== "combat" || (decision.stage ?? "start") !== "start" ||
      game.phase !== "encounter" || game.pendingSpellChoice || game.pendingSpellBackResolution ||
      Object.values(game.spells).some((spell) => spell.pendingTestResult)) return [];
  return collectSpellOptions(game, investigatorId, "on-combat-encounter")
    .filter((option) => game.combatSpellUsedRound?.[`${option.spellId}:${decision.monsterId}`] !== game.round);
}
