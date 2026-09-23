import type { CSSProperties } from "react";

export type GameIconName =
  | "wilderness"
  | "health"
  | "clue"
  | "observation"
  | "reckoning"
  | "ship-path"
  | "eldritch-token"
  | "doom"
  | "resource"
  | "sanity"
  | "strength"
  | "blue-omen"
  | "influence"
  | "sea"
  | "will"
  | "lore";

const ICON_LABELS: Record<GameIconName, string> = {
  wilderness: "Wilderness",
  health: "Health",
  clue: "Clue",
  observation: "Observation",
  reckoning: "Reckoning",
  "ship-path": "Ship Path",
  "eldritch-token": "Eldritch Token",
  doom: "Doom",
  resource: "Resource",
  sanity: "Sanity",
  strength: "Strength",
  "blue-omen": "Blue Omen",
  influence: "Influence",
  sea: "Sea",
  will: "Will",
  lore: "Lore",
};

interface GameIconProps {
  name: GameIconName;
  size?: number;
  className?: string;
  title?: string;
}

export default function GameIcon({
  name,
  size = 18,
  className = "",
  title,
}: GameIconProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
  };

  return (
    <img
      src={`/icons/game/${name}.png`}
      alt={ICON_LABELS[name]}
      title={title ?? ICON_LABELS[name]}
      style={style}
      className={`inline-block shrink-0 object-contain align-[-0.2em] ${className}`}
    />
  );
}