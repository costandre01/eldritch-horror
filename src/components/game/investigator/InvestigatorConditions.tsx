import type { Condition } from "../../../game/models/Condition";
import InvestigatorCardThumbnail from "./InvestigatorCardThumbnail";

interface InvestigatorConditionsProps {
  conditions: Condition[];
  onSelect: (condition: Condition) => void;
}

export default function InvestigatorConditions({
  conditions,
  onSelect,
}: InvestigatorConditionsProps) {
  if (conditions.length === 0) return null;

  return (
    <section className="min-w-0 rounded-xl border border-slate-700/70 bg-slate-900/50 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100">Conditions</h3>
        <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-300">{conditions.length}</span>
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
        {conditions.map((condition) => (
          <InvestigatorCardThumbnail
            key={condition.id}
            image={condition.flipped ? condition.backImage : condition.frontImage}
            name={condition.definitionId}
            kind="condition"
            badge={condition.flipped ? "Flipped" : undefined}
            onClick={() => onSelect(condition)}
          />
        ))}
      </div>
    </section>
  );
}
