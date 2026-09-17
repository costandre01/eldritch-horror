import type { GameState } from "../models/GameState";

import { gainCondition } from "./gainCondition";
import { resolveSpellFrontTriggeredEffects } from "./resolveSpellFrontTriggeredEffects";

export function resolveSpellChoice(
  game: GameState,
  selectedId: string,
): GameState {
  const choice =
    game.pendingSpellChoice;

  if (!choice) {
    throw new Error(
      "There is no pending Spell choice.",
    );
  }

  const spell =
    game.spells[choice.spellId];

  if (!spell) {
    throw new Error(
      `Spell "${choice.spellId}" does not exist.`,
    );
  }

  /*
   * ============================================================
   * CHOOSE INVESTIGATOR
   * ============================================================
   */

  if (
    choice.type ===
    "choose-investigator"
  ) {
    const selectedInvestigator =
      game.investigators[selectedId];

    if (!selectedInvestigator) {
      throw new Error(
        `Investigator "${selectedId}" does not exist.`,
      );
    }

    const caster =
      game.investigators[
        choice.investigatorId
      ];

    if (!caster) {
      throw new Error(
        `Caster "${choice.investigatorId}" does not exist.`,
      );
    }

    /*
     * ----------------------------------------------------------
     * LOCATION
     * ----------------------------------------------------------
     */

    if (
      choice.location ===
      "same-space"
    ) {
      if (
        caster.spaceId === null ||
        selectedInvestigator.spaceId !==
          caster.spaceId
      ) {
        throw new Error(
          "The selected investigator is not on the caster's space.",
        );
      }
    }

    /*
     * ----------------------------------------------------------
     * CONDITION EXCLUSION
     * ----------------------------------------------------------
     */

    if (
      choice.excludeConditionDefinitionId
    ) {
      const alreadyHasCondition =
        selectedInvestigator.conditionIds.some(
          (conditionId) => {
            const condition =
              game.conditions[
                conditionId
              ];

            return (
              condition?.definitionId ===
              choice.excludeConditionDefinitionId
            );
          },
        );

      if (
        alreadyHasCondition
      ) {
        throw new Error(
          "The selected investigator already has this Condition.",
        );
      }
    }

    /*
     * ----------------------------------------------------------
     * SAVE SELECTED INVESTIGATOR
     * ----------------------------------------------------------
     *
     * The selected investigator belongs to this physical
     * Spell instance.
     */

    let currentGame: GameState = {
      ...game,

      pendingSpellChoice: null,

      spells: {
        ...game.spells,

        [choice.spellId]: {
          ...spell,

          pendingChosenInvestigatorId:
            selectedId,
        },
      },
    };

    /*
     * ----------------------------------------------------------
     * RESOLVE EFFECTS
     * ----------------------------------------------------------
     */

    for (
      const effect of choice.effects
    ) {
      /*
       * GAIN CONDITION
       */

      if (
        effect.type ===
        "gain-condition"
      ) {
        const targetId =
          effect.target ===
          "caster"
            ? choice.investigatorId
            : selectedId;

        currentGame =
          gainCondition(
            currentGame,
            targetId,
            effect.conditionDefinitionId,
          );

        continue;
      }

      /*
       * FLIP SELF
       */

      if (
        effect.type ===
        "flip-self"
      ) {
        const currentSpell =
          currentGame.spells[
            choice.spellId
          ];

        if (!currentSpell) {
          throw new Error(
            `Spell "${choice.spellId}" does not exist.`,
          );
        }

        currentGame = {
          ...currentGame,

          spells: {
            ...currentGame.spells,

            [choice.spellId]: {
              ...currentSpell,

              flipped: true,
            },
          },
        };

        continue;
      }

      /*
       * OTHER EFFECTS
       */

      const result =
        resolveSpellFrontTriggeredEffects(
          currentGame,
          choice.investigatorId,
          choice.spellId,
          [effect],
        );

      currentGame =
        result.game;

      /*
       * Another choice is required.
       */

      if (
        result.pendingChoice
      ) {
        return currentGame;
      }
    }

    return currentGame;
  }

  /*
   * ============================================================
   * CHOOSE MONSTER
   * ============================================================
   */

  if (
    choice.type ===
    "choose-monster"
  ) {
    throw new Error(
      "Monster Spell choices are not implemented yet.",
    );
  }

  /*
   * ============================================================
   * CHOOSE CLUE
   * ============================================================
   */

  if (
    choice.type ===
    "choose-clue"
  ) {
    throw new Error(
      "Clue Spell choices are not implemented yet.",
    );
  }

  /*
   * ============================================================
   * CHOOSE ASSET
   * ============================================================
   */

  if (
    choice.type ===
    "choose-asset"
  ) {
    throw new Error(
      "Asset Spell choices are not implemented yet.",
    );
  }

  /*
   * ============================================================
   * CHOOSE SKILL
   * ============================================================
   */

  if (
    choice.type ===
    "choose-skill"
  ) {
    throw new Error(
      "Skill Spell choices are not implemented yet.",
    );
  }

  /*
   * ============================================================
   * CHOOSE SPACE
   * ============================================================
   */

  if (
    choice.type ===
    "choose-space"
  ) {
    throw new Error(
      "Space Spell choices are not implemented yet.",
    );
  }

  /*
   * ============================================================
   * CHOOSE ENCOUNTER
   * ============================================================
   */

  if (
    choice.type ===
    "choose-encounter"
  ) {
    throw new Error(
      "Encounter Spell choices are not implemented yet.",
    );
  }

  throw new Error(
    `Unsupported Spell choice type: ${choice.type}`,
  );
}