// express-rate-limit has no default export in its ESM types (only a named one) — using
// the default import relies on synthetic-default interop that resolves inconsistently
// across environments. The named import is the pattern their own docs recommend.
import { rateLimit } from "express-rate-limit";

export const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many OTP requests. Please try again later." },
});
