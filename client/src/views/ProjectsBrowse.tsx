import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { castVote, getVotingStatus } from "../api/votes.ts";
import { ApiError } from "../api/client.ts";
import { listProjects } from "../api/projects.ts";
import { PageContainer } from "../components/PageContainer.tsx";
import { ProjectCard } from "../components/ProjectCard.tsx";
import { ProjectDetailsModal } from "../components/ProjectDetailsModal.tsx";
import { SearchInput } from "../components/SearchInput.tsx";
import { useProfile } from "../context/ProfileContext.tsx";
import { useDebouncedValue } from "../hooks/useDebouncedValue.ts";
import type { Project } from "../types/index.ts";

export function ProjectsBrowse() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const votingComplete = searchParams.get("voted") === "complete";
  const { state, dispatch } = useProfile();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [votingOpen, setVotingOpen] = useState(true);

  useEffect(() => {
    listProjects()
      .then((res) => setProjects(res.projects))
      .finally(() => setLoading(false));
    getVotingStatus()
      .then((res) => setVotingOpen(res.votingOpen))
      .catch(() => setVotingOpen(true));
  }, []);

  const filteredProjects = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) =>
      [project.title, project.teamName, ...project.teamMembers].some((field) =>
        field.toLowerCase().includes(query),
      ),
    );
  }, [projects, debouncedSearch]);

  async function handleVote(projectId: string) {
    if (!state.isAuthenticated) {
      navigate("/login");
      return;
    }
    setError(null);
    setVotingId(projectId);
    try {
      const { votedProject } = await castVote(projectId);
      dispatch({ type: "VOTE_CAST_SUCCESS", payload: { project: votedProject } });
      setViewingProject(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to cast vote.");
    } finally {
      setVotingId(null);
    }
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Project Booths</h1>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Browse participant projects and cast your one vote for Sunway Innovation Fest.
        </p>
      </div>

      {votingComplete && (
        <div className="mb-6 rounded-xl border border-status-success bg-[#ECFDF5] px-4 py-3 text-sm font-medium text-status-success">
          You've voted for both a project and a research paper — thanks for participating! You've been logged out.
        </div>
      )}

      {!votingOpen && (
        <div className="mb-6 rounded-xl border border-status-warning bg-[#FFFBEB] px-4 py-3 text-sm font-medium text-status-warning">
          Voting is currently closed. You can browse the projects, but votes aren't being accepted right now.
        </div>
      )}

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects, teams, members…" />
      </div>

      {error && <p className="mb-4 text-sm text-status-error">{error}</p>}

      {loading ? (
        <p className="text-sm text-[color:var(--text-muted)]">Loading projects…</p>
      ) : filteredProjects.length === 0 ? (
        <p className="text-sm text-[color:var(--text-muted)]">No projects match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isVotedProject={state.votedProject?.id === project.id}
              canVote={!state.hasVoted && votingOpen}
              voting={votingId === project.id}
              onVote={handleVote}
              onView={setViewingProject}
            />
          ))}
        </div>
      )}

      <ProjectDetailsModal
        project={viewingProject}
        onClose={() => setViewingProject(null)}
        isVotedProject={viewingProject !== null && state.votedProject?.id === viewingProject.id}
        canVote={!state.hasVoted && votingOpen}
        voting={viewingProject !== null && votingId === viewingProject.id}
        onVote={handleVote}
      />
    </PageContainer>
  );
}
