import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { listProjects } from "../api/projects.ts";
import { listResearchPapers } from "../api/researchPapers.ts";
import { getVotingStatus } from "../api/votes.ts";
import { PerforatedSeam } from "../components/PerforatedSeam.tsx";
import { useInView } from "../hooks/useInView.ts";

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
    description:
      "No accounts or passwords to create — your identity is verified with a mobile OTP.",
    big: true,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 3l7 3v5c0 4.5-3 8.2-7 9.5-4-1.3-7-5-7-9.5V6l7-3z"
      />
    ),
  },
  {
    title: "One Voter, Two Votes",
    description:
      "Every voter gets exactly two vote for the entire fest — one for projects another for research paper.",
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
    title: "Projects informations",
    description:
      "Short information about projects and research paper will be provided for recall of exibition.",
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

function Reveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: inView ? `${delayMs}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out motion-reduce:opacity-100 motion-reduce:transition-none ${
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Landing() {
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [paperCount, setPaperCount] = useState<number | null>(null);
  const [projectTitles, setProjectTitles] = useState<string[]>([]);
  const [votingOpen, setVotingOpen] = useState<boolean | null>(null);

  useEffect(() => {
    listProjects()
      .then((res) => {
        setProjectCount(res.projects.length);
        setProjectTitles(res.projects.map((p) => p.title));
      })
      .catch(() => setProjectCount(null));
    listResearchPapers()
      .then((res) => setPaperCount(res.papers.length))
      .catch(() => setPaperCount(null));
    getVotingStatus()
      .then((res) => setVotingOpen(res.votingOpen))
      .catch(() => setVotingOpen(null));
  }, []);

  const marqueeItems = projectTitles.length > 0 ? projectTitles : ["INNOVATE", "VOTE", "CREATE", "INSPIRE"];

  return (
    <div className="overflow-x-hidden">
      {/* HERO — the navbar floats transparently on top of this, so it fills one true screen height */}
      <section className="flex min-h-screen flex-col">
        <div className="hero-pattern flex flex-1 items-center border-b border-[color:var(--border-card)] px-6 py-12">
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="text-center lg:text-left">
              <span className="hero-badge inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                Sunwayians' Innovation Fest 2026
              </span>

              <h1 className="mx-auto mt-6 max-w-xl text-4xl font-bold leading-[1.1] sm:text-5xl lg:mx-0 lg:text-6xl">
                Cast Your Vote.
                <br />
                <span className="text-primary-500">Crown</span> the Best
                Innovation.
              </h1>

              <p className="mx-auto mt-5 max-w-lg text-[color:var(--text-muted)] lg:mx-0">
                One phone number, one OTP, one vote. Walk every booth, weigh
                every idea, and decide who takes the trophy this year.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
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
            </div>

            {/* Voting "ticket" card */}
            <Reveal className="mx-auto w-full max-w-sm">
              <div className="rotate-2 overflow-hidden rounded-2xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] shadow-2xl transition duration-500 hover:rotate-0">
                <div className="flex items-center justify-between p-6 pb-4">
                  <img
                    src="/sunwayians-logo.png"
                    alt=""
                    className="h-10 w-auto"
                  />
                  {votingOpen !== null && (
                    <span
                      className={`-rotate-6 rounded-md border-[3px] border-double px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                        votingOpen
                          ? "border-status-success text-status-success"
                          : "border-status-error text-status-error"
                      }`}
                    >
                      {votingOpen ? "Open" : "Closed"}
                    </span>
                  )}
                </div>

                <div className="px-6 pb-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--text-tertiary)]">
                    Admit One Voter
                  </p>
                  <p className="mt-1 text-lg font-bold leading-tight">
                    InnoVote 2026 — General Admission
                  </p>
                </div>

                <PerforatedSeam />

                <div className="grid grid-cols-2 gap-x-4 gap-y-5 p-6">
                  <div>
                    <p className="text-2xl font-bold text-primary-500">
                      {projectCount ?? "—"}
                    </p>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-[color:var(--text-tertiary)]">
                      Project Booths
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-500">
                      {paperCount ?? "—"}
                    </p>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-[color:var(--text-tertiary)]">
                      Research Papers
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-500">1</p>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-[color:var(--text-tertiary)]">
                      Vote Per Voter
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-500">3m</p>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-[color:var(--text-tertiary)]">
                      OTP Validity
                    </p>
                  </div>
                </div>

                <div
                  aria-hidden
                  className="h-3 w-full bg-[repeating-linear-gradient(90deg,currentColor_0_2px,transparent_2px_6px)] text-[color:var(--border-card)] opacity-70"
                />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Marquee ticker, pinned to the bottom edge of the hero's one-screen height */}
        <div
          aria-hidden
          className="overflow-hidden border-b border-[color:var(--border-card)] bg-primary-500 py-2.5"
        >
          <div className="flex w-max animate-marquee gap-10 motion-reduce:animate-none">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-white"
              >
                {item}
                <span>★</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-24 px-4 py-20">
        {/* STEPS as ticket stubs */}
        <section>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">How Voting Works</h2>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">
              Three stops, under a minute.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <Reveal key={step.title} delayMs={index * 100}>
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)]">
                  <div className="flex items-center justify-between p-6 pb-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-double border-primary-500 text-sm font-bold text-primary-500">
                      0{index + 1}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-[color:var(--text-tertiary)]">
                      Stop {index + 1}/3
                    </span>
                  </div>
                  <PerforatedSeam />
                  <div className="p-6 pt-5">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1.5 text-sm text-[color:var(--text-muted)]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FEATURES bento grid */}
        <section>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Why InnoVote</h2>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">
              Built to keep voting simple, fair, and tamper-resistant.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            {FEATURES.map((feature) => (
              <Reveal
                key={feature.title}
                className={
                  feature.big
                    ? "sm:col-span-2 lg:col-span-2 lg:row-span-2"
                    : "lg:col-span-2"
                }
              >
                <div
                  className={`flex h-full gap-4 rounded-2xl border border-[color:var(--border-card)] bg-[color:var(--bg-card)] p-6 ${
                    feature.big
                      ? "flex-col justify-between bg-primary-500/5"
                      : "items-start"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className={`shrink-0 text-primary-500 ${feature.big ? "h-12 w-12" : "h-9 w-9"}`}
                  >
                    {feature.icon}
                  </svg>
                  <div>
                    <h3
                      className={
                        feature.big ? "text-lg font-semibold" : "font-semibold"
                      }
                    >
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Closing CTA ticket */}
        <Reveal>
          <section className="hero-backdrop overflow-hidden rounded-3xl border border-[color:var(--border-card)]">
            <div className="px-6 py-14 text-center">
              <span className="-rotate-6 inline-block rounded-md border-[3px] border-double border-primary-500 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-500">
                Admit One
              </span>
              <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
                Ready to make your voice heard?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-[color:var(--text-muted)]">
                Verify your number, browse the booths, and cast your one vote
                before voting closes.
              </p>
              <Link
                to="/projects"
                className="mt-6 inline-block rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(193,42,55,0.6)] transition hover:-translate-y-0.5 hover:bg-primary-600"
              >
                Get Started
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
