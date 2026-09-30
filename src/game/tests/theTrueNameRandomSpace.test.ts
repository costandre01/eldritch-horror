import { describe, expect, it } from "vitest";

import type { GameState } from "../models/GameState";

import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";

import { resolveMysteryEnterPlay } from "../engine/resolveMysteryEnterPlay";

import { createTestGame } from "./helpers/createTestGame";
import { resolveEncounterSpaceSelection } from "../engine/resolveEncounterSpaceSelection";

describe("The True Name random spaces", () => {
  it("uses Clue tokens to determine the random spaces and discards those Clues", () => {
    const game = createTestGame();

    /*
     * 3 investigators means:
     *
     * ceil(3 / 2) = 2
     *
     * so The True Name must place
     * 2 Eldritch Tokens.
     */

    const firstSpaceId = eldritchBaseMap.spaces[0].id;

    const secondSpaceId = eldritchBaseMap.spaces[1].id;

    const spaces = Object.fromEntries(
      eldritchBaseMap.spaces.map((space) => [
        space.id,
        {
          spaceId: space.id,
          clues: 0,
          clueTokenIds: [],
          monsterIds: [],
          gates: [],
          expedition: false,
          rumor: false,
          eldritchTokenCount: 0,
        },
      ]),
    );

    game.board = {
      ...game.board,

      spaces,

      cluePool: [
        {
          id: "test-clue-1",
          spaceId: firstSpaceId,
        },
        {
          id: "test-clue-2",
          spaceId: secondSpaceId,
        },
      ],

      clueDiscard: [],
    } as GameState["board"];

    game.mysteries = {
      ...game.mysteries,

      activeMysteryId: "azathoth-the-true-name",

      progress: {
        ...game.mysteries.progress,

        "azathoth-the-true-name": {
          mysteryId: "azathoth-the-true-name",

          clueTokenIds: [],

          eldritchTokenCount: 0,

          monsterIds: [],

          gateIds: [],

          mysteryTokenSpaceId: null,

          eldritchTokenSpaceIds: [],
        },
      },
    };

    game.pendingDecision = null;

    const result = resolveMysteryEnterPlay(game, eldritchBaseMap);

    /*
     * Both Clues were consumed to
     * determine random spaces.
     */

    expect(result.board.cluePool).toHaveLength(0);

    expect(result.board.clueDiscard).toHaveLength(2);

    /*
     * One Eldritch Token was placed
     * on each space determined by
     * those Clues.
     */

    expect(result.board.spaces[firstSpaceId].eldritchTokenCount).toBe(1);

    expect(result.board.spaces[secondSpaceId].eldritchTokenCount).toBe(1);

    /*
     * Mystery progress records both
     * physical token locations.
     */

    expect(
      result.mysteries.progress["azathoth-the-true-name"].eldritchTokenSpaceIds,
    ).toEqual([firstSpaceId, secondSpaceId]);

    expect(result.pendingDecision).toBeNull();
  });

  it("asks the Lead Investigator to choose a space when no Clues are available", () => {
    const game = createTestGame();

    const spaces = Object.fromEntries(
      eldritchBaseMap.spaces.map((space) => [
        space.id,
        {
          spaceId: space.id,
          clues: 0,
          clueTokenIds: [],
          monsterIds: [],
          gates: [],
          expedition: false,
          rumor: false,
          eldritchTokenCount: 0,
        },
      ]),
    );

    game.board = {
      ...game.board,

      spaces,

      cluePool: [],
      clueDiscard: [],
    } as GameState["board"];

    game.mysteries = {
      ...game.mysteries,

      activeMysteryId: "azathoth-the-true-name",

      progress: {
        ...game.mysteries.progress,

        "azathoth-the-true-name": {
          mysteryId: "azathoth-the-true-name",

          clueTokenIds: [],
          eldritchTokenCount: 0,
          monsterIds: [],
          gateIds: [],
          mysteryTokenSpaceId: null,
          eldritchTokenSpaceIds: [],
        },
      },
    };

    game.pendingDecision = null;

    const result = resolveMysteryEnterPlay(game, eldritchBaseMap);

    expect(result.pendingDecision?.type).toBe("select-space");

    if (result.pendingDecision?.type !== "select-space") {
      throw new Error("Expected a select-space decision.");
    }

    expect(result.pendingDecision.spaceIds).toEqual(
      eldritchBaseMap.spaces.map((space) => space.id),
    );

    expect(result.pendingDecision.resume).toEqual({
      type: "mystery-true-name-random-space",

      mysteryId: "azathoth-the-true-name",

      remainingTokenCount: Math.ceil(game.investigatorOrder.length / 2),
    });

    /*
     * No token has been placed yet.
     */

    expect(
      result.mysteries.progress["azathoth-the-true-name"].eldritchTokenSpaceIds,
    ).toEqual([]);

    expect(
      Object.values(result.board.spaces).reduce(
        (total, space) => total + space.eldritchTokenCount,
        0,
      ),
    ).toBe(0);
  });

  it("recycles the discarded Clue when another random space must be determined", () => {
    const game = createTestGame();

    /*
     * Force 3 investigators:
     *
     * ceil(3 / 2) = 2
     *
     * so The True Name must determine
     * 2 random spaces.
     */

    game.investigatorOrder = [
      "investigator-1",
      "investigator-2",
      "investigator-3",
    ];

    const firstSpaceId = eldritchBaseMap.spaces[0].id;

    const spaces = Object.fromEntries(
      eldritchBaseMap.spaces.map((space) => [
        space.id,
        {
          spaceId: space.id,
          clues: 0,
          clueTokenIds: [],
          monsterIds: [],
          gates: [],
          expedition: false,
          rumor: false,
          eldritchTokenCount: 0,
        },
      ]),
    );

    game.board = {
      ...game.board,

      spaces,

      /*
       * There is only one physical Clue
       * available.
       *
       * After the first random-space
       * determination it is discarded.
       *
       * Because another random space must
       * then be determined, the discard pile
       * is recycled and the same Clue can be
       * drawn again.
       */
      cluePool: [
        {
          id: "test-clue-1",
          spaceId: firstSpaceId,
        },
      ],

      clueDiscard: [],
    } as GameState["board"];

    game.mysteries = {
      ...game.mysteries,

      activeMysteryId: "azathoth-the-true-name",

      progress: {
        ...game.mysteries.progress,

        "azathoth-the-true-name": {
          mysteryId: "azathoth-the-true-name",

          clueTokenIds: [],
          eldritchTokenCount: 0,
          monsterIds: [],
          gateIds: [],
          mysteryTokenSpaceId: null,
          eldritchTokenSpaceIds: [],
        },
      },
    };

    game.pendingDecision = null;

    const result = resolveMysteryEnterPlay(game, eldritchBaseMap);

    /*
     * The same physical Clue determines
     * both random spaces because the
     * discard pile is recycled between
     * determinations.
     */

    expect(result.board.spaces[firstSpaceId].eldritchTokenCount).toBe(2);

    /*
     * Both Eldritch Tokens must also be
     * recorded in Mystery progress.
     */

    expect(
      result.mysteries.progress["azathoth-the-true-name"].eldritchTokenSpaceIds,
    ).toEqual([firstSpaceId, firstSpaceId]);

    /*
     * After the second determination,
     * the physical Clue is once again
     * in the discard pile.
     */

    expect(result.board.cluePool).toHaveLength(0);

    expect(result.board.clueDiscard).toHaveLength(1);

    expect(result.board.clueDiscard[0]?.id).toBe("test-clue-1");

    /*
     * Both required random spaces were
     * successfully determined.
     *
     * Therefore no Lead Investigator
     * choice is required.
     */

    expect(result.pendingDecision).toBeNull();
  });

  it("places the Eldritch Token on the space chosen by the Lead Investigator when no Clues are available", () => {
    const game = createTestGame();

    /*
     * One investigator means:
     *
     * ceil(1 / 2) = 1
     *
     * so only one Eldritch Token
     * must be placed.
     */

    game.investigatorOrder = ["investigator-1"];

    const selectedSpaceId = eldritchBaseMap.spaces[0].id;

    const spaces = Object.fromEntries(
      eldritchBaseMap.spaces.map((space) => [
        space.id,
        {
          spaceId: space.id,
          clues: 0,
          clueTokenIds: [],
          monsterIds: [],
          gates: [],
          expedition: false,
          rumor: false,
          eldritchTokenCount: 0,
        },
      ]),
    );

    game.board = {
      ...game.board,

      spaces,

      cluePool: [],
      clueDiscard: [],
    } as GameState["board"];

    game.mysteries = {
      ...game.mysteries,

      activeMysteryId: "azathoth-the-true-name",

      progress: {
        ...game.mysteries.progress,

        "azathoth-the-true-name": {
          mysteryId: "azathoth-the-true-name",

          clueTokenIds: [],
          eldritchTokenCount: 0,
          monsterIds: [],
          gateIds: [],
          mysteryTokenSpaceId: null,
          eldritchTokenSpaceIds: [],
        },
      },
    };

    game.pendingDecision = null;

    /*
     * Enter play:
     *
     * no Clues exist, so the random
     * space cannot be determined.
     */

    const gameWaitingForChoice = resolveMysteryEnterPlay(game, eldritchBaseMap);

    expect(gameWaitingForChoice.pendingDecision?.type).toBe("select-space");

    /*
     * The Lead Investigator chooses
     * the space.
     */

    const result = resolveEncounterSpaceSelection(
      gameWaitingForChoice,
      selectedSpaceId,
      eldritchBaseMap,
    );

    /*
     * The Eldritch Token was placed
     * on the chosen space.
     */

    expect(result.board.spaces[selectedSpaceId].eldritchTokenCount).toBe(1);

    /*
     * The Mystery records the token's
     * location.
     */

    expect(
      result.mysteries.progress["azathoth-the-true-name"].eldritchTokenSpaceIds,
    ).toEqual([selectedSpaceId]);

    /*
     * Only one token was required,
     * so resolution is complete.
     */

    expect(result.pendingDecision).toBeNull();

    /*
     * No Clues were created or consumed
     * by the fallback choice.
     */

    expect(result.board.cluePool).toHaveLength(0);

    expect(result.board.clueDiscard).toHaveLength(0);
  });

  it("continues asking the Lead Investigator to choose spaces until all Eldritch Tokens are placed", () => {
    const game = createTestGame();

    /*
     * 3 investigators:
     *
     * ceil(3 / 2) = 2
     *
     * With no Clues available, both
     * random spaces must be chosen by
     * the Lead Investigator.
     */

    game.investigatorOrder = [
      "investigator-1",
      "investigator-2",
      "investigator-3",
    ];

    const firstSpaceId = eldritchBaseMap.spaces[0].id;

    const secondSpaceId = eldritchBaseMap.spaces[1].id;

    const spaces = Object.fromEntries(
      eldritchBaseMap.spaces.map((space) => [
        space.id,
        {
          spaceId: space.id,
          clues: 0,
          clueTokenIds: [],
          monsterIds: [],
          gates: [],
          expedition: false,
          rumor: false,
          eldritchTokenCount: 0,
        },
      ]),
    );

    game.board = {
      ...game.board,

      spaces,

      cluePool: [],
      clueDiscard: [],
    } as GameState["board"];

    game.mysteries = {
      ...game.mysteries,

      activeMysteryId: "azathoth-the-true-name",

      progress: {
        ...game.mysteries.progress,

        "azathoth-the-true-name": {
          mysteryId: "azathoth-the-true-name",

          clueTokenIds: [],
          eldritchTokenCount: 0,
          monsterIds: [],
          gateIds: [],
          mysteryTokenSpaceId: null,
          eldritchTokenSpaceIds: [],
        },
      },
    };

    game.pendingDecision = null;

    /*
     * No Clues:
     * first Lead Investigator choice.
     */

    const firstDecision = resolveMysteryEnterPlay(game, eldritchBaseMap);

    expect(firstDecision.pendingDecision?.type).toBe("select-space");

    /*
     * Resolve the first chosen space.
     */

    const afterFirstChoice = resolveEncounterSpaceSelection(
      firstDecision,
      firstSpaceId,
      eldritchBaseMap,
    );

    expect(afterFirstChoice.board.spaces[firstSpaceId].eldritchTokenCount).toBe(
      1,
    );

    expect(
      afterFirstChoice.mysteries.progress["azathoth-the-true-name"]
        .eldritchTokenSpaceIds,
    ).toEqual([firstSpaceId]);

    /*
     * One token is still missing and
     * there are still no Clues.
     *
     * A second choice must therefore
     * be created.
     */

    expect(afterFirstChoice.pendingDecision?.type).toBe("select-space");

    if (afterFirstChoice.pendingDecision?.type !== "select-space") {
      throw new Error("Expected a second select-space decision.");
    }

    expect(afterFirstChoice.pendingDecision.resume).toEqual({
      type: "mystery-true-name-random-space",

      mysteryId: "azathoth-the-true-name",

      remainingTokenCount: 1,
    });

    /*
     * Resolve the second choice.
     */

    const result = resolveEncounterSpaceSelection(
      afterFirstChoice,
      secondSpaceId,
      eldritchBaseMap,
    );

    expect(result.board.spaces[firstSpaceId].eldritchTokenCount).toBe(1);

    expect(result.board.spaces[secondSpaceId].eldritchTokenCount).toBe(1);

    expect(
      result.mysteries.progress["azathoth-the-true-name"].eldritchTokenSpaceIds,
    ).toEqual([firstSpaceId, secondSpaceId]);

    /*
     * Both required tokens have now
     * been placed.
     */

    expect(result.pendingDecision).toBeNull();
  });
});
