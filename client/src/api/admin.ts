import type { AdminProject, AdminResearchPaper, AdminUserRecord, VotingRound } from "../types/index.ts";
import { API_BASE, apiRequest, ApiError } from "./client.ts";

export interface ProjectInput {
  title: string;
  description?: string;
  boothNumber: string;
  imageUrl?: string;
  teamName?: string;
  teamMembers?: string[];
  isActive?: boolean;
}

export interface ResearchPaperInput {
  title: string;
  description?: string;
  imageUrl?: string;
  teamName?: string;
  teamMembers?: string[];
  isActive?: boolean;
}

export function adminLogin(username: string, password: string) {
  return apiRequest<{ success: true; admin: { username: string } }>("/admin/auth/login", {
    method: "POST",
    body: { username, password },
  });
}

export function adminLogout() {
  return apiRequest<{ success: true }>("/admin/auth/logout", { method: "POST" });
}

export function adminMe() {
  return apiRequest<{ success: true; admin: { username: string } }>("/admin/auth/me");
}

export function listAdminProjects() {
  return apiRequest<{ success: true; projects: AdminProject[] }>("/admin/projects");
}

export function createProject(input: ProjectInput) {
  return apiRequest<{ success: true; project: AdminProject }>("/admin/projects", {
    method: "POST",
    body: input,
  });
}

export function updateProject(id: string, input: Partial<ProjectInput>) {
  return apiRequest<{ success: true; project: AdminProject }>(`/admin/projects/${id}`, {
    method: "PUT",
    body: input,
  });
}

export function deleteProject(id: string) {
  return apiRequest<{ success: true; message: string }>(`/admin/projects/${id}`, { method: "DELETE" });
}

export function listAdminResearchPapers() {
  return apiRequest<{ success: true; papers: AdminResearchPaper[] }>("/admin/research-papers");
}

export function createResearchPaper(input: ResearchPaperInput) {
  return apiRequest<{ success: true; paper: AdminResearchPaper }>("/admin/research-papers", {
    method: "POST",
    body: input,
  });
}

export function updateResearchPaper(id: string, input: Partial<ResearchPaperInput>) {
  return apiRequest<{ success: true; paper: AdminResearchPaper }>(`/admin/research-papers/${id}`, {
    method: "PUT",
    body: input,
  });
}

export function deleteResearchPaper(id: string) {
  return apiRequest<{ success: true; message: string }>(`/admin/research-papers/${id}`, { method: "DELETE" });
}

export function listUsers() {
  return apiRequest<{ success: true; users: AdminUserRecord[] }>("/admin/users");
}

export function blockUser(phoneNumber: string) {
  return apiRequest<{ success: true; user: AdminUserRecord }>("/admin/users/block", {
    method: "POST",
    body: { phoneNumber },
  });
}

export function unblockUser(phoneNumber: string) {
  return apiRequest<{ success: true; user: AdminUserRecord | null }>("/admin/users/unblock", {
    method: "POST",
    body: { phoneNumber },
  });
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, data.error ?? "Failed to upload image.");
  }

  return data as { success: true; url: string; publicId: string };
}

export function getRound() {
  return apiRequest<{ success: true; round: VotingRound }>("/admin/results/round");
}

export function updateRound(input: {
  resultRevealAt?: string | null;
  isPublished?: boolean;
  votingOpensAt?: string | null;
  votingClosesAt?: string | null;
  votingManualOverride?: "open" | "closed" | null;
}) {
  return apiRequest<{ success: true; round: VotingRound }>("/admin/results/round", {
    method: "PUT",
    body: input,
  });
}
