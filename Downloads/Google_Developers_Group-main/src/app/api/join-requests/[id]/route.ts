import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/rbac";
import { JoinRequest } from "@/models/JoinRequest";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { user, error } = await requireSuperAdmin(request);
  if (error || !user) return error;
  const { id } = await params;
  const body = await request.json();
  const action = String(body.action ?? "");
  if (!["APPROVE", "REJECT"].includes(action)) return fail("Invalid action");

  await connectToDatabase();
  const item = await JoinRequest.findById(id);
  if (!item) return fail("Join request not found", 404);
  if (item.status !== "PENDING") return fail("Already reviewed", 400);

  if (action === "APPROVE") {
    item.status = "APPROVED";
  } else {
    item.status = "REJECTED";
  }

  item.reviewedBy = user.id;
  await item.save();
  return ok(item);
}
