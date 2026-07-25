import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProjects } from "../api/projects.ts";

const STEPS = [
  {
    title: "Verify with OTP",
    description:
      "Enter your mobile number and confirm the 6-digit code sent to you. No passwords, no accounts.",
  },
  {
    title: "Browse & Vote",
    description:
      "Explore every project booth at the fest and cast your one vote for the project that impressed you most.",
  },
  {
    title: "See the Results",
    description:
      "Rankings stay hidden until the official reveal — check back once results are published.",
  },
];

const FEATURES = [
  {
    title: "Passwordless & Secure",
    description: "No accounts or passwords to create — your identity is verified with a mobile OTP.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 3l7 3v5c0 4.5-3 8.2-7 9.5-4-1.3-7-5-7-9.5V6l7-3z"
      />
    ),
  },
  {
    title: "One Voter, One Vote",
    description:
      "Every voter gets exactly one vote for the entire fest — enforced server-side, no exceptions.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M5 13l4 4L19 7"
      />
    ),
  },
  {
    title: "Live Booth Info",
    description:
      "Scan a booth's QR code to jump straight to its project page, team, and description.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 3h6m-3-3v6"
      />
    ),
  },
  {
    title: "Fair Reveal",
    description:
      "Vote tallies stay hidden until the organizers publish results at the scheduled reveal time.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
];

export function Landing() {
  const [projectCount, setProjectCount] = useState<number | null>(null);

  useEffect(() => {
    listProjects()
      .then((res) => setProjectCount(res.projects.length))
      .catch(() => setProjectCount(null));
  }, []);

  return (
    <div>
      <section className="hero-backdrop flex min-h-[calc(100vh-73px)] w-full flex-col items-center justify-center overflow-hidden border-b border-[color:var(--border-card)] px-6 py-16 text-center">
        <span className="hero-badge mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
          Voting Open — Sunway Innovation Fest 2026
        </span>

        <img
          src="/sunwayians-logo.png"
          alt="Sunwayians' Innovation Fest 2026"
          className="mx-auto mt-6 h-24 w-auto sm:h-32"
        />

        <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
          Your Vote Shapes the{" "}
          <span className="text-primary-500">Best Innovation</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[color:var(--text-muted)]">
          Explore every project booth at Sunway Innovation Fest and cast your
          vote — passwordless, verified by mobile OTP, one vote per voter,
          results revealed only when the organizers say so.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/projects"
            className="rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(193,42,55,0.6)] transition hover:-translate-y-0.5 hover:bg-primary-600 active:bg-primary-700"
          >
            Browse Projects
          </Link>
          <Link
            to="/profile"
            className="rounded-lg border border-[color:var(--border-card)] bg-[color:var(--bg-card)] px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-[color:var(--bg-elevated)]"
          >
            Voting Profile
          </Link>
        </div>

        <div className="mx-auto mt-12 grid max-w-md grid-cols-3 divide-x divide-[color:var(--border-card)]">
          <div className="px-4">
            <p className="text-2xl font-bold text-primary-500">
              {projectCount ?? "—"}
            </p>
            <p className="mt-1 text-xs text-[color:var(--text-muted)]">
              Project Booths
            </p>
          </div>
          <div className="px-4">
            <p className="text-2xl font-bold text-primary-500">1</p>
            <p className="mt-1 text-xs text-[color:var(--text-muted)]">
              Vote Per Voter
            </p>
          </div>
          <div className="px-4">
            <p className="text-2xl font-bold text-primary-500">3m</p>
            <p className="mt-1 text-xs text-[color:var(--text-muted)]">
              OTP Validity
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16">
        <section>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">How Voting Works</h2>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">
              Three steps, under a minute.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">Why InnoVote</h2>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">
              Built to keep voting simple, fair, and tamper-resistant.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 rounded-xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-5"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-9 w-9 shrink-0 text-primary-500"
                >
                  {feature.icon}
                </svg>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="hero-backdrop rounded-3xl border border-[color:var(--border-card)] px-6 py-12 text-center">
          <h2 className="text-2xl font-bold">
            Ready to make your voice heard?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[color:var(--text-muted)]">
            Verify your number, browse the booths, and cast your one vote before
            voting closes.
          </p>
          <Link
            to="/projects"
            className="mt-6 inline-block rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary-600"
          >
            Get Started
          </Link>
        </section>
      </div>
    </div>
  );
}
