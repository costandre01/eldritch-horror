import { describe, expect, it } from "vitest";
import { createTestGame } from "./helpers/createTestGame";
import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";
import { showMythosContinue } from "../engine/showMythosContinue";
import { resolveGameFlowContinue } from "../engine/resolveGameFlowContinue";
import { resolveMythos } from "../engine/resolveMythos";
import { spawnMythosGates } from "../engine/spawnMythosGates";

function rumorGame() {
  const game = createTestGame();
  game.currentMythosId = "fractured-reality";
  game.pendingDecision = null;
  game.board.spaces = Object.fromEntries(eldritchBaseMap.spaces.map((space) => [space.id, {
    spaceId: space.id, clues: 0, clueTokenIds: [], monsterIds: [], gates: [],
    expedition: false, rumor: false, eldritchTokenCount: 0,
  }]));
  game.board.cluePool = [{ id: "clue-arkham", spaceId: "arkham" }];
  game.board.clueDiscard = [];
  game.board.mythosInPlay = [];
  return game;
}

describe("Mythos placement flow", () => {
  it("returns to the Mythos card after advancing the Omen", () => {
    const game = rumorGame();
    game.currentMythosId = "a-proposition";
    game.ancientOne = {
      id: "azathoth",
      name: "Azathoth",
      doom: 15,
      omenPosition: 0,
      eldritchTokens: 0,
      eldritchTokenPositions: [],
      eldritchTokenSpaceIds: [],
      awakened: false,
      sanityTokens: 0,
      gateCount: 0,
    };

    const omen = resolveMythos(game, eldritchBaseMap, 0);
    expect(omen.pendingDecision).toMatchObject({
      type: "mythos-omen",
      nextIconIndex: 1,
    });

    const continued = resolveGameFlowContinue(omen, eldritchBaseMap).game;
    expect(continued.pendingDecision).toMatchObject({
      type: "continue",
      source: "mythos-card:1",
    });
    expect(continued.ancientOne.omenPosition).toBe(1);
  });

  it("shows new Gates even with an empty Monster Cup and returns to the card without spawning again", () => {
    const game = rumorGame();
    game.board.gateStack = [{ id: "new-gate", spaceId: "arkham", omen: "blue" }];
    game.board.gateDiscard = [];
    game.board.monsterCup = [];
    game.board.monsterSetAside = [];
    const placed = spawnMythosGates(game, 3);
    expect(placed.pendingDecision).toMatchObject({
      type: "mythos-gates", gateTokenIds: ["new-gate"], spaceIds: ["arkham"], monsterIds: [], nextIconIndex: 3,
    });
    const continued = resolveGameFlowContinue(placed, eldritchBaseMap).game;
    expect(continued.pendingDecision).toMatchObject({ type: "continue", source: "mythos-card:3" });
    expect(continued.board).toEqual(placed.board);
    expect(continued.board.spaces.arkham.gates).toHaveLength(1);
  });
  it("returns to the card between clues, rumor and the last icon without repeating placements", () => {
    let game = showMythosContinue(rumorGame(), 0);
    const advance = () => { game = resolveGameFlowContinue(game, eldritchBaseMap).game; };
    expect(game.pendingDecision).toMatchObject({ type: "continue", source: "mythos-card:0" });
    advance();
    expect(game.pendingDecision).toMatchObject({ type: "mythos-clues", nextIconIndex: 1 });
    expect(game.board.spaces["space-2"].rumor).toBe(false);
    advance();
    expect(game.pendingDecision).toMatchObject({ type: "continue", source: "mythos-card:1" });
    expect(game.board.spaces["space-2"].rumor).toBe(false);
    advance();
    expect(game.pendingDecision).toMatchObject({ type: "mythos-rumor", spaceIds: ["space-2"], nextIconIndex: 2 });
    expect(game.board.spaces["space-2"].rumor).toBe(true);
    const boardAfterRumor = game.board;
    advance();
    expect(game.pendingDecision).toMatchObject({ type: "continue", source: "mythos-card:2" });
    expect(game.board).toEqual(boardAfterRumor);
    advance();
    expect(game.pendingDecision).toMatchObject({ type: "continue", source: "mythos-card:3" });
    expect(game.currentMythosId).toBe("fractured-reality");
    expect(game.board.mythosInPlay).toHaveLength(1);
    expect(game.board.mythosInPlay[0].eldritchTokens).toBe(4);
    expect(game.board.spaces.arkham.clueTokenIds).toEqual(["clue-arkham"]);
  });

  it("returns to the Mythos card even when rumor is the final icon", () => {
    const game = rumorGame();
    // Resolve this real card's rumor icon; the saved index must survive the popup.
    const placed = resolveMythos(game, eldritchBaseMap, 1);
    expect(placed.pendingDecision?.type).toBe("mythos-rumor");
    if (placed.pendingDecision?.type !== "mythos-rumor") throw new Error("Missing Rumor popup");
    placed.pendingDecision.nextIconIndex = 3;
    const result = resolveGameFlowContinue(placed, eldritchBaseMap).game;
    expect(result.pendingDecision).toMatchObject({ type: "continue", source: "mythos-card:3" });
    expect(result.currentMythosId).toBe(game.currentMythosId);
    expect(result.board).toEqual(placed.board);
  });
});
