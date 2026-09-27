import type { Investigator } from "../../../game/models/Investigator";

interface InvestigatorLocationProps {
  investigator: Investigator;
  onInspectSpace: (spaceId: string) => void;
}

export default function InvestigatorLocation({
  investigator,
  onInspectSpace,
}: InvestigatorLocationProps) {
  const locationName = investigator.spaceId
    ? investigator.spaceId
        .split(/[-_]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Not at a location";

  return (
    <div className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-slate-700/80 bg-slate-950/60 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300" aria-hidden="true">⌖</span>
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
            Current location
          </p>
          <p className="mt-0.5 truncate text-sm font-bold text-white">
            {locationName}
          </p>
        </div>
      </div>
      <button
        type="button"
        disabled={!investigator.spaceId}
        onClick={() => {
          if (investigator.spaceId) onInspectSpace(investigator.spaceId);
        }}
        title={investigator.spaceId ? "Inspect this space on the map" : "No current location"}
        aria-label={investigator.spaceId ? `Inspect ${locationName} on the map` : "No current location"}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-sm text-slate-400 transition hover:border-emerald-500/60 hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:cursor-default disabled:opacity-40"
      >
        ↗
      </button>
    </div>
  );
}
