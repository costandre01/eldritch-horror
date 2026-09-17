import type { GameState } from "../models/GameState";
import type { MapDefinition } from "../models/MapDefinition";

import { spawnEpicMonsterAtSpace } from "./spawnEpicMonsterAtSpace";

function setMysteryTokenSpace(
  game: GameState,
  mysteryId: string,
  spaceId: string,
): GameState {
  if (!game.board.spaces[spaceId]) {
    throw new Error(
      `Cannot place Mystery token: space "${spaceId}" does not exist.`,
    );
  }

  const progress =
    game.mysteries.progress[mysteryId];

  if (!progress) {
    throw new Error(
      `Mystery progress "${mysteryId}" does not exist.`,
    );
  }

  return {
    ...game,

    mysteries: {
      ...game.mysteries,

      progress: {
        ...game.mysteries.progress,

        [mysteryId]: {
          ...progress,

          mysteryTokenSpaceId:
            spaceId,
        },
      },
    },
  };
}

function placeRandomEldritchTokens(
  game: GameState,
  map: MapDefinition,
  mysteryId: string,
): GameState {
  const progress =
    game.mysteries.progress[mysteryId];

  if (!progress) {
    throw new Error(
      `Mystery progress "${mysteryId}" does not exist.`,
    );
  }

  const investigatorCount =
    Object.keys(game.investigators).length;

  const tokenCount = Math.ceil(
    investigatorCount / 2,
  );

  /*
   * The True Name:
   * place Eldritch tokens on random spaces.
   *
   * Each selected space receives one token.
   */
  const availableSpaceIds =
    map.spaces.map(
      (space) => space.id,
    );

  /*
   * Shuffle spaces randomly.
   */
  for (
    let i = availableSpaceIds.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1),
    );

    [
      availableSpaceIds[i],
      availableSpaceIds[j],
    ] = [
      availableSpaceIds[j],
      availableSpaceIds[i],
    ];
  }

  /*
   * Select the required number of random spaces.
   */
  const selectedSpaceIds =
    availableSpaceIds.slice(
      0,
      Math.min(
        tokenCount,
        availableSpaceIds.length,
      ),
    );

  const updatedSpaces = {
    ...game.board.spaces,
  };

  const placedTokenSpaceIds: string[] = [];

  for (const spaceId of selectedSpaceIds) {
    const space =
      updatedSpaces[spaceId];

    if (!space) {
      continue;
    }

    updatedSpaces[spaceId] = {
      ...space,

      eldritchTokenCount:
        space.eldritchTokenCount + 1,
    };

    placedTokenSpaceIds.push(
      spaceId,
    );
  }

  return {
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

          eldritchTokenCount:
            progress.eldritchTokenCount +
            placedTokenSpaceIds.length,

          eldritchTokenSpaceIds: [
            ...progress.eldritchTokenSpaceIds,
            ...placedTokenSpaceIds,
          ],
        },
      },
    },
  };
}

function placeDeepOnesAttackTokens(
  game: GameState,
  map: MapDefinition,
  mysteryId: string,
): GameState {
  const progress =
    game.mysteries.progress[mysteryId];

  if (!progress) {
    throw new Error(
      `Mystery progress "${mysteryId}" does not exist.`,
    );
  }

  const investigatorIds =
    game.investigatorOrder;

  return processNextDeepOnesInvestigator(
    game,
    map,
    mysteryId,
    investigatorIds,
    0,
  );
}

