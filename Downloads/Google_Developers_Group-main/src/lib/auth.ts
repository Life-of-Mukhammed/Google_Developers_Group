import { randomBytes } from "crypto";
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Session } from "@/models/Session";
import { User } from "@/models/User";
import { USER_ROLES, type UserRole } from "@/types";

type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  teamId: string | null;
};

export function getTokenFromRequest(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth) return null;
  if (auth.startsWith("Bearer ")) return auth.replace("Bearer ", "").trim();
  return auth.trim();
}

export function generateSessionToken() {
  return randomBytes(48).toString("hex");
}

export async function createSession(userId: string, days = 7) {
  await connectToDatabase();
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  await Session.create({ userId, token, expiresAt });
  return { token, expiresAt };
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  await connectToDatabase();
  const session = await Session.findOne({ token }).lean();
  if (!session || new Date(session.expiresAt) < new Date()) {
    if (session) {
      await Session.deleteOne({ _id: session._id });
    }
    return null;
  }

  const user = await User.findById(session.userId).lean();
  if (!user) return null;

  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    teamId: user.teamId ? user.teamId.toString() : null,
  };
}

export function isAdmin(role?: UserRole) {
  return role === USER_ROLES.CAMPUS_ADMIN || role === USER_ROLES.SUPER_ADMIN;
}

export function canAccessTeam(user: AuthUser, teamId?: string | null) {
  if (user.role === USER_ROLES.SUPER_ADMIN) return true;
  if (user.role !== USER_ROLES.CAMPUS_ADMIN) return false;
  return Boolean(teamId && user.teamId && user.teamId === teamId);
}
