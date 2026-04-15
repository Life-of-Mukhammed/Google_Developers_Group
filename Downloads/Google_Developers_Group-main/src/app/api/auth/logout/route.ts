import { NextRequest } from "next/server";
import { getTokenFromRequest } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { Session } from "@/models/Session";

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return fail("Missing token", 401);

  await connectToDatabase();
  await Session.deleteOne({ token });
  return ok({ message: "Logged out successfully" });
}
