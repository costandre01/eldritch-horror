import { useState } from "react";
import type {
  Dispatch,
  SetStateAction,
} from "react";

import type { Asset } from "../../../game/models/Asset";
import type { Artifact } from "../../../game/models/Artifact";
import type { Spell } from "../../../game/models/Spell";

export interface TradeOffer {
  clues: number;
  trainTickets: number;
  shipTickets: number;

  assetIds: string[];
  artifactIds: string[];
  spellIds: string[];

  targetClues: number;
  targetTrainTickets: number;
  targetShipTickets: number;

  targetAssetIds: string[];
  targetArtifactIds: string[];
  targetSpellIds: string[];
}

interface TradeModalProps {
  investigatorName: string;
  targetInvestigatorName: string;

  investigatorClues: number;
  investigatorTrainTickets: number;
  investigatorShipTickets: number;

  targetClues: number;
  targetTrainTickets: number;
  targetShipTickets: number;

  assets: Asset[];
  artifacts: Artifact[];
  spells: Spell[];

  targetAssets: Asset[];
  targetArtifacts: Artifact[];
  targetSpells: Spell[];

  onTrade: (
    offer: TradeOffer,
  ) => void;

  onCancel: () => void;
}

export default function TradeModal({
  investigatorName,
  targetInvestigatorName,

  investigatorClues,
  investigatorTrainTickets,
  investigatorShipTickets,

  targetClues,
  targetTrainTickets,
  targetShipTickets,

  assets,
  artifacts,
  spells,

  targetAssets,
  targetArtifacts,
  targetSpells,

  onTrade,
  onCancel,
}: TradeModalProps) {
  /*
   * ============================================================
   * MY OFFER
   * ============================================================
   */

  const [clues, setClues] =
    useState(0);

  const [trainTickets, setTrainTickets] =
    useState(0);

  const [shipTickets, setShipTickets] =
    useState(0);

  const [assetIds, setAssetIds] =
    useState<string[]>([]);

  const [artifactIds, setArtifactIds] =
    useState<string[]>([]);

  const [spellIds, setSpellIds] =
    useState<string[]>([]);

  /*
   * ============================================================
   * TARGET OFFER
   * ============================================================
   */

  const [
    targetClueAmount,
    setTargetClueAmount,
  ] = useState(0);

  const [
    targetTrainAmount,
    setTargetTrainAmount,
  ] = useState(0);

  const [
    targetShipAmount,
    setTargetShipAmount,
  ] = useState(0);

  const [
    targetAssetIds,
    setTargetAssetIds,
  ] = useState<string[]>([]);

  const [
    targetArtifactIds,
    setTargetArtifactIds,
  ] = useState<string[]>([]);

  const [
    targetSpellIds,
    setTargetSpellIds,
  ] = useState<string[]>([]);

  /*
   * ============================================================
   * TOGGLE CARD
   * ============================================================
   */

  function toggleId(
    id: string,
    setter: Dispatch<
      SetStateAction<string[]>
    >,
  ) {
    setter((current) =>
      current.includes(id)
        ? current.filter(
            (item) =>
              item !== id,
          )
        : [
            ...current,
            id,
          ],
    );
  }

  /*
   * ============================================================
   * COMPLETE TRADE
   * ============================================================
   */

  function handleCompleteTrade() {
    const hasMine =
      clues > 0 ||
      trainTickets > 0 ||
      shipTickets > 0 ||
      assetIds.length > 0 ||
      artifactIds.length > 0 ||
      spellIds.length > 0;

    const hasTheirs =
      targetClueAmount > 0 ||
      targetTrainAmount > 0 ||
      targetShipAmount > 0 ||
      targetAssetIds.length > 0 ||
      targetArtifactIds.length > 0 ||
      targetSpellIds.length > 0;

    /*
     * At least one possession must be exchanged.
     */

    if (!hasMine && !hasTheirs) {
      return;
    }

    onTrade({
      /*
       * Active investigator
       */

      clues,
      trainTickets,
      shipTickets,

      assetIds,
      artifactIds,
      spellIds,

      /*
       * Target investigator
       */

      targetClues:
        targetClueAmount,

      targetTrainTickets:
        targetTrainAmount,

      targetShipTickets:
        targetShipAmount,

      targetAssetIds,
      targetArtifactIds,
      targetSpellIds,
    });
  }

  /*
   * ============================================================
   * TRADE VALIDATION
   * ============================================================
   */

  const hasMine =
    clues > 0 ||
    trainTickets > 0 ||
    shipTickets > 0 ||
    assetIds.length > 0 ||
    artifactIds.length > 0 ||
    spellIds.length > 0;

  const hasTheirs =
    targetClueAmount > 0 ||
    targetTrainAmount > 0 ||
    targetShipAmount > 0 ||
    targetAssetIds.length > 0 ||
    targetArtifactIds.length > 0 ||
    targetSpellIds.length > 0;

  const hasTrade =
    hasMine ||
    hasTheirs;

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="fixed inset-0 z-130 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">

      <div className="flex max-h-[92vh] w-[min(96vw,1150px)] flex-col overflow-hidden rounded-2xl border border-gray-700 bg-[#17191f] text-white shadow-2xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="border-b border-gray-800 px-6 py-5 text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Investigator Action
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Trade
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Select the possessions each Investigator
            will exchange.
          </p>

        </div>

        {/* ================================================== */}
        {/* CONTENT */}
        {/* ================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto p-5">

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* ================================================== */}
            {/* MY SIDE */}
            {/* ================================================== */}

            <TradeSide
              title={investigatorName}
              subtitle="Your possessions"
              clues={investigatorClues}
              trainTickets={
                investigatorTrainTickets
              }
              shipTickets={
                investigatorShipTickets
              }
              selectedClues={
                clues
              }
              selectedTrainTickets={
                trainTickets
              }
              selectedShipTickets={
                shipTickets
              }
              onCluesChange={
                setClues
              }
              onTrainChange={
                setTrainTickets
              }
              onShipChange={
                setShipTickets
              }
              assets={assets}
              artifacts={artifacts}
              spells={spells}
              selectedAssetIds={
                assetIds
              }
              selectedArtifactIds={
                artifactIds
              }
              selectedSpellIds={
                spellIds
              }
              onToggleAsset={(id) =>
                toggleId(
                  id,
                  setAssetIds,
                )
              }
              onToggleArtifact={(id) =>
                toggleId(
                  id,
                  setArtifactIds,
                )
              }
              onToggleSpell={(id) =>
                toggleId(
                  id,
                  setSpellIds,
                )
              }
            />

            {/* ================================================== */}
            {/* TARGET SIDE */}
            {/* ================================================== */}

            <TradeSide
              title={targetInvestigatorName}
              subtitle="Their possessions"
              clues={targetClues}
              trainTickets={
                targetTrainTickets
              }
              shipTickets={
                targetShipTickets
              }
              selectedClues={
                targetClueAmount
              }
              selectedTrainTickets={
                targetTrainAmount
              }
              selectedShipTickets={
                targetShipAmount
              }
              onCluesChange={
                setTargetClueAmount
              }
              onTrainChange={
                setTargetTrainAmount
              }
              onShipChange={
                setTargetShipAmount
              }
              assets={targetAssets}
              artifacts={
                targetArtifacts
              }
              spells={targetSpells}
              selectedAssetIds={
                targetAssetIds
              }
              selectedArtifactIds={
                targetArtifactIds
              }
              selectedSpellIds={
                targetSpellIds
              }
              onToggleAsset={(id) =>
                toggleId(
                  id,
                  setTargetAssetIds,
                )
              }
              onToggleArtifact={(id) =>
                toggleId(
                  id,
                  setTargetArtifactIds,
                )
              }
              onToggleSpell={(id) =>
                toggleId(
                  id,
                  setTargetSpellIds,
                )
              }
            />

          </div>

        </div>

        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <div className="flex items-center justify-end gap-3 border-t border-gray-800 bg-[#14161b] p-4">

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-gray-800 px-6 py-3 text-sm font-bold text-gray-300 transition hover:bg-gray-700 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!hasTrade}
            onClick={
              handleCompleteTrade
            }
            className="rounded-xl bg-amber-700 px-7 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-600"
          >
            Complete Trade
          </button>

        </div>

      </div>

    </div>
  );
}

