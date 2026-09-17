import type { MapDefinition } from "../../../game/models/MapDefinition";

export const eldritchBaseMap: MapDefinition = {
  id: "eldritch-base",

  name: "Eldritch Horror",

  startingSpaceId: "arkham",

  spaces: [
    // =====================================================
    // NAMED CITY SPACES
    // =====================================================

    {
      id: "san-francisco",
      name: "San Francisco",
      type: "city",
      encounterRegion: "america",
      isExpedition: false,

      connectedSpaceIds: [
        "space-1",
        "space-2",
        "space-5",
        "space-6",
        "space-7",
      ],

      paths: [
        { toSpaceId: "space-1", type: "ship" },
        { toSpaceId: "space-2", type: "ship" },
        { toSpaceId: "space-5", type: "train" },
        { toSpaceId: "space-6", type: "train" },
        { toSpaceId: "space-7", type: "ship" },
      ],
    },

    {
      id: "arkham",
      name: "Arkham",
      type: "city",
      encounterRegion: "america",
      isExpedition: false,

      connectedSpaceIds: [
        "london",
        "space-5",
        "space-6",
        "space-8",
        "space-9",
      ],

      paths: [
        { toSpaceId: "london", type: "ship" },
        { toSpaceId: "space-5", type: "train" },
        { toSpaceId: "space-6", type: "train" },
        { toSpaceId: "space-8", type: "ship" },
        { toSpaceId: "space-9", type: "ship" },
      ],
    },

    {
      id: "buenos-aires",
      name: "Buenos Aires",
      type: "city",
      encounterRegion: "america",
      isExpedition: false,

      connectedSpaceIds: [
        "the-amazon",
        "space-3",
        "space-7",
        "space-8",
        "space-11",
        "space-12",
      ],

      paths: [
        { toSpaceId: "the-amazon", type: "uncharted" },
        { toSpaceId: "space-3", type: "ship" },
        { toSpaceId: "space-7", type: "ship" },
        { toSpaceId: "space-8", type: "ship" },
        { toSpaceId: "space-11", type: "ship" },
        { toSpaceId: "space-12", type: "ship" },
      ],
    },

    {
      id: "london",
      name: "London",
      type: "city",
      encounterRegion: "europe",
      isExpedition: false,

      connectedSpaceIds: [
        "arkham",
        "rome",
        "space-13",
      ],

      paths: [
        { toSpaceId: "arkham", type: "ship" },
        { toSpaceId: "rome", type: "ship" },
        { toSpaceId: "space-13", type: "ship" },
      ],
    },

    {
      id: "rome",
      name: "Rome",
      type: "city",
      encounterRegion: "europe",
      isExpedition: false,

      connectedSpaceIds: [
        "istanbul",
        "london",
        "the-pyramids",
        "space-10",
        "space-14",
      ],

      paths: [
        { toSpaceId: "istanbul", type: "train" },
        { toSpaceId: "london", type: "ship" },
        { toSpaceId: "the-pyramids", type: "ship" },
        { toSpaceId: "space-10", type: "ship" },
        { toSpaceId: "space-14", type: "train" },
      ],
    },

    {
      id: "istanbul",
      name: "Istanbul",
      type: "city",
      encounterRegion: "europe",
      isExpedition: false,

      connectedSpaceIds: [
        "rome",
        "the-pyramids",
        "space-16",
        "space-17",
      ],

      paths: [
        { toSpaceId: "rome", type: "train" },
        { toSpaceId: "the-pyramids", type: "train" },
        { toSpaceId: "space-16", type: "train" },
        { toSpaceId: "space-17", type: "train" },
      ],
    },

    {
      id: "tokyo",
      name: "Tokyo",
      type: "city",
      encounterRegion: "asia-australia",
      isExpedition: false,

      connectedSpaceIds: [
        "shanghai",
        "space-2",
        "space-19",
        "space-20",
      ],

      paths: [
        { toSpaceId: "shanghai", type: "ship" },
        { toSpaceId: "space-2", type: "ship" },
        { toSpaceId: "space-19", type: "ship" },
        { toSpaceId: "space-20", type: "ship" },
      ],
    },

    {
      id: "shanghai",
      name: "Shanghai",
      type: "city",
      encounterRegion: "asia-australia",
      isExpedition: false,

      connectedSpaceIds: [
        "the-himalayas",
        "tokyo",
        "space-17",
        "space-19",
        "space-20",
      ],

      paths: [
        { toSpaceId: "the-himalayas", type: "uncharted" },
        { toSpaceId: "tokyo", type: "ship" },
        { toSpaceId: "space-17", type: "train" },
        { toSpaceId: "space-19", type: "train" },
        { toSpaceId: "space-20", type: "ship" },
      ],
    },

    {
      id: "sydney",
      name: "Sydney",
      type: "city",
      encounterRegion: "asia-australia",
      isExpedition: false,

      connectedSpaceIds: [
        "antarctica",
        "space-3",
        "space-18",
        "space-20",
        "space-21",
      ],

      paths: [
        { toSpaceId: "antarctica", type: "ship" },
        { toSpaceId: "space-3", type: "ship" },
        { toSpaceId: "space-18", type: "ship" },
        { toSpaceId: "space-20", type: "ship" },
        { toSpaceId: "space-21", type: "uncharted" },
      ],
    },

    // =====================================================
    // EXPEDITION SPACES
    // =====================================================

    {
      id: "the-amazon",
      name: "The Amazon",
      type: "wilderness",
      isExpedition: true,

      connectedSpaceIds: [
        "buenos-aires",
        "space-7",
      ],

      paths: [
        { toSpaceId: "buenos-aires", type: "uncharted" },
        { toSpaceId: "space-7", type: "uncharted" },
      ],
    },

    {
      id: "the-pyramids",
      name: "The Pyramids",
      type: "wilderness",
      isExpedition: true,

      connectedSpaceIds: [
        "istanbul",
        "rome",
        "the-heart-of-africa",
        "space-10",
      ],

      paths: [
        { toSpaceId: "istanbul", type: "train" },
        { toSpaceId: "rome", type: "ship" },
        { toSpaceId: "the-heart-of-africa", type: "uncharted" },
        { toSpaceId: "space-10", type: "uncharted" },
      ],
    },

    {
      id: "the-heart-of-africa",
      name: "The Heart of Africa",
      type: "wilderness",
      isExpedition: true,

      connectedSpaceIds: [
        "the-pyramids",
        "space-15",
      ],

      paths: [
        { toSpaceId: "the-pyramids", type: "uncharted" },
        { toSpaceId: "space-15", type: "uncharted" },
      ],
    },

    {
      id: "the-himalayas",
      name: "The Himalayas",
      type: "wilderness",
      isExpedition: true,

      connectedSpaceIds: [
        "shanghai",
        "space-17",
      ],

      paths: [
        { toSpaceId: "shanghai", type: "uncharted" },
        { toSpaceId: "space-17", type: "uncharted" },
      ],
    },

    {
      id: "tunguska",
      name: "Tunguska",
      type: "wilderness",
      isExpedition: true,

      connectedSpaceIds: [
        "space-16",
        "space-19",
      ],

      paths: [
        { toSpaceId: "space-16", type: "train" },
        { toSpaceId: "space-19", type: "train" },
      ],
    },

    {
      id: "antarctica",
      name: "Antarctica",
      type: "sea",
      isExpedition: true,

      connectedSpaceIds: [
        "sydney",
        "space-12",
      ],

      paths: [
        { toSpaceId: "sydney", type: "ship" },
        { toSpaceId: "space-12", type: "ship" },
      ],
    },

    // =====================================================
    // NUMBERED SPACES
    // =====================================================

    {
      id: "space-1",
      name: "Space 1",
      type: "city",
      isExpedition: false,

      connectedSpaceIds: [
        "san-francisco",
        "space-4",
        "space-19",
      ],

      paths: [
        { toSpaceId: "san-francisco", type: "ship" },
        { toSpaceId: "space-4", type: "uncharted" },
        { toSpaceId: "space-19", type: "ship" },
      ],
    },

    {
      id: "space-2",
      name: "Space 2",
      type: "sea",
      isExpedition: false,

      connectedSpaceIds: [
        "san-francisco",
        "tokyo",
      ],

      paths: [
        { toSpaceId: "san-francisco", type: "ship" },
        { toSpaceId: "tokyo", type: "ship" },
      ],
    },

    {
      id: "space-3",
      name: "Space 3",
      type: "sea",
      isExpedition: false,

      connectedSpaceIds: [
        "buenos-aires",
        "sydney",
      ],

      paths: [
        { toSpaceId: "buenos-aires", type: "ship" },
        { toSpaceId: "sydney", type: "ship" },
      ],
    },

    {
      id: "space-4",
      name: "Space 4",
      type: "wilderness",
      isExpedition: false,

      connectedSpaceIds: [
        "space-1",
        "space-5",
      ],

      paths: [
        { toSpaceId: "space-1", type: "uncharted" },
        { toSpaceId: "space-5", type: "uncharted" },
      ],
    },

    {
      id: "space-5",
      name: "Space 5",
      type: "city",
      isExpedition: false,

      connectedSpaceIds: [
        "san-francisco",
        "arkham",
        "space-4",
      ],

      paths: [
        { toSpaceId: "san-francisco", type: "train" },
        { toSpaceId: "arkham", type: "train" },
        { toSpaceId: "space-4", type: "uncharted" },
      ],
    },

    {
      id: "space-6",
      name: "Space 6",
      type: "city",
      isExpedition: false,

      connectedSpaceIds: [
        "san-francisco",
        "arkham",
        "space-7",
      ],

      paths: [
        { toSpaceId: "san-francisco", type: "train" },
        { toSpaceId: "arkham", type: "train" },
        { toSpaceId: "space-7", type: "train" },
      ],
    },

    {
      id: "space-7",
      name: "Space 7",
      type: "city",
      isExpedition: false,

      connectedSpaceIds: [
        "buenos-aires",
        "san-francisco",
        "the-amazon",
        "space-6",
        "space-8",
      ],

      paths: [
        { toSpaceId: "buenos-aires", type: "ship" },
        { toSpaceId: "san-francisco", type: "ship" },
        { toSpaceId: "the-amazon", type: "uncharted" },
        { toSpaceId: "space-6", type: "train" },
        { toSpaceId: "space-8", type: "ship" },
      ],
    },

    {
      id: "space-8",
      name: "Space 8",
      type: "sea",
      isExpedition: false,

      connectedSpaceIds: [
        "arkham",
        "buenos-aires",
        "space-7",
        "space-10",
      ],

      paths: [
        { toSpaceId: "arkham", type: "ship" },
        { toSpaceId: "buenos-aires", type: "ship" },
        { toSpaceId: "space-7", type: "ship" },
        { toSpaceId: "space-10", type: "ship" },
      ],
    },

    {
      id: "space-9",
      name: "Space 9",
      type: "wilderness",
      isExpedition: false,

      connectedSpaceIds: [
        "arkham",
      ],

      paths: [
        { toSpaceId: "arkham", type: "ship" },
      ],
    },

    {
      id: "space-10",
      name: "Space 10",
      type: "wilderness",
      isExpedition: false,

      connectedSpaceIds: [
        "rome",
        "the-pyramids",
        "space-8",
        "space-15",
      ],

      paths: [
        { toSpaceId: "rome", type: "ship" },
        { toSpaceId: "the-pyramids", type: "uncharted" },
        { toSpaceId: "space-8", type: "ship" },
        { toSpaceId: "space-15", type: "ship" },
      ],
    },

    {
      id: "space-11",
      name: "Space 11",
      type: "sea",
      isExpedition: false,

      connectedSpaceIds: [
        "buenos-aires",
        "space-15",
      ],

      paths: [
        { toSpaceId: "buenos-aires", type: "ship" },
        { toSpaceId: "space-15", type: "ship" },
      ],
    },

    {
      id: "space-12",
      name: "Space 12",
      type: "sea",
      isExpedition: false,

      connectedSpaceIds: [
        "buenos-aires",
        "antarctica",
      ],

      paths: [
        { toSpaceId: "buenos-aires", type: "ship" },
        { toSpaceId: "antarctica", type: "ship" },
      ],
    },

    {
      id: "space-13",
      name: "Space 13",
      type: "sea",
      isExpedition: false,

      connectedSpaceIds: [
        "london",
      ],

      paths: [
        { toSpaceId: "london", type: "ship" },
      ],
    },

    {
      id: "space-14",
      name: "Space 14",
      type: "city",
      isExpedition: false,

      connectedSpaceIds: [
        "rome",
        "space-16",
      ],

      paths: [
        { toSpaceId: "rome", type: "train" },
        { toSpaceId: "space-16", type: "train" },
      ],
    },

    {
      id: "space-15",
      name: "Space 15",
      type: "city",
      isExpedition: false,

      connectedSpaceIds: [
        "the-heart-of-africa",
        "space-10",
        "space-11",
        "space-17",
        "space-18",
      ],

      paths: [
        { toSpaceId: "the-heart-of-africa", type: "uncharted" },
        { toSpaceId: "space-10", type: "ship" },
        { toSpaceId: "space-11", type: "ship" },
        { toSpaceId: "space-17", type: "ship" },
        { toSpaceId: "space-18", type: "ship" },
      ],
    },

    {
      id: "space-16",
      name: "Space 16",
      type: "city",
      isExpedition: false,

      connectedSpaceIds: [
        "istanbul",
        "tunguska",
        "space-14",
      ],

      paths: [
        { toSpaceId: "istanbul", type: "train" },
        { toSpaceId: "tunguska", type: "train" },
        { toSpaceId: "space-14", type: "train" },
      ],
    },

    {
      id: "space-17",
      name: "Space 17",
      type: "city",
      isExpedition: false,

      connectedSpaceIds: [
        "istanbul",
        "the-himalayas",
        "shanghai",
        "space-15",
        "space-20",
      ],

      paths: [
        { toSpaceId: "istanbul", type: "train" },
        { toSpaceId: "the-himalayas", type: "uncharted" },
        { toSpaceId: "shanghai", type: "train" },
        { toSpaceId: "space-15", type: "ship" },
        { toSpaceId: "space-20", type: "ship" },
      ],
    },

    {
      id: "space-18",
      name: "Space 18",
      type: "sea",
      isExpedition: false,

      connectedSpaceIds: [
        "sydney",
        "space-15",
      ],

      paths: [
        { toSpaceId: "sydney", type: "ship" },
        { toSpaceId: "space-15", type: "ship" },
      ],
    },

    {
      id: "space-19",
      name: "Space 19",
      type: "wilderness",
      isExpedition: false,

      connectedSpaceIds: [
        "shanghai",
        "tokyo",
        "tunguska",
        "space-1",
      ],

      paths: [
        { toSpaceId: "shanghai", type: "train" },
        { toSpaceId: "tokyo", type: "ship" },
        { toSpaceId: "tunguska", type: "train" },
        { toSpaceId: "space-1", type: "ship" },
      ],
    },

    {
      id: "space-20",
      name: "Space 20",
      type: "city",
      isExpedition: false,

      connectedSpaceIds: [
        "shanghai",
        "sydney",
        "tokyo",
        "space-17",
      ],

      paths: [
        { toSpaceId: "shanghai", type: "ship" },
        { toSpaceId: "sydney", type: "ship" },
        { toSpaceId: "tokyo", type: "ship" },
        { toSpaceId: "space-17", type: "ship" },
      ],
    },

    {
      id: "space-21",
      name: "Space 21",
      type: "wilderness",
      isExpedition: false,

      connectedSpaceIds: [
        "sydney",
      ],

      paths: [
        { toSpaceId: "sydney", type: "uncharted" },
      ],
    },
  ],
};