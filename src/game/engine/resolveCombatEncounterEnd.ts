import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { startMonsterCombat } from "./startMonsterCombat";
import { startEncounter } from "./startEncounter";
import { endInvestigatorEncounter } from "./endInvestigatorEncounter";

import {
  getMonsterDefeatAbilities,
} from "./monsterAbilities";

import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../content/core/coreEpicMonsters";
import { resolveShubNiggurathReckoning } from "./resolveShubNiggurathReckoning";
import { startAncientOneReckoning } from "./startAncientOneReckoning";
import { resolveMonsterReckoning } from "./resolveMonsterReckoning";
import { easyMythos } from "../../content/core/mythos/easyMythos";
import { normalMythos } from "../../content/core/mythos/normalMythos";
import { hardMythos } from "../../content/core/mythos/hardMythos";
import { solveMythosRumor } from "./solveMythosRumor";
import { startMonsterReckoning } from "./startMonsterReckoning";

export function resolveCombatEncounterEnd(
  game: GameState,
  map: MapDefinition,
  defeatedMonsterId: string,
): GameState {
    /*
   * ==========================================================
   * SHUB-NIGGURATH RECKONING RESUME
   * ==========================================================
   *
   * If this combat was started by the Shub-Niggurath
   * Ancient One Reckoning ability, return to that Reckoning
   * flow instead of continuing the normal Encounter.
   */

  const combatDecision =
    game.pendingDecision;

  const resume =
    combatDecision?.type === "combat"
      ? combatDecision.resume
      : undefined;

  if (
    resume?.type ===
    "shub-niggurath-reckoning"
  ) {
    /*
     * The defeated Monster has already been removed
     * from the board by the combat flow.
     *
     * Continue with the next investigator involved
     * in the Shub-Niggurath Reckoning.
     */

    return resolveShubNiggurathReckoning(
      {
        ...game,
        pendingDecision: null,
        activeInvestigatorId: null,
      },
      map,
      resume.investigatorIds,
      resume.nextInvestigatorIndex + 1,
      resume.nextIconIndex,
      defeatedMonsterId,
      resume.ancientOneAbilityIndex,
      resume.ancientOneId,
      resume.ancientOneReckoningStage,
    );
  }

  /*
   * ==========================================================
   * MONSTER RECKONING RESUME
   * ==========================================================
   *
   * If this combat was started by a Monster Reckoning
   * ability such as the Hound of Tindalos, return to
   * the Monster Reckoning flow.
   */

  if (
    resume?.type ===
    "monster-reckoning"
  ) {
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
     * ----------------------------------------------------------
     * ALL MONSTERS RESOLVED
     * ----------------------------------------------------------
     */

    if (!nextMonsterId) {
      const remainingPasses =
        resume.remainingPasses ?? 1;

      if (remainingPasses > 1) {
        return startMonsterReckoning(
          {
            ...game,

            pendingDecision:
              null,

            activeInvestigatorId:
              null,
          },
          map,
          resume.nextIconIndex,
          remainingPasses - 1,
        );
      }

      return startAncientOneReckoning(
        {
          ...game,

          pendingDecision:
            null,

          activeInvestigatorId:
            null,
        },
        map,
        resume.nextIconIndex,
      );
    }

    /*
     * ----------------------------------------------------------
     * CONTINUE MONSTER RECKONING
     * ----------------------------------------------------------
     */

    const gameWithReckoningDecision:
      GameState = {
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

          remainingPasses:
            resume.remainingPasses ?? 1,
        },

        activeInvestigatorId:
          null,
      };

    return resolveMonsterReckoning(
      gameWithReckoningDecision,
      map,
      nextMonsterId,
    );
  }

  /*
   * ==========================================================
   * A DARK POWER RESUME
   * ==========================================================
   *
   * Each Investigator must immediately encounter every
   * Monster on their space, in the order of their choice.
   *
   * A Monster counts as resolved here whether it was
   * defeated or survived its Combat.
   */

  if (
    resume?.type ===
    "mythos-dark-power"
  ) {
    const resolvedMonsterIds = [
      ...resume.resolvedMonsterIds,
      defeatedMonsterId,
    ];

    /*
     * ----------------------------------------------------------
     * MORE MONSTERS FOR THE SAME INVESTIGATOR
     * ----------------------------------------------------------
     */

    const nextMonsterId =
      resume.monsterIds.find(
        (monsterId) =>
          !resolvedMonsterIds.includes(
            monsterId,
          ),
      );

    if (nextMonsterId) {
      const updatedResume = {
        ...resume,

        resolvedMonsterIds,
      };

      return startMonsterCombat(
        {
          ...game,

          activeInvestigatorId:
            resume.investigatorIds[
              resume.currentInvestigatorIndex
            ],

          pendingDecision:
            null,

          combatOrder:
            null,
        },
        nextMonsterId,
        updatedResume,
      );
    }

    /*
     * ----------------------------------------------------------
     * CURRENT INVESTIGATOR FINISHED
     * ----------------------------------------------------------
     *
     * Find the next Investigator who has Monsters on
     * their current space.
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
        game.investigators[
          nextInvestigatorId
        ];

      if (!nextInvestigator?.spaceId) {
        nextInvestigatorIndex++;
        continue;
      }

      const nextSpace =
        game.board.spaces[
          nextInvestigator.spaceId
        ];

      if (!nextSpace) {
        nextInvestigatorIndex++;
        continue;
      }

      const nextMonsterIds =
        nextSpace.monsterIds.filter(
          (monsterId) =>
            game.monsters[
              monsterId
            ] !== undefined,
        );

      if (
        nextMonsterIds.length > 0
      ) {
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

          return startMonsterCombat(
            {
              ...game,

              activeInvestigatorId:
                nextInvestigatorId,

              pendingDecision:
                null,

              combatOrder:
                null,
            },
            nextMonsterId,
            nextResume,
          );
        }

        /*
         * Multiple Monsters:
         * the Investigator chooses the order.
         */

        return {
          ...game,

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
      }

      nextInvestigatorIndex++;
    }

    /*
     * ----------------------------------------------------------
     * A DARK POWER FINISHED
     * ----------------------------------------------------------
     */

    const currentMythos =
      [
        ...easyMythos,
        ...normalMythos,
        ...hardMythos,
      ].find(
        (mythos) =>
          mythos.id ===
          game.currentMythosId,
      );

    if (!currentMythos) {
      throw new Error(
        "A Dark Power could not find the current Mythos card.",
      );
    }

    return {
      ...game,

      board: {
        ...game.board,

        mythosDiscard: [
          ...game.board.mythosDiscard,
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
    };
  }

  const investigatorId =
    game.activeInvestigatorId;

  if (!investigatorId) {
    throw new Error(
      "There is no active investigator.",
    );
  }

  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    throw new Error(
      `Investigator "${investigatorId}" does not exist.`,
    );
  }

  if (!investigator.spaceId) {
    return endInvestigatorEncounter(
      game,
    );
  }

  const spaceId =
    investigator.spaceId;

  /*
   * ==========================================================
   * FIND MONSTERS STILL ON THE SPACE
   * ==========================================================
   */

  const monstersInSpace =
    Object.values(game.monsters).filter(
      (monster) =>
        monster.spaceId === spaceId,
    );

  /*
   * ==========================================================
   * FIND MONSTERS NOT YET ENCOUNTERED
   * ==========================================================
   *
   * A Monster becomes engaged with the investigator when
   * its Combat Encounter starts.
   *
   * Therefore:
   *
   * engagedInvestigatorId === null
   *
   * means that this Monster has not yet been encountered
   * during the current combat sequence.
   */

  const remainingUnencounteredMonsters =
    monstersInSpace.filter(
      (monster) =>
        monster.engagedInvestigatorId ===
        null,
    );

  /*
   * ==========================================================
   * MORE COMBAT ENCOUNTERS
   * ==========================================================
   *
   * Official rule:
   *
   * If multiple Monsters were present when the Encounter
   * started, ALL of them must be encountered before the
   * investigator can resolve another encounter.
   */

  if (
    remainingUnencounteredMonsters.length > 0
  ) {
    /*
    * If a combat order was chosen, follow that
    * exact order.
    */

    if (game.combatOrder) {
      const nextMonsterId =
        game.combatOrder.find(
          (monsterId) =>
            remainingUnencounteredMonsters.some(
              (monster) =>
                monster.id === monsterId,
            ),
        );

      if (nextMonsterId) {
        return startMonsterCombat(
          game,
          nextMonsterId,
        );
      }
    }

    /*
    * Fallback for combats without a stored order.
    *
    * Non-Epic Monsters must be encountered
    * before Epic Monsters.
    */

    const nextMonster =
      remainingUnencounteredMonsters.find(
        (monster) =>
          !monster.isEpic,
      ) ??
      remainingUnencounteredMonsters[0];

    return startMonsterCombat(
      game,
      nextMonster.id,
    );
  }

  /*
   * ==========================================================
   * NO MORE MONSTERS TO FIGHT
   * ==========================================================
   */

  if (
    monstersInSpace.length > 0
  ) {
    /*
     * At least one Monster survived.
     *
     * There are no more unencountered Monsters,
     * so the Encounter Phase turn ends.
     */

    return endInvestigatorEncounter(
      game,
    );
  }

  /*
   * ==========================================================
   * ALL MONSTERS DEFEATED
   * ==========================================================
   *
   * Normally the investigator may immediately resolve
   * ONE additional encounter.
   */

  const defeatedMonster =
    game.monsters[
      defeatedMonsterId
    ];

  if (!defeatedMonster) {
    return endInvestigatorEncounter(
      game,
    );
  }

  const defeatedDefinition =
    CORE_MONSTERS.find(
      (definition) =>
        definition.id ===
        defeatedMonster.definitionId,
    ) ??
    CORE_EPIC_MONSTERS.find(
      (definition) =>
        definition.id ===
        defeatedMonster.definitionId,
    );

  /*
  * ==========================================================
  * LOST KNOWLEDGE — TICK-TOCK MEN DEFEATED
  * ==========================================================
  *
  * When the Tick-Tock Men are defeated,
  * solve the Lost Knowledge Rumor.
  */

  if (
    defeatedMonster.definitionId ===
      "tick-tock-men" &&
    game.board.mythosInPlay.some(
      (mythos) =>
        mythos.definitionId ===
        "lost-knowledge",
    )
  ) {
    const lostKnowledge =
      [
        ...easyMythos,
        ...normalMythos,
        ...hardMythos,
      ].find(
        (mythos) =>
          mythos.id ===
          "lost-knowledge",
      );

    if (lostKnowledge) {
      game = solveMythosRumor(
        game,
        lostKnowledge,
      );
    }
  }

  /*
   * ==========================================================
   * GUG
   * ==========================================================
   *
   * Gug prevents the additional encounter.
   *
   * We are handling this here temporarily because the
   * additional-encounter flow is being implemented now.
   */

  if (defeatedDefinition) {
    const defeatAbilities =
      getMonsterDefeatAbilities(
        defeatedDefinition,
      );

    const preventsAdditionalEncounter =
      defeatAbilities.some(
        (ability) =>
          ability.type ===
          "defeat-no-additional-encounter",
      );

    if (
      preventsAdditionalEncounter
    ) {
      return endInvestigatorEncounter(
        game,
      );
    }
  }

    /*
    * ==========================================================
    * BYAKHEE
    * ==========================================================
    *
    * After defeating a Byakhee, the investigator may lose
    * 1 Sanity and move 3 spaces instead of resolving
    * an additional encounter.
    */

    if (defeatedDefinition) {
    const defeatAbilities =
        getMonsterDefeatAbilities(
        defeatedDefinition,
        );

    const byakheeAbility =
        defeatAbilities.find(
        (ability) =>
            ability.type ===
            "defeat-move-instead-of-encounter",
        );

    if (byakheeAbility) {
        return {
        ...game,

        pendingDecision: {
            type: "choice",

            title:
            "BYAKHEE DEFEATED",

            message:
            "You may lose 1 Sanity and move up to 3 spaces instead of resolving another encounter.",

            image:
            defeatedDefinition.backImage,

            options: [
            {
                id: "move",
                title:
                "Lose 1 Sanity and Move up to 3 Spaces",
                description:
                "Lose 1 Sanity and move up to 3 spaces instead of resolving another encounter.",
            },
            {
                id: "encounter",
                title:
                "Resolve Another Encounter",
                description:
                "Resolve the additional encounter normally.",
            },
            ],

            source:
            `byakhee-defeat:${defeatedMonsterId}`,
        },
        };
    }
    }

  /*
   * ==========================================================
   * ADDITIONAL ENCOUNTER
   * ==========================================================
   */

  return startEncounter(
    game,
    map,
  );
}