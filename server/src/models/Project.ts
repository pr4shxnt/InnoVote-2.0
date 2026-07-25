import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    boothNumber: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    teamName: { type: String, default: "", trim: true },
    teamMembers: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type ProjectDocument = InferSchemaType<typeof projectSchema> & { _id: Types.ObjectId };
export const ProjectModel = model("Project", projectSchema);
