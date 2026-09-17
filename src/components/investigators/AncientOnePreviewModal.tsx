import { useState } from "react";
import type { AncientOneDefinition } from "../../game/models/AncientOneDefinition";

interface AncientOnePreviewModalProps {
  ancientOne: AncientOneDefinition;
  onClose: () => void;
}

export default function AncientOnePreviewModal({
  ancientOne,
  onClose,
}: AncientOnePreviewModalProps) {
  const [showBack, setShowBack] =
    useState(false);

  function toggleCard() {
    setShowBack((current) => !current);
  }

  return (
    <div className="fixed inset-0 z-140 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[95vh] max-w-[95vw] flex-col items-center">

        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-2xl font-bold text-white transition hover:bg-black"
          aria-label="Close Ancient One preview"
        >
          ×
        </button>

        {/* CARD */}

        <button
          type="button"
          onClick={toggleCard}
          className="cursor-pointer"
          title={
            showBack
              ? "Ver frente"
              : "Ver verso"
          }
        >
          <img
            src={
              showBack
                ? ancientOne.backImage
                : ancientOne.frontImage
            }
            alt={
              showBack
                ? `${ancientOne.name} back`
                : ancientOne.name
            }
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl transition-transform duration-200 hover:scale-[1.01]"
          />
        </button>

        {/* FLIP */}

        <button
          type="button"
          onClick={toggleCard}
          className="mt-4 rounded-xl bg-gray-800 px-7 py-3 font-bold text-white transition hover:bg-gray-700"
        >
          {showBack
            ? "Ver Frente"
            : "Virar Carta"}
        </button>

        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          className="mt-2 rounded-xl bg-red-700 px-7 py-3 font-bold text-white transition hover:bg-red-600"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}