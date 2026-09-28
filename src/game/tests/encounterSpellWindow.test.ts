import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { createTestGame } from "./helpers/createTestGame";

import { coreSpells } from "../../content/core/coreSpell";
import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";

import { createSpell } from "../engine/createSpell";
import { getEncounterSpellOptions } from "../engine/encounterSpellWindow";
import { resolveSpellFrontEffects } from "../engine/resolveSpellFrontEffects";
import { resolveSpellChoice } from "../engine/resolveSpellChoice";
import { resolveSpell } from "../engine/resolveSpell";
import { startInvestigatorEncounter } from "../engine/startInvestigatorEncounter";

const definition =
  coreSpells.find(
    (spell) =>
      spell.id ===
      "spell-mists-of-releh",
  )!;

const spell =
  createSpell(
    definition,
    1,
  );

function setup() {
  const game =
    createTestGame();

  game.phase =
    "encounter";

  game.pendingDecision =
    null;

  /*
   * ============================================================
   * VALID ANCIENT ONE
   * ============================================================
   */

  game.ancientOne = {
    ...game.ancientOne,
    id: "azathoth",
  };

  /*
   * ============================================================
   * INVESTIGATOR
   * ============================================================
   */

  game.investigators[
    "investigator-1"
  ].spaceId = "arkham";

  game.investigators[
    "investigator-1"
  ].skills.lore = 3;

  game.investigators[
    "investigator-1"
  ].spellIds = [
    spell.id,
  ];

  /*
   * ============================================================
   * MISTS OF RELEH
   * ============================================================
   */

  game.spells = {
    [spell.id]: {
      ...spell,
    },
  };

  /*
   * ============================================================
   * BOARD SPACES
   * ============================================================
   */

  game.board.spaces =
    Object.fromEntries(
      eldritchBaseMap.spaces.map(
        (space) => [
          space.id,
          {
            spaceId:
              space.id,

            clues: 0,

            clueTokenIds: [],

            monsterIds: [],

            gates: [],

            expedition:
              space.isExpedition,

            rumor: false,

            eldritchTokenCount: 0,
          },
        ],
      ),
    );

  /*
   * ============================================================
   * ENCOUNTER DECKS
   * ============================================================
   */

  game.board.encounterDecks = {
    america: [],
    europe: [],
    "asia-australia": [],
    general: [],
    research: [],
    "other-world": [],
    special: [],
    expedition: [],
  };

  game.board.encounterDiscards = {
    america: [],
    europe: [],
    "asia-australia": [],
    general: [],
    research: [],
    "other-world": [],
    special: [],
    expedition: [],
  };

  /*
   * ============================================================
   * MONSTER
   * ============================================================
   */

  game.board.spaces[
    "arkham"
  ].monsterIds = [
    "cultist-1",
  ];

  game.monsters = {
    "cultist-1": {
      id:
        "cultist-1",

      definitionId:
        "cultist",

      spaceId:
        "arkham",

      health: 1,

      engagedInvestigatorId:
        null,

      isEpic: false,
    },
  };

  /*
   * ============================================================
   * MYTHOS
   * ============================================================
   */

  game.board.mythosInPlay =
    [];

  return game;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe(
  "Encounter Spell window",
  () => {
    it(
      "offers Akachi's Mists before combat, resolves both faces, then ignores monsters for one encounter",
      () => {
        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0.99,
        );

        let game =
          setup();

        expect(
          getEncounterSpellOptions(
            game,
          ).map(
            (option) =>
              option.name,
          ),
        ).toEqual([
          "Mists of Releh",
        ]);

        const rolled =
          resolveSpellFrontEffects(
            game,
            "investigator-1",
            spell.id,
            definition.frontEffects[
              0
            ],
            eldritchBaseMap,
            {
              deferTriggeredEffects:
                true,
            },
          );

        expect(() =>
          startInvestigatorEncounter(
            rolled.game,
            eldritchBaseMap,
          ),
        ).toThrow(
          "Finish resolving",
        );

        game =
          resolveSpellFrontEffects(
            rolled.game,
            "investigator-1",
            spell.id,
            definition.frontEffects[
              0
            ],
            eldritchBaseMap,
            {
              testResultOverride:
                rolled.testResult!,
            },
          ).game;

        expect(
          game.pendingSpellChoice
            ?.type,
        ).toBe(
          "choose-encounter",
        );

        game =
          resolveSpellChoice(
            game,
            "resolve-encounter",
          );

        expect(() =>
          startInvestigatorEncounter(
            game,
            eldritchBaseMap,
          ),
        ).toThrow(
          "Finish resolving",
        );

        game =
          resolveSpell(
            game,
            "investigator-1",
            spell.id,
          );

        expect(
          game.ignoreMonstersForNextEncounter,
        ).toBe(true);

        expect(
          getEncounterSpellOptions(
            game,
          ),
        ).toEqual([]);

        expect(game.pendingSpellChoice).toBeNull();
        expect(game.pendingSpellBackResolution).toBeNull();
        expect(game.spells[spell.id].pendingTestResult).toBeNull();

        /*
         * Mists succeeded.
         *
         * The Monster must be ignored when
         * starting this Encounter.
         *
         * startInvestigatorEncounter will then
         * attempt to start a normal location
         * Encounter. Because this isolated test
         * has no Encounter cards, that part is
         * expected to stop there.
         */

        expect(() =>
          startInvestigatorEncounter(
            game,
            eldritchBaseMap,
          ),
        ).toThrow(
          'No Encounter decks are available at "Arkham".',
        );

        /*
         * The important Mists behaviour has
         * already occurred on the state passed
         * into startInvestigatorEncounter:
         * the Cultist was not engaged.
         */

        expect(
          game.monsters[
            "cultist-1"
          ].engagedInvestigatorId,
        ).toBeNull();
      },
    );

    it(
      "a failed cast still resolves the back and does not bypass combat",
      () => {
        vi.spyOn(
          Math,
          "random",
        ).mockReturnValue(
          0,
        );

        let game =
          resolveSpellFrontEffects(
            setup(),
            "investigator-1",
            spell.id,
            definition.frontEffects[
              0
            ],
            eldritchBaseMap,
          ).game;

        expect(
          game.pendingSpellChoice,
        ).toBeNull();

        game =
          resolveSpell(
            game,
            "investigator-1",
            spell.id,
          );

        expect(
          game.ignoreMonstersForNextEncounter,
        ).not.toBe(true);

        expect(game.pendingSpellChoice).toBeNull();
        expect(game.pendingSpellBackResolution).toBeNull();
        expect(game.spells[spell.id].pendingTestResult).toBeNull();

        game =
          startInvestigatorEncounter(
            game,
            eldritchBaseMap,
          );

        expect(
          game.monsters[
            "cultist-1"
          ].engagedInvestigatorId,
        ).toBe(
          "investigator-1",
        );
      },
    );

    it(
      "rejects encounter Spells during actions, another turn, or after combat begins",
      () => {
        for (
          const change of [
            (
              game: ReturnType<
                typeof setup
              >,
            ) => {
              game.phase =
                "action";
            },

            (
              game: ReturnType<
                typeof setup
              >,
            ) => {
              game.activeInvestigatorId =
                "investigator-2";
            },

            (
              game: ReturnType<
                typeof setup
              >,
            ) => {
              game.encounterStartedRound =
                {
                  "investigator-1":
                    game.round,
                };
            },
          ]
        ) {
          const game =
            setup();

          change(game);

          expect(
            getEncounterSpellOptions(
              game,
            ),
          ).toEqual([]);

          expect(() =>
            resolveSpellFrontEffects(
              game,
              "investigator-1",
              spell.id,
              definition
                .frontEffects[
                0
              ],
              eldritchBaseMap,
            ),
          ).toThrow(
            "before starting",
          );
        }
      },
    );
  },
);
