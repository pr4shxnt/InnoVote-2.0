import type { VotedPaper, VotedProject } from "../types/index.ts";
import { apiRequest } from "./client.ts";

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
