import type { Profile } from "../types/index.ts";
import { apiRequest } from "./client.ts";

export function getProfile() {
  return apiRequest<{ success: true; profile: Profile }>("/user/profile");
}

export function updateProfile(displayName: string) {
  return apiRequest<{ success: true; profile: { displayName: string; hasSetDisplayName: boolean } }>(
    "/user/profile",
    {
      method: "PUT",
      body: { displayName },
    },
  );
}
