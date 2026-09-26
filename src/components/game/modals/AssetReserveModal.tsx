import type { Asset } from "../../../game/models/Asset";

interface AssetReserveModalProps {
  assets: Asset[];
  successes: number;
  resources: number;
  selectedAssetIds: string[];

  useBankLoan: boolean;
  onToggleBankLoan: () => void;

  onToggleAsset: (assetId: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  onDiscard: (assetId: string) => void;
}

export default function AssetReserveModal({
  assets,
  successes,
  resources,
  selectedAssetIds,

  useBankLoan,
  onToggleBankLoan,

  onToggleAsset,
  onConfirm,
  onClose,
  onDiscard,
}: AssetReserveModalProps) {
  const selectedValue = assets
    .filter((asset) =>
      selectedAssetIds.includes(asset.id),
    )
    .reduce(
      (total, asset) =>
        total + asset.value,
      0,
    );

  /*
   * RESOURCES NEEDED
   *
   * Successes cover the first part
   * of the selected Assets.
   *
   * Resources automatically cover
   * the remaining value.
   */

  const effectiveSuccesses =
    successes +
    (useBankLoan ? 2 : 0);

  const resourcesNeeded = Math.max(
    0,
    selectedValue - effectiveSuccesses,
  );

  const canAffordSelection =
    resourcesNeeded <= resources;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="w-[min(96vw,1100px)] max-h-[92vh] overflow-y-auto rounded-2xl border border-gray-700 bg-[#17191f] p-8 text-white shadow-2xl">

        {/* HEADER */}

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Eldritch Horror
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Acquire Assets
          </h2>

          <p className="mt-3 text-gray-400">
            Available successes:{" "}
            <span className="font-bold text-white">
              {effectiveSuccesses}
            </span>
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Choose Assets to acquire or one card to discard.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-5">

          {/* ================================================== */}
          {/* BANK LOAN - FIXED */}
          {/* ================================================== */}

          <button
            type="button"
            onClick={onToggleBankLoan}
            className={`
              relative
              overflow-hidden
              rounded-xl
              border-2
              bg-black
              shadow-lg
              transition-all
              duration-150
              ${
                useBankLoan
                  ? "border-green-400 ring-4 ring-green-400/40"
                  : "border-gray-700 hover:border-gray-400"
              }
            `}
          >
            <div
              className="
                aspect-2/3
                w-full
                bg-cover
                bg-no-repeat
              "
              style={{
                backgroundImage:
                  "url('/maps/eldritch-board.png')",
                backgroundSize:
                  "1515% 746%",
                backgroundPosition:
                  "0.8% 100%",
              }}
            />

            {useBankLoan && (
              <div
                className="
                  absolute
                  right-3
                  top-3
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-green-500
                  text-xl
                  font-black
                  text-white
                  shadow-lg
                "
              >
                ✓
              </div>
            )}
          </button>

          {/* ================================================== */}
          {/* ASSET RESERVE */}
          {/* ================================================== */}

          {assets.map((asset) => {
            const isSelected =
              selectedAssetIds.includes(
                asset.id,
              );

            const newSelectedValue =
              selectedValue + asset.value;

            const newResourcesNeeded =
              Math.max(
                0,
                newSelectedValue -
                  effectiveSuccesses,
              );

            const wouldExceedResources =
              newResourcesNeeded > resources;

            const disabledForAcquire =
              !isSelected &&
              selectedAssetIds.length > 0 &&
              wouldExceedResources;

            return (
              <button
                key={asset.id}
                type="button"
                disabled={disabledForAcquire}
                onClick={() =>
                  onToggleAsset(asset.id)
                }
                className={`
                  relative
                  overflow-hidden
                  rounded-xl
                  border-2
                  bg-black
                  shadow-lg
                  transition-all
                  duration-150
                  ${
                    isSelected
                      ? "border-green-400 ring-4 ring-green-400/40"
                      : "border-gray-700 hover:border-gray-400"
                  }
                  ${
                    disabledForAcquire
                      ? "cursor-not-allowed opacity-40"
                      : "cursor-pointer"
                  }
                `}
              >
                {asset.image && (
                  <img
                    src={asset.image}
                    alt={asset.name}
                    draggable={false}
                    className="
                      block
                      aspect-2/3
                      w-full
                      object-cover
                      select-none
                    "
                  />
                )}

                {isSelected && (
                  <div
                    className="
                      absolute
                      right-3
                      top-3
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-green-500
                      text-xl
                      font-black
                      text-white
                      shadow-lg
                    "
                  >
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* FOOTER */}

        <div className="mt-8 flex flex-col gap-4 border-t border-gray-800 pt-5 sm:flex-row sm:items-center sm:justify-between">

          {/* SELECTION INFO */}

          <div>
            <p className="text-sm text-gray-500">
              Selected total
            </p>

            <p className="text-2xl font-black">
              ${selectedValue}
              <span className="ml-1 text-sm font-normal text-gray-500">
                / ${effectiveSuccesses}
              </span>
            </p>

            <div className="mt-2 space-y-1 text-sm">
              <p className="text-gray-400">
                Available Resources:{" "}
                <span className="font-bold text-white">
                  {resources}
                </span>
              </p>

              <p className="text-gray-400">
                Resources spent:{" "}
                <span
                  className={
                    resourcesNeeded > 0
                      ? "font-bold text-yellow-400"
                      : "font-bold text-green-400"
                  }
                >
                  {resourcesNeeded}
                </span>
              </p>

              {selectedAssetIds.length > 0 && (
                <p
                  className={
                    canAffordSelection
                      ? "font-semibold text-green-400"
                      : "font-semibold text-red-400"
                  }
                >
                  {canAffordSelection
                    ? "✓ Purchase possible"
                    : "✕ Not enough Resources"}
                </p>
              )}

              {useBankLoan && (
                <p className="font-semibold text-yellow-400">
                  Bank Loan: +2 successes
                </p>
              )}
            </div>
          </div>

          {/* BUTTONS */}

          <div className="flex flex-wrap items-center gap-3">

            {/* DON'T ACQUIRE */}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-700 px-5 py-3 font-semibold text-white transition hover:bg-gray-600"
            >
              Don't Acquire
            </button>

            {/* DISCARD */}

            <button
              type="button"
              onClick={() => {
                const assetId =
                  selectedAssetIds[0];

                if (!assetId) {
                  return;
                }

                onDiscard(assetId);
              }}
              disabled={
                selectedAssetIds.length !== 1
              }
              className="rounded-lg bg-red-700 px-5 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
            >
              Discard 1
            </button>

            {/* ACQUIRE */}

            <button
              type="button"
              onClick={onConfirm}
              disabled={
                selectedAssetIds.length === 0 ||
                !canAffordSelection
              }
              className="rounded-lg bg-purple-700 px-5 py-3 font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
            >
              Acquire
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}