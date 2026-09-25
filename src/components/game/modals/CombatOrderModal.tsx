import type { GameState } from "../../../game/models/GameState";
import type { MonsterDefinition } from "../../../game/models/Monster";

import { CORE_MONSTERS } from "../../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../../content/core/coreEpicMonsters";

interface CombatOrderModalProps {
  game: GameState;

  monsterIds: string[];

  orderedMonsterIds: string[];

  onSelectMonster: (
    monsterId: string,
  ) => void;

  onConfirm: () => void;
}

function getMonsterDefinition(
  definitionId: string,
): MonsterDefinition | undefined {
  return (
    CORE_MONSTERS.find(
      (definition) =>
        definition.id === definitionId,
    ) ??
    CORE_EPIC_MONSTERS.find(
      (definition) =>
        definition.id === definitionId,
    )
  );
}

export default function CombatOrderModal({
  game,
  monsterIds,
  orderedMonsterIds,
  onSelectMonster,
  onConfirm,
}: CombatOrderModalProps) {
  const remainingMonsterIds =
    monsterIds.filter(
      (monsterId) =>
        !orderedMonsterIds.includes(
          monsterId,
        ),
    );

  function handleSelect(
    monsterId: string,
  ) {
    onSelectMonster(monsterId);
  }

  return (
    <div className="fixed inset-0 z-9999 overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-4">
      <div className="mx-auto my-3 flex max-h-[calc(100dvh-24px)] w-[min(96vw,1280px)] flex-col overflow-y-auto overscroll-contain rounded-3xl border border-gray-700 bg-[#172033] px-4 py-4 text-white shadow-2xl sm:px-6 sm:py-5 lg:px-8 lg:py-6">

        {/* HEADER */}

        <div className="shrink-0 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400 sm:text-xs">
            ENCOUNTER PHASE
          </p>

          <h2 className="mt-2 text-2xl font-black uppercase sm:text-3xl lg:text-4xl">
            CHOOSE COMBAT ORDER
          </h2>

          <p className="mt-2 text-xs text-gray-400 sm:text-sm lg:text-base">
            Choose the order in which the Monsters
            will be encountered.
          </p>
        </div>

        {/* ORDER */}

        <div className="mt-3 shrink-0 sm:mt-4">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 sm:text-xs">
            COMBAT ORDER
          </p>

          <div className="flex min-h-8 flex-wrap justify-center gap-2">
            {orderedMonsterIds.map(
              (monsterId, index) => {
                const monster =
                  game.monsters[
                    monsterId
                  ];

                if (!monster) {
                  return null;
                }

                const definition =
                  getMonsterDefinition(
                    monster.definitionId,
                  );

                if (!definition) {
                  return null;
                }

                return (
                  <div
                    key={monsterId}
                    className="flex items-center gap-1.5 rounded-lg border border-green-500/40 bg-green-950/30 px-2.5 py-1"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-black">
                      {index + 1}
                    </span>

                    <span className="text-xs font-bold uppercase sm:text-sm">
                      {definition.name}
                    </span>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* MONSTERS */}

        <div className="mt-4 flex min-h-0 flex-1 items-center justify-center gap-3 sm:mt-5 sm:gap-4 lg:gap-6">

          {monsterIds.map(
            (monsterId) => {
              const monster =
                game.monsters[
                  monsterId
                ];

              if (!monster) {
                return null;
              }

              const definition =
                getMonsterDefinition(
                  monster.definitionId,
                );

              if (!definition) {
                return null;
              }

              const orderIndex =
                orderedMonsterIds.indexOf(
                  monsterId,
                );

              const isSelected =
                orderIndex !== -1;

              return (
                <button
                  key={monsterId}
                  type="button"
                  onClick={() =>
                    handleSelect(
                      monsterId,
                    )
                  }
                  className={`relative flex min-w-0 flex-col items-center transition ${
                    isSelected
                      ? "cursor-default opacity-45"
                      : "cursor-pointer hover:-translate-y-1 hover:scale-[1.02]"
                  }`}
                >
                  {/* MONSTER NAME */}

                  <div className="mb-1.5 w-full truncate text-center text-[10px] font-black uppercase tracking-wide text-white sm:text-xs lg:text-sm">
                    {definition.name}
                  </div>

                  {/* CARD */}

                  <div className="relative flex w-full justify-center">
                    <img
                      src={
                        definition.backImage
                      }
                      alt={
                        definition.name
                      }
                      className="h-[min(42vh,330px)] w-auto max-w-full rounded-lg object-contain shadow-xl sm:rounded-xl"
                      draggable={false}
                    />

                    {/* SELECTION OVERLAY */}

                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 sm:rounded-xl">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-lg font-black text-white shadow-2xl sm:h-14 sm:w-14 sm:text-xl lg:h-16 lg:w-16 lg:text-2xl">
                          {orderIndex + 1}
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            },
          )}

        </div>

        {/* STATUS */}

        <div className="mt-3 shrink-0 text-center sm:mt-4">
          <p className="text-xs text-gray-400 sm:text-sm">
            {remainingMonsterIds.length > 0
              ? `Choose ${remainingMonsterIds.length} more.`
              : "Combat order complete."}
          </p>
        </div>

        {/* CONFIRM */}

        <div className="mt-3 flex shrink-0 justify-center sm:mt-4">
          <button
            type="button"
            disabled={
              orderedMonsterIds.length !==
              monsterIds.length
            }
            onClick={
              onConfirm
            }
            className={`rounded-xl px-7 py-2.5 text-sm font-black uppercase tracking-wider transition sm:px-9 sm:py-3 sm:text-base ${
              orderedMonsterIds.length ===
              monsterIds.length
                ? "bg-red-700 text-white hover:bg-red-600"
                : "cursor-not-allowed bg-gray-700 text-gray-500"
            }`}
          >
            CONFIRM ORDER
          </button>
        </div>

      </div>
    </div>
  );
}