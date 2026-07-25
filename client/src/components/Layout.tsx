import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { logout } from "../api/auth.ts";
import { useProfile } from "../context/ProfileContext.tsx";
import { Footer } from "./Footer.tsx";
import { NameEntryModal } from "./NameEntryModal.tsx";

const NAV_LINKS = [
  { to: "/projects", label: "Projects" },
  { to: "/research-papers", label: "Research Papers" },
  { to: "/profile", label: "Voting Profile" },
  { to: "/results", label: "Results" },
];

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useProfile();
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  // Lock page scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

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
          <nav className="hidden items-center gap-4 text-sm text-[color:var(--text-muted)] sm:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-[color:var(--text-main)]">
                {link.label}
              </Link>
            ))}
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

          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-[color:var(--text-main)] hover:bg-[color:var(--bg-elevated)] sm:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <div
        aria-hidden={!mobileNavOpen}
        className={`fixed inset-0 z-50 transition-opacity duration-300 motion-reduce:transition-none sm:hidden ${
          mobileNavOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
        <div
          className={`absolute right-0 top-0 flex h-full w-72 max-w-[80vw] flex-col bg-[color:var(--bg-card)] shadow-xl transition-transform duration-300 ease-out motion-reduce:transition-none ${
            mobileNavOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[color:var(--border-card)] px-4 py-4">
            <Link to="/" className="flex items-center" onClick={() => setMobileNavOpen(false)}>
              <img src="/sunwayians-logo.png" alt="Sunwayians' Innovation Fest 2026" className="h-10 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close menu"
              className="rounded-lg p-2 hover:bg-[color:var(--bg-elevated)]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--text-muted)] hover:bg-[color:var(--bg-elevated)] hover:text-[color:var(--text-main)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {state.isAuthenticated && (
            <div className="border-t border-[color:var(--border-card)] p-4">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg border border-[color:var(--border-card)] px-3 py-2.5 text-sm font-medium hover:bg-[color:var(--bg-elevated)]"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
      <NameEntryModal />
    </div>
  );
}
