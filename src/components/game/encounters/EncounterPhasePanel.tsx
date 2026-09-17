interface EncounterPhasePanelProps {
  investigatorName: string;
  investigatorPortrait: string;

  showStartEncounter: boolean;
  showEndEncounter: boolean;

  onStartEncounter: () => void;
  onEndEncounter: () => void;
}

export default function EncounterPhasePanel({
  investigatorName,
  investigatorPortrait,
  showStartEncounter,
  showEndEncounter,
  onStartEncounter,
  onEndEncounter,
}: EncounterPhasePanelProps) {
  return (
    <>
      {/* ================================================== */}
      {/* START ENCOUNTER */}
      {/* ================================================== */}

      {showStartEncounter && (
        <div className="mt-3 rounded-2xl border border-amber-800 bg-amber-950/30 p-5 shadow-xl">
          <div className="flex flex-col items-center gap-5 text-center">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
                Encounter Phase
              </p>

              <h2 className="mt-1 text-xl font-black text-white">
                {investigatorName}
              </h2>
            </div>

            {/* INVESTIGATOR PORTRAIT */}

            {investigatorPortrait && (
              <img
                src={investigatorPortrait}
                alt={investigatorName}
                className="h-28 w-28 rounded-full border-2 border-amber-700 object-cover shadow-xl"
              />
            )}

            <p className="text-sm text-gray-400">
              It is {investigatorName}'s Encounter turn.
            </p>

            <button
              type="button"
              onClick={onStartEncounter}
              className="rounded-xl bg-amber-700 px-6 py-3 font-bold text-white transition hover:bg-amber-600"
            >
              Start Encounter
            </button>

          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* END ENCOUNTER */}
      {/* ================================================== */}

      {showEndEncounter && (
        <div className="pointer-events-none fixed inset-0 z-90 flex items-end justify-center p-6">
          <div className="pointer-events-auto rounded-2xl border border-gray-700 bg-[#17191f] p-5 shadow-2xl">

            <div className="text-center">

              <p className="text-sm uppercase tracking-widest text-gray-500">
                Encounter Complete
              </p>

              <p className="mt-2 text-lg font-bold text-white">
                The investigator's Encounter is complete.
              </p>

              <button
                type="button"
                onClick={onEndEncounter}
                className="mt-4 rounded-xl bg-red-700 px-8 py-3 font-bold text-white transition hover:bg-red-600"
              >
                End Encounter
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}