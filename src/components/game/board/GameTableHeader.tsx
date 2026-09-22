import {
  useEffect,
  useState,
} from "react";

import type { GameState } from "../../../game/models/GameState";
import type { Asset } from "../../../game/models/Asset";
import type { Artifact } from "../../../game/models/Artifact";
import type { Spell } from "../../../game/models/Spell";
import type { Condition } from "../../../game/models/Condition";

import { CORE_ANCIENT_ONES } from "../../../content/core/coreAncientOnes";
import { CORE_MYSTERIES } from "../../../content/core/coreMysteries";
import { easyMythos } from "../../../content/core/mythos/easyMythos";
import { normalMythos } from "../../../content/core/mythos/normalMythos";
import { hardMythos } from "../../../content/core/mythos/hardMythos";

interface GameTableHeaderProps {
  game: GameState;
  onSave: () => void;
  onExit: () => void;
}

/*
 * ============================================================
 * DECK VISUAL
 * ============================================================
 */

interface DeckVisualProps {
  title: string;
  count: number;
  image?: string;
  subtitle?: string;
  disabled?: boolean;
  onClick?: () => void;
}

function DeckVisual({
  title,
  count,
  image,
  subtitle,
  disabled = false,
  onClick,
}: DeckVisualProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "group flex min-w-25 flex-col items-center",
        "rounded-xl border p-2 transition",
        disabled
          ? "cursor-default border-slate-800 bg-slate-900/40 opacity-55"
          : "cursor-pointer border-slate-700 bg-slate-900/60 hover:border-slate-500 hover:bg-slate-800/70",
      ].join(" ")}
    >
      <div
        className={[
          "relative flex h-36 w-24 items-center justify-center",
          "overflow-hidden rounded-lg border-2 shadow-lg",
          disabled
            ? "border-slate-700 bg-slate-800"
            : "border-slate-500 bg-slate-800",
        ].join(" ")}
      >
        {image ? (
          <img
            src={image}
            alt={`${title} deck`}
            className="h-full w-full rounded object-cover"
          />
        ) : (
          <span className="px-1 text-center text-[9px] font-black uppercase tracking-wider text-slate-400">
            {title}
          </span>
        )}

        <div className="absolute -bottom-1 -right-1 -z-1 h-36 w-24 rounded-lg border border-slate-700 bg-slate-900" />
      </div>

      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
        {title}
      </p>

      <p className="text-xs text-slate-500">
        {count} Cards
      </p>

      {subtitle && (
        <p className="mt-0.5 text-[9px] text-slate-600">
          {subtitle}
        </p>
      )}
    </button>
  );
}

/*
 * ============================================================
 * CARD BOOK TYPES
 * ============================================================
 */

type CardBookType =
  | "assets"
  | "artifacts"
  | "spells"
  | "conditions";

interface BookCard {
  id: string;
  name: string;
  image: string;
}

/*
 * ============================================================
 * CARD BOOK
 * ============================================================
 */

interface CardBookProps {
  type: CardBookType;
  cards: BookCard[];
  startIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSelectCard: (card: BookCard) => void;
}

