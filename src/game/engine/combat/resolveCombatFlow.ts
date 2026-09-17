import type { GameState } from "../../models/GameState";
import type { PendingDecision } from "../../models/PendingDecision";

import { startCombatTest } from "../startCombatTest";
import { resolveCombatEncounterEnd } from "../resolveCombatEncounterEnd";
import type { MapDefinition } from "../../models/MapDefinition";
import { resolveShubNiggurathReckoning } from "../resolveShubNiggurathReckoning";

export function resolveCombatFlow(
  game: GameState,
  decision: Extract<
    PendingDecision,
    { type: "combat" }
  >,
  map: MapDefinition,
): GameState {
  const stage = decision.stage ?? "start";

  /*
   * ============================================================
   * START
   * ============================================================
   *
   * Começa o Horror Test.
   *
   * Se o monstro não tiver Horror Test,
   * startCombatTest() trata de avançar diretamente
   * para o Strength Test.
   */
  if (stage === "start") {
    return startCombatTest(
      game,
      decision.monsterId,
      "horror",
      decision.resume,
    );
  }

  /*
   * ============================================================
   * HORROR
   * ============================================================
   *
   * O Horror Test terminou.
   * Agora começa sempre o Strength Test.
   *
   * A resolução do Horror Test propriamente dita
   * já foi feita por resolveCombatTest().
   */
  if (stage === "horror") {
    return startCombatTest(
      game,
      decision.monsterId,
      "strength",
      decision.resume,
    );
  }

  /*
   * ============================================================
   * STRENGTH
   * ============================================================
   *
   * O Strength Test terminou.
   *
   * Se o monstro morreu, resolveCombatTest()
   * já criou o popup "MONSTER DEFEATED".
   *
   * Portanto, só chegamos aqui quando o combate
   * está efetivamente pronto para terminar.
   */
  if (stage === "strength") {
    const gameWithoutCombatDecision: GameState = {
      ...game,
      pendingDecision: null,
    };

    if (
      decision.resume?.type ===
      "shub-niggurath-reckoning"
    ) {
      return resolveShubNiggurathReckoning(
        gameWithoutCombatDecision,
        map,
        decision.resume.investigatorIds,
        decision.resume.nextInvestigatorIndex + 1,
        decision.resume.nextIconIndex,
        decision.monsterId,
        decision.resume.ancientOneAbilityIndex,
        decision.resume.ancientOneId,
        decision.resume.ancientOneReckoningStage,
      );
    }

    return resolveCombatEncounterEnd(
      gameWithoutCombatDecision,
      map,
      decision.monsterId,
    );
  }

  /*
   * ============================================================
   * RESOLVED
   * ============================================================
   */

  if (stage === "resolved") {
    return game;
  }

  throw new Error(
    `Unsupported combat stage: ${stage}`,
  );
}