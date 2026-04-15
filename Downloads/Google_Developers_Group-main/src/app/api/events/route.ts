import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { canAccessTeam } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";
import { Event } from "@/models/Event";

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId");
  const query = teamId ? { teamId } : {};
  const events = await Event.find(query).sort({ datetime: -1 }).lean();
  return ok(events);
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAdmin(request);
  if (error || !user) return error;
  const body = await request.json();
  const teamId = body.teamId ?? user.teamId;
  if (!teamId || !canAccessTeam(user, teamId)) return fail("Forbidden", 403);

  await connectToDatabase();
  const event = await Event.create({
    title: body.title,
    description: body.description,
    datetime: body.datetime,
    location: body.location,
    image: body.image ?? null,
    teamId,
  });
  return ok(event, { status: 201 });
}
