import type { Asset } from "../../../game/models/Asset";
import InvestigatorCardThumbnail from "./InvestigatorCardThumbnail";

interface InvestigatorItemsProps {
  assets: Asset[];
  onSelect: (asset: Asset) => void;
}

export default function InvestigatorItems({
  assets,
  onSelect,
}: InvestigatorItemsProps) {
  const getAssetImage = (asset: Asset) => {
    const filename = asset.name
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[.]/g, "");

    return `/cards/assets/${filename}.png`;
  };

  return (
    <section className="min-w-0 rounded-xl border border-slate-700/70 bg-slate-900/50 p-3">
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100">
          Assets
        </h3>

        <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-semibold text-blue-300">
          {assets.length}
        </span>
      </div>

      {/* ================================================== */}
      {/* EMPTY */}
      {/* ================================================== */}

      {assets.length === 0 ? (
        <div className="mt-3 flex min-h-14 items-center gap-2 rounded-lg border border-dashed border-slate-700 bg-slate-950/40 px-3 text-xs text-slate-400">
          <span className="text-base text-slate-500">＋</span>
          No assets yet
        </div>
      ) : (
        /* ================================================== */
        /* ITEMS */
        /* ================================================== */

        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {assets.map((asset) => {
            const imagePath = getAssetImage(asset);

            return (
              <InvestigatorCardThumbnail
                key={asset.id}
                image={imagePath}
                name={asset.name}
                kind="asset"
                onClick={() => onSelect(asset)}
                onImageError={() => {
                  console.error("Asset image not found:", imagePath);
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
