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

      <div title="Resources" className="flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-[#111318] p-2 transition-colors hover:border-slate-500 hover:bg-slate-900">

        <img
          src="/icons/game/resource.png"
          alt="Resources"
          className="h-6 w-6 object-contain"
        />

        <span className="mt-1 text-sm font-black">
          {investigator.resources}
        </span>
        <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">Resources</span>

      </div>

      {/* ================================================== */}
      {/* CLUES */}
      {/* ================================================== */}

      <div title="Clues" className="flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-[#111318] p-2 transition-colors hover:border-slate-500 hover:bg-slate-900">

        <img
          src="/icons/game/clue.png"
          alt="Clues"
          className="h-6 w-6 object-contain"
        />

        <span className="mt-1 text-sm font-black">
          {investigator.clues}
        </span>
        <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">Clues</span>

      </div>

      {/* ================================================== */}
      {/* TRAIN */}
      {/* ================================================== */}

      <div title="Train Tickets" className="flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-[#111318] p-2 transition-colors hover:border-slate-500 hover:bg-slate-900">

        <img
          src="/icons/game/train.png"
          alt="Train Tickets"
          className="h-6 w-6 object-contain"
        />

        <span className="mt-1 text-sm font-black">
          {investigator.trainTickets}
        </span>
        <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">Train</span>

      </div>

      {/* ================================================== */}
      {/* SHIP */}
      {/* ================================================== */}

      <div title="Ship Tickets" className="flex flex-col items-center justify-center rounded-xl border border-gray-700 bg-[#111318] p-2 transition-colors hover:border-slate-500 hover:bg-slate-900">

        <img
          src="/icons/game/ship.png"
          alt="Ship Tickets"
          className="h-6 w-6 object-contain"
        />

        <span className="mt-1 text-sm font-black">
          {investigator.shipTickets}
        </span>
        <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">Ship</span>

      </div>

    </div>
  );
}
