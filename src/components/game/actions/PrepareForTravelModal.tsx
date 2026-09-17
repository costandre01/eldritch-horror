interface PrepareForTravelModalProps {
  onChooseTrain: () => void;
  onChooseShip: () => void;
  onCancel: () => void;
}

export default function PrepareForTravelModal({
  onChooseTrain,
  onChooseShip,
  onCancel,
}: PrepareForTravelModalProps) {
  return (
    <div className="fixed inset-0 z-140 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-[min(92vw,700px)] rounded-2xl border border-gray-700 bg-[#17191f] p-6 text-white shadow-2xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="text-center">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
            Prepare for Travel
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Choose a Ticket
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Gain 1 Train Ticket or 1 Ship Ticket.
          </p>

        </div>

        {/* ================================================== */}
        {/* OPTIONS */}
        {/* ================================================== */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* TRAIN */}

          <button
            type="button"
            onClick={onChooseTrain}
            className="group overflow-hidden rounded-xl border border-gray-700 bg-[#111318] text-left transition hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-950/30 hover:shadow-lg"
          >
            <div className="flex min-h-48 flex-col items-center justify-center p-6">

              <img
                src="/icons/game/train.png"
                alt="Train Ticket"
                className="h-24 w-24 object-contain transition duration-300 group-hover:scale-110"
              />

              <h3 className="mt-4 text-lg font-black">
                Train Ticket
              </h3>

              <p className="mt-2 text-center text-sm text-gray-400">
                Gain 1 Train Ticket.
              </p>

            </div>
          </button>

          {/* SHIP */}

          <button
            type="button"
            onClick={onChooseShip}
            className="group overflow-hidden rounded-xl border border-gray-700 bg-[#111318] text-left transition hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-950/30 hover:shadow-lg"
          >
            <div className="flex min-h-48 flex-col items-center justify-center p-6">

              <img
                src="/icons/game/ship.png"
                alt="Ship Ticket"
                className="h-24 w-24 object-contain transition duration-300 group-hover:scale-110"
              />

              <h3 className="mt-4 text-lg font-black">
                Ship Ticket
              </h3>

              <p className="mt-2 text-center text-sm text-gray-400">
                Gain 1 Ship Ticket.
              </p>

            </div>
          </button>

        </div>

        {/* ================================================== */}
        {/* CANCEL */}
        {/* ================================================== */}

        <div className="mt-5 flex justify-center">

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-bold text-gray-300 transition hover:bg-gray-700 hover:text-white"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}