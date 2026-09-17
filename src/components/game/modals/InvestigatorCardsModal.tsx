import { useState } from "react";

import type { Asset } from "../../../game/models/Asset";
import type { Artifact } from "../../../game/models/Artifact";
import type { Spell } from "../../../game/models/Spell";
import type { SpellDefinition } from "../../../game/models/SpellDefinition";
import type { Condition } from "../../../game/models/Condition";
import type { Investigator } from "../../../game/models/Investigator";
import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

import InvestigatorItems from "../investigator/InvestigatorItems";

interface InvestigatorCardsModalProps {
  investigator: Investigator;
  definition: InvestigatorDefinition;

  assets: Asset[];

  artifacts: Artifact[];

  spells: Spell[];
  spellDefinitions: SpellDefinition[];

  conditions: Condition[];

  onClose: () => void;
}

type SelectedCard =
  | {
      kind: "asset";
      asset: Asset;
    }
  | {
      kind: "artifact";
      artifact: Artifact;
    }
  | {
      kind: "spell";
      spell: Spell;
      definition: SpellDefinition;
    }
  | {
      kind: "condition";
      condition: Condition;
    }
  | null;

type SkillKey =
  | "lore"
  | "influence"
  | "observation"
  | "strength"
  | "will";

interface ValueOverlayProps {
  current: number;
  base: number;
  className: string;
  showMaximum?: boolean;
}

function getValueColor(
  current: number,
  base: number,
): string {
  if (current > base) {
    return "text-green-400";
  }

  if (current < base) {
    return "text-red-400";
  }

  return "text-white";
}

