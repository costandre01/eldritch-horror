import { useState } from "react";

import type { Investigator } from "../../../game/models/Investigator";
import type { Asset } from "../../../game/models/Asset";
import type { Artifact } from "../../../game/models/Artifact";
import type { Spell } from "../../../game/models/Spell";
import type { Condition } from "../../../game/models/Condition";

import InvestigatorHealthSanity from "./InvestigatorHealthSanity";
import InvestigatorSkills from "./InvestigatorSkills";
import InvestigatorResources from "./InvestigatorResources";
import InvestigatorLocation from "./InvestigatorLocation";

import InvestigatorItems from "./InvestigatorItems";
import InvestigatorArtifacts from "./InvestigatorArtifacts";
import InvestigatorSpells from "./InvestigatorSpells";
import InvestigatorConditions from "./InvestigatorConditions";

import { coreSpells } from "../../../content/core/coreSpell";

interface ActiveInvestigatorPanelProps {
  investigator: Investigator;

  investigatorName: string;
  investigatorPortrait: string;

  assets: Asset[];
  artifacts: Artifact[];
  spells: Spell[];
  conditions: Condition[];

  onOpenCards: () => void;
}

type SelectedCard =
  | {
      kind: "asset";
      card: Asset;
    }
  | {
      kind: "artifact";
      card: Artifact;
    }
  | {
      kind: "spell";
      card: Spell;
    }
  | {
      kind: "condition";
      card: Condition;
    };

