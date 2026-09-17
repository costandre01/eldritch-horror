import type { GameState } from "../../../game/models/GameState";

import EldritchMap from "./EldritchMap";

interface GameBoardProps {
  game: GameState;

  travelDestinationIds: string[];

  byakheeDestinationIds: string[];

  mysteryDestinationIds: string[];

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
  onSelectSpace,
  onSelectByakheeSpace,
  onInspectSpace,
  doom,
}: GameBoardProps) {
  const investigators =
    Object.values(game.investigators);

  const leftInvestigators =
    investigators.slice(0, 4);

  const rightInvestigators =
    investigators.slice(4, 8);

  return (
    <section className="min-w-0">

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">

        {/* ================================================== */}
        {/* LEFT INVESTIGATORS */}
        {/* ================================================== */}

        <div className="grid grid-cols-2 gap-3">
          {leftInvestigators.map(
            (investigator) => (
              <div key={investigator.id}>
                {/* CARTA DO INVESTIGADOR */}
              </div>
            ),
          )}
        </div>


        {/* ================================================== */}
        {/* MAP */}
        {/* ================================================== */}

        <div className="min-w-0">
          <EldritchMap
            game={game}
            investigators={
              game.investigators
            }
            travelDestinationIds={
              travelDestinationIds
            }
            byakheeDestinationIds={
              byakheeDestinationIds
            }
            mysteryDestinationIds={
              mysteryDestinationIds
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
        </div>


        {/* ================================================== */}
        {/* RIGHT INVESTIGATORS */}
        {/* ================================================== */}

        <div className="grid grid-cols-2 gap-3">
          {rightInvestigators.map(
            (investigator) => (
              <div key={investigator.id}>
                {/* CARTA DO INVESTIGADOR */}
              </div>
            ),
          )}
        </div>

      </div>

    </section>
  );
}