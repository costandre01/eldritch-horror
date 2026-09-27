import type { Artifact } from "../../../game/models/Artifact";
import InvestigatorCardThumbnail from "./InvestigatorCardThumbnail";

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
    <section className="min-w-0 rounded-xl border border-slate-700/70 bg-slate-900/50 p-3">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-center justify-between">

        <h3 className="text-sm font-bold text-slate-100">
          Artifacts
        </h3>

        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-300">
          {artifacts.length}
        </span>

      </div>

      {/* ================================================== */}
      {/* EMPTY */}
      {/* ================================================== */}

      {artifacts.length === 0 ? (

        <div className="mt-3 flex min-h-14 items-center gap-2 rounded-lg border border-dashed border-slate-700 bg-slate-950/40 px-3 text-xs text-slate-400">
          <span className="text-base text-slate-500">＋</span>
          No artifacts yet
        </div>

      ) : (

        /* ================================================== */
        /* ARTIFACTS */
        /* ================================================== */

        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">

          {artifacts.map(
            (artifact) => (

              <InvestigatorCardThumbnail
                key={artifact.id}
                image={getArtifactImage(artifact)}
                name={artifact.name}
                kind="artifact"
                onClick={() => onSelect(artifact)}
                onImageError={() => {
                  console.error(
                    "Artifact image not found:",
                    getArtifactImage(artifact),
                  );
                }}
              />

            ),
          )}

        </div>

      )}

    </section>
  );
}
