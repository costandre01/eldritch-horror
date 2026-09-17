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
      throw new Error(
        "lose-monster-health requires a selected Monster.",
      );
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
      throw new Error(
        "modify-strength must be resolved by the Combat system.",
      );
    }

    if (
      effect.type ===
      "gain-additional-action"
    ) {
      throw new Error(
        "gain-additional-action must be resolved by the Action system.",
      );
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
      throw new Error(
        "allow-reroll must be resolved by the Test system.",
      );
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