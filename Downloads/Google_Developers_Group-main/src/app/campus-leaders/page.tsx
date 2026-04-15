import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db";
import { User } from "@/models/User";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatLeaderName } from "@/lib/utils";

export default async function CampusLeadersPage() {
  let leaders: Array<{
    _id: { toString: () => string };
    email: string;
    teamId?: { _id: { toString: () => string }; name?: string; university?: string; region?: string; logo?: string | null } | null;
  }> = [];

  if (hasDatabaseConfig()) {
    await connectToDatabase();
    leaders = await User.find({ role: "CAMPUS_ADMIN" }).populate("teamId", "name university region logo").select("email role teamId").lean();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-indigo-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <p className="section-kicker">Leadership Directory</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Campus Leaders</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Universitet, campus team, leader va address bitta joyda. Kerakli community&apos;ni shu sahifadan topish oson.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {leaders.map((leader) => (
            <article key={leader._id.toString()} className="rounded-[1.7rem] border border-white/80 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <div
                className="flex h-40 items-end rounded-[1.3rem] bg-slate-950 bg-cover bg-center p-4 text-white"
                style={leader.teamId?.logo ? { backgroundImage: `linear-gradient(180deg,rgba(15,23,42,0.12),rgba(15,23,42,0.62)),url(${leader.teamId.logo})` } : undefined}
              >
                <div>
                  <p className="text-xl font-black">{leader.teamId?.name ?? "Campus team pending"}</p>
                  <p className="text-sm text-slate-200">{leader.teamId?.university ?? "University not assigned"}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-lg font-bold text-slate-950">{formatLeaderName(leader.email)}</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="size-4" />
                  {leader.teamId?.region ?? "Address pending"}
                </p>
                {leader.teamId?._id ? (
                  <Link href={`/teams/${leader.teamId._id.toString()}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                    Open university page
                    <ArrowRight className="size-4" />
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