function processNextDeepOnesInvestigator(
  game: GameState,
  map: MapDefinition,
  mysteryId: string,
  investigatorIds: string[],
  currentInvestigatorIndex: number,
): GameState {
  /*
   * All investigators have been processed.
   */
  if (
    currentInvestigatorIndex >=
    investigatorIds.length
  ) {
    return game;
  }

  const investigatorId =
    investigatorIds[
      currentInvestigatorIndex
    ];

  if (!investigatorId) {
    return processNextDeepOnesInvestigator(
      game,
      map,
      mysteryId,
      investigatorIds,
      currentInvestigatorIndex + 1,
    );
  }

  const investigator =
    game.investigators[
      investigatorId
    ];

  if (!investigator) {
    return processNextDeepOnesInvestigator(
      game,
      map,
      mysteryId,
      investigatorIds,
      currentInvestigatorIndex + 1,
    );
  }

  /*
   * An investigator without a space cannot
   * receive the effect.
   */
  if (!investigator.spaceId) {
    return processNextDeepOnesInvestigator(
      game,
      map,
      mysteryId,
      investigatorIds,
      currentInvestigatorIndex + 1,
    );
  }

  /*
   * Find every Sea space at the minimum
   * distance that does not already contain
   * an Eldritch Token.
   */
  const nearestSeaSpaceIds =
    findNearestSeaSpacesWithoutToken(
      map,
      game.board.spaces,
      investigator.spaceId,
    );

  if (
    nearestSeaSpaceIds.length === 0
  ) {
    return processNextDeepOnesInvestigator(
      game,
      map,
      mysteryId,
      investigatorIds,
      currentInvestigatorIndex + 1,
    );
  }

  /*
   * Exactly one valid Sea space.
   * Place the token automatically.
   */
  if (
    nearestSeaSpaceIds.length === 1
  ) {
    return placeDeepOnesTokenAndContinue(
      game,
      mysteryId,
      nearestSeaSpaceIds[0],
      investigatorIds,
      currentInvestigatorIndex,
      map,
    );
  }

  /*
   * Several equally near Sea spaces.
   *
   * The Lead Investigator chooses.
   */
  return {
    ...game,

    pendingDecision: {
      type: "select-space",

      title:
        "Choose a Sea Space",

      message:
        "The Eldritch Token can be placed on one of several equally near Sea spaces. The Lead Investigator must choose.",

      spaceIds:
        nearestSeaSpaceIds,

      source:
        "mystery:deep-ones-attack",

      onSpaceSelected: [],

      resume: {
        type:
          "mystery-deep-ones-attack",

        mysteryId,

        investigatorIds,

        currentInvestigatorIndex,
      },
    },
  };
}

function placeDeepOnesTokenAndContinue(
  game: GameState,
  mysteryId: string,
  spaceId: string,
  investigatorIds: string[],
  currentInvestigatorIndex: number,
  map: MapDefinition,
): GameState {
  const space =
    game.board.spaces[spaceId];

  if (!space) {
    throw new Error(
      `Cannot place Eldritch Token: space "${spaceId}" does not exist.`,
    );
  }

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
    ...space,

    eldritchTokenCount:
      space.eldritchTokenCount + 1,
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

          eldritchTokenCount:
            progress.eldritchTokenCount + 1,

          eldritchTokenSpaceIds: [
            ...progress.eldritchTokenSpaceIds,
            spaceId,
          ],
        },
      },
    },

    pendingDecision: null,
  };

  return processNextDeepOnesInvestigator(
    updatedGame,
    map,
    mysteryId,
    investigatorIds,
    currentInvestigatorIndex + 1,
  );
}

function findNearestSeaSpacesWithoutToken(
  map: MapDefinition,
  spaces: GameState["board"]["spaces"],
  startSpaceId: string,
): string[] {
  const visited = new Set<string>([
    startSpaceId,
  ]);

  const queue: {
    spaceId: string;
    distance: number;
  }[] = [
    {
      spaceId: startSpaceId,
      distance: 0,
    },
  ];

  let nearestDistance:
    number | null = null;

  const nearestSpaceIds: string[] = [];

  while (queue.length > 0) {
    const current =
      queue.shift();

    if (!current) {
      break;
    }

    if (
      nearestDistance !== null &&
      current.distance >
        nearestDistance
    ) {
      break;
    }

    const currentSpace =
      map.spaces.find(
        (space) =>
          space.id ===
          current.spaceId,
      );

    if (!currentSpace) {
      continue;
    }

    const currentGameSpace =
      spaces[current.spaceId];

    /*
     * Sea spaces are valid only if they
     * currently have no Eldritch Token.
     */
    if (
      currentSpace.type === "sea" &&
      (currentGameSpace
        ?.eldritchTokenCount ?? 0) === 0
    ) {
      if (
        nearestDistance === null
      ) {
        nearestDistance =
          current.distance;
      }

      if (
        current.distance ===
        nearestDistance
      ) {
        nearestSpaceIds.push(
          current.spaceId,
        );
      }

      continue;
    }

    /*
     * Once the minimum distance to a Sea
     * has been found, do not explore spaces
     * farther away.
     */
    if (
      nearestDistance !== null
    ) {
      continue;
    }

    for (const connectedSpaceId of
      currentSpace.connectedSpaceIds) {
      if (
        visited.has(
          connectedSpaceId,
        )
      ) {
        continue;
      }

      visited.add(
        connectedSpaceId,
      );

      queue.push({
        spaceId:
          connectedSpaceId,
        distance:
          current.distance + 1,
      });
    }
  }

  return nearestSpaceIds;
}

