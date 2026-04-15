import { CalendarDays, MapPin, Users2 } from "lucide-react";
import { connectToDatabase, hasDatabaseConfig } from "@/lib/db";
import { CampusTeam } from "@/models/CampusTeam";
import { Event } from "@/models/Event";
import { Member } from "@/models/Member";
import { SiteHeader } from "@/components/site-header";
import { JoinTeamActions } from "@/components/join-team-actions";
import { SiteFooter } from "@/components/site-footer";
import { CommunityAccessGate } from "@/components/community-access-gate";

type Props = { params: Promise<{ id: string }> };

export default async function TeamDetailPage({ params }: Props) {
  const { id } = await params;
  if (!hasDatabaseConfig()) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Database is not configured. Add `MONGODB_URI` in `.env.local` to view team details.
          </div>
        </main>
      </div>
    );
  }

  await connectToDatabase();
  const [team, members, events] = await Promise.all([
    CampusTeam.findById(id).lean(),
    Member.find({ teamId: id }).lean(),
    Event.find({ teamId: id }).sort({ datetime: -1 }).lean(),
  ]);

  if (!team) {
    return <div className="p-8">Team not found.</div>;
  }

  const now = new Date();
  const upcoming = events.filter((event) => new Date(event.datetime) >= now);
  const past = events.filter((event) => new Date(event.datetime) < now);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_45%,#f8fbf5_100%)]">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#0f172a] p-6 text-white shadow-[0_20px_70px_rgba(15,23,42,0.16)] md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.22),transparent_24%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.9))]" />
          <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex items-start gap-4">
                <div
                  className="flex size-20 shrink-0 items-center justify-center rounded-[1.7rem] bg-white/10 bg-cover bg-center text-2xl font-black text-white"
                  style={team.logo ? { backgroundImage: `url(${team.logo})` } : undefined}
                >
                  {team.logo ? "" : team.name.slice(0, 1)}
                </div>
                <div>
                  <p className="section-kicker text-emerald-200">University Community</p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">{team.university}</h1>
                  <p className="mt-2 text-lg font-semibold text-slate-100">{team.name}</p>
                  <p className="mt-3 flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-slate-300">
                    <MapPin className="size-4" />
                    {team.region}
                  </p>
                </div>
              </div>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-200 md:text-base">{team.description}</p>
              <JoinTeamActions teamId={team._id.toString()} telegramUrl={team.telegramUrl} />
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.6rem] border border-white/12 bg-white/8 p-5 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-200">About University</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  Bu sahifa {team.university} community sahifasi. Talabalar shu yerda community haqida ma&apos;lumot oladi, qo&apos;shiladi va campus event hamda news oqimiga kiradi.
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-white/12 bg-white/8 p-5 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.24em] text-sky-200">Access</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  Add to Community bosilgach join request yuboriladi. Request approve bo&apos;lsa upcoming events sizga ochiladi. Community news esa umumiy news sahifasida ko&apos;rinadi.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="surface-card p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Users2 className="size-5" />
            </div>
            <div>
              <p className="section-kicker">Team Members</p>
              <h2 className="text-2xl font-black text-slate-950">Community team members</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {members.length ? (
              members.map((member) => (
                <div key={member._id.toString()} className="rounded-[1.4rem] border border-slate-200/70 bg-white/85 p-4">
                  <p className="font-bold text-slate-950">{member.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{member.role}</p>
                  <p className="mt-2 text-sm text-slate-700">{member.contact || "Contact not added yet"}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 md:col-span-2">Team members hali qo&apos;shilmagan.</p>
            )}
          </div>
        </section>

        <CommunityAccessGate teamId={team._id.toString()} title="Upcoming events are for joined community members" description="Community&apos;ga qo&apos;shilib, request approve bo&apos;lgach eventlar sizga ochiladi.">
          <section className="grid gap-4 md:grid-cols-2">
            <div className="surface-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <CalendarDays className="size-5" />
                </div>
                <div>
                  <p className="section-kicker">Upcoming Events</p>
                  <h2 className="text-2xl font-black text-slate-950">Upcoming events</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {upcoming.length ? (
                  upcoming.map((event) => (
                    <div key={event._id.toString()} className="rounded-[1.4rem] border border-slate-200/70 bg-white/90 p-4">
                      <p className="font-bold text-slate-950">{event.title}</p>
                      <p className="mt-2 text-sm text-slate-600">{new Date(event.datetime).toLocaleString()}</p>
                      <p className="mt-2 text-sm text-slate-700">{event.location}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{event.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Upcoming eventlar hozircha yo&apos;q.</p>
                )}
              </div>
            </div>

            <div className="surface-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <CalendarDays className="size-5" />
                </div>
                <div>
                  <p className="section-kicker">Past Events</p>
                  <h2 className="text-2xl font-black text-slate-950">Past events</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {past.length ? (
                  past.map((event) => (
                    <div key={event._id.toString()} className="rounded-[1.4rem] border border-slate-200/70 bg-white/90 p-4">
                      <p className="font-bold text-slate-950">{event.title}</p>
                      <p className="mt-2 text-sm text-slate-600">{new Date(event.datetime).toLocaleString()}</p>
                      <p className="mt-2 text-sm text-slate-700">{event.location}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{event.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Past eventlar hozircha yo&apos;q.</p>
                )}
              </div>
            </div>
          </section>

        </CommunityAccessGate>
      </main>
      <SiteFooter />
    </div>
  );
}
