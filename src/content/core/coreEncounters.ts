import { americaEncounters } from "./encounters/americaEncounters";
import { europeEncounters } from "./encounters/europeEncounters";
import { asiaAustraliaEncounters } from "./encounters/asiaAustraliaEncounters";
import { generalEncounters } from "./encounters/generalEncounters";
import { otherWorldEncounters } from "./encounters/otherWorldEncounters";
import { expeditionEncounters } from "./encounters/expeditionEncounters";
import { specialEncounters } from "./encounters/specialEncounters";
import { researchEncountersAzaroth } from "./encounters/researchEncountersAzaroth";
import { researchEncountersCthulhu } from "./encounters/researchEncountersCthulhu";
import { researchEncountersShubNiggurath } from "./encounters/researchEncountersShubNiggurath";
import { researchEncountersYogSothoth } from "./encounters/researchEncountersYogSothoth";

export const coreEncounters = [
    ...americaEncounters,
    ...europeEncounters,
    ...asiaAustraliaEncounters,
    ...generalEncounters,
    ...otherWorldEncounters,
    ...expeditionEncounters,
    ...specialEncounters,
    ...researchEncountersAzaroth,
    ...researchEncountersCthulhu,
    ...researchEncountersShubNiggurath,
    ...researchEncountersYogSothoth,
];