/*
 * ============================================================
 * TRADE SIDE
 * ============================================================
 */

interface TradeSideProps {
  title: string;
  subtitle: string;

  clues: number;
  trainTickets: number;
  shipTickets: number;

  selectedClues: number;
  selectedTrainTickets: number;
  selectedShipTickets: number;

  onCluesChange: (
    value: number,
  ) => void;

  onTrainChange: (
    value: number,
  ) => void;

  onShipChange: (
    value: number,
  ) => void;

  assets: Asset[];
  artifacts: Artifact[];
  spells: Spell[];

  selectedAssetIds: string[];
  selectedArtifactIds: string[];
  selectedSpellIds: string[];

  onToggleAsset: (
    id: string,
  ) => void;

  onToggleArtifact: (
    id: string,
  ) => void;

  onToggleSpell: (
    id: string,
  ) => void;
}

function TradeSide({
  title,
  subtitle,

  clues,
  trainTickets,
  shipTickets,

  selectedClues,
  selectedTrainTickets,
  selectedShipTickets,

  onCluesChange,
  onTrainChange,
  onShipChange,

  assets,
  artifacts,
  spells,

  selectedAssetIds,
  selectedArtifactIds,
  selectedSpellIds,

  onToggleAsset,
  onToggleArtifact,
  onToggleSpell,
}: TradeSideProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-700 bg-[#111827]">

      {/* ================================================== */}
      {/* SIDE HEADER */}
      {/* ================================================== */}

      <div className="border-b border-gray-700 bg-gray-900 p-4">

        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {subtitle}
        </p>

        <h3 className="mt-1 text-lg font-black">
          {title}
        </h3>

      </div>

      <div className="space-y-5 p-4">

        {/* ================================================== */}
        {/* CLUES */}
        {/* ================================================== */}

        <TradeNumber
          label="Clues"
          icon="/icons/game/clue.png"
          available={clues}
          value={selectedClues}
          onChange={
            onCluesChange
          }
        />

        {/* ================================================== */}
        {/* TRAIN */}
        {/* ================================================== */}

        <TradeNumber
          label="Train Tickets"
          icon="/icons/game/train.png"
          available={
            trainTickets
          }
          value={
            selectedTrainTickets
          }
          onChange={
            onTrainChange
          }
        />

        {/* ================================================== */}
        {/* SHIP */}
        {/* ================================================== */}

        <TradeNumber
          label="Ship Tickets"
          icon="/icons/game/ship.png"
          available={
            shipTickets
          }
          value={
            selectedShipTickets
          }
          onChange={
            onShipChange
          }
        />

        {/* ================================================== */}
        {/* ASSETS */}
        {/* ================================================== */}

        <TradeCards
          title="Assets"
          assets={assets}
          selectedIds={
            selectedAssetIds
          }
          onToggle={
            onToggleAsset
          }
        />

        {/* ================================================== */}
        {/* ARTIFACTS */}
        {/* ================================================== */}

        <TradeCards
          title="Artifacts"
          artifacts={
            artifacts
          }
          selectedIds={
            selectedArtifactIds
          }
          onToggle={
            onToggleArtifact
          }
        />

        {/* ================================================== */}
        {/* SPELLS */}
        {/* ================================================== */}

        <TradeCards
          title="Spells"
          spells={spells}
          selectedIds={
            selectedSpellIds
          }
          onToggle={
            onToggleSpell
          }
        />

      </div>

    </section>
  );
}

