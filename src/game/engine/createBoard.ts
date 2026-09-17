import type { BoardState } from "../models/BoardState";
import type { MapDefinition } from "../models/MapDefinition";

import { coreAssets } from "../../content/core/coreAssets";
import { coreSpells } from "../../content/core/coreSpell";
import { createSpell } from "./createSpell";
import { coreConditionCards } from "../../content/core/coreConditionCards";
import { CORE_ARTIFACTS } from "../../content/core/coreArtifacts";
import { createArtifact } from "./createArtifact";
import { CORE_MONSTERS } from "../../content/core/coreMonsters";
import { createMonster } from "./createMonster";
import type { AncientOneDefinition } from "../models/AncientOneDefinition";
import { createMythosDeck } from "./createMythosDeck";
import type { ClueToken } from "../models/ClueToken";
import type { GateToken } from "../models/GateToken";

export interface CreateBoardOptions {
  map: MapDefinition;

  startingAssetIds: string[];

  startingSpellIds: string[];

  ancientOne: AncientOneDefinition;
}

export function createBoard(
  options: CreateBoardOptions,
): BoardState {
  const spaces: BoardState["spaces"] = {};

  for (const space of options.map.spaces) {
    spaces[space.id] = {
      spaceId: space.id,

      clues: 0,

      clueTokenIds: [],

      monsterIds: [],

      gates: [],

      expedition: space.isExpedition,

      rumor: false,

      eldritchTokenCount: 0,
    };
  }

  /*
  * ============================================================
  * GATE TOKENS
  * ============================================================
  *
  * Each physical Gate token has:
  * - a unique id
  * - the space where it can be placed
  * - the Omen symbol printed on the token
  */

  const gateStack = ([
    {
      id: "gate-san-francisco",
      spaceId: "san-francisco",
      omen: "green",
    },
    {
      id: "gate-arkham",
      spaceId: "arkham",
      omen: "red",
    },
    {
      id: "gate-buenos-aires",
      spaceId: "buenos-aires",
      omen: "blue",
    },
    {
      id: "gate-london",
      spaceId: "london",
      omen: "blue",
    },
    {
      id: "gate-rome",
      spaceId: "rome",
      omen: "red",
    },
    {
      id: "gate-istanbul",
      spaceId: "istanbul",
      omen: "green",
    },
    {
      id: "gate-tokyo",
      spaceId: "tokyo",
      omen: "blue",
    },
    {
      id: "gate-shanghai",
      spaceId: "shanghai",
      omen: "red",
    },
    {
      id: "gate-sydney",
      spaceId: "sydney",
      omen: "red",
    },
  ] satisfies GateToken[]).sort(() => Math.random() - 0.5);

  const gateDiscard: GateToken[] = [];

  /*
   * ============================================================
   * STARTING ASSETS
   * ============================================================
   */

  const startingAssetIds = new Set(
    options.startingAssetIds,
  );

  const availableAssets =
    coreAssets.filter(
      (asset) =>
        !startingAssetIds.has(asset.id),
    );

  /*
   * ============================================================
   * ASSET DECK
   * ============================================================
   */

  const shuffledAssets =
    [...availableAssets].sort(
      () => Math.random() - 0.5,
    );

  const assetReserve =
    shuffledAssets.slice(0, 4);

  const assetDeck =
    shuffledAssets.slice(4);

  /*
   * ============================================================
   * STARTING SPELLS
   * ============================================================
   *
   * A SpellDefinition represents the Spell itself.
   *
   * Each physical Spell copy is represented by one of
   * the entries in definition.backs.
   *
   * Example:
   *
   * Shriveling
   * ├── back 1
   * └── back 2
   *
   * If one investigator starts with Shriveling:
   *
   * Investigator
   * └── Shriveling #1
   *
   * Spell deck
   * └── Shriveling #2
   *
   * If two investigators start with Shriveling:
   *
   * Investigator A
   * └── Shriveling #1
   *
   * Investigator B
   * └── Shriveling #2
   *
   * Nothing remains in the Spell deck for that Spell.
   */

  const startingSpellCounts =
    new Map<string, number>();

  for (const spellId of options.startingSpellIds) {
    startingSpellCounts.set(
      spellId,
      (startingSpellCounts.get(spellId) ?? 0) + 1,
    );
  }

  /*
   * ============================================================
   * SPELL DECK
   * ============================================================
   */

  const spellDeck: BoardState["spellDeck"] = [];

  for (const definition of coreSpells) {
    const startingCount =
      startingSpellCounts.get(
        definition.id,
      ) ?? 0;

    /*
     * We cannot have more starting copies than
     * physical copies of the Spell.
     */

    if (
      startingCount >
      definition.backs.length
    ) {
      throw new Error(
        `Spell "${definition.id}" has ${definition.backs.length} physical copies, but ${startingCount} starting copies were requested.`,
      );
    }

    /*
     * Create every physical copy that is NOT
     * being used as a starting possession.
     */

    for (
      let backIndex = startingCount;
      backIndex < definition.backs.length;
      backIndex++
    ) {
      const back =
        definition.backs[backIndex];

      if (!back) {
        continue;
      }

      spellDeck.push(
        createSpell(
          definition,
          backIndex + 1,
          back.id,
        ),
      );
    }
  }

  /*
   * ============================================================
   * SHUFFLE SPELL DECK
   * ============================================================
   */

  spellDeck.sort(
    () => Math.random() - 0.5,
  );

  /*
   * ============================================================
   * ARTIFACT DECK
   * ============================================================
   *
   * CORE_ARTIFACTS contains ArtifactDefinitions.
   *
   * Each Core Artifact has one physical copy.
   *
   * We therefore create one physical Artifact from
   * each definition before placing it into the deck.
   *
   * Artifacts are completely separate from the Asset deck.
   */

  const artifactDeck: BoardState["artifactDeck"] =
    CORE_ARTIFACTS.map(
      (definition) =>
        createArtifact(definition),
    );

  /*
   * ============================================================
   * SHUFFLE ARTIFACT DECK
   * ============================================================
   */

  artifactDeck.sort(
    () => Math.random() - 0.5,
  );

  /*
   * ============================================================
   * CONDITION DECK
   * ============================================================
   */

  const shuffledConditions =
    [...coreConditionCards].sort(
      () => Math.random() - 0.5,
    );

  const conditionDeck =
    shuffledConditions.map(
      (condition) => condition.id,
    );

  /*
  * ============================================================
  * MONSTER CUP
  * ============================================================
  *
  * Only normal Monsters are placed in the Monster Cup.
  *
  * Epic Monsters are never added to the normal Monster Cup.
  *
  * The quantity defined by each MonsterDefinition determines
  * how many physical copies are created.
  */

  const monsterCup: BoardState["monsterCup"] = [];

  /*
  * ============================================================
  * ANCIENT ONE SETUP - MONSTERS
  * ============================================================
  *
  * Some Ancient Ones require specific Monsters to be
  * set aside during setup.
  *
  * These Monsters are therefore NOT placed in the
  * Monster Cup.
  */

  const setAsideMonsterCounts: Record<
    string,
    number
  > = {};

  switch (options.ancientOne.id) {
    case "cthulhu":
      setAsideMonsterCounts["deep-one"] = 1;
      setAsideMonsterCounts["star-spawn"] = 1;
      break;

    case "shub-niggurath":
      setAsideMonsterCounts["ghoul"] = 2;
      setAsideMonsterCounts["goat-spawn"] = 2;
      setAsideMonsterCounts["dark-young"] = 1;
      break;

    case "azathoth":
    case "yog-sothoth":
      break;
  }

  /*
  * ============================================================
  * CREATE MONSTER CUP
  * ============================================================
  */

  for (const definition of CORE_MONSTERS) {
    /*
    * Epic Monsters are never placed in
    * the normal Monster Cup.
    */
    if (definition.epic) {
      continue;
    }

    const setAsideCount =
      setAsideMonsterCounts[
        definition.id
      ] ?? 0;

    const quantityInCup =
      Math.max(
        0,
        definition.quantity -
          setAsideCount,
      );

    for (
      let instanceNumber = 1;
      instanceNumber <= quantityInCup;
      instanceNumber++
    ) {
      monsterCup.push(
        createMonster(
          definition,
          instanceNumber,
        ),
      );
    }
  }

  /*
  * ============================================================
  * SHUFFLE MONSTER CUP
  * ============================================================
  */

  monsterCup.sort(
    () => Math.random() - 0.5,
  );

  /*
  * ============================================================
  * SHUFFLE MONSTER CUP
  * ============================================================
  */

  monsterCup.sort(
    () => Math.random() - 0.5,
  );

  const mythosDeck =
    createMythosDeck(
      options.ancientOne,
    );

  /*
   * ============================================================
   * CLUE POOL
   * ============================================================
   *
   * Eldritch Horror has one Clue token for each map location.
   *
   * We represent each physical Clue token by the spaceId
   * printed on that token.
   */

  const cluePool: ClueToken[] =
    options.map.spaces
      .map((space) => ({
        id: `clue-${space.id}`,
        spaceId: space.id,
      }))
      .sort(
        () => Math.random() - 0.5,
      );

  const clueDiscard: ClueToken[] = [];

  /*
   * ============================================================
   * BOARD
   * ============================================================
   */

  return {
    spaces,

    assetDeck,

    assetReserve,

    assetDiscard: [],

    spellDeck,

    spellDiscard: [],

    artifactDeck,

    artifactDiscard: [],

    conditionDeck,

    conditionDiscard: [],

    encounterDecks: {
      america: [],
      europe: [],
      "asia-australia": [],
      general: [],
      research: [],
      "other-world": [],
      special: [],
      expedition: [],
    },

    encounterDiscards: {
      america: [],
      europe: [],
      "asia-australia": [],
      general: [],
      research: [],
      "other-world": [],
      special: [],
      expedition: [],
    },

    monsterCup,

    monsterDiscard: [],

    mythosDeck,

    gateStack,

    gateDiscard,

    activeExpeditionSpaceId: null,

    mythosInPlay: [],

    mythosDiscard: [],

    cluePool,

    clueDiscard,
  };
}