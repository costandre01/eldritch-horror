import { describe, expect, it } from "vitest";
import { moveClue } from "../engine/moveClue";
import { resolveEncounterEffects } from "../engine/resolveEncounterEffects";
import { resolveEncounterSpaceSelection } from "../engine/resolveEncounterSpaceSelection";
import { resolveEncounterChoice } from "../engine/resolveEncounterChoice";
import { resolveGameFlowChoice } from "../engine/resolveGameFlowChoice";
import { endInvestigatorEncounter } from "../engine/endInvestigatorEncounter";
import { spendInvestigatorClues } from "../engine/clueEngine";
import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import { createTestGame } from "./helpers/createTestGame";

const map: MapDefinition = {
  id: "test-map",
  name: "Test Map",
  startingSpaceId: "arkham",
  spaces: [
    {
      id: "arkham",
      name: "Arkham",
      type: "city",
      isExpedition: false,
      connectedSpaceIds: ["sea"],
      paths: [{ toSpaceId: "sea", type: "ship" }],
    },
    {
      id: "sea",
      name: "Sea",
      type: "sea",
      isExpedition: false,
      connectedSpaceIds: ["arkham"],
      paths: [{ toSpaceId: "arkham", type: "ship" }],
    },
  ],
};

function prepareGame(): GameState {
  const game = createTestGame();
  game.phase = "encounter";
  game.pendingDecision = null;
  game.currentEncounterId = "research-card";
  game.currentEncounterIsResearch = true;
  game.encounterCluesGained = 0;
  game.encounterClueTokenIdsGained = [];
  game.investigators["investigator-1"].spaceId = "arkham";
  game.board = {
    spaces: {
      arkham: {
        spaceId: "arkham",
        clues: 1,
        clueTokenIds: ["clue-arkham"],
        monsterIds: [],
        gates: [],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },
      sea: {
        spaceId: "sea",
        clues: 0,
        clueTokenIds: [],
        monsterIds: [],
        gates: [],
        expedition: false,
        rumor: false,
        eldritchTokenCount: 0,
      },
    },
    cluePool: [{ id: "clue-sea", spaceId: "sea" }],
    clueDiscard: [],
  } as unknown as GameState["board"];
  return game;
}

