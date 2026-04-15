import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { User } from "@/models/User";
import { LeaderRequest } from "@/models/LeaderRequest";
import { USER_ROLES } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").toLowerCase().trim();
    const phoneNumber = String(body.phoneNumber ?? "").trim();
    const password = String(body.newPassword ?? body.password ?? "");
    const confirmPassword = String(body.confirmPassword ?? "");
    const becomeLeader = Boolean(body.becomeLeader);

    if (!email || !phoneNumber || !password || !confirmPassword) {
      return fail("Email, phone number, new password and confirm password are required");
    }
    if (password.length < 8) return fail("Password must be at least 8 characters");
    if (password !== confirmPassword) return fail("Passwords do not match");

    await connectToDatabase();
    const existing = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existing) return fail("User already exists", 409);

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      phoneNumber,
      password: hashed,
      role: USER_ROLES.USER,
    });

    if (becomeLeader) {
      await LeaderRequest.create({
        userId: user._id,
        teamId: body.teamId || null,
        requestedTeamName: body.requestedTeamName ?? "",
        university: body.university ?? "",
        region: body.region ?? "",
        description: body.description ?? "",
      });
    }

    return ok(
      {
        id: user._id.toString(),
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        leaderRequestCreated: becomeLeader,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration failed", error);

    if (error instanceof Error && error.message.includes("Missing MONGODB_URI")) {
      return fail("Server database is not configured. Add MONGODB_URI to .env.local", 500);
    }

    return fail("Failed to register", 500);
  }
}