function placeRitualTokens(
  game: GameState,
  mysteryId: string,
): GameState {
  const spaceIds = [
    "space-4",
    "space-10",
    "space-21",
    "tunguska",
  ];

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

  const placedTokenSpaceIds: string[] = [];

  for (const spaceId of spaceIds) {
    const space =
      updatedSpaces[spaceId];

    if (!space) {
      throw new Error(
        `Cannot place Eldritch Token: space "${spaceId}" does not exist.`,
      );
    }

    updatedSpaces[spaceId] = {
      ...space,

      eldritchTokenCount:
        space.eldritchTokenCount + 1,
    };

    placedTokenSpaceIds.push(
      spaceId,
    );
  }

  return {
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

          eldritchTokenCount:
            progress.eldritchTokenCount +
            placedTokenSpaceIds.length,

          eldritchTokenSpaceIds: [
            ...progress.eldritchTokenSpaceIds,
            ...placedTokenSpaceIds,
          ],
        },
      },
    },
  };
}

function moveCluesToNearestSeaSpaces(
  game: GameState,
  map: MapDefinition,
  mysteryId: string,
): GameState {
  const progress =
    game.mysteries.progress[mysteryId];

  if (!progress) {
    throw new Error(
      `Mystery progress "${mysteryId}" does not exist.`,
    );
  }

  const cluesToMove: {
    clueTokenId: string;
    sourceSpaceId: string;
  }[] = [];

  /*
   * Create a snapshot of all Clues currently
   * on the board.
   */
  for (const space of map.spaces) {
    const currentSpace =
      game.board.spaces[space.id];

    if (!currentSpace) {
      continue;
    }

    for (const clueTokenId of
      currentSpace.clueTokenIds) {
      cluesToMove.push({
        clueTokenId,
        sourceSpaceId: space.id,
      });
    }
  }

  if (cluesToMove.length === 0) {
    return game;
  }

  return processNextSeaClue(
    game,
    map,
    mysteryId,
    cluesToMove,
  );
}

