import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { advanceOmen } from "./omenEngine";
import { resolveMythos } from "./resolveMythos";
import { startInvestigatorActions } from "./startInvestigatorActions";
import { startInvestigatorEncounter } from "./startInvestigatorEncounter";
import { revealEncounter } from "./revealEncounter";
import { resolveCurrentEncounter } from "./resolveCurrentEncounter";
import { resolveEncounterEffects } from "./resolveEncounterEffects";
import { endInvestigatorEncounter } from "./endInvestigatorEncounter";
import { resolvePendingDecision } from "./resolvePendingDecision";
import { resolveCombatEncounterEnd } from "./resolveCombatEncounterEnd";
import { showMythosContinue } from "./showMythosContinue";
import { resolveMythosCardReckoning } from "./resolveMythosCardReckoning";
import { resolveConditionReckoning } from "./resolveConditionReckoning";
import { resolveAncientOneReckoning } from "./resolveAncientOneReckoning";
import { resolveShubNiggurathReckoning } from "./resolveShubNiggurathReckoning";
import { resolveMonsterReckoning } from "./resolveMonsterReckoning";
import { startAncientOneReckoning } from "./startAncientOneReckoning";
import { resolveAncientOneAwakening } from "./resolveAncientOneAwakening";
import { resolveNextYogSothothInvestigator } from "./resolveYogSothothReckoning";
import { startMonsterCombat } from "./startMonsterCombat";
import { easyMythos } from "../../content/core/mythos/easyMythos";
import { normalMythos } from "../../content/core/mythos/normalMythos";
import { hardMythos } from "../../content/core/mythos/hardMythos";
import { startArrestsMade, startEyesEverywhere } from "./resolveMythosSpecial";
import { gainCondition } from "./gainCondition";
import { solveMythosRumor } from "./solveMythosRumor";
import { defeatInvestigator } from "./defeatInvestigator";
import { startMonsterReckoning } from "./startMonsterReckoning";

export interface GameFlowContinueResult {
  game: GameState;
  resetEncounterStartedForTurn: boolean;
}

