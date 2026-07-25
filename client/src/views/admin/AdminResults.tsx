import { useEffect, useState } from "react";
import { getRound, updateRound } from "../../api/admin.ts";
import type { VotingRound } from "../../types/index.ts";

export function AdminResults() {
  const [round, setRound] = useState<VotingRound | null>(null);
  const [revealAtInput, setRevealAtInput] = useState("");
  const [votingOpensAtInput, setVotingOpensAtInput] = useState("");
  const [votingClosesAtInput, setVotingClosesAtInput] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getRound()
      .then((res) => {
        setRound(res.round);
        setRevealAtInput(res.round.resultRevealAt ? res.round.resultRevealAt.slice(0, 16) : "");
        setVotingOpensAtInput(res.round.votingOpensAt ? res.round.votingOpensAt.slice(0, 16) : "");
        setVotingClosesAtInput(res.round.votingClosesAt ? res.round.votingClosesAt.slice(0, 16) : "");
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSetRevealAt(e: React.FormEvent) {
    e.preventDefault();
    const { round: updated } = await updateRound({
      resultRevealAt: revealAtInput ? new Date(revealAtInput).toISOString() : null,
    });
    setRound(updated);
  }

  async function handleTogglePublish() {
    if (!round) return;
    const { round: updated } = await updateRound({ isPublished: !round.isPublished });
    setRound(updated);
  }

  async function handleSetVotingWindow(e: React.FormEvent) {
    e.preventDefault();
    const { round: updated } = await updateRound({
      votingOpensAt: votingOpensAtInput ? new Date(votingOpensAtInput).toISOString() : null,
      votingClosesAt: votingClosesAtInput ? new Date(votingClosesAtInput).toISOString() : null,
    });
    setRound(updated);
  }

  async function handleSetOverride(override: "open" | "closed" | null) {
    const { round: updated } = await updateRound({ votingManualOverride: override });
    setRound(updated);
  }

  if (loading || !round) {
    return <p className="text-sm text-[color:var(--text-muted)]">Loading…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-4">
        <p className="text-sm text-[color:var(--text-muted)]">Voting status</p>
        <p className="mt-1 text-lg font-semibold">
          {round.votingOpen ? (
            <span className="text-status-success">Open — voters can cast votes</span>
          ) : (
            <span className="text-status-warning">Closed</span>
          )}
        </p>
        {round.votingManualOverride && (
          <p className="mt-1 text-xs text-[color:var(--text-muted)]">
            Manual override active: forced {round.votingManualOverride}. Schedule below is ignored until cleared.
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => handleSetOverride("open")}
            className="rounded-lg bg-status-success px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Force Open Now
          </button>
          <button
            onClick={() => handleSetOverride("closed")}
            className="rounded-lg bg-status-error px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Force Close Now
          </button>
          {round.votingManualOverride && (
            <button
              onClick={() => handleSetOverride(null)}
              className="rounded-lg border border-[color:var(--border-card)] px-4 py-2 text-sm font-semibold hover:bg-[color:var(--bg-elevated)]"
            >
              Clear Override (follow schedule)
            </button>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSetVotingWindow}
        className="rounded-xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-4"
      >
        <p className="text-sm font-medium">Voting Window</p>
        <p className="mt-0.5 text-xs text-[color:var(--text-muted)]">
          Voting is only allowed between these times, unless a manual override above is set. Leave a field blank for no bound.
        </p>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-[color:var(--text-muted)]">Opens At</label>
            <input
              type="datetime-local"
              value={votingOpensAtInput}
              onChange={(e) => setVotingOpensAtInput(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[color:var(--border-card)] bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[color:var(--text-muted)]">Closes At</label>
            <input
              type="datetime-local"
              value={votingClosesAtInput}
              onChange={(e) => setVotingClosesAtInput(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[color:var(--border-card)] bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-3 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
        >
          Save Voting Window
        </button>
      </form>

      <div className="rounded-xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-4">
        <p className="text-sm text-[color:var(--text-muted)]">Current status</p>
        <p className="mt-1 text-lg font-semibold">
          {round.isPublished ? (
            <span className="text-status-success">Published — visible to voters</span>
          ) : (
            <span className="text-status-warning">Hidden</span>
          )}
        </p>
        <button
          onClick={handleTogglePublish}
          className="mt-3 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
        >
          {round.isPublished ? "Unpublish Results" : "Publish Results Now"}
        </button>
      </div>

      <form onSubmit={handleSetRevealAt} className="rounded-xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-4">
        <label className="text-xs font-medium text-[color:var(--text-muted)]">Scheduled Reveal Time</label>
        <div className="mt-1 flex gap-2">
          <input
            type="datetime-local"
            value={revealAtInput}
            onChange={(e) => setRevealAtInput(e.target.value)}
            className="flex-1 rounded-lg border border-[color:var(--border-card)] bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          />
          <button type="submit" className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
