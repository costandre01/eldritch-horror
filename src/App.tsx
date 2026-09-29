import { getActionSpellOptions, getCombatSpellOptions, getEncounterSpellOptions } from "./game/engine/encounterSpellWindow";
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
import { discardAssetFromReserve } from "./game/engine/discardAssetFromReserve";

import { resolveSpellChoice } from "./game/engine/resolveSpellChoice";
import { resolveSpellFrontEffects } from "./game/engine/resolveSpellFrontEffects";
import { resolveSpellBackChoice } from "./game/engine/resolveSpellBackChoice";
import { resolveSpell } from "./game/engine/resolveSpell";
import { getSpellLossPrevention } from "./game/engine/getSpellLossPrevention";
import { activatePossessionAbility } from "./game/engine/activatePossessionAbility";
import { canPerformAction } from "./game/engine/canPerformAction";

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
import type { TestRerollAbility } from "./game/models/Asset";
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
import { startNextRoundAfterMythos } from "./game/engine/startNextRoundAfterMythos";
import GameEndModal from "./components/game/modals/GameEndModal";
import { resolveDefeatedInvestigatorReplacement } from "./game/engine/resolveDefeatedInvestigatorReplacement.ts";
import { getConditionLocalActions, hasDetainedActionRestriction, resolveConditionLocalActionTest, startConditionLocalAction } from "./game/engine/conditionLocalAction";
import { continueDarkPower } from "./game/engine/continueDarkPower.ts";
import { gainInvestigatorClues, spendInvestigatorClues } from "./game/engine/clueEngine";
import { CORE_MONSTERS } from "./content/core/coreMonsters";
import { CORE_EPIC_MONSTERS } from "./content/core/coreEpicMonsters";
import { getImprovableSkills, startNextStartingImprovement } from "./game/engine/improvementEngine";

interface TestRerollOption {
  id: string;
  name: string;
  amount: number;
  image?: string;
  description?: string;
  resultModifier?: number;
  sanityCost?: number;
  rerollEachDieOnce?: boolean;
  paymentGroupSize?: number;
}

