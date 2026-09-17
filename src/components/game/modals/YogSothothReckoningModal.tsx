import type { GameState } from "../../../game/models/GameState";

interface YogSothothReckoningModalProps {
  game: GameState;
  investigatorId: string;
  spellIds: string[];
  onDiscardSpell: (spellId: string) => void;
  onAdvanceDoom: () => void;
}

export default function YogSothothReckoningModal({
  game,
  investigatorId,
  spellIds,
  onDiscardSpell,
  onAdvanceDoom,
}: YogSothothReckoningModalProps) {
  const investigator =
    game.investigators[investigatorId];

  if (!investigator) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 p-6">
      <div className="flex max-h-[95vh] w-full max-w-6xl flex-col items-center rounded-2xl bg-black/95 p-6 shadow-2xl">
        <h2 className="mb-2 text-center text-2xl font-black uppercase tracking-wide text-white">
          YOG-SOTHOTH — RECKONING
        </h2>

        <p className="mb-6 text-center text-lg font-bold text-white/80">
          {investigator.definitionId}
        </p>

        <p className="mb-6 text-center text-base font-bold uppercase text-white">
          Discard 1 Spell or advance Doom by 1.
        </p>

        <div className="flex max-h-[60vh] w-full flex-wrap items-center justify-center gap-6 overflow-y-auto px-4 py-4">
          {spellIds.map((spellId) => {
            const spell =
              game.spells[spellId];

            if (!spell) {
              return null;
            }

            return (
              <button
                key={spellId}
                type="button"
                onClick={() =>
                  onDiscardSpell(spellId)
                }
                className="group relative rounded-xl transition hover:scale-105"
              >
                <img
                  src={spell.frontImage}
                  alt={spell.definitionId}
                  className="h-96 w-auto rounded-xl object-contain shadow-2xl transition group-hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]"
                  draggable={false}
                />

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-lg bg-black/80 px-4 py-2 text-sm font-black uppercase text-white opacity-0 transition group-hover:opacity-100">
                  DISCARD
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onAdvanceDoom}
          className="mt-6 rounded-xl bg-red-700 px-8 py-3 text-lg font-black uppercase text-white shadow-lg transition hover:bg-red-600"
        >
          ADVANCE DOOM
        </button>
      </div>
    </div>
  );
}