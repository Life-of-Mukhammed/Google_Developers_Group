import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { fail } from "@/lib/api";
import { USER_ROLES } from "@/types";

export async function requireAuth(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return { error: fail("Unauthorized", 401), user: null };
  return { user, error: null };
}

export async function requireAdmin(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return { user: null, error: error ?? fail("Unauthorized", 401) };
  if (user.role === USER_ROLES.USER) return { user: null, error: fail("Forbidden", 403) };
  return { user, error: null };
}

export async function requireSuperAdmin(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error || !user) return { user: null, error: error ?? fail("Unauthorized", 401) };
  if (user.role !== USER_ROLES.SUPER_ADMIN) return { user: null, error: fail("Forbidden", 403) };
  return { user, error: null };
}
