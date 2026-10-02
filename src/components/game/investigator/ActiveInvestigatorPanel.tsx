import { getActionSpellOptions, getCombatSpellOptions, getEncounterSpellOptions } from "../../../game/engine/encounterSpellWindow";
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
import { getEffectiveSkill } from "../../../game/engine/getEffectiveSkill";
import { canPerformAction } from "../../../game/engine/canPerformAction";
import { isRestrictedByDetained } from "../../../game/engine/conditionRestrictions";
import type { GameState } from "../../../game/models/GameState";
import type { InvestigatorAbility } from "../../../game/models/InvestigatorDefinition";
import {
  coreConditionDefinitions,
} from "../../../content/core/coreConditions";

interface ActiveInvestigatorPanelProps {
  investigator: Investigator;
  game: GameState;

  investigatorName: string;
  investigatorPortrait: string;

  investigatorAbilities: InvestigatorAbility[];
  canUseInvestigatorAction: boolean;

  assets: Asset[];
  artifacts: Artifact[];
  spells: Spell[];
  conditions: Condition[];

  onOpenCards: () => void;
  onUseInvestigatorAction: () => void;
  onInspectSpace: (spaceId: string) => void;
  onActivateSpell: (spellId: string, frontEffectIndex: number) => void;
  onActivatePossession: (kind: "asset" | "artifact", cardId: string, ability: string) => void;
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
  game,

  investigatorName,
  investigatorPortrait,
  investigatorAbilities,
  canUseInvestigatorAction,

  assets,
  artifacts,
  spells,
  conditions,

