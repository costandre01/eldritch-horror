import type { Condition } from "../../game/models/Condition";

interface ConditionCardProps {
  condition: Condition;
}

export default function ConditionCard({
  condition,
}: ConditionCardProps) {
  return (
    <div className="perspective-[1000px] w-65 aspect-2/3">
      <div
        className={`
          relative h-full w-full
          transition-transform duration-700
          transform-3d
          ${condition.flipped ? "rotate-y-180" : ""}
        `}
      >
        {/* FRONT */}

        <div
          className="
            absolute inset-0
            backface-hidden
          "
        >
          <img
            src={condition.frontImage}
            alt="Condition"
            className="h-full w-full object-cover"
          />
        </div>

        {/* BACK */}

        <div
          className="
            absolute inset-0
            rotate-y-180
            backface-hidden
          "
        >
          <img
            src={condition.backImage}
            alt="Condition back"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}