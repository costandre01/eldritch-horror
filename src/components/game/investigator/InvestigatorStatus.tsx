import type { Investigator } from "../../../game/models/Investigator";
import type { InvestigatorDefinition } from "../../../game/models/InvestigatorDefinition";

interface InvestigatorStatusProps {
  investigator: Investigator;
  definition: InvestigatorDefinition;
}

export default function InvestigatorStatus({
  investigator,
  definition,
}: InvestigatorStatusProps) {
  const investigatorImage =
    `/cards/investigators/${definition.name.replaceAll(
      " ",
      "_",
    )}.png`;

  return (
    <section className="rounded-xl bg-[#30435f] p-4">

      {/* ================================================== */}
      {/* PORTRAIT */}
      {/* ================================================== */}

      <img
        src={investigatorImage}
        alt={definition.name}
        className="mx-auto max-h-107.5 w-auto object-contain"
      />

      {/* ================================================== */}
      {/* NAME */}
      {/* ================================================== */}

      <div className="mt-4">

        <h2 className="text-2xl font-black text-white">
          {definition.name}
        </h2>

        <p className="text-sm text-gray-300">
          {definition.occupation}
        </p>

      </div>

      {/* ================================================== */}
      {/* HEALTH / SANITY */}
      {/* ================================================== */}

      <div className="mt-4 grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-[#111318] p-3">

          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Health
          </p>

          <div className="mt-2 flex items-center gap-2">

            <img
              src="/icons/game/health.png"
              alt="Health"
              className="h-7 w-7"
            />

            <span className="text-xl font-black">
              {investigator.health}
              /
              {investigator.maxHealth}
            </span>

          </div>

        </div>

        <div className="rounded-xl bg-[#111318] p-3">

          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Sanity
          </p>

          <div className="mt-2 flex items-center gap-2">

            <img
              src="/icons/game/sanity.png"
              alt="Sanity"
              className="h-7 w-7"
            />

            <span className="text-xl font-black">
              {investigator.sanity}
              /
              {investigator.maxSanity}
            </span>

          </div>

        </div>

      </div>

      {/* ================================================== */}
      {/* LOCATION */}
      {/* ================================================== */}

      <div className="mt-4 rounded-xl bg-[#111318] p-4">

        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Location
        </p>

        <p className="mt-1 font-bold text-white">
          {investigator.spaceId ?? "None"}
        </p>

      </div>

    </section>
  );
}