import type { MysteryDefinition } from "../../../game/models/Mystery";

export const SHUB_NIGGURATH_MYSTERIES: MysteryDefinition[] = [
  {
    id: "shub-niggurath-hunting-the-thousand",
    name: "Hunting the Thousand",
    ancientOneId: "shub-niggurath",
    type: "miscellaneous",

    image:
      "/cards/Mystery/Shub-Niggurath/Shub-Niggurath-Mystery-Hunting-the-Thousand.jpg",

    text:
      "When a non-Epic Monster is defeated, the active investigator " +
      "may spend 2 Clues to place that Monster on this Mystery. At the " +
      "end of the Mythos Phase, if the total Toughness of all Monsters " +
      "on this Mystery is at least twice the number of investigators, " +
      "solve it.",
  },

  {
    id: "shub-niggurath-nature-of-the-all-mother",
    name: "Nature of the All-Mother",
    ancientOneId: "shub-niggurath",
    type: "research-encounter",

    image:
      "/cards/Mystery/Shub-Niggurath/Shub-Niggurath-Mystery-Nature-of-the-All-Mother.jpg",

    text:
      "When this Mystery enters play, move each Clue on the game board " +
      "to the nearest Wilderness or Sea space. After an investigator " +
      "resolves a Research Encounter, he may spend 1 Clue gained from " +
      "that encounter to place it on this Mystery. At the end of the " +
      "Mythos Phase, if the number of Clues equals the number of " +
      "investigators, solve it.",
  },

  {
    id: "shub-niggurath-rituals-in-the-wild",
    name: "Rituals in the Wild",
    ancientOneId: "shub-niggurath",
    type: "eldritch-tokens",

    image:
      "/cards/Mystery/Shub-Niggurath/Shub-Niggurath-Mystery-Rituals-in-the-Wild.jpg",

    text:
      "When this Mystery enters play, place 1 Eldritch token on each " +
      "of spaces 4, 10, 21 and Tunguska. An investigator on a space " +
      "containing an Eldritch token may attempt to determine the ritual's " +
      "purpose. If he passes, he may spend 2 Clues to place that Eldritch " +
      "token on this Mystery. At the end of the Mythos Phase, if the " +
      "number of Eldritch tokens equals half the number of investigators, " +
      "rounded up, solve it and discard the Eldritch tokens placed by " +
      "this Mystery from the board.",
  },

  {
    id: "shub-niggurath-spawn-of-the-black-goat",
    name: "Spawn of the Black Goat",
    ancientOneId: "shub-niggurath",
    type: "epic-monster",

    image:
      "/cards/Mystery/Shub-Niggurath/Shub-Niggurath-Mystery-Spawn-of-the-Black-Goat.jpg",

    text:
      "When this Mystery enters play, spawn the Nug Epic Monster on " +
      "The Amazon. At the end of the Mythos Phase, if Nug has been " +
      "defeated, solve this Mystery.",
  },
];