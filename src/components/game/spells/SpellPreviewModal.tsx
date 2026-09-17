interface SpellPreviewModalProps {
  image: string;
  onClose: () => void;
}

export default function SpellPreviewModal({
  image,
  onClose,
}: SpellPreviewModalProps) {
  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[95vh] max-w-[95vw] flex-col items-center">

        {/* CLOSE BUTTON */}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-xl font-bold text-white transition hover:bg-black"
          aria-label="Close spell"
        >
          ×
        </button>

        {/* SPELL CARD */}

        <img
          src={image}
          alt="Spell back"
          className="max-h-[82vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
        />

        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-xl bg-purple-700 px-6 py-3 font-bold text-white transition hover:bg-purple-600"
        >
          Fechar
        </button>

      </div>
    </div>
  );
}