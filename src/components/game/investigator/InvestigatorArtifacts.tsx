import type { Artifact } from "../../../game/models/Artifact";

interface InvestigatorArtifactsProps {
  artifacts: Artifact[];
  getArtifactImage: (
    artifact: Artifact,
  ) => string;
  onSelect: (
    artifact: Artifact,
  ) => void;
}

export default function InvestigatorArtifacts({
  artifacts,
  getArtifactImage,
  onSelect,
}: InvestigatorArtifactsProps) {
  return (
    <section className="mt-8">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-bold">
          Artifacts
        </h3>

        <span className="text-sm text-gray-500">
          {artifacts.length}
        </span>

      </div>

      {/* ================================================== */}
      {/* EMPTY */}
      {/* ================================================== */}

      {artifacts.length === 0 ? (

        <div className="mt-3 rounded-xl border border-gray-800 bg-gray-900 p-5 text-center text-sm text-gray-500">
          This investigator has no Artifacts.
        </div>

      ) : (

        /* ================================================== */
        /* ARTIFACTS */
        /* ================================================== */

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

          {artifacts.map(
            (artifact) => (

              <button
                key={artifact.id}
                type="button"
                onClick={() =>
                  onSelect(artifact)
                }
                className="group overflow-hidden rounded-xl border border-amber-900/60 bg-amber-950/20 text-left transition hover:-translate-y-1 hover:border-amber-500 hover:bg-amber-950/40 hover:shadow-lg"
              >

                <div className="relative h-44 overflow-hidden bg-gray-950">

                  <img
                    src={getArtifactImage(
                      artifact,
                    )}
                    alt={artifact.name}
                    className="absolute inset-0 h-auto w-full object-cover object-top transition duration-300 group-hover:scale-105"
                    onError={(event) => {
                      console.error(
                        "Artifact image not found:",
                        getArtifactImage(
                          artifact,
                        ),
                      );

                      event.currentTarget.style.display =
                        "none";
                    }}
                  />

                  <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-gray-900 to-transparent" />

                </div>

                <div className="p-4">

                  <h4 className="font-bold text-white">
                    {artifact.name}
                  </h4>

                  {artifact.traits.length > 0 && (
                    <p className="mt-1 text-xs uppercase tracking-wide text-amber-400">
                      {artifact.traits.join(
                        " • ",
                      )}
                    </p>
                  )}

                  <p className="mt-3 text-sm leading-5 text-gray-400">
                    {artifact.description}
                  </p>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-600 transition group-hover:text-amber-400">
                    Click to view card
                  </p>

                </div>

              </button>

            ),
          )}

        </div>

      )}

    </section>
  );
}