import type { GameState } from "../models/GameState";
import { gainCondition } from "./gainCondition";
import { resolveSpellBackEffects } from "./resolveSpellBackEffects";

export function resolveSpellBackChoice(game: GameState, choiceId: string): GameState {
  const pending = game.pendingSpellBackResolution;
  if (!pending) throw new Error("There is no pending Spell-back choice.");
  const owner = game.investigators[pending.investigatorId];
  const spell = game.spells[pending.spellId];
  if (!owner || !spell) throw new Error("Spell-back choice references a missing card or investigator.");

  let nextGame: GameState = { ...game, pendingDecision: null, pendingSpellBackResolution: null };
  let health = pending.health;
  let sanity = pending.sanity;
  let clues = pending.clues;
  let assetIds = [...pending.assetIds];
  let shouldDiscard = pending.shouldDiscard;

  const getTargetId = (target: "caster" | "chosen-investigator") => {
    if (target === "caster") return pending.investigatorId;
    const selected = spell.pendingChosenInvestigatorId;
    if (!selected) throw new Error("This Spell effect requires a chosen investigator.");
    return selected;
  };

  const applyGainCondition = (conditionDefinitionId: string, targetId: string) => {
    const isAvailable = nextGame.board.conditionDeck.some((id) => nextGame.conditions[id]?.definitionId === conditionDefinitionId);
    if (!isAvailable) throw new Error("That Condition is not available in the deck.");
    nextGame = gainCondition(nextGame, targetId, conditionDefinitionId);
  };

  switch (pending.choice.type) {
    case "conditional-discard": {
      const requirement = pending.choice.requirement;
      if (choiceId === "discard-spell") {
        shouldDiscard = true;
      } else if (requirement.type === "lose-sanity" && choiceId === "pay-cost") {
        if (sanity < requirement.amount) throw new Error("Not enough Sanity to pay this Spell cost.");
        sanity -= requirement.amount;
      } else if (requirement.type === "gain-condition" && choiceId === "meet-requirement") {
        const targetId = requirement.target === "caster" ? pending.investigatorId : spell.pendingChosenInvestigatorId;
        if (!targetId) throw new Error("This Spell requires a chosen investigator.");
        applyGainCondition(requirement.conditionDefinitionId, targetId);
      } else if (requirement.type === "discard-item" && choiceId.startsWith("discard-item:")) {
        const assetId = choiceId.slice("discard-item:".length);
        const asset = nextGame.assets[assetId];
        if (!asset || asset.type !== "item" || !assetIds.includes(assetId)) throw new Error("Choose an Item you own.");
        assetIds = assetIds.filter((id) => id !== assetId);
        nextGame = { ...nextGame, board: { ...nextGame.board, assetDiscard: [...nextGame.board.assetDiscard, asset] } };
      } else {
        throw new Error("Invalid choice for this Spell effect.");
      }
      break;
    }
    case "health-or-condition":
    case "sanity-or-condition": {
      const effect = pending.choice.effect;
      const targetId = getTargetId(effect.target);
      const target = nextGame.investigators[targetId];
      if (!target) throw new Error("Spell target no longer exists.");
      if (choiceId === "gain-condition") {
        applyGainCondition(effect.conditionDefinitionId, targetId);
      } else if (pending.choice.type === "health-or-condition" && choiceId === "lose-health") {
        if (targetId === pending.investigatorId) health = Math.max(0, health - effect.amount);
        else nextGame = { ...nextGame, investigators: { ...nextGame.investigators, [targetId]: { ...target, health: Math.max(0, target.health - effect.amount) } } };
      } else if (pending.choice.type === "sanity-or-condition" && choiceId === "lose-sanity") {
        if (targetId === pending.investigatorId) sanity = Math.max(0, sanity - effect.amount);
        else nextGame = { ...nextGame, investigators: { ...nextGame.investigators, [targetId]: { ...target, sanity: Math.max(0, target.sanity - effect.amount) } } };
      } else throw new Error("Invalid choice for this Spell effect.");
      break;
    }
    case "improve-skill": {
      const effect = pending.choice.effect;
      if (!["lore", "influence", "observation", "strength", "will"].includes(choiceId)) throw new Error("Choose a valid skill.");
      const targetId = getTargetId(effect.target);
      const target = nextGame.investigators[targetId];
      if (!target) throw new Error("Spell target no longer exists.");
      const skill = choiceId as keyof typeof target.skills;
      nextGame = { ...nextGame, investigators: { ...nextGame.investigators, [targetId]: { ...target, skills: { ...target.skills, [skill]: target.skills[skill] + effect.amount } } } };
      break;
    }
    case "gain-asset":
    case "gain-assets-by-test-result": {
      const effect = pending.choice.type === "gain-asset"
        ? pending.choice.effect
        : pending.choice.effect;
      if (choiceId !== "done") {
        const asset = nextGame.board.assetReserve.find((candidate) => candidate.id === choiceId);
        if (!asset || !effect.assetTypes.includes(asset.type as "item" | "trinket")) throw new Error("Choose a valid Asset from the Reserve.");
        if (pending.choice.type === "gain-assets-by-test-result" && asset.value > pending.choice.remainingValue) throw new Error("The Asset exceeds the remaining test-result value.");
        assetIds.push(asset.id);
        nextGame = { ...nextGame, board: { ...nextGame.board, assetReserve: nextGame.board.assetReserve.filter((candidate) => candidate.id !== asset.id) } };
        if (pending.choice.type === "gain-assets-by-test-result") {
          const remainingValue = pending.choice.remainingValue - asset.value;
          const eligible = nextGame.board.assetReserve.filter((candidate) => effect.assetTypes.includes(candidate.type as "item" | "trinket") && candidate.value <= remainingValue);
          if (eligible.length && remainingValue > 0) {
            const resume = { ...pending, health, sanity, clues, assetIds, shouldDiscard, choice: { ...pending.choice, remainingValue } };
            return {
              ...nextGame,
              pendingSpellBackResolution: resume,
              pendingDecision: {
                type: "choice",
                title: "Choose more Assets up to the remaining value",
                message: `Remaining value: ${remainingValue}. You may continue or finish.`,
                options: [
                  { id: "done", title: "Terminar escolha" },
                  ...eligible.map((candidate) => ({ id: candidate.id, title: candidate.name, description: `Valor ${candidate.value}` })),
                ],
                source: `spell-back:${pending.spellId}`,
              },
            };
          }
        }
      }
      break;
    }
  }

  const updatedOwner = nextGame.investigators[pending.investigatorId];
  nextGame = {
    ...nextGame,
    pendingSpellBackResolution: null,
    investigators: {
      ...nextGame.investigators,
      [pending.investigatorId]: { ...updatedOwner, health, sanity, clues, assetIds },
    },
  };
  return resolveSpellBackEffects({
    game: nextGame,
    investigatorId: pending.investigatorId,
    spellId: pending.spellId,
    effects: pending.remainingEffects,
    resume: { ...pending, health, sanity, clues, assetIds, shouldDiscard },
  });
}
