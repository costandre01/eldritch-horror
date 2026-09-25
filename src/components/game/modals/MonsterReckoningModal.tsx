import { useEffect, useState } from "react";

import type { GameState } from "../../../game/models/GameState";
import type { MonsterDefinition } from "../../../game/models/Monster";

import { CORE_MONSTERS } from "../../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../../content/core/coreEpicMonsters";

interface MonsterReckoningModalProps {
  game: GameState;

  monsterIds: string[];

  resolvedMonsterIds: string[];

  onResolveMonster: (
    monsterId: string,
  ) => void;
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

export default function MonsterReckoningModal({
  game,
  monsterIds,
  resolvedMonsterIds,
  onResolveMonster,
}: MonsterReckoningModalProps) {
  const [selectedMonsterId, setSelectedMonsterId] =
    useState<string | null>(null);

  const [flipped, setFlipped] =
    useState(false);

  const selectedMonster =
    selectedMonsterId
      ? game.monsters[selectedMonsterId]
      : null;

  const selectedDefinition =
    selectedMonster
      ? getMonsterDefinition(
          selectedMonster.definitionId,
        )
      : undefined;

  /*
   * ============================================================
   * RESET FLIP
   * ============================================================
   */

  useEffect(() => {
    setFlipped(false);
  }, [selectedMonsterId]);

  /*
   * ============================================================
   * SELECTED MONSTER
   * ============================================================
   */

  if (
    selectedMonster &&
    selectedDefinition
  ) {
    const isResolved =
      resolvedMonsterIds.includes(
        selectedMonster.id,
      );

    return (
      <div className="fixed inset-0 z-9999 overflow-y-auto bg-black/80 p-3 backdrop-blur-sm">

        <div
          className="
            relative
            mx-auto
            my-3
            flex
            max-h-[calc(100dvh-24px)]
            w-[min(96vw,1100px)]
            flex-col
            items-center
            overflow-y-auto
            overscroll-contain
            rounded-3xl
            border
            border-white/20
            bg-black/95
            px-6
            py-5
            shadow-2xl
            sm:px-8
            sm:py-6
          "
        >

          {/* CLOSE */}

          <button
            type="button"
            onClick={() =>
              setSelectedMonsterId(null)
            }
            className="
              absolute
              right-4
              top-4
              z-30
              rounded-lg
              bg-white/10
              px-4
              py-2
              text-sm
              font-bold
              text-white
              transition
              hover:bg-white/20
            "
          >
            VOLTAR
          </button>

          {/* TITLE */}

          <h2 className="shrink-0 text-center text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            {selectedDefinition.name}
          </h2>

          {/* CARD */}

          <div className="mt-4 flex min-h-0 flex-1 items-center justify-center">

            <button
              type="button"
              onClick={() =>
                setFlipped(
                  (value) => !value,
                )
              }
              className="
                flex
                min-h-0
                max-h-full
                max-w-full
                cursor-pointer
                items-center
                justify-center
              "
            >
              <img
                src={
                  flipped
                    ? selectedDefinition.frontImage
                    : selectedDefinition.backImage
                }
                alt={
                  selectedDefinition.name
                }
                className="
                  max-h-[68vh]
                  max-w-[55vw]
                  rounded-xl
                  object-contain
                  shadow-2xl
                "
                draggable={false}
              />
            </button>

          </div>

          {/* ACTIONS */}

          <div className="mt-4 flex shrink-0 items-center gap-4">

            <button
              type="button"
              onClick={() =>
                setFlipped(
                  (value) => !value,
                )
              }
              className="
                rounded-xl
                bg-white/10
                px-6
                py-3
                font-bold
                text-white
                transition
                hover:bg-white/20
              "
            >
              FLIP CARD
            </button>

            <button
              type="button"
              disabled={isResolved}
              onClick={() =>
                onResolveMonster(
                  selectedMonster.id,
                )
              }
              className={`rounded-xl px-7 py-3 font-black uppercase transition ${
                isResolved
                  ? "cursor-not-allowed bg-gray-700 text-gray-400"
                  : "bg-yellow-500 text-black hover:bg-yellow-400"
              }`}
            >
              {isResolved
                ? "EFFECT REALIZED"
                : "DO EFFECT"}
            </button>

          </div>

        </div>

      </div>
    );
  }

  /*
   * ============================================================
   * MONSTER LIST
   * ============================================================
   */

  const remainingMonsterIds =
    monsterIds.filter(
      (monsterId) =>
        !resolvedMonsterIds.includes(
          monsterId,
        ),
    );

  return (
    <div className="fixed inset-0 z-9999 overflow-y-auto bg-black/80 p-3 backdrop-blur-sm">

      <div
        className="
          mx-auto
          my-3
          flex
          max-h-[calc(100dvh-24px)]
          w-[min(96vw,1200px)]
          flex-col
          overflow-y-auto
          overscroll-contain
          rounded-3xl
          border
          border-white/20
          bg-black/95
          px-6
          py-5
          shadow-2xl
          sm:px-8
          sm:py-6
        "
      >

        {/* HEADER */}

        <div className="shrink-0 text-center">

          <h2 className="text-3xl font-black uppercase tracking-wide text-white sm:text-4xl">
            MYTHOS — RECKONING
          </h2>

          <p className="mt-2 text-sm text-gray-300">
            Resolve the Reckoning effects of
            the Monsters.
          </p>

        </div>

        {/* MONSTERS */}

        <div
          className="
            mt-6
            flex
            min-h-0
            flex-1
            items-center
            justify-center
            gap-6
          "
        >

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

              const isResolved =
                resolvedMonsterIds.includes(
                  monsterId,
                );

              return (
                <button
                  key={monsterId}
                  type="button"
                  disabled={isResolved}
                  onClick={() =>
                    setSelectedMonsterId(
                      monsterId,
                    )
                  }
                  className={`relative flex min-h-0 shrink-0 items-center justify-center transition ${
                    isResolved
                      ? "cursor-default opacity-40"
                      : "cursor-pointer hover:-translate-y-2 hover:scale-[1.03]"
                  }`}
                >

                  <img
                    src={
                      definition.frontImage
                    }
                    alt={
                      definition.name
                    }
                    className="
                      max-h-[62vh]
                      w-auto
                      max-w-[38vw]
                      rounded-xl
                      object-contain
                      shadow-xl
                    "
                    draggable={false}
                  />

                  {isResolved && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60">

                      <span className="rounded-lg bg-green-600 px-5 py-3 text-lg font-bold uppercase text-white">
                        REALIZADO
                      </span>

                    </div>
                  )}

                </button>
              );
            },
          )}

        </div>

        {/* STATUS */}

        <div className="mt-4 shrink-0 text-center text-sm text-gray-400">

          {remainingMonsterIds.length > 0
            ? `${remainingMonsterIds.length} monster${
                remainingMonsterIds.length ===
                1
                  ? ""
                  : "s"
              } remaining`
            : "All Monster Reckonings resolved."}

        </div>

      </div>

    </div>
  );
}