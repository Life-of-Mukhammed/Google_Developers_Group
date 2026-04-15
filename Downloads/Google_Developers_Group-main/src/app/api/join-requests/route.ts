import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { requireAuth, requireSuperAdmin } from "@/lib/rbac";
import { JoinRequest } from "@/models/JoinRequest";

export async function GET(request: NextRequest) {
  const { error } = await requireSuperAdmin(request);
  if (error) return error;
  await connectToDatabase();

  const items = await JoinRequest.find({})
    .populate("userId", "email role")
    .populate("teamId", "name university region")
    .sort({ createdAt: -1 })
    .lean();
  return ok(items);
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return error;
  const body = await request.json();
  const teamId = body.teamId ? String(body.teamId) : null;

  await connectToDatabase();
  const exists = await JoinRequest.findOne({ userId: user.id, status: "PENDING" });
  if (exists) return fail("Join request already pending", 409);

  const item = await JoinRequest.create({
    userId: user.id,
    teamId,
    note: body.note ?? "Community membership request",
  });
  return ok(item, { status: 201 });
}
