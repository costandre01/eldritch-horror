import type { GameState } from "../models/GameState";
import { advanceDoom } from "./doomEngine";
import { showMythosContinue } from "./showMythosContinue";
import { spawnMonsterAtSpace } from "./spawnMonster";

export function spawnMythosGates(
  game: GameState,
  nextIconIndex: number,
  forcedGateCount?: number,
): GameState {
  /*
   * ============================================================
   * NUMBER OF GATES
   * ============================================================
   *
   * 1–4 investigators -> 1 Gate
   * 5–8 investigators -> 2 Gates
   */

  const gatesToSpawn =
    forcedGateCount ??
    (game.investigatorOrder.length >= 5 ? 2 : 1);

  let currentGame = game;

  for (let i = 0; i < gatesToSpawn; i++) {
    if (currentGame.ancientOne.awakened) {
      break;
    }
    
    let gateStack = [...currentGame.board.gateStack];
    let gateDiscard = [...currentGame.board.gateDiscard];

    /*
     * ============================================================
     * RECYCLE GATE DISCARD
     * ============================================================
     */

    if (gateStack.length === 0 && gateDiscard.length > 0) {
      gateStack = [...gateDiscard].sort(
        () => Math.random() - 0.5,
      );

      gateDiscard = [];
    }

    /*
     * ============================================================
     * NO GATES AVAILABLE
     * ============================================================
     *
     * If both the Gate stack and discard are empty,
     * the Mythos rules advance Doom instead.
     *
     * We leave Doom handling for the dedicated Doom engine,
     * so for now we simply stop spawning Gates.
     */

    if (gateStack.length === 0) {
      currentGame = {
        ...advanceDoom(
          currentGame,
          1,
        ),

        board: {
          ...currentGame.board,
          gateStack,
          gateDiscard,
        },
      };

      break;
    }

    /*
     * ============================================================
     * DRAW GATE TOKEN
     * ============================================================
     */

    const gateToken = gateStack.shift();

    if (!gateToken) {
      break;
    }

    const space = currentGame.board.spaces[gateToken.spaceId];

    if (!space) {
      throw new Error(
        `Gate token references unknown space: ${gateToken.spaceId}`,
      );
    }

    /*
     * ============================================================
     * PLACE GATE
     * ============================================================
     *
     * Multiple Gates can exist on the same space.
     *
     * SpaceState currently represents Gate presence with a
     * boolean, so we keep gate = true here. The physical Gate
     * token itself remains represented by the GateToken.
     */

    const spaces = {
      ...currentGame.board.spaces,
    };

    spaces[gateToken.spaceId] = {
      ...space,

      gates: [
        ...space.gates,
        gateToken,
      ],
    };

    /*
     * ============================================================
     * SPAWN ONE MONSTER
     * ============================================================
     *
     * Every newly placed Gate immediately spawns one Monster.
     *
     * The Monster is drawn from the Monster Cup and placed
     * specifically on the space where the Gate was placed.
     */

    currentGame = {
      ...currentGame,

      board: {
        ...currentGame.board,

        spaces,
      },
    };

    currentGame =
      spawnMonsterAtSpace(
        currentGame,
        gateToken.spaceId,
      );

    /*
     * ============================================================
     * UPDATE BOARD
     * ============================================================
     */

    currentGame = {
      ...currentGame,

      board: {
        ...currentGame.board,

        gateStack,
        gateDiscard,
      },
    };
  }

  /*
   * ============================================================
   * CONTINUE MYTHOS
   * ============================================================
   */

  return showMythosContinue(
    currentGame,
    nextIconIndex,
  );
}