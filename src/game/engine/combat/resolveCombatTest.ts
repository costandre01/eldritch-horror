import type { GameState } from "../../models/GameState";
import type { PendingDecision } from "../../models/PendingDecision";
import type { TestResult } from "../../models/TestResult";
import type { MonsterDefinition } from "../../models/Monster";

import { CORE_MONSTERS } from "../../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../../content/core/coreEpicMonsters";
import { coreInvestigators } from "../../../content/core/investigators";

import { resolveMonsterTest } from "../resolveMonsterTest";
import { resolveMonsterToughness } from "../resolveMonsterToughness";

import {
  getMonsterHorrorResultAbilities,
  getMonsterStrengthResultAbilities,
  getMonsterDefeatAbilities,
} from "../monsterAbilities";


function getMonsterDefinition(
  game: GameState,
  monsterId: string,
): MonsterDefinition {
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

  return definition;
}


function getInvestigatorName(
  game: GameState,
  investigatorId: string,
): string {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    return "The investigator";
  }

  return (
    coreInvestigators.find(
      (definition) =>
        definition.id === investigator.definitionId,
    )?.name ??
    "The investigator"
  );
}


function removeMonsterFromSpace(
  game: GameState,
  monsterId: string,
  spaceId: string | null,
): GameState {
  if (!spaceId) {
    return game;
  }

  const space =
    game.board.spaces[spaceId];

  if (!space) {
    return game;
  }

  return {
    ...game,

    board: {
      ...game.board,

      spaces: {
        ...game.board.spaces,

        [spaceId]: {
          ...space,

          monsterIds:
            space.monsterIds.filter(
              (id) =>
                id !== monsterId,
            ),
        },
      },
    },
  };
}


function createMonsterDefeatedDecision(
  monsterDefinition: MonsterDefinition,
  monsterId: string,
  resume?: Extract<
    PendingDecision,
    { type: "combat" }
  >["resume"],
): PendingDecision {
  return {
    type: "continue",

    title:
      `${monsterDefinition.name} DEFEATED`,

    message:
      `${monsterDefinition.name} has been defeated.`,

    image:
      monsterDefinition.frontImage,

    source:
      `combat-defeated:${monsterId}`,

    resume,
  };
}


function createInvestigatorDefeatedDecision(
  game: GameState,
  investigatorId: string,
  message?: string,
  resume?: Extract<
    PendingDecision,
    { type: "combat" }
  >["resume"],
): PendingDecision {
  return {
    type: "continue",

    title:
      "INVESTIGATOR DEFEATED",

    message:
      message ??
      `${getInvestigatorName(
        game,
        investigatorId,
      )} has lost all Health or Sanity.`,

    source:
      `combat-defeat:${investigatorId}`,

    resume,
  };
}


