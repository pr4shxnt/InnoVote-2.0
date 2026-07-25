export interface Project {
  id: string;
  title: string;
  description: string;
  boothNumber: string;
  imageUrl: string;
  teamName: string;
  teamMembers: string[];
}

export interface AdminProject extends Project {
  isActive: boolean;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  teamName: string;
  teamMembers: string[];
}

export interface AdminResearchPaper extends ResearchPaper {
  isActive: boolean;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface VotedProject {
  id: string;
  title: string;
  boothNumber: string;
}

export interface VotedPaper {
  id: string;
  title: string;
}

export interface Profile {
  displayName: string;
  hasSetDisplayName: boolean;
  hasVoted: boolean;
  votedProject: VotedProject | null;
  hasVotedPaper: boolean;
  votedPaper: VotedPaper | null;
  sessionRemainingMs: number;
}

export interface ResultEntry {
  projectId: string;
  title: string;
  boothNumber: string;
  voteCount: number;
}

export type ResultsResponse =
  | { revealed: false; resultRevealAt: string | null }
  | { revealed: true; resultRevealAt: string | null; results: ResultEntry[] };

export interface PaperResultEntry {
  paperId: string;
  title: string;
  voteCount: number;
}

export type PaperResultsResponse =
  | { revealed: false; resultRevealAt: string | null }
  | { revealed: true; resultRevealAt: string | null; results: PaperResultEntry[] };

export interface AdminUserRecord {
  id: string;
  phoneNumber: string;
  displayName: string;
  hasVoted: boolean;
  votedProjectId: string | null;
  votedAt: string | null;
  status: "ACTIVE" | "BLOCKED";
  createdAt: string;
}

export interface VotingRound {
  id: string;
  name: string;
  resultRevealAt: string | null;
  isPublished: boolean;
  votingOpensAt: string | null;
  votingClosesAt: string | null;
  votingManualOverride: "open" | "closed" | null;
  votingOpen: boolean;
}

export interface VotingStatus {
  votingOpen: boolean;
  votingOpensAt: string | null;
  votingClosesAt: string | null;
}
