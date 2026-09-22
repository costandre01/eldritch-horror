import type { ReactNode } from "react";
import type { Investigator } from "../../../game/models/Investigator";

import ActionButton from "./ActionButton";
import ActionTooltip from "./ActionTooltip";

interface InvestigatorActionsPanelProps {
  investigator: Investigator;

  canTravel: boolean;
  canRest: boolean;
  canPrepareForTravel: boolean;
  canTrade: boolean;
  canAcquireAssets: boolean;

  onStartTravel: () => void;
  onRest: () => void;
  onPrepareForTravel: () => void;
  onTrade: () => void;
  onAcquireAssets: () => void;

  onEndTravel: () => void;
  onUndoTravel: () => void;
  onEndActions: () => void;
}

export default function InvestigatorActionsPanel({
  investigator,

  canTravel,
  canRest,
  canPrepareForTravel,
  canTrade,
  canAcquireAssets,

  onStartTravel,
  onRest,
  onPrepareForTravel,
  onTrade,
  onAcquireAssets,

  onEndTravel,
  onUndoTravel,
  onEndActions,
}: InvestigatorActionsPanelProps) {
  const actionsCount =
    investigator.actionsPerformed.length;

  const hasAvailableActions =
    actionsCount < 2;

  /*
   * ============================================================
   * ACTION BUTTONS
   * ============================================================
   */

  const actionButtons: {
    label: string;
    icon: string;
    disabled: boolean;
    onClick: () => void;
    description: ReactNode;
  }[] = [
    {
      label: "Travel",

      icon: "/icons/game/ship-path.png",

      disabled: !canTravel,

      onClick: onStartTravel,

      description: (
        <span className="inline-flex flex-wrap items-center justify-center gap-1">
          Move along connected paths.
          Travel allows you to move up to your available movement.
        </span>
      ),
    },

    {
      label: "Rest",

      icon: "/icons/game/health.png",

      disabled: !canRest,

      onClick: onRest,

      description: (
        <span className="inline-flex flex-wrap items-center justify-center gap-1">
          <span>Gain</span>

          <img
            src="/icons/game/health.png"
            alt=""
            aria-hidden="true"
            className="inline-block h-5 w-5 object-contain"
          />

          <span>1 Health and</span>

          <img
            src="/icons/game/sanity.png"
            alt=""
            aria-hidden="true"
            className="inline-block h-5 w-5 object-contain"
          />

          <span>1 Sanity.</span>
        </span>
      ),
    },

    {
      label: "Prepare for Travel",

      icon: "/icons/game/train.png",

      disabled: !canPrepareForTravel,

      onClick: onPrepareForTravel,

      description: (
        <span className="inline-flex flex-wrap items-center justify-center gap-1">
          <span>Gain 1</span>

          <img
            src="/icons/game/train.png"
            alt=""
            aria-hidden="true"
            className="inline-block h-5 w-5 object-contain"
          />

          <span>Train Ticket or 1</span>

          <img
            src="/icons/game/ship.png"
            alt=""
            aria-hidden="true"
            className="inline-block h-5 w-5 object-contain"
          />

          <span>Ship Ticket.</span>
        </span>
      ),
    },

    {
      label: "Trade",

      icon: "/icons/game/influence.png",

      disabled: !canTrade,

      onClick: onTrade,

      description: (
        <span className="inline-flex flex-wrap items-center justify-center gap-1">
          Trade possessions with another Investigator
          in the same space.
        </span>
      ),
    },

    {
      label: "Acquire Assets",

      icon: "/icons/game/resource.png",

      disabled: !canAcquireAssets,

      onClick: onAcquireAssets,

      description: (
        <span className="inline-flex flex-wrap items-center justify-center gap-1">
          Perform an Influence test to acquire
          Assets from the reserve.
        </span>
      ),
    },
  ];

  return (
    /*
     * ============================================================
     * ACTIONS CONTAINER
     * ============================================================
     *
     * Important:
     * - relative
     * - overflow-visible
     * - no enclosing visual box
     *
     * This allows the tooltips to extend over the map.
     */

    <section className="relative z-40 w-full overflow-visible">

      {/* ====================================================== */}
      {/* ACTION HEADER */}
      {/* ====================================================== */}

      <div className="relative flex items-center justify-center">

        <div className="relative flex items-center">

          {/* ================================================== */}
          {/* ACTION BAR */}
          {/* ================================================== */}

          <div className="relative z-40 flex items-center justify-center overflow-visible rounded-xl border border-gray-700/70 bg-[#18233d]/95 shadow-xl backdrop-blur-sm">

            {actionButtons.map((action) => (
              <div
                key={action.label}
                className="relative z-50 flex items-center"
              >
                <ActionTooltip
                  title={action.label}
                  description={action.description}
                >
                  <ActionButton
                    label={action.label}
                    icon={action.icon}
                    onClick={action.onClick}
                    disabled={
                      !hasAvailableActions ||
                      action.disabled
                    }
                  />
                </ActionTooltip>
              </div>
            ))}

          </div>

          {/* ================================================== */}
          {/* ACTION COUNT */}
          {/* ================================================== */}

          <div className="absolute -right-3 -top-3 z-100 rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs font-bold text-white shadow-lg">
            {actionsCount} / 2
          </div>

        </div>

      </div>

      {/* ====================================================== */}
      {/* TRAVEL IN PROGRESS */}
      {/* ====================================================== */}

      {investigator.travelActive && (
        <div className="mt-3 flex justify-center">
          <div className="relative z-40 flex items-center gap-4 rounded-xl border border-gray-700/60 bg-[#172033]/95 px-5 py-3 shadow-lg backdrop-blur-sm">

            <div>
              <div className="flex items-center justify-center gap-2">

                <img
                  src="/icons/game/ship-path.png"
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5 object-contain"
                />

                <span className="text-sm font-bold uppercase tracking-widest text-green-400">
                  Travel in Progress
                </span>

              </div>

              <p className="mt-1 text-center text-sm text-gray-400">
                Movement remaining:{" "}
                <span className="font-bold text-white">
                  {investigator.travelMoves}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={onEndTravel}
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
            >
              End Travel
            </button>

          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* UNDO TRAVEL */}
      {/* ====================================================== */}

      {!investigator.travelActive &&
        actionsCount > 0 && (
          <div className="mt-3 flex justify-center">

            <div className="flex items-center gap-3 rounded-lg bg-[#141c2d]/90 px-4 py-2">

              <span className="text-xs text-gray-500">
                Travel can be reversed before continuing.
              </span>

              <button
                type="button"
                onClick={onUndoTravel}
                className="rounded-lg bg-yellow-700 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-yellow-600"
              >
                Undo Travel
              </button>

            </div>

          </div>
        )}

      {/* ====================================================== */}
      {/* ACTIONS PERFORMED */}
      {/* ====================================================== */}

      <div className="mt-3 text-center">

        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
          Actions Performed
        </div>

        {actionsCount === 0 ? (
          <p className="mt-1 text-xs text-gray-500">
            No actions performed.
          </p>
        ) : (
          <div className="mt-2 flex flex-wrap justify-center gap-2">

            {investigator.actionsPerformed.map(
              (action, index) => (
                <span
                  key={`${action}-${index}`}
                  className="rounded-md bg-gray-800/90 px-3 py-1.5 text-xs font-semibold text-gray-300"
                >
                  {formatActionName(action)}
                </span>
              ),
            )}

          </div>
        )}

      </div>

      {/* ====================================================== */}
      {/* FINISH ACTIONS */}
      {/* ====================================================== */}

      {!investigator.travelActive && (
          <div className="mt-3 flex justify-center">

            <button
              type="button"
              onClick={onEndActions}
              className="rounded-lg bg-red-700 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-red-600"
            >
              Finish Actions
            </button>

          </div>
        )}

    </section>
  );
}

/*
 * ============================================================
 * ACTION NAME
 * ============================================================
 */

function formatActionName(
  action: string,
): string {
  switch (action) {
    case "travel":
      return "Travel";

    case "rest":
      return "Rest";

    case "prepare-for-travel":
      return "Prepare for Travel";

    case "trade":
      return "Trade";

    case "acquire-assets":
      return "Acquire Assets";

    default:
      return action;
  }
}