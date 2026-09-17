import type { MysteryDefinition } from "../../../game/models/Mystery";

export const CTHULHU_MYSTERIES: MysteryDefinition[] = [
  {
    id: "cthulhu-rlyeh-risen",
    name: "R'lyeh Risen",
    ancientOneId: "cthulhu",
    type: "special-encounter",

    image:
      "/cards/Mystery/Cthulhu/Cthulhu-Mystery-R'lyeh-Risen.jpg",

    text:
      "When this Mystery enters play, place the Mystery token on " +
      "space 3. An investigator on space 3 may resolve a R'lyeh Risen " +
      "Special Encounter. Successful Special Encounters place Eldritch " +
      "tokens on this Mystery. At the end of the Mythos Phase, if the " +
      "number of Eldritch tokens equals half the number of investigators, " +
      "rounded up, solve it.",
  },

  {
    id: "cthulhu-the-deep-ones-attack",
    name: "The Deep Ones Attack!",
    ancientOneId: "cthulhu",
    type: "eldritch-tokens",

    image:
      "/cards/Mystery/Cthulhu/Cthulhu-Mystery-The-Deep-Ones-Attack!.jpg",

    text:
      "When this Mystery enters play, each investigator places 1 " +
      "Eldritch token on the nearest Sea space that does not contain " +
      "an Eldritch token. An investigator on a space containing an " +
      "Eldritch token may be ambushed by a Deep One. After defeating " +
      "the Deep One, he may spend 1 Clue to place that Eldritch token " +
      "on this Mystery. At the end of the Mythos Phase, if the number " +
      "of Eldritch tokens on this Mystery equals the number of " +
      "investigators, solve it. Remaining board Eldritch tokens stay.",
  },

  {
    id: "cthulhu-the-stars-are-right",
    name: "The Stars Are Right!",
    ancientOneId: "cthulhu",
    type: "research-encounter",

    image:
      "/cards/Mystery/Cthulhu/Cthulhu-Mystery-The-Stars-Are-Right!.jpg",

    text:
      "When this Mystery enters play, move each Clue on the game " +
      "board to the nearest Sea space. After an investigator resolves " +
      "a Research Encounter, he may spend 1 Clue gained from that " +
      "encounter to place it on this Mystery. At the end of the Mythos " +
      "Phase, if the number of Clues equals the number of investigators, " +
      "solve it.",
  },

  {
    id: "cthulhu-watching-the-stars",
    name: "Watching the Stars",
    ancientOneId: "cthulhu",
    type: "epic-monster",

    image:
      "/cards/Mystery/Cthulhu/Cthulhu-Mystery-Watching-the-Stars.jpg",

    text:
      "When this Mystery enters play, spawn the Cthylla Epic Monster " +
      "on space 12. At the end of the Mythos Phase, if Cthylla has " +
      "been defeated, solve this Mystery.",
  },
];