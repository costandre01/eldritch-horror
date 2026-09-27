import type { GameState } from "../models/GameState";

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

    const result = resolveSpellFrontTriggeredEffects(
      currentGame,
      choice.investigatorId,
      choice.spellId,
      [...choice.effects, ...choice.remainingEffects],
    );
    return result.game;
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
    const monster = game.monsters[selectedId];
    const caster = game.investigators[choice.investigatorId];
    if (!monster || !caster || monster.spaceId !== caster.spaceId) {
      throw new Error("Choose a Monster on the investigator's space.");
    }
    let currentGame: GameState = {
      ...game,
      pendingSpellChoice: null,
      spells: {
        ...game.spells,
        [choice.spellId]: { ...spell, pendingChosenMonsterId: selectedId },
      },
    };
    const result = resolveSpellFrontTriggeredEffects(
      currentGame,
      choice.investigatorId,
      choice.spellId,
      [...choice.effects, ...choice.remainingEffects],
    );
    currentGame = result.game;
    return currentGame;
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
    const clue = Object.values(game.board.spaces)
      .flatMap((space) => space.clueTokenIds.map((id) => ({ id, spaceId: space.spaceId })))
      .find((item) => item.id === selectedId);
    const investigator = game.investigators[choice.investigatorId];
    if (!clue || !investigator?.spaceId) throw new Error("Choose a Clue on the map.");
    const currentGame: GameState = {
      ...game,
      pendingSpellChoice: null,
      ignoreMonstersForNextEncounter: true,
      spellEncounterReturnSpaceId: investigator.spaceId,
      spells: { ...game.spells, [choice.spellId]: { ...spell, pendingChosenClueId: selectedId } },
      investigators: {
        ...game.investigators,
        [investigator.id]: { ...investigator, spaceId: clue.spaceId },
      },
    };
    return resolveSpellFrontTriggeredEffects(currentGame, choice.investigatorId, choice.spellId, choice.remainingEffects).game;
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
    const asset = game.board.assetReserve.find((candidate) => candidate.id === selectedId);
    const owner = game.investigators[choice.investigatorId];
    if (!asset || !owner || !choice.assetTypes?.includes(asset.type as "item" | "trinket")) {
      throw new Error("Choose a valid Asset from the reserve.");
    }
    if (choice.maxValueFromTestResult && asset.value > (spell.pendingTestResult?.successes ?? 0)) {
      throw new Error("This Asset costs more than the Spell test result allows.");
    }
    const currentGame: GameState = {
      ...game,
      pendingSpellChoice: null,
      board: { ...game.board, assetReserve: game.board.assetReserve.filter((candidate) => candidate.id !== selectedId) },
      investigators: { ...game.investigators, [owner.id]: { ...owner, assetIds: [...owner.assetIds, asset.id] } },
    };
    return resolveSpellFrontTriggeredEffects(currentGame, choice.investigatorId, choice.spellId, choice.remainingEffects).game;
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
    const skill = selectedId as keyof typeof game.investigators[string]["skills"];
    if (!(skill in game.investigators[choice.investigatorId].skills)) throw new Error("Choose a valid skill.");
    const effect = choice.effects.find((item) => item.type === "improve-skill");
    if (!effect || effect.type !== "improve-skill") throw new Error("Spell has no skill improvement to apply.");
    const targetId = effect.target === "caster" ? choice.investigatorId : spell.pendingChosenInvestigatorId;
    const target = targetId ? game.investigators[targetId] : undefined;
    if (!target) throw new Error("Spell has no valid investigator selected for the skill improvement.");
    const currentGame: GameState = {
      ...game,
      pendingSpellChoice: null,
      investigators: { ...game.investigators, [target.id]: { ...target, skills: { ...target.skills, [skill]: target.skills[skill] + effect.amount } } },
    };
    return resolveSpellFrontTriggeredEffects(currentGame, choice.investigatorId, choice.spellId, choice.remainingEffects).game;
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
    const effect = choice.effects.find((item) => item.type === "move-to-any-space");
    if (!effect || effect.type !== "move-to-any-space") throw new Error("Spell has no movement effect to apply.");
    const targetId = effect.target === "caster" ? choice.investigatorId : spell.pendingChosenInvestigatorId;
    const target = targetId ? game.investigators[targetId] : undefined;
    if (!target || !game.board.spaces[selectedId]) throw new Error("Choose a valid destination.");
    const currentGame: GameState = {
      ...game,
      pendingSpellChoice: null,
      investigators: { ...game.investigators, [target.id]: { ...target, spaceId: selectedId } },
    };
    return resolveSpellFrontTriggeredEffects(currentGame, choice.investigatorId, choice.spellId, choice.remainingEffects).game;
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
    const currentGame: GameState = { ...game, pendingSpellChoice: null, ignoreMonstersForNextEncounter: true };
    return resolveSpellFrontTriggeredEffects(currentGame, choice.investigatorId, choice.spellId, choice.remainingEffects).game;
  }

  throw new Error(
    `Unsupported Spell choice type: ${choice.type}`,
  );
}
