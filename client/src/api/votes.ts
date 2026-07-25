import type { VotedPaper, VotedProject, VotingStatus } from "../types/index.ts";
import { apiRequest } from "./client.ts";

export function getVotingStatus() {
  return apiRequest<{ success: true } & VotingStatus>("/votes/status");
}

export function castVote(projectId: string) {
  return apiRequest<{ success: true; message: string; votedProject: VotedProject }>("/votes/cast", {
    method: "POST",
    body: { projectId },
  });
}

export function castPaperVote(paperId: string) {
  return apiRequest<{ success: true; message: string; votedPaper: VotedPaper }>("/votes/cast-paper", {
    method: "POST",
    body: { paperId },
  });
}
