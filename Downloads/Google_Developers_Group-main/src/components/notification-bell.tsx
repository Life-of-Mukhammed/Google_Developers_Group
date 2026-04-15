"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, parseApiJson } from "@/lib/client-auth";

type NotificationItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

export function NotificationBell() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      try {
        const response = await apiFetch("/api/notifications");
        const json = await parseApiJson<{
          total?: number;
          items?: NotificationItem[];
        }>(response);
        if (mounted && json.success) {
          setCount(Number(json.data?.total ?? 0));
          setItems(Array.isArray(json.data?.items) ? json.data.items : []);
        } else if (mounted) {
          setCount(0);
          setItems([]);
        }
      } catch {
        if (mounted) {
          setCount(0);
          setItems([]);
        }
      }
    };

    refresh();
    const interval = setInterval(refresh, 30000);
    const onVisibility = () => {
      if (!document.hidden) refresh();
    };

    window.addEventListener("storage", refresh);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mounted = false;
      clearInterval(interval);
      window.removeEventListener("storage", refresh);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full border border-indigo-100 bg-white p-2 text-indigo-700"
      >
        <Bell className="size-4" />
        {count > 0 ? (
          <span className="absolute -right-1 -top-1 rounded-full bg-rose-600 px-1.5 text-[10px] font-semibold text-white">{count}</span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-indigo-100 bg-white p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold text-indigo-800">Notifications</p>
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-500">
              close
            </button>
          </div>
          <div className="max-h-80 space-y-2 overflow-auto">
            {items.length === 0 ? <p className="text-sm text-gray-500">No new notifications</p> : null}
            {items.map((item) => (
              <Link key={item.id} href={item.href} className="block rounded-xl border border-indigo-50 bg-indigo-50/40 p-2">
                <p className="text-sm font-semibold text-indigo-700">{item.title}</p>
                <p className="text-xs text-gray-600">{item.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
