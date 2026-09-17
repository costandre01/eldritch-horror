import type { Investigator } from "../../game/models/Investigator";
import type { InvestigatorDefinition } from "../../game/models/InvestigatorDefinition";
import type { Asset } from "../../game/models/Asset";
import type { Artifact } from "../../game/models/Artifact";
import type { Spell } from "../../game/models/Spell";
import type { SpellDefinition } from "../../game/models/SpellDefinition";
import type { Condition } from "../../game/models/Condition";

import InvestigatorStatus from "./investigator/InvestigatorStatus";
import InvestigatorSkills from "./investigator/InvestigatorSkills";
import InvestigatorResources from "./investigator/InvestigatorResources";
import InvestigatorPossessions from "./investigator/InvestigatorPossessions";

interface InvestigatorPanelProps {
  investigator: Investigator;
  definition: InvestigatorDefinition;

  assets: Asset[];
  artifacts: Artifact[];
  spells: Spell[];
  spellDefinitions: SpellDefinition[];
  conditions: Condition[];

  onOpenCard?: (
    type:
      | "asset"
      | "artifact"
      | "spell"
      | "condition",
    id: string,
  ) => void;
}

export default function InvestigatorPanel({
  investigator,
  definition,

  assets,
  artifacts,
  spells,
  spellDefinitions,
  conditions,

  onOpenCard,
}: InvestigatorPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(320px,0.9fr)_minmax(500px,1.5fr)]">

      {/* ================================================== */}
      {/* LEFT */}
      {/* ================================================== */}

      <section className="min-w-0">

        <InvestigatorStatus
          investigator={investigator}
          definition={definition}
        />

        <InvestigatorSkills
          investigator={investigator}
        />

        <InvestigatorResources
          investigator={investigator}
        />

      </section>

      {/* ================================================== */}
      {/* RIGHT */}
      {/* ================================================== */}

      <InvestigatorPossessions
        assets={assets}
        artifacts={artifacts}
        spells={spells}
        spellDefinitions={spellDefinitions}
        conditions={conditions}
        onOpenCard={onOpenCard}
      />

    </div>
  );
}