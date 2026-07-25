import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { castPaperVote } from "../api/votes.ts";
import { ApiError } from "../api/client.ts";
import { listResearchPapers } from "../api/researchPapers.ts";
import { PageContainer } from "../components/PageContainer.tsx";
import { ResearchPaperCard } from "../components/ResearchPaperCard.tsx";
import { ResearchPaperDetailsModal } from "../components/ResearchPaperDetailsModal.tsx";
import { SearchInput } from "../components/SearchInput.tsx";
import { useProfile } from "../context/ProfileContext.tsx";
import { useDebouncedValue } from "../hooks/useDebouncedValue.ts";
import type { ResearchPaper } from "../types/index.ts";

export function ResearchPapersBrowse() {
  const navigate = useNavigate();
  const { state, dispatch } = useProfile();
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [viewingPaper, setViewingPaper] = useState<ResearchPaper | null>(null);

  useEffect(() => {
    listResearchPapers()
      .then((res) => setPapers(res.papers))
      .finally(() => setLoading(false));
  }, []);

  const filteredPapers = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return papers;
    return papers.filter((paper) =>
      [paper.title, paper.teamName, ...paper.teamMembers].some((field) => field.toLowerCase().includes(query)),
    );
  }, [papers, debouncedSearch]);

  async function handleVote(paperId: string) {
    if (!state.isAuthenticated) {
      navigate("/login");
      return;
    }
    setError(null);
    setVotingId(paperId);
    try {
      const { votedPaper } = await castPaperVote(paperId);
      dispatch({ type: "PAPER_VOTE_CAST_SUCCESS", payload: { paper: votedPaper } });
      setViewingPaper(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to cast vote.");
    } finally {
      setVotingId(null);
    }
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Research Papers</h1>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Browse participant research papers and cast your one vote for Sunway Innovation Fest.
        </p>
      </div>

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="Search papers, teams, members…" />
      </div>

      {error && <p className="mb-4 text-sm text-status-error">{error}</p>}

      {loading ? (
        <p className="text-sm text-[color:var(--text-muted)]">Loading research papers…</p>
      ) : filteredPapers.length === 0 ? (
        <p className="text-sm text-[color:var(--text-muted)]">No research papers match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPapers.map((paper) => (
            <ResearchPaperCard
              key={paper.id}
              paper={paper}
              isVotedPaper={state.votedPaper?.id === paper.id}
              canVote={!state.hasVotedPaper}
              voting={votingId === paper.id}
              onVote={handleVote}
              onView={setViewingPaper}
            />
          ))}
        </div>
      )}

      <ResearchPaperDetailsModal
        paper={viewingPaper}
        onClose={() => setViewingPaper(null)}
        isVotedPaper={viewingPaper !== null && state.votedPaper?.id === viewingPaper.id}
        canVote={!state.hasVotedPaper}
        voting={viewingPaper !== null && votingId === viewingPaper.id}
        onVote={handleVote}
      />
    </PageContainer>
  );
}
