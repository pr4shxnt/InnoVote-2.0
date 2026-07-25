import { Types } from "mongoose";
import { z } from "zod";

export const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid id.",
});

export const phoneNumberSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number format.");

export const otpCodeSchema = z.string().trim().regex(/^\d{6}$/, "OTP must be 6 digits.");

export const requestOtpBodySchema = z.object({
  phoneNumber: phoneNumberSchema,
});

export const verifyOtpBodySchema = z.object({
  phoneNumber: phoneNumberSchema,
  otp: otpCodeSchema,
});

export const updateProfileBodySchema = z.object({
  displayName: z.string().trim().min(1).max(40),
});

export const castVoteBodySchema = z.object({
  projectId: objectIdSchema,
});

export const adminLoginBodySchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export const projectBodySchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional().default(""),
  boothNumber: z.string().trim().min(1).max(20),
  imageUrl: z.string().trim().max(2000).optional().default(""),
  teamName: z.string().trim().max(120).optional().default(""),
  teamMembers: z.array(z.string().trim().min(1)).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

export const projectUpdateBodySchema = projectBodySchema.partial();

export const researchPaperBodySchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional().default(""),
  imageUrl: z.string().trim().max(2000).optional().default(""),
  teamName: z.string().trim().max(120).optional().default(""),
  teamMembers: z.array(z.string().trim().min(1)).optional().default([]),
  isActive: z.boolean().optional().default(true),
});

export const researchPaperUpdateBodySchema = researchPaperBodySchema.partial();

export const castPaperVoteBodySchema = z.object({
  paperId: objectIdSchema,
});

export const blockUserBodySchema = z.object({
  phoneNumber: phoneNumberSchema,
});

export const updateRoundBodySchema = z.object({
  resultRevealAt: z.string().datetime().nullable().optional(),
  isPublished: z.boolean().optional(),
});
