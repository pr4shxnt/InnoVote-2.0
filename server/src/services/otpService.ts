import { ApiError } from "../middleware/errorHandler.js";
import { OtpModel } from "../models/Otp.js";
import { compareOtp, generateOtpCode, hashOtp, normalizePhoneNumber } from "./hashService.js";
import { smsGateClient } from "./smsGateService.js";

const OTP_TTL_MS = 3 * 60 * 1000;

export async function requestOtp(phoneNumber: string): Promise<void> {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
  const otpCode = generateOtpCode();
  const hashedOtp = await hashOtp(otpCode);

  await OtpModel.create({
    phoneNumber: normalizedPhoneNumber,
    hashedOtp,
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });

  await smsGateClient.sendOtpSms(phoneNumber, otpCode);
}

export async function verifyOtp(phoneNumber: string, otp: string): Promise<void> {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
  const otpRecord = await OtpModel.findOne({ phoneNumber: normalizedPhoneNumber, consumedAt: null }).sort({
    createdAt: -1,
  });

  if (!otpRecord || otpRecord.expiresAt < new Date()) {
    throw new ApiError(400, "OTP expired or invalid.");
  }

  const isMatch = await compareOtp(otp, otpRecord.hashedOtp);
  if (!isMatch) {
    throw new ApiError(400, "Incorrect OTP.");
  }

  const consumed = await OtpModel.findOneAndUpdate(
    { _id: otpRecord._id, consumedAt: null },
    { consumedAt: new Date() },
  );
  if (!consumed) {
    throw new ApiError(400, "OTP expired or invalid.");
  }
}
