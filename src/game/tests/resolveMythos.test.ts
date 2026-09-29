import { describe, expect, it } from "vitest";

import {
  getMythosById,
  resolveMythos,
} from "../engine/resolveMythos";

import { createTestGame } from "./helpers/createTestGame";
import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";

describe("getMythosById", () => {
  it("returns an existing Mythos by id", () => {
    const mythos = getMythosById("a-proposition");

    expect(mythos.id).toBe("a-proposition");
    expect(mythos.name).toBe("A Proposition");
  });

  it("throws when the Mythos does not exist", () => {
    expect(() =>
      getMythosById("mythos-that-does-not-exist"),
    ).toThrow(
      'Mythos "mythos-that-does-not-exist" does not exist.',
    );
  });
});

describe("resolveMythos", () => {
  it("throws when called outside the Mythos phase", () => {
    const game = createTestGame();

    game.phase = "action";

    expect(() =>
      resolveMythos(
        game,
        eldritchBaseMap,
      ),
    ).toThrow(
      "Mythos can only be resolved during the Mythos phase.",
    );
  });

  it("throws when there is no current Mythos", () => {
    const game = createTestGame();

    game.phase = "mythos";
    game.currentMythosId = null;

    expect(() =>
      resolveMythos(
        game,
        eldritchBaseMap,
      ),
    ).toThrow(
      "There is no current Mythos to resolve.",
    );
  });

  it("throws when the current Mythos id does not exist", () => {
    const game = createTestGame();

    game.phase = "mythos";
    game.currentMythosId =
      "mythos-that-does-not-exist";

    expect(() =>
      resolveMythos(
        game,
        eldritchBaseMap,
      ),
    ).toThrow(
      'Mythos "mythos-that-does-not-exist" does not exist.',
    );
  });

  it("starts resolving an advance-omen Mythos at the first icon", () => {
    const game = createTestGame();

    game.phase = "mythos";
    game.currentMythosId = "a-proposition";

    const result = resolveMythos(
      game,
      eldritchBaseMap,
    );

    expect(result.phase).toBe("mythos");

    expect(
      result.currentMythosId,
    ).toBe("a-proposition");

    expect(
      result.pendingDecision,
    ).not.toBeNull();
  });

  it("does not add a persistent Mythos again when resuming from a later icon", () => {
    const game = createTestGame();

    game.phase = "mythos";

    game.currentMythosId =
      "strange-sightings";

    game.board.mythosInPlay = [];

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
    };

    game.board.gateStack = [];
    game.board.gateDiscard = [];

    const before =
      game.board.mythosInPlay.length;

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      1,
    );

    expect(
      result.board.mythosInPlay.length,
    ).toBe(before);
  });

  it("creates a pending decision for a Mythos test effect", () => {
    const game = createTestGame();

    game.phase = "mythos";

    game.currentMythosId =
      "buying-information";

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      3,
    );

    expect(
      result.pendingDecision,
    ).not.toBeNull();

    expect(
      result.pendingDecision?.type,
    ).toBe("test");
  });

  it("creates a pending decision for a Mythos single-die roll", () => {
    const game = createTestGame();

    game.phase = "mythos";

    game.currentMythosId =
      "heart-of-corruption";

    game.board.artifactDeck = [];

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      3,
    );

    expect(
      result.pendingDecision,
    ).not.toBeNull();

    expect(
      result.pendingDecision?.type,
    ).toBe("single-die-roll");
  });

  it("creates a pending decision for selecting a Gate", () => {
    const game = createTestGame();

    game.phase = "mythos";

    game.currentMythosId =
      "that-which-consumes";

    game.board.spaces = {
      arkham: {
        spaceId: "arkham",
        clues: 0,
        clueTokenIds: [],
        monsterIds: [],
        gates: [
          {
            id: "gate-test-1",
            spaceId: "arkham",
            omen: "green",
          },
        ],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },
    };

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      3,
    );

    expect(
      result.pendingDecision,
    ).not.toBeNull();

    expect(
      result.pendingDecision?.type,
    ).toBe("select-space");
  });

  it("creates a pending decision for gaining Dark Pact when a Rumor is in play", () => {
    const game = createTestGame();

    game.phase = "mythos";

    game.currentMythosId =
      "a-proposition";

    game.board.mythosInPlay = [];

    game.board.mythosInPlay.push({
      definitionId:
        "spreading-sickness",
      eldritchTokens: 1,
    });

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      3,
    );

    expect(
      result.pendingDecision,
    ).not.toBeNull();

    expect(
      result.pendingDecision?.type,
    ).toBe("choice");
  });

  it("creates a pending decision for gaining Debt", () => {
    const game = createTestGame();

    game.phase = "mythos";

    game.currentMythosId =
      "everyone-has-a-price";

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      3,
    );

    expect(
      result.pendingDecision,
    ).not.toBeNull();

    expect(
      result.pendingDecision?.type,
    ).toBe("choice");
  });

  it("includes the current Lead Investigator when choosing the Lead for the next round", () => {
    const game = createTestGame();

    game.phase = "mythos";

    /*
     * Secrets of the Past has one Mythos
     * icon and no card-specific effects.
     *
     * Starting at icon index 1 skips the
     * only icon and lets this test reach
     * the end of the Mythos Phase.
     */
    game.currentMythosId =
      "secrets-of-the-past";

    game.leadInvestigatorId =
      "investigator-1";

    game.investigatorOrder = [
      "investigator-1",
      "investigator-2",
      "investigator-3",
    ];

    game.board.mythosInPlay = [];

    /*
     * Isolate the Lead Investigator logic.
     *
     * Mystery resolution and any decisions
     * already present in createTestGame()
     * must not interrupt the end of the
     * Mythos Phase.
     */
    game.mysteries.activeMysteryId = null;

    game.pendingDecision = null;

    game.pendingEncounterChoice = null;

    game.pendingInvestigatorReplacements = [];

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      1,
    );

    expect(
      result.pendingDecision?.type,
    ).toBe("select-investigator");

    if (
      result.pendingDecision?.type !==
      "select-investigator"
    ) {
      throw new Error(
        "Expected a Lead Investigator selection.",
      );
    }

    expect(
      result.pendingDecision.source,
    ).toBe("mythos:end-lead");

    expect(
      result.pendingDecision.investigatorIds,
    ).toEqual([
      "investigator-1",
      "investigator-2",
      "investigator-3",
    ]);

    /*
     * The current Lead must remain one of
     * the available choices.
     */
    expect(
      result.pendingDecision.investigatorIds,
    ).toContain(
      "investigator-1",
    );
  });

  it("keeps the current Lead automatically in a solo game", () => {
    const game = createTestGame();

    game.phase = "mythos";

    game.currentMythosId =
      "secrets-of-the-past";

    game.leadInvestigatorId =
      "investigator-1";

    game.investigatorOrder = [
      "investigator-1",
    ];

    game.investigators = {
      "investigator-1":
        game.investigators[
          "investigator-1"
        ],
    };

    game.board.mythosInPlay = [];

    /*
     * Isolate the end-of-Mythos transition
     * from unrelated Mystery or pending
     * decision state.
     */
    game.mysteries.activeMysteryId = null;

    game.pendingDecision = null;

    game.pendingEncounterChoice = null;

    game.pendingInvestigatorReplacements = [];

    const result = resolveMythos(
      game,
      eldritchBaseMap,
      1,
    );

    expect(
      result.leadInvestigatorId,
    ).toBe("investigator-1");

    expect(
      result.round,
    ).toBe(
      game.round + 1,
    );

    expect(
      result.phase,
    ).toBe("action");

    expect(
      result.activeInvestigatorId,
    ).toBe("investigator-1");
  });
});