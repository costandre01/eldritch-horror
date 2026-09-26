import { useState } from "react";

import type { GameState } from "../../../game/models/GameState";
import type { Investigator } from "../../../game/models/Investigator";
import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";
import type { Monster } from "../../../game/models/Monster";
import type { MonsterDefinition } from "../../../game/models/Monster";

import { eldritchBaseMap } from "../../../content/core/maps/eldritchBaseMap";
import { coreInvestigators } from "../../../content/core/investigators";
import { CORE_MONSTERS } from "../../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../../content/core/coreEpicMonsters";

import { resolveMonsterToughness } from "../../../game/engine/resolveMonsterToughness";
import { resolveMonsterTest } from "../../../game/engine/resolveMonsterTest";
import { getEffectiveSkill } from "../../../game/engine/getEffectiveSkill";

interface SpaceInspectModalProps {
  game: GameState;
  spaceId: string;
  onClose: () => void;
}

/*
 * ============================================================
 * PREVIEW TYPES
 * ============================================================
 */

type Preview =
  | {
      type: "investigator";
      investigator: Investigator;
      definition: InvestigatorDefinition;
    }
  | {
      type: "monster";
      monster: Monster;
      definition: MonsterDefinition;
    }
  | null;

/*
 * ============================================================
 * VALUE COLOR
 * ============================================================
 */

