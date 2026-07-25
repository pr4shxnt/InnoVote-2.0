import { Suspense, lazy } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.tsx";

const Landing = lazy(() => import("./views/Landing.tsx").then((m) => ({ default: m.Landing })));
const ProjectsBrowse = lazy(() => import("./views/ProjectsBrowse.tsx").then((m) => ({ default: m.ProjectsBrowse })));
const ResearchPapersBrowse = lazy(() =>
  import("./views/ResearchPapersBrowse.tsx").then((m) => ({ default: m.ResearchPapersBrowse })),
);
const OtpLogin = lazy(() => import("./views/OtpLogin.tsx").then((m) => ({ default: m.OtpLogin })));
const VotingProfile = lazy(() => import("./views/VotingProfile.tsx").then((m) => ({ default: m.VotingProfile })));
const Results = lazy(() => import("./views/Results.tsx").then((m) => ({ default: m.Results })));
const AdminLogin = lazy(() => import("./views/admin/AdminLogin.tsx").then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() =>
  import("./views/admin/AdminDashboard.tsx").then((m) => ({ default: m.AdminDashboard })),
);

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
    </div>
  );
}

function PublicLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/projects" element={<ProjectsBrowse />} />
          <Route path="/research-papers" element={<ResearchPapersBrowse />} />
          <Route path="/login" element={<OtpLogin />} />
          <Route path="/profile" element={<VotingProfile />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
}
