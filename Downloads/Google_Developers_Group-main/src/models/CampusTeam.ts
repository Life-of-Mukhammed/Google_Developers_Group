import { model, models, Schema } from "mongoose";

const campusTeamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    university: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    logo: { type: String, default: null },
    coverImage: { type: String, default: null },
    telegramUrl: { type: String, default: null },
  },
  { timestamps: true }
);

export const CampusTeam = models.CampusTeam || model("CampusTeam", campusTeamSchema);
