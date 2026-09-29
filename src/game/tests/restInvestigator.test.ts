import {
  describe,
  expect,
  it,
} from "vitest";

import { restInvestigator } from "../engine/restInvestigator";

import {
  createTestGame,
} from "./helpers/createTestGame";

import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";

import { coreAssets } from "../../content/core/coreAssets";

function prepareRestGame() {
  const game = createTestGame();

  game.phase = "action";

  game.activeInvestigatorId =
    "investigator-1";

  game.investigatorTurnIndex = 0;

  game.pendingDecision = null;

  game.pendingEncounterChoice = null;

  const investigator =
    game.investigators[
      "investigator-1"
    ];

  investigator.spaceId =
    "space-1";

  /*
   * createTestInvestigator starts with
   * "travel" already performed.
   *
   * Clear it so Rest is isolated from
   * unrelated action-state behaviour.
   */
  investigator.actionsPerformed = [];

  return game;
}

function addAsset(
  game: ReturnType<
    typeof createTestGame
  >,
  investigatorId: string,
  definitionId: string,
) {
  const definition =
    coreAssets.find(
      (asset) =>
        asset.id === definitionId,
    );

  if (!definition) {
    throw new Error(
      `Asset "${definitionId}" does not exist.`,
    );
  }

  const instanceId =
    `${definitionId}-${investigatorId}`;

  game.assets[instanceId] = {
    ...definition,
    id: instanceId,
  };

  game.investigators[
    investigatorId
  ].assetIds.push(
    instanceId,
  );

  return instanceId;
}

