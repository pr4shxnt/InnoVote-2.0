import type { ResearchPaper } from "../types/index.ts";
import { Modal } from "./Modal.tsx";

interface ResearchPaperDetailsModalProps {
  paper: ResearchPaper | null;
  onClose: () => void;
  isVotedPaper?: boolean;
  canVote?: boolean;
  onVote?: (paperId: string) => void;
  voting?: boolean;
}

export function ResearchPaperDetailsModal({
  paper,
  onClose,
  isVotedPaper,
  canVote,
  onVote,
  voting,
}: ResearchPaperDetailsModalProps) {
  return (
    <Modal open={paper !== null} onClose={onClose}>
      {paper && (
        <div>
          <div className="aspect-[1189/841] w-full overflow-hidden rounded-t-xl bg-[color:var(--bg-elevated)]">
            {paper.imageUrl ? (
              <img src={paper.imageUrl} alt={paper.title} className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-[color:var(--text-muted)]">
                No image
              </div>
            )}
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-2xl font-semibold">{paper.title}</h2>
              {isVotedPaper && (
                <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-xs font-semibold text-status-success">
                  Voted
                </span>
              )}
            </div>
            {paper.description && (
              <p className="mt-4 text-base text-[color:var(--text-muted)]">{paper.description}</p>
            )}
            {paper.teamName && (
              <p className="mt-4 text-sm font-medium text-[color:var(--text-tertiary)]">Team: {paper.teamName}</p>
            )}
            {paper.teamMembers.length > 0 && (
              <p className="mt-1 text-sm text-[color:var(--text-tertiary)]">
                Members: {paper.teamMembers.join(", ")}
              </p>
            )}
            {canVote && onVote && (
              <button
                type="button"
                disabled={voting}
                onClick={() => onVote(paper.id)}
                className="mt-6 w-full rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50"
              >
                {voting ? "Casting vote…" : "Cast Vote"}
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
