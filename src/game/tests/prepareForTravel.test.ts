import {
  describe,
  expect,
  it,
} from "vitest";

import { prepareForTravel } from "../engine/prepareForTravel";

import {
  createTestGame,
} from "./helpers/createTestGame";

import { eldritchBaseMap } from "../../content/core/maps/eldritchBaseMap";

function prepareGame() {
  const game = createTestGame();

  game.phase = "action";
  game.activeInvestigatorId =
    "investigator-1";
  game.investigatorTurnIndex = 0;
  game.pendingDecision = null;
  game.pendingEncounterChoice = null;

  const investigator =
    game.investigators[
      "investigator-1"
    ];

  /*
   * Istanbul is a City with both
   * Train and Ship connections.
   */
  investigator.spaceId =
    "san-francisco";

  investigator.actionsPerformed = [];

  return game;
}

describe(
  "prepareForTravel",
  () => {
    it(
      "gains a Train Ticket normally when below the ticket limit",
      () => {
        const game = prepareGame();

        const result =
          prepareForTravel(
            game,
            eldritchBaseMap,
            "train",
          );

        const investigator =
          result.investigators[
            "investigator-1"
          ];

        expect(
          investigator.trainTickets,
        ).toBe(1);

        expect(
          investigator.shipTickets,
        ).toBe(0);

        expect(
          investigator.actionsPerformed,
        ).toContain(
          "prepare-for-travel",
        );
      },
    );

    it(
      "gains a Ship Ticket normally when below the ticket limit",
      () => {
        const game = prepareGame();

        const result =
          prepareForTravel(
            game,
            eldritchBaseMap,
            "ship",
          );

        expect(
          result.investigators[
            "investigator-1"
          ].shipTickets,
        ).toBe(1);
      },
    );

    it(
      "requires a ticket to be discarded when already holding 2 Travel Tickets",
      () => {
        const game = prepareGame();

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.trainTickets = 1;
        investigator.shipTickets = 1;

        expect(() =>
          prepareForTravel(
            game,
            eldritchBaseMap,
            "train",
          ),
        ).toThrow(
          "Investigator must discard a Travel Ticket before gaining another one.",
        );
      },
    );

    it(
      "can discard a Train Ticket before gaining a Ship Ticket",
      () => {
        const game = prepareGame();

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.trainTickets = 2;
        investigator.shipTickets = 0;

        const result =
          prepareForTravel(
            game,
            eldritchBaseMap,
            "ship",
            "train",
          );

        expect(
          result.investigators[
            "investigator-1"
          ].trainTickets,
        ).toBe(1);

        expect(
          result.investigators[
            "investigator-1"
          ].shipTickets,
        ).toBe(1);
      },
    );

    it(
      "can choose which ticket to discard when holding one of each",
      () => {
        const game = prepareGame();

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.trainTickets = 1;
        investigator.shipTickets = 1;

        const result =
          prepareForTravel(
            game,
            eldritchBaseMap,
            "train",
            "ship",
          );

        expect(
          result.investigators[
            "investigator-1"
          ].trainTickets,
        ).toBe(2);

        expect(
          result.investigators[
            "investigator-1"
          ].shipTickets,
        ).toBe(0);
      },
    );

    it(
      "cannot discard a ticket type the investigator does not have",
      () => {
        const game = prepareGame();

        const investigator =
          game.investigators[
            "investigator-1"
          ];

        investigator.trainTickets = 2;
        investigator.shipTickets = 0;

        expect(() =>
          prepareForTravel(
            game,
            eldritchBaseMap,
            "ship",
            "ship",
          ),
        ).toThrow(
          "Investigator has no Ship Ticket to discard.",
        );
      },
    );
  },
);