function getTestRerollOptions(
  game: GameState,
  decision: Extract<PendingDecision, { type: "test" }>,
  axePaidThisTest = false,
): TestRerollOption[] {
  const investigator = game.investigators[decision.investigatorId];
  if (!investigator) return [];

  const combatTest = decision.source?.startsWith("combat:") ?? false;
  const combatMonsterId = combatTest ? decision.source?.split(":")[2] : undefined;
  const combatMonster = combatMonsterId ? game.monsters[combatMonsterId] : undefined;
  const combatMonsterDefinition = combatMonster
    ? [...CORE_MONSTERS, ...CORE_EPIC_MONSTERS].find(
        (definition) => definition.id === combatMonster.definitionId,
      )
    : undefined;
  const cluesBlocked = combatTest && [
    combatMonsterDefinition,
    ...investigator.engagedMonsterIds.map((monsterId) => {
      const monster = game.monsters[monsterId];
      return monster
        ? [...CORE_MONSTERS, ...CORE_EPIC_MONSTERS].find(
            (definition) => definition.id === monster.definitionId,
          )
        : undefined;
    }),
  ].some((definition) => definition?.specialAbilities?.some(
    (ability) => ability.type === "cannot-spend-clues-to-reroll",
  ));
  const clueRerollsPerSpend = Object.values(game.investigators).some(
    (candidate) =>
      candidate.definitionId === "trish-scarborough" &&
      candidate.spaceId !== null &&
      candidate.spaceId === investigator.spaceId,
  ) ? 2 : 1;
  const cards = [
    ...investigator.assetIds.map((id) => game.assets[id]).filter(Boolean),
    ...investigator.artifactIds.map((id) => game.artifacts[id]).filter(Boolean),
  ];

  return (cards.flatMap((card) =>
    (card.testRerolls ?? []).flatMap((ability: TestRerollAbility, index: number) => {
      if (ability.sanityCost && !axePaidThisTest && investigator.sanity <= ability.sanityCost) return [];
      if (ability.oncePerRound && game.cardRerollUsedRound?.[`${card.id}:${index}`] === game.round) return [];
      if (ability.otherWorldOnly && !game.currentEncounterId?.startsWith("other-world-encounter")) return [];
      if (ability.skill && ability.skill !== decision.skill) return [];
      if (ability.combatOnly && !combatTest) return [];
      return [{
        id: `${card.id}:${index}`,
        name: card.name,
        image: card.image,
        description: card.description,
        amount: ability.rerollEachDieOnce ? 99 : ability.amount,
        ...(ability.sanityCost && !axePaidThisTest ? { sanityCost: ability.sanityCost } : {}),
        ...(ability.rerollEachDieOnce ? { rerollEachDieOnce: true } : {}),
        ...(ability.resultModifier !== undefined ? { resultModifier: ability.resultModifier } : {}),
      }];
    }),
  ) as TestRerollOption[]).concat(
    (game.activeTestRerolls ?? [])
      .filter((ability) => ability.investigatorId === investigator.id)
      .filter((ability) => ability.skill === decision.skill)
      .filter((ability) => ability.duration !== "this-combat-encounter" || combatTest)
      .map((ability) => {
        const spellId = ability.id.split(":")[1];
        const spell = spellId ? game.spells[spellId] : undefined;
        const definition = spell && coreSpells.find((candidate) => candidate.id === spell.definitionId);
        return {
          id: ability.id,
          name: definition?.name ?? "Spell",
          image: spell?.frontImage,
          description: definition?.description ?? "Reroll dice as indicated by this Spell effect.",
          amount: ability.amount,
        };
      }),
  ).concat(
    investigator.clues > 0 && !cluesBlocked
      ? [{
          id: "clue-reroll",
          name: "Clue",
          image: "/icons/game/clue.png",
          description: clueRerollsPerSpend === 2
            ? "Spend 1 Clue to reroll up to 2 dice (Trish Scarborough)."
            : "Spend 1 Clue to reroll 1 die.",
          amount: investigator.clues * clueRerollsPerSpend,
          paymentGroupSize: clueRerollsPerSpend,
        }]
      : [],
  );
}


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
  const [axePaidThisTest, setAxePaidThisTest] = useState(false);

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
  const [encounterSpellPrompt, setEncounterSpellPrompt] = useState(false);
  const [combatSpellPrompt, setCombatSpellPrompt] = useState(false);
  const [spellTestEffectIndex, setSpellTestEffectIndex] = useState<number | null>(null);

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
  const [brainCaseTrade, setBrainCaseTrade] = useState(false);

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

  const [
    encounterTurnIndex,
    setEncounterTurnIndex,
  ] = useState<number | null>(null);

  const [inspectedSpaceId, setInspectedSpaceId] =
    useState<string | null>(null);

  const gamePhase = game?.phase;
  const investigatorTurnIndex = game?.investigatorTurnIndex;

  useEffect(() => {
    if (gamePhase === undefined) {
      return;
    }

    if (gamePhase !== "encounter") {
      setEncounterTurnIndex(null);
      setEncounterStartedForTurn(false);
      return;
    }

    if (
      encounterTurnIndex !== null &&
      investigatorTurnIndex !==
        encounterTurnIndex
    ) {
      setEncounterStartedForTurn(false);
      setEncounterTurnIndex(null);
    }
  }, [
    gamePhase,
    investigatorTurnIndex,
    encounterTurnIndex,
  ]);

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
    setBrainCaseTrade(false);
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
      const resolvingSpellId = game.pendingSpellChoice?.spellId;
      const updatedGame =
        resolveSpellChoice(
          game,
          selectedId,
        );

      setGame(updatedGame);
      if (resolvingSpellId && !updatedGame.pendingSpellChoice && updatedGame.spells[resolvingSpellId]?.pendingTestResult) {
        setSpellPreviewId(resolvingSpellId);
      }
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function getSpellChoiceOptions(currentGame: GameState) {
    const choice = currentGame.pendingSpellChoice;
    if (!choice || choice.type === "choose-investigator") return undefined;
    const labelSpaces = new Map(eldritchBaseMap.spaces.map((space) => [space.id, space.name]));
    if (choice.type === "choose-monster") {
      const owner = currentGame.investigators[choice.investigatorId];
      const ids = owner?.spaceId ? currentGame.board.spaces[owner.spaceId]?.monsterIds ?? [] : [];
      return ids.map((id) => ({ id, label: currentGame.monsters[id]?.definitionId ?? "Monster" }));
    }
    if (choice.type === "choose-skill") {
      const effect = choice.effects.find((item) => item.type === "improve-skill");
      const spell = currentGame.spells[choice.spellId];
      const targetId = effect?.type === "improve-skill" && effect.target === "chosen-investigator"
        ? spell?.pendingChosenInvestigatorId
        : choice.investigatorId;
      const target = targetId ? currentGame.investigators[targetId] : undefined;
      return (target ? getImprovableSkills(target) : []).map((skill) => ({
        id: skill,
        label: skill[0].toUpperCase() + skill.slice(1),
      }));
    }
    if (choice.type === "choose-asset") {
      const maxValue = choice.maxValueFromTestResult
        ? currentGame.spells[choice.spellId]?.pendingTestResult?.successes ?? 0
        : Number.POSITIVE_INFINITY;
      const options = currentGame.board.assetReserve
        .filter((asset) => choice.assetTypes?.includes(asset.type as "item" | "trinket"))
        .filter((asset) => asset.value <= maxValue)
        .map((asset) => ({ id: asset.id, label: asset.name, description: `Value ${asset.value}` }));
      return choice.optional
        ? [...options, { id: "skip-spell-choice", label: "Do not gain an Asset", description: "Continue without choosing an Asset." }]
        : options;
    }
    if (choice.type === "choose-space") {
      return eldritchBaseMap.spaces.map((space) => ({ id: space.id, label: space.name }));
    }
    if (choice.type === "choose-clue") {
      const options = Object.values(currentGame.board.spaces).flatMap((space) =>
        space.clueTokenIds.map((id) => ({ id, label: `Clue at ${labelSpaces.get(space.spaceId) ?? space.spaceId}` })),
      );
      return choice.optional
        ? [...options, { id: "skip-spell-choice", label: "Do not encounter a Clue", description: "Continue with the normal Encounter flow." }]
        : options;
    }
    if (choice.type === "choose-encounter") {
      return [{ id: "resolve-encounter", label: "Resolve an Encounter", description: "Ignore Monsters for this Encounter." }, { id: "encounter-monsters", label: "Encounter Monsters normally", description: "Do not ignore the Monsters on your space." }];
    }
    return [];
  }

  function handleActivateSpell(spellId: string, frontEffectIndex: number) {
    if (!game) return;
    const investigatorId = game.activeInvestigatorId;
    if (!investigatorId) return;
    const spell = game.spells[spellId];
    const investigator = game.investigators[investigatorId];
    const definition = spell && coreSpells.find((item) => item.id === spell.definitionId);
    const effect = definition?.frontEffects[frontEffectIndex];
    if (!spell || !investigator || !definition || !effect || spell.flipped || !investigator.spellIds.includes(spellId)) return;
    if (effect.type === "action-test") {
      if (
        game.phase !== "action" ||
        investigator.isDelayed ||
        investigator.actionsPerformed.length >= 2 + (investigator.additionalActionsThisRound ?? 0)
      ) return;
    } else if (effect.type === "on-encounter-phase" || effect.type === "on-combat-encounter") {
      if (game.phase !== "encounter") return;
    } else {
      // Health/Sanity-loss effects are reaction abilities and are resolved by
      // the loss event, never as a freely activated test from the card panel.
      return;
    }
    try {
      const result = resolveSpellFrontEffects(game, investigatorId, spellId, effect, eldritchBaseMap, {
        deferTriggeredEffects: true,
      });
      let resolvedGame = effect.type === "action-test"
        ? {
            ...result.game,
            investigators: {
              ...result.game.investigators,
              [investigatorId]: {
                ...result.game.investigators[investigatorId],
                actionsPerformed: [...result.game.investigators[investigatorId].actionsPerformed, "component" as const],
              },
            },
          }
          : result.game;
      if (effect.type === "on-combat-encounter" && game.pendingDecision?.type === "combat") {
        resolvedGame = {
          ...resolvedGame,
          combatSpellUsedRound: {
            ...resolvedGame.combatSpellUsedRound,
            [`${spellId}:${game.pendingDecision.monsterId}`]: game.round,
          },
        };
      }
      setGame(resolvedGame);
      if (result.testResult) {
        setAxePaidThisTest(false);
        setSpellTest(result.testResult);
        setSpellTestSpellId(spellId);
        setSpellTestEffectIndex(frontEffectIndex);
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
    }
  }

  function handleActivatePossession(kind: "asset" | "artifact", cardId: string, ability: string) {
    if (!game?.activeInvestigatorId) return;
    if (kind === "artifact" && cardId === "mi-go-brain-case" && ability === "action") {
      if (hasDetainedActionRestriction(game, game.activeInvestigatorId)) return;
      const investigator = game.investigators[game.activeInvestigatorId];
      if (!investigator || game.phase !== "action" || !canPerformAction(investigator, "component")) return;
      setBrainCaseTrade(true);
      setTradeTargetId(null);
      setTradeTargetSelectionOpen(true);
      return;
    }
    try {
      const updated = activatePossessionAbility(
        game,
        game.activeInvestigatorId,
        kind,
        cardId,
        ability as "action" | "combat" | "free-action" | "action-heal" | "encounter",
        eldritchBaseMap,
      );
      setGame(updated);
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
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
    let hasPendingSpellChoice = false;

    if (game && spellTest && spellTestEffectIndex !== null) {
      const investigatorId = game.activeInvestigatorId;
      const spell = game.spells[spellId];
      const definition = spell && coreSpells.find((item) => item.id === spell.definitionId);
      const effect = definition?.frontEffects[spellTestEffectIndex];
      if (investigatorId && effect) {
        const result = resolveSpellFrontEffects(game, investigatorId, spellId, effect, eldritchBaseMap, {
          testResultOverride: spellTest,
        });
        hasPendingSpellChoice = !!result.game.pendingSpellChoice;
        setGame(result.game);
      }
    }

    setSpellTest(null);
    setSpellTestSpellId(null);
    setSpellTestEffectIndex(null);

    if (!hasPendingSpellChoice) setSpellPreviewId(spellId);
  }

  /*
   * ============================================================
   * CLOSE SPELL PREVIEW
   * ============================================================
   */

  function handleCloseSpellPreview() {
    if (!spellPreviewId) return;
    setSpellPreviewId(null);
  }

  function handleResolveSpellBack() {
    if (!game || !spellPreviewId) return;
    const spell = game.spells[spellPreviewId];
    const investigatorId = Object.values(game.investigators).find((investigator) => investigator.spellIds.includes(spellPreviewId))?.id;
    if (!spell || !spell.pendingTestResult || !investigatorId) return;
    try {
      const updatedGame = resolveSpell(game, investigatorId, spellPreviewId);
      setGame(updatedGame);
      setSpellPreviewId(null);
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
    }
  }

  /*
   * ============================================================
   * ENCOUNTER
   * ============================================================
   */

  function handleStartEncounter(skipSpellPrompt = false) {
    if (!game) {
      return;
    }

    if (!skipSpellPrompt && getEncounterSpellOptions(game).length > 0) {
      setEncounterSpellPrompt(true);
      return;
    }
    setEncounterSpellPrompt(false);

    try {
      const updatedGame =
        startInvestigatorEncounter(
          game,
          eldritchBaseMap,
        );

      setGame(updatedGame);

      setEncounterStartedForTurn(true);

      setEncounterTurnIndex(
        game.investigatorTurnIndex,
      );

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
        discardAssetFromReserve(
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
      const activeId = game.activeInvestigatorId;
      const target = game.investigators[tradeTargetId];
      const targetPreviousSpace = target?.spaceId ?? null;
      const updatedGame =
        tradeInvestigator(
          game,
          tradeTargetId,
          offer,
          { brainCase: brainCaseTrade },
        );

      setGame(brainCaseTrade && activeId && target
        ? {
            ...updatedGame,
            pendingDecision: {
              type: "choice",
              title: "Mi-Go Brain Case",
              message: "The other investigator may move to your space. If he does, you move to his previous space.",
              options: [
                { id: `brain-case:move:${activeId}:${tradeTargetId}:${targetPreviousSpace ?? ""}`, title: "Swap spaces" },
                { id: "brain-case:stay", title: "Stay where you are" },
              ],
              source: "artifact:mi-go-brain-case",
            },
          }
        : updatedGame);
      setTradeTargetId(null);
      setTradeOpen(false);
      setBrainCaseTrade(false);
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
    setBrainCaseTrade(false);
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
        restInvestigator(game, eldritchBaseMap);

      setGame(updatedGame);
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }

  function handleConditionLocalAction(conditionId: string) {
    if (!game) return;
    try {
      const result = startConditionLocalAction(game, conditionId, eldritchBaseMap);
      const investigatorId = result.game.activeInvestigatorId;
      if (!investigatorId) return;
      const condition = result.game.conditions[conditionId];
      const conditionName = condition
        ? getConditionLocalActions(result.game, investigatorId).find((action) => action.condition.id === conditionId)?.conditionName
        : undefined;
      const decision: PendingDecision = {
        type: "test",
        title: `${conditionName ?? "Condition"} Local Action`,
        message: `Test ${result.effect.testType}. If you pass, resolve this Condition's Local Action.`,
        skill: result.effect.testType,
        modifier: "modifier" in result.effect ? result.effect.modifier ?? 0 : 0,
        investigatorId,
        source: `condition-local-action:${conditionId}`,
      };
      pendingTestDecisionRef.current = decision;
      setPendingTestDecision(decision);
      setGame(result.game);
      setDiceTest(result.test);
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
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
     * GENERIC PENDING SPACE SELECTION
     * ============================================================
     *
     * Any select-space decision is resolved through
     * the main map instead of normal investigator travel.
     */
    if (
      game.pendingDecision?.type ===
      "select-space"
    ) {
      const decision =
        game.pendingDecision;

      if (
        !decision.spaceIds.includes(
          spaceId,
        )
      ) {
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
          "Error resolving pending space selection:",
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
      const updatedGame = game.pendingSpellBackResolution
        ? resolveSpellBackChoice(game, choiceId)
        : resolveGameFlowChoice(game, choiceId, eldritchBaseMap);

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
      !decision.investigatorIds.includes(
        investigatorId,
      )
    ) {
      return;
    }

    try {
      /*
      * ========================================================
      * INITIAL GAME SETUP
      * ========================================================
      */

      if (
        decision.source ===
        "setup:lead-investigator"
      ) {
        const updatedGame = startNextStartingImprovement(
          setLeadInvestigator(
            game,
            investigatorId,
          ),
        );

        setGame(updatedGame);

        return;
      }

      /*
      * ========================================================
      * END OF MYTHOS
      * ========================================================
      *
      * The selected investigator becomes the Lead
      * and immediately starts the next Action Phase.
      */

      if (
        decision.source ===
        "mythos:end-lead"
      ) {
        const updatedGame =
          startNextRoundAfterMythos(
            game,
            investigatorId,
          );

        setGame(updatedGame);

        return;
      }

      /*
       * ========================================================
       * LEAD INVESTIGATOR DEFEATED
       * ========================================================
       *
       * The Lead Investigator was defeated during
       * the current phase.
       *
       * A new Lead is selected immediately.
       * The current phase is NOT restarted.
       */

      if (
        decision.source ===
        "defeat:lead"
      ) {
        const resumePendingDecision =
          decision.resume?.pendingDecision ??
          null;

        const defeatResume =
          decision.resume?.defeatResume;

        const updatedGame =
          setLeadInvestigator(
            game,
            investigatorId,
          );

        /*
        * ========================================================
        * RESUME INTERRUPTED MYTHOS SPECIAL
        * ========================================================
        */
        if (
          defeatResume?.type ===
          "mythos-special"
        ) {
          const mythos =
            [
              ...easyMythos,
              ...normalMythos,
              ...hardMythos,
            ].find(
              (definition) =>
                definition.id ===
                defeatResume.mythosId,
            );

          if (!mythos) {
            throw new Error(
              `Mythos "${defeatResume.mythosId}" does not exist.`,
            );
          }

          const resumedGame =
            resolveMythosSpecial(
              {
                ...updatedGame,
                activeInvestigatorId:
                  null,
                pendingDecision:
                  null,
              },
              mythos,
              defeatResume.step,
              eldritchBaseMap,
            );

          setGame(resumedGame);

          return;
        }

        /*
        * ========================================================
        * RESUME A DARK POWER
        * ========================================================
        *
        * The defeated Investigator was the Lead Investigator.
        *
        * A new Lead has now been selected, so the defeat is
        * completely resolved and A Dark Power can continue
        * with the next applicable Investigator.
        */

        if (
          defeatResume?.type ===
          "mythos-dark-power"
        ) {
          const resumedGame =
            continueDarkPower(
              {
                ...updatedGame,

                activeInvestigatorId:
                  null,

                pendingDecision:
                  null,

                combatOrder:
                  null,
              },
              defeatResume,
            );

          setGame(resumedGame);

          return;
        }

        /*
        * ========================================================
        * RESUME NORMAL INTERRUPTED FLOW
        * ========================================================
        */
        setGame({
          ...updatedGame,
          activeInvestigatorId:
            null,
          pendingDecision:
            resumePendingDecision,
        });

        return;
      }

      /*
      * ========================================================
      * DEFEATED INVESTIGATOR REPLACEMENT
      * ========================================================
      *
      * The replacement is chosen at the end of the
      * Mythos Phase. It does NOT start a new round yet.
      */

      if (
        decision.source?.startsWith(
          "mythos:defeated-replacement:",
        )
      ) {
        const defeatedInvestigatorId =
          decision.source.split(":")[2];

        if (!defeatedInvestigatorId) {
          throw new Error(
            "Defeated Investigator replacement is missing investigatorId.",
          );
        }

        const updatedGame =
          resolveDefeatedInvestigatorReplacement(
            game,
            investigatorId,
            defeatedInvestigatorId,
          );

        setGame(updatedGame);

        return;
      }

      /*
      * Unknown investigator selection.
      */

      console.warn(
        "Unknown investigator selection source:",
        decision.source,
      );
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
    setAxePaidThisTest(false);

    const currentGame =
      game;

    if (testDecision.source?.startsWith("condition-local-action:")) {
      const conditionId = testDecision.source.slice("condition-local-action:".length);
      const resolved = resolveConditionLocalActionTest(
        currentGame,
        testDecision.investigatorId,
        conditionId,
        diceTest,
        eldritchBaseMap,
      );
      setGame(resolved);
      setDiceTest(null);
      setPendingTestDecision(null);
      pendingTestDecisionRef.current = null;
      return;
    }

    if ((testDecision.source ?? "").startsWith("combat:spell:loss:")) {
      const [, , , spellId, ownerId, rawStat, rawIndex] = testDecision.source!.split(":");
      const pending = currentGame.pendingCombatLoss;
      const spellOwner = currentGame.investigators[ownerId];
      const spell = currentGame.spells[spellId];
      const definition = spell && coreSpells.find((candidate) => candidate.id === spell.definitionId);
      const effectIndex = Number(rawIndex);
      const effect = Number.isInteger(effectIndex) ? definition?.frontEffects[effectIndex] : undefined;
      if (pending && spell && spellOwner?.spellIds.includes(spellId) && definition && effect && (effect.type === "on-health-loss" || effect.type === "on-sanity-loss")) {
        const stat = rawStat === "sanity" ? "sanity" : "health";
        const prevented = getSpellLossPrevention(definition, spell.backId, effectIndex, stat, diceTest);
        const resolved = resolveCombatTest({
          ...currentGame,
          pendingDecision: null,
          pendingCombatLoss: null,
          spells: {
            ...currentGame.spells,
            [spellId]: {
              ...spell,
              flipped: true,
              pendingTestResult: diceTest,
              pendingChosenInvestigatorId: pending.testDecision.investigatorId,
            },
          },
        }, pending.testDecision, pending.diceTest, {
          skip: true,
          preventHealth: rawStat === "health" ? prevented : 0,
          preventSanity: rawStat === "sanity" ? prevented : 0,
        });
        setGame(resolved);
        setSpellPreviewId(spellId);
        setDiceTest(null);
        setPendingTestDecision(null);
        pendingTestDecisionRef.current = null;
        return;
      }
    }

    if ((testDecision.source ?? "").startsWith("spell:loss:")) {
      const effects = diceTest.passed ? (testDecision.onSuccess ?? []) : (testDecision.onFail ?? []);
      const reaction = effects.find((effect) => effect.type === "resolve-spell-loss");
      const spell = reaction?.spellId ? currentGame.spells[reaction.spellId] : undefined;
      const owner = spell
        ? Object.values(currentGame.investigators).find((candidate) => candidate.spellIds.includes(spell.id))
        : undefined;
      const definition = spell && coreSpells.find((candidate) => candidate.id === spell.definitionId);
      const stat = reaction?.spellLossStat === "sanity" ? "sanity" : "health";
      const triggerType = stat === "health" ? "on-health-loss" : "on-sanity-loss";
      const effectIndex = definition?.frontEffects.findIndex((effect) => effect.type === triggerType) ?? -1;
      if (reaction && spell && owner && definition && effectIndex >= 0) {
        const preventedAmount = getSpellLossPrevention(definition, spell.backId, effectIndex, stat, diceTest);
        const preparedGame: GameState = {
          ...currentGame,
          pendingDecision: null,
          spells: {
            ...currentGame.spells,
            [spell.id]: {
              ...spell,
              flipped: true,
              pendingTestResult: diceTest,
              pendingChosenInvestigatorId: reaction.target ?? testDecision.investigatorId,
            },
          },
        };
        const resolved = resolveEncounterEffects(preparedGame, testDecision.investigatorId, [
          { ...reaction, preventedAmount },
          ...(testDecision.onComplete ?? []),
        ], eldritchBaseMap);
        setGame(resolved);
        setSpellPreviewId(spell.id);
        setDiceTest(null);
        setPendingTestDecision(null);
        pendingTestDecisionRef.current = null;
        return;
      }
    }

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

        setGame(
          combatSource.startsWith("combat:strength:")
            ? {
                ...resolvedGame,
                activeTestRerolls: resolvedGame.activeTestRerolls?.filter(
                  (ability) => ability.investigatorId !== testDecision.investigatorId || ability.duration !== "this-combat-encounter",
                ),
                activeCombatSkillModifiers: resolvedGame.activeCombatSkillModifiers?.filter(
                  (modifier) => modifier.investigatorId !== testDecision.investigatorId,
                ),
              }
            : resolvedGame,
        );

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

      const gameAfterClues = gainInvestigatorClues(
        currentGame,
        investigatorId,
        cluesGained,
      );
      const resolvedGame: GameState = {
        ...gameAfterClues,

        board: {
          ...gameAfterClues.board,

          mythosDiscard: [
            ...gameAfterClues.board.mythosDiscard,
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
        eldritchBaseMap,
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
      const resultGame =
        standardTestResult.game;

      const investigatorId =
        testDecision.investigatorId;

      const investigator =
        resultGame.investigators[
          investigatorId
        ];

      setDiceTest(null);

      setPendingTestDecision(null);

      pendingTestDecisionRef.current =
        null;

      if (
        resultGame.phase === "action" &&
        investigator?.isDelayed
      ) {
        setGame(
          endInvestigatorActions(
            resultGame,
          ),
        );

        return;
      }

      setGame(resultGame);

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

      if (
        decision.type === "single-die-roll" &&
        decision.source?.startsWith("asset:cat-burglar:")
      ) {
        const assetId = decision.source.slice("asset:cat-burglar:".length);
        const investigatorId = decision.investigatorId;
        const investigator = game.investigators[investigatorId];
        if (!investigator) return;
        if (singleDieRoll === 1) {
          const asset = game.assets[assetId];
          setGame({
            ...game,
            pendingDecision: null,
            investigators: {
              ...game.investigators,
              [investigatorId]: { ...investigator, assetIds: investigator.assetIds.filter((id) => id !== assetId) },
            },
            board: asset ? { ...game.board, assetDiscard: [...game.board.assetDiscard, asset] } : game.board,
          });
        } else if (singleDieRoll >= 5) {
          const eligible = game.board.assetReserve.filter((asset) => asset.type === "item" || asset.type === "trinket");
          setGame({
            ...game,
            pendingDecision: eligible.length > 0 ? {
              type: "select-card",
              title: "Cat Burglar",
              message: "Choose an Item or Trinket Asset from the reserve.",
              cardIds: eligible.map((asset) => asset.id),
              selectableCardIds: eligible.map((asset) => asset.id),
              minSelections: 1,
              maxSelections: 1,
              selectedCardIds: [],
              investigatorId,
              source: `asset:cat-burglar-gain:${assetId}`,
            } : null,
          });
        } else {
          setGame({ ...game, pendingDecision: null });
        }
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
          const investigatorIndex =
            Number(
              decision.source?.split(":")[2],
            );

          updatedGame =
            resolveEncounterEffects(
              updatedGame,
              investigatorId,
              effects,
              eldritchBaseMap,
              isEyesEverywhere &&
              singleDieRoll >= 3 &&
              singleDieRoll <= 5
                ? {
                    type: "eyes-everywhere",
                    investigatorIds:
                      updatedGame.investigatorOrder,
                    currentInvestigatorIndex:
                      investigatorIndex,
                  }
                : undefined,
            );
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

  function handleFlowCombat(skipSpellPrompt = false) {
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

    if (!skipSpellPrompt && getCombatSpellOptions(game).length > 0) {
      setCombatSpellPrompt(true);
      return;
    }
    setCombatSpellPrompt(false);

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

  const activeInvestigatorIsDetained = activeInvestigator
    ? hasDetainedActionRestriction(game, activeInvestigator.id)
    : false;

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

  const pendingSpaceSelectionIds =
    game.pendingDecision?.type === "select-space"
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
            (brainCaseTrade || investigator.spaceId === activeInvestigator.spaceId),
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
            grid-cols-[190px_minmax(0,1fr)_190px]
            items-start
            gap-3
          "
        >

          {/* ================================================== */}
          {/* LEFT */}
          {/* ================================================== */}

          <aside className="min-w-0">
            <div className="grid grid-cols-1 gap-2">
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
              pendingSpaceSelectionIds={
                pendingSpaceSelectionIds
              }
            />

            {/* ACTIONS */}

            {game.phase === "action" &&
              activeInvestigator && (
                <div className="mt-3">
                  <InvestigatorActionsPanel
                  investigator={
                    activeInvestigator
                  }

                  canTravel={
                    !activeInvestigatorIsDetained &&
                    !activeInvestigator.travelActive &&
                    activeInvestigator.actionsPerformed.length < 2
                  }

                  canRest={
                    !activeInvestigatorIsDetained &&
                    !activeInvestigator.travelActive &&
                    activeInvestigator.actionsPerformed.length < 2 &&
                    !activeInvestigator.actionsPerformed.includes(
                      "rest",
                    ) &&
                    !game.board.mythosInPlay.some(
                      (entry) =>
                        entry.definitionId ===
                        "strange-sightings",
                    )
                  }

                  canPrepareForTravel={
                    !activeInvestigatorIsDetained &&
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
                    !activeInvestigatorIsDetained &&
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
                    !activeInvestigatorIsDetained &&
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

                  conditionActions={getConditionLocalActions(game, activeInvestigator.id)}
                  spellActions={getActionSpellOptions(game)}

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

                  onConditionAction={handleConditionLocalAction}
                  onSpellAction={handleActivateSpell}

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
            <div className="grid grid-cols-1 gap-2">
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

            game={game}

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
            onInspectSpace={handleInspectSpace}
            onActivateSpell={handleActivateSpell}
            onActivatePossession={handleActivatePossession}
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
            !spellPreviewId &&
            !Object.values(game.spells).some((spell) => spell.pendingTestResult) &&
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
            () => handleStartEncounter()
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
            title={`${diceTest.skill[0].toUpperCase()}${diceTest.skill.slice(1)} Test`}
            sixCountsAsTwo={diceTest.sixCountsAsTwo}
            onComplete={
              handleCompleteDiceTest
            }
            rerollAbilities={
              game && (pendingTestDecision ?? pendingTestDecisionRef.current)
                ? getTestRerollOptions(game, (pendingTestDecision ?? pendingTestDecisionRef.current)!, axePaidThisTest)
                : []
            }
            onReroll={(dieIndex, abilityId, requiresPayment) => {
              if (abilityId === "clue-reroll" && requiresPayment) {
                const investigatorId = (pendingTestDecision ?? pendingTestDecisionRef.current)?.investigatorId;
                const investigator = investigatorId && game ? game.investigators[investigatorId] : undefined;
                if (!investigatorId || !investigator || investigator.clues <= 0) return;
                setGame((current) => current
                  ? spendInvestigatorClues(current, investigatorId, 1)
                  : current);
              }
              const [cardId, abilityIndex] = abilityId.split(":");
              const cardAbility = game
                ? (game.assets[cardId]?.testRerolls ?? game.artifacts[cardId]?.testRerolls)?.[Number(abilityIndex)]
                : undefined;
              if (cardAbility?.sanityCost && !axePaidThisTest) {
                setGame((current) => {
                  if (!current) return current;
                  const investigatorId = (pendingTestDecision ?? pendingTestDecisionRef.current)?.investigatorId;
                  const investigator = investigatorId ? current.investigators[investigatorId] : undefined;
                  if (!investigator || investigator.sanity <= cardAbility.sanityCost!) return current;
                  return {
                    ...current,
                    investigators: { ...current.investigators, [investigatorId!]: { ...investigator, sanity: investigator.sanity - cardAbility.sanityCost! } },
                  };
                });
                setAxePaidThisTest(true);
              }
              setGame((current) => current ? {
                ...current,
                cardRerollUsedRound: cardAbility?.oncePerRound ? { ...current.cardRerollUsedRound, [abilityId]: current.round } : current.cardRerollUsedRound,
                activeTestRerolls: current.activeTestRerolls?.filter((ability) => ability.id !== abilityId),
              } : current);
              setDiceTest((current) => {
                if (!current) return current;
                const results = [...current.results];
                results[dieIndex] = cardAbility?.resultModifier
                  ? Math.min(6, results[dieIndex] + cardAbility.resultModifier)
                  : Math.floor(Math.random() * 6) + 1;
                const successes = results.reduce(
                  (total, result) => total + (result >= 5 ? 1 : 0) + (result === 6 && current.sixCountsAsTwo ? 1 : 0),
                  0,
                );
                return {
                  ...current,
                  results,
                  successes,
                  passed: successes >= current.difficulty,
                };
              });
            }}
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
            title={`${spellTest.skill[0].toUpperCase()}${spellTest.skill.slice(1)} Test`}
            sixCountsAsTwo={spellTest.sixCountsAsTwo}
            onComplete={
              handleCompleteSpellTest
            }
            rerollAbilities={game && game.activeInvestigatorId && spellTestSpellId ? getTestRerollOptions(game, {
              type: "test",
              title: "Spell Test",
              skill: spellTest.skill,
              modifier: 0,
              investigatorId: game.activeInvestigatorId,
              source: (() => {
                const spell = game.spells[spellTestSpellId];
                const definition = spell && coreSpells.find((item) => item.id === spell.definitionId);
                const effect = spellTestEffectIndex === null ? undefined : definition?.frontEffects[spellTestEffectIndex];
                return effect?.type === "on-combat-encounter"
                  ? `combat:spell:${spellTestSpellId}`
                  : `spell:${spellTestSpellId}`;
              })(),
            }, axePaidThisTest) : []}
            onReroll={(dieIndex, abilityId, requiresPayment) => {
              if (abilityId === "clue-reroll" && requiresPayment) {
                const investigatorId = game?.activeInvestigatorId;
                const investigator = investigatorId && game ? game.investigators[investigatorId] : undefined;
                if (!investigatorId || !investigator || investigator.clues <= 0) return;
                setGame((current) => current
                  ? spendInvestigatorClues(current, investigatorId, 1)
                  : current);
              }
              const [cardId, abilityIndex] = abilityId.split(":");
              const cardAbility = game
                ? (game.assets[cardId]?.testRerolls ?? game.artifacts[cardId]?.testRerolls)?.[Number(abilityIndex)]
                : undefined;
              if (cardAbility?.sanityCost && !axePaidThisTest) {
                const investigatorId = game?.activeInvestigatorId;
                const investigator = investigatorId && game ? game.investigators[investigatorId] : undefined;
                if (!investigator || investigator.sanity < cardAbility.sanityCost) return;
                setGame((current) => {
                  if (!current || !investigatorId) return current;
                  const owner = current.investigators[investigatorId];
                  if (!owner || owner.sanity <= cardAbility.sanityCost!) return current;
                  return {
                    ...current,
                    investigators: {
                      ...current.investigators,
                      [investigatorId]: { ...owner, sanity: owner.sanity - cardAbility.sanityCost! },
                    },
                  };
                });
                setAxePaidThisTest(true);
              }
              setGame((current) => current ? {
                ...current,
                cardRerollUsedRound: cardAbility?.oncePerRound
                  ? { ...current.cardRerollUsedRound, [abilityId]: current.round }
                  : current.cardRerollUsedRound,
                activeTestRerolls: current.activeTestRerolls?.filter((ability) => ability.id !== abilityId),
              } : current);
              setSpellTest((current) => {
                if (!current) return current;
                const results = [...current.results];
                results[dieIndex] = cardAbility?.resultModifier
                  ? Math.min(6, results[dieIndex] + cardAbility.resultModifier)
                  : Math.floor(Math.random() * 6) + 1;
                const successes = results.reduce((total, result) => total + (result >= 5 ? 1 : 0) + (result === 6 && current.sixCountsAsTwo ? 1 : 0), 0);
                return { ...current, results, successes, passed: successes >= current.difficulty };
              });
            }}
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
              canResolve={!!game.spells[spellPreviewId].pendingTestResult}
              onResolve={handleResolveSpellBack}
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
        {/* GAME END */}
        {/* ================================================== */}

        {(game.status === "victory" ||
          game.status === "defeat") && (
          <GameEndModal
            game={game}
            onExit={handleExitGame}
          />
        )}

        {/* ================================================== */}
        {/* GAME FLOW */}
        {/* ================================================== */}

        {game.pendingDecision &&
          singleDieRoll === null &&
          game.pendingDecision.type !==
            "select-space" && (
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
                () => handleFlowCombat()
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

        {encounterSpellPrompt && getEncounterSpellOptions(game).length > 0 && (
          <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
            <section role="dialog" aria-modal="true" aria-label="Spells before the Encounter" className="max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-600 bg-slate-900 p-6 text-white">
              <h2 className="text-2xl font-black">Before the Encounter</h2>
              <p className="mt-2 text-slate-300">You may use these Spells before choosing an encounter or fighting Monsters.</p>
              <div className="my-5 grid gap-4 sm:grid-cols-2">
                {getEncounterSpellOptions(game).map((option) => (
                  <button key={option.spellId} type="button" className="rounded-xl border border-purple-500 bg-slate-800 p-4 hover:bg-slate-700" onClick={() => { setEncounterSpellPrompt(false); handleActivateSpell(option.spellId, option.effectIndex); }}>
                    <img src={option.image} alt={option.name} className="mx-auto h-60 object-contain" />
                    <p className="mt-3 font-bold">Use {option.name}</p>
                    <p className="mt-2 text-sm text-slate-300">{option.description}</p>
                  </button>
                ))}
              </div>
              <button type="button" className="rounded-lg bg-blue-700 px-5 py-3 font-bold" onClick={() => handleStartEncounter(true)}>Continue without a Spell</button>
            </section>
          </div>
        )}

        {combatSpellPrompt && getCombatSpellOptions(game).length > 0 && (
          <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
            <section role="dialog" aria-modal="true" aria-label="Spells during Combat" className="max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-red-700 bg-slate-950 p-6 text-white shadow-2xl">
              <h2 className="text-2xl font-black">Before Combat</h2>
              <p className="mt-2 text-slate-300">You may use one of these Spells for this Combat Encounter.</p>
              <div className="my-5 grid gap-4 sm:grid-cols-2">
                {getCombatSpellOptions(game).map((option) => (
                  <button key={option.spellId} type="button" className="rounded-xl border border-purple-500 bg-slate-800 p-4 hover:bg-slate-700" onClick={() => { setCombatSpellPrompt(false); handleActivateSpell(option.spellId, option.effectIndex); }}>
                    <img src={option.image} alt={option.name} className="mx-auto h-60 object-contain" />
                    <p className="mt-3 font-bold">Use {option.name}</p>
                    <p className="mt-2 text-sm text-slate-300">{option.description}</p>
                  </button>
                ))}
              </div>
              <button type="button" className="rounded-lg bg-red-700 px-5 py-3 font-bold hover:bg-red-600" onClick={() => handleFlowCombat(true)}>Continue without a Spell</button>
            </section>
          </div>
        )}

        {game.pendingSpellChoice && (
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

            options={getSpellChoiceOptions(game)}

            title={game.pendingSpellChoice.type === "choose-investigator" ? undefined : {
              "choose-monster": "Choose a Monster",
              "choose-clue": "Choose a Clue",
              "choose-asset": "Choose an Asset",
              "choose-skill": "Choose a Skill",
              "choose-space": "Choose a Space",
              "choose-encounter": "Resolve an Encounter",
            }[game.pendingSpellChoice.type]}

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
              game={game}
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

        {game.cardRevealQueue?.[0] && (() => {
          const reveal = game.cardRevealQueue[0];
          return (
            <div className="fixed inset-0 z-10001 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <section role="dialog" aria-modal="true" aria-labelledby="gained-card-title" className="w-full max-w-lg rounded-2xl border border-slate-600 bg-slate-900 p-6 text-center text-white shadow-2xl">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">New {reveal.kind} gained</p>
                <h2 id="gained-card-title" className="mb-5 text-2xl font-bold">{reveal.name}</h2>
                {reveal.image && <img src={reveal.image} alt={reveal.name} className="mx-auto max-h-[55vh] max-w-full rounded-xl object-contain" />}
                {!reveal.image && reveal.description && <p className="mx-auto mt-4 max-w-md text-left leading-relaxed text-slate-300">{reveal.description}</p>}
                <button
                  type="button"
                  className="mt-6 rounded-lg bg-red-700 px-8 py-3 font-bold uppercase tracking-wide hover:bg-red-600"
                  onClick={() => setGame((current) => current ? { ...current, cardRevealQueue: (current.cardRevealQueue ?? []).slice(1) } : current)}
                >Continue</button>
              </section>
            </div>
          );
        })()}
    </main>
  );
}

export default App;
