import type { ClueToken } from "../../game/models/ClueToken";

import { eldritchBaseMap } from "./maps/eldritchBaseMap";

export const CORE_CLUES: ClueToken[] =
  eldritchBaseMap.spaces.map(
    (space) => ({
      id: `clue-${space.id}`,
      spaceId: space.id,
    }),
  );