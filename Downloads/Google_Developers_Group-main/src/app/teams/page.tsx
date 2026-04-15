import Link from "next/link";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db";
import { CampusTeam } from "@/models/CampusTeam";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Props = {
  searchParams: Promise<{ region?: string; search?: string }>;
};

export default async function TeamsPage({ searchParams }: Props) {
  const params = await searchParams;
  const dbReady = hasDatabaseConfig();
  let teams: Array<{ _id: { toString: () => string }; name: string; university: string; description: string }> = [];
  let regions: string[] = [];

  if (dbReady) {
    await connectToDatabase();
    const query: Record<string, unknown> = {};
    if (params.region) query.region = params.region;
    if (params.search) query.name = { $regex: params.search, $options: "i" };
    teams = await CampusTeam.find(query).sort({ createdAt: -1 }).lean();
    regions = await CampusTeam.distinct("region");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-indigo-50 to-fuchsia-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {!dbReady ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Database is not configured. Add `MONGODB_URI` in `.env.local` to view teams.
          </div>
        ) : null}
        <form className="mb-6 grid gap-3 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-md md:grid-cols-3">
          <input
            name="search"
            placeholder="Search by team name"
            className="rounded-md border border-indigo-200 px-3 py-2"
            defaultValue={params.search ?? ""}
          />
          <select name="region" className="rounded-md border border-fuchsia-200 px-3 py-2" defaultValue={params.region ?? ""}>
            <option value="">All regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <button className="rounded-md bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 font-semibold text-white">Apply</button>
        </form>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link
              key={team._id.toString()}
              href={`/teams/${team._id.toString()}`}
              className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-md transition hover:-translate-y-0.5"
            >
              <div
                className="mb-3 h-28 rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url(https://picsum.photos/seed/list-${team._id.toString()}/600/300)` }}
              />
              <p className="font-semibold">{team.name}</p>
              <p className="text-sm text-gray-600">{team.university}</p>
              <p className="mt-2 text-sm text-gray-700">{team.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
