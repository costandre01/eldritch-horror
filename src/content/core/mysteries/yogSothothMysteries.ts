import type { MysteryDefinition } from "../../../game/models/Mystery";

export const YOG_SOTHOTH_MYSTERIES: MysteryDefinition[] = [
  {
    id: "yog-sothoth-arcane-understanding",
    name: "Arcane Understanding",
    ancientOneId: "yog-sothoth",
    type: "miscellaneous",

    image:
      "/cards/Mystery/Yog-Sothoth/Yog-Sothoth-Mystery-Arcane-Understanding.jpg",

    text:
      "When an investigator passes a Lore test while resolving a Spell " +
      "effect, he may spend 1 Clue and discard that Spell after finishing " +
      "its effects. If he does, place 1 Eldritch token on this Mystery. " +
      "At the end of the Mythos Phase, if the number of Eldritch tokens " +
      "equals half the number of investigators, rounded up, solve it.",
  },

  {
    id: "yog-sothoth-spawn-of-yog-sothoth",
    name: "Spawn of Yog-Sothoth",
    ancientOneId: "yog-sothoth",
    type: "epic-monster",

    image:
      "/cards/Mystery/Yog-Sothoth/Yog-Sothoth-Mystery-Spawn-of-Yog-Sothoth.jpg",

    text:
      "When this Mystery enters play, spawn the Dunwich Horror Epic " +
      "Monster on Arkham. At the end of the Mythos Phase, if the Dunwich " +
      "Horror has been defeated, solve this Mystery.",
  },

  {
    id: "yog-sothoth-the-beyond-one",
    name: "The Beyond One",
    ancientOneId: "yog-sothoth",
    type: "research-encounter",

    image:
      "/cards/Mystery/Yog-Sothoth/Yog-Sothoth-Mystery-The-Beyond-One.jpg",

    text:
      "After an investigator resolves a Research Encounter, he may " +
      "spend 1 Clue gained from that encounter and place it on this " +
      "Mystery. At the end of the Mythos Phase, if the number of Clues " +
      "equals the number of investigators, solve it.",
  },

  {
    id: "yog-sothoth-where-the-old-ones-broke-through",
    name: "Where the Old Ones Broke Through",
    ancientOneId: "yog-sothoth",
    type: "miscellaneous",

    image:
      "/cards/Mystery/Yog-Sothoth/Yog-Sothoth-Mystery-Where-the-Old-Ones-Broke-Through.jpg",

    text:
      "When an investigator closes a Gate, he may discard 2 Spells to " +
      "place that Gate on this Mystery. At the end of the Mythos Phase, " +
      "if the number of Gates on this Mystery equals half the number of " +
      "investigators, rounded up, return those Gates to the game box " +
      "and solve this Mystery.",
  },
];