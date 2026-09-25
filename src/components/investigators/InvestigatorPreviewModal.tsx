import { useState } from "react";

import type { InvestigatorDefinition } from "../../game/models/InvestigatorDefinition";

import {
  getInvestigatorFrontImage,
  getInvestigatorBackImage,
} from "./InvestigatorSelection";

interface InvestigatorPreviewModalProps {
  investigator: InvestigatorDefinition;
  onClose: () => void;
  onSelect?: () => void;
}

export default function InvestigatorPreviewModal({
  investigator,
  onClose,
  onSelect,
}: InvestigatorPreviewModalProps) {
  const [showBack, setShowBack] =
    useState(false);

  const image = showBack
    ? getInvestigatorBackImage(
        investigator.name,
      )
    : getInvestigatorFrontImage(
        investigator.name,
      );

  function toggleSide() {
    setShowBack(
      (current) => !current,
    );
  }

  return (
    <div
      className="fixed inset-0 z-200 overflow-y-auto bg-black/85 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative mx-auto my-3 flex max-h-[calc(100dvh-24px)] w-[min(95vw,900px)] flex-col items-center"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* ================================================== */}
        {/* CARD */}
        {/* ================================================== */}

        <div className="flex max-h-[82vh] max-w-[95vw] items-center justify-center overflow-hidden rounded-2xl shadow-2xl shadow-black/60">
          <img
            src={image}
            alt={
              showBack
                ? `${investigator.name} - verso`
                : `${investigator.name} - frente`
            }
            className="block max-h-[82vh] max-w-[95vw] w-auto h-auto object-contain"
          />
        </div>

        {/* ================================================== */}
        {/* CONTROLS */}
        {/* ================================================== */}

        <div className="mt-5 flex items-center justify-center gap-3">

          {/* SELECT */}

          {onSelect && (
            <button
              type="button"
              onClick={onSelect}
              className="rounded-lg bg-green-700 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-green-600"
            >
              Select
            </button>
          )}

          {/* FLIP */}

          <button
            type="button"
            onClick={toggleSide}
            className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-blue-600"
          >
            {showBack
              ? "See Front"
              : "Flip"}
          </button>

          {/* CLOSE */}

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-700 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-gray-600"
          >
            Close
          </button>
        </div>

        {/* ================================================== */}
        {/* SIDE INDICATOR */}
        {/* ================================================== */}

        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
          {showBack
            ? "Verso da carta"
            : "Frente da carta"}
        </p>
      </div>
    </div>
  );
}