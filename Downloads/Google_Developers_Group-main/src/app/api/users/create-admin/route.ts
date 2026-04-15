import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/rbac";
import { User } from "@/models/User";
import { USER_ROLES } from "@/types";

export async function POST(request: NextRequest) {
  const { error } = await requireSuperAdmin(request);
  if (error) return error;

  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const teamId = String(body.teamId ?? "");
  if (!email || !password || !teamId) return fail("email, password and teamId are required");

  await connectToDatabase();
  const exists = await User.findOne({ email });
  if (exists) return fail("User already exists", 409);

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({
    email,
    password: hashed,
    role: USER_ROLES.CAMPUS_ADMIN,
    teamId,
  });

  return ok(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      teamId: user.teamId?.toString(),
    },
    { status: 201 }
  );
}
