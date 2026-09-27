import type { Investigator } from "../../../game/models/Investigator";
import type { InvestigatorSkills as SkillValues } from "../../../game/models/Investigator";

interface InvestigatorSkillsProps {
  investigator: Investigator;
  effectiveSkills?: SkillValues;
}

export default function InvestigatorSkills({
  investigator,
  effectiveSkills = investigator.skills,
}: InvestigatorSkillsProps) {
  const skills: SkillValues = investigator.skills;

  function renderValue(skill: keyof SkillValues) {
    const modifier = effectiveSkills[skill] - skills[skill];

    return (
      <span className="mt-1 inline-flex items-baseline gap-1 text-sm font-black">
        <span>{skills[skill]}</span>
        {modifier !== 0 && (
          <span className={modifier > 0 ? "text-green-400" : "text-red-400"}>
            {modifier > 0 ? `+${modifier}` : modifier}
          </span>
        )}
      </span>
    );
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-700 bg-[#111318]">

      <div className="grid grid-cols-5">

        {/* ================================================== */}
        {/* LORE */}
        {/* ================================================== */}

        <div title="Lore" className="flex flex-col items-center justify-center border-r border-gray-700 p-2 transition-colors hover:bg-slate-800/60">

          <img
            src="/icons/game/lore.png"
            alt="Lore"
            className="h-7 w-7 object-contain"
          />

          {renderValue("lore")}
          <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">Lore</span>

        </div>

        {/* ================================================== */}
        {/* INFLUENCE */}
        {/* ================================================== */}

        <div title="Influence" className="flex flex-col items-center justify-center border-r border-gray-700 p-2 transition-colors hover:bg-slate-800/60">

          <img
            src="/icons/game/influence.png"
            alt="Influence"
            className="h-7 w-7 object-contain"
          />

          {renderValue("influence")}
          <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">Influence</span>

        </div>

        {/* ================================================== */}
        {/* OBSERVATION */}
        {/* ================================================== */}

        <div title="Observation" className="flex flex-col items-center justify-center border-r border-gray-700 p-2 transition-colors hover:bg-slate-800/60">

          <img
            src="/icons/game/observation.png"
            alt="Observation"
            className="h-7 w-7 object-contain"
          />

          {renderValue("observation")}
          <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">Observation</span>

        </div>

        {/* ================================================== */}
        {/* STRENGTH */}
        {/* ================================================== */}

        <div title="Strength" className="flex flex-col items-center justify-center border-r border-gray-700 p-2 transition-colors hover:bg-slate-800/60">

          <img
            src="/icons/game/strength.png"
            alt="Strength"
            className="h-7 w-7 object-contain"
          />

          {renderValue("strength")}
          <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">Strength</span>

        </div>

        {/* ================================================== */}
        {/* WILL */}
        {/* ================================================== */}

        <div title="Will" className="flex flex-col items-center justify-center p-2 transition-colors hover:bg-slate-800/60">

          <img
            src="/icons/game/will.png"
            alt="Will"
            className="h-7 w-7 object-contain"
          />

          {renderValue("will")}
          <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">Will</span>

        </div>

      </div>

    </div>
  );
}
