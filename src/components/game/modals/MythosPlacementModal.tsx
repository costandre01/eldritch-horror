import { useEffect, useRef, useState } from "react";
import type { GameState } from "../../../game/models/GameState";
import type { PendingDecision } from "../../../game/models/PendingDecision";
import { CORE_MONSTERS } from "../../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../../content/core/coreEpicMonsters";
import { eldritchBaseMap } from "../../../content/core/maps/eldritchBaseMap";
import { eldritchMapPositions } from "../../../content/core/maps/eldritchMapPositions";
import EldritchMap from "../board/EldritchMap";

type PlacementDecision = Extract<PendingDecision, { spaceIds: string[]; nextIconIndex: number }>;

export default function MythosPlacementModal({ game, decision, onContinue }: {
  game: GameState;
  decision: PlacementDecision;
  onContinue: () => void;
}) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const triggerButton = useRef<HTMLButtonElement | null>(null);
  const monsterIds = new Set(decision.monsterIds ?? []);
  const clueIds = new Set(decision.type === "mythos-clues"
    ? decision.clueTokenIds ?? decision.spaceIds.map((id) => `clue-${id}`) : []);
  const gateIds = new Set(decision.gateTokenIds ?? []);
  const label = decision.type === "mythos-gates" ? "gate" : decision.type === "mythos-rumor" ? "rumor" : decision.type === "mythos-monsters" ? "monster" : "clue";
  const definitions = [...CORE_MONSTERS, ...CORE_EPIC_MONSTERS];
  const preview = previewId ? definitions.find((definition) => definition.id === game.monsters[previewId]?.definitionId) : undefined;
  const placements = [
    ...(decision.type === "mythos-monsters" ? [] : decision.spaceIds.map((spaceId, index) => ({
      id: `${label}-${index}`, spaceId, monsterId: null as string | null,
      name: `New ${label}`, image: label === "gate" ? "/icons/game/Gate-Token.png" : label === "rumor" ? "/icons/game/mystery-token.png" : "/icons/game/clue.png",
    }))),
    ...(decision.monsterIds ?? []).flatMap((id) => {
      const monster = game.monsters[id];
      const definition = definitions.find((entry) => entry.id === monster?.definitionId);
      return monster?.spaceId && definition ? [{ id, spaceId: monster.spaceId, monsterId: id, name: definition.name, image: definition.frontImage }] : [];
    }),
  ];

  useEffect(() => {
    const timer = window.setTimeout(() => setAnimationComplete(true), 850 + Math.max(0, placements.length - 1) * 320);
    return () => window.clearTimeout(timer);
  }, [placements.length]);

  useEffect(() => {
    if (!previewId) return;
    closeButton.current?.focus();
    return () => triggerButton.current?.focus();
  }, [previewId]);

  const mapDisplayGame: GameState = {
    ...game,
    monsters: Object.fromEntries(Object.entries(game.monsters).filter(([id]) => !monsterIds.has(id))),
    board: {
      ...game.board,
      spaces: Object.fromEntries(Object.entries(game.board.spaces).map(([spaceId, space]) => {
        const visibleClues = space.clueTokenIds.filter((id) => !clueIds.has(id));
        return [spaceId, {
          ...space,
          clueTokenIds: visibleClues,
          clues: Math.max(0, space.clues - (space.clueTokenIds.length - visibleClues.length)),
          monsterIds: space.monsterIds.filter((id) => !monsterIds.has(id)),
          gates: space.gates.filter((gate) => !gateIds.has(gate.id)),
          rumor: decision.type === "mythos-rumor" && decision.spaceIds.includes(spaceId) ? false : space.rumor,
        }];
      })),
    },
  };
  const names = decision.spaceNames ?? decision.spaceIds.map((id) => eldritchBaseMap.spaces.find((space) => space.id === id)?.name ?? id);

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm">
      <section inert={!!preview} className="mx-auto my-auto flex max-h-[calc(100dvh-24px)] w-[min(94vw,1200px)] flex-col items-center overflow-y-auto rounded-3xl border border-gray-700 bg-[#172033] p-5 text-white shadow-2xl sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">MYTHOS PHASE</p>
        <h2 className="mt-2 text-3xl font-black">{decision.title}</h2>
        <p className="mt-2 text-center text-gray-300">{decision.message}</p>
        <div className="relative mt-5 aspect-3/2 w-full max-w-[1000px] overflow-hidden rounded-xl border-2 border-slate-600 bg-black shadow-2xl">
          <div inert className="pointer-events-none">
            <EldritchMap game={mapDisplayGame} investigators={game.investigators} doom={game.ancientOne.doom} omenPosition={game.ancientOne.omenPosition} assetReserve={game.board.assetReserve} />
          </div>
          {placements.map((placement, index) => {
            const position = eldritchMapPositions[placement.spaceId];
            if (!position) return null;
            const offset = placements.slice(0, index).filter((entry) => entry.spaceId === placement.spaceId).length;
            const marker = <>
              <span className="pointer-events-none absolute -inset-[28%] rounded-full border-[3px] border-yellow-300 shadow-[0_0_16px_rgba(250,204,21,0.95)]" />
              <img src={placement.image} alt={placement.name} className="relative h-full w-full rounded-full border-2 border-yellow-200 bg-amber-400 p-[2px] object-contain" />
              <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 rounded bg-yellow-300 px-1.5 py-0.5 text-[9px] font-black text-slate-950">NEW</span>
            </>;
            const style = { left: `${position.x + offset * 4.5}%`, top: `${position.y}%`, animation: `mythosPlacementDrop 700ms cubic-bezier(.2,.8,.3,1) ${index * 320}ms both` };
            const className = "absolute z-120 h-[5.5%] w-[3.8%] -translate-x-1/2 -translate-y-1/2";
            return placement.monsterId ? (
              <button key={placement.id} type="button" aria-label={`View ${placement.name}`} className={`${className} cursor-pointer rounded-full focus-visible:outline-4 focus-visible:outline-white`} style={style}
                onClick={(event) => { triggerButton.current = event.currentTarget; setFlipped(false); setPreviewId(placement.monsterId); }}>
                {marker}
              </button>
            ) : <div key={placement.id} className={`${className} pointer-events-none`} style={style}>{marker}</div>;
          })}
        </div>
        <p className="mt-4 text-center text-sm font-semibold text-slate-400">{`${decision.spaceIds.length} ${label}${decision.spaceIds.length === 1 ? "" : "s"} placed on the map`}</p>
        <p className="mt-1 text-center text-sm font-bold text-yellow-200">{names.join(", ")}</p>
        {monsterIds.size > 0 && <p className="mt-2 text-sm text-gray-300">Click a new Monster to view its card.</p>}
        <button type="button" onClick={onContinue} disabled={!animationComplete} className="mt-4 rounded-xl bg-blue-600 px-10 py-3 text-lg font-black text-white hover:bg-blue-500 disabled:cursor-wait disabled:opacity-50">CONTINUE</button>
      </section>
      {preview && (
        <div role="dialog" aria-modal="true" aria-label={`${preview.name} card`} className="fixed inset-0 z-10000 flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewId(null)} onKeyDown={(event) => {
          if (event.key === "Escape") { event.stopPropagation(); setPreviewId(null); }
          if (event.key === "Tab") {
            const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
            const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
            event.preventDefault();
            buttons[(current + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length]?.focus();
          }
        }}>
          <div className="flex max-h-[95dvh] flex-col items-center gap-4 rounded-2xl border border-slate-600 bg-slate-900 p-5 text-white" onClick={(event) => event.stopPropagation()}>
            <h3 className="text-xl font-black">{preview.name}</h3>
            <img src={flipped ? preview.backImage : preview.frontImage} alt={`${preview.name} ${flipped ? "back" : "front"}`} className="max-h-[70dvh] max-w-[85vw] object-contain" />
            <div className="flex gap-3">
              <button type="button" onClick={() => setFlipped(!flipped)} className="rounded-lg bg-blue-600 px-5 py-2 font-bold">Flip</button>
              <button ref={closeButton} type="button" onClick={() => setPreviewId(null)} className="rounded-lg bg-slate-700 px-5 py-2 font-bold">Close</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes mythosPlacementDrop { from { opacity: 0; transform: translate(-50%, -220%) scale(.55); } 70% { opacity: 1; transform: translate(-50%, 12%) scale(1.12); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }`}</style>
    </div>
  );
}
