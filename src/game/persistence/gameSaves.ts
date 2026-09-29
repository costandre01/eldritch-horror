import type { GameState } from "../models/GameState";
import type { Skill } from "../models/Investigator";
import { coreInvestigators } from "../../content/core/investigators";

const STORAGE_KEY =
  "eldritch-horror-saves";

const SESSION_KEY =
  "eldritch-horror-active-session";

const SAVE_VERSION = 3;

export interface SavedGame {
  id: string;
  name: string;
  type: "auto" | "manual";
  savedAt: string;
  version: number;
  game: GameState;
}

interface SaveStorage {
  auto: SavedGame | null;
  manual: SavedGame[];
}

/*
 * ============================================================
 * EMPTY STORAGE
 * ============================================================
 */

function getEmptyStorage(): SaveStorage {
  return {
    auto: null,
    manual: [],
  };
}

/*
 * ============================================================
 * LOAD STORAGE
 * ============================================================
 */

function loadStorage(): SaveStorage {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return getEmptyStorage();
    }

    const parsed =
      JSON.parse(raw) as Partial<SaveStorage>;

    return {
      auto:
        parsed.auto ?? null,

      manual:
        Array.isArray(
          parsed.manual,
        )
          ? parsed.manual
          : [],
    };
  } catch (error) {
    console.error(
      "Failed to load saved games:",
      error,
    );

    return getEmptyStorage();
  }
}

/*
 * ============================================================
 * WRITE STORAGE
 * ============================================================
 */

function writeStorage(
  storage: SaveStorage,
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(storage),
  );
}

/*
 * ============================================================
 * AUTO SAVE
 * ============================================================
 *
 * There is ALWAYS at most one Auto Save.
 *
 * Every new Auto Save replaces the previous one.
 */

export function saveAutoGame(
  game: GameState,
) {
  const storage =
    loadStorage();

  storage.auto = {
    id: "auto",

    name:
      "Auto Save",

    type:
      "auto",

    savedAt:
      new Date().toISOString(),

    version:
      SAVE_VERSION,

    game,
  };

  writeStorage(storage);
}

/*
 * ============================================================
 * MANUAL SAVE
 * ============================================================
 *
 * Creates a new manual save.
 *
 * Manual saves are independent from Auto Save.
 */

export function saveManualGame(
  game: GameState,
  name: string,
): SavedGame {
  const storage =
    loadStorage();

  const save: SavedGame = {
    id:
      typeof crypto !==
        "undefined" &&
      typeof crypto.randomUUID ===
        "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,

    name:
      name.trim() ||
      "Unnamed Game",

    type:
      "manual",

    savedAt:
      new Date().toISOString(),

    version:
      SAVE_VERSION,

    game,
  };

  storage.manual = [
    save,
    ...storage.manual,
  ];

  writeStorage(storage);

  return save;
}

/*
 * ============================================================
 * UPDATE MANUAL SAVE
 * ============================================================
 *
 * Replaces an existing manual save.
 *
 * The save keeps the same ID but receives:
 *
 * - the new GameState
 * - the new name
 * - the new save date
 *
 * Returns null if the save does not exist.
 */

export function updateManualGame(
  id: string,
  game: GameState,
  name: string,
): SavedGame | null {
  const storage =
    loadStorage();

  const index =
    storage.manual.findIndex(
      (save) =>
        save.id === id,
    );

  if (index === -1) {
    return null;
  }

  const existingSave =
    storage.manual[index];

  if (!existingSave) {
    return null;
  }

  const updatedSave: SavedGame = {
    ...existingSave,

    name:
      name.trim() ||
      existingSave.name,

    savedAt:
      new Date().toISOString(),

    version:
      SAVE_VERSION,

    game,
  };

  storage.manual[index] =
    updatedSave;

  writeStorage(storage);

  return updatedSave;
}

/*
 * ============================================================
 * FIND MANUAL SAVE BY NAME
 * ============================================================
 *
 * Used by the Save dialog to detect whether the player
 * already has a manual save with the same name.
 */

