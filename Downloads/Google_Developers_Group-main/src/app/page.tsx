import Link from "next/link";
import { ArrowRight, CalendarDays, Crown, MapPin, Newspaper, Users2 } from "lucide-react";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db";
import { CampusTeam } from "@/models/CampusTeam";
import { Event } from "@/models/Event";
import { News } from "@/models/News";
import { User } from "@/models/User";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatLeaderName } from "@/lib/utils";

type TeamCard = {
  _id: { toString: () => string };
  name: string;
  university: string;
  region: string;
  description?: string;
  logo?: string | null;
  telegramUrl?: string | null;
};

type EventCard = {
  _id: { toString: () => string };
  title: string;
  datetime: string | Date;
  location: string;
  image?: string | null;
  teamId?: { name?: string } | null;
};

type NewsCard = {
  _id: { toString: () => string };
  title: string;
  content: string;
  image?: string | null;
};

type LeaderCard = {
  _id: { toString: () => string };
  email: string;
  teamId?: {
    _id: { toString: () => string };
    name?: string;
    university?: string;
    region?: string;
    logo?: string | null;
  } | null;
};

export default async function Home() {
  let teams: TeamCard[] = [];
  let events: EventCard[] = [];
  let news: NewsCard[] = [];
  let leaders: LeaderCard[] = [];
  const dbReady = hasDatabaseConfig();

  if (dbReady) {
    await connectToDatabase();
    [teams, events, news, leaders] = await Promise.all([
      CampusTeam.find().sort({ createdAt: -1 }).limit(6).lean(),
      Event.find().populate("teamId", "name").sort({ datetime: 1 }).limit(4).lean(),
      News.find().sort({ createdAt: -1 }).limit(3).lean(),
      User.find({ role: "CAMPUS_ADMIN" }).populate("teamId", "name university region logo").select("email teamId").limit(6).lean(),
    ]);
  }

  const metrics = [
    { label: "Campus communities", value: dbReady ? String(teams.length).padStart(2, "0") : "06" },
    { label: "Campus leaders", value: dbReady ? String(leaders.length).padStart(2, "0") : "06" },
    { label: "Upcoming events", value: dbReady ? String(events.length).padStart(2, "0") : "04" },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f2f7f4_0%,#eef6ff_38%,#fff7ee_100%)]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-6 md:px-6">
        <section className="relative overflow-hidden rounded-[2.2rem] border border-white/60 bg-[#0f172a] px-6 py-8 text-white shadow-[0_40px_120px_rgba(15,23,42,0.28)] md:px-10 md:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.25),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(59,130,246,0.24),transparent_24%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.9))]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-200">
                Google Developers Group Campus Platform
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] text-white md:text-6xl">
                Students join communities. Leaders grow campuses. Super admins approve the next wave.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
                Bosh sahifa endi oddiy welcome block emas. Bu yerda platforma nima qilishini, campus leaderlar kimligini va qaysi universitetlarda community borligini bir qarashda ko&apos;rish mumkin.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/teams" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
                  Join Community
                  <ArrowRight className="size-4" />
                </Link>
                <Link href="/campus-leaders" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
                  View Campus Leaders
                </Link>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
                    <p className="text-3xl font-black tracking-tight text-white">{metric.value}</p>
                    <p className="mt-1 text-sm text-slate-300">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))] p-5">
                <p className="text-[11px] uppercase tracking-[0.26em] text-sky-200">Community Flow</p>
                <div className="mt-4 grid gap-3">
                  {["Add to community", "Access news and events", "Open university page", "Follow campus updates"].map((step, index) => (
                    <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">{index + 1}</span>
                      <span className="text-sm font-semibold text-white">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.26em] text-emerald-200">Quick Access</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">Community&apos;ga qo&apos;shilishni boshlash uchun universities bo&apos;limiga kiring va kerakli campus sahifasini oching.</p>
                <Link href="/teams" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
                  Add to Community
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {!dbReady ? (
          <section className="surface-card border-amber-300/60 bg-[linear-gradient(135deg,#fff8df,#fff1bf)] p-5 text-sm text-amber-950">
            Database hali to&apos;liq ulanmagan. `MONGODB_URI` mavjud bo&apos;lsa leaders, universities, news va eventlar avtomatik ko&apos;rinadi.
          </section>
        ) : null}

        <section className="surface-card p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-kicker">Campus Leaders</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Ro&apos;yxatdagi leaderlarimiz</h2>
              </div>
              <Link href="/campus-leaders" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                All leaders
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-4">
              {leaders.length ? (
                leaders.map((leader) => (
                  <article key={leader._id.toString()} className="rounded-[1.7rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex size-20 shrink-0 items-center justify-center rounded-[1.4rem] bg-slate-950 bg-cover bg-center text-2xl font-black text-white"
                        style={leader.teamId?.logo ? { backgroundImage: `url(${leader.teamId.logo})` } : undefined}
                      >
                        {leader.teamId?.logo ? "" : leader.teamId?.name?.slice(0, 1) ?? "L"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="text-2xl font-black text-slate-950">{formatLeaderName(leader.email)}</p>
                            <p className="mt-1 text-base text-slate-600">{leader.teamId?.university ?? "University not assigned"}</p>
                            <p className="mt-1 text-sm font-medium text-slate-800">{leader.teamId?.name ?? "Campus team pending"}</p>
                          </div>
                          <Link href={leader.teamId?._id ? `/teams/${leader.teamId._id.toString()}` : "/campus-leaders"} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                            Open page
                            <ArrowRight className="size-4" />
                          </Link>
                        </div>
                        <p className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                          <MapPin className="size-3.5" />
                          {leader.teamId?.region ?? "Address pending"}
                        </p>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-slate-300 px-5 py-8 text-sm text-slate-500 md:col-span-2">
                  Hozircha approved campus leaderlar yo&apos;q. Birinchi requestni yuborib leadership roster&apos;ni boshlang.
                </div>
              )}
            </div>
        </section>

        <section className="surface-card p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-kicker">Universities</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Community bor universitetlar</h2>
              </div>
              <Link href="/teams" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                Browse all
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {teams.map((team) => (
                <Link key={team._id.toString()} href={`/teams/${team._id.toString()}`} className="group overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white/85 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex size-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-slate-950 bg-cover bg-center text-xl font-black text-white"
                      style={team.logo ? { backgroundImage: `url(${team.logo})` } : undefined}
                    >
                      {team.logo ? "" : team.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-slate-950">{team.university}</p>
                      <p className="text-sm font-medium text-slate-700">{team.name}</p>
                      <p className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                        <MapPin className="size-3.5" />
                        {team.region}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{team.description ?? "Talabalar uchun community, collaboration va growth markazi."}</p>
                </Link>
              ))}
            </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-card p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <CalendarDays className="size-5" />
              </div>
              <div>
                <p className="section-kicker">Upcoming events</p>
                <h2 className="text-2xl font-black text-slate-950">Community ichidagi yaqin tadbirlar</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              {events.length ? (
                events.map((event) => (
                  <article key={event._id.toString()} className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold text-slate-950">{event.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{event.teamId?.name ?? "Campus event"}</p>
                      </div>
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                        {new Date(event.datetime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{event.location}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-500">Upcoming eventlar hozircha qo&apos;shilmagan.</p>
              )}
            </div>
          </div>

          <div className="surface-card p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Newspaper className="size-5" />
              </div>
              <div>
                <p className="section-kicker">Latest news</p>
                <h2 className="text-2xl font-black text-slate-950">Community yangiliklari</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              {news.length ? (
                news.map((item) => (
                  <article key={item._id.toString()} className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                    <p className="text-lg font-bold text-slate-950">{item.title}</p>
                    <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">{item.content}</p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-500">Hozircha yangiliklar qo&apos;shilmagan.</p>
              )}
            </div>
          </div>
        </section>

        <section className="surface-card bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-6 text-white md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="section-kicker text-emerald-200">Next step</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">Community&apos;ga qo&apos;shiling va campus yangiliklarini oching.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Agar student bo&apos;lsangiz kerakli universitet community&apos;siga qo&apos;shiling. Request approve bo&apos;lgach news va eventlar sizga ochiladi.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/teams" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
                <Users2 className="size-4" />
                Add to Community
              </Link>
              <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
                <Crown className="size-4" />
                Admin Workspace
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
