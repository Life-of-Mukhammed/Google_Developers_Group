import bcrypt from "bcryptjs";
import { fail, ok } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { CampusTeam } from "@/models/CampusTeam";
import { User } from "@/models/User";
import { DEMO_CAMPUS_ADMIN, DEMO_SUPER_ADMIN } from "@/lib/demo";
import { USER_ROLES } from "@/types";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return fail("Disabled in production", 403);
  }

  await connectToDatabase();

  const team = await CampusTeam.findOneAndUpdate(
    { name: "Tashkent Campus Leaders" },
    {
      name: "Tashkent Campus Leaders",
      university: "Tashkent University of Information Technologies",
      region: "Tashkent",
      description: "Demo team for testing admin workflows.",
      telegramUrl: "https://t.me/campusleadersuz",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const [superHash, campusHash] = await Promise.all([
    bcrypt.hash(DEMO_SUPER_ADMIN.password, 12),
    bcrypt.hash(DEMO_CAMPUS_ADMIN.password, 12),
  ]);

  await User.findOneAndUpdate(
    { email: DEMO_SUPER_ADMIN.email },
    { email: DEMO_SUPER_ADMIN.email, password: superHash, role: USER_ROLES.SUPER_ADMIN, teamId: null },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await User.findOneAndUpdate(
    { email: DEMO_CAMPUS_ADMIN.email },
    { email: DEMO_CAMPUS_ADMIN.email, password: campusHash, role: USER_ROLES.CAMPUS_ADMIN, teamId: team._id },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return ok({
    message: "Demo admins seeded",
    accounts: {
      superAdmin: DEMO_SUPER_ADMIN,
      campusAdmin: DEMO_CAMPUS_ADMIN,
    },
  });
}
