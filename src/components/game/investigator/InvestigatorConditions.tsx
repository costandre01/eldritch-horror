import type { Condition } from "../../../game/models/Condition";

interface InvestigatorConditionsProps {
  conditions: Condition[];

  onSelect: (
    condition: Condition,
  ) => void;
}

export default function InvestigatorConditions({
  conditions,
  onSelect,
}: InvestigatorConditionsProps) {
  if (conditions.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-bold">
          Conditions
        </h3>

        <span className="text-sm text-gray-500">
          {conditions.length}
        </span>

      </div>

      {/* ================================================== */}
      {/* CONDITIONS */}
      {/* ================================================== */}

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

        {conditions.map(
          (condition) => (

            <button
              key={condition.id}
              type="button"
              onClick={() =>
                onSelect(condition)
              }
              className="group overflow-hidden rounded-xl border border-red-900/60 bg-red-950/20 text-left transition hover:-translate-y-1 hover:border-red-500 hover:bg-red-950/40 hover:shadow-lg"
            >

              {/* ========================================== */}
              {/* IMAGE */}
              {/* ========================================== */}

              <div className="relative h-44 overflow-hidden bg-gray-950">

                <img
                  src={
                    condition.flipped
                      ? condition.backImage
                      : condition.frontImage
                  }
                  alt={
                    condition.definitionId
                  }
                  className="absolute inset-0 h-auto w-full object-cover object-top transition duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-gray-900 to-transparent" />

              </div>

              {/* ========================================== */}
              {/* INFORMATION */}
              {/* ========================================== */}

              <div className="p-4">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <h4 className="font-bold text-white">
                      {
                        condition.definitionId
                      }
                    </h4>

                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-red-400">
                      CONDITION
                    </p>

                  </div>

                  {condition.flipped && (
                    <span className="rounded-full bg-gray-800 px-2 py-1 text-[10px] font-bold uppercase text-gray-400">
                      Flipped
                    </span>
                  )}

                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-600 transition group-hover:text-red-400">
                  Click to view card
                </p>

              </div>

            </button>

          ),
        )}

      </div>

    </section>
  );
}