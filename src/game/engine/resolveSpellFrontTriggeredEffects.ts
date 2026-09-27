import type { GameState } from "../models/GameState";
import type { SpellChoice } from "../models/SpellChoice";

import type {
  SpellFrontTriggeredEffect,
} from "../models/SpellDefinition/frontEffects";

import { gainCondition } from "./gainCondition";

export interface ResolveSpellFrontTriggeredEffectsResult {
  game: GameState;

  pendingChoice:
    | SpellChoice
    | null;

  shouldFlip: boolean;
}

export function resolveSpellFrontTriggeredEffects(
  game: GameState,
  investigatorId: string,
  spellId: string,
  effects: SpellFrontTriggeredEffect[],
): ResolveSpellFrontTriggeredEffectsResult {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  const spell =
    game.spells[spellId];

  if (!spell) {
    throw new Error(
      `Spell "${spellId}" does not exist.`,
    );
  }

  let currentGame = game;

  let pendingChoice:
    | SpellChoice
    | null = null;

  let shouldFlip = false;

  /*
   * ============================================================
   * RESOLVE EFFECTS
   * ============================================================
   */

  for (
    let index = 0;
    index < effects.length;
    index++
  ) {
    const effect =
      effects[index];

    /*
     * ==========================================================
     * FLIP SELF
     * ==========================================================
     */

    if (
      effect.type ===
      "flip-self"
    ) {
      shouldFlip = true;

      const currentSpell =
        currentGame.spells[spellId];

      if (!currentSpell) {
        throw new Error(
          `Spell "${spellId}" does not exist.`,
        );
      }

      currentGame = {
        ...currentGame,

        spells: {
          ...currentGame.spells,

          [spellId]: {
            ...currentSpell,

            flipped: true,
          },
        },
      };

      continue;
    }

    /*
     * ==========================================================
     * CHOOSE INVESTIGATOR
     * ==========================================================
     */

    if (
      effect.type ===
      "choose-investigator"
    ) {
      pendingChoice = {
        type: "choose-investigator",

        investigatorId,

        spellId,

        location:
          effect.location,

        excludeConditionDefinitionId:
          effect.excludeConditionDefinitionId,

        /*
         * Effects resolved after selecting
         * the investigator.
         */

        effects:
          effect.effects,

        /*
         * Effects that were originally
         * after the choice.
         */

        remainingEffects:
          effects.slice(
            index + 1,
          ),
      };

      break;
    }

    /*
     * ==========================================================
     * IMPROVE SKILL
     * ==========================================================
     */

    if (
      effect.type ===
      "improve-skill"
    ) {
      pendingChoice = {
        type: "choose-skill",

        investigatorId,

        spellId,

        effects: [
          effect,
        ],

        remainingEffects:
          effects.slice(
            index + 1,
          ),
      };

      break;
    }

    /*
     * ==========================================================
     * GAIN CONDITION
     * ==========================================================
     */

    if (
      effect.type ===
      "gain-condition"
    ) {
      /*
       * CASTER
       */

      if (
        effect.target ===
        "caster"
      ) {
        currentGame =
          gainCondition(
            currentGame,
            investigatorId,
            effect.conditionDefinitionId,
          );

        continue;
      }

      const previouslyChosenInvestigator =
        currentGame.spells[spellId]?.pendingChosenInvestigatorId;
      if (previouslyChosenInvestigator) {
        currentGame = gainCondition(
          currentGame,
          previouslyChosenInvestigator,
          effect.conditionDefinitionId,
        );
        continue;
      }

      /*
       * CHOSEN INVESTIGATOR
       */

      pendingChoice = {
        type: "choose-investigator",

        investigatorId,

        spellId,

        location:
          "same-space",

        effects: [
          effect,
        ],

        remainingEffects:
          effects.slice(
            index + 1,
          ),
      };

      break;
    }

    /*
     * ==========================================================
     * CHOOSE MONSTER
     * ==========================================================
     */

    if (
      effect.type ===
      "choose-monster"
    ) {
      pendingChoice = {
        type: "choose-monster",

        investigatorId,

        spellId,

        location:
          effect.location,

        effects:
          effect.effects,

        remainingEffects:
          effects.slice(
            index + 1,
          ),
      };

      break;
    }

    /*
     * ==========================================================
     * MONSTER HEALTH
     * ==========================================================
     */

    if (
      effect.type ===
      "lose-monster-health"
    ) {
      const chosenMonsterId = currentGame.spells[spellId]?.pendingChosenMonsterId;
      const monster = chosenMonsterId ? currentGame.monsters[chosenMonsterId] : undefined;
      if (!monster || !chosenMonsterId) {
        throw new Error("Spell damage requires a selected Monster.");
      }
      const health = Math.max(0, monster.health - effect.amount);
      const updatedMonster = { ...monster, health, spaceId: health > 0 ? monster.spaceId : null };
      currentGame = {
        ...currentGame,
        monsters: { ...currentGame.monsters, [chosenMonsterId]: updatedMonster },
        ...(health <= 0 && monster.spaceId && currentGame.board.spaces[monster.spaceId]
          ? {
              board: {
                ...currentGame.board,
                spaces: {
                  ...currentGame.board.spaces,
                  [monster.spaceId]: {
                    ...currentGame.board.spaces[monster.spaceId],
                    monsterIds: currentGame.board.spaces[monster.spaceId].monsterIds.filter((id) => id !== chosenMonsterId),
                  },
                },
              },
            }
          : {}),
      };
      continue;
    }

    /*
     * ==========================================================
     * CHOOSE CLUE
     * ==========================================================
     */

    if (
      effect.type ===
      "choose-clue"
    ) {
      pendingChoice = {
        type: "choose-clue",

        investigatorId,

        spellId,

        effects: [],

        remainingEffects:
          effects.slice(
            index + 1,
          ),
      };

      break;
    }

    /*
     * ==========================================================
     * CHOOSE ENCOUNTER
     * ==========================================================
     */

    if (
      effect.type ===
      "choose-encounter"
    ) {
      pendingChoice = {
        type: "choose-encounter",

        investigatorId,

        spellId,

        effects: [],

        remainingEffects:
          effects.slice(
            index + 1,
          ),
      };

      break;
    }

    /*
     * ==========================================================
     * CHOOSE ASSET
     * ==========================================================
     */

    if (
      effect.type ===
      "choose-asset"
    ) {
      pendingChoice = {
        type: "choose-asset",

        investigatorId,

        spellId,

        assetTypes:
          effect.assetTypes,

        maxValueFromTestResult:
          effect.maxValueFromTestResult ===
          true,

        effects: [
          effect,
        ],

        remainingEffects:
          effects.slice(
            index + 1,
          ),
      };

      break;
    }

    /*
     * ==========================================================
     * MOVE TO ANY SPACE
     * ==========================================================
     */

    if (
      effect.type ===
      "move-to-any-space"
    ) {
      pendingChoice = {
        type: "choose-space",

        investigatorId,

        spellId,

        effects: [
          effect,
        ],

        remainingEffects:
          effects.slice(
            index + 1,
          ),
      };

      break;
    }

    /*
     * ==========================================================
     * EVENT EFFECTS
     * ==========================================================
     */

    if (
      effect.type ===
      "prevent-health-loss"
    ) {
      throw new Error(
        "prevent-health-loss must be resolved by the Health-loss event system.",
      );
    }

    if (
      effect.type ===
      "prevent-sanity-loss"
    ) {
      throw new Error(
        "prevent-sanity-loss must be resolved by the Sanity-loss event system.",
      );
    }

    /*
     * ==========================================================
     * COMBAT
     * ==========================================================
     */

    if (
      effect.type ===
      "modify-strength"
    ) {
      currentGame = {
        ...currentGame,
        activeCombatSkillModifiers: [
          ...(currentGame.activeCombatSkillModifiers ?? []).filter((modifier) => modifier.id !== `spell:${spellId}:front-combat-strength`),
          { id: `spell:${spellId}:front-combat-strength`, investigatorId, skill: "strength", amount: effect.amount, duration: "this-combat-encounter" },
        ],
      };
      continue;
    }

    if (
      effect.type ===
      "gain-additional-action"
    ) {
      const target = currentGame.investigators[investigatorId];
      if (target) {
        currentGame = {
          ...currentGame,
          investigators: {
            ...currentGame.investigators,
            [investigatorId]: {
              ...target,
              additionalActionsThisRound: (target.additionalActionsThisRound ?? 0) + effect.amount,
            },
          },
        };
      }
      continue;
    }

    /*
     * ==========================================================
     * REROLL
     * ==========================================================
     */

    if (
      effect.type ===
      "allow-reroll"
    ) {
      currentGame = {
        ...currentGame,
        activeTestRerolls: [
          ...(currentGame.activeTestRerolls ?? []),
          {
            id: `spell:${spellId}:${effect.testType}:${effect.duration}`,
            investigatorId,
            skill: effect.testType,
            amount: effect.amount,
            duration: effect.duration,
          },
        ],
      };
      continue;
    }
  }

  /*
   * ============================================================
   * SAVE PENDING CHOICE
   * ============================================================
   */

  if (pendingChoice) {
    currentGame = {
      ...currentGame,

      pendingSpellChoice:
        pendingChoice,
    };
  }

  return {
    game: currentGame,

    pendingChoice,

    shouldFlip,
  };
}
