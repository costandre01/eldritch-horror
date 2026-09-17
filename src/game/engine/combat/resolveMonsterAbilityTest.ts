import type { GameState } from "../../models/GameState";
import type { PendingDecision } from "../../models/PendingDecision";
import type { TestResult } from "../../models/TestResult";

import { CORE_MONSTERS } from "../../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../../content/core/coreEpicMonsters";

function getMonsterDefinition(
  game: GameState,
  monsterId: string,
) {
  const monster = game.monsters[monsterId];

  if (!monster) {
    throw new Error(
      `Monster "${monsterId}" does not exist.`,
    );
  }

  const definition =
    CORE_MONSTERS.find(
      (definition) =>
        definition.id === monster.definitionId,
    ) ??
    CORE_EPIC_MONSTERS.find(
      (definition) =>
        definition.id === monster.definitionId,
    );

  if (!definition) {
    throw new Error(
      `Monster definition "${monster.definitionId}" does not exist.`,
    );
  }

  return {
    monster,
    definition,
  };
}

export function resolveMonsterAbilityTest(
  game: GameState,
  testDecision: Extract<
    PendingDecision,
    { type: "test" }
  >,
  diceTest: TestResult,
): GameState {
  const source =
    testDecision.source ?? "";

  const parts =
    source.split(":");

  if (
    parts[0] !== "monster-ability-test"
  ) {
    throw new Error(
      `Invalid monster ability test source: ${source}`,
    );
  }

  const abilityType =
    parts[1];

  const monsterId =
    parts[2];

  if (
    !monsterId
  ) {
    throw new Error(
      `Monster ability test is missing monsterId: ${source}`,
    );
  }

  const {
    monster,
    definition,
  } =
    getMonsterDefinition(
      game,
      monsterId,
    );

  /*
   * ============================================================
   * RIOT — ATTEMPT DISPERSAL
   * ============================================================
   */

  if (
    abilityType ===
    "attempt-disperse"
  ) {
    /*
     * ----------------------------------------------------------
     * PASS
     * ----------------------------------------------------------
     *
     * Riot is defeated.
     */

    if (
      diceTest.passed
    ) {
      const spaceId =
        monster.spaceId;

      let defeatedGame: GameState = {
        ...game,

        monsters: {
          ...game.monsters,

          [monsterId]: {
            ...monster,

            health: 0,

            engagedInvestigatorId:
              null,

            spaceId:
              null,
          },
        },

        lastTest:
          diceTest,

        pendingDecision:
          null,
      };

      /*
       * Remove Riot from the map.
       */

      if (
        spaceId
      ) {
        const space =
          defeatedGame.board.spaces[
            spaceId
          ];

        if (
          space
        ) {
          defeatedGame = {
            ...defeatedGame,

            board: {
              ...defeatedGame.board,

              spaces: {
                ...defeatedGame.board.spaces,

                [spaceId]: {
                  ...space,

                  monsterIds:
                    space.monsterIds.filter(
                      (id) =>
                        id !==
                        monsterId,
                    ),
                },
              },
            },
          };
        }
      }

      /*
       * Show Monster Defeated popup.
       */

      return {
        ...defeatedGame,

        pendingDecision: {
          type: "continue",

          title:
            `${definition.name} DEFEATED`,

          message:
            `${definition.name} has been defeated.`,

          image:
            definition.frontImage,

          source:
            `combat-defeated:${monsterId}`,
        },
      };
    }

    /*
     * ----------------------------------------------------------
     * FAIL
     * ----------------------------------------------------------
     *
     * Return to the normal Combat popup.
     *
     * IMPORTANT:
     *
     * We do NOT start the Strength Test here.
     */

    return {
      ...game,

      lastTest:
        diceTest,

      pendingDecision: {
        type: "combat",

        title:
          `Combat: ${definition.name}`,

        message:
          `You are engaged with ${definition.name}.`,

        image:
          definition.backImage,

        monsterId,

        stage:
          "start",

        source:
          `combat:${monsterId}`,
      },
    };
  }

  throw new Error(
    `Unsupported monster ability test: ${abilityType}`,
  );
}