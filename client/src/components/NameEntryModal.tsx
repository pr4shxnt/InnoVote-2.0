import { useState } from "react";
import { updateProfile } from "../api/profile.ts";
import { ApiError } from "../api/client.ts";
import { useProfile } from "../context/ProfileContext.tsx";
import { Modal } from "./Modal.tsx";

export function NameEntryModal() {
  const { state, dispatch } = useProfile();
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const open = state.isAuthenticated && !state.isLoading && !state.hasSetDisplayName;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await updateProfile(trimmed);
      dispatch({ type: "UPDATE_NAME", payload: { displayName: trimmed } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save your name.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} dismissable={false}>
      <div className="p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Welcome!</h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Please enter your name before continuing to browse and vote.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            autoFocus
            required
            maxLength={40}
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-lg border border-[color:var(--border-card)] bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          />
          {error && <p className="text-sm text-status-error">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-primary-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Continue"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
