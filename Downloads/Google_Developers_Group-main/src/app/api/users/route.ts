import { NextRequest } from "next/server";
import { ok } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/rbac";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  const { error } = await requireSuperAdmin(request);
  if (error) return error;

  await connectToDatabase();
  const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
  return ok(users);
}
