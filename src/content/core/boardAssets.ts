export interface BoardAssetDefinition {
  id: string;
  name: string;
  description: string;
  image: string;
  fixed: true;
}

export const CORE_BOARD_ASSETS: BoardAssetDefinition[] = [
  {
    id: "bank-loan",
    name: "Bank Loan",

    description:
      "When performing an Acquire Assets action, you may gain a Debt Condition to immediately add 2 successes to your test result.",

    /*
     * A carta física está impressa diretamente
     * no tabuleiro.
     *
     * Por isso não temos uma imagem individual
     * da carta.
     */

    image:
      "/maps/eldritch-board.png",

    fixed: true,
  },
];