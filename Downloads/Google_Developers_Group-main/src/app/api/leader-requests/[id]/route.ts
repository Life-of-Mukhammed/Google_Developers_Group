import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/rbac";
import { LeaderRequest } from "@/models/LeaderRequest";
import { CampusTeam } from "@/models/CampusTeam";
import { User } from "@/models/User";
import { USER_ROLES } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { user, error } = await requireSuperAdmin(request);
  if (error || !user) return error;
  const { id } = await params;
  const body = await request.json();
  const action = String(body.action ?? "");
  if (!["APPROVE", "REJECT"].includes(action)) return fail("Invalid action");

  await connectToDatabase();
  const item = await LeaderRequest.findById(id);
  if (!item) return fail("Request not found", 404);
  if (item.status !== "PENDING") return fail("Already reviewed", 400);

  if (action === "REJECT") {
    item.status = "REJECTED";
    item.reviewedBy = user.id;
    await item.save();
    return ok(item);
  }

  let resolvedTeamId = item.teamId ? item.teamId.toString() : "";
  if (!resolvedTeamId) {
    const newTeam = await CampusTeam.create({
      name: item.requestedTeamName || `${item.region || "Campus"} Leaders`,
      university: item.university || "Unknown University",
      region: item.region || "Unknown Region",
      description: item.description || "Created from leader request",
    });
    resolvedTeamId = newTeam._id.toString();
  }

  await User.findByIdAndUpdate(item.userId, {
    role: USER_ROLES.CAMPUS_ADMIN,
    teamId: resolvedTeamId,
  });

  item.status = "APPROVED";
  item.teamId = resolvedTeamId;
  item.reviewedBy = user.id;
  await item.save();
  return ok(item);
}
