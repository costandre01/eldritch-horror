import type { MysteryDefinition } from "../../../game/models/Mystery";

export const AZATHOTH_MYSTERIES: MysteryDefinition[] = [
  {
    id: "azathoth-occult-research",
    name: "Occult Research",
    ancientOneId: "azathoth",
    type: "research-encounter",

    image:
      "/cards/Mystery/Azathoth/Azathoth-Mystery-Occult-Research.jpg",

    text:
      "After an investigator resolves a Research Encounter, " +
      "he may spend 1 Clue gained from that encounter to place " +
      "that Clue on this Mystery. At the end of the Mythos Phase, " +
      "if the number of Clues on this Mystery equals the number " +
      "of investigators, solve it.",
  },

  {
    id: "azathoth-omen-of-devastation",
    name: "Omen of Devastation",
    ancientOneId: "azathoth",
    type: "miscellaneous",

    image:
      "/cards/Mystery/Azathoth/Azathoth-Mystery-Omen-of-Devastation.jpg",

    text:
      "When an investigator closes a Gate that corresponds to " +
      "the current Omen, he may spend 1 Clue to place 1 Eldritch " +
      "token on this Mystery. At the end of the Mythos Phase, " +
      "if the number of Eldritch tokens on this Mystery equals " +
      "half the number of investigators, rounded up, solve it.",
  },

  {
    id: "azathoth-seed-of-the-daemon-sultan",
    name: "Seed of the Daemon Sultan",
    ancientOneId: "azathoth",
    type: "miscellaneous",

    image:
      "/cards/Mystery/Azathoth/Azathoth-Mystery-Seed-of-the-Daemon-Sultan.jpg",

    text:
      "When this Mystery enters play, place the Mystery token " +
      "on Tunguska. An investigator on Tunguska may investigate " +
      "the impact site. If he passes the required Observation test, " +
      "he may spend 2 Clues to place 1 Eldritch token on this Mystery. " +
      "At the end of the Mythos Phase, if the number of Eldritch " +
      "tokens equals half the number of investigators, rounded up, " +
      "solve it.",
  },

  {
    id: "azathoth-the-true-name",
    name: "The True Name",
    ancientOneId: "azathoth",
    type: "eldritch-tokens",

    image:
      "/cards/Mystery/Azathoth/Azathoth-Mystery-The-True-Name.jpg",

    text:
      "When this Mystery enters play, place Eldritch tokens equal " +
      "to half the number of investigators, rounded up, on random " +
      "spaces. An investigator on a space containing an Eldritch " +
      "token may investigate Azathoth's true name and spend 2 Clues " +
      "to place that token on this Mystery. At the end of the Mythos " +
      "Phase, if the number of Eldritch tokens on this Mystery equals " +
      "half the number of investigators, rounded up, solve it.",
  },
];