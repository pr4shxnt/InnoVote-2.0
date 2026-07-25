export function PerforatedSeam() {
  return (
    <div className="relative mx-6 h-0 border-t-2 border-dashed border-[color:var(--border-card)]">
      <span className="absolute left-0 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--border-card)] bg-[color:var(--bg-app)]" />
      <span className="absolute right-0 top-0 h-6 w-6 -translate-y-1/2 translate-x-1/2 rounded-full border border-[color:var(--border-card)] bg-[color:var(--bg-app)]" />
    </div>
  );
}
