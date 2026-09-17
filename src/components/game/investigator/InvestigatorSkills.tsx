import type { Investigator } from "../../../game/models/Investigator";

interface InvestigatorSkillsProps {
  investigator: Investigator;
}

export default function InvestigatorSkills({
  investigator,
}: InvestigatorSkillsProps) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-700 bg-[#111318]">

      <div className="grid grid-cols-5">

        {/* ================================================== */}
        {/* LORE */}
        {/* ================================================== */}

        <div className="flex flex-col items-center justify-center border-r border-gray-700 p-2">

          <img
            src="/icons/game/lore.png"
            alt="Lore"
            className="h-7 w-7 object-contain"
          />

          <span className="mt-1 text-sm font-black">
            {investigator.skills.lore}
          </span>

        </div>

        {/* ================================================== */}
        {/* INFLUENCE */}
        {/* ================================================== */}

        <div className="flex flex-col items-center justify-center border-r border-gray-700 p-2">

          <img
            src="/icons/game/influence.png"
            alt="Influence"
            className="h-7 w-7 object-contain"
          />

          <span className="mt-1 text-sm font-black">
            {investigator.skills.influence}
          </span>

        </div>

        {/* ================================================== */}
        {/* OBSERVATION */}
        {/* ================================================== */}

        <div className="flex flex-col items-center justify-center border-r border-gray-700 p-2">

          <img
            src="/icons/game/observation.png"
            alt="Observation"
            className="h-7 w-7 object-contain"
          />

          <span className="mt-1 text-sm font-black">
            {investigator.skills.observation}
          </span>

        </div>

        {/* ================================================== */}
        {/* STRENGTH */}
        {/* ================================================== */}

        <div className="flex flex-col items-center justify-center border-r border-gray-700 p-2">

          <img
            src="/icons/game/strength.png"
            alt="Strength"
            className="h-7 w-7 object-contain"
          />

          <span className="mt-1 text-sm font-black">
            {investigator.skills.strength}
          </span>

        </div>

        {/* ================================================== */}
        {/* WILL */}
        {/* ================================================== */}

        <div className="flex flex-col items-center justify-center p-2">

          <img
            src="/icons/game/will.png"
            alt="Will"
            className="h-7 w-7 object-contain"
          />

          <span className="mt-1 text-sm font-black">
            {investigator.skills.will}
          </span>

        </div>

      </div>

    </div>
  );
}