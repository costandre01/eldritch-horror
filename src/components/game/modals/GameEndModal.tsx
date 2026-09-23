import type { GameState } from "../../../game/models/GameState";

interface GameEndModalProps {
  game: GameState;
  onExit: () => void;
}

export default function GameEndModal({
  game,
  onExit,
}: GameEndModalProps) {
  const victory =
    game.status === "victory";

  const defeat =
    game.status === "defeat";

  if (!victory && !defeat) {
    return null;
  }

  const ancientOneName =
    game.ancientOne.name;

  return (
    <>
      <style>
        {`
          @keyframes endModalFadeIn {
            from {
              opacity: 0;
              transform: scale(0.94);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes bloodDrip {
            0%, 100% {
              transform: scaleY(1);
              opacity: 0.8;
            }
            50% {
              transform: scaleY(1.35);
              opacity: 1;
            }
          }

          @keyframes victoryGlow {
            0%, 100% {
              text-shadow:
                0 0 10px rgba(250, 204, 21, 0.25);
            }
            50% {
              text-shadow:
                0 0 30px rgba(250, 204, 21, 0.7);
            }
          }
        `}
      </style>

      <div
        className="
          fixed
          inset-0
          z-10000
          flex
          items-center
          justify-center
          bg-black/90
          p-6
          backdrop-blur-md
        "
      >
        <div
          className="
            relative
            w-[min(92vw,800px)]
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-[#0b0d12]
            px-6
            py-12
            text-center
            shadow-[0_0_80px_rgba(0,0,0,0.9)]
            sm:px-12
            sm:py-16
          "
          style={{
            animation:
              "endModalFadeIn 0.5s ease-out",
          }}
        >
          {/* Background atmosphere */}

          <div
            className={`
              pointer-events-none
              absolute
              inset-0
              ${
                victory
                  ? "bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.12),transparent_65%)]"
                  : "bg-[radial-gradient(circle_at_center,rgba(127,29,29,0.18),transparent_65%)]"
              }
            `}
          />

          <div className="relative z-10">

            {/* STATUS */}

            <p
              className={`
                text-sm
                font-black
                uppercase
                tracking-[0.5em]
                ${
                  victory
                    ? "text-yellow-400"
                    : "text-red-600"
                }
              `}
            >
              {victory
                ? "The World Survives"
                : "The World Is Doomed"}
            </p>

            {/* MAIN TITLE */}

            <div className="relative mt-6">

              <h1
                className={`
                  text-5xl
                  font-black
                  uppercase
                  leading-none
                  sm:text-7xl
                  ${
                    victory
                      ? "text-yellow-300"
                      : "text-red-700"
                  }
                `}
                style={{
                  ...(victory
                    ? {
                        animation:
                          "victoryGlow 2s ease-in-out infinite",
                      }
                    : {
                        textShadow:
                          "0 4px 0 #450a0a, 0 8px 18px rgba(127,29,29,0.8)",
                      }),
                }}
              >
                {victory
                  ? "VICTORY"
                  : "DEFEAT"}
              </h1>

              {/* Blood drops */}

              {defeat && (
                <div
                  className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-full
                    flex
                    -translate-x-1/2
                    gap-8
                  "
                >
                  <span
                    className="
                      h-8
                      w-2
                      rounded-b-full
                      bg-red-800
                    "
                    style={{
                      animation:
                        "bloodDrip 1.8s ease-in-out infinite",
                    }}
                  />

                  <span
                    className="
                      mt-2
                      h-5
                      w-1.5
                      rounded-b-full
                      bg-red-700
                    "
                    style={{
                      animation:
                        "bloodDrip 2.2s ease-in-out infinite",
                    }}
                  />

                  <span
                    className="
                      h-11
                      w-2.5
                      rounded-b-full
                      bg-red-900
                    "
                    style={{
                      animation:
                        "bloodDrip 2s ease-in-out infinite",
                    }}
                  />
                </div>
              )}
            </div>

            {/* ANCIENT ONE */}

            <p
              className="
                mt-12
                text-xl
                font-black
                uppercase
                tracking-[0.2em]
                text-white
                sm:text-3xl
              "
            >
              {ancientOneName}
            </p>

            {/* MESSAGE */}

            <p
              className="
                mx-auto
                mt-6
                max-w-2xl
                text-base
                leading-relaxed
                text-slate-300
                sm:text-xl
              "
            >
              {victory
                ? `You defeated ${ancientOneName}. The world is safe to prosper.`
                : `You failed to defeat ${ancientOneName}. The world falls into darkness.`}
            </p>

            {/* BUTTON */}

            <button
              type="button"
              onClick={onExit}
              className={`
                mt-10
                rounded-xl
                px-10
                py-4
                text-sm
                font-black
                uppercase
                tracking-widest
                transition
                ${
                  victory
                    ? "bg-yellow-500 text-black hover:bg-yellow-400"
                    : "bg-red-800 text-white hover:bg-red-700"
                }
              `}
            >
              Return to Menu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}