import type { EncounterDefinition } from "../../../game/models/Encounter";

interface EncounterModalProps {
  encounter: EncounterDefinition;
  encounterBackId: string | null;

  onResolve: () => void;
  onChoose: (choiceIndex: number) => void;
}

export default function EncounterModal({
  encounter,
  encounterBackId,
  onResolve,
  onChoose,
}: EncounterModalProps) {
  /*
   * ============================================================
   * ENCOUNTER CARD
   * ============================================================
   *
   * The card has already been selected.
   *
   * There is NO reveal step anymore.
   *
   * We immediately show the revealed side of the card.
   */

  const selectedBack =
    encounter.backs?.find(
      (back) =>
        back.id === encounterBackId,
    );

  const revealedImage =
    selectedBack?.backImage ??
    encounter.backImage ??
    encounter.frontImage;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[95vh] w-[min(92vw,900px)] flex-col items-center overflow-y-auto rounded-2xl border border-gray-700 bg-[#17191f] p-6 text-white shadow-2xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
            Encounter
          </p>

          <h2 className="mt-2 text-3xl font-black">
            {encounter.name}
          </h2>

          {encounter.type && (
            <div className="mt-3 inline-flex rounded-full bg-gray-800 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-400">
              {encounter.type}
            </div>
          )}
        </div>

        {/* ================================================== */}
        {/* REVEALED CARD */}
        {/* ================================================== */}

        {revealedImage && (
          <img
            src={revealedImage}
            alt={encounter.name}
            className="mt-6 max-h-[68vh] max-w-full rounded-xl object-contain shadow-2xl"
          />
        )}

        {/* ================================================== */}
        {/* ENCOUNTER TEXT */}
        {/* ================================================== */}

        {(encounter.initialText ||
          encounter.text) && (
          <div className="mt-6 w-full rounded-xl border border-gray-800 bg-gray-900/70 p-5">
            <p className="whitespace-pre-line text-base leading-7 text-gray-200">
              {encounter.initialText ??
                encounter.text}
            </p>
          </div>
        )}

        {/* ================================================== */}
        {/* OLD-STYLE CHOICES */}
        {/* ================================================== */}

        {encounter.choices &&
          encounter.choices.length > 0 && (
            <div className="mt-6 w-full space-y-3">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
                Choose an option
              </p>

              {encounter.choices.map(
                (choice, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      onChoose(index)
                    }
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 p-4 text-left font-semibold text-white transition hover:border-amber-500 hover:bg-gray-700"
                  >
                    <span className="mr-3 text-amber-400">
                      {index + 1}.
                    </span>

                    {choice.text}
                  </button>
                ),
              )}
            </div>
          )}

        {/* ================================================== */}
        {/* RESOLVE */}
        {/* ================================================== */}

        {encounter.effects &&
          encounter.effects.length > 0 && (
            <button
              type="button"
              onClick={onResolve}
              className="mt-6 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white transition hover:bg-blue-500"
            >
              Resolve Encounter
            </button>
          )}

      </div>
    </div>
  );
}