import type { Asset } from "../../game/models/Asset";

export const coreAssets: Asset[] = [
  /*
   * ============================================================
   * WEAPONS
   * ============================================================
   */

  {
    id: "asset-derringer-18",

    name: ".18 Derringer",

    type: "trinket",

    traits: [
      "weapon",
    ],

    value: 1,

    description:
      "You may add 1 to the result of 1 die when resolving a [strength] test during a Combat Encounter.",

    image:
      "/cards/assets/18_Derringer.png",
  },

  {
    id: "asset-38-revolver",

    name: ".38 Revolver",

    type: "item",

    traits: [
      "weapon",
    ],

    value: 1,

    description:
      "Gain +2 [strength] during Combat Encounters.",

    image:
      "/cards/assets/38_Revolver.png",
  },

  {
    id: "asset-45-automatic",

    name: ".45 Automatic",

    type: "item",

    traits: ["weapon"],

    value: 2,

    description:
      "Gain +3 [strength] during Combat Encounters.",

    image:
      "/cards/assets/45_Automatic.png",
  },

  {
    id: "asset-agency-quarantine",

    name: "Agency Quarantine",

    type: "service",

    traits: [],

    value: 4,

    description:
      "When you gain this card, immediately choose a space.\n\nEach Monster on the chosen space loses [health] 4 Health. Then discard this card.",

    image:
      "/cards/assets/Agency_Quarantine.png",
  },

  {
    id: "asset-arcane-manuscripts",

    name: "Arcane Manuscripts",

    type: "item",

    traits: ["tome"],

    value: 1,

    description:
      "Gain +1 [lore] when resolving Spell effects.",

    image:
      "/cards/assets/Arcane_Manuscripts.png",
  },

  {
    id: "asset-arcane-scholar",

    name: "Arcane Scholar",

    type: "ally",

    traits: [],

    value: 2,

    description:
      "Gain +1 [lore].\n\nYou may reroll 1 die when resolving a [lore] test.",

    image:
      "/cards/assets/Arcane_Scholar.png",
  },

  {
    id: "asset-arcane-tome",

    name: "Arcane Tome",

    type: "item",

    traits: ["tome"],

    value: 3,

    description:
      "Gain +2 [lore] when resolving Spell effects.\n\nWhen you perform a Rest action, you may test [lore]. If you pass, gain 1 Spell.",

    image:
      "/cards/assets/Arcane_Tome.png",
  },

  {
    id: "asset-axe",

    name: "Axe",

    type: "item",

    traits: ["weapon"],

    value: 2,

    description:
      "Gain +2 [strength] during Combat Encounters.\n\nYou may spend 2 [sanity] to reroll any number of dice when resolving a [strength] test during a Combat Encounter.",

    image:
      "/cards/assets/Axe.png",
  },

  {
    id: "asset-bandages",

    name: "Bandages",

    type: "service",

    traits: [],

    value: 1,

    description:
      "You may discard this card to prevent an investigator on your space from losing up to 2 [health].",

    image:
      "/cards/assets/Bandages.png",
  },

  {
    id: "asset-bull-whip",

    name: "Bull Whip",

    type: "item",

    traits: ["weapon"],

    value: 1,

    description:
      "Gain +1 [strength] during Combat Encounters.\n\nYou may reroll 1 die when resolving a [strength] test during a Combat Encounter.",

    image:
      "/cards/assets/Bull_Whip.png",
  },

  {
    id: "asset-carbine-rifle",

    name: "Carbine Rifle",

    type: "item",

    traits: ["weapon"],

    value: 3,

    description:
      "Once per round, you may gain +5 [strength] during a Combat Encounter.",

    image:
      "/cards/assets/Carbine_Rifle.png",
  },

  {
    id: "asset-cat-burglar",

    name: "Cat Burglar",

    type: "ally",

    traits: [],

    value: 1,

    description:
      "Action: Roll 1 die. On a 5 or 6, gain 1 Item or Trinket Asset from the reserve. On a 1, discard this card.",

    image:
      "/cards/assets/Cat_Burglar.png",
  },

  {
    id: "asset-charter-flight",

    name: "Charter Flight",

    type: "service",

    traits: [],

    value: 1,

    description:
      "When you gain this card, immediately move up to 2 spaces.\n\nThen discard this card.",

    image:
      "/cards/assets/Charter_Flight.png",
  },

  {
    id: "asset-delivery-service",

    name: "Delivery Service",

    type: "service",

    traits: ["teamwork"],

    value: 1,

    description:
      "When you gain this card, immediately give any number of Item possessions to another investigator on any space.\n\nThen discard this card.",

    image:
      "/cards/assets/Delivery_Service.png",
  },

  {
    id: "asset-double-barreled-shotgun",

    name: "Double-barreled Shotgun",

    type: "item",

    traits: ["weapon"],

    value: 4,

    description:
      "Gain +4 [strength] during Combat Encounters.\n\nEach 6 you roll when resolving a [strength] test during a Combat Encounter counts as 2 successes.",

    image:
      "/cards/assets/Double-barreled_Shotgun.png",
  },

  {
    id: "asset-dynamite",

    name: "Dynamite",

    type: "item",

    traits: ["weapon"],

    value: 3,

    description:
      "Action: You may discard this card to cause each Monster on your space to lose [health] 3 Health.",

    image:
      "/cards/assets/Dynamite.png",
  },

  {
    id: "asset-fine-clothes",

    name: "Fine Clothes",

    type: "item",

    traits: [],

    value: 2,

    description:
      "Each 6 you roll when performing an Acquire Assets action counts as 2 successes.",

    image:
      "/cards/assets/Fine_Clothes.png",
  },

  {
    id: "asset-fishing-net",

    name: "Fishing Net",

    type: "item",

    traits: [],

    value: 2,

    description:
      "You may reroll 1 die when resolving a [strength] test during a Combat Encounter.\n\nReduce the damage of Monsters you encounter by 1 to a minimum of 1.",

    image:
      "/cards/assets/Fishing_Net.png",
  },

  {
    id: "asset-hired-muscle",

    name: "Hired Muscle",

    type: "ally",

    traits: [],

    value: 2,

    description:
      "Gain +1 [strength].\n\nYou may reroll 1 die when resolving a [strength] test.",

    image:
      "/cards/assets/Hired_Muscle.png",
  },

  {
    id: "asset-holy-cross",

    name: "Holy Cross",

    type: "item",

    traits: [],

    value: 2,

    description:
      "Gain +2 [will] during Combat Encounters.",

    image:
      "/cards/assets/Holy_Cross.png",
  },

  {
    id: "asset-holy-water",

    name: "Holy Water",

    type: "item",

    traits: ["magical"],

    value: 2,

    description:
      "You may discard this card to gain +5 [will] and +5 [strength] during a Combat Encounter.\n\nAction: You may discard this card to choose an investigator on your space. That investigator gains a Blessed Condition.",
  
    image:
      "/cards/assets/Holy_Water.png",
  },

  {
    id: "asset-kerosene",

    name: "Kerosene",

    type: "item",

    traits: [],

    value: 1,

    description:
      "You may discard this card to gain +5 [strength] during a Combat Encounter.",

    image:
      "/cards/assets/Kerosene.png",
  },

  {
    id: "asset-king-james-bible",

    name: "King James Bible",

    type: "item",

    traits: ["tome"],

    value: 2,

    description:
      "You may reroll 1 die when resolving a [will] test during a Combat Encounter.\n\nWhen you perform a Rest action, recover 1 additional [sanity] Sanity.",

    image:
      "/cards/assets/King_James_Bible.png",
  },

  {
    id: "asset-lodge-researcher",

    name: "Lodge Researcher",

    type: "ally",

    traits: [],

    value: 3,

    description:
      "If you defeat a Monster during a Combat Encounter, recover 1 [sanity] Sanity and gain 1 [clue] Clue.",

    image:
      "/cards/assets/Lodge_Researcher.png",
  },

  {
    id: "asset-lucky-cigarette-case",

    name: "Lucky Cigarette Case",

    type: "trinket",

    traits: [],

    value: 2,

    description:
      "Once per round, you may add 1 to the result of 1 die when resolving a test.",

    image:
      "/cards/assets/Lucky_Cigarette_Case.png",
  },

  {
    id: "asset-lucky-rabbits-foot",

    name: "Lucky Rabbit's Foot",

    type: "trinket",

    traits: [],

    value: 1,

    description:
      "Once per round, you may reroll 1 die when resolving a test.",

    image:
      "/cards/assets/Lucky_Rabbit's_Foot.png",
  },

  {
    id: "asset-personal-assistant",

    name: "Personal Assistant",

    type: "ally",

    traits: [],

    value: 2,

    description:
      "Gain +1 [influence].\n\nYou may reroll 1 die when resolving a [influence] test.",

    image:
      "/cards/assets/Personal_Assistant.png",
  },

  {
    id: "asset-pocket-watch",

    name: "Pocket Watch",

    type: "trinket",

    traits: [],

    value: 1,

    description:
      "You cannot become Delayed unless you choose to.",

    image:
      "/cards/assets/Pocket_Watch.png",
  },

  {
    id: "asset-private-care",

    name: "Private Care",

    type: "service",

    traits: [],

    value: 2,

    description:
      "When you gain this card, immediately recover all [health] Health and [sanity] Sanity.\n\nThen discard this card.",

    image:
      "/cards/assets/Private_Care.png",
  },

  {
    id: "asset-private-investigator",

    name: "Private Investigator",

    type: "ally",

    traits: [],

    value: 2,

    description:
      "Gain +1 [observation].\n\nYou may reroll 1 die when resolving a [observation] test.",

    image:
      "/cards/assets/Private_Investigator.png",
  },

  {
    id: "asset-protective-amulet",

    name: "Protective Amulet",

    type: "item",

    traits: [],

    value: 1,

    description:
      "Gain +1 [will] during Combat Encounters.",

    image:
      "/cards/assets/Protective_Amulet.png",
  },

  {
    id: "asset-puzzle-box",

    name: "Puzzle Box",

    type: "trinket",

    traits: [],

    value: 3,

    description:
      "When you perform a Rest action, you may attempt to open the puzzle box ([observation] -2). If you pass, you may discard this card to gain 1 Artifact.",

    image:
      "/cards/assets/Puzzle_Box.png",
  },

  {
    id: "asset-sanctuary",

    name: "Sanctuary",

    type: "service",

    traits: [],

    value: 2,

    description:
      "When you gain this card, you may immediately discard 1 Condition.\n\nThen discard this card.",

    image:
      "/cards/assets/Sanctuary.png",
  },

  {
    id: "asset-silver-twilight-ritual",

    name: "Silver Twilight Ritual",

    type: "service",

    traits: [],

    value: 3,

    description:
      "When you gain this card, immediately retreat [doom] Doom by 1.\n\nThen discard this card.",

    image:
      "/cards/assets/Silver_Twilight_Ritual.png",
  },

  {
    id: "asset-spirit-dagger",

    name: "Spirit Dagger",

    type: "item",

    traits: ["weapon", "magical"],

    value: 2,

    description:
      "Gain +1 [will] and +2 [strength] during Combat Encounters.",

    image:
      "/cards/assets/Spirit_Dagger.png",
  },

  {
    id: "asset-urban-guide",

    name: "Urban Guide",

    type: "ally",

    traits: [],

    value: 4,

    description:
      "If you are on a [city] City space, investigators on your space roll 1 additional die when resolving tests except when resolving Other World Encounters.",

    image:
      "/cards/assets/Urban_Guide.png",
  },

  {
    id: "asset-vatican-missionary",

    name: "Vatican Missionary",

    type: "ally",

    traits: [],

    value: 2,

    description:
      "Gain +1 [will].\n\nYou may reroll 1 die when resolving a [will] test.",

    image:
      "/cards/assets/Vatican_Missionary.png",
  },

  {
    id: "asset-whiskey",

    name: "Whiskey",

    type: "item",

    traits: [],

    value: 1,

    description:
      "You may discard this card to prevent an investigator on your space from losing up to 2 [sanity] Sanity.",

    image:
      "/cards/assets/Whiskey.png",
  },

  {
    id: "asset-wireless-report",

    name: "Wireless Report",

    type: "service",

    traits: ["teamwork"],

    value: 1,

    description:
      "When you gain this card, immediately give any number of [clue] Clues to another investigator on any space.",

    image:
      "/cards/assets/Wireless_Report.png",
  },

  {
    id: "asset-witch-doctor",

    name: "Witch Doctor",

    type: "ally",

    traits: [],

    value: 3,

    description:
      "Investigators on your space may recover 1 additional [health] Health or discard a Cursed Condition when performing a Rest action.",

    image:
      "/cards/assets/Witch_Doctor.png",
  },
];