function processNextSeaClue(
  game: GameState,
  map: MapDefinition,
  mysteryId: string,
  cluesToMove: {
    clueTokenId: string;
    sourceSpaceId: string;
  }[],
): GameState {
  if (cluesToMove.length === 0) {
    return game;
  }

  const [
    currentClue,
    ...remainingClues
  ] = cluesToMove;

  const nearestSeaSpaceIds =
    findNearestSeaSpaces(
      map,
      currentClue.sourceSpaceId,
    );

  if (nearestSeaSpaceIds.length === 0) {
    return processNextSeaClue(
      game,
      map,
      mysteryId,
      remainingClues,
    );
  }

  /*
   * Exactly one nearest Sea.
   * Move automatically.
   */
  if (
    nearestSeaSpaceIds.length === 1
  ) {
    const destinationSpaceId =
      nearestSeaSpaceIds[0];

    const sourceSpace =
      game.board.spaces[
        currentClue.sourceSpaceId
      ];

    const destinationSpace =
      game.board.spaces[
        destinationSpaceId
      ];

    if (
      !sourceSpace ||
      !destinationSpace
    ) {
      return game;
    }

    const updatedSpaces = {
      ...game.board.spaces,
    };

    updatedSpaces[
      currentClue.sourceSpaceId
    ] = {
      ...sourceSpace,

      clues:
        sourceSpace.clues - 1,

      clueTokenIds:
        sourceSpace.clueTokenIds.filter(
          (id) =>
            id !==
            currentClue.clueTokenId,
        ),
    };

    updatedSpaces[
      destinationSpaceId
    ] = {
      ...destinationSpace,

      clues:
        destinationSpace.clues + 1,

      clueTokenIds: [
        ...destinationSpace.clueTokenIds,
        currentClue.clueTokenId,
      ],
    };

    return processNextSeaClue(
      {
        ...game,

        board: {
          ...game.board,

          spaces: updatedSpaces,
        },
      },
      map,
      mysteryId,
      remainingClues,
    );
  }

  /*
   * Two or more Sea spaces are equally near.
   *
   * The Lead Investigator chooses.
   */
  const leadInvestigatorId =
    game.investigatorOrder[0];

  if (!leadInvestigatorId) {
    throw new Error(
      "There is no Lead Investigator.",
    );
  }

  return {
    ...game,

    pendingDecision: {
      type: "select-space",

      title:
        "Choose a Sea Space",

      message:
        "The Clue can be moved to one of several equally near Sea spaces. The Lead Investigator must choose.",

      spaceIds:
        nearestSeaSpaceIds,

      source:
        "mystery:nearest-clue",

      onSpaceSelected: [],

      resume: {
        type:
            "mystery-nearest-clue",

        mysteryId,

        clueTokenId:
            currentClue.clueTokenId,

        sourceSpaceId:
            currentClue.sourceSpaceId,

        remainingClues,
        },
    },
  };
}

function findNearestSeaSpaces(
  map: MapDefinition,
  startSpaceId: string,
): string[] {
  const visited = new Set<string>([
    startSpaceId,
  ]);

  const queue: {
    spaceId: string;
    distance: number;
  }[] = [
    {
      spaceId: startSpaceId,
      distance: 0,
    },
  ];

  let nearestDistance: number | null =
    null;

  const nearestSpaceIds: string[] = [];

  while (queue.length > 0) {
    const current =
      queue.shift();

    if (!current) {
      break;
    }

    if (
      nearestDistance !== null &&
      current.distance > nearestDistance
    ) {
      break;
    }

    const currentSpace =
      map.spaces.find(
        (space) =>
          space.id === current.spaceId,
      );

    if (!currentSpace) {
      continue;
    }

    if (
      currentSpace.type === "sea"
    ) {
      if (
        nearestDistance === null
      ) {
        nearestDistance =
          current.distance;
      }

      if (
        current.distance ===
        nearestDistance
      ) {
        nearestSpaceIds.push(
          current.spaceId,
        );
      }

      continue;
    }

    for (const connectedSpaceId of
      currentSpace.connectedSpaceIds) {
      if (
        visited.has(
          connectedSpaceId,
        )
      ) {
        continue;
      }

      visited.add(
        connectedSpaceId,
      );

      queue.push({
        spaceId:
          connectedSpaceId,
        distance:
          current.distance + 1,
      });
    }
  }

  return nearestSpaceIds;
}

function moveCluesToNearestWildernessOrSeaSpaces(
  game: GameState,
  map: MapDefinition,
  mysteryId: string,
): GameState {
  const progress =
    game.mysteries.progress[mysteryId];

  if (!progress) {
    throw new Error(
      `Mystery progress "${mysteryId}" does not exist.`,
    );
  }

  const cluesToMove: {
    clueTokenId: string;
    sourceSpaceId: string;
  }[] = [];

  /*
   * Create a snapshot of all Clues currently
   * on the board.
   */
  for (const space of map.spaces) {
    const currentSpace =
      game.board.spaces[space.id];

    if (!currentSpace) {
      continue;
    }

    for (const clueTokenId of
      currentSpace.clueTokenIds) {
      cluesToMove.push({
        clueTokenId,
        sourceSpaceId: space.id,
      });
    }
  }

  if (cluesToMove.length === 0) {
    return game;
  }

  return processNextWildernessOrSeaClue(
    game,
    map,
    mysteryId,
    cluesToMove,
  );
}

