import type { Project } from "../types/index.ts";
import { Modal } from "./Modal.tsx";

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
  isVotedProject?: boolean;
  canVote?: boolean;
  onVote?: (projectId: string) => void;
  voting?: boolean;
}

export function ProjectDetailsModal({
  project,
  onClose,
  isVotedProject,
  canVote,
  onVote,
  voting,
}: ProjectDetailsModalProps) {
  return (
    <Modal open={project !== null} onClose={onClose}>
      {project && (
        <div>
          <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-[color:var(--bg-elevated)]">
            {project.imageUrl ? (
              <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-[color:var(--text-muted)]">
                No image
              </div>
            )}
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-2xl font-semibold">{project.title}</h2>
                <p className="mt-1 text-sm text-[color:var(--text-muted)]">Booth #{project.boothNumber}</p>
              </div>
              {isVotedProject && (
                <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-xs font-semibold text-status-success">
                  Voted
                </span>
              )}
            </div>
            {project.description && (
              <p className="mt-4 text-base text-[color:var(--text-muted)]">{project.description}</p>
            )}
            {project.teamName && (
              <p className="mt-4 text-sm font-medium text-[color:var(--text-tertiary)]">Team: {project.teamName}</p>
            )}
            {project.teamMembers.length > 0 && (
              <p className="mt-1 text-sm text-[color:var(--text-tertiary)]">
                Members: {project.teamMembers.join(", ")}
              </p>
            )}
            {canVote && onVote && (
              <button
                type="button"
                disabled={voting}
                onClick={() => onVote(project.id)}
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
