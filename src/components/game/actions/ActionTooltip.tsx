import type { ReactNode } from "react";

interface ActionTooltipProps {
  title: string;
  description: ReactNode;
  children: ReactNode;
}

export default function ActionTooltip({
  title,
  description,
  children,
}: ActionTooltipProps) {
  return (
    <div className="group relative flex">
      {children}

      {/* ================================================== */}
      {/* TOOLTIP */}
      {/* ================================================== */}

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
          translate-y-2
          rounded-2xl
          border
          border-gray-700
          bg-[#15171d]
          px-5
          py-4
          text-center
          opacity-0
          shadow-2xl
          transition-all
          duration-150
          group-hover:pointer-events-auto
          group-hover:translate-y-0
          group-hover:opacity-100
        "
      >
        {/* ================================================== */}
        {/* TITLE */}
        {/* ================================================== */}

        <div className="text-lg font-black text-white">
          {title}
        </div>

        {/* ================================================== */}
        {/* DESCRIPTION */}
        {/* ================================================== */}

        <div className="mt-3 text-sm leading-6 text-gray-300">
          {description}
        </div>

        {/* ================================================== */}
        {/* ARROW */}
        {/* ================================================== */}

        <div
          className="
            absolute
            left-1/2
            top-full
            h-0
            w-0
            -translate-x-1/2
            border-l-8
            border-r-8
            border-t-8
            border-l-transparent
            border-r-transparent
            border-t-[#15171d]
          "
        />
      </div>
    </div>
  );
}