function processNextWildernessOrSeaClue(
  game: GameState,
  map: MapDefinition,
  mysteryId: string,
  cluesToMove: {
    clueTokenId: string;
    sourceSpaceId: string;
  }[],
): GameState {
  if (cluesToMove.length === 0) {
    return game;
  }

  const [
    currentClue,
    ...remainingClues
  ] = cluesToMove;

  const nearestDestinationSpaceIds =
    findNearestWildernessOrSeaSpaces(
      map,
      currentClue.sourceSpaceId,
    );

  if (
    nearestDestinationSpaceIds.length === 0
  ) {
    return processNextWildernessOrSeaClue(
      game,
      map,
      mysteryId,
      remainingClues,
    );
  }

  /*
   * Exactly one nearest Wilderness or Sea.
   */
  if (
    nearestDestinationSpaceIds.length === 1
  ) {
    const destinationSpaceId =
      nearestDestinationSpaceIds[0];

    const sourceSpace =
      game.board.spaces[
        currentClue.sourceSpaceId
      ];

    const destinationSpace =
      game.board.spaces[
        destinationSpaceId
      ];

    if (
      !sourceSpace ||
      !destinationSpace
    ) {
      return game;
    }

    const updatedSpaces = {
      ...game.board.spaces,
    };

    updatedSpaces[
      currentClue.sourceSpaceId
    ] = {
      ...sourceSpace,

      clues:
        sourceSpace.clues - 1,

      clueTokenIds:
        sourceSpace.clueTokenIds.filter(
          (id) =>
            id !==
            currentClue.clueTokenId,
        ),
    };

    updatedSpaces[
      destinationSpaceId
    ] = {
      ...destinationSpace,

      clues:
        destinationSpace.clues + 1,

      clueTokenIds: [
        ...destinationSpace.clueTokenIds,
        currentClue.clueTokenId,
      ],
    };

    return processNextWildernessOrSeaClue(
      {
        ...game,

        board: {
          ...game.board,

          spaces: updatedSpaces,
        },
      },
      map,
      mysteryId,
      remainingClues,
    );
  }

  /*
   * Tie:
   * the Lead Investigator chooses.
   */
  const leadInvestigatorId =
    game.investigatorOrder[0];

  if (!leadInvestigatorId) {
    throw new Error(
      "There is no Lead Investigator.",
    );
  }

  return {
    ...game,

    pendingDecision: {
      type: "select-space",

      title:
        "Choose a Wilderness or Sea Space",

      message:
        "The Clue can be moved to one of several equally near Wilderness or Sea spaces. The Lead Investigator must choose.",

      spaceIds:
        nearestDestinationSpaceIds,

      source:
        "mystery:nearest-clue",

      onSpaceSelected: [],

      resume: {
        type:
            "mystery-nearest-clue",

        mysteryId,

        clueTokenId:
            currentClue.clueTokenId,

        sourceSpaceId:
            currentClue.sourceSpaceId,

        remainingClues,
        },
    },
  };
}

function findNearestWildernessOrSeaSpaces(
  map: MapDefinition,
  startSpaceId: string,
): string[] {
  const visited = new Set<string>([
    startSpaceId,
  ]);

  const queue: {
    spaceId: string;
    distance: number;
  }[] = [
    {
      spaceId: startSpaceId,
      distance: 0,
    },
  ];

  let nearestDistance: number | null =
    null;

  const nearestSpaceIds: string[] = [];

  while (queue.length > 0) {
    const current =
      queue.shift();

    if (!current) {
      break;
    }

    if (
      nearestDistance !== null &&
      current.distance > nearestDistance
    ) {
      break;
    }

    const currentSpace =
      map.spaces.find(
        (space) =>
          space.id === current.spaceId,
      );

    if (!currentSpace) {
      continue;
    }

    if (
      currentSpace.type ===
        "wilderness" ||
      currentSpace.type === "sea"
    ) {
      if (
        nearestDistance === null
      ) {
        nearestDistance =
          current.distance;
      }

      if (
        current.distance ===
        nearestDistance
      ) {
        nearestSpaceIds.push(
          current.spaceId,
        );
      }

      continue;
    }

    for (const connectedSpaceId of
      currentSpace.connectedSpaceIds) {
      if (
        visited.has(
          connectedSpaceId,
        )
      ) {
        continue;
      }

      visited.add(
        connectedSpaceId,
      );

      queue.push({
        spaceId:
          connectedSpaceId,
        distance:
          current.distance + 1,
      });
    }
  }

  return nearestSpaceIds;
}