  onOpenCards,
  onUseInvestigatorAction,
  onInspectSpace,
  onActivateSpell,
  onActivatePossession,
}: ActiveInvestigatorPanelProps) {
  const [selectedCard, setSelectedCard] =
    useState<SelectedCard | null>(null);

  const [showInvestigatorMenu, setShowInvestigatorMenu] =
    useState(false);

  const actionAbility =
    investigatorAbilities.find(
      (ability) => ability.type === "action",
    );

  const passiveAbilities =
    investigatorAbilities.filter(
      (ability) => ability.type === "passive",
    );

  /*
   * ============================================================
   * ASSET IMAGE
   * ============================================================
   */

  function getAssetImage(asset: Asset): string {
    if (asset.image) return asset.image;
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
    if (artifact.image) return artifact.image;
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

  function canUsePossessionAbility(cardId: string, ability: string): boolean {
    const space = investigator.spaceId ? game.board.spaces[investigator.spaceId] : undefined;
    if (ability === "combat") {
      const notUsedThisRound = cardId !== "asset-carbine-rifle" || game.cardRerollUsedRound?.[`${cardId}:carbine`] !== game.round;
      return game.phase === "encounter" && (space?.monsterIds.length ?? 0) > 0 && notUsedThisRound;
    }
    if (ability === "encounter") return game.phase === "encounter";
    if (ability === "free-action") {
      return game.phase === "action" && investigator.sanity > 0 && game.cardRerollUsedRound?.[`${cardId}:ruby`] !== game.round;
    }
    if (ability === "action" || ability === "action-heal") {
      return game.phase === "action" && !isRestrictedByDetained(game, investigator.id) && canPerformAction(investigator, "component");
    }
    return false;
  }

  function canUseSpellEffect(spellId: string, effectIndex: number, effect: (typeof coreSpells)[number]["frontEffects"][number]): boolean {
    if (effect.type === "on-health-loss" || effect.type === "on-sanity-loss") return false;
    if (effect.type === "action-test") return getActionSpellOptions(game).some((option) => option.spellId === spellId && option.effectIndex === effectIndex);
    if (effect.type === "on-encounter-phase") return getEncounterSpellOptions(game).some((option) => option.spellId === spellId && option.effectIndex === effectIndex);
    if (effect.type === "on-combat-encounter") return getCombatSpellOptions(game).some((option) => option.spellId === spellId && option.effectIndex === effectIndex);
    return true;
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
            border border-slate-700/80
            bg-linear-to-b from-slate-900 to-gray-900
            p-4 sm:p-5
            text-white
            shadow-xl
          "
        >

          <div className="grid grid-cols-1 items-center gap-4 min-[480px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* PORTRAIT + NAME */}
            <div className="min-w-0">
              <div
                className="
                  group
                  relative
                  flex
                  min-h-48
                  justify-center
                  rounded-2xl
                  border
                  border-slate-700/70
                  bg-slate-950/50
                  p-2
                  shadow-inner
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowInvestigatorMenu(
                      (current) => !current,
                    )
                  }
                  className="relative flex w-full cursor-pointer justify-center"
                >
                  <img
                    src={investigatorPortrait}
                    alt={investigatorName}
                    className="
                      max-h-72
                      w-auto
                      max-w-full
                      rounded-lg
                      object-contain
                      transition
                      duration-200
                      group-hover:brightness-50
                    "
                  />

                  {/* HOVER - ABILITIES TOOLTIP */}

                  {!showInvestigatorMenu && (
                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-full
                        top-1/2
                        z-50
                        ml-4
                        w-80
                        -translate-y-1/2
                        rounded-2xl
                        border
                        border-slate-700
                        bg-[#15171c]
                        p-5
                        opacity-0
                        shadow-2xl
                        transition-all
                        duration-150
                        group-hover:opacity-100
                      "
                    >
                      {/* TOOLTIP ARROW */}

                      <div
                        className="
                          absolute
                          -left-2
                          top-1/2
                          h-4
                          w-4
                          -translate-y-1/2
                          rotate-45
                          border-b
                          border-l
                          border-slate-700
                          bg-[#15171c]
                        "
                      />

                      {actionAbility && (
                        <div className="relative">
                          <div className="text-xs font-black uppercase tracking-wider text-amber-300">
                            Action
                          </div>

                          <div className="mt-2 text-sm font-medium leading-relaxed text-slate-200">
                            {actionAbility.description}
                          </div>
                        </div>
                      )}

                      {passiveAbilities.map(
                        (ability) => (
                          <div
                            key={ability.id}
                            className={
                              actionAbility
                                ? "relative mt-5 border-t border-slate-700/70 pt-4"
                                : "relative"
                            }
                          >
                            <div className="text-xs font-black uppercase tracking-wider text-sky-300">
                              Passive
                            </div>

                            <div className="mt-2 text-sm font-medium leading-relaxed text-slate-200">
                              {ability.description}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </button>

                {/* CLICK - SEE / ACTION */}

                {showInvestigatorMenu && (
                  <div
                    className="
                      absolute
                      inset-0
                      z-20
                      flex
                      flex-col
                      items-center
                      justify-center
                      gap-4
                      bg-black/85
                      p-5
                    "
                  >
                    <div className="text-center">
                      <div className="text-sm font-black text-white">
                        {investigatorName}
                      </div>

                      <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Investigator
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowInvestigatorMenu(false);
                          onOpenCards();
                        }}
                        className="
                          rounded-lg
                          bg-slate-700
                          px-5
                          py-2
                          text-xs
                          font-black
                          text-white
                          transition
                          hover:bg-slate-600
                        "
                      >
                        SEE
                      </button>

                      {actionAbility && (
                        <button
                          type="button"
                          disabled={!canUseInvestigatorAction}
                          onClick={() => {
                            if (!canUseInvestigatorAction) {
                              return;
                            }

                            setShowInvestigatorMenu(false);
                            onUseInvestigatorAction();
                          }}
                          className="
                            rounded-lg
                            bg-amber-700
                            px-5
                            py-2
                            text-xs
                            font-black
                            text-white
                            transition
                            hover:bg-amber-600
                            disabled:cursor-not-allowed
                            disabled:bg-slate-800
                            disabled:text-slate-500
                          "
                        >
                          ACTION
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowInvestigatorMenu(false)
                      }
                      className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-3 text-center">
                <h2 className="text-lg font-black text-white">
                  {investigatorName}
                </h2>
              </div>
            </div>

            {/* LOCATION, HEALTH, SANITY */}
            <div className="flex w-full flex-col justify-center gap-3">
              <InvestigatorLocation
                investigator={investigator}
                onInspectSpace={onInspectSpace}
              />
              <InvestigatorHealthSanity investigator={investigator} />
            </div>
          </div>

          {/* ================================================== */}
          {/* SKILLS */}
          {/* ================================================== */}

          <div className="mt-3">
            <InvestigatorSkills
              investigator={investigator}
              effectiveSkills={{
                lore: getEffectiveSkill(game, investigator.id, "lore"),
                influence: getEffectiveSkill(game, investigator.id, "influence"),
                observation: getEffectiveSkill(game, investigator.id, "observation"),
                strength: getEffectiveSkill(game, investigator.id, "strength"),
                will: getEffectiveSkill(game, investigator.id, "will"),
              }}
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

          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              {investigatorName}
            </p>

            <h2 className="mt-1 text-lg font-black text-white">
              Possessions
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Click a card to inspect it.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2">
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

          <div className="min-w-0">
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

          <div className="min-w-0">
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

          <div className="min-w-0">

            <InvestigatorConditions
              conditions={conditions}
              conditionDefinitions={
                coreConditionDefinitions
              }
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
              <div className="flex max-h-[94vh] max-w-[94vw] flex-col items-center gap-3">
                <img src={getAssetImage(selectedCard.card)} alt={selectedCard.card.name} className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl" />
                {({
                  "asset-dynamite": [["action", "Use Dynamite (Action)"]],
                  "asset-cat-burglar": [["action", "Use Cat Burglar (Action)"]],
                  "asset-carbine-rifle": [["combat", "Activate during Combat"]],
                  "asset-kerosene": [["combat", "Discard for +5 Strength"]],
                  "asset-holy-water": [["combat", "Discard for +5 Strength and +5 Will"], ["action-heal", "Use Holy Water action"]],
                } as Record<string, [string, string][]>)[selectedCard.card.id]?.filter(([ability]) => canUsePossessionAbility(selectedCard.card.id, ability)).map(([ability, label]) => (
                  <button key={ability} type="button" onClick={(event) => { event.stopPropagation(); onActivatePossession("asset", selectedCard.card.id, ability); closeCardPreview(); }} className="rounded-lg bg-amber-700 px-4 py-2 font-bold text-white hover:bg-amber-600">
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* ================================================== */}
            {/* ARTIFACT */}
            {/* ================================================== */}

            {selectedCard.kind === "artifact" && (
              <div className="flex max-h-[94vh] max-w-[94vw] flex-col items-center gap-3">
                <img src={getArtifactImage(selectedCard.card)} alt={selectedCard.card.name} className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl" />
                {({
                  "flute-of-the-outer-gods": [["action", "Use Flute of the Outer Gods (Action)"]],
                  "lightning-gun": [["action", "Use Lightning Gun (Action)"]],
                  "ruby-of-rlyeh": [["free-action", "Spend 1 Sanity for an additional action"]],
                  "pallid-mask": [["encounter", "Ignore Monsters during your next Encounter"]],
                  "cultes-des-goules": [["action", "Use Cultes des Goules (Action)"]],
                  "de-vermis-mysteriis": [["action", "Use De Vermis Mysteriis (Action)"]],
                  "necronomicon": [["action", "Use Necronomicon (Action)"]],
                  "tka-halot": [["action", "Use T'tka Halot (Action)"]],
                  "mi-go-brain-case": [["action", "Use Mi-Go Brain Case (Action)"]],
                } as Record<string, [string, string][]>)[selectedCard.card.id]?.filter(([ability]) => canUsePossessionAbility(selectedCard.card.id, ability)).map(([ability, label]) => (
                  <button key={ability} type="button" onClick={(event) => { event.stopPropagation(); onActivatePossession("artifact", selectedCard.card.id, ability); closeCardPreview(); }} className="rounded-lg bg-amber-700 px-4 py-2 font-bold text-white hover:bg-amber-600">
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* ================================================== */}
            {/* SPELL */}
            {/* ================================================== */}

            {selectedCard.kind === "spell" && (
              <div className="flex max-h-[94vh] max-w-[94vw] flex-col items-center gap-3">
                <img
                  src={
                    selectedCard.card.flipped
                      ? selectedCard.card.backImage
                      : selectedCard.card.frontImage
                  }
                  alt={selectedCard.card.definitionId}
                  className="
                  max-h-[90vh]
                  max-w-[90vw]
                  rounded-xl
                  object-contain
                  shadow-2xl
                "
                />
                {!selectedCard.card.flipped && (() => {
                  const definition = coreSpells.find((item) => item.id === selectedCard.card.definitionId);
                  return definition?.frontEffects.flatMap((effect, index) => {
                    if (!canUseSpellEffect(selectedCard.card.id, index, effect)) return [];
                    return (
                    <button
                      key={`${selectedCard.card.id}:${index}`}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onActivateSpell(selectedCard.card.id, index);
                        closeCardPreview();
                      }}
                      className="rounded-lg bg-purple-700 px-4 py-2 font-bold text-white hover:bg-purple-600"
                    >
                      {effect.type === "action-test" ? "Use Spell action" :
                        effect.type === "on-combat-encounter" ? "Use before Combat" :
                          effect.type === "on-encounter-phase" ? "Use before the Encounter" : "Activate Spell"}
                    </button>
                    );
                  });
                })()}
              </div>
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
