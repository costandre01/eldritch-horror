import type { Investigator } from "../../../game/models/Investigator";

interface SpellChoiceModalProps {
  investigators: Investigator[];
  casterId: string;
  location?: "same-space" | "any-space";
  excludeConditionDefinitionId?: string;
  conditions: Record<
    string,
    {
      definitionId: string;
    }
  >;
  onChoose: (investigatorId: string) => void;
  options?: { id: string; label: string; description?: string }[];
  title?: string;
  onClose?: () => void;
}

export default function SpellChoiceModal({
  investigators,
  casterId,
  location,
  excludeConditionDefinitionId,
  conditions,
  onChoose,
  options,
  title,
  onClose,
}: SpellChoiceModalProps) {
  const caster =
    investigators.find(
      (investigator) =>
        investigator.id === casterId,
    );

  if (!caster) {
    return null;
  }

  const availableInvestigators =
    investigators.filter(
      (investigator) => {
        /*
         * ------------------------------------------------------
         * SAME SPACE
         * ------------------------------------------------------
         */

        if (
          location ===
          "same-space"
        ) {
          if (
            caster.spaceId === null ||
            investigator.spaceId !==
              caster.spaceId
          ) {
            return false;
          }
        }

        /*
         * ------------------------------------------------------
         * CONDITION EXCLUSION
         * ------------------------------------------------------
         */

        if (
          excludeConditionDefinitionId
        ) {
          const alreadyHasCondition =
            investigator.conditionIds.some(
              (conditionId) => {
                const condition =
                  conditions[
                    conditionId
                  ];

                return (
                  condition?.definitionId ===
                  excludeConditionDefinitionId
                );
              },
            );

          if (
            alreadyHasCondition
          ) {
            return false;
          }
        }

        return true;
      },
    );

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-[min(92vw,600px)] rounded-2xl border border-gray-700 bg-[#17191f] p-6 text-white shadow-2xl">

        {/* HEADER */}

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Eldritch Horror
          </p>

          <h2 className="mt-2 text-2xl font-black">
            {title ?? "Choose Investigator"}
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            {options ? "Choose a valid option to resolve the Spell." : "Choose the investigator affected by the Spell."}
          </p>
        </div>

        {/* INVESTIGATORS */}

        <div className="mt-6 space-y-3">
          {options && options.length === 0 && (
            <div className="rounded-xl border border-amber-900 bg-amber-950/30 p-4 text-center text-sm text-amber-300">
              There are no valid targets for this choice.
            </div>
          )}
          {options?.map((option) => (
            <button key={option.id} type="button" onClick={() => onChoose(option.id)} className="w-full rounded-xl border border-gray-700 bg-gray-900 p-4 text-left hover:border-purple-500 hover:bg-purple-950/30">
              <span className="font-bold text-white">{option.label}</span>
              {option.description && <span className="mt-1 block text-sm text-gray-400">{option.description}</span>}
            </button>
          ))}
          {!options && availableInvestigators.length ===
            0 && (
            <div className="rounded-xl border border-red-900 bg-red-950/30 p-4 text-center text-sm text-red-300">
              There are no investigators
              valid for this choice.
            </div>
          )}

          {!options && availableInvestigators.map(
            (investigator) => {
              const isCaster =
                investigator.id ===
                casterId;

              return (
                <button
                  key={
                    investigator.id
                  }
                  type="button"
                  onClick={() =>
                    onChoose(
                      investigator.id,
                    )
                  }
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 p-4 text-left transition hover:border-purple-500 hover:bg-purple-950/40"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">
                        {investigator.id}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Space:{" "}
                        {investigator.spaceId ??
                          "Nenhum"}
                      </p>
                    </div>

                    {isCaster && (
                      <span className="rounded-full bg-purple-900/60 px-3 py-1 text-xs font-bold text-purple-300">
                        Caster
                      </span>
                    )}
                  </div>
                </button>
              );
            },
          )}
        </div>

        {/* CLOSE */}

        {onClose && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-700 px-5 py-2 font-semibold text-white transition hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
