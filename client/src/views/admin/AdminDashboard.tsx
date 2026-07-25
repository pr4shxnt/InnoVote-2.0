import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { adminLogout, adminMe } from "../../api/admin.ts";
import { AdminLayout, type AdminTab } from "./AdminLayout.tsx";
import { AdminOverview } from "./AdminOverview.tsx";
import { AdminProjects } from "./AdminProjects.tsx";
import { AdminResearchPapers } from "./AdminResearchPapers.tsx";
import { AdminResults } from "./AdminResults.tsx";
import { AdminUsers } from "./AdminUsers.tsx";

export function AdminDashboard() {
  const [authState, setAuthState] = useState<"checking" | "authenticated" | "unauthenticated">("checking");
  const [adminUsername, setAdminUsername] = useState("");
  const [tab, setTab] = useState<AdminTab>("overview");

  useEffect(() => {
    adminMe()
      .then((res) => {
        setAdminUsername(res.admin.username);
        setAuthState("authenticated");
      })
      .catch(() => setAuthState("unauthenticated"));
  }, []);

  if (authState === "checking") {
    return null;
  }

  if (authState === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout
      active={tab}
      onChange={setTab}
      onLogout={() => adminLogout().then(() => setAuthState("unauthenticated"))}
      adminUsername={adminUsername}
    >
      {tab === "overview" && <AdminOverview />}
      {tab === "projects" && <AdminProjects />}
      {tab === "research-papers" && <AdminResearchPapers />}
      {tab === "users" && <AdminUsers />}
      {tab === "results" && <AdminResults />}
    </AdminLayout>
  );
}