/*
 * ============================================================
 * NUMBER ITEM
 * ============================================================
 */

interface TradeNumberProps {
  label: string;
  icon: string;
  available: number;
  value: number;

  onChange: (
    value: number,
  ) => void;
}

function TradeNumber({
  label,
  icon,
  available,
  value,
  onChange,
}: TradeNumberProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-700 bg-gray-900 p-3">

      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="h-8 w-8 object-contain"
      />

      <div className="flex-1">

        <p className="text-sm font-bold">
          {label}
        </p>

        <p className="text-xs text-gray-500">
          Available: {available}
        </p>

      </div>

      <div className="flex items-center gap-1">

        <button
          type="button"
          disabled={
            value <= 0
          }
          onClick={() =>
            onChange(
              Math.max(
                0,
                value - 1,
              ),
            )
          }
          className="h-8 w-8 rounded-lg bg-gray-800 font-black transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
        >
          −
        </button>

        <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-gray-800 px-2 text-sm font-black">
          {value}
        </span>

        <button
          type="button"
          disabled={
            value >= available
          }
          onClick={() =>
            onChange(
              Math.min(
                available,
                value + 1,
              ),
            )
          }
          className="h-8 w-8 rounded-lg bg-gray-800 font-black transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
        >
          +
        </button>

      </div>

    </div>
  );
}

