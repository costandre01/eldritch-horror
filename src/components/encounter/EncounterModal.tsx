import type { EncounterDefinition } from "../../game/models/Encounter";

interface EncounterModalProps {
  encounter: EncounterDefinition;
  onChoose: (choiceIndex: number) => void;
}

export default function EncounterModal({
  encounter,
  onChoose,
}: EncounterModalProps) {
  /*
   * ============================================================
   * CARD IMAGE
   * ============================================================
   *
   * The Encounter has already been selected.
   *
   * We no longer have a separate "reveal" step.
   *
   * Therefore:
   *
   * - backImage = actual Encounter card
   * - frontImage = physical card back
   *
   * The player sees the Encounter immediately.
   */

  const cardImage =
    encounter.backImage ??
    encounter.frontImage;

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-[min(92vw,800px)] overflow-y-auto rounded-2xl border border-gray-700 bg-[#17191f] p-8 text-white shadow-2xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
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
        {/* CARD IMAGE */}
        {/* ================================================== */}

        {cardImage && (
          <div className="mt-6 flex justify-center">

            <img
              src={cardImage}
              alt={encounter.name}
              className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-2xl"
            />

          </div>
        )}

        {/* ================================================== */}
        {/* ENCOUNTER TEXT */}
        {/* ================================================== */}

        {(encounter.initialText ||
          encounter.text) && (
          <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/60 p-5">

            <p className="whitespace-pre-line text-base leading-7 text-gray-300">
              {encounter.initialText ??
                encounter.text}
            </p>

          </div>
        )}

        {/* ================================================== */}
        {/* CHOICES */}
        {/* ================================================== */}

        {encounter.choices &&
          encounter.choices.length > 0 && (
            <div className="mt-6">

              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">
                Choose an option
              </h3>

              <div className="mt-3 space-y-3">

                {encounter.choices.map(
                  (choice, index) => (
                    <button
                      key={`${encounter.id}-choice-${index}`}
                      type="button"
                      onClick={() =>
                        onChoose(index)
                      }
                      className="w-full rounded-xl border border-gray-700 bg-gray-800 p-4 text-left transition hover:border-blue-500 hover:bg-gray-700"
                    >
                      <span className="font-semibold text-white">
                        {index + 1}.{" "}
                        {choice.text}
                      </span>
                    </button>
                  ),
                )}

              </div>

            </div>
          )}

        {/* ================================================== */}
        {/* EFFECT-BASED ENCOUNTER */}
        {/* ================================================== */}

        {encounter.effects &&
          encounter.effects.length > 0 && (
            <div className="mt-6">

              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">
                Encounter Effect
              </h3>

              <div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/60 p-4">

                <p className="text-sm text-gray-400">
                  Resolve the Encounter using
                  the available action below.
                </p>

              </div>

            </div>
          )}

      </div>
    </div>
  );
}