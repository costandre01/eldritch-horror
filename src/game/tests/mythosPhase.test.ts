import {
  describe,
  expect,
  it,
} from "vitest";

import type { GameState } from "../models/GameState";

import { endInvestigatorEncounter } from "../engine/endInvestigatorEncounter";

import { resolveGameFlowChoice } from "../engine/resolveGameFlowChoice";

import { resolveGameFlowContinue } from "../engine/resolveGameFlowContinue";

import { resolveMythos } from "../engine/resolveMythos";

import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";

import { easyMythos } from "../../content/core/mythos/easyMythos";

import {
  createTestGame,
} from "./helpers/createTestGame";

describe(
  "Mythos Phase",
  () => {
    it(
      "starts Mythos with a real Mythos card after the last investigator finishes the Encounter",
      () => {
        const game =
          createTestGame();

        const investigatorId =
          "investigator-3";

        const realMythos =
          easyMythos.find(
            (mythos) =>
              mythos.id ===
              "secrets-of-the-past",
          );

        if (!realMythos) {
          throw new Error(
            "The real Mythos card 'secrets-of-the-past' was not found.",
          );
        }

        game.phase =
          "encounter";

        game.activeInvestigatorId =
          investigatorId;

        game.investigatorTurnIndex =
          2;

        game.currentEncounterId =
          null;

        game.currentEncounterBackId =
          null;

        game.currentEncounterRevealed =
          false;

        game.currentEncounterDeckType =
          null;

        game.currentEncounterFromFracturedReality =
          false;

        game.pendingDecision =
          null;

        game.pendingEncounterChoice =
          null;

        game.board = {
          ...game.board,

          mythosDeck: [
            realMythos,
          ],
        } as GameState["board"];

        /*
         * The last investigator finishes the
         * Encounter Phase.
         *
         * The game must now enter Mythos.
         */

        const mythosGame =
          endInvestigatorEncounter(
            game,
          );

        expect(
          mythosGame.phase,
        ).toBe("mythos");

        expect(
          mythosGame.activeInvestigatorId,
        ).toBeNull();

        /*
         * The Mythos card has not been drawn yet.
         *
         * The normal flow must therefore ask
         * the player to draw a Mythos card.
         */

        expect(
          mythosGame.pendingDecision,
        ).toEqual(
          expect.objectContaining({
            type:
              "choice",

            source:
              "mythos-selection",
          }),
        );

        const pendingDecision =
          mythosGame.pendingDecision;

        expect(
          pendingDecision?.type,
        ).toBe("choice");

        if (
          pendingDecision?.type !==
          "choice"
        ) {
          throw new Error(
            "Expected a Mythos selection decision.",
          );
        }

        expect(
          pendingDecision.options,
        ).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id:
                "draw-mythos",
            }),
          ]),
        );

        /*
         * ----------------------------------------------------------
         * Draw the real Mythos card.
         * ----------------------------------------------------------
         */

        const revealedGame =
          resolveGameFlowChoice(
            mythosGame,
            "draw-mythos",
            eldritchBaseMap,
          );

        expect(
          revealedGame.phase,
        ).toBe("mythos");

        expect(
          revealedGame.currentMythosId,
        ).toBe(
          realMythos.id,
        );

        expect(
          revealedGame.board.mythosDeck,
        ).toEqual([]);

        /*
         * The card itself must now be presented
         * as the next Mythos decision.
         */

        expect(
          revealedGame.pendingDecision,
        ).toEqual(
          expect.objectContaining({
            type:
              "continue",

            title:
              realMythos.name,

            message:
              realMythos.text,

            source:
              "mythos-card:0",
          }),
        );
      },
    );

    it(
      "resolves a real Mythos and prepares the Lead Investigator selection",
      () => {
        const game =
          createTestGame();

        const realMythos =
          easyMythos.find(
            (mythos) =>
              mythos.id ===
              "secrets-of-the-past",
          );

        if (!realMythos) {
          throw new Error(
            "The real Mythos card 'secrets-of-the-past' was not found.",
          );
        }

        const leadInvestigatorId =
          "investigator-1";

        game.phase =
          "mythos";

        game.currentMythosId =
          realMythos.id;

        game.leadInvestigatorId =
          leadInvestigatorId;

        game.activeInvestigatorId =
          null;

        game.investigatorTurnIndex =
          0;

        game.pendingDecision =
          null;

        game.pendingEncounterChoice =
          null;

        game.board = {
          ...game.board,

          spaces:
            Object.fromEntries(
              eldritchBaseMap.spaces.map(
                (space) => [
                  space.id,
                  {
                    spaceId:
                      space.id,

                    clues: 0,

                    clueTokenIds:
                      [],

                    monsterIds:
                      [],

                    gates: [],

                    expedition:
                      space.isExpedition,

                    rumor: false,

                    eldritchTokenCount:
                      0,
                  },
                ],
              ),
            ),

          cluePool:
            eldritchBaseMap.spaces.map(
              (space) => ({
                id:
                  `clue-${space.id}`,

                spaceId:
                  space.id,
              }),
            ),

          clueDiscard: [],

          mythosDeck: [],

          mythosDiscard: [],

          mythosInPlay: [],
        } as GameState["board"];

        /*
         * ----------------------------------------------------------
         * Start resolving the real Mythos.
         *
         * Secrets of the Past is an ongoing Mythos with
         * a spawn-clues icon.
         *
         * The icon resolves and then pauses the Mythos
         * flow with a Continue decision.
         * ----------------------------------------------------------
         */

        let resolvedGame =
          resolveMythos(
            game,
            eldritchBaseMap,
          );

        expect(
          resolvedGame.phase,
        ).toBe("mythos");

        expect(
          resolvedGame.currentMythosId,
        ).toBe(
          realMythos.id,
        );

        /*
         * The ongoing Mythos must now be in play.
         */

        expect(
          resolvedGame.board.mythosInPlay,
        ).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              definitionId:
                realMythos.id,
            }),
          ]),
        );

        /*
         * The spawn-clues icon must pause the Mythos
         * and ask the player to continue.
         */

        expect(
          resolvedGame.pendingDecision,
        ).toEqual(
          expect.objectContaining({
            type:
              "continue",

            source:
              "mythos-card:1",
          }),
        );

        /*
         * ----------------------------------------------------------
         * Continue the Mythos.
         *
         * The engine resumes at icon index 1 and finishes
         * the Mythos card.
         * ----------------------------------------------------------
         */

        const continueResult =
          resolveGameFlowContinue(
            resolvedGame,
            eldritchBaseMap,
          );

        resolvedGame =
          continueResult.game;

        /*
         * ----------------------------------------------------------
         * The Mythos itself must now be completely resolved.
         * ----------------------------------------------------------
         */

        expect(
          resolvedGame.phase,
        ).toBe("mythos");

        expect(
          resolvedGame.currentMythosId,
        ).toBeNull();

        /*
         * The ongoing Mythos remains in play.
         */

        expect(
          resolvedGame.board.mythosInPlay,
        ).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              definitionId:
                realMythos.id,
            }),
          ]),
        );

        /*
         * ----------------------------------------------------------
         * The Lead Investigator selection must happen
         * before the next round starts.
         * ----------------------------------------------------------
         */

        expect(
          resolvedGame.activeInvestigatorId,
        ).toBeNull();

        expect(
          resolvedGame.pendingDecision,
        ).toEqual(
          expect.objectContaining({
            type:
              "select-investigator",

            source:
              "mythos:end-lead",
          }),
        );

        const pendingDecision =
          resolvedGame.pendingDecision;

        expect(
          pendingDecision?.type,
        ).toBe(
          "select-investigator",
        );

        if (
          pendingDecision?.type !==
          "select-investigator"
        ) {
          throw new Error(
            "Expected a Lead Investigator selection.",
          );
        }

        /*
         * The current Lead Investigator cannot
         * select himself.
         *
         * Investigators 2 and 3 must be available.
         */

        expect(
          pendingDecision.investigatorIds,
        ).toEqual(
          expect.arrayContaining([
            "investigator-2",
            "investigator-3",
          ]),
        );

        expect(
          pendingDecision.investigatorIds,
        ).not.toContain(
          leadInvestigatorId,
        );
      },
    );
  },
);