import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { updateProfile } from "../api/profile.ts";
import { PageContainer } from "../components/PageContainer.tsx";
import { SessionCountdown } from "../components/SessionCountdown.tsx";
import { useProfile } from "../context/ProfileContext.tsx";

export function VotingProfile() {
  const { state, dispatch } = useProfile();
  const [displayName, setDisplayName] = useState(state.displayName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDisplayName(state.displayName);
  }, [state.displayName]);

  if (state.isLoading) {
    return null;
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile(displayName);
      dispatch({ type: "UPDATE_NAME", payload: { displayName } });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageContainer>
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Voting Profile</h1>
        <SessionCountdown remainingMs={state.sessionRemainingMs} />
      </div>

      <form onSubmit={handleSave} className="rounded-xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-4">
        <label className="text-xs font-medium text-[color:var(--text-muted)]">Display Name</label>
        <div className="mt-1 flex gap-2">
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="flex-1 rounded-lg border border-[color:var(--border-card)] bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
          >
            Save
          </button>
        </div>
        {saved && <p className="mt-2 text-xs text-status-success">Saved.</p>}
      </form>

      <div className="rounded-xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-4">
        {state.hasVoted && state.votedProject ? (
          <div>
            <p className="text-sm text-[color:var(--text-muted)]">You voted for</p>
            <p className="mt-1 text-lg font-semibold">
              {state.votedProject.title} — Booth #{state.votedProject.boothNumber}
            </p>
            <p className="mt-2 text-xs text-[color:var(--text-tertiary)]">
              Voting is disabled — you've already cast your one vote for this event.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-[color:var(--text-muted)]">You haven't voted yet.</p>
            <Link
              to="/projects"
              className="mt-3 inline-block rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
            >
              Browse Projects &amp; Vote
            </Link>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-4">
        {state.hasVotedPaper && state.votedPaper ? (
          <div>
            <p className="text-sm text-[color:var(--text-muted)]">You voted for research paper</p>
            <p className="mt-1 text-lg font-semibold">{state.votedPaper.title}</p>
            <p className="mt-2 text-xs text-[color:var(--text-tertiary)]">
              Voting is disabled — you've already cast your one vote for research papers.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-[color:var(--text-muted)]">You haven't voted for a research paper yet.</p>
            <Link
              to="/research-papers"
              className="mt-3 inline-block rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
            >
              Browse Research Papers &amp; Vote
            </Link>
          </div>
        )}
      </div>
    </div>
    </PageContainer>
  );
}
