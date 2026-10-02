import type { ReactNode } from "react";

import GameText from "../../common/GameText";

type CardKind =
  | "asset"
  | "artifact"
  | "spell"
  | "condition";

interface InvestigatorCardThumbnailProps {
  image: string;
  name: string;
  kind: CardKind;
  onClick: () => void;
  badge?: ReactNode;
  tooltipText?: string;
  onImageError?: () => void;
}

export default function InvestigatorCardThumbnail({
  image,
  name,
  kind,
  onClick,
  badge,
  tooltipText,
  onImageError,
}: InvestigatorCardThumbnailProps) {
  const kindStyles: Record<CardKind, string> = {
    asset:
      "border-blue-500/70 hover:border-blue-400",
    artifact:
      "border-amber-500/70 hover:border-amber-400",
    spell:
      "border-purple-500/70 hover:border-purple-400",
    condition:
      "border-red-500/70 hover:border-red-400",
  };

  return (
    <div className="group relative shrink-0">
      {/* ================================================== */}
      {/* CARD */}
      {/* ================================================== */}

      <button
        type="button"
        onClick={onClick}
        title={`Click to view ${name}`}
        className={`
          relative
          h-24
          w-40
          overflow-hidden
          rounded-lg
          border
          bg-gray-950
          text-left
          shadow
          transition
          hover:-translate-y-0.5
          hover:shadow-lg
          ${kindStyles[kind]}
        `}
      >
        <img
          src={image}
          alt={name}
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-top
            transition
            duration-200
            group-hover:scale-105
          "
          onError={onImageError}
        />

        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/20 to-transparent" />

        {badge && (
          <span className="absolute right-1.5 top-1.5 rounded bg-gray-950/85 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gray-200">
            {badge}
          </span>
        )}

        <span className="absolute inset-x-0 bottom-0 truncate px-2 py-1.5 text-xs font-bold text-white">
          {name}
        </span>
      </button>

      {/* ================================================== */}
      {/* HOVER TOOLTIP */}
      {/* ================================================== */}

      {tooltipText && (
        <div
          className="
            pointer-events-none
            absolute
            bottom-full
            left-1/2
            z-50
            mb-3
            w-72
            -translate-x-1/2
            rounded-2xl
            border
            border-slate-700
            bg-[#15171c]
            p-4
            opacity-0
            shadow-2xl
            transition-opacity
            duration-150
            group-hover:opacity-100
          "
        >
          {/* ARROW */}

          <div
            className="
              absolute
              -bottom-2
              left-1/2
              h-4
              w-4
              -translate-x-1/2
              rotate-45
              border-b
              border-r
              border-slate-700
              bg-[#15171c]
            "
          />

          <div className="relative">
            {/* NAME */}

            <div className="text-sm font-black text-white">
              {name}
            </div>

            {/* TYPE */}

            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {kind}
            </div>

            {/* TEXT */}

            <GameText
              className="
                mt-3
                flex
                flex-col
                gap-2
                text-xs
                font-medium
                leading-relaxed
                text-slate-200
              "
            >
              {tooltipText}
            </GameText>
          </div>
        </div>
      )}
    </div>
  );
}