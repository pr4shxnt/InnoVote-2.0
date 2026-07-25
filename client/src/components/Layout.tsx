import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/auth.ts";
import { useProfile } from "../context/ProfileContext.tsx";
import { Footer } from "./Footer.tsx";
import { NameEntryModal } from "./NameEntryModal.tsx";

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { state, dispatch } = useProfile();

  async function handleLogout() {
    await logout().catch(() => undefined);
    dispatch({ type: "LOGOUT" });
    navigate("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[color:var(--border-card)] bg-[color:var(--bg-card)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
          <Link to="/" className="flex items-center">
            <img src="/sunwayians-logo.png" alt="Sunwayians' Innovation Fest 2026" className="h-14 w-auto" />
          </Link>
          <nav className="flex items-center gap-4 text-sm text-[color:var(--text-muted)]">
            <Link to="/projects" className="hover:text-[color:var(--text-main)]">
              Projects
            </Link>
            <Link to="/research-papers" className="hover:text-[color:var(--text-main)]">
              Research Papers
            </Link>
            <Link to="/profile" className="hover:text-[color:var(--text-main)]">
              Voting Profile
            </Link>
            <Link to="/results" className="hover:text-[color:var(--text-main)]">
              Results
            </Link>
            {state.isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-[color:var(--border-card)] px-3 py-1.5 hover:bg-[color:var(--bg-elevated)] hover:text-[color:var(--text-main)]"
              >
                Log Out
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
      <NameEntryModal />
    </div>
  );
}
