interface ViewDetailsButtonProps {
  onClick: () => void;
}

export function ViewDetailsButton({ onClick }: ViewDetailsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 rounded-lg border border-[color:var(--border-card)] px-3 py-2 text-sm font-semibold transition hover:bg-[color:var(--bg-elevated)]"
    >
      View
    </button>
  );
}
