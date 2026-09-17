import type { MysteryDefinition } from "../models/Mystery";
import type { MysteryState } from "../models/MysteryState";
import type { MysteryProgress } from "../models/MysteryProgress";

export function createMysteryState(
  mysteries: MysteryDefinition[],
  ancientOneId: string,
  random: () => number = Math.random,
): MysteryState {
  const availableMysteries = mysteries.filter(
    (mystery) => mystery.ancientOneId === ancientOneId,
  );

  if (availableMysteries.length !== 4) {
    throw new Error(
      `Ancient One "${ancientOneId}" must have exactly 4 Mysteries.`,
    );
  }

  const shuffled = [...availableMysteries];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  const selectedMysteries = shuffled;

  const progress: Record<
    string,
    MysteryProgress
  > = {};

  for (const mystery of selectedMysteries) {
    progress[mystery.id] = {
      mysteryId: mystery.id,

      clueTokenIds: [],

      eldritchTokenCount: 0,

      monsterIds: [],

      gateIds: [],

      mysteryTokenSpaceId: null,

      eldritchTokenSpaceIds: [],
    };
  }

  return {
    selectedMysteryIds: selectedMysteries.map(
      (mystery) => mystery.id,
    ),

    activeMysteryId: null,

    solvedMysteryIds: [],

    progress,
  };
}

export function revealNextMystery(
  state: MysteryState,
): MysteryState {
  /*
   * ============================================================
   * REVEAL NEXT MYSTERY
   * ============================================================
   *
   * selectedMysteryIds represents the shuffled Mystery deck.
   *
   * The first unresolved Mystery in deck order
   * becomes the active Mystery.
   */

  const nextMysteryId =
    state.selectedMysteryIds.find(
      (id) =>
        !state.solvedMysteryIds.includes(id) &&
        id !== state.activeMysteryId,
    ) ?? null;

  return {
    ...state,

    activeMysteryId:
      nextMysteryId,
  };
}

export function solveActiveMystery(
  state: MysteryState,
): MysteryState {
  if (!state.activeMysteryId) {
    throw new Error(
      "Cannot solve a Mystery when no Mystery is active.",
    );
  }

  if (
    state.solvedMysteryIds.includes(
      state.activeMysteryId,
    )
  ) {
    throw new Error(
      `Mystery "${state.activeMysteryId}" is already solved.`,
    );
  }

  const solvedMysteryIds = [
    ...state.solvedMysteryIds,
    state.activeMysteryId,
  ];

  const remainingMysteries =
    state.selectedMysteryIds.filter(
      (id) => !solvedMysteryIds.includes(id),
    );

  return {
    selectedMysteryIds:
      state.selectedMysteryIds,

    activeMysteryId:
      remainingMysteries[0] ?? null,

    solvedMysteryIds,

    progress: state.progress,
  };
}

export function hasSolvedAllMysteries(
  state: MysteryState,
): boolean {
  return state.solvedMysteryIds.length >= 3;
}

export function getActiveMystery(
  state: MysteryState,
  mysteries: MysteryDefinition[],
): MysteryDefinition | null {
  if (!state.activeMysteryId) {
    return null;
  }

  return (
    mysteries.find(
      (mystery) =>
        mystery.id === state.activeMysteryId,
    ) ?? null
  );
}

export function returnRandomSolvedMysteryToDeck(
  state: MysteryState,
  random: () => number = Math.random,
): MysteryState {
  if (state.solvedMysteryIds.length === 0) {
    throw new Error(
      "Cannot return a Mystery to the deck because no Mystery has been solved.",
    );
  }

  /*
   * Escolhe aleatoriamente um dos Mysteries resolvidos.
   */
  const randomIndex = Math.floor(
    random() * state.solvedMysteryIds.length,
  );

  const mysteryId =
    state.solvedMysteryIds[randomIndex];

  if (!mysteryId) {
    throw new Error(
      "Failed to select a solved Mystery.",
    );
  }

  /*
   * Remove-o da lista de Mysteries resolvidos.
   */
  const solvedMysteryIds =
    state.solvedMysteryIds.filter(
      (id) => id !== mysteryId,
    );

  /*
   * O Mystery continua a fazer parte dos
   * selectedMysteryIds, que funciona como o deck
   * dos Mysteries desta partida.
   */
  const selectedMysteryIds = [
    ...state.selectedMysteryIds,
  ];

  /*
   * Baralha o deck.
   */
  for (
    let i = selectedMysteryIds.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      random() * (i + 1),
    );

    [
      selectedMysteryIds[i],
      selectedMysteryIds[j],
    ] = [
      selectedMysteryIds[j],
      selectedMysteryIds[i],
    ];
  }

  /*
   * Se o Mystery que voltou ao deck era o ativo
   * (situação que normalmente não deverá acontecer),
   * não o deixamos marcado como ativo.
   */
  const activeMysteryId =
    state.activeMysteryId === mysteryId
      ? null
      : state.activeMysteryId;

  return {
    selectedMysteryIds,

    activeMysteryId,

    solvedMysteryIds,

    progress: state.progress,
  };
}