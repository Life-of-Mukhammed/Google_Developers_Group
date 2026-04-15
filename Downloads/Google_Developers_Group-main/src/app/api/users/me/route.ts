import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/rbac";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return error;

  await connectToDatabase();
  const me = await User.findById(user.id).select("-password").lean();
  return ok(me);
}

export async function PUT(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return error;
  const body = await request.json();
  const phoneNumber = String(body.phoneNumber ?? "").trim();
  const newPassword = String(body.newPassword ?? "");

  if (!phoneNumber && !newPassword) {
    return fail("Nothing to update");
  }

  await connectToDatabase();
  const updatePayload: Record<string, unknown> = {};
  if (phoneNumber) updatePayload.phoneNumber = phoneNumber;
  if (newPassword) {
    if (newPassword.length < 8) return fail("Password must be at least 8 characters");
    updatePayload.password = await bcrypt.hash(newPassword, 12);
  }

  const updated = await User.findByIdAndUpdate(user.id, updatePayload, {
    new: true,
  })
    .select("-password")
    .lean();

  return ok(updated);
}
