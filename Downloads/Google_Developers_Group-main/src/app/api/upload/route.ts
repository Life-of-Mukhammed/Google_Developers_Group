import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/rbac";

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) return fail("Missing file");

  const bytes = await file.arrayBuffer();
  const imageUrl = await uploadToCloudinary(Buffer.from(bytes), "campus-leaders");
  return ok({ imageUrl });
}
