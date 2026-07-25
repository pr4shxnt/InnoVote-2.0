import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const voteSchema = new Schema(
  {
    roundId: { type: Schema.Types.ObjectId, ref: "VotingRound", required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    voterPhoneNumber: { type: String, required: true, index: true },
    ipAddress: { type: String, default: "" },
  },
  { timestamps: true },
);

// Strict unique index: 1 vote per phone number per voting round
voteSchema.index({ roundId: 1, voterPhoneNumber: 1 }, { unique: true });

export type VoteDocument = InferSchemaType<typeof voteSchema> & { _id: Types.ObjectId };
export const VoteModel = model("Vote", voteSchema);
