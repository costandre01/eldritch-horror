import type { ReactNode } from "react";

import type { Asset } from "../../../game/models/Asset";
import type { Artifact } from "../../../game/models/Artifact";
import type { Spell } from "../../../game/models/Spell";
import type { SpellDefinition } from "../../../game/models/SpellDefinition";
import type { Condition } from "../../../game/models/Condition";

interface InvestigatorPossessionsProps {
  assets: Asset[];
  artifacts: Artifact[];
  spells: Spell[];
  spellDefinitions: SpellDefinition[];
  conditions: Condition[];

  onOpenCard?: (
    type:
      | "asset"
      | "artifact"
      | "spell"
      | "condition",
    id: string,
  ) => void;
}

export default function InvestigatorPossessions({
  assets,
  artifacts,
  spells,
  spellDefinitions,
  conditions,
  onOpenCard,
}: InvestigatorPossessionsProps) {
  const getAssetImage = (
    asset: Asset,
  ) => {
    const filename =
      asset.name
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[.]/g, "");

    return `/cards/assets/${filename}.png`;
  };

  const getArtifactImage = (
    artifact: Artifact,
  ) => {
    return `/cards/artifacts/${artifact.id}.png`;
  };

  const getSpellDefinition = (
    spell: Spell,
  ) => {
    return spellDefinitions.find(
      (definition) =>
        definition.id ===
        spell.definitionId,
    );
  };

  return (
    <section className="min-w-0 p-5">

      <h2 className="mb-5 rounded-xl bg-[#30435f] px-4 py-4 text-2xl font-black">
        Possessions
      </h2>

      <PossessionSection
        title="Assets"
        count={assets.length}
      >
        {assets.map(
          (asset) => (
            <CardThumbnail
              key={asset.id}
              image={getAssetImage(
                asset,
              )}
              alt={asset.name}
              onClick={() =>
                onOpenCard?.(
                  "asset",
                  asset.id,
                )
              }
            />
          ),
        )}
      </PossessionSection>

      <PossessionSection
        title="Spells"
        count={spells.length}
      >
        {spells.map(
          (spell) => {
            const definition =
              getSpellDefinition(
                spell,
              );

            if (!definition) {
              return null;
            }

            return (
              <CardThumbnail
                key={spell.id}
                image={
                  spell.flipped
                    ? spell.backImage
                    : spell.frontImage
                }
                alt={definition.name}
                onClick={() =>
                  onOpenCard?.(
                    "spell",
                    spell.id,
                  )
                }
              />
            );
          },
        )}
      </PossessionSection>

      <PossessionSection
        title="Artifacts"
        count={artifacts.length}
      >
        {artifacts.map(
          (artifact) => (
            <CardThumbnail
              key={artifact.id}
              image={getArtifactImage(
                artifact,
              )}
              alt={artifact.id}
              onClick={() =>
                onOpenCard?.(
                  "artifact",
                  artifact.id,
                )
              }
            />
          ),
        )}
      </PossessionSection>

      <PossessionSection
        title="Conditions"
        count={conditions.length}
      >
        {conditions.map(
          (condition) => (
            <CardThumbnail
              key={condition.id}
              image={
                condition.flipped
                  ? condition.backImage
                  : condition.frontImage
              }
              alt={condition.id}
              onClick={() =>
                onOpenCard?.(
                  "condition",
                  condition.id,
                )
              }
            />
          ),
        )}
      </PossessionSection>

    </section>
  );
}

/*
 * ============================================================
 * POSSESSION SECTION
 * ============================================================
 */

function PossessionSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <section className="mb-6">

      <div className="mb-3 flex items-center justify-between">

        <h3 className="text-lg font-black text-white">
          {title}
        </h3>

        <span className="rounded-full bg-[#405ff0] px-2 py-1 text-xs font-bold">
          {count}
        </span>

      </div>

      {count > 0 ? (
        <div className="flex flex-wrap gap-4">
          {children}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-700 bg-[#111318] px-4 py-5 text-sm text-gray-500">
          None
        </div>
      )}

    </section>
  );
}

/*
 * ============================================================
 * CARD THUMBNAIL
 * ============================================================
 */

function CardThumbnail({
  image,
  alt,
  onClick,
}: {
  image: string;
  alt: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-xl border border-gray-700 bg-[#111318] transition hover:scale-[1.03] hover:border-blue-500"
    >
      <img
        src={image}
        alt={alt}
        className="h-64 w-auto max-w-45 object-contain"
      />
    </button>
  );
}