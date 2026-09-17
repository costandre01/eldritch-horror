import type { Asset } from "../../../game/models/Asset";

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
    <section className="mt-8">
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">
          Items
        </h3>

        <span className="text-sm text-gray-500">
          {assets.length}
        </span>
      </div>

      {/* ================================================== */}
      {/* EMPTY */}
      {/* ================================================== */}

      {assets.length === 0 ? (
        <div className="mt-3 rounded-xl border border-gray-800 bg-gray-900 p-5 text-center text-sm text-gray-500">
          This investigator has no Items.
        </div>
      ) : (
        /* ================================================== */
        /* ITEMS */
        /* ================================================== */

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => {
            const imagePath = getAssetImage(asset);

            return (
              <button
                key={asset.id}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onSelect(asset);
                }}
                className="group overflow-hidden rounded-xl border border-gray-700 bg-gray-900 text-left transition hover:-translate-y-1 hover:border-blue-500 hover:bg-gray-800 hover:shadow-lg"
              >
                <div className="relative h-44 overflow-hidden bg-gray-950">
                  <img
                    src={imagePath}
                    alt={asset.name}
                    className="absolute inset-0 h-auto w-full object-cover object-top transition duration-300 group-hover:scale-105"
                    onError={(event) => {
                      console.error(
                        "Asset image not found:",
                        imagePath,
                      );

                      event.currentTarget.style.display =
                        "none";
                    }}
                  />

                  <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-gray-900 to-transparent" />
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-white">
                    {asset.name}
                  </h4>

                  <p className="mt-1 text-xs uppercase tracking-wide text-blue-400">
                    {asset.type}
                  </p>

                  <p className="mt-3 text-sm leading-5 text-gray-400">
                    {asset.description}
                  </p>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-600 transition group-hover:text-blue-400">
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