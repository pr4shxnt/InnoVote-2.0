function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function SessionCountdown({ remainingMs }: { remainingMs: number }) {
  const isLow = remainingMs < 60_000;
  return (
    <span className={`font-mono text-sm ${isLow ? "text-status-warning" : "text-[color:var(--text-muted)]"}`}>
      Session expires in {formatMs(remainingMs)}
    </span>
  );
}
