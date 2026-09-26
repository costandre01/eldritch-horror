interface InvestigatorCardProps {
  isActive: boolean;

  isLead: boolean;

  turnOrder: number;

  canSelect: boolean;

  investigatorName: string;

  investigatorFrontImage: string;

  actionsPerformed: number;

  onSelect: () => void;

  onOpenCards: () => void;
}

export default function InvestigatorCard({
  isActive,
  isLead,
  turnOrder,
  canSelect,
  investigatorName,
  investigatorFrontImage,
  actionsPerformed,
  onSelect,
  onOpenCards,
}: InvestigatorCardProps) {
  return (
    <div
      className={`mx-auto w-42.5 rounded-2xl border p-2 shadow-xl backdrop-blur-sm transition ${
        isActive
          ? "border-blue-500 bg-blue-950/80 shadow-blue-950/40"
          : "border-gray-700 bg-gray-900/95"
      }`}
    >
      {/* ================================================== */}
      {/* INVESTIGATOR IMAGE */}
      {/* ================================================== */}

      <button
        type="button"
        disabled={!canSelect}
        onClick={onSelect}
        className="w-full text-left disabled:cursor-not-allowed"
      >
        <div className="relative overflow-hidden rounded-xl bg-black">

          <img
            src={investigatorFrontImage}
            alt={investigatorName}
            className="block h-auto w-full object-contain"
          />

          {/* ================================================== */}
          {/* TURN ORDER */}
          {/* ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              right-2
              top-2
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-black/70
              bg-black/80
              text-sm
              font-black
              text-white
              shadow-lg
            "
          >
            {turnOrder}
          </div>

          {/* ================================================== */}
          {/* LEAD INVESTIGATOR */}
          {/* ================================================== */}

          {isLead && (
            <div
              className="
                pointer-events-none
                absolute
                left-2
                top-0
                flex
                items-center
                gap-1.5
                rounded-full
                border
                border-amber-300/70
                bg-black/85
                px-2.5
                py-1.5
                text-[10px]
                font-black
                uppercase
                tracking-wider
                text-amber-300
                shadow-lg
              "
            >
              <span className="text-sm leading-none">
                ★
              </span>

              <span>
                LEAD
              </span>
            </div>
          )}

        </div>
      </button>

      {/* ================================================== */}
      {/* ACTIONS / SEE */}
      {/* ================================================== */}

      <div className="mt-3 flex items-center justify-between gap-2">

        {/* ACTION COUNTER */}

        <div className="text-[11px] font-bold text-gray-300">
          Actions:{" "}
          <span
            className={
              actionsPerformed >= 2
                ? "text-red-400"
                : "text-white"
            }
          >
            {actionsPerformed} / 2
          </span>
        </div>

        {/* SEE */}

        <button
          type="button"
          onClick={onOpenCards}
          className="rounded-lg bg-gray-800 px-3 py-1.5 text-[10px] font-bold text-gray-300 transition hover:bg-gray-700 hover:text-white"
        >
          SEE
        </button>

      </div>
    </div>
  );
}