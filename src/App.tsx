import { useEffect, useRef, useState } from "react";

import {
  getSavedGames,
  loadSavedGame,
  saveAutoGame,
  saveManualGame,
  hasActiveSession,
  setActiveSession,
  exitSavedSession,
  findManualSaveByName,
  updateManualGame,
} from "./game/persistence/gameSaves";

import type { GameState } from "./game/models/GameState";
import type { TestResult } from "./game/models/TestResult";

import GameBoard from "./components/game/board/GameBoard";
import InvestigatorSelection from "./components/investigators/InvestigatorSelection";
import DiceRollModal from "./components/game/modals/DiceRollModal";
import AssetReserveModal from "./components/game/modals/AssetReserveModal";
import InvestigatorCardsModal from "./components/game/modals/InvestigatorCardsModal";
import SpellChoiceModal from "./components/game/modals/SpellChoiceModal";
import GameFlowOverlay from "./components/game/modals/GameFlowOverlay";

import { coreInvestigators } from "./content/core/investigators";
import { eldritchBaseMap } from "./content/core/maps/eldritchBaseMap";
import { coreAssets } from "./content/core/coreAssets";
import { coreSpells } from "./content/core/coreSpell";

import { createGame } from "./game/engine/createGame";
import { validateMap } from "./game/engine/validateMap";
import { getTravelDestinations } from "./game/engine/getTravelDestinations";
import { travelInvestigator } from "./game/engine/travelInvestigator";
import { startTravel } from "./game/engine/startTravel";
import { endTravel } from "./game/engine/endTravel";
import { getTravelReachableSpaces } from "./game/engine/getTravelReachableSpaces";
import { undoTravel } from "./game/engine/undoTravel";

import { endInvestigatorActions } from "./game/engine/endInvestigatorActions";
import { restInvestigator } from "./game/engine/restInvestigator";
import { prepareForTravel } from "./game/engine/prepareForTravel";
import { acquireAssets } from "./game/engine/acquireAssets";
import { confirmAcquireAssets } from "./game/engine/confirmAcquireAssets";
import { discardAsset } from "./game/engine/discardAsset";

import { resolveSpellChoice } from "./game/engine/resolveSpellChoice";

import { tradeInvestigator } from "./game/engine/tradeInvestigator";
import { endInvestigatorEncounter } from "./game/engine/endInvestigatorEncounter";
import { resolveEncounterSpaceSelection } from "./game/engine/resolveEncounterSpaceSelection";

import InvestigatorCard from "./components/game/investigator/InvestigatorCard";
import InvestigatorActionsPanel from "./components/game/actions/InvestigatorActionsPanel";
import ActiveInvestigatorPanel from "./components/game/investigator/ActiveInvestigatorPanel";

import PrepareForTravelModal from "./components/game/actions/PrepareForTravelModal";
import SpellPreviewModal from "./components/game/spells/SpellPreviewModal";
import EncounterPhasePanel from "./components/game/encounters/EncounterPhasePanel";

import TradeTargetModal from "./components/game/trade/TradeTargetModal";
import TradeModal from "./components/game/trade/TradeModal";

import GameTableHeader from "./components/game/board/GameTableHeader";
import type { PendingDecision } from "./game/models/PendingDecision";
import HomeScreen from "./components/home/HomeScreen";
import SaveGameModal from "./components/game/SaveGameModal";

import SpaceInspectModal from "./components/game/board/SpaceInspectModal";
import { startInvestigatorEncounter } from "./game/engine/startInvestigatorEncounter";
import { resolveCombatTest } from "./game/engine/combat/resolveCombatTest";
import { resolveMonsterAbilityTest } from "./game/engine/combat/resolveMonsterAbilityTest";
import { resolveMonsterSingleDieRoll } from "./game/engine/combat/resolveMonsterSingleDieRoll";
import { resolveCombatFlow } from "./game/engine/combat/resolveCombatFlow";
import { resolveMonsterAbilityFlow } from "./game/engine/combat/resolveMonsterAbilityFlow";
import { resolveCardSelection } from "./game/engine/resolveCardSelection";
import { resolveGameFlowChoice } from "./game/engine/resolveGameFlowChoice";
import { resolveStandardTestResult } from "./game/engine/resolveStandardTestResult";
import { resolveGameFlowContinue } from "./game/engine/resolveGameFlowContinue";
import { resolveTestRoll } from "./game/engine/resolveTestRoll";
import { canSelectAsset } from "./game/engine/canSelectAsset";
import { rollSingleDie } from "./game/engine/rollSingleDie";
import { resolveCombatOrder } from "./game/engine/resolveCombatOrder";
import { resolveMonsterReckoning } from "./game/engine/resolveMonsterReckoning";
import { resolveAncientOneReckoning } from "./game/engine/resolveAncientOneReckoning";
import { resolveYogSothothSpellChoice } from "./game/engine/resolveYogSothothSpellChoice";
import { easyMythos } from "./content/core/mythos/easyMythos";
import { normalMythos } from "./content/core/mythos/normalMythos";
import { hardMythos } from "./content/core/mythos/hardMythos";
import { setLeadInvestigator } from "./game/engine/setLeadInvestigator";
import { resolveEncounterEffects } from "./game/engine/resolveEncounterEffects";
import {
  resolveMythosSpecial,
  startEyesEverywhere,
} from "./game/engine/resolveMythosSpecial";


