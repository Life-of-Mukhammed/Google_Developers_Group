import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { canAccessTeam } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";
import { Member } from "@/models/Member";

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId");
  const query = teamId ? { teamId } : {};
  const members = await Member.find(query).sort({ createdAt: -1 }).lean();
  return ok(members);
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAdmin(request);
  if (error || !user) return error;

  const body = await request.json();
  const teamId = body.teamId ?? user.teamId;
  if (!teamId || !canAccessTeam(user, teamId)) return fail("Forbidden", 403);

  await connectToDatabase();
  const item = await Member.create({
    name: body.name,
    role: body.role,
    contact: body.contact ?? "",
    teamId,
  });

  return ok(item, { status: 201 });
}
