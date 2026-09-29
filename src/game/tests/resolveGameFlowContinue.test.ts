import {
  describe,
  expect,
  it,
} from "vitest";

import { resolveGameFlowContinue } from "../engine/resolveGameFlowContinue";

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
    "investigator-2";

  game.investigatorOrder = [
    "investigator-1",
    "investigator-2",
    "investigator-3",
  ];

  /*
   * Investigator 2 is the one defeated
   * during A Dark Power.
   *
   * It is intentionally NOT the Lead.
   */
  game.investigators[
    "investigator-2"
  ] = {
    ...game.investigators[
      "investigator-2"
    ],

    health: 0,
    sanity: 5,

    spaceId: "wilderness",

    isDefeated: false,
    defeatType: null,
  };

  /*
   * Investigator 3 has no Monsters.
   *
   * After Investigator 2 is defeated,
   * A Dark Power should skip Investigator 3
   * and finish.
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
   * This is the decision created by combat
   * when Investigator 2 reaches 0 Health.
   */
  game.pendingDecision = {
    type: "continue",

    title:
      "Investigator Defeated",

    message:
      "The Investigator was defeated.",

    source:
      "combat-defeat:investigator-2",

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
  "resolveGameFlowContinue — A Dark Power defeat",
  () => {
    it(
      "applies the complete defeat flow and then finishes A Dark Power",
      () => {
        const game =
          prepareGame();

        const map =
          createTestMap();

        const doomBefore =
          game.ancientOne.doom;

        const result =
          resolveGameFlowContinue(
            game,
            map,
          );

        const nextGame =
          result.game;

        const defeated =
          nextGame.investigators[
            "investigator-2"
          ];

        /*
         * Investigator defeat.
         */
        expect(
          defeated.isDefeated,
        ).toBe(true);

        expect(
          defeated.defeatType,
        ).toBe("crippled");

        /*
         * Doom +1 means the Doom track
         * moves one step toward 0.
         */
        expect(
          nextGame.ancientOne.doom,
        ).toBe(
          doomBefore - 1,
        );

        /*
         * Defeated Investigator moves from
         * Wilderness to nearest City.
         */
        expect(
          defeated.spaceId,
        ).toBe("arkham");

        /*
         * Before Ancient One awakening,
         * a replacement will be chosen
         * at the appropriate time.
         */
        expect(
          nextGame
            .pendingInvestigatorReplacements,
        ).toContain(
          "investigator-2",
        );

        /*
         * Investigator 3 has no Monsters,
         * therefore A Dark Power finishes.
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

        /*
         * A Dark Power was discarded.
         */
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