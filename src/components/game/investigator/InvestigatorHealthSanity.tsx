import type { Investigator } from "../../../game/models/Investigator";

interface InvestigatorHealthSanityProps {
  investigator: Investigator;
}

export default function InvestigatorHealthSanity({
  investigator,
}: InvestigatorHealthSanityProps) {
  const stats = [
    {
      label: "Health",
      current: investigator.health,
      maximum: investigator.maxHealth,
      image: "/icons/game/health.png",
      color: "bg-red-500",
      text: "text-red-300",
    },
    {
      label: "Sanity",
      current: investigator.sanity,
      maximum: investigator.maxSanity,
      image: "/icons/game/sanity.png",
      color: "bg-blue-500",
      text: "text-blue-300",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-3">
      {stats.map((stat) => {
        const progress = stat.maximum > 0
          ? Math.max(0, Math.min(100, (stat.current / stat.maximum) * 100))
          : 0;
        const isCritical = stat.current === 0;
        const isLow = !isCritical && stat.current <= Math.floor(stat.maximum / 3);
        const statusColor = isCritical
          ? "text-red-300"
          : isLow
            ? "text-amber-300"
            : stat.text;
        const progressColor = isCritical || !isLow
          ? stat.color
          : "bg-amber-400";

        return (
          <div
            key={stat.label}
            className={`rounded-xl border px-3 py-2.5 transition-colors ${isCritical ? "border-red-500/70 bg-red-950/30" : isLow ? "border-amber-500/60 bg-amber-950/20" : "border-slate-700/80 bg-slate-950/60"}`}
            aria-label={`${stat.label}: ${stat.current} of ${stat.maximum}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                  {stat.label}
                </span>
                {(isLow || isCritical) && (
                  <span className={`rounded px-1 py-0.5 text-[8px] font-black uppercase tracking-wide ${isCritical ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-200"}`}>
                    {isCritical ? "Critical" : "Low"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <img src={stat.image} alt="" className="h-6 w-6 object-contain" />
                <span className={`text-sm font-black ${statusColor}`}>
                  {stat.current}/{stat.maximum}
                </span>
              </div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-[width] duration-300 ${progressColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
