import { useEffect, useState } from "react";

import type { Investigator } from "../../../game/models/Investigator";
import { eldritchMapPositions } from "../../../content/core/maps/eldritchMapPositions";
import type { Asset } from "../../../game/models/Asset";
import { CORE_MONSTERS } from "../../../content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "../../../content/core/coreEpicMonsters";
import type { GameState } from "../../../game/models/GameState";
import { coreInvestigators } from "../../../content/core/investigators";

interface EldritchMapProps {
  game: GameState;
  investigators?: Record<string, Investigator>;
  travelDestinationIds?: string[];
  byakheeDestinationIds?: string[];
  mysteryDestinationIds?: string[];
  pendingSpaceSelectionIds?: string[];
  onSelectByakheeSpace?: (spaceId: string) => void;
  onSelectSpace?: (spaceId: string) => void;
  onInspectSpace?: (spaceId: string) => void;
  doom?: number;
  omenPosition?: number;
  assetReserve?: Asset[];
}

const DEBUG_MAP_HITBOXES = false;

const ZOOM_SIZE = 384;
const ZOOM_GAP = 8;

const DOOM_MIN = 0;
const DOOM_MAX = 20;

const DOOM_STEP_DELAY = 120;

/*
 * ==================================================
 * ASSET RESERVE POSITIONS
 * ==================================================
 *
 * Os quatro espaços físicos da zona RESERVE
 * impressa no tabuleiro.
 */

const BANK_LOAN_POSITION = {
  left: 3.55,
  top: 93.1,
  width: 6.6,
  height: 13.4,
};

const ASSET_RESERVE_POSITIONS = [
  {
    left: 10.75,
    top: 93.1,
    width: 6.6,
    height: 13.4,
  },
  {
    left: 17.87,
    top: 93.1,
    width: 6.6,
    height: 13.4,
  },
  {
    left: 25.0,
    top: 93.1,
    width: 6.6,
    height: 13.4,
  },
  {
    left: 32.13,
    top: 93.1,
    width: 6.6,
    height: 13.4,
  },
];

/*
 * ==================================================
 * DOOM TRACK POSITIONS
 * ==================================================
 *
 * Posições reais de cada número no tabuleiro.
 *
 * Não existe uma distância perfeitamente regular
 * entre todos os números, por isso usamos valores
 * individuais.
 */

const DOOM_POSITIONS: Record<number, number> = {
  20: 3.1,
  19: 7.6,
  18: 11.1,
  17: 15.5,
  16: 19.5,
  15: 23.8,

  14: 28,
  13: 32.2,
  12: 36.6,
  11: 40.6,
  10: 44.9,
  9: 49.1,

  8: 53.3,
  7: 57.7,
  6: 61.8,
  5: 66,
  4: 70.2,
  3: 74.5,

  2: 78.8,
  1: 82.8,
  0: 86.8,
};

