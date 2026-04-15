import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { requireAuth, requireSuperAdmin } from "@/lib/rbac";
import { CampusTeam } from "@/models/CampusTeam";
import { LeaderRequest } from "@/models/LeaderRequest";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  const { error } = await requireSuperAdmin(request);
  if (error) return error;

  await connectToDatabase();
  const items = await LeaderRequest.find()
    .populate("userId", "email role teamId")
    .populate("teamId", "name university region logo")
    .sort({ createdAt: -1 })
    .lean();
  return ok(items);
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return error;

  const body = await request.json();
  await connectToDatabase();
  const pending = await LeaderRequest.findOne({ userId: user.id, status: "PENDING" });
  if (pending) return fail("You already have a pending leader request", 409);

  const requestedTeamId = body.teamId ? String(body.teamId) : null;
  if (requestedTeamId) {
    const existingLeader = await User.findOne({ role: "CAMPUS_ADMIN", teamId: requestedTeamId }).select("_id").lean();
    if (existingLeader) return fail("This university already has a leader. Please join the community.", 409);
  } else {
    const requestedUniversity = String(body.university ?? "").trim();
    if (requestedUniversity) {
      const existingTeam = await CampusTeam.findOne({ university: requestedUniversity }).select("_id").lean();
      if (existingTeam) {
        const existingLeader = await User.findOne({ role: "CAMPUS_ADMIN", teamId: existingTeam._id }).select("_id").lean();
        if (existingLeader) return fail("This university already has a leader. Please join the community.", 409);
      }
    }
  }

  const item = await LeaderRequest.create({
    userId: user.id,
    teamId: requestedTeamId,
    requestedTeamName: body.requestedTeamName ?? "",
    university: body.university ?? "",
    region: body.region ?? "",
    description: body.description ?? "",
  });
  return ok(item, { status: 201 });
}
