import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../api/auth.ts";
import { useProfile } from "../context/ProfileContext.tsx";
import { Footer } from "./Footer.tsx";
import { NameEntryModal } from "./NameEntryModal.tsx";

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useProfile();
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";
  const solidNav = !isHome || scrolled;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    await logout().catch(() => undefined);
    dispatch({ type: "LOGOUT" });
    navigate("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-[height,background-color,border-color] duration-300 ${
          scrolled ? "h-[var(--navbar-height-scrolled)]" : "h-[var(--navbar-height)]"
        } ${
          solidNav
            ? "border-[color:var(--border-card)] bg-[color:var(--bg-card)]"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center">
            <img
              src="/sunwayians-logo.png"
              alt="Sunwayians' Innovation Fest 2026"
              className="h-14 w-auto"
            />
          </Link>
          <nav className="flex items-center gap-4 text-sm text-[color:var(--text-muted)]">
            <Link
              to="/projects"
              className="hover:text-[color:var(--text-main)]"
            >
              Projects
            </Link>
            <Link
              to="/research-papers"
              className="hover:text-[color:var(--text-main)]"
            >
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
