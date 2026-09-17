import { useEffect, useState } from "react";

interface DiceRollModalProps {
  results: number[];
  title?: string;
  onComplete?: () => void;
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
  title = "Teste",
  onComplete,
}: DiceRollModalProps) {
  const [currentDie, setCurrentDie] =
    useState(0);

  const [finishedDice, setFinishedDice] =
    useState<number[]>([]);

  const [finished, setFinished] =
    useState(false);

  const [displayValues, setDisplayValues] =
    useState<number[]>(() =>
      results.map(
        () =>
          Math.floor(
            Math.random() * 6,
          ) + 1,
      ),
    );

  /*
   * RESET DO LANÇAMENTO
   */

  useEffect(() => {
    setCurrentDie(0);
    setFinishedDice([]);
    setFinished(false);

    setDisplayValues(
      results.map(
        () =>
          Math.floor(
            Math.random() * 6,
          ) + 1,
      ),
    );
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

  const successes = results.filter(
    (result) => result >= 5,
  ).length;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 backdrop-blur-sm">
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
            (result, index) => {
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

              const isCurrent =
                index === currentDie;

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
                    <div
                      className={`mt-4 text-xl font-bold ${
                        result >= 5
                          ? "text-green-400"
                          : "text-gray-500"
                      }`}
                    >
                      {result >= 5
                        ? "✓"
                        : "—"}
                    </div>
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
              A lançar dado{" "}
              {Math.min(
                currentDie + 1,
                results.length,
              )}{" "}
              de {results.length}...
            </p>
          </div>
        )}

        {/* RESULTADO FINAL */}

        {finished && (
          <div className="mt-6 text-center">
            <p className="text-sm uppercase tracking-widest text-gray-500">
              Resultado
            </p>

            <p className="mt-2 text-4xl font-black text-white">
              {successes}
            </p>

            <p className="mt-1 font-semibold text-gray-400">
              {successes === 1
                ? "Sucesso"
                : "Sucessos"}
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
    </div>
  );
}