import type { Project, ResultsResponse } from "../types/index.ts";
import { apiRequest } from "./client.ts";

export function listProjects() {
  return apiRequest<{ success: true; projects: Project[] }>("/projects");
}

export function getResults() {
  return apiRequest<ResultsResponse & { success: true }>("/results");
}
