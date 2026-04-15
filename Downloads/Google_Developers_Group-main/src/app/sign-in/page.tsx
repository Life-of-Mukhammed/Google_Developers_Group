"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { parseApiJson, setAuth } from "@/lib/client-auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [becomeLeader, setBecomeLeader] = useState(false);
  const [requestedTeamName, setRequestedTeamName] = useState("");
  const [university, setUniversity] = useState("");
  const [region, setRegion] = useState("");
  const [leaderDescription, setLeaderDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "signup") {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phoneNumber,
          newPassword: password,
          confirmPassword,
          becomeLeader,
          requestedTeamName,
          university,
          region,
          description: leaderDescription,
        }),
      });
      const json = await parseApiJson(response);
      if (!response.ok || !json.success) {
        setLoading(false);
        setMessage(json.message ?? "Signup failed");
        return;
      }

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginJson = await parseApiJson<{
        token: string;
        user: { role?: string };
      }>(loginResponse);
      setLoading(false);
      if (!loginResponse.ok || !loginJson.success) {
        setMessage("Account created. Please sign in manually.");
        setMode("signin");
        return;
      }
      setAuth(loginJson.data.token, loginJson.data.user);
      setMessage("Account created. User boardga o'tkazilyapti...");
      router.push("/");
      return;
    }

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await parseApiJson<{
      token: string;
      user: { role: string };
    }>(response);
    setLoading(false);
    if (!response.ok || !json.success) {
      setMessage(json.message ?? "Sign in failed");
      return;
    }
    setAuth(json.data.token, json.data.user);
    if (json.data.user.role === "SUPER_ADMIN" || json.data.user.role === "CAMPUS_ADMIN") {
      router.push("/admin");
      return;
    }
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-fuchsia-100 to-cyan-100">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-10 md:flex-row">
        <section className="w-full rounded-3xl bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center p-8 text-white shadow-xl md:w-1/2">
          <div className="rounded-2xl bg-black/40 p-6 backdrop-blur-sm">
            <h1 className="text-3xl font-bold">Campus Leaders</h1>
            <p className="mt-2 text-sm text-white/90">Bir platformada teams, leaders, events va news boshqaruvi.</p>
          </div>
        </section>
        <form onSubmit={onSubmit} className="w-full rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl md:w-1/2">
          <div className="mb-4 grid grid-cols-2 rounded-xl bg-indigo-50 p-1 text-sm">
            <button type="button" onClick={() => setMode("signin")} className={`rounded-lg py-2 ${mode === "signin" ? "bg-white font-semibold text-indigo-700 shadow" : "text-gray-600"}`}>
              Sign In
            </button>
            <button type="button" onClick={() => setMode("signup")} className={`rounded-lg py-2 ${mode === "signup" ? "bg-white font-semibold text-indigo-700 shadow" : "text-gray-600"}`}>
              Sign Up
            </button>
          </div>
          <input className="mb-3 w-full rounded-md border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {mode === "signup" ? (
            <input
              className="mb-3 w-full rounded-md border px-3 py-2"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          ) : null}
          {mode === "signup" ? (
            <label className="mb-3 flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-3 text-sm text-slate-700">
              <input type="checkbox" checked={becomeLeader} onChange={(event) => setBecomeLeader(event.target.checked)} />
              Request campus leader role
            </label>
          ) : null}
          {mode === "signup" && becomeLeader ? (
            <>
              <input
                className="mb-3 w-full rounded-md border px-3 py-2"
                placeholder="Requested campus team name"
                value={requestedTeamName}
                onChange={(e) => setRequestedTeamName(e.target.value)}
              />
              <input className="mb-3 w-full rounded-md border px-3 py-2" placeholder="University" value={university} onChange={(e) => setUniversity(e.target.value)} />
              <input className="mb-3 w-full rounded-md border px-3 py-2" placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} />
              <textarea
                className="mb-3 min-h-24 w-full rounded-md border px-3 py-2"
                placeholder="Why do you want to become campus leader?"
                value={leaderDescription}
                onChange={(e) => setLeaderDescription(e.target.value)}
              />
            </>
          ) : null}
          <input
            className="mb-3 w-full rounded-md border px-3 py-2"
            placeholder={mode === "signup" ? "New Password" : "Password"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {mode === "signup" ? (
            <input
              className="mb-3 w-full rounded-md border px-3 py-2"
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          ) : null}
          <button disabled={loading} className="w-full rounded-md bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 font-semibold text-white disabled:opacity-60">
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
          {message ? <p className="mt-3 text-sm text-indigo-700">{message}</p> : null}
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
