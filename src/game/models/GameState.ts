import type { BoardState } from "./BoardState";
import type { Investigator } from "./Investigator";
import type { TestResult } from "./TestResult";
import type { Spell } from "./Spell";
import type { Condition } from "./Condition";
import type { Asset } from "./Asset";
import type { EncounterDefinition } from "./Encounter";
import type { SpellChoice } from "./SpellChoice";
import type { Artifact } from "./Artifact";
import type { GamePhase } from "../types/GamePhase";
import type { EncounterPendingChoice } from "./EncounterPendingChoice";
import type { AncientOne } from "./AncientOne";
import type { Monster } from "./Monster";
import type { MysteryState } from "./MysteryState";
import type { PendingDecision } from "./PendingDecision";
import type { EncounterDeckType } from "./BoardState";
import type { GameStatus } from "../types/GameStatus";

export interface GameState {
  /*
   * ============================================================
   * GAME
   * ============================================================
   */

  scenarioId: string;

  round: number;

  status: GameStatus;

  phase: GamePhase;

  currentMythosId: string | null;

  /*
   * ============================================================
   * BOARD
   * ============================================================
   */

  board: BoardState;

  /*
   * ============================================================
   * INVESTIGATORS
   * ============================================================
   */

  investigators: Record<
    string,
    Investigator
  >;

  /*
   * ============================================================
   * ASSETS
   * ============================================================
   */

  assets: Record<
    string,
    Asset
  >;

  /*
   * ============================================================
   * SPELLS
   * ============================================================
   */

  spells: Record<
    string,
    Spell
  >;

  /*
   * ============================================================
   * ARTIFACTS
   * ============================================================
   */

  artifacts: Record<
    string,
    Artifact
  >;

  /*
   * ============================================================
   * CONDITIONS
   * ============================================================
   */

  conditions: Record<
    string,
    Condition
  >;

  /*
   * ============================================================
   * ENCOUNTER REGISTRY
   * ============================================================
   */

  encounters: Record<
    string,
    EncounterDefinition
  >;

  /*
   * ============================================================
   * CURRENT ENCOUNTER
   * ============================================================
   */

  currentEncounterId:
    string | null;

  currentEncounterBackId:
    string | null;

  currentEncounterRevealed:
    boolean;

  /*
  * Number of Clues gained during the
  * current Research Encounter.
  *
  * Used by the Occult Research Mystery.
  */
  encounterCluesGained?: number;

  /*
   * Physical Encounter deck from which the
   * current Encounter was drawn.
   *
   * This is required so that, when the Encounter
   * finishes, the card goes to the correct discard pile.
   */

  currentEncounterDeckType:
    EncounterDeckType | null;

  currentEncounterFromFracturedReality:
    boolean;

  /*
   * ============================================================
   * INVESTIGATOR TURN
   * ============================================================
   */

  leadInvestigatorId:
    string | null;

  activeInvestigatorId:
    string | null;

  investigatorOrder:
    string[];

  investigatorTurnIndex:
    number;

  /*
   * ============================================================
   * TEST
   * ============================================================
   */

  lastTest:
    TestResult | null;

  /*
   * ============================================================
   * SPELL CHOICE
   * ============================================================
   */

  pendingSpellChoice:
    SpellChoice | null;

  /*
   * ============================================================
   * ENCOUNTER CHOICE
   * ============================================================
   */

  pendingEncounterChoice:
    EncounterPendingChoice | null;

  /*
   * ============================================================
   * ANCIENT ONE
   * ============================================================
   */

  ancientOne:
    AncientOne;

  /*
   * ============================================================
   * MONSTERS
   * ============================================================
   */

  monsters:
    Record<string, Monster>;

  combatOrder:
    string[] | null;

  epicMonstersDefeated:
    string[];

  /*
   * ============================================================
   * MYSTERIES
   * ============================================================
   */

  mysteries:
    MysteryState;

  /*
   * ============================================================
   * PENDING DECISION
   * ============================================================
   */

  pendingDecision:
    PendingDecision | null;
}