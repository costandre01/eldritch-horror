import type { ReactNode } from "react";

type CardKind = "asset" | "artifact" | "spell" | "condition";

interface InvestigatorCardThumbnailProps {
  image: string;
  name: string;
  kind: CardKind;
  onClick: () => void;
  badge?: ReactNode;
  onImageError?: () => void;
}

const kindStyles: Record<CardKind, string> = {
  asset: "border-blue-500/50 text-blue-200 hover:border-blue-400",
  artifact: "border-amber-500/50 text-amber-200 hover:border-amber-400",
  spell: "border-purple-500/50 text-purple-200 hover:border-purple-400",
  condition: "border-red-500/50 text-red-200 hover:border-red-400",
};

export default function InvestigatorCardThumbnail({
  image,
  name,
  kind,
  onClick,
  badge,
  onImageError,
}: InvestigatorCardThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={`Click to view ${name}`}
      className={`group relative h-24 w-40 shrink-0 overflow-hidden rounded-lg border bg-gray-950 text-left shadow transition hover:-translate-y-0.5 hover:shadow-lg ${kindStyles[kind]}`}
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover object-top transition duration-200 group-hover:scale-105"
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
  );
}
