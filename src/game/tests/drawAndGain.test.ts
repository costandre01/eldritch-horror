import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  Artifact,
} from "../models/Artifact";

import {
  drawArtifact,
} from "../engine/drawArtifact";

import {
  drawCondition,
} from "../engine/drawCondition";

import {
  gainArtifact,
} from "../engine/gainArtifact";

import {
  gainCondition,
  gainConditionByCategory,
} from "../engine/gainCondition";

import {
  createTestGame,
} from "./helpers/createTestGame";

function createTestArtifact(
  id: string,
): Artifact {
  return {
    id,
    definitionId: id,
    name: `Artifact ${id}`,
    type: "item",
    traits: [],
    description: "Test artifact",
    image: "/artifact.png",
  };
}

function createTestCondition(
  id: string,
  definitionId: string = "condition-amnesia",
) {
  return {
    id,
    definitionId,
    instanceNumber: 1,
    frontImage: "/condition.png",
    backImage: "/condition-back.png",
    backId: "condition-back-1",
    flipped: true,
  };
}

describe("drawArtifact", () => {
  it("returns null when the Artifact deck is empty", () => {
    const game =
      createTestGame();

    game.board.artifactDeck = [];

    const result =
      drawArtifact(game);

    expect(
      result.artifact,
    ).toBeNull();

    expect(
      result.game,
    ).toBe(game);
  });

  it("draws a random Artifact and removes it from the deck", () => {
    const game =
      createTestGame();

    const artifact1 =
      createTestArtifact(
        "artifact-1",
      );

    const artifact2 =
      createTestArtifact(
        "artifact-2",
      );

    game.board.artifactDeck = [
      artifact1,
      artifact2,
    ];

    vi.spyOn(
      Math,
      "random",
    ).mockReturnValue(0.99);

    const result =
      drawArtifact(game);

    expect(
      result.artifact,
    ).toBe(artifact2);

    expect(
      result.game.board.artifactDeck,
    ).toEqual([
      artifact1,
    ]);

    vi.restoreAllMocks();
  });

  it("returns null when the selected deck entry is undefined", () => {
    const game =
      createTestGame();

    game.board.artifactDeck =
      new Array(1) as Artifact[];

    vi.spyOn(
      Math,
      "random",
    ).mockReturnValue(0);

    const result =
      drawArtifact(game);

    expect(
      result.artifact,
    ).toBeNull();

    expect(
      result.game,
    ).toBe(game);

    vi.restoreAllMocks();
  });
});

describe("drawCondition", () => {
  it("returns null when the Condition deck is empty", () => {
    const game =
      createTestGame();

    game.board.conditionDeck = [];

    const result =
      drawCondition(game);

    expect(
      result.conditionId,
    ).toBeNull();

    expect(
      result.game,
    ).toBe(game);
  });

  it("draws the first Condition when no definition is requested", () => {
    const game =
      createTestGame();

    const condition =
      createTestCondition(
        "condition-1",
      );

    game.conditions = {
      "condition-1":
        condition,
    };

    game.board.conditionDeck = [
      "condition-1",
    ];

    const result =
      drawCondition(game);

    expect(
      result.conditionId,
    ).toBe("condition-1");

    expect(
      result.game.board.conditionDeck,
    ).toEqual([]);

    expect(
      result.game.conditions[
        "condition-1"
      ].flipped,
    ).toBe(false);
  });

  it("draws a specific Condition definition from the deck", () => {
    const game =
      createTestGame();

    const amnesia =
      createTestCondition(
        "condition-amnesia-1",
        "condition-amnesia",
      );

    const cursed =
      createTestCondition(
        "condition-cursed-1",
        "condition-cursed",
      );

    game.conditions = {
      "condition-amnesia-1":
        amnesia,

      "condition-cursed-1":
        cursed,
    };

    game.board.conditionDeck = [
      "condition-amnesia-1",
      "condition-cursed-1",
    ];

    const result =
      drawCondition(
        game,
        "condition-cursed",
      );

    expect(
      result.conditionId,
    ).toBe("condition-cursed-1");

    expect(
      result.game.board.conditionDeck,
    ).toEqual([
      "condition-amnesia-1",
    ]);

    expect(
      result.game.conditions[
        "condition-cursed-1"
      ].flipped,
    ).toBe(false);
  });

  it("returns null when the requested Condition definition is not available", () => {
    const game =
      createTestGame();

    const condition =
      createTestCondition(
        "condition-1",
        "condition-amnesia",
      );

    game.conditions = {
      "condition-1":
        condition,
    };

    game.board.conditionDeck = [
      "condition-1",
    ];

    const result =
      drawCondition(
        game,
        "condition-cursed",
      );

    expect(
      result.conditionId,
    ).toBeNull();

    expect(
      result.game,
    ).toBe(game);
  });

  it("returns null when the selected Condition entry is undefined", () => {
    const game =
      createTestGame();

    game.board.conditionDeck =
      new Array(1) as string[];

    const result =
      drawCondition(game);

    expect(
      result.conditionId,
    ).toBeNull();

    expect(
      result.game,
    ).toBe(game);
  });

  it("throws when the drawn Condition does not exist", () => {
    const game =
      createTestGame();

    game.board.conditionDeck = [
      "condition-missing",
    ];

    expect(() =>
      drawCondition(game),
    ).toThrow(
      'Condition "condition-missing" does not exist.',
    );
  });
});

