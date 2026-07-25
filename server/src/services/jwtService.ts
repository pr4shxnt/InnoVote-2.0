import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const VOTER_SESSION_COOKIE = "innovote_session";
export const VOTER_SESSION_MAX_AGE_MS = 20 * 60 * 1000;

export const ADMIN_SESSION_COOKIE = "innovote_admin_session";
export const ADMIN_SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

export interface VoterTokenPayload {
  role: "voter";
  sub: string;
  phoneNumber: string;
}

export interface AdminTokenPayload {
  role: "admin";
  sub: string;
}

export function signVoterToken(payload: Omit<VoterTokenPayload, "role">): string {
  const data: VoterTokenPayload = { role: "voter", ...payload };
  return jwt.sign(data, env.JWT_SECRET, { expiresIn: VOTER_SESSION_MAX_AGE_MS / 1000 });
}

export function verifyVoterToken(token: string): VoterTokenPayload & { exp: number } {
  const decoded = jwt.verify(token, env.JWT_SECRET) as VoterTokenPayload & { exp: number };
  if (decoded.role !== "voter") {
    throw new Error("Invalid token role");
  }
  return decoded;
}

export function signAdminToken(payload: Omit<AdminTokenPayload, "role">): string {
  const data: AdminTokenPayload = { role: "admin", ...payload };
  return jwt.sign(data, env.JWT_SECRET, { expiresIn: ADMIN_SESSION_MAX_AGE_MS / 1000 });
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as AdminTokenPayload;
  if (decoded.role !== "admin") {
    throw new Error("Invalid token role");
  }
  return decoded;
}
