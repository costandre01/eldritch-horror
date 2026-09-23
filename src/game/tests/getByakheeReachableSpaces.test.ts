import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getByakheeReachableSpaces,
} from "../engine/getByakheeReachableSpaces";

import type {
  MapDefinition,
  MapPathDefinition,
  MapSpaceDefinition,
} from "../models/MapDefinition";

function createPath(
  toSpaceId: string,
): MapPathDefinition {
  return {
    toSpaceId,
    type: "train",
  };
}

function createSpace(
  id: string,
  paths: string[] = [],
): MapSpaceDefinition {
  return {
    id,
    name: id,
    type: "city",
    isExpedition: false,
    connectedSpaceIds: [
      ...paths,
    ],
    paths: paths.map(
      createPath,
    ),
  };
}

function createMap(
  spaces: MapSpaceDefinition[],
): MapDefinition {
  return {
    id: "test-map",
    name: "Test Map",
    spaces,
    startingSpaceId:
      spaces[0]?.id ?? "",
  };
}

describe(
  "getByakheeReachableSpaces",
  () => {
    it(
      "returns reachable spaces within the maximum movement distance",
      () => {
        const map = createMap([
          createSpace("arkham", [
            "woods",
          ]),

          createSpace("woods", [
            "arkham",
            "cave",
          ]),

          createSpace("cave", [
            "woods",
            "innsmouth",
          ]),

          createSpace(
            "innsmouth",
          ),
        ]);

        const result =
          getByakheeReachableSpaces(
            map,
            "arkham",
            2,
          );

        expect(result).toEqual([
          "woods",
          "cave",
        ]);
      },
    );

    it(
      "uses the default maximum movement of 3",
      () => {
        const map = createMap([
          createSpace("a", ["b"]),
          createSpace("b", ["c"]),
          createSpace("c", ["d"]),
          createSpace("d", ["e"]),
          createSpace("e"),
        ]);

        const result =
          getByakheeReachableSpaces(
            map,
            "a",
          );

        expect(result).toEqual([
          "b",
          "c",
          "d",
        ]);
      },
    );

    it(
      "does not move beyond the maximum distance",
      () => {
        const map = createMap([
          createSpace("a", ["b"]),
          createSpace("b", ["c"]),
          createSpace("c", ["d"]),
          createSpace("d"),
        ]);

        const result =
          getByakheeReachableSpaces(
            map,
            "a",
            2,
          );

        expect(result).toEqual([
          "b",
          "c",
        ]);
      },
    );

    it(
      "does not revisit already visited spaces",
      () => {
        const map = createMap([
          createSpace("a", [
            "b",
            "c",
          ]),

          createSpace("b", [
            "a",
            "d",
          ]),

          createSpace("c", [
            "a",
            "d",
          ]),

          createSpace("d"),
        ]);

        const result =
          getByakheeReachableSpaces(
            map,
            "a",
            3,
          );

        expect(result).toEqual([
          "b",
          "c",
          "d",
        ]);
      },
    );

    it(
      "handles a destination space that does not exist in the map",
      () => {
        const map = createMap([
          createSpace("a", [
            "missing",
          ]),
        ]);

        const result =
          getByakheeReachableSpaces(
            map,
            "a",
            3,
          );

        expect(result).toEqual([
          "missing",
        ]);
      },
    );

    it(
      "returns no spaces when maximum movement is zero",
      () => {
        const map = createMap([
          createSpace("a", [
            "b",
          ]),

          createSpace("b"),
        ]);

        const result =
          getByakheeReachableSpaces(
            map,
            "a",
            0,
          );

        expect(result).toEqual([]);
      },
    );

    it(
      "handles negative maximum movement without moving",
      () => {
        const map = createMap([
          createSpace("a", [
            "b",
          ]),

          createSpace("b"),
        ]);

        const result =
          getByakheeReachableSpaces(
            map,
            "a",
            -1,
          );

        expect(result).toEqual([]);
      },
    );
  },
);