export function resumeMysteryNearestClue(
  game: GameState,
  map: MapDefinition,
  mysteryId: string,
  remainingClues: {
    clueTokenId: string;
    sourceSpaceId: string;
  }[],
): GameState {
  if (mysteryId === "cthulhu-the-stars-are-right") {
    return processNextSeaClue(
      game,
      map,
      mysteryId,
      remainingClues,
    );
  }

  if (
    mysteryId ===
    "shub-niggurath-nature-of-the-all-mother"
  ) {
    return processNextWildernessOrSeaClue(
      game,
      map,
      mysteryId,
      remainingClues,
    );
  }

  return game;
}

export function resumeDeepOnesAttack(
  game: GameState,
  map: MapDefinition,
  mysteryId: string,
  investigatorIds: string[],
  currentInvestigatorIndex: number,
): GameState {
  return processNextDeepOnesInvestigator(
    game,
    map,
    mysteryId,
    investigatorIds,
    currentInvestigatorIndex,
  );
}

export function resolveMysteryEnterPlay(
  game: GameState,
  map: MapDefinition,
): GameState {
  const mysteryId =
    game.mysteries.activeMysteryId;

  if (!mysteryId) {
    return game;
  }

  switch (mysteryId) {
    /*
     * ============================================================
     * AZATHOTH
     * ============================================================
     */

    case "azathoth-seed-of-the-daemon-sultan":
      return setMysteryTokenSpace(
        game,
        mysteryId,
        "tunguska",
      );

    case "azathoth-the-true-name":
      return placeRandomEldritchTokens(
        game,
        map,
        mysteryId,
      );

    /*
     * ============================================================
     * CTHULHU
     * ============================================================
     */

    case "cthulhu-rlyeh-risen":
      return setMysteryTokenSpace(
        game,
        mysteryId,
        "space-3",
      );

    case "cthulhu-the-deep-ones-attack":
      return placeDeepOnesAttackTokens(
        game,
        map,
        mysteryId,
      );

    case "cthulhu-the-stars-are-right":
      return moveCluesToNearestSeaSpaces(
        game,
        map,
        mysteryId,
      );

    case "cthulhu-watching-the-stars":
      return spawnEpicMonsterAtSpace(
        game,
        map,
        "space-12",
        "cthylla",
      );

    /*
     * ============================================================
     * SHUB-NIGGURATH
     * ============================================================
     */

    case "shub-niggurath-hunting-the-thousand":
      /*
       * No immediate "When this Mystery enters play" effect.
       */
      return game;

    case "shub-niggurath-nature-of-the-all-mother":
      return moveCluesToNearestWildernessOrSeaSpaces(
        game,
        map,
        mysteryId,
      );

    case "shub-niggurath-rituals-in-the-wild":
      return placeRitualTokens(
        game,
        mysteryId,
      );

    case "shub-niggurath-spawn-of-the-black-goat":
      return spawnEpicMonsterAtSpace(
        game,
        map,
        "the-amazon",
        "nug",
      );

    /*
     * ============================================================
     * YOG-SOTHOTH
     * ============================================================
     */

    case "yog-sothoth-arcane-understanding":
      /*
       * No immediate "When this Mystery enters play" effect.
       */
      return game;

    case "yog-sothoth-spawn-of-yog-sothoth":
      return spawnEpicMonsterAtSpace(
        game,
        map,
        "arkham",
        "dunwich-horror",
      );

    case "yog-sothoth-the-beyond-one":
      /*
       * No immediate "When this Mystery enters play" effect.
       */
      return game;

    case "yog-sothoth-where-the-old-ones-broke-through":
      /*
       * No immediate "When this Mystery enters play" effect.
       */
      return game;

    default:
      return game;
  }
}