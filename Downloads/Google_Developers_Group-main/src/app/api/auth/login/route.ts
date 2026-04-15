import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").toLowerCase().trim();
    const password = String(body.password ?? "");

    if (!email || !password) return fail("Email and password are required");

    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) return fail("Invalid credentials", 401);

    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) return fail("Invalid credentials", 401);

    const session = await createSession(user._id.toString());

    return ok({
      token: session.token,
      expiresAt: session.expiresAt,
      user: {
        id: user._id.toString(),
        email: user.email,
        phoneNumber: user.phoneNumber ?? "",
        role: user.role,
        teamId: user.teamId ? user.teamId.toString() : null,
      },
    });
  } catch (error) {
    console.error("Login failed", error);

    if (error instanceof Error && error.message.includes("Missing MONGODB_URI")) {
      return fail("Server database is not configured. Add MONGODB_URI to .env.local", 500);
    }

    return fail("Failed to login", 500);
  }
}
