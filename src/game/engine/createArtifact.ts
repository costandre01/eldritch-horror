import type { Artifact } from "../models/Artifact";
import type { ArtifactDefinition } from "../models/ArtifactDefinition";

/*
 * ============================================================
 * CREATE ARTIFACT
 * ============================================================
 *
 * Creates one physical Artifact card from its static
 * definition.
 *
 * The definition belongs to the content layer.
 *
 * The returned object belongs to the current GameState.
 */

export function createArtifact(
  definition: ArtifactDefinition,
): Artifact {
  return {
    /*
     * ==========================================================
     * IDENTITY
     * ==========================================================
     */

    id: definition.id,

    definitionId: definition.id,

    /*
     * ==========================================================
     * CARD DATA
     * ==========================================================
     */

    name: definition.name,

    type: definition.type,

    /*
     * Copy the array so that the live game state cannot
     * accidentally mutate the static definition.
     */

    traits: [
      ...definition.traits,
    ],

    description:
      definition.description,

    image:
      definition.image,
  };
}