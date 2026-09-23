import {
  describe,
  expect,
  it,
} from "vitest";

import {
  startAncientOneReckoning,
} from "../engine/startAncientOneReckoning";

import {
  startConditionReckoning,
} from "../engine/startConditionReckoning";

import {
  startMythosCardReckoning,
} from "../engine/startMythosCardReckoning";

import {
  createTestGame,
} from "./helpers/createTestGame";

describe("startAncientOneReckoning", () => {
  it("creates an Ancient One Reckoning decision for a front-side ability", () => {
    const game =
      createTestGame();

    game.ancientOne = {
      id: "cthulhu",
      name: "Cthulhu",
      doom: 12,
      omenPosition: 0,
      eldritchTokens: 0,
      eldritchTokenPositions: [],
      eldritchTokenSpaceIds: [],
      awakened: false,
      sanityTokens: 0,
      gateCount: 0,
    };

    const result =
      startAncientOneReckoning(
        game,
        {} as never,
        3,
      );

    expect(
      result.pendingDecision,
    ).toEqual({
      type: "mythos-ancient-one-reckoning",
      title:
        "ANCIENT ONE — RECKONING",
      message:
        "Resolve the Reckoning effect of Cthulhu.",
      ancientOneId: "cthulhu",
      reckoningStage: "front",
      abilityIndex: 0,
      source:
        "mythos:ancient-one-reckoning",
      nextIconIndex: 3,
    });
  });

  it("creates an Ancient One Reckoning decision for an awakened ability", () => {
    const game =
      createTestGame();

    game.ancientOne = {
      id: "azathoth",
      name: "Azathoth",
      doom: 0,
      omenPosition: 0,
      eldritchTokens: 0,
      eldritchTokenPositions: [],
      eldritchTokenSpaceIds: [],
      awakened: true,
      sanityTokens: 0,
      gateCount: 0,
    };

    const result =
      startAncientOneReckoning(
        game,
        {} as never,
        7,
      );

    expect(
      result.pendingDecision,
    ).toEqual({
      type: "mythos-ancient-one-reckoning",
      title:
        "ANCIENT ONE — RECKONING",
      message:
        "Resolve the Reckoning effect of Azathoth.",
      ancientOneId: "azathoth",
      reckoningStage: "awakened",
      abilityIndex: 0,
      source:
        "mythos:ancient-one-reckoning",
      nextIconIndex: 7,
    });
  });

  it("continues Mythos when the Ancient One has no front Reckoning abilities", () => {
    const game =
      createTestGame();

    game.board.mythosInPlay = [];

    game.currentMythosId =
      "secrets-of-the-past";

    game.ancientOne = {
      id: "azathoth",
      name: "Azathoth",
      doom: 10,
      omenPosition: 0,
      eldritchTokens: 0,
      eldritchTokenPositions: [],
      eldritchTokenSpaceIds: [],
      awakened: false,
      sanityTokens: 0,
      gateCount: 0,
    };

    const result =
      startAncientOneReckoning(
        game,
        {} as never,
        4,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type: "continue",
      title: "Secrets of the Past",
      source: "mythos-card:4",
    });

    expect(
      result.pendingDecision,
    ).not.toEqual(
      expect.objectContaining({
        type:
          "mythos-ancient-one-reckoning",
      }),
    );
  });

  it("throws when the Ancient One definition does not exist", () => {
    const game =
      createTestGame();

    game.ancientOne = {
      id: "ancient-one-missing",
      name: "Missing",
      doom: 10,
      omenPosition: 0,
      eldritchTokens: 0,
      eldritchTokenPositions: [],
      eldritchTokenSpaceIds: [],
      awakened: false,
      sanityTokens: 0,
      gateCount: 0,
    };

    expect(() =>
      startAncientOneReckoning(
        game,
        {} as never,
        0,
      ),
    ).toThrow(
      'Ancient One "ancient-one-missing" does not exist.',
    );
  });
});

