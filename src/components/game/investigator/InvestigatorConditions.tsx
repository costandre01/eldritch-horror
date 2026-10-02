import type { Condition } from "../../../game/models/Condition";
import type { ConditionDefinition } from "../../../game/models/ConditionDefinition";

import InvestigatorCardThumbnail from "./InvestigatorCardThumbnail";

interface InvestigatorConditionsProps {
  conditions: Condition[];

  conditionDefinitions: ConditionDefinition[];

  onSelect: (
    condition: Condition,
  ) => void;
}

export default function InvestigatorConditions({
  conditions,
  conditionDefinitions,
  onSelect,
}: InvestigatorConditionsProps) {
  if (conditions.length === 0) {
    return null;
  }

  function getConditionDefinition(
    condition: Condition,
  ) {
    return conditionDefinitions.find(
      (definition) =>
        definition.id ===
        condition.definitionId,
    );
  }

  return (
    <section className="min-w-0 rounded-xl border border-slate-700/70 bg-slate-900/50 p-3">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-center justify-between">

        <h3 className="text-sm font-bold text-slate-100">
          Conditions
        </h3>

        <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-300">
          {conditions.length}
        </span>

      </div>

      {/* ================================================== */}
      {/* CONDITIONS */}
      {/* ================================================== */}

      <div className="mt-3 flex flex-wrap gap-3 pb-2">

        {conditions.map((condition) => {
          const definition =
            getConditionDefinition(condition);

          const conditionName =
            definition?.name ??
            condition.definitionId;

          return (
            <InvestigatorCardThumbnail
              key={condition.id}
              image={
                condition.flipped
                  ? condition.backImage
                  : condition.frontImage
              }
              name={conditionName}
              kind="condition"
              badge={
                condition.flipped
                  ? "Flipped"
                  : undefined
              }
              onClick={() =>
                onSelect(condition)
              }
            />
          );
        })}

      </div>

    </section>
  );
}