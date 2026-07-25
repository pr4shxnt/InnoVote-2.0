import type { ResearchPaper } from "../types/index.ts";
import { ViewDetailsButton } from "./ViewDetailsButton.tsx";

interface ResearchPaperCardProps {
  paper: ResearchPaper;
  isVotedPaper?: boolean;
  canVote?: boolean;
  onVote?: (paperId: string) => void;
  onView?: (paper: ResearchPaper) => void;
  voting?: boolean;
}

export function ResearchPaperCard({ paper, isVotedPaper, canVote, onVote, onView, voting }: ResearchPaperCardProps) {
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-xl border transition ${
        isVotedPaper
          ? "border-status-success bg-[color:var(--bg-elevated)]"
          : "border-[color:var(--border-card)] bg-[color:var(--bg-card)]"
      }`}
    >
      <div className="aspect-video w-full overflow-hidden bg-[color:var(--bg-elevated)]">
        {paper.imageUrl ? (
          <img src={paper.imageUrl} alt={paper.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[color:var(--text-muted)]">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold">{paper.title}</h3>
          {isVotedPaper && (
            <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-xs font-semibold text-status-success">
              Voted
            </span>
          )}
        </div>
        {paper.description && (
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">{paper.description}</p>
        )}
        {paper.teamName && (
          <p className="mt-2 text-xs font-medium text-[color:var(--text-tertiary)]">Team: {paper.teamName}</p>
        )}
        {paper.teamMembers.length > 0 && (
          <p className="mt-1 text-xs text-[color:var(--text-tertiary)]">Members: {paper.teamMembers.join(", ")}</p>
        )}
        {(onView || (canVote && onVote)) && (
          <div className="mt-auto flex gap-2 pt-3">
            {onView && <ViewDetailsButton onClick={() => onView(paper)} />}
            {canVote && onVote && (
              <button
                type="button"
                disabled={voting}
                onClick={() => onVote(paper.id)}
                className="flex-1 rounded-lg bg-primary-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50"
              >
                {voting ? "Casting vote…" : "Cast Vote"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
