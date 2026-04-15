import { model, models, Schema, type InferSchemaType } from "mongoose";
import { USER_ROLES } from "@/types";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, unique: true, sparse: true, trim: true, default: null },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
      required: true,
    },
    teamId: { type: Schema.Types.ObjectId, ref: "CampusTeam", default: null },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: Schema.Types.ObjectId };
export const User = models.User || model("User", userSchema);
