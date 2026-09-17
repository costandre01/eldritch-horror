import type { GameState } from "../models/GameState";
import type { InvestigatorDefinition } from "../models/InvestigatorDefinition";
import type { MapDefinition } from "../models/MapDefinition";
import type { Spell } from "../models/Spell";
import type { Artifact } from "../models/Artifact";
import type { Condition } from "../models/Condition";
import type { EncounterDefinition } from "../models/Encounter";
import type { Monster } from "../models/Monster";

import { coreAssets } from "../../content/core/coreAssets";
import { coreSpells } from "../../content/core/coreSpell";
import { coreConditionCards } from "../../content/core/coreConditionCards";

import { coreEncounters } from "../../content/core/coreEncounters";

import { americaEncounters } from "../../content/core/encounters/americaEncounters";
import { europeEncounters } from "../../content/core/encounters/europeEncounters";
import { asiaAustraliaEncounters } from "../../content/core/encounters/asiaAustraliaEncounters";
import { generalEncounters } from "../../content/core/encounters/generalEncounters";
import { otherWorldEncounters } from "../../content/core/encounters/otherWorldEncounters";
import { expeditionEncounters } from "../../content/core/encounters/expeditionEncounters";
import { specialEncounters } from "../../content/core/encounters/specialEncounters";

import { researchEncountersAzaroth } from "../../content/core/encounters/researchEncountersAzaroth";
import { researchEncountersCthulhu } from "../../content/core/encounters/researchEncountersCthulhu";
import { researchEncountersShubNiggurath } from "../../content/core/encounters/researchEncountersShubNiggurath";
import { researchEncountersYogSothoth } from "../../content/core/encounters/researchEncountersYogSothoth";

import { createBoard } from "./createBoard";
import { createInvestigator } from "./createInvestigator";
import { createSpell } from "./createSpell";

import { CORE_ANCIENT_ONES } from "../../content/core/coreAncientOnes";
import { CORE_MYSTERIES } from "../../content/core/coreMysteries";
import { CORE_CLUES } from "../../content/core/coreClues";

import {
  createMysteryState,
  revealNextMystery,
} from "../engine/mysteryEngine";
import type { BoardState } from "../models/BoardState";
import { spawnClue } from "./clueEngine";
import { spawnMonsterAtSpace } from "./spawnMonster";
import { placeEldritchTokenOnOmen } from "./omenEngine";
import { resolveMysteryEnterPlay } from "./resolveMysteryEnterPlay";

/*
 * ============================================================
 * CREATE GAME OPTIONS
 * ============================================================
 */

export interface CreateGameOptions {
  scenarioId: string;

  map: MapDefinition;

  investigatorDefinitions: InvestigatorDefinition[];

  ancientOneId: string;
}

/*
 * ============================================================
 * SHUFFLE
 * ============================================================
 */

function shuffle<T>(
  cards: T[],
): T[] {
  const result = [...cards];

  for (
    let index = result.length - 1;
    index > 0;
    index--
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
          (index + 1),
      );

    const current =
      result[index];

    result[index] =
      result[randomIndex];

    result[randomIndex] =
      current;
  }

  return result;
}

/*
 * ============================================================
 * STARTING SETUP COUNTS
 * ============================================================
 */

function getStartingGateCount(
  investigatorCount: number,
): number {
  return investigatorCount <= 4
    ? 1
    : 2;
}

function getStartingClueCount(
  investigatorCount: number,
): number {
  if (investigatorCount <= 2) {
    return 1;
  }

  if (investigatorCount <= 4) {
    return 2;
  }

  if (investigatorCount <= 6) {
    return 3;
  }

  return 4;
}

/*
 * ============================================================
 * STARTING GAME SETUP
 * ============================================================
 */

