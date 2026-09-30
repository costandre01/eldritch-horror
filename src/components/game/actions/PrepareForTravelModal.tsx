import { useState } from "react";

type TicketType = "train" | "ship";

interface PrepareForTravelModalProps {
  trainTickets: number;
  shipTickets: number;

  onConfirm: (
    ticketType: TicketType,
    discardTicketType?: TicketType,
  ) => void;

  onCancel: () => void;
}

export default function PrepareForTravelModal({
  trainTickets,
  shipTickets,
  onConfirm,
  onCancel,
}: PrepareForTravelModalProps) {
  const [ticketToGain, setTicketToGain] =
    useState<TicketType | null>(null);

  const totalTickets =
    trainTickets + shipTickets;

  function chooseTicketToGain(
    ticketType: TicketType,
  ) {
    /*
     * With fewer than 2 tickets there is
     * nothing to discard.
     */
    if (totalTickets < 2) {
      onConfirm(ticketType);
      return;
    }

    /*
     * At the Travel Ticket limit the
     * investigator must discard one first.
     */
    setTicketToGain(ticketType);
  }

  function chooseTicketToDiscard(
    ticketType: TicketType,
  ) {
    if (!ticketToGain) {
      return;
    }

    onConfirm(
      ticketToGain,
      ticketType,
    );
  }

  const choosingDiscard =
    ticketToGain !== null;

  return (
    <div className="fixed inset-0 z-140 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-[min(92vw,700px)] rounded-2xl border border-gray-700 bg-[#17191f] p-6 text-white shadow-2xl">

        {/* HEADER */}

        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
            Prepare for Travel
          </p>

          <h2 className="mt-2 text-2xl font-black">
            {choosingDiscard
              ? "Discard a Ticket"
              : "Choose a Ticket"}
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            {choosingDiscard
              ? `You already have 2 Travel Tickets. Discard 1 before gaining the ${
                  ticketToGain === "train"
                    ? "Train"
                    : "Ship"
                } Ticket.`
              : "Gain 1 Train Ticket or 1 Ship Ticket."}
          </p>
        </div>

        {/* OPTIONS */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* TRAIN */}

          <button
            type="button"
            disabled={
              choosingDiscard &&
              trainTickets <= 0
            }
            onClick={() =>
              choosingDiscard
                ? chooseTicketToDiscard(
                    "train",
                  )
                : chooseTicketToGain(
                    "train",
                  )
            }
            className="group overflow-hidden rounded-xl border border-gray-700 bg-[#111318] text-left transition hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-950/30 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0"
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
                {choosingDiscard
                  ? `Discard 1 Train Ticket (${trainTickets} available).`
                  : `Gain 1 Train Ticket (${trainTickets} owned).`}
              </p>
            </div>
          </button>

          {/* SHIP */}

          <button
            type="button"
            disabled={
              choosingDiscard &&
              shipTickets <= 0
            }
            onClick={() =>
              choosingDiscard
                ? chooseTicketToDiscard(
                    "ship",
                  )
                : chooseTicketToGain(
                    "ship",
                  )
            }
            className="group overflow-hidden rounded-xl border border-gray-700 bg-[#111318] text-left transition hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-950/30 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0"
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
                {choosingDiscard
                  ? `Discard 1 Ship Ticket (${shipTickets} available).`
                  : `Gain 1 Ship Ticket (${shipTickets} owned).`}
              </p>
            </div>
          </button>

        </div>

        {/* CANCEL / BACK */}

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (choosingDiscard) {
                setTicketToGain(null);
                return;
              }

              onCancel();
            }}
            className="rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-bold text-gray-300 transition hover:bg-gray-700 hover:text-white"
          >
            {choosingDiscard
              ? "Back"
              : "Cancel"}
          </button>
        </div>

      </div>
    </div>
  );
}