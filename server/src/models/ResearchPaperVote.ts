import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const researchPaperVoteSchema = new Schema(
  {
    roundId: { type: Schema.Types.ObjectId, ref: "VotingRound", required: true, index: true },
    paperId: { type: Schema.Types.ObjectId, ref: "ResearchPaper", required: true, index: true },
    voterPhoneNumber: { type: String, required: true, index: true },
    ipAddress: { type: String, default: "" },
  },
  { timestamps: true },
);

// Strict unique index: 1 vote per phone number per voting round
researchPaperVoteSchema.index({ roundId: 1, voterPhoneNumber: 1 }, { unique: true });

export type ResearchPaperVoteDocument = InferSchemaType<typeof researchPaperVoteSchema> & { _id: Types.ObjectId };
export const ResearchPaperVoteModel = model("ResearchPaperVote", researchPaperVoteSchema);
