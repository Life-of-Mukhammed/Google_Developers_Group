import { NextRequest } from "next/server";
import { ok } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/rbac";
import { News } from "@/models/News";

export async function GET() {
  await connectToDatabase();
  const news = await News.find({}).sort({ createdAt: -1 }).lean();
  return ok(news);
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireSuperAdmin(request);
  if (error || !user) return error;

  const body = await request.json();
  await connectToDatabase();
  const item = await News.create({
    title: body.title,
    content: body.content,
    image: body.image ?? null,
    createdBy: user.id,
    teamId: null,
  });

  return ok(item, { status: 201 });
}
