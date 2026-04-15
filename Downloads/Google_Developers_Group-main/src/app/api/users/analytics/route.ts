import { NextRequest } from "next/server";
import { ok } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/rbac";
import { CampusTeam } from "@/models/CampusTeam";
import { JoinRequest } from "@/models/JoinRequest";
import { Member } from "@/models/Member";
import { Session } from "@/models/Session";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  const { error } = await requireSuperAdmin(request);
  if (error) return error;

  await connectToDatabase();
  const now = new Date();
  const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalUsers, totalLeaders, totalSuperAdmins, newUsers30d, activeSessions, totalCommunities, totalTeamMembers, totalCommunityMembers] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: "CAMPUS_ADMIN" }),
    User.countDocuments({ role: "SUPER_ADMIN" }),
    User.countDocuments({ createdAt: { $gte: last30 } }),
    Session.countDocuments({ expiresAt: { $gte: now } }),
    CampusTeam.countDocuments({}),
    Member.countDocuments({}),
    JoinRequest.countDocuments({ status: "APPROVED" }),
  ]);

  return ok({
    totalUsers,
    totalLeaders,
    totalSuperAdmins,
    newUsers30d,
    activeSessions,
    totalCommunities,
    totalTeamMembers,
    totalCommunityMembers,
  });
}
