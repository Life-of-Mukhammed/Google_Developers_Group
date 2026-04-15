import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { canAccessTeam } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { requireAdmin, requireSuperAdmin } from "@/lib/rbac";
import { CampusTeam } from "@/models/CampusTeam";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  await connectToDatabase();
  const { id } = await params;
  const team = await CampusTeam.findById(id).lean();
  if (!team) return fail("Team not found", 404);
  return ok(team);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { user, error } = await requireAdmin(request);
  if (error || !user) return error;
  const { id } = await params;
  if (!canAccessTeam(user, id)) return fail("Forbidden", 403);

  const body = await request.json();
  await connectToDatabase();
  const updated = await CampusTeam.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!updated) return fail("Team not found", 404);
  return ok(updated);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { error } = await requireSuperAdmin(request);
  if (error) return error;

  const { id } = await params;
  await connectToDatabase();
  await CampusTeam.findByIdAndDelete(id);
  return ok({ deleted: true });
}
