import { model, models, Schema } from "mongoose";

const newsSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    image: { type: String, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "CampusTeam", default: null, index: true },
  },
  { timestamps: true }
);

export const News = models.News || model("News", newsSchema);
