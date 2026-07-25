import type { PaperResultsResponse, ResearchPaper } from "../types/index.ts";
import { apiRequest } from "./client.ts";

export function listResearchPapers() {
  return apiRequest<{ success: true; papers: ResearchPaper[] }>("/research-papers");
}

export function getPaperResults() {
  return apiRequest<PaperResultsResponse & { success: true }>("/results/research-papers");
}
