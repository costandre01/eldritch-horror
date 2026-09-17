import type { Investigator } from "../../../game/models/Investigator";

interface InvestigatorResourcesProps {
  investigator: Investigator;
}

export default function InvestigatorResources({
  investigator,
}: InvestigatorResourcesProps) {
  return (
    <div className="mt-3 grid grid-cols-4 gap-2">

      {/* ================================================== */}
      {/* RESOURCES */}
      {/* ================================================== */}

      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-[#111318] p-2">

        <img
          src="/icons/game/resource.png"
          alt="Resources"
          className="h-6 w-6 object-contain"
        />

        <span className="mt-1 text-sm font-black">
          {investigator.resources}
        </span>

      </div>

      {/* ================================================== */}
      {/* CLUES */}
      {/* ================================================== */}

      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-[#111318] p-2">

        <img
          src="/icons/game/clue.png"
          alt="Clues"
          className="h-6 w-6 object-contain"
        />

        <span className="mt-1 text-sm font-black">
          {investigator.clues}
        </span>

      </div>

      {/* ================================================== */}
      {/* TRAIN */}
      {/* ================================================== */}

      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-[#111318] p-2">

        <img
          src="/icons/game/train.png"
          alt="Train Tickets"
          className="h-6 w-6 object-contain"
        />

        <span className="mt-1 text-sm font-black">
          {investigator.trainTickets}
        </span>

      </div>

      {/* ================================================== */}
      {/* SHIP */}
      {/* ================================================== */}

      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-[#111318] p-2">

        <img
          src="/icons/game/ship.png"
          alt="Ship Tickets"
          className="h-6 w-6 object-contain"
        />

        <span className="mt-1 text-sm font-black">
          {investigator.shipTickets}
        </span>

      </div>

    </div>
  );
}