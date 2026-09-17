import type { MythosDefinition } from "../models/Mythos";
import type { AncientOneDefinition } from "../models/AncientOneDefinition";

import { easyMythos } from "../../content/core/mythos/easyMythos";
import { normalMythos } from "../../content/core/mythos/normalMythos";
import { hardMythos } from "../../content/core/mythos/hardMythos";

type MythosColor =
  | "green"
  | "yellow"
  | "blue";

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
        Math.random() * (index + 1),
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
 * DETERMINE MYTHOS COLOR
 * ============================================================
 *
 * The physical Mythos cards are separated into:
 *
 * GREEN
 * YELLOW
 * BLUE
 *
 * Blue cards are Rumors.
 *
 * Green cards contain the Monster Surge /
 * Spawn Clues pattern.
 *
 * Yellow cards contain the Reckoning /
 * Spawn Gates pattern.
 */

function getMythosColor(
  mythos: MythosDefinition,
): MythosColor {
  /*
   * BLUE
   *
   * Rumor Mythos cards.
   */

  if (
    mythos.type === "rumor"
  ) {
    return "blue";
  }

  /*
   * GREEN
   *
   * Monster Surge or Spawn Clues.
   */

  const isGreen =
    mythos.icons.some(
      (icon) =>
        icon.type ===
          "monster-surge" ||
        icon.type ===
          "spawn-clues",
    );

  if (isGreen) {
    return "green";
  }

  /*
   * YELLOW
   *
   * The remaining core Mythos cards
   * belong to the yellow pile.
   */

  return "yellow";
}

/*
 * ============================================================
 * BUILD COLOR PILES
 * ============================================================
 */

function buildColorPiles() {
  const allMythos: MythosDefinition[] = [
    ...easyMythos,
    ...normalMythos,
    ...hardMythos,
  ];

  const piles: Record<
    MythosColor,
    MythosDefinition[]
  > = {
    green: [],
    yellow: [],
    blue: [],
  };

  for (
    const mythos of allMythos
  ) {
    const color =
      getMythosColor(mythos);

    piles[color].push(
      mythos,
    );
  }

  /*
   * Each color pile is shuffled independently,
   * exactly as the physical game requires.
   */

  piles.green =
    shuffle(piles.green);

  piles.yellow =
    shuffle(piles.yellow);

  piles.blue =
    shuffle(piles.blue);

  return piles;
}

/*
 * ============================================================
 * DRAW RANDOM CARDS
 * ============================================================
 */

function drawCards(
  pile: MythosDefinition[],
  amount: number,
  color: MythosColor,
): MythosDefinition[] {
  if (amount < 0) {
    throw new Error(
      `Invalid ${color} Mythos amount: ${amount}.`,
    );
  }

  if (
    pile.length < amount
  ) {
    throw new Error(
      `Not enough ${color} Mythos cards. Required ${amount}, available ${pile.length}.`,
    );
  }

  return pile.splice(
    0,
    amount,
  );
}

/*
 * ============================================================
 * BUILD MYTHOS DECK
 * ============================================================
 */

export function createMythosDeck(
  ancientOne: AncientOneDefinition,
): MythosDefinition[] {
  const piles =
    buildColorPiles();

  const stages =
    ancientOne.mythosStages;

  const deck: MythosDefinition[] =
    [];

  /*
   * ==========================================================
   * STAGE I
   * ==========================================================
   */

  const stageOne = [
    ...drawCards(
      piles.green,
      stages[0].green,
      "green",
    ),

    ...drawCards(
      piles.yellow,
      stages[0].yellow,
      "yellow",
    ),

    ...drawCards(
      piles.blue,
      stages[0].blue,
      "blue",
    ),
  ];

  deck.push(
    ...shuffle(stageOne),
  );

  /*
   * ==========================================================
   * STAGE II
   * ==========================================================
   */

  const stageTwo = [
    ...drawCards(
      piles.green,
      stages[1].green,
      "green",
    ),

    ...drawCards(
      piles.yellow,
      stages[1].yellow,
      "yellow",
    ),

    ...drawCards(
      piles.blue,
      stages[1].blue,
      "blue",
    ),
  ];

  deck.push(
    ...shuffle(stageTwo),
  );

  /*
   * ==========================================================
   * STAGE III
   * ==========================================================
   */

  const stageThree = [
    ...drawCards(
      piles.green,
      stages[2].green,
      "green",
    ),

    ...drawCards(
      piles.yellow,
      stages[2].yellow,
      "yellow",
    ),

    ...drawCards(
      piles.blue,
      stages[2].blue,
      "blue",
    ),
  ];

  deck.push(
    ...shuffle(stageThree),
  );

  /*
   * ==========================================================
   * VALIDATE DECK SIZE
   * ==========================================================
   */

  if (
    deck.length !==
    ancientOne.mythosDeckSize
  ) {
    throw new Error(
      `Mythos deck for "${ancientOne.id}" has ${deck.length} cards, expected ${ancientOne.mythosDeckSize}.`,
    );
  }

  return deck;
}