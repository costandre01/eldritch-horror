import type { Spell } from "../../../game/models/Spell";
import type { SpellDefinition } from "../../../game/models/SpellDefinition";

interface InvestigatorSpellsProps {
  spells: Spell[];

  spellDefinitions: SpellDefinition[];

  onSelect: (
    spell: Spell,
    spellDefinition: SpellDefinition,
  ) => void;
}

export default function InvestigatorSpells({
  spells,
  spellDefinitions,
  onSelect,
}: InvestigatorSpellsProps) {
  const getSpellDefinition = (
    spell: Spell,
  ) =>
    spellDefinitions.find(
      (definition) =>
        definition.id ===
        spell.definitionId,
    );

  return (
    <section className="mt-8">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-bold">
          Spells
        </h3>

        <span className="text-sm text-gray-500">
          {spells.length}
        </span>

      </div>

      {/* ================================================== */}
      {/* EMPTY */}
      {/* ================================================== */}

      {spells.length === 0 ? (

        <div className="mt-3 rounded-xl border border-gray-800 bg-gray-900 p-5 text-center text-sm text-gray-500">
          This investigator has no Spells.
        </div>

      ) : (

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

          {spells.map((spell) => {

            const spellDefinition =
              getSpellDefinition(
                spell,
              );

            /*
             * ================================================
             * MISSING DEFINITION
             * ================================================
             */

            if (!spellDefinition) {
              return (
                <div
                  key={spell.id}
                  className="rounded-xl border border-red-900 bg-red-950/30 p-4"
                >
                  <p className="text-sm text-red-400">
                    Spell definition not found.
                  </p>
                </div>
              );
            }

            /*
             * ================================================
             * SPELL
             * ================================================
             */

            return (
              <button
                key={spell.id}
                type="button"
                onClick={() =>
                  onSelect(
                    spell,
                    spellDefinition,
                  )
                }
                className="group overflow-hidden rounded-xl border border-purple-900/60 bg-purple-950/20 text-left transition hover:-translate-y-1 hover:border-purple-500 hover:bg-purple-950/40 hover:shadow-lg"
              >

                {/* ========================================== */}
                {/* IMAGE */}
                {/* ========================================== */}

                <div className="relative h-44 overflow-hidden bg-gray-950">

                  <img
                    src={
                      spell.flipped
                        ? spell.backImage
                        : spell.frontImage
                    }
                    alt={
                      spellDefinition.name
                    }
                    className="absolute inset-0 h-auto w-full object-cover object-top transition duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-gray-900 to-transparent" />

                  {spell.exhausted && (
                    <span className="absolute right-3 top-3 rounded-full bg-gray-900/90 px-2 py-1 text-[10px] font-bold uppercase text-gray-400">
                      Exhausted
                    </span>
                  )}

                </div>

                {/* ========================================== */}
                {/* INFORMATION */}
                {/* ========================================== */}

                <div className="p-4">

                  <h4 className="font-bold text-white">
                    {spellDefinition.name}
                  </h4>

                  <p className="mt-1 text-xs uppercase tracking-wide text-purple-400">
                    {spellDefinition.type}
                  </p>

                  <p className="mt-3 text-sm leading-5 text-gray-400">
                    {spellDefinition.description}
                  </p>

                  {/* ======================================== */}
                  {/* LORE BONUS */}
                  {/* ======================================== */}

                  {spellDefinition.loreBonus !==
                    0 && (
                    <p className="mt-3 text-xs text-gray-500">
                      Lore bonus:{" "}
                      <span className="font-bold text-white">
                        {spellDefinition.loreBonus >
                        0
                          ? "+"
                          : ""}
                        {
                          spellDefinition.loreBonus
                        }
                      </span>
                    </p>
                  )}

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-600 transition group-hover:text-purple-400">
                    Click to view card
                  </p>

                </div>

              </button>
            );
          })}

        </div>
      )}

    </section>
  );
}