import {
  describe,
  expect,
  it,
} from "vitest";

import type { GameState } from "../models/GameState";

import { endInvestigatorEncounter } from "../engine/endInvestigatorEncounter";

import { resolveGameFlowContinue } from "../engine/resolveGameFlowContinue";

import { resolveGameFlowChoice } from "../engine/resolveGameFlowChoice";

import { resolveCardSelection } from "../engine/resolveCardSelection";

import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";

import { americaEncounters } from "../../content/core/encounters/americaEncounters";

import { coreSpells } from "../../content/core/coreSpell";

import { createSpell } from "../engine/createSpell";

import {
  createTestGame,
} from "./helpers/createTestGame";

describe(
  "Encounter Phase",
  () => {
    it(
      "advances investigators through Encounter and starts Mythos after the last one",
      () => {
        let game =
          createTestGame();

        game = {
          ...game,

          phase: "encounter",

          investigatorTurnIndex: 0,

          activeInvestigatorId:
            game.investigatorOrder[0],

          pendingDecision: null,

          pendingEncounterChoice: null,

          currentEncounterId: null,

          board: {
            ...game.board,

            mythosDeck: [
              {
                id: "test-mythos",
                name: "Test Mythos",
              } as any,
            ],
          },
        };

        /*
         * Investigator 1 finishes the Encounter.
         */

        game =
          endInvestigatorEncounter(
            game,
          );

        expect(
          game.phase,
        ).toBe("encounter");

        expect(
          game.investigatorTurnIndex,
        ).toBe(1);

        expect(
          game.activeInvestigatorId,
        ).toBe(
          game.investigatorOrder[1],
        );

        expect(
          game.pendingDecision?.type,
        ).toBe(
          "investigator-turn",
        );

        if (
          game.pendingDecision?.type ===
          "investigator-turn"
        ) {
          expect(
            game.pendingDecision.phase,
          ).toBe("encounter");
        }

        /*
         * The pending decision above represents the
         * next investigator's turn.
         *
         * For this unit test we now simulate that
         * investigator's Encounter has been completely
         * resolved and the flow has returned to the
         * Encounter-end function.
         */

        game = {
          ...game,

          pendingDecision: null,

          currentEncounterId: null,

          currentEncounterBackId: null,

          currentEncounterRevealed: false,

          currentEncounterFromFracturedReality:
            false,
        };

        /*
         * Investigator 2 finishes the Encounter.
         */

        game =
          endInvestigatorEncounter(
            game,
          );

        expect(
          game.phase,
        ).toBe("encounter");

        expect(
          game.investigatorTurnIndex,
        ).toBe(2);

        expect(
          game.activeInvestigatorId,
        ).toBe(
          game.investigatorOrder[2],
        );

        expect(
          game.pendingDecision?.type,
        ).toBe(
          "investigator-turn",
        );

        if (
          game.pendingDecision?.type ===
          "investigator-turn"
        ) {
          expect(
            game.pendingDecision.phase,
          ).toBe("encounter");
        }

        /*
         * Simulate Investigator 3's Encounter
         * having been completely resolved.
         */

        game = {
          ...game,

          pendingDecision: null,

          currentEncounterId: null,

          currentEncounterBackId: null,

          currentEncounterRevealed: false,

          currentEncounterFromFracturedReality:
            false,
        };

        /*
         * Investigator 3 is the last investigator.
         *
         * This must start the Mythos phase.
         */

        game =
          endInvestigatorEncounter(
            game,
          );

        expect(
          game.phase,
        ).toBe("mythos");
      },
    );

    it(
      "continues an Encounter investigator turn through the real game flow",
      () => {
        let game =
          createTestGame();

        const investigatorId =
          game.investigatorOrder[1];

        game = {
          ...game,

          phase: "encounter",

          activeInvestigatorId:
            investigatorId,

          investigatorTurnIndex: 1,

          pendingDecision: {
            type: "investigator-turn",

            title: "Encounter Phase",

            message:
              "Continue to the next investigator.",

            investigatorId,

            investigatorName:
              "Akachi Onyele",

            phase: "encounter",
          },

          board: {
            ...game.board,

            spaces: {
              arkham: {
                spaceId: "arkham",

                clues: 0,

                clueTokenIds: [],

                monsterIds: [],

                gates: [],

                expedition: false,

                rumor: false,

                eldritchTokenCount: 0,
              },
            },

            encounterDecks: {
              america: [
                "test-america-encounter",
              ],

              europe: [],

              "asia-australia": [],

              general: [
                "test-encounter",
              ],

              research: [],

              "other-world": [],

              special: [],

              expedition: [],
            },

            mythosInPlay: [],
          } as GameState["board"],
        };

        game.investigators[
          investigatorId
        ] = {
          ...game.investigators[
            investigatorId
          ],

          spaceId: "arkham",
        };

        const result =
          resolveGameFlowContinue(
            game,
            eldritchBaseMap,
          );

        const nextGame =
          result.game;

        expect(
          result.resetEncounterStartedForTurn,
        ).toBe(false);

        expect(
          nextGame.phase,
        ).toBe("encounter");

        expect(
          nextGame.activeInvestigatorId,
        ).toBe(
          investigatorId,
        );

        expect(
          nextGame.investigatorTurnIndex,
        ).toBe(1);

        expect(
          nextGame.pendingDecision?.type,
        ).toBe("choice");

        if (
          nextGame.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            nextGame.pendingDecision.source,
          ).toBe(
            "encounter-selection:arkham",
          );

          expect(
            nextGame.pendingDecision.options
              .some(
                (option) =>
                  option.id === "america",
              ),
          ).toBe(true);

          expect(
            nextGame.pendingDecision.options
              .some(
                (option) =>
                  option.id === "general",
              ),
          ).toBe(true);
        }
      },
    );

    it(
      "draws and reveals a real America Encounter after deck selection",
      () => {
        const encounter =
          americaEncounters[0];

        let game =
          createTestGame();

        game = {
          ...game,

          phase: "encounter",

          activeInvestigatorId:
            "investigator-2",

          investigatorTurnIndex: 1,

          pendingDecision: {
            type: "choice",

            title: "Encounter",

            message:
              "Choose an Encounter deck.",

            options: [
              {
                id: "america",

                title: "America",

                description:
                  "Draw an America Encounter.",
              },
            ],

            source:
              "encounter-selection:arkham",
          },

          investigators: {
            ...game.investigators,

            "investigator-2": {
              ...game.investigators[
                "investigator-2"
              ],

              spaceId: "arkham",
            },
          },

          encounters: {
            [encounter.id]:
              encounter,
          },

          board: {
            ...game.board,

            spaces: {
              arkham: {
                spaceId: "arkham",

                clues: 0,

                clueTokenIds: [],

                monsterIds: [],

                gates: [],

                expedition: false,

                rumor: false,

                eldritchTokenCount: 0,
              },
            },

            encounterDecks: {
              america: [
                encounter.id,
              ],

              europe: [],

              "asia-australia": [],

              general: [],

              research: [],

              "other-world": [],

              special: [],

              expedition: [],
            },

            encounterDiscards: {
              america: [],

              europe: [],

              "asia-australia": [],

              general: [],

              research: [],

              "other-world": [],

              special: [],

              expedition: [],
            },

            mythosInPlay: [],
          } as GameState["board"],
        };

        const result =
          resolveGameFlowChoice(
            game,
            "america",
            eldritchBaseMap,
          );

        expect(
          result.phase,
        ).toBe("encounter");

        expect(
          result.activeInvestigatorId,
        ).toBe(
          "investigator-2",
        );

        expect(
          result.currentEncounterId,
        ).toBe(
          encounter.id,
        );

        expect(
          result.currentEncounterDeckType,
        ).toBe("america");

        expect(
          result.currentEncounterRevealed,
        ).toBe(true);

        expect(
          result.board.encounterDecks
            .america,
        ).toEqual([]);

        expect(
          result.board.encounterDiscards
            .america,
        ).toEqual([]);

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type ===
          "choice"
        ) {
          expect(
            result.pendingDecision.source,
          ).toBe(
            `encounter:${encounter.id}`,
          );

          expect(
            result.pendingDecision.options,
          ).toHaveLength(
            encounter.choices!.length,
          );

          expect(
            result.pendingDecision.options[0]
              .title,
          ).toBe(
            encounter.choices![0].text,
          );
        }
      },
    );

    it(
      "resolves a real Encounter choice, gains a Spell, and continues to the Lore test",
      () => {
        const encounter =
          americaEncounters[0];

        const spellDefinition =
          coreSpells.find(
            (spell) =>
              spell.type ===
              "incantation",
          );

        if (!spellDefinition) {
          throw new Error(
            "No Incantation Spell exists in core content.",
          );
        }

        const spell =
          createSpell(
            spellDefinition,
            1,
          );

        let game =
          createTestGame();

        const investigatorId =
          "investigator-2";

        game = {
          ...game,

          phase: "encounter",

          activeInvestigatorId:
            investigatorId,

          investigatorTurnIndex: 1,

          currentEncounterId:
            encounter.id,

          currentEncounterDeckType:
            "america",

          currentEncounterRevealed:
            true,

          currentEncounterBackId:
            encounter.backImage ??
            null,

          pendingEncounterChoice: {
            investigatorId,

            choices:
              encounter.choices ?? [],

            afterChoice: [],
          },

          pendingDecision: {
            type: "choice",

            title:
              encounter.name,

            message:
              encounter.text,

            image:
              encounter.backImage,

            options: [
              {
                id: "0",

                title:
                  encounter
                    .choices![0]
                    .text,

                description:
                  "Choose this option to resolve the Encounter.",
              },
            ],

            source:
              `encounter:${encounter.id}`,
          },

          investigators: {
            ...game.investigators,

            [investigatorId]: {
              ...game.investigators[
                investigatorId
              ],

              spaceId: "arkham",
            },
          },

          encounters: {
            [encounter.id]:
              encounter,
          },

          spells: {
            [spell.id]:
              spell,
          },

          board: {
            ...game.board,

            spaces: {
              arkham: {
                spaceId: "arkham",

                clues: 0,

                clueTokenIds: [],

                monsterIds: [],

                gates: [],

                expedition: false,

                rumor: false,

                eldritchTokenCount: 0,
              },
            },

            encounterDecks: {
              america: [],

              europe: [],

              "asia-australia": [],

              general: [],

              research: [],

              "other-world": [],

              special: [],

              expedition: [],
            },

            encounterDiscards: {
              america: [],

              europe: [],

              "asia-australia": [],

              general: [],

              research: [],

              "other-world": [],

              special: [],

              expedition: [],
            },

            spellDeck: [
              spell,
            ],

            mythosInPlay: [],
          } as GameState["board"],
        };

        /*
         * ----------------------------------------------------------
         * Choose the real Encounter choice.
         * ----------------------------------------------------------
         */

        let result =
          resolveGameFlowChoice(
            game,
            "0",
            eldritchBaseMap,
          );

        /*
         * The first effect is gain-spell.
         * Therefore the engine must ask the player
         * to choose a physical Incantation Spell.
         */

        expect(
          result.pendingDecision?.type,
        ).toBe("select-card");

        if (
          result.pendingDecision?.type ===
          "select-card"
        ) {
          expect(
            result.pendingDecision.source,
          ).toBe("gain-spell");

          expect(
            result.pendingDecision
              .selectableCardIds,
          ).toEqual([
            spell.id,
          ]);

          expect(
            result.pendingDecision
              .minSelections,
          ).toBe(1);

          expect(
            result.pendingDecision
              .maxSelections,
          ).toBe(1);
        }

        /*
         * ----------------------------------------------------------
         * Select the physical Spell.
         * ----------------------------------------------------------
         */

        const selected =
          resolveCardSelection(
            result,
            spell.id,
            eldritchBaseMap,
          );

        expect(
          selected.type,
        ).toBe("select");

        expect(
          selected.game.pendingDecision
            ?.type,
        ).toBe("select-card");

        if (
          selected.game.pendingDecision
            ?.type === "select-card"
        ) {
          expect(
            selected.game.pendingDecision
              .selectedCardIds,
          ).toEqual([
            spell.id,
          ]);
        }

        /*
         * ----------------------------------------------------------
         * Finish the Spell selection.
         * ----------------------------------------------------------
         */

        result =
          resolveCardSelection(
            selected.game,
            "__FINISH_SELECTION__",
            eldritchBaseMap,
          ).game;

        /*
         * The Spell must now belong to the
         * Investigator.
         */

        expect(
          result.investigators[
            investigatorId
          ].spellIds,
        ).toContain(
          spell.id,
        );

        /*
         * The physical Spell must have been
         * removed from the Spell deck.
         */

        expect(
          result.board.spellDeck,
        ).toEqual([]);

        /*
         * The Encounter is still active because
         * the second effect is a Lore test.
         */

        expect(
          result.currentEncounterId,
        ).toBe(
          encounter.id,
        );

        expect(
          result.currentEncounterRevealed,
        ).toBe(true);

        /*
         * The next pending decision must be
         * the actual Lore test from the card.
         */

        expect(
          result.pendingDecision?.type,
        ).toBe("test");

        if (
          result.pendingDecision?.type ===
          "test"
        ) {
          expect(
            result.pendingDecision.skill,
          ).toBe("lore");

          expect(
            result.pendingDecision.modifier,
          ).toBe(0);

          expect(
            result.pendingDecision
              .onFail,
          ).toEqual([
            {
              type: "gain-condition",

              conditionDefinitionId:
                "condition-hallucinations",
            },
          ]);
        }
      },
    );

    it(
      "finishes a real Encounter test result and advances to the next investigator",
      () => {
        const encounterId =
          "americas-encounter-1-arkham";

        const investigatorId =
          "investigator-2";

        let game =
          createTestGame();

        game = {
          ...game,

          phase: "encounter",

          activeInvestigatorId:
            investigatorId,

          investigatorTurnIndex: 1,

          currentEncounterId:
            encounterId,

          currentEncounterBackId:
            "/cards/encounters/Americas/Americas_Encounter-1/Americas_Encounter-back-1.png",

          currentEncounterRevealed:
            true,

          currentEncounterDeckType:
            "america",

          pendingEncounterChoice:
            null,

          pendingDecision: {
            type: "continue",

            title:
              "Test Result",

            message:
              "Continue after resolving the Test.",

            source:
              `encounter:test-result:${investigatorId}`,

            effectResult:
              "pass",

            onComplete: [],
          },

          board: {
            ...game.board,

            encounterDiscards: {
              america: [],

              europe: [],

              "asia-australia": [],

              general: [],

              research: [],

              "other-world": [],

              special: [],

              expedition: [],
            },
          } as GameState["board"],

          encounters: {
            [encounterId]: {
              id: encounterId,

              name: "Arkham",

              type: "city",

              region: "america",

              frontImage:
                "/cards/encounters/Americas/Americas_Encounter-1/Americas_Encounter.png",

              backImage:
                "/cards/encounters/Americas/Americas_Encounter-1/Americas_Encounter-back-1.png",

              text:
                "Test Encounter",

              choices: [],
            },
          },
        };

        const result =
          resolveGameFlowContinue(
            game,
            eldritchBaseMap,
          );

        const nextGame =
          result.game;

        /*
         * The Encounter must be finished.
         */

        expect(
          nextGame.currentEncounterId,
        ).toBeNull();

        expect(
          nextGame.currentEncounterDeckType,
        ).toBeNull();

        /*
         * The completed Encounter must be
         * placed in the correct discard pile.
         */

        expect(
          nextGame.board
            .encounterDiscards
            .america,
        ).toContain(
          encounterId,
        );

        /*
         * The next Investigator must become active.
         */

        expect(
          nextGame.phase,
        ).toBe("encounter");

        expect(
          nextGame.investigatorTurnIndex,
        ).toBe(2);

        expect(
          nextGame.activeInvestigatorId,
        ).toBe(
          nextGame.investigatorOrder[2],
        );

        /*
         * The next Encounter turn must be
         * represented by the normal game-flow
         * decision.
         */

        expect(
          nextGame.pendingDecision?.type,
        ).toBe(
          "investigator-turn",
        );

        if (
          nextGame.pendingDecision?.type ===
          "investigator-turn"
        ) {
          expect(
            nextGame.pendingDecision.phase,
          ).toBe("encounter");
        }
      },
    );

    it(
      "continues the real Encounter flow into the next investigator",
      () => {
        const game =
          createTestGame();

        const investigatorId =
          "investigator-1";

        const nextInvestigatorId =
          "investigator-2";

        game.phase =
          "encounter";

        game.activeInvestigatorId =
          investigatorId;

        game.investigatorTurnIndex =
          0;

        game.currentEncounterId =
          null;

        game.currentEncounterBackId =
          null;

        game.currentEncounterRevealed =
          false;

        game.currentEncounterDeckType =
          null;

        game.pendingDecision =
          null;

        game.pendingEncounterChoice =
          null;

        game.investigators[
          nextInvestigatorId
        ] = {
          ...game.investigators[
            nextInvestigatorId
          ],

          spaceId:
            "arkham",
        };

        game.board = {
          ...game.board,

          spaces: {
            arkham: {
              spaceId:
                "arkham",

              clues:
                0,

              clueTokenIds:
                [],

              monsterIds:
                [],

              gates:
                [],

              expedition:
                false,

              rumor:
                false,

              eldritchTokenCount:
                0,
            },
          },

          encounterDecks: {
            america: [
              "test-america-encounter",
            ],

            europe: [],

            "asia-australia": [],

            general: [
              "test-encounter",
            ],

            research: [],

            "other-world": [],

            special: [],

            expedition: [],
          },

          mythosInPlay: [],
        } as GameState["board"];

        const afterEnd =
          endInvestigatorEncounter(
            game,
          );

        expect(
          afterEnd.phase,
        ).toBe("encounter");

        expect(
          afterEnd.activeInvestigatorId,
        ).toBe(
          nextInvestigatorId,
        );

        expect(
          afterEnd.investigatorTurnIndex,
        ).toBe(1);

        expect(
          afterEnd.pendingDecision,
        ).toEqual(
          expect.objectContaining({
            type:
              "investigator-turn",

            investigatorId:
              nextInvestigatorId,

            phase:
              "encounter",
          }),
        );

        const continued =
          resolveGameFlowContinue(
            afterEnd,
            eldritchBaseMap,
          );

        const nextGame =
          continued.game;

        expect(
          nextGame.phase,
        ).toBe("encounter");

        expect(
          nextGame.activeInvestigatorId,
        ).toBe(
          nextInvestigatorId,
        );

        expect(
          nextGame.investigatorTurnIndex,
        ).toBe(1);

        expect(
          nextGame.pendingDecision,
        ).toEqual(
          expect.objectContaining({
            type:
              "choice",

            source:
              "encounter-selection:arkham",
          }),
        );

        const pendingDecision =
          nextGame.pendingDecision;

        expect(
          pendingDecision?.type,
        ).toBe("choice");

        if (
          pendingDecision?.type !==
          "choice"
        ) {
          throw new Error(
            "Expected an Encounter choice decision.",
          );
        }

        expect(
          pendingDecision.options,
        ).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id:
                "america",
            }),

            expect.objectContaining({
              id:
                "general",
            }),
          ]),
        );
      },
    );
  },
);