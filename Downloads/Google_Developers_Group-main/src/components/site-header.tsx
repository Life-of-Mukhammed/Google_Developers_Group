"use client";

import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { NotificationBell } from "@/components/notification-bell";
import { clearAuth, USER_KEY } from "@/lib/client-auth";

const navItems = [
  { href: "/news", label: "News" },
  { href: "/campus-leaders", label: "Leaders" },
  { href: "/teams", label: "Teams" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const userRaw = useSyncExternalStore(
    (onStoreChange) => {
      const onStorage = () => onStoreChange();
      const onAuthChanged = () => onStoreChange();
      window.addEventListener("storage", onStorage);
      window.addEventListener("auth-changed", onAuthChanged);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("auth-changed", onAuthChanged);
      };
    },
    () => (typeof window === "undefined" ? "" : localStorage.getItem(USER_KEY) ?? ""),
    () => ""
  );

  const user = useMemo(() => {
    if (!userRaw) return null;
    try {
      return JSON.parse(userRaw) as { email?: string; role?: string };
    } catch {
      return null;
    }
  }, [userRaw]);

  const initials = (user?.email ?? "U").slice(0, 2).toUpperCase();

  function onLogout() {
    clearAuth();
    window.location.href = "/sign-in";
  }

  return (
    <header className="sticky top-0 z-40 px-3 py-3 md:px-5">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-[1.7rem] border border-white/65 bg-white/78 px-4 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.1)] backdrop-blur-xl md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700">Campus Leaders</p>
            <p className="text-sm font-bold text-slate-900 md:text-base">Student community platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-900 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <NotificationBell />
              <details className="relative">
                <summary className="flex cursor-pointer list-none items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-2 pr-4 shadow-sm">
                  <span className="flex size-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] text-xs font-bold text-white">
                    {initials}
                  </span>
                  <span className="text-left">
                    <span className="block max-w-32 truncate text-sm font-semibold text-slate-900">{user.email}</span>
                    <span className="block text-[11px] uppercase tracking-[0.22em] text-slate-500">{user.role}</span>
                  </span>
                </summary>
                <div className="absolute right-0 mt-3 w-56 rounded-[1.3rem] border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur">
                  <Link href="/profile" className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                    Profile
                  </Link>
                  {user.role === "SUPER_ADMIN" || user.role === "CAMPUS_ADMIN" ? (
                    <Link href="/admin" className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                      Admin Panel
                    </Link>
                  ) : null}
                  <button type="button" onClick={onLogout} className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50">
                    Logout
                  </button>
                </div>
              </details>
            </>
          ) : (
            <Link href="/sign-in" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5">
              Sign In
            </Link>
          )}
        </div>

        <button type="button" onClick={() => setMenuOpen((value) => !value)} className="flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 md:hidden">
          <Menu className="size-5" />
        </button>
      </div>

      {menuOpen ? (
        <div className="mx-auto mt-3 w-full max-w-7xl rounded-[1.6rem] border border-white/65 bg-white/90 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  Profile
                </Link>
                {user.role === "SUPER_ADMIN" || user.role === "CAMPUS_ADMIN" ? (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    Admin Panel
                  </Link>
                ) : null}
              </>
            ) : (
              <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
                Sign In
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
