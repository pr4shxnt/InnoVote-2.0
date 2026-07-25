import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { adminLogout, adminMe } from "../../api/admin.ts";
import { PageContainer } from "../../components/PageContainer.tsx";
import { AdminProjects } from "./AdminProjects.tsx";
import { AdminResearchPapers } from "./AdminResearchPapers.tsx";
import { AdminResults } from "./AdminResults.tsx";
import { AdminUsers } from "./AdminUsers.tsx";

type Tab = "projects" | "research papers" | "users" | "results";

export function AdminDashboard() {
  const [authState, setAuthState] = useState<"checking" | "authenticated" | "unauthenticated">("checking");
  const [tab, setTab] = useState<Tab>("projects");

  useEffect(() => {
    adminMe()
      .then(() => setAuthState("authenticated"))
      .catch(() => setAuthState("unauthenticated"));
  }, []);

  if (authState === "checking") {
    return null;
  }

  if (authState === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <button
          onClick={() => adminLogout().then(() => setAuthState("unauthenticated"))}
          className="rounded-lg border border-[color:var(--border-card)] px-3 py-1.5 text-sm hover:bg-[color:var(--bg-elevated)]"
        >
          Log Out
        </button>
      </div>

      <div className="mb-4 flex gap-2 border-b border-[color:var(--border-card)]">
        {(["projects", "research papers", "users", "results"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm font-medium capitalize ${
              tab === t
                ? "border-b-2 border-primary-500 text-[color:var(--text-main)]"
                : "text-[color:var(--text-muted)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "projects" && <AdminProjects />}
      {tab === "research papers" && <AdminResearchPapers />}
      {tab === "users" && <AdminUsers />}
      {tab === "results" && <AdminResults />}
    </PageContainer>
  );
}
