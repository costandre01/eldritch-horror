import { useEffect, useRef, useState } from "react";

interface DiceRollModalProps {
  results: number[];
  title?: string;
  sixCountsAsTwo?: boolean;
  onComplete?: () => void;
  rerollAbilities?: { id: string; name: string; amount: number; image?: string; description?: string; resultModifier?: number; sanityCost?: number; rerollEachDieOnce?: boolean }[];
  onReroll?: (dieIndex: number, abilityId: string) => void;
}

function DicePips({
  value,
}: {
  value: number;
}) {
  const positions: Record<number, string[]> = {
    1: ["center"],

    2: [
      "top-left",
      "bottom-right",
    ],

    3: [
      "top-left",
      "center",
      "bottom-right",
    ],

    4: [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ],

    5: [
      "top-left",
      "top-right",
      "center",
      "bottom-left",
      "bottom-right",
    ],

    6: [
      "top-left",
      "top-right",
      "middle-left",
      "middle-right",
      "bottom-left",
      "bottom-right",
    ],
  };

  return (
    <div className="relative h-full w-full">
      {positions[value].map(
        (position, index) => (
          <span
            key={index}
            className={`absolute h-4 w-4 rounded-full ${getPipPosition(
              position,
            )}`}
            style={{
              backgroundColor: "#000000",
            }}
          />
        ),
      )}
    </div>
  );
}

function getPipPosition(
  position: string,
) {
  switch (position) {
    case "top-left":
      return "left-2 top-2";

    case "top-right":
      return "right-2 top-2";

    case "middle-left":
      return "left-2 top-1/2 -translate-y-1/2";

    case "middle-right":
      return "right-2 top-1/2 -translate-y-1/2";

    case "center":
      return "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";

    case "bottom-left":
      return "bottom-2 left-2";

    case "bottom-right":
      return "bottom-2 right-2";

    default:
      return "";
  }
}

function Dice({
  value,
  rolling,
}: {
  value: number;
  rolling: boolean;
}) {
  return (
    <div
      className={`
        flex
        h-25
        w-25
        items-center
        justify-center
        rounded-2xl
        border-2
        border-black
        shadow-xl
        ${
          rolling
            ? "animate-dice-roll"
            : "animate-dice-land"
        }
      `}
      style={{
        backgroundColor: "#ffffff",
      }}
    >
      <div
        className="
          relative
          h-full
          w-full
          rounded-[inherit]
        "
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <DicePips value={value} />
      </div>
    </div>
  );
}

