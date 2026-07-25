import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const votingRoundSchema = new Schema(
  {
    name: { type: String, required: true, default: "Sunway Innovation Fest" },
    isActive: { type: Boolean, default: true },
    resultRevealAt: { type: Date, default: null },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type VotingRoundDocument = InferSchemaType<typeof votingRoundSchema> & { _id: Types.ObjectId };
export const VotingRoundModel = model("VotingRound", votingRoundSchema);