export function findManualSaveByName(
  name: string,
): SavedGame | null {
  const storage =
    loadStorage();

  const normalizedName =
    name.trim().toLowerCase();

  if (!normalizedName) {
    return null;
  }

  return (
    storage.manual.find(
      (save) =>
        save.name
          .trim()
          .toLowerCase() ===
        normalizedName,
    ) ?? null
  );
}

/*
 * ============================================================
 * GET SAVED GAMES
 * ============================================================
 */

export function getSavedGames(): SavedGame[] {
  const storage =
    loadStorage();

  const saves: SavedGame[] = [];

  if (storage.auto) {
    saves.push(
      storage.auto,
    );
  }

  saves.push(
    ...storage.manual,
  );

  return saves.sort(
    (a, b) =>
      new Date(
        b.savedAt,
      ).getTime() -
      new Date(
        a.savedAt,
      ).getTime(),
  );
}

/*
 * ============================================================
 * LOAD SAVED GAME
 * ============================================================
 */

export function loadSavedGame(
  id: string,
): GameState | null {
  const saves =
    getSavedGames();

  const save =
    saves.find(
      (item) =>
        item.id === id,
    );

  if (!save) {
    return null;
  }

  let game: GameState = {
    ...save.game,

    epicMonstersDefeated:
      save.game.epicMonstersDefeated ??
      [],
  };

  /* Version 1 stored only a numeric Clue count on investigators. */
  let cluePool = [...(game.board.cluePool ?? [])];
  const investigators = { ...game.investigators };
  let migratedClues = false;
  for (const [investigatorId, investigator] of Object.entries(investigators)) {
    if (Object.prototype.hasOwnProperty.call(investigator, "clueTokens")) continue;
    const clueTokens = cluePool.slice(0, investigator.clues);
    cluePool = cluePool.slice(clueTokens.length);
    investigators[investigatorId] = { ...investigator, clueTokens };
    migratedClues = true;
  }
  let migratedImprovements = false;
  const skills: Skill[] = ["lore", "influence", "observation", "strength", "will"];
  for (const [investigatorId, investigator] of Object.entries(investigators)) {
    if (Object.prototype.hasOwnProperty.call(investigator, "improvementTokens")) continue;
    const definition = coreInvestigators.find((candidate) => candidate.id === investigator.definitionId);
    const improvementTokens: NonNullable<typeof investigator.improvementTokens> = {};
    const baseSkills = { ...investigator.skills };
    if (definition) {
      for (const skill of skills) {
        const gained = Math.max(0, investigator.skills[skill] - definition.skills[skill]);
        if (gained > 0) {
          improvementTokens[skill] = Math.min(2, gained) as 1 | 2;
          baseSkills[skill] = definition.skills[skill];
        }
      }
    }
    investigators[investigatorId] = {
      ...investigator,
      skills: baseSkills,
      improvementTokens,
    };
    migratedImprovements = true;
  }

  if (migratedClues || migratedImprovements) {
    game = {
      ...game,
      investigators,
      board: migratedClues ? { ...game.board, cluePool } : game.board,
    };
  }

  return game;
}

/*
 * ============================================================
 * DELETE MANUAL SAVE
 * ============================================================
 *
 * Auto Save cannot be deleted through this function.
 */

export function deleteManualGame(
  id: string,
) {
  const storage =
    loadStorage();

  storage.manual =
    storage.manual.filter(
      (save) =>
        save.id !== id,
    );

  writeStorage(storage);
}

/*
 * ============================================================
 * ACTIVE SESSION
 * ============================================================
 *
 * true:
 *   Opening/F5 should restore the Auto Save.
 *
 * false:
 *   Opening the application should show Home.
 *
 * IMPORTANT:
 *
 * Closing the browser does NOT change this value.
 *
 * Only Exit calls exitSavedSession().
 */

export function setActiveSession(
  active: boolean,
) {
  localStorage.setItem(
    SESSION_KEY,
    active
      ? "true"
      : "false",
  );
}

export function hasActiveSession(): boolean {
  return (
    localStorage.getItem(
      SESSION_KEY,
    ) === "true"
  );
}

/*
 * ============================================================
 * START / EXIT SESSION
 * ============================================================
 */

export function startSavedSession() {
  setActiveSession(true);
}

export function exitSavedSession() {
  setActiveSession(false);
}