describe("gainArtifact", () => {
    it("returns the same game when the selected Artifact entry is unexpectedly missing", () => {
        const game = createTestGame();

        game.board.artifactDeck = [];

        vi.spyOn(
            game.board.artifactDeck,
            "findIndex",
        ).mockReturnValue(0);

        const result = gainArtifact(
            game,
            "investigator-1",
            "artifact-test",
        );

        expect(result).toBe(game);

        expect(
            result.investigators[
                "investigator-1"
            ].artifactIds,
        ).toEqual([]);
    });

  it("throws when the Investigator does not exist", () => {
    const game =
      createTestGame();

    expect(() =>
      gainArtifact(
        game,
        "investigator-does-not-exist",
      ),
    ).toThrow(
      'Investigator "investigator-does-not-exist" does not exist.',
    );
  });

  it("returns the game when a requested Artifact is not in the deck", () => {
    const game =
      createTestGame();

    game.board.artifactDeck = [];

    const result =
      gainArtifact(
        game,
        "investigator-1",
        "artifact-missing",
      );

    expect(result).toBe(game);
  });

  it("gives a requested Artifact to the Investigator", () => {
    const game =
      createTestGame();

    const artifact =
      createTestArtifact(
        "artifact-1",
      );

    game.board.artifactDeck = [
      artifact,
    ];

    const result =
      gainArtifact(
        game,
        "investigator-1",
        "artifact-1",
      );

    expect(
      result.investigators[
        "investigator-1"
      ].artifactIds,
    ).toEqual([
      "artifact-1",
    ]);

    expect(
      result.board.artifactDeck,
    ).toEqual([]);
  });

  it("draws a random Artifact when no Artifact id is supplied", () => {
    const game =
      createTestGame();

    const artifact =
      createTestArtifact(
        "artifact-1",
      );

    game.board.artifactDeck = [
      artifact,
    ];

    vi.spyOn(
      Math,
      "random",
    ).mockReturnValue(0);

    const result =
      gainArtifact(
        game,
        "investigator-1",
      );

    expect(
      result.investigators[
        "investigator-1"
      ].artifactIds,
    ).toEqual([
      "artifact-1",
    ]);

    expect(
      result.board.artifactDeck,
    ).toEqual([]);

    vi.restoreAllMocks();
  });

  it("returns the game when no Artifact is available", () => {
    const game =
      createTestGame();

    game.board.artifactDeck = [];

    const result =
      gainArtifact(
        game,
        "investigator-1",
      );

    expect(result).toBe(game);
  });
});

describe("gainCondition", () => {
  it("throws when the Investigator does not exist", () => {
    const game =
      createTestGame();

    expect(() =>
      gainCondition(
        game,
        "investigator-does-not-exist",
        "condition-amnesia",
      ),
    ).toThrow(
      'Investigator "investigator-does-not-exist" does not exist.',
    );
  });

  it("returns the game when the requested Condition is unavailable", () => {
    const game =
      createTestGame();

    game.board.conditionDeck = [];

    const result =
      gainCondition(
        game,
        "investigator-1",
        "condition-amnesia",
      );

    expect(result).toBe(game);

    expect(
      result.investigators[
        "investigator-1"
      ].conditionIds,
    ).toEqual([]);
  });

  it("gives the requested Condition to the Investigator", () => {
    const game =
      createTestGame();

    game.conditions = {
      "condition-amnesia-1":
        createTestCondition(
          "condition-amnesia-1",
          "condition-amnesia",
        ),
    };

    game.board.conditionDeck = [
      "condition-amnesia-1",
    ];

    const result =
      gainCondition(
        game,
        "investigator-1",
        "condition-amnesia",
      );

    expect(
      result.investigators[
        "investigator-1"
      ].conditionIds,
    ).toEqual([
      "condition-amnesia-1",
    ]);

    expect(
      result.board.conditionDeck,
    ).toEqual([]);
  });
});

describe("gainConditionByCategory", () => {
  it("returns the game when no Condition of the category is available", () => {
    const game =
      createTestGame();

    game.board.conditionDeck = [];

    const result =
      gainConditionByCategory(
        game,
        "investigator-1",
        "madness",
      );

    expect(result).toBe(game);
  });

  it("gains a Condition from the requested category", () => {
    const game =
      createTestGame();

    game.conditions = {
      "condition-amnesia-1":
        createTestCondition(
          "condition-amnesia-1",
          "condition-amnesia",
        ),
    };

    game.board.conditionDeck = [
      "condition-amnesia-1",
    ];

    const result =
      gainConditionByCategory(
        game,
        "investigator-1",
        "madness",
        () => 0,
      );

    expect(
      result.investigators[
        "investigator-1"
      ].conditionIds,
    ).toEqual([
      "condition-amnesia-1",
    ]);

    expect(
      result.board.conditionDeck,
    ).toEqual([]);
  });

  it("returns the game when the random index does not select a definition", () => {
    const game =
      createTestGame();

    game.conditions = {
      "condition-amnesia-1":
        createTestCondition(
          "condition-amnesia-1",
          "condition-amnesia",
        ),
    };

    game.board.conditionDeck = [
      "condition-amnesia-1",
    ];

    const result =
      gainConditionByCategory(
        game,
        "investigator-1",
        "madness",
        () => 1,
      );

    expect(result).toBe(game);
  });
});