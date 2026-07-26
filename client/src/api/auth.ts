import { apiRequest } from "./client.ts";

export function login(phoneNumber: string, displayName: string) {
  return apiRequest<{ success: true; user: { phoneNumber: string; hasVoted: boolean } }>("/auth/login", {
    method: "POST",
    body: { phoneNumber, displayName },
  });
}

export function logout() {
  return apiRequest<{ success: true }>("/auth/logout", { method: "POST" });
}