/*
 * ============================================================
 * CARD LIST
 * ============================================================
 */

interface TradeCardsProps {
  title: string;

  assets?: Asset[];
  artifacts?: Artifact[];
  spells?: Spell[];

  selectedIds: string[];

  onToggle: (
    id: string,
  ) => void;
}

function TradeCards({
  title,

  assets = [],
  artifacts = [],
  spells = [],

  selectedIds,

  onToggle,
}: TradeCardsProps) {
  const cards = [
    ...assets.map(
      (item) => ({
        id: item.id,
        name: item.name,
        image: `/cards/assets/${item.name
          .trim()
          .replace(
            /\s+/g,
            "_",
          )
          .replace(
            /[.]/g,
            "",
          )}.png`,
      }),
    ),

    ...artifacts.map(
      (item) => ({
        id: item.id,
        name: item.name,
        image: `/cards/artifacts/${item.id}.png`,
      }),
    ),

    ...spells.map(
      (item) => ({
        id: item.id,
        name: item.definitionId,
        image: item.flipped
          ? item.backImage
          : item.frontImage,
      }),
    ),
  ];

  if (
    cards.length === 0
  ) {
    return (
      <div>

        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          {title}
        </p>

        <p className="rounded-lg border border-gray-800 bg-gray-900 p-3 text-xs text-gray-600">
          None
        </p>

      </div>
    );
  }

  return (
    <div>

      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
        {title}
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

        {cards.map(
          (card) => {
            const selected =
              selectedIds.includes(
                card.id,
              );

            return (
              <button
                key={card.id}
                type="button"
                onClick={() =>
                  onToggle(
                    card.id,
                  )
                }
                className={`overflow-hidden rounded-xl border text-left transition ${
                  selected
                    ? "border-amber-400 bg-amber-950/50 ring-2 ring-amber-500/40"
                    : "border-gray-700 bg-gray-900 hover:border-gray-500 hover:bg-gray-800"
                }`}
              >

                <div className="aspect-3/4 overflow-hidden bg-black">

                  <img
                    src={
                      card.image
                    }
                    alt={
                      card.name
                    }
                    className="h-full w-full object-cover"
                  />

                </div>

                <div className="p-2">

                  <p className="truncate text-xs font-bold">
                    {card.name}
                  </p>

                  {selected && (
                    <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-amber-400">
                      Selected
                    </p>
                  )}

                </div>

              </button>
            );
          },
        )}

      </div>

    </div>
  );
}