export default function ActiveInvestigatorPanel({
  investigator,
  investigatorName,
  investigatorPortrait,

  assets,
  artifacts,
  spells,
  conditions,
}: ActiveInvestigatorPanelProps) {
  const [selectedCard, setSelectedCard] =
    useState<SelectedCard | null>(null);

  /*
   * ============================================================
   * ASSET IMAGE
   * ============================================================
   */

  function getAssetImage(asset: Asset): string {
    const fileName = asset.name
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[.]/g, "");

    return `/cards/assets/${fileName}.png`;
  }

  /*
   * ============================================================
   * ARTIFACT IMAGE
   * ============================================================
   */

  function getArtifactImage(
    artifact: Artifact,
  ): string {
    const fileName = artifact.name
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[.]/g, "");

    return `/cards/artifacts/${fileName}.png`;
  }

  /*
   * ============================================================
   * CARD PREVIEW
   * ============================================================
   */

  function closeCardPreview() {
    setSelectedCard(null);
  }

  return (
    <>
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">

        {/* ================================================== */}
        {/* LEFT - INVESTIGATOR INFORMATION */}
        {/* ================================================== */}

        <div
          className="
            min-w-0
            rounded-2xl
            border
            border-gray-800
            bg-gray-900/95
            p-4
            text-white
            shadow-xl
          "
        >

          {/* ================================================== */}
          {/* PORTRAIT */}
          {/* ================================================== */}

          <div className="flex justify-center">
            <img
              src={investigatorPortrait}
              alt={investigatorName}
              className="
                max-h-80
                w-auto
                max-w-full
                rounded-xl
                object-contain
              "
            />
          </div>

          {/* ================================================== */}
          {/* NAME */}
          {/* ================================================== */}

          <div className="mt-3 text-center">
            <h2 className="text-lg font-black text-white">
              {investigatorName}
            </h2>
          </div>

          {/* ================================================== */}
          {/* HEALTH / SANITY */}
          {/* ================================================== */}

          <div className="mt-3">
            <InvestigatorHealthSanity
              investigator={investigator}
            />
          </div>

          {/* ================================================== */}
          {/* SKILLS */}
          {/* ================================================== */}

          <div className="mt-3">
            <InvestigatorSkills
              investigator={investigator}
            />
          </div>

          {/* ================================================== */}
          {/* RESOURCES */}
          {/* ================================================== */}

          <div className="mt-3">
            <InvestigatorResources
              investigator={investigator}
            />
          </div>

          {/* ================================================== */}
          {/* LOCATION */}
          {/* ================================================== */}

          <div className="mt-3">
            <InvestigatorLocation
              investigator={investigator}
            />
          </div>

        </div>

        {/* ================================================== */}
        {/* RIGHT - POSSESSIONS */}
        {/* ================================================== */}

        <div
          className="
            min-w-0
            rounded-2xl
            border
            border-gray-800
            bg-gray-900/95
            p-4
            text-white
            shadow-xl
          "
        >

          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}

          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              {investigatorName}
            </p>

            <h2 className="mt-1 text-lg font-black text-white">
              Possessions
            </h2>
          </div>

          {/* ================================================== */}
          {/* ITEMS */}
          {/* ================================================== */}

          <InvestigatorItems
            assets={assets}
            onSelect={(asset) =>
              setSelectedCard({
                kind: "asset",
                card: asset,
              })
            }
          />

          {/* ================================================== */}
          {/* ARTIFACTS */}
          {/* ================================================== */}

          <div className="mt-4">
            <InvestigatorArtifacts
              artifacts={artifacts}
              getArtifactImage={getArtifactImage}
              onSelect={(artifact) =>
                setSelectedCard({
                  kind: "artifact",
                  card: artifact,
                })
              }
            />
          </div>

          {/* ================================================== */}
          {/* SPELLS */}
          {/* ================================================== */}

          <div className="mt-4">
            <InvestigatorSpells
              spells={spells}
              spellDefinitions={coreSpells}
              onSelect={(spell) =>
                setSelectedCard({
                  kind: "spell",
                  card: spell,
                })
              }
            />
          </div>

          {/* ================================================== */}
          {/* CONDITIONS */}
          {/* ================================================== */}

          <div className="mt-4">
            <InvestigatorConditions
              conditions={conditions}
              onSelect={(condition) =>
                setSelectedCard({
                  kind: "condition",
                  card: condition,
                })
              }
            />
          </div>

        </div>

      </div>

      {/* ====================================================== */}
      {/* LARGE CARD PREVIEW */}
      {/* ====================================================== */}

      {selectedCard && (
        <div
          className="
            fixed
            inset-0
            z-9999
            flex
            items-center
            justify-center
            bg-black/90
            p-6
            backdrop-blur-md
          "
          onClick={closeCardPreview}
        >

          <div
            className="
              relative
              flex
              max-h-[94vh]
              max-w-[94vw]
              items-center
              justify-center
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ================================================== */}
            {/* CLOSE */}
            {/* ================================================== */}

            <button
              type="button"
              onClick={closeCardPreview}
              className="
                absolute
                -right-4
                -top-4
                z-10
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-black/80
                text-2xl
                font-bold
                text-white
                transition
                hover:bg-red-600
              "
            >
              ×
            </button>

            {/* ================================================== */}
            {/* ASSET */}
            {/* ================================================== */}

            {selectedCard.kind === "asset" && (
              <img
                src={getAssetImage(
                  selectedCard.card,
                )}
                alt={selectedCard.card.name}
                className="
                  max-h-[90vh]
                  max-w-[90vw]
                  rounded-xl
                  object-contain
                  shadow-2xl
                "
              />
            )}

            {/* ================================================== */}
            {/* ARTIFACT */}
            {/* ================================================== */}

            {selectedCard.kind === "artifact" && (
              <img
                src={getArtifactImage(
                  selectedCard.card,
                )}
                alt={selectedCard.card.name}
                className="
                  max-h-[90vh]
                  max-w-[90vw]
                  rounded-xl
                  object-contain
                  shadow-2xl
                "
              />
            )}

            {/* ================================================== */}
            {/* SPELL */}
            {/* ================================================== */}

            {selectedCard.kind === "spell" && (
              <img
                src={
                  selectedCard.card.flipped
                    ? selectedCard.card.backImage
                    : selectedCard.card.frontImage
                }
                alt={
                  selectedCard.card.definitionId
                }
                className="
                  max-h-[90vh]
                  max-w-[90vw]
                  rounded-xl
                  object-contain
                  shadow-2xl
                "
              />
            )}

            {/* ================================================== */}
            {/* CONDITION */}
            {/* ================================================== */}

            {selectedCard.kind === "condition" && (
              <img
                src={
                  selectedCard.card.flipped
                    ? selectedCard.card.backImage
                    : selectedCard.card.frontImage
                }
                alt={
                  selectedCard.card.definitionId
                }
                className="
                  max-h-[90vh]
                  max-w-[90vw]
                  rounded-xl
                  object-contain
                  shadow-2xl
                "
              />
            )}

          </div>
        </div>
      )}
    </>
  );
}