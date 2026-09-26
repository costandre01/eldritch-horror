import type { GameState } from "../../../game/models/GameState";

import EldritchMap from "./EldritchMap";

interface GameBoardProps {
  game: GameState;

  travelDestinationIds: string[];

  byakheeDestinationIds: string[];

  mysteryDestinationIds: string[];

  pendingSpaceSelectionIds?: string[];

  onSelectSpace: (
    spaceId: string,
  ) => void;

  onSelectByakheeSpace: (spaceId: string) => void;

  onInspectSpace: (
    spaceId: string,
  ) => void;

  doom: number;
}

export default function GameBoard({
  game,
  travelDestinationIds,
  byakheeDestinationIds,
  mysteryDestinationIds,
  pendingSpaceSelectionIds,
  onSelectSpace,
  onSelectByakheeSpace,
  onInspectSpace,
  doom,
}: GameBoardProps) {
  return (
    <section className="w-full min-w-0">
      <EldritchMap
        game={game}
        investigators={game.investigators}
        travelDestinationIds={
          travelDestinationIds
        }
        byakheeDestinationIds={
          byakheeDestinationIds
        }
        mysteryDestinationIds={
          mysteryDestinationIds
        }
        pendingSpaceSelectionIds={
          pendingSpaceSelectionIds
        }
        onSelectSpace={
          onSelectSpace
        }
        onSelectByakheeSpace={
          onSelectByakheeSpace
        }
        onInspectSpace={
          onInspectSpace
        }
        doom={doom}
        omenPosition={
          game.ancientOne.omenPosition
        }
        assetReserve={
          game.board.assetReserve
        }
      />
    </section>
  );
}