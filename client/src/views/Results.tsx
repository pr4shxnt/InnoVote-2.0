import { useEffect, useState } from "react";
import { getResults } from "../api/projects.ts";
import { getPaperResults } from "../api/researchPapers.ts";
import { PageContainer } from "../components/PageContainer.tsx";
import type { PaperResultsResponse, ResultsResponse } from "../types/index.ts";

export function Results() {
  const [data, setData] = useState<ResultsResponse | null>(null);
  const [paperData, setPaperData] = useState<PaperResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getResults(), getPaperResults()])
      .then(([results, paperResults]) => {
        setData(results);
        setPaperData(paperResults);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <p className="text-sm text-[color:var(--text-muted)]">Loading results…</p>
      </PageContainer>
    );
  }

  if (!data || !data.revealed) {
    return (
      <PageContainer>
        <div className="glass-panel mx-auto max-w-lg rounded-xl p-6 text-center">
          <h1 className="text-xl font-semibold">Results Hidden</h1>
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">
            Vote tallies are hidden until the official reveal.
          </p>
          {data?.resultRevealAt && (
            <p className="mt-3 text-sm text-status-warning">
              Reveal scheduled for {new Date(data.resultRevealAt).toLocaleString()}
            </p>
          )}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mx-auto max-w-lg space-y-8">
        <div>
          <h1 className="mb-4 text-2xl font-semibold">Project Results</h1>
          <div className="space-y-2">
            {data.results.map((entry, index) => (
              <div
                key={entry.projectId}
                className="flex items-center justify-between rounded-lg border border-[color:var(--border-card)] bg-[color:var(--bg-card)] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[color:var(--text-tertiary)]">#{index + 1}</span>
                  <div>
                    <p className="font-medium">{entry.title}</p>
                    <p className="text-xs text-[color:var(--text-muted)]">Booth #{entry.boothNumber}</p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-primary-500">{entry.voteCount}</span>
              </div>
            ))}
          </div>
        </div>

        {paperData?.revealed && (
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Research Paper Results</h2>
            <div className="space-y-2">
              {paperData.results.map((entry, index) => (
                <div
                  key={entry.paperId}
                  className="flex items-center justify-between rounded-lg border border-[color:var(--border-card)] bg-[color:var(--bg-card)] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[color:var(--text-tertiary)]">#{index + 1}</span>
                    <p className="font-medium">{entry.title}</p>
                  </div>
                  <span className="text-lg font-semibold text-primary-500">{entry.voteCount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
