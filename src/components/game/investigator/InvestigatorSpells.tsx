import type { Spell } from "../../../game/models/Spell";
import type { SpellDefinition } from "../../../game/models/SpellDefinition";
import InvestigatorCardThumbnail from "./InvestigatorCardThumbnail";

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
    <section className="min-w-0 rounded-xl border border-slate-700/70 bg-slate-900/50 p-3">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-center justify-between">

        <h3 className="text-sm font-bold text-slate-100">
          Spells
        </h3>

        <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-xs font-semibold text-purple-300">
          {spells.length}
        </span>

      </div>

      {/* ================================================== */}
      {/* EMPTY */}
      {/* ================================================== */}

      {spells.length === 0 ? (

        <div className="mt-3 flex min-h-14 items-center gap-2 rounded-lg border border-dashed border-slate-700 bg-slate-950/40 px-3 text-xs text-slate-400">
          <span className="text-base text-slate-500">＋</span>
          No spells yet
        </div>

      ) : (

        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">

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
              <InvestigatorCardThumbnail
                key={spell.id}
                image={spell.flipped ? spell.backImage : spell.frontImage}
                name={spellDefinition.name}
                kind="spell"
                badge={spell.exhausted ? "Exhausted" : undefined}
                onClick={() => onSelect(spell, spellDefinition)}
              />
            );
          })}

        </div>
      )}

    </section>
  );
}
