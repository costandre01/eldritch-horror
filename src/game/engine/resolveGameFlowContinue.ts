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
import { startArrestsMade } from "./resolveMythosSpecial";

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

    if (
      effects.length > 0
    ) {
      const resolvedGame =
        resolveEncounterEffects(
          gameWithoutDecision,
          investigatorId,
          effects,
          map,
        );

      return {
        game: resolvedGame,
        resetEncounterStartedForTurn:
          false,
      };
    }

    /*
     * ==========================================================
     * NO REMAINING EFFECTS
     * ==========================================================
     *
     * Only now is the Encounter allowed to finish.
     */

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

      const resolvedMonsterIds = [
        ...resume.resolvedMonsterIds,
        resume.monsterId,
      ];

      const nextMonsterId =
        resume.monsterIds.find(
          (id) =>
            !resolvedMonsterIds.includes(id),
        );

      if (!nextMonsterId) {
        return {
          game: {
            ...gameAfterDefeat,
            pendingDecision: null,
            activeInvestigatorId: null,
          },
          resetEncounterStartedForTurn:
            false,
        };
      }

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
    */

    const nextGame =
      endInvestigatorEncounter(
        finishedGame,
      );

    return {
      game: nextGame,

      resetEncounterStartedForTurn:
        true,
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
    * SHUB-NIGGURATH RECKONING COMBAT
    * ==========================================================
    */

    if (
      decision.resume?.type ===
      "shub-niggurath-reckoning"
    ) {
      const resume =
        decision.resume;

      const nextGame =
        resolveShubNiggurathReckoning(
          finishedGame,
          map,
          resume.investigatorIds,
          resume.nextInvestigatorIndex + 1,
          resume.nextIconIndex,
          monsterId,
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
    * The Monster was defeated during a Monster Reckoning
    * combat. Continue with the next Monster in the snapshot.
    */

    if (
      decision.resume?.type ===
      "monster-reckoning"
    ) {
      const resume =
        decision.resume;

      const resolvedMonsterIds = [
        ...resume.resolvedMonsterIds,
        resume.monsterId,
      ];

      const nextMonsterId =
        resume.monsterIds.find(
          (id) =>
            !resolvedMonsterIds.includes(id),
        );

      /*
       * --------------------------------------------------------
       * ALL MONSTERS RESOLVED
       * --------------------------------------------------------
       */

      if (!nextMonsterId) {
        const nextGame =
          startAncientOneReckoning(
            {
              ...finishedGame,

              pendingDecision:
                null,

              activeInvestigatorId:
                null,
            },
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
       * --------------------------------------------------------
       * CONTINUE WITH NEXT MONSTER
       * --------------------------------------------------------
       */

      const gameWithReckoningDecision:
        GameState = {
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

  if (
    decision.type === "continue" &&
    decision.source?.startsWith(
      "encounter:",
    )
  ) {
    const resolvedGame =
      resolveCurrentEncounter(
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