function CardBook({
  type,
  cards,
  startIndex,
  onClose,
  onPrevious,
  onNext,
  onSelectCard,
}: CardBookProps) {
  const title =
    type === "assets"
      ? "Assets"
      : type === "artifacts"
        ? "Artifacts"
        : type === "spells"
          ? "Spells"
          : "Conditions";

  /*
   * ==========================================================
   * KEYBOARD NAVIGATION
   * ==========================================================
   */

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    onClose,
    onNext,
    onPrevious,
  ]);

  /*
   * ==========================================================
   * EMPTY
   * ==========================================================
   */

  if (cards.length === 0) {
    return (
      <div
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-6"
        onClick={onClose}
      >
        <div
          className="rounded-xl border border-slate-700 bg-slate-900 p-10"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <p className="text-lg font-bold">
            No {title} available.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 rounded-lg bg-slate-700 px-5 py-2 text-sm font-bold hover:bg-slate-600"
          >
            CLOSE
          </button>
        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * FOUR VISIBLE CARDS
   * ==========================================================
   */

  const visibleCards =
    cards.slice(
      startIndex,
      startIndex + 4,
    );

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-7xl flex-col rounded-2xl border border-slate-700 bg-[#111722] p-5 shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* BOOK HEADER */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Deck
            </p>

            <h2 className="text-2xl font-bold">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold hover:bg-slate-700"
          >
            CLOSE
          </button>
        </div>

        {/* BOOK */}

        <div className="flex min-h-140 items-center justify-center gap-3 sm:gap-6">

          {/* PREVIOUS */}

          <button
            type="button"
            onClick={onPrevious}
            aria-label="Previous cards"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-2xl font-bold text-white shadow-lg transition hover:border-slate-400 hover:bg-slate-700"
          >
            ←
          </button>

          {/* CARDS */}

          <div className="grid min-w-0 flex-1 grid-cols-2 justify-items-center gap-4 lg:grid-cols-4">
            {visibleCards.map(
              (card, index) => (
                <button
                  key={`${card.id}-${startIndex}-${index}`}
                  type="button"
                  onClick={() => onSelectCard(card)}
                  className="group flex min-w-0 flex-col items-center"
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="h-75 w-50 rounded-xl object-fill shadow-2xl transition duration-200 group-hover:scale-[1.015]"
                  />
                </button>
              ),
            )}
          </div>

          {/* NEXT */}

          <button
            type="button"
            onClick={onNext}
            aria-label="Next cards"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-2xl font-bold text-white shadow-lg transition hover:border-slate-400 hover:bg-slate-700"
          >
            →
          </button>

        </div>

        {/* BOOK FOOTER */}

        <div className="mt-5 flex items-center justify-center">
          <p className="text-xs text-slate-500">
            Use ← and → to browse
          </p>
        </div>
      </div>
    </div>
  );
}

/*
 * ============================================================
 * MAIN COMPONENT
 * ============================================================
 */

export default function GameTableHeader({
  game,
  onSave,
  onExit,
}: GameTableHeaderProps) {
  /*
   * ============================================================
   * ANCIENT ONE
   * ============================================================
   */

  const [
    ancientOneFlipped,
    setAncientOneFlipped,
  ] = useState(false);

  const [
    ancientOneZoomed,
    setAncientOneZoomed,
  ] = useState(false);

  const ancientOneDefinition =
    CORE_ANCIENT_ONES.find(
      (definition) =>
        definition.id ===
        game.ancientOne.id,
    );

  /*
   * ============================================================
   * MYSTERIES
   * ============================================================
   */

  const solvedMysteryIds =
    game.mysteries.solvedMysteryIds;

  /*
   * ============================================================
   * MYTHOS
   * ============================================================
   */

  const mythosDeck =
    game.board.mythosDeck;

  const allMythos = [
    ...easyMythos,
    ...normalMythos,
    ...hardMythos,
  ];

  const mythosInPlay =
    game.board.mythosInPlay
      .map((entry) =>
        allMythos.find(
          (mythos) =>
            mythos.id ===
            entry.definitionId,
        ),
      )
      .filter(
        (
          mythos,
        ): mythos is NonNullable<
          typeof mythos
        > =>
          mythos !== undefined,
      );

  /*
   * ============================================================
   * OTHER DECKS
   * ============================================================
   */

  const assetDeck =
    game.board.assetDeck;

  const spellDeck =
    game.board.spellDeck;

  const artifactDeck =
    game.board.artifactDeck;

  const conditionDeck =
    game.board.conditionDeck;

  const encounterDecks =
    game.board.encounterDecks;


  /*
   * ============================================================
   * TOP SPELL
   * ============================================================
   */

  const topSpell: Spell | undefined =
    spellDeck
      .map((entry) =>
        typeof entry === "string"
          ? game.spells[entry]
          : entry,
      )
      .find(
        (
          spell,
        ): spell is Spell =>
          Boolean(
            spell?.frontImage,
          ),
      );

  /*
   * ============================================================
   * TOP CONDITION
   * ============================================================
   */

  const topConditionEntry =
    conditionDeck[0];

  const topCondition:
    | Condition
    | undefined =
    typeof topConditionEntry === "string"
      ? game.conditions[
          topConditionEntry
        ]
      : topConditionEntry;

  /*
   * ============================================================
   * CARD BOOK
   * ============================================================
   */

  const [
    cardBookType,
    setCardBookType,
  ] =
    useState<CardBookType | null>(
      null,
    );

  const [
    cardBookIndex,
    setCardBookIndex,
  ] = useState(0);

  const [
    selectedBookCard,
    setSelectedBookCard,
  ] = useState<BookCard | null>(null);

  /*
   * ============================================================
   * ASSET BOOK
   * ============================================================
   */

  const assetBookCards: BookCard[] =
    assetDeck
      .map((entry) => {
        const asset: Asset | undefined =
          typeof entry === "string"
            ? game.assets[entry]
            : entry;

        if (!asset) {
          return null;
        }

        return {
          id: asset.id,
          name: asset.name,
          image:
            asset.image ??
            `/cards/assets/${asset.name.replaceAll(" ", "_")}.png`,
        };
      })
      .filter(
        (
          card,
        ): card is BookCard =>
          card !== null,
      );

  /*
   * ============================================================
   * ARTIFACT BOOK
   * ============================================================
   */

  const artifactBookCards: BookCard[] =
    artifactDeck
      .map((entry) => {
        const artifact:
          | Artifact
          | undefined =
          typeof entry === "string"
            ? game.artifacts[entry]
            : entry;

        if (!artifact) {
          return null;
        }

        const artifactImages: Record<
          string,
          string
        > = {
          "Cultes des Goules":
            "/cards/artifacts/Cultes_des_Goules.png",

          "De Vermis Mysteriis":
            "/cards/artifacts/De_Vermis_Mysteriis.png",

          "Flute of the Outer Gods":
            "/cards/artifacts/Flute_of_the_Outer_Gods.png",

          "Gate Box":
            "/cards/artifacts/Gate_Box.png",

          "Glass of Mortlan":
            "/cards/artifacts/Glass_of_Mortlan.png",

          "Grotesque Statue":
            "/cards/artifacts/Grotesque_Statue.png",

          "Lightning Gun":
            "/cards/artifacts/Lightning_Gun.png",

          "Mi-go Brain Case":
            "/cards/artifacts/Mi-go_Brain_Case.png",

          "Necronomicon":
            "/cards/artifacts/Necronomicon.png",

          "Pallid Mask":
            "/cards/artifacts/Pallid_Mask.png",

          "Ruby of R'lyeh":
            "/cards/artifacts/Ruby_of_R'lyeh.png",

          "Sword of Saint Jerome":
            "/cards/artifacts/Sword_of_Saint_Jerome.png",

          "The Silver Key":
            "/cards/artifacts/The_Silver_Key.png",

          "T'tka Halot":
            "/cards/artifacts/T'tka_Halot.png",
        };

        const image =
          artifactImages[
            artifact.name
          ];

        if (!image) {
          return null;
        }

        return {
          id: artifact.id,
          name: artifact.name,
          image,
        };
      })
      .filter(
        (
          card,
        ): card is BookCard =>
          card !== null,
      );

  /*
   * ============================================================
   * SPELL BOOK
   * ============================================================
   */

  const spellBookCards: BookCard[] =
    spellDeck
      .map((entry) => {
        const spell: Spell | undefined =
          typeof entry === "string"
            ? game.spells[entry]
            : entry;

        if (!spell?.frontImage) {
          return null;
        }

        return {
          id: spell.id,
          name: spell.id,
          image: spell.frontImage,
        };
      })
      .filter(
        (
          card,
        ): card is BookCard =>
          card !== null,
      );

  /*
   * ============================================================
   * CONDITION BOOK
   * ============================================================
   */

  const conditionBookCards: BookCard[] =
    conditionDeck
      .map((entry) => {
        const condition:
          | Condition
          | undefined =
          typeof entry === "string"
            ? game.conditions[entry]
            : entry;

        if (!condition?.frontImage) {
          return null;
        }

        return {
          id: condition.id,
          name: condition.id,
          image: condition.frontImage,
        };
      })
      .filter(
        (
          card,
        ): card is BookCard =>
          card !== null,
      );

  /*
   * ============================================================
   * CURRENT BOOK
   * ============================================================
   */

  let currentBookCards: BookCard[] = [];

  if (cardBookType === "assets") {
    currentBookCards =
      assetBookCards;
  }

  if (cardBookType === "artifacts") {
    currentBookCards =
      artifactBookCards;
  }

  if (cardBookType === "spells") {
    currentBookCards =
      spellBookCards;
  }

  if (cardBookType === "conditions") {
    currentBookCards =
      conditionBookCards;
  }

  /*
   * ============================================================
   * OPEN BOOK
   * ============================================================
   */

  function openCardBook(
    type: CardBookType,
  ) {
    setCardBookIndex(0);
    setCardBookType(type);
  }

  /*
   * ============================================================
   * CLOSE BOOK
   * ============================================================
   */

  function closeCardBook() {
    setCardBookType(null);
    setCardBookIndex(0);
  }

  function closeBookCardPreview() {
    setSelectedBookCard(null);
  }

  /*
   * ============================================================
   * NEXT
   * ============================================================
   */

  function nextCard() {
    if (
      currentBookCards.length === 0
    ) {
      return;
    }

    setCardBookIndex(
      (current) => {
        const next =
          current + 4;

        if (
          next >=
          currentBookCards.length
        ) {
          return current;
        }

        return next;
      },
    );
  }

  /*
   * ============================================================
   * PREVIOUS
   * ============================================================
   */

  function previousCard() {
    if (
      currentBookCards.length === 0
    ) {
      return;
    }

    setCardBookIndex(
      (current) =>
        Math.max(
          0,
          current - 4,
        ),
    );
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      {/* ====================================================== */}
      {/* GAME ACTIONS */}
      {/* ====================================================== */}

      <div className="mb-3 flex justify-end gap-2">

        {/* SAVE */}

        <button
          type="button"
          onClick={onSave}
          title="Save Game"
          aria-label="Save Game"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-lg transition hover:border-slate-500 hover:bg-slate-800"
        >
          💾
        </button>

        {/* EXIT */}

        <button
          type="button"
          onClick={onExit}
          title="Exit Game"
          aria-label="Exit Game"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-lg transition hover:border-red-500/60 hover:bg-red-950/40"
        >
          ⎋
        </button>

      </div>

      {/* ====================================================== */}
      {/* TOP GAME HEADER */}
      {/* ====================================================== */}

      <div className="mb-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">

        {/* ================================================== */}
        {/* ANCIENT ONE */}
        {/* ================================================== */}

        <section className="p-2">

          <div className="mb-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
              Ancient One
            </p>

            <h2 className="text-lg font-bold">
              {game.ancientOne.name}
            </h2>
          </div>

          {ancientOneDefinition && (
            <div>
              <button
                type="button"
                className="group mx-auto block"
                onClick={() =>
                  setAncientOneZoomed(true)
                }
              >
                <img
                  src={
                    ancientOneFlipped
                      ? ancientOneDefinition.backImage
                      : ancientOneDefinition.frontImage
                  }
                  alt={
                    game.ancientOne.name
                  }
                  className="mx-auto h-140 w-auto rounded-lg object-contain shadow-2xl transition group-hover:scale-[1.02]"
                />
              </button>

              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setAncientOneZoomed(true)
                  }
                  className="rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-slate-700"
                >
                  VIEW CARD
                </button>
              </div>
            </div>
          )}

        </section>

        {/* ================================================== */}
        {/* MYSTERIES + MYTHOS */}
        {/* ================================================== */}

        <section className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">

          {/* ================================================= */}
          {/* MYSTERIES */}
          {/* ================================================= */}

          <div className="p-2">

            <div className="relative mb-3 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">
                  Mysteries
                </p>

                <h2 className="text-lg font-bold">
                  Active Mystery
                </h2>
              </div>

              <div className="absolute right-0 text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Solved Mysteries
                </p>

                <p className="text-lg font-bold">
                  {
                    solvedMysteryIds.length
                  }{" "}
                  / 3
                </p>
              </div>
            </div>

            {(() => {
              const activeMystery =
                game.mysteries
                  .activeMysteryId
                  ? CORE_MYSTERIES.find(
                      (mystery) =>
                        mystery.id ===
                        game.mysteries
                          .activeMysteryId,
                    )
                  : undefined;

              if (!activeMystery) {
                return (
                  <div className="flex min-h-55 items-center justify-center">
                    <p className="text-xs text-slate-500">
                      None Active Mystery.
                    </p>
                  </div>
                );
              }

              const solved =
                solvedMysteryIds.includes(
                  activeMystery.id,
                );

              return (
                <div className="flex justify-center">
                  <div
                    className={[
                      "relative rounded-lg border-2 p-1",
                      solved
                        ? "border-green-500/60 opacity-50"
                        : "border-purple-400",
                    ].join(" ")}
                  >
                    <img
                      src={
                        activeMystery.image
                      }
                      alt={
                        activeMystery.name
                      }
                      className="h-auto max-h-[60vh] w-auto max-w-full rounded object-contain shadow-2xl"
                    />

                    {!solved && (
                      <div className="absolute left-2 top-2 rounded bg-purple-600 px-2 py-1 text-[9px] font-bold uppercase">
                        Active
                      </div>
                    )}

                    {solved && (
                      <div className="absolute inset-0 flex items-center justify-center rounded bg-black/50">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-2xl font-black">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="mt-3 border-t border-slate-700 pt-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Mysteries
              </p>

              <div className="flex items-center justify-center gap-2">
                {Array.from({
                  length: 3,
                }).map((_, index) => (
                  <div
                    key={index}
                    className={[
                      "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold",
                      index <
                      solvedMysteryIds.length
                        ? "border-green-500 bg-green-600 text-white"
                        : "border-slate-600 bg-slate-800 text-slate-500",
                    ].join(" ")}
                  >
                    {index <
                    solvedMysteryIds.length
                      ? "✓"
                      : ""}
                  </div>
                ))}

                <span className="ml-2 text-sm font-bold">
                  {
                    solvedMysteryIds.length
                  }{" "}
                  / 3
                </span>
              </div>
            </div>

          </div>

          {/* ================================================= */}
          {/* MYTHOS */}
          {/* ================================================= */}

          <div className="min-w-0 p-2">

            <div className="mb-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-400">
                Mythos
              </p>

              <h2 className="text-lg font-bold">
                Mythos
              </h2>
            </div>

            <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-6">

              {/* MYTHOS DECK */}

              <div className="shrink-0">

                <img
                  src="/cards/Mystery/Mythos-back.jpg"
                  alt="Mythos deck"
                  className="h-130 w-auto rounded object-cover shadow-lg"
                />

                <p className="mt-1 text-center text-[9px] font-bold uppercase text-slate-500">
                  Deck
                </p>

                <p className="text-center text-[10px] text-slate-400">
                  Remaining:{" "}
                  <span className="font-bold text-white">
                    {
                      mythosDeck.length
                    }
                  </span>
                </p>

              </div>

              {/* MYTHOS REVEALED */}

              <div className="min-w-0 overflow-x-auto">

                <div className="flex min-h-130 gap-3">

                  {mythosInPlay.map(
                    (
                      mythos,
                      index,
                    ) => (
                      <button
                        type="button"
                        key={`${mythos.id}-${index}`}
                        className="group shrink-0"
                        title={
                          mythos.name
                        }
                      >
                        <img
                          src={
                            mythos.image
                          }
                          alt={
                            mythos.name
                          }
                          className="h-130 w-auto rounded object-cover shadow-lg transition group-hover:scale-[1.02]"
                        />

                        <p className="mt-1 max-w-30 truncate text-center text-[9px] text-slate-400">
                          {
                            mythos.name
                          }
                        </p>
                      </button>
                    ),
                  )}

                  {mythosInPlay.length ===
                    0 && (
                    <div className="flex min-h-130 min-w-55 items-center justify-center">
                      <p className="text-center text-sm font-medium text-slate-100">
                        No Mythos cards revealed.
                      </p>
                    </div>
                  )}

                </div>

              </div>
            </div>

          </div>

        </section>
      </div>

      {/* ====================================================== */}
      {/* CARD DECKS */}
      {/* ====================================================== */}

      <section className="mb-3 p-3">

        <div className="flex flex-wrap justify-center gap-3">

          {/* ================================================= */}
          {/* ASSETS */}
          {/* ================================================= */}

          <DeckVisual
            title="Assets"
            count={
              assetDeck.length
            }
            image="/cards/assets/asset_back.png"
            disabled={
              assetDeck.length === 0
            }
            onClick={() =>
              openCardBook("assets")
            }
          />

          {/* ================================================= */}
          {/* SPELLS */}
          {/* ================================================= */}

          <DeckVisual
            title="Spells"
            count={
              spellDeck.length
            }
            image={
              topSpell?.frontImage
            }
            disabled={
              spellDeck.length === 0
            }
            onClick={() =>
              openCardBook("spells")
            }
          />

          {/* ================================================= */}
          {/* ARTIFACTS */}
          {/* ================================================= */}

          <DeckVisual
            title="Artifacts"
            count={
              artifactDeck.length
            }
            image="/cards/artifacts/artifact_back.png"
            disabled={
              artifactDeck.length === 0
            }
            onClick={() =>
              openCardBook("artifacts")
            }
          />

          {/* ================================================= */}
          {/* CONDITIONS */}
          {/* ================================================= */}

          <DeckVisual
            title="Conditions"
            count={
              conditionDeck.length
            }
            image={
              topCondition?.frontImage
            }
            disabled={
              conditionDeck.length === 0
            }
            onClick={() =>
              openCardBook("conditions")
            }
          />

          {/* ================================================= */}
          {/* ENCOUNTERS */}
          {/* ================================================= */}

          <DeckVisual
            title="America"
            count={
              encounterDecks.america.length
            }
            image="/cards/encounters/Americas/Americas_Encounter.png"
          />

          <DeckVisual
            title="Europe"
            count={
              encounterDecks.europe.length
            }
            image="/cards/encounters/Europe/Europe_Encounter.png"
          />

          <DeckVisual
            title="Asia / Australia"
            count={
              encounterDecks["asia-australia"].length
            }
            image="/cards/encounters/Asia-Australia/Asia-Australia_Encounter.png"
          />

          <DeckVisual
            title="General"
            count={
              encounterDecks.general.length
            }
            image="/cards/encounters/General/General_Encounter.png"
          />

          <DeckVisual
            title="Research"
            count={
              encounterDecks.research.length
            }
            image="/cards/encounters/Research-encounters/Azathoth_Research-Encounter.png"
          />

          <DeckVisual
            title="Other World"
            count={
              encounterDecks["other-world"].length
            }
            image="/cards/encounters/other-World-Encounters/Other_World_Encounter.png"
          />

          <DeckVisual
            title="Special"
            count={
              encounterDecks.special.length
            }
            image="/cards/encounters/special-Encounters/R'lyeh-Risen-special-Encounters.png"
          />

          <DeckVisual
            title="Expedition"
            count={
              encounterDecks.expedition.length
            }
            image="/cards/encounters/Expedition-Encounters/Antarctica-Expedition-Encounters.png"
          />

        </div>
      </section>

      {/* ====================================================== */}
      {/* ANCIENT ONE ZOOM */}
      {/* ====================================================== */}

      {ancientOneZoomed &&
        ancientOneDefinition && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-6"
            onClick={() =>
              setAncientOneZoomed(false)
            }
          >
            <div
              className="relative max-h-[95vh] max-w-[90vw]"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <img
                src={
                  ancientOneFlipped
                    ? ancientOneDefinition.backImage
                    : ancientOneDefinition.frontImage
                }
                alt={
                  game.ancientOne.name
                }
                className="max-h-[80vh] max-w-[80vw] rounded-xl object-contain shadow-2xl"
              />

              <div className="mt-4 flex justify-center gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setAncientOneFlipped(
                      (current) =>
                        !current,
                    )
                  }
                  className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-bold hover:bg-slate-700"
                >
                  {ancientOneFlipped
                    ? "FLIP FRONT"
                    : "FLIP BACK"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setAncientOneZoomed(
                      false,
                    )
                  }
                  className="rounded-lg bg-red-700 px-5 py-2 text-sm font-bold hover:bg-red-600"
                >
                  CLOSE
                </button>

              </div>
            </div>
          </div>
        )}

      {/* ====================================================== */}
      {/* CARD BOOK */}
      {/* ====================================================== */}

      {cardBookType && (
        <CardBook
          type={cardBookType}
          cards={currentBookCards}
          startIndex={cardBookIndex}
          onClose={closeCardBook}
          onPrevious={previousCard}
          onNext={nextCard}
          onSelectCard={(card) =>
            setSelectedBookCard(card)
          }
        />
      )}

      {selectedBookCard && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 p-6 backdrop-blur-md"
          onClick={closeBookCardPreview}
        >
          <div
            className="relative flex max-h-[94vh] max-w-[94vw] items-center justify-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={closeBookCardPreview}
              className="absolute -right-4 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-2xl font-bold text-white transition hover:bg-red-600"
            >
              ×
            </button>

            <img
              src={selectedBookCard.image}
              alt={selectedBookCard.name}
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}