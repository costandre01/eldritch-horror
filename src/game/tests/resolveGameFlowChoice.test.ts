import {
  describe,
  expect,
  it,
} from "vitest";

import { resolveGameFlowChoice } from "../engine/resolveGameFlowChoice";

import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { createTestGame } from "./helpers/createTestGame";

function createTestMap(): MapDefinition {
  return {
    id: "test-map",
    name: "Test Map",
    startingSpaceId: "arkham",

    spaces: [
      {
        id: "arkham",
        name: "Arkham",
        type: "city",
        isExpedition: false,

        connectedSpaceIds: [
          "wilderness",
        ],

        paths: [
          {
            toSpaceId: "wilderness",
            type: "uncharted",
          },
        ],
      },

      {
        id: "wilderness",
        name: "Wilderness",
        type: "wilderness",
        isExpedition: false,

        connectedSpaceIds: [
          "arkham",
        ],

        paths: [
          {
            toSpaceId: "arkham",
            type: "uncharted",
          },
        ],
      },

      {
        id: "tokyo",
        name: "Tokyo",
        type: "city",
        isExpedition: false,

        connectedSpaceIds: [],
        paths: [],
      },
    ],
  };
}

function prepareGame(): GameState {
  const game =
    createTestGame();

  game.phase = "mythos";

  game.currentMythosId =
    "a-dark-power";

  game.ancientOne = {
    ...game.ancientOne,
    id: "azathoth",
    doom: 10,
    awakened: false,
  };

  game.leadInvestigatorId =
    "investigator-1";

  game.activeInvestigatorId =
    null;

  game.investigatorOrder = [
    "investigator-1",
    "investigator-2",
    "investigator-3",
  ];

  /*
   * Investigator 2 reached both
   * Health 0 and Sanity 0.
   */
  game.investigators[
    "investigator-2"
  ] = {
    ...game.investigators[
      "investigator-2"
    ],

    health: 0,
    sanity: 0,

    spaceId: "wilderness",

    isDefeated: false,
    defeatType: null,
  };

  /*
   * Investigator 3 has no Monsters.
   * Therefore A Dark Power should finish
   * after Investigator 2's defeat.
   */
  game.investigators[
    "investigator-3"
  ] = {
    ...game.investigators[
      "investigator-3"
    ],

    spaceId: "tokyo",
  };

  game.board.spaces = {
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

    wilderness: {
      spaceId: "wilderness",
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    },

    tokyo: {
      spaceId: "tokyo",
      clues: 0,
      clueTokenIds: [],
      monsterIds: [],
      gates: [],
      expedition: false,
      rumor: false,
      eldritchTokenCount: 0,
    },
  };

  game.board.mythosDiscard = [];

  /*
   * This is the choice previously created by
   * defeatInvestigator() because both Health
   * and Sanity reached 0.
   */
  game.pendingDecision = {
    type: "choice",

    title:
      "Investigator Defeated",

    message:
      "Your Health and Sanity were reduced to 0. Choose how the investigator was defeated.",

    options: [
      {
        id:
          "defeat-type:crippled:investigator-2",
        title: "Crippled",
      },

      {
        id:
          "defeat-type:insane:investigator-2",
        title: "Insane",
      },
    ],

    source:
      "defeat-type:investigator-2",

    resume: {
      type:
        "mythos-dark-power",

      investigatorIds: [
        "investigator-1",
        "investigator-2",
        "investigator-3",
      ],

      currentInvestigatorIndex:
        1,

      monsterIds: [
        "monster-current",
      ],

      resolvedMonsterIds: [],
    },
  };

  return game;
}

describe(
  "resolveGameFlowChoice — A Dark Power defeat",
  () => {
    it(
      "resolves a simultaneous Health and Sanity defeat as Crippled and resumes A Dark Power",
      () => {
        const game =
          prepareGame();

        const doomBefore =
          game.ancientOne.doom;

        const nextGame =
          resolveGameFlowChoice(
            game,
            "defeat-type:crippled:investigator-2",
            createTestMap(),
          );

        const defeated =
          nextGame.investigators[
            "investigator-2"
          ];

        expect(
          defeated.isDefeated,
        ).toBe(true);

        expect(
          defeated.defeatType,
        ).toBe("crippled");

        /*
         * Defeat advances Doom by 1.
         */
        expect(
          nextGame.ancientOne.doom,
        ).toBe(
          doomBefore - 1,
        );

        /*
         * The Investigator was in Wilderness
         * and moves to the nearest City.
         */
        expect(
          defeated.spaceId,
        ).toBe("arkham");

        expect(
          nextGame
            .pendingInvestigatorReplacements,
        ).toContain(
          "investigator-2",
        );

        /*
         * Investigator 3 has no Monster,
         * so A Dark Power reaches the end.
         */
        expect(
          nextGame.currentMythosId,
        ).toBeNull();

        expect(
          nextGame.pendingDecision,
        ).toBeNull();

        expect(
          nextGame.activeInvestigatorId,
        ).toBeNull();

        expect(
          nextGame.board.mythosDiscard.some(
            (mythos) =>
              mythos.id ===
              "a-dark-power",
          ),
        ).toBe(true);
      },
    );
  },
);