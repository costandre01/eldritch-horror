import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { discardAsset } from "./discardAsset";
import { discardCondition } from "./discardCondition";
import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../content/core/coreEpicMonsters";
import { resolveEncounterEffects } from "./resolveEncounterEffects";
import {
  resumeSilverTwilightAid,
  startArrestsMade,
  startBurdenOfGreed,
  startTreacherousMagic,
  startUnexpectedBetrayal,
} from "./resolveMythosSpecial";
import { gainCondition, gainConditionByCategory } from "./gainCondition";
import { endInvestigatorEncounter } from "./endInvestigatorEncounter";

export type CardSelectionResult =
  | {
      type: "state";
      game: GameState;
    }
  | {
      type: "select";
      game: GameState;
    }
  | {
      type: "ignore";
      game: GameState;
    };

export function resolveCardSelection(
  game: GameState,
  cardId: string,
  map: MapDefinition,
): CardSelectionResult {
  const decision =
    game.pendingDecision;

  if (
    !decision ||
    decision.type !== "select-card"
  ) {
    return {
      type: "ignore",
      game,
    };
  }

  const selectedCardIds =
    decision.selectedCardIds ?? [];

  /*
   * ============================================================
   * FINISH SELECTION
   * ============================================================
   */

  if (
    cardId ===
    "__FINISH_SELECTION__"
  ) {
    if (
      selectedCardIds.length <
      decision.minSelections
    ) {
      return {
        type: "ignore",
        game,
      };
    }

    const investigatorId =
      decision.investigatorId ??
      game.activeInvestigatorId;

    if (!investigatorId) {
      return {
        type: "ignore",
        game,
      };
    }

    const investigator =
      game.investigators[
        investigatorId
      ];

    if (!investigator) {
      return {
        type: "ignore",
        game,
      };
    }

    const source =
      decision.source ?? "";

    let currentGame =
      game;

    /*
     * ==========================================================
     * MONSTER ABILITY — GAIN CONDITION
     * ==========================================================
     */

    if (
      source.startsWith(
        "monster-ability-gain-condition:",
      )
    ) {
      const selectedConditions =
        selectedCardIds.filter(
          (id) =>
            currentGame.board.conditionDeck.includes(
              id,
            ) &&
            currentGame.conditions[
              id
            ] !== undefined,
        );

      if (
        selectedConditions.length !==
        1
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      const conditionDeck =
        currentGame.board.conditionDeck.filter(
          (id) =>
            !selectedConditions.includes(
              id,
            ),
        );

      currentGame = {
        ...currentGame,

        board: {
          ...currentGame.board,

          conditionDeck,
        },

        investigators: {
          ...currentGame.investigators,

          [investigatorId]: {
            ...investigator,

            conditionIds: [
              ...investigator.conditionIds,
              ...selectedConditions,
            ],
          },
        },

        pendingDecision:
          null,
      };

      /*
       * Voltar ao Combat popup.
       */

      const sourceParts =
        source.split(":");

      const monsterId =
        sourceParts[1];

      const returnStage =
        sourceParts[2] === "strength"
          ? "strength"
          : "horror";

      if (!monsterId) {
        return {
          type: "state",
          game: currentGame,
        };
      }

      const monster =
        currentGame.monsters[
          monsterId
        ];

      if (!monster) {
        return {
          type: "state",
          game: currentGame,
        };
      }

      const monsterDefinition =
        CORE_MONSTERS.find(
          (definition) =>
            definition.id ===
            monster.definitionId,
        ) ??
        CORE_EPIC_MONSTERS.find(
          (definition) =>
            definition.id ===
            monster.definitionId,
        );

      if (!monsterDefinition) {
        return {
          type: "state",
          game: currentGame,
        };
      }

      currentGame = {
        ...currentGame,

        pendingDecision: {
          type: "combat",

          title:
            `Combat: ${monsterDefinition.name}`,

          image:
            monsterDefinition.backImage,

          monsterId,

          stage:
            returnStage,

          source:
            `combat:${monsterId}`,

          resume:
            decision.resume?.type ===
                "mythos-arrests-made" ||
            decision.resume?.type ===
                "mythos-patrolling-the-border"
              ? undefined
              : decision.resume,
        },
      };

      return {
        type: "state",
        game: currentGame,
      };
    }

    /*
     * ==========================================================
     * GAIN CONDITION
     * ==========================================================
     */

    if (
      source.startsWith(
        "gain-condition:",
      )
    ) {
      const selectedConditions =
        selectedCardIds.filter(
          (id) =>
            currentGame.board.conditionDeck.includes(
              id,
            ) &&
            currentGame.conditions[
              id
            ] !== undefined,
        );

      if (
        selectedConditions.length ===
        0
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      const conditionDeck =
        currentGame.board.conditionDeck.filter(
          (id) =>
            !selectedConditions.includes(
              id,
            ),
        );

      currentGame = {
        ...currentGame,

        board: {
          ...currentGame.board,

          conditionDeck,
        },

        investigators: {
          ...currentGame.investigators,

          [investigatorId]: {
            ...investigator,

            conditionIds: [
              ...investigator.conditionIds,
              ...selectedConditions,
            ],
          },
        },

        pendingDecision:
          null,
      };
    }

    /*
    * ==========================================================
    * SILVER TWILIGHT AID — GAIN SPELL
    * ==========================================================
    */

    else if (
      source.startsWith(
        "mythos:silver-twilight-aid:spell:",
      )
    ) {
      const selectedSpells =
        selectedCardIds.filter(
          (id) =>
            currentGame.board.spellDeck.some(
              (spell) =>
                spell.id === id,
            ) &&
            currentGame.spells[
              id
            ] !== undefined,
        );

      if (
        selectedSpells.length !== 1
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      const spellDeck =
        currentGame.board.spellDeck.filter(
          (spell) =>
            !selectedSpells.includes(
              spell.id,
            ),
        );

      currentGame = {
        ...currentGame,

        board: {
          ...currentGame.board,

          spellDeck,
        },

        investigators: {
          ...currentGame.investigators,

          [investigatorId]: {
            ...investigator,

            spellIds: [
              ...investigator.spellIds,
              ...selectedSpells,
            ],
          },
        },

        pendingDecision: null,
      };

      const sourceParts =
        source.split(":");

      const currentIndex =
        Number(
          sourceParts[3] ?? "0",
        );

      return {
        type: "state",

        game:
          resumeSilverTwilightAid(
            currentGame,
            map,
            currentIndex + 1,
          ),
      };
    }

    /*
     * ==========================================================
     * GAIN SPELL
     * ==========================================================
     */

    else if (
      source.startsWith(
        "gain-spell",
      )
    ) {
      const selectedSpells =
        selectedCardIds.filter(
          (id) =>
            currentGame.board.spellDeck.some(
              (spell) =>
                spell.id === id,
            ) &&
            currentGame.spells[
              id
            ] !== undefined,
        );

      if (
        selectedSpells.length ===
        0
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      const spellDeck =
        currentGame.board.spellDeck.filter(
          (spell) =>
            !selectedSpells.includes(
              spell.id,
            ),
        );

      currentGame = {
        ...currentGame,

        board: {
          ...currentGame.board,

          spellDeck,
        },

        investigators: {
          ...currentGame.investigators,

          [investigatorId]: {
            ...investigator,

            spellIds: [
              ...investigator.spellIds,
              ...selectedSpells,
            ],
          },
        },

        pendingDecision:
          null,
      };
    }

    /*
     * ==========================================================
     * GAIN ITEM FROM RESERVE
     * ==========================================================
     */

    else if (
      source ===
      "gain-item-from-reserve"
    ) {
      const selectedReserveAssets =
        selectedCardIds.filter(
          (id) =>
            currentGame.board.assetReserve.some(
              (asset) =>
                asset.id === id &&
                (
                  asset.type ===
                    "item" ||
                  asset.type ===
                    "trinket"
                ),
            ),
        );

      if (
        selectedReserveAssets.length !==
        1
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      const selectedAssetId =
        selectedReserveAssets[0];

      if (!selectedAssetId) {
        return {
          type: "ignore",
          game,
        };
      }

      const selectedAsset =
        currentGame.board.assetReserve.find(
          (asset) =>
            asset.id ===
            selectedAssetId,
        );

      if (!selectedAsset) {
        return {
          type: "ignore",
          game,
        };
      }

      const assetReserve =
        currentGame.board.assetReserve.filter(
          (asset) =>
            asset.id !==
            selectedAssetId,
        );

      const assetDeck = [
        ...currentGame.board.assetDeck,
      ];

      const drivenToBankruptcyInPlay =
        currentGame.board.mythosInPlay.some(
          (entry) =>
            entry.definitionId ===
            "driven-to-bankruptcy",
        );

      if (!drivenToBankruptcyInPlay) {
        while (
          assetReserve.length < 4 &&
          assetDeck.length > 0
        ) {
          const randomIndex =
            Math.floor(
              Math.random() *
                assetDeck.length,
            );

          const nextAsset =
            assetDeck.splice(
              randomIndex,
              1,
            )[0];

          if (!nextAsset) {
            break;
          }

          assetReserve.push(
            nextAsset,
          );
        }
      }

      currentGame = {
        ...currentGame,

        investigators: {
          ...currentGame.investigators,

          [investigatorId]: {
            ...investigator,

            assetIds: [
              ...investigator.assetIds,
              selectedAssetId,
            ],
          },
        },

        board: {
          ...currentGame.board,

          assetDeck,

          assetReserve,
        },

        pendingDecision:
          null,
      };
    }

    /*
     * ==========================================================
     * GAIN SERVICE FROM RESERVE
     * ==========================================================
     */

    else if (
      source ===
      "gain-service-from-reserve"
    ) {
      const selectedServiceAssets =
        selectedCardIds.filter(
          (id) =>
            currentGame.board.assetReserve.some(
              (asset) =>
                asset.id === id &&
                asset.type ===
                  "service",
            ),
        );

      if (
        selectedServiceAssets.length !==
        1
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      const selectedAssetId =
        selectedServiceAssets[0];

      if (!selectedAssetId) {
        return {
          type: "ignore",
          game,
        };
      }

      const selectedAsset =
        currentGame.board.assetReserve.find(
          (asset) =>
            asset.id ===
              selectedAssetId &&
            asset.type ===
              "service",
        );

      if (!selectedAsset) {
        return {
          type: "ignore",
          game,
        };
      }

      const assetReserve =
        currentGame.board.assetReserve.filter(
          (asset) =>
            asset.id !==
            selectedAssetId,
        );

      const assetDeck = [
        ...currentGame.board.assetDeck,
      ];

      const drivenToBankruptcyInPlay =
        currentGame.board.mythosInPlay.some(
          (entry) =>
            entry.definitionId ===
            "driven-to-bankruptcy",
        );

      if (!drivenToBankruptcyInPlay) {
        while (
          assetReserve.length < 4 &&
          assetDeck.length > 0
        ) {
          const randomIndex =
            Math.floor(
              Math.random() *
                assetDeck.length,
            );

          const nextAsset =
            assetDeck.splice(
              randomIndex,
              1,
            )[0];

          if (!nextAsset) {
            break;
          }

          assetReserve.push(
            nextAsset,
          );
        }
      }

      currentGame = {
        ...currentGame,

        investigators: {
          ...currentGame.investigators,

          [investigatorId]: {
            ...investigator,

            assetIds: [
              ...investigator.assetIds,
              selectedAssetId,
            ],
          },
        },

        board: {
          ...currentGame.board,

          assetDeck,

          assetReserve,
        },

        pendingDecision:
          null,
      };
    }

    /*
     * ==========================================================
     * MONSTER ABILITY — DISCARD ALLY
     * ==========================================================
     *
     * Maniac:
     *   Discard Ally instead of Health loss.
     *
     * Zombie Horde:
     *   Discard Ally after Health loss.
     */

    else if (
      source.startsWith(
        "monster-ability-discard-ally:",
      )
    ) {
      /*
       * Must select exactly one Ally.
       */

      if (
        selectedCardIds.length !==
        1
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      const selectedAssetId =
        selectedCardIds[0];

      if (!selectedAssetId) {
        return {
          type: "ignore",
          game,
        };
      }

      /*
       * Verify ownership.
       */

      if (
        !investigator.assetIds.includes(
          selectedAssetId,
        )
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      const selectedAsset =
        currentGame.assets[
          selectedAssetId
        ];

      /*
       * Verify Ally.
       */

      if (
        !selectedAsset ||
        selectedAsset.type !==
          "ally"
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      /*
       * Discard Ally.
       */

      currentGame =
        discardAsset(
          currentGame,
          selectedAssetId,
        );

      /*
       * Source:
       *
       * monster-ability-discard-ally:
       * monsterId:
       * healthLoss:
       * variant
       */

      const sourceParts =
        source.split(":");

      const monsterId =
        sourceParts[1];

      const healthLoss =
        Number(
          sourceParts[2] ?? "0",
        );

      const variant =
        sourceParts[3] ??
        "maniac";

      /*
       * Validate Monster.
       */

      if (!monsterId) {
        return {
          type: "state",
          game: {
            ...currentGame,

            pendingDecision:
              null,
          },
        };
      }

      const monster =
        currentGame.monsters[
          monsterId
        ];

      if (!monster) {
        return {
          type: "state",
          game: {
            ...currentGame,

            pendingDecision:
              null,
          },
        };
      }

      const monsterDefinition =
        CORE_MONSTERS.find(
          (definition) =>
            definition.id ===
            monster.definitionId,
        ) ??
        CORE_EPIC_MONSTERS.find(
          (definition) =>
            definition.id ===
            monster.definitionId,
        );

      if (!monsterDefinition) {
        return {
          type: "state",
          game: {
            ...currentGame,

            pendingDecision:
              null,
          },
        };
      }

      /*
       * ========================================================
       * ZOMBIE HORDE
       * ========================================================
       *
       * Zombie Horde keeps the Health loss.
       *
       * The Health loss was already calculated by
       * resolveCombatTest(), but was not yet applied
       * because the Ally selection was pending.
       */

      if (
        variant ===
        "zombie-horde"
      ) {
        const currentInvestigator =
          currentGame.investigators[
            investigatorId
          ];

        if (
          !currentInvestigator
        ) {
          return {
            type: "state",
            game: currentGame,
          };
        }

        const newHealth =
          Math.max(
            0,
            currentInvestigator.health -
              healthLoss,
          );

        currentGame = {
          ...currentGame,

          investigators: {
            ...currentGame.investigators,

            [investigatorId]: {
              ...currentInvestigator,

              health:
                newHealth,
            },
          },

          pendingDecision:
            null,
        };

        /*
         * Investigator defeated.
         */

        if (
          newHealth <= 0
        ) {
          return {
            type: "state",

            game: {
              ...currentGame,

              pendingDecision: {
                type: "continue",

                title:
                  "INVESTIGATOR DEFEATED",

                message:
                  "The investigator has lost all Health.",

                source:
                  `combat-defeat:${investigatorId}`,

                resume: decision.resume,
              },
            },
          };
        }
      }

      /*
       * ========================================================
       * MANIAC
       * ========================================================
       *
       * Maniac replaces the Health loss.
       *
       * Therefore the investigator's Health remains
       * unchanged.
       */

      currentGame = {
        ...currentGame,

        pendingDecision: {
          type: "combat",

          title:
            `Combat: ${monsterDefinition.name}`,

          message:
            variant ===
            "zombie-horde"
              ? "The Ally was discarded."
              : "The Ally was discarded instead of losing Health.",

          image:
            monsterDefinition.frontImage,

          monsterId,

          stage:
            "strength",

          source:
            `combat:${monsterId}`,

          resume:
            decision.resume?.type ===
                "mythos-arrests-made" ||
            decision.resume?.type ===
                "mythos-patrolling-the-border"
              ? undefined
              : decision.resume,
        },
      };

      return {
        type: "state",
        game: currentGame,
      };
    }

    else if (
      source.startsWith(
        "mythos:unexpected-betrayal:",
      )
    ) {
        if (
            selectedCardIds.length !== 1
        ) {
            return {
                type: "ignore",
                game,
            };
        }

        const selectedAssetId =
            selectedCardIds[0];

        if (!selectedAssetId) {
            return {
                type: "ignore",
                game,
            };
        }

        const selectedAsset =
            currentGame.assets[
                selectedAssetId
            ];

        if (
            !selectedAsset ||
            selectedAsset.type !== "ally" ||
            !investigator.assetIds.includes(
                selectedAssetId,
            )
        ) {
            return {
                type: "ignore",
                game,
            };
        }

        /*
        * Descarta o Ally escolhido.
        */

        currentGame =
            discardAsset(
                currentGame,
                selectedAssetId,
            );

        /*
        * Recupera o índice do Investigator
        * que acabou de ser tratado.
        */

        const parts =
            source.split(":");

        const investigatorIndex =
            Number(
                parts[
                    parts.length - 1
                ],
            );

        if (
            !Number.isInteger(
                investigatorIndex,
            )
        ) {
            return {
                type: "ignore",
                game,
            };
        }

        /*
        * Continua com o próximo Investigator
        * que tenha Ally.
        */

        currentGame =
            startUnexpectedBetrayal(
                currentGame,
                investigatorIndex + 1,
            );

        return {
            type: "state",
            game: currentGame,
        };
    }

    /*
     * ==========================================================
     * DISCARD ALLY
     * ==========================================================
     */

    else if (
      source ===
      "discard-ally"
    ) {
      if (
        selectedCardIds.length !==
        1
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      const selectedAssetId =
        selectedCardIds[0];

      if (!selectedAssetId) {
        return {
          type: "ignore",
          game,
        };
      }

      const selectedAsset =
        currentGame.assets[
          selectedAssetId
        ];

      if (
        !selectedAsset ||
        selectedAsset.type !==
          "ally" ||
        !investigator.assetIds.includes(
          selectedAssetId,
        )
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      currentGame =
        discardAsset(
          currentGame,
          selectedAssetId,
        );

      currentGame = {
        ...currentGame,

        pendingDecision:
          null,
      };
    }

    /*
     * ==========================================================
     * DISCARD CONDITION
     * ==========================================================
     */

    else if (
      source ===
      "discard-condition"
    ) {
      if (
        selectedCardIds.length !==
        1
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      const selectedConditionId =
        selectedCardIds[0];

      if (!selectedConditionId) {
        return {
          type: "ignore",
          game,
        };
      }

      if (
        !investigator.conditionIds.includes(
          selectedConditionId,
        )
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      const selectedCondition =
        currentGame.conditions[
          selectedConditionId
        ];

      if (!selectedCondition) {
        return {
          type: "ignore",
          game,
        };
      }

      if (
        selectedCondition.definitionId !==
          "condition-cursed" &&
        selectedCondition.definitionId !==
          "condition-dark-pact"
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      currentGame =
        discardCondition(
          currentGame,
          investigatorId,
          selectedConditionId,
        );

      currentGame = {
        ...currentGame,

        pendingDecision:
          null,
      };
    }

    /*
     * ==========================================================
     * DISCARD SPELL
     * ==========================================================
     */

    else if (
      source ===
      "discard-spell"
    ) {
      if (
        selectedCardIds.length !==
        1
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      const selectedSpellId =
        selectedCardIds[0];

      if (!selectedSpellId) {
        return {
          type: "ignore",
          game,
        };
      }

      if (
        !investigator.spellIds.includes(
          selectedSpellId,
        )
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      const selectedSpell =
        currentGame.spells[
          selectedSpellId
        ];

      if (!selectedSpell) {
        return {
          type: "ignore",
          game,
        };
      }

      currentGame = {
        ...currentGame,

        investigators: {
          ...currentGame.investigators,

          [investigatorId]: {
            ...investigator,

            spellIds:
              investigator.spellIds.filter(
                (id) =>
                  id !==
                  selectedSpellId,
              ),
          },
        },

        board: {
          ...currentGame.board,

          spellDiscard: [
            ...currentGame.board
              .spellDiscard,

            selectedSpell,
          ],
        },

        pendingDecision:
          null,
      };
    }

    /*
    * ============================================================
    * MYTHOS — ARRESTS MADE IN MURDER CASE!
    * DISCARD WEAPON
    * ============================================================
    */

    else if (
      source.startsWith(
        "mythos:arrests-made:weapon:",
      )
    ) {
      /*
      * Must select exactly 1 Weapon.
      */

      if (
        selectedCardIds.length !== 1
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      const selectedAssetId =
        selectedCardIds[0];

      if (!selectedAssetId) {
        return {
          type: "ignore",
          game,
        };
      }

      const selectedAsset =
        currentGame.assets[
          selectedAssetId
        ];

      /*
      * Verify that the selected Asset
      * is a Weapon owned by this Investigator.
      */

      if (
        !selectedAsset ||
        !selectedAsset.traits.includes(
          "weapon",
        ) ||
        !investigator.assetIds.includes(
          selectedAssetId,
        )
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      /*
      * Discard the selected Weapon.
      */

      currentGame =
        discardAsset(
          currentGame,
          selectedAssetId,
        );

      /*
      * Gain Detained.
      */

      currentGame =
        gainCondition(
          currentGame,
          investigatorId,
          "condition-detained",
        );

      /*
      * Continue with the original
      * list of eligible Investigators.
      */

      const resume =
        decision.resume;

      if (
        !resume ||
        resume.type !==
          "mythos-arrests-made"
      ) {
        throw new Error(
          "Arrests Made Weapon selection is missing its resume.",
        );
      }

      currentGame =
        startArrestsMade(
          {
            ...currentGame,

            pendingDecision:
              null,
          },
          map,
          resume.investigatorIds,
          resume.currentInvestigatorIndex + 1,
        );
    }

    /*
    * ==========================================================
    * MYTHOS — BURDEN OF GREED
    * Discard any number of Item possessions,
    * then lose 1 Health for each Item possession remaining.
    * ==========================================================
    */

    else if (
      source.startsWith(
        "mythos:burden-of-greed:",
      )
    ) {
      /*
      * All selected cards must still be valid
      * Item possessions owned by this Investigator.
      */

      const selectedItems =
        selectedCardIds.filter(
          (id) => {
            const asset =
              currentGame.assets[id];

            return (
              asset !== undefined &&
              (
                asset.type === "item" ||
                asset.type === "trinket"
              ) &&
              investigator.assetIds.includes(
                id,
              )
            );
          },
        );

      /*
      * The selection must contain only valid
      * Item possessions.
      */

      if (
        selectedItems.length !==
        selectedCardIds.length
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      /*
      * Discard every selected Item.
      */

      for (
        const assetId of selectedItems
      ) {
        currentGame =
          discardAsset(
            currentGame,
            assetId,
          );
      }

      /*
      * Re-read the Investigator because
      * discardAsset() changed the state.
      */

      const currentInvestigator =
        currentGame.investigators[
          investigatorId
        ];

      if (!currentInvestigator) {
        return {
          type: "ignore",
          game,
        };
      }

      /*
      * Count the Item possessions that remain.
      */

      const remainingItemCount =
        currentInvestigator.assetIds.filter(
          (id) => {
            const asset =
              currentGame.assets[id];

            return (
              asset !== undefined &&
              (
                asset.type === "item" ||
                asset.type === "trinket"
              )
            );
          },
        ).length;

      /*
      * Clear the selection before applying
      * the Health loss.
      */

      currentGame = {
        ...currentGame,
        pendingDecision: null,
      };

      /*
      * Lose 1 Health for each Item remaining.
      *
      * Use the existing Encounter Effect system so
      * Health loss and Investigator Defeat follow
      * the same rules as everywhere else.
      */

      if (
        remainingItemCount > 0
      ) {
        currentGame =
          resolveEncounterEffects(
            currentGame,
            investigatorId,
            [
              {
                type: "lose-health",
                amount:
                  remainingItemCount,
              },
            ],
            map,
          );
      }

      /*
      * Continue with the next Investigator.
      */

      const sourceParts =
        source.split(":");

      const currentIndex =
        Number(
          sourceParts[3] ?? "0",
        );

      return {
        type: "state",
        game:
          startBurdenOfGreed(
            currentGame,
            currentIndex + 1,
          ),
      };
    }

    /*
    * ==========================================================
    * MYTHOS — TREACHEROUS MAGIC
    * Discard any number of Spells,
    * then lose 1 Sanity for each Spell remaining.
    *
    * If the Investigator lost Sanity from this effect,
    * he gains 1 Madness Condition.
    * ==========================================================
    */

    else if (
      source.startsWith(
        "mythos:treacherous-magic:",
      )
    ) {
      /*
      * Every selected card must be a Spell
      * owned by this Investigator.
      */

      const selectedSpells =
        selectedCardIds.filter(
          (spellId) =>
            investigator.spellIds.includes(
              spellId,
            ) &&
            currentGame.spells[
              spellId
            ] !== undefined,
        );

      /*
      * Reject the selection if any selected
      * card is not a valid Spell.
      */

      if (
        selectedSpells.length !==
        selectedCardIds.length
      ) {
        return {
          type: "ignore",
          game,
        };
      }

      /*
      * Discard every selected Spell.
      */

      for (
        const spellId of selectedSpells
      ) {
        const spell =
          currentGame.spells[
            spellId
          ];

        if (!spell) {
          continue;
        }

        currentGame = {
          ...currentGame,

          investigators: {
            ...currentGame.investigators,

            [investigatorId]: {
              ...currentGame.investigators[
                investigatorId
              ],

              spellIds:
                currentGame.investigators[
                  investigatorId
                ].spellIds.filter(
                  (id) =>
                    id !== spellId,
                ),
            },
          },

          board: {
            ...currentGame.board,

            spellDiscard: [
              ...currentGame.board
                .spellDiscard,

              spell,
            ],
          },
        };
      }

      /*
      * Re-read the Investigator after
      * discarding the selected Spells.
      */

      const currentInvestigator =
        currentGame.investigators[
          investigatorId
        ];

      if (!currentInvestigator) {
        return {
          type: "ignore",
          game,
        };
      }

      /*
      * Count the Spells that remain.
      */

      const remainingSpellCount =
        currentInvestigator.spellIds.filter(
          (spellId) =>
            currentGame.spells[
              spellId
            ] !== undefined,
        ).length;

      /*
      * The selection is finished.
      */

      currentGame = {
        ...currentGame,

        pendingDecision: null,
      };

      /*
      * The Investigator loses 1 Sanity
      * for each Spell remaining.
      *
      * If at least one Spell remains,
      * he lost Sanity and therefore gains
      * a Madness Condition.
      */

      if (
        remainingSpellCount > 0
      ) {
        currentGame =
          resolveEncounterEffects(
            currentGame,
            investigatorId,
            [
              {
                type: "lose-sanity",

                amount:
                  remainingSpellCount,
              },
            ],
            map,
          );

        currentGame =
          gainConditionByCategory(
              currentGame,
              investigatorId,
              "madness",
          );
      }

      /*
      * Continue with the next Investigator.
      */

      const sourceParts =
        source.split(":");

      const currentIndex =
        Number(
          sourceParts[3] ?? "0",
        );

      return {
        type: "state",

        game:
          startTreacherousMagic(
            currentGame,
            currentIndex + 1,
          ),
      };
    }

    /*
     * ==========================================================
     * UNKNOWN SOURCE
     * ==========================================================
     */

    else {
      console.error(
        `Unknown select-card source "${source}".`,
      );

      return {
        type: "ignore",
        game,
      };
    }

    /*
    * ==========================================================
    * CONTINUE ENCOUNTER EFFECTS
    * ==========================================================
    */

    if (
      decision.onComplete &&
      decision.onComplete.length > 0
    ) {
      currentGame =
        resolveEncounterEffects(
          currentGame,
          investigatorId,
          decision.onComplete,
          map,
        );
    }

    /*
    * ==========================================================
    * END ENCOUNTER
    * ==========================================================
    *
    * If this card selection came from an active Encounter
    * and resolving it did not create another pending decision,
    * the Encounter is now completely resolved.
    */

    if (
      currentGame.phase === "encounter" &&
      currentGame.currentEncounterId &&
      !currentGame.pendingDecision &&
      !currentGame.pendingEncounterChoice
    ) {
      /*
      * The Encounter card must be discarded before ending
      * the Investigator Encounter.
      */

      const encounterId =
        currentGame.currentEncounterId;

      const encounterDeckType =
        currentGame.currentEncounterDeckType;

      if (
        encounterDeckType
      ) {
        currentGame = {
          ...currentGame,

          board: {
            ...currentGame.board,

            encounterDiscards: {
              ...currentGame.board
                .encounterDiscards,

              [encounterDeckType]: [
                ...currentGame.board
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
        };

        currentGame =
          endInvestigatorEncounter(
            currentGame,
          );
      }
    }

    return {
      type: "state",
      game: currentGame,
    };
  }

  /*
   * ============================================================
   * CARD SELECTION — DESELECT
   * ============================================================
   */

  if (
    !decision.selectableCardIds.includes(
      cardId,
    )
  ) {
    return {
      type: "ignore",
      game,
    };
  }

  if (
    selectedCardIds.includes(
      cardId,
    )
  ) {
    return {
      type: "select",
      game: {
        ...game,

        pendingDecision: {
          ...decision,

          selectedCardIds:
            selectedCardIds.filter(
              (id) =>
                id !== cardId,
            ),
        },
      },
    };
  }

  /*
   * ============================================================
   * MAXIMUM SELECTIONS
   * ============================================================
   */

  if (
    selectedCardIds.length >=
    decision.maxSelections
  ) {
    return {
      type: "ignore",
      game,
    };
  }

  /*
   * ============================================================
   * SELECT CARD
   * ============================================================
   */

  return {
    type: "select",
    game: {
      ...game,

      pendingDecision: {
        ...decision,

        selectedCardIds: [
          ...selectedCardIds,
          cardId,
        ],
      },
    },
  };
}