export default function DiceRollModal({
  results,
  title = "Test",
  sixCountsAsTwo = false,
  onComplete,
  rerollAbilities = [],
  onReroll,
}: DiceRollModalProps) {
  const [currentDie, setCurrentDie] =
    useState(0);

  const [finishedDice, setFinishedDice] =
    useState<number[]>([]);

  const [finished, setFinished] =
    useState(false);

  const [selectedReroll, setSelectedReroll] =
    useState<string | null>(null);
  const [previewAbilityId, setPreviewAbilityId] = useState<string | null>(null);

  const [usedRerolls, setUsedRerolls] =
    useState<Record<string, number>>({});
  const [usedRerollDice, setUsedRerollDice] =
    useState<Record<string, boolean>>({});

  const [displayValues, setDisplayValues] =
    useState<number[]>(() =>
      results.map(
        () =>
          Math.floor(
            Math.random() * 6,
          ) + 1,
      ),
    );
  const [settledResults, setSettledResults] = useState<number[]>(results);
  const [rerollingDice, setRerollingDice] = useState<number[]>([]);
  const previousResults = useRef(results);
  const hasInitializedRoll = useRef(false);

  /*
   * RESET DO LANÇAMENTO
   */

  useEffect(() => {
    if (!hasInitializedRoll.current) {
      hasInitializedRoll.current = true;
      previousResults.current = results;
      setSettledResults(results);
      setCurrentDie(0);
      setFinishedDice([]);
      setFinished(false);
      setDisplayValues(results.map(() => Math.floor(Math.random() * 6) + 1));
      return;
    }

    const changedIndices = results.flatMap((value, index) =>
      previousResults.current[index] !== value ? [index] : [],
    );
    previousResults.current = results;
    if (changedIndices.length === 0) return;

    // Animate only the die whose result changed. Keep the rest of the
    // completed roll stationary while this die spins to its new face.
    setRerollingDice((current) => [...new Set([...current, ...changedIndices])]);
    const interval = window.setInterval(() => {
      setDisplayValues((current) => current.map((value, index) =>
        changedIndices.includes(index) ? Math.floor(Math.random() * 6) + 1 : value,
      ));
    }, 100);
    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
      setDisplayValues((current) => current.map((value, index) =>
        changedIndices.includes(index) ? results[index] : value,
      ));
      setSettledResults((current) => current.map((value, index) =>
        changedIndices.includes(index) ? results[index] : value,
      ));
      setRerollingDice((current) => current.filter((index) => !changedIndices.includes(index)));
    }, 1800);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [results]);

  /*
   * LANÇAMENTO INDIVIDUAL
   *
   * Cada 120ms o dado recebe
   * um novo valor aleatório.
   *
   * Ao fim dos 1800ms recebe
   * obrigatoriamente o resultado real.
   */

  useEffect(() => {
    if (currentDie >= results.length) {
      setFinished(true);
      return;
    }

    const interval =
      window.setInterval(() => {
        setDisplayValues((current) => {
          const next = [...current];

          next[currentDie] =
            Math.floor(
              Math.random() * 6,
            ) + 1;

          return next;
        });
      }, 120);

    const timeout =
      window.setTimeout(() => {
        window.clearInterval(interval);

        /*
         * FIXAR O RESULTADO REAL
         */

        setDisplayValues((current) => {
          const next = [...current];

          next[currentDie] =
            results[currentDie];

          return next;
        });

        /*
         * MARCAR O DADO COMO TERMINADO
         */

        setFinishedDice((current) => [
          ...current,
          currentDie,
        ]);

        /*
         * PASSAR AO PRÓXIMO DADO
         */

        setCurrentDie(
          (current) => current + 1,
        );
      }, 1800);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [currentDie, results]);

  /*
   * 5 E 6 = SUCESSO
   */

  const successes = settledResults.reduce(
    (total, result) => total + (result >= 5 ? 1 : 0) + (result === 6 && sixCountsAsTwo ? 1 : 0),
    0,
  );

  const availableRerolls = rerollAbilities.filter(
    (ability) => (usedRerolls[ability.id] ?? 0) < ability.amount,
  );

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="w-[min(92vw,650px)] rounded-2xl border border-gray-700 bg-[#17191f] p-8 text-white shadow-2xl">

        {/* HEADER */}

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Eldritch Horror
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {title}
          </h2>
        </div>

        {/* DADOS */}

        <div className="mt-12 flex min-h-47.5 flex-wrap items-center justify-center gap-8">
          {results.map(
            (_result, index) => {
              /*
               * DADO AINDA NÃO LANÇADO
               */

              if (index > currentDie) {
                return (
                  <div
                    key={index}
                    className="flex h-25 w-25 items-center justify-center rounded-2xl border-2 border-dashed border-gray-700 text-4xl text-gray-700"
                  >
                    🎲
                  </div>
                );
              }

              /*
               * DADO ATUAL
               */

              const isCurrent = index === currentDie || rerollingDice.includes(index);

              /*
               * DADO JÁ TERMINADO
               */

              const isFinished =
                finishedDice.includes(index);

              return (
                <div
                  key={index}
                  className="flex flex-col items-center"
                >
                  <Dice
                    value={
                      displayValues[index]
                    }
                    rolling={isCurrent}
                  />

                  {/* RESULTADO DO DADO */}

                  {isFinished && (
                    <>
                      <div
                        className={`mt-4 text-xl font-bold ${
                          settledResults[index] >= 5
                            ? "text-green-400"
                            : "text-gray-500"
                        }`}
                      >
                        {settledResults[index] >= 5 ? "✓" : "—"}
                      </div>
                      {selectedReroll && onReroll && !rerollAbilities.some((ability) => ability.id === selectedReroll && ability.rerollEachDieOnce && usedRerollDice[`${ability.id}:${index}`]) && (
                        <button
                          type="button"
                          className="mt-2 rounded bg-slate-700 px-2 py-1 text-xs hover:bg-slate-600"
                          onClick={() => {
                            const ability = rerollAbilities.find((item) => item.id === selectedReroll);
                            if (!ability) return;
                            setUsedRerolls((used) => ({ ...used, [ability.id]: (used[ability.id] ?? 0) + 1 }));
                            if (ability.rerollEachDieOnce) setUsedRerollDice((used) => ({ ...used, [`${ability.id}:${index}`]: true }));
                            setSelectedReroll(null);
                            onReroll(index, ability.id);
                          }}
                        >
                          {rerollAbilities.find((item) => item.id === selectedReroll)?.resultModifier
                            ? `Add ${rerollAbilities.find((item) => item.id === selectedReroll)?.resultModifier} to die`
                            : "Reroll die"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            },
          )}
        </div>

        {/* ESTADO DO LANÇAMENTO */}

        {!finished && (
          <div className="mt-6 text-center">
            <p className="animate-pulse text-sm font-semibold uppercase tracking-widest text-gray-500">
              Rolling die{" "}
              {Math.min(
                currentDie + 1,
                results.length,
              )}{" "}
                of {results.length}...
            </p>
          </div>
        )}

        {/* RESULTADO FINAL */}

        {finished && (
          <div className="mt-6 text-center">
            {availableRerolls.length > 0 && onReroll && rerollingDice.length === 0 && (
              <div className="mb-4">
                <p className="mb-3 text-sm text-gray-400">You may use an ability on one die:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {availableRerolls.map((ability) => (
                    <button
                      key={ability.id}
                      type="button"
                      onClick={() => setPreviewAbilityId(ability.id)}
                      className={`group w-28 overflow-hidden rounded-lg border text-left transition ${selectedReroll === ability.id ? "border-amber-400 ring-2 ring-amber-500/40" : "border-slate-600 hover:border-slate-300"}`}
                      aria-label={`View ${ability.name}`}
                    >
                      {ability.image ? <img src={ability.image} alt={ability.name} className="h-24 w-full object-cover object-top" /> : <div className="flex h-24 items-center justify-center bg-slate-800 text-3xl">✦</div>}
                      <span className="block truncate px-2 py-1.5 text-xs font-semibold">{ability.name}</span>
                    </button>
                  ))}
                </div>
                {selectedReroll && <p className="mt-2 text-xs text-amber-300">Choose a die to reroll.</p>}
              </div>
            )}
            <p className="text-sm uppercase tracking-widest text-gray-500">
              Result
            </p>

            <p className="mt-2 text-4xl font-black text-white">
              {successes}
            </p>

            <p className="mt-1 font-semibold text-gray-400">
              {successes === 1
                ? "Success"
                : "Successes"}
            </p>

            {onComplete && (
              <button
                type="button"
                onClick={onComplete}
                className="mt-6 rounded-lg bg-red-700 px-8 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                Continue
              </button>
            )}
          </div>
        )}
      </div>
      {previewAbilityId && (() => {
        const ability = availableRerolls.find((item) => item.id === previewAbilityId);
        if (!ability) return null;
        return (
          <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/85 p-4" role="dialog" aria-modal="true" aria-label={`${ability.name} card`}>
            <div className="w-[min(92vw,520px)] rounded-2xl border border-slate-600 bg-[#17191f] p-5 text-white shadow-2xl">
              <h3 className="mb-4 text-center text-xl font-bold">{ability.name}</h3>
              {ability.image ? <img src={ability.image} alt={`${ability.name} card`} className="mx-auto max-h-[58vh] max-w-full rounded-lg object-contain" /> : null}
              <p className="mt-4 text-sm leading-relaxed text-gray-300">{ability.description}</p>
              {ability.sanityCost ? <p className="mt-2 text-sm text-amber-300">Cost: {ability.sanityCost} Sanity</p> : null}
              <div className="mt-5 flex justify-center gap-3">
                <button type="button" onClick={() => { setSelectedReroll(ability.id); setPreviewAbilityId(null); }} className="rounded-lg bg-amber-600 px-4 py-2 font-semibold hover:bg-amber-500">Use ability</button>
                <button type="button" onClick={() => { if (selectedReroll === ability.id) setSelectedReroll(null); setPreviewAbilityId(null); }} className="rounded-lg bg-slate-700 px-4 py-2 font-semibold hover:bg-slate-600">Do not use</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
