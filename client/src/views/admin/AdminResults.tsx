import { useEffect, useState } from "react";
import { getRound, updateRound } from "../../api/admin.ts";
import type { VotingRound } from "../../types/index.ts";

export function AdminResults() {
  const [round, setRound] = useState<VotingRound | null>(null);
  const [revealAtInput, setRevealAtInput] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getRound()
      .then((res) => {
        setRound(res.round);
        setRevealAtInput(res.round.resultRevealAt ? res.round.resultRevealAt.slice(0, 16) : "");
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

  if (loading || !round) {
    return <p className="text-sm text-[color:var(--text-muted)]">Loading…</p>;
  }

  return (
    <div className="space-y-4">
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
