import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { canAccessTeam } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";
import { Member } from "@/models/Member";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { user, error } = await requireAdmin(request);
  if (error || !user) return error;
  const { id } = await params;

  await connectToDatabase();
  const existing = await Member.findById(id).lean();
  if (!existing) return fail("Member not found", 404);
  if (!canAccessTeam(user, existing.teamId.toString())) return fail("Forbidden", 403);

  const body = await request.json();
  const updated = await Member.findByIdAndUpdate(id, body, { new: true }).lean();
  return ok(updated);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { user, error } = await requireAdmin(request);
  if (error || !user) return error;
  const { id } = await params;
  await connectToDatabase();
  const existing = await Member.findById(id).lean();
  if (!existing) return fail("Member not found", 404);
  if (!canAccessTeam(user, existing.teamId.toString())) return fail("Forbidden", 403);

  await Member.findByIdAndDelete(id);
  return ok({ deleted: true });
}
