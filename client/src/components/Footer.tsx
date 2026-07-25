import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  { to: "/projects", label: "Projects" },
  { to: "/research-papers", label: "Research Papers" },
  { to: "/profile", label: "Voting Profile" },
  { to: "/results", label: "Results" },
];

const INTEGRITY_POINTS = [
  "One verified vote per voter",
  "Results sealed until official reveal",
  "Enforced server-side, no exceptions",
];

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--border-card)] bg-[color:var(--bg-card)]">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img src="/sunway-shield.png" alt="Sunway" className="h-9 w-9" />
              <div>
                <p className="text-sm font-semibold">Sunwayians' Innovation Fest 2026</p>
                <p className="text-xs text-[color:var(--text-tertiary)]">Innovate. Integrate. Inspire.</p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm text-[color:var(--text-muted)]">
              InnoVote is the official voting platform for Sunway Innovation Fest — passwordless, one vote per
              voter, and fully auditable.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--text-tertiary)]">
              Navigate
            </p>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-main)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--text-tertiary)]">
              Voting Integrity
            </p>
            <ul className="mt-3 space-y-2">
              {INTEGRITY_POINTS.map((point) => (
                <li key={point} className="text-sm text-[color:var(--text-muted)]">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[color:var(--border-card)] pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[color:var(--text-tertiary)]">
            © 2026 Sunwayians' Innovation Fest. All rights reserved.
          </p>
          <p className="text-xs text-[color:var(--text-tertiary)]">Built for fair, transparent voting.</p>
        </div>
      </div>
    </footer>
  );
}
