"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { LockKeyhole, Users2 } from "lucide-react";
import { apiFetch, getCurrentUser, parseApiJson } from "@/lib/client-auth";

type AccessResponse = {
  hasCommunityAccess: boolean;
  hasTeamAccess: boolean;
  user: {
    email: string;
    role: string;
    teamId: string | null;
  };
};

export function CommunityAccessGate({
  children,
  teamId,
  title = "Community access required",
  description = "News va eventlarni ko&apos;rish uchun avval community&apos;ga qo&apos;shiling.",
}: {
  children: ReactNode;
  teamId?: string;
  title?: string;
  description?: string;
}) {
  const [status, setStatus] = useState<"loading" | "allowed" | "blocked">("loading");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      const timer = window.setTimeout(() => setStatus("blocked"), 0);
      return () => window.clearTimeout(timer);
    }

    let cancelled = false;

    const run = async () => {
      const query = teamId ? `?teamId=${encodeURIComponent(teamId)}` : "";
      const response = await apiFetch(`/api/community/access${query}`);
      const json = await parseApiJson<AccessResponse>(response);

      if (cancelled) return;
      if (!json.success || !json.data) {
        setStatus("blocked");
        return;
      }

      const nextAllowed = teamId ? json.data.hasTeamAccess : json.data.hasCommunityAccess;
      setStatus(nextAllowed ? "allowed" : "blocked");
    };

    run().catch(() => {
      if (!cancelled) setStatus("blocked");
    });

    return () => {
      cancelled = true;
    };
  }, [teamId]);

  if (status === "loading") {
    return (
      <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 text-sm text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        Access tekshirilmoqda...
      </div>
    );
  }

  if (status === "blocked") {
    return (
      <div className="rounded-[1.75rem] border border-amber-200/80 bg-[linear-gradient(135deg,#fff9e8,#fff3c6)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <LockKeyhole className="size-5" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-slate-950">{title}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">{description}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/teams" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white">
                <Users2 className="size-4" />
                Join Community
              </Link>
              <Link href="/sign-in" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