describe("Clues in encounters", () => {
  function prepareOccultResearchDecision(): GameState {
    const game = prepareGame();
    const investigator = game.investigators["investigator-1"];
    const gainedClue = { id: "clue-arkham", spaceId: "arkham" };

    game.currentEncounterId = null;
    game.currentEncounterBackId = null;
    game.currentEncounterDeckType = null;
    game.investigatorTurnIndex = 0;
    game.encounterCluesGained = 1;
    game.encounterClueTokenIdsGained = [gainedClue.id];
    investigator.clues = 1;
    investigator.clueTokens = [gainedClue];
    game.board.spaces.arkham.clues = 0;
    game.board.spaces.arkham.clueTokenIds = [];
    game.mysteries = {
      selectedMysteryIds: ["azathoth-occult-research"],
      activeMysteryId: "azathoth-occult-research",
      solvedMysteryIds: [],
      progress: {
        "azathoth-occult-research": {
          mysteryId: "azathoth-occult-research",
          clueTokenIds: [],
          eldritchTokenCount: 0,
          monsterIds: [],
          gateIds: [],
          mysteryTokenSpaceId: null,
          eldritchTokenSpaceIds: [],
        },
      },
    };

    return endInvestigatorEncounter(game);
  }

  it("places the Clue gained in the Research Encounter on Occult Research", () => {
    const prompted = prepareOccultResearchDecision();

    expect(prompted.pendingDecision).toMatchObject({
      type: "choice",
      source: "mystery:azathoth-occult-research",
    });

    const result = resolveGameFlowChoice(
      prompted,
      "occult-research:spend",
      map,
    );

    expect(result.investigators["investigator-1"].clues).toBe(0);
    expect(result.investigators["investigator-1"].clueTokens).toEqual([]);
    expect(result.mysteries.progress["azathoth-occult-research"].clueTokenIds)
      .toEqual(["clue-arkham"]);
    expect(result.activeInvestigatorId).toBe("investigator-2");
  });

  it("keeps the gained Clue when Occult Research is declined", () => {
    const prompted = prepareOccultResearchDecision();

    const result = resolveGameFlowChoice(
      prompted,
      "occult-research:decline",
      map,
    );

    expect(result.investigators["investigator-1"].clues).toBe(1);
    expect(result.investigators["investigator-1"].clueTokens?.map((clue) => clue.id))
      .toEqual(["clue-arkham"]);
    expect(result.mysteries.progress["azathoth-occult-research"].clueTokenIds)
      .toEqual([]);
    expect(result.activeInvestigatorId).toBe("investigator-2");
  });

  it("does not offer Occult Research after the gained Clue was already spent", () => {
    const prompted = prepareOccultResearchDecision();
    const gameWithoutPrompt = {
      ...prompted,
      pendingDecision: null,
    };
    const afterSpend = spendInvestigatorClues(
      gameWithoutPrompt,
      "investigator-1",
      1,
    );

    const result = endInvestigatorEncounter(afterSpend);

    expect(afterSpend.encounterCluesGained).toBe(0);
    expect(afterSpend.encounterClueTokenIdsGained).toEqual([]);
    expect(result.pendingDecision?.type).toBe("investigator-turn");
    expect(result.activeInvestigatorId).toBe("investigator-2");
  });

  it("moves the physical token together with the visible count", () => {
    const result = moveClue(prepareGame(), map, "arkham", "sea");

    expect(result.board.spaces.arkham.clues).toBe(0);
    expect(result.board.spaces.arkham.clueTokenIds).toEqual([]);
    expect(result.board.spaces.sea.clues).toBe(1);
    expect(result.board.spaces.sea.clueTokenIds).toEqual(["clue-arkham"]);
  });

  it("takes the encountered Clue from the map and extra Clues from the pool", () => {
    const result = resolveEncounterEffects(
      prepareGame(),
      "investigator-1",
      [{ type: "gain-clues", amount: 2 }],
      map,
    );

    expect(result.board.spaces.arkham.clueTokenIds).toEqual([]);
    expect(result.board.spaces.arkham.clues).toBe(0);
    expect(result.board.cluePool).toEqual([]);
    expect(result.investigators["investigator-1"].clues).toBe(2);
    expect(result.investigators["investigator-1"].clueTokens?.map((token) => token.id)).toEqual([
      "clue-arkham",
      "clue-sea",
    ]);
    expect(result.encounterClueTokenIdsGained).toEqual(["clue-arkham", "clue-sea"]);
  });

  it("spawns a physical Clue at the space named by an encounter", () => {
    const game = prepareGame();
    const result = resolveEncounterEffects(
      game,
      "investigator-1",
      [{ type: "spawn-clues", spaceId: "sea", amount: 1 }],
      map,
    );

    expect(result.board.cluePool).toEqual([]);
    expect(result.board.spaces.sea.clues).toBe(1);
    expect(result.board.spaces.sea.clueTokenIds).toEqual(["clue-sea"]);
  });

  it("returns a spent encounter Clue to the discard and keeps the remaining gained Clue eligible", () => {
    const result = resolveEncounterEffects(
      prepareGame(),
      "investigator-1",
      [
        { type: "gain-clues", amount: 2 },
        { type: "lose-clues", amount: 1 },
      ],
      map,
    );

    expect(result.investigators["investigator-1"].clues).toBe(1);
    expect(result.board.clueDiscard).toHaveLength(1);
    expect(result.encounterCluesGained).toBe(1);
    expect(result.encounterClueTokenIdsGained).toHaveLength(1);
  });

  it("asks the active investigator to break a nearest-space tie", () => {
    const tieMap: MapDefinition = {
      ...map,
      spaces: [
        { ...map.spaces[0], connectedSpaceIds: ["sea", "sea-2"], paths: [] },
        map.spaces[1],
        {
          id: "sea-2",
          name: "Second Sea",
          type: "sea",
          isExpedition: false,
          connectedSpaceIds: ["arkham"],
          paths: [],
        },
      ],
    };
    const game = prepareGame();
    game.board.spaces["sea-2"] = {
      ...game.board.spaces.sea,
      spaceId: "sea-2",
    };

    const pending = resolveEncounterEffects(
      game,
      "investigator-1",
      [
        { type: "move-clue", targetSpaceType: "sea" },
        { type: "gain-resources", amount: 1 },
      ],
      tieMap,
    );

    expect(pending.pendingDecision?.type).toBe("select-space");
    if (pending.pendingDecision?.type !== "select-space") return;
    expect(pending.pendingDecision.spaceIds).toEqual(["sea", "sea-2"]);

    const result = resolveEncounterSpaceSelection(pending, "sea-2", tieMap);
    expect(result.board.spaces.arkham.clueTokenIds).toEqual([]);
    expect(result.board.spaces["sea-2"].clueTokenIds).toEqual(["clue-arkham"]);
    expect(result.investigators["investigator-1"].resources).toBe(1);
  });

  it("asks before using The Silver Key clue discount", () => {
    const game = prepareGame();
    const investigator = game.investigators["investigator-1"];
    game.currentEncounterId = null;
    game.currentEncounterDeckType = null;
    game.artifacts["silver-key-instance"] = {
      id: "silver-key-instance",
      definitionId: "the-silver-key",
      name: "The Silver Key",
      type: "item",
      traits: ["magical"],
      description: "Once per round, you may spend 1 less Clue to pay for an effect.",
      image: "/cards/artifacts/The_Silver_Key.png",
    };
    investigator.artifactIds = ["silver-key-instance"];
    investigator.clues = 1;
    investigator.clueTokens = [{ id: "held-clue", spaceId: "arkham" }];
    game.pendingEncounterChoice = {
      investigatorId: investigator.id,
      choices: [{
        text: "Spend 1 Clue.",
        requirement: { type: "clues", amount: 1 },
        effects: [{ type: "lose-clues", amount: 1 }],
      }],
      afterChoice: [],
    };
    game.pendingDecision = {
      type: "choice",
      title: "Encounter",
      message: "Choose.",
      options: [{ id: "0", title: "Spend 1 Clue.", description: "Choose." }],
      source: "encounter:test",
    };

    const prompted = resolveEncounterChoice(game, 0, map);
    expect(prompted.pendingDecision?.source).toBe("silver-key-clue-discount:0");
    expect(prompted.investigators[investigator.id].clues).toBe(1);

    const used = resolveGameFlowChoice(prompted, "use", map);
    expect(used.investigators[investigator.id].clues).toBe(1);
    expect(used.cardRerollUsedRound?.["silver-key-instance:clue-discount"]).toBe(game.round);
  });
});
