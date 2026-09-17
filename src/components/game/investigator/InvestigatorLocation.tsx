import type { Investigator } from "../../../game/models/Investigator";

interface InvestigatorLocationProps {
  investigator: Investigator;
}

export default function InvestigatorLocation({
  investigator,
}: InvestigatorLocationProps) {
  return (
    <div className="mt-3 rounded-xl border border-gray-700 bg-[#111318] p-3 text-center">

      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
        Location
      </p>

      <p className="mt-1 text-sm font-bold text-white">
        {investigator.spaceId ?? "None"}
      </p>

    </div>
  );
}