describe(
  "restInvestigator",
  () => {
    it(
      "recovers 1 Health and 1 Sanity",
      () => {
        const game =
          prepareRestGame();

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.health = 3;
        investigator.sanity = 3;

        const result =
          restInvestigator(
            game,
            eldritchBaseMap,
          );

        expect(
          result.investigators[
            "investigator-1"
          ].health,
        ).toBe(4);

        expect(
          result.investigators[
            "investigator-1"
          ].sanity,
        ).toBe(4);

        expect(
          result.investigators[
            "investigator-1"
          ].actionsPerformed,
        ).toContain("rest");
      },
    );

    it(
      "does not recover Health or Sanity above maximum",
      () => {
        const game =
          prepareRestGame();

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.health =
          investigator.maxHealth;

        investigator.sanity =
          investigator.maxSanity;

        const result =
          restInvestigator(
            game,
            eldritchBaseMap,
          );

        expect(
          result.investigators[
            "investigator-1"
          ].health,
        ).toBe(
          investigator.maxHealth,
        );

        expect(
          result.investigators[
            "investigator-1"
          ].sanity,
        ).toBe(
          investigator.maxSanity,
        );
      },
    );

    it(
      "cannot perform Rest twice during the same round",
      () => {
        const game =
          prepareRestGame();

        game.investigators[
          "investigator-1"
        ].actionsPerformed = [
          "rest",
        ];

        expect(() =>
          restInvestigator(
            game,
            eldritchBaseMap,
          ),
        ).toThrow(
          "Investigator cannot perform Rest.",
        );
      },
    );

    it(
      "cannot perform Rest while a Monster is on the investigator's space",
      () => {
        const game =
          prepareRestGame();

        game.monsters[
          "monster-test"
        ] = {
            id: "monster-test",
            definitionId:
                "cultist",
            health: 1,
            spaceId: "space-1",
            engagedInvestigatorId:
                null,
            isEpic: false,
        };

        expect(() =>
          restInvestigator(
            game,
            eldritchBaseMap,
          ),
        ).toThrow(
          "Investigator cannot perform Rest while a Monster is on their space.",
        );
      },
    );

    it(
      "King James Bible recovers 1 additional Sanity during Rest",
      () => {
        const game =
          prepareRestGame();

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.sanity = 2;

        addAsset(
          game,
          "investigator-1",
          "asset-king-james-bible",
        );

        const result =
          restInvestigator(
            game,
            eldritchBaseMap,
          );

        expect(
          result.investigators[
            "investigator-1"
          ].sanity,
        ).toBe(4);
      },
    );

    it(
      "offers Witch Doctor additional Health when a Witch Doctor is on the same space",
      () => {
        const game =
          prepareRestGame();

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.health = 2;

        game.investigators[
          "investigator-2"
        ].spaceId =
          "space-1";

        addAsset(
          game,
          "investigator-2",
          "asset-witch-doctor",
        );

        const result =
          restInvestigator(
            game,
            eldritchBaseMap,
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type !==
          "choice"
        ) {
          throw new Error(
            "Expected Rest choice.",
          );
        }

        expect(
          result.pendingDecision.options.some(
            (option) =>
              option.id ===
              "recover-health",
          ),
        ).toBe(true);
      },
    );

    it(
      "does not offer Witch Doctor Health recovery when the investigator only owns Arcane Tome",
      () => {
        const game =
          prepareRestGame();

        game.investigators[
          "investigator-1"
        ].health = 2;

        addAsset(
          game,
          "investigator-1",
          "asset-arcane-tome",
        );

        const result =
          restInvestigator(
            game,
            eldritchBaseMap,
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type !==
          "choice"
        ) {
          throw new Error(
            "Expected Rest choice.",
          );
        }

        expect(
          result.pendingDecision.options.some(
            (option) =>
              option.id ===
              "recover-health",
          ),
        ).toBe(false);

        expect(
          result.pendingDecision.options.some(
            (option) =>
              option.id.startsWith(
                "use-arcane-tome:",
              ),
          ),
        ).toBe(true);
      },
    );

    it(
      "does not offer Witch Doctor Health recovery when the investigator only owns Puzzle Box",
      () => {
        const game =
          prepareRestGame();

        game.investigators[
          "investigator-1"
        ].health = 2;

        addAsset(
          game,
          "investigator-1",
          "asset-puzzle-box",
        );

        const result =
          restInvestigator(
            game,
            eldritchBaseMap,
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type !==
          "choice"
        ) {
          throw new Error(
            "Expected Rest choice.",
          );
        }

        expect(
          result.pendingDecision.options.some(
            (option) =>
              option.id ===
              "recover-health",
          ),
        ).toBe(false);

        expect(
          result.pendingDecision.options.some(
            (option) =>
              option.id.startsWith(
                "use-puzzle-box:",
              ),
          ),
        ).toBe(true);
      },
    );

    it(
      "offers both Arcane Tome and Puzzle Box without adding Witch Doctor effects",
      () => {
        const game =
          prepareRestGame();

        game.investigators[
          "investigator-1"
        ].health = 2;

        addAsset(
          game,
          "investigator-1",
          "asset-arcane-tome",
        );

        addAsset(
          game,
          "investigator-1",
          "asset-puzzle-box",
        );

        const result =
          restInvestigator(
            game,
            eldritchBaseMap,
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type !==
          "choice"
        ) {
          throw new Error(
            "Expected Rest choice.",
          );
        }

        const optionIds =
          result.pendingDecision.options.map(
            (option) => option.id,
          );

        expect(
          optionIds.some((id) =>
            id.startsWith(
              "use-arcane-tome:",
            ),
          ),
        ).toBe(true);

        expect(
          optionIds.some((id) =>
            id.startsWith(
              "use-puzzle-box:",
            ),
          ),
        ).toBe(true);

        expect(
          optionIds,
        ).not.toContain(
          "recover-health",
        );

        expect(
          optionIds.some((id) =>
            id.startsWith(
              "discard-condition:",
            ),
          ),
        ).toBe(false);
      },
    );

    it(
      "offers discarding a Cursed Condition when a Witch Doctor is on the same space",
      () => {
        const game =
          prepareRestGame();

        /*
         * Give investigator-1 a Cursed
         * Condition.
         */
        game.conditions[
          "condition-cursed-1"
        ] = {
          id: "condition-cursed-1",
          definitionId:
            "condition-cursed",
          instanceNumber: 1,
          frontImage:
            "/cursed.png",
          backImage:
            "/cursed-back.png",
          backId:
            "cursed-back-1",
          flipped: false,
        };

        game.investigators[
          "investigator-1"
        ].conditionIds = [
          "condition-cursed-1",
        ];

        /*
         * investigator-2 is on the same
         * space and owns Witch Doctor.
         */
        game.investigators[
          "investigator-2"
        ].spaceId =
          "space-1";

        addAsset(
          game,
          "investigator-2",
          "asset-witch-doctor",
        );

        const result =
          restInvestigator(
            game,
            eldritchBaseMap,
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type !==
          "choice"
        ) {
          throw new Error(
            "Expected Rest choice.",
          );
        }

        const optionIds =
          result.pendingDecision.options.map(
            (option) =>
              option.id,
          );

        expect(
          optionIds,
        ).toContain(
          "discard-condition:condition-cursed-1",
        );
      },
    );

    it(
      "does not offer discarding Cursed when Arcane Tome is owned but no Witch Doctor is on the space",
      () => {
        const game =
          prepareRestGame();

        /*
         * Give investigator-1 a Cursed
         * Condition.
         */
        game.conditions[
          "condition-cursed-1"
        ] = {
          id: "condition-cursed-1",
          definitionId:
            "condition-cursed",
          instanceNumber: 1,
          frontImage:
            "/cursed.png",
          backImage:
            "/cursed-back.png",
          backId:
            "cursed-back-1",
          flipped: false,
        };

        game.investigators[
          "investigator-1"
        ].conditionIds = [
          "condition-cursed-1",
        ];

        /*
         * Arcane Tome creates a Rest
         * ability choice, but must not
         * unlock Witch Doctor effects.
         */
        addAsset(
          game,
          "investigator-1",
          "asset-arcane-tome",
        );

        const result =
          restInvestigator(
            game,
            eldritchBaseMap,
          );

        expect(
          result.pendingDecision?.type,
        ).toBe("choice");

        if (
          result.pendingDecision?.type !==
          "choice"
        ) {
          throw new Error(
            "Expected Rest choice.",
          );
        }

        const optionIds =
          result.pendingDecision.options.map(
            (option) =>
              option.id,
          );

        expect(
          optionIds.some(
            (id) =>
              id.startsWith(
                "use-arcane-tome:",
              ),
          ),
        ).toBe(true);

        expect(
          optionIds,
        ).not.toContain(
          "discard-condition:condition-cursed-1",
        );

        expect(
          optionIds.some(
            (id) =>
              id.startsWith(
                "discard-condition:",
              ),
          ),
        ).toBe(false);
      },
    );

    it(
      "cannot perform Rest while Strange Sightings is in play",
      () => {
        const game =
          prepareRestGame();

        game.board.mythosInPlay = [
          {
            definitionId:
              "strange-sightings",
            eldritchTokens: 0,
          },
        ];

        expect(() =>
          restInvestigator(
            game,
            eldritchBaseMap,
          ),
        ).toThrow(
          "Investigators cannot perform Rest while Strange Sightings is in play.",
        );
      },
    );
  },
);