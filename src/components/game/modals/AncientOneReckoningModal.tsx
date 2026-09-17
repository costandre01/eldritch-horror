import type { GameState } from "../../../game/models/GameState";
import { CORE_ANCIENT_ONES } from "../../../content/core/coreAncientOnes";

interface AncientOneReckoningModalProps {
  game: GameState;
  ancientOneId: string;
  onResolve: () => void;
}

export default function AncientOneReckoningModal({
  game,
  ancientOneId,
  onResolve,
}: AncientOneReckoningModalProps) {
  const ancientOne = CORE_ANCIENT_ONES.find(
    (definition) => definition.id === ancientOneId,
  );

  if (!ancientOne) {
    return null;
  }

  const image = game.ancientOne.awakened
    ? ancientOne.backImage
    : ancientOne.frontImage;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 p-6">
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col items-center rounded-2xl bg-black/95 p-6 shadow-2xl">
        <h2 className="mb-4 text-center text-2xl font-black uppercase tracking-wide text-white">
          ANCIENT ONE — RECKONING
        </h2>

        <div className="relative max-h-[70vh] overflow-hidden rounded-xl">
          <img
            src={image}
            alt={ancientOne.name}
            className="max-h-[70vh] w-auto rounded-xl object-contain shadow-2xl"
            draggable={false}
          />
        </div>

        <div className="mt-5 rounded-lg bg-white/10 px-5 py-2 text-center text-lg font-bold uppercase text-white">
          {ancientOne.name}
        </div>

        <button
          type="button"
          onClick={onResolve}
          className="mt-6 rounded-xl bg-red-700 px-8 py-3 text-lg font-black uppercase text-white shadow-lg transition hover:bg-red-600"
        >
          DO EFFECT
        </button>
      </div>
    </div>
  );
}