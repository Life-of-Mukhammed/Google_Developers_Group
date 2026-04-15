import { model, models, Schema } from "mongoose";

const leaderRequestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    teamId: { type: Schema.Types.ObjectId, ref: "CampusTeam", default: null },
    requestedTeamName: { type: String, default: "" },
    university: { type: String, default: "" },
    region: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING", index: true },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export const LeaderRequest = models.LeaderRequest || model("LeaderRequest", leaderRequestSchema);
