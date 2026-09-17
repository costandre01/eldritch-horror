import type { ReactNode } from "react";

import GameIcon, {
  type GameIconName,
} from "./GameIcon";

interface GameTextProps {
  children: string;
  className?: string;
}

const VALID_ICONS = new Set<GameIconName>([
  "focus",
  "wilderness",
  "health",
  "clue",
  "observation",
  "reckoning",
  "ship-path",
  "eldritch-token",
  "doom",
  "resource",
  "sanity",
  "strength",
  "blue-omen",
  "influence",
  "sea",
  "will",
  "lore",
]);

const TOKEN_REGEX = /\[([a-z0-9-]+)\]/gi;

/*
 * ============================================================
 * RENDER TEXT WITH ICONS
 * ============================================================
 */

function renderText(text: string): ReactNode[] {
  const parts = text.split(TOKEN_REGEX);

  const result: ReactNode[] = [];

  parts.forEach((part, index) => {
    if (!part) {
      return;
    }

    /*
     * Odd indexes are the contents
     * captured by [ ... ].
     */

    if (index % 2 === 1) {
      const iconName =
        part.toLowerCase() as GameIconName;

      if (VALID_ICONS.has(iconName)) {
        result.push(
          <GameIcon
            key={`${iconName}-${index}`}
            name={iconName}
            size={19}
          />,
        );

        return;
      }
    }

    result.push(
      <span key={`text-${index}`}>
        {part}
      </span>,
    );
  });

  return result;
}

/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */

export default function GameText({
  children,
  className = "",
}: GameTextProps) {
  /*
   * Every paragraph separated by \n\n
   * becomes its own bullet point.
   *
   * Even a single paragraph gets a bullet.
   */

  const paragraphs = children
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <span className={className}>
      {paragraphs.map(
        (paragraph, index) => (
          <span
            key={`paragraph-${index}`}
            className="flex items-start gap-3"
          >
            {/* Bullet */}
            <span
              className="shrink-0"
              aria-hidden="true"
            >
              •
            </span>

            {/* Text + icons */}
            <span className="min-w-0">
              {renderText(paragraph)}
            </span>
          </span>
        ),
      )}
    </span>
  );
}