import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto px-4 pb-6 pt-4 md:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 rounded-[2rem] border border-white/60 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] px-6 py-7 text-white shadow-[0_30px_90px_rgba(15,23,42,0.24)] md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300">Campus Leaders Uzbekistan</p>
          <p className="mt-3 text-2xl font-black tracking-tight">Platform for leaders, teams, communities and student momentum.</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Chiroyli ko&apos;rinish, aniq ma&apos;lumot oqimi va campus adminlar uchun mantiqli boshqaruv paneli bitta joyda.
          </p>
        </div>
        <div className="grid gap-2 text-sm text-slate-300">
          <Link href="/teams" className="font-semibold text-white">
            Browse teams
          </Link>
          <Link href="/news" className="font-semibold text-white">
            Read campus news
          </Link>
          <Link href="/admin" className="font-semibold text-white">
            Open admin panel
          </Link>
        </div>
      </div>
    </footer>
  );
}
