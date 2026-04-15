import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/rbac";
import { JoinRequest } from "@/models/JoinRequest";
import { User } from "@/models/User";

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return error;

  await connectToDatabase();
  const me = await User.findById(user.id).select("email role teamId").lean();
  if (!me) return fail("User not found", 404);

  const isAdmin = me.role === "SUPER_ADMIN" || me.role === "CAMPUS_ADMIN";
  const approvedCommunityRequest = await JoinRequest.findOne({ userId: me._id, status: "APPROVED" }).select("_id").lean();
  const hasCommunityAccess = isAdmin || Boolean(approvedCommunityRequest);

  return ok({
    hasCommunityAccess,
    hasTeamAccess: hasCommunityAccess,
    user: {
      email: me.email,
      role: me.role,
      teamId: me.teamId ? me.teamId.toString() : null,
    },
  });
}
