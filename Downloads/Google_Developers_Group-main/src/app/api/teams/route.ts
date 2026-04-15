import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { CampusTeam } from "@/models/CampusTeam";
import { requireSuperAdmin } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const search = searchParams.get("search");

  const query: Record<string, unknown> = {};
  if (region) query.region = region;
  if (search) query.name = { $regex: search, $options: "i" };

  const teams = await CampusTeam.find(query).sort({ createdAt: -1 }).lean();
  return ok(teams);
}

export async function POST(request: NextRequest) {
  const { error } = await requireSuperAdmin(request);
  if (error) return error;

  const body = await request.json();
  if (!body.name || !body.university || !body.region || !body.description) {
    return fail("Missing required fields");
  }

  await connectToDatabase();
  const team = await CampusTeam.create({
    name: body.name,
    university: body.university,
    region: body.region,
    description: body.description,
    logo: body.logo ?? null,
    coverImage: body.coverImage ?? null,
    telegramUrl: body.telegramUrl ?? null,
  });

  return ok(team, { status: 201 });
}