function ValueOverlay({
  current,
  base,
  className,
  showMaximum = false,
}: ValueOverlayProps) {
  const valueColor =
    getValueColor(current, base);

  return (
    <div
      className={`
        pointer-events-none
        absolute
        z-10
        flex
        items-center
        justify-center
        ${className}
      `}
    >
      <div
        className="
          flex
          min-w-11
          items-baseline
          justify-center
          rounded-md
          border
          border-black/70
          bg-black/70
          px-1.5
          py-0.5
          shadow-[0_2px_5px_rgba(0,0,0,0.7)]
        "
      >
        <span
          className={`
            text-[clamp(15px,2.2vw,27px)]
            font-black
            leading-none
            ${valueColor}
            drop-shadow-[0_1px_2px_rgba(0,0,0,1)]
          `}
        >
          {current}
        </span>

        {showMaximum && (
          <>
            <span className="mx-0.5 text-[clamp(11px,1.4vw,17px)] font-bold text-white/80">
              /
            </span>

            <span className="text-[clamp(11px,1.4vw,17px)] font-bold leading-none text-white/80">
              {base}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default function InvestigatorCardsModal({
  investigator,
  definition,
  assets,
  artifacts,
  spells,
  spellDefinitions,
  conditions,
  onClose,
}: InvestigatorCardsModalProps) {
  const [isFlipped, setIsFlipped] =
    useState(false);

  const [selectedCard, setSelectedCard] =
    useState<SelectedCard>(null);

  /*
   * ============================================================
   * INVESTIGATOR CARD IMAGES
   * ============================================================
   */

  const investigatorName =
    definition.name.replaceAll(" ", "_");

  const investigatorFrontImage =
    `/cards/investigators/${investigatorName}/${investigatorName}-front.png`;

  const investigatorBackImage =
    `/cards/investigators/${investigatorName}/${investigatorName}-back.png`;

  /*
   * ============================================================
   * CARD IMAGE PATHS
   * ============================================================
   */

  const getAssetImage = (asset: Asset) => {
    const filename = asset.name
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

  const getSpellImage = (
    spell: Spell,
  ) => {
    return spell.flipped
      ? spell.backImage
      : spell.frontImage;
  };

  /*
   * ============================================================
   * SPELL DEFINITION
   * ============================================================
   */

  const getSpellDefinition = (
    spell: Spell,
  ) => {
    return spellDefinitions.find(
      (spellDefinition) =>
        spellDefinition.id ===
        spell.definitionId,
    );
  };

  /*
   * ============================================================
   * CONDITION IMAGE
   * ============================================================
   */

  const getConditionImage = (
    condition: Condition,
  ) => {
    const conditionRecord =
      condition as Condition & {
        frontImage?: string;
        backImage?: string;
        definitionId?: string;
      };

    if (
      conditionRecord.frontImage ||
      conditionRecord.backImage
    ) {
      return condition.flipped
        ? conditionRecord.backImage ??
            conditionRecord.frontImage
        : conditionRecord.frontImage ??
            conditionRecord.backImage;
    }

    const filename =
      conditionRecord.definitionId ??
      condition.id;

    return `/cards/conditions/${filename}.png`;
  };

  /*
   * ============================================================
   * CARD NAMES
   * ============================================================
   */

  const getArtifactName = (
    artifact: Artifact,
  ) => {
    return artifact.name;
  };

  const getConditionName = (
    condition: Condition,
  ) => {
    const conditionRecord =
      condition as Condition & {
        name?: string;
        definitionId?: string;
      };

    return (
      conditionRecord.name ??
      conditionRecord.definitionId ??
      condition.id
    );
  };

  /*
   * ============================================================
   * OPEN CARD
   * ============================================================
   */

  const openAsset = (
    asset: Asset,
  ) => {
    setSelectedCard({
      kind: "asset",
      asset,
    });
  };

  const openArtifact = (
    artifact: Artifact,
  ) => {
    setSelectedCard({
      kind: "artifact",
      artifact,
    });
  };

  const openSpell = (
    spell: Spell,
    spellDefinition: SpellDefinition,
  ) => {
    setSelectedCard({
      kind: "spell",
      spell,
      definition: spellDefinition,
    });
  };

  const openCondition = (
    condition: Condition,
  ) => {
    setSelectedCard({
      kind: "condition",
      condition,
    });
  };

  /*
   * ============================================================
   * CLOSE CARD
   * ============================================================
   */

  const closeCardPreview = () => {
    setSelectedCard(null);
  };

  /*
   * ============================================================
   * HAS CARDS
   * ============================================================
   */

  const hasCards =
    assets.length > 0 ||
    artifacts.length > 0 ||
    spells.length > 0 ||
    conditions.length > 0;

  /*
   * ============================================================
   * SKILL VALUES
   * ============================================================
   */

  const skillValues: {
    key: SkillKey;
    value: number;
    base: number;
  }[] = [
    {
      key: "lore",
      value: investigator.skills.lore,
      base: definition.skills.lore,
    },
    {
      key: "influence",
      value: investigator.skills.influence,
      base: definition.skills.influence,
    },
    {
      key: "observation",
      value: investigator.skills.observation,
      base: definition.skills.observation,
    },
    {
      key: "strength",
      value: investigator.skills.strength,
      base: definition.skills.strength,
    },
    {
      key: "will",
      value: investigator.skills.will,
      base: definition.skills.will,
    },
  ];

  return (
    <>
      {/* ================================================== */}
      {/* INVESTIGATOR MODAL */}
      {/* ================================================== */}

      <div
        className="
          fixed
          inset-0
          z-120
          flex
          items-center
          justify-center
          bg-black/80
          p-4
          backdrop-blur-sm
        "
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div
          className="
            flex
            h-[calc(100vh-20px)]
            max-h-[calc(100vh-20px)]
            w-[calc(100vw-20px)]
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-gray-700
            bg-[#17191f]
            text-white
            shadow-2xl
          "
        >

          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}

          <div className="flex shrink-0 items-center justify-between border-b border-gray-800 px-8 py-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                Investigator
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                {definition.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-700 hover:text-white"
            >
              Close
            </button>
          </div>

          {/* ================================================== */}
          {/* CONTENT */}
          {/* ================================================== */}

          <div className="overflow-y-auto px-4 py-2">

            {/* ================================================== */}
            {/* INVESTIGATOR CARD */}
            {/* ================================================== */}

            <section className="flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setIsFlipped(
                    (current) => !current,
                  )
                }
                className="
                  group
                  relative
                  block
                  w-[min(90vw,900px)]
                  cursor-pointer
                  overflow-hidden
                  rounded-xl
                  shadow-2xl
                  outline-none
                "
                title={
                  isFlipped
                    ? "Show front"
                    : "Show back"
                }
              >

                {/* ================================================== */}
                {/* FRONT */}
                {/* ================================================== */}

                {!isFlipped ? (
                  <div className="relative">

                    <img
                      src={
                        investigatorFrontImage
                      }
                      alt={`${definition.name} front`}
                      className="block h-auto w-full select-none"
                      draggable={false}
                    />

                    {/* ================================================== */}
                    {/* HEALTH */}
                    {/* ================================================== */}

                    <ValueOverlay
                      current={
                        investigator.health
                      }
                      base={
                        investigator.maxHealth
                      }
                      showMaximum
                      className="
                        left-[72%]
                        top-[43%]
                        h-[9%]
                        w-[9%]
                        -translate-x-1/2
                        -translate-y-1/2
                      "
                    />

                    {/* ================================================== */}
                    {/* SANITY */}
                    {/* ================================================== */}

                    <ValueOverlay
                      current={
                        investigator.sanity
                      }
                      base={
                        investigator.maxSanity
                      }
                      showMaximum
                      className="
                        left-[87%]
                        top-[43%]
                        h-[9%]
                        w-[9%]
                        -translate-x-1/2
                        -translate-y-1/2
                      "
                    />

                    {/* ================================================== */}
                    {/* SKILLS */}
                    {/* ================================================== */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-[12%]
                        right-[8%]
                        top-[78%]
                        grid
                        grid-cols-5
                        text-center
                      "
                    >
                      {skillValues.map(
                        (skill) => (
                          <div
                            key={skill.key}
                            className="flex justify-center"
                          >
                            <ValueOverlay
                              current={
                                skill.value
                              }
                              base={
                                skill.base
                              }
                              className="
                                relative
                                left-auto
                                top-auto
                                h-auto
                                w-auto
                                translate-x-0
                                translate-y-0
                              "
                            />
                          </div>
                        ),
                      )}
                    </div>

                  </div>
                ) : (

                  /* ================================================== */
                  /* BACK */
                  /* ================================================== */

                  <img
                    src={
                      investigatorBackImage
                    }
                    alt={`${definition.name} back`}
                    className="block h-auto w-full select-none"
                    draggable={false}
                  />
                )}

                {/* ================================================== */}
                {/* FLIP HINT */}
                {/* ================================================== */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    bottom-4
                    left-1/2
                    -translate-x-1/2
                    rounded-lg
                    bg-black/75
                    px-4
                    py-2
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-white
                    opacity-0
                    transition
                    group-hover:opacity-100
                  "
                >
                  {isFlipped
                    ? "Click to show front"
                    : "Click to flip"}
                </div>

              </button>
            </section>

            {/* ================================================== */}
            {/* NO CARDS */}
            {/* ================================================== */}

            {!hasCards && (
              <section className="mt-8">
                <div className="rounded-xl border border-gray-800 bg-gray-900/60 px-6 py-10 text-center">
                  <p className="text-base text-gray-500">
                    This investigator has no cards.
                  </p>
                </div>
              </section>
            )}

            {/* ================================================== */}
            {/* ASSETS */}
            {/* ================================================== */}

            {assets.length > 0 && (
              <section className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    Assets
                  </h3>

                  <span className="text-sm text-gray-500">
                    {assets.length}
                  </span>
                </div>

                <InvestigatorItems
                  assets={assets}
                  onSelect={openAsset}
                />
              </section>
            )}

            {/* ================================================== */}
            {/* ARTIFACTS */}
            {/* ================================================== */}

            {artifacts.length > 0 && (
              <section className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    Artifacts
                  </h3>

                  <span className="text-sm text-gray-500">
                    {artifacts.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {artifacts.map(
                    (artifact) => (
                      <button
                        key={artifact.id}
                        type="button"
                        onClick={() =>
                          openArtifact(
                            artifact,
                          )
                        }
                        className="group overflow-hidden rounded-xl border border-gray-700 bg-gray-900 text-left shadow-lg transition hover:border-gray-500 hover:bg-gray-800"
                      >
                        <div className="overflow-hidden bg-black">
                          <img
                            src={getArtifactImage(
                              artifact,
                            )}
                            alt={getArtifactName(
                              artifact,
                            )}
                            className="block h-auto w-full object-contain transition group-hover:scale-[1.02]"
                            draggable={false}
                          />
                        </div>

                        <div className="px-4 py-3">
                          <p className="text-sm font-semibold text-white">
                            {getArtifactName(
                              artifact,
                            )}
                          </p>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </section>
            )}

            {/* ================================================== */}
            {/* SPELLS */}
            {/* ================================================== */}

            {spells.length > 0 && (
              <section className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    Spells
                  </h3>

                  <span className="text-sm text-gray-500">
                    {spells.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {spells.map((spell) => {
                    const spellDefinition =
                      getSpellDefinition(
                        spell,
                      );

                    if (!spellDefinition) {
                      return null;
                    }

                    return (
                      <button
                        key={spell.id}
                        type="button"
                        onClick={() =>
                          openSpell(
                            spell,
                            spellDefinition,
                          )
                        }
                        className="group overflow-hidden rounded-xl border border-gray-700 bg-gray-900 text-left shadow-lg transition hover:border-purple-500 hover:bg-gray-800"
                      >
                        <div className="overflow-hidden bg-black">
                          <img
                            src={getSpellImage(
                              spell,
                            )}
                            alt={
                              spellDefinition.name
                            }
                            className="block h-auto w-full object-contain transition group-hover:scale-[1.02]"
                            draggable={false}
                          />
                        </div>

                        <div className="px-4 py-3">
                          <p className="text-sm font-semibold text-white">
                            {
                              spellDefinition.name
                            }
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ================================================== */}
            {/* CONDITIONS */}
            {/* ================================================== */}

            {conditions.length > 0 && (
              <section className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    Conditions
                  </h3>

                  <span className="text-sm text-gray-500">
                    {conditions.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {conditions.map(
                    (condition) => (
                      <button
                        key={condition.id}
                        type="button"
                        onClick={() =>
                          openCondition(
                            condition,
                          )
                        }
                        className="group overflow-hidden rounded-xl border border-gray-700 bg-gray-900 text-left shadow-lg transition hover:border-red-500 hover:bg-gray-800"
                      >
                        <div className="overflow-hidden bg-black">
                          <img
                            src={getConditionImage(
                              condition,
                            )}
                            alt={getConditionName(
                              condition,
                            )}
                            className="block h-auto w-full object-contain transition group-hover:scale-[1.02]"
                            draggable={false}
                          />
                        </div>

                        <div className="px-4 py-3">
                          <p className="text-sm font-semibold text-white">
                            {getConditionName(
                              condition,
                            )}
                          </p>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </section>
            )}

          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* CARD PREVIEW */}
      {/* ================================================== */}

      {selectedCard && (
        <div
          className="
            fixed
            inset-0
            z-150
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
              flex-col
              items-center
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
                right-2
                top-2
                z-10
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-black/80
                text-xl
                font-bold
                text-white
                shadow-lg
                transition
                hover:bg-black
              "
              aria-label="Close card"
            >
              ×
            </button>

            {/* ================================================== */}
            {/* ASSET */}
            {/* ================================================== */}

            {selectedCard.kind ===
              "asset" && (
              <img
                src={getAssetImage(
                  selectedCard.asset,
                )}
                alt={
                  selectedCard.asset.name
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
            {/* ARTIFACT */}
            {/* ================================================== */}

            {selectedCard.kind ===
              "artifact" && (
              <img
                src={getArtifactImage(
                  selectedCard.artifact,
                )}
                alt={getArtifactName(
                  selectedCard.artifact,
                )}
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

            {selectedCard.kind ===
              "spell" && (
              <img
                src={getSpellImage(
                  selectedCard.spell,
                )}
                alt={
                  selectedCard.definition.name
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

            {selectedCard.kind ===
              "condition" && (
              <img
                src={getConditionImage(
                  selectedCard.condition,
                )}
                alt={getConditionName(
                  selectedCard.condition,
                )}
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