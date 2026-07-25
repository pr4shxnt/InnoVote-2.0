import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const researchPaperSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    teamName: { type: String, default: "", trim: true },
    teamMembers: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type ResearchPaperDocument = InferSchemaType<typeof researchPaperSchema> & { _id: Types.ObjectId };
export const ResearchPaperModel = model("ResearchPaper", researchPaperSchema);
