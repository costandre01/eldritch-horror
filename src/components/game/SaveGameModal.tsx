import {
  useState,
} from "react";

import {
  getSavedGames,
  type SavedGame,
} from "./../../game/persistence/gameSaves";

interface SaveGameModalProps {
  onSave: (
    name: string,
    replaceId?: string,
  ) => void;

  onClose: () => void;
}

export default function SaveGameModal({
  onSave,
  onClose,
}: SaveGameModalProps) {
  const [
    name,
    setName,
  ] = useState("");

  const [
    selectedSaveId,
    setSelectedSaveId,
  ] = useState<string | undefined>(
    undefined,
  );

  const [
    replaceSave,
    setReplaceSave,
  ] = useState<SavedGame | null>(
    null,
  );

  const saves =
    getSavedGames();

  const manualSaves =
    saves.filter(
      (save) =>
        save.type === "manual",
    );

  /*
   * ============================================================
   * SELECT EXISTING SAVE
   * ============================================================
   */

  function handleSelectSave(
    save: SavedGame,
  ) {
    setName(
      save.name,
    );

    setSelectedSaveId(
      save.id,
    );
  }

  /*
   * ============================================================
   * SAVE
   * ============================================================
   */

  function handleSave() {
    const trimmedName =
      name.trim();

    if (!trimmedName) {
      return;
    }

    /*
     * If the player selected an existing save,
     * ask whether it should be replaced.
     */

    if (selectedSaveId) {
      const selectedSave =
        manualSaves.find(
          (save) =>
            save.id ===
            selectedSaveId,
        );

      if (selectedSave) {
        setReplaceSave(
          selectedSave,
        );

        return;
      }
    }

    /*
     * Otherwise create a new save.
     */

    onSave(
      trimmedName,
    );
  }

  /*
   * ============================================================
   * REPLACE
   * ============================================================
   */

  function handleReplace() {
    if (!replaceSave) {
      return;
    }

    onSave(
      name.trim(),
      replaceSave.id,
    );
  }

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#111722] p-6 shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* ================================================== */}
        {/* REPLACE CONFIRMATION */}
        {/* ================================================== */}

        {replaceSave ? (
          <>
            <h2 className="text-xl font-bold text-white">
              Save Already Exists
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              A saved game named{" "}
              <span className="font-bold text-white">
                "{replaceSave.name}"
              </span>{" "}
              already exists.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Do you want to replace it?
            </p>

            <div className="mt-6 flex justify-end gap-2">

              <button
                type="button"
                onClick={() =>
                  setReplaceSave(null)
                }
                className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2 text-sm font-bold text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={
                  handleReplace
                }
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-500"
              >
                REPLACE
              </button>

            </div>
          </>
        ) : (
          <>
            {/* ============================================== */}
            {/* TITLE */}
            {/* ============================================== */}

            <h2 className="text-xl font-bold text-white">
              Save Game
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a name for this saved game.
            </p>

            {/* ============================================== */}
            {/* NAME */}
            {/* ============================================== */}

            <input
              autoFocus
              type="text"
              value={name}
              onChange={(event) => {
                setName(
                  event.target.value,
                );

                /*
                 * Once the player changes the name manually,
                 * it is no longer considered a selected save.
                 */

                setSelectedSaveId(
                  undefined,
                );
              }}
              onKeyDown={(event) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  handleSave();
                }

                if (
                  event.key ===
                  "Escape"
                ) {
                  onClose();
                }
              }}
              placeholder="Save name"
              maxLength={60}
              className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500"
            />

            {/* ============================================== */}
            {/* EXISTING SAVES */}
            {/* ============================================== */}

            {manualSaves.length >
              0 && (
              <div className="mt-6">

                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  Saved Games
                </p>

                <div className="max-h-52 space-y-2 overflow-y-auto pr-1">

                  {manualSaves.map(
                    (save) => {
                      const selected =
                        selectedSaveId ===
                        save.id;

                      return (
                        <button
                          type="button"
                          key={
                            save.id
                          }
                          onClick={() =>
                            handleSelectSave(
                              save,
                            )
                          }
                          className={[
                            "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition",

                            selected
                              ? "border-blue-500 bg-blue-950/40"
                              : "border-slate-700 bg-slate-900/70 hover:border-slate-500 hover:bg-slate-800",
                          ].join(
                            " ",
                          )}
                        >

                          <div className="min-w-0">

                            <p
                              className={[
                                "truncate text-sm font-bold",

                                selected
                                  ? "text-blue-300"
                                  : "text-white",
                              ].join(
                                " ",
                              )}
                            >
                              {
                                save.name
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {new Date(
                                save.savedAt,
                              ).toLocaleString()}
                            </p>

                          </div>

                          <span
                            className={[
                              "ml-3 shrink-0 text-[10px] font-bold uppercase",

                              selected
                                ? "text-blue-400"
                                : "text-slate-600",
                            ].join(
                              " ",
                            )}
                          >
                            {selected
                              ? "Selected"
                              : "Select"}
                          </span>

                        </button>
                      );
                    },
                  )}

                </div>

              </div>
            )}

            {/* ============================================== */}
            {/* AUTO SAVE INFORMATION */}
            {/* ============================================== */}

            {saves.some(
              (save) =>
                save.type ===
                "auto",
            ) && (
              <div className="mt-5 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Auto Save
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  The automatic save is managed separately.
                </p>

              </div>
            )}

            {/* ============================================== */}
            {/* ACTIONS */}
            {/* ============================================== */}

            <div className="mt-6 flex justify-end gap-2">

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2 text-sm font-bold text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={
                  !name.trim()
                }
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                SAVE
              </button>

            </div>
          </>
        )}

      </div>
    </div>
  );
}