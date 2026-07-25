import { VotingRoundModel, type VotingRoundDocument } from "../models/VotingRound.js";
import type { HydratedDocument } from "mongoose";

export async function getActiveRound(): Promise<HydratedDocument<VotingRoundDocument>> {
  const existing = await VotingRoundModel.findOne({ isActive: true }).sort({ createdAt: -1 });
  if (existing) {
    return existing;
  }
  return VotingRoundModel.create({ name: "Sunway Innovation Fest", isActive: true });
}
