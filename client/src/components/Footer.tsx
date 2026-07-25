export function Footer() {
  return (
    <footer className="border-t border-[color:var(--border-card)]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <img src="/sunway-shield.png" alt="Sunway" className="h-8 w-8" />
          <div>
            <p className="text-sm font-semibold">Sunwayians' Innovation Fest 2026</p>
            <p className="text-xs text-[color:var(--text-tertiary)]">Innovate. Integrate. Inspire.</p>
          </div>
        </div>
        <p className="text-xs text-[color:var(--text-tertiary)]">
          © 2026 InnoVote — voting stays open, fair, and anonymous for every voter.
        </p>
      </div>
    </footer>
  );
}
