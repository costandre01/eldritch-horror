import type { EncounterDefinition } from "../../game/models/Encounter";

interface EncounterCardProps {
  encounter: EncounterDefinition;

  backId: string | null;

  revealed: boolean;

  onReveal: () => void;

  onResolve: () => void;

  onChoose: (choiceIndex: number) => void;
}

export default function EncounterCard({
  encounter,
  backId,
  revealed,
  onReveal,
  onResolve,
  onChoose,
}: EncounterCardProps) {
  /*
   * ==========================================================
   * CARD ENCOUNTER
   * ==========================================================
   */

  if (
    encounter.backs &&
    encounter.backs.length > 0
  ) {
    const selectedBack =
      encounter.backs.find(
        (back) =>
          back.id === backId,
      );

    if (!selectedBack) {
      return (
        <div className="rounded-xl border border-red-800 bg-red-950 p-6 text-red-200">
          Encounter card not found.
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <img
          src={
            revealed
              ? selectedBack.backImage
              : selectedBack.frontImage
          }
          alt={encounter.name}
          onClick={
            revealed
              ? undefined
              : onReveal
          }
          className={[
            "max-h-[75vh] max-w-[90vw] rounded-xl object-contain shadow-2xl",
            !revealed
              ? "cursor-pointer transition-transform hover:scale-[1.01]"
              : "",
          ].join(" ")}
        />

        {revealed && (
          <button
            type="button"
            onClick={onResolve}
            className="mt-5 rounded-xl border border-gray-600 bg-gray-800 px-8 py-3 font-bold text-white transition hover:bg-gray-700"
          >
            Resolve Encounter
          </button>
        )}

        {!revealed && (
          <p className="mt-4 text-sm text-gray-400">
            Click the card to reveal it.
          </p>
        )}
      </div>
    );
  }

  /*
   * ==========================================================
   * OLD ENCOUNTER FORMAT
   * ==========================================================
   */

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 text-white shadow-xl">
      <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
        {encounter.type}
      </div>

      <h2 className="text-2xl font-bold">
        {encounter.name}
      </h2>

      <p className="mt-4 whitespace-pre-line text-gray-300">
        {encounter.text}
      </p>

      <div className="mt-6 space-y-3">
        {encounter.choices?.map(
          (choice, index) => (
            <button
              key={index}
              type="button"
              onClick={() =>
                onChoose(index)
              }
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-left font-semibold transition hover:bg-gray-700"
            >
              {choice.text}
            </button>
          ),
        )}
      </div>
    </div>
  );
}