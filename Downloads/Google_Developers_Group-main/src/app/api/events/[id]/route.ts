import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { canAccessTeam } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";
import { Event } from "@/models/Event";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { user, error } = await requireAdmin(request);
  if (error || !user) return error;
  const { id } = await params;

  await connectToDatabase();
  const existing = await Event.findById(id).lean();
  if (!existing) return fail("Event not found", 404);
  if (!canAccessTeam(user, existing.teamId.toString())) return fail("Forbidden", 403);

  const body = await request.json();
  const updated = await Event.findByIdAndUpdate(id, body, { new: true }).lean();
  return ok(updated);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { user, error } = await requireAdmin(request);
  if (error || !user) return error;
  const { id } = await params;

  await connectToDatabase();
  const existing = await Event.findById(id).lean();
  if (!existing) return fail("Event not found", 404);
  if (!canAccessTeam(user, existing.teamId.toString())) return fail("Forbidden", 403);

  await Event.findByIdAndDelete(id);
  return ok({ deleted: true });
}
