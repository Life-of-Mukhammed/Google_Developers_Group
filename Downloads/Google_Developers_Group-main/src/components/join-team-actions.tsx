"use client";

import Link from "next/link";
import { useState } from "react";
import { apiFetch, getCurrentUser, parseApiJson } from "@/lib/client-auth";

export function JoinTeamActions({ teamId, telegramUrl }: { teamId: string; telegramUrl?: string | null }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const user = getCurrentUser();

  async function requestJoin() {
    if (!user) {
      setMessage("Avval login qiling.");
      return;
    }
    setLoading(true);
    const response = await apiFetch("/api/join-requests", {
      method: "POST",
      body: JSON.stringify({ teamId, note: "Add to community request" }),
    });
    const json = await parseApiJson(response);
    setLoading(false);
    setMessage(json.success ? "Community request yuborildi." : json.message ?? "Xatolik yuz berdi.");
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {telegramUrl ? (
        <Link href={telegramUrl} className="inline-block rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2 font-semibold text-white">
          Join Community (Telegram)
        </Link>
      ) : null}
      <button
        type="button"
        onClick={requestJoin}
        disabled={loading}
        className="rounded-full border border-indigo-200 bg-white px-5 py-2 text-indigo-700 disabled:opacity-60"
      >
        {loading ? "Yuborilmoqda..." : "Add to Community"}
      </button>
      {message ? <p className="text-sm text-indigo-700">{message}</p> : null}
    </div>
  );
}
