import { model, models, Schema } from "mongoose";

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    datetime: { type: Date, required: true, index: true },
    location: { type: String, required: true, trim: true },
    image: { type: String, default: null },
    teamId: { type: Schema.Types.ObjectId, ref: "CampusTeam", required: true, index: true },
  },
  { timestamps: true }
);

export const Event = models.Event || model("Event", eventSchema);