export function resolveGameFlowContinue(
  game: GameState,
  map: MapDefinition,
): GameFlowContinueResult {
  /*
   * ============================================================
   * MYTHOS OMEN
   * ============================================================
   *
   * Continue a Mythos card after moving the Omen.
   */

  if (
    game.pendingDecision?.type ===
    "mythos-omen"
  ) {
    const decision =
      game.pendingDecision;

    const wasAwakened =
      game.ancientOne.awakened;

    const movedGame =
      advanceOmen(
        game,
        decision.steps,
      );

    const gameAfterOmen: GameState = {
      ...movedGame,

      pendingDecision:
        null,
    };

    /*
    * If Doom reached 0 during Advance Omen,
    * the Ancient One has just awakened.
    *
    * Resolve the Awakening immediately before
    * continuing the Mythos card.
    */

    if (
      !wasAwakened &&
      gameAfterOmen.ancientOne.awakened
    ) {
      const awakenedGame =
        resolveAncientOneAwakening(
          gameAfterOmen,
          map,
          decision.nextIconIndex,
        );

      return {
        game: awakenedGame,
        resetEncounterStartedForTurn:
          false,
      };
    }

    const resumedGame =
      showMythosContinue(
        gameAfterOmen,
        decision.nextIconIndex,
      );

    return {
      game: resumedGame,
      resetEncounterStartedForTurn:
        false,
    };
  }

  const decision =
    game.pendingDecision;

  if (!decision) {
    return {
      game,
      resetEncounterStartedForTurn:
        false,
    };
  }

  /*
   * ============================================================
   * MYTHOS CARD
   * ============================================================
   *
   * The Mythos card has already been drawn and displayed.
   *
   * Continue starts resolving its effects/icons.
   */

  if (
    decision.type === "continue" &&
    decision.source?.startsWith(
      "mythos-card:",
    )
  ) {
    const sourceParts =
      decision.source.split(":");

    const startIconIndex =
      sourceParts.length >= 2
        ? Number(sourceParts[1])
        : 0;

    if (
      !Number.isInteger(startIconIndex) ||
      startIconIndex < 0
    ) {
      throw new Error(
        "Invalid Mythos icon index.",
      );
    }

    const gameWithoutDecision:
      GameState = {
        ...game,

        pendingDecision:
          null,
      };

    const resolvedGame =
      resolveMythos(
        gameWithoutDecision,
        map,
        startIconIndex,
      );

    return {
      game: resolvedGame,
      resetEncounterStartedForTurn:
        false,
    };
  }

  /*
  * ============================================================
  * MYTHOS CARD RECKONING
  * ============================================================
  *
  * Continue resolves the next Mythos card currently in play
  * that has a Reckoning effect.
  */

  if (
    decision.type ===
    "mythos-card-reckoning"
  ) {
    const resolvedGame =
      resolveMythosCardReckoning(
        game,
        map,
      );

    return {
      game: resolvedGame,

      resetEncounterStartedForTurn:
        false,
    };
  }

  if (
    decision.type ===
    "mythos-condition-reckoning"
  ) {
    const resolvedGame =
      resolveConditionReckoning(
        game,
        map,
      );

    return {
      game: resolvedGame,
      resetEncounterStartedForTurn: false,
    };
  }

  /*
   * ============================================================
   * ANCIENT ONE RECKONING
   * ============================================================
   *
   * Continue resolves the current Ancient One
   * Reckoning ability.
   */

  if (
    decision.type ===
    "mythos-monster-reckoning-resume"
  ) {
    const resolvedMonsterIds = [
      ...decision.resolvedMonsterIds,
      decision.monsterId,
    ];

    const allResolved =
      resolvedMonsterIds.length ===
      decision.monsterIds.length;

    if (allResolved) {
      const gameWithoutDecision = {
        ...game,
        pendingDecision: null,
      };

      const resolvedGame =
        startAncientOneReckoning(
          gameWithoutDecision,
          map,
          decision.nextIconIndex,
        );

      return {
        game: resolvedGame,
        resetEncounterStartedForTurn:
          false,
      };
    }

    const nextGame: GameState = {
      ...game,

      pendingDecision: {
        type:
          "mythos-reckoning-monsters",

        title:
          "MONSTERS — RECKONING",

        message:
          "Choose the next Monster to resolve.",

        monsterIds:
          decision.monsterIds,

        resolvedMonsterIds,

        source:
          "mythos:reckoning-monsters",

        nextIconIndex:
          decision.nextIconIndex,
      },
    };

    return {
      game: nextGame,
      resetEncounterStartedForTurn:
        false,
    };
  }

  if (
    decision.type ===
    "mythos-ancient-one-reckoning"
  ) {
    const resolvedGame =
      resolveAncientOneReckoning(
        game,
        map,
      );

    return {
      game: resolvedGame,
      resetEncounterStartedForTurn:
        false,
    };
  }

  /*
  * ============================================================
  * YOG-SOTHOTH RECKONING RESUME
  * ============================================================
  *
  * Resume Yog-Sothoth's investigator sequence after
  * an Ancient One Awakening interrupted it.
  */

  if (
    decision.type ===
    "mythos-yog-sothoth-reckoning-resume"
  ) {
    const resolvedGame =
      resolveNextYogSothothInvestigator(
        {
          ...game,
          pendingDecision: null,
        },
        map,
        decision.investigatorIds,
        decision.nextInvestigatorIndex,
        decision.nextIconIndex,
        decision.ancientOneAbilityIndex,
        decision.ancientOneId,
        decision.ancientOneReckoningStage,
      );

    return {
      game: resolvedGame,
      resetEncounterStartedForTurn:
        false,
    };
  }

  /*
   * ============================================================
   * INVESTIGATOR TURN
   * ============================================================
   */

  if (
    decision.type ===
    "investigator-turn"
  ) {
    /*
     * ==========================================================
     * ACTION PHASE
     * ==========================================================
     */

    if (
      decision.phase ===
      "action"
    ) {
      const updatedGame =
        startInvestigatorActions(
          game,
        );

      return {
        game: updatedGame,
        resetEncounterStartedForTurn:
          false,
      };
    }

    /*
     * ==========================================================
     * ENCOUNTER PHASE
     * ==========================================================
     */

    if (
      decision.phase ===
      "encounter"
    ) {
      const updatedGame =
        startInvestigatorEncounter(
          game,
          map,
        );

      return {
        game: updatedGame,
        resetEncounterStartedForTurn:
          false,
      };
    }
  }

  /*
   * ============================================================
   * ENCOUNTER REVEAL
   * ============================================================
   */

  if (
    decision.type ===
    "reveal-encounter"
  ) {
    const revealedGame =
      revealEncounter(
        game,
      );

    const resolvedGame =
      resolveCurrentEncounter(
        revealedGame,
        map,
      );

    return {
      game: resolvedGame,
      resetEncounterStartedForTurn:
        false,
    };
  }

  /*
  * ============================================================
  * MYTHOS — PATROLLING THE BORDER
  * TEST RESULT
  * ============================================================
  */

  if (
      decision.type === "continue" &&
      decision.source?.startsWith(
          "mythos:patrolling-the-border:test-result:",
      )
  ) {
      const resume =
          decision.resume;

      if (
          !resume ||
          resume.type !==
              "mythos-patrolling-the-border"
      ) {
          throw new Error(
              "Patrolling the Border test result is missing its resume.",
          );
      }

      const result =
          decision.source.split(":")[5];

      const investigatorId =
          resume.investigatorIds[
              resume.currentInvestigatorIndex
          ];

      if (!investigatorId) {
          throw new Error(
              "Patrolling the Border could not determine the current Investigator.",
          );
      }

      let currentGame =
          game;

      const mythos =
          normalMythos.find(
              (definition) =>
                  definition.id ===
                  "patrolling-the-border",
          );

      if (!mythos) {
          throw new Error(
              'Mythos "patrolling-the-border" does not exist.',
          );
      }

      /*
      * ========================================================
      * FAIL
      * ========================================================
      *
      * Failed investigators become Delayed
      * and gain Detained.
      */

      if (
          result === "fail"
      ) {
          const investigator =
              currentGame.investigators[
                  investigatorId
              ];

          if (!investigator) {
              throw new Error(
                  `Investigator "${investigatorId}" does not exist.`,
              );
          }

          currentGame = {
              ...currentGame,

              investigators: {
                  ...currentGame.investigators,

                  [investigatorId]: {
                      ...investigator,

                      isDelayed: true,
                  },
              },
          };

          currentGame =
              gainCondition(
                  currentGame,
                  investigatorId,
                  "condition-detained",
              );
      }

      /*
      * ========================================================
      * NEXT INVESTIGATOR
      * ========================================================
      */

      const nextIndex =
          resume.currentInvestigatorIndex +
          1;

      if (
          nextIndex <
          resume.investigatorIds.length
      ) {
          const nextInvestigatorId =
              resume.investigatorIds[
                  nextIndex
              ];

          if (!nextInvestigatorId) {
              throw new Error(
                  "Patrolling the Border could not determine the next Investigator.",
              );
          }

          return {
              game: {
                  ...currentGame,

                  activeInvestigatorId:
                      nextInvestigatorId,

                  pendingDecision: {
                      type: "test",

                      title:
                          "Patrolling the Border",

                      message:
                          "Test Observation.",

                      image:
                          mythos.image,

                      skill:
                          "observation",

                      modifier:
                          0,

                      investigatorId:
                          nextInvestigatorId,

                      source:
                          `mythos:patrolling-the-border:test:${nextInvestigatorId}:${nextIndex}`,

                      resume: {
                          type:
                              "mythos-patrolling-the-border",

                          investigatorIds:
                              resume.investigatorIds,

                          currentInvestigatorIndex:
                              nextIndex,
                      },
                  },
              },

              resetEncounterStartedForTurn:
                  false,
          };
      }

      /*
      * ========================================================
      * ALL CITY INVESTIGATORS HAVE BEEN TESTED
      * ========================================================
      *
      * Discard Patrolling the Border.
      */

      const updatedMythosInPlay =
          currentGame.board.mythosInPlay.filter(
              (entry) =>
                  entry.definitionId !==
                  "patrolling-the-border",
          );

      return {
          game: {
              ...currentGame,

              board: {
                  ...currentGame.board,

                  mythosInPlay:
                      updatedMythosInPlay,

                  mythosDiscard: [
                      ...currentGame.board.mythosDiscard,
                      mythos,
                  ],
              },

              currentMythosId:
                  null,

              activeInvestigatorId:
                  null,

              pendingDecision:
                  null,
          },

          resetEncounterStartedForTurn:
              false,
      };
  }

  /*
  * ============================================================
  * MYTHOS — ARRESTS MADE IN MURDER CASE!
  * TEST RESULT
  * ============================================================
  */

  if (
    decision.type === "continue" &&
    decision.source?.startsWith(
      "mythos:arrests-made:test-result:",
    )
  ) {
    /*
    * Arrests Made must always carry
    * its original Investigator sequence.
    */

    const resume =
      decision.resume;

    if (
      !resume ||
      resume.type !==
        "mythos-arrests-made"
    ) {
      throw new Error(
        "Arrests Made test result is missing its resume.",
      );
    }

    const result =
      decision.source.split(":")[5];

    /*
    * ==========================================================
    * PASS
    * ==========================================================
    *
    * Move directly to the next eligible Investigator.
    */

    if (
      result === "pass"
    ) {
      return {
        game:
          startArrestsMade(
            {
              ...game,

              pendingDecision:
                null,
            },
            map,
            resume.investigatorIds,
            resume.currentInvestigatorIndex + 1,
          ),

        resetEncounterStartedForTurn:
          false,
      };
    }

    /*
    * ==========================================================
    * FAIL
    * ==========================================================
    *
    * The Investigator must discard
    * exactly 1 Weapon.
    */

    const investigatorId =
      resume.investigatorIds[
        resume.currentInvestigatorIndex
      ];

    if (!investigatorId) {
      throw new Error(
        "Arrests Made could not determine the current Investigator.",
      );
    }

    const investigator =
      game.investigators[
        investigatorId
      ];

    if (!investigator) {
      throw new Error(
        `Investigator "${investigatorId}" does not exist.`,
      );
    }

    const weaponIds =
      investigator.assetIds.filter(
        (assetId) =>
          game.assets[assetId]?.traits.includes(
            "weapon",
          ),
      );

    /*
    * The Investigator was eligible when
    * Arrests Made started, so a Weapon should
    * still be available here.
    */

    if (
      weaponIds.length === 0
    ) {
      throw new Error(
        `Investigator "${investigatorId}" failed Arrests Made but has no Weapon to discard.`,
      );
    }

    return {
      game: {
        ...game,

        pendingDecision: {
          type: "select-card",

          title:
            "Discard a Weapon",

          message:
            "Choose 1 Weapon possession to discard.",

          cardIds:
            weaponIds,

          selectableCardIds:
            weaponIds,

          minSelections:
            1,

          maxSelections:
            1,

          selectedCardIds:
            [],

          investigatorId,

          source:
            `mythos:arrests-made:weapon:${investigatorId}:${resume.currentInvestigatorIndex}`,

          resume,
        },
      },

      resetEncounterStartedForTurn:
        false,
    };
  }

  /*
   * ============================================================
   * TEST RESULT CONTINUE
   * ============================================================
   *
   * This is the PASS / FAIL screen created after a Test.
   *
   * The Encounter itself must remain active while
   * there are remaining effects.
   */

  if (
    decision.type === "continue" &&
    decision.source?.startsWith(
      "encounter:test-result:",
    )
  ) {
    const source =
      decision.source;

    const investigatorId =
      source.split(":")[2];

    if (!investigatorId) {
      throw new Error(
        "Test result is missing investigatorId.",
      );
    }

    const effects =
      decision.onComplete ?? [];

    /*
     * Remove only the PASS / FAIL screen.
     *
     * IMPORTANT:
     *
     * We intentionally keep:
     *
     * currentEncounterId
     * currentEncounterDeckType
     * currentEncounterRevealed
     */

    const gameWithoutDecision:
      GameState = {
        ...game,

        pendingDecision:
          null,
      };

    /*
     * ==========================================================
     * REMAINING EFFECTS
     * ==========================================================
     */

    if (effects.length > 0) {
      const resolvedGame =
        resolveEncounterEffects(
          gameWithoutDecision,
          investigatorId,
          effects,
          map,
        );

      /*
      * The effects may create another interaction:
      *
      * - Test
      * - Choice
      * - Combat
      * - Select Space
      * - Select Card
      * - etc.
      *
      * In that case the Encounter remains active.
      */

      if (
        resolvedGame.pendingDecision ||
        resolvedGame.pendingEncounterChoice
      ) {
        return {
          game: resolvedGame,
          resetEncounterStartedForTurn: false,
        };
      }

      /*
      * ============================================================
      * TEST CHAIN COMPLETE
      * ============================================================
      *
      * All effects belonging to the Test have now been resolved.
      *
      * IMPORTANT:
      *
      * Do NOT call resolveCurrentEncounter() here.
      *
      * resolveCurrentEncounter() would restart the Encounter
      * from the beginning and show the same choice again.
      *
      * The Encounter must now be discarded and the next
      * investigator must start.
      */

      const encounterId =
        resolvedGame.currentEncounterId;

      const encounterDeckType =
        resolvedGame.currentEncounterDeckType;

      if (
        !encounterId ||
        !encounterDeckType
      ) {
        throw new Error(
          "Cannot finish Encounter after Test: current Encounter information is missing.",
        );
      }

      const finishedGame: GameState = {
        ...resolvedGame,

        board: {
          ...resolvedGame.board,

          encounterDiscards: {
            ...resolvedGame.board
              .encounterDiscards,

            [encounterDeckType]: [
              ...resolvedGame.board
                .encounterDiscards[
                  encounterDeckType
                ],

              encounterId,
            ],
          },
        },

        currentEncounterId:
          null,

        currentEncounterBackId:
          null,

        currentEncounterRevealed:
          false,

        currentEncounterDeckType:
          null,

        pendingDecision:
          null,

        pendingEncounterChoice:
          null,
      };

      const nextGame =
        endInvestigatorEncounter(
          finishedGame,
        );

      return {
        game: nextGame,
        resetEncounterStartedForTurn: false,
      };
    }

    /*
    * ============================================================
    * NO REMAINING TEST EFFECTS
    * ============================================================
    *
    * The Test has completely resolved.
    *
    * Do not call resolveCurrentEncounter(), because that would
    * restart an old-style Encounter choice.
    */

    const encounterId =
      gameWithoutDecision.currentEncounterId;

    const encounterDeckType =
      gameWithoutDecision.currentEncounterDeckType;

    if (
      !encounterId ||
      !encounterDeckType
    ) {
      throw new Error(
        "Cannot finish Encounter after Test: current Encounter information is missing.",
      );
    }

    const finishedGame: GameState = {
      ...gameWithoutDecision,

      board: {
        ...gameWithoutDecision.board,

        encounterDiscards: {
          ...gameWithoutDecision.board
            .encounterDiscards,

          [encounterDeckType]: [
            ...gameWithoutDecision.board
              .encounterDiscards[
                encounterDeckType
              ],

            encounterId,
          ],
        },
      },

      currentEncounterId:
        null,

      currentEncounterBackId:
        null,

      currentEncounterRevealed:
        false,

      currentEncounterDeckType:
        null,

      pendingDecision:
        null,

      pendingEncounterChoice:
        null,
    };

    const nextGame =
      endInvestigatorEncounter(
        finishedGame,
      );

    return {
      game: nextGame,
      resetEncounterStartedForTurn:
        false,
    };
  }

  /*
   * ============================================================
   * IMPROVE SKILL
   * ============================================================
   *
   * The skill improvement itself was already resolved.
   * Continue simply closes the decision.
   */

  if (
    decision.type === "continue" &&
    decision.source?.startsWith(
      "improve-skill:",
    )
  ) {
    return {
      game: {
        ...game,

        pendingDecision:
          null,
      },

      resetEncounterStartedForTurn:
        false,
    };
  }

  /*
  * ==========================================================
  * RESUME SHUB-NIGGURATH RECKONING AFTER LEAD DEFEAT
  * ==========================================================
  */

  if (
    decision.type === "continue" &&
    decision.source ===
      "mythos:shub-niggurath-reckoning-resume" &&
    decision.resume?.type ===
      "shub-niggurath-reckoning"
  ) {
    const resume = decision.resume;

    const nextGame =
      resolveShubNiggurathReckoning(
        game,
        map,
        resume.investigatorIds,
        resume.nextInvestigatorIndex + 1,
        resume.nextIconIndex,
        resume.monsterId,
        resume.ancientOneAbilityIndex,
        resume.ancientOneId,
        resume.ancientOneReckoningStage,
      );

    return {
      game: nextGame,
      resetEncounterStartedForTurn: false,
    };
  }

  /*
   * ============================================================
   * INVESTIGATOR DEFEATED
   * ============================================================
   *
   * Close the defeat popup and advance the Encounter flow.
   */

  if (
    decision.type === "continue" &&
    decision.source?.startsWith(
      "combat-defeat:",
    )
  ) {
    const finishedGame:
      GameState = {
        ...game,

        pendingDecision:
          null,
      };

    /*
    * ==========================================================
    * SHUB-NIGGURATH RECKONING COMBAT
    * ==========================================================
    */

    if (
      decision.resume?.type ===
      "shub-niggurath-reckoning"
    ) {
      const resume =
        decision.resume;

      const defeatedInvestigatorId =
        decision.source.split(":")[1];

      if (!defeatedInvestigatorId) {
        throw new Error(
          "Investigator defeat decision is missing investigatorId.",
        );
      }

      /*
      * ==========================================================
      * RESTORE SHUB RECKONING
      * ==========================================================
      *
      * The Investigator was defeated during combat against
      * Shub-Niggurath.
      *
      * The combat that caused the defeat is already finished.
      * The current Investigator must therefore be skipped and
      * Shub's sequence must continue with the next Investigator.
      *
      * We build a temporary Monster Reckoning decision so that
      * defeatInvestigator() can apply the complete normal defeat
      * rules, including:
      *
      * - Doom +1
      * - move to nearest City
      * - discard Conditions
      * - mark defeated
      * - add pending replacement
      * - choose a new Lead if necessary
      */
      const resolvedMonsterIds: string[] = [];

      const shubReckoningDecision =
        {
          type:
            "mythos-reckoning-monsters" as const,

          title:
            "MONSTER RECKONING",

          message:
            "Resolve the Reckoning ability of the next Monster.",

          monsterIds: [
            resume.monsterId,
          ],

          resolvedMonsterIds,

          source:
            "mythos:reckoning-monsters" as const,

          nextIconIndex:
            resume.nextIconIndex,
        };

      const reckoningGame: GameState = {
        ...finishedGame,

        pendingDecision:
          shubReckoningDecision,
      };

      const gameAfterDefeat =
        defeatInvestigator(
          reckoningGame,
          map,
          defeatedInvestigatorId,
          resume.monsterId,
        );

      /*
      * ==========================================================
      * GAME DEFEAT
      * ==========================================================
      */

      if (
        gameAfterDefeat.status ===
        "defeat"
      ) {
        return {
          game: gameAfterDefeat,

          resetEncounterStartedForTurn:
            false,
        };
      }

      /*
      * ==========================================================
      * LEAD DEFEATED
      * ==========================================================
      *
      * defeatInvestigator() will create the Lead selection.
      *
      * However, the normal Monster Reckoning resume is not enough
      * for Shub-Niggurath because Shub has its own Investigator
      * sequence.
      *
      * We therefore replace the stored resume with the exact
      * Shub continuation that must happen after the new Lead
      * is selected.
      */

      if (
        gameAfterDefeat.pendingDecision?.type ===
          "select-investigator" &&
        gameAfterDefeat.pendingDecision.source ===
          "defeat:lead"
      ) {
        const leadDecision =
          gameAfterDefeat.pendingDecision;

        return {
          game: {
            ...gameAfterDefeat,

            pendingDecision: {
              ...leadDecision,

              resume: {
                type:
                  "defeat-lead",

                phase:
                  "mythos",

                pendingDecision: {
                  type:
                    "continue",

                  title:
                    "SHUB-NIGGURATH — RECKONING",

                  message:
                    "Continue resolving Shub-Niggurath's Reckoning.",

                  source:
                    "mythos:shub-niggurath-reckoning-resume",

                  resume,
                },
              },
            },
          },

          resetEncounterStartedForTurn:
            false,
        };
      }

      /*
      * ==========================================================
      * NON-LEAD DEFEAT
      * ==========================================================
      *
      * The Investigator was defeated but the Lead remains alive.
      * Continue Shub immediately with the next Investigator.
      */

      const nextGame =
        resolveShubNiggurathReckoning(
          gameAfterDefeat,
          map,
          resume.investigatorIds,
          resume.nextInvestigatorIndex + 1,
          resume.nextIconIndex,
          resume.monsterId,
          resume.ancientOneAbilityIndex,
          resume.ancientOneId,
          resume.ancientOneReckoningStage,
        );

      return {
        game: nextGame,

        resetEncounterStartedForTurn:
          false,
      };
    }

    /*
    * ==========================================================
    * NORMAL MONSTER RECKONING COMBAT
    * ==========================================================
    *
    * The Investigator was defeated during a Monster Reckoning
    * combat.
    *
    * The Monster that caused the combat is considered resolved
    * and must NOT be resolved again.
    *
    * All normal Investigator defeat rules are applied through
    * defeatInvestigator().
    *
    * If the defeated Investigator was the Lead, the Lead selection
    * interrupts the Reckoning. The interrupted Reckoning is stored
    * inside the Lead selection decision and restored by App.tsx
    * after the new Lead is chosen.
    */

    if (
      decision.resume?.type ===
      "monster-reckoning"
    ) {
      const resume =
        decision.resume;

      const defeatedInvestigatorId =
        decision.source.split(":")[1];

      if (!defeatedInvestigatorId) {
        throw new Error(
          "Investigator defeat decision is missing investigatorId.",
        );
      }

      /*
      * ----------------------------------------------------------
      * RESTORE THE MYTHOS RECKONING DECISION
      * ----------------------------------------------------------
      *
      * defeatInvestigator() needs to see the original
      * Mythos Monster Reckoning decision.
      *
      * The Monster that caused the combat is immediately marked
      * as resolved so that it is never resolved again.
      */

      const resolvedMonsterIds = [
        ...resume.resolvedMonsterIds,
        ...(resume.resolvedMonsterIds.includes(
          resume.monsterId,
        )
          ? []
          : [resume.monsterId]),
      ];

      const reckoningGame: GameState = {
        ...finishedGame,

        pendingDecision: {
          type:
            "mythos-reckoning-monsters",

          title:
            "MONSTER RECKONING",

          message:
            "Resolve the Reckoning ability of the next Monster.",

          monsterIds:
            resume.monsterIds,

          resolvedMonsterIds,

          source:
            "mythos:reckoning-monsters",

          nextIconIndex:
            resume.nextIconIndex,

          ...(resume.remainingPasses !== undefined
            ? {
                remainingPasses:
                  resume.remainingPasses,
              }
            : {}),
        },

        activeInvestigatorId:
          null,
      };

      /*
      * ----------------------------------------------------------
      * APPLY NORMAL DEFEAT RULES
      * ----------------------------------------------------------
      *
      * This applies:
      *
      * - Doom +1
      * - move to nearest City
      * - discard Conditions
      * - mark Investigator defeated
      * - add pending replacement
      * - if Lead: request new Lead immediately
      */

      const gameAfterDefeat =
        defeatInvestigator(
          reckoningGame,
          map,
          defeatedInvestigatorId,
          resume.monsterId,
        );

      /*
      * ----------------------------------------------------------
      * GAME DEFEAT
      * ----------------------------------------------------------
      */

      if (
        gameAfterDefeat.status ===
        "defeat"
      ) {
        return {
          game:
            gameAfterDefeat,

          resetEncounterStartedForTurn:
            false,
        };
      }

      /*
      * ----------------------------------------------------------
      * LEAD DEFEATED
      * ----------------------------------------------------------
      *
      * defeatInvestigator() already created:
      *
      * select-investigator
      *
      * with the interrupted Monster Reckoning stored in:
      *
      * decision.resume.pendingDecision
      *
      * App.tsx will restore that decision after the new Lead
      * is selected.
      */

      if (
        gameAfterDefeat.pendingDecision?.type ===
          "select-investigator" &&
        gameAfterDefeat.pendingDecision.source ===
          "defeat:lead"
      ) {
        return {
          game:
            gameAfterDefeat,

          resetEncounterStartedForTurn:
            false,
        };
      }

      /*
      * ----------------------------------------------------------
      * FIND NEXT MONSTER
      * ----------------------------------------------------------
      */

      const nextMonsterId =
        resume.monsterIds.find(
          (id) =>
            !resolvedMonsterIds.includes(id),
        );

      /*
      * ----------------------------------------------------------
      * ALL MONSTERS RESOLVED
      * ----------------------------------------------------------
      */

      if (!nextMonsterId) {
        const gameWithoutDecision:
          GameState = {
            ...gameAfterDefeat,

            pendingDecision:
              null,

            activeInvestigatorId:
              null,
          };

        const remainingPasses =
          resume.remainingPasses ?? 1;

        /*
        * More Monster Reckoning passes remain.
        */

        if (
          remainingPasses > 1
        ) {
          const nextGame =
            startMonsterReckoning(
              gameWithoutDecision,
              map,
              resume.nextIconIndex,
              remainingPasses - 1,
            );

          return {
            game:
              nextGame,

            resetEncounterStartedForTurn:
              false,
          };
        }

        /*
        * Monster Reckoning is completely finished.
        * Continue with Ancient One Reckoning.
        */

        const nextGame =
          startAncientOneReckoning(
            gameWithoutDecision,
            map,
            resume.nextIconIndex,
          );

        return {
          game:
            nextGame,

          resetEncounterStartedForTurn:
            false,
        };
      }

      /*
      * ----------------------------------------------------------
      * CONTINUE WITH NEXT MONSTER
      * ----------------------------------------------------------
      *
      * The defeated Investigator was not the Lead, so there is
      * no Lead-selection interruption.
      */

      const gameWithReckoningDecision:
        GameState = {
          ...gameAfterDefeat,

          pendingDecision: {
            type:
              "mythos-reckoning-monsters",

            title:
              "MONSTER RECKONING",

            message:
              "Resolve the Reckoning ability of the next Monster.",

            monsterIds:
              resume.monsterIds,

            resolvedMonsterIds,

            source:
              "mythos:reckoning-monsters",

            nextIconIndex:
              resume.nextIconIndex,

            ...(resume.remainingPasses !== undefined
              ? {
                  remainingPasses:
                    resume.remainingPasses,
                }
              : {}),
          },

          activeInvestigatorId:
            null,
        };

      const nextGame =
        resolveMonsterReckoning(
          gameWithReckoningDecision,
          map,
          nextMonsterId,
        );

      return {
        game:
          nextGame,

        resetEncounterStartedForTurn:
          false,
      };
    }

    /*
    * ==========================================================
    * EYES EVERYWHERE COMBAT
    * ==========================================================
    *
    * The Investigator was defeated during the
    * Eyes Everywhere Monster ambush.
    *
    * The ambush sequence must continue with the
    * next Investigator instead of returning to
    * the normal Encounter flow.
    */

    if (
      decision.resume?.type ===
      "eyes-everywhere"
    ) {
      const resume =
        decision.resume;

      const defeatedInvestigatorId =
        decision.source.split(":")[1];

      if (!defeatedInvestigatorId) {
        throw new Error(
          "Eyes Everywhere defeat decision is missing investigatorId.",
        );
      }

      /*
      * Mark the Investigator as defeated.
      */

      let gameAfterDefeat: GameState = {
        ...finishedGame,

        activeInvestigatorId:
          null,

        combatOrder:
          null,

        investigators: {
          ...finishedGame.investigators,

          [defeatedInvestigatorId]: {
            ...finishedGame.investigators[
              defeatedInvestigatorId
            ],

            isDefeated: true,
          },
        },
      };

      /*
      * ----------------------------------------------------------
      * FIND NEXT INVESTIGATOR
      * ----------------------------------------------------------
      */

      const nextIndex =
        resume.currentInvestigatorIndex + 1;

      /*
      * ----------------------------------------------------------
      * MORE INVESTIGATORS
      * ----------------------------------------------------------
      */

      if (
        nextIndex <
        resume.investigatorIds.length
      ) {
        const nextInvestigatorId =
          resume.investigatorIds[
            nextIndex
          ];

        if (!nextInvestigatorId) {
          throw new Error(
            "Eyes Everywhere could not determine the next Investigator.",
          );
        }

        const mythos =
          [
            ...easyMythos,
            ...normalMythos,
            ...hardMythos,
          ].find(
            (definition) =>
              definition.id ===
              "eyes-everywhere",
          );

        if (!mythos) {
          throw new Error(
            'Mythos "eyes-everywhere" does not exist.',
          );
        }

        return {
          game:
            startEyesEverywhere(
              {
                ...gameAfterDefeat,

                pendingDecision:
                  null,

                activeInvestigatorId:
                  nextInvestigatorId,
              },
              mythos,
              nextIndex,
            ),

          resetEncounterStartedForTurn:
            false,
        };
      }

      /*
      * ----------------------------------------------------------
      * ALL INVESTIGATORS FINISHED
      * ----------------------------------------------------------
      */

      const eyesEverywhere =
        [
          ...easyMythos,
          ...normalMythos,
          ...hardMythos,
        ].find(
          (definition) =>
            definition.id ===
            "eyes-everywhere",
        );

      if (!eyesEverywhere) {
        throw new Error(
          'Mythos "eyes-everywhere" does not exist.',
        );
      }

      return {
        game: {
          ...gameAfterDefeat,

          board: {
            ...gameAfterDefeat.board,

            mythosDiscard: [
              ...gameAfterDefeat.board.mythosDiscard,
              eyesEverywhere,
            ],
          },

          currentMythosId:
            null,

          activeInvestigatorId:
            null,

          pendingDecision:
            null,
        },

        resetEncounterStartedForTurn:
          false,
      };
    }

    /*
    * ==========================================================
    * A DARK POWER COMBAT
    * ==========================================================
    *
    * The investigator was defeated while resolving
    * A Dark Power.
    *
    * The defeated investigator's sequence ends.
    * Continue with the next investigator from the
    * original investigator snapshot.
    */

    if (
      decision.resume?.type ===
      "mythos-dark-power"
    ) {
      const resume =
        decision.resume;

      const defeatedInvestigatorId =
        decision.source.split(":")[1];

      if (!defeatedInvestigatorId) {
        throw new Error(
          "A Dark Power defeat decision is missing investigatorId.",
        );
      }

      const defeatedInvestigator =
        finishedGame.investigators[
          defeatedInvestigatorId
        ];

      if (!defeatedInvestigator) {
        throw new Error(
          `Investigator "${defeatedInvestigatorId}" does not exist.`,
        );
      }

      /*
      * Mark the Investigator as defeated.
      */

      let gameAfterDefeat: GameState = {
        ...finishedGame,

        activeInvestigatorId:
          null,

        combatOrder:
          null,

        investigators: {
          ...finishedGame.investigators,

          [defeatedInvestigatorId]: {
            ...defeatedInvestigator,

            isDefeated:
              true,
          },
        },
      };

      /*
      * ----------------------------------------------------------
      * FIND NEXT INVESTIGATOR
      * ----------------------------------------------------------
      */

      let nextInvestigatorIndex =
        resume.currentInvestigatorIndex + 1;

      while (
        nextInvestigatorIndex <
        resume.investigatorIds.length
      ) {
        const nextInvestigatorId =
          resume.investigatorIds[
            nextInvestigatorIndex
          ];

        if (!nextInvestigatorId) {
          nextInvestigatorIndex++;
          continue;
        }

        const nextInvestigator =
          gameAfterDefeat.investigators[
            nextInvestigatorId
          ];

        /*
        * Defeated Investigators cannot resolve
        * A Dark Power encounters.
        */

        if (
          !nextInvestigator ||
          nextInvestigator.isDefeated ||
          !nextInvestigator.spaceId
        ) {
          nextInvestigatorIndex++;
          continue;
        }

        const nextSpace =
          gameAfterDefeat.board.spaces[
            nextInvestigator.spaceId
          ];

        if (!nextSpace) {
          nextInvestigatorIndex++;
          continue;
        }

        /*
        * Only Monsters that still exist on the space
        * can be encountered.
        */

        const nextMonsterIds =
          nextSpace.monsterIds.filter(
            (monsterId) =>
              gameAfterDefeat.monsters[
                monsterId
              ] !== undefined,
          );

        if (
          nextMonsterIds.length === 0
        ) {
          nextInvestigatorIndex++;
          continue;
        }

        const nextResume = {
          type:
            "mythos-dark-power" as const,

          investigatorIds:
            resume.investigatorIds,

          currentInvestigatorIndex:
            nextInvestigatorIndex,

          monsterIds:
            nextMonsterIds,

          resolvedMonsterIds: [],
        };

        /*
        * One Monster:
        * start Combat immediately.
        */

        if (
          nextMonsterIds.length === 1
        ) {
          const nextMonsterId =
            nextMonsterIds[0];

          if (!nextMonsterId) {
            throw new Error(
              "A Dark Power could not determine the next Monster.",
            );
          }

          return {
            game:
              startMonsterCombat(
                {
                  ...gameAfterDefeat,

                  activeInvestigatorId:
                    nextInvestigatorId,

                  pendingDecision:
                    null,

                  combatOrder:
                    null,
                },
                nextMonsterId,
                nextResume,
              ),

            resetEncounterStartedForTurn:
              false,
          };
        }

        /*
        * Multiple Monsters:
        * choose their encounter order.
        */

        gameAfterDefeat = {
          ...gameAfterDefeat,

          activeInvestigatorId:
            nextInvestigatorId,

          combatOrder:
            null,

          pendingDecision: {
            type:
              "combat-order",

            title:
              "A Dark Power — Combat Order",

            message:
              "Choose the order in which you will encounter the Monsters on your space.",

            monsterIds:
              nextMonsterIds,

            orderedMonsterIds: [],

            source:
              "combat-order",

            resume:
              nextResume,
          },
        };

        return {
          game:
            gameAfterDefeat,

          resetEncounterStartedForTurn:
            false,
        };
      }

      /*
      * ----------------------------------------------------------
      * NO MORE INVESTIGATORS
      * ----------------------------------------------------------
      *
      * A Dark Power is completely resolved.
      */

      const currentMythos =
        [
          ...easyMythos,
          ...normalMythos,
          ...hardMythos,
        ].find(
          (mythos) =>
            mythos.id ===
            gameAfterDefeat.currentMythosId,
        );

      if (!currentMythos) {
        throw new Error(
          "A Dark Power could not find the current Mythos card.",
        );
      }

      return {
        game: {
          ...gameAfterDefeat,

          board: {
            ...gameAfterDefeat.board,

            mythosDiscard: [
              ...gameAfterDefeat.board.mythosDiscard,
              currentMythos,
            ],
          },

          currentMythosId:
            null,

          activeInvestigatorId:
            null,

          pendingDecision:
            null,

          combatOrder:
            null,
        },

        resetEncounterStartedForTurn:
          false,
      };
    }

    /*
    * ==========================================================
    * NORMAL COMBAT
    * ==========================================================
    *
    * The Investigator was defeated during normal Combat.
    *
    * The Investigator immediately stops resolving the
    * current Encounter.
    *
    * The replacement Investigator is NOT chosen now.
    * The choice happens at the end of the Mythos Phase.
    */

    const defeatedInvestigatorId =
      decision.source.split(":")[1];

    if (!defeatedInvestigatorId) {
      throw new Error(
        "Investigator defeat decision is missing investigatorId.",
      );
    }

    const defeatedInvestigator =
      finishedGame.investigators[
        defeatedInvestigatorId
      ];

    if (!defeatedInvestigator) {
      throw new Error(
        `Investigator "${defeatedInvestigatorId}" does not exist.`,
      );
    }

    const gameAfterDefeat: GameState = {
      ...finishedGame,

      activeInvestigatorId:
        defeatedInvestigatorId,

      combatOrder:
        null,

      investigators: {
        ...finishedGame.investigators,

        [defeatedInvestigatorId]: {
          ...defeatedInvestigator,

          isDefeated:
            true,
        },
      },

      pendingInvestigatorReplacements:
        finishedGame.pendingInvestigatorReplacements.includes(
          defeatedInvestigatorId,
        )
          ? finishedGame.pendingInvestigatorReplacements
          : [
              ...finishedGame.pendingInvestigatorReplacements,
              defeatedInvestigatorId,
            ],
    };

    const nextGame =
      endInvestigatorEncounter({
        ...gameAfterDefeat,

        pendingDecision:
          null,

        pendingEncounterChoice:
          null,

        currentEncounterId:
          null,

        currentEncounterBackId:
          null,

        currentEncounterRevealed:
          false,

        currentEncounterDeckType:
          null,

        currentEncounterFromFracturedReality:
          false,
      });

    return {
      game: nextGame,

      resetEncounterStartedForTurn:
        false,
    };
  }

  /*
   * ============================================================
   * MONSTER DEFEATED
   * ============================================================
   */

  if (
    decision.type === "continue" &&
    decision.source?.startsWith(
      "combat-defeated:",
    )
  ) {
    const monsterId =
      decision.source.split(":")[1];

    if (!monsterId) {
      throw new Error(
        "Monster defeated decision is missing monsterId.",
      );
    }

    const finishedGame:
      GameState = {
        ...game,

        pendingDecision:
          null,
      };

    /*
     * ==========================================================
     * THE WIND-WALKER
     * ==========================================================
     *
     * If the defeated Monster is the Wind-Walker and the
     * corresponding Rumor is still in play, solve the Rumor.
     */

    const defeatedMonster =
      finishedGame.monsters[
        monsterId
      ];

    /*
     * ==========================================================
     * FINAL MYSTERY — CTHULHU
     * ==========================================================
     *
     * Defeating Cthulhu during his Final Mystery
     * wins the game.
     */

    if (
      defeatedMonster?.definitionId ===
        "cthulhu" &&
      finishedGame.finalMystery?.id ===
        "cthulhu-risen-from-the-sea"
    ) {
      return {
        game: {
          ...finishedGame,

          status: "victory",

          activeInvestigatorId:
            null,

          pendingDecision:
            null,

          pendingEncounterChoice:
            null,

          combatOrder:
            null,
        },

        resetEncounterStartedForTurn:
          false,
      };
    }

    /*
    * ==========================================================
    * FINAL MYSTERY — SHUB-NIGGURATH
    * ==========================================================
    *
    * Defeating Shub-Niggurath during her Final Mystery
    * wins the game.
    */

    if (
      defeatedMonster?.definitionId ===
        "shub-niggurath" &&
      finishedGame.finalMystery?.id ===
        "shub-niggurath-battle-in-the-woods"
    ) {
      return {
        game: {
          ...finishedGame,

          status: "victory",

          activeInvestigatorId:
            null,

          pendingDecision:
            null,

          pendingEncounterChoice:
            null,

          combatOrder:
            null,
        },

        resetEncounterStartedForTurn:
          false,
      };
    }

    const windWalkerRumor =
      [
        ...easyMythos,
        ...normalMythos,
        ...hardMythos,
      ].find(
        (definition) =>
          definition.id ===
          "the-wind-walker",
      );

    const windWalkerInPlay =
      finishedGame.board.mythosInPlay.some(
        (entry) =>
          entry.definitionId ===
          "the-wind-walker",
      );

    if (
      defeatedMonster?.definitionId ===
        "wind-walker" &&
      windWalkerRumor &&
      windWalkerInPlay
    ) {
      const solvedGame =
        solveMythosRumor(
          finishedGame,
          windWalkerRumor,
        );

      /*
       * Continue the normal combat flow using
       * the solved game state.
       */

      const nextGame =
        resolveCombatEncounterEnd(
          solvedGame,
          map,
          monsterId,
        );

      return {
        game: nextGame,
        resetEncounterStartedForTurn:
          false,
      };
    }

    /*
    * ==========================================================
    * WEB BETWEEN WORLDS
    * ==========================================================
    *
    * If the defeated Monster is the Spinner of Webs and the
    * corresponding Rumor is still in play, solve the Rumor.
    */

    const webBetweenWorldsRumor =
      [
        ...easyMythos,
        ...normalMythos,
        ...hardMythos,
      ].find(
        (definition) =>
          definition.id ===
          "web-between-worlds",
      );

    const webBetweenWorldsInPlay =
      finishedGame.board.mythosInPlay.some(
        (entry) =>
          entry.definitionId ===
          "web-between-worlds",
      );

    if (
      defeatedMonster?.definitionId ===
        "spinner-of-webs" &&
      webBetweenWorldsRumor &&
      webBetweenWorldsInPlay
    ) {
      const solvedGame =
        solveMythosRumor(
          finishedGame,
          webBetweenWorldsRumor,
        );

      const nextGame =
        resolveCombatEncounterEnd(
          solvedGame,
          map,
          monsterId,
        );

      return {
        game: nextGame,

        resetEncounterStartedForTurn:
          false,
      };
    }

    /*
    * ==========================================================
    * NORMAL MONSTER RECKONING COMBAT
    * ==========================================================
    *
    * The Investigator was defeated during a Monster Reckoning
    * combat.
    *
    * The Monster that caused the combat is considered resolved
    * and must NOT be resolved again.
    *
    * The normal defeat rules are applied through
    * defeatInvestigator().
    *
    * If the defeated Investigator was the Lead, the Lead selection
    * interrupts the Reckoning. The interrupted Reckoning is stored
    * inside the Lead selection decision and restored by App.tsx
    * after the new Lead is chosen.
    */

    if (
      decision.resume?.type ===
      "monster-reckoning"
    ) {
      const resume =
        decision.resume;

      const defeatedInvestigatorId =
        decision.source.split(":")[1];

      if (!defeatedInvestigatorId) {
        throw new Error(
          "Investigator defeat decision is missing investigatorId.",
        );
      }

      /*
      * ----------------------------------------------------------
      * RESTORE THE MYTHOS RECKONING DECISION
      * ----------------------------------------------------------
      *
      * defeatInvestigator() needs to see the original
      * Mythos Monster Reckoning decision so that, when the
      * Lead is defeated, it can preserve that decision inside
      * select-investigator.resume.pendingDecision.
      *
      * The Monster that caused the combat is immediately marked
      * as resolved here.
      */

      const resolvedMonsterIds = [
        ...resume.resolvedMonsterIds,
        ...(resume.resolvedMonsterIds.includes(
          resume.monsterId,
        )
          ? []
          : [resume.monsterId]),
      ];

      const reckoningGame: GameState = {
        ...game,

        pendingDecision: {
          type:
            "mythos-reckoning-monsters",

          title:
            "MONSTER RECKONING",

          message:
            "Resolve the Reckoning ability of the next Monster.",

          monsterIds:
            resume.monsterIds,

          resolvedMonsterIds,

          source:
            "mythos:reckoning-monsters",

          nextIconIndex:
            resume.nextIconIndex,

          ...(resume.remainingPasses !== undefined
            ? {
                remainingPasses:
                  resume.remainingPasses,
              }
            : {}),
        },
      };

      /*
      * ----------------------------------------------------------
      * APPLY NORMAL DEFEAT RULES
      * ----------------------------------------------------------
      *
      * This applies:
      *
      * - Doom +1
      * - move to nearest City
      * - discard Conditions
      * - mark Investigator defeated
      * - add pending replacement
      * - if Lead: request new Lead immediately
      */

      const gameAfterDefeat =
        defeatInvestigator(
          reckoningGame,
          map,
          defeatedInvestigatorId,
          resume.monsterId,
        );

      /*
      * ----------------------------------------------------------
      * GAME DEFEAT
      * ----------------------------------------------------------
      */

      if (
        gameAfterDefeat.status ===
        "defeat"
      ) {
        return {
          game: gameAfterDefeat,
          resetEncounterStartedForTurn:
            false,
        };
      }

      /*
      * ----------------------------------------------------------
      * LEAD DEFEATED
      * ----------------------------------------------------------
      *
      * defeatInvestigator() already created:
      *
      * select-investigator
      *
      * with the interrupted Monster Reckoning stored in:
      *
      * decision.resume.pendingDecision
      *
      * App.tsx will restore that decision after the new Lead
      * is selected.
      */

      if (
        gameAfterDefeat.pendingDecision?.type ===
          "select-investigator" &&
        gameAfterDefeat.pendingDecision.source ===
          "defeat:lead"
      ) {
        return {
          game: gameAfterDefeat,
          resetEncounterStartedForTurn:
            false,
        };
      }

      /*
      * ----------------------------------------------------------
      * FIND NEXT MONSTER
      * ----------------------------------------------------------
      */

      const nextMonsterId =
        resume.monsterIds.find(
          (id) =>
            !resolvedMonsterIds.includes(id),
        );

      /*
      * ----------------------------------------------------------
      * ALL MONSTERS RESOLVED
      * ----------------------------------------------------------
      */

      if (!nextMonsterId) {
        const gameWithoutDecision:
          GameState = {
            ...gameAfterDefeat,

            pendingDecision:
              null,

            activeInvestigatorId:
              null,
          };

        const remainingPasses =
          resume.remainingPasses ?? 1;

        /*
        * More Monster Reckoning passes remain.
        */

        if (
          remainingPasses > 1
        ) {
          const nextGame =
            startMonsterReckoning(
              gameWithoutDecision,
              map,
              resume.nextIconIndex,
              remainingPasses - 1,
            );

          return {
            game: nextGame,
            resetEncounterStartedForTurn:
              false,
          };
        }

        /*
        * Monster Reckoning is completely finished.
        * Continue with Ancient One Reckoning.
        */

        const nextGame =
          startAncientOneReckoning(
            gameWithoutDecision,
            map,
            resume.nextIconIndex,
          );

        return {
          game: nextGame,
          resetEncounterStartedForTurn:
            false,
        };
      }

      /*
      * ----------------------------------------------------------
      * CONTINUE WITH NEXT MONSTER
      * ----------------------------------------------------------
      *
      * The defeated Investigator was not the Lead, so there is
      * no Lead-selection interruption.
      */

      const gameWithReckoningDecision:
        GameState = {
          ...gameAfterDefeat,

          pendingDecision: {
            type:
              "mythos-reckoning-monsters",

            title:
              "MONSTER RECKONING",

            message:
              "Resolve the Reckoning ability of the next Monster.",

            monsterIds:
              resume.monsterIds,

            resolvedMonsterIds,

            source:
              "mythos:reckoning-monsters",

            nextIconIndex:
              resume.nextIconIndex,

            ...(resume.remainingPasses !== undefined
              ? {
                  remainingPasses:
                    resume.remainingPasses,
                }
              : {}),
          },

          activeInvestigatorId:
            null,
        };

      const nextGame =
        resolveMonsterReckoning(
          gameWithReckoningDecision,
          map,
          nextMonsterId,
        );

      return {
        game: nextGame,
        resetEncounterStartedForTurn:
          false,
      };
    }

    /*
    * ==========================================================
    * EYES EVERYWHERE
    * ==========================================================
    *
    * The Monster was defeated during the Eyes Everywhere
    * ambush.
    *
    * The combat itself is finished, but the Mythos card is
    * NOT finished yet.
    *
    * Continue with the next Investigator.
    */

    if (
      decision.resume?.type ===
      "eyes-everywhere"
    ) {
      const resume =
        decision.resume;

      /*
      * The current Investigator has finished
      * his Eyes Everywhere ambush.
      */
      const nextIndex =
        resume.currentInvestigatorIndex + 1;

      /*
      * ----------------------------------------------------------
      * MORE INVESTIGATORS
      * ----------------------------------------------------------
      */

      if (
        nextIndex <
        resume.investigatorIds.length
      ) {
        const nextInvestigatorId =
          resume.investigatorIds[
            nextIndex
          ];

        if (!nextInvestigatorId) {
          throw new Error(
            "Eyes Everywhere could not determine the next Investigator.",
          );
        }

        const mythos =
          [
            ...easyMythos,
            ...normalMythos,
            ...hardMythos,
          ].find(
            (definition) =>
              definition.id ===
              "eyes-everywhere",
          );

        if (!mythos) {
          throw new Error(
            'Mythos "eyes-everywhere" does not exist.',
          );
        }

        return {
          game:
            startEyesEverywhere(
              {
                ...finishedGame,

                pendingDecision:
                  null,

                activeInvestigatorId:
                  nextInvestigatorId,
              },
              mythos,
              nextIndex,
            ),

          resetEncounterStartedForTurn:
            false,
        };
      }

      /*
      * ----------------------------------------------------------
      * ALL INVESTIGATORS FINISHED
      * ----------------------------------------------------------
      *
      * Only now is Eyes Everywhere discarded.
      */

      const eyesEverywhere =
        [
          ...easyMythos,
          ...normalMythos,
          ...hardMythos,
        ].find(
          (definition) =>
            definition.id ===
            "eyes-everywhere",
        );

      if (!eyesEverywhere) {
        throw new Error(
          'Mythos "eyes-everywhere" does not exist.',
        );
      }

      return {
        game: {
          ...finishedGame,

          board: {
            ...finishedGame.board,

            mythosDiscard: [
              ...finishedGame.board.mythosDiscard,
              eyesEverywhere,
            ],
          },

          currentMythosId:
            null,

          activeInvestigatorId:
            null,

          pendingDecision:
            null,
        },

        resetEncounterStartedForTurn:
          false,
      };
    }

    /*
    * ==========================================================
    * NORMAL COMBAT
    * ==========================================================
    */

    const nextGame =
      resolveCombatEncounterEnd(
        finishedGame,
        map,
        monsterId,
      );

    return {
      game: nextGame,
      resetEncounterStartedForTurn:
        false,
    };
  }

  /*
   * ============================================================
   * NORMAL ENCOUNTER CONTINUE
   * ============================================================
   */

  /*
  * ============================================================
  * ENCOUNTER AFTER ANCIENT ONE AWAKENING
  * ============================================================
  *
  * The Encounter was interrupted because Doom reached 0.
  * The Ancient One Awakening has now been resolved.
  *
  * Continue resolving the remaining Encounter effects.
  */

  if (
    decision.type ===
    "encounter-awakening-resume"
  ) {
    const gameWithoutDecision:
      GameState = {
        ...game,

        pendingDecision:
          null,
      };

    if (
      decision.effects.length === 0
    ) {
      const finishedGame =
        resolveCurrentEncounter(
          gameWithoutDecision,
          map,
        );

      return {
        game: finishedGame,

        resetEncounterStartedForTurn:
          false,
      };
    }

    const resolvedGame =
      resolveEncounterEffects(
        gameWithoutDecision,
        decision.investigatorId,
        decision.effects,
        map,
      );

    /*
    * If resolving the remaining effects created
    * another decision, stop here and wait for it.
    */
    if (
      resolvedGame.pendingDecision ||
      resolvedGame.pendingEncounterChoice
    ) {
      return {
        game: resolvedGame,

        resetEncounterStartedForTurn:
          false,
      };
    }

    /*
    * All remaining Encounter effects have now
    * been resolved.
    *
    * Finish the Encounter normally.
    */
    if (
      resolvedGame.currentEncounterId &&
      resolvedGame.currentEncounterDeckType
    ) {
      const finishedGame =
        resolveCurrentEncounter(
          resolvedGame,
          map,
        );

      return {
        game: finishedGame,

        resetEncounterStartedForTurn:
          false,
      };
    }

    return {
      game: resolvedGame,

      resetEncounterStartedForTurn:
        false,
    };
  }

  /*
  * ============================================================
  * GENERIC PENDING DECISION
  * ============================================================
  *
  * Preserve the original fallback behaviour.
  */

  const resolvedPendingGame  =
    resolvePendingDecision(
      game,
      map,
    );

  return {
    game: resolvedPendingGame ,
    resetEncounterStartedForTurn:
      false,
  };

  /*
   * ============================================================
   * GENERIC PENDING DECISION
   * ============================================================
   *
   * Preserve the original fallback behaviour.
   */

  const updatedGame =
    resolvePendingDecision(
      game,
      map,
    );

  return {
    game: updatedGame,
    resetEncounterStartedForTurn:
      false,
  };
}