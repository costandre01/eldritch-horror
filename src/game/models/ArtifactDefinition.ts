/*
 * ============================================================
 * ARTIFACT DEFINITION
 * ============================================================
 *
 * Static definition of an Artifact card.
 *
 * This belongs to the content layer.
 *
 * It describes what the card is, but does not represent
 * a physical card currently existing in the GameState.
 */

import type {
    ArtifactType,
    ArtifactTrait,
} from "./Artifact";

export interface ArtifactDefinition {
    /*
     * ========================================================
     * IDENTITY
     * ========================================================
     */

    id: string;

    name: string;

    /*
     * ========================================================
     * CARD TYPE
     * ========================================================
     */

    type: ArtifactType;

    /*
     * ========================================================
     * TRAITS
     * ========================================================
     */

    traits: ArtifactTrait[];

    /*
     * ========================================================
     * RULES TEXT
     * ========================================================
     */

    description: string;

    /*
     * ========================================================
     * IMAGE
     * ========================================================
     */

    image: string;
}