import { apiRequest } from "./client.ts";

export function requestOtp(phoneNumber: string) {
  return apiRequest<{ success: true; message: string }>("/auth/request-otp", {
    method: "POST",
    body: { phoneNumber },
  });
}

export function verifyOtp(phoneNumber: string, otp: string) {
  return apiRequest<{ success: true; user: { phoneNumber: string; hasVoted: boolean } }>("/auth/verify-otp", {
    method: "POST",
    body: { phoneNumber, otp },
  });
}

export function logout() {
  return apiRequest<{ success: true }>("/auth/logout", { method: "POST" });
}
