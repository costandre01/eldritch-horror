import type { SpaceState } from "./SpaceState";
import type { Asset } from "./Asset";
import type { Spell } from "./Spell";
import type { EncounterRegion } from "./Encounter";
import type { Artifact } from "./Artifact";
import type { Monster } from "./Monster";
import type { MythosDefinition } from "./Mythos";
import type { MythosInPlay } from "./MythosInPlay";
import type { ClueToken } from "./ClueToken";
import type { GateToken } from "./GateToken";

/*
 * ============================================================
 * ENCOUNTER DECK TYPE
 * ============================================================
 */

export type EncounterDeckType =
  | EncounterRegion
  | "other-world"
  | "special"
  | "expedition";

/*
 * ============================================================
 * BOARD STATE
 * ============================================================
 */

export interface BoardState {
  /*
   * ==========================================================
   * MAP
   * ==========================================================
   */

  spaces: Record<string, SpaceState>;

  cluePool: ClueToken[];

  clueDiscard: ClueToken[];

  /*
   * ==========================================================
   * ASSETS
   * ==========================================================
   */

  assetDeck: Asset[];

  assetReserve: Asset[];

  assetDiscard: Asset[];

  /*
   * ==========================================================
   * SPELLS
   * ==========================================================
   */

  spellDeck: Spell[];

  spellDiscard: Spell[];

  /*
   * ==========================================================
   * ARTIFACTS
   * ==========================================================
   */

  artifactDeck: Artifact[];

  artifactDiscard: Artifact[];

  /*
   * ==========================================================
   * CONDITIONS
   * ==========================================================
   */

  conditionDeck: string[];

  conditionDiscard: string[];

  /*
   * ==========================================================
   * ENCOUNTERS
   * ==========================================================
   */

  encounterDecks: Record<
    EncounterDeckType,
    string[]
  >;

  encounterDiscards: Record<
    EncounterDeckType,
    string[]
  >;

  /*
   * ==========================================================
   * MONSTERS
   * ==========================================================
   */

  monsterCup: Monster[];

  monsterDiscard: Monster[];

  /*
   * ==========================================================
   * GATES
   * ==========================================================
   *
   * Each Gate token is represented by the spaceId
   * printed on the physical Gate token.
   */

  gateStack: GateToken[];

  gateDiscard: GateToken[];

  activeExpeditionSpaceId: string | null;

  /*
   * ==========================================================
   * MYTHOS
   * ==========================================================
   */

  mythosDeck: MythosDefinition[];

  mythosDiscard: MythosDefinition[];

  mythosInPlay: MythosInPlay[];
}