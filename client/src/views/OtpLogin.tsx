import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestOtp, verifyOtp } from "../api/auth.ts";
import { ApiError } from "../api/client.ts";
import { PageContainer } from "../components/PageContainer.tsx";
import { useProfile } from "../context/ProfileContext.tsx";

export function OtpLogin() {
  const navigate = useNavigate();
  const { dispatch, refreshProfile } = useProfile();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await requestOtp(`+977${phoneNumber}`);
      setStep("otp");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send OTP.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { user } = await verifyOtp(`+977${phoneNumber}`, otp);
      dispatch({ type: "LOGIN_SUCCESS", payload: { hasVoted: user.hasVoted } });
      await refreshProfile();
      navigate("/profile");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to verify OTP.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageContainer>
    <div className="mx-auto max-w-sm rounded-xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-6">
      <h1 className="text-xl font-semibold">Voting Profile</h1>
      <p className="mt-1 text-sm text-[color:var(--text-muted)]">
        Passwordless login — enter your mobile number to receive a one-time code.
      </p>

      {step === "phone" ? (
        <form onSubmit={handleRequestOtp} className="mt-4 space-y-3">
          <div className="flex w-full overflow-hidden rounded-lg border border-[color:var(--border-card)] focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-[color:var(--brand-primary-glow)]">
            <span className="flex items-center bg-[color:var(--bg-elevated)] px-3 py-2 text-sm text-[color:var(--text-muted)] border-r border-[color:var(--border-card)]">
              +977
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="98XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-status-error">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="mt-4 space-y-3">
          <input
            type="text"
            required
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full rounded-lg border border-[color:var(--border-card)] bg-transparent px-3 py-2 text-center text-lg tracking-widest focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary-glow)]"
          />
          {error && <p className="text-sm text-status-error">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50"
          >
            {submitting ? "Verifying…" : "Verify OTP"}
          </button>
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="w-full text-center text-xs text-[color:var(--text-muted)] hover:text-[color:var(--text-main)]"
          >
            Use a different number
          </button>
        </form>
      )}
    </div>
    </PageContainer>
  );
}