function App() {
  const [game, setGame] =
    useState<GameState | null>(null);

  const [screen, setScreen] =
    useState<
      "loading" | "home" | "setup" | "game"
    >("loading");
  
  const [
    saveModalOpen,
    setSaveModalOpen,
  ] = useState(false);

  const [tradeTargetId, setTradeTargetId] =
    useState<string | null>(null);

  const [diceTest, setDiceTest] =
    useState<TestResult | null>(null);

  const [singleDieRoll, setSingleDieRoll] =
    useState<number | null>(null);

  const [
    pendingTestDecision,
    setPendingTestDecision,
  ] = useState<Extract<
    PendingDecision,
    { type: "test" }
  > | null>(null);

  const pendingTestDecisionRef =
    useRef<Extract<
      PendingDecision,
      { type: "test" }
    > | null>(null);

  const [spellTest, setSpellTest] =
    useState<TestResult | null>(null);

  const [
    prepareForTravelChoice,
    setPrepareForTravelChoice,
  ] = useState(false);

  const [
    tradeTargetSelectionOpen,
    setTradeTargetSelectionOpen,
  ] = useState(false);

  const [tradeOpen, setTradeOpen] =
    useState(false);

  const [
    spellTestSpellId,
    setSpellTestSpellId,
  ] = useState<string | null>(null);

  const [
    spellPreviewId,
    setSpellPreviewId,
  ] = useState<string | null>(null);

  const [assetReserveOpen, setAssetReserveOpen] =
    useState(false);

  const [selectedAssetIds, setSelectedAssetIds] =
    useState<string[]>([]);

  const [useBankLoan, setUseBankLoan] =
    useState(false);

  const [
    cardsInvestigatorId,
    setCardsInvestigatorId,
  ] = useState<string | null>(null);

  const [
    encounterStartedForTurn,
    setEncounterStartedForTurn,
  ] = useState(false);

  const [inspectedSpaceId, setInspectedSpaceId] =
    useState<string | null>(null);

  const handleInspectSpace = (spaceId: string) => {
    setInspectedSpaceId(spaceId);
  };

    /*
    * ============================================================
    * AUTO SAVE
    * ============================================================
    */

    useEffect(() => {
      if (
        screen !== "game" ||
        !game
      ) {
        return;
      }

      if (diceTest) {
        return;
      }

      if (spellTest) {
        return;
      }

      saveAutoGame(game);
    }, [
      game,
      screen,
      diceTest,
      spellTest,
    ]);
  
  /*
  * ============================================================
  * RESTORE ACTIVE SESSION
  * ============================================================
  *
  * When the application starts:
  *
  * - If there is an active session, restore Auto Save.
  * - Otherwise show Home.
  *
  * IMPORTANT:
  *
  * Refreshing/F5 does NOT clear the session.
  * Only Exit clears it.
  */

  useEffect(() => {
    const active =
      hasActiveSession();

    if (!active) {
      setScreen("home");
      return;
    }

    const savedGames =
      getSavedGames();

    const autoSave =
      savedGames.find(
        (save) =>
          save.type === "auto",
      );

    if (!autoSave) {
      setActiveSession(false);
      setScreen("home");
      return;
    }

    const savedGame =
      loadSavedGame(
        autoSave.id,
      );

    if (!savedGame) {
      setActiveSession(false);
      setScreen("home");
      return;
    }

    setGame(savedGame);
    setScreen("game");
  }, []);

  /*
   * ============================================================
   * TRADE
   * ============================================================
   */
  
  function handleOpenTrade() {
    setTradeTargetId(null);
    setTradeTargetSelectionOpen(true);
  }

  function handleSelectTradeTarget(
    investigatorId: string,
  ) {
    setTradeTargetId(
      investigatorId,
    );

    setTradeTargetSelectionOpen(
      false,
    );

    setTradeOpen(true);
  }

  /*
   * ============================================================
   * INVESTIGATOR PORTRAIT
   * ============================================================
   */

  function getInvestigatorPortrait(
    investigatorId: string,
  ): string {
    const investigator =
      currentGame.investigators[
        investigatorId
      ];

    if (!investigator) {
      return "";
    }

    const definition =
      coreInvestigators.find(
        (item) =>
          item.id ===
          investigator.definitionId,
      );

    if (!definition) {
      return "";
    }

    const fileName =
      definition.name.replace(
        /\s+/g,
        "_",
      );

    return `/cards/investigators/${fileName}/${fileName}.png`;
  }

  /*
   * ============================================================
   * SPELL CHOICE
   * ============================================================
   */

  function handleSpellChoice(
    selectedId: string,
  ) {
    if (!game) {
      return;
    }

    try {
      const updatedGame =
        resolveSpellChoice(
          game,
          selectedId,
        );

      setGame(updatedGame);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleEndInvestigatorEncounter() {
    if (!game) {
      return;
    }

    try {
      const nextGame =
        endInvestigatorEncounter(game);

      setGame(nextGame);
      setEncounterStartedForTurn(false);
    } catch (error) {
      console.error(
        "Error ending Investigator Encounter:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  /*
   * ============================================================
   * COMPLETE SPELL TEST
   * ============================================================
   */

  function handleCompleteSpellTest() {
    if (!spellTestSpellId) {
      setSpellTest(null);
      return;
    }

    const spellId =
      spellTestSpellId;

    setSpellTest(null);
    setSpellTestSpellId(null);

    setSpellPreviewId(
      spellId,
    );
  }

  /*
   * ============================================================
   * CLOSE SPELL PREVIEW
   * ============================================================
   */

  function handleCloseSpellPreview() {
    if (!spellPreviewId) {
      return;
    }

    const spellId =
      spellPreviewId;

    setGame((current) => {
      if (!current) {
        return current;
      }

      const currentSpell =
        current.spells[spellId];

      if (!currentSpell) {
        return current;
      }

      return {
        ...current,

        spells: {
          ...current.spells,

          [spellId]: {
            ...currentSpell,

            flipped: false,
          },
        },
      };
    });

    setSpellPreviewId(null);
  }

  /*
   * ============================================================
   * ENCOUNTER
   * ============================================================
   */

  function handleStartEncounter() {
    if (!game) {
      return;
    }

    try {
      const updatedGame =
        startInvestigatorEncounter(
          game,
          eldritchBaseMap,
        );

      setGame(updatedGame);
      setEncounterStartedForTurn(true);

      console.log(
        "Investigator Encounter started.",
      );
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  /*
   * ============================================================
   * ASSET RESERVE
   * ============================================================
   */

  function handleCloseAssetReserve() {
    setSelectedAssetIds([]);
    setUseBankLoan(false);
    setAssetReserveOpen(false);

    setGame((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,

        lastTest: null,
      };
    });
  }

  function handleDiscardAsset(
    assetId: string,
  ) {
    if (!game) {
      return;
    }

    try {
      const updatedGame =
        discardAsset(
          game,
          assetId,
        );

      setGame(updatedGame);

      setSelectedAssetIds([]);
      setAssetReserveOpen(false);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleConfirmAcquireAssets() {
    if (!game) {
      return;
    }

    try {
      const updatedGame =
        confirmAcquireAssets(
          game,
          selectedAssetIds,
          useBankLoan,
        );

      setGame(updatedGame);

      setSelectedAssetIds([]);
      setUseBankLoan(false);
      setAssetReserveOpen(false);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleToggleAsset(
    assetId: string,
  ) {
    setSelectedAssetIds(
      (current) => {
        /*
        * ==========================================================
        * DESELECT
        * ==========================================================
        */

        if (
          current.includes(assetId)
        ) {
          return current.filter(
            (id) =>
              id !== assetId,
          );
        }

        /*
        * ==========================================================
        * SELECT
        * ==========================================================
        */

        if (!game) {
          return current;
        }

        const canSelect =
          canSelectAsset(
            game,
            current,
            assetId,
            useBankLoan,
          );

        if (!canSelect) {
          return current;
        }

        return [
          ...current,
          assetId,
        ];
      },
    );
  }

  function handleAcquireAssets() {
    if (!game) {
      return;
    }

    try {
      const updatedGame =
        acquireAssets(
          game,
          eldritchBaseMap,
        );

      const investigatorId =
        updatedGame.activeInvestigatorId;

      if (!investigatorId) {
        throw new Error(
          "Acquire Assets test is missing active investigator.",
        );
      }

      /*
      * ============================================================
      * STORE ACQUIRE ASSETS TEST CONTEXT
      * ============================================================
      *
      * Unlike Encounter tests, Acquire Assets is initiated
      * directly by the Action panel.
      *
      * Therefore there is no existing pendingDecision carrying
      * the original Test.
      *
      * We create one only for the Dice Test continuation flow.
      */

      const acquireAssetsTestDecision: PendingDecision = {
        type: "test",

        title: "Acquire Assets",

        message:
          "Resolve the Influence test to determine how many Assets you may acquire.",

        skill: "influence",

        modifier: 0,

        investigatorId,

        source:
          `acquire-assets:${investigatorId}`,
      };

      pendingTestDecisionRef.current =
        acquireAssetsTestDecision;

      setPendingTestDecision(
        acquireAssetsTestDecision,
      );

      setGame(updatedGame);

      setDiceTest(
        updatedGame.lastTest,
      );
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleChooseTravelTicket(
    ticketType: "train" | "ship",
  ) {
    if (!game) {
      return;
    }

    try {
      const updatedGame =
        prepareForTravel(
          game,
          eldritchBaseMap,
          ticketType,
        );

      setGame(updatedGame);
      setPrepareForTravelChoice(false);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  /*
   * ============================================================
   * TRADE
   * ============================================================
   */

  function handleTrade(
    offer: {
      clues: number;
      trainTickets: number;
      shipTickets: number;
      assetIds: string[];
      artifactIds: string[];
      spellIds: string[];
      targetClues: number;
      targetTrainTickets: number;
      targetShipTickets: number;
      targetAssetIds: string[];
      targetArtifactIds: string[];
      targetSpellIds: string[];
    },
  ) {
    if (!game) {
      return;
    }

    if (!tradeTargetId) {
      return;
    }

    try {
      const updatedGame =
        tradeInvestigator(
          game,
          tradeTargetId,
          offer,
        );

      setGame(updatedGame);
      setTradeTargetId(null);
      setTradeOpen(false);
    } catch (error) {
      console.error(
        "Error completing Trade:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleCancelTrade() {
    setTradeTargetId(null);
    setTradeOpen(false);
  }

  /*
   * ============================================================
   * ACTIONS
   * ============================================================
   */

  function handlePrepareForTravel() {
    if (!game) {
      return;
    }

    setPrepareForTravelChoice(true);
  }

  function handleRest() {
    if (!game) {
      return;
    }

    try {
      const updatedGame =
        restInvestigator(game);

      setGame(updatedGame);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleEndInvestigatorActions() {
    if (!game) {
      return;
    }

    try {
      const updatedGame =
        endInvestigatorActions(game);

      setGame(updatedGame);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleUndoTravel() {
    if (!game) {
      return;
    }

    try {
      const updatedGame =
        undoTravel(game);

      setGame(updatedGame);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleStartTravel() {
    if (!game) {
      return;
    }

    try {
      const updatedGame =
        startTravel(game);

      setGame(updatedGame);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleEndTravel() {
    if (!game) {
      return;
    }

    try {
      const updatedGame =
        endTravel(game);

      setGame(updatedGame);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleSelectSpace(
    spaceId: string,
  ) {
    if (!game) {
      return;
    }

    /*
    * ============================================================
    * MYSTERY — NEAREST CLUE
    * ============================================================
    *
    * When a Mystery is waiting for the Lead Investigator
    * to choose between equally near spaces, the selected
    * space must be resolved as a Mystery decision and not
    * as normal investigator movement.
    */
    if (
      game.pendingDecision?.type ===
        "select-space" &&
      game.pendingDecision.source ===
        "mystery:nearest-clue"
    ) {
      try {
        const updatedGame =
          resolveEncounterSpaceSelection(
            game,
            spaceId,
            eldritchBaseMap,
          );

        setGame(updatedGame);
      } catch (error) {
        console.error(
          "Error resolving Mystery space selection:",
          error instanceof Error
            ? error.message
            : error,
        );
      }

      return;
    }

    /*
    * ============================================================
    * NORMAL TRAVEL
    * ============================================================
    */

    if (
      !game.activeInvestigatorId
    ) {
      return;
    }

    try {
      const result =
        travelInvestigator(
          game,
          eldritchBaseMap,
          spaceId,
        );

      setGame(result.game);
    } catch (error) {
      console.log(
        "Invalid movement:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleSelectByakheeSpace(
    spaceId: string,
  ) {
    if (!game) {
      return;
    }

    try {
      const updatedGame =
        resolveEncounterSpaceSelection(
          game,
          spaceId,
          eldritchBaseMap,
        );

      setGame(updatedGame);
    } catch (error) {
      console.error(
        "Error resolving Byakhee movement:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  /*
  * ============================================================
  * TEST — SPAWN MONSTERS ON MAP
  * ============================================================
  *
  * Temporário.
  *
  * Pega em monstros que estão no Monster Cup
  * e espalha-os pelo mapa para testar:
  *
  * - imagens
  * - posições
  * - popup
  * - múltiplos monstros no mesmo espaço
  */

  function handleTestSpawnMonsters() {
    setGame((currentGame) => {
      if (!currentGame) {
        return currentGame;
      }

      const shanghai =
        currentGame.board.spaces["shanghai"];

      if (!shanghai) {
        console.error(
          'Space "shanghai" does not exist.',
        );

        return currentGame;
      }

      /*
      * ============================================================
      * TEST MONSTERS
      * ============================================================
      *
      * Coloca vários monstros diferentes em Shanghai
      * para testar o Mythos Reckoning.
      */

      const testDefinitionIds = [
        "deep-one",
        "gnoph-keh",
      ];

      const availableMonsters =
        Object.values(
          currentGame.monsters,
        ).filter(
          (monster) =>
            testDefinitionIds.includes(
              monster.definitionId,
            ),
        );

      if (availableMonsters.length === 0) {
        console.error(
          "No test monsters found in game.monsters.",
        );

        return currentGame;
      }

      /*
      * Remove estes monstros de qualquer
      * espaço onde estejam atualmente.
      */

      const updatedSpaces = {
        ...currentGame.board.spaces,
      };

      for (const spaceId of Object.keys(
        updatedSpaces,
      )) {
        updatedSpaces[spaceId] = {
          ...updatedSpaces[spaceId],

          monsterIds:
            updatedSpaces[spaceId].monsterIds.filter(
              (monsterId) =>
                !availableMonsters.some(
                  (monster) =>
                    monster.id === monsterId,
                ),
            ),
        };
      }

      /*
      * Coloca todos em Shanghai.
      */

      const updatedMonsters = {
        ...currentGame.monsters,
      };

      const monsterIdsToAdd: string[] = [];

      for (const monster of availableMonsters) {
        updatedMonsters[monster.id] = {
          ...monster,

          spaceId: "shanghai",

          engagedInvestigatorId: null,
        };

        monsterIdsToAdd.push(
          monster.id,
        );
      }

      updatedSpaces["shanghai"] = {
        ...updatedSpaces["shanghai"],

        monsterIds: [
          ...updatedSpaces["shanghai"]
            .monsterIds,

          ...monsterIdsToAdd,
        ],
      };

      console.log(
        "TEST — MONSTERS SPAWNED IN SHANGHAI:",
        monsterIdsToAdd,
      );

      return {
        ...currentGame,

        monsters: updatedMonsters,

        board: {
          ...currentGame.board,

          spaces: updatedSpaces,
        },
      };
    });
  }

  /*
   * ============================================================
   * ACTIVE INVESTIGATOR
   * ============================================================
   */

  function handleSelectInvestigator(
    investigatorId: string,
  ) {
    setGame((current) => {
      if (!current) {
        return current;
      }

      if (
        current.phase === "action"
      ) {
        const expectedInvestigatorId =
          current.investigatorOrder[
            current.investigatorTurnIndex
          ];

        if (
          investigatorId !==
          expectedInvestigatorId
        ) {
          return current;
        }
      }

      const activeInvestigatorId =
        current.activeInvestigatorId;

      if (activeInvestigatorId) {
        const activeInvestigator =
          current.investigators[
            activeInvestigatorId
          ];

        if (
          activeInvestigator?.travelActive
        ) {
          return current;
        }
      }

      return {
        ...current,

        activeInvestigatorId:
          investigatorId,
      };
    });
  }

  /*
   * ============================================================
   * GAME FLOW
   * ============================================================
   */


  function handleFlowChoice(
    choiceId: string,
  ) {
    if (!game) {
      return;
    }

    try {
      const updatedGame =
        resolveGameFlowChoice(
          game,
          choiceId,
          eldritchBaseMap,
        );

      setGame(updatedGame);
    } catch (error) {
      console.error(
        "Error resolving Game Flow choice:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleFlowSelectSpace(
    spaceId: string,
  ) {
    if (!game) {
      return;
    }

    try {
      if (
        !game.pendingDecision ||
        game.pendingDecision.type !==
          "select-space"
      ) {
        throw new Error(
          "There is no pending space selection.",
        );
      }

      const decision =
        game.pendingDecision;

      if (
        !decision.spaceIds.includes(
          spaceId,
        )
      ) {
        throw new Error(
          `Space "${spaceId}" cannot be selected.`,
        );
      }

      const updatedGame =
        resolveEncounterSpaceSelection(
          game,
          spaceId,
          eldritchBaseMap,
        );

      setGame(updatedGame);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleFlowSelectInvestigator(
    investigatorId: string,
  ) {
    if (!game) {
      return;
    }

    const decision =
      game.pendingDecision;

    if (
      !decision ||
      decision.type !==
        "select-investigator"
    ) {
      return;
    }

    if (
      decision.source !==
      "setup:lead-investigator"
    ) {
      return;
    }

    if (
      !decision.investigatorIds.includes(
        investigatorId,
      )
    ) {
      return;
    }

    try {
      const updatedGame =
        setLeadInvestigator(
          game,
          investigatorId,
        );

      setGame(updatedGame);
    } catch (error) {
      console.error(
        "Error selecting Lead Investigator:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleFlowSelectCard(
    cardId: string,
  ) {
    if (!game) {
      return;
    }

    try {
      const result =
        resolveCardSelection(
          game,
          cardId,
          eldritchBaseMap,
        );

      if (
        result.type === "ignore"
      ) {
        return;
      }

      setGame(
        result.game,
      );
    } catch (error) {
      console.error(
        "Error resolving card selection:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  /*
   * ============================================================
   * MONSTER SPECIAL ABILITY
   * ============================================================
   */

  function handleMonsterAbility() {
    if (!game) {
      return;
    }

    const decision =
      game.pendingDecision;

    if (
      !decision ||
      decision.type !== "monster-ability"
    ) {
      return;
    }

    try {
      /*
      * Colour Out of Space:
      * esta habilidade tem um dado especial de 1D6.
      */
      if (
        decision.ability.type ===
        "after-will-roll-die-defeat-on-5-6"
      ) {
        handleMonsterSingleDieRoll();
        return;
      }

      const updatedGame =
        resolveMonsterAbilityFlow(
          game,
          decision,
          "resolve",
        );

      setGame(updatedGame);
    } catch (error) {
      console.error(
        "Error resolving Monster Ability:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  /*
   * ============================================================
   * SKIP MONSTER SPECIAL ABILITY
   * ============================================================
   */

  function handleMonsterAbilitySkip() {
    if (!game) {
      return;
    }

    const decision =
      game.pendingDecision;

    if (
      !decision ||
      decision.type !== "monster-ability"
    ) {
      return;
    }

    try {
      /*
      * Esta habilidade não tem uma opção de skip
      * tradicional. O botão CONTINUE/ROLL usa
      * o fluxo específico acima.
      */
      if (
        decision.ability.type ===
        "after-will-roll-die-defeat-on-5-6"
      ) {
        return;
      }

      const updatedGame =
        resolveMonsterAbilityFlow(
          game,
          decision,
          "skip",
        );

      setGame(updatedGame);
    } catch (error) {
      console.error(
        "Error skipping Monster Ability:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  /*
  * ============================================================
  * MONSTER RECKONING
  * ============================================================
  */

  function handleResolveMonsterReckoning(
    monsterId: string,
  ) {
    if (!game) {
      return;
    }

    const decision =
      game.pendingDecision;

    if (
      !decision ||
      decision.type !==
        "mythos-reckoning-monsters"
    ) {
      return;
    }

    try {
      const updatedGame =
        resolveMonsterReckoning(
          game,
          eldritchBaseMap,
          monsterId,
        );

      setGame(updatedGame);
    } catch (error) {
      console.error(
        "Error resolving Monster Reckoning:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleResolveAncientOneReckoning() {
    if (!game) {
      return;
    }

    const decision = game.pendingDecision;

    if (
      !decision ||
      decision.type !==
        "mythos-ancient-one-reckoning"
    ) {
      return;
    }

    try {
      const updatedGame =
        resolveAncientOneReckoning(
          game,
          eldritchBaseMap,
        );

      setGame(updatedGame);
    } catch (error) {
      console.error(
        "Error resolving Ancient One Reckoning:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleDiscardYogSothothSpell(
    spellId: string,
  ) {
    if (!game) {
      return;
    }

    const decision = game.pendingDecision;

    if (
      !decision ||
      decision.type !==
        "mythos-yog-sothoth-spell"
    ) {
      return;
    }

    try {
      const updatedGame =
        resolveYogSothothSpellChoice(
          game,
          eldritchBaseMap,
          spellId,
        );

      setGame(updatedGame);
    } catch (error) {
      console.error(
        "Error resolving Yog-Sothoth Spell choice:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleAdvanceYogSothothDoom() {
    if (!game) {
      return;
    }

    const decision = game.pendingDecision;

    if (
      !decision ||
      decision.type !==
        "mythos-yog-sothoth-spell"
    ) {
      return;
    }

    try {
      const updatedGame =
        resolveYogSothothSpellChoice(
          game,
          eldritchBaseMap,
          "doom",
        );

      setGame(updatedGame);
    } catch (error) {
      console.error(
        "Error resolving Yog-Sothoth Doom choice:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleSelectCombatOrderMonster(
    monsterId: string,
  ) {
    if (!game) {
      return;
    }

    const decision =
      game.pendingDecision;

    if (
      !decision ||
      decision.type !== "combat-order"
    ) {
      return;
    }

    if (
      decision.orderedMonsterIds.includes(
        monsterId,
      )
    ) {
      setGame({
        ...game,

        pendingDecision: {
          ...decision,

          orderedMonsterIds:
            decision.orderedMonsterIds.filter(
              (id) =>
                id !== monsterId,
            ),
        },
      });

      return;
    }

    setGame({
      ...game,

      pendingDecision: {
        ...decision,

        orderedMonsterIds: [
          ...decision.orderedMonsterIds,
          monsterId,
        ],
      },
    });
  }

  function handleConfirmCombatOrder() {
    if (!game) {
      return;
    }

    const decision =
      game.pendingDecision;

    if (
      !decision ||
      decision.type !== "combat-order"
    ) {
      return;
    }

    if (
      decision.orderedMonsterIds.length !==
      decision.monsterIds.length
    ) {
      return;
    }

    try {
      const updatedGame =
        resolveCombatOrder(
          game,
          decision.orderedMonsterIds,
          decision.resume,
        );

      setGame(updatedGame);
    } catch (error) {
      console.error(
        "Error resolving Combat Order:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleFlowContinue() {
    if (!game) {
      return;
    }

    try {
      const result =
        resolveGameFlowContinue(
          game,
          eldritchBaseMap,
        );

      setGame(
        result.game,
      );

      if (
        result.resetEncounterStartedForTurn
      ) {
        setEncounterStartedForTurn(
          false,
        );
      }
    } catch (error) {
      console.error(
        "Error continuing Game Flow:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }


  function handleCompleteDiceTest() {
    if (
      !game ||
      !diceTest
    ) {
      return;
    }

    const testDecision =
      pendingTestDecisionRef.current ??
      pendingTestDecision;

    if (!testDecision) {
      console.error(
        "Cannot complete Dice Test: original test decision is missing.",
      );

      return;
    }

    const currentGame =
      game;

    /*
    * ============================================================
    * MONSTER ABILITY TEST
    * ============================================================
    */

    const abilityTestSource =
      testDecision.source ?? "";

    if (
      abilityTestSource.startsWith(
        "monster-ability-test:",
      )
    ) {
      try {
        const resolvedGame =
          resolveMonsterAbilityTest(
            currentGame,
            testDecision,
            diceTest,
          );

        setGame(resolvedGame);

        setDiceTest(null);
        setPendingTestDecision(null);

        pendingTestDecisionRef.current =
          null;

        return;
      } catch (error) {
        console.error(
          "Error resolving Monster Ability Test:",
          error instanceof Error
            ? error.message
            : error,
        );

        return;
      }
    }

    /*
    * ============================================================
    * COMBAT TEST
    * ============================================================
    */

    const combatSource =
      testDecision.source ?? "";

    if (
      combatSource.startsWith(
        "combat:",
      )
    ) {
      try {
        const resolvedGame =
          resolveCombatTest(
            currentGame,
            testDecision,
            diceTest,
          );

        setGame(resolvedGame);

        setDiceTest(null);
        setPendingTestDecision(null);

        pendingTestDecisionRef.current =
          null;

        return;
      } catch (error) {
        console.error(
          "Error resolving Combat Test:",
          error instanceof Error
            ? error.message
            : error,
        );

        return;
      }
    }

    /*
    * ============================================================
    * MYTHOS TEST — GAIN CLUES
    * ============================================================
    */

    const mythosTestSource =
      testDecision.source ?? "";

    if (
      mythosTestSource.startsWith(
        "mythos:test-and-gain-clues:",
      )
    ) {
      const investigatorId =
        mythosTestSource.split(":")[3];

      if (!investigatorId) {
        console.error(
          "Mythos test is missing investigatorId.",
        );

        return;
      }

      const investigator =
        currentGame.investigators[
          investigatorId
        ];

      if (!investigator) {
        console.error(
          `Investigator "${investigatorId}" does not exist.`,
        );

        return;
      }

      /*
      * The Mythos card gives Clues equal
      * to the number of successes.
      */

      const cluesGained =
        diceTest.successes;

      const mythosId =
        currentGame.currentMythosId;

      if (!mythosId) {
        console.error(
          "Mythos test has no current Mythos.",
        );

        return;
      }

      const mythos =
        [
          ...easyMythos,
          ...normalMythos,
          ...hardMythos,
        ].find(
          (definition) =>
            definition.id ===
            mythosId,
        );

      if (!mythos) {
        console.error(
          `Mythos "${mythosId}" does not exist.`,
        );

        return;
      }

      const resolvedGame: GameState = {
        ...currentGame,

        investigators: {
          ...currentGame.investigators,

          [investigatorId]: {
            ...investigator,

            clues:
              investigator.clues +
              cluesGained,
          },
        },

        board: {
          ...currentGame.board,

          mythosDiscard: [
            ...currentGame.board.mythosDiscard,
            mythos,
          ],
        },

        currentMythosId:
          null,

        pendingDecision:
          null,

        lastTest:
          diceTest,
      };

      setGame(
        resolvedGame,
      );

      setDiceTest(null);

      setPendingTestDecision(
        null,
      );

      pendingTestDecisionRef.current =
        null;

      return;
    }

    /*
    * ============================================================
    * NORMAL TEST
    * ============================================================
    */

    const standardTestResult =
      resolveStandardTestResult(
        currentGame,
        testDecision,
        diceTest,
      );

    /*
    * ============================================================
    * ACQUIRE ASSETS
    * ============================================================
    */

    if (
      standardTestResult.type ===
      "acquire-assets"
    ) {
      setGame(
        standardTestResult.game,
      );

      setDiceTest(null);

      setPendingTestDecision(null);

      pendingTestDecisionRef.current =
        null;

      setSelectedAssetIds([]);

      setUseBankLoan(false);

      setAssetReserveOpen(true);

      return;
    }

    /*
    * ============================================================
    * NORMAL RESULT
    * ============================================================
    */

    setGame(
      standardTestResult.game,
    );

    setDiceTest(null);

    setPendingTestDecision(null);

    pendingTestDecisionRef.current =
      null;
  }

  function handleSingleDieRoll() {
    const result =
      rollSingleDie();

    setSingleDieRoll(result);
  }

  function handleMonsterSingleDieRoll() {
    const result =
      rollSingleDie();

    setSingleDieRoll(
      result,
    );
  }

  function handleCompleteMonsterSingleDieRoll() {
    if (!game) {
      return;
    }

    if (singleDieRoll === null) {
      return;
    }

    const decision =
      game.pendingDecision;

    if (!decision) {
      return;
    }

    try {
      /*
      * ============================================================
      * MONSTER ABILITY — SINGLE DIE
      * ============================================================
      */

      if (
        decision.type === "monster-ability"
      ) {
        if (
          decision.ability.type !==
          "after-will-roll-die-defeat-on-5-6"
        ) {
          return;
        }

        const updatedGame =
          resolveMonsterSingleDieRoll(
            game,
            decision.monsterId,
            singleDieRoll,
          );

        setGame(updatedGame);
        setSingleDieRoll(null);

        return;
      }

      /*
      * ============================================================
      * THE BERMUDA TRIANGLE — SINGLE DIE
      * ============================================================
      */

      if (
        decision.type === "single-die-roll" &&
        decision.source?.startsWith(
          "mythos:the-bermuda-triangle:",
        )
      ) {
        const source =
          decision.source;

        const parts =
          source.split(":");

        const investigatorIndex =
          Number(parts[2]);

        const investigatorId =
          decision.investigatorId;

        const effects =
          singleDieRoll >= 1 &&
          singleDieRoll <= 2
            ? decision.onOneOrTwo ?? []
            : decision.onThreeToSix ?? [];

        let updatedGame: GameState = {
          ...game,

          pendingDecision: null,
        };

        /*
        * On 1-2 the Investigator moves directly
        * to Space 8 and becomes Delayed.
        *
        * We do the movement here because Space 8
        * is a fixed destination, not a player choice.
        */

        if (
          singleDieRoll >= 1 &&
          singleDieRoll <= 2
        ) {
          const investigator =
            updatedGame.investigators[
              investigatorId
            ];

          if (investigator) {
            updatedGame = {
              ...updatedGame,

              investigators: {
                ...updatedGame.investigators,

                [investigatorId]: {
                  ...investigator,

                  spaceId: "space-8",

                  isDelayed: true,
                },
              },
            };
          }
        }

        /*
        * Resolve any normal effects associated
        * with the die result.
        */

        if (effects.length > 0) {
          updatedGame =
            resolveEncounterEffects(
              updatedGame,
              investigatorId,
              effects,
              eldritchBaseMap,
            );
        }

        /*
        * Find the next Investigator.
        */

        const nextIndex =
          investigatorIndex + 1;

        const investigatorIds =
          updatedGame.investigatorOrder;

        /*
        * All Investigators have rolled.
        * The Mythos event is finished.
        */

        if (
          nextIndex >=
          investigatorIds.length
        ) {
          const mythosId =
            updatedGame.currentMythosId;

          if (mythosId) {
            const mythos =
              [
                ...easyMythos,
                ...normalMythos,
                ...hardMythos,
              ].find(
                (definition) =>
                  definition.id ===
                  mythosId,
              );

            if (mythos) {
              updatedGame = {
                ...updatedGame,

                board: {
                  ...updatedGame.board,

                  mythosDiscard: [
                    ...updatedGame.board
                      .mythosDiscard,
                    mythos,
                  ],
                },

                currentMythosId:
                  null,

                activeInvestigatorId:
                  null,

                pendingDecision:
                  null,
              };
            }
          }

          setGame(updatedGame);
          setSingleDieRoll(null);

          return;
        }

        /*
        * Start the next Investigator's roll.
        */

        const nextInvestigatorId =
          investigatorIds[nextIndex];

        if (!nextInvestigatorId) {
          setGame(updatedGame);
          setSingleDieRoll(null);

          return;
        }

        updatedGame =
          resolveMythosSpecial(
            updatedGame,
            [
              ...easyMythos,
              ...normalMythos,
              ...hardMythos,
            ].find(
              (definition) =>
                definition.id ===
                "the-bermuda-triangle",
            )!,
            `the-bermuda-triangle:${nextIndex}`,
            eldritchBaseMap,
          );

        setGame(updatedGame);
        setSingleDieRoll(null);

        return;
      }

      /*
      * ============================================================
      * MYTHOS — SINGLE DIE
      * ============================================================
      */

      if (
        decision.type === "single-die-roll" &&
        (
          decision.source?.startsWith(
            "mythos:single-die-roll:",
          ) ||
          decision.source?.startsWith(
            "mythos:eyes-everywhere:",
          )
        )
      ) {
        const investigatorId =
          decision.investigatorId;

        const isEyesEverywhere =
          decision.source?.startsWith(
            "mythos:eyes-everywhere:",
          ) ?? false;

        const effects =
          singleDieRoll >= 1 &&
          singleDieRoll <= 2
            ? decision.onOneOrTwo ?? []
            : isEyesEverywhere
              ? singleDieRoll >= 3 &&
                singleDieRoll <= 5
                ? decision.onThreeToFive ?? []
                : decision.onSix ?? []
              : decision.onThreeToSix ?? [];

        /*
        * Remove the dice decision before resolving
        * the result effects.
        */

        let updatedGame: GameState = {
          ...game,

          pendingDecision:
            null,
        };

        /*
        * Resolve the result effects.
        */

        if (
          effects.length > 0
        ) {
          updatedGame =
            resolveEncounterEffects(
              updatedGame,
              investigatorId,
              effects,
              eldritchBaseMap,
            );
        }

        /*
        * ============================================================
        * EYES EVERYWHERE — MONSTER AMBUSH
        * ============================================================
        *
        * On 3-5 the effect creates a Combat decision.
        *
        * We must attach a resume so that when the Combat ends,
        * the Mythos continues with the next Investigator.
        */

        if (
          isEyesEverywhere &&
          singleDieRoll >= 3 &&
          singleDieRoll <= 5 &&
          updatedGame.pendingDecision?.type ===
            "combat"
        ) {
          const investigatorIndex =
            Number(
              decision.source?.split(":")[2],
            );

          updatedGame = {
            ...updatedGame,

            pendingDecision: {
              ...updatedGame.pendingDecision,

              resume: {
                type:
                  "eyes-everywhere",

                investigatorIds:
                  updatedGame.investigatorOrder,

                currentInvestigatorIndex:
                  investigatorIndex,
              },
            },
          };
        }

        /*
        * If resolving the effects created another
        * decision, stop here and wait for it.
        */

        if (
          updatedGame.pendingDecision
        ) {
          setGame(updatedGame);
          setSingleDieRoll(null);

          return;
        }

        /*
        * ============================================================
        * EYES EVERYWHERE — NEXT INVESTIGATOR
        * ============================================================
        *
        * Results 1-2 and 6 have no Combat decision.
        * Continue with the next Investigator.
        */

        if (
          isEyesEverywhere &&
          !updatedGame.pendingDecision
        ) {
          const investigatorIndex =
            Number(
              decision.source?.split(":")[2],
            );

          const mythosId =
            updatedGame.currentMythosId;

          if (!mythosId) {
            throw new Error(
              "Eyes Everywhere has no current Mythos.",
            );
          }

          const mythos =
            [
              ...easyMythos,
              ...normalMythos,
              ...hardMythos,
            ].find(
              (definition) =>
                definition.id ===
                mythosId,
            );

          if (!mythos) {
            throw new Error(
              `Mythos "${mythosId}" does not exist.`,
            );
          }

          updatedGame =
            startEyesEverywhere(
              updatedGame,
              mythos,
              investigatorIndex + 1,
            );

          setGame(updatedGame);
          setSingleDieRoll(null);

          return;
        }

        /*
        * Heart of Corruption is an Event Mythos.
        *
        * Its effects are now completely resolved,
        * so discard the current Mythos card.
        */

        const mythosId =
          updatedGame.currentMythosId;

        if (mythosId) {
          const mythos =
            [
              ...easyMythos,
              ...normalMythos,
              ...hardMythos,
            ].find(
              (definition) =>
                definition.id ===
                mythosId,
            );

          if (mythos) {
            updatedGame = {
              ...updatedGame,

              board: {
                ...updatedGame.board,

                mythosDiscard: [
                  ...updatedGame.board
                    .mythosDiscard,
                  mythos,
                ],
              },

              currentMythosId:
                null,
            };
          }
        }

        setGame(updatedGame);
        setSingleDieRoll(null);

        return;
      }
    } catch (error) {
      console.error(
        "Error resolving single die roll:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleFlowRollTest() {
    if (!game) {
      return;
    }

    try {
      const result =
        resolveTestRoll(
          game,
        );

      /*
      * ============================================================
      * KEEP ORIGINAL TEST DECISION
      * ============================================================
      *
      * A ref is used so that the original Test decision remains
      * available while the Dice Result modal is open.
      */

      pendingTestDecisionRef.current =
        result.testDecision;

      setPendingTestDecision(
        result.testDecision,
      );

      /*
      * ============================================================
      * UPDATE GAME
      * ============================================================
      */

      setGame(
        result.game,
      );

      /*
      * ============================================================
      * OPEN DICE RESULT
      * ============================================================
      */

      setDiceTest(
        result.testResult,
      );
    } catch (error) {
      console.error(
        "Error rolling test:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleFlowCombat() {
    if (!game) {
      return;
    }

    const decision =
      game.pendingDecision;

    if (
      !decision ||
      decision.type !== "combat"
    ) {
      return;
    }

    try {
      const updatedGame =
        resolveCombatFlow(
          game,
          decision,
          eldritchBaseMap,
        );

      setGame(updatedGame);

      /*
      * O combate terminou e o turno do investigador
      * avançou para o próximo.
      */
      if (
        decision.stage === "strength"
      ) {
        setEncounterStartedForTurn(false);
      }
    } catch (error) {
      console.error(
        "Error resolving Combat Flow:",
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  /*
   * ============================================================
   * GAME CREATION
   * ============================================================
   */

  function handleContinue(
    investigatorIds: string[],
    ancientOneId: string,
  ) {
    const selectedDefinitions =
      investigatorIds
        .map((id) =>
          coreInvestigators.find(
            (investigator) =>
              investigator.id === id,
          ),
        )
        .filter(
          (
            investigator,
          ): investigator is (typeof coreInvestigators)[number] =>
            investigator !==
            undefined,
        );

    if (
      selectedDefinitions.length !==
      investigatorIds.length
    ) {
      console.error(
        "One or more investigators could not be found.",
      );

      return;
    }

    validateMap(
      eldritchBaseMap,
    );

    const newGame =
      createGame({
        scenarioId:
          "eldritch-base",

        map:
          eldritchBaseMap,

        investigatorDefinitions:
          selectedDefinitions,

        ancientOneId,
      });

    console.log(
      "Game created:",
      newGame,
    );

    console.log(
      "Arkham destinations:",
      getTravelDestinations(
        eldritchBaseMap,
        "arkham",
      ),
    );

    const gameAwaitingLeadSelection: GameState = {
      ...newGame,

      leadInvestigatorId: null,

      pendingDecision: {
        type: "select-investigator",

        title:
          "Choose Lead Investigator",

        message:
          "Choose which investigator receives the Lead Investigator token. This investigator will start the first Action Phase.",

        investigatorIds:
          Object.keys(
            newGame.investigators,
          ),

        source:
          "setup:lead-investigator",
      },
    };

    setGame(
      gameAwaitingLeadSelection,
    );

    setScreen("game");
  }

    /*
    * ============================================================
    * SAVE / LOAD / EXIT
    * ============================================================
    */

    function handleNewGame() {
      /*
      * A new game becomes the active session.
      */

      setActiveSession(true);

      setGame(null);
      setScreen("setup");
    }

    function handleLoadGame(
      saveId: string,
    ) {
      const savedGame =
        loadSavedGame(saveId);

      if (!savedGame) {
        console.error(
          "Saved game could not be loaded.",
        );

        return;
      }

      /*
      * Loading a saved game starts
      * an active session again.
      */

      setActiveSession(true);

      setGame(savedGame);
      setScreen("game");
    }

    function handleSaveGame(
      name: string,
      replaceId?: string,
    ) {
      if (!game) {
        return;
      }

      /*
      * ============================================================
      * REPLACE EXISTING SAVE
      * ============================================================
      */

      if (replaceId) {
        const updated =
          updateManualGame(
            replaceId,
            game,
            name,
          );

        if (!updated) {
          console.error(
            "Could not update saved game.",
          );

          return;
        }

        setSaveModalOpen(false);

        return;
      }

      /*
      * ============================================================
      * NEW SAVE
      * ============================================================
      *
      * Also protect against duplicate names if the user typed
      * an existing name instead of selecting it.
      */

      const existingSave =
        findManualSaveByName(
          name,
        );

      if (existingSave) {
        /*
        * The modal normally handles this when a save is selected.
        *
        * This fallback prevents accidental duplicate names if
        * the name was typed manually.
        */

        const confirmed =
          window.confirm(
            `"${existingSave.name}" already exists.\n\nReplace it?`,
          );

        if (!confirmed) {
          return;
        }

        updateManualGame(
          existingSave.id,
          game,
          name,
        );

        setSaveModalOpen(false);

        return;
      }

      /*
      * ============================================================
      * CREATE NEW SAVE
      * ============================================================
      */

      saveManualGame(
        game,
        name,
      );

      setSaveModalOpen(false);
    }

    function handleExitGame() {
      /*
      * Exit is the ONLY action that ends
      * the active session.
      *
      * Closing the browser or refreshing
      * does not come through here.
      */

      exitSavedSession();

      setGame(null);

      setDiceTest(null);
      setSpellTest(null);

      setPendingTestDecision(null);
      pendingTestDecisionRef.current = null;

      setScreen("home");
    }

    /*
    * ============================================================
    * HOME
    * ============================================================
    */

    if (screen === "home") {
      return (
        <HomeScreen
          onNewGame={
            handleNewGame
          }
          onContinueGame={
            handleLoadGame
          }
        />
      );
    }

    /*
    * ============================================================
    * SETUP
    * ============================================================
    */

    if (
      screen === "setup" ||
      !game
    ) {
      return (
        <InvestigatorSelection
          onContinue={
            handleContinue
          }
        />
      );
    }

  const currentGame =
    game;

  const activeInvestigator =
    game.activeInvestigatorId
      ? game.investigators[
          game.activeInvestigatorId
        ]
      : null;

  const travelDestinationIds =
    activeInvestigator?.travelActive
      ? getTravelReachableSpaces(
          game,
          eldritchBaseMap,
        ).map(
          (destination) =>
            destination.spaceId,
        )
      : [];

  const byakheeDestinationIds =
    game.pendingDecision?.type ===
      "select-space" &&
    game.pendingDecision.source ===
      "byakhee-move"
      ? game.pendingDecision.spaceIds
      : [];

  const mysteryDestinationIds =
    game.pendingDecision?.type ===
      "select-space" &&
    game.pendingDecision.source ===
      "mystery:nearest-clue"
      ? game.pendingDecision.spaceIds
      : [];

  /*
   * ============================================================
   * INVESTIGATORS
   * ============================================================
   */

  const allInvestigators =
    Object.values(
      game.investigators,
    );

  const tradeTargetInvestigators =
    activeInvestigator
      ? allInvestigators.filter(
          (investigator) =>
            investigator.id !==
              activeInvestigator.id &&
            investigator.spaceId ===
              activeInvestigator.spaceId,
        )
      : [];

  /*
   * ============================================================
   * LEFT / RIGHT
   * ============================================================
   */

  const leftInvestigators =
    allInvestigators.filter(
      (_, index) =>
        index % 2 === 0,
    );

  const rightInvestigators =
    allInvestigators.filter(
      (_, index) =>
        index % 2 === 1,
    );

  /*
   * ============================================================
   * INVESTIGATOR NAME
   * ============================================================
   */

  function getInvestigatorName(
    investigatorId: string,
  ) {
    const investigator =
      currentGame.investigators[
        investigatorId
      ];

    if (!investigator) {
      return investigatorId;
    }

    const definition =
      coreInvestigators.find(
        (item) =>
          item.id ===
          investigator.definitionId,
      );

    return (
      definition?.name ??
      investigatorId
    );
  }

  /*
   * ============================================================
   * INVESTIGATOR FRONT IMAGE
   * ============================================================
   */

  function getInvestigatorFrontImage(
    investigatorId: string,
  ) {
    const investigator =
      currentGame.investigators[
        investigatorId
      ];

    if (!investigator) {
      return "";
    }

    const definition =
      coreInvestigators.find(
        (item) =>
          item.id ===
          investigator.definitionId,
      );

    if (!definition) {
      return "";
    }

    const fileName =
      definition.name.replace(
        /\s+/g,
        "_",
      );

    return `/cards/investigators/${fileName}/${fileName}.png`;
  }

  /*
   * ============================================================
   * INVESTIGATOR CARD
   * ============================================================
   */

  function renderInvestigatorCard(
    investigatorId: string,
  ) {
    const investigator =
      currentGame.investigators[
        investigatorId
      ];

    if (!investigator) {
      return null;
    }

    const isActive =
      currentGame.activeInvestigatorId ===
      investigator.id;

    const isExpectedInvestigator =
      currentGame.investigatorOrder[
        currentGame.investigatorTurnIndex
      ] === investigator.id;

    const isActionPhase =
      currentGame.phase === "action";

    const hasAnyTravelActive =
      allInvestigators.some(
        (item) =>
          item.travelActive,
      );

    const canSelect =
      isActionPhase
        ? isExpectedInvestigator
        : isActive ||
          !hasAnyTravelActive;

    return (
      <InvestigatorCard
        isActive={isActive}
        canSelect={canSelect}
        isLead={
          currentGame.leadInvestigatorId ===
          investigator.id
        }

        turnOrder={
          currentGame.investigatorOrder.indexOf(
            investigator.id,
          ) + 1
        }
        investigatorName={getInvestigatorName(
          investigator.id,
        )}
        investigatorFrontImage={getInvestigatorFrontImage(
          investigator.id,
        )}
        actionsPerformed={
          investigator.actionsPerformed.length
        }
        onSelect={() =>
          handleSelectInvestigator(
            investigator.id,
          )
        }
        onOpenCards={() =>
          setCardsInvestigatorId(
            investigator.id,
          )
        }
      />
    );
  }

  /*
   * ============================================================
   * CARDS MODAL DATA
   * ============================================================
   */

  const cardsInvestigator =
    cardsInvestigatorId
      ? game.investigators[
          cardsInvestigatorId
        ]
      : null;

  const cardsInvestigatorDefinition =
    cardsInvestigator
      ? coreInvestigators.find(
          (definition) =>
            definition.id ===
            cardsInvestigator.definitionId,
        ) ?? null
      : null;

  const cardsInvestigatorAssets =
    cardsInvestigator
      ? coreAssets.filter(
          (asset) =>
            cardsInvestigator.assetIds.includes(
              asset.id,
            ),
        )
      : [];

  const cardsInvestigatorArtifacts =
    cardsInvestigator
      ? cardsInvestigator.artifactIds
          .map(
            (artifactId) =>
              game.artifacts[
                artifactId
              ],
          )
          .filter(
            (
              artifact,
            ): artifact is NonNullable<
              typeof artifact
            > =>
              artifact !== undefined,
          )
      : [];

  const cardsInvestigatorSpells =
    cardsInvestigator
      ? cardsInvestigator.spellIds
          .map(
            (spellId) =>
              game.spells[spellId],
          )
          .filter(
            (
              spell,
            ): spell is NonNullable<
              typeof spell
            > =>
              spell !== undefined,
          )
      : [];

  const cardsInvestigatorConditions =
    cardsInvestigator
      ? cardsInvestigator.conditionIds
          .map(
            (conditionId) =>
              game.conditions[
                conditionId
              ],
          )
          .filter(
            (
              condition,
            ): condition is NonNullable<
              typeof condition
            > =>
              condition !== undefined,
          )
      : [];

  /*
   * ============================================================
   * MAIN UI
   * ============================================================
   */

  return (
    <main className="min-h-screen w-full bg-[#111318] p-3 text-white">
      <div className="game-table-scale">

        {/* ================================================== */}
        {/* TOP */}
        {/* ================================================== */}

        <div className="w-full">
          <GameTableHeader
            game={game}
            onSave={() =>
              setSaveModalOpen(true)
            }
            onExit={
              handleExitGame
            }
          />
        </div>

        {/* ================================================== */}
        {/* MAP + SIDE INVESTIGATORS */}
        {/* ================================================== */}

        <div
          className="
            grid
            w-full
            grid-cols-[280px_minmax(700px,1fr)_280px]
            items-start
            gap-3
          "
        >

          {/* ================================================== */}
          {/* LEFT */}
          {/* ================================================== */}

          <aside className="min-w-0">
            <div className="grid grid-cols-2 gap-3">
              {leftInvestigators.map(
                (investigator) =>
                  renderInvestigatorCard(
                    investigator.id,
                  ),
              )}
            </div>
          </aside>

          {/* ================================================== */}
          {/* MAP + ACTIONS */}
          {/* ================================================== */}

          <section className="min-w-0">

            {/* MAP */}

            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={
                  handleTestSpawnMonsters
                }
                className="
                  rounded-lg
                  border
                  border-red-400/40
                  bg-red-500/10
                  px-3
                  py-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-red-300
                  transition
                  hover:bg-red-500/20
                "
              >
                TEST — SPAWN MONSTERS
              </button>
            </div>

            <GameBoard
              game={game}
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
                handleSelectSpace
              }
              onSelectByakheeSpace={
                handleSelectByakheeSpace
              }
              onInspectSpace={
                handleInspectSpace
              }
              doom={
                game.ancientOne.doom
              }
            />

            {/* ACTIONS */}

            {activeInvestigator && (
              <div className="mt-3">
                <InvestigatorActionsPanel
                  investigator={
                    activeInvestigator
                  }

                  canTravel={
                    !activeInvestigator.travelActive &&
                    activeInvestigator.actionsPerformed.length < 2
                  }

                  canRest={
                    !activeInvestigator.travelActive &&
                    activeInvestigator.actionsPerformed.length < 2 &&
                    !activeInvestigator.actionsPerformed.includes(
                      "rest",
                    )
                  }

                  canPrepareForTravel={
                    !activeInvestigator.travelActive &&
                    activeInvestigator.actionsPerformed.length < 2 &&
                    !activeInvestigator.actionsPerformed.includes(
                      "prepare-for-travel",
                    ) &&
                    eldritchBaseMap.spaces.some(
                      (space) =>
                        space.id ===
                          activeInvestigator.spaceId &&
                        space.type ===
                          "city",
                    )
                  }

                  canTrade={
                    !activeInvestigator.travelActive &&
                    activeInvestigator.actionsPerformed.length < 2 &&
                    !activeInvestigator.actionsPerformed.includes(
                      "trade",
                    ) &&
                    Object.values(
                      game.investigators,
                    ).some(
                      (other) =>
                        other.id !==
                          activeInvestigator.id &&
                        other.spaceId ===
                          activeInvestigator.spaceId,
                    )
                  }

                  canAcquireAssets={
                    !activeInvestigator.travelActive &&
                    activeInvestigator.actionsPerformed.length < 2 &&
                    !activeInvestigator.actionsPerformed.includes(
                      "acquire-assets",
                    ) &&
                    eldritchBaseMap.spaces.some(
                      (space) =>
                        space.id ===
                          activeInvestigator.spaceId &&
                        space.type ===
                          "city",
                    )
                  }

                  onStartTravel={
                    handleStartTravel
                  }

                  onRest={
                    handleRest
                  }

                  onPrepareForTravel={
                    handlePrepareForTravel
                  }

                  onTrade={
                    handleOpenTrade
                  }

                  onAcquireAssets={
                    handleAcquireAssets
                  }

                  onEndTravel={
                    handleEndTravel
                  }

                  onUndoTravel={
                    handleUndoTravel
                  }

                  onEndActions={
                    handleEndInvestigatorActions
                  }
                />
              </div>
            )}

          </section>

          {/* ================================================== */}
          {/* RIGHT */}
          {/* ================================================== */}

          <aside className="min-w-0">
            <div className="grid grid-cols-2 gap-3">
              {rightInvestigators.map(
                (investigator) =>
                  renderInvestigatorCard(
                    investigator.id,
                  ),
              )}
            </div>
          </aside>

        </div>

        {/* ================================================== */}
        {/* ACTIVE INVESTIGATOR + POSSESSIONS */}
        {/* ================================================== */}

        {activeInvestigator && (
          <ActiveInvestigatorPanel
            investigator={activeInvestigator}

            investigatorName={
              getInvestigatorName(
                activeInvestigator.id,
              )
            }

            investigatorPortrait={
              getInvestigatorPortrait(
                activeInvestigator.id,
              )
            }

            assets={
              coreAssets.filter(
                (asset) =>
                  activeInvestigator.assetIds.includes(
                    asset.id,
                  ),
              )
            }

            artifacts={
              activeInvestigator.artifactIds
                .map(
                  (artifactId) =>
                    game.artifacts[artifactId],
                )
                .filter(
                  (
                    artifact,
                  ): artifact is NonNullable<
                    typeof artifact
                  > =>
                    artifact !== undefined,
                )
            }

            spells={
              activeInvestigator.spellIds
                .map(
                  (spellId) =>
                    game.spells[spellId],
                )
                .filter(
                  (
                    spell,
                  ): spell is NonNullable<
                    typeof spell
                  > =>
                    spell !== undefined,
                )
            }

            conditions={
              activeInvestigator.conditionIds
                .map(
                  (conditionId) =>
                    game.conditions[conditionId],
                )
                .filter(
                  (
                    condition,
                  ): condition is NonNullable<
                    typeof condition
                  > =>
                    condition !== undefined,
                )
            }

            onOpenCards={() =>
              setCardsInvestigatorId(
                activeInvestigator.id,
              )
            }
          />
        )}

        {/* ================================================== */}
        {/* ENCOUNTER PHASE */}
        {/* ================================================== */}

        <EncounterPhasePanel
          investigatorName={
            activeInvestigator
              ? getInvestigatorName(
                  activeInvestigator.id,
                )
              : ""
          }

          investigatorPortrait={
            activeInvestigator
              ? getInvestigatorPortrait(
                  activeInvestigator.id,
                )
              : ""
          }

          showStartEncounter={
            game.phase === "encounter" &&
            !!activeInvestigator &&
            !game.currentEncounterId &&
            !game.pendingDecision &&
            !game.pendingEncounterChoice &&
            !game.pendingSpellChoice &&
            !diceTest &&
            !spellTest &&
            !encounterStartedForTurn
          }

          showEndEncounter={
            game.phase === "encounter" &&
            encounterStartedForTurn &&
            !game.currentEncounterId &&
            !game.pendingDecision &&
            !game.pendingEncounterChoice &&
            !game.pendingSpellChoice &&
            !diceTest &&
            !spellTest
          }

          onStartEncounter={
            handleStartEncounter
          }

          onEndEncounter={
            handleEndInvestigatorEncounter
          }
        />

        {/* ================================================== */}
        {/* MONSTER ABILITY — SINGLE DIE */}
        {/* ================================================== */}

        {singleDieRoll !== null && (
          <DiceRollModal
            results={[
              singleDieRoll,
            ]}
            title="ROLL 1 DIE"
            onComplete={
              handleCompleteMonsterSingleDieRoll
            }
          />
        )}

        {/* ================================================== */}
        {/* DICE MODAL */}
        {/* ================================================== */}

        {diceTest && (
          <DiceRollModal
            results={
              diceTest.results
            }
            title={`Teste de ${diceTest.skill}`}
            onComplete={
              handleCompleteDiceTest
            }
          />
        )}

        {/* ================================================== */}
        {/* SPELL TEST */}
        {/* ================================================== */}

        {spellTest && (
          <DiceRollModal
            results={
              spellTest.results
            }
            title={`Teste de ${spellTest.skill}`}
            onComplete={
              handleCompleteSpellTest
            }
          />
        )}

        {/* ================================================== */}
        {/* SPELL PREVIEW */}
        {/* ================================================== */}

        {spellPreviewId &&
          game.spells[spellPreviewId] && (
            <SpellPreviewModal
              image={
                game.spells[
                  spellPreviewId
                ].backImage
              }
              onClose={
                handleCloseSpellPreview
              }
            />
          )}

        {/* ================================================== */}
        {/* ASSET RESERVE */}
        {/* ================================================== */}

        {assetReserveOpen &&
          game.lastTest && (
            <AssetReserveModal
              assets={
                game.board.assetReserve
              }

              successes={
                game.lastTest
                  .successes
              }

              resources={
                activeInvestigator?.resources ??
                0
              }

              selectedAssetIds={
                selectedAssetIds
              }

              useBankLoan={
                useBankLoan
              }

              onToggleAsset={
                handleToggleAsset
              }

              onToggleBankLoan={() =>
                setUseBankLoan(
                  (current) => !current,
                )
              }

              onConfirm={
                handleConfirmAcquireAssets
              }

              onClose={
                handleCloseAssetReserve
              }

              onDiscard={
                handleDiscardAsset
              }
            />
          )}

        {/* ================================================== */}
        {/* GAME FLOW */}
        {/* ================================================== */}

        {game.pendingDecision &&
          singleDieRoll === null &&
          !(
            game.pendingDecision.type ===
              "select-space" &&
            game.pendingDecision.source ===
              "byakhee-move"
          ) && (
            <GameFlowOverlay
              game={game}
              decision={
                game.pendingDecision
              }
              onContinue={
                handleFlowContinue
              }
              onChoice={
                handleFlowChoice
              }
              onSelectSpace={
                handleFlowSelectSpace
              }
              onSelectInvestigator={
                handleFlowSelectInvestigator
              }
              onSelectCard={
                handleFlowSelectCard
              }
              onRollTest={
                handleFlowRollTest
              }
              onSingleDieRoll={
                handleSingleDieRoll
              }
              onCombat={
                handleFlowCombat
              }
              onMonsterAbility={
                handleMonsterAbility
              }
              onMonsterAbilitySkip={
                handleMonsterAbilitySkip
              }
              onResolveMonsterReckoning={
                handleResolveMonsterReckoning
              }
              onResolveAncientOneReckoning={
                handleResolveAncientOneReckoning
              }
              onSelectCombatOrderMonster={
                handleSelectCombatOrderMonster
              }
              onConfirmCombatOrder={
                handleConfirmCombatOrder
              }
              onDiscardYogSothothSpell={
                handleDiscardYogSothothSpell
              }
              onAdvanceYogSothothDoom={
                handleAdvanceYogSothothDoom
              }
            />
          )}

        {/* ================================================== */}
        {/* TRADE TARGET */}
        {/* ================================================== */}

        {tradeTargetSelectionOpen &&
          activeInvestigator && (
            <TradeTargetModal
              investigators={
                tradeTargetInvestigators
              }

              investigatorNames={
                Object.fromEntries(
                  tradeTargetInvestigators.map(
                    (investigator) => [
                      investigator.id,
                      getInvestigatorName(
                        investigator.id,
                      ),
                    ],
                  ),
                )
              }

              investigatorImages={
                Object.fromEntries(
                  tradeTargetInvestigators.map(
                    (investigator) => [
                      investigator.id,
                      getInvestigatorFrontImage(
                        investigator.id,
                      ),
                    ],
                  ),
                )
              }

              onSelect={
                handleSelectTradeTarget
              }

              onCancel={
                handleCancelTrade
              }
            />
          )}

        {/* ================================================== */}
        {/* TRADE */}
        {/* ================================================== */}

        {tradeOpen &&
          activeInvestigator &&
          tradeTargetId && (
            <TradeModal
              investigatorName={
                getInvestigatorName(
                  activeInvestigator.id,
                )
              }

              targetInvestigatorName={
                getInvestigatorName(
                  tradeTargetId,
                )
              }

              investigatorClues={
                activeInvestigator.clues
              }

              investigatorTrainTickets={
                activeInvestigator.trainTickets
              }

              investigatorShipTickets={
                activeInvestigator.shipTickets
              }

              targetClues={
                game.investigators[
                  tradeTargetId
                ]?.clues ?? 0
              }

              targetTrainTickets={
                game.investigators[
                  tradeTargetId
                ]?.trainTickets ?? 0
              }

              targetShipTickets={
                game.investigators[
                  tradeTargetId
                ]?.shipTickets ?? 0
              }

              assets={
                coreAssets.filter(
                  (asset) =>
                    activeInvestigator.assetIds.includes(
                      asset.id,
                    ),
                )
              }

              artifacts={
                activeInvestigator.artifactIds
                  .map(
                    (artifactId) =>
                      game.artifacts[
                        artifactId
                      ],
                  )
                  .filter(
                    (
                      artifact,
                    ): artifact is NonNullable<
                      typeof artifact
                    > =>
                      artifact !==
                      undefined,
                  )
              }

              spells={
                activeInvestigator.spellIds
                  .map(
                    (spellId) =>
                      game.spells[
                        spellId
                      ],
                  )
                  .filter(
                    (
                      spell,
                    ): spell is NonNullable<
                      typeof spell
                    > =>
                      spell !==
                      undefined,
                  )
              }

              targetAssets={
                coreAssets.filter(
                  (asset) =>
                    game.investigators[
                      tradeTargetId
                    ]?.assetIds.includes(
                      asset.id,
                    ),
                )
              }

              targetArtifacts={
                (
                  game.investigators[
                    tradeTargetId
                  ]?.artifactIds ?? []
                )
                  .map(
                    (artifactId) =>
                      game.artifacts[
                        artifactId
                      ],
                  )
                  .filter(
                    (
                      artifact,
                    ): artifact is NonNullable<
                      typeof artifact
                    > =>
                      artifact !==
                      undefined,
                  )
              }

              targetSpells={
                (
                  game.investigators[
                    tradeTargetId
                  ]?.spellIds ?? []
                )
                  .map(
                    (spellId) =>
                      game.spells[
                        spellId
                      ],
                  )
                  .filter(
                    (
                      spell,
                    ): spell is NonNullable<
                      typeof spell
                    > =>
                      spell !==
                      undefined,
                  )
              }

              onTrade={
                handleTrade
              }

              onCancel={
                handleCancelTrade
              }
            />
          )}

        {/* ================================================== */}
        {/* PREPARE FOR TRAVEL */}
        {/* ================================================== */}

        {prepareForTravelChoice && (
          <PrepareForTravelModal
            onChooseTrain={() =>
              handleChooseTravelTicket(
                "train",
              )
            }
            onChooseShip={() =>
              handleChooseTravelTicket(
                "ship",
              )
            }
            onCancel={() =>
              setPrepareForTravelChoice(
                false,
              )
            }
          />
        )}

        {/* ================================================== */}
        {/* SPELL CHOICE */}
        {/* ================================================== */}

        {game.pendingSpellChoice?.type ===
          "choose-investigator" && (
          <SpellChoiceModal
            investigators={Object.values(
              game.investigators,
            )}

            casterId={
              game
                .pendingSpellChoice
                .investigatorId
            }

            location={
              game
                .pendingSpellChoice
                .location
            }

            excludeConditionDefinitionId={
              game
                .pendingSpellChoice
                .excludeConditionDefinitionId
            }

            conditions={
              game.conditions
            }

            onChoose={
              handleSpellChoice
            }
          />
        )}

        {/* ================================================== */}
        {/* INVESTIGATOR CARDS MODAL */}
        {/* ================================================== */}

        {cardsInvestigatorId &&
          cardsInvestigator &&
          cardsInvestigatorDefinition && (
            <InvestigatorCardsModal
              investigator={
                cardsInvestigator
              }

              definition={
                cardsInvestigatorDefinition
              }

              assets={
                cardsInvestigatorAssets
              }

              artifacts={
                cardsInvestigatorArtifacts
              }

              spells={
                cardsInvestigatorSpells
              }

              spellDefinitions={
                coreSpells
              }

              conditions={
                cardsInvestigatorConditions
              }

              onClose={() =>
                setCardsInvestigatorId(
                  null,
                )
              }
            />
          )}
        
        {/* ================================================== */}
        {/* SPACE INSPECTION */}
        {/* ================================================== */}

        {inspectedSpaceId && (
          <SpaceInspectModal
            game={game}
            spaceId={inspectedSpaceId}
            onClose={() =>
              setInspectedSpaceId(null)
            }
          />
        )}
        
        {/* ================================================== */}
        {/* SAVE GAME */}
        {/* ================================================== */}

        {saveModalOpen && (
          <SaveGameModal
            onClose={() =>
              setSaveModalOpen(false)
            }

            onSave={(name) => {
              handleSaveGame(name);
              setSaveModalOpen(false);
            }}
          />
        )}

      </div>
    </main>
  );
}

export default App;