"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  CalendarClock,
  Crown,
  Ellipsis,
  LogOut,
  MapPin,
  Newspaper,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch, clearAuth, parseApiJson, USER_KEY } from "@/lib/client-auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatLeaderName } from "@/lib/utils";

type Team = {
  _id: string;
  name: string;
  university: string;
  region: string;
  description: string;
  logo?: string | null;
  coverImage?: string | null;
  telegramUrl?: string | null;
};

type UserInfo = { role: string; teamId?: string | null; email: string };
type UserRow = { _id: string; email: string; role: string; teamId?: string | null };
type MemberRow = { _id: string; name: string; role: string; contact?: string; photo?: string | null; teamId: string };
type EventRow = { _id: string; title: string; description: string; datetime: string; location: string; image?: string | null; teamId: string };
type NewsRow = { _id: string; title: string; content: string; image?: string | null; createdAt?: string };
type LeaderRequestRow = {
  _id: string;
  status: string;
  requestedTeamName?: string;
  university?: string;
  region?: string;
  description?: string;
  userId?: { email?: string } | null;
  teamId?: { name?: string; university?: string; region?: string; logo?: string | null } | null;
};

type Analytics = Record<string, number>;

type Nav = "team" | "members" | "events" | "news" | "leader_requests" | "users";

const nav = [
  { key: "team", label: "Teams", icon: Crown },
  { key: "members", label: "Members", icon: Users },
  { key: "events", label: "Events", icon: CalendarClock },
  { key: "news", label: "News", icon: Newspaper },
  { key: "leader_requests", label: "Leader Requests", icon: ShieldCheck },
  { key: "users", label: "Users", icon: UsersRound },
] satisfies Array<{ key: Nav; label: string; icon: typeof Crown }>;

