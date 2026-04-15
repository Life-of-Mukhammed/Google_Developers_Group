import { NextRequest } from "next/server";
import { ok } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/rbac";
import { JoinRequest } from "@/models/JoinRequest";
import { LeaderRequest } from "@/models/LeaderRequest";

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return error;

  await connectToDatabase();
  let pendingLeaderRequests = 0;
  let pendingJoinRequests = 0;
  const items: Array<{ id: string; title: string; subtitle: string; href: string }> = [];

  if (user.role === "SUPER_ADMIN") {
    const [leaderPending, joinPending, recentLeader, recentJoin] = await Promise.all([
      LeaderRequest.countDocuments({ status: "PENDING" }),
      JoinRequest.countDocuments({ status: "PENDING" }),
      LeaderRequest.find({ status: "PENDING" }).sort({ createdAt: -1 }).limit(3).populate("userId", "email").lean(),
      JoinRequest.find({ status: "PENDING" }).sort({ createdAt: -1 }).limit(3).populate("userId", "email").populate("teamId", "name").lean(),
    ]);
    pendingLeaderRequests = leaderPending;
    pendingJoinRequests = joinPending;
    for (const row of recentLeader) {
      items.push({
        id: `leader-${row._id.toString()}`,
        title: "Leader request",
        subtitle: `${(row.userId as { email?: string })?.email ?? "User"} leader bo'lishni so'radi`,
        href: "/admin",
      });
    }
    for (const row of recentJoin) {
      items.push({
        id: `join-${row._id.toString()}`,
        title: "Join request",
        subtitle: `${(row.userId as { email?: string })?.email ?? "User"} -> ${(row.teamId as { name?: string })?.name ?? "Team"}`,
        href: "/admin",
      });
    }
  } else if (user.role === "CAMPUS_ADMIN") {
    const [count, recent] = await Promise.all([
      JoinRequest.countDocuments({
        status: "PENDING",
        teamId: user.teamId,
      }),
      JoinRequest.find({ status: "PENDING", teamId: user.teamId }).sort({ createdAt: -1 }).limit(5).populate("userId", "email").lean(),
    ]);
    pendingJoinRequests = count;
    for (const row of recent) {
      items.push({
        id: `join-${row._id.toString()}`,
        title: "Yangi join request",
        subtitle: `${(row.userId as { email?: string })?.email ?? "User"} sizning jamoaga qo'shilmoqchi`,
        href: "/admin",
      });
    }
  } else {
    const [count, recent] = await Promise.all([
      JoinRequest.countDocuments({
        status: "PENDING",
        userId: user.id,
      }),
      JoinRequest.find({ userId: user.id }).sort({ createdAt: -1 }).limit(5).populate("teamId", "name").lean(),
    ]);
    pendingJoinRequests = count;
    for (const row of recent) {
      items.push({
        id: `self-${row._id.toString()}`,
        title: "Join request holati",
        subtitle: `${(row.teamId as { name?: string })?.name ?? "Team"} - ${row.status}`,
        href: "/profile",
      });
    }
  }

  return ok({
    pendingLeaderRequests,
    pendingJoinRequests,
    total: pendingLeaderRequests + pendingJoinRequests,
    items,
  });
}
