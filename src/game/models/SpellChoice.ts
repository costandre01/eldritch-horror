import type { SpellFrontTriggeredEffect } from "./SpellDefinition/frontEffects";

export type SpellChoiceType =
  | "choose-investigator"
  | "choose-monster"
  | "choose-clue"
  | "choose-asset"
  | "choose-skill"
  | "choose-space"
  | "choose-encounter";

export interface SpellChoice {
  type: SpellChoiceType;

  investigatorId: string;

  spellId: string;

  location?:
    | "same-space"
    | "any-space";

  excludeConditionDefinitionId?: string;

  assetTypes?:
    | ("item" | "trinket")[];

  maxValueFromTestResult?: boolean;

  /*
   * Effects that are resolved
   * immediately after the player makes
   * the current choice.
   */
  effects: SpellFrontTriggeredEffect[];

  /*
   * Effects that originally came after
   * the choice in the Spell definition.
   *
   * Example:
   *
   * choose-investigator
   * gain Blessed
   * flip-self
   *
   * effects:
   *   gain Blessed
   *
   * remainingEffects:
   *   flip-self
   */
  remainingEffects:
    SpellFrontTriggeredEffect[];
}