describe("startConditionReckoning", () => {
  it("creates a Condition Reckoning decision for investigators with Conditions", () => {
    const game =
      createTestGame();

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-amnesia-1",
      "condition-cursed-1",
    ];

    game.investigators[
      "investigator-2"
    ].conditionIds = [
      "condition-blessed-1",
    ];

    const result =
      startConditionReckoning(
        game,
        {} as never,
        5,
      );

    expect(
      result.pendingDecision,
    ).toEqual({
      type:
        "mythos-condition-reckoning",
      title:
        "CONDITIONS — RECKONING",
      message:
        "Resolve the Reckoning effects of the investigators' Conditions.",
      investigatorIds: [
        "investigator-1",
        "investigator-2",
      ],
      currentInvestigatorIndex: 0,
      conditionIds: [
        [
          "condition-amnesia-1",
          "condition-cursed-1",
        ],
        [
          "condition-blessed-1",
        ],
      ],
      currentConditionIndex: 0,
      source:
        "mythos:condition-reckoning",
      nextIconIndex: 5,
      treatDiceAsOne: false,
    });
  });

  it("ignores defeated investigators", () => {
    const game =
      createTestGame();

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-amnesia-1",
    ];

    game.investigators[
      "investigator-1"
    ].isDefeated = true;

    game.investigators[
      "investigator-2"
    ].conditionIds = [
      "condition-cursed-1",
    ];

    const result =
      startConditionReckoning(
        game,
        {} as never,
        2,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type:
        "mythos-condition-reckoning",
      investigatorIds: [
        "investigator-2",
      ],
      conditionIds: [
        [
          "condition-cursed-1",
        ],
      ],
    });
  });

  it("ignores investigators without Conditions", () => {
    const game =
      createTestGame();

    game.investigators[
      "investigator-1"
    ].conditionIds = [];

    game.investigators[
      "investigator-2"
    ].conditionIds = [
      "condition-blessed-1",
    ];

    const result =
      startConditionReckoning(
        game,
        {} as never,
        1,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type:
        "mythos-condition-reckoning",
      investigatorIds: [
        "investigator-2",
      ],
      conditionIds: [
        [
          "condition-blessed-1",
        ],
      ],
    });
  });

  it("passes treatDiceAsOne to the pending decision", () => {
    const game =
      createTestGame();

    game.investigators[
      "investigator-1"
    ].conditionIds = [
      "condition-amnesia-1",
    ];

    const result =
      startConditionReckoning(
        game,
        {} as never,
        9,
        true,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type:
        "mythos-condition-reckoning",
      treatDiceAsOne: true,
      nextIconIndex: 9,
    });
  });

  it("continues Mythos when no investigator has Conditions", () => {
    const game =
      createTestGame();

    game.currentMythosId =
      "secrets-of-the-past";

    for (
      const investigator
      of Object.values(
        game.investigators,
      )
    ) {
      investigator.conditionIds = [];
    }

    const result =
      startConditionReckoning(
        game,
        {} as never,
        6,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type: "continue",
      title: "Secrets of the Past",
      source: "mythos-card:6",
    });
  });
});

describe("startMythosCardReckoning", () => {
  it("creates a Mythos Card Reckoning decision for Mythos in play with Reckoning", () => {
    const game =
      createTestGame();

    game.board.mythosInPlay = [
        {
            definitionId:
                "growing-madness",
            eldritchTokens: 0,
        },
        {
            definitionId:
                "secrets-of-the-past",
            eldritchTokens: 0,
        },
    ];

    const result =
      startMythosCardReckoning(
        game,
        {} as never,
        3,
      );

    expect(
      result.pendingDecision,
    ).toEqual({
      type:
        "mythos-card-reckoning",
      title:
        "MYTHOS — RECKONING",
      message:
        "Resolve the Reckoning effects of the Mythos cards in play.",
        mythosIds: [
            "growing-madness",
            "secrets-of-the-past",
        ],
      resolvedMythosIds: [],
      source:
        "mythos:card-reckoning",
      nextIconIndex: 3,
      remainingPasses: 1,
    });
  });

  it("includes all Mythos cards with Reckoning", () => {
    const game =
      createTestGame();

    game.board.mythosInPlay = [
      {
        definitionId:
          "growing-madness",
        eldritchTokens: 0,
      },
      {
        definitionId:
          "omen-of-good-fortune",
        eldritchTokens: 0,
      },
      {
        definitionId:
          "secrets-of-the-past",
        eldritchTokens: 0,
      },
    ];

    const result =
      startMythosCardReckoning(
        game,
        {} as never,
        8,
        2,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type:
        "mythos-card-reckoning",
      mythosIds: [
        "growing-madness",
        "secrets-of-the-past",
      ],
      resolvedMythosIds: [],
      nextIconIndex: 8,
      remainingPasses: 2,
    });
  });

  it("ignores Mythos cards without Reckoning", () => {
    const game =
      createTestGame();
    
    game.currentMythosId =
        "omen-of-good-fortune";

    game.board.mythosInPlay = [
      {
        definitionId:
          "omen-of-good-fortune",
        eldritchTokens: 0,
      },
    ];

    const result =
      startMythosCardReckoning(
        game,
        {} as never,
        0,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type: "continue",
      source: "mythos-card:0",
    });
  });

  it("continues Mythos when no Mythos with Reckoning is in play", () => {
    const game =
      createTestGame();

    game.currentMythosId =
      "secrets-of-the-past";

    game.board.mythosInPlay = [];

    const result =
      startMythosCardReckoning(
        game,
        {} as never,
        10,
      );

    expect(
      result.pendingDecision,
    ).toMatchObject({
      type: "continue",
      title: "Secrets of the Past",
      source: "mythos-card:10",
    });
  });

  it("throws when there is no current Mythos and no Reckoning cards exist", () => {
    const game =
      createTestGame();

    game.currentMythosId =
      null;

    game.board.mythosInPlay = [];

    expect(() =>
      startMythosCardReckoning(
        game,
        {} as never,
        0,
      ),
    ).toThrow(
      "Cannot show Mythos card because there is no current Mythos.",
    );
  });
});