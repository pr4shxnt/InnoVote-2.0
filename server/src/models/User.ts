import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const userSchema = new Schema(
  {
    phoneNumber: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, default: "Voter" },
    hasSetDisplayName: { type: Boolean, default: false },
    hasVoted: { type: Boolean, default: false },
    votedProjectId: { type: Schema.Types.ObjectId, ref: "Project", default: null },
    votedAt: { type: Date, default: null },
    hasVotedPaper: { type: Boolean, default: false },
    votedPaperId: { type: Schema.Types.ObjectId, ref: "ResearchPaper", default: null },
    votedPaperAt: { type: Date, default: null },
    status: { type: String, enum: ["ACTIVE", "BLOCKED"], default: "ACTIVE" },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };
export const UserModel = model("User", userSchema);