function setupStartingGameState(
  game: GameState,
  map: MapDefinition,
): GameState {
  let currentGame = game;

  /*
   * ==========================================================
   * STARTING GATES
   * ==========================================================
   */

  const gateCount =
    getStartingGateCount(
      currentGame.investigatorOrder.length,
    );

  for (
    let index = 0;
    index < gateCount;
    index++
  ) {
    const gate =
      currentGame.board.gateStack[0];

    if (!gate) {
      throw new Error(
        "The Gate stack is empty during game setup.",
      );
    }

    /*
     * Remove the Gate from the stack.
     */

    const gateStack =
      currentGame.board.gateStack.slice(1);

    /*
     * Find the destination space printed
     * on the Gate token.
     */

    const space =
      currentGame.board.spaces[
        gate.spaceId
      ];

    if (!space) {
      throw new Error(
        `Gate "${gate.id}" references unknown space "${gate.spaceId}".`,
      );
    }

    /*
     * Place the Gate on the board.
     */

    currentGame = {
      ...currentGame,

      board: {
        ...currentGame.board,

        gateStack,

        spaces: {
          ...currentGame.board.spaces,

          [gate.spaceId]: {
            ...space,

            gates: [
              ...space.gates,
              gate,
            ],
          },
        },
      },
    };

    /*
     * Spawn one Monster on the Gate's space.
     */

    currentGame =
      spawnMonsterAtSpace(
        currentGame,
        gate.spaceId,
      );
  }

  /*
   * ==========================================================
   * STARTING CLUES
   * ==========================================================
   */

  const clueCount =
    getStartingClueCount(
      currentGame.investigatorOrder.length,
    );

  for (
    let index = 0;
    index < clueCount;
    index++
  ) {
    currentGame =
      spawnClue(
        currentGame,
      );
  }

  /*
   * ==========================================================
   * ACTIVE EXPEDITION
   * ==========================================================
   *
   * The Active Expedition is determined by the top card
   * of the Expedition Encounter deck.
   *
   * The Encounter card's name corresponds to the Expedition
   * space on the map.
   */

  const topExpeditionId =
    currentGame.board.encounterDecks.expedition[0];

  if (!topExpeditionId) {
    throw new Error(
      "The Expedition Encounter deck is empty during game setup.",
    );
  }

  const topExpedition =
    currentGame.encounters[
      topExpeditionId
    ];

  if (!topExpedition) {
    throw new Error(
      `Expedition Encounter "${topExpeditionId}" does not exist.`,
    );
  }

  const expeditionSpace =
    map.spaces.find(
      (space) =>
        space.isExpedition &&
        space.name ===
          topExpedition.name,
    );

  if (!expeditionSpace) {
    throw new Error(
      `No Expedition space matches "${topExpedition.name}".`,
    );
  }

  currentGame = {
    ...currentGame,

    board: {
      ...currentGame.board,

      activeExpeditionSpaceId:
        expeditionSpace.id,
    },
  };

  return currentGame;
}

/*
 * ============================================================
 * CREATE GAME
 * ============================================================
 */

export function createGame(
  options: CreateGameOptions,
): GameState {
  /*
   * ============================================================
   * VALIDATE INVESTIGATORS
   * ============================================================
   */

  if (
    options.investigatorDefinitions.length < 1
  ) {
    throw new Error(
      "At least one investigator is required.",
    );
  }

  if (
    options.investigatorDefinitions.length > 8
  ) {
    throw new Error(
      "A maximum of eight investigators is allowed.",
    );
  }

  /*
   * ============================================================
   * RESOLVE ANCIENT ONE
   * ============================================================
   *
   * "random" is resolved here before the Board is created.
   */

  let selectedAncientOneId =
    options.ancientOneId;

  if (
    selectedAncientOneId ===
    "random"
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
          CORE_ANCIENT_ONES.length,
      );

    const randomAncientOne =
      CORE_ANCIENT_ONES[
        randomIndex
      ];

    if (!randomAncientOne) {
      throw new Error(
        "Could not select a random Ancient One.",
      );
    }

    selectedAncientOneId =
      randomAncientOne.id;
  }

  /*
   * Find the selected Ancient One definition.
   */

  const ancientOneDefinition =
    CORE_ANCIENT_ONES.find(
      (ancientOne) =>
        ancientOne.id ===
        selectedAncientOneId,
    );

  if (!ancientOneDefinition) {
    throw new Error(
      `Ancient One "${selectedAncientOneId}" not found.`,
    );
  }

  /*
   * ============================================================
   * COLLECT STARTING POSSESSIONS
   * ============================================================
   */

  const startingAssetIds =
    options.investigatorDefinitions.flatMap(
      (definition) =>
        definition.startingAssetIds,
    );

  const startingSpellIds =
    options.investigatorDefinitions.flatMap(
      (definition) =>
        definition.startingSpellIds,
    );

  /*
   * ============================================================
   * CREATE BOARD
   * ============================================================
   */

  const board = createBoard({
    map: options.map,

    startingAssetIds,

    startingSpellIds,

    ancientOne:
      ancientOneDefinition,
  });

  /*
   * ============================================================
   * ASSET REGISTRY
   * ============================================================
   */

  const assets = Object.fromEntries(
    coreAssets.map((asset) => [
      asset.id,
      asset,
    ]),
  );

  /*
   * ============================================================
   * SPELL REGISTRY
   * ============================================================
   */

  const spells: Record<
    string,
    Spell
  > = {};

  for (const spell of board.spellDeck) {
    spells[spell.id] = spell;
  }

  /*
   * ============================================================
   * ARTIFACT REGISTRY
   * ============================================================
   */

  const artifacts: Record<
    string,
    Artifact
  > = {};

  for (const artifact of board.artifactDeck) {
    artifacts[artifact.id] = artifact;
  }

  /*
   * ============================================================
   * CONDITION REGISTRY
   * ============================================================
   */

  const conditions: Record<
    string,
    Condition
  > = {};

  for (const condition of coreConditionCards) {
    conditions[condition.id] = condition;
  }

  /*
   * ============================================================
   * ENCOUNTER REGISTRY
   * ============================================================
   *
   * Contains EVERY Encounter definition.
   *
   * This is separate from the physical decks.
   */

  const encounters: Record<
    string,
    EncounterDefinition
  > = {};

  for (const encounter of coreEncounters) {
    encounters[encounter.id] =
      encounter;
  }

  /*
   * ============================================================
   * DETERMINE RESEARCH ENCOUNTER DECK
   * ============================================================
   *
   * Research Encounters are selected according
   * to the Ancient One in this game.
   */

  let researchEncounters:
    EncounterDefinition[];

  switch (
    ancientOneDefinition.id
  ) {
    case "azathoth":
      researchEncounters =
        researchEncountersAzaroth;
      break;

    case "cthulhu":
      researchEncounters =
        researchEncountersCthulhu;
      break;

    case "shub-niggurath":
      researchEncounters =
        researchEncountersShubNiggurath;
      break;

    case "yog-sothoth":
      researchEncounters =
        researchEncountersYogSothoth;
      break;

    default:
      throw new Error(
        `No Research Encounters found for Ancient One "${ancientOneDefinition.id}".`,
      );
  }

