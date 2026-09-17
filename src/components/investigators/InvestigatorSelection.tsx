import { useState } from "react";
import { coreInvestigators } from "../../content/core/investigators";
import InvestigatorPreviewModal from "./InvestigatorPreviewModal";
import { CORE_ANCIENT_ONES } from "../../content/core/coreAncientOnes";
import AncientOnePreviewModal from "./AncientOnePreviewModal";

const MAX_INVESTIGATORS = 8;

interface InvestigatorSelectionProps {
  onContinue: (
    investigatorIds: string[],
    ancientOneId: string,
  ) => void;
}

/*
 * ============================================================
 * INVESTIGATOR IMAGES
 * ============================================================
 *
 * Estrutura:
 *
 * /public/cards/investigators/
 *   Akachi_Onyele/
 *     Akachi_Onyele-front.png
 *     Akachi_Onyele-back.png
 *
 *   Charlie_Kane/
 *     Charlie_Kane-front.png
 *     Charlie_Kane-back.png
 *
 * etc.
 */

/*
 * Converte:
 *
 * Akachi Onyele
 *
 * para:
 *
 * Akachi_Onyele
 */

function getInvestigatorFileName(
  name: string,
): string {
  return name
    .trim()
    .replace(/\s+/g, "_");
}

/*
 * Frente da carta.
 *
 * Usada na seleção dos investigadores.
 */

export function getInvestigatorFrontImage(
  name: string,
): string {
  const fileName =
    getInvestigatorFileName(name);

  return `/cards/investigators/${fileName}/${fileName}-front.png`;
}

/*
 * Verso da carta.
 *
 * Usado no Preview e posteriormente
 * quando o investigador morrer.
 */

export function getInvestigatorBackImage(
  name: string,
): string {
  const fileName =
    getInvestigatorFileName(name);

  return `/cards/investigators/${fileName}/${fileName}-back.png`;
}

/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */

