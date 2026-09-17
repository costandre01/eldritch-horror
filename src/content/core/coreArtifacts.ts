import type { ArtifactDefinition } from "../../game/models/ArtifactDefinition";

export const CORE_ARTIFACTS: ArtifactDefinition[] = [
    {
        id: "cultes-des-goules",

        name: "Cultes des Goules",

        type: "item",

        traits: [
            "tome",
        ],

        description:
            "Action: Test [lore] Lore. If you pass, you may spend [sanity] 1 Sanity to gain [clue] 2 Clues.",

        image: "/cards/artifacts/cultes-des-goules.png",
    },

    {
        id: "de-vermis-mysteriis",

        name: "De Vermis Mysteriis",

        type: "item",

        traits: [
            "tome",
        ],

        description:
            "Action: Test [lore] Lore. If you pass, you may spend [sanity] 1 Sanity to improve 1 skill of your choice.",

        image: "/cards/artifacts/de-vermis-mysteriis.png",
    },

    {
        id: "flute-of-the-outer-gods",

        name: "Flute of the Outer Gods",

        type: "item",

        traits: [
            "magical",
        ],

        description:
            "Action: Spend [health] 2 Health and [sanity] 2 Sanity to defeat all Monsters on your space.",

        image: "/cards/artifacts/flute-of-the-outer-gods.png",
    },

    {
        id: "gate-box",

        name: "Gate Box",

        type: "item",

        traits: [
            "magical",
        ],

        description:
            "Investigators on your space roll 1 additional die when resolving tests during Other World Encounters.\n\nIf you close a Gate during an Other World Encounter, gain [clue] 1 Clue.",

        image: "/cards/artifacts/gate-box.png",
    },

    {
        id: "glass-of-mortlan",

        name: "Glass of Mortlan",

        type: "item",

        traits: [
            "magical",
        ],

        description:
            "Each 6 you roll when resolving a Spell effect counts as 2 successes.\n\nYou may prevent the loss of [sanity] 1 Sanity when resolving your Spell effects.",

        image: "/cards/artifacts/glass-of-mortlan.png",
    },

    {
        id: "grotesque-statue",

        name: "Grotesque Statue",

        type: "item",

        traits: [],

        description:
            "When you gain this card from the deck, gain [clue] 5 Clues.\n\nOnce per round, you may spend [clue] 1 Clue to prevent all [sanity] Sanity loss from a single effect.",

        image: "/cards/artifacts/grotesque-statue.png",
    },

    {
        id: "lightning-gun",

        name: "Lightning Gun",

        type: "item",

        traits: [
            "magical",
            "weapon",
        ],

        description:
            "Gain [strength] +6 Strength when resolving a Combat Encounter.\n\nAction: You and each Monster on your space lose [health] 1 Health.",

        image: "/cards/artifacts/lightning-gun.png",
    },

    {
        id: "mi-go-brain-case",

        name: "Mi-Go Brain Case",

        type: "item",

        traits: [
            "magical",
            "teamwork",
        ],

        description:
            "Action: You and another investigator may trade possessions. In addition, he may move to your space; if he does, move to his previous space.",

        image: "/cards/artifacts/mi-go-brain-case.png",
    },

    {
        id: "necronomicon",

        name: "Necronomicon",

        type: "item",

        traits: [
            "tome",
        ],

        description:
            "Action: Test [lore] Lore. If you pass, you may spend [sanity] 1 Sanity to gain [spell] 2 Spells.",

        image: "/cards/artifacts/necronomicon.png",
    },

    {
        id: "pallid-mask",

        name: "Pallid Mask",

        type: "item",

        traits: [
            "magical",
        ],

        description:
            "During the Encounter Phase, you may choose an encounter as if there are no Monsters on your space.",

        image: "/cards/artifacts/pallid-mask.png",
    },

    {
        id: "ruby-of-rlyeh",

        name: "Ruby of R'lyeh",

        type: "item",

        traits: [
            "magical",
        ],

        description:
            "Once per round, during the Action Phase, you may spend [sanity] 1 Sanity and perform 1 additional action.",

        image: "/cards/artifacts/ruby-of-rlyeh.png",
    },

    {
        id: "sword-of-saint-jerome",

        name: "Sword of Saint Jerome",

        type: "item",

        traits: [
            "magical",
            "weapon",
        ],

        description:
            "Gain [will] +2 Will and [strength] +5 Strength when resolving Combat Encounters.\n\nIf you defeat a Monster during a Combat Encounter, recover [sanity] 1 Sanity.",

        image: "/cards/artifacts/sword-of-saint-jerome.png",
    },

    {
        id: "tka-halot",

        name: "T'tka Halot",

        type: "item",

        traits: [
            "tome",
        ],

        description:
            "Action: Test [lore] Lore. If you pass, you may spend [sanity] 1 Sanity to choose 1 Monster on your space to lose [health] 3 Health.",

        image: "/cards/artifacts/tka-halot.png",
    },

    {
        id: "the-silver-key",

        name: "The Silver Key",

        type: "item",

        traits: [
            "magical",
        ],

        description:
            "Once per round, you may spend 1 less [clue] Clue to pay for an effect.\n\nYou may reroll 1 die when resolving a test during an Other World Encounter.",

        image: "/cards/artifacts/the-silver-key.png",
    },
];

/*
 * ============================================================
 * CORE ARTIFACT LOOKUP
 * ============================================================
 *
 * Used when we need to retrieve one specific Artifact
 * definition by ID.
 * ============================================================
 */

export function getCoreArtifactDefinition(
    artifactId: string,
): ArtifactDefinition | undefined {
    return CORE_ARTIFACTS.find(
        (artifact) => artifact.id === artifactId,
    );
}