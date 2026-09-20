import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";
import { advanceDoom } from "./doomEngine";

import { moveInvestigator } from "./moveInvestigator";
import { resolveEncounterEffects } from "./resolveEncounterEffects";
import { resumeDeepOnesAttack, resumeMysteryNearestClue } from "./resolveMysteryEnterPlay";
import { getMythosById } from "./resolveMythos";

export function resolveEncounterSpaceSelection(
  game: GameState,
  spaceId: string,
  map: MapDefinition,
): GameState {
  const decision =
    game.pendingDecision;

  if (
    !decision ||
    decision.type !== "select-space"
  ) {
    throw new Error(
      "There is no pending space selection.",
    );
  }

  if (
    !decision.spaceIds.includes(
      spaceId,
    )
  ) {
    throw new Error(
      `Space "${spaceId}" cannot be selected.`,
    );
  }

  /*
  * ============================================================
  * MYSTERY — THE DEEP ONES ATTACK
  * ============================================================
  *
  * The Lead Investigator chooses between equally
  * near Sea spaces without an Eldritch Token.
  */
  if (
    decision.resume?.type ===
    "mystery-deep-ones-attack"
  ) {
    const leadInvestigatorId =
      game.investigatorOrder[0];

    if (!leadInvestigatorId) {
      throw new Error(
        "There is no Lead Investigator.",
      );
    }

    const {
      mysteryId,
      investigatorIds,
      currentInvestigatorIndex,
    } = decision.resume;

    const selectedSpace =
      game.board.spaces[spaceId];

    if (!selectedSpace) {
      throw new Error(
        `Selected space "${spaceId}" does not exist.`,
      );
    }

    const mapSpace =
      map.spaces.find(
        (space) => space.id === spaceId,
      );

    if (!mapSpace) {
      throw new Error(
        `Selected space "${spaceId}" does not exist on the map.`,
      );
    }

    if (mapSpace.type !== "sea") {
      throw new Error(
        `Selected space "${spaceId}" is not a Sea space.`,
      );
    }

    /*
    * The selected space must be a Sea space
    * and must not already contain an Eldritch Token.
    *
    * The candidate list stored in the decision
    * is also checked above, so the player cannot
    * select another space.
    */
    if (
      selectedSpace.eldritchTokenCount >
      0
    ) {
      throw new Error(
        `Sea space "${spaceId}" already contains an Eldritch Token.`,
      );
    }

    /*
    * Place one Eldritch Token on the selected
    * Sea space.
    */
    const progress =
      game.mysteries.progress[mysteryId];

    if (!progress) {
      throw new Error(
        `Mystery progress "${mysteryId}" does not exist.`,
      );
    }

    const updatedSpaces = {
      ...game.board.spaces,
    };

    updatedSpaces[spaceId] = {
      ...selectedSpace,

      eldritchTokenCount:
        selectedSpace.eldritchTokenCount + 1,
    };

    const updatedGame: GameState = {
      ...game,

      board: {
        ...game.board,

        spaces: updatedSpaces,
      },

      mysteries: {
        ...game.mysteries,

        progress: {
          ...game.mysteries.progress,

          [mysteryId]: {
            ...progress,

            eldritchTokenSpaceIds: [
              ...progress.eldritchTokenSpaceIds,
              spaceId,
            ],
          },
        },
      },

      pendingDecision: null,
    };

    /*
    * Continue with the next investigator.
    *
    * Tokens already placed remain on the board,
    * therefore the next search will not consider
    * this Sea space again.
    */
    const nextInvestigatorIndex =
      currentInvestigatorIndex + 1;

    if (
      nextInvestigatorIndex >=
      investigatorIds.length
    ) {
      return updatedGame;
    }

    /*
    * We need to continue the Deep Ones Attack
    * from the next investigator.
    *
    * Importing the helper here would create a
    * circular dependency, so the continuation
    * is exposed by resolveMysteryEnterPlay.
    */
    return resumeDeepOnesAttack(
      updatedGame,
      map,
      mysteryId,
      investigatorIds,
      nextInvestigatorIndex,
    );
  }

  /*
   * ============================================================
   * MYSTERY — NEAREST CLUE TIE
   * ============================================================
   *
   * The Lead Investigator chooses between
   * equally near valid spaces.
   */
  if (
    decision.resume?.type ===
    "mystery-nearest-clue"
  ) {
    const leadInvestigatorId =
      game.investigatorOrder[0];

    if (!leadInvestigatorId) {
      throw new Error(
        "There is no Lead Investigator.",
      );
    }

    /*
     * During this decision the Lead Investigator
     * must be the active investigator.
     */

    const {
      mysteryId,
      clueTokenId,
      sourceSpaceId,
      remainingClues,
    } = decision.resume;

    const sourceSpace =
      game.board.spaces[
        sourceSpaceId
      ];

    const destinationSpace =
      game.board.spaces[
        spaceId
      ];

    if (!sourceSpace) {
      throw new Error(
        `Source space "${sourceSpaceId}" does not exist.`,
      );
    }

    if (!destinationSpace) {
      throw new Error(
        `Destination space "${spaceId}" does not exist.`,
      );
    }

    /*
     * Make sure the selected Clue is
     * actually still on its source space.
     */
    if (
      !sourceSpace.clueTokenIds.includes(
        clueTokenId,
      )
    ) {
      throw new Error(
        `Clue "${clueTokenId}" is not on source space "${sourceSpaceId}".`,
      );
    }

    const updatedSpaces = {
      ...game.board.spaces,
    };

    /*
     * Remove the Clue from the source space.
     */
    updatedSpaces[sourceSpaceId] = {
      ...sourceSpace,

      clues:
        Math.max(
          0,
          sourceSpace.clues - 1,
        ),

      clueTokenIds:
        sourceSpace.clueTokenIds.filter(
          (id) =>
            id !== clueTokenId,
        ),
    };

    /*
     * Add the same physical Clue token
     * to the selected destination.
     */
    updatedSpaces[spaceId] = {
      ...destinationSpace,

      clues:
        destinationSpace.clues + 1,

      clueTokenIds: [
        ...destinationSpace.clueTokenIds,
        clueTokenId,
      ],
    };

    /*
     * Clear the current decision before
     * continuing the Mystery resolution.
     */
    const updatedGame: GameState = {
      ...game,

      board: {
        ...game.board,

        spaces: updatedSpaces,
      },

      pendingDecision: null,
    };

    /*
     * Continue with the remaining Clues.
     *
     * If there are more ties, another
     * select-space decision will be created.
     */
    return resumeMysteryNearestClue(
      updatedGame,
      map,
      mysteryId,
      remainingClues,
    );
  }

  /*
   * ============================================================
   * ENCOUNTER MOVE
   * ============================================================
   */
  if (
    decision.source?.startsWith(
      "encounter:move:",
    )
  ) {
    const investigatorId =
      game.activeInvestigatorId;

    if (!investigatorId) {
      throw new Error(
        "There is no active investigator.",
      );
    }

    let currentGame =
      moveInvestigator(
        {
          ...game,
          pendingDecision:
            null,
        },
        map,
        investigatorId,
        spaceId,
      );

    if (
      decision.onSpaceSelected &&
      decision.onSpaceSelected.length >
        0
    ) {
      const resolvedEffects =
        decision.onSpaceSelected.map(
          (effect) => ({
            ...effect,
            spaceId:
              effect.spaceId ??
              spaceId,
          }),
        );

      currentGame =
        resolveEncounterEffects(
          currentGame,
          investigatorId,
          resolvedEffects,
          map,
        );
    }

    if (
      decision.onComplete &&
      decision.onComplete.length > 0
    ) {
      currentGame =
        resolveEncounterEffects(
          currentGame,
          investigatorId,
          decision.onComplete,
          map,
        );
    }

    return currentGame;
  }

  /*
   * ============================================================
   * BYAKHEE MOVEMENT
   * ============================================================
   */
  if (
    decision.source ===
    "byakhee-move"
  ) {
    const investigatorId =
      game.activeInvestigatorId;

    if (!investigatorId) {
      throw new Error(
        "There is no active investigator.",
      );
    }

    const investigator =
      game.investigators[
        investigatorId
      ];

    if (!investigator) {
      throw new Error(
        `Investigator "${investigatorId}" does not exist.`,
      );
    }

    if (
      !decision.spaceIds.includes(
        spaceId,
      )
    ) {
      throw new Error(
        `Space "${spaceId}" cannot be selected for Byakhee movement.`,
      );
    }

    return {
      ...game,

      investigators: {
        ...game.investigators,

        [investigatorId]: {
          ...investigator,

          spaceId,
        },
      },

      pendingDecision: null,
    };
  }

  /*
  * ============================================================
  * THAT WHICH CONSUMES
  * ============================================================
  */

  if (
    decision.source ===
    "mythos:that-which-consumes"
  ) {
    const space =
      game.board.spaces[spaceId];

    if (!space) {
      throw new Error(
        `Space "${spaceId}" does not exist.`,
      );
    }

    if (space.gates.length === 0) {
      throw new Error(
        `Space "${spaceId}" has no Gate.`,
      );
    }

    const discardedGate =
      space.gates[0];

    if (!discardedGate) {
      throw new Error(
        `No Gate found at space "${spaceId}".`,
      );
    }

    const currentOmenPosition =
      game.ancientOne.omenPosition;

    const currentOmen =
      currentOmenPosition === 0
        ? "green"
        : currentOmenPosition === 2
          ? "red"
          : "blue";

    let currentGame: GameState = {
      ...game,

      board: {
        ...game.board,

        spaces: {
          ...game.board.spaces,

          [spaceId]: {
            ...space,

            gates:
              space.gates.slice(1),
          },
        },

        gateDiscard: [
          ...game.board.gateDiscard,
          discardedGate,
        ],
      },

      pendingDecision: null,
    };

    /*
    * If the discarded Gate does not correspond
    * to the current Omen, advance Doom by 1.
    */
    if (
      discardedGate.omen !== currentOmen
    ) {
      currentGame =
        advanceDoom(
          currentGame,
          1,
        );
    }

    const mythosId =
      currentGame.currentMythosId;

    if (!mythosId) {
      throw new Error(
        "That Which Consumes is missing current Mythos.",
      );
    }

    const mythos =
      getMythosById(
        mythosId,
      );

    return {
      ...currentGame,

      board: {
        ...currentGame.board,

        mythosDiscard: [
          ...currentGame.board.mythosDiscard,
          mythos,
        ],
      },

      currentMythosId:
        null,
    };
  }

  /*
   * ============================================================
   * NORMAL SPACE SELECTION
   * ============================================================
   */
  let currentGame: GameState = {
    ...game,

    pendingDecision: null,
  };

  const effects =
    decision.onSpaceSelected;

  if (
    effects.length > 0
  ) {
    const resolvedEffects =
      effects.map((effect) => ({
        ...effect,

        spaceId:
          effect.spaceId ??
          spaceId,
      }));

    currentGame =
      resolveEncounterEffects(
        currentGame,
        game.activeInvestigatorId!,
        resolvedEffects,
        map,
      );
  }

  if (
    decision.onComplete &&
    decision.onComplete.length > 0
  ) {
    currentGame =
      resolveEncounterEffects(
        currentGame,
        game.activeInvestigatorId!,
        decision.onComplete,
        map,
      );
  }

  return currentGame;
}