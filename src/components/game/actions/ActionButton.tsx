interface ActionButtonProps {
  label: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function ActionButton({
  label,
  icon,
  onClick,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        flex
        items-center
        gap-2
        border-r
        border-blue-500/40
        px-4
        py-3
        text-sm
        font-semibold
        text-white
        transition
        hover:bg-blue-500/40
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
    >
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="h-5 w-5 object-contain"
      />

      <span>
        {label}
      </span>
    </button>
  );
}