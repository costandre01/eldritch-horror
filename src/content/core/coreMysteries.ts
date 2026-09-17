import type { MysteryDefinition } from "../../game/models/Mystery";

import { AZATHOTH_MYSTERIES } from "./mysteries/azathothMysteries";
import { CTHULHU_MYSTERIES } from "./mysteries/cthulhuMysteries";
import { SHUB_NIGGURATH_MYSTERIES } from "./mysteries/shubNiggurathMysteries";
import { YOG_SOTHOTH_MYSTERIES } from "./mysteries/yogSothothMysteries";

export const CORE_MYSTERIES: MysteryDefinition[] = [
  ...AZATHOTH_MYSTERIES,
  ...CTHULHU_MYSTERIES,
  ...SHUB_NIGGURATH_MYSTERIES,
  ...YOG_SOTHOTH_MYSTERIES,
];