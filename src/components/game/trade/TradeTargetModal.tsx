import type { Investigator } from "../../../game/models/Investigator";

interface TradeTargetModalProps {
  investigators: Investigator[];
  investigatorNames: Record<string, string>;
  investigatorImages: Record<string, string>;

  onSelect: (investigatorId: string) => void;
  onCancel: () => void;
}

export default function TradeTargetModal({
  investigators,
  investigatorNames,
  investigatorImages,
  onSelect,
  onCancel,
}: TradeTargetModalProps) {
  return (
    <div className="fixed inset-0 z-130 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-[min(92vw,850px)] max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-700 bg-[#17191f] p-6 text-white shadow-2xl">

        {/* HEADER */}

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Investigator Action
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Trade
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Choose an Investigator to trade with.
          </p>
        </div>

        {/* INVESTIGATORS */}

        {investigators.length === 0 ? (
          <div className="mt-8 rounded-xl border border-red-900 bg-red-950/30 p-5 text-center text-sm text-red-300">
            There are no other Investigators on your space.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {investigators.map(
              (investigator) => (
                <button
                  key={investigator.id}
                  type="button"
                  onClick={() =>
                    onSelect(
                      investigator.id,
                    )
                  }
                  className="group overflow-hidden rounded-xl border border-gray-700 bg-gray-900 text-left transition hover:-translate-y-1 hover:border-amber-500 hover:bg-gray-800 hover:shadow-xl"
                >
                  {/* PORTRAIT */}

                  <div className="aspect-3/4 overflow-hidden bg-black">
                    <img
                      src={
                        investigatorImages[
                          investigator.id
                        ]
                      }
                      alt={
                        investigatorNames[
                          investigator.id
                        ] ??
                        investigator.id
                      }
                      className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* NAME */}

                  <div className="p-3 text-center">
                    <p className="text-sm font-bold text-white">
                      {investigatorNames[
                        investigator.id
                      ] ??
                        investigator.id}
                    </p>

                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                      Select
                    </p>
                  </div>
                </button>
              ),
            )}
          </div>
        )}

        {/* CANCEL */}

        <div className="mt-6 flex justify-end border-t border-gray-800 pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-gray-800 px-6 py-3 text-sm font-bold text-gray-300 transition hover:bg-gray-700 hover:text-white"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}