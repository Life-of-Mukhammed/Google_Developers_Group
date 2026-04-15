import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { canAccessTeam } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";
import { News } from "@/models/News";
import { USER_ROLES } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { user, error } = await requireAdmin(request);
  if (error || !user) return error;
  const { id } = await params;

  await connectToDatabase();
  const existing = await News.findById(id).lean();
  if (!existing) return fail("News not found", 404);

  const existingTeamId = existing.teamId ? existing.teamId.toString() : null;
  if (existingTeamId && !canAccessTeam(user, existingTeamId)) return fail("Forbidden", 403);
  if (!existingTeamId && user.role !== USER_ROLES.SUPER_ADMIN) return fail("Forbidden", 403);

  const body = await request.json();
  const updated = await News.findByIdAndUpdate(id, body, { new: true }).lean();
  return ok(updated);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { user, error } = await requireAdmin(request);
  if (error || !user) return error;
  const { id } = await params;

  await connectToDatabase();
  const existing = await News.findById(id).lean();
  if (!existing) return fail("News not found", 404);
  const existingTeamId = existing.teamId ? existing.teamId.toString() : null;
  if (existingTeamId && !canAccessTeam(user, existingTeamId)) return fail("Forbidden", 403);
  if (!existingTeamId && user.role !== USER_ROLES.SUPER_ADMIN) return fail("Forbidden", 403);

  await News.findByIdAndDelete(id);
  return ok({ deleted: true });
}
