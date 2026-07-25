import { Schema, model, type InferSchemaType } from "mongoose";

const otpSchema = new Schema(
  {
    phoneNumber: { type: String, required: true, index: true },
    hashedOtp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    consumedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Auto-expire documents shortly after they become useless.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });

export type OtpDocument = InferSchemaType<typeof otpSchema>;
export const OtpModel = model("Otp", otpSchema);