export default function InvestigatorSelection({
  onContinue,
}: InvestigatorSelectionProps) {
  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const [selectedAncientOneId, setSelectedAncientOneId] =
    useState<string>("random");

  const [
    previewInvestigatorId,
    setPreviewInvestigatorId,
  ] = useState<string | null>(null);

  const [
    previewAncientOneId,
    setPreviewAncientOneId,
  ] = useState<string | null>(null);
  /*
   * ============================================================
   * SELECTION
   * ============================================================
   */

  function toggleInvestigator(
    id: string,
  ) {
    setSelectedIds((current) => {
      /*
       * Remover investigador
       */

      if (current.includes(id)) {
        return current.filter(
          (item) => item !== id,
        );
      }

      /*
       * Limite máximo
       */

      if (
        current.length >=
        MAX_INVESTIGATORS
      ) {
        return current;
      }

      /*
       * Adicionar investigador
       */

      return [...current, id];
    });
  }

  /*
   * ============================================================
   * PREVIEW
   * ============================================================
   */

  function openPreview(id: string) {
    setPreviewInvestigatorId(id);
  }

  function closePreview() {
    setPreviewInvestigatorId(null);
  }

  /*
   * ============================================================
   * PREVIEW INVESTIGATOR
   * ============================================================
   */

  const previewInvestigator =
    previewInvestigatorId
      ? coreInvestigators.find(
          (investigator) =>
            investigator.id ===
            previewInvestigatorId,
        ) ?? null
      : null;

  function openAncientOnePreview(
    id: string,
  ) {
    setPreviewAncientOneId(id);
  }

  function closeAncientOnePreview() {
    setPreviewAncientOneId(null);
  }

  /*
   * ============================================================
   * CONTINUE
   * ============================================================
   */

  const canContinue =
    selectedIds.length > 0;

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <main className="min-h-screen bg-[#111318] px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <header className="mb-8 text-center sm:mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-red-400 sm:text-sm">
            Eldritch Horror
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Escolher Investigadores
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400 sm:text-base">
            Conhece os investigadores antes de os
            escolher para a expedição.
          </p>
        </header>

        {/* ================================================== */}
        {/* COUNTER */}
        {/* ================================================== */}

        <div className="mb-5 flex items-center justify-between px-1">
          <span className="text-xs font-medium text-gray-400 sm:text-sm">
            Investigadores selecionados
          </span>

          <span
            className={`text-xs font-bold sm:text-sm ${
              canContinue
                ? "text-red-400"
                : "text-gray-300"
            }`}
          >
            {selectedIds.length} /{" "}
            {MAX_INVESTIGATORS}
          </span>
        </div>

        {/* ================================================== */}
        {/* GRID */}
        {/* ================================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {coreInvestigators.map(
            (investigator) => {
              const selected =
                selectedIds.includes(
                  investigator.id,
                );

              const investigatorFrontImage =
                getInvestigatorFrontImage(
                  investigator.name,
                );

              return (
                <article
                  key={investigator.id}
                  className={`group relative overflow-hidden rounded-xl border bg-[#121720] transition-all duration-200 ${
                    selected
                      ? "border-red-500 shadow-lg shadow-red-950/30"
                      : "border-gray-800 hover:border-gray-600"
                  }`}
                >

                  {/* ================================================== */}
                  {/* SELECTED */}
                  {/* ================================================== */}

                  {selected && (
                    <div className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold shadow-lg">
                      ✓
                    </div>
                  )}

                  {/* ================================================== */}
                  {/* CARD FRONT */}
                  {/* ================================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      openPreview(
                        investigator.id,
                      )
                    }
                    className="block w-full cursor-pointer bg-black"
                    title={`Ver ${investigator.name}`}
                  >
                    <img
                      src={investigatorFrontImage}
                      alt={investigator.name}
                      className="block h-auto w-full object-contain transition duration-300 group-hover:scale-[1.015]"
                    />
                  </button>

                  {/* ================================================== */}
                  {/* BUTTONS */}
                  {/* ================================================== */}

                  <div className="grid grid-cols-2 gap-2 p-3">

                    {/* SEE */}

                    <button
                      type="button"
                      onClick={() =>
                        openPreview(
                          investigator.id,
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-[#202b3b] px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white transition hover:border-gray-500 hover:bg-[#293548]"
                    >
                      <span
                        aria-hidden="true"
                        className="text-sm leading-none"
                      >
                        ⌕
                      </span>

                      See
                    </button>

                    {/* CHOOSE */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleInvestigator(
                          investigator.id,
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wide transition ${
                        selected
                          ? "bg-red-800 text-white hover:bg-red-700"
                          : "bg-red-600 text-white hover:bg-red-500"
                      }`}
                    >
                      {selected
                        ? "Chosen"
                        : "Choose"}
                    </button>
                  </div>
                </article>
              );
            },
          )}
        </div>

        {/* ================================================== */}
        {/* ANCIENT ONE */}
        {/* ================================================== */}

        <section className="mt-12">

          <div className="mb-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-400">
              Ancient One
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Escolher Ancient One
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400">
              Escolhe quem irá despertar ou deixa a escolha ao acaso.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">

            {/* RANDOM */}

            <div
              className={`rounded-xl border bg-[#121720] p-3 transition ${
                selectedAncientOneId === "random"
                  ? "border-red-500 shadow-lg shadow-red-950/30"
                  : "border-gray-800"
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  setSelectedAncientOneId("random")
                }
                className="w-full"
              >
                <div className="flex aspect-3/4 items-center justify-center rounded-lg bg-[#202631]">
                  <span className="text-5xl font-black text-gray-400">
                    ?
                  </span>
                </div>
              </button>

              <div className="mt-3 text-center">
                <p className="font-bold text-white">
                  Random
                </p>

                <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  Escolha aleatória
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedAncientOneId("random")
                }
                className={`mt-3 w-full rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wide transition ${
                  selectedAncientOneId === "random"
                    ? "bg-red-800 text-white"
                    : "bg-red-600 text-white hover:bg-red-500"
                }`}
              >
                {selectedAncientOneId === "random"
                  ? "Chosen"
                  : "Choose"}
              </button>
            </div>

            {/* ANCIENT ONES */}

            {CORE_ANCIENT_ONES.map(
              (ancientOne) => {
                const selected =
                  selectedAncientOneId ===
                  ancientOne.id;

                return (
                  <article
                    key={ancientOne.id}
                    className={`group relative overflow-hidden rounded-xl border bg-[#121720] transition-all duration-200 ${
                      selected
                        ? "border-red-500 shadow-lg shadow-red-950/30"
                        : "border-gray-800 hover:border-gray-600"
                    }`}
                  >

                    {/* SELECTED */}

                    {selected && (
                      <div className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold shadow-lg">
                        ✓
                      </div>
                    )}

                    {/* CARD */}

                    <button
                      type="button"
                      onClick={() =>
                        openAncientOnePreview(
                          ancientOne.id,
                        )
                      }
                      className="block w-full cursor-pointer bg-black"
                      title={`Ver ${ancientOne.name}`}
                    >
                      <img
                        src={ancientOne.frontImage}
                        alt={ancientOne.name}
                        className="block h-auto w-full object-contain transition duration-300 group-hover:scale-[1.015]"
                      />
                    </button>

                    {/* NAME */}

                    <div className="p-3">

                      <p className="text-center text-sm font-bold text-white">
                        {ancientOne.name}
                      </p>

                      {/* BUTTONS */}

                      <div className="mt-3 grid grid-cols-2 gap-2">

                        {/* SEE */}

                        <button
                          type="button"
                          onClick={() =>
                            openAncientOnePreview(
                              ancientOne.id,
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-[#202b3b] px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white transition hover:border-gray-500 hover:bg-[#293548]"
                        >
                          <span
                            aria-hidden="true"
                            className="text-sm leading-none"
                          >
                            ⌕
                          </span>

                          See
                        </button>

                        {/* CHOOSE */}

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedAncientOneId(
                              ancientOne.id,
                            )
                          }
                          className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wide transition ${
                            selected
                              ? "bg-red-800 text-white hover:bg-red-700"
                              : "bg-red-600 text-white hover:bg-red-500"
                          }`}
                        >
                          {selected
                            ? "Chosen"
                            : "Choose"}
                        </button>

                      </div>
                    </div>
                  </article>
                );
              },
            )}

          </div>
        </section>

        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <div className="mt-8 flex flex-col items-center gap-3">

          <p className="text-xs text-gray-500 sm:text-sm">
            {canContinue
              ? "Investigators selected. Can continue."
              : `Seleciona mais ${
                  MAX_INVESTIGATORS -
                  selectedIds.length
                }.`
            }
          </p>

          <button
            type="button"
            disabled={!canContinue}
            onClick={() =>
              onContinue(
                selectedIds,
                selectedAncientOneId,
              )
            }
            className="rounded-lg bg-red-700 px-8 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
          >
            Continue
          </button>
        </div>
      </div>

      {/* ====================================================== */}
      {/* PREVIEW MODAL */}
      {/* ====================================================== */}

      {previewInvestigator && (
        <InvestigatorPreviewModal
          investigator={
            previewInvestigator
          }
          onClose={closePreview}
        />
      )}

      {previewAncientOneId && (
        <AncientOnePreviewModal
          ancientOne={
            CORE_ANCIENT_ONES.find(
              (ancientOne) =>
                ancientOne.id ===
                previewAncientOneId,
            )!
          }
          onClose={
            closeAncientOnePreview
          }
        />
      )}
    </main>
  );
}