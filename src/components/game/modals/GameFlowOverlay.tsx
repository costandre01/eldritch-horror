import { useEffect, useState } from "react";
import type { PendingDecision } from "../../../game/models/PendingDecision";

import { coreInvestigators } from "../../../content/core/investigators";
import type { GameState } from "../../../game/models/GameState";
import { CORE_MONSTERS } from "../../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../../content/core/coreEpicMonsters";
import { resolveMonsterToughness } from "../../../game/engine/resolveMonsterToughness";
import { resolveMonsterTest } from "../../../game/engine/resolveMonsterTest";
import MonsterReckoningModal from "./MonsterReckoningModal";
import CombatOrderModal from "./CombatOrderModal";
import AncientOneReckoningModal from "./AncientOneReckoningModal";
import YogSothothReckoningModal from "./YogSothothReckoningModal";

interface GameFlowOverlayProps {
  game: GameState;

  decision: PendingDecision;

  onContinue: () => void;

  onChoice: (choiceId: string) => void;

  onSelectSpace: (spaceId: string) => void;

  onSelectInvestigator: (
    investigatorId: string,
  ) => void;

  onSelectCard: (cardId: string) => void;

  onRollTest: () => void;

  onSingleDieRoll: () => void;

  onCombat: () => void;

  onMonsterAbility: () => void;
  onMonsterAbilitySkip: () => void;

  onResolveMonsterReckoning: (
    monsterId: string,
  ) => void;

  onResolveAncientOneReckoning: () => void;

  onSelectCombatOrderMonster: (
    monsterId: string,
  ) => void;

  onConfirmCombatOrder: () => void;

  onDiscardYogSothothSpell: (
    spellId: string,
  ) => void;

  onAdvanceYogSothothDoom: () => void;
}

function quadraticBezier(
  start: { left: number; top: number },
  control: { left: number; top: number },
  end: { left: number; top: number },
  t: number,
) {
  const inverse = 1 - t;

  return {
    left:
      inverse * inverse * start.left +
      2 * inverse * t * control.left +
      t * t * end.left,

    top:
      inverse * inverse * start.top +
      2 * inverse * t * control.top +
      t * t * end.top,
  };
}

const OMEN_POPUP_POSITIONS = [
  { left: 69, top: 21 }, // verde — topo
  { left: 86, top: 36 }, // azul — direita
  { left: 77, top: 65 }, // vermelho — baixo
  { left: 59, top: 48 }, // azul — esquerda
];

const OMEN_CURVE_CONTROLS = [
  { left: 82, top: 18 }, // verde → azul direita
  { left: 91, top: 51 }, // azul direita → vermelho
  { left: 68, top: 76 }, // vermelho → azul esquerda
  { left: 49, top: 34 }, // azul esquerda → verde
];

/*
 * ============================================================
 * COMBAT VALUE COLOR
 * ============================================================
 */

function getCombatValueColor(
  current: number,
  base: number,
) {
  if (current > base) {
    return "text-green-400";
  }

  if (current < base) {
    return "text-red-400";
  }

  return "text-white";
}

/*
 * ============================================================
 * MONSTER SKILL ICON
 * ============================================================
 */

function getMonsterSkillIcon(
  skill: "will" | "strength" | "influence",
) {
  switch (skill) {
    case "will":
      return "/icons/game/will.png";

    case "strength":
      return "/icons/game/strength.png";

    case "influence":
      return "/icons/game/influence.png";
  }
}


/*
 * ============================================================
 * COMBAT VALUE OVERLAY
 * ============================================================
 */

interface CombatValueOverlayProps {
  current: number;
  base: number;
  showMaximum?: boolean;
  className: string;
}

