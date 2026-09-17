import {
  useState,
} from "react";

import {
  deleteManualGame,
  getSavedGames,
} from "../../game/persistence/gameSaves";

interface HomeScreenProps {
  onNewGame: () => void;

  onContinueGame: (
    saveId: string,
  ) => void;
}

export default function HomeScreen({
  onNewGame,
  onContinueGame,
}: HomeScreenProps) {
  /*
   * ============================================================
   * SAVED GAMES
   * ============================================================
   */

  const [
    saves,
    setSaves,
  ] = useState(
    () => getSavedGames(),
  );

  /*
   * ============================================================
   * DELETE SAVE
   * ============================================================
   */

  const [
    deleteSaveId,
    setDeleteSaveId,
  ] = useState<string | null>(
    null,
  );

  /*
   * ============================================================
   * AUTO SAVE
   * ============================================================
   */

  const autoSave =
    saves.find(
      (save) =>
        save.type === "auto",
    );

  /*
   * ============================================================
   * MANUAL SAVES
   * ============================================================
   */

  const manualSaves =
    saves.filter(
      (save) =>
        save.type === "manual",
    );

  /*
   * ============================================================
   * DELETE
   * ============================================================
   */

  function handleDeleteSave() {
    if (!deleteSaveId) {
      return;
    }

    deleteManualGame(
      deleteSaveId,
    );

    setSaves(
      getSavedGames(),
    );

    setDeleteSaveId(
      null,
    );
  }

  /*
   * ============================================================
   * SELECT SAVE TO DELETE
   * ============================================================
   */

  const saveToDelete =
    deleteSaveId
      ? saves.find(
          (save) =>
            save.id ===
            deleteSaveId,
        )
      : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111318] px-4 text-white">

      <div className="w-full max-w-xl text-center">

        {/* ================================================== */}
        {/* TITLE */}
        {/* ================================================== */}

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-red-400">
          Eldritch Horror
        </p>

        <h1 className="text-5xl font-black tracking-tight">
          Online Companion
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          A digital companion for your
          Eldritch Horror game.
        </p>

        {/* ================================================== */}
        {/* MAIN ACTIONS */}
        {/* ================================================== */}

        <div className="mx-auto mt-12 flex max-w-sm flex-col gap-3">

          {/* ================================================= */}
          {/* NEW GAME */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={
              onNewGame
            }
            className="rounded-xl border border-blue-500 bg-blue-600 px-6 py-4 text-sm font-black uppercase tracking-wide transition hover:bg-blue-500"
          >
            New Game
          </button>

          {/* ================================================= */}
          {/* CONTINUE GAME */}
          {/* ================================================= */}

          <button
            type="button"
            disabled={
              !autoSave
            }
            onClick={() => {
              if (!autoSave) {
                return;
              }

              onContinueGame(
                autoSave.id,
              );
            }}
            className={[
              "rounded-xl border px-6 py-4 text-sm font-black uppercase tracking-wide transition",

              autoSave
                ? "border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                : "cursor-not-allowed border-slate-800 bg-slate-900 text-slate-600",
            ].join(" ")}
          >
            Continue Game
          </button>

        </div>

        {/* ================================================== */}
        {/* AUTO SAVE INFORMATION */}
        {/* ================================================== */}

        {autoSave && (
          <div className="mx-auto mt-5 max-w-sm text-left">

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Last Auto Save
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-300">
                {new Date(
                  autoSave.savedAt,
                ).toLocaleString()}
              </p>

            </div>

          </div>
        )}

        {/* ================================================== */}
        {/* MANUAL SAVES */}
        {/* ================================================== */}

        {manualSaves.length >
          0 && (
          <div className="mx-auto mt-8 max-w-xl text-left">

            <div className="mb-3 flex items-center justify-between">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Saved Games
              </p>

              <span className="text-[10px] uppercase tracking-wider text-slate-700">
                {
                  manualSaves.length
                }{" "}
                {
                  manualSaves.length ===
                  1
                    ? "save"
                    : "saves"
                }
              </span>

            </div>

            <div className="space-y-2">

              {manualSaves.map(
                (save) => (
                  <div
                    key={
                      save.id
                    }
                    className="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 transition hover:border-slate-500 hover:bg-slate-800"
                  >

                    {/* ================================== */}
                    {/* SAVE INFORMATION */}
                    {/* ================================== */}

                    <div className="min-w-0">

                      <p className="truncate text-sm font-bold text-white">
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

                    {/* ================================== */}
                    {/* ACTIONS */}
                    {/* ================================== */}

                    <div className="ml-3 flex shrink-0 items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          onContinueGame(
                            save.id,
                          )
                        }
                        className="rounded-md px-3 py-2 text-xs font-bold uppercase text-blue-400 transition hover:bg-slate-700 hover:text-blue-300"
                      >
                        Load
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteSaveId(
                            save.id,
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-slate-500 transition hover:bg-red-950/40 hover:text-red-400"
                        title="Delete Save"
                        aria-label={`Delete ${save.name}`}
                      >
                        🗑
                      </button>

                    </div>

                  </div>
                ),
              )}

            </div>

          </div>
        )}

      </div>

      {/* ====================================================== */}
      {/* DELETE SAVE MODAL */}
      {/* ====================================================== */}

      {saveToDelete && (
        <div
          className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 p-4"
          onClick={() =>
            setDeleteSaveId(
              null,
            )
          }
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#111722] p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ============================================== */}
            {/* TITLE */}
            {/* ============================================== */}

            <h2 className="text-xl font-bold text-white">
              Delete Saved Game
            </h2>

            {/* ============================================== */}
            {/* MESSAGE */}
            {/* ============================================== */}

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Are you sure you want to
              delete{" "}
              <span className="font-bold text-white">
                "{saveToDelete.name}"
              </span>
              ?
            </p>

            <p className="mt-2 text-sm text-slate-500">
              This action cannot be undone.
            </p>

            {/* ============================================== */}
            {/* ACTIONS */}
            {/* ============================================== */}

            <div className="mt-6 flex justify-end gap-2">

              <button
                type="button"
                onClick={() =>
                  setDeleteSaveId(
                    null,
                  )
                }
                className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2 text-sm font-bold text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={
                  handleDeleteSave
                }
                className="rounded-lg bg-red-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-500"
              >
                DELETE
              </button>

            </div>

          </div>
        </div>
      )}

    </main>
  );
}