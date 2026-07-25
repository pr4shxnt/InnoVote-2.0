import { useState, type ReactNode } from "react";
import {
  BarChart3,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Users as UsersIcon,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type AdminTab =
  | "overview"
  | "projects"
  | "research-papers"
  | "users"
  | "results";

const NAV_ITEMS: {
  key: AdminTab;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "research-papers", label: "Research Papers", icon: FileText },
  { key: "users", label: "Voters", icon: UsersIcon },
  { key: "results", label: "Results", icon: BarChart3 },
];

interface AdminLayoutProps {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
  onLogout: () => void;
  adminUsername: string;
  children: ReactNode;
}

export function AdminLayout({
  active,
  onChange,
  onLogout,
  adminUsername,
  children,
}: AdminLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const activeLabel =
    NAV_ITEMS.find((item) => item.key === active)?.label ?? "Overview";

  function NavList({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                onChange(item.key);
                onNavigate?.();
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar sm:fixed sm:inset-y-0 sm:left-0 sm:flex">
        <div className="flex items-center gap-2 px-4 py-4">
          <img src="/sunway-shield.png" alt="" className="h-8 w-auto" />
          <div>
            <p className="text-sm font-semibold leading-none">InnoVote Admin</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sunway Innovation Fest
            </p>
          </div>
        </div>
        <Separator className="bg-sidebar-border" />
        <NavList />
        <Separator className="bg-sidebar-border" />
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
              {adminUsername.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{adminUsername}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col sm:pl-64">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:hidden">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <p className="text-sm font-semibold">{activeLabel}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 sm:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="absolute left-0 top-0 flex h-full w-64 flex-col bg-sidebar shadow-xl">
              <div className="flex items-center justify-between px-4 py-4">
                <p className="text-sm font-semibold">InnoVote Admin</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Separator className="bg-sidebar-border" />
              <NavList onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-8">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-6 hidden text-2xl font-semibold sm:block">
              {activeLabel}
            </h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
