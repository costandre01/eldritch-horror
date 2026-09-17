import type { Spell } from "../models/Spell";
import type { SpellDefinition } from "../models/SpellDefinition";

export function createSpell(
  definition: SpellDefinition,
  instanceNumber: number,
  backId?: string,
): Spell {
  /*
   * ============================================================
   * INSTANCE ID
   * ============================================================
   */

  const instanceId =
    `${definition.id}-${String(
      instanceNumber,
    ).padStart(3, "0")}`;

  /*
   * ============================================================
   * BACK
   * ============================================================
   *
   * If a specific backId was supplied, use it.
   *
   * Otherwise use the back corresponding to the
   * instance number.
   *
   * Example:
   *
   * instance 1 -> backs[0]
   * instance 2 -> backs[1]
   */

  const actualBackId =
    backId ??
    definition.backs[
      instanceNumber - 1
    ]?.id ??
    definition.backs[0]?.id;

  if (!actualBackId) {
    throw new Error(
      `Spell "${definition.id}" has no back definition.`,
    );
  }

  const back =
    definition.backs.find(
      (item) =>
        item.id === actualBackId,
    );

  if (!back) {
    throw new Error(
      `Back "${actualBackId}" does not exist for Spell "${definition.id}".`,
    );
  }

  /*
   * ============================================================
   * CREATE SPELL
   * ============================================================
   */

  return {
    id: instanceId,

    definitionId:
      definition.id,

    instanceNumber,

    type:
      definition.type,

    /*
     * The front image belongs to the selected
     * physical card variant.
     *
     * We use the image already defined inside
     * SpellDefinition instead of constructing
     * the filename manually.
     */

    frontImage:
      back.frontImage,

    /*
     * The back image is kept for the game logic,
     * but is NOT shown by the deck browser.
     */

    backImage:
      back.backImage,

    backId:
      actualBackId,

    flipped: false,

    exhausted: false,

    pendingTestResult:
      null,

    pendingChosenInvestigatorId:
      null,
  };
}