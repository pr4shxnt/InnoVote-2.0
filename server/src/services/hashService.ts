import bcrypt from "bcrypt";

const OTP_SALT_ROUNDS = 10;

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, OTP_SALT_ROUNDS);
}

export async function compareOtp(otp: string, hashedOtp: string): Promise<boolean> {
  return bcrypt.compare(otp, hashedOtp);
}

export function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.trim();
}

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
