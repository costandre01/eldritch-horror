import type { Investigator } from "../../../game/models/Investigator";

interface InvestigatorHealthSanityProps {
  investigator: Investigator;
}

export default function InvestigatorHealthSanity({
  investigator,
}: InvestigatorHealthSanityProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">

      {/* ================================================== */}
      {/* HEALTH */}
      {/* ================================================== */}

      <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-[#111318] p-3">

        <img
          src="/icons/game/health.png"
          alt="Health"
          className="h-8 w-8 object-contain"
        />

        <span className="text-lg font-black">
          {investigator.health}
          /
          {investigator.maxHealth}
        </span>

      </div>

      {/* ================================================== */}
      {/* SANITY */}
      {/* ================================================== */}

      <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-[#111318] p-3">

        <img
          src="/icons/game/sanity.png"
          alt="Sanity"
          className="h-8 w-8 object-contain"
        />

        <span className="text-lg font-black">
          {investigator.sanity}
          /
          {investigator.maxSanity}
        </span>

      </div>

    </div>
  );
}