export default function EldritchMap({
  game,
  investigators = {},
  travelDestinationIds = [],
  byakheeDestinationIds = [],
  mysteryDestinationIds = [],
  pendingSpaceSelectionIds = [],
  onSelectSpace,
  onSelectByakheeSpace,
  onInspectSpace,
  doom = 20,
  omenPosition = 0,
  assetReserve = [],
}: EldritchMapProps) {
  const [isHoveringMap, setIsHoveringMap] =
    useState(false);

  const [isAssetReserveOpen, setIsAssetReserveOpen] =
    useState(false);

  const [selectedReserveAsset, setSelectedReserveAsset] =
    useState<Asset | null>(null);

  const [isBankLoanSelected, setIsBankLoanSelected] =
    useState(false);

  const [mousePosition, setMousePosition] =
    useState({
      /*
       * Posição do rato NO MAPA.
       *
       * Usada apenas para calcular
       * o conteúdo que aparece ampliado.
       */
      mapX: 0,
      mapY: 0,

      mapWidth: 0,
      mapHeight: 0,

      /*
       * Posição do rato NO ECRÃ.
       *
       * Usada exclusivamente para
       * posicionar a lupa.
       */
      screenX: 0,
      screenY: 0,
    });

  /*
   * ==================================================
   * DOOM
   * ==================================================
   *
   * O valor real vem do jogo.
   *
   * Exemplo:
   *
   * Ancient One começa com Doom 15.
   *
   * O marcador começa visualmente em 20 e faz:
   *
   * 20 -> 19 -> 18 -> 17 -> 16 -> 15
   *
   * Depois, se o Doom passar para 14:
   *
   * 15 -> 14
   */

  const clampedDoom = Math.max(
    DOOM_MIN,
    Math.min(DOOM_MAX, doom),
  );

  /*
   * O marcador visual começa SEMPRE no 20.
   */

  const [displayDoom, setDisplayDoom] =
    useState(DOOM_MAX);

  /*
   * ==================================================
   * DOOM MOVEMENT
   * ==================================================
   *
   * Move apenas uma casa de cada vez.
   */

  useEffect(() => {
    if (displayDoom === clampedDoom) {
      return;
    }

    const direction =
      clampedDoom > displayDoom
        ? 1
        : -1;

    const timer = window.setTimeout(() => {
      setDisplayDoom(
        displayDoom + direction,
      );
    }, DOOM_STEP_DELAY);

  
  return () => {
      window.clearTimeout(timer);
    };
  }, [clampedDoom, displayDoom]);

  /*
   * ==================================================
   * DOOM TRACK POSITION
   * ==================================================
   *
   * Usa a posição específica de cada número.
   */

  const doomTrackPosition =
    DOOM_POSITIONS[displayDoom];

  const omenTrackPositions = [
    {
      left: 93.8,
      top: 4.8,
    },
    {
      left: 97.3,
      top: 7.8,
    },
    {
      left: 95.3,
      top: 13,
    },
    {
      left: 91.9,
      top: 10.1,
    },
  ];

  const omenTrackPosition =
    omenTrackPositions[
      ((omenPosition % 4) + 4) % 4
    ];


  /*
   * ==================================================
   * MOUSE MOVE
   * ==================================================
   */

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    /*
     * ==================================================
     * MAP RECT
     * ==================================================
     */

    const rect =
      event.currentTarget.getBoundingClientRect();

    /*
     * ==================================================
     * POSIÇÃO DO RATO DENTRO DO MAPA
     * ==================================================
     *
     * Esta posição NÃO serve para colocar
     * a lupa.
     *
     * Serve apenas para saber que parte
     * do mapa deve ser ampliada.
     */

    const mapX =
      event.clientX - rect.left;

    const mapY =
      event.clientY - rect.top;

    /*
     * ==================================================
     * POSIÇÃO DO RATO NO ECRÃ
     * ==================================================
     *
     * clientX/clientY são coordenadas da janela.
     *
     * A lupa usa estas coordenadas diretamente.
     */

    setMousePosition({
      mapX,
      mapY,

      mapWidth: rect.width,
      mapHeight: rect.height,

      screenX: event.clientX,
      screenY: event.clientY,
    });
  };

  /*
   * ==================================================
   * POSIÇÃO DA LUPA
   * ==================================================
   *
   * A posição depende APENAS do rato.
   *
   * A lupa fica a SUDOESTE do rato.
   */

  const zoomLeft = Math.max(
    4,
    mousePosition.screenX -
      ZOOM_SIZE -
      ZOOM_GAP,
  );

  const zoomTop = Math.min(
    window.innerHeight -
      ZOOM_SIZE -
      4,
    mousePosition.screenY +
      ZOOM_GAP,
  );

  /*
   * ==================================================
   * SPACE CONTENTS
   * ==================================================
   *
   * Todos os elementos que pertencem ao mesmo espaço
   * são desenhados num único "cluster".
   *
   * Isto evita que investigadores, monstros, gates,
   * clues e tokens fiquem exatamente uns por cima dos
   * outros.
   *
   * Em espaços pequenos o cluster pode sair ligeiramente
   * para fora da área impressa do espaço. A hitbox do
   * espaço continua a ser a original, por isso isto não
   * altera a lógica de cliques/movimento.
   */
  const getSpaceClusterSize = (position: {
    hitboxWidth: number;
    hitboxHeight: number;
  }) => {
    const width = Math.min(
      20,
      Math.max(8, position.hitboxWidth * 1.8),
    );

    const height = Math.min(
      18,
      Math.max(7, position.hitboxHeight * 2),
    );

    return {
      width,
      height,
    };
  };

  const renderCountBadge = (
    count: number,
    className = "",
  ) => {
    if (count <= 1) {
      return null;
    }

    return (
      <span
        className={`
          absolute
          -right-1
          -top-1
          z-20
          flex
          min-h-4
          min-w-4
          items-center
          justify-center
          rounded-full
          border
          border-white/80
          bg-black/90
          px-1
          text-[9px]
          font-black
          leading-none
          text-white
          shadow-[0_1px_4px_rgba(0,0,0,0.9)]
          ${className}
        `}
      >
        {count}
      </span>
    );
  };

  const renderSpaceContents = (
    spaceId: string,
    position: {
      x: number;
      y: number;
      hitboxWidth: number;
      hitboxHeight: number;
    },
  ) => {
    const boardSpace = game.board.spaces[spaceId];

    const investigatorsAtSpace = Object.values(
      investigators,
    ).filter(
      (investigator) =>
        investigator.spaceId === spaceId,
    );

    const monstersAtSpace = Object.values(
      game?.monsters ?? {},
    ).filter(
      (monster) =>
        monster.spaceId === spaceId,
    );

    const gatesAtSpace = boardSpace?.gates ?? [];

    const clueCount =
      boardSpace?.clueTokenIds?.length ?? 0;

    const eldritchTokenCount =
      boardSpace?.eldritchTokenCount ?? 0;

    const hasRumor = Boolean(boardSpace?.rumor);

    const mysteryTokenCount = Object.values(
      game.mysteries.progress,
    ).filter(
      (progress) =>
        progress.mysteryTokenSpaceId === spaceId,
    ).length;

    const hasExpedition =
      game.board.activeExpeditionSpaceId ===
      spaceId;

    const hasAnyContent =
      investigatorsAtSpace.length > 0 ||
      monstersAtSpace.length > 0 ||
      gatesAtSpace.length > 0 ||
      clueCount > 0 ||
      eldritchTokenCount > 0 ||
      hasRumor ||
      mysteryTokenCount > 0 ||
      hasExpedition;

    if (!hasAnyContent) {
      return null;
    }

    const clusterSize =
      getSpaceClusterSize(position);

    /*
     * Investigadores e monstros são tratados como peças
     * individuais. Para um espaço extremamente cheio,
     * mantemos sempre as primeiras peças visíveis e
     * indicamos quantas ficaram fora do cluster.
     */
    const MAX_VISIBLE_MONSTERS = 6;

    const visibleMonsters =
      monstersAtSpace.slice(
        0,
        MAX_VISIBLE_MONSTERS,
      );

    const hiddenMonsterCount = Math.max(
      0,
      monstersAtSpace.length -
        visibleMonsters.length,
    );

    const monsterDefinitions = [
      ...CORE_MONSTERS,
      ...CORE_EPIC_MONSTERS,
    ];

    return (
      <div
        key={`contents-${spaceId}`}
        className="
          pointer-events-none
          absolute
          z-110
          -translate-x-1/2
          -translate-y-1/2
        "
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          width: `${clusterSize.width}%`,
          minWidth: "74px",
          height: `${clusterSize.height}%`,
          minHeight: "58px",
        }}
      >
        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
            gap-1
          "
        >
          {/* ================================================
              INVESTIGATORS + MONSTERS
              ================================================ */}
          {(investigatorsAtSpace.length > 0 ||
            visibleMonsters.length > 0) && (
            <div
              className="
                flex
                max-w-full
                flex-wrap
                items-center
                justify-center
                gap-1
                rounded-xl
                bg-black/20
                px-1
                py-1
                backdrop-blur-[1px]
              "
            >
              {investigatorsAtSpace.map(
                (investigator) => {
                  const definition =
                    coreInvestigators.find(
                      (item) =>
                        item.id ===
                        investigator.definitionId,
                    );

                  if (!definition) {
                    return null;
                  }

                  const fileName =
                    definition.name.replace(
                      /\s+/g,
                      "_",
                    );

                  const portrait =
                    `/cards/investigators/${fileName}/${fileName}.png`;

                  return (
                    <div
                      key={`investigator-${investigator.id}`}
                      className="
                        relative
                        h-12
                        w-9
                        shrink-0
                        overflow-visible
                        border-2
                        border-yellow-400
                        bg-black
                        shadow-[0_2px_7px_rgba(0,0,0,0.9)]
                      "
                      title={definition.name}
                    >
                      <div className="h-full w-full overflow-hidden">
                        <img
                          src={portrait}
                          alt={definition.name}
                          draggable={false}
                          className="
                            h-full
                            w-full
                            object-cover
                            select-none
                          "
                        />
                      </div>
                    </div>
                  );
                },
              )}

              {visibleMonsters.map((monster) => {
                const definition =
                  monsterDefinitions.find(
                    (item) =>
                      item.id ===
                      monster.definitionId,
                  );

                if (!definition) {
                  return null;
                }

                return (
                  <div
                    key={`monster-${monster.id}`}
                    className="
                      relative
                      h-9
                      w-9
                      shrink-0
                      overflow-hidden
                      rounded-full
                      border-2
                      border-red-500
                      bg-black
                      shadow-[0_2px_6px_rgba(0,0,0,0.9)]
                    "
                    title={definition.name}
                  >
                    <img
                      src={definition.frontImage}
                      alt={definition.name}
                      draggable={false}
                      className="
                        h-full
                        w-full
                        object-cover
                        select-none
                      "
                    />
                  </div>
                );
              })}

              {hiddenMonsterCount > 0 && (
                <div
                  className="
                    relative
                    flex
                    h-9
                    min-w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-white
                    bg-black/90
                    px-1
                    text-[10px]
                    font-black
                    text-white
                    shadow-[0_2px_6px_rgba(0,0,0,0.9)]
                  "
                  title={`${hiddenMonsterCount} more monster(s)`}
                >
                  +{hiddenMonsterCount}
                </div>
              )}
            </div>
          )}

          {/* ================================================
              BOARD TOKENS
              ================================================ */}
          {(gatesAtSpace.length > 0 ||
            clueCount > 0 ||
            eldritchTokenCount > 0 ||
            hasExpedition ||
            hasRumor ||
            mysteryTokenCount > 0) && (
            <div
              className="
                flex
                max-w-full
                flex-wrap
                items-center
                justify-center
                gap-1
                rounded-lg
                bg-black/35
                px-1
                py-0.5
                backdrop-blur-[1px]
              "
            >
              {/* GATES */}
              {gatesAtSpace.length > 0 && (
                <div
                  className="
                    relative
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-[3px]
                    border-blue-500
                    bg-black/20
                    shadow-[0_0_8px_rgba(59,130,246,0.95)]
                  "
                  title={`${gatesAtSpace.length} Gate(s)`}
                >
                  <img
                    src="/icons/game/Gate-Token.png"
                    alt="Gate"
                    draggable={false}
                    className="
                      h-8
                      w-8
                      object-contain
                      select-none
                      drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]
                    "
                  />

                  {renderCountBadge(
                    gatesAtSpace.length,
                  )}
                </div>
              )}

              {/* CLUES */}
              {clueCount > 0 && (
                <div
                  className="
                    relative
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-[3px]
                    border-green-500
                    bg-black/20
                    shadow-[0_0_8px_rgba(34,197,94,0.95)]
                  "
                  title={`${clueCount} Clue(s)`}
                >
                  <img
                    src="/icons/game/clue.png"
                    alt="Clue"
                    draggable={false}
                    className="
                      h-7
                      w-7
                      object-contain
                      select-none
                      drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]
                    "
                  />

                  {renderCountBadge(
                    clueCount,
                  )}
                </div>
              )}

              {/* ELDRITCH TOKENS */}
              {eldritchTokenCount > 0 && (
                <div
                  className="
                    relative
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-[3px]
                    border-purple-500
                    bg-black/20
                    shadow-[0_0_8px_rgba(168,85,247,0.95)]
                  "
                  title={`${eldritchTokenCount} Eldritch Token(s)`}
                >
                  <img
                    src="/icons/game/eldritch-token.png"
                    alt="Eldritch Token"
                    draggable={false}
                    className="
                      h-7
                      w-7
                      object-contain
                      select-none
                      drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]
                    "
                  />

                  {renderCountBadge(
                    eldritchTokenCount,
                  )}
                </div>
              )}

              {/* ACTIVE EXPEDITION */}
              {hasExpedition && (
                <div
                  className="
                    relative
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                  "
                  title="Active Expedition"
                >
                  <img
                    src="/icons/game/Expedition-Token.png"
                    alt="Active Expedition"
                    draggable={false}
                    className="
                      h-9
                      w-9
                      object-contain
                      select-none
                      drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]
                    "
                  />
                </div>
              )}

              {/* RUMOR */}
              {hasRumor && (
                <div
                  className="
                    relative
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                  "
                  title="Rumor"
                >
                  <img
                    src="/icons/game/mystery-token.png"
                    alt="Rumor token"
                    draggable={false}
                    className="
                      h-8
                      w-8
                      object-contain
                      select-none
                      drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]
                    "
                    style={{
                      clipPath:
                        "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                    }}
                  />
                </div>
              )}

              {/* MYSTERY TOKENS */}
              {mysteryTokenCount > 0 && (
                <div
                  className="
                    relative
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                  "
                  title={`${mysteryTokenCount} Mystery Token(s)`}
                >
                  <img
                    src="/icons/game/mystery-token.png"
                    alt="Mystery Token"
                    draggable={false}
                    className="
                      h-8
                      w-8
                      object-contain
                      select-none
                      drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]
                    "
                  />
                  {renderCountBadge(
                    mysteryTokenCount,
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative flex w-full items-center justify-center overflow-visible"
      onMouseEnter={() =>
        setIsHoveringMap(true)
      }
      onMouseLeave={() =>
        setIsHoveringMap(false)
      }
      onMouseMove={handleMouseMove}
    >
      {/* ================================================== */}
      {/* MAP */}
      {/* ================================================== */}

      <div className="relative aspect-3/2 w-full">
        <img
          src="/maps/eldritch-board.png"
          alt="Eldritch Horror board"
          className="block h-full w-full object-contain"
          draggable={false}
        />

        {/* ================================================== */}
        {/* DOOM TRACK TOKEN */}
        {/* ================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            z-30
            aspect-square
            w-[4.2%]
            -translate-x-1/2
            -translate-y-1/2
            overflow-hidden
            rounded-full
            border-2
            border-black/80
            bg-black
            shadow-[0_2px_8px_rgba(0,0,0,0.8)]
          "
          style={{
            left: `${doomTrackPosition}%`,
            top: "4.5%",
          }}
        >
          <img
            src="/icons/game/doom.png"
            alt="Doom"
            draggable={false}
            className="
              h-full
              w-full
              rounded-full
              object-cover
              select-none
            "
          />
        </div>

        {/* ================================================== */}
        {/* OMEN TRACK TOKEN */}
        {/* ================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            z-30
            aspect-square
            w-[4.2%]
            -translate-x-1/2
            -translate-y-1/2
            overflow-hidden
            select-none
          "
          style={{
            left: `${omenTrackPosition.left}%`,
            top: `${omenTrackPosition.top}%`,
          }}
        >
          <img
            src="/icons/game/omen-token.png"
            alt="Omen"
            draggable={false}
            className="
              h-full
              w-full
              object-contain
              select-none
            "
          />
        </div>

        <div className="absolute inset-0">

          {/* ================================================== */}
          {/* BANK LOAN - FIXED BOARD CARD */}
          {/* ================================================== */}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();

              setIsBankLoanSelected(true);
              setIsAssetReserveOpen(true);
              setSelectedReserveAsset(null);
            }}
            className="
              absolute
              z-10
              cursor-pointer
              rounded-sm
              bg-transparent
              transition
              hover:bg-white/10
            "
            style={{
              left: `${BANK_LOAN_POSITION.left}%`,
              top: `${BANK_LOAN_POSITION.top}%`,
              width: `${BANK_LOAN_POSITION.width}%`,
              height: `${BANK_LOAN_POSITION.height}%`,
              transform: "translate(-50%, -50%)",
            }}
            title="Bank Loan"
            aria-label="Bank Loan"
          />

          {/* ================================================== */}
          {/* ASSET RESERVE */}
          {/* ================================================== */}

          {assetReserve.map((asset, index) => {
            const position =
              ASSET_RESERVE_POSITIONS[index];

            if (!position) {
              return null;
            }

            return (
              <button
                key={asset.id}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();

                  setSelectedReserveAsset(asset);
                  setIsAssetReserveOpen(true);
                }}
                className="
                  absolute
                  z-10
                  cursor-pointer
                  overflow-hidden
                  rounded-sm
                  transition
                  hover:z-40
                  hover:scale-105
                "
                style={{
                  left: `${position.left}%`,
                  top: `${position.top}%`,
                  width: `${position.width}%`,
                  height: `${position.height}%`,
                  transform:
                    "translate(-50%, -50%)",
                }}
                title={asset.name}
              >
                <img
                  src={asset.image}
                  alt={asset.name}
                  draggable={false}
                  className="
                    h-full
                    w-full
                    object-cover
                    select-none
                  "
                />
              </button>
            );
          })}

          {/* ================================================== */}
          {/* MAP SPACES */}
          {/* ================================================== */}

          {Object.entries(
            eldritchMapPositions,
          ).map(
            ([spaceId, position]) => {
              const isTravelDestination =
                travelDestinationIds.includes(
                  spaceId,
                );

              const isByakheeDestination =
                byakheeDestinationIds.includes(
                  spaceId,
                );

              const isMysteryDestination =
                mysteryDestinationIds.includes(
                  spaceId,
                );

              const isPendingSpaceSelection =
                pendingSpaceSelectionIds.includes(
                  spaceId,
                );

              const isDecisionDestination =
                isTravelDestination ||
                isByakheeDestination ||
                isMysteryDestination ||
                isPendingSpaceSelection;

              return (
                <button
                  key={spaceId}
                  type="button"
                  onClick={() => {
                    /*
                    * ==========================================================
                    * PENDING SPACE SELECTION
                    * ==========================================================
                    *
                    * Qualquer pendingDecision do tipo select-space
                    * é resolvido diretamente através do mapa.
                    */
                    if (isPendingSpaceSelection) {
                      if (isByakheeDestination) {
                        onSelectByakheeSpace?.(
                          spaceId,
                        );
                      } else {
                        onSelectSpace?.(
                          spaceId,
                        );
                      }

                      return;
                    }

                    /*
                    * ==========================================================
                    * NORMAL TRAVEL
                    * ==========================================================
                    */
                    if (isTravelDestination) {
                      onSelectSpace?.(
                        spaceId,
                      );
                      return;
                    }

                    /*
                    * ==========================================================
                    * NORMAL MAP INSPECTION
                    * ==========================================================
                    */
                    onInspectSpace?.(
                      spaceId,
                    );
                  }}
                  title={spaceId}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition ${
                    DEBUG_MAP_HITBOXES
                      ? "cursor-pointer border-2 border-white bg-blue-600/40 hover:bg-blue-500/60"
                      : isDecisionDestination
                        ? "cursor-pointer border-[6px] border-black bg-transparent shadow-[inset_0_0_0_2px_rgba(250,204,21,1),0_0_0_2px_rgba(250,204,21,1),0_0_8px_rgba(0,0,0,1),0_0_16px_rgba(250,204,21,1)] hover:bg-yellow-400/10"
                        : "cursor-pointer bg-transparent hover:bg-white/10"
                  }`}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    width: `${position.hitboxWidth}%`,
                    height: `${position.hitboxHeight}%`,
                  }}
                >
                  {DEBUG_MAP_HITBOXES && (
                    <span className="text-[9px] font-bold text-white">
                      {spaceId}
                    </span>
                  )}
                </button>
              );
            },
          )}

          {/* ================================================== */}
          {/* SPACE CONTENTS */}
          {/* ================================================== */}

          {Object.entries(
            eldritchMapPositions,
          ).map(([spaceId, position]) =>
            renderSpaceContents(
              spaceId,
              position,
            ),
          )}

        </div>

        {/* ================================================== */}
        {/* MAP ZOOM / MAGNIFIER */}
        {/* ================================================== */}

        {isHoveringMap && (
          <div
            className="
              pointer-events-none
              fixed
              z-9999
              h-96
              w-96
              overflow-hidden
              rounded-full
              border-4
              border-white/90
              bg-black
              shadow-2xl
            "
            style={{
              left: `${zoomLeft}px`,
              top: `${zoomTop}px`,
            }}
          >
            {/* ================================================== */}
            {/* ZOOMED MAP */}
            {/* ================================================== */}

            <div className="absolute inset-0 overflow-hidden">
              <img
                src="/maps/eldritch-board.png"
                alt=""
                draggable={false}
                className="absolute max-w-none select-none"
                style={{
                  width: `${
                    mousePosition.mapWidth * 5
                  }px`,

                  height: `${
                    mousePosition.mapHeight * 5
                  }px`,

                  left: `${
                    192 -
                    mousePosition.mapX * 5
                  }px`,

                  top: `${
                    192 -
                    mousePosition.mapY * 5
                  }px`,
                }}
              />
            </div>

            {/* ================================================== */}
            {/* LABEL */}
            {/* ================================================== */}

            <div
              className="
                absolute
                bottom-5
                left-1/2
                -translate-x-1/2
                rounded-md
                bg-black/75
                px-3
                py-1
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-white
              "
            >
              Map Zoom
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* ASSET RESERVE POPUP */}
        {/* ================================================== */}

        {isAssetReserveOpen && (
          <div
            className="
              fixed
              inset-0
              z-10000
              flex
              items-center
              justify-center
              bg-black/80
              p-6
              backdrop-blur-sm
            "
            onClick={() => {
              setIsAssetReserveOpen(false);
              setSelectedReserveAsset(null);
              setIsBankLoanSelected(false);
            }}
          >
            <div
              className="
                relative
                flex
                w-full
                max-w-5xl
                flex-col
                items-center
                rounded-2xl
                border
                border-white/15
                bg-[#181a20]
                p-6
                shadow-2xl
              "
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {/* ================================================== */}
              {/* HEADER */}
              {/* ================================================== */}

              <div className="mb-5 flex w-full items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">
                    Asset Reserve
                  </h2>

                  <p className="mt-1 text-xs text-white/40">
                    Click a card to enlarge
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsAssetReserveOpen(false);
                    setSelectedReserveAsset(null);
                    setIsBankLoanSelected(false);
                  }}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-xl
                    text-white
                    transition
                    hover:bg-white/20
                  "
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* ================================================== */}
              {/* 5 CARDS */}
              {/* ================================================== */}

              <div className="flex w-full items-start justify-center gap-3">
                {/* ================================================== */}
                {/* BANK LOAN */}
                {/* ================================================== */}

                <button
                  type="button"
                  onClick={() => {
                    setIsBankLoanSelected(true);
                    setSelectedReserveAsset(null);
                  }}
                  className={`
                    group
                    relative
                    w-32
                    aspect-[0.65]
                    overflow-hidden
                    rounded-lg
                    border-2
                    bg-black
                    transition
                    hover:scale-105
                    ${
                      isBankLoanSelected
                        ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.35)]"
                        : "border-white/10"
                    }
                  `}
                >
                  <div
                    className="
                      absolute
                      inset-0
                      bg-cover
                      bg-no-repeat
                    "
                    style={{
                      backgroundImage:
                        "url('/maps/eldritch-board.png')",
                      backgroundSize: "1515% 746%",
                      backgroundPosition: "0.8% 100%",
                    }}
                  />
                </button>

                {/* ================================================== */}
                {/* 4 ASSET RESERVE CARDS */}
                {/* ================================================== */}

                {assetReserve.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      setIsBankLoanSelected(false);
                      setSelectedReserveAsset(asset);
                    }}
                    className={`
                      group
                      relative
                      w-32
                      overflow-hidden
                      rounded-lg
                      border-2
                      bg-black
                      transition
                      hover:scale-105
                      ${
                        selectedReserveAsset?.id === asset.id
                          ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.35)]"
                          : "border-white/10"
                      }
                    `}
                  >
                    <img
                      src={asset.image}
                      alt={asset.name}
                      draggable={false}
                      className="
                        block
                        w-full
                        object-cover
                      "
                    />
                  </button>
                ))}
              </div>

              {/* ================================================== */}
              {/* SELECTED CARD */}
              {/* ================================================== */}

              {isBankLoanSelected && (
                <div className="mt-6 flex flex-col items-center">
                  <div
                    className="
                      h-[27.5vh]
                      w-auto
                      aspect-[0.65]
                      overflow-hidden
                      rounded-xl
                      border
                      border-white/20
                      bg-black
                      shadow-2xl
                    "
                    style={{
                      backgroundImage:
                        "url('/maps/eldritch-board.png')",
                      backgroundSize:
                        "1515% 746%",
                      backgroundPosition:
                        "0.8% 100%",
                      backgroundRepeat:
                        "no-repeat",
                    }}
                  />

                  <p className="mt-3 text-sm font-bold text-white">
                    Bank Loan
                  </p>
                </div>
              )}

              {selectedReserveAsset && (
                <div className="mt-6 flex flex-col items-center">
                  <div
                    className="
                      max-h-[65vh]
                      max-w-[45vw]
                      overflow-hidden
                      rounded-xl
                      border
                      border-white/20
                      bg-black
                      shadow-2xl
                    "
                  >
                    <img
                      src={selectedReserveAsset.image}
                      alt={selectedReserveAsset.name}
                      draggable={false}
                      className="
                        block
                        max-h-[65vh]
                        max-w-[45vw]
                        object-contain
                      "
                    />
                  </div>

                  <p className="mt-3 text-sm font-bold text-white">
                    {selectedReserveAsset.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}