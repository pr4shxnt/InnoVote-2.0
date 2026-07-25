import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/admin.ts";
import { ApiError } from "../../api/client.ts";
import { PageContainer } from "../../components/PageContainer.tsx";

export function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await adminLogin(username, password);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageContainer>
    <div className="mx-auto max-w-sm rounded-xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-6">
      <h1 className="text-xl font-semibold">Admin Login</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          required
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-[color:var(--border-card)] bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-[color:var(--border-card)] bg-transparent px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        />
        {error && <p className="text-sm text-status-error">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary-500 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
    </PageContainer>
  );
}