export function resolveCombatTest(
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

  const resume =
    testDecision.resume?.type ===
      "mythos-arrests-made"
      ? undefined
      : testDecision.resume;

  if (
    parts[0] !== "combat"
  ) {
    throw new Error(
      `Invalid combat test source: ${source}`,
    );
  }

  const stage =
    parts[1];

  const monsterId =
    parts[2];

  if (
    (stage !== "horror" &&
      stage !== "strength") ||
    !monsterId
  ) {
    throw new Error(
      `Invalid combat test source: ${source}`,
    );
  }

  const monster =
    game.monsters[monsterId];

  if (!monster) {
    throw new Error(
      `Combat monster "${monsterId}" no longer exists.`,
    );
  }

  const investigator =
    game.investigators[
      testDecision.investigatorId
    ];

  if (!investigator) {
    throw new Error(
      `Investigator "${testDecision.investigatorId}" does not exist.`,
    );
  }

  const monsterDefinition =
    getMonsterDefinition(
      game,
      monsterId,
    );

  /*
  * ============================================================
  * HORROR TEST
  * ============================================================
  */

  if (
    stage === "horror"
  ) {
    const horrorTest =
      resolveMonsterTest(
        game,
        monsterDefinition,
        "horror",
      );

    if (!horrorTest) {
      throw new Error(
        `Monster "${monsterDefinition.name}" has no Horror Test.`,
      );
    }

    const sanityLoss =
      Math.max(
        0,
        horrorTest.damage -
          diceTest.successes,
      );

    const newSanity =
      Math.max(
        0,
        investigator.sanity -
          sanityLoss,
      );

    const horrorAbilities =
      getMonsterHorrorResultAbilities(
        monsterDefinition,
      );

    /*
    * ==========================================================
    * BASIC HORROR RESULT
    * ==========================================================
    */

    let newMonsterHealth =
      monster.health;

    /*
    * ==========================================================
    * GHOST
    * ==========================================================
    */

    const ghostAbility =
      horrorAbilities.find(
        (ability) =>
          ability.type ===
          "pass-will-damage-monster-by-test-result",
      );

    if (
      diceTest.passed &&
      ghostAbility?.type ===
        "pass-will-damage-monster-by-test-result"
    ) {
      newMonsterHealth =
        Math.max(
          0,
          monster.health -
            diceTest.successes,
        );
    }

    let combatGame: GameState = {
      ...game,

      investigators: {
        ...game.investigators,

        [investigator.id]: {
          ...investigator,

          sanity:
            newSanity,
        },
      },

      monsters: {
        ...game.monsters,

        [monsterId]: {
          ...monster,

          health:
            newMonsterHealth,
        },
      },

      lastTest:
        diceTest,

      pendingDecision:
        null,
    };

    /*
    * ==========================================================
    * COLOUR OUT OF SPACE
    * ==========================================================
    */

    const colourAbility =
      horrorAbilities.find(
        (ability) =>
          ability.type ===
          "after-will-roll-die-defeat-on-5-6",
      );

    if (
      colourAbility?.type ===
      "after-will-roll-die-defeat-on-5-6"
    ) {
      return {
        ...combatGame,

        pendingDecision: {
          type: "monster-ability",

          title:
            "SPECIAL ABILITY",

          message:
            "After the Will Test, roll 1 die. On a 5 or 6, defeat this Monster.",

          image:
            monsterDefinition.backImage,

          monsterId,

          ability:
            colourAbility,

          source:
            `monster-ability:${monsterId}`,

          resume,
        },
      };
    }

    /*
    * ==========================================================
    * CTHULHU
    * ==========================================================
    */

    const loseSanityToAncientOne =
      horrorAbilities.find(
        (ability) =>
          ability.type ===
          "lose-sanity-to-ancient-one",
      );

    if (
      sanityLoss > 0 &&
      loseSanityToAncientOne?.type ===
        "lose-sanity-to-ancient-one"
    ) {
      combatGame = {
        ...combatGame,

        ancientOne: {
          ...combatGame.ancientOne,

          eldritchTokens:
            combatGame.ancientOne.eldritchTokens +
            sanityLoss,
        },
      };
    }

    /*
    * ==========================================================
    * WITCH
    * ==========================================================
    */

    const gainConditionOnFail =
      horrorAbilities.find(
        (ability) =>
          ability.type ===
          "fail-will-gain-condition",
      );

    if (
      !diceTest.passed &&
      gainConditionOnFail?.type ===
        "fail-will-gain-condition"
    ) {
      const conditionDefinitionId =
        gainConditionOnFail.conditionDefinitionId;

      const conditionDeck =
        combatGame.board.conditionDeck;

      const selectableConditionIds =
        conditionDeck.filter(
          (conditionId) =>
            combatGame.conditions[
              conditionId
            ]?.definitionId ===
            conditionDefinitionId,
        );

      /*
      * If no Condition exists,
      * continue with combat.
      */

      if (
        selectableConditionIds.length > 0
      ) {
        return {
          ...combatGame,

          pendingDecision: {
            type: "select-card",

            title:
              "Choose a Condition",

            message:
              "Gain a Cursed Condition.",

            cardIds: [
              ...conditionDeck,
            ],

            selectableCardIds:
              selectableConditionIds,

            minSelections: 1,

            maxSelections: 1,

            selectedCardIds: [],

            source:
              `monster-ability-gain-condition:${monsterId}:horror`,

            resume,
          },
        };
      }
    }

    /*
    * ==========================================================
    * WARLOCK
    * ==========================================================
    */

    const loseHealthOnFail =
      horrorAbilities.find(
        (ability) =>
          ability.type ===
          "fail-will-lose-health",
      );

    if (
      !diceTest.passed &&
      loseHealthOnFail?.type ===
        "fail-will-lose-health"
    ) {
      const newHealth =
        Math.max(
          0,
          investigator.health -
            loseHealthOnFail.amount,
        );

      combatGame = {
        ...combatGame,

        investigators: {
          ...combatGame.investigators,

          [investigator.id]: {
            ...combatGame.investigators[
              investigator.id
            ],

            health:
              newHealth,
          },
        },
      };

      /*
      * Investigator defeated.
      */

      if (
        newHealth <= 0 ||
        newSanity <= 0
      ) {
        return {
          ...combatGame,

          pendingDecision:
            createInvestigatorDefeatedDecision(
              combatGame,
              investigator.id,
              undefined,
              resume,
            ),
        };
      }

      /*
      * Return to Combat popup.
      */

      return {
        ...combatGame,

        pendingDecision: {
          type: "combat",

          title:
            `Combat: ${monsterDefinition.name}`,

          image:
            monsterDefinition.backImage,

          monsterId,

          stage:
            "horror",

          source:
            `combat:${monsterId}`,

          resume,
        },
      };
    }

    /*
    * ==========================================================
    * VAMPIRE / SPINNER
    * ==========================================================
    */

    const skipStrength =
      horrorAbilities.some(
        (ability) =>
          ability.type ===
          "if-fail-will-skip-strength",
      );

    if (
      !diceTest.passed &&
      skipStrength
    ) {
      return {
        ...combatGame,

        pendingDecision: {
          type: "combat",

          title:
            `Combat: ${monsterDefinition.name}`,

          message:
            "The Horror Test failed. This Monster's ability prevents the Strength Test.",

          image:
            monsterDefinition.frontImage,

          monsterId,

          stage:
            "strength",

          source:
            `combat:${monsterId}`,

          resume,
        },
      };
    }

    /*
    * ==========================================================
    * GHOST DEFEATED
    * ==========================================================
    */

    if (
      newMonsterHealth <= 0 &&
      ghostAbility?.type ===
        "pass-will-damage-monster-by-test-result"
    ) {
      combatGame = {
        ...combatGame,

        monsters: {
          ...combatGame.monsters,

          [monsterId]: {
            ...combatGame.monsters[
              monsterId
            ],

            health:
              0,

            spaceId:
              null,

            engagedInvestigatorId:
              null,
          },
        },

        pendingDecision:
          null,
      };

      combatGame =
        removeMonsterFromSpace(
          combatGame,
          monsterId,
          monster.spaceId,
        );

      if (
        monsterDefinition.epic
      ) {
        combatGame = {
          ...combatGame,

          epicMonstersDefeated:
            combatGame.epicMonstersDefeated.includes(
              monsterDefinition.id,
            )
              ? combatGame.epicMonstersDefeated
              : [
                  ...combatGame.epicMonstersDefeated,
                  monsterDefinition.id,
                ],
        };
      }

      return {
        ...combatGame,

        pendingDecision:
          createMonsterDefeatedDecision(
            monsterDefinition,
            monsterId,
            resume,
          ),
      };
    }

    /*
    * ==========================================================
    * INVESTIGATOR DEFEATED
    * ==========================================================
    */

    if (
      newSanity <= 0
    ) {
      return {
        ...combatGame,

        pendingDecision:
          createInvestigatorDefeatedDecision(
            combatGame,
            investigator.id,
            `${getInvestigatorName(
              combatGame,
              investigator.id,
            )} has lost all Sanity.`,
            resume,
          ),
      };
    }

    /*
    * ==========================================================
    * RETURN TO COMBAT POPUP
    * ==========================================================
    */

    return {
      ...combatGame,

      pendingDecision: {
        type: "combat",

        title:
          `Combat: ${monsterDefinition.name}`,

        message:
          "The Horror Test is complete. Continue with the Strength Test.",

        image:
          monsterDefinition.frontImage,

        monsterId,

        stage:
          "horror",

        source:
          `combat:${monsterId}`,

        resume,
      },
    };
  }

  /*
  * ============================================================
  * STRENGTH TEST
  * ============================================================
  */

  const strengthTest =
    resolveMonsterTest(
      game,
      monsterDefinition,
      "combat",
    );

  if (!strengthTest) {
    throw new Error(
      `Monster "${monsterDefinition.name}" has no Strength Test.`,
    );
  }

  const newMonsterHealth =
    Math.max(
      0,
      monster.health -
        diceTest.successes,
    );

  const healthLoss =
    Math.max(
      0,
      strengthTest.damage -
        diceTest.successes,
    );

  const strengthAbilities =
    getMonsterStrengthResultAbilities(
      monsterDefinition,
    );
  
  /*
  * ==========================================================
  * DISCARD ALLY INSTEAD OF / BECAUSE OF HEALTH LOSS
  * ==========================================================
  *
  * Maniac:
  *   If the Strength Test fails, the investigator may
  *   discard 1 Ally instead of losing Health.
  *
  * Zombie Horde:
  *   If the investigator loses Health from the Strength
  *   Test, discard 1 Ally.
  */

  const maniacDiscardAllyAbility =
    strengthAbilities.find(
      (ability) =>
        ability.type ===
        "fail-strength-discard-ally-instead-of-health",
    );

  const zombieHordeDiscardAllyAbility =
    strengthAbilities.find(
      (ability) =>
        ability.type ===
        "lose-health-from-strength-discard-ally",
    );

  /*
  * ==========================================================
  * MANIAC
  * ==========================================================
  */

  if (
    !diceTest.passed &&
    healthLoss > 0 &&
    maniacDiscardAllyAbility
  ) {
    const allyIds =
      investigator.assetIds.filter(
        (assetId) =>
          game.assets[assetId]?.type ===
          "ally",
      );

    /*
    * If the investigator owns at least one Ally,
    * give them the option to discard one.
    */

    if (
      allyIds.length > 0
    ) {
      return {
        ...game,

        lastTest:
          diceTest,

        pendingDecision: {
          type: "select-card",

          title:
            "DISCARD AN ALLY?",

          message:
            `Discard 1 Ally instead of losing ${healthLoss} Health.`,

          cardIds:
            [...investigator.assetIds],

          selectableCardIds:
            allyIds,

          minSelections:
            1,

          maxSelections:
            1,

          selectedCardIds:
            [],

          source:
            `monster-ability-discard-ally:${monsterId}:${healthLoss}`,

          resume,
        },
      };
    }
  }

  /*
  * ==========================================================
  * ZOMBIE HORDE
  * ==========================================================
  */

  if (
    healthLoss > 0 &&
    zombieHordeDiscardAllyAbility
  ) {
    const allyIds =
      investigator.assetIds.filter(
        (assetId) =>
          game.assets[assetId]?.type ===
          "ally",
      );

    /*
    * If there is an Ally, ask the investigator
    * to discard one.
    *
    * If there is no Ally, normal Health loss
    * continues below.
    */

    if (
      allyIds.length > 0
    ) {
      return {
        ...game,

        lastTest:
          diceTest,

        pendingDecision: {
          type: "select-card",

          title:
            "DISCARD AN ALLY",

          message:
            `Discard 1 Ally because you lost ${healthLoss} Health.`,

          cardIds:
            [...investigator.assetIds],

          selectableCardIds:
            allyIds,

          minSelections:
            1,

          maxSelections:
            1,

          selectedCardIds:
            [],

          source:
            `monster-ability-discard-ally:${monsterId}:${healthLoss}:zombie-horde`,

          resume,
        },
      };
    }
  }

  /*
  * ==========================================================
  * VAMPIRE — RECOVER HEALTH
  * ==========================================================
  */

  const vampireRecoverHealth =
    strengthAbilities.find(
      (ability) =>
        ability.type ===
        "lose-health-from-strength-recover-health",
    );

  let finalMonsterHealth =
    newMonsterHealth;

  if (
    healthLoss > 0 &&
    newMonsterHealth > 0 &&
    vampireRecoverHealth?.type ===
      "lose-health-from-strength-recover-health"
  ) {
    const toughness =
      resolveMonsterToughness(
        game,
        monsterDefinition,
      );

    finalMonsterHealth =
      Math.min(
        toughness,
        newMonsterHealth +
          vampireRecoverHealth.amount,
      );
  }

  /*
  * ==========================================================
  * BASIC STRENGTH RESULT
  * ==========================================================
  */

  let combatGame: GameState = {
    ...game,

    investigators: {
      ...game.investigators,

      [investigator.id]: {
        ...investigator,

        health:
          Math.max(
            0,
            investigator.health -
              healthLoss,
          ),
      },
    },

    monsters: {
      ...game.monsters,

      [monsterId]: {
        ...monster,

        health:
          finalMonsterHealth,

        engagedInvestigatorId:
          newMonsterHealth > 0
            ? investigator.id
            : null,

        spaceId:
          newMonsterHealth > 0
            ? monster.spaceId
            : null,
      },
    },

    lastTest:
      diceTest,

    pendingDecision:
      null,
  };

  /*
  * ==========================================================
  * REMOVE DEFEATED MONSTER FROM SPACE
  * ==========================================================
  */

  if (
    newMonsterHealth <= 0
  ) {
    combatGame =
      removeMonsterFromSpace(
        combatGame,
        monsterId,
        monster.spaceId,
      );
  }

  if (
    newMonsterHealth <= 0 &&
    monsterDefinition.epic
  ) {
    combatGame = {
      ...combatGame,

      epicMonstersDefeated:
        combatGame.epicMonstersDefeated.includes(
          monsterDefinition.id,
        )
          ? combatGame.epicMonstersDefeated
          : [
              ...combatGame.epicMonstersDefeated,
              monsterDefinition.id,
            ],
    };
  }

  /*
  * ==========================================================
  * INVESTIGATOR DEFEATED
  * ==========================================================
  */

  const newHealth =
    combatGame.investigators[
      investigator.id
    ]?.health ?? 0;

  if (
    newHealth <= 0
  ) {
    return {
      ...combatGame,

      pendingDecision:
        createInvestigatorDefeatedDecision(
          combatGame,
          investigator.id,
          `${getInvestigatorName(
            combatGame,
            investigator.id,
          )} has lost all Health.`,
          resume,
        ),
    };
  }

  /*
  * ==========================================================
  * MONSTER — GAIN CONDITION AFTER LOSING HEALTH
  * ==========================================================
  *
  * Example:
  *
  * Ghoul → Paranoia
  */

  const gainConditionAbility =
    strengthAbilities.find(
      (ability) =>
        ability.type ===
          "lose-health-from-strength" &&
        ability.effects.some(
          (effect) =>
            effect.type ===
            "gain-condition",
        ),
    );

  if (
    healthLoss > 0 &&
    gainConditionAbility?.type ===
      "lose-health-from-strength"
  ) {
    const gainConditionEffect =
      gainConditionAbility.effects.find(
        (effect) =>
          effect.type ===
          "gain-condition",
      );

    if (
      gainConditionEffect?.type ===
      "gain-condition"
    ) {
      const conditionDefinitionId =
        gainConditionEffect.conditionDefinitionId;

      const conditionDeck =
        combatGame.board.conditionDeck;

      const selectableConditionIds =
        conditionDeck.filter(
          (conditionId) =>
            combatGame.conditions[
              conditionId
            ]?.definitionId ===
            conditionDefinitionId,
        );

      if (
        selectableConditionIds.length > 0
      ) {
        return {
          ...combatGame,

          pendingDecision: {
            type: "select-card",

            title:
              "Choose a Condition",

            message:
              "Gain a Paranoia Condition.",

            cardIds: [
              ...conditionDeck,
            ],

            selectableCardIds:
              selectableConditionIds,

            minSelections: 1,

            maxSelections: 1,

            selectedCardIds: [],

            source:
              `monster-ability-gain-condition:${monsterId}:strength`,

              resume,
          },
        };
      }
    }
  }

  /*
  * ==========================================================
  * MONSTER DEFEATED
  * ==========================================================
  */

  const defeatAbilities =
    getMonsterDefeatAbilities(
      monsterDefinition,
    );

  const gainAssetOnDefeat =
    defeatAbilities.find(
      (ability) =>
        ability.type === "defeat-gain-asset",
    );

  /*
  * ==========================================================
  * SKELETON — RECOVER SANITY
  * ==========================================================
  */

  const recoverSanityAbility =
    defeatAbilities.find(
      (ability) =>
        ability.type ===
        "defeat-recover-sanity",
    );

  if (
    newMonsterHealth <= 0 &&
    recoverSanityAbility?.type ===
      "defeat-recover-sanity"
  ) {
    const currentInvestigator =
      combatGame.investigators[
        investigator.id
      ];

    if (currentInvestigator) {
      const recoveredSanity =
        Math.min(
          currentInvestigator.maxSanity,
          currentInvestigator.sanity + 1,
        );

      combatGame = {
        ...combatGame,

        investigators: {
          ...combatGame.investigators,

          [investigator.id]: {
            ...currentInvestigator,

            sanity:
              recoveredSanity,
          },
        },
      };
    }
  }

  /*
  * ==========================================================
  * GOAT SPAWN — GAIN CONDITION
  * ==========================================================
  */

  const gainConditionOnDefeat =
    defeatAbilities.find(
      (ability) =>
        ability.type ===
        "defeat-gain-condition",
    );

  if (
    newMonsterHealth <= 0 &&
    gainConditionOnDefeat?.type ===
      "defeat-gain-condition"
  ) {
    const conditionDefinitionId =
      gainConditionOnDefeat.conditionDefinitionId;

    const conditionDeck =
      combatGame.board.conditionDeck;

    const selectableConditionIds =
      conditionDeck.filter(
        (conditionId) =>
          combatGame.conditions[
            conditionId
          ]?.definitionId ===
          conditionDefinitionId,
      );

    /*
    * If the required Condition exists,
    * ask the investigator to choose it.
    */

    if (
      selectableConditionIds.length > 0
    ) {
      return {
        ...combatGame,

        pendingDecision: {
          type: "select-card",

          title:
            "Choose a Condition",

          message:
            "Gain a Dark Pact Condition.",

          cardIds: [
            ...conditionDeck,
          ],

          selectableCardIds:
            selectableConditionIds,

          minSelections: 1,

          maxSelections: 1,

          selectedCardIds: [],

          source:
            `monster-ability-gain-condition:${monsterId}:strength`,

          resume,
        },
      };
    }
  }

  /*
  * ==========================================================
  * MANIAC — GAIN ASSET
  * ==========================================================
  */

  if (
    newMonsterHealth <= 0 &&
    gainAssetOnDefeat?.type ===
      "defeat-gain-asset"
  ) {
    const asset =
      combatGame.board.assetDeck.find(
        (asset) =>
          asset.id ===
          gainAssetOnDefeat.assetDefinitionId,
      );

    if (asset) {
      combatGame = {
        ...combatGame,

        board: {
          ...combatGame.board,

          assetDeck:
            combatGame.board.assetDeck.filter(
              (deckAsset) =>
                deckAsset.id !== asset.id,
            ),
        },

        investigators: {
          ...combatGame.investigators,

          [investigator.id]: {
            ...combatGame.investigators[
              investigator.id
            ],

            assetIds: [
              ...combatGame.investigators[
                investigator.id
              ].assetIds,

              asset.id,
            ],
          },
        },
      };

      return {
        ...combatGame,

        pendingDecision:
          createMonsterDefeatedDecision(
            monsterDefinition,
            monsterId,
            resume,
          ),
      };
    }
  }

  /*
  * ==========================================================
  * MI-GO — GAIN ARTIFACT
  * ==========================================================
  */

  const gainArtifactOnDefeat =
    defeatAbilities.find(
      (ability) =>
        ability.type ===
        "defeat-gain-artifact",
    );

  if (
    newMonsterHealth <= 0 &&
    gainArtifactOnDefeat?.type ===
      "defeat-gain-artifact"
  ) {
    const artifact =
      combatGame.board.artifactDeck[0];

    if (artifact) {
      combatGame = {
        ...combatGame,

        board: {
          ...combatGame.board,

          artifactDeck:
            combatGame.board.artifactDeck.filter(
              (deckArtifact) =>
                deckArtifact.id !== artifact.id,
            ),
        },

        investigators: {
          ...combatGame.investigators,

          [investigator.id]: {
            ...combatGame.investigators[
              investigator.id
            ],

            artifactIds: [
              ...combatGame.investigators[
                investigator.id
              ].artifactIds,

              artifact.id,
            ],
          },
        },
      };

      return {
        ...combatGame,

        pendingDecision:
          createMonsterDefeatedDecision(
            monsterDefinition,
            monsterId,
            resume,
          ),
      };
    }
  }

  /*
  * ==========================================================
  * MONSTER DEFEATED
  * ==========================================================
  */

  if (
    newMonsterHealth <= 0
  ) {
    return {
      ...combatGame,

      pendingDecision:
        createMonsterDefeatedDecision(
          monsterDefinition,
          monsterId,
          resume,
        ),
    };
  }

  /*
  * ==========================================================
  * COMBAT CONTINUES
  * ==========================================================
  */

  return {
    ...combatGame,

    pendingDecision: {
      type: "combat",

      title:
        `Combat: ${monsterDefinition.name}`,

      message:
        "Combat Tests are complete.",

      image:
        monsterDefinition.frontImage,

      monsterId,

      stage:
        "strength",

      source:
        `combat:${monsterId}`,

      resume,
    },
  };
}