"use client";

import { FormEvent, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { apiFetch, USER_KEY, getCurrentUser, parseApiJson } from "@/lib/client-auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type Team = { _id: string; name: string; university: string };

export default function ProfilePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [message, setMessage] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const userRaw = useSyncExternalStore(
    () => () => {},
    () => (typeof window === "undefined" ? "" : localStorage.getItem(USER_KEY) ?? ""),
    () => ""
  );
  const user = useMemo(() => {
    if (!userRaw) return null;
    try {
      return JSON.parse(userRaw) as { email?: string };
    } catch {
      return null;
    }
  }, [userRaw]);

  useEffect(() => {
    fetch("/api/teams")
      .then(async (response) => parseApiJson<Team[]>(response))
      .then((json) => {
        if (json.success) {
          setTeams(Array.isArray(json.data) ? json.data : []);
        }
      });
  }, []);

  useEffect(() => {
    apiFetch("/api/users/me")
      .then(async (response) => parseApiJson<{ phoneNumber?: string }>(response))
      .then((json) => {
        if (json.success) {
          setProfilePhone(String(json.data?.phoneNumber ?? ""));
        }
      });
  }, []);

  async function requestLeader(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await apiFetch("/api/leader-requests", {
      method: "POST",
      body: JSON.stringify({
        teamId: form.get("teamId") || null,
        requestedTeamName: form.get("requestedTeamName"),
        university: form.get("university"),
        region: form.get("region"),
        description: form.get("description"),
      }),
    });
    const json = await parseApiJson(response);
    setMessage(json.success ? "Leader request yuborildi." : json.message ?? "Xatolik yuz berdi");
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setMessage("Parollar mos emas");
      return;
    }
    const response = await apiFetch("/api/users/me", {
      method: "PUT",
      body: JSON.stringify({
        phoneNumber: profilePhone,
        newPassword: newPassword || undefined,
      }),
    });
    const json = await parseApiJson<{ phoneNumber?: string }>(response);
    setMessage(json.success ? "Profil yangilandi" : json.message ?? "Xatolik yuz berdi");
    if (json.success) {
      const current = getCurrentUser();
      const nextUser = {
        ...(current ?? {}),
        phoneNumber: json.data?.phoneNumber ?? profilePhone,
      };
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      window.dispatchEvent(new CustomEvent("auth-changed"));
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-2xl border border-white/80 bg-white/90 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-indigo-700">Profile</h1>
          <p className="text-sm text-gray-600">{user?.email ?? "Guest"}</p>
          <form onSubmit={saveProfile} className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              className="rounded-md border px-3 py-2"
              placeholder="Phone number"
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
            />
            <div />
            <input
              className="rounded-md border px-3 py-2"
              type="password"
              placeholder="New password (optional)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              className="rounded-md border px-3 py-2"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="rounded-md bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 text-white md:col-span-2">
              Save Profile Settings
            </button>
          </form>
        </div>

        <form onSubmit={requestLeader} className="mt-4 rounded-2xl border border-white/80 bg-white/90 p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">Become Campus Leader Request</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <select name="teamId" className="rounded-md border px-3 py-2">
              <option value="">Existing team tanlang (ixtiyoriy)</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name} - {team.university}
                </option>
              ))}
            </select>
            <input name="requestedTeamName" placeholder="Yangi team nomi" className="rounded-md border px-3 py-2" />
            <input name="university" placeholder="University" className="rounded-md border px-3 py-2" />
            <input name="region" placeholder="Region" className="rounded-md border px-3 py-2" />
            <textarea name="description" placeholder="Nega leader bo'lmoqchisiz?" className="md:col-span-2 rounded-md border px-3 py-2" />
          </div>
          <button className="mt-4 rounded-md bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 text-white">Send Request</button>
          {message ? <p className="mt-3 text-sm text-indigo-700">{message}</p> : null}
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
