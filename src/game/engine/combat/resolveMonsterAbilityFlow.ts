import type { GameState } from "../../models/GameState";
import type { PendingDecision } from "../../models/PendingDecision";

import { resolveMonsterAbility } from "./resolveMonsterAbility";

export function resolveMonsterAbilityFlow(
  game: GameState,
  decision: Extract<
    PendingDecision,
    { type: "monster-ability" }
  >,
  action: "resolve" | "skip",
): GameState {
  /*
   * Algumas habilidades especiais têm uma resolução
   * própria dentro do App/UI.
   *
   * Neste momento, a habilidade que precisa disso é
   * after-will-roll-die-defeat-on-5-6.
   *
   * Essa habilidade continua a ser tratada pelo fluxo
   * específico do dado no App.
   */
  if (
    decision.ability.type ===
    "after-will-roll-die-defeat-on-5-6"
  ) {
    return game;
  }

  return resolveMonsterAbility(
    game,
    decision,
    action,
  );
}