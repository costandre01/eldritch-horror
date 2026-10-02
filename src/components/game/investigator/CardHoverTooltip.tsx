interface CardHoverTooltipProps {
  title: string;
  subtitle?: string;
  text: string;
}

export default function CardHoverTooltip({
  title,
  subtitle,
  text,
}: CardHoverTooltipProps) {
  if (!text.trim()) {
    return null;
  }

  return (
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
        <div className="text-sm font-black text-white">
          {title}
        </div>

        {subtitle && (
          <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {subtitle}
          </div>
        )}

        <div className="mt-3 whitespace-pre-line text-xs font-medium leading-relaxed text-slate-200">
          {text}
        </div>
      </div>
    </div>
  );
}