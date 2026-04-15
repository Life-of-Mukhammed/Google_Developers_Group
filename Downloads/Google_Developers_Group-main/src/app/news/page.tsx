import { connectToDatabase, hasDatabaseConfig } from "@/lib/db";
import { News } from "@/models/News";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CommunityAccessGate } from "@/components/community-access-gate";

export default async function NewsPage() {
  let news: Array<{ _id: { toString: () => string }; title: string; content: string; image?: string | null }> = [];
  if (hasDatabaseConfig()) {
    await connectToDatabase();
    news = await News.find().sort({ createdAt: -1 }).lean();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-fuchsia-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <p className="section-kicker">Community Feed</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">News</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Bu sahifa community memberlar uchun. News faqat super admin tomonidan qo&apos;shiladi va join request approve bo&apos;lgach ko&apos;rinadi.</p>
        </div>

        <CommunityAccessGate title="News only for community members" description="Campus community&apos;ga qo&apos;shilib, request approve bo&apos;lgach news feed ochiladi.">
          <div className="grid gap-4 md:grid-cols-2">
            {news.map((item) => (
              <article key={item._id.toString()} className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm">
                <div
                  className="mb-3 h-36 rounded-xl bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${item.image || `https://picsum.photos/seed/news-page-${item._id.toString()}/800/400`})`,
                  }}
                />
                <h2 className="font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-gray-700">{item.content}</p>
              </article>
            ))}
          </div>
        </CommunityAccessGate>
      </main>
      <SiteFooter />
    </div>
  );
}