function CombatValueOverlay({
  current,
  base,
  showMaximum = false,
  className,
}: CombatValueOverlayProps) {
  const valueColor =
    getCombatValueColor(
      current,
      base,
    );

  return (
    <div
      className={`
        pointer-events-none
        absolute
        z-20
        flex
        items-center
        justify-center
        ${className}
      `}
    >
      <div
        className="
          flex
          min-w-10.5
          items-baseline
          justify-center
          rounded-md
          border
          border-black/80
          bg-black/75
          px-1.5
          py-0.5
          shadow-[0_2px_6px_rgba(0,0,0,0.8)]
        "
      >
        <span
          className={`
            text-[clamp(14px,2vw,24px)]
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
            <span className="mx-0.5 text-[clamp(10px,1.2vw,15px)] font-bold text-white/70">
              /
            </span>

            <span className="text-[clamp(10px,1.2vw,15px)] font-bold leading-none text-white/80">
              {base}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default function GameFlowOverlay({
  game,
  decision,
  onContinue,
  onChoice,
  onSelectSpace,
  onSelectInvestigator,
  onSelectCard,
  onRollTest,
  onSingleDieRoll,
  onCombat,
  onMonsterAbility,
  onMonsterAbilitySkip,
  onResolveMonsterReckoning,
  onResolveAncientOneReckoning,
  onSelectCombatOrderMonster,
  onConfirmCombatOrder,
  onDiscardYogSothothSpell,
  onAdvanceYogSothothDoom,
}: GameFlowOverlayProps) {

  const isMythosOmen =
    decision.type === "mythos-omen";

  const omenCurrentPosition =
    isMythosOmen
      ? ((decision.currentPosition % 4) + 4) % 4
      : 0;

  const omenTargetPosition =
    isMythosOmen
      ? ((decision.targetPosition % 4) + 4) % 4
      : 0;

  const [animatedOmenPosition, setAnimatedOmenPosition] =
    useState(omenCurrentPosition);

  const [omenProgress, setOmenProgress] =
    useState(0);

  useEffect(() => {
    if (!isMythosOmen) {
      return;
    }

    setAnimatedOmenPosition(
      omenCurrentPosition,
    );

    setOmenProgress(0);

    const steps =
      (omenTargetPosition -
        omenCurrentPosition +
        4) %
      4;

    if (steps === 0) {
      return;
    }

    const durationPerStep = 1800;
    const totalDuration =
      steps * durationPerStep;

    const startTime = performance.now();

    let animationFrame = 0;

    const animate = (now: number) => {
      const elapsed =
        now - startTime;

      const totalProgress = Math.min(
        elapsed / totalDuration,
        1,
      );

      const currentStepFloat =
        totalProgress * steps;

      const currentStep =
        Math.min(
          Math.floor(currentStepFloat),
          steps - 1,
        );

      const stepProgress =
        currentStepFloat - currentStep;

      setAnimatedOmenPosition(
        (omenCurrentPosition +
          currentStep) %
          4,
      );

      setOmenProgress(
        stepProgress,
      );

      if (totalProgress < 1) {
        animationFrame =
          requestAnimationFrame(
            animate,
          );
      } else {
        setAnimatedOmenPosition(
          omenTargetPosition,
        );

        setOmenProgress(0);
      }
    };

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(
        animationFrame,
      );
    };
  }, [
    isMythosOmen,
    omenCurrentPosition,
    omenTargetPosition,
  ]);
  /*
  * ============================================================
  * ENCOUNTER
  * ============================================================
  */

  const decisionSource =
    "source" in decision
      ? decision.source
      : undefined;

  const isEncounter =
    decisionSource?.startsWith(
      "encounter:",
    ) ?? false;

  /*
  * ============================================================
  * CURRENT ENCOUNTER
  * ============================================================
  */

  const currentEncounter =
    game.currentEncounterId
      ? game.encounters[
          game.currentEncounterId
        ]
      : undefined;

  /*
  * ============================================================
  * DECISION IMAGE
  * ============================================================
  */

  const decisionImage =
    isEncounter &&
    currentEncounter
      ? currentEncounter.backImage
      : "image" in decision
        ? decision.image
        : undefined;

  /*
  * ============================================================
  * ENCOUNTER ZONE
  * ============================================================
  */

  const encounterZone =
    isEncounter && decisionSource
      ? decisionSource.includes(
          "-wilderness",
        )
        ? "WILDERNESS"
        : decisionSource.includes(
              "-sea",
            )
          ? "SEA"
          : "CITY"
      : null;

  /*
  * ============================================================
  * ACTIVE INVESTIGATOR
  * ============================================================
  *
  * Used by Encounter choices to determine whether the
  * investigator can afford a requirement such as:
  *
  * - Spend 1 Clue
  * - Spend 2 Resources
  */

  const activeInvestigator =
    game.activeInvestigatorId
      ? game.investigators[
          game.activeInvestigatorId
        ]
      : undefined;

  /*
  * ============================================================
  * CHECK CHOICE REQUIREMENT
  * ============================================================
  */

  function canChooseOption(
    option: NonNullable<
      Extract<
        PendingDecision,
        { type: "choice" }
      >["options"]
    >[number],
  ): boolean {
    if (!option.requirement) {
      return true;
    }

    const {
      type,
      amount,
    } = option.requirement;

    if (!activeInvestigator) {
      return false;
    }

    switch (type) {
      case "clues":
        return (
          activeInvestigator.clues >=
          amount
        );

      case "resources":
        return (
          activeInvestigator.resources >=
          amount
        );

      case "items":
        return (
          activeInvestigator.assetIds.length >=
          amount
        );

      case "health":
        return (
          activeInvestigator.health >=
          amount
        );

      default:
        return false;
    }
  }

  /*
  * ============================================================
  * INVESTIGATOR TURN
  * ============================================================
  */

  if (
    decision.type ===
    "investigator-turn"
  ) {
    const investigator =
      game.investigators[
        decision.investigatorId
      ];

    const investigatorDefinition =
      investigator
        ? coreInvestigators.find(
            (item) =>
              item.id ===
              investigator.definitionId,
          )
        : undefined;

    const investigatorFileName =
      investigatorDefinition?.name.replace(
        /\s+/g,
        "_",
      );

    const investigatorPortrait =
      investigatorFileName
        ? `/cards/investigators/${investigatorFileName}/${investigatorFileName}.png`
        : "";

    return (
      <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
        <div className="w-[min(92vw,650px)] rounded-3xl border border-gray-700 bg-[#172033] p-8 text-center text-white shadow-2xl sm:p-10">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
            {decision.phase === "action"
              ? "Action Phase"
              : "Encounter Phase"}
          </p>

          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            {decision.title}
          </h2>

          <div className="mx-auto mt-8 rounded-2xl border border-gray-700 bg-gray-900 px-6 py-8">

            <p className="text-sm uppercase tracking-widest text-gray-500">
              It is the turn of
            </p>

            {investigatorPortrait && (
              <div className="mt-5 flex justify-center">
                <div className="overflow-hidden rounded-2xl border border-gray-600 bg-black shadow-xl">
                  <img
                    src={investigatorPortrait}
                    alt={
                      decision.investigatorName
                    }
                    className="block h-48 w-auto object-contain"
                    onError={(event) => {
                      console.error(
                        "Failed to load investigator portrait:",
                        investigatorPortrait,
                      );

                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                </div>
              </div>
            )}

            <p className="mt-5 text-3xl font-black text-white sm:text-4xl">
              {decision.investigatorName}
            </p>

            <p className="mt-4 text-sm text-gray-400">
              {decision.message}
            </p>

          </div>

          <button
            type="button"
            onClick={onContinue}
            className="mt-8 rounded-xl bg-blue-600 px-10 py-4 text-lg font-bold transition hover:bg-blue-500"
          >
            CONTINUE
          </button>

        </div>
      </div>
    );
  }

  /*
  * ============================================================
  * REVEAL ENCOUNTER
  * ============================================================
  */

  if (
    decision.type ===
    "reveal-encounter"
  ) {
    return (
      <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">

        <div className="flex max-h-[calc(100vh-24px)] w-[min(96vw,1200px)] flex-col overflow-hidden rounded-3xl border border-gray-700 bg-[#172033] p-6 text-white shadow-2xl sm:p-8">

          <div className="shrink-0 text-center">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
              Encounter
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {decision.title}
            </h2>

            {encounterZone && (
              <div className="mt-3 inline-flex rounded-full bg-gray-800 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                {encounterZone}
              </div>
            )}

          </div>

          {decisionImage && (
            <div className="mt-6 flex min-h-0 flex-1 justify-center">

              <button
                type="button"
                onClick={onContinue}
                className="block min-h-0 cursor-pointer overflow-hidden rounded-2xl border border-gray-600 bg-black shadow-2xl transition hover:scale-[1.01] hover:border-blue-400 hover:shadow-blue-500/20"
              >
                <img
                  src={decisionImage}
                  alt={decision.title}
                  className="block max-h-[58vh] w-auto max-w-full object-contain"
                  onError={(event) => {
                    console.error(
                      "Failed to load Encounter front image:",
                      decisionImage,
                    );

                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              </button>

            </div>
          )}

          <p className="mt-6 shrink-0 text-center text-sm font-semibold uppercase tracking-widest text-gray-500">
            Click to reveal
          </p>

        </div>

      </div>
    );
  }

  /*
  * ============================================================
  * MYTHOS - ADVANCE OMEN
  * ============================================================
  */

  if (decision.type === "mythos-omen") {
    const currentPosition =
      OMEN_POPUP_POSITIONS[
        animatedOmenPosition
      ];

    const nextPosition =
      OMEN_POPUP_POSITIONS[
        (animatedOmenPosition + 1) % 4
      ];

    const controlPoint =
      OMEN_CURVE_CONTROLS[
        animatedOmenPosition
      ];

    if (
      !currentPosition ||
      !nextPosition ||
      !controlPoint
    ) {
      return null;
    }

    const curvedPosition =
      quadraticBezier(
        currentPosition,
        controlPoint,
        nextPosition,
        omenProgress,
      );

    const displayLeft =
      curvedPosition.left;

    const displayTop =
      curvedPosition.top;

    return (
      <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/75 p-2 backdrop-blur-sm">

        <div
          className="
            flex
            h-[calc(100vh-16px)]
            max-h-[calc(100vh-16px)]
            w-[min(96vw,1200px)]
            shrink-0
            flex-col
            items-center
            overflow-hidden
            rounded-3xl
            border
            border-gray-700
            bg-[#172033]
            px-6
            py-5
            text-white
            shadow-2xl
            sm:px-8
            sm:py-6
          "
        >

          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}

          <div className="shrink-0 text-center">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
              MYTHOS PHASE
            </p>

            <h2 className="mt-3 text-3xl font-black">
              {decision.title}
            </h2>

            {decision.message && (
              <p className="mt-3 text-gray-400">
                {decision.message}
              </p>
            )}

          </div>

          {/* ================================================== */}
          {/* OMEN MAP */}
          {/* ================================================== */}

          <div className="mt-5 flex min-h-0 flex-1 items-center justify-center">

            <div
              className="
                relative
                h-[55vh]
                max-h-107.5
                aspect-5/3
                overflow-hidden
                rounded-2xl
                border-2
                border-gray-600
                bg-black
                shadow-2xl
              "
            >

              {/* ================================================== */}
              {/* MAP CROP — TOP RIGHT CORNER */}
              {/* ================================================== */}

              <img
                src="/maps/eldritch-board.png"
                alt="Omen track"
                className="
                  absolute
                  left-[-400%]
                  top-[-3%]
                  h-auto
                  w-[500%]
                  max-w-none
                "
                draggable={false}
              />

              {/* ================================================== */}
              {/* CURRENT OMEN */}
              {/* ================================================== */}

              <div
                className="
                  absolute
                  z-20
                  aspect-square
                  w-[14%]
                  -translate-x-1/2
                  -translate-y-1/2
                "
                style={{
                  left: `${displayLeft}%`,
                  top: `${displayTop}%`,
                }}
              >
                <img
                  src="/icons/game/omen-token.png"
                  alt="Current Omen"
                  className="
                    h-full
                    w-full
                    object-contain
                  "
                  draggable={false}
                />
              </div>

            </div>

          </div>

          {/* ================================================== */}
          {/* DESCRIPTION */}
          {/* ================================================== */}

          <p className="mt-4 shrink-0 text-center text-sm font-bold uppercase tracking-widest text-gray-500">
            The Omen advances clockwise
          </p>

          {/* ================================================== */}
          {/* CONTINUE */}
          {/* ================================================== */}

          <button
            type="button"
            onClick={onContinue}
            className="
              mt-4
              shrink-0
              rounded-xl
              bg-blue-600
              px-10
              py-3
              text-lg
              font-black
              text-white
              shadow-lg
              transition
              hover:bg-blue-500
              active:scale-[0.98]
            "
          >
            CONTINUE
          </button>

        </div>

      </div>
    );
  }

  /*
   * ============================================================
   * MYTHOS DECK SELECTION
   * ============================================================
   */

  if (
    decisionSource ===
    "mythos-selection"
  ) {
    return (
      <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">

        <div className="flex max-h-[calc(100vh-24px)] w-[min(94vw,1000px)] flex-col items-center overflow-hidden rounded-3xl border border-gray-700 bg-[#172033] p-6 text-white shadow-2xl sm:p-8">

          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}

          <div className="shrink-0 text-center">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
              MYTHOS PHASE
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {decision.title}
            </h2>

            {decision.message && (
              <p className="mt-3 text-gray-400">
                {decision.message}
              </p>
            )}

          </div>

          {/* ================================================== */}
          {/* MYTHOS DECK */}
          {/* ================================================== */}

          {"image" in decision && decision.image && (
            <div className="mt-8 flex justify-center">

              <button
                type="button"
                onClick={() =>
                  onChoice(
                    "draw-mythos",
                  )
                }
                className="group cursor-pointer overflow-hidden rounded-2xl border-4 border-gray-600 bg-black shadow-2xl transition duration-200 hover:-translate-y-2 hover:border-amber-400 hover:shadow-amber-500/30"
              >

                <img
                  src="/cards/Mystery/Mythos-back.jpg"
                  alt="Mythos Deck"
                  className="block h-auto max-h-[65vh] w-auto max-w-[80vw] object-contain"
                />

              </button>

            </div>
          )}

          {/* ================================================== */}
          {/* INSTRUCTION */}
          {/* ================================================== */}

          <p className="mt-6 shrink-0 text-center text-sm font-bold uppercase tracking-widest text-gray-500">
            Click the deck to draw a Mythos card
          </p>

        </div>

      </div>
    );
  }

  {/* ================================================== */}
  {/* MYTHOS RECKONING MONSTERS */}
  {/* ================================================== */}

  if (decision.type === "mythos-reckoning-monsters") {
    return (
      <MonsterReckoningModal
        game={game}
        monsterIds={decision.monsterIds}
        resolvedMonsterIds={
          decision.resolvedMonsterIds
        }
        onResolveMonster={
          onResolveMonsterReckoning
        }
      />
    );
  }

  if (decision.type === "mythos-ancient-one-reckoning") {
    return (
      <AncientOneReckoningModal
        game={game}
        ancientOneId={decision.ancientOneId}
        onResolve={onResolveAncientOneReckoning}
      />
    );
  }

  if (decision.type === "combat-order") {
    return (
      <CombatOrderModal
        game={game}
        monsterIds={decision.monsterIds}
        orderedMonsterIds={
          decision.orderedMonsterIds
        }
        onSelectMonster={
          onSelectCombatOrderMonster
        }
        onConfirm={
          onConfirmCombatOrder
        }
      />
    );
  }

  if (
    decision.type ===
    "mythos-yog-sothoth-spell"
  ) {
    return (
      <YogSothothReckoningModal
        game={game}
        investigatorId={
          decision.investigatorId
        }
        spellIds={
          decision.spellIds
        }
        onDiscardSpell={
          onDiscardYogSothothSpell
        }
        onAdvanceDoom={
          onAdvanceYogSothothDoom
        }
      />
    );
  }

  /*
  * ============================================================
  * NORMAL DECISION
  * ============================================================
  */

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">

      <div className="flex max-h-[calc(100vh-24px)] w-[min(96vw,1200px)] flex-col overflow-hidden rounded-3xl border border-gray-700 bg-[#172033] p-6 text-white shadow-2xl sm:p-8">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="shrink-0 text-center">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
            {isEncounter
              ? "ENCOUNTER"
              : "ELDRITCH HORROR"}
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {decision.title}
          </h2>

          {encounterZone && (
            <div className="mt-3 inline-flex rounded-full bg-gray-800 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-400">
              {encounterZone}
            </div>
          )}

        </div>

        {/* ================================================== */}
        {/* ENCOUNTER RESULT */}
        {/* ================================================== */}

        {decision.type ===
          "continue" &&
          decision.effectResult && (
            <div className="mt-5 flex shrink-0 justify-center">
              <div
                className={`
                  rounded-full
                  border
                  px-5
                  py-2
                  text-sm
                  font-black
                  uppercase
                  tracking-[0.2em]
                  ${
                    decision.effectResult ===
                    "pass"
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : "border-red-500/50 bg-red-500/10 text-red-400"
                  }
                `}
              >
                {decision.effectResult ===
                "pass"
                  ? "✓ PASS EFFECT"
                  : "✕ FAIL EFFECT"}
              </div>
            </div>
          )}

        {/* ================================================== */}
        {/* ENCOUNTER CARD IMAGE */}
        {/* ================================================== */}

        {decisionImage && (
          <div
            className="
              mt-6
              flex
              shrink-0
              justify-center
              overflow-visible
            "
          >

            <div
              className="
                flex
                max-w-full
                justify-center
                rounded-2xl
                border
                border-gray-600
                bg-black
                shadow-2xl
              "
            >

              <img
                src={decisionImage}
                alt={decision.title}
                className="
                  block
                  h-auto
                  max-h-[52vh]
                  max-w-[85vw]
                  w-auto
                  object-contain
                "
                onError={(event) => {
                  console.error(
                    "Failed to load Encounter image:",
                    decisionImage,
                  );

                  event.currentTarget.style.display =
                    "none";
                }}
              />

            </div>

          </div>
        )}

        {/* ================================================== */}
        {/* MESSAGE */}
        {/* ================================================== */}

        {decision.message &&
          !isEncounter && (
            <div className="mt-6 shrink-0">

              <p className="mx-auto max-w-3xl whitespace-pre-line text-xl leading-9 text-gray-200">
                {decision.message}
              </p>

            </div>
          )}

        {/* ================================================== */}
        {/* CONTINUE */}
        {/* ================================================== */}

        {(
          decision.type === "continue" ||
          decision.type ===
            "encounter-awakening-resume"
        ) && (
          <div className="mt-8 flex shrink-0 justify-center">

            <button
              type="button"
              onClick={onContinue}
              className="rounded-xl bg-blue-600 px-10 py-4 text-lg font-bold transition hover:bg-blue-500"
            >
              CONTINUE
            </button>

          </div>
        )}

        {/* ================================================== */}
        {/* CHOICE */}
        {/* ================================================== */}

        {decision.type === "choice" && (
          <div className="mx-auto mt-8 w-full max-w-4xl shrink-0">

            <p className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-500">
              Choose an option
            </p>

            <div className="flex flex-wrap items-start justify-center gap-8">

              {decision.options.map(
                (option) => {

                  const canChoose =
                    canChooseOption(
                      option,
                    );

                  /*
                   * ======================================================
                   * OPTIONS WITH IMAGE
                   * ======================================================
                   */

                  if (option.image) {
                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={!canChoose}
                        onClick={() => {
                          if (!canChoose) {
                            return;
                          }

                          onChoice(
                            option.id,
                          );
                        }}
                        className={[
                          "group flex w-47.5 flex-col items-center transition",

                          canChoose
                            ? "hover:-translate-y-2"
                            : "cursor-not-allowed opacity-45",
                        ].join(" ")}
                      >

                        <div
                          className={[
                            "overflow-hidden rounded-xl border-2 bg-black shadow-xl transition",

                            canChoose
                              ? "border-gray-700 group-hover:border-amber-400 group-hover:shadow-amber-500/20"
                              : "border-gray-800",
                          ].join(" ")}
                        >

                          <img
                            src={option.image}
                            alt={option.title}
                            className="block h-auto w-full object-contain"
                          />

                        </div>

                        <div className="mt-4 text-center">

                          <h3
                            className={[
                              "text-lg font-black transition",

                              canChoose
                                ? "text-white group-hover:text-amber-400"
                                : "text-gray-600",
                            ].join(" ")}
                          >
                            {option.title}
                          </h3>

                          {option.description && (
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              {
                                option.description
                              }
                            </p>
                          )}

                          {!canChoose &&
                            option.requirement && (
                              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-red-400">
                                Not enough{" "}
                                {
                                  option
                                    .requirement
                                    .type
                                }
                              </p>
                            )}

                        </div>

                      </button>
                    );
                  }

                  /*
                   * ======================================================
                   * TEXT OPTIONS
                   * ======================================================
                   */

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={!canChoose}
                      onClick={() => {
                        if (!canChoose) {
                          return;
                        }

                        onChoice(
                          option.id,
                        );
                      }}
                      className={[
                        "group w-full rounded-2xl border p-5 text-left shadow-lg transition",

                        canChoose
                          ? "border-gray-700 bg-gray-900/80 hover:-translate-y-0.5 hover:border-amber-500 hover:bg-gray-800"
                          : "cursor-not-allowed border-gray-800 bg-gray-950/80 opacity-50",
                      ].join(" ")}
                    >

                      <div className="flex items-start gap-4">

                        <div
                          className={[
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black",

                            canChoose
                              ? "bg-amber-500 text-black"
                              : "bg-gray-800 text-gray-600",
                          ].join(" ")}
                        >
                          {canChoose
                            ? "✓"
                            : "×"}
                        </div>

                        <div>

                          <h3
                            className={[
                              "text-lg font-black transition",

                              canChoose
                                ? "text-white group-hover:text-amber-400"
                                : "text-gray-600",
                            ].join(" ")}
                          >
                            {option.title}
                          </h3>

                          {option.description && (
                            <p className="mt-1 text-sm leading-6 text-gray-400">
                              {
                                option.description
                              }
                            </p>
                          )}

                          {!canChoose &&
                            option.requirement && (
                              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-red-400">
                                Not enough{" "}
                                {
                                  option
                                    .requirement
                                    .type
                                }
                              </p>
                            )}

                        </div>

                      </div>

                    </button>
                  );
                },
              )}

            </div>

          </div>
        )}

        {/* ================================================== */}
        {/* TEST */}
        {/* ================================================== */}

        {decision.type === "test" && (
          <div className="mx-auto mt-8 w-full max-w-3xl shrink-0">

            <div className="rounded-2xl border border-blue-900/70 bg-blue-950/30 p-6 text-center">

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
                TEST
              </p>

              <p className="mt-3 text-3xl font-black uppercase text-white sm:text-4xl">
                {decision.skill}
              </p>

              {decision.modifier !== 0 && (
                <p className="mt-2 text-lg font-bold text-gray-400">
                  {decision.modifier > 0
                    ? `+${decision.modifier}`
                    : decision.modifier}
                </p>
              )}

              <button
                type="button"
                onClick={onRollTest}
                className="mt-6 rounded-xl bg-blue-600 px-10 py-4 text-lg font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                ROLL DICE
              </button>

            </div>

          </div>
        )}

        {/* ================================================== */}
        {/* SINGLE DIE ROLL */}
        {/* ================================================== */}

        {decision.type === "single-die-roll" && (
          <div className="mx-auto mt-8 w-full max-w-3xl shrink-0">

            <div className="rounded-2xl border border-amber-900/70 bg-amber-950/20 p-6 text-center">

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">
                ROLL 1 DIE
              </p>

              {decision.message && (
                <p className="mt-4 text-lg leading-7 text-gray-300">
                  {decision.message}
                </p>
              )}

              <button
                type="button"
                onClick={onSingleDieRoll}
                className="
                  mt-6
                  rounded-xl
                  bg-amber-600
                  px-10
                  py-4
                  text-lg
                  font-black
                  text-white
                  shadow-lg
                  transition
                  hover:-translate-y-0.5
                  hover:bg-amber-500
                "
              >
                ROLL 1 DIE
              </button>

            </div>

          </div>
        )}

        {/* ================================================== */}
        {/* SELECT SPACE */}
        {/* ================================================== */}

        {decision.type ===
          "select-space" && (
          <div className="mt-8 grid shrink-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {decision.spaceIds.map(
              (spaceId) => (
                <button
                  key={spaceId}
                  type="button"
                  onClick={() =>
                    onSelectSpace(
                      spaceId,
                    )
                  }
                  className="rounded-xl border border-gray-700 bg-gray-900 px-5 py-4 text-left font-bold transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-gray-800"
                >
                  {spaceId}
                </button>
              ),
            )}

          </div>
        )}

        {/* ================================================== */}
        {/* SELECT INVESTIGATOR */}
        {/* ================================================== */}

        {decision.type ===
          "select-investigator" && (
          <div className="mt-8 grid shrink-0 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {decision.investigatorIds.map(
              (investigatorId) => {
                const investigator =
                  game.investigators[
                    investigatorId
                  ];

                if (!investigator) {
                  return null;
                }

                const definition =
                  coreInvestigators.find(
                    (item) =>
                      item.id ===
                      investigator.definitionId,
                  );

                if (!definition) {
                  return null;
                }

                const fileName =
                  definition.name.replace(
                    /\s+/g,
                    "_",
                  );

                const portrait =
                  `/cards/investigators/${fileName}/${fileName}-front.png`;

                return (
                  <button
                    key={investigatorId}
                    type="button"
                    onClick={() =>
                      onSelectInvestigator(
                        investigatorId,
                      )
                    }
                    className="
                      group
                      overflow-hidden
                      rounded-2xl
                      border
                      border-gray-700
                      bg-gray-900
                      text-left
                      shadow-xl
                      transition
                      hover:-translate-y-1
                      hover:border-amber-400
                      hover:shadow-amber-500/20
                    "
                  >
                    <div className="overflow-hidden bg-black">
                      <img
                        src={portrait}
                        alt={definition.name}
                        draggable={false}
                        className="
                          block
                          h-auto
                          w-full
                          object-contain
                          transition
                          duration-300
                          group-hover:scale-[1.015]
                        "
                      />
                    </div>

                    <div className="p-4 text-center">
                      <p className="
                        text-lg
                        font-black
                        text-white
                        group-hover:text-amber-400
                      ">
                        {definition.name}
                      </p>

                      <p className="
                        mt-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-widest
                        text-gray-500
                      ">
                        Choose as Lead Investigator
                      </p>
                    </div>
                  </button>
                );
              },
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* SELECT CARD */}
        {/* ================================================== */}

        {decision.type ===
          "select-card" && (
          <div className="mt-8 shrink-0">

            <div className="mb-6 flex flex-col items-center gap-2">

              <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
                Select Cards
              </p>

              <p className="text-lg font-black text-white">
                Selected:{" "}
                <span className="text-amber-400">
                  {decision.selectedCardIds?.length ??
                    0}
                </span>
                {" / "}
                {decision.maxSelections}
              </p>

              <p className="text-xs text-gray-500">
                Choose between{" "}
                {decision.minSelections}{" "}
                and{" "}
                {decision.maxSelections}{" "}
                card
                {decision.maxSelections !== 1
                  ? "s"
                  : ""}
                .
              </p>

            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

              {decision.cardIds.map(
                (cardId) => {
                  const isSelectable =
                    decision.selectableCardIds.includes(
                      cardId,
                    );

                  const isSelected =
                    decision.selectedCardIds?.includes(
                      cardId,
                    ) ?? false;

                  const condition =
                    game.conditions[
                      cardId
                    ];

                  if (condition) {
                    return (
                      <button
                        key={cardId}
                        type="button"
                        disabled={
                          !isSelectable
                        }
                        onClick={() => {
                          if (
                            isSelectable
                          ) {
                            onSelectCard(
                              cardId,
                            );
                          }
                        }}
                        className={`
                          group
                          overflow-hidden
                          rounded-xl
                          border-4
                          bg-gray-900
                          transition
                          ${
                            isSelected
                              ? "border-green-400 shadow-xl shadow-green-500/40 -translate-y-1"
                              : isSelectable
                                ? "cursor-pointer border-red-500 shadow-lg shadow-red-500/30 hover:-translate-y-1 hover:border-red-400"
                                : "cursor-not-allowed border-gray-800 opacity-45"
                          }
                        `}
                      >
                        <img
                          src={
                            condition.frontImage
                          }
                          alt={cardId}
                          className="block w-full object-contain"
                        />
                      </button>
                    );
                  }

                  const spell =
                    game.spells[
                      cardId
                    ];

                  if (spell) {
                    return (
                      <button
                        key={cardId}
                        type="button"
                        disabled={
                          !isSelectable
                        }
                        onClick={() => {
                          if (
                            isSelectable
                          ) {
                            onSelectCard(
                              cardId,
                            );
                          }
                        }}
                        className={`
                          group
                          overflow-hidden
                          rounded-xl
                          border-4
                          bg-gray-900
                          transition
                          ${
                            isSelected
                              ? "border-green-400 shadow-xl shadow-green-500/40 -translate-y-1"
                              : isSelectable
                                ? "cursor-pointer border-red-500 shadow-lg shadow-red-500/30 hover:-translate-y-1 hover:border-red-400"
                                : "cursor-not-allowed border-gray-800 opacity-45"
                          }
                        `}
                      >
                        <img
                          src={
                            spell.frontImage
                          }
                          alt={cardId}
                          className="block w-full object-contain"
                        />
                      </button>
                    );
                  }

                  const asset =
                    game.assets[cardId];

                  if (asset) {
                    return (
                      <button
                        key={cardId}
                        type="button"
                        disabled={
                          !isSelectable
                        }
                        onClick={() => {
                          if (
                            isSelectable
                          ) {
                            onSelectCard(
                              cardId,
                            );
                          }
                        }}
                        className={`
                          group
                          overflow-hidden
                          rounded-xl
                          border-4
                          bg-gray-900
                          transition
                          ${
                            isSelected
                              ? "border-green-400 shadow-xl shadow-green-500/40 -translate-y-1"
                              : isSelectable
                                ? "cursor-pointer border-red-500 shadow-lg shadow-red-500/30 hover:-translate-y-1 hover:border-red-400"
                                : "cursor-not-allowed border-gray-800 opacity-45"
                          }
                        `}
                      >
                        {asset.image ? (
                          <img
                            src={
                              asset.image
                            }
                            alt={
                              asset.name
                            }
                            className="block w-full object-contain"
                          />
                        ) : (
                          <div className="flex aspect-2/3 items-center justify-center p-4 text-center text-sm text-gray-500">
                            {asset.name}
                          </div>
                        )}
                      </button>
                    );
                  }

                  return null;
                },
              )}

            </div>

            <div className="mt-8 flex justify-center">

              <button
                type="button"
                disabled={
                  (decision.selectedCardIds
                    ?.length ?? 0) <
                  decision.minSelections
                }
                onClick={() => {
                  onSelectCard(
                    "__FINISH_SELECTION__",
                  );
                }}
                className={`
                  rounded-xl
                  px-10
                  py-4
                  text-lg
                  font-black
                  transition
                  ${
                    (decision.selectedCardIds
                      ?.length ?? 0) >=
                    decision.minSelections
                      ? "bg-green-600 text-white hover:bg-green-500"
                      : "cursor-not-allowed bg-gray-700 text-gray-500"
                  }
                `}
              >
                FINISH
              </button>

            </div>

          </div>
        )}

        {decision.type === "monster-ability" && (() => {
          const monster =
            game.monsters[decision.monsterId];

          if (!monster) return null;

          const monsterDefinition =
            CORE_MONSTERS.find(
              (definition) =>
                definition.id ===
                monster.definitionId,
            ) ??
            CORE_EPIC_MONSTERS.find(
              (definition) =>
                definition.id ===
                monster.definitionId,
            );

          if (!monsterDefinition) return null;

          const ability =
            decision.ability;

          const isInfluenceTest =
            ability.type ===
            "attempt-disperse-mob-before-combat";

          const isWindWalker =
            ability.type ===
            "lose-health-and-sanity-unless-spend-clue";

          return (
            <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <div className="flex max-h-[calc(100vh-24px)] w-[min(96vw,850px)] flex-col overflow-hidden rounded-3xl border border-red-900/60 bg-[#172033] p-6 text-white shadow-2xl sm:p-8">

                {/* ================================================== */}
                {/* HEADER */}
                {/* ================================================== */}

                <div className="text-center">

                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-300">
                    SPECIAL ABILITY
                  </p>

                  <h2 className="mt-3 text-3xl font-black uppercase sm:text-4xl">
                    {monsterDefinition.name}
                  </h2>

                </div>

                {/* ================================================== */}
                {/* MONSTER IMAGE */}
                {/* ================================================== */}

                <div className="mt-6 flex justify-center">

                  <img
                    src={monsterDefinition.backImage}
                    alt={monsterDefinition.name}
                    className="max-h-[42vh] w-auto rounded-2xl object-contain shadow-2xl"
                  />

                </div>

                {/* ================================================== */}
                {/* INFLUENCE TEST */}
                {/* ================================================== */}

                {isInfluenceTest && (
                  <div className="mt-6 rounded-2xl border border-blue-900/60 bg-blue-950/30 p-5 text-center">

                    <div className="flex items-center justify-center gap-3">

                      <img
                        src="/icons/game/influence.png"
                        alt="Influence"
                        className="h-10 w-10 brightness-0 invert"
                      />

                      <span className="text-2xl font-black">
                        Influence
                      </span>

                      <span className="text-2xl font-black text-gray-300">
                        {ability.modifier > 0
                          ? `+${ability.modifier}`
                          : ability.modifier}
                      </span>

                    </div>

                  </div>
                )}

                {/* ================================================== */}
                {/* WIND-WALKER */}
                {/* ================================================== */}

                {isWindWalker && (
                  <div className="mt-6 rounded-2xl border border-yellow-900/60 bg-yellow-950/20 p-5 text-center">

                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">
                      CLUE
                    </p>

                    <p className="mt-2 text-base text-gray-200">
                      You may spend 1 Clue to avoid the Health and Sanity loss.
                    </p>

                  </div>
                )}

                {/* ================================================== */}
                {/* ACTIONS */}
                {/* ================================================== */}

                <div className="mt-8 grid gap-3 sm:grid-cols-2">

                  {/* RIOT — antes do teste */}
                  {isInfluenceTest && (
                      <button
                        type="button"
                        onClick={onMonsterAbility}
                        className="rounded-xl bg-red-700 px-6 py-4 text-lg font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-red-600 active:scale-[0.98]"
                      >
                        ATTEMPT DISPERSAL
                      </button>
                    )}

                  {/* WIND-WALKER */}
                  {isWindWalker && (
                    <button
                      type="button"
                      onClick={onMonsterAbility}
                      className="rounded-xl bg-yellow-700 px-6 py-4 text-lg font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-yellow-600 active:scale-[0.98]"
                    >
                      CONTINUE
                    </button>
                  )}

                  {/* COLOUR OUT OF SPACE — ROLL 1 DIE */}

                  {ability.type ===
                    "after-will-roll-die-defeat-on-5-6" && (
                    <button
                      type="button"
                      onClick={onMonsterAbility}
                      className="rounded-xl bg-red-700 px-6 py-4 text-lg font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-red-600 active:scale-[0.98]"
                    >
                      ROLL 1 DIE
                    </button>
                  )}

                  {/* SKIP — apenas para habilidades que permitem skip */}

                  {ability.type !==
                    "after-will-roll-die-defeat-on-5-6" && (
                    <button
                      type="button"
                      onClick={onMonsterAbilitySkip}
                      className="rounded-xl border border-gray-600 bg-gray-800 px-6 py-4 text-lg font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-gray-700 active:scale-[0.98]"
                    >
                      SKIP
                    </button>
                  )}

                </div>

              </div>
            </div>
          );
        })()}

        {/* ================================================== */}
        {/* COMBAT */}
        {/* ================================================== */}

        {decision.type === "combat" && (() => {
          const monster =
            game.monsters[
              decision.monsterId
            ];

          if (!monster) {
            return null;
          }

          /*
          * ============================================================
          * MONSTER DEFINITION
          * ============================================================
          */

          const monsterDefinition =
            CORE_MONSTERS.find(
              (definition) =>
                definition.id ===
                monster.definitionId,
            ) ??
            CORE_EPIC_MONSTERS.find(
              (definition) =>
                definition.id ===
                monster.definitionId,
            );

          if (!monsterDefinition) {
            return null;
          }

          /*
          * ============================================================
          * INVESTIGATOR
          * ============================================================
          */

          const investigator =
            game.activeInvestigatorId
              ? game.investigators[
                  game.activeInvestigatorId
                ]
              : undefined;

          const investigatorDefinition =
            investigator
              ? coreInvestigators.find(
                  (definition) =>
                    definition.id ===
                    investigator.definitionId,
                )
              : undefined;

          const investigatorFileName =
            investigatorDefinition?.name.replace(
              /\s+/g,
              "_",
            );

          const investigatorFrontImage =
            investigatorFileName
              ? `/cards/investigators/${investigatorFileName}/${investigatorFileName}-front.png`
              : "";

          /*
          * ============================================================
          * COMBAT POPUP
          * ============================================================
          */

          return (
            <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">

              <div className="flex h-[calc(100vh-32px)] max-h-[calc(100vh-32px)] w-[min(96vw,1050px)] flex-col overflow-hidden rounded-3xl border border-red-900/60 bg-[#172033] p-5 text-white shadow-2xl sm:p-6">

                {/* ================================================== */}
                {/* HEADER */}
                {/* ================================================== */}

                <div className="shrink-0 text-center">

                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-400">
                    ENCOUNTER PHASE
                  </p>

                  <h2 className="mt-3 text-4xl font-black uppercase sm:text-5xl">
                    COMBAT
                  </h2>

                  <p className="mt-3 text-gray-400">
                    {investigatorDefinition?.name ??
                      "Investigator"}{" "}
                    is engaged with{" "}
                    {monsterDefinition.name}.
                  </p>

                </div>

                {/* ================================================== */}
                {/* FIGHT */}
                {/* ================================================== */}

                <div className="mt-4 flex min-h-0 flex-1 items-center justify-center gap-4 sm:mt-5 sm:gap-8">

                  {/* ================================================== */}
                  {/* INVESTIGATOR */}
                  {/* ================================================== */}

                  <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center">

                    <div
                      className="
                        relative
                        overflow-hidden
                        rounded-2xl
                        border-2
                        border-blue-500/60
                        bg-black
                        shadow-2xl
                      "
                    >

                      {investigatorFrontImage && (
                        <img
                          src={
                            investigatorFrontImage
                          }
                          alt={
                            investigatorDefinition?.name ??
                            "Investigator"
                          }
                          className="
                            block
                            max-h-full
                            w-auto
                            max-w-[38vw]
                            object-contain
                          "
                        />
                      )}

                      {/* ================================================== */}
                      {/* HEALTH */}
                      {/* ================================================== */}

                      {investigator && (
                        <CombatValueOverlay
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
                      )}

                      {/* ================================================== */}
                      {/* SANITY */}
                      {/* ================================================== */}

                      {investigator && (
                        <CombatValueOverlay
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
                      )}

                      {/* ================================================== */}
                      {/* SKILLS */}
                      {/* ================================================== */}

                      {investigator && (
                        <div
                          className="
                            pointer-events-none
                            absolute
                            left-[12%]
                            right-[8%]
                            top-[78%]
                            z-20
                            grid
                            grid-cols-5
                            text-center
                          "
                        >

                          {[
                            {
                              key: "lore",
                              current:
                                investigator.skills.lore,
                              base:
                                investigatorDefinition?.skills.lore ??
                                investigator.skills.lore,
                            },

                            {
                              key: "influence",
                              current:
                                investigator.skills.influence,
                              base:
                                investigatorDefinition?.skills.influence ??
                                investigator.skills.influence,
                            },

                            {
                              key: "observation",
                              current:
                                investigator.skills.observation,
                              base:
                                investigatorDefinition?.skills.observation ??
                                investigator.skills.observation,
                            },

                            {
                              key: "strength",
                              current:
                                investigator.skills.strength,
                              base:
                                investigatorDefinition?.skills.strength ??
                                investigator.skills.strength,
                            },

                            {
                              key: "will",
                              current:
                                investigator.skills.will,
                              base:
                                investigatorDefinition?.skills.will ??
                                investigator.skills.will,
                            },
                          ].map((skill) => (
                            <div
                              key={skill.key}
                              className="
                                relative
                                flex
                                justify-center
                              "
                            >
                              <CombatValueOverlay
                                current={
                                  skill.current
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
                          ))}

                        </div>
                      )}

                    </div>

                    <p className="mt-4 text-center text-xl font-black sm:text-2xl">
                      {investigatorDefinition?.name ??
                        "Investigator"}
                    </p>

                  </div>

                  {/* ================================================== */}
                  {/* VS */}
                  {/* ================================================== */}

                  <div className="flex shrink-0 flex-col items-center">

                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-500/60 bg-red-950/70 shadow-xl sm:h-24 sm:w-24">

                      <span className="text-2xl font-black text-red-400 sm:text-3xl">
                        VS
                      </span>

                    </div>

                  </div>

                  {/* ================================================== */}
                  {/* MONSTER */}
                  {/* ================================================== */}

                  <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center">

                    <div
                      className="
                        relative
                        overflow-hidden
                        rounded-2xl
                        border-2
                        border-red-500/60
                        bg-black
                        shadow-2xl
                      "
                    >

                      <img
                        src={
                          monsterDefinition.backImage
                        }
                        alt={
                          monsterDefinition.name
                        }
                        className="
                          block
                          max-h-full
                          w-auto
                          max-w-[38vw]
                          object-contain
                        "
                      />

                      {/* ================================================== */}
                      {/* MONSTER HEALTH */}
                      {/* ================================================== */}

                      <CombatValueOverlay
                        current={
                          monster.health
                        }
                        base={
                          resolveMonsterToughness(
                            game,
                            monsterDefinition,
                          )
                        }
                        showMaximum
                        className="
                          left-[92%]
                          top-[18%]
                          h-[10%]
                          w-[12%]
                          -translate-x-1/2
                          -translate-y-1/2
                        "
                      />

                      {/* ================================================== */}
                      {/* HORROR TEST */}
                      {/* ================================================== */}

                      {(() => {
                        const horrorTest =
                          resolveMonsterTest(
                            game,
                            monsterDefinition,
                            "horror",
                          );

                        if (!horrorTest) {
                          return null;
                        }

                        return (
                          <>
                            {/* SKILL + MODIFIER */}

                            <div
                              className="
                                pointer-events-none
                                absolute
                                left-[30%]
                                top-[24%]
                                z-30
                                flex
                                -translate-x-1/2
                                -translate-y-1/2
                                items-center
                                justify-center
                              "
                            >
                              <div
                                className="
                                  flex
                                  items-center
                                  gap-1
                                  rounded-md
                                  border
                                  border-black/80
                                  bg-black/85
                                  px-1.5
                                  py-1
                                  text-lg
                                  font-black
                                  leading-none
                                  text-white
                                  shadow-[0_2px_8px_rgba(0,0,0,0.9)]
                                "
                              >
                                <img
                                  src={getMonsterSkillIcon(
                                    horrorTest.skill,
                                  )}
                                  alt=""
                                  draggable={false}
                                  className="
                                    h-5
                                    w-5
                                    object-contain
                                    brightness-0
                                    invert
                                  "
                                />

                                <span>
                                  {horrorTest.modifier >= 0
                                    ? `+${horrorTest.modifier}`
                                    : horrorTest.modifier}
                                </span>
                              </div>
                            </div>

                            {/* DAMAGE */}

                            <div
                              className="
                                pointer-events-none
                                absolute
                                left-[46%]
                                top-[24%]
                                z-30
                                flex
                                -translate-x-1/2
                                -translate-y-1/2
                                items-center
                                justify-center
                              "
                            >
                              <div
                                className="
                                  rounded-md
                                  border
                                  border-black/80
                                  bg-black/85
                                  px-2
                                  py-1
                                  text-lg
                                  font-black
                                  leading-none
                                  text-white
                                  shadow-[0_2px_8px_rgba(0,0,0,0.9)]
                                "
                              >
                                {horrorTest.damage}
                              </div>
                            </div>
                          </>
                        );
                      })()}

                      {/* ================================================== */}
                      {/* COMBAT TEST */}
                      {/* ================================================== */}

                      {(() => {
                        const combatTest =
                          resolveMonsterTest(
                            game,
                            monsterDefinition,
                            "combat",
                          );

                        if (!combatTest) {
                          return null;
                        }

                        return (
                          <>
                            {/* SKILL + MODIFIER */}

                            <div
                              className="
                                pointer-events-none
                                absolute
                                left-[30%]
                                top-[45%]
                                z-30
                                flex
                                -translate-x-1/2
                                -translate-y-1/2
                                items-center
                                justify-center
                              "
                            >
                              <div
                                className="
                                  flex
                                  items-center
                                  gap-1
                                  rounded-md
                                  border
                                  border-black/80
                                  bg-black/85
                                  px-1.5
                                  py-1
                                  text-lg
                                  font-black
                                  leading-none
                                  text-white
                                  shadow-[0_2px_8px_rgba(0,0,0,0.9)]
                                "
                              >
                                <img
                                  src={getMonsterSkillIcon(
                                    combatTest.skill,
                                  )}
                                  alt=""
                                  draggable={false}
                                  className="
                                    h-5
                                    w-5
                                    object-contain
                                    brightness-0
                                    invert
                                  "
                                />

                                <span>
                                  {combatTest.modifier >= 0
                                    ? `+${combatTest.modifier}`
                                    : combatTest.modifier}
                                </span>
                              </div>
                            </div>

                            {/* DAMAGE */}

                            <div
                              className="
                                pointer-events-none
                                absolute
                                left-[46%]
                                top-[45%]
                                z-30
                                flex
                                -translate-x-1/2
                                -translate-y-1/2
                                items-center
                                justify-center
                              "
                            >
                              <div
                                className="
                                  rounded-md
                                  border
                                  border-black/80
                                  bg-black/85
                                  px-2
                                  py-1
                                  text-lg
                                  font-black
                                  leading-none
                                  text-white
                                  shadow-[0_2px_8px_rgba(0,0,0,0.9)]
                                "
                              >
                                {combatTest.damage}
                              </div>
                            </div>
                          </>
                        );
                      })()}

                    </div>

                    <p className="mt-4 text-center text-xl font-black sm:text-2xl">
                      {monsterDefinition.name}
                    </p>

                  </div>

                </div>

                {/* ================================================== */}
                {/* INSTRUCTION */}
                {/* ================================================== */}

                <p className="mt-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                  The investigator must resolve Combat before resolving
                  an Encounter.
                </p>

                {/* ================================================== */}
                {/* BEGIN COMBAT */}
                {/* ================================================== */}

                <div className="mt-5 flex shrink-0 justify-center">

                  <button
                    type="button"
                    onClick={onCombat}
                    className="w-full rounded-xl bg-red-700 px-6 py-3 text-lg font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-red-600 active:scale-[0.98]"
                  >
                    {decision.stage === "strength"
                      ? "FINISH COMBAT"
                      : decision.stage === "horror"
                        ? "ROLL STRENGTH TEST"
                        : "BEGIN COMBAT"}
                  </button>

                </div>

              </div>

            </div>
          );
        })()}

      </div>

    </div>
  );
}