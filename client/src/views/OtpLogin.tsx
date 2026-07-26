import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth.ts";
import { ApiError } from "../api/client.ts";
import { PageContainer } from "../components/PageContainer.tsx";
import { useProfile } from "../context/ProfileContext.tsx";

export function OtpLogin() {
  const navigate = useNavigate();
  const { dispatch, refreshProfile } = useProfile();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { user } = await login(`+977${phoneNumber}`, displayName.trim());
      dispatch({ type: "LOGIN_SUCCESS", payload: { hasVoted: user.hasVoted } });
      await refreshProfile();
      navigate("/profile");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageContainer>
      <div className="mx-auto max-w-sm rounded-xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-6">
        <h1 className="text-xl font-semibold">Voting Profile</h1>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Enter your mobile number and name to start voting.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {/* Phone number */}
          <div className="flex w-full overflow-hidden rounded-lg border border-[color:var(--border-card)] focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-[color:var(--brand-primary-glow)]">
            <span className="flex items-center bg-[color:var(--bg-elevated)] px-3 py-2 text-sm text-[color:var(--text-muted)] border-r border-[color:var(--border-card)]">
              +977
            </span>
            <input
              id="phone-input"
              type="tel"
              required
              maxLength={10}
              placeholder="98XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Display name */}
          <input
            id="name-input"
            type="text"
            required
            maxLength={40}
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-lg border border-[color:var(--border-card)] bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary-glow)]"
          />

          {error && <p className="text-sm text-status-error">{error}</p>}

          <button
            type="submit"
            id="login-submit-btn"
            disabled={submitting}
            className="w-full rounded-lg bg-primary-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50"
          >
            {submitting ? "Logging in…" : "Continue to Vote"}
          </button>
        </form>
      </div>
    </PageContainer>
  );
}