/*
 * ============================================================
 * DETERMINE SPECIAL ENCOUNTER DECK
 * ============================================================
 *
 * Only Special Encounters belonging to the selected
 * Ancient One are used.
 */

const selectedSpecialEncounters =
  specialEncounters.filter(
    (encounter) => {
      switch (
        ancientOneDefinition.id
      ) {
        case "cthulhu":
          return (
            encounter.name ===
            "R'lyeh Risen"
          );

        case "yog-sothoth":
          return (
            encounter.name ===
            "The Key and the Gate"
          );

        case "azathoth":
        case "shub-niggurath":
          return false;

        default:
          return false;
      }
    },
  );

  /*
   * ============================================================
   * PHYSICAL ENCOUNTER DECKS
   * ============================================================
   *
   * Each physical Encounter deck is kept separate.
   *
   * The decks are:
   *
   *   America
   *   Europe
   *   Asia/Australia
   *   General
   *   Research
   *   Other World
   *   Special
   *   Expedition
   */

  const encounterDecks: BoardState["encounterDecks"] = {
    america:
      shuffle(
        americaEncounters.map(
          (encounter) =>
            encounter.id,
        ),
      ),

    europe:
      shuffle(
        europeEncounters.map(
          (encounter) =>
            encounter.id,
        ),
      ),

    "asia-australia":
      shuffle(
        asiaAustraliaEncounters.map(
          (encounter) =>
            encounter.id,
        ),
      ),

    general:
      shuffle(
        generalEncounters.map(
          (encounter) =>
            encounter.id,
        ),
      ),

    research:
      shuffle(
        researchEncounters.map(
          (encounter) =>
            encounter.id,
        ),
      ),

    "other-world":
      shuffle(
        otherWorldEncounters.map(
          (encounter) =>
            encounter.id,
        ),
      ),

    special:
      shuffle(
        selectedSpecialEncounters.map(
          (encounter) =>
            encounter.id,
        ),
      ),

    expedition:
      shuffle(
        expeditionEncounters.map(
          (encounter) =>
            encounter.id,
        ),
      ),
  };

  /*
   * ============================================================
   * ENCOUNTER DISCARDS
   * ============================================================
   */

  const encounterDiscards:
    BoardState["encounterDiscards"] = {
      america: [],

      europe: [],

      "asia-australia": [],

      general: [],

      research: [],

      "other-world": [],

      special: [],

      expedition: [],
    };

  /*
   * ============================================================
   * UPDATE BOARD
   * ============================================================
   */

  const updatedBoard = {
    ...board,

    encounterDecks,

    encounterDiscards,

    cluePool: shuffle(
      [...CORE_CLUES],
    ),

    clueDiscard: [],
  };

  /*
   * ============================================================
   * CREATE INVESTIGATORS
   * ============================================================
   */

  const investigators: Record<
    string,
    ReturnType<typeof createInvestigator>
  > = {};

  for (
    let index = 0;
    index <
    options.investigatorDefinitions.length;
    index++
  ) {
    const definition =
      options.investigatorDefinitions[index];

    /*
     * ==========================================================
     * CREATE STARTING SPELL INSTANCES
     * ==========================================================
     */

    const investigatorStartingSpellIds =
      definition.startingSpellIds.map(
        (spellId) => {
          const spellDefinition =
            coreSpells.find(
              (spell) =>
                spell.id === spellId,
            );

          if (!spellDefinition) {
            throw new Error(
              `Starting Spell "${spellId}" does not exist.`,
            );
          }

          /*
           * Count physical copies already assigned.
           */

          const assignedCopies =
            Object.values(
              spells,
            ).filter(
              (spell) =>
                spell.definitionId ===
                spellDefinition.id,
            ).length;

          const instanceNumber =
            assignedCopies + 1;

          const back =
            spellDefinition.backs[
              instanceNumber - 1
            ];

          if (!back) {
            throw new Error(
              `Not enough physical copies of Spell "${spellDefinition.id}" for starting investigators.`,
            );
          }

          const spell =
            createSpell(
              spellDefinition,
              instanceNumber,
              back.id,
            );

          spells[spell.id] =
            spell;

          return spell.id;
        },
      );

    /*
     * ==========================================================
     * CREATE INVESTIGATOR
     * ==========================================================
     */

    const investigator =
      createInvestigator({
        definition,

        instanceNumber:
          index + 1,

        startingSpellIds:
          investigatorStartingSpellIds,
      });

    investigators[
      investigator.id
    ] = investigator;
  }

  /*
   * ============================================================
   * MONSTER REGISTRY
   * ============================================================
   */

  const monsters: Record<
    string,
    Monster
  > = {};

  for (const monster of board.monsterCup) {
    monsters[monster.id] =
      monster;
  }

  /*
   * ============================================================
   * INVESTIGATOR IDS
   * ============================================================
   */

  const investigatorIds =
    Object.keys(
      investigators,
    );

  /*
  * ============================================================
  * STARTING GATES
  * ============================================================
  *
  * During setup, spawn the number of Gates indicated
  * by the Reference Card.
  *
  * Each Gate:
  * 1. is drawn from the top of the Gate stack
  * 2. is placed on the space printed on the Gate
  * 3. spawns one random Monster on that same space
  */

  /*
   * ============================================================
   * MYSTERIES
   * ============================================================
   *
   * The selected Ancient One determines
   * which Mystery pool is used.
   *
   * The first Mystery is immediately revealed.
   */

  const mysteryState =
    createMysteryState(
      CORE_MYSTERIES,
      ancientOneDefinition.id,
    );

  const initialMysteryState =
    revealNextMystery(
      mysteryState,
    );

  /*
   * ============================================================
   * CREATE GAME STATE
   * ============================================================
   */

  const game: GameState = {
    scenarioId:
      options.scenarioId,

    round: 1,

    status: "playing",

    phase: "action",

    currentMythosId: null,

    board:
      updatedBoard,

    investigators,

    assets,

    spells,

    artifacts,

    conditions,

    encounters,

    currentEncounterId:
      null,

    currentEncounterBackId:
      null,

    currentEncounterRevealed:
      false,
    
    currentEncounterDeckType: null,

    currentEncounterFromFracturedReality: false,

    leadInvestigatorId:
      null,

    activeInvestigatorId:
      investigatorIds[0] ??
      null,

    investigatorOrder:
      investigatorIds,

    investigatorTurnIndex:
      0,

    lastTest:
      null,

    pendingSpellChoice:
      null,

    pendingEncounterChoice:
      null,

    monsters,

    epicMonstersDefeated: [],

    ancientOne: {
      id:
        ancientOneDefinition.id,

      name:
        ancientOneDefinition.name,

      doom:
        ancientOneDefinition.startingDoom,

      omenPosition:
        0,

      eldritchTokens:
        0,

      eldritchTokenPositions:
        [],

      eldritchTokenSpaceIds:
        [],

      awakened:
        false,

      sanityTokens: 0,

      gateCount: 0,
    },

    mysteries:
      initialMysteryState,

    combatOrder: null,

    pendingDecision:
      null,
  };
  let startingGame = game;

  if (
    ancientOneDefinition.id ===
    "azathoth"
  ) {
    startingGame =
      placeEldritchTokenOnOmen(
        startingGame,
        1,
        "green",
      );
  }

  startingGame =
    setupStartingGameState(
      startingGame,
      options.map,
    );

  return resolveMysteryEnterPlay(
    startingGame,
    options.map,
  );
}