function getValueColor(
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
 * VALUE OVERLAY
 * ============================================================
 */

interface ValueOverlayProps {
  current: number;
  base: number;
  showMaximum?: boolean;
  className: string;
}

function ValueOverlay({
  current,
  base,
  showMaximum = false,
  className,
}: ValueOverlayProps) {
  const valueColor =
    getValueColor(current, base);

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

/*
 * ============================================================
 * INVESTIGATOR CARD OVERLAY
 * ============================================================
 */

interface InvestigatorCardOverlayProps {
  game: GameState;
  investigator: Investigator;
  definition: InvestigatorDefinition;
}

function InvestigatorCardOverlay({
  game,
  investigator,
  definition,
}: InvestigatorCardOverlayProps) {
  const skills = [
    {
      key: "lore",
      current: getEffectiveSkill(
        game,
        investigator.id,
        "lore",
      ),
      base: definition.skills.lore,
    },
    {
      key: "influence",
      current: getEffectiveSkill(
        game,
        investigator.id,
        "influence",
      ),
      base: definition.skills.influence,
    },
    {
      key: "observation",
      current: getEffectiveSkill(
        game,
        investigator.id,
        "observation",
      ),
      base: definition.skills.observation,
    },
    {
      key: "strength",
      current: getEffectiveSkill(
        game,
        investigator.id,
        "strength",
      ),
      base: definition.skills.strength,
    },
    {
      key: "will",
      current: getEffectiveSkill(
        game,
        investigator.id,
        "will",
      ),
      base: definition.skills.will,
    },
  ];

  return (
    <>
      {/* ================================================== */}
      {/* HEALTH */}
      {/* ================================================== */}

      <ValueOverlay
        current={investigator.health}
        base={investigator.maxHealth}
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
        current={investigator.sanity}
        base={investigator.maxSanity}
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
          z-20
          grid
          grid-cols-5
          text-center
        "
      >
        {skills.map((skill) => (
          <div
            key={skill.key}
            className="relative flex justify-center"
          >
            <ValueOverlay
              current={skill.current}
              base={skill.base}
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
    </>
  );
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
 * MAIN COMPONENT
 * ============================================================
 */

export default function SpaceInspectModal({
  game,
  spaceId,
  onClose,
}: SpaceInspectModalProps) {
  const [preview, setPreview] =
    useState<Preview>(null);

  const [previewFlipped, setPreviewFlipped] =
    useState(false);

  /*
   * ============================================================
   * SPACE
   * ============================================================
   */

  const space =
    eldritchBaseMap.spaces.find(
      (item) =>
        item.id === spaceId,
    );

  if (!space) {
    return null;
  }

  const spaceState =
    game.board.spaces[spaceId];

  /*
   * ============================================================
   * INVESTIGATORS HERE
   * ============================================================
   */

  const investigatorsHere =
    Object.values(
      game.investigators,
    ).filter(
      (investigator) =>
        investigator.spaceId ===
        spaceId,
    );

  /*
   * ============================================================
   * MONSTERS HERE
   * ============================================================
   */

  const monstersHere =
    spaceState?.monsterIds
      .map(
        (monsterId) =>
          game.monsters[monsterId],
      )
      .filter(
        (monster): monster is NonNullable<
          typeof monster
        > =>
          monster !== undefined,
      ) ?? [];

  /*
   * ============================================================
   * MONSTER DEFINITION
   * ============================================================
   */

  function getMonsterDefinition(
    definitionId: string,
  ) {
    return [
      ...CORE_MONSTERS,
      ...CORE_EPIC_MONSTERS,
    ].find(
      (definition) =>
        definition.id ===
        definitionId,
    );
  }

  /*
   * ============================================================
   * INVESTIGATOR DEFINITION
   * ============================================================
   */

  function getInvestigatorDefinition(
    investigator: Investigator,
  ) {
    return coreInvestigators.find(
      (definition) =>
        definition.id ===
        investigator.definitionId,
    );
  }

  /*
   * ============================================================
   * INVESTIGATOR IMAGE
   * ============================================================
   */

  function getInvestigatorImages(
    investigatorId: string,
  ) {
    const investigator =
      game.investigators[
        investigatorId
      ];

    if (!investigator) {
      return {
        frontImage: "",
        backImage: "",
      };
    }

    const definition =
      getInvestigatorDefinition(
        investigator,
      );

    if (!definition) {
      return {
        frontImage: "",
        backImage: "",
      };
    }

    const fileName =
      definition.name.replace(
        /\s+/g,
        "_",
      );

    return {
      frontImage: `/cards/investigators/${fileName}/${fileName}-front.png`,
      backImage: `/cards/investigators/${fileName}/${fileName}-back.png`,
    };
  }

  /*
   * ============================================================
   * INVESTIGATOR NAME
   * ============================================================
   */

  function getInvestigatorName(
    investigatorId: string,
  ) {
    const investigator =
      game.investigators[
        investigatorId
      ];

    if (!investigator) {
      return investigatorId;
    }

    const definition =
      getInvestigatorDefinition(
        investigator,
      );

    return (
      definition?.name ??
      investigatorId
    );
  }

  /*
   * ============================================================
   * OPEN PREVIEW
   * ============================================================
   */

  function openPreview(
    nextPreview: Preview,
  ) {
    setPreviewFlipped(false);
    setPreview(nextPreview);
  }

  /*
   * ============================================================
   * CLOSE PREVIEW
   * ============================================================
   */

  function closePreview() {
    setPreview(null);
    setPreviewFlipped(false);
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      {/* ================================================== */}
      {/* SPACE MODAL */}
      {/* ================================================== */}

      <div
        className="
          fixed
          inset-0
          z-10000
          flex
          items-center
          justify-center
          bg-black/70
          p-4
          backdrop-blur-sm
        "
        onClick={onClose}
      >
        <div
          className="
            relative
            w-full
            max-w-lg
            overflow-hidden
            rounded-2xl
            border
            border-white/15
            bg-[#181a20]
            text-white
            shadow-2xl
          "
          onClick={(event) =>
            event.stopPropagation()
          }
        >

          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-white/10
              px-5
              py-4
            "
          >
            <div>
              <h2 className="text-xl font-black">
                {space.name}
              </h2>

              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/40">
                {space.type}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-lg
                transition
                hover:bg-white/20
              "
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* ================================================== */}
          {/* CONTENT */}
          {/* ================================================== */}

          <div className="max-h-[75vh] overflow-y-auto p-5">

            {/* ================================================== */}
            {/* INVESTIGATORS */}
            {/* ================================================== */}

            {investigatorsHere.length > 0 && (
              <section className="mb-6">

                <h3 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-white/50">
                  Investigators
                </h3>

                <div className="grid grid-cols-2 gap-3">

                  {investigatorsHere.map(
                    (investigator) => {
                      const images =
                        getInvestigatorImages(
                          investigator.id,
                        );

                      const definition =
                        getInvestigatorDefinition(
                          investigator,
                        );

                      const name =
                        getInvestigatorName(
                          investigator.id,
                        );

                      if (!definition) {
                        return null;
                      }

                      return (
                        <button
                          key={
                            investigator.id
                          }
                          type="button"
                          onClick={() =>
                            openPreview({
                              type:
                                "investigator",
                              investigator,
                              definition,
                            })
                          }
                          className="
                            group
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            bg-white/5
                            p-2
                            text-left
                            transition
                            hover:bg-white/10
                          "
                        >
                          <div
                            className="
                              h-14
                              w-14
                              shrink-0
                              overflow-hidden
                              rounded-lg
                              border
                              border-white/10
                              bg-black/30
                            "
                          >
                            {images.frontImage && (
                              <img
                                src={
                                  images.frontImage
                                }
                                alt={name}
                                draggable={false}
                                className="
                                  h-full
                                  w-full
                                  object-cover
                                  transition
                                  group-hover:scale-105
                                "
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">
                              {name}
                            </p>

                            <p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
                              View card
                            </p>
                          </div>
                        </button>
                      );
                    },
                  )}

                </div>
              </section>
            )}

            {/* ================================================== */}
            {/* MONSTERS */}
            {/* ================================================== */}

            {monstersHere.length > 0 && (
              <section className="mb-6">

                <h3 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-white/50">
                  Monsters
                </h3>

                <div className="grid grid-cols-2 gap-3">

                  {monstersHere.map(
                    (monster) => {
                      const definition =
                        getMonsterDefinition(
                          monster.definitionId,
                        );

                      if (!definition) {
                        return null;
                      }

                      return (
                        <button
                          key={monster.id}
                          type="button"
                          onClick={() =>
                            openPreview({
                              type: "monster",
                              monster,
                              definition,
                            })
                          }
                          className="
                            group
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            bg-white/5
                            p-2
                            text-left
                            transition
                            hover:bg-white/10
                          "
                        >
                          <div
                            className="
                              h-16
                              w-12
                              shrink-0
                              overflow-hidden
                              rounded-md
                              border
                              border-white/10
                              bg-black/30
                            "
                          >
                            <img
                              src={
                                definition.frontImage
                              }
                              alt={
                                definition.name
                              }
                              draggable={false}
                              className="
                                h-full
                                w-full
                                object-cover
                                transition
                                group-hover:scale-105
                              "
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">
                              {definition.name}
                            </p>

                            <p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
                              {monster.isEpic
                                ? "Epic Monster"
                                : "Monster"}
                            </p>

                            <p className="mt-1 text-[10px] font-semibold text-white/50">
                                Health:{" "}
                                <span
                                    className={
                                    monster.health <
                                    resolveMonsterToughness(
                                        game,
                                        definition,
                                    )
                                        ? "text-red-400"
                                        : "text-white"
                                    }
                                >
                                    {monster.health}
                                </span>
                                <span className="text-white/40">
                                    {" / "}
                                    {resolveMonsterToughness(
                                    game,
                                    definition,
                                    )}
                                </span>
                            </p>
                          </div>
                        </button>
                      );
                    },
                  )}

                </div>
              </section>
            )}

            {/* ================================================== */}
            {/* CLUES */}
            {/* ================================================== */}

            {spaceState &&
              spaceState.clues > 0 && (
                <section className="mb-6">

                  <h3 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-white/50">
                    Clues
                  </h3>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      bg-white/5
                      p-3
                    "
                  >
                    <img
                      src="/icons/game/clue.png"
                      alt="Clue"
                      draggable={false}
                      className="h-10 w-10 object-contain"
                    />

                    <div>
                      <p className="text-sm font-bold">
                        {spaceState.clues}{" "}
                        {spaceState.clues ===
                        1
                          ? "Clue"
                          : "Clues"}
                      </p>

                      <p className="text-xs text-white/40">
                        Clue tokens on this
                        space
                      </p>
                    </div>
                  </div>
                </section>
              )}

            {/* ================================================== */}
            {/* GATES */}
            {/* ================================================== */}

            {spaceState &&
              spaceState.gates.length > 0 && (
                <section className="mb-6">

                  <h3 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-white/50">
                    Gates
                  </h3>

                  <div className="space-y-2">

                    {spaceState.gates.map(
                      (gate) => (
                        <div
                          key={gate.id}
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            bg-white/5
                            p-3
                          "
                        >

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/60 text-2xl">
                            🌀
                          </div>

                          <div>
                            <p className="text-sm font-bold">
                              Gate
                            </p>

                            <p className="text-xs text-white/40">
                              Type: {gate.omen}
                            </p>
                          </div>

                        </div>
                      ),
                    )}

                  </div>
                </section>
              )}

            {/* ================================================== */}
            {/* EXPEDITION */}
            {/* ================================================== */}

            {spaceState?.expedition && (
              <section className="mb-6">

                <h3 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-white/50">
                  Expedition
                </h3>

                <div className="rounded-xl bg-white/5 p-3 text-sm">
                  Expedition available
                </div>

              </section>
            )}

            {/* ================================================== */}
            {/* RUMOR */}
            {/* ================================================== */}

            {spaceState?.rumor && (
              <section className="mb-6">

                <h3 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-white/50">
                  Rumor
                </h3>

                <div className="rounded-xl bg-white/5 p-3 text-sm">
                  Rumor active
                </div>

              </section>
            )}

            {/* ================================================== */}
            {/* CONNECTIONS */}
            {/* ================================================== */}

            {space.connectedSpaceIds.length >
              0 && (
              <section className="mb-6">

                <h3 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-white/50">
                  Connections
                </h3>

                <div className="flex flex-wrap gap-2">

                  {space.connectedSpaceIds.map(
                    (connectionId) => {
                      const connection =
                        eldritchBaseMap.spaces.find(
                          (item) =>
                            item.id ===
                            connectionId,
                        );

                      return (
                        <span
                          key={connectionId}
                          className="
                            rounded-full
                            bg-white/10
                            px-3
                            py-1
                            text-xs
                            text-white/70
                          "
                        >
                          {connection?.name ??
                            connectionId}
                        </span>
                      );
                    },
                  )}

                </div>
              </section>
            )}

            {/* ================================================== */}
            {/* SPACE ID */}
            {/* ================================================== */}

            <div className="border-t border-white/10 pt-4">
              <p className="text-[10px] uppercase tracking-wider text-white/30">
                Space ID
              </p>

              <p className="mt-1 text-xs text-white/40">
                {space.id}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* CARD PREVIEW */}
      {/* ================================================== */}

      {preview && (
        <div
          className="
            fixed
            inset-0
            z-10001
            flex
            items-center
            justify-center
            bg-black/90
            p-6
            backdrop-blur-md
          "
          onClick={closePreview}
        >
          <div
            className="
              relative
              flex
              max-h-[92vh]
              max-w-[90vw]
              flex-col
              items-center
              gap-4
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ================================================== */}
            {/* CARD */}
            {/* ================================================== */}

            <button
              type="button"
              onClick={() =>
                setPreviewFlipped(
                  (current) =>
                    !current,
                )
              }
              className="
                relative
                cursor-pointer
                rounded-xl
                focus:outline-none
              "
              title={
                previewFlipped
                  ? "Show front"
                  : "Show back"
              }
            >

              {/* ================================================== */}
              {/* INVESTIGATOR */}
              {/* ================================================== */}

              {preview.type ===
                "investigator" && (
                <div className="relative">
                  <img
                    src={`/cards/investigators/${preview.definition.name.replace(/\s+/g, "_")}/${preview.definition.name.replace(/\s+/g, "_")}-${previewFlipped ? "back" : "front"}.png`}
                    alt={
                      preview.definition.name
                    }
                    draggable={false}
                    className="
                      block
                      max-h-[82vh]
                      max-w-[80vw]
                      rounded-xl
                      object-contain
                      shadow-2xl
                    "
                  />

                  {!previewFlipped && (
                    <InvestigatorCardOverlay
                      game={game}
                      investigator={
                        preview.investigator
                      }
                      definition={
                        preview.definition
                      }
                    />
                  )}
                </div>
              )}

                {/* ================================================== */}
                {/* MONSTER */}
                {/* ================================================== */}

                {preview.type === "monster" && (
                <div className="relative">

                    <img
                    src={
                        previewFlipped
                        ? preview.definition.backImage
                        : preview.definition.frontImage
                    }
                    alt={preview.definition.name}
                    draggable={false}
                    className="
                        block
                        max-h-[82vh]
                        max-w-[80vw]
                        rounded-xl
                        object-contain
                        shadow-2xl
                    "
                    />

                    {/* ================================================== */}
                    {/* BACK ONLY */}
                    {/* ================================================== */}

                    {previewFlipped && (
                    <>
                        {/* ================================================== */}
                        {/* CURRENT HEALTH */}
                        {/* ================================================== */}

                        <div
                        className="
                            pointer-events-none
                            absolute
                            left-[89%]
                            bottom-[65%]
                            z-30
                            -translate-x-1/2
                        "
                        >
                        <div
                            className="
                            flex
                            items-center
                            gap-1.5
                            rounded-lg
                            border
                            border-black/80
                            bg-black/85
                            px-3
                            py-1.5
                            shadow-[0_3px_10px_rgba(0,0,0,0.9)]
                            "
                        >
                            <span
                            className={`
                                text-xl
                                font-black
                                leading-none
                                ${
                                preview.monster.health <
                                resolveMonsterToughness(
                                    game,
                                    preview.definition,
                                )
                                    ? "text-red-400"
                                    : "text-white"
                                }
                            `}
                            >
                            {preview.monster.health}
                            </span>

                            <span className="text-sm font-bold text-white/60">
                            /
                            </span>

                            <span className="text-sm font-bold text-white/80">
                            {resolveMonsterToughness(
                                game,
                                preview.definition,
                            )}
                            </span>
                        </div>
                        </div>

                        {/* ================================================== */}
                        {/* HORROR TEST */}
                        {/* ================================================== */}

                        {(() => {
                        const horrorTest =
                            resolveMonsterTest(
                            game,
                            preview.definition,
                            "horror",
                            );

                        if (!horrorTest) {
                            return null;
                        }

                        return (
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
                        );
                        })()}

                        {/* ================================================== */}
                        {/* HORROR DAMAGE */}
                        {/* ================================================== */}

                        {(() => {
                        const horrorTest =
                            resolveMonsterTest(
                            game,
                            preview.definition,
                            "horror",
                            );

                        if (!horrorTest) {
                            return null;
                        }

                        return (
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
                        );
                        })()}

                        {/* ================================================== */}
                        {/* COMBAT TEST */}
                        {/* ================================================== */}

                        {(() => {
                        const combatTest =
                            resolveMonsterTest(
                            game,
                            preview.definition,
                            "combat",
                            );

                        if (!combatTest) {
                            return null;
                        }

                        return (
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
                        );
                        })()}

                        {/* ================================================== */}
                        {/* COMBAT DAMAGE */}
                        {/* ================================================== */}

                        {(() => {
                        const combatTest =
                            resolveMonsterTest(
                            game,
                            preview.definition,
                            "combat",
                            );

                        if (!combatTest) {
                            return null;
                        }

                        return (
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
                        );
                        })()}

                        {/* ================================================== */}
                        {/* DYNAMIC TOUGHNESS (*) */}
                        {/* ================================================== */}

                        {preview.definition.toughness.type ===
                        "investigators-plus" && (
                        <div
                            className="
                            pointer-events-none
                            absolute
                            left-[78%]
                            top-[16%]
                            z-30
                            flex
                            h-[14%]
                            w-[14%]
                            -translate-x-1/2
                            -translate-y-1/2
                            items-center
                            justify-center
                            "
                        >
                            <div
                            className="
                                flex
                                h-10
                                min-w-10
                                items-center
                                justify-center
                                rounded-full
                                border-2
                                border-white
                                bg-black/80
                                px-2
                                text-xl
                                font-black
                                text-white
                                shadow-[0_2px_8px_rgba(0,0,0,0.9)]
                            "
                            >
                            {resolveMonsterToughness(
                                game,
                                preview.definition,
                            )}
                            </div>
                        </div>
                        )}
                    </>
                    )}
                </div>
                )}

            </button>

            {/* ================================================== */}
            {/* NAME */}
            {/* ================================================== */}

            <p className="text-sm font-bold text-white">
              {preview.type ===
              "investigator"
                ? preview.definition.name
                : preview.definition.name}
            </p>

            {/* ================================================== */}
            {/* STATUS */}
            {/* ================================================== */}

            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              {previewFlipped
                ? "Back"
                : "Front"}{" "}
              • Click card to flip
            </p>

            {/* ================================================== */}
            {/* CLOSE */}
            {/* ================================================== */}

            <button
              type="button"
              onClick={closePreview}
              className="
                absolute
                -right-3
                -top-3
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-black/80
                text-lg
                text-white
                ring-1
                ring-white/20
                hover:bg-black
              "
              aria-label="Close preview"
            >
              ×
            </button>

          </div>
        </div>
      )}
    </>
  );
}