export default function AdminClientPage() {
  const router = useRouter();
  const [active, setActive] = useState<Nav>("team");
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [news, setNews] = useState<NewsRow[]>([]);
  const [leaderRequests, setLeaderRequests] = useState<LeaderRequestRow[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const userRaw = useSyncExternalStore(
    () => () => {},
    () => (typeof window === "undefined" ? "" : localStorage.getItem(USER_KEY) ?? ""),
    () => ""
  );

  const user = useMemo(() => {
    if (!userRaw) return null;
    try {
      return JSON.parse(userRaw) as UserInfo;
    } catch {
      return null;
    }
  }, [userRaw]);

  const refreshBase = useCallback(async () => {
    const [teamsResponse, usersResponse, analyticsResponse] = await Promise.all([
      apiFetch("/api/teams"),
      apiFetch("/api/users"),
      apiFetch("/api/users/analytics"),
    ]);

    const [teamsJson, usersJson, analyticsJson] = await Promise.all([
      parseApiJson<Team[]>(teamsResponse),
      parseApiJson<UserRow[]>(usersResponse),
      parseApiJson<Analytics>(analyticsResponse),
    ]);

    if (teamsJson.success) setTeams(Array.isArray(teamsJson.data) ? teamsJson.data : []);
    if (usersJson.success) setUsers(Array.isArray(usersJson.data) ? usersJson.data : []);
    if (analyticsJson.success) setAnalytics(analyticsJson.data ?? {});
  }, []);

  const refreshActive = useCallback(async () => {
    setLoading(true);
    const endpointMap: Record<Nav, string> = {
      team: "/api/teams",
      members: "/api/members",
      events: "/api/events",
      news: "/api/news",
      leader_requests: "/api/leader-requests",
      users: "/api/users",
    };

    const response = await apiFetch(endpointMap[active]);
    const json = await parseApiJson<unknown[]>(response);
    const rows = Array.isArray(json.data) ? json.data : [];

    if (active === "team") setTeams(rows as Team[]);
    if (active === "members") setMembers(rows as MemberRow[]);
    if (active === "events") setEvents(rows as EventRow[]);
    if (active === "news") setNews(rows as NewsRow[]);
    if (active === "leader_requests") setLeaderRequests(rows as LeaderRequestRow[]);
    if (active === "users") setUsers(rows as UserRow[]);

    setLoading(false);
  }, [active]);

  useEffect(() => {
    if (!user) return;
    if (user.role === "USER") {
      router.replace("/");
      return;
    }
    const timer = window.setTimeout(() => { void refreshBase(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshBase, router, user]);

  useEffect(() => {
    if (!user || user.role !== "SUPER_ADMIN") return;
    const timer = window.setTimeout(() => { void refreshActive(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshActive, user]);
  async function onLogout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    clearAuth();
    window.location.href = "/sign-in";
  }

  async function saveJson(path: string, method: "POST" | "PUT" | "PATCH" | "DELETE", payload?: Record<string, unknown>) {
    const response = await apiFetch(path, {
      method,
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const json = await parseApiJson(response);
    setMessage(json.success ? "Saved successfully" : json.message ?? "Request failed");
    await refreshBase();
    await refreshActive();
    return json.success;
  }

  const leaderMap = useMemo(() => {
    return new Map(
      users.filter((entry) => entry.role === "CAMPUS_ADMIN" && entry.teamId).map((entry) => [String(entry.teamId), formatLeaderName(entry.email)])
    );
  }, [users]);

  if (!user) {
    return <div className="min-h-screen bg-[linear-gradient(180deg,#f2f7f4_0%,#edf4ff_38%,#fff7ee_100%)] p-8">Please login first.</div>;
  }

  if (user.role !== "SUPER_ADMIN") {
    return <div className="min-h-screen bg-[linear-gradient(180deg,#f2f7f4_0%,#edf4ff_38%,#fff7ee_100%)] p-8">This workspace is for super admin.</div>;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f2f7f4_0%,#edf4ff_38%,#fff7ee_100%)]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-16 pt-3 md:px-6">
        <section className="grid gap-5 lg:grid-cols-[290px_1fr]">
          <aside className="surface-card h-fit overflow-hidden p-0">
            <div className="border-b border-slate-200/80 bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-5 text-white">
              <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-300">Super admin</p>
              <p className="mt-3 text-xl font-black">Campus Workspace</p>
              <p className="mt-2 text-sm text-slate-300">{user.email}</p>
            </div>
            <div className="p-3">
              <div className="grid gap-2">
                {nav.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActive(item.key)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                      active === item.key ? "bg-slate-950 text-white shadow-lg" : "bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="size-4.5" />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </span>
                  </button>
                ))}
              </div>
              <button type="button" onClick={onLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          </aside>

          <div className="grid gap-5">
            <section className="surface-card overflow-hidden p-0">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="p-6 md:p-8">
                  <p className="section-kicker">Workspace</p>
                  <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">{getSectionTitle(active)}</h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">{getSectionDescription(active)}</p>
                  {message ? <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{message}</div> : null}
                </div>
                <div className="border-l border-slate-200/70 bg-[linear-gradient(180deg,#fff6df,#fffefa)] p-6 md:p-8">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <MetricCard label="Communities" value={analytics.totalCommunities ?? teams.length} />
                    <MetricCard label="Campus leaders" value={analytics.totalLeaders ?? users.filter((entry) => entry.role === "CAMPUS_ADMIN").length} />
                    <MetricCard label="Team members" value={analytics.totalTeamMembers ?? members.length} />
                    <MetricCard label="Community joined" value={analytics.totalCommunityMembers ?? 0} />
                  </div>
                </div>
              </div>
            </section>

            {active === "team" ? <TeamsSection teams={teams} leaderMap={leaderMap} onSave={saveJson} /> : null}
            {active === "members" ? <MembersSection teams={teams} members={members} leaderMap={leaderMap} onSave={saveJson} loading={loading} /> : null}
            {active === "events" ? <EventsSection teams={teams} events={events} leaderMap={leaderMap} onSave={saveJson} loading={loading} /> : null}
            {active === "news" ? <NewsSection news={news} onSave={saveJson} loading={loading} /> : null}
            {active === "leader_requests" ? <LeaderRequestsSection requests={leaderRequests} onSave={saveJson} loading={loading} /> : null}
            {active === "users" ? <UsersSection analytics={analytics} users={users} teams={teams} onSave={saveJson} /> : null}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function TeamsSection({ teams, leaderMap, onSave }: { teams: Team[]; leaderMap: Map<string, string>; onSave: (path: string, method: "POST" | "PUT" | "PATCH" | "DELETE", payload?: Record<string, unknown>) => Promise<boolean> }) {
  const [editing, setEditing] = useState<Team | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <section className="grid gap-4">
      <div className="flex justify-end">
        <button type="button" onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
          <Plus className="size-4" />
          Add Team
        </button>
      </div>
      <div className="grid gap-4">
        {teams.map((team) => (
          <article key={team._id} className="surface-card p-5">
            <div className="flex items-start gap-4">
              <Avatar image={team.logo} label={team.university} size="lg" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-2xl font-black text-slate-950">{team.university}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">{team.name}</p>
                    <p className="mt-2 text-sm text-slate-600">Leader: {leaderMap.get(team._id) ?? "Not assigned"}</p>
                    <p className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                      <MapPin className="size-3.5" />
                      {team.region}
                    </p>
                  </div>
                  <ActionMenu
                    onEdit={() => setEditing(team)}
                    onDelete={() => void onSave(`/api/teams/${team._id}`, "DELETE")}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {creating ? <TeamModal title="Create team" onClose={() => setCreating(false)} onSubmit={(payload) => onSave("/api/teams", "POST", payload)} /> : null}
      {editing ? <TeamModal title="Edit team" initial={editing} onClose={() => setEditing(null)} onSubmit={(payload) => onSave(`/api/teams/${editing._id}`, "PUT", payload)} /> : null}
    </section>
  );
}

function MembersSection({ teams, members, leaderMap, onSave, loading }: { teams: Team[]; members: MemberRow[]; leaderMap: Map<string, string>; onSave: (path: string, method: "POST" | "PUT" | "PATCH" | "DELETE", payload?: Record<string, unknown>) => Promise<boolean>; loading: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<MemberRow | null>(null);
  const grouped = teams.map((team) => ({ team, members: members.filter((member) => String(member.teamId) === team._id) }));

  return (
    <section className="grid gap-4">
      {loading ? <LoadingCard /> : null}
      {grouped.map(({ team, members: teamMembers }) => (
        <article key={team._id} className="surface-card p-5">
          <button type="button" onClick={() => setExpanded((current) => (current === team._id ? null : team._id))} className="flex w-full items-start gap-4 text-left">
            <Avatar image={team.logo} label={team.name} size="lg" />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-black text-slate-950">{team.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{team.university}</p>
                  <p className="mt-2 text-sm text-slate-700">Leader: {leaderMap.get(team._id) ?? "Not assigned"}</p>
                </div>
                <ActionMenu onEdit={() => {}} onDelete={() => void onSave(`/api/teams/${team._id}`, "DELETE")} />
              </div>
            </div>
          </button>
          {expanded === team._id ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {teamMembers.map((member) => (
                <article key={member._id} className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar image={member.photo} label={member.name} size="md" />
                      <div>
                        <p className="font-bold text-slate-950">{member.name}</p>
                        <p className="text-sm text-slate-600">{member.role}</p>
                      </div>
                    </div>
                    <ActionMenu onEdit={() => setEditingMember(member)} onDelete={() => void onSave(`/api/members/${member._id}`, "DELETE")} />
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{member.contact || "No contact"}</p>
                </article>
              ))}
              <button type="button" onClick={() => setEditingMember({ _id: "", name: "", role: "", contact: "", photo: null, teamId: team._id })} className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-4 text-sm font-semibold text-slate-700">
                Add Member
              </button>
            </div>
          ) : null}
        </article>
      ))}
      {editingMember ? <MemberModal teams={teams} initial={editingMember._id ? editingMember : undefined} defaultTeamId={editingMember.teamId} onClose={() => setEditingMember(null)} onSubmit={(payload) => onSave(editingMember._id ? `/api/members/${editingMember._id}` : "/api/members", editingMember._id ? "PUT" : "POST", payload)} /> : null}
    </section>
  );
}

function EventsSection({ teams, events, leaderMap, onSave, loading }: { teams: Team[]; events: EventRow[]; leaderMap: Map<string, string>; onSave: (path: string, method: "POST" | "PUT" | "PATCH" | "DELETE", payload?: Record<string, unknown>) => Promise<boolean>; loading: boolean }) {
  const [editing, setEditing] = useState<EventRow | null>(null);
  const [nowTimestamp] = useState(() => Date.now());
  const upcoming = events.filter((event) => new Date(event.datetime).getTime() >= nowTimestamp);
  const past = events.filter((event) => new Date(event.datetime).getTime() < nowTimestamp);

  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <EventColumn title="Upcoming Events" items={upcoming} teams={teams} leaderMap={leaderMap} onCreate={() => setEditing({ _id: "", title: "", description: "", datetime: "", location: "", image: null, teamId: teams[0]?._id ?? "" })} onEdit={setEditing} onDelete={(id) => void onSave(`/api/events/${id}`, "DELETE")} loading={loading} />
      <EventColumn title="Past Events" items={past} teams={teams} leaderMap={leaderMap} onCreate={() => setEditing({ _id: "", title: "", description: "", datetime: "", location: "", image: null, teamId: teams[0]?._id ?? "" })} onEdit={setEditing} onDelete={(id) => void onSave(`/api/events/${id}`, "DELETE")} loading={loading} />
      {editing ? <EventModal teams={teams} initial={editing._id ? editing : undefined} onClose={() => setEditing(null)} onSubmit={(payload) => onSave(editing._id ? `/api/events/${editing._id}` : "/api/events", editing._id ? "PUT" : "POST", payload)} /> : null}
    </section>
  );
}

function NewsSection({ news, onSave, loading }: { news: NewsRow[]; onSave: (path: string, method: "POST" | "PUT" | "PATCH" | "DELETE", payload?: Record<string, unknown>) => Promise<boolean>; loading: boolean }) {
  const [editing, setEditing] = useState<NewsRow | null>(null);

  return (
    <section className="surface-card p-6 md:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="section-kicker">Super Admin News</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">News cards</h2>
        </div>
        <button type="button" onClick={() => setEditing({ _id: "", title: "", content: "", image: null })} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
          <Plus className="size-4" />
          Add News
        </button>
      </div>
      {loading ? <LoadingCard /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {news.map((item) => (
          <article key={item._id} className="rounded-[1.6rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-3 h-40 rounded-[1.2rem] bg-slate-100 bg-cover bg-center" style={item.image ? { backgroundImage: `url(${item.image})` } : undefined} />
                <p className="text-xl font-black text-slate-950">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.content}</p>
              </div>
              <ActionMenu onEdit={() => setEditing(item)} onDelete={() => void onSave(`/api/news/${item._id}`, "DELETE")} />
            </div>
          </article>
        ))}
      </div>
      {editing ? <NewsModal initial={editing._id ? editing : undefined} onClose={() => setEditing(null)} onSubmit={(payload) => onSave(editing._id ? `/api/news/${editing._id}` : "/api/news", editing._id ? "PUT" : "POST", payload)} /> : null}
    </section>
  );
}

function LeaderRequestsSection({ requests, onSave, loading }: { requests: LeaderRequestRow[]; onSave: (path: string, method: "POST" | "PUT" | "PATCH" | "DELETE", payload?: Record<string, unknown>) => Promise<boolean>; loading: boolean }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {loading ? <LoadingCard /> : null}
      {requests.map((item) => {
        const leaderName = formatLeaderName(item.userId?.email ?? "");
        return (
          <article key={item._id} className="surface-card p-5">
            <div className="flex items-start gap-4">
              <Avatar image={item.teamId?.logo ?? null} label={leaderName} size="lg" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-black text-slate-950">{item.university || item.teamId?.university || "University not set"}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">{leaderName}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.requestedTeamName || item.teamId?.name || "Requested leader"}</p>
                    <p className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                      <MapPin className="size-3.5" />
                      {item.region || item.teamId?.region || "Location pending"}
                    </p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.description || "No motivation added."}</p>
                {item.status === "PENDING" ? (
                  <div className="mt-5 flex gap-3">
                    <button type="button" onClick={() => void onSave(`/api/leader-requests/${item._id}`, "PATCH", { action: "APPROVE" })} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Approve</button>
                    <button type="button" onClick={() => void onSave(`/api/leader-requests/${item._id}`, "PATCH", { action: "REJECT" })} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Reject</button>
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function UsersSection({ analytics, users, teams, onSave }: { analytics: Analytics; users: UserRow[]; teams: Team[]; onSave: (path: string, method: "POST" | "PUT" | "PATCH" | "DELETE", payload?: Record<string, unknown>) => Promise<boolean> }) {
  const [creating, setCreating] = useState(false);

  return (
    <section className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-8">
        <MetricCard label="All users" value={analytics.totalUsers ?? 0} />
        <MetricCard label="Leaders" value={analytics.totalLeaders ?? 0} />
        <MetricCard label="Team members" value={analytics.totalTeamMembers ?? 0} />
        <MetricCard label="Communities" value={analytics.totalCommunities ?? 0} />
        <MetricCard label="Community joined" value={analytics.totalCommunityMembers ?? 0} />
        <MetricCard label="Super admins" value={analytics.totalSuperAdmins ?? 0} />
        <MetricCard label="New 30d" value={analytics.newUsers30d ?? 0} />
        <MetricCard label="Active sessions" value={analytics.activeSessions ?? 0} />
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
          <Plus className="size-4" />
          Create Admin
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {users.map((entry) => {
          const team = teams.find((item) => item._id === String(entry.teamId ?? ""));
          return (
            <article key={entry._id} className="surface-card p-4">
              <p className="text-lg font-bold text-slate-950">{entry.email}</p>
              <p className="mt-2 text-sm text-slate-600">{entry.role}</p>
              <p className="mt-2 text-sm text-slate-700">{team?.university ?? "No university assigned"}</p>
            </article>
          );
        })}
      </div>
      {creating ? <CreateAdminModal teams={teams} onClose={() => setCreating(false)} onSubmit={(payload) => onSave("/api/users/create-admin", "POST", payload)} /> : null}
    </section>
  );
}

function EventColumn({ title, items, teams, leaderMap, onCreate, onEdit, onDelete, loading }: { title: string; items: EventRow[]; teams: Team[]; leaderMap: Map<string, string>; onCreate: () => void; onEdit: (row: EventRow) => void; onDelete: (id: string) => void; loading: boolean }) {
  return (
    <div className="surface-card p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="section-kicker">Events</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">{title}</h2>
        </div>
        <button type="button" onClick={onCreate} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          <Plus className="size-4" />
          Create
        </button>
      </div>
      {loading ? <LoadingCard /> : null}
      <div className="grid gap-4">
        {items.map((item) => {
          const team = teams.find((entry) => entry._id === item.teamId);
          return (
            <article key={item._id} className="rounded-[1.6rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <div className="mb-4 h-44 rounded-[1.2rem] bg-slate-100 bg-cover bg-center" style={item.image ? { backgroundImage: `url(${item.image})` } : undefined} />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-black text-slate-950">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{team?.university ?? "University"}</p>
                  <p className="mt-1 text-sm text-slate-600">Leader: {leaderMap.get(item.teamId) ?? "Not assigned"}</p>
                  <p className="mt-1 text-sm text-slate-700">{item.location}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
                <ActionMenu onEdit={() => onEdit(item)} onDelete={() => onDelete(item._id)} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function TeamModal({ title, initial, onClose, onSubmit }: { title: string; initial?: Team; onClose: () => void; onSubmit: (payload: Record<string, unknown>) => Promise<boolean> }) {
  return (
    <ModalShell title={title} onClose={onClose}>
      <EntityForm
        fields={[
          { key: "name", label: "Team name", defaultValue: initial?.name ?? "" },
          { key: "university", label: "University", defaultValue: initial?.university ?? "" },
          { key: "region", label: "Location", defaultValue: initial?.region ?? "" },
          { key: "logo", label: "Logo URL", defaultValue: initial?.logo ?? "" },
          { key: "telegramUrl", label: "Telegram URL", defaultValue: initial?.telegramUrl ?? "" },
          { key: "description", label: "Description", defaultValue: initial?.description ?? "", textarea: true },
        ]}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </ModalShell>
  );
}

function MemberModal({ teams, initial, defaultTeamId, onClose, onSubmit }: { teams: Team[]; initial?: MemberRow; defaultTeamId?: string; onClose: () => void; onSubmit: (payload: Record<string, unknown>) => Promise<boolean> }) {
  return (
    <ModalShell title={initial ? "Edit member" : "Create member"} onClose={onClose}>
      <EntityForm
        fields={[
          { key: "teamId", label: "Team", defaultValue: initial?.teamId ?? defaultTeamId ?? "", select: teams.map((team) => ({ label: team.name, value: team._id })) },
          { key: "name", label: "Name and surname", defaultValue: initial?.name ?? "" },
          { key: "role", label: "Role", defaultValue: initial?.role ?? "" },
          { key: "contact", label: "Contact", defaultValue: initial?.contact ?? "" },
          { key: "photo", label: "Photo URL", defaultValue: initial?.photo ?? "" },
        ]}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </ModalShell>
  );
}

function EventModal({ teams, initial, onClose, onSubmit }: { teams: Team[]; initial?: EventRow; onClose: () => void; onSubmit: (payload: Record<string, unknown>) => Promise<boolean> }) {
  return (
    <ModalShell title={initial ? "Update event" : "Create event"} onClose={onClose}>
      <EntityForm
        fields={[
          { key: "teamId", label: "Team", defaultValue: initial?.teamId ?? teams[0]?._id ?? "", select: teams.map((team) => ({ label: team.name, value: team._id })) },
          { key: "title", label: "Event title", defaultValue: initial?.title ?? "" },
          { key: "location", label: "Location", defaultValue: initial?.location ?? "" },
          { key: "datetime", label: "Date and time", defaultValue: initial?.datetime ? String(initial.datetime).slice(0, 16) : "", type: "datetime-local" },
          { key: "image", label: "Event photo URL", defaultValue: initial?.image ?? "" },
          { key: "description", label: "About event", defaultValue: initial?.description ?? "", textarea: true },
        ]}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </ModalShell>
  );
}

function NewsModal({ initial, onClose, onSubmit }: { initial?: NewsRow; onClose: () => void; onSubmit: (payload: Record<string, unknown>) => Promise<boolean> }) {
  return (
    <ModalShell title={initial ? "Update news" : "Add news"} onClose={onClose}>
      <EntityForm
        fields={[
          { key: "title", label: "News title", defaultValue: initial?.title ?? "" },
          { key: "image", label: "Photo URL", defaultValue: initial?.image ?? "" },
          { key: "content", label: "Content", defaultValue: initial?.content ?? "", textarea: true },
        ]}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </ModalShell>
  );
}

function CreateAdminModal({ teams, onClose, onSubmit }: { teams: Team[]; onClose: () => void; onSubmit: (payload: Record<string, unknown>) => Promise<boolean> }) {
  return (
    <ModalShell title="Create campus admin" onClose={onClose}>
      <EntityForm
        fields={[
          { key: "email", label: "Email", defaultValue: "" },
          { key: "password", label: "Password", defaultValue: "" },
          { key: "teamId", label: "Team", defaultValue: teams[0]?._id ?? "", select: teams.map((team) => ({ label: team.name, value: team._id })) },
        ]}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </ModalShell>
  );
}

function EntityForm({ fields, onClose, onSubmit }: { fields: Array<{ key: string; label: string; defaultValue: string; textarea?: boolean; select?: Array<{ label: string; value: string }>; type?: string }>; onClose: () => void; onSubmit: (payload: Record<string, unknown>) => Promise<boolean> }) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const success = await onSubmit(payload);
    if (success) onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      {fields.map((field) =>
        field.select ? (
          <select key={field.key} name={field.key} defaultValue={field.defaultValue} className="admin-input">
            {field.select.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : field.textarea ? (
          <textarea key={field.key} name={field.key} defaultValue={field.defaultValue} placeholder={field.label} className="admin-input min-h-28 resize-y" />
        ) : (
          <input key={field.key} name={field.key} defaultValue={field.defaultValue} placeholder={field.label} type={field.type ?? "text"} className="admin-input" />
        )
      )}
      <div className="mt-2 flex gap-3">
        <button type="submit" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Save</button>
        <button type="button" onClick={onClose} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700">Cancel</button>
      </div>
    </form>
  );
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-2xl font-black text-slate-950">{title}</h3>
          <button type="button" onClick={onClose} className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ActionMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <details className="relative">
      <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">
        <Ellipsis className="size-4" />
      </summary>
      <div className="absolute right-0 z-10 mt-2 w-36 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
        <button type="button" onClick={onEdit} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
          <Pencil className="size-4" />
          Edit
        </button>
        <button type="button" onClick={onDelete} className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">
          <Trash2 className="size-4" />
          Delete
        </button>
      </div>
    </details>
  );
}

function Avatar({ image, label, size }: { image?: string | null; label: string; size: "md" | "lg" }) {
  const classes = size === "lg" ? "size-18 rounded-[1.4rem] text-2xl" : "size-12 rounded-2xl text-sm";
  return (
    <div className={`flex shrink-0 items-center justify-center bg-slate-950 bg-cover bg-center font-black text-white ${classes}`} style={image ? { backgroundImage: `url(${image})` } : undefined}>
      {image ? "" : label.slice(0, 1).toUpperCase()}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <p className="text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{label}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone = status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : status === "REJECTED" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}

function LoadingCard() {
  return <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 text-sm text-slate-500">Loading...</div>;
}

function getSectionTitle(active: Nav) {
  if (active === "team") return "Teams";
  if (active === "members") return "Members";
  if (active === "events") return "Events";
  if (active === "news") return "News";
  if (active === "leader_requests") return "Leader Requests";
  return "Users & Analytics";
}

function getSectionDescription(active: Nav) {
  if (active === "team") return "Universitet logosi, leader, location va 3 nuqta action bilan team cardlari.";
  if (active === "members") return "Team card ustiga bossangiz ichidagi member cardlar ochiladi. Har bir memberda edit va delete bor.";
  if (active === "events") return "Upcoming va past eventlar alohida. Har kartada university, leader, location va event photo ko&apos;rinadi.";
  if (active === "news") return "News faqat super admin qo&apos;shadi. Add News tugmasi modal ochadi.";
  if (active === "leader_requests") return "Leader requestlarda university, leader name va nega leader bo&apos;lishi kerakligi card ichida ko&apos;rinadi.";
  return "Leaders, team members, communities va umumiy analytics shu bo&apos;limda jamlangan.";
}
