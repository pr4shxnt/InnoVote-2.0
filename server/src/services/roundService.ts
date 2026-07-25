import { VotingRoundModel, type VotingRoundDocument } from "../models/VotingRound.js";
import type { HydratedDocument } from "mongoose";

export async function getActiveRound(): Promise<HydratedDocument<VotingRoundDocument>> {
  const existing = await VotingRoundModel.findOne({ isActive: true }).sort({ createdAt: -1 });
  if (existing) {
    return existing;
  }
  return VotingRoundModel.create({ name: "Sunway Innovation Fest", isActive: true });
}

// Manual override always wins. With no override, the round is open unless a
// schedule bound has been set and the current time falls outside it.
export function isVotingOpen(round: VotingRoundDocument, now: Date = new Date()): boolean {
  if (round.votingManualOverride === "open") return true;
  if (round.votingManualOverride === "closed") return false;
  if (round.votingOpensAt && now < round.votingOpensAt) return false;
  if (round.votingClosesAt && now > round.votingClosesAt) return false;
  return true;
}
