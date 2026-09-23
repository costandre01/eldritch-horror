import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { rollTest } from "../engine/rollTest";

import {
  createTestInvestigator,
} from "./helpers/createTestGame";

describe(
  "rollTest",
  () => {
    it(
      "rolls the investigator skill value in dice",
      () => {
        const investigator =
          createTestInvestigator(
            "investigator-1",
          );

        investigator.skills.lore =
          3;

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0,
        );

        const result =
          rollTest(
            investigator,
            "lore",
          );

        expect(
          result.skill,
        ).toBe("lore");

        expect(
          result.modifier,
        ).toBe(0);

        expect(
          result.difficulty,
        ).toBe(1);

        expect(
          result.diceRolled,
        ).toBe(3);

        expect(
          result.results,
        ).toEqual([
          1,
          1,
          1,
        ]);

        expect(
          result.successes,
        ).toBe(0);

        expect(
          result.passed,
        ).toBe(false);

        vi.restoreAllMocks();
      },
    );

    it(
      "applies a positive modifier to the number of dice",
      () => {
        const investigator =
          createTestInvestigator(
            "investigator-1",
          );

        investigator.skills.lore =
          2;

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.833333,
        );

        const result =
          rollTest(
            investigator,
            "lore",
            2,
          );

        expect(
          result.diceRolled,
        ).toBe(4);

        expect(
          result.results,
        ).toEqual([
          5,
          5,
          5,
          5,
        ]);

        expect(
          result.successes,
        ).toBe(4);

        vi.restoreAllMocks();
      },
    );

    it(
      "applies a negative modifier to the number of dice",
      () => {
        const investigator =
          createTestInvestigator(
            "investigator-1",
          );

        investigator.skills.lore =
          4;

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0,
        );

        const result =
          rollTest(
            investigator,
            "lore",
            -2,
          );

        expect(
          result.diceRolled,
        ).toBe(2);

        expect(
          result.results,
        ).toEqual([
          1,
          1,
        ]);

        expect(
          result.successes,
        ).toBe(0);

        vi.restoreAllMocks();
      },
    );

    it(
      "never rolls fewer than zero dice",
      () => {
        const investigator =
          createTestInvestigator(
            "investigator-1",
          );

        investigator.skills.lore =
          1;

        const result =
          rollTest(
            investigator,
            "lore",
            -5,
          );

        expect(
          result.diceRolled,
        ).toBe(0);

        expect(
          result.results,
        ).toEqual([]);

        expect(
          result.successes,
        ).toBe(0);

        expect(
          result.passed,
        ).toBe(false);
      },
    );

    it(
      "counts rolls of 5 and 6 as successes",
      () => {
        const investigator =
          createTestInvestigator(
            "investigator-1",
          );

        investigator.skills.lore =
          4;

        const randomMock =
          vi.spyOn(
            Math,
            "random",
          );

        randomMock
          .mockReturnValueOnce(
            0.666666,
          )
          .mockReturnValueOnce(
            0.833333,
          )
          .mockReturnValueOnce(
            0.34,
          )
          .mockReturnValueOnce(
            0.999999,
          );

        const result =
          rollTest(
            investigator,
            "lore",
          );

        expect(
          result.results,
        ).toEqual([
          4,
          5,
          3,
          6,
        ]);

        expect(
          result.successes,
        ).toBe(2);

        vi.restoreAllMocks();
      },
    );

    it(
      "passes when successes meet the difficulty",
      () => {
        const investigator =
          createTestInvestigator(
            "investigator-1",
          );

        investigator.skills.lore =
          3;

        const randomMock =
          vi.spyOn(
            Math,
            "random",
          );

        randomMock
          .mockReturnValueOnce(
            0.833333,
          )
          .mockReturnValueOnce(
            0.833333,
          )
          .mockReturnValueOnce(
            0,
          );

        const result =
          rollTest(
            investigator,
            "lore",
            0,
            2,
          );

        expect(
          result.successes,
        ).toBe(2);

        expect(
          result.difficulty,
        ).toBe(2);

        expect(
          result.passed,
        ).toBe(true);

        vi.restoreAllMocks();
      },
    );

    it(
      "fails when successes are below the difficulty",
      () => {
        const investigator =
          createTestInvestigator(
            "investigator-1",
          );

        investigator.skills.lore =
          3;

        const randomMock =
          vi.spyOn(
            Math,
            "random",
          );

        randomMock
          .mockReturnValueOnce(
            0.833333,
          )
          .mockReturnValueOnce(
            0,
          )
          .mockReturnValueOnce(
            0,
          );

        const result =
          rollTest(
            investigator,
            "lore",
            0,
            2,
          );

        expect(
          result.successes,
        ).toBe(1);

        expect(
          result.difficulty,
        ).toBe(2);

        expect(
          result.passed,
        ).toBe(false);

        vi.restoreAllMocks();
      },
    );

    it(
      "uses the selected skill",
      () => {
        const investigator =
          createTestInvestigator(
            "investigator-1",
          );

        investigator.skills.will =
          2;

        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.833333,
        );

        const result =
          rollTest(
            investigator,
            "will",
          );

        expect(
          result.skill,
        ).toBe("will");

        expect(
          result.diceRolled,
        ).toBe(2);

        expect(
          result.successes,
        ).toBe(2);

        vi.restoreAllMocks();
      },
    );
  },
);